import { NodeType } from './ir_types';
import { sortCFG } from './ir_cfg';
import { sortDAG } from './ir_dag';
import strands from './p5.strands';

function generateTopLevelDeclarations(strandsContext, generationContext, dagOrder) {
  const { dag, backend } = strandsContext;

  const usedCount = {};
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
  const { cfg, dag, backend } = strandsContext;

  const hooksObj = {
    uniforms: {},
  };

  for (const {name, typeInfo, defaultValue} of strandsContext.uniforms) {
    const declaration = backend.generateUniformDeclaration(name, typeInfo);
    hooksObj.uniforms[declaration] = defaultValue;
  }
  
  for (const { hookType, entryBlockID, rootNodeID, rootStruct} of strandsContext.hooks) {
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
    backend.generateReturnStatement(strandsContext, generationContext, rootNodeID);
    // generationContext.write(finalExpression);
    hooksObj[`${hookType.returnType.typeName} ${hookType.name}`] = [firstLine, ...generationContext.codeLines, '}'].join('\n');
  }
  
  return hooksObj;
}