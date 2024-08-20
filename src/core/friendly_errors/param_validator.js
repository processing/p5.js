/**
 * @for p5
 * @requires core
 */
// import p5 from '../main';
import dataDoc from '../../../docs/parameterData.json';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';

let schemaRegistry = new Map();
const arrDoc = JSON.parse(JSON.stringify(dataDoc));

const schemaMap = {
  'Any': z.any(),
  'Array': z.array(z.any()),
  'Boolean': z.boolean(),
  'Function': z.function(),
  'Integer': z.number().int(),
  'Number': z.number(),
  'Number[]': z.array(z.number()),
  'Object': z.object({}),
  // Allows string for any regex
  'RegExp': z.string(),
  'String': z.string(),
  'String[]': z.array(z.string())
};

function generateZodSchemasForFunc(func) {
  const ichDot = func.lastIndexOf('.');
  const funcName = func.slice(ichDot + 1);
  const funcClass = func.slice(0, ichDot !== -1 ? ichDot : 0) || 'p5';

  let funcInfo = arrDoc[funcClass][funcName];

  let overloads = [];
  if (funcInfo.hasOwnProperty('overloads')) {
    overloads = funcInfo.overloads;
  }

  const createParamSchema = param => {
    const optional = param.endsWith('?');
    param = param.replace(/\?$/, '');

    if (param.includes('|')) {
      const types = param.split('|');
      return types.every(t => /^[A-Z_]+$/.test(t))
        ? z.enum(types)
        : z.union(types
          .filter(t => {
            if (!schemaMap[t]) {
              console.warn(`Warning: Zod schema not found for type '${t}'. Skip mapping`);
              return false;
            }
            return true;
          })
          .map(t => schemaMap[t]));
    }

    let schema = schemaMap[param];
    return optional ? schema.optional() : schema;
  };

  const overloadSchemas = overloads.map(overload => {
    return z.tuple(
      overload
        .map(p => createParamSchema(p))
        .filter(schema => schema !== undefined)
    );
  });

  return overloadSchemas.length === 1
    ? overloadSchemas[0]
    : z.union(overloadSchemas);
}

function printZodSchema(schema, indent = 0) {
  const i = ' '.repeat(indent);
  const log = msg => console.log(`${i}${msg}`);

  if (schema instanceof z.ZodUnion || schema instanceof z.ZodTuple) {
    const type = schema instanceof z.ZodUnion ? 'Union' : 'Tuple';
    log(`${type}: [`);

    const items = schema instanceof z.ZodUnion
      ? schema._def.options
      : schema.items;
    items.forEach((item, index) => {
      log(`  ${type === 'Union' ? 'Option' : 'Item'} ${index + 1}:`);
      printZodSchema(item, indent + 4);
    });
    log(']');
  } else {
    log(schema.constructor.name);
  }
}

export function validateParams(func, args) {
  // if (p5.disableFriendlyErrors) {
  //   return; // skip FES
  // }

  let funcSchemas = schemaRegistry.get(func);
  if (!funcSchemas) {
    funcSchemas = generateZodSchemasForFunc(func);
    schemaRegistry.set(func, funcSchemas);
  }

  printZodSchema(funcSchemas);

  try {
    let result = funcSchemas.parse(args);
    return result;
  } catch (error) {
    console.log('Caught error');
    const validationError = fromError(error);
    console.log(validationError);
    return validationError;
  }
}

