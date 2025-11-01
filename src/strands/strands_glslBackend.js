import { NodeType, OpCodeToSymbol, BlockType, OpCode, NodeTypeToName, isStructType, BaseType, StatementType } from "./ir_types";
import { getNodeDataFromID, extractNodeTypeInfo } from "./ir_dag";
import * as FES from './strands_FES'
function shouldCreateTemp(dag, nodeID) {
  const nodeType = dag.nodeTypes[nodeID];
  if (nodeType !== NodeType.OPERATION) return false;
  if (dag.baseTypes[nodeID] === BaseType.SAMPLER2D) return false;
  const uses = dag.usedBy[nodeID] || [];
  return uses.length > 1;
}
const TypeNames = {
  'float1': 'float',
  'float2': 'vec2',
  'float3': 'vec3',
  'float4': 'vec4',
  'int1': 'int',
  'int2': 'ivec2',
  'int3': 'ivec3',
  'int4': 'ivec4',
  'bool1': 'bool',
  'bool2': 'bvec2',
  'bool3': 'bvec3',
  'bool4': 'bvec4',
  'mat2': 'mat2x2',
  'mat3': 'mat3x3',
  'mat4': 'mat4x4',
}
const cfgHandlers = {
  [BlockType.DEFAULT]: (blockID, strandsContext, generationContext) => {
    const { dag, cfg } = strandsContext;
    const instructions = cfg.blockInstructions[blockID] || [];
    for (const nodeID of instructions) {
      const nodeType = dag.nodeTypes[nodeID];
      if (shouldCreateTemp(dag, nodeID)) {
        const declaration = glslBackend.generateDeclaration(generationContext, dag, nodeID);
        generationContext.write(declaration);
      }
      if (nodeType === NodeType.STATEMENT) {
        glslBackend.generateStatement(generationContext, dag, nodeID);
      }
      if (nodeType === NodeType.ASSIGNMENT) {
        glslBackend.generateAssignment(generationContext, dag, nodeID);
        generationContext.visitedNodes.add(nodeID);
      }
    }
  },
  [BlockType.BRANCH](blockID, strandsContext, generationContext) {
    const { dag, cfg } = strandsContext;
    // Find all phi nodes in this branch block and declare them
    const blockInstructions = cfg.blockInstructions[blockID] || [];
    for (const nodeID of blockInstructions) {
      const node = getNodeDataFromID(dag, nodeID);
      if (node.nodeType === NodeType.PHI) {
        // Check if the phi node's first dependency already has a temp name
        const dependsOn = node.dependsOn || [];
        if (dependsOn.length > 0) {
          const firstDependency = dependsOn[0];
          const existingTempName = generationContext.tempNames[firstDependency];
          if (existingTempName) {
            // Reuse the existing temp name instead of creating a new one
            generationContext.tempNames[nodeID] = existingTempName;
            continue; // Skip declaration, just alias to existing variable
          }
        }

        // Otherwise, create a new temp variable for the phi node
        const tmp = `T${generationContext.nextTempID++}`;
        generationContext.tempNames[nodeID] = tmp;
        const T = extractNodeTypeInfo(dag, nodeID);
        const typeName = glslBackend.getTypeName(T.baseType, T.dimension);
        generationContext.write(`${typeName} ${tmp};`);
      }
    }
    this[BlockType.DEFAULT](blockID, strandsContext, generationContext);
  },
  [BlockType.IF_COND](blockID, strandsContext, generationContext) {
    const { dag, cfg } = strandsContext;
    const conditionID = cfg.blockConditions[blockID];
    const condExpr = glslBackend.generateExpression(generationContext, dag, conditionID);
    generationContext.write(`if (${condExpr})`);
    this[BlockType.DEFAULT](blockID, strandsContext, generationContext);
  },
  [BlockType.ELSE_COND](blockID, strandsContext, generationContext) {
    generationContext.write(`else`);
    this[BlockType.DEFAULT](blockID, strandsContext, generationContext);
  },
  [BlockType.IF_BODY](blockID, strandsContext, generationContext) {
    this[BlockType.DEFAULT](blockID, strandsContext, generationContext);
    this.assignPhiNodeValues(blockID, strandsContext, generationContext);
  },
  [BlockType.SCOPE_START](blockID, strandsContext, generationContext) {
    generationContext.write(`{`);
    generationContext.indent++;
  },
  [BlockType.SCOPE_END](blockID, strandsContext, generationContext) {
    generationContext.indent--;
    generationContext.write(`}`);
  },
  [BlockType.MERGE](blockID, strandsContext, generationContext) {
    this[BlockType.DEFAULT](blockID, strandsContext, generationContext);
  },
  [BlockType.FUNCTION](blockID, strandsContext, generationContext) {
    this[BlockType.DEFAULT](blockID, strandsContext, generationContext);
  },
  [BlockType.FOR](blockID, strandsContext, generationContext) {
    const { dag, cfg } = strandsContext;
    const instructions = cfg.blockInstructions[blockID] || [];

    generationContext.write(`for (`);

    // Set flag to suppress semicolon on the last statement
    const originalSuppressSemicolon = generationContext.suppressSemicolon;

    for (let i = 0; i < instructions.length; i++) {
      const nodeID = instructions[i];
      const node = getNodeDataFromID(dag, nodeID);
      const isLast = i === instructions.length - 1;

      // Suppress semicolon on the last statement
      generationContext.suppressSemicolon = isLast;

      if (shouldCreateTemp(dag, nodeID)) {
        const declaration = glslBackend.generateDeclaration(generationContext, dag, nodeID);
        generationContext.write(declaration);
      }
      if (node.nodeType === NodeType.STATEMENT) {
        glslBackend.generateStatement(generationContext, dag, nodeID);
      }
      if (node.nodeType === NodeType.ASSIGNMENT) {
        glslBackend.generateAssignment(generationContext, dag, nodeID);
        generationContext.visitedNodes.add(nodeID);
      }
    }

    // Restore original flag
    generationContext.suppressSemicolon = originalSuppressSemicolon;

    generationContext.write(`)`);
  },
  assignPhiNodeValues(blockID, strandsContext, generationContext) {
    const { dag, cfg } = strandsContext;
    // Find all phi nodes that this block feeds into
    const successors = cfg.outgoingEdges[blockID] || [];
    for (const successorBlockID of successors) {
      const instructions = cfg.blockInstructions[successorBlockID] || [];
      for (const nodeID of instructions) {
        const node = getNodeDataFromID(dag, nodeID);
        if (node.nodeType === NodeType.PHI) {
          // Find which input of this phi node corresponds to our block
          const branchIndex = node.phiBlocks?.indexOf(blockID);
          if (branchIndex !== -1 && branchIndex < node.dependsOn.length) {
            const sourceNodeID = node.dependsOn[branchIndex];
            const tempName = generationContext.tempNames[nodeID];
            if (tempName && sourceNodeID !== null) {
              const sourceExpr = glslBackend.generateExpression(generationContext, dag, sourceNodeID);
              generationContext.write(`${tempName} = ${sourceExpr};`);
            }
          }
        }
      }
    }
  },
}
export const glslBackend = {
  hookEntry(hookType) {
    const firstLine = `(${hookType.parameters.flatMap((param) => {
      return `${param.qualifiers?.length ? param.qualifiers.join(' ') : ''}${param.type.typeName} ${param.name}`;
    }).join(', ')}) {`;
    return firstLine;
  },
  getTypeName(baseType, dimension) {
    const primitiveTypeName = TypeNames[baseType + dimension]
    if (!primitiveTypeName) {
      return baseType;
    }
    return primitiveTypeName;
  },
  generateUniformDeclaration(name, typeInfo) {
    return `${this.getTypeName(typeInfo.baseType, typeInfo.dimension)} ${name}`;
  },
  generateStatement(generationContext, dag, nodeID) {
    const node = getNodeDataFromID(dag, nodeID);
    const semicolon = generationContext.suppressSemicolon ? '' : ';';
    if (node.statementType === StatementType.DISCARD) {
      generationContext.write(`discard${semicolon}`);
    } else if (node.statementType === StatementType.BREAK) {
      generationContext.write(`break${semicolon}`);
    } else if (node.statementType === StatementType.EXPRESSION) {
      // Generate the expression followed by semicolon (unless suppressed)
      const exprNodeID = node.dependsOn[0];
      const expr = this.generateExpression(generationContext, dag, exprNodeID);
      generationContext.write(`${expr}${semicolon}`);
    } else if (node.statementType === StatementType.EMPTY) {
      // Generate just a semicolon (unless suppressed)
      generationContext.write(semicolon);
    }
  },
  generateAssignment(generationContext, dag, nodeID) {
    const node = getNodeDataFromID(dag, nodeID);
    // dependsOn[0] = targetNodeID, dependsOn[1] = sourceNodeID
    const targetNodeID = node.dependsOn[0];
    const sourceNodeID = node.dependsOn[1];
    
    // Generate the target expression (could be variable or swizzle)
    const targetExpr = this.generateExpression(generationContext, dag, targetNodeID);
    const sourceExpr = this.generateExpression(generationContext, dag, sourceNodeID);
    const semicolon = generationContext.suppressSemicolon ? '' : ';';
    
    // Generate assignment if we have both target and source
    if (targetExpr && sourceExpr && targetExpr !== sourceExpr) {
      generationContext.write(`${targetExpr} = ${sourceExpr}${semicolon}`);
    }
  },
  generateDeclaration(generationContext, dag, nodeID) {
    const expr = this.generateExpression(generationContext, dag, nodeID);
    const tmp = `T${generationContext.nextTempID++}`;
    generationContext.tempNames[nodeID] = tmp;
    const T = extractNodeTypeInfo(dag, nodeID);
    const typeName = this.getTypeName(T.baseType, T.dimension);
    return `${typeName} ${tmp} = ${expr};`;
  },
  generateReturnStatement(strandsContext, generationContext, rootNodeID, returnType) {
    const dag = strandsContext.dag;
    const rootNode = getNodeDataFromID(dag, rootNodeID);
    if (isStructType(rootNode.baseType)) {
      const structTypeInfo = returnType;
      for (let i = 0; i < structTypeInfo.properties.length; i++) {
        const prop = structTypeInfo.properties[i];
        const val = this.generateExpression(generationContext, dag, rootNode.dependsOn[i]);
        if (prop.name !== val) {
          generationContext.write(
            `${rootNode.identifier}.${prop.name} = ${val};`
          )
        }
      }
    }
    generationContext.write(`return ${this.generateExpression(generationContext, dag, rootNodeID)};`);
  },
  generateExpression(generationContext, dag, nodeID) {
    const node = getNodeDataFromID(dag, nodeID);
    if (generationContext.tempNames?.[nodeID]) {
      return generationContext.tempNames[nodeID];
    }
    switch (node.nodeType) {
      case NodeType.LITERAL:
      if (node.baseType === BaseType.FLOAT) {
        return node.value.toFixed(4);
      }
      else {
        return node.value;
      }
      case NodeType.VARIABLE:
      return node.identifier;
      case NodeType.OPERATION:
      const useParantheses = node.usedBy.length > 0;
      if (node.opCode === OpCode.Nary.CONSTRUCTOR) {
        // TODO: differentiate casts and constructors for more efficient codegen.
        // if (node.dependsOn.length === 1 && node.dimension === 1) {
        //   return this.generateExpression(generationContext, dag, node.dependsOn[0]);
        // }
        if (node.baseType === BaseType.SAMPLER2D) {
          return this.generateExpression(generationContext, dag, node.dependsOn[0]);
        }
        const T = this.getTypeName(node.baseType, node.dimension);
        const deps = node.dependsOn.map((dep) => this.generateExpression(generationContext, dag, dep));
        return `${T}(${deps.join(', ')})`;
      }
      if (node.opCode === OpCode.Nary.FUNCTION_CALL) {
        const functionArgs = node.dependsOn.map(arg =>this.generateExpression(generationContext, dag, arg));
        return `${node.identifier}(${functionArgs.join(', ')})`;
      }
      if (node.opCode === OpCode.Binary.MEMBER_ACCESS) {
        const [lID, rID] = node.dependsOn;
        const lName = this.generateExpression(generationContext, dag, lID);
        const rName = this.generateExpression(generationContext, dag, rID);
        return `${lName}.${rName}`;
      }
      if (node.opCode === OpCode.Unary.SWIZZLE) {
        const parentID = node.dependsOn[0];
        const parentExpr = this.generateExpression(generationContext, dag, parentID);
        return `${parentExpr}.${node.swizzle}`;
      }
      if (node.dependsOn.length === 2) {
        const [lID, rID] = node.dependsOn;
        const left  = this.generateExpression(generationContext, dag, lID);
        const right = this.generateExpression(generationContext, dag, rID);

        // Special case for modulo: use mod() function for floats in GLSL
        if (node.opCode === OpCode.Binary.MODULO) {
          const leftNode = getNodeDataFromID(dag, lID);
          const rightNode = getNodeDataFromID(dag, rID);
          // If either operand is float, use mod() function
          if (leftNode.baseType === BaseType.FLOAT || rightNode.baseType === BaseType.FLOAT) {
            return `mod(${left}, ${right})`;
          }
          // For integers, use % operator
          return `(${left} % ${right})`;
        }

        const opSym = OpCodeToSymbol[node.opCode];
        if (useParantheses) {
          return `(${left} ${opSym} ${right})`;
        } else {
          return `${left} ${opSym} ${right}`;
        }
      }
      if (node.opCode === OpCode.Unary.LOGICAL_NOT
        || node.opCode === OpCode.Unary.NEGATE
        || node.opCode === OpCode.Unary.PLUS
        ) {
        const [i] = node.dependsOn;
        const val  = this.generateExpression(generationContext, dag, i);
        const sym  = OpCodeToSymbol[node.opCode];
        return `${sym}${val}`;
      }
      case NodeType.PHI:
      // Phi nodes represent conditional merging of values
      // If this phi node has an identifier (like varying variables), use that
      if (node.identifier) {
        return node.identifier;
      }
      // Otherwise, they should have been declared as temporary variables
      // and assigned in the appropriate branches
      if (generationContext.tempNames?.[nodeID]) {
        return generationContext.tempNames[nodeID];
      } else {
        // If no temp was created, this phi node only has one input
        // so we can just use that directly
        const validInputs = node.dependsOn.filter(id => id !== null);
        if (validInputs.length > 0) {
          return this.generateExpression(generationContext, dag, validInputs[0]);
        } else {
          throw new Error(`No valid inputs for node`)
          // Fallback: create a default value
          const typeName = this.getTypeName(node.baseType, node.dimension);
          if (node.dimension === 1) {
            return node.baseType === BaseType.FLOAT ? '0.0' : '0';
          } else {
            return `${typeName}(0.0)`;
          }
        }
      }
      case NodeType.ASSIGNMENT:
      FES.internalError(`ASSIGNMENT nodes should not be used as expressions`)
      default:
      FES.internalError(`${NodeTypeToName[node.nodeType]} code generation not implemented yet`)
    }
  },
  generateBlock(blockID, strandsContext, generationContext) {
    const type = strandsContext.cfg.blockTypes[blockID];
    const handler = cfgHandlers[type] || cfgHandlers[BlockType.DEFAULT];
    handler.call(cfgHandlers, blockID, strandsContext, generationContext);
  }
}
