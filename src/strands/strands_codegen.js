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

  for (const { hookType, rootNodeID, entryBlockID, shaderContext } of strandsContext.hooks) {
    const generationContext = {
      indent: 1,
      codeLines: [],
      write(line) {
        this.codeLines.push('  '.repeat(this.indent) + line);
      },
      tempNames: {},
      declarations: [],
      nextTempID: 0,
      visitedNodes: new Set(),
      shaderContext, // 'vertex' or 'fragment'
      strandsContext, // For shared variable tracking
    };

    const blocks = sortCFG(cfg.outgoingEdges, entryBlockID);
    for (const blockID of blocks) {
      backend.generateBlock(blockID, strandsContext, generationContext);
    }

    // Process any unvisited global assignments to ensure side effects are generated
    for (const assignmentNodeID of strandsContext.globalAssignments) {
      if (!generationContext.visitedNodes.has(assignmentNodeID)) {
        // This assignment hasn't been visited yet, so we need to generate it
        backend.generateAssignment(generationContext, strandsContext.dag, assignmentNodeID);
        generationContext.visitedNodes.add(assignmentNodeID);
      }
    }
    
    // Reset global assignments for next hook
    strandsContext.globalAssignments = [];

    const firstLine = backend.hookEntry(hookType);
    let returnType = hookType.returnType.properties
      ? structType(hookType.returnType)
      : TypeInfoFromGLSLName[hookType.returnType.typeName];
    backend.generateReturnStatement(strandsContext, generationContext, rootNodeID, returnType);
    hooksObj[`${hookType.returnType.typeName} ${hookType.name}`] = [firstLine, ...generationContext.codeLines, '}'].join('\n');
  }

  // Finalize shared variable declarations based on usage
  if (strandsContext.sharedVariables) {
    for (const [varName, varInfo] of strandsContext.sharedVariables) {
      if (varInfo.usedInVertex && varInfo.usedInFragment) {
        // Used in both shaders - declare as varying
        vertexDeclarations.add(`OUT ${varInfo.typeInfo.fnName} ${varName};`);
        fragmentDeclarations.add(`IN ${varInfo.typeInfo.fnName} ${varName};`);
      } else if (varInfo.usedInVertex) {
        // Only used in vertex shader - declare as local variable
        vertexDeclarations.add(`${varInfo.typeInfo.fnName} ${varName};`);
      } else if (varInfo.usedInFragment) {
        // Only used in fragment shader - declare as local variable
        fragmentDeclarations.add(`${varInfo.typeInfo.fnName} ${varName};`);
      }
      // If not used anywhere, don't declare it
    }
  }

  hooksObj.vertexDeclarations = [...vertexDeclarations].join('\n');
  hooksObj.fragmentDeclarations = [...fragmentDeclarations].join('\n');

  return hooksObj;
}
