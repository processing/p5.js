import { sortCFG } from "./ir_cfg";
import { structType, TypeInfoFromGLSLName } from './ir_types';

export function generateShaderCode(strandsContext) {
  const {
    cfg,
    backend,
    vertexDeclarations,
    fragmentDeclarations
  } = strandsContext;

  const hooksObj = {
    uniforms: {},
  };

  for (const {name, typeInfo, defaultValue} of strandsContext.uniforms) {
    const declaration = backend.generateUniformDeclaration(name, typeInfo);
    hooksObj.uniforms[declaration] = defaultValue;
  }

  for (const { hookType, rootNodeID, entryBlockID } of strandsContext.hooks) {
    const generationContext = {
      indent: 1,
      codeLines: [],
      write(line) {
        this.codeLines.push('  '.repeat(this.indent) + line);
      },
      tempNames: {},
      declarations: [],
      nextTempID: 0,
    };

    const blocks = sortCFG(cfg.outgoingEdges, entryBlockID);
    for (const blockID of blocks) {
      backend.generateBlock(blockID, strandsContext, generationContext);
    }

    const firstLine = backend.hookEntry(hookType);
    let returnType = hookType.returnType.properties
      ? structType(hookType.returnType)
      : TypeInfoFromGLSLName[hookType.returnType.typeName];
    backend.generateReturnStatement(strandsContext, generationContext, rootNodeID, returnType);
    hooksObj[`${hookType.returnType.typeName} ${hookType.name}`] = [firstLine, ...generationContext.codeLines, '}'].join('\n');
    console.log(hooksObj[`${hookType.returnType.typeName} ${hookType.name}`]);
  }

  hooksObj.vertexDeclarations = [...vertexDeclarations].join('\n');
  hooksObj.fragmentDeclarations = [...fragmentDeclarations].join('\n');

  return hooksObj;
}
