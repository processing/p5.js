import { WEBGL } from '../core/constants';
import { glslBackend } from './GLSL_backend';
import { NodeType } from './utils';
import { sortCFG } from './control_flow_graph';
import { sortDAG } from './directed_acyclic_graph';

let globalTempCounter = 0;
let backend;

function generateTopLevelDeclarations(strandsContext, generationContext, dagOrder) {
  const usedCount = {};
  const dag = strandsContext.dag;
  for (const nodeID of dagOrder) {
    usedCount[nodeID] = (dag.usedBy[nodeID] || []).length;
  }
  
  const declarations = [];
  for (const nodeID of dagOrder) {
    if (dag.nodeTypes[nodeID] !== NodeType.OPERATION) {
      continue;
    }
    
    if (usedCount[nodeID] > 0) {
      const newDeclaration = backend.generateDeclaration(generationContext, dag, nodeID);
      declarations.push(newDeclaration);
    }
  }
  
  return declarations;
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
      indent: 1,
      codeLines: [],
      write(line) {
        this.codeLines.push('  '.repeat(this.indent) + line);
      },
      dagSorted,
      tempNames: {},
      declarations: [],
      nextTempID: 0,
    };
    generationContext.declarations = generateTopLevelDeclarations(strandsContext, generationContext, dagSorted);


    generationContext.declarations.forEach(decl => generationContext.write(decl));
    for (const blockID of cfgSorted) {
      backend.generateBlock(blockID, strandsContext, generationContext);
    }
    
    const firstLine = backend.hookEntry(hookType);
    const finalExpression = `return ${backend.generateExpression(generationContext, dag, rootNodeID)};`;
    generationContext.write(finalExpression);
    hooksObj[`${hookType.returnType.typeName} ${hookType.name}`] = [firstLine, ...generationContext.codeLines, '}'].join('\n');
  }
  
  return hooksObj;
}