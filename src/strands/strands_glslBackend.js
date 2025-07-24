import { NodeType, OpCodeToSymbol, BlockType, OpCode } from "./ir_types";
import { getNodeDataFromID, extractNodeTypeInfo } from "./ir_dag";
import * as FES from './strands_FES'

const TypeNames = {
  'float1': 'float',
  'float2': 'vec2',
  'float3': 'vec3',
  'float4': 'vec4',

  'int1':   'int',
  'int2':   'ivec2',
  'int3':   'ivec3',
  'int4':   'ivec4',

  'bool1':  'bool',
  'bool2':  'bvec2',
  'bool3':  'bvec3',
  'bool4':  'bvec4',

  'mat2':   'mat2x2',
  'mat3':   'mat3x3',
  'mat4':   'mat4x4',
}

const cfgHandlers = {
  [BlockType.DEFAULT]: (blockID, strandsContext, generationContext) => {
    // const { dag, cfg } = strandsContext;
    
    // const blockInstructions = new Set(cfg.blockInstructions[blockID] || []);
    // for (let nodeID of generationContext.dagSorted) {
    //   if (!blockInstructions.has(nodeID)) {
    //     continue; 
    //   }
      // const snippet = glslBackend.generateExpression(dag, nodeID, generationContext);
      // generationContext.write(snippet);
    // }
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
    return TypeNames[baseType + dimension]
  },

  generateDeclaration(generationContext, dag, nodeID) {
    const expr = this.generateExpression(generationContext, dag, nodeID);
    const tmp = `T${generationContext.nextTempID++}`;
    generationContext.tempNames[nodeID] = tmp;
    
    const T = extractNodeTypeInfo(dag, nodeID);
    const typeName = this.getTypeName(T.baseType, T.dimension);
    return `${typeName} ${tmp} = ${expr};`;
  },

  generateReturn(generationContext, dag, nodeID) {

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
          console.log("AARK")
          return this.generateExpression(generationContext, dag, node.dependsOn[0]);
        }
        const T = this.getTypeName(node.baseType, node.dimension);
        const deps = node.dependsOn.map((dep) => this.generateExpression(generationContext, dag, dep));
        return `${T}(${deps.join(', ')})`;
      } 
      if (node.opCode === OpCode.Nary.FUNCTION) {
        return "functioncall!";
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
      if (node.dependsOn.length === 1) {
        const [i] = node.dependsOn;
        const val  = this.generateExpression(generationContext, dag, i);
        const sym  = OpCodeToSymbol[node.opCode];
        return `${sym}${val}`;
      }

      default:
      FES.internalError(`${node.nodeType} not working yet`)
    }
  },

  generateBlock(blockID, strandsContext, generationContext) {
    const type = strandsContext.cfg.blockTypes[blockID];
    const handler = cfgHandlers[type] || cfgHandlers[BlockType.DEFAULT];
    handler.call(cfgHandlers, blockID, strandsContext, generationContext);
  }
}
