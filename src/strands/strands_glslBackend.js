import { NodeType, OpCodeToSymbol, BlockType, OpCode, NodeTypeToName, isStructType, StructType } from "./ir_types";
import { getNodeDataFromID, extractNodeTypeInfo } from "./ir_dag";
import * as FES from './strands_FES'

function shouldCreateTemp(dag, nodeID) {
  const nodeType = dag.nodeTypes[nodeID];
  if (nodeType !== NodeType.OPERATION) return false;
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
        console.log("HELLO")
        glslBackend.generateStatement(generationContext, dag, nodeID);
      }
    }
  },
  
  [BlockType.IF_COND](blockID, strandsContext, generationContext) {
    const { dag, cfg } = strandsContext;
    const conditionID = cfg.blockConditions[blockID];
    const condExpr = glslBackend.generateExpression(generationContext, dag, conditionID);
    generationContext.write(`if (${condExpr}) {`)
    generationContext.indent++;
    this[BlockType.DEFAULT](blockID, strandsContext, generationContext);
    generationContext.indent--;
    generationContext.write(`}`)
    return;
  },
  
  [BlockType.IF_BODY](blockID, strandsContext, generationContext) {
    
  },
  
  [BlockType.ELIF_BODY](blockID, strandsContext, generationContext) {
    
  },
  
  [BlockType.ELSE_BODY](blockID, strandsContext, generationContext) {
    
  },
  
  [BlockType.MERGE](blockID, strandsContext, generationContext) {
    this[BlockType.DEFAULT](blockID, strandsContext, generationContext);
  },
  
  [BlockType.FUNCTION](blockID, strandsContext, generationContext) {
    this[BlockType.DEFAULT](blockID, strandsContext, generationContext);
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
    if (node.statementType === OpCode.ControlFlow.DISCARD) {
      generationContext.write('discard;');
    }
  },

  generateDeclaration(generationContext, dag, nodeID) {
    const expr = this.generateExpression(generationContext, dag, nodeID);
    const tmp = `T${generationContext.nextTempID++}`;
    console.log(expr);
    generationContext.tempNames[nodeID] = tmp;
    
    const T = extractNodeTypeInfo(dag, nodeID);
    const typeName = this.getTypeName(T.baseType, T.dimension);
    return `${typeName} ${tmp} = ${expr};`;
  },

  generateReturnStatement(strandsContext, generationContext, rootNodeID) {
    const dag = strandsContext.dag;
    const rootNode = getNodeDataFromID(dag, rootNodeID);
    if (isStructType(rootNode.baseType)) {
      const structTypeInfo = StructType[rootNode.baseType];
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
      return node.value.toFixed(4);
      
      case NodeType.VARIABLE:
      return node.identifier;
      
      case NodeType.OPERATION:
      const useParantheses = node.usedBy.length > 0;
      if (node.opCode === OpCode.Nary.CONSTRUCTOR) {
        if (node.dependsOn.length === 1 && node.dimension === 1) {
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
