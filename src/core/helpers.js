/**
 * @module Core
 * @submodule Helpers
 * @for p5
 * @requires core
 */
define(function (require) {

  'use strict';

  var p5 = require('core');

  // Wrong number of params, undefined param, wrong type
  var PARAM_COUNT = 0;
  var EMPTY_VAR = 1;
  var WRONG_TYPE = 2;
  var typeColors = ['#008851', '#C83C00', '#4DB200'];

  function report(message, func, color) {
    // p5.js brand - magenta: #ED225D, blue: #2D7BB6
    // Pallete off magenta:      cyan: #1CC581, orange: #FF6625, green: #79EB22
    // - Dark: magenta: #B40033, cyan: #008851, orange: #C83C00, green: #4DB200
    // TODO: Alternate colors for rows?
    // TODO: Emphasized colors? Highlighting?
    if ('undefined' === getType(color)) {
      color   = '#B40033'; // dark magenta
    } else if (getType(color) === 'number') { // Type to color
      color = typeColors[color];
    }
    console.log(
      '%c' + message + ' [http://p5js.org/reference/#p5/' + func + ']',
      'background-color:#ED225D;color:#FFF;padding:2px;'
    );
  }

  var class2type = {};
  var toString = class2type.toString;
  var names = ['Boolean', 'Number', 'String', 'Function',
               'Array', 'Date', 'RegExp', 'Object', 'Error'];
  for (var n=0; n<names.length; n++) {
    class2type[ '[object ' + names[n] + ']' ] = names[n].toLowerCase();
  }

  // -- Borrowed from jQuery 1.11.3 --
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

  var numberTypes = ['Number', 'Integer', 'Number/Constant'];
  function typeMatches(defType, argType, arg) {
    // 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'
    return (defType === 'Boolean' || // Anything is truthy, cover in Debug Guide
      (defType.toLowerCase() === argType) ||
      (numberTypes.indexOf(defType) > -1 && isNumeric(arg));
  }

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
        } else if (!typeMatches(defType, argType, args[p])) {
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
          report(message, func);
        }
      }
    }
  };

  return p5;

});