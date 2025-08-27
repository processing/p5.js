function getEntries(entry) {
  return [
    entry,
    ...getAllEntries(entry.members?.global || []),
    ...getAllEntries(entry.members?.inner || []),
    ...getAllEntries(entry.members?.instance || []),
    ...getAllEntries(entry.members?.events || []),
    ...getAllEntries(entry.members?.static || [])
  ];
}

export function getAllEntries(arr = []) {
  return arr.flatMap(entry => entry ? getEntries(entry) : []);
}
export function normalizeClassName(className) {
  if (!className || className === 'p5') return 'p5';
  return className.startsWith('p5.') ? className : `p5.${className}`;
}

export function generateTypeDefinitions(data) {
  const organized = organizeData(data);

  return {
    p5Types: generateP5TypeDefinitions(organized),
    globalTypes: generateGlobalTypeDefinitions(organized),
    fileTypes: generateFileTypeDefinitions(organized, data)
  };
}
function generateP5TypeDefinitions(organizedData) {
  let output = '// This file is auto-generated from JSDoc documentation\n\n';

  output += 'declare class p5 {\n';
  output += '  constructor(sketch?: (p: p5) => void, node?: HTMLElement, sync?: boolean);\n\n';
  const instanceItems = organizedData.classitems.filter(item =>
    item.class === 'p5' && !item.isStatic
  );
  instanceItems.forEach(item => {
    output += generateMethodDeclarations(item, false);
  });

  const staticItems = organizedData.classitems.filter(item =>
    item.class === 'p5' && item.isStatic
  );
  staticItems.forEach(item => {
    output += generateMethodDeclarations(item, true);
  });

  Object.values(organizedData.consts).forEach(constData => {
    if (constData.class === 'p5') {
      if (constData.description) {
        output += `  /**\n   * ${constData.description}\n   */\n`;
      }
      if (constData.kind === 'constant') {
        output += `  readonly ${constData.name.toUpperCase()}: ${constData.type};\n\n`;
      } else {
        output += `  static ${constData.name}: ${constData.type};\n\n`;
      }
    }
  });

  output += '}\n\n';

  output += 'declare namespace p5 {\n';

  Object.values(organizedData.consts).forEach(constData => {
    if (constData.kind === 'typedef') {
      if (constData.description) {
        output += `  /**\n   * ${constData.description}\n   */\n`;
      }
      output += `  type ${constData.name} = ${constData.type};\n\n`;
    }
  });

  Object.values(organizedData.classes).forEach(classDoc => {
    if (classDoc.name !== 'p5') {
      output += generateClassDeclaration(classDoc, organizedData);
    }
  });
  output += '}\n\n';

  output += 'export default p5;\n';
  output += 'export as namespace p5;\n';

  return output;
}

function generateGlobalTypeDefinitions(organizedData) {
  let output = '// This file is auto-generated from JSDoc documentation\n\n';
  output += 'import p5 from \'p5\';\n\n';
  output += 'declare global {\n';

  const instanceItems = organizedData.classitems.filter(item =>
    item.class === 'p5' && !item.isStatic
  );
  instanceItems.forEach(item => {
    if (item.kind === 'function') {
      if (item.description) {
        output += `  /**\n${formatJSDocComment(item.description, 2)}\n   */\n`;
      }

      if (item.overloads?.length > 0) {
        item.overloads.forEach(overload => {
          const params = (overload.params || [])
            .map(param => generateParamDeclaration(param))
            .join(', ');
          const returnType = overload.returns?.[0]?.type
            ? generateTypeFromTag(overload.returns[0])
            : 'void';
          output += `  function ${item.name}(${params}): ${returnType};\n`;
        });
      }

      const params = (item.params || [])
        .map(param => generateParamDeclaration(param))
        .join(', ');
      output += `  function ${item.name}(${params}): ${item.returnType};\n\n`;
    }
  });

  Object.values(organizedData.consts).forEach(constData => {
    if (constData.kind === 'constant') {
      if (constData.description) {
        output += `  /**\n${formatJSDocComment(constData.description, 2)}\n   */\n`;
      }
      output += `  const ${constData.name.toUpperCase()}: p5.${constData.name.toUpperCase()};\n\n`;
    }
  });

  output += '  interface Window {\n';

  instanceItems.forEach(item => {
    if (item.kind === 'function') {
      output += `    ${item.name}: typeof ${item.name};\n`;
    }
  });

  Object.values(organizedData.consts).forEach(constData => {
    if (constData.kind === 'constant') {
      if (constData.description) {
        output += `    /**\n     * ${constData.description}\n     */\n`;
      }
      output += `    readonly ${constData.name.toUpperCase()}: typeof ${constData.name.toUpperCase()};\n`;
    }
  });

  output += '  }\n';
  output += '}\n\n';
  output += 'export {};\n';

  return output;
}

function generateFileTypeDefinitions(organizedData, data) {
  const fileDefinitions = new Map();
  const fileGroups = groupByFile(getAllEntries(data));

  fileGroups.forEach((items, filePath) => {
    const declarationContent = generateDeclarationFile(items, organizedData);
    fileDefinitions.set(filePath, declarationContent);
  });

  return fileDefinitions;
}
const organized = {
  modules: {},
  classes: {},
  classitems: [],
  consts: {}
};

function generateDeclarationFile(items, organizedData) {
  let output = '// This file is auto-generated from JSDoc documentation\n\n';
  const imports = new Set(['import p5 from \'p5\';']);
  const hasColorDependency = items.some(item => {
    const typeName = item.type?.name;
    const desc = extractDescription(item.description);
    return typeName === 'Color' || (typeof desc === 'string' && desc.includes('Color'));
  });

  const hasVectorDependency = items.some(item => {
    const typeName = item.type?.name;
    const desc = extractDescription(item.description);
    return typeName === 'Vector' || (typeof desc === 'string' && desc.includes('Vector'));
  });

  const hasConstantsDependency = items.some(item =>
    item.tags?.some(tag => tag.title === 'requires' && tag.description === 'constants')
  );

  if (hasColorDependency) {
    imports.add('import { Color } from \'../color/p5.Color\';');
  }
  if (hasVectorDependency) {
    imports.add('import { Vector } from \'../math/p5.Vector\';');
  }
  if (hasConstantsDependency) {
    imports.add('import * as constants from \'../core/constants\';');
  }

  output += Array.from(imports).join('\n') + '\n\n';
  output += 'declare module \'p5\' {\n';

  const classDoc = items.find(item => item.kind === 'class');
  if (classDoc) {
    const fullClassName = normalizeClassName(classDoc.name);
    const classDocName = fullClassName.replace('p5.', '');
    let parentClass = classDoc.tags?.find(tag => tag.title === 'extends')?.name;
    if (parentClass) {
      parentClass = parentClass.replace('p5.', '');
    }
    const extendsClause = parentClass ? ` extends ${parentClass}` : '';

    output += `  class ${classDocName}${extendsClause} {\n`;

    if (classDoc.params?.length > 0) {
      output += '    constructor(';
      output += classDoc.params
        .map(param => generateParamDeclaration(param))
        .join(', ');
      output += ');\n\n';
    }

    const classItems = organizedData.classitems.filter(item =>
      item.class === fullClassName ||
      item.class === fullClassName.replace('p5.', '')
    );

    const staticItems = classItems.filter(item => item.isStatic);
    const instanceItems = classItems.filter(item => !item.isStatic);
    staticItems.forEach(item => {
      output += generateMethodDeclarations(item, true);
    });
    instanceItems.forEach(item => {
      output += generateMethodDeclarations(item, false);
    });
    output += '  }\n\n';
  }

  items.forEach(item => {
    if (item.kind !== 'class' && (!item.memberof || item.memberof !== classDoc?.name)) {
      switch (item.kind) {
        case 'function':
          output += generateFunctionDeclaration(item);
          break;
        case 'constant':
        case 'typedef': {
          const constData = organizedData.consts[item.name];
          if (constData) {
            if (constData.description) {
              output += `  /**\n   * ${constData.description}\n   */\n`;
            }
            if (constData.kind === 'constant') {
              output += `  const ${constData.name}: ${constData.type};\n\n`;
            } else {
              output += `  type ${constData.name} = ${constData.type};\n\n`;
            }
          }
          break;
        }
      }
    }
  });

  output += '}\n\n';

  return output;
}

export function organizeData(data) {
  const allData = getAllEntries(data);

  organized.modules = {};
  organized.classes = {};
  organized.classitems = [];
  organized.consts = {};

  allData.forEach(entry => {
    const { module, submodule, forEntry } = getModuleInfo(entry);
    const cassName = normalizeClassNam(forEntry || entry.memberof || 'p5');

    switch (entry.kind) {
      case 'class':
        organized.classes[className] = {
          name: entry.name,
          description: extractDescription(entry.description),
          params: (entry.params || []).map(param => ({
            name: param.name,
            type: generateTypeFromTag(param),
            optional: param.type?.type === 'OptionalType'
          })),
          module,
          submodule,
          extends: entry.tags?.find(tag => tag.title === 'extends')?.name || null
        }; break;
      case 'function':
      case 'property':
        const overloads = entry.overloads?.map(overload => ({
          params: overload.params,
          returns: overload.returns,
          description: extractDescription(overload.description)
        }));

        organized.classitems.push({
          name: entry.name,
          kind: entry.kind,
          description: extractDescription(entry.description),
          params: (entry.params || []).map(param => ({
            name: param.name,
            type: generateTypeFromTag(param),
            optional: param.type?.type === 'OptionalType'
          })),
          returnType: entry.returns?.[0] ? generateTypeFromTag(entry.returns[0]) : 'void',
          module,
          submodule,
          class: className,
          isStatic: entry.path?.[0]?.scope === 'static',
          overloads
        }); break;
      case 'constant':
      case 'typedef':
        organized.consts[entry.name] = {
          name: entry.name,
          kind: entry.kind,
          description: extractDescription(entry.description),
          type: entry.kind === 'constant' ? `P5.${entry.name.toUpperCase()}` : (entry.type ? generateTypeFromTag(entry) : 'any'),
          module,
          submodule,
          class: forEntry || 'p5'
        }; break;
    }
  });
  return organized;
}

export function getModuleInfo(entry) {
  return {
    module: entry.tags?.find(tag => tag.title === 'module')?.name || 'p5',
    submodule: entry.tags?.find(tag => tag.title === 'submodule')?.description || null,
    forEntry: entry.tags?.find(tag => tag.title === 'for')?.description || entry.memberof
  };
}
export function extractDescription(desc) {
  if (!desc) return '';
  if (typeof desc === 'string') return desc;
  if (desc.children) {
    return desc.children.map(child => {
      if (child.type === 'text') return child.value;
      if (child.type === 'paragraph') return extractDescription(child);
      if (child.type === 'inlineCode' || child.type === 'code') return `\`${child.value}\``;
      return '';
    })
      .join('').trim().replace(/\n{3,}/g, '\n\n');
  }
  return '';
}
export function generateTypeFromTag(param) {
  if (!param || !param.type) return 'any';

  switch (param.type.type) {
    case 'NameExpression':
      return normalizeTypeName(param.type.name);
    case 'TypeApplication': {
      const baseType = normalizeTypeName(param.type.expression.name);

      if (baseType === 'Array') {
        const innerType = param.type.applications[0];
        const innerTypeStr = generateTypeFromTag({ type: innerType });
        return `${innerTypeStr}[]`;
      }

      const typeParams = param.type.applications
        .map(app => generateTypeFromTag({ type: app }))
        .join(', ');
      return `${baseType}<${typeParams}>`;
    }
    case 'UnionType':
      const unionTypes = param.type.elements
        .map(el => generateTypeFromTag({ type: el }))
        .join(' | ');
      return unionTypes;
    case 'OptionalType':
      return generateTypeFromTag({ type: param.type.expression });
    case 'AllLiteral':
      return 'any';
    case 'RecordType':
      return 'object';
    case 'StringLiteralType':
      return `'${param.type.value}'`;
    case 'UndefinedLiteralType':
      return 'undefined';
    case 'ArrayType': {
      const innerTypeStrs = param.type.elements.map(e => generateTypeFromTag({ type: e }));
      return `[${innerTypeStrs.join(', ')}]`;
    }
    case 'RestType':
      return `${generateTypeFromTag({ type: param.type.expression })}[]`;
    default:
      return 'any';
  }
}

export function normalizeTypeName(type) {
  if (!type) return 'any';

  if (type === '[object Object]') return 'any';

  const primitiveTypes = {
    'String': 'string',
    'Number': 'number',
    'Integer': 'number',
    'Boolean': 'boolean',
    'Void': 'void',
    'Object': 'object',
    'Array': 'Array',
    'Function': 'Function'
  };

  return primitiveTypes[type] || type;
}

export function generateParamDeclaration(param) {
  if (!param) return 'any';

  let type = param.type;
  let prefix = '';
  const isOptional = param.type?.type === 'OptionalType';
  if (typeof type === 'string') {
    type = normalizeTypeName(type);
  } else if (param.type?.type) {
    type = generateTypeFromTag(param);
  } else {
    type = 'any';
  }

  if (param.type?.type === 'RestType') {
    prefix = '...';
  }

  return `${prefix}${param.name}${isOptional ? '?' : ''}: ${type}`;
}

export function generateFunctionDeclaration(funcDoc) {
  let output = '';

  if (funcDoc.description || funcDoc.tags?.length > 0) {
    output += '/**\n';
    const description = extractDescription(funcDoc.description);
    if (description) {
      output += formatJSDocComment(description) + '\n';
    }
    if (funcDoc.tags) {
      if (description) {
        output += ' *\n';
      }
      funcDoc.tags.forEach(tag => {
        if (tag.description) {
          const tagDesc = extractDescription(tag.description);
          output += formatJSDocComment(`@${tag.title} ${tagDesc}`, 0) + '\n';
        }
      });
    }
    output += ' */\n';
  }

  const params = (funcDoc.params || [])
    .map(param => generateParamDeclaration(param))
    .join(', ');

  const returnType = funcDoc.returns?.[0]?.type
    ? generateTypeFromTag(funcDoc.returns[0])
    : 'void';

  output += `function ${funcDoc.name}(${params}): ${returnType};\n\n`;
  return output;
}

export function generateMethodDeclarations(item, isStatic = false, isGlobal = false) {
  let output = '';

  if (item.description) {
    output += '  /**\n';
    const itemDesc = extractDescription(item.description);
    output += formatJSDocComment(itemDesc, 2) + '\n';
    if (item.params?.length > 0) {
      output += ' *\n';
      item.params.forEach(param => {
        const paramDesc = extractDescription(param.description);
        output += formatJSDocComment(`@param ${paramDesc}`, 2) + '\n';
      });
    }
    if (item.returns) {
      output += ' *\n';
      const returnDesc = extractDescription(item.returns[0]?.description);
      output += formatJSDocComment(`@return ${returnDesc}`, 2) + '\n';
    }
    output += '   */\n';
  }

  if (item.kind === 'function') {
    const staticPrefix = isStatic ? 'static ' : '';

    if (item.overloads?.length > 0) {
      item.overloads.forEach(overload => {
        const params = (overload.params || [])
          .map(param => generateParamDeclaration(param))
          .join(', ');
        const returnType = overload.returns?.[0]?.type
          ? generateTypeFromTag(overload.returns[0])
          : 'void';
        output += `  ${staticPrefix}${item.name}(${params}): ${returnType};\n`;
      });
    }

    const params = (item.params || [])
      .map(param => generateParamDeclaration(param))
      .join(', ');
    output += `  ${staticPrefix}${item.name}(${params}): ${item.returnType};\n\n`;
  } else {
    const staticPrefix = isStatic ? 'static ' : '';
    output += `  ${staticPrefix}${item.name}: ${item.returnType};\n\n`;
  }

  return output;
}

export function generateClassDeclaration(classDoc, organizedData) {


  let output = '';

  if (classDoc.description || classDoc.tags?.length > 0) {
    output += '/**\n';
    const description = extractDescription(classDoc.description);
    if (description) {
      output += formatJSDocComment(description) + '\n';
    }
    if (classDoc.tags) {
      if (description) {
        output += ' *\n';
      }
      classDoc.tags.forEach(tag => {
        if (tag.description) {
          const tagDesc = extractDescription(tag.description);
          output += formatJSDocComment(`@${tag.title} ${tagDesc}`, 0) + '\n';
        }
      });
    }
    output += ' */\n';
  }

  const parentClass = classDoc.extends;
  const extendsClause = parentClass ? ` extends ${parentClass}` : '';

  const fullClassName = normalizeClassName(classDoc.name);
  const classDocName = fullClassName.replace('p5.', '');
  output += `class ${classDocName}${extendsClause} {\n`;

  if (classDoc.params?.length > 0) {
    output += '  constructor(';
    output += classDoc.params
      .map(param => generateParamDeclaration(param))
      .join(', ');
    output += ');\n\n';
  }

  const classItems = organizedData.classitems.filter(item =>
    item.class === fullClassName ||
    item.class === fullClassName.replace('p5.', '')
  );
  const staticItems = classItems.filter(item => item.isStatic);
  const instanceItems = classItems.filter(item => !item.isStatic);

  staticItems.forEach(item => {
    output += generateMethodDeclarations(item, true);
  });

  instanceItems.forEach(item => {
    output += generateMethodDeclarations(item, false);
  });

  output += '}\n\n';
  return output;
}

function formatJSDocComment(text, indentLevel = 0) {
  if (!text) return '';
  const indent = ' '.repeat(indentLevel);

  const lines = text
    .split('\n')
    .map(line => line.trim())
    .reduce((acc, line) => {
      // If we're starting and line is empty, skip it
      if (acc.length === 0 && line === '') return acc;
      // If we have content and hit an empty line, keep one empty line
      if (acc.length > 0 && line === '' && acc[acc.length - 1] === '') return acc;
      acc.push(line);
      return acc;
    }, [])
    .filter((line, i, arr) => i < arr.length - 1 || line !== ''); // Remove trailing empty line

  return lines
    .map(line => `${indent} * ${line}`)
    .join('\n');
}
function groupByFile(items) {
  const fileGroups = new Map();

  items.forEach(item => {
    if (!item.context || !item.context.file) return;

    const filePath = item.context.file;
    if (!fileGroups.has(filePath)) {
      fileGroups.set(filePath, []);
    }
    fileGroups.get(filePath).push(item);
  });

  return fileGroups;
}
