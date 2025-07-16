import { NodeType, OpCodeToSymbol, BlockType, OpCode } from "./utils";
import { getNodeDataFromID } from "./directed_acyclic_graph";
import * as FES from './strands_FES'

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
    const condExpr = glslBackend.generateExpression (dag, conditionID, generationContext);
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
  generateDataTypeName(baseType, dimension) {
    return baseType + dimension; 
  },
  generateDeclaration() {
    
  },
  generateExpression(dag, nodeID, generationContext) {
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
          return this.generateExpression(dag, node.dependsOn[0], generationContext);
        }
        const T = this.generateDataTypeName(node.baseType, node.dimension);
        const deps = node.dependsOn.map((dep) => this.generateExpression(dag, dep, generationContext));
        return `${T}(${deps.join(', ')})`;
      } 
      if (node.opCode === OpCode.Nary.FUNCTION) {
        return "functioncall!";
      }
      if (node.dependsOn.length === 2) {
        const [lID, rID] = node.dependsOn;
        const left  = this.generateExpression(dag, lID, generationContext);
        const right = this.generateExpression(dag, rID, generationContext);
        const opSym = OpCodeToSymbol[node.opCode];
        if (useParantheses) {
          return `(${left} ${opSym} ${right})`;
        } else {
          return `${left} ${opSym} ${right}`;
        }
      }
      if (node.dependsOn.length === 1) {
        const [i] = node.dependsOn;
        const val  = this.generateExpression(dag, i, generationContext);
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
