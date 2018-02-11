/**
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('./core');
var constants = require('./constants');

if (typeof IS_MINIFIED !== 'undefined') {
  p5._friendlyFileLoadError = function() {};
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
   * @private
   * @param  {String}               message the words to be said
   * @param  {String}               func    the name of the function to link
   * @param  {Number|String} color   CSS color string or error type
   *
   * @return console logs
   */
  // Wrong number of params, undefined param, wrong type
  var FILE_LOAD = 3;
  var ERR_PARAMS = 3;
  // p5.js blue, p5.js orange, auto dark green; fallback p5.js darkened magenta
  // See testColors below for all the color codes and names
  var typeColors = ['#2D7BB6', '#EE9900', '#4DB200', '#C83C00'];
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
    if (func.substring(0, 4) === 'load') {
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
    }
  };
  p5._friendlyFileLoadError = function(errorType, filePath) {
    var errorInfo = errorCases[errorType];
    var message =
      'It looks like there was a problem' +
      ' loading your ' +
      errorInfo.fileType +
      '.' +
      ' Try checking if the file path [' +
      filePath +
      '] is correct,' +
      (errorInfo.message || '') +
      ' or running a local server.';
    report(message, errorInfo.method, FILE_LOAD);
  };

  var builtinTypes = [
    'number',
    'string',
    'boolean',
    'constant',
    'function',
    'any',
    'integer'
  ];

  // validateParameters() helper functions:
  // parseParamDoc() for querying data.json
  var parseParamDoc = function(docData) {
    /*
    var queryResult = arrDoc.classitems.filter(function(x) {
      return x.name === func;
    });
    var docData = queryResult[0];
    */

    var func = docData.name;
    // different JSON structure for funct with multi-format
    var overloads = [];
    if (docData.hasOwnProperty('overloads')) {
      for (var i = 0; i < docData.overloads.length; i++) {
        overloads.push(docData.overloads[i].params);
      }
    } else {
      overloads.push(docData.params || []);
    }

    var mapConstants = {};
    var maxParams = 0;
    overloads.forEach(function(formats) {
      if (maxParams < formats.length) {
        maxParams = formats.length;
      }
      formats.forEach(function(format) {
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
      name: func,
      overloads: overloads,
      maxParams: maxParams
    };
  };

  var testParamType = function(param, type) {
    var isArray = param instanceof Array;
    if (type.array && isArray) {
      for (var i = 0; i < param.length; i++) {
        if (!testParamType(param[i], type.array)) {
          return false;
        }
      }
      return true;
    } else if (type.prototype) {
      return param instanceof type.prototype;
    } else if (type.builtin) {
      switch (type.builtin) {
        case 'number':
          return typeof param === 'number' || (!!param && !isNaN(param));
        case 'integer':
          return (
            (typeof param === 'number' || (!!param && !isNaN(param))) &&
            Number(param) === Math.floor(param)
          );
        case 'boolean':
        case 'any':
          return true;
        case 'array':
          return isArray;
        case 'string':
          return typeof param === 'number' || typeof param === 'string';
        case 'constant':
          return type.values.hasOwnProperty(param);
        case 'function':
          return param instanceof Function;
      }
    }

    return typeof param === type.t;
  };

  // testType() for non-object type parameter validation
  // Returns true if PASS, false if FAIL
  var testParamTypes = function(param, types) {
    for (var i = 0; i < types.length; i++) {
      if (testParamType(param, types[i])) {
        return true;
      }
    }
    return false;
  };

  var testParamFormat = function(args, formats) {
    var errorArray = [];
    for (var p = 0; p < formats.length; p++) {
      var arg = args[p];
      var format = formats[p];
      var argType = typeof arg;
      if ('undefined' === argType || null === arg) {
        if (format.optional !== true) {
          errorArray.push({
            type: 'EMPTY_VAR',
            position: p,
            format: format
          });
        }
      } else if (!testParamTypes(arg, format.types)) {
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

  // function for generating console.log() msg
  var friendlyParamError = function(errorObj, func) {
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
        var argType = arg instanceof Array ? 'array' : arg.name || typeof arg;
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
      case 'WRONG_ARGUMENT_COUNT':
        message =
          func +
          '() was expecting ' +
          errorObj.maxParams +
          ' arguments, but received ' +
          errorObj.argCount;
        break;
    }

    if (message) {
      try {
        var re = /Function\.validateParameters.*[\r\n].*[\r\n].*\(([^)]*)/;
        var location = re.exec(new Error().stack)[1];
        if (location) {
          message += ' at ' + location;
        }
      } catch (err) {}

      report(message + '.', func, ERR_PARAMS);
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
  var validateParameters = function(docData, args) {
    if (p5.disableFriendlyErrors) {
      return; // skip FES
    }

    var func = docData.name;
    var docs = docData.docs || (docData.docs = parseParamDoc(docData));
    var errorArray = [];
    var minErrCount = 999999;
    var overloads = docs.overloads;
    for (var i = 0; i < overloads.length; i++) {
      var arrError = testParamFormat(args, overloads[i]);
      // see if this is the format with min number of err
      if (minErrCount > arrError.length) {
        minErrCount = arrError.length;
        errorArray = arrError;
      }
      if (arrError.length === 0) {
        break; // no error
      }
    }

    if (!errorArray.length && args.length > docs.maxParams) {
      errorArray.push({
        type: 'WRONG_ARGUMENT_COUNT',
        argCount: args.length,
        maxParams: docs.maxParams
      });
    }

    // generate err msg
    for (var n = 0; n < errorArray.length; n++) {
      friendlyParamError(errorArray[n], func);
    }
  };

  // this is only for use by the mocha tests
  p5._validateParameters = function(func, args) {
    var classitems = arrDoc.classitems;
    for (var i = 0; i < classitems.length; i++) {
      var classitem = classitems[i];
      if (classitem.class === 'p5' && classitem.name === func) {
        validateParameters(classitem, args);
        return;
      }
    }
  };

  var skipValidation = ['httpDo', 'createCapture', 'loadJSON', 'loadTable'];

  var _validationInitialized = false;
  p5._initializeParameterValidation = function() {
    if (_validationInitialized) {
      return;
    }
    _validationInitialized = true;
    var nestedValidation = false;
    var classitems = arrDoc.classitems;
    var typeMap = {};
    for (var i = 0; i < classitems.length; i++) {
      var classitem = classitems[i];
      var typeName = classitem.class;
      if (classitem.module === 'p5.sound' || typeName === 'p5.RendererGL') {
        continue; // not ready yet
      }
      if (typeName === 'p5.dom') {
        typeName = 'p5';
      }

      if (
        classitem.itemtype !== 'method' ||
        classitem.private ||
        (typeName === 'p5' && skipValidation.indexOf(classitem.name) >= 0)
      ) {
        continue;
      }
      var type;
      if (typeMap.hasOwnProperty(typeName)) {
        type = typeMap[typeName];
      } else {
        var t = null;
        var parts = typeName.split('.');
        if (parts[0] === 'p5') {
          t = p5;
          for (var ip = 1; t && ip < parts.length; ip++) t = t[parts[ip]];
        }
        type = typeMap[typeName] = t || null;
      }

      if (!type) {
        continue;
      }
      var pr = classitem.static ? type : type.prototype;
      var fn = pr[classitem.name];
      if (typeof fn === 'function') {
        var proxy = (function(fn, vp, classitem) {
          return function validatingProxy() {
            if (nestedValidation) {
              return fn.apply(this, arguments);
            }

            nestedValidation = true;
            try {
              vp(classitem, arguments);
              return fn.apply(this, arguments);
            } finally {
              nestedValidation = false;
            }
          };
        })(fn, validateParameters, classitem);
        if (window[classitem.name] === pr[classitem.name]) {
          window[classitem.name] = proxy;
        }
        pr[classitem.name] = proxy;
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
