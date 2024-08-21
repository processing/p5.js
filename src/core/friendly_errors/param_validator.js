/**
 * @for p5
 * @requires core
 */
// import p5 from '../main';
import dataDoc from '../../../docs/parameterData.json';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';

// Cache for Zod schemas
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

/**
 * This is a helper function that generates Zod schemas for a function based on
 * the parameter data from `docs/parameterData.json`.
 *
 * Example parameter data for function `background`:
 * "background": {
      "overloads": [
        ["p5.Color"],
        ["String", "Number?"],
        ["Number", "Number?"],
        ["Number", "Number", "Number", "Number?"],
        ["Number[]"],
        ["p5.Image", "Number?"]
      ]
    }
 * Where each array in `overloads` represents a set of valid overloaded
 * parameters, and `?` is a shorthand for `Optional`.
 *
 * TODO:
 * - [ ] Support for p5 constructors
 * - [ ] Support for p5 constants
 * - [ ] Support for generating multiple schemas for optional parameters
 * - [ ] Support for more obscure types, such as `lerpPalette` and optional
 * objects in `p5.Geometry.computeNormals()`
 * (see https://github.com/processing/p5.js/pull/7186#discussion_r1724983249)
 *
 * @param {String} func Name of the function
 * @returns {z.ZodSchema} Zod schema
 */
function generateZodSchemasForFunc(func) {
  // Expect global functions like `sin` and class methods like `p5.Vector.add`
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

      // Note that for parameter types that are constants, such as for `blendMode`, the paramters are always all caps, sometimes with underscores, separated by `|` (i.e. "BLEND|DARKEST|LIGHTEST|DIFFERENCE|MULTIPLY|EXCLUSION|SCREEN|REPLACE|OVERLAY|HARD_LIGHT|SOFT_LIGHT|DODGE|BURN|ADD|REMOVE|SUBTRACT"). Use a regex check here to filter them out and distinguish them from parameters that allow multiple types.
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
    // For now, ignore schemas that cannot be mapped to a defined type
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

/**
 * This is a helper function to print out the Zod schema in a readable format.
 * This is for debugging purposes only and will be removed in the future.
 *
 * @param {z.ZodSchema} schema Zod schema
 * @param {number} indent Indentation level
 */
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

/**
 * Runs parameter validation by matching the input parameters to Zod schemas
 * generated from the parameter data from `docs/parameterData.json`.
 *
 * TODO:
 * - [ ] Turn it into a private method of `p5`.
 * - [ ] Add a function that returns the closest match for the input arguments in the case of a validation error.
 *
 * @param {String} func Name of the function
 * @param {Array} args User input arguments
 * @returns {any|import('zod-validation-error').ZodValidationError} The validated arguments or a validation error
 */
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

