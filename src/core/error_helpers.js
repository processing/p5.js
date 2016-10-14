/**
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('./core');
var doFriendlyWelcome = false; // TEMP until we get it all working LM

// -- Borrowed from jQuery 1.11.3 --
var class2type = {};
var toString = class2type.toString;
var names = ['Boolean', 'Number', 'String', 'Function',
             'Array', 'Date', 'RegExp', 'Object', 'Error'];
for (var n=0; n<names.length; n++) {
  class2type[ '[object ' + names[n] + ']' ] = names[n].toLowerCase();
}
var getType = function( obj ) {
  if ( obj == null ) {
    return obj + '';
  }
  return typeof obj === 'object' || typeof obj === 'function' ?
    class2type[ toString.call(obj) ] || 'object' :
    typeof obj;
};
var isArray = Array.isArray || function( obj ) {
  return getType(obj) === 'array';
};
var isNumeric =function( obj ) {
  // parseFloat NaNs numeric-cast false positives (null|true|false|"")
  // ...but misinterprets leading-number strings, particularly hex literals
  // subtraction forces infinities to NaN
  // adding 1 corrects loss of precision from parseFloat (#15100)
  return !isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
};
// -- End borrow --

/**
 * Checks the definition type against the argument type
 * If any of these passes (in order), it matches:
 *
 * - p5.* definitions are checked with instanceof
 * - Booleans are let through (everything is truthy or falsey)
 * - Lowercase of the definition is checked against the js type
 * - Number types are checked to see if they are numerically castable
 */
var numberTypes = ['Number', 'Integer', 'Number/Constant'];
function typeMatches(defType, argType, arg) {
  if(defType.match(/^p5\./)) {
    var parts = defType.split('.');
    return arg instanceof p5[parts[1]];
  }
  return defType === 'Boolean' || // Anything is truthy, cover in Debug Guide
    (defType.toLowerCase() === argType) ||
    (numberTypes.indexOf(defType) > -1 && isNumeric(arg));
}

/**
 * Prints out a fancy, colorful message to the console log
 *
 * @param  {String}               message the words to be said
 * @param  {String}               func    the name of the function to link
 * @param  {Integer/Color String} color   CSS color string or error type
 *
 * @return console logs
 */
// Wrong number of params, undefined param, wrong type
var PARAM_COUNT = 0;
var EMPTY_VAR = 1;
var WRONG_TYPE = 2;
var FILE_LOAD = 3;
// p5.js blue, p5.js orange, auto dark green; fallback p5.js darkened magenta
// See testColors below for all the color codes and names
var typeColors = ['#2D7BB6', '#EE9900', '#4DB200', '#C83C00'];
function report(message, func, color) {
  if(doFriendlyWelcome){
    friendlyWelcome();
    doFriendlyWelcome =false;
  }
  if ('undefined' === getType(color)) {
    color   = '#B40033'; // dark magenta
  } else if (getType(color) === 'number') { // Type to color
    color = typeColors[color];
  }
  // LM TEMP commenting this out until we get the whole system working
  // if (func.substring(0,4) === 'load'){
  //   console.log(
  //     '%c> p5.js says: '+message+'%c'+
  //     '[https://github.com/processing/p5.js/wiki/Local-server]',
  //     'background-color:' + color + ';color:#FFF;',
  //     'background-color:transparent;color:' + color +';',
  //     'background-color:' + color + ';color:#FFF;',
  //     'background-color:transparent;color:' + color +';'
  //   );
  // }
  // else{
  //   console.log(
  //     '%c> p5.js says: '+message+'%c [http://p5js.org/reference/#p5/'+func+
  //     ']', 'background-color:' + color + ';color:#FFF;',
  //     'background-color:transparent;color:' + color +';'
  //   );
  // }
}

/**
 * Validate all the parameters of a function for number and type
 * NOTE THIS FUNCTION IS TEMPORARILY DISABLED UNTIL FURTHER WORK
 * AND UPDATES ARE IMPLEMENTED. -LMCCART
 *
 * @param  {String} func  name of function we're checking
 * @param  {Array}  args  pass of the JS default arguments array
 * @param  {Array}  types List of types accepted ['Number', 'String, ...] OR
 *                        a list of lists for each format: [
 *                          ['String', 'Number', 'Number'],
 *                          ['String', 'Number', 'Number', 'Number', 'Number'
 *                        ]
 *
 * @return console logs
 */
p5.prototype._validateParameters = function(func, args, types) {
  if (!isArray(types[0])) {
    types = [types];
  }
  // Check number of parameters
  // Example: "You wrote ellipse(X,X,X). ellipse was expecting 4
  //          parameters. Try ellipse(X,X,X,X)."
  var diff = Math.abs(args.length-types[0].length);
  var message, tindex = 0;
  for (var i=1, len=types.length; i<len; i++) {
    var d = Math.abs(args.length-types[i].length);
    if (d <= diff) {
      tindex = i;
      diff = d;
    }
  }
  var symbol = 'X'; // Parameter placeholder
  if(diff > 0) {
    message = 'You wrote ' + func + '(';
    // Concat an appropriate number of placeholders for call
    if (args.length > 0) {
      message += symbol + Array(args.length).join(',' + symbol);
    }
    message += '). ' + func + ' was expecting ' + types[tindex].length +
      ' parameters. Try ' + func + '(';
    // Concat an appropriate number of placeholders for definition
    if (types[tindex].length > 0) {
      message += symbol + Array(types[tindex].length).join(',' + symbol);
    }
    message += ').';
    // If multiple definitions
    if (types.length > 1) {
      message += ' ' + func + ' takes different numbers of parameters ' +
        'depending on what you want to do. Click this link to learn more: ';
    }
    report(message, func, PARAM_COUNT);
  }
  // Type checking
  // Example: "It looks like ellipse received an empty variable in spot #2."
  // Example: "ellipse was expecting a number for parameter #1,
  //           received "foo" instead."
  for (var format=0; format<types.length; format++) {
    for (var p=0; p < types[format].length && p < args.length; p++) {
      var defType = types[format][p];
      var argType = getType(args[p]);
      if ('undefined' === argType || null === argType) {
        report('It looks like ' + func +
          ' received an empty variable in spot #' + (p+1) +
          '. If not intentional, this is often a problem with scope: ' +
          '[link to scope].', func, EMPTY_VAR);
      } else if (defType !== '*' && !typeMatches(defType, argType, args[p])) {
        message = func + ' was expecting a ' + defType.toLowerCase() +
          ' for parameter #' + (p+1) + ', received ';
        // Wrap strings in quotes
        message += 'string' === argType ? '"' + args[p] + '"' : args[p];
        message += ' instead.';
        // If multiple definitions
        if (types.length > 1) {
          message += ' ' + func + ' takes different numbers of parameters ' +
            'depending on what you want to do. ' +
            'Click this link to learn more:';
        }
        report(message, func, WRONG_TYPE);
      }
    }
  }
};
/*
 * NOTE THIS FUNCTION IS TEMPORARILY DISABLED UNTIL FURTHER WORK
 * AND UPDATES ARE IMPLEMENTED. -LMCCART
 */
p5.prototype._validateParameters = function() {
  return true;
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
};
p5._friendlyFileLoadError = function (errorType, filePath) {
  var errorInfo = errorCases[ errorType ];
  var message = 'It looks like there was a problem' +
  ' loading your ' + errorInfo.fileType + '.' +
  ' Try checking if the file path%c [' + filePath + '] %cis correct,' +
  (errorInfo.message || '') + ' or running a local server.';
  report(message, errorInfo.method, FILE_LOAD);
};

function friendlyWelcome() {
  // p5.js brand - magenta: #ED225D
  var astrixBgColor = 'transparent';
  var astrixTxtColor = '#ED225D';
  var welcomeBgColor = '#ED225D';
  var welcomeTextColor = 'white';
  console.log(
  '%c    _ \n'+
  ' /\\| |/\\ \n'+
  ' \\ ` \' /  \n'+
  ' / , . \\  \n'+
  ' \\/|_|\\/ '+
  '\n\n%c> p5.js says: Welcome! '+
  'This is your friendly debugger. ' +
  'To turn me off switch to using “p5.min.js”.',
  'background-color:'+astrixBgColor+';color:' + astrixTxtColor +';',
  'background-color:'+welcomeBgColor+';color:' + welcomeTextColor +';'
  );
}

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

// This is a lazily-defined list of p5 symbols that may be
// misused by beginners at top-level code, outside of setup/draw. We'd like
// to detect these errors and help the user by suggesting they move them
// into setup/draw.
//
// For more details, see https://github.com/processing/p5.js/issues/1121.
var misusedAtTopLevelCode = null;
var FAQ_URL = 'https://github.com/processing/p5.js/wiki/' +
              'Frequently-Asked-Questions' +
              '#why-cant-i-assign-variables-using-p5-functions-and-' +
              'variables-before-setup';

function defineMisusedAtTopLevelCode() {
  var uniqueNamesFound = {};

  var getSymbols = function(obj) {
    return Object.getOwnPropertyNames(obj).filter(function(name) {
      if (name[0] === '_') {
        return false;
      }
      if (name in uniqueNamesFound) {
        return false;
      }

      uniqueNamesFound[name] = true;

      return true;
    }).map(function(name) {
      var type;

      if (typeof(obj[name]) === 'function') {
        type = 'function';
      } else if (name === name.toUpperCase()) {
        type = 'constant';
      } else {
        type = 'variable';
      }

      return {name: name, type: type};
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
}

function helpForMisusedAtTopLevelCode(e, log) {
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

    if (e.message && e.message.match('\\W?'+symbol.name+'\\W') !== null) {
      log('%cDid you just try to use p5.js\'s ' + symbol.name +
          (symbol.type === 'function' ? '() ' : ' ') + symbol.type +
          '? If so, you may want to ' +
          'move it into your sketch\'s setup() function.\n\n' +
          'For more details, see: ' + FAQ_URL,
          'color: #B40033' /* Dark magenta */);
      return true;
    }
  });
}

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
