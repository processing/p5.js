import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { processData } from './data-processor.mjs';
import { descriptionStringForTypeScript } from './shared-helpers.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Clear existing types directory and recreate it
const typesDir = path.join(__dirname, '../types');
if (fs.existsSync(typesDir)) {
  fs.rmSync(typesDir, { recursive: true, force: true });
}
fs.mkdirSync(typesDir, { recursive: true });

const rawData = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/data.json')));

// Pre-build constants lookup
import { getAllEntries } from './shared-helpers.mjs';
const allRawData = getAllEntries(rawData);
const constantsLookup = new Set();
allRawData.forEach(entry => {
  if (entry.kind === 'constant' || entry.kind === 'typedef') {
    constantsLookup.add(entry.name);
  }
});

// TypeScript-specific type conversion from raw type objects
function convertTypeToTypeScript(typeNode, options = {}) {
  if (!typeNode) return 'any';
  
  // Validate that typeNode is always an object
  if (typeof typeNode !== 'object' || Array.isArray(typeNode)) {
    throw new Error(`convertTypeToTypeScript expects an object, got: ${typeof typeNode} - ${JSON.stringify(typeNode)}`);
  }
  
  const { currentClass = null, isInsideNamespace = false, global = false } = options;
  
  switch (typeNode.type) {
    case 'NameExpression': {
      const typeName = typeNode.name;
      
      // Handle primitive types
      const primitiveTypes = {
        'String': 'string',
        'Number': 'number', 
        'Integer': 'number',
        'Boolean': 'boolean',
        'Void': 'void',
        'Object': 'object',
        'Any': 'any',
        'Array': 'any[]',
        'Promise': 'Promise<any>',
        'Function': 'Function',
        'HTMLElement': 'HTMLElement',
        'Event': 'Event',
        'Request': 'Request'
      };
      
      if (primitiveTypes[typeName]) {
        return primitiveTypes[typeName];
      }
      
      // Handle self-referential types within the same class
      if (currentClass && (typeName === `p5.${currentClass}` || typeName === currentClass)) {
        return currentClass;
      }
      
      // If we're inside the p5 namespace, remove p5. prefix from other p5 classes
      if (isInsideNamespace && typeName.startsWith('p5.')) {
        if (global) {
          return 'P5.' + typeName.substring(3);
        } else {
          return typeName.substring(3);
        }
      }
      
      // Check if this is a p5 constant - use typeof since they're defined as values
      if (constantsLookup.has(typeName)) {
        if (global) {
          return `typeof P5.${typeName}`;
        } else {
          return `typeof ${typeName}`;
        }
      }
      
      return typeName;
    }
    
    case 'TypeApplication': {
      const baseTypeName = typeNode.expression.name;
      
      if (baseTypeName === 'Array' && typeNode.applications.length === 1) {
        const innerType = convertTypeToTypeScript(typeNode.applications[0], options);
        return `${innerType}[]`;
      }
      
      // For generic types, use the base type name directly to avoid double conversion
      const typeParams = typeNode.applications
        .map(app => convertTypeToTypeScript(app, options))
        .join(', ');
      return `${baseTypeName}<${typeParams}>`;
    }
    
    case 'UnionType': {
      const unionTypes = typeNode.elements
        .map(el => convertTypeToTypeScript(el, options))
        .join(' | ');
      return unionTypes;
    }
    
    case 'OptionalType':
      return convertTypeToTypeScript(typeNode.expression, options);
      
    case 'AllLiteral':
      return 'any';
      
    case 'RecordType':
      return 'object';
      
    case 'NumericLiteralType':
      return `${typeNode.value}`;
      
    case 'StringLiteralType':
      return `'${typeNode.value}'`;
      
    case 'NullLiteral':
      return 'null';
      
    case 'UndefinedLiteral':
      return 'undefined';
      
    case 'ArrayType': {
      const innerTypes = typeNode.elements.map(e => convertTypeToTypeScript(e, options));
      return `[${innerTypes.join(', ')}]`;
    }
    
    case 'RestType':
      return `${convertTypeToTypeScript(typeNode.expression, options)}[]`;
      
    case 'FunctionType': {
      const params = (typeNode.params || [])
        .map((param, i) => {
          const paramType = convertTypeToTypeScript(param, options);
          return `arg${i}: ${paramType}`;
        })
        .join(', ');
      
      const returnType = typeNode.result
        ? convertTypeToTypeScript(typeNode.result, options)
        : 'void';
      return `(${params}) => ${returnType}`;
    }
    
    default:
      return 'any';
  }
}

// Strategy for TypeScript output
const typescriptStrategy = {
  shouldSkipEntry: (entry, context) => {
    // Skip Foundation module for TypeScript output
    return context.module === 'Foundation';
  },
  
  processDescription: (desc) => descriptionStringForTypeScript(desc),
  
  processType: (type) => {
    // Return an object with the original type preserved
    // This matches the expected data structure from the data processor
    return {
      type: type, // Keep the original raw type object
      originalType: type // Also store it here for clarity
    };
  }
};

const processed = processData(rawData, typescriptStrategy);

function normalizeIdentifier(name) {
  return (
    '0123456789'.includes(name[0]) ||
    name === 'class'
  ) ? '$' + name : name;
}

function formatJSDocComment(text, indentLevel = 0) {
  if (!text) return '';
  const indent = ' '.repeat(indentLevel);
  
  const lines = text
    .split('\n')
    .map(line => line.trim())
    .reduce((acc, line) => {
      if (acc.length === 0 && line === '') return acc;
      if (acc.length > 0 && line === '' && acc[acc.length - 1] === '') return acc;
      acc.push(line);
      return acc;
    }, [])
    .filter((line, i, arr) => i < arr.length - 1 || line !== '');
  
  return lines
    .map(line => `${indent} * ${line}`)
    .join('\n');
}

function generateParamDeclaration(param, options = {}) {
  if (!param) return '';
  
  const name = normalizeIdentifier(param.name);
  
  // Convert the type - should always be an object
  let type = 'any';
  if (param.type) {
    type = convertTypeToTypeScript(param.type, options);
  }
  
  const isOptional = param.optional;
  
  let prefix = '';
  if (param.rest) {
    prefix = '...';
  }
  
  return `${prefix}${name}${isOptional ? '?' : ''}: ${type}`;
}

function generateMethodDeclaration(method, options = {}) {
  let output = '';
  
  if (method.description) {
    output += '  /**\n';
    output += formatJSDocComment(method.description, 2) + '\n';
    
    // Add param docs from first overload
    if (method.overloads?.[0]?.params) {
      method.overloads[0].params.forEach(param => {
        if (param.description) {
          output += formatJSDocComment(`@param ${param.name} ${param.description}`, 2) + '\n';
        }
      });
    }
    
    // Add return docs
    if (method.return?.description) {
      output += formatJSDocComment(`@returns ${method.return.description}`, 2) + '\n';
    }
    
    output += '   */\n';
  }
  
  const staticPrefix = method.static ? 'static ' : '';
  
  // Generate overload declarations
  if (method.overloads && method.overloads.length > 0) {
    method.overloads.forEach(overload => {
      const params = (overload.params || [])
        .map(param => generateParamDeclaration(param, options))
        .join(', ');
      
      let returnType = 'void';
      if (method.chainable) {
        // returnType = currentClass || 'this';
        // TODO: Decide what should be chainable. Many of these are accidental / not thought through
      } else if (overload.return && overload.return.type) {
        returnType = convertTypeToTypeScript(overload.return.type, options);
      } else if (method.return && method.return.type) {
        returnType = convertTypeToTypeScript(method.return.type, options);
      }
      
      output += `  ${staticPrefix}${method.name}(${params}): ${returnType};\n`;
    });
  }
  
  output += '\n';
  return output;
}

function generateClassDeclaration(classData) {
  let output = '';
  const className = classData.name.startsWith('p5.') ? classData.name.substring(3) : classData.name;
  
  if (classData.description) {
    output += '  /**\n';
    output += formatJSDocComment(classData.description, 2) + '\n';
    output += '   */\n';
  }
  
  const extendsClause = classData.extends ? ` extends ${classData.extends}` : '';
  output += `  class ${className}${extendsClause} {\n`;
  
  // Constructor
  if (classData.params?.length > 0) {
    output += '    constructor(';
    output += classData.params
      .map(param => generateParamDeclaration(param, { currentClass: className, isInsideNamespace: true }))
      .join(', ');
    output += ');\n\n';
  }
  
  const options = { currentClass: className, isInsideNamespace: true };
  const originalClassName = classData.name;
  
  // Class methods
  const classMethodsList = Object.values(processed.classMethods[originalClassName] || {});
  const staticMethods = classMethodsList.filter(method => method.static);
  const instanceMethods = classMethodsList.filter(method => !method.static);
  
  staticMethods.forEach(method => {
    output += generateMethodDeclaration(method, options);
  });
  
  instanceMethods.forEach(method => {
    output += generateMethodDeclaration(method, options);
  });
  
  output += '  }\n\n';
  return output;
}

// Generate TypeScript definitions
function generateTypeDefinitions() {
  let output = '// This file is auto-generated from JSDoc documentation\n\n';
  
  // First, define all constants at the top level with their actual values
  const p5Constants = processed.classitems.filter(item => 
    item.class === 'p5' && item.itemtype === 'property' && item.name in processed.consts
  );
  
  p5Constants.forEach(constant => {
    if (constant.description) {
      output += '/**\n';
      output += formatJSDocComment(constant.description, 0) + '\n';
      output += ' */\n';
    }
    const type = convertTypeToTypeScript(constant.type, { isInsideNamespace: false });
    output += `declare const ${constant.name}: ${type};\n\n`;
    // Duplicate with a private identifier so we can re-export in the namespace later
    output += `declare const __${constant.name}: typeof ${constant.name};\n\n`;
  });
  
  // Generate main p5 class
  output += 'declare class p5 {\n';
  output += '  constructor(sketch?: (p: p5) => void, node?: HTMLElement, sync?: boolean);\n\n';
  
  const p5Options = { currentClass: 'p5', isInsideNamespace: false };
  
  // Generate p5 static methods
  const p5StaticMethods = Object.values(processed.classMethods.p5 || {}).filter(method => method.static);
  p5StaticMethods.forEach(method => {
    output += generateMethodDeclaration(method, p5Options);
  });
  
  // Generate p5 instance methods
  const p5InstanceMethods = Object.values(processed.classMethods.p5 || {}).filter(method => !method.static);
  p5InstanceMethods.forEach(method => {
    output += generateMethodDeclaration(method, p5Options);
  });
  
  // Add constants as both instance and static properties (referencing the top-level constants)
  p5Constants.forEach(constant => {
    output += `  readonly ${constant.name}: typeof ${constant.name};\n`;
    // output += `  static readonly ${constant.name}: typeof __${constant.name};\n\n`;
  });
  
  output += '}\n\n';

  output += 'declare const __p5: typeof p5;\n\n';
  
  // Generate p5 namespace
  output += 'declare namespace p5 {\n';
  output += '  const p5: typeof __p5;\n';

  output += '\n';


  p5Constants.forEach(constant => {
    output += `const ${constant.name}: typeof __${constant.name};\n`;
  });

  output += '\n';
  
  // Generate other classes in namespace
  Object.values(processed.classes).forEach(classData => {
    if (classData.name !== 'p5') {
      output += generateClassDeclaration(classData);
    }
  });

  // Generate placeholder types for private classes that we need to be able to
  // reference, but have no public APIs
  const privateClasses = ['Renderer', 'Renderer2D', 'RendererGL', 'FramebufferTexture', 'Texture', 'Quat'];
  for (const className of privateClasses) {
    output += `  class ${className} {}\n`;
  }
  
  output += '}\n\n';
  
  // Export declarations
  output += 'export default p5;\n';
  output += 'export as namespace p5;\n';

  const instanceDefinitions = output;

  let globalDefinitions = `// This file is auto-generated from JSDoc documentation

import P5 from './p5';

declare global {
interface Window {

p5: P5;
`;

  p5Constants.forEach(constant => {
    if (constant.description) {
      globalDefinitions += '/**\n';
      globalDefinitions += formatJSDocComment(constant.description, 0) + '\n';
      globalDefinitions += ' */\n';
    }
    globalDefinitions += `${constant.name}: typeof P5.${constant.name};\n\n`;
  });

  const globalP5Methods = Object.values(processed.classMethods.p5 || {})
    .filter(method => !method.static && method.name !== 'p5');
  globalP5Methods.forEach(method => {
    globalDefinitions += generateMethodDeclaration(method, { currentClass: 'p5', isInsideNamespace: true, global: true });
  });

  globalDefinitions += '}\n\n';
  globalDefinitions += '}\n\n';
  
  return { instanceDefinitions, globalDefinitions };
}

// Generate and write TypeScript definitions
const { instanceDefinitions, globalDefinitions } = generateTypeDefinitions();

fs.writeFileSync(path.join(__dirname, '../types/p5.d.ts'), instanceDefinitions);
fs.writeFileSync(path.join(__dirname, '../types/global.d.ts'), globalDefinitions);

console.log('TypeScript definitions generated successfully!');