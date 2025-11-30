import { TypeInfoFromGLSLName } from '../strands/ir_types';

/**
 * Shared utility function for parsing shader hook types from GLSL shader source
 */
export function getShaderHookTypes(shader, hookName) {
  let fullSrc = shader._vertSrc;
  let body = shader.hooks.vertex[hookName];
  if (!body) {
    body = shader.hooks.fragment[hookName];
    fullSrc = shader._fragSrc;
  }
  if (!body) {
    throw new Error(`Can't find hook ${hookName}!`);
  }
  const nameParts = hookName.split(/\s+/g);
  const functionName = nameParts.pop();
  const returnType = nameParts.pop();
  const returnQualifiers = [...nameParts];
  const parameterMatch = /\(([^\)]*)\)/.exec(body);
  if (!parameterMatch) {
    throw new Error(`Couldn't find function parameters in hook body:\n${body}`);
  }
  const structProperties = structName => {
    const structDefMatch = new RegExp(`struct\\s+${structName}\\s*\{([^\}]*)\}`).exec(fullSrc);
    if (!structDefMatch) return undefined;
    const properties = [];
    for (const defSrc of structDefMatch[1].split(';')) {
      // E.g. `int var1, var2;` or `MyStruct prop;`
      const parts = defSrc.trim().split(/\s+|,/g);
      const typeName = parts.shift();
      const names = [...parts];
      const typeProperties = structProperties(typeName);
      for (const name of names) {
        const dataType = TypeInfoFromGLSLName[typeName] || null;
        properties.push({
          name,
          type: {
            typeName,
            qualifiers: [],
            properties: typeProperties,
            dataType,
          }
        });
      }
    }
    return properties;
  };
  const parameters = parameterMatch[1].split(',').map(paramString => {
    // e.g. `int prop` or `in sampler2D prop` or `const float prop`
    const parts = paramString.trim().split(/\s+/g);
    const name = parts.pop();
    const typeName = parts.pop();
    const qualifiers = [...parts];
    const properties = structProperties(typeName);
    const dataType = TypeInfoFromGLSLName[typeName] || null;
    return {
      name,
      type: {
        typeName,
        qualifiers,
        properties,
        dataType,
      }
    };
  });
  const dataType = TypeInfoFromGLSLName[returnType] || null;
  return {
    name: functionName,
    returnType: {
      typeName: returnType,
      qualifiers: returnQualifiers,
      properties: structProperties(returnType),
      dataType,
    },
    parameters
  };
}