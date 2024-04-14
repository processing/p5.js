/**
 * @module Math
 * @submodule Trigonometry
 * @for p5
 * @requires core
 * @requires constants
 */

import * as constants from '../core/constants';

function trigonometry(p5, fn){
  /*
   * all DEGREES/RADIANS conversion should be done in the p5 instance
   * if possible, using the p5._toRadians(), p5._fromRadians() methods.
   */
  fn._angleMode = constants.RADIANS;

  /**
   * The inverse of <a href="#/p5/cos">cos()</a>, returns the arc cosine of a
   * value. This function expects arguments in the range -1 to 1. By default,
   * `acos()` returns values in the range 0 to &pi; (about 3.14). If the
   * <a href="#/p5/angleMode">angleMode()</a> is `DEGREES`, then values are
   * returned in the range 0 to 180.
   *
   * @method acos
   * @param  {Number} value value whose arc cosine is to be returned.
   * @return {Number}       arc cosine of the given value.
   *
   * @example
   * <div>
   * <code>
   * let a = PI + QUARTER_PI;
   * let c = cos(a);
   * let ac = acos(c);
   * text(`${round(a, 3)}`, 35, 25);
   * text(`${round(c, 3)}`, 35, 50);
   * text(`${round(ac, 3)}`, 35, 75);
   *
   * describe('The numbers 3.142, -1, and 3.142 written on separate rows.');
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let a = PI;
   * let c = cos(a);
   * let ac = acos(c);
   * text(`${round(a, 3)}`, 35, 25);
   * text(`${round(c, 3)}`, 35, 50);
   * text(`${round(ac, 3)}`, 35, 75);
   *
   * describe('The numbers 3.927, -0.707, and 2.356 written on separate rows.');
   * </code>
   * </div>
   */
  fn.acos = function(ratio) {
    return this._fromRadians(Math.acos(ratio));
  };

  /**
   * The inverse of <a href="#/p5/sin">sin()</a>, returns the arc sine of a
   * value. This function expects input values in the range of -1 to 1. By
   * default, `asin()` returns values in the range -&pi; &divide; 2
   * (about -1.57) to &pi; &divide; 2 (about 1.57). If the
   * <a href="#/p5/angleMode">angleMode()</a> is `DEGREES` then values are
   * returned in the range -90 to 90.
   *
   * @method asin
   * @param  {Number} value value whose arc sine is to be returned.
   * @return {Number}       arc sine of the given value.
   *
   * @example
   * <div>
   * <code>
   * let a = PI / 3;
   * let s = sin(a);
   * let as = asin(s);
   * text(`${round(a, 3)}`, 35, 25);
   * text(`${round(s, 3)}`, 35, 50);
   * text(`${round(as, 3)}`, 35, 75);
   *
   * describe('The numbers 1.047, 0.866, and 1.047 written on separate rows.');
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let a = PI + PI / 3;
   * let s = sin(a);
   * let as = asin(s);
   * text(`${round(a, 3)}`, 35, 25);
   * text(`${round(s, 3)}`, 35, 50);
   * text(`${round(as, 3)}`, 35, 75);
   *
   * describe('The numbers 4.189, -0.866, and -1.047 written on separate rows.');
   * </code>
   * </div>
   */
  fn.asin = function(ratio) {
    return this._fromRadians(Math.asin(ratio));
  };

  /**
   * The inverse of <a href="#/p5/tan">tan()</a>, returns the arc tangent of a
   * value. This function expects input values in the range of -Infinity to
   * Infinity. By default, `atan()` returns values in the range -&pi; &divide; 2
   * (about -1.57) to &pi; &divide; 2 (about 1.57). If the
   * <a href="#/p5/angleMode">angleMode()</a> is `DEGREES` then values are
   * returned in the range -90 to 90.
   *
   * @method atan
   * @param  {Number} value value whose arc tangent is to be returned.
   * @return {Number}       arc tangent of the given value.
   *
   * @example
   * <div>
   * <code>
   * let a = PI / 3;
   * let t = tan(a);
   * let at = atan(t);
   * text(`${round(a, 3)}`, 35, 25);
   * text(`${round(t, 3)}`, 35, 50);
   * text(`${round(at, 3)}`, 35, 75);
   *
   * describe('The numbers 1.047, 1.732, and 1.047 written on separate rows.');
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let a = PI + PI / 3;
   * let t = tan(a);
   * let at = atan(t);
   * text(`${round(a, 3)}`, 35, 25);
   * text(`${round(t, 3)}`, 35, 50);
   * text(`${round(at, 3)}`, 35, 75);
   *
   * describe('The numbers 4.189, 1.732, and 1.047 written on separate rows.');
   * </code>
   * </div>
   */
  fn.atan = function(ratio) {
    return this._fromRadians(Math.atan(ratio));
  };

  /**
   * Calculates the angle formed by a specified point, the origin, and the
   * positive x-axis. By default, `atan2()` returns values in the range
   * -&pi; (about -3.14) to &pi; (3.14). If the
   * <a href="#/p5/angleMode">angleMode()</a> is `DEGREES`, then values are
   * returned in the range -180 to 180. The `atan2()` function is most often
   * used for orienting geometry to the mouse's position.
   *
   * Note: The y-coordinate of the point is the first parameter and the
   * x-coordinate is the second parameter.
   *
   * @method atan2
   * @param  {Number} y y-coordinate of the point.
   * @param  {Number} x x-coordinate of the point.
   * @return {Number}   arc tangent of the given point.
   *
   * @example
   * <div>
   * <code>
   * function draw() {
   *   background(200);
   *   translate(width / 2, height / 2);
   *   let x = mouseX - width / 2;
   *   let y = mouseY - height / 2;
   *   let a = atan2(y, x);
   *   rotate(a);
   *   rect(-30, -5, 60, 10);
   *
   *   describe('A rectangle at the center of the canvas rotates with mouse movements.');
   * }
   * </code>
   * </div>
   */
  fn.atan2 = function(y, x) {
    return this._fromRadians(Math.atan2(y, x));
  };

  /**
   * Calculates the cosine of an angle. `cos()` is useful for many geometric
   * tasks in creative coding. The values returned oscillate between -1 and 1
   * as the input angle increases. `cos()` takes into account the current
   * <a href="#/p5/angleMode">angleMode</a>.
   *
   * @method cos
   * @param  {Number} angle the angle.
   * @return {Number}       cosine of the angle.
   *
   * @example
   * <div>
   * <code>
   * function draw() {
   *   background(200);
   *
   *   let t = frameCount;
   *   let x = 30 * cos(t * 0.05) + 50;
   *   let y = 50;
   *   line(50, y, x, y);
   *   circle(x, y, 20);
   *
   *   describe('A white ball on a string oscillates left and right.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function draw() {
   *   let x = frameCount;
   *   let y = 30 * cos(x * 0.1) + 50;
   *   point(x, y);
   *
   *   describe('A series of black dots form a wave pattern.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function draw() {
   *   let t = frameCount;
   *   let x = 30 * cos(t * 0.1) + 50;
   *   let y = 10 * sin(t * 0.2) + 50;
   *   point(x, y);
   *
   *   describe('A series of black dots form an infinity symbol.');
   * }
   * </code>
   * </div>
   */
  fn.cos = function(angle) {
    return Math.cos(this._toRadians(angle));
  };

  /**
   * Calculates the sine of an angle. `sin()` is useful for many geometric tasks
   * in creative coding. The values returned oscillate between -1 and 1 as the
   * input angle increases. `sin()` takes into account the current
   * <a href="#/p5/angleMode">angleMode</a>.
   *
   * @method sin
   * @param  {Number} angle the angle.
   * @return {Number}       sine of the angle.
   *
   * @example
   * <div>
   * <code>
   * function draw() {
   *   background(200);
   *
   *   let t = frameCount;
   *   let x = 50;
   *   let y = 30 * sin(t * 0.05) + 50;
   *   line(x, 50, x, y);
   *   circle(x, y, 20);
   *
   *   describe('A white ball on a string oscillates up and down.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function draw() {
   *   let x = frameCount;
   *   let y = 30 * sin(x * 0.1) + 50;
   *   point(x, y);
   *
   *   describe('A series of black dots form a wave pattern.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function draw() {
   *   let t = frameCount;
   *   let x = 30 * cos(t * 0.1) + 50;
   *   let y = 10 * sin(t * 0.2) + 50;
   *   point(x, y);
   *
   *   describe('A series of black dots form an infinity symbol.');
   * }
   * </code>
   * </div>
   */
  fn.sin = function(angle) {
    return Math.sin(this._toRadians(angle));
  };

  /**
   * Calculates the tangent of an angle. `tan()` is useful for many geometric
   * tasks in creative coding. The values returned range from -Infinity
   * to Infinity and repeat periodically as the input angle increases. `tan()`
   * takes into account the current <a href="#/p5/angleMode">angleMode</a>.
   *
   * @method tan
   * @param  {Number} angle the angle.
   * @return {Number}       tangent of the angle.
   *
   * @example
   * <div>
   * <code>
   * function draw() {
   *   let x = frameCount;
   *   let y = 5 * tan(x * 0.1) + 50;
   *   point(x, y);
   *
   *   describe('A series of identical curves drawn with black dots. Each curve starts from the top of the canvas, continues down at a slight angle, flattens out at the middle of the canvas, then continues to the bottom.');
   * }
   * </code>
   * </div>
   */
  fn.tan = function(angle) {
    return Math.tan(this._toRadians(angle));
  };

  /**
   * Converts an angle measurement in radians to its corresponding value in
   * degrees. Degrees and radians are two ways of measuring the same thing.
   * There are 360 degrees in a circle and 2 &times; &pi; (about 6.28)
   * radians in a circle. For example, 90° = &pi; &divide; 2 (about 1.57)
   * radians. This function doesn't take into account the current
   * <a href="#/p5/angleMode">angleMode()</a>.
   *
   * @method degrees
   * @param  {Number} radians radians value to convert to degrees.
   * @return {Number}         converted angle.
   *
   * @example
   * <div>
   * <code>
   * let rad = QUARTER_PI;
   * let deg = degrees(rad);
   * text(`${round(rad, 2)} rad = ${deg}˚`, 10, 50);
   *
   * describe('The text "0.79 rad = 45˚".');
   * </code>
   * </div>
   */
  fn.degrees = angle => angle * constants.RAD_TO_DEG;

  /**
   * Converts an angle measurement in degrees to its corresponding value in
   * radians. Degrees and radians are two ways of measuring the same thing.
   * There are 360 degrees in a circle and 2 &times; &pi; (about 6.28)
   * radians in a circle. For example, 90° = &pi; &divide; 2 (about 1.57)
   * radians. This function doesn't take into account the current
   * <a href="#/p5/angleMode">angleMode()</a>.
   *
   * @method radians
   * @param  {Number} degrees degree value to convert to radians.
   * @return {Number}         converted angle.
   *
   * @example
   * <div>
   * <code>
   * let deg = 45;
   * let rad = radians(deg);
   * text(`${deg}˚ = ${round(rad, 3)} rad`, 10, 50);
   *
   * describe('The text "45˚ = 0.785 rad".');
   * </code>
   * </div>
   */
  fn.radians = angle => angle * constants.DEG_TO_RAD;

  /**
   * Changes the way trigonometric functions interpret angle values. By default,
   * the mode is `RADIANS`.
   *
   * Calling `angleMode()` with no arguments returns current angle mode.
   * @method angleMode
   * @param {(RADIANS|DEGREES)} mode either RADIANS or DEGREES.
   * @example
   * <div>
   * <code>
   * let r = 40;
   * push();
   * rotate(PI / 6);
   * line(0, 0, r, 0);
   * text('0.524 rad', r, 0);
   * pop();
   *
   * angleMode(DEGREES);
   * push();
   * rotate(60);
   * line(0, 0, r, 0);
   * text('60˚', r, 0);
   * pop();
   *
   * describe('Two diagonal lines radiating from the top left corner of a square. The lines are oriented 30 degrees from the edges of the square and 30 degrees apart from each other.');
   * </code>
   * </div>
   *
   */
  /**
   * @method angleMode
   * @return {(RADIANS|DEGREES)} mode either RADIANS or DEGREES
   */
  fn.angleMode = function(mode) {
    p5._validateParameters('angleMode', arguments);
    if (typeof mode === 'undefined') {
      return this._angleMode;
    } else if (mode === constants.DEGREES || mode === constants.RADIANS) {
      const prevMode = this._angleMode;

      // No change
      if(mode === prevMode) return;

      // Otherwise adjust pRotation according to new mode
      // This is necessary for acceleration events to work properly
      if(mode === constants.RADIANS) {
        // Change pRotation to radians
        this._setProperty('pRotationX', this.pRotationX * constants.DEG_TO_RAD);
        this._setProperty('pRotationY', this.pRotationY * constants.DEG_TO_RAD);
        this._setProperty('pRotationZ', this.pRotationZ * constants.DEG_TO_RAD);
      } else {
        // Change pRotation to degrees
        this._setProperty('pRotationX', this.pRotationX * constants.RAD_TO_DEG);
        this._setProperty('pRotationY', this.pRotationY * constants.RAD_TO_DEG);
        this._setProperty('pRotationZ', this.pRotationZ * constants.RAD_TO_DEG);
      }

      this._angleMode = mode;
    }
  };

  /**
   * converts angles from the current angleMode to RADIANS
   *
   * @method _toRadians
   * @private
   * @param {Number} angle
   * @returns {Number}
   */
  fn._toRadians = function(angle) {
    if (this._angleMode === constants.DEGREES) {
      return angle * constants.DEG_TO_RAD;
    }
    return angle;
  };

  /**
   * converts angles from the current angleMode to DEGREES
   *
   * @method _toDegrees
   * @private
   * @param {Number} angle
   * @returns {Number}
   */
  fn._toDegrees = function(angle) {
    if (this._angleMode === constants.RADIANS) {
      return angle * constants.RAD_TO_DEG;
    }
    return angle;
  };

  /**
   * converts angles from RADIANS into the current angleMode
   *
   * @method _fromRadians
   * @private
   * @param {Number} angle
   * @returns {Number}
   */
  fn._fromRadians = function(angle) {
    if (this._angleMode === constants.DEGREES) {
      return angle * constants.RAD_TO_DEG;
    }
    return angle;
  };

  /**
   * converts angles from DEGREES into the current angleMode
   *
   * @method _fromDegrees
   * @private
   * @param {Number} angle
   * @returns {Number}
   */
  fn._fromDegrees = function(angle) {
    if (this._angleMode === constants.RADIANS) {
      return angle * constants.DEG_TO_RAD;
    }
    return angle;
  };
}

export default trigonometry;

if(typeof p5 !== 'undefined'){
  trigonometry(p5, p5.prototype);
}
