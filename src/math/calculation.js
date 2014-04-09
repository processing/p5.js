/**
 * @module Math
 * @for Calculation
 * @requires core
 */
define(function (require) {

  'use strict';

  var p5 = require('core');

  /**
   * Calculates the absolute value (magnitude) of a number. The absolute value of a number is always positive.
   * 
   * @method abs
   * @param {Number} n number to compute
   * @return {Number} val absolute value of given number
   */
  p5.prototype.abs = Math.abs;

  /**
   * Calculates the closest int value that is greater than or equal to the value of the parameter. For example, ceil(9.03) returns the value 10.
   *
   * @method ceil
   * @param {Number} n number to round up
   * @return {Number} val rounded up number
   */
  p5.prototype.ceil = Math.ceil;

  /**
   * Constrains a value to not exceed a maximum and minimum value.
   *
   * @method constrain
   * @param {Number} amt number to constrain
   * @param {Number} low minimum limit
   * @param {Number} high maximum limit
   * @return {Number} val constrained number
   */
  p5.prototype.constrain = function(amt, low, high) {
    return this.max(this.min(amt, high), low);
  };

  p5.prototype.dist = function(x1, y1, x2, y2) {
    var xs = x2-x1;
    var ys = y2-y1;
    return Math.sqrt( xs*xs + ys*ys );
  };

  p5.prototype.exp = Math.exp;

  p5.prototype.floor = Math.floor;

  p5.prototype.lerp = function(start, stop, amt) {
    return amt*(stop-start)+start;
  };

  p5.prototype.log = Math.log;

  p5.prototype.mag = function(x, y) {
    return Math.sqrt(x*x+y*y);
  };

  p5.prototype.map = function(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
  };

  p5.prototype.max = function() {
    if (arguments[0] instanceof Array) {
      return Math.max.apply(null,arguments[0]);
    } else {
      return Math.max.apply(null,arguments);
    }
  };

  p5.prototype.min = function() {
    if (arguments[0] instanceof Array) {
      return Math.min.apply(null,arguments[0]);
    } else {
      return Math.min.apply(null,arguments);
    }
  };

  p5.prototype.norm = function(n, start, stop) { return this.map(n, start, stop, 0, 1); };

  p5.prototype.pow = Math.pow;

  p5.prototype.round = Math.round;

  p5.prototype.sq = function(n) { return n*n; };

  p5.prototype.sqrt = Math.sqrt;

  return p5;

});
