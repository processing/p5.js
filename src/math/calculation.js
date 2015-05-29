/**
 * @module Math
 * @submodule Calculation
 * @for p5
 * @requires core
 */
define(function (require) {

  'use strict';

  var p5 = require('core');

  /**
   * Calculates the absolute value (magnitude) of a number. Maps to Math.abs().
   * The absolute value of a number is always positive.
   * 
   * @method abs
   * @param  {Number} n number to compute
   * @return {Number}   absolute value of given number
   */
  p5.prototype.abs = Math.abs;

  /**
   * Calculates the closest int value that is greater than or equal to the
   * value of the parameter. Maps to Math.ceil(). For example, ceil(9.03)
   * returns the value 10.
   *
   * @method ceil
   * @param  {Number} n number to round up
   * @return {Number}   rounded up number
   */
  p5.prototype.ceil = Math.ceil;

  /**
   * Constrains a value to not exceed a maximum and minimum value.
   *
   * @method constrain
   * @param  {Number} n    number to constrain
   * @param  {Number} low  minimum limit
   * @param  {Number} high maximum limit
   * @return {Number}      constrained number
   */
  p5.prototype.constrain = function(n, low, high) {
    return Math.max(Math.min(n, high), low);
  };

  /**
   * Calculates the distance between two points.
   *
   * @method dist
   * @param  {Number} x1 x-coordinate of the first point
   * @param  {Number} y1 y-coordinate of the first point
   * @param  {Number} x2 x-coordinate of the second point
   * @param  {Number} y2 y-coordinate of the second point
   * @return {Number}    distance between the two points
   */
  p5.prototype.dist = function(x1, y1, x2, y2) {
    return Math.sqrt( (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) );
  };
  
  /**
   * Returns Euler's number e (2.71828...) raised to the power of the n
   * parameter. Maps to Math.exp().
   *
   * @method exp
   * @param  {Number} n exponent to raise
   * @return {Number}   e^n
   */
  p5.prototype.exp = Math.exp;
  
  /**
   * Calculates the closest int value that is less than or equal to the
   * value of the parameter. Maps to Math.floor().
   *
   * @method floor
   * @param  {Number} n number to round down
   * @return {Number}   rounded down number
   */
  p5.prototype.floor = Math.floor;
  
  /**
   * Calculates a number between two numbers at a specific increment. The amt
   * parameter is the amount to interpolate between the two values where 0.0
   * equal to the first point, 0.1 is very near the first point, 0.5 is
   * half-way in between, etc. The lerp function is convenient for creating
   * motion along a straight path and for drawing dotted lines.
   *
   * @method lerp
   * @param  {Number} start first value
   * @param  {Number} stop  second value
   * @param  {Number} amt   number between 0.0 and 1.0
   * @return {Number}       lerped value
   */
  p5.prototype.lerp = function(start, stop, amt) {
    return amt*(stop-start)+start;
  };
  
  /**
   * Calculates the natural logarithm (the base-e logarithm) of a number. This
   * function expects the n parameter to be a value greater than 0.0. Maps to
   * Math.log().
   *
   * @method log
   * @param  {Number} n number greater than 0
   * @return {Number}   natural logarithm of n
   */
  p5.prototype.log = Math.log;
  
  /**
   * Calculates the magnitude (or length) of a vector. A vector is a direction
   * in space commonly used in computer graphics and linear algebra. Because it
   * has no "start" position, the magnitude of a vector can be thought of as
   * the distance from the coordinate 0,0 to its x,y value. Therefore, mag() is
   * a shortcut for writing dist(0, 0, x, y).
   *
   * @method mag
   * @param  {Number} a first value
   * @param  {Number} b second value
   * @return {Number}   magnitude of vector from (0,0) to (a,b)
   */
  p5.prototype.mag = function(x, y) {
    return Math.sqrt(x*x+y*y);
  };
  
  /**
   * Re-maps a number from one range to another.
   * In the first example above, the number 25 is converted from a value in the
   * range of 0 to 100 into a value that ranges from the left edge of the
   * window (0) to the right edge (width).
   *
   * @method map
   * @param  {Number} value  the incoming value to be converted
   * @param  {Number} start1 lower bound of the value's current range
   * @param  {Number} stop1  upper bound of the value's current range
   * @param  {Number} start2 lower bound of the value's target range
   * @param  {Number} stop   upper bound of the value's target range
   * @return {Number}        remapped number
   * @example
   *   <div><code>
   *     createCanvas(200, 200);
   *     var value = 25;
   *     var m = map(value, 0, 100, 0, width);
   *     ellipse(m, 200, 10, 10);
   *   </code></div>
   *
   *   <div><code>
   *     function setup() {
   *       createCanvs(200, 200);
   *       noStroke();
   *     }
   *
   *     function draw() {
   *       background(204);
   *       var x1 = map(mouseX, 0, width, 50, 150);
   *       ellipse(x1, 75, 50, 50);  
   *       var x2 = map(mouseX, 0, width, 0, 200);
   *       ellipse(x2, 125, 50, 50);  
   *     }
   *   </code></div>
   */
  p5.prototype.map = function(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
  };
  
  /**
   * Determines the largest value in a sequence of numbers, and then returns
   * that value. max() accepts any number of Number parameters, or an Array
   * of any length.
   *
   * @method max
   * @param  {Number|Array} n0 Numbers to compare
   * @return {Number}          maximum Number
   */
  p5.prototype.max = function() {
    if (arguments[0] instanceof Array) {
      return Math.max.apply(null,arguments[0]);
    } else {
      return Math.max.apply(null,arguments);
    }
  };
  
  /**
   * Determines the smallest value in a sequence of numbers, and then returns
   * that value. min() accepts any number of Number parameters, or an Array
   * of any length.
   *
   * @method min
   * @param  {Number|Array} n0 Numbers to compare
   * @return {Number}          minimum Number
   */
  p5.prototype.min = function() {
    if (arguments[0] instanceof Array) {
      return Math.min.apply(null,arguments[0]);
    } else {
      return Math.min.apply(null,arguments);
    }
  };
  
  /**
   * Normalizes a number from another range into a value between 0 and 1.
   * Identical to map(value, low, high, 0, 1).
   * Numbers outside of the range are not clamped to 0 and 1, because
   * out-of-range values are often intentional and useful. (See the second
   * example above.)
   *
   * @method norm
   * @param  {Number} value incoming value to be normalized
   * @param  {Number} start lower bound of the value's current range
   * @param  {Number} stop  upper bound of the value's current range
   * @return {Number}       normalized number
   */
  p5.prototype.norm = function(n, start, stop) {
    return this.map(n, start, stop, 0, 1);
  };
  
  /**
   * Facilitates exponential expressions. The pow() function is an efficient
   * way of multiplying numbers by themselves (or their reciprocals) in large
   * quantities. For example, pow(3, 5) is equivalent to the expression
   * 3*3*3*3*3 and pow(3, -5) is equivalent to 1 / 3*3*3*3*3. Maps to
   * Math.pow().
   *
   * @method pow
   * @param  {Number} n base of the exponential expression
   * @param  {Number} e power by which to raise the base
   * @return {Number}   n^e
   */
  p5.prototype.pow = Math.pow;
  
  /**
   * Calculates the integer closest to the n parameter. For example,
   * round(133.8) returns the value 134. Maps to Math.round().
   *
   * @method round
   * @param  {Number} n number to round
   * @return {Number}   rounded number
   */
  p5.prototype.round = Math.round;
  
  /**
   * Squares a number (multiplies a number by itself). The result is always a
   * positive number, as multiplying two negative numbers always yields a
   * positive result. For example, -1 * -1 = 1.
   *
   * @method sq
   * @param  {Number} n number to square
   * @return {Number}   squared number
   */
  p5.prototype.sq = function(n) { return n*n; };
  
  /**
   * Calculates the square root of a number. The square root of a number is
   * always positive, even though there may be a valid negative root. The
   * square root s of number a is such that s*s = a. It is the opposite of
   * squaring. Maps to Math.sqrt().
   *
   * @method sqrt
   * @param  {Number} n non-negative number to square root
   * @return {Number}   square root of number
   */
  p5.prototype.sqrt = Math.sqrt;

  return p5;

});
