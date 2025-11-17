import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { processData } from './data-processor.mjs';
import { descriptionString, typeObject } from './shared-helpers.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/data.json')));

// Generate documentation used in the p5.js reference. This data will get read in
// the p5.js-website repo: https://github.com/processing/p5.js-website/
const htmlStrategy = {
  shouldSkipEntry: (entry) =>
    // Skip static methods on p5.Vector for now because the names clash with
    // the non static versions
    entry.scope === 'static' &&
    entry.memberof === 'Vector' &&
    ['add', 'sub', 'mult', 'div', 'copy', 'rem', 'rotate', 'dot', 'cross', 'dist', 'lerp', 'slerp',
    'mag', 'magSq', 'normalize', 'limit', 'setMag', 'heading', 'angleBetween', 'reflect',
    'array', 'equals'].includes(entry.name),
  
  processDescription: (desc) => descriptionString(desc),
  
  processType: (type) => typeObject(type)
};

const processed = processData(data, htmlStrategy);

const converted = {
  project: {}, // Unimplemented, probably not needed
  files: {}, // Unimplemented, probably not needed
  modules: processed.modules,
  classes: processed.classes,
  classitems: processed.classitems,
  warnings: [], // Intentionally unimplemented
  consts: processed.consts
};


// Register constant usage for the original convert.mjs functionality
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

// Register constant usage from processed data
for (const item of converted.classitems) {
  if (item.itemtype === 'property' && (item.name in converted.consts || item.kind === 'constant' || item.kind === 'typedef')) {
    constUsage[item.name] = constUsage[item.name] || new Set();
  }
  if (item.itemtype === 'method') {
    for (const overload of item.overloads || []) {
      for (const param of overload.params || []) {
        registerConstantUsage(item.name, item.class, param.type);
      }
      if (overload.return) {
        registerConstantUsage(item.name, item.class, overload.return.type);
      }
    }
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

  // Reduce the amount of information in each function's overloads, while
  // keeping all the essential data available.
  const flattenOverloads = funcObj => {
    const result = {};

    const processOverload = overload => {
      if (overload.params) {
        return Object.values(overload.params).map(param => processParam(param));
      }
      return overload;
    };

    // To simplify `parameterData.json`, instead of having a separate field for
    // optional parameters, we'll add a ? to the end of parameter type to
    // indicate that it's optional.
    const processParam = param => {
      let type = param.type;
      if (param.optional) {
        type += '?';
      }
      if (param.rest) {
        type = `...${type}[]`;
      }
      return type;
    };

    // In some cases, even when the arguments are intended to mean different
    // things, their types and order are identical. Since the exact meaning
    // of the arguments is less important for parameter validation, we'll
    // perform overload deduplication here.
    const removeDuplicateOverloads = (overload, uniqueOverloads) => {
      const overloadString = JSON.stringify(overload);
      if (uniqueOverloads.has(overloadString)) {
        return false;
      }
      uniqueOverloads.add(overloadString);
      return true;
    };

    for (const [key, value] of Object.entries(funcObj)) {
      if (value && typeof value === 'object' && value.overloads) {
        const uniqueOverloads = new Set();
        result[key] = {
          overloads: Object.values(value.overloads)
            .map(overload => processOverload(overload))
            .filter(overload =>
              removeDuplicateOverloads(overload, uniqueOverloads)
            )
        };
      } else {
        result[key] = value;
      }
    }

    return result;
  };

  for (const classItem in data) {
    if (typeof data[classItem] === 'object') {
      data[classItem] = flattenOverloads(data[classItem]);
    }
  }

  return data;
}

function buildParamDocs(docs) {
  let newClassItems = {};
  // the fields we need—note that `name` and `class` are needed at this step because it's used to group classitems together. They will be removed later in cleanUpClassItems.
  let allowed = new Set(['name', 'class', 'params', 'overloads']);

  for (let classitem of docs.classitems) {
    // If `classitem` doesn't have overloads, then it's not a function—skip processing in this case
    if (classitem.name && classitem.class && classitem.hasOwnProperty('overloads')) {
      // Skip if the item already exists in newClassItems
      if (
        newClassItems[classitem.class] &&
        newClassItems[classitem.class][classitem.name]
      ) {
        continue;
      }

      // Clean up fields that will not be used in each classitem's overloads
      classitem.overloads?.forEach(overload => {
        delete overload.line;
        delete overload.return;
        overload.params.forEach(param => {
          delete param.description;
          delete param.name;
        });
      });

      Object.keys(classitem).forEach(key => {
        if (!allowed.has(key)) delete classitem[key];
      });

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

