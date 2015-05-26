/**
 * @module Shape
 * @submodule 2D Primitives
 * @for p5
 * @requires core
 * @requires canvas
 * @requires constants
 */
define(function (require) {

  'use strict';

  var p5 = require('core');

  function getStackTrace() {
    var obj = {};
    Error.captureStackTrace(obj, getStackTrace);
    console.log(obj)
    return obj.stack;
  }

  function getLineNumber() {
    var obj = {};
    Error.captureStackTrace(obj, getStackTrace);
    return obj.stack;
  }

  function report(message) {
    console.error(message + ' Try line '+getStackTrace());
  }

  p5.prototype._checkParameterExists = function(param, message) {
    if (typeof param === 'undefined') {
      report(message);
    }
  };

  p5.prototype._checkParameterIsNumeric = function(param, func, order) {
  };

  return p5;
});