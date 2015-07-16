/**
 * @module Transform
 * @submodule Transform
 * @for p5
 * @requires core
 * @requires constants
 */


'use strict';

var p5 = require('./core');
var constants = require('./constants');

/**
 * Multiplies the current matrix by the one specified through the parameters.
 * This is very slow because it will try to calculate the inverse of the
 * transform, so avoid it whenever possible.
 *
 * @method applyMatrix
 * @param  {Number} n00 numbers which define the 3x2 matrix to be multiplied
 * @param  {Number} n01 numbers which define the 3x2 matrix to be multiplied
 * @param  {Number} n02 numbers which define the 3x2 matrix to be multiplied
 * @param  {Number} n10 numbers which define the 3x2 matrix to be multiplied
 * @param  {Number} n11 numbers which define the 3x2 matrix to be multiplied
 * @param  {Number} n12 numbers which define the 3x2 matrix to be multiplied
 * @return {p5}         the p5 object
 * @example
 * <div>
 * <code>
 * // Example in the works.
 * </code>
 * </div>
 */
p5.prototype.applyMatrix = function(n00, n01, n02, n10, n11, n12) {
  this._graphics.applyMatrix(n00, n01, n02, n10, n11, n12);
  return this;
};

p5.prototype.popMatrix = function() {
  throw new Error('popMatrix() not used, see pop()');
};

p5.prototype.printMatrix = function() {
  throw new Error('printMatrix() not implemented');
};

p5.prototype.pushMatrix = function() {
  throw new Error('pushMatrix() not used, see push()');
};

/**
 * Replaces the current matrix with the identity matrix.
 *
 * @method resetMatrix
 * @return {p5} the p5 object
 * @example
 * <div>
 * <code>
 * // Example in the works.
 * </code>
 * </div>
 */
p5.prototype.resetMatrix = function() {
  this._graphics.resetMatrix();
  return this;
};

/**
 * Rotates a shape the amount specified by the angle parameter. This
 * function accounts for angleMode, so angles can be entered in either
 * RADIANS or DEGREES.
 *
 * Objects are always rotated around their relative position to the
 * origin and positive numbers rotate objects in a clockwise direction.
 * Transformations apply to everything that happens after and subsequent
 * calls to the function accumulates the effect. For example, calling
 * rotate(HALF_PI) and then rotate(HALF_PI) is the same as rotate(PI).
 * All tranformations are reset when draw() begins again.
 *
 * Technically, rotate() multiplies the current transformation matrix
 * by a rotation matrix. This function can be further controlled by
 * the push() and pop().
 *
 * @method rotate
 * @param  {Number} angle the angle of rotation, specified in radians
 *                        or degrees, depending on current angleMode
 * @return {p5}           the p5 object
 * @example
 * <div>
 * <code>
 * translate(width/2, height/2);
 * rotate(PI/3.0);
 * rect(-26, -26, 52, 52);
 * </code>
 * </div>
 */
p5.prototype.rotate = function(r) {
  if (this._angleMode === constants.DEGREES) {
    r = this.radians(r);
  }
  this._graphics.rotate(r);
  return this;
};

/**
 * [rotateX description]
 * @param  {[type]} rad [description]
 * @return {[type]}     [description]
 */
p5.prototype.rotateX = function(rad) {
  if (this._graphics.isP3D) {
    this._graphics.rotateX(rad);
  } else {
    throw 'not yet implemented.';
  }
  return this;
};

/**
 * [rotateY description]
 * @param  {[type]} rad [description]
 * @return {[type]}     [description]
 */
p5.prototype.rotateY = function(rad) {
  if (this._graphics.isP3D) {
    this._graphics.rotateY(rad);
  } else {
    throw 'not yet implemented.';
  }
  return this;
};

/**
 * [rotateZ description]
 * @param  {[type]} rad [description]
 * @return {[type]}     [description]
 */
p5.prototype.rotateZ = function(rad) {
  if (this._graphics.isP3D) {
    this._graphics.rotateZ(rad);
  } else {
    throw 'not supported in p2d. Please use webgl mode';
  }
  return this;
};

/**
 * Increases or decreases the size of a shape by expanding and contracting
 * vertices. Objects always scale from their relative origin to the
 * coordinate system. Scale values are specified as decimal percentages.
 * For example, the function call scale(2.0) increases the dimension of a
 * shape by 200%.
 *
 * Transformations apply to everything that happens after and subsequent
 * calls to the function multiply the effect. For example, calling scale(2.0)
 * and then scale(1.5) is the same as scale(3.0). If scale() is called
 * within draw(), the transformation is reset when the loop begins again.
 *
 * Using this fuction with the z parameter requires using P3D as a
 * parameter for size(), as shown in the third example above. This function
 * can be further controlled with push() and pop().
 *
 * @method scale
 * @param  {Number} s   percentage to scale the object, or percentage to
 *                      scale the object in the x-axis if multiple arguments
 *                      are given
 * @param  {Number} [y] percentage to scale the object in the y-axis
 * @return {p5}         the p5 object
 * @example
 * <div>
 * <code>
 * translate(width/2, height/2);
 * rotate(PI/3.0);
 * rect(-26, -26, 52, 52);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * rect(30, 20, 50, 50);
 * scale(0.5, 1.3);
 * rect(30, 20, 50, 50);
 * </code>
 * </div>
 */
p5.prototype.scale = function() {
  if (this._graphics.isP3D) {
    this._graphics.scale(arguments[0], arguments[1], arguments[2]);
  } else {
    this._graphics.scale.apply(this._graphics, arguments);
  }
  return this;
};

/**
 * Shears a shape around the x-axis the amount specified by the angle
 * parameter. Angles should be specified in the current angleMode.
 * Objects are always sheared around their relative position to the origin
 * and positive numbers shear objects in a clockwise direction.
 *
 * Transformations apply to everything that happens after and subsequent
 * calls to the function accumulates the effect. For example, calling
 * shearX(PI/2) and then shearX(PI/2) is the same as shearX(PI).
 * If shearX() is called within the draw(), the transformation is reset when
 * the loop begins again.
 *
 * Technically, shearX() multiplies the current transformation matrix by a
 * rotation matrix. This function can be further controlled by the
 * push() and pop() functions.
 *
 * @method shearX
 * @param  {Number} angle angle of shear specified in radians or degrees,
 *                        depending on current angleMode
 * @return {p5}           the p5 object
 * @example
 * <div>
 * <code>
 * translate(width/4, height/4);
 * shearX(PI/4.0);
 * rect(0, 0, 30, 30);
 * </code>
 * </div>
 */
p5.prototype.shearX = function(angle) {
  if (this._angleMode === constants.DEGREES) {
    angle = this.radians(angle);
  }
  this._graphics.shearX(angle);
  return this;
};

/**
 * Shears a shape around the y-axis the amount specified by the angle
 * parameter. Angles should be specified in the current angleMode. Objects
 * are always sheared around their relative position to the origin and
 * positive numbers shear objects in a clockwise direction.
 *
 * Transformations apply to everything that happens after and subsequent
 * calls to the function accumulates the effect. For example, calling
 * shearY(PI/2) and then shearY(PI/2) is the same as shearY(PI). If
 * shearY() is called within the draw(), the transformation is reset when
 * the loop begins again.
 *
 * Technically, shearY() multiplies the current transformation matrix by a
 * rotation matrix. This function can be further controlled by the
 * push() and pop() functions.
 *
 * @method shearY
 * @param  {Number} angle angle of shear specified in radians or degrees,
 *                        depending on current angleMode
 * @return {p5}           the p5 object
 * @example
 * <div>
 * <code>
 * translate(width/4, height/4);
 * shearY(PI/4.0);
 * rect(0, 0, 30, 30);
 * </code>
 * </div>
 */
p5.prototype.shearY = function(angle) {
  if (this._angleMode === constants.DEGREES) {
    angle = this.radians(angle);
  }
  this._graphics.shearY(angle);
  return this;
};

/**
 * Specifies an amount to displace objects within the display window.
 * The x parameter specifies left/right translation, the y parameter
 * specifies up/down translation.
 *
 * Transformations are cumulative and apply to everything that happens after
 * and subsequent calls to the function accumulates the effect. For example,
 * calling translate(50, 0) and then translate(20, 0) is the same as
 * translate(70, 0). If translate() is called within draw(), the
 * transformation is reset when the loop begins again. This function can be
 * further controlled by using push() and pop().
 *
 * @method translate
 * @param  {Number} x left/right translation
 * @param  {Number} y up/down translation
 * @return {p5}       the p5 object
 * @example
 * <div>
 * <code>
 * translate(30, 20);
 * rect(0, 0, 55, 55);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * rect(0, 0, 55, 55);  // Draw rect at original 0,0
 * translate(30, 20);
 * rect(0, 0, 55, 55);  // Draw rect at new 0,0
 * translate(14, 14);
 * rect(0, 0, 55, 55);  // Draw rect at new 0,0
 * </code>
 * </div>
 */
p5.prototype.translate = function(x, y, z) {
  if (this._graphics.isP3D) {
    this._graphics.translate(x, y, z);
  } else {
    this._graphics.translate(x, y);
  }
  return this;
};

module.exports = p5;
