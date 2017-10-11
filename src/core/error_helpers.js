/**
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('./core');
var doFriendlyWelcome = false; // TEMP until we get it all working LM
// for parameter validation
var dataDoc = require('../../docs/reference/data.json');
var arrDoc = JSON.parse(JSON.stringify(dataDoc));

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

// -- End borrow --


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
      '> p5.js says: '+message+
      '[https://github.com/processing/p5.js/wiki/Local-server]'
    );
  }
  else{
    console.log(
      '> p5.js says: '+message+' [http://p5js.org/reference/#p5/'+func+
      ']'
    );
  }
}

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
  ' Try checking if the file path [' + filePath + '] is correct,' +
  (errorInfo.message || '') + ' or running a local server.';
  report(message, errorInfo.method, FILE_LOAD);
};

var docCache = {};
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
  if (p5.disableFriendlyErrors ||
    typeof(IS_MINIFIED) !== 'undefined') {
    return; // skip FES
  }
  var arrDoc = docCache[func] || (docCache[func] = lookupParamDoc(func));
  var errorArray = [];
  var minErrCount = 999999;
  if (arrDoc.length > 1){   // func has multiple formats
    for (var i = 0; i < arrDoc.length; i++) {
      var arrError = testParamFormat(args, arrDoc[i]);
      if( arrError.length === 0) {
        return; // no error
      }
      // see if this is the format with min number of err
      if( minErrCount > arrError.length) {
        minErrCount = arrError.length;
        errorArray = arrError;
      }
    }
    // generate err msg
    for (var n = 0; n < errorArray.length; n++) {
      p5._friendlyParamError(errorArray[n], func);
    }
  } else {                 // func has a single format
    errorArray = testParamFormat(args, arrDoc[0]);
    for(var m = 0; m < errorArray.length; m++) {
      p5._friendlyParamError(errorArray[m], func);
    }
  }
};
// validateParameters() helper functions:
// lookupParamDoc() for querying data.json
function lookupParamDoc(func){
  var queryResult = arrDoc.classitems.
    filter(function (x) { return x.name === func; });
  // different JSON structure for funct with multi-format
  if (queryResult[0].hasOwnProperty('overloads')){
    var res = [];
    for(var i = 0; i < queryResult[0].overloads.length; i++) {
      res.push(queryResult[0].overloads[i].params);
    }
    return res;
  } else {
    return [queryResult[0].params];
  }
}
function testParamFormat(args, format){
  var errorArray = [];
  var error;
  for (var p = 0; p < format.length; p++) {
    var argType = typeof(args[p]);
    if ('undefined' === argType || null === argType) {
      if (format[p].optional !== true) {
        error = {type:'EMPTY_VAR', position: p};
        errorArray.push(error);
      }
    } else {
      var types = format[p].type.split('|'); // case accepting multi-types
      if (argType === 'object'){             // if object, test for class
        if (!testParamClass(args[p], types)) {  // if fails to pass
          error = {type:'WRONG_CLASS', position: p,
            correctClass: types[p], wrongClass: args[p].name};
          errorArray.push(error);
        }
      }else{                                 // not object, test for type
        if (!testParamType(args[p], types)) {  // if fails to pass
          error = {type:'WRONG_TYPE', position: p,
            correctType: types[p], wrongType: argType};
          errorArray.push(error);
        }
      }
    }
  }
  return errorArray;
}
// testClass() for object type parameter validation
// Returns true if PASS, false if FAIL
function testParamClass(param, types){
  for (var i = 0; i < types.length; i++) {
    if (types[i] === 'Array') {
      if(param instanceof Array) {
        return true;
      }
    } else {
      if (param.name === types[i]) {
        return true;      // class name match, pass
      } else if (types[i] === 'Constant') {
        return true;      // accepts any constant, pass
      }
    }
  }
  return false;
}
// testType() for non-object type parameter validation
// Returns true if PASS, false if FAIL
function testParamType(param, types){
  for (var i = 0; i < types.length; i++) {
    if (typeof(param) === types[i].toLowerCase()) {
      return true;      // type match, pass
    } else if (types[i] === 'Constant') {
      return true;      // accepts any constant, pass
    }
  }
  return false;
}
// function for generating console.log() msg
p5._friendlyParamError = function (errorObj, func) {
  var message;
  switch (errorObj.type){
    case 'EMPTY_VAR':
      message = 'It looks like ' + func +
        '() received an empty variable in spot #' + errorObj.position +
        ' (zero-based index). If not intentional, this is often a problem' +
        ' with scope: [https://p5js.org/examples/data-variable-scope.html].';
      report(message, func, ERR_PARAMS);
      break;
    case 'WRONG_CLASS':
      message = func + '() was expecting ' + errorObj.correctClass +
        ' for parameter #' + errorObj.position + ' (zero-based index), received ';
      // Wrap strings in quotes
      message += 'an object with name '+ errorObj.wrongClass +' instead.';
      report(message, func, ERR_PARAMS);
      break;
    case 'WRONG_TYPE':
      message = func + '() was expecting ' + errorObj.correctType +
        ' for parameter #' + errorObj.position + ' (zero-based index), received ';
      // Wrap strings in quotes
      message += errorObj.wrongType + ' instead.';
      report(message, func, ERR_PARAMS);
  }
};
function friendlyWelcome() {
  // p5.js brand - magenta: #ED225D
  //var astrixBgColor = 'transparent';
  //var astrixTxtColor = '#ED225D';
  //var welcomeBgColor = '#ED225D';
  //var welcomeTextColor = 'white';
  console.log(
  '    _ \n'+
  ' /\\| |/\\ \n'+
  ' \\ ` \' /  \n'+
  ' / , . \\  \n'+
  ' \\/|_|\\/ '+
  '\n\n> p5.js says: Welcome! '+
  'This is your friendly debugger. ' +
  'To turn me off switch to using “p5.min.js”.'
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
      log('Did you just try to use p5.js\'s ' + symbol.name +
          (symbol.type === 'function' ? '() ' : ' ') + symbol.type +
          '? If so, you may want to ' +
          'move it into your sketch\'s setup() function.\n\n' +
          'For more details, see: ' + FAQ_URL);
      return true;
    }
  });
}

// Exposing this primarily for unit testing.
p5.prototype._helpForMisusedAtTopLevelCode = helpForMisusedAtTopLevelCode;
p5.prototype._validateParameters = p5.validateParameters;

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
