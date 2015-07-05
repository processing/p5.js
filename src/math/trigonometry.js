/**
 * @module Math
 * @submodule Trigonometry
 * @for p5
 * @requires core
 * @requires polargeometry
 * @requires constants
 */

'use strict';

var p5 = require('../core/core');
var polarGeometry = require('./polargeometry');
var constants = require('../core/constants');

p5.prototype._angleMode = constants.RADIANS;

/**
 * The inverse of cos(), returns the arc cosine of a value. This function
 * expects the values in the range of -1 to 1 and values are returned in
 * the range 0 to PI (3.1415927).
 *
 * @method acos
 * @param  {Number} value the value whose arc cosine is to be returned
 * @return {Number}       the arc cosine of the given value
 *
 * @example
 * <div class= “norender">
 * <code>
 * var a = PI;
 * var c = cos(a);
 * var ac = acos(c);
 * // Prints: "3.1415927 : -1.0 : 3.1415927"
 * println(a + " : " + c + " : " +  ac);
 * </code>
 * </div>
 *
 * <div class= “norender">
 * <code>
 * var a = PI + PI/4.0;
 * var c = cos(a);
 * var ac = acos(c);
 * // Prints: "3.926991 : -0.70710665 : 2.3561943"
 * println(a + " : " + c + " : " +  ac);
 * </code>
 * </div>
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
 *
 * @example
 * <div class= “norender">
 * <code>
 * var a = PI + PI/3;
 * var s = sin(a);
 * var as = asin(s);
 * // Prints: "1.0471976 : 0.86602545 : 1.0471976"
 * println(a + " : " + s + " : " +  as);
 * </code>
 * </div>
 *
 * <div class= “norender">
 * <code>
 * var a = PI + PI/3.0;
 * var s = sin(a);
 * var as = asin(s);
 * // Prints: "4.1887903 : -0.86602545 : -1.0471976"
 * println(a + " : " + s + " : " +  as);
 * </code>
 * </div>
 *
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
 *
 * @example
 * <div class= “norender">
 * <code>
 * var a = PI + PI/3;
 * var t = tan(a);
 * var at = atan(t);
 * // Prints: "1.0471976 : 1.7320509 : 1.0471976"
 * println(a + " : " + t + " : " +  at);
 * </code>
 * </div>
 *
 * <div class= “norender">
 * <code>
 * var a = PI + PI/3.0;
 * var t = tan(a);
 * var at = atan(t);
 * // Prints: "4.1887903 : 1.7320513 : 1.0471977"
 * println(a + " : " + t + " : " +  at);
 * </code>
 * </div>
 *
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
 *
 * @example
 * <div>
 * <code>
 * function draw() {
 *   background(204);
 *   translate(width/2, height/2);
 *   var a = atan2(mouseY-height/2, mouseX-width/2);
 *   rotate(a);
 *   rect(-30, -5, 60, 10);
 * }
 * </code>
 * </div>
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
 *
 * @example
 * <div>
 * <code>
 * var a = 0.0;
 * var inc = TWO_PI/25.0;
 * for (var i = 0; i < 25; i++) {
 *   line(i*4, 50, i*4, 50+cos(a)*40.0);
 *   a = a + inc;
 * }
 * </code>
 * </div>
 *
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
 *
 * @example
 * <div>
 * <code>
 * var a = 0.0;
 * var inc = TWO_PI/25.0;
 * for (var i = 0; i < 25; i++) {
 *   line(i*4, 50, i*4, 50+sin(a)*40.0);
 *   a = a + inc;
 * }
 * </code>
 * </div>
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
 *
 * @example
 * <div>
 * <code>
 *   var a = 0.0;
 *   var inc = TWO_PI/50.0;
 *   for (var i = 0; i < 100; i = i+2) {
 *     line(i, 50, i, 50+tan(a)*2.0);
 *     a = a + inc;
 *   }
 * </code>
 * </div>
 *
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
 *
 *
 * @example
 * <div class= “norender">
 * <code>
 * var rad = PI/4;
 * var deg = degrees(rad);
 * println(rad + " radians is " + deg + " degrees");
 * // Prints: 45 degrees is 0.7853981633974483 radians
 * </code>
 * </div>
 *
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
 *
 * @example
 * <div class= “norender">
 * <code>
 * var deg = 45.0;
 * var rad = radians(deg);
 * println(deg + " degrees is " + rad + " radians");
 * // Prints: 45 degrees is 0.7853981633974483 radians
 * </code>
 * </div>
 */
p5.prototype.radians = function(angle) {
  return polarGeometry.degreesToRadians(angle);
};

/**
 * Sets the current mode of p5 to given mode. Default mode is RADIANS.
 *
 * @method angleMode
 * @param {Number/Constant} mode either RADIANS or DEGREES
 *
 * @example
 * <div>
 * <code>
 * function draw(){
 *   background(204);
 *   angleMode(DEGREES); // Change the mode to DEGREES
 *   var a = atan2(mouseY-height/2, mouseX-width/2);
 *   translate(width/2, height/2);
 *   push();
 *   rotate(a);
 *   rect(-20, -5, 40, 10); // Larger rectangle is rotating in degrees
 *   pop();
 *   angleMode(RADIANS); // Change the mode to RADIANS
 *   rotate(a); // var a stays the same
 *   rect(-40, -5, 20, 10); // Smaller rectangle is rotating in radians
 * }
 * </code>
 * </div>
 *
 */
p5.prototype.angleMode = function(mode) {
  if (mode === constants.DEGREES || mode === constants.RADIANS) {
    this._angleMode = mode;
  }
};

module.exports = p5;
