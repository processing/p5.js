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
   * Converts a boolean, string, or float to its integer representation.
   * When an array of values is passed in, then an int array of the same length 
   * is returned.
   *
   * @method int
   * @param {String|Boolean|Number|Array} n value to parse
   * @return {Number}                     integer representation of value
   * @example
   * <div class='norender'><code>
   * print(int("10")); // 10
   * print(int(10.31)); // 10
   * print(int(-10)); // -10
   * print(int(true)); // 1
   * print(int(false)); // 0
   * print(int([false, true, "10.3", 9.8])); // [0, 1, 10, 9]
   * </code></div>
   */
  p5.prototype.int = function(n, radix) {
    if (typeof n === 'string') {
      radix = radix || 10;
      return parseInt(n, radix);
    } else if (typeof n === 'number') {
      return n | 0;
    } else if (typeof n === 'boolean') {
      return n ? 1 : 0;
    } else if (n instanceof Array) {
      return n.map(p5.prototype.int);
    }
  };


  return p5;

});
