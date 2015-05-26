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

  function report(message) {
    console.info(message);
    var obj = {};
    Error.captureStackTrace(obj, getStackTrace);
    console.info(obj.stack);
  }

  p5.prototype._checkParameterExists = function(param, message) {
    if (typeof param === "undefined") {
      report(message);
    }
  }
}