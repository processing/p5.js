const fs = require('fs');
const path = require('path');
const { getAllEntries } = require("./convert");

// Read docs.json
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/data.json')));

const organized = {
    modules: {},
    classes: {},
    classitems: [],
    consts: {}
  };

function normalizeClassName(className) {
  if (!className || className === 'p5') return 'p5';
  return className.startsWith('p5.') ? className : `p5.${className}`;
}

// Organize data into structured format
function organizeData(data) {
  const allData = getAllEntries(data);
  

  // Process modules first
  allData.forEach(entry => {
    const { module, submodule, forEntry } = getModuleInfo(entry);
    const className = normalizeClassName(forEntry || entry.memberof || 'p5');

    switch(entry.kind) {
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
          extends:  entry.tags?.find(tag => tag.title === 'extends')?.name || null
        }; break;
        case 'function':
        case 'property':
          // Handle overloads
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
            // For constants, use P5.CONSTANT_NAME format
            type: entry.kind === 'constant' ? `P5.${entry.name.toUpperCase()}` : (entry.type ? generateTypeFromTag(entry) : 'any'),
            module,
            submodule,
            class: forEntry || 'p5'
          }; break;
      }
    });
  return organized;
}

// Helper function to get module info
function getModuleInfo(entry) {
    return {
        module: entry.tags?.find(tag => tag.title === 'module')?.name || 'p5',
        submodule: entry.tags?.find(tag => tag.title === 'submodule')?.description || null,
        forEntry: entry.tags?.find(tag => tag.title === 'for')?.description || entry.memberof
    };
}

// Function to extract text from description object or string
function extractDescription(desc) {
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

// Format comment text for JSDoc
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

// Normalize type names to ensure primitive types are lowercase and handle object types
function normalizeTypeName(type) {
  if (!type) return 'any';
  
  // Handle object type notation
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

// Generate type from tag
function generateTypeFromTag(param) {
  if (!param || !param.type) return 'any';

  switch (param.type.type) {
    case 'NameExpression':
      return normalizeTypeName(param.type.name);
    case 'TypeApplication':
      const baseType = normalizeTypeName(param.type.expression.name);
      
      // Handle array cases
      if (baseType === 'Array') {
        const innerType = param.type.applications[0]; 
        const innerTypeStr = generateTypeFromTag({ type: innerType });
        return `${innerTypeStr}[]`;
      }

      // Regular type application
      const typeParams = param.type.applications
        .map(app => generateTypeFromTag({ type: app }))
        .join(', ');
      return `${baseType}<${typeParams}>`;
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
    default:
      return 'any';
  }
}

// Generate parameter declaration
function generateParamDeclaration(param) {
  if (!param) return 'any';
  
  let type = param.type;
  const isOptional = param.type?.type === 'OptionalType'; 
  if (typeof type === 'string') {
    type = normalizeTypeName(type);
  } else if (param.type?.type) {
    type = generateTypeFromTag(param);
  } else {
    type = 'any';
  }

  return `${param.name}${isOptional ? '?' : ''}: ${type}`;
}

// Generate function declaration
function generateFunctionDeclaration(funcDoc) {
  let output = '';

  // Add Comments
  if (funcDoc.description || funcDoc.tags?.length > 0) {
    output += '/**\n';
    const description = extractDescription(funcDoc.description);
    if (description) {
      output += formatJSDocComment(description) + '\n';
    }
    if (funcDoc.tags) {
      if (description) {
        output += ' *\n'; // Add separator between description and tags
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

  // Generate function signature
  const params = (funcDoc.params || [])
    .map(param => generateParamDeclaration(param))
    .join(', ');

  const returnType = funcDoc.returns?.[0]?.type 
    ? generateTypeFromTag(funcDoc.returns[0])
    : 'void';

  output += `function ${funcDoc.name}(${params}): ${returnType};\n\n`;
  return output;
}

// Helper function to generate method declarations
function generateMethodDeclarations(item, isStatic = false, isGlobal = false) {
  let output = '';
  
  // Add JSDoc comment
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
    
    // If there are overloads, generate all overload signatures first
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
    
    // Generate the implementation signature
    const params = (item.params || [])
      .map(param => generateParamDeclaration(param))
      .join(', ');
    output += `  ${staticPrefix}${item.name}(${params}): ${item.returnType};\n\n`;
  } else {
    // Handle properties
    const staticPrefix = isStatic ? 'static ' : '';
    output += `  ${staticPrefix}${item.name}: ${item.returnType};\n\n`;
  }
  
  return output;
}

// Generate class declaration
function generateClassDeclaration(classDoc, organizedData) {
  let output = '';

  // Add comments
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

  // Get the parent class if it exists
  const parentClass = classDoc.extends;
  const extendsClause = parentClass ? ` extends ${parentClass}` : '';

  // Start class declaration with inheritance if applicable
  const fullClassName = normalizeClassName(classDoc.name);
  const classDocName = fullClassName.replace('p5.', '');
  output += `class ${classDocName}${extendsClause} {\n`;

  // Add constructor if there are parameters
  if (classDoc.params?.length > 0) {
    output += '  constructor(';
    output += classDoc.params
      .map(param => generateParamDeclaration(param))
      .join(', ');
    output += ');\n\n';
  }

  // Get all class items for this class
  const classItems = organizedData.classitems.filter(item => 
    item.class === fullClassName || 
    item.class === fullClassName.replace('p5.', '')
  );
  
  // Separate static and instance members
  const staticItems = classItems.filter(item => item.isStatic);
  const instanceItems = classItems.filter(item => !item.isStatic);

  // Generate static members
  staticItems.forEach(item => {
    output += generateMethodDeclarations(item, true);
  });

  // Generate instance members
  instanceItems.forEach(item => {
    output += generateMethodDeclarations(item, false);
  });

  output += '}\n\n';
  return output;
}

// Generate declaration file for a group of items
function generateDeclarationFile(items, filePath, organizedData) {
  let output = '// This file is auto-generated from JSDoc documentation\n\n';
  const imports = new Set([`import p5 from 'p5';`]);
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
    imports.add(`import { Color } from '../color/p5.Color';`);
  }
  if (hasVectorDependency) {
    imports.add(`import { Vector } from '../math/p5.Vector';`);
  }
  if (hasConstantsDependency) {
    imports.add(`import * as constants from '../core/constants';`);
  }
  
  output += Array.from(imports).join('\n') + '\n\n';
  
  // Get module name
  const moduleName = getModuleInfo(items[0]).module;
  
  // Begin module declaration
  output += `declare module 'p5' {\n`;
  
  // Find the class documentation if it exists
  const classDoc = items.find(item => item.kind === 'class');
  if (classDoc) {
    const fullClassName = normalizeClassName(classDoc.name);
    const classDocName = fullClassName.replace('p5.', '');
    let parentClass = classDoc.tags?.find(tag => tag.title === 'extends')?.name;
    if (parentClass) {
      parentClass = parentClass.replace('p5.', '');
    }
    const extendsClause = parentClass ? ` extends ${parentClass}` : '';
    
    // Start class declaration
    output += `  class ${classDocName}${extendsClause} {\n`;
    
    // Add constructor if there are parameters
    if (classDoc.params?.length > 0) {
      output += '    constructor(';
      output += classDoc.params
        .map(param => generateParamDeclaration(param))
        .join(', ');
      output += ');\n\n';
    }

    // Get all class items for this class
    const classItems = organizedData.classitems.filter(item => 
      item.class === fullClassName || 
      item.class === fullClassName.replace('p5.', '')
    );
    
    // Separate static and instance members
    const staticItems = classItems.filter(item => item.isStatic);
    const instanceItems = classItems.filter(item => !item.isStatic);
    // Generate static members
    staticItems.forEach(item => {
      output += generateMethodDeclarations(item, true);
    });
    // Generate instance members
    instanceItems.forEach(item => {
      output += generateMethodDeclarations(item, false);
    });
    output += '  }\n\n';
  }
  
  // Add remaining items that aren't part of the class
  items.forEach(item => {
    if (item.kind !== 'class' && (!item.memberof || item.memberof !== classDoc?.name)) {
      switch (item.kind) {
        case 'function':
          output += generateFunctionDeclaration(item);
          break;
        case 'constant':
        case 'typedef':
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
  });
  
  // Close module declaration
  output += '}\n\n';
  
  // Add default export
  const exportName = path.basename(filePath, '.js').replace('.', '_');
  output += `export default function ${exportName}(p5: any, fn: any): void;\n`;
  
  return output;
}

// Group items by file
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

// Main function to generate all declaration files
function generateAllDeclarationFiles() {
  // Organize all data first
  const organizedData = organizeData(data);
  generateCoreTypeDefinitions(organizedData);
  // Group items by file
  const fileGroups = groupByFile(getAllEntries(data));
  
  fileGroups.forEach((items, filePath) => {
    // Convert the file path to a .d.ts path
    const parsedPath = path.parse(filePath);
    const relativePath = path.relative(process.cwd(), filePath);
    const dtsPath = path.join(
      path.dirname(relativePath),
      `${parsedPath.name}.d.ts`
    );
  
    const declarationContent = generateDeclarationFile(items, filePath, organizedData);
    fs.mkdirSync(path.dirname(dtsPath), { recursive: true });
    fs.writeFileSync(dtsPath, declarationContent, 'utf8');
    console.log(`Generated ${dtsPath}`);
  });
}

function findTypeDefinitionFiles(rootDir, p5DtsPath) {
  const typeFiles = new Set();
  const srcDir = path.join(rootDir, 'src');
  
  // Check if src directory exists
  if (!fs.existsSync(srcDir)) {
    return [];
  }
  
  function scan(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        scan(fullPath);
      } else if (file.endsWith('.d.ts')) {
        // Get path relative to p5.d.ts location and normalize slashes
        const relativePath = path.relative(path.dirname(p5DtsPath), fullPath)
          .replace(/\\/g, '/');
        typeFiles.add(relativePath);
      }
    });
  }
  
  // Only scan the src directory
  scan(srcDir);
  return Array.from(typeFiles).sort();
}

function generateCoreTypeDefinitions(organizedData) {
  const p5DtsPath = path.join(process.cwd(), 'types', 'p5.d.ts');
  
  // Generate p5.d.ts
  let p5Output = '// This file is auto-generated from JSDoc documentation\n\n';
  
  // Add reference paths to other .d.ts files
  const typeFiles = findTypeDefinitionFiles(process.cwd(), p5DtsPath);
  typeFiles.forEach(file => {
    p5Output += `/// <reference types="${file}" />\n`;
  });
  p5Output += '\n';

  // Generate the p5 class
  p5Output += `declare class p5 {\n`;
  p5Output += `  constructor(sketch?: (p: p5) => void, node?: HTMLElement, sync?: boolean);\n\n`;

  // Add instance methods
  const instanceItems = organizedData.classitems.filter(item => 
    item.class === 'p5' && !item.isStatic
  );
  instanceItems.forEach(item => {
    p5Output += generateMethodDeclarations(item, false);
  });

  // Add static methods
  const staticItems = organizedData.classitems.filter(item => 
    item.class === 'p5' && item.isStatic
  );
  staticItems.forEach(item => {
    p5Output += generateMethodDeclarations(item, true);
  });

  // Add static constants
  Object.values(organizedData.consts).forEach(constData => {
    if (constData.class === 'p5') {
      if (constData.description) {
        p5Output += `  /**\n   * ${constData.description}\n   */\n`;
      }
      if (constData.kind === 'constant') {
        p5Output += `  readonly ${constData.name.toUpperCase()}: ${constData.type};\n\n`;
      } else {
        p5Output += `  static ${constData.name}: ${constData.type};\n\n`;
      }
    }
  });

  p5Output += `}\n\n`;

  // Add namespace for additional classes and types
  p5Output += `declare namespace p5 {\n`;

  // Add type definitions
  Object.values(organizedData.consts).forEach(constData => {
    if (constData.kind === 'typedef') {
      if (constData.description) {
        p5Output += `  /**\n   * ${constData.description}\n   */\n`;
      }
      p5Output += `  type ${constData.name} = ${constData.type};\n\n`;
    }
  });

  // Add other classes (like Graphics, Vector, etc)
  Object.values(organizedData.classes).forEach(classDoc => {
    if (classDoc.name !== 'p5') {
      p5Output += generateClassDeclaration(classDoc, organizedData);
    }
  });
  p5Output += `}\n\n`;

  p5Output += `export default p5;\n`;
  p5Output += `export as namespace p5;\n`;

  // Generate global.d.ts
  let globalOutput = '// This file is auto-generated from JSDoc documentation\n\n';
  globalOutput += `import p5 from 'p5';\n\n`;
  globalOutput += `declare global {\n`;

  // Generate global function declarations first
  instanceItems.forEach(item => {
    if (item.kind === 'function') {
      // Add JSDoc for global function
      if (item.description) {
        globalOutput += `  /**\n${formatJSDocComment(item.description, 2)}\n   */\n`;
      }
      
      // Handle function overloads
      if (item.overloads?.length > 0) {
        item.overloads.forEach(overload => {
          const params = (overload.params || [])
            .map(param => generateParamDeclaration(param))
            .join(', ');
          const returnType = overload.returns?.[0]?.type 
            ? generateTypeFromTag(overload.returns[0])
            : 'void';
          globalOutput += `  function ${item.name}(${params}): ${returnType};\n`;
        });
      }
      
      // Add main function declaration
      const params = (item.params || [])
        .map(param => generateParamDeclaration(param))
        .join(', ');
      globalOutput += `  function ${item.name}(${params}): ${item.returnType};\n\n`;
    }
  });

  // Add global constants
  Object.values(organizedData.consts).forEach(constData => {
    if (constData.kind === 'constant') {
      if (constData.description) {
        globalOutput += `  /**\n${formatJSDocComment(constData.description, 2)}\n   */\n`;
     }
      globalOutput += `  const ${constData.name.toUpperCase()}: p5.${constData.name.toUpperCase()};\n\n`;
    }
  });

  // Generate Window interface
  globalOutput += `  interface Window {\n`;
  
  // Add function references to Window interface
  instanceItems.forEach(item => {
    if (item.kind === 'function') {
      globalOutput += `    ${item.name}: typeof ${item.name};\n`;
    }
  });

  // Add constant references to Window interface
  Object.values(organizedData.consts).forEach(constData => {
    if (constData.kind === 'constant') {
      if (constData.description) {
        globalOutput += `    /**\n     * ${constData.description}\n     */\n`;
      }
      globalOutput += `    readonly ${constData.name.toUpperCase()}: typeof ${constData.name.toUpperCase()};\n`;
    }
  });

  globalOutput += `  }\n`;
  globalOutput += `}\n\n`;
  globalOutput += `export {};\n`;

  // Create types directory if it doesn't exist
  const typesDir = path.join(process.cwd(), 'types');
  fs.mkdirSync(typesDir, { recursive: true });

  // Write the files
  fs.writeFileSync(path.join(typesDir, 'p5.d.ts'), p5Output, 'utf8');
  fs.writeFileSync(path.join(typesDir, 'global.d.ts'), globalOutput, 'utf8');
}


// Run the generator
generateAllDeclarationFiles(); 