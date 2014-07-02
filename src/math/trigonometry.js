/**
 * @module Math
 * @submodule Trigonometry
 * @for p5
 * @requires core
 * @requires polargeometry
 * @requires constants
 */
define(function (require) {

  'use strict';

  var p5 = require('core');
  var polarGeometry = require('polargeometry');
  var constants = require('constants');

  p5.prototype._angleMode = constants.RADIANS;

  /**
   * The inverse of cos(), returns the arc cosine of a value. This function
   * expects the values in the range of -1 to 1 and values are returned in
   * the range 0 to PI (3.1415927).
   * 
   * @method acos
   * @param  {Number} value the value whose arc cosine is to be returned
   * @return {Number}       the arc cosine of the given value
   */
  p5.prototype.acos = function(ratio) {
    if (this._angleMode === constants.RADIANS) {
      return Math.acos(ratio);
    } else {
      return polarGeometry.radiansToDegrees(Math.acos(ratio));
    }
  };

  /**
   * The inverse of sin(), returns the arc sine of a value. This function
   * expects the values in the range of -1 to 1 and values are returned
   * in the range -PI/2 to PI/2.
   *
   * @method asin
   * @param  {Number} value the value whose arc sine is to be returned
   * @return {Number}       the arc sine of the given value
   */
  p5.prototype.asin = function(ratio) {
    if (this._angleMode === constants.RADIANS) {
      return Math.asin(ratio);
    } else {
      return polarGeometry.radiansToDegrees(Math.asin(ratio));
    }
  };

  /**
   * The inverse of tan(), returns the arc tangent of a value. This function
   * expects the values in the range of -Infinity to Infinity (exclusive) and
   * values are returned in the range -PI/2 to PI/2.
   * 
   * @method atan
   * @param  {Number} value the value whose arc tangent is to be returned
   * @return {Number}       the arc tangent of the given value
   */
  p5.prototype.atan = function(ratio) {
    if (this._angleMode === constants.RADIANS) {
      return Math.atan(ratio);
    } else {
      return polarGeometry.radiansToDegrees(Math.atan(ratio));
    }
  };

  /**
   * Calculates the angle (in radians) from a specified point to the coordinate
   * origin as measured from the positive x-axis. Values are returned as a
   * float in the range from PI to -PI. The atan2() function is most often used
   * for orienting geometry to the position of the cursor. Note: The
   * y-coordinate of the point is the first parameter, and the x-coordinate is
   * the second parameter, due the the structure of calculating the tangent.
   *
   * @method atan2
   * @param  {Number} y y-coordinate of the point
   * @param  {Number} x x-coordinate of the point
   * @return {Number}   the arc tangent of the given point
   */
  p5.prototype.atan2 = function (y, x) {
    if (this._angleMode === constants.RADIANS) {
      return Math.atan2(y, x);
    } else {
      return polarGeometry.radiansToDegrees(Math.atan2(y, x));
    }
  };

  /**
   * Calculates the cosine of an angle. This function takes into account the
   * current angleMode. Values are returned in the range -1 to 1.
   * 
   * @method cos
   * @param  {Number} angle the angle 
   * @return {Number}       the cosine of the angle
   */
  p5.prototype.cos = function(angle) {
    if (this._angleMode === constants.RADIANS) {
      return Math.cos(angle);
    } else {
      return Math.cos(this.radians(angle));
    }
  };

  /**
   * Calculates the sine of an angle. This function takes into account the
   * current angleMode. Values are returned in the range -1 to 1.
   * 
   * @method sin
   * @param  {Number} angle the angle 
   * @return {Number}       the sine of the angle
   */
  p5.prototype.sin = function(angle) {
    if (this._angleMode === constants.RADIANS) {
      return Math.sin(angle);
    } else {
      return Math.sin(this.radians(angle));
    }
  };

  /**
   * Calculates the tangent of an angle. This function takes into account
   * the current angleMode. Values are returned in the range -1 to 1.
   * 
   * @method tan
   * @param  {Number} angle the angle 
   * @return {Number}       the tangent of the angle
   */
  p5.prototype.tan = function(angle) {
    if (this._angleMode === constants.RADIANS) {
      return Math.tan(angle);
    } else {
      return Math.tan(this.radians(angle));
    }
  };

  /**
   * Converts a radian measurement to its corresponding value in degrees.
   * Radians and degrees are two ways of measuring the same thing. There are
   * 360 degrees in a circle and 2*PI radians in a circle. For example,
   * 90° = PI/2 = 1.5707964.
   *
   * @method degrees
   * @param  {Number} radians the radians value to convert to degrees 
   * @return {Number}         the converted angle
   */
  p5.prototype.degrees = function(angle) {
    return polarGeometry.radiansToDegrees(angle);
  };

  /**
   * Converts a degree measurement to its corresponding value in radians.
   * Radians and degrees are two ways of measuring the same thing. There are
   * 360 degrees in a circle and 2*PI radians in a circle. For example,
   * 90° = PI/2 = 1.5707964. 
   *
   * @method radians
   * @param  {Number} degrees the degree value to convert to radians 
   * @return {Number}         the converted angle
   */
  p5.prototype.radians = function(angle) {
    return polarGeometry.degreesToRadians(angle);
  };

  /**
   * Sets the current mode of p5 to given mode.
   * 
   * @method angleMode
   * @param {Number/Constant} mode either RADIANS or DEGREES 
   */
  p5.prototype.angleMode = function(mode) {
    if (mode === constants.DEGREES || mode === constants.RADIANS) {
      this._angleMode = mode;
    }
  };

  return p5;

});
