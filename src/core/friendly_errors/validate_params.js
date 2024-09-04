/**
 * @for p5
 * @requires core
 */
import p5 from '../main';
import * as constants from '../constants';
import { translator } from '../internationalization';
// import dataDoc from '../../../docs/parameterData.json';

if (typeof IS_MINIFIED !== 'undefined') {
  p5._validateParameters = p5._clearValidateParamsCache = () => {};
} else {
  // for parameter validation
  // const arrDoc = JSON.parse(JSON.stringify(dataDoc));

  // const docCache = {};
  // const builtinTypes = new Set([
  //   'null',
  //   'number',
  //   'string',
  //   'boolean',
  //   'constant',
  //   'function',
  //   'any',
  //   'integer'
  // ]);

  // const basicTypes = {
  //   number: true,
  //   boolean: true,
  //   string: true,
  //   function: true,
  //   undefined: true
  // };

  // reverse map of all constants
  const constantsReverseMap = {};
  for (let key in constants) {
    constantsReverseMap[constants[key]] = key;
  }

  // mapping names of p5 types to their constructor function
  // p5Constructors:
  //    - Color: f()
  //    - Graphics: f()
  //    - Vector: f()
  // and so on
  const p5Constructors = {};

  // For speedup over many runs. funcSpecificConstructors[func] only has the
  // constructors for types which were seen earlier as args of "func"
  // const funcSpecificConstructors = {};
  window.addEventListener('load', () => {
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
  });

  const argumentTree = {};
  // The following two functions are responsible for querying and inserting
  // into the argument tree. It stores the types of arguments that each
  // function has seen so far. It is used to query if a sequence of
  // arguments seen in validate parameters was seen before.
  // Lets consider that the following segment of code runs repeatedly, perhaps
  // in a loop or in draw()
  //   color(10, 10, 10);
  //   color(10, 10);
  //   color('r', 'g', 'b');
  // After the first of run the code segment, the argument tree looks like
  // - color
  //     - number
  //        - number
  //            - number
  //                - seen: true
  //            - seen: true
  //     - string
  //        - string
  //            - string
  //                - seen: true
  // seen: true signifies that this argument was also seen as the last
  // argument in a call. Now in the second run of the sketch, it would traverse
  // the existing tree and see seen: true, i.e this sequence was seen
  // before and so scoring can be skipped. This also prevents logging multiple
  // validation messages for the same thing.

  /**
   * Query type and return the result as an object
   *
   * This would be called repeatedly over and over again,
   * so it needs to be as optimized for performance as possible
   * @method addType
   * @private
   */
  // const addType = (value, obj, func) => {
  //   let type = typeof value;
  //   if (basicTypes[type]) {
  //     if (constantsReverseMap[value]) {
  //       // check if the value is a p5 constant and if it is, we would want the
  //       // value itself to be stored in the tree instead of the type
  //       obj = obj[value] || (obj[value] = {});
  //     } else {
  //       obj = obj[type] || (obj[type] = {});
  //     }
  //   } else if (value === null) {
  //     // typeof null -> "object". don't want that
  //     obj = obj['null'] || (obj['null'] = {});
  //   } else {
  //     // objects which are instances of p5 classes have nameless constructors.
  //     // native objects have a constructor named "Object". This check
  //     // differentiates between the two so that we dont waste time finding the
  //     // p5 class if we just have a native object
  //     if (value.constructor && value.constructor.name) {
  //       obj = obj[value.constructor.name] || (obj[value.constructor.name] = {});
  //       return obj;
  //     }

  //     // constructors for types defined in p5 do not have a name property.
  //     // e.constructor.name gives "". Code in this segment is a workaround for it

  //     // p5C will only have the name: constructor mapping for types
  //     // which were already seen as args of "func"
  //     let p5C = funcSpecificConstructors[func];
  //     // p5C would contain much fewer items than p5Constructors. if we find our
  //     // answer in p5C, we don't have to scan through p5Constructors

  //     if (p5C === undefined) {
  //       // if there isn't an entry yet for func
  //       // make an entry of empty object
  //       p5C = funcSpecificConstructors[func] = {};
  //     }

  //     for (let key in p5C) {
  //       // search on the constructors we have already seen (smaller search space)
  //       if (value instanceof p5C[key]) {
  //         obj = obj[key] || (obj[key] = {});
  //         return obj;
  //       }
  //     }

  //     for (let key in p5Constructors) {
  //       // if the above search didn't work, search on all p5 constructors
  //       if (value instanceof p5Constructors[key]) {
  //         obj = obj[key] || (obj[key] = {});
  //         // if found, add to known constructors for this function
  //         p5C[key] = p5Constructors[key];
  //         return obj;
  //       }
  //     }
  //     // nothing worked, put the type as it is
  //     obj = obj[type] || (obj[type] = {});
  //   }

  //   return obj;
  // };

  /**
   * Build the argument type tree, argumentTree
   *
   * This would be called repeatedly over and over again,
   * so it needs to be as optimized for performance as possible
   * @method buildArgTypeCache
   * @private
   */
  // const buildArgTypeCache = (func, arr) => {
  //   // get the if an argument tree for current function already exists
  //   let obj = argumentTree[func];
  //   if (obj === undefined) {
  //     // if it doesn't, create an empty tree
  //     obj = argumentTree[func] = {};
  //   }

  //   for (let i = 0, len = arr.length; i < len; ++i) {
  //     let value = arr[i];
  //     if (value instanceof Array) {
  //       // an array is passed as an argument, expand it and get the type of
  //       // each of its element. We distinguish the start of an array with 'as'
  //       // or arraystart. This would help distinguish between the arguments
  //       // (number, number, number) and (number, [number, number])
  //       obj = obj['as'] || (obj['as'] = {});
  //       for (let j = 0, lenA = value.length; j < lenA; ++j) {
  //         obj = addType(value[j], obj, func);
  //       }
  //     } else {
  //       obj = addType(value, obj, func);
  //     }
  //   }
  //   return obj;
  // };

  /**
   * Query data.json
   * This is a helper function for validateParameters()
   * @method lookupParamDoc
   * @private
   */
  // const lookupParamDoc = func => {
  //   // look for the docs in the `data.json` datastructure

  //   const ichDot = func.lastIndexOf('.');
  //   const funcName = func.slice(ichDot + 1);
  //   const funcClass = func.slice(0, ichDot !== -1 ? ichDot : 0) || 'p5';

  //   const classitems = arrDoc;
  //   let queryResult = classitems[funcClass][funcName];

  //   // different JSON structure for funct with multi-format
  //   const overloads = [];
  //   if (queryResult.hasOwnProperty('overloads')) {
  //     // add all the overloads
  //     for (let i = 0; i < queryResult.overloads.length; i++) {
  //       overloads.push({ formats: queryResult.overloads[i].params || [] });
  //     }
  //   } else {
  //     // no overloads, just add the main method definition
  //     overloads.push({ formats: queryResult.params || [] });
  //   }

  //   // parse the parameter types for each overload
  //   const mapConstants = {};
  //   let maxParams = 0;
  //   overloads.forEach(overload => {
  //     const formats = overload.formats;

  //     // keep a record of the maximum number of arguments
  //     // this method requires.
  //     if (maxParams < formats.length) {
  //       maxParams = formats.length;
  //     }

  //     // calculate the minimum number of arguments
  //     // this overload requires.
  //     let minParams = formats.length;
  //     while (minParams > 0 && formats[minParams - 1].optional) {
  //       minParams--;
  //     }
  //     overload.minParams = minParams;

  //     // loop through each parameter position, and parse its types
  //     formats.forEach(format => {
  //       // split this parameter's types
  //       format.types = format.type.split('|').map(function ct(type) {
  //         // array
  //         if (type.slice(-2) === '[]') {
  //           return {
  //             name: type,
  //             array: ct(type.slice(0, -2))
  //           };
  //         }

  //         let lowerType = type.toLowerCase();

  //         // constant
  //         if (lowerType === 'constant') {
  //           let constant;
  //           if (mapConstants.hasOwnProperty(format.name)) {
  //             constant = mapConstants[format.name];
  //           } else {
  //             // parse possible constant values from description
  //             const myRe = /either\s+(?:[A-Z0-9_]+\s*,?\s*(?:or)?\s*)+/g;
  //             const values = {};
  //             const names = [];

  //             constant = mapConstants[format.name] = {
  //               values,
  //               names
  //             };

  //             const myArray = myRe.exec(format.description);
  //             if (func === 'endShape' && format.name === 'mode') {
  //               values[constants.CLOSE] = true;
  //               names.push('CLOSE');
  //             } else {
  //               const match = myArray[0];
  //               const reConst = /[A-Z0-9_]+/g;
  //               let matchConst;
  //               while ((matchConst = reConst.exec(match)) !== null) {
  //                 const name = matchConst[0];
  //                 if (name in constants) {
  //                   values[constants[name]] = true;
  //                   names.push(name);
  //                 }
  //               }
  //             }
  //           }
  //           return {
  //             name: type,
  //             builtin: lowerType,
  //             names: constant.names,
  //             values: constant.values
  //           };
  //         }

  //         // Handle specific constants in types, e.g. in endShape:
  //         //   @param {CLOSE} [close]
  //         // Rather than trying to parse the types out of the description, we
  //         // can use the constant directly from the type
  //         if (type in constants) {
  //           return {
  //             name: type,
  //             builtin: 'constant',
  //             names: [type],
  //             values: { [constants[type]]: true }
  //           };
  //         }

  //         // function
  //         if (lowerType.slice(0, 'function'.length) === 'function') {
  //           lowerType = 'function';
  //         }
  //         // builtin
  //         if (builtinTypes.has(lowerType)) {
  //           return { name: type, builtin: lowerType };
  //         }

  //         // find type's prototype
  //         let t = window;
  //         const typeParts = type.split('.');

  //         // special-case 'p5' since it may be non-global
  //         if (typeParts[0] === 'p5') {
  //           t = p5;
  //           typeParts.shift();
  //         }

  //         typeParts.forEach(p => {
  //           t = t && t[p];
  //         });
  //         if (t) {
  //           return { name: type, prototype: t };
  //         }

  //         return { name: type, type: lowerType };
  //       });
  //     });
  //   });
  //   return {
  //     overloads,
  //     maxParams
  //   };
  // };

  /**
   * Checks whether input type is Number
   * This is a helper function for validateParameters()
   * @method isNumber
   * @private
   *
   * @returns {Boolean} a boolean indicating whether input type is Number
   */
  // const isNumber = param => {
  //   if (isNaN(parseFloat(param))) return false;
  //   switch (typeof param) {
  //     case 'number':
  //       return true;
  //     case 'string':
  //       return !isNaN(param);
  //     default:
  //       return false;
  //   }
  // };

  /**
   * Test type for non-object type parameter validation
   * @method testParamType
   * @private
   */
  // const testParamType = (param, type) => {
  //   const isArray = param instanceof Array;
  //   let matches = true;
  //   if (type.array && isArray) {
  //     for (let i = 0; i < param.length; i++) {
  //       const error = testParamType(param[i], type.array);
  //       if (error) return error / 2; // half error for elements
  //     }
  //   } else if (type.prototype) {
  //     matches = param instanceof type.prototype;
  //   } else if (type.builtin) {
  //     switch (type.builtin) {
  //       case 'number':
  //         matches = isNumber(param);
  //         break;
  //       case 'integer':
  //         matches = isNumber(param) && Number(param) === Math.floor(param);
  //         break;
  //       case 'boolean':
  //       case 'any':
  //         matches = true;
  //         break;
  //       case 'array':
  //         matches = isArray;
  //         break;
  //       case 'string':
  //         matches = /*typeof param === 'number' ||*/ typeof param === 'string';
  //         break;
  //       case 'constant':
  //         matches = type.values.hasOwnProperty(param);
  //         break;
  //       case 'function':
  //         matches = param instanceof Function;
  //         break;
  //       case 'null':
  //         matches = param === null;
  //         break;
  //     }
  //   } else {
  //     matches = typeof param === type.t;
  //   }
  //   return matches ? 0 : 1;
  // };

  /**
   * Test type for multiple parameters
   * @method testParamTypes
   * @private
   */
  // const testParamTypes = (param, types) => {
  //   let minScore = 9999;
  //   for (let i = 0; minScore > 0 && i < types.length; i++) {
  //     const score = testParamType(param, types[i]);
  //     if (minScore > score) minScore = score;
  //   }
  //   return minScore;
  // };

  /**
   * generate a score (higher is worse) for applying these args to
   * this overload.
   * @method scoreOverload
   * @private
   */
  // const scoreOverload = (args, argCount, overload, minScore) => {
  //   let score = 0;
  //   const formats = overload.formats;
  //   const minParams = overload.minParams;

  //   // check for too few/many args
  //   // the score is double number of extra/missing args
  //   if (argCount < minParams) {
  //     score = (minParams - argCount) * 2;
  //   } else if (argCount > formats.length) {
  //     score = (argCount - formats.length) * 2;
  //   }

  //   // loop through the formats, adding up the error score for each arg.
  //   // quit early if the score gets higher than the previous best overload.
  //   for (let p = 0; score <= minScore && p < formats.length; p++) {
  //     const arg = args[p];
  //     const format = formats[p];
  //     // '== null' checks for 'null' and typeof 'undefined'
  //     if (arg == null) {
  //       // handle undefined args
  //       if (!format.optional || p < minParams || p < argCount) {
  //         score += 1;
  //       }
  //     } else {
  //       score += testParamTypes(arg, format.types);
  //     }
  //   }
  //   return score;
  // };

  /**
   * Gets a list of errors for this overload
   * @method getOverloadErrors
   * @private
   */
  // const getOverloadErrors = (args, argCount, overload) => {
  //   const formats = overload.formats;
  //   const minParams = overload.minParams;

  //   // check for too few/many args
  //   if (argCount < minParams) {
  //     return [
  //       {
  //         type: 'TOO_FEW_ARGUMENTS',
  //         argCount,
  //         minParams
  //       }
  //     ];
  //   } else if (argCount > formats.length) {
  //     return [
  //       {
  //         type: 'TOO_MANY_ARGUMENTS',
  //         argCount,
  //         maxParams: formats.length
  //       }
  //     ];
  //   }

  //   const errorArray = [];
  //   for (let p = 0; p < formats.length; p++) {
  //     const arg = args[p];
  //     const format = formats[p];
  //     // '== null' checks for 'null' and typeof 'undefined'
  //     if (arg == null) {
  //       // handle undefined args
  //       if (!format.optional || p < minParams || p < argCount) {
  //         errorArray.push({
  //           type: 'EMPTY_VAR',
  //           position: p,
  //           format
  //         });
  //       }
  //     } else if (testParamTypes(arg, format.types) > 0) {
  //       errorArray.push({
  //         type: 'WRONG_TYPE',
  //         position: p,
  //         format,
  //         arg
  //       });
  //     }
  //   }

  //   return errorArray;
  // };

  /**
   * a custom error type, used by the mocha
   * tests when expecting validation errors
   * @method ValidationError
   * @private
   */
  p5.ValidationError = (name => {
    class err extends Error {
      constructor(message, func, type) {
        super();
        this.message = message;
        this.func = func;
        this.type = type;
        if ('captureStackTrace' in Error) Error.captureStackTrace(this, err);
        else this.stack = new Error().stack;
      }
    }

    err.prototype.name = name;
    return err;
  })('ValidationError');

  /**
   * Prints a friendly msg after parameter validation
   * @method _friendlyParamError
   * @private
   */
  p5._friendlyParamError = function (errorObj, func) {
    let message;
    let translationObj;

    function formatType() {
      const format = errorObj.format;
      return format.types
        .map(type => (type.names ? type.names.join('|') : type.name))
        .join('|');
    }

    switch (errorObj.type) {
      case 'EMPTY_VAR': {
        translationObj = {
          func,
          formatType: formatType(),
          // It needs to be this way for i18next-extract to work. The comment
          // specifies the values that the context can take so that it can
          // statically prepare the translation files with them.
          /* i18next-extract-mark-context-next-line ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] */
          position: translator('fes.positions.p', {
            context: (errorObj.position + 1).toString(),
            defaultValue: (errorObj.position + 1).toString()
          }),
          url: 'https://p5js.org/examples/data-variable-scope.html'
        };

        break;
      }
      case 'WRONG_TYPE': {
        const arg = errorObj.arg;
        const argType =
          arg instanceof Array
            ? 'array'
            : arg === null ? 'null' : arg === undefined ? 'undefined' : typeof arg === 'number' && isNaN(arg) ? 'NaN' : arg.name || typeof arg;

        translationObj = {
          func,
          formatType: formatType(),
          argType,
          /* i18next-extract-mark-context-next-line ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] */
          position: translator('fes.positions.p', {
            context: (errorObj.position + 1).toString(),
            defaultValue: (errorObj.position + 1).toString()
          })
        };

        break;
      }
      case 'TOO_FEW_ARGUMENTS': {
        translationObj = {
          func,
          minParams: errorObj.minParams,
          argCount: errorObj.argCount
        };

        break;
      }
      case 'TOO_MANY_ARGUMENTS': {
        translationObj = {
          func,
          maxParams: errorObj.maxParams,
          argCount: errorObj.argCount
        };

        break;
      }
    }

    if (translationObj) {
      try {
        // const re = /Function\.validateParameters.*[\r\n].*[\r\n].*\(([^)]*)/;
        const myError = new Error();
        let parsed = p5._getErrorStackParser().parse(myError);
        if (
          parsed[3] &&
          parsed[3].functionName &&
          parsed[3].functionName.includes('.') &&
          p5.prototype[parsed[3].functionName.split('.').slice(-1)[0]]
        ) {
          return;
        }
        if (p5._throwValidationErrors) {
          throw new p5.ValidationError(message, func, errorObj.type);
        }

        // try to extract the location from where the function was called
        if (
          parsed[3] &&
          parsed[3].fileName &&
          parsed[3].lineNumber &&
          parsed[3].columnNumber
        ) {
          let location = `${parsed[3].fileName}:${parsed[3].lineNumber}:${
            parsed[3].columnNumber
          }`;

          translationObj.location = translator('fes.location', {
            location,
            // for e.g. get "sketch.js" from "https://example.com/abc/sketch.js"
            file: parsed[3].fileName.split('/').slice(-1),
            line: parsed[3].lineNumber
          });

          // tell fesErrorMonitor that we have already given a friendly message
          // for this line, so it need not to do the same in case of an error
          p5._fesLogCache[location] = true;
        }
      } catch (err) {
        if (err instanceof p5.ValidationError) {
          throw err;
        }
      }

      translationObj.context = errorObj.type;
      // i18next-extract-mark-context-next-line ["EMPTY_VAR", "TOO_MANY_ARGUMENTS", "TOO_FEW_ARGUMENTS", "WRONG_TYPE"]
      message = translator('fes.friendlyParamError.type', translationObj);

      p5._friendlyError(`${message}`, func, 3);
    }
  };

  /**
   * Clears cache to avoid having multiple FES messages for the same set of
   * parameters.
   *
   * If a function is called with some set of wrong arguments, and then called
   * again with the same set of arguments, the messages due to the second call
   * will be supressed. If two tests test on the same wrong arguments, the
   * second test won't see the validationError. clearing argumentTree solves it
   *
   * @method _clearValidateParamsCache
   * @private
   */
  p5._clearValidateParamsCache = function clearValidateParamsCache() {
    for (let key of Object.keys(argumentTree)) {
      delete argumentTree[key];
    }
  };

  // allowing access to argumentTree for testing
  p5._getValidateParamsArgTree = function getValidateParamsArgTree() {
    return argumentTree;
  };

  /**
   * Runs parameter validation by matching the input parameters with information
   * from `docs/reference/data.json`.
   * Generates and prints a friendly error message using key:
   * "fes.friendlyParamError.[*]".
   *
   * @method _validateParameters
   * @private
   * @param  {String}   func    Name of the function
   * @param  {Array}    args    User input arguments
   *
   * @example:
   *  const a;
   *  ellipse(10,10,a,5);
   * console output:
   *  "It looks like ellipse received an empty variable in spot #2."
   *
   * @example:
   *  ellipse(10,"foo",5,5);
   * console output:
   *  "ellipse was expecting a number for parameter #1,
   *           received "foo" instead."
   */
  p5._validateParameters = function validateParameters(func, args) {
    // NOTE: no-op for later removal
    return;
    // if (p5.disableFriendlyErrors) {
    //   return; // skip FES
    // }

    // // query / build the argument type tree and check if this sequence
    // // has already been seen before.
    // let obj = buildArgTypeCache(func, args);
    // if (obj.seen) {
    //   return;
    // }
    // // mark this sequence as seen
    // obj.seen = true;
    // // lookup the docs in the 'data.json' file
    // const docs = docCache[func] || (docCache[func] = lookupParamDoc(func));
    // const overloads = docs.overloads;

    // let argCount = args.length;

    // // the following line ignores trailing undefined arguments, commenting
    // // it to resolve https://github.com/processing/p5.js/issues/4571
    // // '== null' checks for 'null' and typeof 'undefined'
    // // while (argCount > 0 && args[argCount - 1] == null) argCount--;

    // // find the overload with the best score
    // let minScore = 99999;
    // let minOverload;
    // for (let i = 0; i < overloads.length; i++) {
    //   const score = scoreOverload(args, argCount, overloads[i], minScore);
    //   if (score === 0) {
    //     return; // done!
    //   } else if (minScore > score) {
    //     // this score is better that what we have so far...
    //     minScore = score;
    //     minOverload = i;
    //   }
    // }

    // // this should _always_ be true here...
    // if (minScore > 0) {
    //   // get the errors for the best overload
    //   const errorArray = getOverloadErrors(
    //     args,
    //     argCount,
    //     overloads[minOverload]
    //   );

    //   // generate err msg
    //   for (let n = 0; n < errorArray.length; n++) {
    //     p5._friendlyParamError(errorArray[n], func);
    //   }
    // }
  };
  p5.prototype._validateParameters = p5.validateParameters;
}

export default p5;
