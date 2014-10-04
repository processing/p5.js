/**
 * @module Data
 * @submodule Conversion
 * @for p5
 * @requires core
 */
define(function (require) {

  'use strict';

  var p5 = require('core');

  /**
   * Converts a string to its floating point representation. The contents of a
   * string must resemble a number, or NaN (not a number) will be returned. 
   * For example, float("1234.56") evaluates to 1234.56, but float("giraffe") 
   * will return NaN.
   *
   * @method float
   * @param {String}  str float string to parse
   * @return {Number}     floating point representation of string
   * @example
   * <div><code>
   * var str = '20';
   * var diameter = float(str);
   * ellipse(width/2, height/2, diameter, diameter);
   * </code></div>
   */
  p5.prototype.float = function(str) {
    return parseFloat(str);
  };

  /**
   * 
   * @param {String}  str float string to parse
   * @return {Number}     floating point representation of string
   * @example
   * <div><code>
   * var str = '20';
   * var diameter = float(str);
   * ellipse(width/2, height/2, diameter, diameter);
   * </code></div>
   */
  // p5.prototype.int = function(str) {
  // };


  return p5;

});
