/**
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('./main');
var constants = require('./constants');

// p5.js blue, p5.js orange, auto dark green; fallback p5.js darkened magenta
// See testColors below for all the color codes and names
var typeColors = ['#2D7BB6', '#EE9900', '#4DB200', '#C83C00'];

if (typeof IS_MINIFIED !== 'undefined') {
  p5._validateParameters = p5._friendlyFileLoadError = p5._friendlyError = function() {};
} else {
  var doFriendlyWelcome = false; // TEMP until we get it all working LM
  // for parameter validation
  var dataDoc = require('../../docs/reference/data.json');
  var arrDoc = JSON.parse(JSON.stringify(dataDoc));

  // -- Borrowed from jQuery 1.11.3 --
  var class2type = {};
  var toString = class2type.toString;
  var names = [
    'Boolean',
    'Number',
    'String',
    'Function',
    'Array',
    'Date',
    'RegExp',
    'Object',
    'Error'
  ];
  for (var n = 0; n < names.length; n++) {
    class2type['[object ' + names[n] + ']'] = names[n].toLowerCase();
  }
  var getType = function(obj) {
    if (obj == null) {
      return obj + '';
    }
    return typeof obj === 'object' || typeof obj === 'function'
      ? class2type[toString.call(obj)] || 'object'
      : typeof obj;
  };

  // -- End borrow --

  var friendlyWelcome = function() {
    // p5.js brand - magenta: #ED225D
    //var astrixBgColor = 'transparent';
    //var astrixTxtColor = '#ED225D';
    //var welcomeBgColor = '#ED225D';
    //var welcomeTextColor = 'white';
    console.log(
      '    _ \n' +
        ' /\\| |/\\ \n' +
        " \\ ` ' /  \n" +
        ' / , . \\  \n' +
        ' \\/|_|\\/ ' +
        '\n\n> p5.js says: Welcome! ' +
        'This is your friendly debugger. ' +
        'To turn me off switch to using “p5.min.js”.'
    );
  };

  /**
   * Prints out a fancy, colorful message to the console log
   *
   * @method report
   * @private
   * @param  {String}               message the words to be said
   * @param  {String}               func    the name of the function to link
   * @param  {Number|String} color   CSS color string or error type
   *
   * @return console logs
   */
  var report = function(message, func, color) {
    if (doFriendlyWelcome) {
      friendlyWelcome();
      doFriendlyWelcome = false;
    }
    if ('undefined' === getType(color)) {
      color = '#B40033'; // dark magenta
    } else if (getType(color) === 'number') {
      // Type to color
      color = typeColors[color];
    }
    if (func === 'loadX') {
      console.log('> p5.js says: ' + message);
    } else if (func.substring(0, 4) === 'load') {
      console.log(
        '> p5.js says: ' +
          message +
          '[https://github.com/processing/p5.js/wiki/Local-server]'
      );
    } else {
      console.log(
        '> p5.js says: ' +
          message +
          ' [http://p5js.org/reference/#p5/' +
          func +
          ']'
      );
    }
  };

  var errorCases = {
    '0': {
      fileType: 'image',
      method: 'loadImage',
      message: ' hosting the image online,'
    },
    '1': {
      fileType: 'XML file',
      method: 'loadXML'
    },
    '2': {
      fileType: 'table file',
      method: 'loadTable'
    },
    '3': {
      fileType: 'text file',
      method: 'loadStrings'
    },
    '4': {
      fileType: 'font',
      method: 'loadFont',
      message: ' hosting the font online,'
    },
    '5': {
      fileType: 'json',
      method: 'loadJSON'
    },
    '6': {
      fileType: 'file',
      method: 'loadBytes'
    },
    '7': {
      method: 'loadX',
      message:
        "In case your large file isn't fetched successfully," +
        'we recommend splitting the file into smaller segments and fetching those.'
    }
  };

  /**
   * This is called internally if there is a error during file loading.
   *
   * @method _friendlyFileLoadError
   * @private
   * @param  {Number} errorType
   * @param  {String} filePath
   */
  p5._friendlyFileLoadError = function(errorType, filePath) {
    var errorInfo = errorCases[errorType];
    var message;
    if (errorType === 7) {
      message = errorInfo.message;
    } else {
      message =
        'It looks like there was a problem' +
        ' loading your ' +
        errorInfo.fileType +
        '.' +
        ' Try checking if the file path [' +
        filePath +
        '] is correct,' +
        (errorInfo.message || '') +
        ' or running a local server.';
    }
    report(message, errorInfo.method, 3);
  };

  /**
   * This is a generic method that can be called from anywhere in the p5
   * library to alert users to a common error.
   *
   * @method _friendlyError
   * @private
   * @param  {Number} message message to be printed
   * @param  {String} method name of method
   */
  p5._friendlyError = function(message, method) {
    report(message, method);
  };

  var docCache = {};
  var builtinTypes = [
    'null',
    'number',
    'string',
    'boolean',
    'constant',
    'function',
    'any',
    'integer'
  ];

  // validateParameters() helper functions:
  // lookupParamDoc() for querying data.json
  var lookupParamDoc = function(func) {
    // look for the docs in the `data.json` datastructure

    var ichDot = func.lastIndexOf('.');
    var funcName = func.substr(ichDot + 1);
    var funcClass = func.substr(0, ichDot) || 'p5';

    var queryResult;
    var classitems = arrDoc.classitems;
    for (var ici = 0; ici < classitems.length; ici++) {
      var x = classitems[ici];
      if (x.name === funcName && x.class === funcClass) {
        queryResult = x;
        break;
      }
    }

    // different JSON structure for funct with multi-format
    var overloads = [];
    if (queryResult.hasOwnProperty('overloads')) {
      // add all the overloads
      for (var i = 0; i < queryResult.overloads.length; i++) {
        overloads.push({ formats: queryResult.overloads[i].params });
      }
    } else {
      // no overloads, just add the main method definition
      overloads.push({ formats: queryResult.params || [] });
    }

    // parse the parameter types for each overload
    var mapConstants = {};
    var maxParams = 0;
    overloads.forEach(function(overload) {
      var formats = overload.formats;

      // keep a record of the maximum number of arguments
      // this method requires.
      if (maxParams < formats.length) {
        maxParams = formats.length;
      }

      // calculate the minimum number of arguments
      // this overload requires.
      var minParams = formats.length;
      while (minParams > 0 && formats[minParams - 1].optional) {
        minParams--;
      }
      overload.minParams = minParams;

      // loop through each parameter position, and parse its types
      formats.forEach(function(format) {
        // split this parameter's types
        format.types = format.type.split('|').map(function ct(type) {
          // array
          if (type.substr(type.length - 2, 2) === '[]') {
            return {
              name: type,
              array: ct(type.substr(0, type.length - 2))
            };
          }

          var lowerType = type.toLowerCase();

          // contant
          if (lowerType === 'constant') {
            var constant;
            if (mapConstants.hasOwnProperty(format.name)) {
              constant = mapConstants[format.name];
            } else {
              // parse possible constant values from description
              var myRe = /either\s+(?:[A-Z0-9_]+\s*,?\s*(?:or)?\s*)+/g;
              var values = {};
              var names = [];

              constant = mapConstants[format.name] = {
                values: values,
                names: names
              };

              var myArray = myRe.exec(format.description);
              if (func === 'endShape' && format.name === 'mode') {
                values[constants.CLOSE] = true;
                names.push('CLOSE');
              } else {
                var match = myArray[0];
                var reConst = /[A-Z0-9_]+/g;
                var matchConst;
                while ((matchConst = reConst.exec(match)) !== null) {
                  var name = matchConst[0];
                  if (constants.hasOwnProperty(name)) {
                    values[constants[name]] = true;
                    names.push(name);
                  }
                }
              }
            }
            return {
              name: type,
              builtin: lowerType,
              names: constant.names,
              values: constant.values
            };
          }

          // function
          if (lowerType.substr(0, 'function'.length) === 'function') {
            lowerType = 'function';
          }
          // builtin
          if (builtinTypes.indexOf(lowerType) >= 0) {
            return { name: type, builtin: lowerType };
          }

          // find type's prototype
          var t = window;
          var typeParts = type.split('.');

          // special-case 'p5' since it may be non-global
          if (typeParts[0] === 'p5') {
            t = p5;
            typeParts.shift();
          }

          typeParts.forEach(function(p) {
            t = t && t[p];
          });
          if (t) {
            return { name: type, prototype: t };
          }

          return { name: type, type: lowerType };
        });
      });
    });
    return {
      overloads: overloads,
      maxParams: maxParams
    };
  };

  var isNumber = function(param) {
    switch (typeof param) {
      case 'number':
        return true;
      case 'string':
        return !isNaN(param);
      default:
        return false;
    }
  };

  var testParamType = function(param, type) {
    var isArray = param instanceof Array;
    var matches = true;
    if (type.array && isArray) {
      for (var i = 0; i < param.length; i++) {
        var error = testParamType(param[i], type.array);
        if (error) return error / 2; // half error for elements
      }
    } else if (type.prototype) {
      matches = param instanceof type.prototype;
    } else if (type.builtin) {
      switch (type.builtin) {
        case 'number':
          matches = isNumber(param);
          break;
        case 'integer':
          matches = isNumber(param) && Number(param) === Math.floor(param);
          break;
        case 'boolean':
        case 'any':
          matches = true;
          break;
        case 'array':
          matches = isArray;
          break;
        case 'string':
          matches = /*typeof param === 'number' ||*/ typeof param === 'string';
          break;
        case 'constant':
          matches = type.values.hasOwnProperty(param);
          break;
        case 'function':
          matches = param instanceof Function;
          break;
        case 'null':
          matches = param === null;
          break;
      }
    } else {
      matches = typeof param === type.t;
    }
    return matches ? 0 : 1;
  };

  // testType() for non-object type parameter validation
  var testParamTypes = function(param, types) {
    var minScore = 9999;
    for (var i = 0; minScore > 0 && i < types.length; i++) {
      var score = testParamType(param, types[i]);
      if (minScore > score) minScore = score;
    }
    return minScore;
  };

  // generate a score (higher is worse) for applying these args to
  // this overload.
  var scoreOverload = function(args, argCount, overload, minScore) {
    var score = 0;
    var formats = overload.formats;
    var minParams = overload.minParams;

    // check for too few/many args
    // the score is double number of extra/missing args
    if (argCount < minParams) {
      score = (minParams - argCount) * 2;
    } else if (argCount > formats.length) {
      score = (argCount - formats.length) * 2;
    }

    // loop through the formats, adding up the error score for each arg.
    // quit early if the score gets higher than the previous best overload.
    for (var p = 0; score <= minScore && p < formats.length; p++) {
      var arg = args[p];
      var format = formats[p];
      // '== null' checks for 'null' and typeof 'undefined'
      if (arg == null) {
        // handle non-optional and non-trailing undefined args
        if (!format.optional || p < minParams || p < argCount) {
          score += 1;
        }
      } else {
        score += testParamTypes(arg, format.types);
      }
    }
    return score;
  };

  // gets a list of errors for this overload
  var getOverloadErrors = function(args, argCount, overload) {
    var formats = overload.formats;
    var minParams = overload.minParams;

    // check for too few/many args
    if (argCount < minParams) {
      return [
        {
          type: 'TOO_FEW_ARGUMENTS',
          argCount: argCount,
          minParams: minParams
        }
      ];
    } else if (argCount > formats.length) {
      return [
        {
          type: 'TOO_MANY_ARGUMENTS',
          argCount: argCount,
          maxParams: formats.length
        }
      ];
    }

    var errorArray = [];
    for (var p = 0; p < formats.length; p++) {
      var arg = args[p];
      var format = formats[p];
      // '== null' checks for 'null' and typeof 'undefined'
      if (arg == null) {
        // handle non-optional and non-trailing undefined args
        if (!format.optional || p < minParams || p < argCount) {
          errorArray.push({
            type: 'EMPTY_VAR',
            position: p,
            format: format
          });
        }
      } else if (testParamTypes(arg, format.types) > 0) {
        errorArray.push({
          type: 'WRONG_TYPE',
          position: p,
          format: format,
          arg: arg
        });
      }
    }

    return errorArray;
  };

  // a custom error type, used by the mocha
  // tests when expecting validation errors
  p5.ValidationError = (function(name) {
    var err = function(message, func) {
      this.message = message;
      this.func = func;
      if ('captureStackTrace' in Error) Error.captureStackTrace(this, err);
      else this.stack = new Error().stack;
    };
    err.prototype = Object.create(Error.prototype);
    err.prototype.name = name;
    err.prototype.constructor = err;
    return err;
  })('ValidationError');

  // function for generating console.log() msg
  p5._friendlyParamError = function(errorObj, func) {
    var message;

    function formatType() {
      var format = errorObj.format;
      return format.types
        .map(function(type) {
          return type.names ? type.names.join('|') : type.name;
        })
        .join('|');
    }

    switch (errorObj.type) {
      case 'EMPTY_VAR':
        message =
          func +
          '() was expecting ' +
          formatType() +
          ' for parameter #' +
          errorObj.position +
          ' (zero-based index), received an empty variable instead.' +
          ' If not intentional, this is often a problem with scope:' +
          ' [https://p5js.org/examples/data-variable-scope.html]';
        break;
      case 'WRONG_TYPE':
        var arg = errorObj.arg;
        var argType =
          arg instanceof Array
            ? 'array'
            : arg === null ? 'null' : arg.name || typeof arg;
        message =
          func +
          '() was expecting ' +
          formatType() +
          ' for parameter #' +
          errorObj.position +
          ' (zero-based index), received ' +
          argType +
          ' instead';
        break;
      case 'TOO_FEW_ARGUMENTS':
        message =
          func +
          '() was expecting at least ' +
          errorObj.minParams +
          ' arguments, but received only ' +
          errorObj.argCount;
        break;
      case 'TOO_MANY_ARGUMENTS':
        message =
          func +
          '() was expecting no more than ' +
          errorObj.maxParams +
          ' arguments, but received ' +
          errorObj.argCount;
        break;
    }

    if (message) {
      if (p5._throwValidationErrors) {
        throw new p5.ValidationError(message);
      }

      try {
        var re = /Function\.validateParameters.*[\r\n].*[\r\n].*\(([^)]*)/;
        var location = re.exec(new Error().stack)[1];
        if (location) {
          message += ' at ' + location;
        }
      } catch (err) {}

      report(message + '.', func, 3);
    }
  };

  /**
   * Validates parameters
   * param  {String}               func    the name of the function
   * param  {Array}                args    user input arguments
   *
   * example:
   *  var a;
   *  ellipse(10,10,a,5);
   * console ouput:
   *  "It looks like ellipse received an empty variable in spot #2."
   *
   * example:
   *  ellipse(10,"foo",5,5);
   * console output:
   *  "ellipse was expecting a number for parameter #1,
   *           received "foo" instead."
   */
  p5._validateParameters = function validateParameters(func, args) {
    if (p5.disableFriendlyErrors) {
      return; // skip FES
    }

    // lookup the docs in the 'data.json' file
    var docs = docCache[func] || (docCache[func] = lookupParamDoc(func));
    var overloads = docs.overloads;

    // ignore any trailing `undefined` arguments
    var argCount = args.length;
    // '== null' checks for 'null' and typeof 'undefined'
    while (argCount > 0 && args[argCount - 1] == null) argCount--;

    // find the overload with the best score
    var minScore = 99999;
    var minOverload;
    for (var i = 0; i < overloads.length; i++) {
      var score = scoreOverload(args, argCount, overloads[i], minScore);
      if (score === 0) {
        return; // done!
      } else if (minScore > score) {
        // this score is better that what we have so far...
        minScore = score;
        minOverload = i;
      }
    }

    // this should _always_ be true here...
    if (minScore > 0) {
      // get the errors for the best overload
      var errorArray = getOverloadErrors(
        args,
        argCount,
        overloads[minOverload]
      );

      // generate err msg
      for (var n = 0; n < errorArray.length; n++) {
        p5._friendlyParamError(errorArray[n], func);
      }
    }
  };

  /**
   * Prints out all the colors in the color pallete with white text.
   * For color blindness testing.
   */
  /* function testColors() {
    var str = 'A box of biscuits, a box of mixed biscuits and a biscuit mixer';
    report(str, 'print', '#ED225D'); // p5.js magenta
    report(str, 'print', '#2D7BB6'); // p5.js blue
    report(str, 'print', '#EE9900'); // p5.js orange
    report(str, 'print', '#A67F59'); // p5.js light brown
    report(str, 'print', '#704F21'); // p5.js gold
    report(str, 'print', '#1CC581'); // auto cyan
    report(str, 'print', '#FF6625'); // auto orange
    report(str, 'print', '#79EB22'); // auto green
    report(str, 'print', '#B40033'); // p5.js darkened magenta
    report(str, 'print', '#084B7F'); // p5.js darkened blue
    report(str, 'print', '#945F00'); // p5.js darkened orange
    report(str, 'print', '#6B441D'); // p5.js darkened brown
    report(str, 'print', '#2E1B00'); // p5.js darkened gold
    report(str, 'print', '#008851'); // auto dark cyan
    report(str, 'print', '#C83C00'); // auto dark orange
    report(str, 'print', '#4DB200'); // auto dark green
  } */

  p5.prototype._validateParameters = p5.validateParameters;
}

// This is a lazily-defined list of p5 symbols that may be
// misused by beginners at top-level code, outside of setup/draw. We'd like
// to detect these errors and help the user by suggesting they move them
// into setup/draw.
//
// For more details, see https://github.com/processing/p5.js/issues/1121.
var misusedAtTopLevelCode = null;
var FAQ_URL =
  'https://github.com/processing/p5.js/wiki/p5.js-overview' +
  '#why-cant-i-assign-variables-using-p5-functions-and-' +
  'variables-before-setup';

var defineMisusedAtTopLevelCode = function() {
  var uniqueNamesFound = {};

  var getSymbols = function(obj) {
    return Object.getOwnPropertyNames(obj)
      .filter(function(name) {
        if (name[0] === '_') {
          return false;
        }
        if (name in uniqueNamesFound) {
          return false;
        }

        uniqueNamesFound[name] = true;

        return true;
      })
      .map(function(name) {
        var type;

        if (typeof obj[name] === 'function') {
          type = 'function';
        } else if (name === name.toUpperCase()) {
          type = 'constant';
        } else {
          type = 'variable';
        }

        return { name: name, type: type };
      });
  };

  misusedAtTopLevelCode = [].concat(
    getSymbols(p5.prototype),
    // At present, p5 only adds its constants to p5.prototype during
    // construction, which may not have happened at the time a
    // ReferenceError is thrown, so we'll manually add them to our list.
    getSymbols(require('./constants'))
  );

  // This will ultimately ensure that we report the most specific error
  // possible to the user, e.g. advising them about HALF_PI instead of PI
  // when their code misuses the former.
  misusedAtTopLevelCode.sort(function(a, b) {
    return b.name.length - a.name.length;
  });
};

var helpForMisusedAtTopLevelCode = function(e, log) {
  if (!log) {
    log = console.log.bind(console);
  }

  if (!misusedAtTopLevelCode) {
    defineMisusedAtTopLevelCode();
  }

  // If we find that we're logging lots of false positives, we can
  // uncomment the following code to avoid displaying anything if the
  // user's code isn't likely to be using p5's global mode. (Note that
  // setup/draw are more likely to be defined due to JS function hoisting.)
  //
  //if (!('setup' in window || 'draw' in window)) {
  //  return;
  //}

  misusedAtTopLevelCode.some(function(symbol) {
    // Note that while just checking for the occurrence of the
    // symbol name in the error message could result in false positives,
    // a more rigorous test is difficult because different browsers
    // log different messages, and the format of those messages may
    // change over time.
    //
    // For example, if the user uses 'PI' in their code, it may result
    // in any one of the following messages:
    //
    //   * 'PI' is undefined                           (Microsoft Edge)
    //   * ReferenceError: PI is undefined             (Firefox)
    //   * Uncaught ReferenceError: PI is not defined  (Chrome)

    if (e.message && e.message.match('\\W?' + symbol.name + '\\W') !== null) {
      log(
        "Did you just try to use p5.js's " +
          symbol.name +
          (symbol.type === 'function' ? '() ' : ' ') +
          symbol.type +
          '? If so, you may want to ' +
          "move it into your sketch's setup() function.\n\n" +
          'For more details, see: ' +
          FAQ_URL
      );
      return true;
    }
  });
};

// Exposing this primarily for unit testing.
p5.prototype._helpForMisusedAtTopLevelCode = helpForMisusedAtTopLevelCode;

if (document.readyState !== 'complete') {
  window.addEventListener('error', helpForMisusedAtTopLevelCode, false);

  // Our job is only to catch ReferenceErrors that are thrown when
  // global (non-instance mode) p5 APIs are used at the top-level
  // scope of a file, so we'll unbind our error listener now to make
  // sure we don't log false positives later.
  window.addEventListener('load', function() {
    window.removeEventListener('error', helpForMisusedAtTopLevelCode, false);
  });
}

module.exports = p5;
