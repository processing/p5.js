import { WEBGL } from '../core/constants';
import { glslBackend } from './GLSL_backend';
import { NodeType } from './utils';
import { extractTypeInfo } from './builder';
import { sortCFG } from './control_flow_graph';
import { sortDAG } from './directed_acyclic_graph';

let globalTempCounter = 0;
let backend;

function generateTopLevelDeclarations(strandsContext, dagOrder) {
  const usedCount = {};
  const dag = strandsContext.dag;
  for (const nodeID of dagOrder) {
    usedCount[nodeID] = (dag.usedBy[nodeID] || []).length;
  }
  
  const tempNames = {};
  const declarations = [];
  for (const nodeID of dagOrder) {
    if (dag.nodeTypes[nodeID] !== NodeType.OPERATION) {
      continue;
    }
    
    if (usedCount[nodeID] > 0) {
      const expr = backend.generateExpression(dag, nodeID, { tempNames });
      const tmp = `T${globalTempCounter++}`;
      tempNames[nodeID] = tmp;
      
      const T = extractTypeInfo(strandsContext, nodeID);
      declarations.push(`${T.baseType+T.dimension} ${tmp} = ${expr};`);
    }
  }
  
  return { declarations, tempNames };
}

export function generateShaderCode(strandsContext) {
  if (strandsContext.backend === WEBGL) {
    backend = glslBackend;
  }
  const hooksObj = {};
  
  for (const { hookType, entryBlockID, rootNodeID} of strandsContext.hooks) {
    const { cfg, dag } = strandsContext;
    const dagSorted = sortDAG(dag.dependsOn, rootNodeID);
    const cfgSorted = sortCFG(cfg.outgoingEdges, entryBlockID);
    
    const generationContext = {
      ...generateTopLevelDeclarations(strandsContext, dagSorted),
      indent: 1,
      codeLines: [],
      write(line) {
        this.codeLines.push('  '.repeat(this.indent) + line);
      },
      dagSorted,
    };

    generationContext.declarations.forEach(decl => generationContext.write(decl));
    for (const blockID of cfgSorted) {
      backend.generateBlock(blockID, strandsContext, generationContext);
    }
    
    const firstLine = backend.hookEntry(hookType);
    const finalExpression = `return ${backend.generateExpression(dag, rootNodeID, generationContext)};`;
    generationContext.write(finalExpression);
    console.log(hookType);
    hooksObj[hookType.name] = [firstLine, ...generationContext.codeLines, '}'].join('\n');
  }
  
  return hooksObj;
}