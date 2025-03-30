/**
 * @for p5
 * @requires core
 */
import * as constants from '../constants.js';
import * as z from 'zod';
import dataDoc from '../../../docs/parameterData.json';

function validateParams(p5, fn, lifecycles) {
  // Cache for Zod schemas
  let schemaRegistry = new Map();

  // Mapping names of p5 types to their constructor functions.
  // p5Constructors:
  //   - Color: f()
  //   - Graphics: f()
  //   - Vector: f()
  // and so on.
  // const p5Constructors = {};
  // NOTE: This is a tempt fix for unit test but is not correct
  // Attaced constructors are `undefined`
  const p5Constructors = Object.keys(p5).reduce((acc, val) => {
    if (
      val.match(/^[A-Z]/) && // Starts with a capital
      !val.match(/^[A-Z][A-Z0-9]*$/) && // Is not an all caps constant
      p5[val] instanceof Function // Is a function
    ) {
      acc[val] = p5[val];
    }
    return acc;
  }, {});

  function loadP5Constructors() {
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
    'Object': z.object({}),
    'String': z.string(),
  };

  const webAPIObjects = [
    'AudioNode',
    'HTMLCanvasElement',
    'HTMLElement',
    'KeyboardEvent',
    'MouseEvent',
    'RegExp',
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

  // For mapping 0-indexed parameters to their ordinal representation, e.g.
  // "first" for 0, "second" for 1, "third" for 2, etc.
  const ordinals = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];

  function extractFuncNameAndClass(func) {
    const ichDot = func.lastIndexOf('.');
    const funcName = func.slice(ichDot + 1);
    const funcClass = func.slice(0, ichDot !== -1 ? ichDot : 0) || 'p5';
    return { funcName, funcClass };
  }

  function validBracketNesting(type) {
    let level = 0;
    for (let i = 0; i < type.length; i++) {
      if (type[i] === '[') {
        level++;
      } else if (type[i] === ']') {
        level--;
        if (level < 0) return false;
      }
    }
    return level === 0;
  }

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
   * @method generateZodSchemasForFunc
   * @param {String} func - Name of the function. Expect global functions like `sin` and class methods like `p5.Vector.add`
   * @returns {z.ZodSchema} Zod schema
   */
  fn.generateZodSchemasForFunc = function (func) {
    const { funcName, funcClass } = extractFuncNameAndClass(func);
    let funcInfo = dataDoc[funcClass][funcName];

    if(!funcInfo) return;

    let overloads = [];
    if (funcInfo.hasOwnProperty('overloads')) {
      overloads = funcInfo.overloads;
    }

    // Returns a schema for a single type, i.e. z.boolean() for `boolean`.
    const generateTypeSchema = baseType => {
      if (!baseType) return z.any();

      let typeSchema;

      // Check for constants. Note that because we're ultimately interested in the value of
      // the constant, mapping constants to their values via `constantsMap` is
      // necessary.
      if (baseType in constantsMap) {
        typeSchema = z.literal(constantsMap[baseType]);
      }
      // Some more constants are attached directly to p5.prototype, e.g. by addons:
      else if (baseType.match(/^[A-Z][A-Z0-9]*$/) && baseType in fn) {
        typeSchema = z.literal(fn[baseType]);
      }
      // Function types
      else if (baseType.startsWith('function')) {
        typeSchema = z.function();
      }
      // All p5 objects start with `p5` in the documentation, i.e. `p5.Camera`.
      else if (/^p5\.[a-zA-Z0-9]+$/.exec(baseType) || baseType === 'p5') {
        const className = baseType.substring(baseType.indexOf('.') + 1);
        typeSchema = z.instanceof(p5Constructors[className]);
      }
      // For primitive types and web API objects.
      else if (schemaMap[baseType]) {
        typeSchema = schemaMap[baseType];
      }
      // Tuple types
      else if (
        baseType.startsWith('[') &&
        baseType.endsWith(']') &&
        validBracketNesting(baseType.slice(1, -1))
      ) {
        typeSchema = z.tuple(
          baseType
            .slice(1, -1)
            .split(/, */g)
            .map(entry => generateTypeSchema(entry))
        );
      }
      // JavaScript classes, e.g. Request
      else if (baseType.match(/^[A-Z]/) && baseType in window) {
        typeSchema = z.instanceof(window[baseType]);
      }
      // Generate a schema for a single parameter that can be of multiple
      // types / constants, i.e. `String|Number|Array`.
      //
      // Here, z.union() is used over z.enum() (which seems more intuitive) for
      // constants for the following reasons:
      // 1) z.enum() only allows a fixed set of allowable string values. However,
      // our constants sometimes have numeric or non-primitive values.
      // 2) In some cases, the type can be constants or strings, making z.enum()
      // insufficient for the use case.
      else if (baseType.includes('|') && baseType.split('|').every(t => validBracketNesting(t))) {
        const types = baseType.split('|');
        typeSchema = z.union(types
          .map(t => generateTypeSchema(t))
          .filter(s => s !== undefined));
      } else if (baseType.endsWith('[]')) {
        typeSchema = z.array(generateTypeSchema(baseType.slice(0, -2)));
      } else {
        throw new Error(`Unsupported type '${baseType}' in parameter validation. Please report this issue.`);
      }

      return typeSchema;
    };

    // Generate a schema for a single parameter. In the case where a parameter can
    // be of multiple types, `generateTypeSchema` is called for each type.
    const generateParamSchema = param => {
      const isOptional = param?.endsWith('?');
      param = param?.replace(/\?$/, '');

      let schema = generateTypeSchema(param);

      return isOptional ? schema.optional() : schema;
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
      if (!params.some(p => p?.endsWith('?'))) {
        return [params];
      }

      const requiredParamsCount = params.filter(p => p === null || !p.endsWith('?')).length;
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
   * Finds the closest schema to the input arguments.
   *
   * This is a helper function that identifies the closest schema to the input
   * arguments, in the case of an initial validation error. We will then use the
   * closest schema to generate a friendly error message.
   *
   * @private
   * @param {z.ZodSchema} schema - Zod schema.
   * @param {Array} args - User input arguments.
   * @returns {z.ZodSchema} Closest schema matching the input arguments.
   */
  fn.findClosestSchema = function (schema, args) {
    if (!(schema instanceof z.ZodUnion)) {
      return schema;
    }

    // Helper function that scores how close the input arguments are to a schema.
    // Lower score means closer match.
    const scoreSchema = schema => {
      let score = Infinity;
      if (!(schema instanceof z.ZodTuple)) {
        console.warn('Schema below is not a tuple: ');
        printZodSchema(schema);
        return score;
      }

      const numArgs = args.length;
      const schemaItems = schema.items;
      const numSchemaItems = schemaItems.length;
      const numRequiredSchemaItems = schemaItems.filter(item => !item.isOptional()).length;

      if (numArgs >= numRequiredSchemaItems && numArgs <= numSchemaItems) {
        score = 0;
      }
      // Here, give more weight to mismatch in number of arguments.
      //
      // For example, color() can either take [Number, Number?] or
      // [Number, Number, Number, Number?] as list of parameters.
      // If the user passed in 3 arguments, [10, undefined, undefined], it's
      // more than likely that they intended to pass in 3 arguments, but the
      // last two arguments are invalid.
      //
      // If there's no bias towards matching the number of arguments, the error
      // message will show that we're expecting at most 2 arguments, but more
      // are received.
      else {
        score = Math.abs(
          numArgs < numRequiredSchemaItems ? numRequiredSchemaItems - numArgs : numArgs - numSchemaItems
        ) * 4;
      }

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
   * Prints a friendly error message after parameter validation, if validation
   * has failed.
   *
   * @method _friendlyParamError
   * @private
   * @param {z.ZodError} zodErrorObj - The Zod error object containing validation errors.
   * @param {String} func - Name of the function. Expect global functions like `sin` and class methods like `p5.Vector.add`
   * @returns {String} The friendly error message.
   */
  fn.friendlyParamError = function (zodErrorObj, func, args) {
    let message = '🌸 p5.js says: ';
    let isVersionError = false;
    // The `zodErrorObj` might contain multiple errors of equal importance
    // (after scoring the schema closeness in `findClosestSchema`). Here, we
    // always print the first error so that user can work through the errors
    // one by one.
    let currentError = zodErrorObj.errors[0];

    // Helper function to build a type mismatch message.
    const buildTypeMismatchMessage = (actualType, expectedTypeStr, position) => {
      const positionStr = position ? `at the ${ordinals[position]} parameter` : '';
      const actualTypeStr = actualType ? `, but received ${actualType}` : '';
      return `Expected ${expectedTypeStr} ${positionStr}${actualTypeStr}`;
    }

    // Union errors occur when a parameter can be of multiple types but is not
    // of any of them. In this case, aggregate all possible types and print
    // a friendly error message that indicates what the expected types are at
    // which position (position is not 0-indexed, for accessibility reasons).
    const processUnionError = (error) => {
      const expectedTypes = new Set();
      let actualType;

      error.unionErrors.forEach(err => {
        const issue = err.issues[0];
        if (issue) {
          if (!actualType) {
            actualType = issue.received;
          }

          if (issue.code === 'invalid_type') {
            expectedTypes.add(issue.expected);
          }
          // The case for constants. Since we don't want to print out the actual
          // constant values in the error message, the error message will
          // direct users to the documentation.
          else if (issue.code === 'invalid_literal') {
            expectedTypes.add("constant (please refer to documentation for allowed values)");
          } else if (issue.code === 'custom') {
            const match = issue.message.match(/Input not instance of (\w+)/);
            if (match) expectedTypes.add(match[1]);
          }
        }
      });

      if (expectedTypes.size > 0) {
        if (error.path?.length > 0 && args[error.path[0]] instanceof Promise)  {
          message += 'Did you mean to put `await` before a loading function? ' +
            'An unexpected Promise was found. ';
          isVersionError = true;
        }

        const expectedTypesStr = Array.from(expectedTypes).join(' or ');
        const position = error.path.join('.');

        message += buildTypeMismatchMessage(actualType, expectedTypesStr, position);
      }

      return message;
    }

    switch (currentError.code) {
      case 'invalid_union': {
        processUnionError(currentError);
        break;
      }
      case 'too_small': {
        const minArgs = currentError.minimum;
        message += `Expected at least ${minArgs} argument${minArgs > 1 ? 's' : ''}, but received fewer`;
        break;
      }
      case 'invalid_type': {
        message += buildTypeMismatchMessage(currentError.received, currentError.expected, currentError.path.join('.'));
        break;
      }
      case 'too_big': {
        const maxArgs = currentError.maximum;
        message += `Expected at most ${maxArgs} argument${maxArgs > 1 ? 's' : ''}, but received more`;
        break;
      }
      default: {
        console.log('Zod error object', currentError);
      }
    }

    // Let the user know which function is generating the error.
    message += ` in ${func}().`;

    // Generates a link to the documentation based on the given function name.
    // TODO: Check if the link is reachable before appending it to the error
    // message.
    const generateDocumentationLink = (func) => {
      const { funcName, funcClass } = extractFuncNameAndClass(func);
      const p5BaseUrl = 'https://p5js.org/reference';
      const url = `${p5BaseUrl}/${funcClass}/${funcName}`;

      return url;
    }

    if (currentError.code === 'too_big' || currentError.code === 'too_small') {
      const documentationLink = generateDocumentationLink(func);
      message += ` For more information, see ${documentationLink}.`;
    }

    if (isVersionError) {
      p5._error(this, message);
    } else {
      console.log(message);
    }
    return message;
  }

  /**
   * Runs parameter validation by matching the input parameters to Zod schemas
   * generated from the parameter data from `docs/parameterData.json`.
   *
   * @private
   * @param {String} func - Name of the function.
   * @param {Array} args - User input arguments.
   * @returns {Object} The validation result.
   * @returns {Boolean} result.success - Whether the validation was successful.
   * @returns {any} [result.data] - The parsed data if validation was successful.
   * @returns {String} [result.error] - The validation error message if validation has failed.
   */
  fn.validate = function (func, args) {
    if (p5.disableFriendlyErrors) {
      return; // skip FES
    }

    if (!Array.isArray(args)) {
      args = Array.from(args);
    }

    // An edge case: even when all arguments are optional and therefore,
    // theoretically allowed to stay undefined and valid, it is likely that the
    // user intended to call the function with non-undefined arguments. Skip
    // regular workflow and return a friendly error message right away.
    if (Array.isArray(args) && args.every(arg => arg === undefined)) {
      const undefinedErrorMessage = `🌸 p5.js says: All arguments for ${func}() are undefined. There is likely an error in the code.`;

      return {
        success: false,
        error: undefinedErrorMessage
      };
    }

    let funcSchemas = schemaRegistry.get(func);
    if (!funcSchemas) {
      funcSchemas = fn.generateZodSchemasForFunc(func);
      if (!funcSchemas) return;
      schemaRegistry.set(func, funcSchemas);
    }

    try {
      return {
        success: true,
        data: funcSchemas.parse(args)
      };
    } catch (error) {
      const closestSchema = fn.findClosestSchema(funcSchemas, args);
      const zodError = closestSchema.safeParse(args).error;
      const errorMessage = fn.friendlyParamError(zodError, func, args);

      return {
        success: false,
        error: errorMessage
      };
    }
  };

  lifecycles.presetup = function(){
    loadP5Constructors();

    const excludes = ['validate'];
    for(const f in this){
      if(!excludes.includes(f) && !f.startsWith('_') && typeof this[f] === 'function'){
        const copy = this[f];

        this[f] = function(...args) {
          this.validate(f, args);
          return copy.call(this, ...args);
        };
      }
    }
  };
}

export default validateParams;

if (typeof p5 !== 'undefined') {
  validateParams(p5, p5.prototype);
}
