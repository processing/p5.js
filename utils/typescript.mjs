import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { processData } from './data-processor.mjs';
import { descriptionStringForTypeScript } from './shared-helpers.mjs';
import { applyPatches } from './patch.mjs';

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
const typedefs = {};
const mutableProperties = new Set(['disableFriendlyErrors']); // Properties that should be mutable, not constants
allRawData.forEach(entry => {
  if (entry.kind === 'constant' || entry.kind === 'typedef') {
    constantsLookup.add(entry.name);
    if (entry.kind === 'typedef') {
      typedefs[entry.name] = entry.type;
    }
  }
});

// TypeScript-specific type conversion from raw type objects
function convertTypeToTypeScript(typeNode, options = {}) {
  if (!typeNode) return 'any';
  
  // Validate that typeNode is always an object
  if (typeof typeNode !== 'object' || Array.isArray(typeNode)) {
    throw new Error(`convertTypeToTypeScript expects an object, got: ${typeof typeNode} - ${JSON.stringify(typeNode)}`);
  }
  
  const { currentClass = null, isInsideNamespace = false, inGlobalMode = false, isConstantDef = false } = options;
  
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
        if (inGlobalMode) {
          return 'P5.' + typeName.substring(3);
        } else {
          return typeName.substring(3);
        }
      }
      
      // Check if this is a p5 constant - use typeof since they're defined as values
      if (constantsLookup.has(typeName)) {
        if (inGlobalMode) {
          return `typeof P5.${typeName}`;
        } else if (typedefs[typeName]) {
          if (isConstantDef) {
            return convertTypeToTypeScript(typedefs[typeName], options);
          } else {
            return `typeof p5.${typeName}`
          }
        } else {
          return `Symbol`;
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
  
  processType: (type, param) => {
    // Return an object with the original type preserved
    // This matches the expected data structure from the data processor
    const result = {
      type: type, // Keep the original raw type object
      originalType: type // Also store it here for clarity
    };
    
    // Extract optional flag from OptionalType
    if (type?.type === 'OptionalType') {
      result.optional = true;
    }
    
    // Extract rest flag from RestType
    if (type?.type === 'RestType') {
      result.rest = true;
    }
    
    // Preserve properties array for nested object parameters
    if (param && param.properties) {
      result.properties = param.properties;
    }
    
    return result;
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

function generateObjectInterface(param, allParams, options = {}) {
  // Check if this is an object parameter (either required or optional)
  const isObjectParam = param.type && (
    (param.type.type === 'OptionalType' && param.type.expression?.name === 'Object') ||
    (param.type.type === 'NameExpression' && param.type.name === 'Object')
  );
  
  if (!isObjectParam || !param.name) {
    return null;
  }

  let nestedParams = [];


  // First, check if the parameter has a properties array (JSDoc properties field)
  if (param.properties && Array.isArray(param.properties)) {
    nestedParams = param.properties.filter(prop => 
      prop.name && prop.name.startsWith(param.name + '.')
    );
  }

  // Fallback: Look for nested parameters with dot notation in allParams
  if (nestedParams.length === 0) {
    nestedParams = allParams.filter(p => 
      p.name && p.name.startsWith(param.name + '.') && p.name !== param.name
    );
  }

  if (nestedParams.length === 0) {
    return null;
  }

  // Generate interface properties
  const properties = nestedParams.map(nestedParam => {
    const propName = nestedParam.name.substring(param.name.length + 1); // Remove 'paramName.' prefix
    const propType = nestedParam.type ? convertTypeToTypeScript(nestedParam.type, options) : 'any';
    // Properties are optional if they have a default value or are explicitly marked as optional
    const isOptional = nestedParam.optional || nestedParam.type?.type === 'OptionalType' || nestedParam.default !== undefined;
    return `${propName}${isOptional ? '?' : ''}: ${propType}`;
  });

  return `{ ${properties.join('; ')} }`;
}

function generateParamDeclaration(param, options = {}, allParams = []) {
  if (!param) return '';
  
  const name = normalizeIdentifier(param.name);
  
  // Check if this is an object parameter that we can generate a better interface for
  const objectInterface = generateObjectInterface(param, allParams, options);
  
  // Convert the type - should always be an object
  let type = 'any';
  if (objectInterface) {
    type = objectInterface;
  } else if (param.type) {
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
  const { globalFunction = false } = options;
  
  const indent = globalFunction ? '' : '  ';
  const commentIndent = globalFunction ? 0 : 2;
  
  if (method.description) {
    output += `${indent}/**\n`;
    output += formatJSDocComment(method.description, commentIndent) + '\n';
    
    // Add param docs from first overload
    if (method.overloads?.[0]?.params) {
      method.overloads[0].params.forEach(param => {
        if (param.description) {
          output += formatJSDocComment(`@param ${param.name} ${param.description}`, commentIndent) + '\n';
        }
      });
    }
    
    // Add return docs
    if (method.return?.description) {
      output += formatJSDocComment(`@returns ${method.return.description}`, commentIndent) + '\n';
    }
    
    output += `${indent} */\n`;
  }
  
  const staticPrefix = method.static ? 'static ' : '';
  const declarationPrefix = globalFunction ? 'function ' : `${indent}${staticPrefix}`;
  
  // Generate overload declarations
  if (method.overloads && method.overloads.length > 0) {
    method.overloads.forEach(overload => {
      const params = (overload.params || [])
        .map(param => generateParamDeclaration(param, options, overload.params))
        .join(', ');
      
      let returnType = 'void';
      if (method.chainable && !globalFunction && options.currentClass !== 'p5') {
        returnType = options.currentClass || 'this';
        // TODO: Decide what should be chainable. Many of these are accidental / not thought through
      } else if (overload.return && overload.return.type) {
        returnType = convertTypeToTypeScript(overload.return.type, options);
      } else if (method.return && method.return.type) {
        returnType = convertTypeToTypeScript(method.return.type, options);
      }
      
      output += `${declarationPrefix}${method.name}(${params}): ${returnType};\n`;
    });
  }
  
  output += '\n';
  return output;
}

function generateClassDeclaration(classData) {
  let output = '';
  const className = classData.name.startsWith('p5.') ? classData.name.substring(3) : classData.name;
  const actualClassName = className === 'Graphics' ? '__Graphics' : className;
  
  if (classData.description) {
    output += '  /**\n';
    output += formatJSDocComment(classData.description, 2) + '\n';
    output += '   */\n';
  }
  
  const extendsClause = classData.extends ? ` extends ${classData.extends}` : '';
  output += `  class ${actualClassName}${extendsClause} {\n`;
  
  // Constructor
  if (classData.params?.length > 0) {
    output += '    constructor(';
    output += classData.params
      .map(param => generateParamDeclaration(param, { currentClass: className, isInsideNamespace: true }, classData.params))
      .join(', ');
    output += ');\n\n';
  }
  
  const options = { currentClass: className, isInsideNamespace: true };
  const originalClassName = classData.name;
  
  // Class methods
  const classMethodsList = Object.values(processed.classMethods[originalClassName] || {});
  const methodNames = new Set(classMethodsList.map(method => method.name));

  // Class properties
  const classProperties = processed.classitems.filter(item => 
    item.class === originalClassName && item.itemtype === 'property'
  );
  
  classProperties.forEach(prop => {
    // Skip properties that conflict with method names
    if (methodNames.has(prop.name)) {
      return;
    }
    
    if (prop.description) {
      output += '    /**\n';
      output += formatJSDocComment(prop.description, 4) + '\n';
      output += '     */\n';
    }
    const type = convertTypeToTypeScript(prop.type, options);
    output += `    ${prop.name}: ${type};\n\n`;
  });
  const staticMethods = classMethodsList.filter(method => method.static);
  const instanceMethods = classMethodsList.filter(method => !method.static);
  
  staticMethods.forEach(method => {
    output += generateMethodDeclaration(method, options);
  });
  
  instanceMethods.forEach(method => {
    output += generateMethodDeclaration(method, options);
  });
  
  output += '  }\n\n';
  
  // Add type alias for Graphics
  if (className === 'Graphics') {
    output += '  type Graphics = __Graphics & p5;\n\n';
  }
  
  return output;
}

// Generate TypeScript definitions
function generateTypeDefinitions() {
  let output = '// This file is auto-generated from JSDoc documentation\n\n';
  
  // First, define all constants at the top level with their actual values
  const seenConstants = new Set();
  const p5Constants = processed.classitems.filter(item => {
    if (item.class === 'p5' && item.itemtype === 'property' && item.name in processed.consts) {
      // Skip defineProperty, undefined and avoid duplicates
      if (item.name === 'defineProperty' || !item.name) {
        return false;
      }
      if (seenConstants.has(item.name)) {
        return false;
      }
      seenConstants.add(item.name);
      return true;
    }
    return false;
  });
  
  p5Constants.forEach(constant => {
    if (constant.description) {
      output += '/**\n';
      output += formatJSDocComment(constant.description, 0) + '\n';
      output += ' */\n';
    }
    const type = convertTypeToTypeScript(constant.type, { isInsideNamespace: false, isConstantDef: true });
    const isMutable = mutableProperties.has(constant.name);
    const declaration = isMutable ? 'declare let' : 'declare const';
    output += `${declaration} ${constant.name}: ${type};\n\n`;
    // Duplicate with a private identifier so we can re-export in the namespace later
    output += `${declaration} __${constant.name}: typeof ${constant.name};\n\n`;
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
    const isMutable = mutableProperties.has(constant.name);
    const readonly = isMutable ? '' : 'readonly ';
    output += `  ${readonly}${constant.name}: typeof ${constant.name};\n`;
  });
  
  output += '}\n\n';

  output += 'declare const __p5: typeof p5;\n\n';
  
  // Generate p5 namespace
  output += 'declare namespace p5 {\n';
  output += '  const p5: typeof __p5;\n';

  output += '\n';


  p5Constants.forEach(constant => {
    output += `${mutableProperties.has(constant.name) ? 'let' : 'const'} ${constant.name}: typeof __${constant.name};\n`;
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
  // Define base classes for private classes, if they should extend something
  const privateClassBases = { Renderer: 'Element' };
  for (const className of privateClasses) {
    const baseClass = privateClassBases[className];
    if (baseClass) {
      output += `  class ${className} extends ${baseClass} {}\n`;
    } else {
      output += `  class ${className} {}\n`;
    }
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
    globalDefinitions += generateMethodDeclaration(method, { currentClass: 'p5', isInsideNamespace: true, inGlobalMode: true });
  });
  
  globalDefinitions += '}\n';

  // Add global p5 namespace with all class types and constants
  globalDefinitions += '\nnamespace p5 {\n';
  
  // Add all constants
  p5Constants.forEach(constant => {
    const isMutable = mutableProperties.has(constant.name);
    const declaration = isMutable ? 'let' : 'const';
    globalDefinitions += `  ${declaration} ${constant.name}: typeof P5.${constant.name};\n`;
  });
  
  globalDefinitions += '\n';
  
  // Add all real classes as both types and constructors
  Object.values(processed.classes).forEach(classData => {
    if (classData.name !== 'p5') {
      const className = classData.name.startsWith('p5.') ? classData.name.substring(3) : classData.name;
      // For Graphics, use __Graphics for constructor
      if (className === 'Graphics') {
        globalDefinitions += `  type ${className} = P5.${className};\n`;
        globalDefinitions += `  const ${className}: typeof P5.__${className};\n`;
      } else {
        globalDefinitions += `  type ${className} = P5.${className};\n`;
        globalDefinitions += `  const ${className}: typeof P5.${className};\n`;
      }
    }
  });
  
  // Add private classes
  for (const className of privateClasses) {
    globalDefinitions += `  type ${className} = P5.${className};\n`;
    globalDefinitions += `  const ${className}: typeof P5.${className};\n`;
  }

  globalDefinitions += '}\n\n';

  // Also declare constants in global scope (deduplicated)
  const alreadyDeclaredConstants = new Set();
  p5Constants.forEach(constant => {
    if (alreadyDeclaredConstants.has(constant.name)) {
      return; // Skip duplicates
    }
    if (constant.name === 'defineProperty' || !constant.name) {
      return; // Skip problematic constants
    }
    alreadyDeclaredConstants.add(constant.name);
    
    if (constant.description) {
      globalDefinitions += '/**\n';
      globalDefinitions += formatJSDocComment(constant.description, 0) + '\n';
      globalDefinitions += ' */\n';
    }
    globalDefinitions += `const ${constant.name}: typeof P5.${constant.name};\n\n`;
  });

  // Also declare functions in global scope
  globalP5Methods.forEach(method => {
    globalDefinitions += generateMethodDeclaration(method, { currentClass: 'p5', isInsideNamespace: true, inGlobalMode: true, globalFunction: true });
  });

  globalDefinitions += '}\n\n';
  
  return { instanceDefinitions, globalDefinitions };
}

// Generate and write TypeScript definitions
const { instanceDefinitions, globalDefinitions } = generateTypeDefinitions();

fs.writeFileSync(path.join(__dirname, '../types/p5.d.ts'), instanceDefinitions);
fs.writeFileSync(path.join(__dirname, '../types/global.d.ts'), globalDefinitions);

console.log('TypeScript definitions generated successfully!');

// Apply patches
console.log('Applying TypeScript patches...');
applyPatches();