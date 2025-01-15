const fs = require('fs');
const path = require('path');

// Read docs.json
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/data.json')));

// Flatten and organize data structure
function getEntries(entry) {
  if (!entry) return [];
  if (!entry.members) return [entry];
  
  return [
    entry,
    ...getAllEntries(entry.members.global || []),
    ...getAllEntries(entry.members.inner || []),
    ...getAllEntries(entry.members.instance || []),
    ...getAllEntries(entry.members.events || []),
    ...getAllEntries(entry.members.static || [])
  ];
}

function getAllEntries(arr) {
  return arr.flatMap(getEntries);
}
const organized = {
    modules: {},
    classes: {},
    classitems: [],
    consts: {}
  };

// Organize data into structured format
function organizeData(data) {
  const allData = getAllEntries(data);
  

  // Process modules first
  allData.forEach(entry => {
    if (entry.tags?.some(tag => tag.title === 'module')) {
      const { module, submodule } = getModuleInfo(entry);
      organized.modules[module] = organized.modules[module] || {
        name: module,
        submodules: {},
        classes: {}
      };
      if (submodule) {
        organized.modules[module].submodules[submodule] = true;
      }
    }
  });

  // Process classes
  allData.forEach(entry => {
    if (entry.kind === 'class') {
      const { module, submodule } = getModuleInfo(entry);
      const className = entry.name;
      organized.classes[className] = {
        name: className,
        description: extractDescription(entry.description),
        params: (entry.params || []).map(param => ({
          name: param.name,
          type: generateTypeFromTag(param),
          optional: param.type?.type === 'OptionalType'
        })),
        module,
        submodule
      };
    }
  });

  // Process class methods and properties
  allData.forEach(entry => {
    if (entry.kind === 'function' || entry.kind === 'property') {
      const { module, submodule, forEntry } = getModuleInfo(entry);
      // Use memberof if available, fallback to forEntry, then default to 'p5'
      const className = entry.memberof || forEntry || 'p5';
     
      // Create the class entry if it doesn't exist
      // if (!organized.classes[className]) {console.log(`returning for ${className}`); return};
      
      // Check for static methods - directly check path[0].scope
      // Todo: handle static methods
      const isStatic = entry.path?.[0]?.scope === 'static';
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
        isStatic,
        overloads
      });
    }
  });

  // Process constants and typedefs
  allData.forEach(entry => {
    if (entry.kind === 'constant' || entry.kind === 'typedef') {
      const { module, submodule, forEntry } = getModuleInfo(entry);
      organized.consts[entry.name] = {
        name: entry.name,
        kind: entry.kind,
        description: extractDescription(entry.description),
        type: entry.type ? generateTypeFromTag(entry) : 'any',
        module,
        submodule,
        class: forEntry || 'p5'
      };
    }
    fs.writeFileSync("./consts.json", JSON.stringify(organized.consts, null, 2), 'utf8');
  });

  return organized;
}

// Helper function to get module info
function getModuleInfo(entry) {
  const moduleTag = entry.tags?.find(tag => tag.title === 'module');
  const submoduleTag = entry.tags?.find(tag => tag.title === 'submodule');
  const forTag = entry.tags?.find(tag => tag.title === 'for')
  
  return {
    module: moduleTag?.name || 'p5',
    submodule: submoduleTag?.description,
    forEntry: forTag?.description || entry.memberof
  };
}

// Function to extract text from description object or string
function extractDescription(desc) {
  if (!desc) return '';
  if (typeof desc === 'string') return desc;
  if (desc.children) {
    return desc.children
      .map(child => {
        if (child.type === 'text') return child.value;
        if (child.type === 'paragraph') return extractDescription(child);
        if (child.type === 'inlineCode') return `\`${child.value}\``;
        if (child.type === 'code') return `\`${child.value}\``;
        return '';
      })
      .join('')
      .trim()
      .replace(/\n{3,}/g, '\n\n'); 
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
    'Boolean': 'boolean',
    'Void': 'void',
    'Object': 'object',
    'Array': 'array',
    'Function': 'function'
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
      const typeParams = param.type.applications
        .map(app => generateTypeFromTag({ type: app }))
        .join(', ');
      return `${baseType}<${typeParams}>`;
    case 'UnionType':
      return param.type.elements
        .map(el => generateTypeFromTag({ type: el }))
        .join(' | ');
    case 'OptionalType':
      return generateTypeFromTag({ type: param.type.expression });
    case 'AllLiteral':
      return 'any';
    case 'RecordType':
      return 'object';
    case 'ObjectType':
      return 'object';
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
        output += ' *\n'; // Add separator between description and tags
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

  // Add constructor if there are parameters
  if (classDoc.params?.length > 0) {
    output += '  constructor(';
    output += classDoc.params
      .map(param => generateParamDeclaration(param))
      .join(', ');
    output += ');\n\n';
  }

  // Get all class items for this class
  const classDocName = classDoc.name.startsWith('p5.') ? classDoc.name.substring(3) : classDoc.name;
  const classItems = organizedData.classitems.filter(item => item.class === classDocName);
  
  // Separate static and instance members
  const staticItems = classItems.filter(item => item.isStatic);
  
  const instanceItems = classItems.filter(item => !item.isStatic);

  // Add static methods first
  staticItems.forEach(item => {

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
      // Handle function overloads
      if (item.overloads) {
        item.overloads.forEach(overload => {
          const params = (overload.params || [])
            .map(param => generateParamDeclaration(param))
            .join(', ');
          const returnType = overload.returns?.[0]?.type 
            ? generateTypeFromTag(overload.returns[0])
            : 'void';
          output += `  static ${item.name}(${params}): ${returnType};\n`;
        });
        output += '\n';
      } else {
        const params = (item.params || [])
          .map(param => generateParamDeclaration(param))
          .join(', ');
        output += `  static ${item.name}(${params}): ${item.returnType};\n\n`;
      }
    } else {
      output += `  static ${item.name}: ${item.returnType};\n\n`;
    }
  });

  // Add instance members
  instanceItems.forEach(item => {
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
      // Handle function overloads
      if (item.overloads) {
        item.overloads.forEach(overload => {
          const params = (overload.params || [])
            .map(param => generateParamDeclaration(param))
            .join(', ');
          const returnType = overload.returns?.[0]?.type 
            ? generateTypeFromTag(overload.returns[0])
            : 'void';
          output += `  ${item.name}(${params}): ${returnType};\n`;
        });
        output += '\n';
      } else {
        const params = (item.params || [])
          .map(param => generateParamDeclaration(param))
          .join(', ');
        output += `  ${item.name}(${params}): ${item.returnType};\n\n`;
      }
    } else {
      output += `  ${item.name}: ${item.returnType};\n\n`;
    }
  });

  output += '}\n\n';
  return output;
}

// Generate declaration file for a group of items
function generateDeclarationFile(items, filePath, organizedData) {
  let output = '// This file is auto-generated from JSDoc documentation\n\n';
  
  // Add imports based on dependencies
  const imports = new Set([`import p5 from 'p5';`]);
  
  // Check for dependencies
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
  output += `declare module '${moduleName}' {\n`;
  
  // Add all item declarations
  items.forEach(item => {
    switch (item.kind) {
      case 'class':
        output += generateClassDeclaration(item, organizedData);
        break;
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
    
    // Generate the declaration file content
    const declarationContent = generateDeclarationFile(items, filePath, organized);
    
    // Create directory if it doesn't exist
    fs.mkdirSync(path.dirname(dtsPath), { recursive: true });
    
    // Write the declaration file
    fs.writeFileSync(dtsPath, declarationContent, 'utf8');
    
    console.log(`Generated ${dtsPath}`);
  });
}

// Run the generator
generateAllDeclarationFiles(); 