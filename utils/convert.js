const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/data.json')));
const allData = data.flatMap(entry => {
  return [
    entry,
    ...entry.members.global,
    ...entry.members.inner,
    ...entry.members.instance,
    ...entry.members.events,
    ...entry.members.static
  ];
});

const converted = {
  project: {}, // Unimplemented, probably not needed
  files: {}, // Unimplemented, probably not needed
  modules: {},
  classes: {},
  classitems: [],
  warnings: [], // Intentionally unimplemented
  consts: {}
};

function descriptionString(node) {
  if (!node) {
    return '';
  } else if (node.type === 'text') {
    return node.value;
  } else if (node.type === 'paragraph') {
    return '<p>' + node.children.map(n => descriptionString(n)).join('') + '</p>';
  } else if (node.type === 'includeCode') {
    return '<code>' + node.value + '</code>';
  } else if (node.value) {
    return node.value;
  } else if (node.children) {
    return node.children.map(n => descriptionString(n)).join('');
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
    const args = node.applications.map(n => typeObject(n).type);
    return {
      type: `${typeName}<${args.join(', ')}>`
    };
  } else if (node.type === 'UndefinedLiteral') {
    return { type: 'undefined' };
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
  converted.modules[key] = submodules[key];
}

function getModuleInfo(entry) {
  const file = entry.context.file;
  let { module, submodule, for: forEntry } = fileModuleInfo[file] || {};
  forEntry = entry.memberof || forEntry;
  return { module, submodule, forEntry };
}

// ============================================================================
// Constants
// ============================================================================
for (const entry of allData) {
  if (entry.kind === 'constant') {
    constUsage[entry.name] = new Set();
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
      extends: entry.augments && entry.augments[0] && entry.augments[0].name,
      description: descriptionString(entry.description),
      example: entry.examples.map(getExample),
      alt: getAlt(entry),
      params: entry.params.map(p => {
        return {
          name: p.name,
          description: p.description && descriptionString(p.description),
          ...typeObject(p.type)
        };
      }),
      return: entry.returns[0] && {
        description: descriptionString(entry.returns[0].description),
        ...typeObject(entry.returns[0].type).name
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
  const memberof = entry.memberof;
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

    // If a previous version of this same method exists, then this is probably
    // an overload on that method
    const prevItem = (classMethods[entry.memberof] || {})[entry.name] || {};

    const className = entry.memberof || prevItem.class || forEntry;

    // Ignore methods of private classes
    if (!converted.classes[className]) continue;

    // Ignore private methods. @private-tagged ones don't show up in the JSON,
    // but we also implicitly use this _-prefix convension.
    const isPrivate = entry.name.startsWith('_');
    if (isPrivate) continue;

    for (const param of entry.params) {
      registerConstantUsage(entry.name, className, param.type);
    }
    if (entry.returns[0]) {
      registerConstantUsage(entry.returns[0].type);
    }

    const item = {
      name: entry.name,
      ...locationInfo(entry),
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
          params: entry.params.map(p => {
            return {
              name: p.name,
              description: p.description && descriptionString(p.description),
              ...typeObject(p.type)
            };
          }),
          return: entry.returns[0] && {
            description: descriptionString(entry.returns[0].description),
            ...typeObject(entry.returns[0].type).name
          }
        }
      ],
      return: prevItem.return || entry.returns[0] && {
        description: descriptionString(entry.returns[0].description),
        ...typeObject(entry.returns[0].type).name
      },
      class: className,
      module,
      submodule
    };

    classMethods[entry.memberof] = classMethods[entry.memberof] || {};
    classMethods[entry.memberof][entry.name] = item;
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

fs.writeFileSync(path.join(__dirname, '../docs/converted.json'), JSON.stringify(converted, null, 2));
