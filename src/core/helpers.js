/**
 * @module Core
 * @submodule Helpers
 * @for p5
 * @requires core
 */
define(function (require) {

  'use strict';

  var p5 = require('core');

  function report(message, func) {
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

  p5.prototype._validateParameters = function(func, args, types) {
    // Parameter numbers
    if (isArray(types[0])) {
      var diff = 1e6;
      var tindex = -1;
      for (var i=0, len=types.length; i<len; i++) {
        var d = Math.abs(args.length-types[i].length);
        if (d <= diff) {
          tindex = i;
          diff = d;
        }
      }
      if(diff > 0) {
        report('Try ' + func + '(' + types[tindex].join(', ') + '). ' +
          func + ' takes different numbers of parameters depending on ' +
          'what you want to do, but it doesn\'t know what to do with ' +
          args.length + ' of them. ', func);
      }
    } else {
      if (args.length !== types.length) {
        report(func + ' is expecting ' + types.length +
          ' parameters, we found ' + args.length + '.', func);
      }
    }
    // Type checking
    if (!isArray(types[0])) {
      types = [types];
    }
    // Check types
    for (var format=0; format<types.length; format++) {
      for (var p=0; p < types[format].length && p < args.length; p++) {
        var type = types[format][p];
        if (getType(args[p]) === 'undefined') {
          report('It looks like ' + func +
            ' received an empty variable in spot #' + (p+1) + '.', func);
        } else if (
          (['Number', 'Integer', 'Number/Constant'].indexOf(type) > -1 &&
            !isNumeric(args[p])) ||
          (type === 'String' && getType(args[p]) !== 'string')
        ) {
          report(func + ' was expecting a ' + type + ' for parameter #' +
            (p+1) + ', received "' + args[p] + '" instead.', func);
        }
      }
    }
  };

  return p5;

});