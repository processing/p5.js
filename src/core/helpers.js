/**
 * @module Core
 * @submodule Helpers
 * @for p5
 * @requires core
 */
define(function (require) {

  'use strict';

  var p5 = require('core');

  function report(message) {
    console.error(message);
  }

  // Based on the jQuery method
  function isNumeric(obj) {
    return Array.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
  }

  p5.prototype._checkParameterExists = function(param, message) {
    if (typeof param === 'undefined') {
      report(message);
    }
  };

  p5.prototype._checkParameterIsNumeric = function(param, func, order) {
    if (!isNumeric(param)) {
      report(func + ' was expecting a number, received "'+ param +
        '" (parameter #' + order + ')');
    }
  };


  return p5;
});