import { getAllEntries } from './shared-helpers.mjs';
import { getParams } from './shared-helpers.mjs';

/**
 * Common data processing logic that can be used by both convert.mjs and typescript.mjs
 * with different strategies for type conversion and output formatting.
 */

export function processData(rawData, strategy) {
  const allData = getAllEntries(rawData);
  
  const processed = {
    modules: {},
    classes: {},
    classitems: [],
    consts: {},
    classMethods: {}
  };

  // Build module info lookup (exact same logic as convert.mjs)
  const fileModuleInfo = {};
  const modules = {};
  const submodules = {};
  
  for (const entry of allData) {
    if (entry.tags?.some(tag => tag.title === 'module')) {
      const module = entry.tags.find(tag => tag.title === 'module').name;
      const submoduleTag = entry.tags.find(tag => tag.title === 'submodule');
      const submodule = submoduleTag ? submoduleTag.description : undefined;
      const forTag = entry.tags.find(tag => tag.title === 'for');
      const forEntry = forTag ? forTag.description : undefined;
      const file = entry.context.file;

      fileModuleInfo[file] = fileModuleInfo[file] || {
        module: undefined,
        submodule: undefined,
        for: undefined
      };
      fileModuleInfo[file].module = module;
      fileModuleInfo[file].submodule = fileModuleInfo[file].submodule || submodule;
      fileModuleInfo[file].for = fileModuleInfo[file].for || forEntry;

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

  // Copy modules to processed data
  for (const key in modules) {
    processed.modules[key] = modules[key];
  }
  for (const key in submodules) {
    if (processed.modules[key]) continue;
    processed.modules[key] = submodules[key];
  }

  function getModuleInfo(entry) {
    const entryForTag = entry.tags?.find(tag => tag.title === 'for');
    const entryForTagValue = entryForTag?.description;
    const file = entry.context?.file;
    let { module, submodule, for: forEntry } = fileModuleInfo[file] || {};
    module = entry.tags?.find(tag => tag.title === 'module')?.description || module;
    submodule = entry.tags?.find(tag => tag.title === 'submodule')?.description || submodule;
    let memberof = entry.memberof;
    if (memberof === 'fn') memberof = 'p5';
    if (memberof && memberof !== 'p5' && !memberof.startsWith('p5.')) {
      memberof = 'p5.' + memberof;
    }
    forEntry = memberof || entryForTagValue || forEntry;
    return { module, submodule, forEntry };
  }

  function locationInfo(entry) {
    return {
      file: entry.context?.file ? entry.context.file.slice(entry.context.file.indexOf('src/')) : '',
      line: entry.context?.loc?.start?.line || 1
    };
  }

  function deprecationInfo(entry) {
    if (!entry.deprecated) {
      return {};
    }
    return {
      deprecated: true,
      deprecationMessage: strategy.processDescription(entry.deprecated)
    };
  }

  function getExample(entry) {
    return entry.description;
  }

  function getAlt(entry) {
    return entry
      .tags
      ?.filter(tag => tag.title === 'alt')
      ?.map(tag => tag.description)
      ?.join('\n') || undefined;
  }

  // Process constants, typedefs, and properties
  const processedNames = new Set();
  for (const entry of allData) {
    if (entry.kind === 'constant' || entry.kind === 'typedef' || entry.kind === 'property' ||
        (entry.properties && entry.properties.length > 0 && entry.properties[0].title === 'property') ||
        entry.tags?.some(tag => tag.title === 'property')) {
      const { module, submodule, forEntry } = getModuleInfo(entry);
      
      // Apply strategy filter
      if (strategy.shouldSkipEntry && strategy.shouldSkipEntry(entry, { module, submodule, forEntry })) {
        continue;
      }

      const name = entry.name ||
        (entry.properties || [])[0]?.name ||
        entry.tags?.find(t => t.title === 'property')?.name;
      
      // Skip duplicates based on name + class combination
      const key = `${name}:${forEntry || 'p5'}`;
      if (processedNames.has(key)) {
        continue;
      }
      processedNames.add(key);
      

      // For properties, get type from the property definition
      const propertyType = entry.properties?.[0]?.type || entry.type;

      const examples = entry.examples?.map(getExample) || [];
      const item = {
        itemtype: 'property',
        name,
        ...locationInfo(entry),
        ...strategy.processType(propertyType, entry),
        ...deprecationInfo(entry),
        description: strategy.processDescription(entry.description),
        example: examples.length > 0 ? examples : undefined,
        alt: getAlt(entry),
        module,
        submodule,
        class: forEntry || 'p5',
        beta: entry.tags?.some(t => t.title === 'beta') || undefined,
      };

      processed.classitems.push(item);
      processed.consts[name] = item;
    }
  }

  // Process classes
  for (const entry of allData) {
    if (entry.kind === 'class') {
      const { module, submodule } = getModuleInfo(entry);
      
      // Apply strategy filter
      if (strategy.shouldSkipEntry && strategy.shouldSkipEntry(entry, { module, submodule })) {
        continue;
      }

      const item = {
        name: entry.name,
        ...locationInfo(entry),
        ...deprecationInfo(entry),
        extends: entry.augments?.[0]?.name,
        description: strategy.processDescription(entry.description),
        example: entry.examples?.map(getExample) || [],
        alt: getAlt(entry),
        params: getParams(entry).map(p => ({
          name: p.name,
          description: p.description && strategy.processDescription(p.description),
          ...strategy.processType(p.type, p)
        })),
        return: entry.returns?.[0] && {
          description: strategy.processDescription(entry.returns[0].description),
          ...strategy.processType(entry.returns[0].type)
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
        processed.classes[item.name] = item;
      }
    }
  }

  // Process methods and functions
  for (const entry of allData) {
    if (entry.kind === 'function' && entry.properties?.length === 0) {
      const { module, submodule, forEntry } = getModuleInfo(entry);
      
      // Apply strategy filter
      if (strategy.shouldSkipEntry && strategy.shouldSkipEntry(entry, { module, submodule, forEntry })) {
        continue;
      }

      // Skip functions that aren't methods
      if (entry.tags?.some(tag => tag.title === 'function')) continue;

      let memberof = entry.memberof;
      if (memberof === 'fn') memberof = 'p5';
      if (memberof && memberof !== 'p5' && !memberof.startsWith('p5.')) {
        memberof = 'p5.' + memberof;
      }

      const className = memberof || forEntry || 'p5';
      
      // Skip private methods
      if (entry.name.startsWith('_')) continue;

      // Skip methods of private classes
      if (!processed.classes[className] && className !== 'p5') continue;

      // Check for existing method (overloads) - distinguish static vs instance
      const isStatic = entry.scope === 'static';
      const methodKey = isStatic ? `static_${entry.name}` : entry.name;
      const prevItem = processed.classMethods[className]?.[methodKey];

      const item = {
        name: entry.name,
        ...locationInfo(entry),
        ...deprecationInfo(entry),
        itemtype: 'method',
        chainable: (prevItem?.chainable || entry.tags?.some(tag => tag.title === 'chainable'))
          ? 1
          : undefined,
        description: prevItem?.description || strategy.processDescription(entry.description),
        example: [
          ...(prevItem?.example || []),
          ...entry.examples?.map(getExample) || []
        ],
        alt: getAlt(entry),
        overloads: [
          ...(prevItem?.overloads || []),
          {
            params: getParams(entry).map(p => ({
              name: p.name,
              description: p.description && strategy.processDescription(p.description),
              ...strategy.processType(p.type, p)
            })),
            return: entry.returns?.[0] && {
              description: strategy.processDescription(entry.returns[0].description),
              ...strategy.processType(entry.returns[0].type)
            }
          }
        ],
        return: prevItem?.return || entry.returns?.[0] && {
          description: strategy.processDescription(entry.returns[0].description),
          ...strategy.processType(entry.returns[0].type)
        },
        class: className,
        static: entry.scope === 'static' && 1,
        module: prevItem?.module ?? module,
        submodule: prevItem?.submodule ?? submodule,
        beta: prevItem?.beta || entry.tags?.some(t => t.title === 'beta') || undefined,
      };

      processed.classMethods[className] = processed.classMethods[className] || {};
      processed.classMethods[className][methodKey] = item;
    }
  }

  // Add classMethods to classitems for compatibility
  for (const className in processed.classMethods) {
    for (const methodName in processed.classMethods[className]) {
      processed.classitems.push(processed.classMethods[className][methodName]);
    }
  }

  return processed;
}