import { NodeType, OpCodeToSymbol, BlockType, OpCode, NodeTypeToName, isStructType, BaseType } from "./ir_types";
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
      }
    }
  },

  [BlockType.BRANCH](blockID, strandsContext, generationContext) {
    console.log(`Processing BRANCH block ${blockID}`);
    const { dag, cfg } = strandsContext;
    
    // Find all phi nodes in this branch block and declare them
    const blockInstructions = cfg.blockInstructions[blockID] || [];
    console.log(`Instructions in branch block ${blockID}:`, blockInstructions);

    for (const nodeID of blockInstructions) {
      const node = getNodeDataFromID(dag, nodeID);
      console.log(`Checking node ${nodeID} with nodeType: ${node.nodeType}`);

      if (node.nodeType === NodeType.PHI) {
        // Create a temporary variable for this phi node
        const tmp = `T${generationContext.nextTempID++}`;
        generationContext.tempNames[nodeID] = tmp;

        console.log(`Declared phi temp variable: ${tmp} for node ${nodeID}`);

        const T = extractNodeTypeInfo(dag, nodeID);
        const typeName = glslBackend.getTypeName(T.baseType, T.dimension);

        // Declare the temporary variable
        generationContext.write(`${typeName} ${tmp};`);
      }
    }
    
    // Execute the default block handling for any remaining instructions in this block
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
    // Assign values to phi nodes that this branch feeds into
    this.assignPhiNodeValues(blockID, strandsContext, generationContext);
  },


  [BlockType.ELSE_BODY](blockID, strandsContext, generationContext) {
    this[BlockType.DEFAULT](blockID, strandsContext, generationContext);
    // Assign values to phi nodes that this branch feeds into
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
    return this[BlockType.DEFAULT](blockID, strandsContext, generationContext);
    const { dag, cfg } = strandsContext;

    // Handle phi nodes specially in merge blocks
    const instructions = cfg.blockInstructions[blockID] || [];
    for (const nodeID of instructions) {
      const node = getNodeDataFromID(dag, nodeID);

      if (node.nodeType !== NodeType.PHI) {
        debugger
        console.log(`Handling node in merge block`)
        // Handle non-phi nodes normally
        const nodeType = dag.nodeTypes[nodeID];
        if (shouldCreateTemp(dag, nodeID)) {
          const declaration = glslBackend.generateDeclaration(generationContext, dag, nodeID);
          generationContext.write(declaration);
        }
        if (nodeType === NodeType.STATEMENT) {
          glslBackend.generateStatement(generationContext, dag, nodeID);
        }
      }
    }
  },

  [BlockType.FUNCTION](blockID, strandsContext, generationContext) {
    this[BlockType.DEFAULT](blockID, strandsContext, generationContext);
  },

  assignPhiNodeValues(blockID, strandsContext, generationContext) {
    const { dag, cfg } = strandsContext;

    console.log(`assignPhiNodeValues called for blockID: ${blockID}`);

    // Find all phi nodes that this block feeds into
    const successors = cfg.outgoingEdges[blockID] || [];
    console.log(`Successors for block ${blockID}:`, successors);

    for (const successorBlockID of successors) {
      const instructions = cfg.blockInstructions[successorBlockID] || [];
      console.log(`Instructions in successor block ${successorBlockID}:`, instructions);

      for (const nodeID of instructions) {
        const node = getNodeDataFromID(dag, nodeID);
        console.log(`Checking node ${nodeID} with nodeType: ${node.nodeType}`);

        if (node.nodeType === NodeType.PHI) {
          console.log(`Found phi node ${nodeID} with phiBlocks:`, node.phiBlocks, 'dependsOn:', node.dependsOn);

          // Find which input of this phi node corresponds to our block
          // The phiBlocks array maps to the dependsOn array
          const branchIndex = node.phiBlocks?.indexOf(blockID);
          console.log(`branchIndex for block ${blockID}:`, branchIndex);

          if (branchIndex !== -1 && branchIndex < node.dependsOn.length) {
            const sourceNodeID = node.dependsOn[branchIndex];
            const tempName = generationContext.tempNames[nodeID];

            console.log(`Assigning phi node: ${tempName} = source ${sourceNodeID}`);

            if (tempName && sourceNodeID !== null) {
              const sourceExpr = glslBackend.generateExpression(generationContext, dag, sourceNodeID);
              generationContext.write(`${tempName} = ${sourceExpr};`);
            }
          }
        }
      }
    }
  },

  declarePhiNodesForConditional(blockID, strandsContext, generationContext) {
    const { dag, cfg } = strandsContext;

    console.log(`declarePhiNodesForConditional called for blockID: ${blockID}`);

    // Find all phi nodes in the merge blocks that this conditional feeds into
    const successors = cfg.outgoingEdges[blockID] || [];
    console.log(`Successors for conditional block ${blockID}:`, successors);

    for (const successorBlockID of successors) {
      const blockInstructions = cfg.blockInstructions[successorBlockID] || [];
      console.log(`Instructions in merge block ${successorBlockID}:`, blockInstructions);

      for (const nodeID of blockInstructions) {
        const node = getNodeDataFromID(dag, nodeID);
        console.log(`Checking node ${nodeID} with nodeType: ${node.nodeType}`);

        if (node.nodeType === NodeType.PHI) {
          // Create a temporary variable for this phi node
          const tmp = `T${generationContext.nextTempID++}`;
          generationContext.tempNames[nodeID] = tmp;

          console.log(`Declared phi temp variable: ${tmp} for node ${nodeID}`);

          const T = extractNodeTypeInfo(dag, nodeID);
          const typeName = glslBackend.getTypeName(T.baseType, T.dimension);

          // Declare the temporary variable
          generationContext.write(`${typeName} ${tmp};`);
        }
      }
    }
  }
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
    if (node.statementType === OpCode.ControlFlow.DISCARD) {
      generationContext.write('discard;');
    }
  },

  generateAssignment(generationContext, dag, nodeID) {
    const node = getNodeDataFromID(dag, nodeID);
    // dependsOn[0] = phiNodeID, dependsOn[1] = sourceNodeID
    const phiNodeID = node.dependsOn[0];
    const sourceNodeID = node.dependsOn[1];
    
    const phiTempName = generationContext.tempNames[phiNodeID];
    const sourceExpr = this.generateExpression(generationContext, dag, sourceNodeID);
    
    if (phiTempName && sourceExpr) {
      generationContext.write(`${phiTempName} = ${sourceExpr};`);
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
      // They should already have been declared as temporary variables
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
