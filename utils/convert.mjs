import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllEntries } from './helper.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/data.json')));

const allData = getAllEntries(data);

const converted = {
  project: {}, // Unimplemented, probably not needed
  files: {}, // Unimplemented, probably not needed
  modules: {},
  classes: {},
  classitems: [],
  warnings: [], // Intentionally unimplemented
  consts: {}
};

function descriptionString(node, parent) {
  if (!node) {
    return '';
  } else if (node.type === 'text') {
    return node.value;
  } else if (node.type === 'paragraph') {
    const content = node.children.map(n => descriptionString(n, node)).join('');
    if (parent && parent.children.length === 1) return content;
    return '<p>' + content + '</p>\n';
  } else if (node.type === 'code') {
    let classes = [];
    let attrs = '';
    if (node.lang) {
      classes.push(`language-${node.lang}`);
    }
    if (node.meta) {
      classes.push(node.meta);
    }
    if (classes.length > 0) {
      attrs = ` class="${classes.join(' ')}"`;
    }
    return `<pre><code${attrs}>${node.value}</code></pre>`;
  } else if (node.type === 'inlineCode') {
    return '<code>' + node.value + '</code>';
  } else if (node.type === 'list') {
    const tag = node.type === 'ordered' ? 'ol' : 'ul';
    return `<${tag}>` + node.children.map(n => descriptionString(n, node)).join('') + `</${tag}>`;
  } else if (node.type === 'listItem') {
    return '<li>' + node.children.map(n => descriptionString(n, node)).join('') + '</li>';
  } else if (node.value) {
    return node.value;
  } else if (node.children) {
    return node.children.map(n => descriptionString(n, node)).join('');
  } else {
    return '';
  }
}

function typeObject(node) {
  if (!node) return {};

  if (node.type === 'OptionalType') {
    return { optional: 1, ...typeObject(node.expression) };
  } else if (node.type === 'UnionType') {
    const names = node.elements.map(n => typeObject(n).type);
    return {
      type: names.join('|')
    };
  } else if (node.type === 'TypeApplication') {
    const { type: typeName } = typeObject(node.expression);
    if (
      typeName === 'Array' &&
      node.applications.length === 1
    ) {
      return {
        type: `${typeObject(node.applications[0]).type}[]`
      };
    }
    const args = node.applications.map(n => typeObject(n).type);
    return {
      type: `${typeName}<${args.join(', ')}>`
    };
  } else if (node.type === 'UndefinedLiteral') {
    return { type: 'undefined' };
  } else if (node.type === 'FunctionType') {
    // Map each parameter node to its type representation.
    const parameters = node.params.map(p => typeObject(p));

    // If a return type exists, extract its type; otherwise leave undefined.
    const returnType = node.result ? typeObject(node.result).type : undefined;

    // Return a structured representation of the function type:
    // - 'type' is a label indicating it's a function
    // - 'parameters' is an array of parameter type objects
    // - 'returnType' is included only if it's defined
    return {
      type: 'Function',
      parameters,
      ...(returnType && { returnType }) // conditionally include returnType
    };
  } else if (node.type === 'ArrayType') {
    return { type: `[${node.elements.map(e => typeObject(e).type).join(', ')}]` };
  } else if (node.type === 'RestType') {
    return { type: typeObject(node.expression).type, rest: true };
  } else {
    // TODO
    // - handle record types
    return { type: node.name };
  }
}

const constUsage = {};
function registerConstantUsage(name, memberof, node) {
  if (!node) return;
  if (node.type === 'OptionalType') {
    registerConstantUsage(name, memberof, node.expression);
  } else if (node.type === 'UnionType') {
    for (const element of node.elements) {
      registerConstantUsage(name, memberof, element);
    }
  } else if (node.type === 'TypeApplication') {
    registerConstantUsage(name, memberof, node.expression);
    for (const element of node.applications) {
      registerConstantUsage(name, memberof, element);
    }
  } else if (node.type === 'NameExpression') {
    const constant = constUsage[node.name];
    if (constant) {
      constant.add(`${memberof}.${name}`);
    }
  }
}

function locationInfo(node) {
  return {
    file: node.context.file.slice(node.context.file.indexOf('src/')),
    line: node.context.loc.start.line
  };
}

function deprecationInfo(node) {
  if (!node.deprecated) {
    return {};
  }

  return { deprecated: true, deprecationMessage: descriptionString(node.deprecated) };
}

function getExample(node) {
  return node.description;
}

function getAlt(node) {
  return node
    .tags
    .filter(tag => tag.title === 'alt')
    .map(tag => tag.description)
    .join('\n') || undefined;
}

// ============================================================================
// Modules
// ============================================================================
const fileModuleInfo = {};
const modules = {};
const submodules = {};
for (const entry of allData) {
  if (entry.tags.some(tag => tag.title === 'module')) {
    const module = entry.tags.find(tag => tag.title === 'module').name;

    const submoduleTag = entry.tags.find(tag => tag.title === 'submodule');
    const submodule = submoduleTag ? submoduleTag.description : undefined;

    // TODO handle methods in classes that don't have this
    const forTag = entry.tags.find(tag => tag.title === 'for');
    const forEntry = forTag ? forTag.description : undefined;

    const file = entry.context.file;

    // Record what module/submodule each file is attached to so that we can
    // look this info up for each method based on its file
    fileModuleInfo[file] = fileModuleInfo[file] || {
      module: undefined,
      submodule: undefined,
      for: undefined
    };
    fileModuleInfo[file].module = module;
    fileModuleInfo[file].submodule =
      fileModuleInfo[file].submodule || submodule;
    fileModuleInfo[file].for =
      fileModuleInfo[file].for || forEntry;

    modules[module] = modules[module] || {
      name: module,
      submodules: {},
      classes: {}
    };
    if (submodule) {
      modules[module].submodules[submodule] = 1;
      submodules[submodule] = submodules[submodule] || {
        name: submodule,
        module,
        is_submodule: 1
      };
    }
  }
}
for (const key in modules) {
  converted.modules[key] = modules[key];
}
for (const key in submodules) {
  // Some modules also list themselves as  submodules as a default category
  // of sorts. Skip adding these submodules to not overwrite the module itself.
  if (converted.modules[key]) continue;
  converted.modules[key] = submodules[key];
}

function getModuleInfo(entry) {
  const entryForTag = entry.tags.find(tag => tag.title === 'for');
  const entryForTagValue = entryForTag && entryForTag.description;
  const file = entry.context.file;
  let { module, submodule, for: forEntry } = fileModuleInfo[file] || {};
  let memberof = entry.memberof;
  if (memberof === 'fn') memberof = 'p5';
  if (memberof && memberof !== 'p5' && !memberof.startsWith('p5.')) {
    memberof = 'p5.' + memberof;
  }
  forEntry = memberof || entryForTagValue || forEntry;
  return { module, submodule, forEntry };
}

function getParams(entry) {
  // Documentation.js seems to try to grab params from the function itself in
  // the code if we don't document all the parameters. This messes with our
  // manually-documented overloads. Instead of using the provided entry.params
  // array, we'll instead only rely on manually included @param tags.
  //
  // However, the tags don't include a tree-structured description field, and
  // instead convert it to a string. We want a slightly different conversion to
  // string, so we match these params to the Documentation.js-provided `params`
  // array and grab the description from those.

  const paramsMap = {};

  // Build a nested parameter structure from tag names like "options.width"
  for (const tag of (entry.tags || [])) {
    if (tag.title !== 'param') continue;

    const path = tag.name.split('.');
    const typeInfo = typeObject(tag.type);

    let current = paramsMap;

    for (let i = 0; i < path.length; i++) {
      const key = path[i];

      if (i === path.length - 1) {
        // Leaf node: assign the type info directly
        current[key] = { ...typeInfo };

        // If the param is a function, populate parameters explicitly (only if not already done)
        if (
          typeInfo.type === 'Function' &&
          !current[key].parameters &&
          tag.type?.expression?.type === 'FunctionType'
        ) {
          current[key].parameters = tag.type.expression.params.map(p => typeObject(p));
        }

      } else {
        // Intermediate node: create object structure for nested params
        current[key] = current[key] || { type: 'Object', optional: true, properties: {} };

        // Ensure properties object exists
        if (!current[key].properties) {
          current[key].properties = {};
        }

        // Traverse deeper
        current = current[key].properties;
      }
    }
  }

  // Flatten top-level entries into an array, preserving name
  return Object.entries(paramsMap).map(([key, val]) => ({ name: key, ...val }));
}



// ============================================================================
// Constants
// ============================================================================
for (const entry of allData) {
  if (entry.kind === 'constant' || entry.kind === 'typedef') {
    constUsage[entry.name] = constUsage[entry.name] || new Set();

    const { module, submodule, forEntry } = getModuleInfo(entry);

    const examples = entry.examples.map(getExample);
    const item = {
      itemtype: 'property',
      name: entry.name,
      ...locationInfo(entry),
      ...typeObject(entry.type),
      ...deprecationInfo(entry),
      description: descriptionString(entry.description),
      example: examples.length > 0 ? examples : undefined,
      alt: getAlt(entry),
      module,
      submodule,
      class: forEntry || 'p5'
    };

    converted.classitems.push(item);
  }
}

// ============================================================================
// Classes
// ============================================================================
for (const entry of allData) {
  if (entry.kind === 'class') {
    const { module, submodule } = getModuleInfo(entry);

    const item = {
      name: entry.name,
      ...locationInfo(entry),
      ...deprecationInfo(entry),
      extends: entry.augments && entry.augments[0] && entry.augments[0].name,
      description: descriptionString(entry.description),
      example: entry.examples.map(getExample),
      alt: getAlt(entry),

      // getParams(entry) returns full structured and formatted parameter Objects
      params: getParams(entry),

      return: entry.returns[0] && {
        description: descriptionString(entry.returns[0].description),
        ...typeObject(entry.returns[0].type)
      },
      is_constructor: 1,
      module,
      submodule
    };

    // The @private tag doesn't seem to end up in the Documentation.js output.
    // However, it also doesn't seem to grab the description in this case, so
    // I'm using this as a proxy to let us know that a class should be private.
    // This means any public class *must* have a description.
    const isPrivate = !item.description;
    if (!isPrivate) {
      converted.classes[item.name] = item;
    }
  }
}

// ============================================================================
// Class properties
// ============================================================================
const propDefs = {};

// Grab properties out of the class nodes. These should have all the properties
// but very little of their metadata.
for (const entry of allData) {
  if (entry.kind !== 'class') continue;

  // Ignore private classes
  if (!converted.classes[entry.name]) continue;

  if (!entry.properties) continue;

  const { module, submodule } = getModuleInfo(entry);
  const location = locationInfo(entry);
  propDefs[entry.name] = propDefs[entry.name] || {};

  for (const property of entry.properties) {
    const item = {
      itemtype: 'property',
      name: property.name,
      ...location,
      line: property.lineNumber || location.line,
      ...typeObject(property.type),
      ...deprecationInfo(entry),
      module,
      submodule,
      class: entry.name
    };
    propDefs[entry.name][property.name] = item;
  }
}

// Grab property metadata out of other loose nodes.
for (const entry of allData) {
  // These are in a different section
  if (entry.kind === 'constant') continue;

  const { module, submodule, forEntry } = getModuleInfo(entry);
  const propTag = entry.tags.find(tag => tag.title === 'property');
  const forTag = entry.tags.find(tag => tag.title === 'for');
  let memberof = entry.memberof;
  if (memberof === 'fn') memberof = 'p5';
  if (memberof && memberof !== 'p5' && !memberof.startsWith('p5.')) {
    memberof = 'p5.' + memberof;
  }
  if (!propTag || (!forEntry && !forTag && !memberof)) continue;

  const forName = memberof || (forTag && forTag.description) || forEntry;
  propDefs[forName] = propDefs[forName] || {};
  const classEntry = propDefs[forName];
  if (!classEntry) continue;

  registerConstantUsage(entry.type);

  const prop = classEntry[propTag.name] || {
    itemtype: 'property',
    name: propTag.name,
    ...locationInfo(entry),
    ...typeObject(propTag.type),
    ...deprecationInfo(entry),
    module,
    submodule,
    class: forName
  };

  const updated = {
    ...prop,
    example: entry.examples.map(getExample),
    alt: getAlt(entry),
    description: descriptionString(entry.description)
  };
  classEntry[propTag.name] = updated;
}

// Add to the list
for (const className in propDefs) {
  for (const propName in propDefs[className]) {
    converted.classitems.push(propDefs[className][propName]);
  }
}

// ============================================================================
// Class methods
// ============================================================================
const classMethods = {};
for (const entry of allData) {
  if (entry.kind === 'function' && entry.properties.length === 0) {
    const { module, submodule, forEntry } = getModuleInfo(entry);

    let memberof = entry.memberof;
    if (memberof === 'fn') memberof = 'p5';
    if (memberof && memberof !== 'p5' && !memberof.startsWith('p5.')) {
      memberof = 'p5.' + memberof;
    }

    // Ignore functions that aren't methods
    if (entry.tags.some(tag => tag.title === 'function')) continue;

    // If a previous version of this same method exists, then this is probably
    // an overload on that method
    const prevItem = (classMethods[memberof] || {})[entry.name] || {};

    const className = memberof || prevItem.class || forEntry;

    // Ignore methods of private classes
    if (!converted.classes[className]) continue;

    // Ignore private methods. @private-tagged ones don't show up in the JSON,
    // but we also implicitly use this _-prefix convension.
    const isPrivate = entry.name.startsWith('_');
    if (isPrivate) continue;

    for (const param of getParams(entry)) {
      registerConstantUsage(entry.name, className, param.type);
    }
    if (entry.returns[0]) {
      registerConstantUsage(entry.returns[0].type);
    }

    const item = {
      name: entry.name,
      ...locationInfo(entry),
      ...deprecationInfo(entry),
      itemtype: 'method',
      chainable: (prevItem.chainable || entry.tags.some(tag => tag.title === 'chainable'))
        ? 1
        : undefined,
      description: prevItem.description || descriptionString(entry.description),
      example: [
        ...(prevItem.example || []),
        ...entry.examples.map(getExample)
      ],
      alt: getAlt(entry),
      overloads: [
        ...(prevItem.overloads || []),
        {
          // getParams(entry) returns full structured and formatted parameter Objects
          params: getParams(entry),
          return: entry.returns[0] && {
            description: descriptionString(entry.returns[0].description),
            ...typeObject(entry.returns[0].type)
          }
        }
      ],
      return: prevItem.return || entry.returns[0] && {
        description: descriptionString(entry.returns[0].description),
        ...typeObject(entry.returns[0].type)
      },
      class: className,
      static: entry.scope === 'static' && 1,
      module,
      submodule
    };

    classMethods[memberof] = classMethods[memberof] || {};
    classMethods[memberof][entry.name] = item;
  }
}
for (const className in classMethods) {
  for (const methodName in classMethods[className]) {
    converted.classitems.push(classMethods[className][methodName]);
  }
}

// Done registering const usage, make a finished version
for (const key in constUsage) {
  converted.consts[key] = [...constUsage[key]];
}


// ============================================================================
// parameterData.json
// ============================================================================

function cleanUpClassItems(data) {
  for (const classItem in data) {
    if (typeof data[classItem] === 'object') {
      if (data[classItem].overloads) {
        delete data[classItem].name;
        delete data[classItem].class;
      }
      cleanUpClassItems(data[classItem]);
    }
  }

  // Recursively processes a parameter object to normalize its structure.
  // Handles function types, rest parameters, union types, array tuples, and nested properties.
  const processParam = param => {
    const result = {};

    if (!param.type) return result;

    // Handle function parameters
    if (param.type === 'Function') {
      result.type = 'Function';

      if (param.parameters) {
        // Convert numeric-keyed object or array to array of processed params
        if (Array.isArray(param.parameters)) {
          result.parameters = param.parameters.map(processParam);
        } else if (typeof param.parameters === 'object') {
          result.parameters = Object.values(param.parameters).map(processParam);
        }
      }

      if (param.optional) result.optional = true;
      if (param.rest) result.rest = true;
      return result;
    }

    // Handle rest parameters (e.g., "...string[]")
    let typeStr = param.type;
    if (typeStr.startsWith('...')) {
      result.rest = true;
      typeStr = typeStr.slice(3);
      if (typeStr.endsWith('[]')) {
        typeStr = typeStr.slice(0, -2);
      }
    }

    // Parse union type strings
    const parseUnion = unionStr => {
      const parts = [];
      let current = '';
      let bracketDepth = 0;

      for (const ch of unionStr) {
        if (ch === '[') bracketDepth++;
        if (ch === ']') bracketDepth--;
        if (ch === '|' && bracketDepth === 0) {
          parts.push(current.trim());
          current = '';
        } else {
          current += ch;
        }
      }
      if (current) parts.push(current.trim());

      return parts.map(part => {
        const arrayMatch = part.match(/^(.+)\[\]$/);
        if (arrayMatch) {
          return {
            type: "Array",
            element: arrayMatch[1],
            optional: true
          };
        }
        return {
          type: part,
          optional: true
        };
      });
    };

    // Handle array of tuples (e.g., [number, string][])
    const arrayTupleMatch = typeStr.match(/^\[(.+)\]\[\]$/);
    if (arrayTupleMatch) {
      const tupleStr = arrayTupleMatch[1];
      const elements = [];
      let current = '';
      let depth = 0;

      for (let i = 0; i < tupleStr.length; i++) {
        const ch = tupleStr[i];
        if (ch === '[') depth++;
        if (ch === ']') depth--;
        if (ch === ',' && depth === 0) {
          elements.push(current.trim());
          current = '';
        } else {
          current += ch;
        }
      }
      if (current) elements.push(current.trim());

      result.type = "Array";
      result.element = {
        type: "Tuple",
        elements: elements.map(el => {
          if (el.includes('|')) {
            return {
              type: "union",
              elements: parseUnion(el)
            };
          } else if (el.endsWith('[]')) {
            return {
              type: "Array",
              element: el.slice(0, -2),
              optional: true
            };
          } else {
            return { type: el };
          }
        })
      };
    } else if (typeStr.includes('|')) {
      // Handle union types
      result.type = "union";
      result.elements = parseUnion(typeStr);
    } else if (typeStr.match(/^(.+)\[\]$/)) {
      // Handle simple arrays
      const match = typeStr.match(/^(.+)\[\]$/);
      result.type = "Array";
      result.element = match[1];
    } else {
      // Simple type
      result.type = typeStr;
    }

    // Handle nested object properties
    if (param.properties) {
      result.properties = {};
      for (const [key, val] of Object.entries(param.properties)) {
        result.properties[key] = processParam(val);
      }
    }

    if (param.optional) result.optional = true;
    if (param.rest) result.rest = true;

    return result;
  };

  // Normalizes function overloads and removes duplicate signatures.
  const flattenOverloads = funcObj => {
    const result = {};

    const removeDuplicateOverloads = (overload, uniqueOverloads) => {
      const overloadString = JSON.stringify(overload);
      if (uniqueOverloads.has(overloadString)) return false;
      uniqueOverloads.add(overloadString);
      return true;
    };

    for (const [key, value] of Object.entries(funcObj)) {
      if (value && typeof value === 'object' && value.overloads) {
        const uniqueOverloads = new Set();

        result[key] = {
          overloads: Object.values(value.overloads || {})
            .map(overload => {
              return Array.isArray(overload.params)
                ? overload.params.map(processParam)
                : Object.values(overload.params || {}).map(processParam);
            })
            .filter(overload => removeDuplicateOverloads(overload, uniqueOverloads))
        };
      } else {
        result[key] = value;
      }
    }

    return result;
  };

  // Apply flattenOverloads to each class item
  for (const classItem in data) {
    if (typeof data[classItem] === 'object') {
      data[classItem] = flattenOverloads(data[classItem]);
    }
  }

  return data;
}
/**
 * Builds a filtered and simplified representation of documented class items.
 * Only includes items with overloads and required fields.
 * 
 * @param {Object} docs - Documentation object containing classitems.
 * @returns {Object} Cleaned class items grouped by class and name.
 */
function buildParamDocs(docs) {
  const newClassItems = {};
  const allowed = new Set(['name', 'class', 'params', 'overloads']);

  for (const classitem of docs.classitems) {
    // Skip non-function class items (those without overloads)
    if (classitem.name && classitem.class && classitem.hasOwnProperty('overloads')) {
      // Skip if already processed
      if (newClassItems[classitem.class]?.[classitem.name]) {
        continue;
      }

      // Normalize overloads
      classitem.overloads?.forEach(overload => {
        if (overload.params && !Array.isArray(overload.params)) {
          overload.params = Object.values(overload.params);
        }

        delete overload.line;
        delete overload.return;

        overload.params.forEach(param => {
          delete param.description;
          delete param.name;
        });
      });

      // Retain only allowed fields
      Object.keys(classitem).forEach(key => {
        if (!allowed.has(key)) delete classitem[key];
      });

      // Group by class and function name
      newClassItems[classitem.class] = newClassItems[classitem.class] || {};
      newClassItems[classitem.class][classitem.name] = classitem;
    }
  }
  const cleanedClassItems = cleanUpClassItems(newClassItems);
  let out = fs.createWriteStream(
    path.join(__dirname, '../docs/parameterData.json'),
    {
      flags: 'w',
      mode: '0644'
    }
  );

  out.write(JSON.stringify(cleanedClassItems, null, 2));
  out.end();
}

fs.mkdirSync(path.join(__dirname, '../docs/reference'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '../docs/reference/data.json'), JSON.stringify(converted, null, 2));
fs.writeFileSync(path.join(__dirname, '../docs/reference/data.min.json'), JSON.stringify(converted));
buildParamDocs(JSON.parse(JSON.stringify(converted)));

