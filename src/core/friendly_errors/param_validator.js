/**
 * @for p5
 * @requires core
 */
import p5 from '../main.js';
import * as constants from '../constants.js';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import dataDoc from '../../../docs/parameterData.json';

function validateParams(p5, fn) {
  // Cache for Zod schemas
  let schemaRegistry = new Map();
  const arrDoc = JSON.parse(JSON.stringify(dataDoc));

  // Mapping names of p5 types to their constructor functions.
  // p5Constructors:
  //   - Color: f()
  //   - Graphics: f()
  //   - Vector: f()
  // and so on.
  const p5Constructors = {};

  fn._loadP5Constructors = function () {
    // Make a list of all p5 classes to be used for argument validation
    // This must be done only when everything has loaded otherwise we get
    // an empty array
    for (let key of Object.keys(p5)) {
      // Get a list of all constructors in p5. They are functions whose names
      // start with a capital letter
      if (typeof p5[key] === 'function' && key[0] !== key[0].toLowerCase()) {
        p5Constructors[key] = p5[key];
      }
    }
  }

  // `constantsMap` maps constants to their values, e.g.
  // {
  //   ADD: 'lighter',
  //   ALT: 18,
  //   ARROW: 'default',
  //   AUTO: 'auto',
  //   ...
  // }
  const constantsMap = {};
  for (const [key, value] of Object.entries(constants)) {
    constantsMap[key] = value;
  }

  // Start initializing `schemaMap` with primitive types. `schemaMap` will
  // eventually contain both primitive types and web API objects.
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

  const webAPIObjects = [
    'AudioNode',
    'HTMLCanvasElement',
    'HTMLElement',
    'KeyboardEvent',
    'MouseEvent',
    'TouchEvent',
    'UIEvent',
    'WheelEvent'
  ];

  function generateWebAPISchemas(apiObjects) {
    return apiObjects.reduce((acc, obj) => {
      acc[obj] = z.custom(data => data instanceof globalThis[obj], {
        message: `Expected a ${obj}`
      });
      return acc;
    }, {});
  }

  const webAPISchemas = generateWebAPISchemas(webAPIObjects);
  // Add web API schemas to the schema map.
  Object.assign(schemaMap, webAPISchemas);

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
   * - [ ] Support for more obscure types, such as `lerpPalette` and optional
   * objects in `p5.Geometry.computeNormals()`
   * (see https://github.com/processing/p5.js/pull/7186#discussion_r1724983249)
   *
   * @param {String} func - Name of the function.
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

    // Returns a schema for a single type, i.e. z.boolean() for `boolean`.
    const generateTypeSchema = type => {
      // Type only contains uppercase letters and underscores -> type is a
      // constant. Note that because we're ultimately interested in the value of
      // the constant, mapping constants to their values via `constantsMap` is
      // necessary.
      if (/^[A-Z_]+$/.test(type)) {
        return z.literal(constantsMap[type]);
      }
      // All p5 objects start with `p5` in the documentation, i.e. `p5.Camera`.
      else if (type.startsWith('p5')) {
        console.log('type', type);
        const className = type.substring(type.indexOf('.') + 1);
        console.log('className', p5Constructors[className]);
        return z.instanceof(p5Constructors[className]);
      }
      // For primitive types and web API objects.
      else if (schemaMap[type]) {
        return schemaMap[type];
      } else {
        // TODO: Make this throw an error once more types are supported.
        console.log(`Warning: Zod schema not found for type '${type}'. Skip mapping`);
        return undefined;
      }
    };

    // Generate a schema for a single parameter. In the case where a parameter can
    // be of multiple types, `generateTypeSchema` is called for each type.
    const generateParamSchema = param => {
      const optional = param.endsWith('?');
      param = param.replace(/\?$/, '');

      let schema;

      // Generate a schema for a single parameter that can be of multiple
      // types / constants, i.e. `String|Number|Array`.
      //
      // Here, z.union() is used over z.enum() (which seems more intuitive) for
      // constants for the following reasons:
      // 1) z.enum() only allows a fixed set of allowable string values. However,
      // our constants sometimes have numeric or non-primitive values.
      // 2) In some cases, the type can be constants or strings, making z.enum()
      // insufficient for the use case.
      if (param.includes('|')) {
        const types = param.split('|');
        schema = z.union(types
          .map(t => generateTypeSchema(t))
          .filter(s => s !== undefined));
      } else {
        schema = generateTypeSchema(param);
      }

      return optional ? schema.optional() : schema;
    };

    // Note that in Zod, `optional()` only checks for undefined, not the absence
    // of value.
    //
    // Let's say we have a function with 3 parameters, and the last one is
    // optional, i.e. func(a, b, c?). If we only have a z.tuple() for the
    // parameters, where the third schema is optional, then we will only be able
    // to validate func(10, 10, undefined), but not func(10, 10), which is
    // a completely valid call.
    //
    // Therefore, on top of using `optional()`, we also have to generate parameter
    // combinations that are valid for all numbers of parameters.
    const generateOverloadCombinations = params => {
      // No optional parameters, return the original parameter list right away.
      if (!params.some(p => p.endsWith('?'))) {
        return [params];
      }

      const requiredParamsCount = params.filter(p => !p.endsWith('?')).length;
      const result = [];

      for (let i = requiredParamsCount; i <= params.length; i++) {
        result.push(params.slice(0, i));
      }

      return result;
    };

    // Generate schemas for each function overload and merge them
    const overloadSchemas = overloads.flatMap(overload => {
      const combinations = generateOverloadCombinations(overload);

      return combinations.map(combo =>
        z.tuple(
          combo
            .map(p => generateParamSchema(p))
            // For now, ignore schemas that cannot be mapped to a defined type
            .filter(schema => schema !== undefined)
        )
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
   * @param {z.ZodSchema} schema - Zod schema.
   * @param {number} indent - Indentation level.
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
   * Finds the closest schema to the input arguments.
   *
   * This is a helper function that identifies the closest schema to the input
   * arguments, in the case of an initial validation error. We will then use the
   * closest schema to generate a friendly error message.
   *
   * @param {z.ZodSchema} schema - Zod schema.
   * @param {Array} args - User input arguments.
   * @returns {z.ZodSchema} Closest schema matching the input arguments.
   */
  function findClosestSchema(schema, args) {
    if (!(schema instanceof z.ZodUnion)) {
      return schema;
    }

    // Helper function that scores how close the input arguments are to a schema.
    // Lower score means closer match.
    const scoreSchema = schema => {
      if (!(schema instanceof z.ZodTuple)) {
        console.warn('Schema below is not a tuple: ');
        printZodSchema(schema);
        return Infinity;
      }

      const schemaItems = schema.items;
      let score = Math.abs(schemaItems.length - args.length) * 2;

      for (let i = 0; i < Math.min(schemaItems.length, args.length); i++) {
        const paramSchema = schemaItems[i];
        const arg = args[i];

        if (!paramSchema.safeParse(arg).success) score++;
      }

      return score;
    };

    // Default to the first schema, so that we are guaranteed to return a result.
    let closestSchema = schema._def.options[0];
    // We want to return the schema with the lowest score.
    let bestScore = Infinity;

    const schemaUnion = schema._def.options;
    schemaUnion.forEach(schema => {
      const score = scoreSchema(schema);
      if (score < bestScore) {
        closestSchema = schema;
        bestScore = score;
      }
    });

    return closestSchema;
  }

  /**
   * Runs parameter validation by matching the input parameters to Zod schemas
   * generated from the parameter data from `docs/parameterData.json`.
   *
   * @param {String} func - Name of the function.
   * @param {Array} args - User input arguments.
   * @returns {Object} The validation result.
   * @returns {Boolean} result.success - Whether the validation was successful.
   * @returns {any} [result.data] - The parsed data if validation was successful.
   * @returns {import('zod-validation-error').ZodValidationError} [result.error] - The validation error if validation failed.
   */
  fn._validateParams = function (func, args) {
    if (p5.disableFriendlyErrors) {
      return; // skip FES
    }

    // An edge case: even when all arguments are optional and therefore,
    // theoretically allowed to stay undefined and valid, it is likely that the
    // user intended to call the function with non-undefined arguments. Skip
    // regular workflow and return a friendly error message right away.
    if (Array.isArray(args) && args.every(arg => arg === undefined)) {
      const undefinedError = new Error(`All arguments for function ${func} are undefined. There is likely an error in the code.`);
      const zodUndefinedError = fromError(undefinedError);

      return {
        success: false,
        error: zodUndefinedError
      };
    }

    let funcSchemas = schemaRegistry.get(func);
    if (!funcSchemas) {
      funcSchemas = generateZodSchemasForFunc(func);
      schemaRegistry.set(func, funcSchemas);
    }

    try {
      return {
        success: true,
        data: funcSchemas.parse(args)
      };
    } catch (error) {
      const closestSchema = findClosestSchema(funcSchemas, args);
      const validationError = fromError(closestSchema.safeParse(args).error);

      return {
        success: false,
        error: validationError
      };
    }
  };
}

export default validateParams;

if (typeof p5 !== 'undefined') {
  validateParams(p5, p5.prototype);
  p5.prototype._loadP5Constructors();
}