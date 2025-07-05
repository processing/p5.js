import { dfsPostOrder, NodeType, OpCodeToSymbol, BlockType } from "./utils";
import { getNodeDataFromID } from "./DAG";
import { getBlockDataFromID } from "./CFG";

let globalTempCounter = 0;

function nodeToGLSL(dag, nodeID, hookContext) {
  const node = getNodeDataFromID(dag, nodeID);
  if (hookContext.tempName?.[nodeID]) {
    return hookContext.tempName[nodeID];
  }
  switch (node.nodeType) {
    case NodeType.LITERAL:
      return node.value.toFixed(4);

    case NodeType.VARIABLE:
      return node.identifier;

    case NodeType.OPERATION:
      const [lID, rID] = node.dependsOn;
      const left  = nodeToGLSL(dag, lID, hookContext);
      const right = nodeToGLSL(dag, rID, hookContext);
      const opSym = OpCodeToSymbol[node.opCode];
      return `(${left} ${opSym} ${right})`;

    default:
      throw new Error(`${node.nodeType} not working yet`);
  }
}

function computeDeclarations(dag, dagOrder) {
  const usedCount = {};
  for (const nodeID of dagOrder) {
    usedCount[nodeID] = (dag.usedBy[nodeID] || []).length;
  }

  const tempName = {};
  const declarations = [];

  for (const nodeID of dagOrder) {
    if (dag.nodeTypes[nodeID] !== NodeType.OPERATION) {
      continue;
    }

    if (usedCount[nodeID] > 1) {
      const tmp = `t${globalTempCounter++}`;
      tempName[nodeID] = tmp;

      const expr = nodeToGLSL(dag, nodeID, {});
      declarations.push(`float ${tmp} = ${expr};`);
    }
  }
  
  return { declarations, tempName };
}

const cfgHandlers = {
  Condition(strandsContext, hookContext) {
    const conditionID = strandsContext.blockConditions[blockID];
    const condExpr = nodeToGLSL(dag, conditionID, hookContext);
    write(`if (${condExpr}) {`)
    indent++;
    return;
  }
}

export function generateGLSL(strandsContext) {
    const hooksObj = {};
    
    for (const { hookType, entryBlockID, rootNodeID} of strandsContext.hooks) {
        const { cfg, dag } = strandsContext;
        const dagSorted = dfsPostOrder(dag.dependsOn, rootNodeID);
        const cfgSorted = dfsPostOrder(cfg.outgoingEdges, entryBlockID).reverse();

        console.log("BLOCK ORDER: ", cfgSorted.map(id => getBlockDataFromID(cfg, id)));

        const hookContext = {
          ...computeDeclarations(dag, dagSorted),
          indent: 0,
          currentBlock: cfgSorted[0]
        };

        let indent = 0;
        let nested = 1;
        let codeLines = hookContext.declarations.map((decl) => pad() + decl);
        const write = (line) => codeLines.push('  '.repeat(indent) + line);

        cfgSorted.forEach((blockID, i) => {
          const type = cfg.blockTypes[blockID];
          const nextID = cfgSorted[i + 1];
          const nextType = cfg.blockTypes[nextID];

          switch (type) {
            case BlockType.COND:
              const condID = strandsContext.blockConditions[blockID];
              const condExpr = nodeToGLSL(dag, condID, hookContext);
              write(`if (${condExpr}) {`)
              indent++;
              return;
            case BlockType.MERGE:
              indent--;
              write('MERGE');
              write('}');
              return;
            default:
              const instructions = new Set(cfg.blockInstructions[blockID] || []);
              for (let nodeID of dagSorted) {
                if (!instructions.has(nodeID)) {
                  continue;
                }
                const snippet = hookContext.tempName[nodeID]
                  ? hookContext.tempName[nodeID]
                  : nodeToGLSL(dag, nodeID, hookContext);
                write(snippet);
              }
          }
        });

        const finalExpression = `return ${nodeToGLSL(dag, rootNodeID, hookContext)};`;
        write(finalExpression);
        hooksObj[hookType.name] = codeLines.join('\n');
    }

    return hooksObj;
}