import { sortCFG } from './ir_cfg';

export function generateShaderCode(strandsContext) {
  const { cfg, dag, backend } = strandsContext;

  const hooksObj = {
    uniforms: {},
  };

  for (const {name, typeInfo, defaultValue} of strandsContext.uniforms) {
    const declaration = backend.generateUniformDeclaration(name, typeInfo);
    hooksObj.uniforms[declaration] = defaultValue;
  }
  
  for (const { hookType, entryBlockID, rootNodeID} of strandsContext.hooks) {
    // const dagSorted = sortDAG(dag.dependsOn, rootNodeID);
    const cfgSorted = sortCFG(cfg.outgoingEdges, entryBlockID);
    
    const generationContext = {
      indent: 1,
      codeLines: [],
      write(line) {
        this.codeLines.push('  '.repeat(this.indent) + line);
      },
      // dagSorted,
      tempNames: {},
      declarations: [],
      nextTempID: 0,
    };

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