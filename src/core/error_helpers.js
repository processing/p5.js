/**
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('./core');
var doFriendlyWelcome = true;

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
  if (func.substring(0,4) === 'load'){
    console.log(
      '%c> p5.js says: '+message+'%c'+
      '[https://github.com/processing/p5.js/wiki/Local-server]',
      'background-color:' + color + ';color:#FFF;',
      'background-color:transparent;color:' + color +';',
      'background-color:' + color + ';color:#FFF;',
      'background-color:transparent;color:' + color +';'
    );
  }
  else{
    console.log(
      '%c> p5.js says: '+message+'%c [http://p5js.org/reference/#p5/'+func+
      ']', 'background-color:' + color + ';color:#FFF;',
      'background-color:transparent;color:' + color +';'
    );
  }
}

/**
 * Validate all the parameters of a function for number and type
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
  /**
   * Check number of parameters
   *
   * Example: "You wrote ellipse(X,X,X). ellipse was expecting 4
   *           parameters. Try ellipse(X,X,X,X)."
   */
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
      message += symbol + (','+symbol).repeat(args.length-1);
    }
    message += '). ' + func + ' was expecting ' + types[tindex].length +
      ' parameters. Try ' + func + '(';
    // Concat an appropriate number of placeholders for definition
    if (types[tindex].length > 0) {
      message += symbol + (','+symbol).repeat(types[tindex].length-1);
    }
    message += ').';
    // If multiple definitions
    if (types.length > 1) {
      message += ' ' + func + ' takes different numbers of parameters ' +
        'depending on what you want to do. Click this link to learn more: ';
    }
    report(message, func, PARAM_COUNT);
  }
  /**
   * Type checking
   *
   * Example: "It looks like ellipse received an empty variable in spot #2."
   * Example: "ellipse was expecting a number for parameter #1,
   *           received "foo" instead."
   */
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
  }
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
  report(str, 'println', '#ED225D'); // p5.js magenta
  report(str, 'println', '#2D7BB6'); // p5.js blue
  report(str, 'println', '#EE9900'); // p5.js orange
  report(str, 'println', '#A67F59'); // p5.js light brown
  report(str, 'println', '#704F21'); // p5.js gold
  report(str, 'println', '#1CC581'); // auto cyan
  report(str, 'println', '#FF6625'); // auto orange
  report(str, 'println', '#79EB22'); // auto green
  report(str, 'println', '#B40033'); // p5.js darkened magenta
  report(str, 'println', '#084B7F'); // p5.js darkened blue
  report(str, 'println', '#945F00'); // p5.js darkened orange
  report(str, 'println', '#6B441D'); // p5.js darkened brown
  report(str, 'println', '#2E1B00'); // p5.js darkened gold
  report(str, 'println', '#008851'); // auto dark cyan
  report(str, 'println', '#C83C00'); // auto dark orange
  report(str, 'println', '#4DB200'); // auto dark green
} */

module.exports = p5;
