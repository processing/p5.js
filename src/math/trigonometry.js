/**
 * @module Math
 * @submodule Trigonometry
 * @for p5
 * @requires core
 * @requires constants
 */

import * as constants from '../core/constants';

function trigonometry(p5, fn){
  const DEGREES = fn.DEGREES = 'degrees';
  const RADIANS = fn.RADIANS = 'radians';

  /*
   * all DEGREES/RADIANS conversion should be done in the p5 instance
   * if possible, using the p5._toRadians(), p5._fromRadians() methods.
   */
  fn._angleMode = RADIANS;

  /**
   * Calculates the arc cosine of a number.
   *
   * `acos()` is the inverse of <a href="#/p5/cos">cos()</a>. It expects
   * arguments in the range -1 to 1. By default, `acos()` returns values in the
   * range 0 to &pi; (about 3.14). If the
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
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Calculate cos() and acos() values.
   *   let a = PI;
   *   let c = cos(a);
   *   let ac = acos(c);
   *
   *   // Display the values.
   *   text(`${round(a, 3)}`, 35, 25);
   *   text(`${round(c, 3)}`, 35, 50);
   *   text(`${round(ac, 3)}`, 35, 75);
   *
   *   describe('The numbers 3.142, -1, and 3.142 written on separate rows.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Calculate cos() and acos() values.
   *   let a = PI + QUARTER_PI;
   *   let c = cos(a);
   *   let ac = acos(c);
   *
   *   // Display the values.
   *   text(`${round(a, 3)}`, 35, 25);
   *   text(`${round(c, 3)}`, 35, 50);
   *   text(`${round(ac, 3)}`, 35, 75);
   *
   *   describe('The numbers 3.927, -0.707, and 2.356 written on separate rows.');
   * }
   * </code>
   * </div>
   */
  fn.acos = function(ratio) {
    return this._fromRadians(Math.acos(ratio));
  };

  /**
   * Calculates the arc sine of a number.
   *
   * `asin()` is the inverse of <a href="#/p5/sin">sin()</a>. It expects input
   * values in the range of -1 to 1. By default, `asin()` returns values in the
   * range -&pi; &divide; 2 (about -1.57) to &pi; &divide; 2 (about 1.57). If
   * the <a href="#/p5/angleMode">angleMode()</a> is `DEGREES` then values are
   * returned in the range -90 to 90.
   *
   * @method asin
   * @param  {Number} value value whose arc sine is to be returned.
   * @return {Number}       arc sine of the given value.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Calculate sin() and asin() values.
   *   let a = PI / 3;
   *   let s = sin(a);
   *   let as = asin(s);
   *
   *   // Display the values.
   *   text(`${round(a, 3)}`, 35, 25);
   *   text(`${round(s, 3)}`, 35, 50);
   *   text(`${round(as, 3)}`, 35, 75);
   *
   *   describe('The numbers 1.047, 0.866, and 1.047 written on separate rows.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Calculate sin() and asin() values.
   *   let a = PI + PI / 3;
   *   let s = sin(a);
   *   let as = asin(s);
   *
   *   // Display the values.
   *   text(`${round(a, 3)}`, 35, 25);
   *   text(`${round(s, 3)}`, 35, 50);
   *   text(`${round(as, 3)}`, 35, 75);
   *
   *   describe('The numbers 4.189, -0.866, and -1.047 written on separate rows.');
   * }
   * </code>
   * </div>
   */
  fn.asin = function(ratio) {
    return this._fromRadians(Math.asin(ratio));
  };

  /**
   * Calculates the arc tangent of a number.
   *
   * `atan()` is the inverse of <a href="#/p5/tan">tan()</a>. It expects input
   * values in the range of -Infinity to Infinity. By default, `atan()` returns
   * values in the range -&pi; &divide; 2 (about -1.57) to &pi; &divide; 2
   * (about 1.57). If the <a href="#/p5/angleMode">angleMode()</a> is `DEGREES`
   * then values are returned in the range -90 to 90.
   *
   * @method atan
   * @param  {Number} value value whose arc tangent is to be returned.
   * @return {Number}       arc tangent of the given value.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Calculate tan() and atan() values.
   *   let a = PI / 3;
   *   let t = tan(a);
   *   let at = atan(t);
   *
   *   // Display the values.
   *   text(`${round(a, 3)}`, 35, 25);
   *   text(`${round(t, 3)}`, 35, 50);
   *   text(`${round(at, 3)}`, 35, 75);
   *
   *   describe('The numbers 1.047, 1.732, and 1.047 written on separate rows.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Calculate tan() and atan() values.
   *   let a = PI + PI / 3;
   *   let t = tan(a);
   *   let at = atan(t);
   *
   *   // Display the values.
   *   text(`${round(a, 3)}`, 35, 25);
   *   text(`${round(t, 3)}`, 35, 50);
   *   text(`${round(at, 3)}`, 35, 75);
   *
   *   describe('The numbers 4.189, 1.732, and 1.047 written on separate rows.');
   * }
   * </code>
   * </div>
   */
  fn.atan = function(ratio) {
    return this._fromRadians(Math.atan(ratio));
  };

  /**
   * Calculates the angle formed by a point, the origin, and the positive
   * x-axis.
   *
   * `atan2()` is most often used for orienting geometry to the mouse's
   * position, as in `atan2(mouseY, mouseX)`. The first parameter is the point's
   * y-coordinate and the second parameter is its x-coordinate.
   *
   * By default, `atan2()` returns values in the range
   * -&pi; (about -3.14) to &pi; (3.14). If the
   * <a href="#/p5/angleMode">angleMode()</a> is `DEGREES`, then values are
   * returned in the range -180 to 180.
   *
   * @method atan2
   * @param  {Number} y y-coordinate of the point.
   * @param  {Number} x x-coordinate of the point.
   * @return {Number}   arc tangent of the given point.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe('A rectangle at the top-left of the canvas rotates with mouse movements.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Calculate the angle between the mouse
   *   // and the origin.
   *   let a = atan2(mouseY, mouseX);
   *
   *   // Rotate.
   *   rotate(a);
   *
   *   // Draw the shape.
   *   rect(0, 0, 60, 10);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe('A rectangle at the center of the canvas rotates with mouse movements.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Translate the origin to the center.
   *   translate(50, 50);
   *
   *   // Get the mouse's coordinates relative to the origin.
   *   let x = mouseX - 50;
   *   let y = mouseY - 50;
   *
   *   // Calculate the angle between the mouse and the origin.
   *   let a = atan2(y, x);
   *
   *   // Rotate.
   *   rotate(a);
   *
   *   // Draw the shape.
   *   rect(-30, -5, 60, 10);
   * }
   * </code>
   * </div>
   */
  fn.atan2 = function(y, x) {
    return this._fromRadians(Math.atan2(y, x));
  };

  /**
   * Calculates the cosine of an angle.
   *
   * `cos()` is useful for many geometric tasks in creative coding. The values
   * returned oscillate between -1 and 1 as the input angle increases. `cos()`
   * calculates the cosine of an angle, using radians by default, or according
   * to if <a href="#/p5/angleMode">angleMode()</a> setting (RADIANS or DEGREES).
   *
   * @method cos
   * @param  {Number} angle the angle, in radians by default, or according to if <a href="/reference/p5/angleMode/">angleMode()</a> setting (RADIANS or DEGREES).
   * @return {Number}       cosine of the angle.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe('A white ball on a string oscillates left and right.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Calculate the coordinates.
   *   let x = 30 * cos(frameCount * 0.05) + 50;
   *   let y = 50;
   *
   *   // Draw the oscillator.
   *   line(50, y, x, y);
   *   circle(x, y, 20);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   describe('A series of black dots form a wave pattern.');
   * }
   *
   * function draw() {
   *   // Calculate the coordinates.
   *   let x = frameCount;
   *   let y = 30 * cos(x * 0.1) + 50;
   *
   *   // Draw the point.
   *   point(x, y);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   describe('A series of black dots form an infinity symbol.');
   * }
   *
   * function draw() {
   *   // Calculate the coordinates.
   *   let x = 30 * cos(frameCount * 0.1) + 50;
   *   let y = 10 * sin(frameCount * 0.2) + 50;
   *
   *   // Draw the point.
   *   point(x, y);
   * }
   * </code>
   * </div>
   */
  fn.cos = function(angle) {
    return Math.cos(this._toRadians(angle));
  };

  /**
   * Calculates the sine of an angle.
   *
   * `sin()` is useful for many geometric tasks in creative coding. The values
   * returned oscillate between -1 and 1 as the input angle increases. `sin()`
   * calculates the sine of an angle, using radians by default, or according to
   * if <a href="#/p5/angleMode">angleMode()</a> setting (RADIANS or DEGREES).
   *
   * @method sin
   * @param  {Number} angle the angle, in radians by default, or according to if <a href="/reference/p5/angleMode/">angleMode()</a> setting (RADIANS or DEGREES).
   * @return {Number}       sine of the angle.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe('A white ball on a string oscillates up and down.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Calculate the coordinates.
   *   let x = 50;
   *   let y = 30 * sin(frameCount * 0.05) + 50;
   *
   *   // Draw the oscillator.
   *   line(50, y, x, y);
   *   circle(x, y, 20);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   describe('A series of black dots form a wave pattern.');
   * }
   *
   * function draw() {
   *   // Calculate the coordinates.
   *   let x = frameCount;
   *   let y = 30 * sin(x * 0.1) + 50;
   *
   *   // Draw the point.
   *   point(x, y);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   describe('A series of black dots form an infinity symbol.');
   * }
   *
   * function draw() {
   *   // Calculate the coordinates.
   *   let x = 30 * cos(frameCount * 0.1) + 50;
   *   let y = 10 * sin(frameCount * 0.2) + 50;
   *
   *   // Draw the point.
   *   point(x, y);
   * }
   * </code>
   * </div>
   */
  fn.sin = function(angle) {
    return Math.sin(this._toRadians(angle));
  };

  /**
   * Calculates the tangent of an angle.
   *
   * `tan()` is useful for many geometric tasks in creative coding. The values
   * returned range from -Infinity to Infinity and repeat periodically as the
   * input angle increases. `tan()` calculates the tan of an angle, using radians
   * by default, or according to
   * if <a href="#/p5/angleMode">angleMode()</a> setting (RADIANS or DEGREES).
   *
   * @method tan
   * @param  {Number} angle the angle, in radians by default, or according to if <a href="/reference/p5/angleMode/">angleMode()</a> setting (RADIANS or DEGREES).
   * @return {Number}       tangent of the angle.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   describe('A series of identical curves drawn with black dots. Each curve starts from the top of the canvas, continues down at a slight angle, flattens out at the middle of the canvas, then continues to the bottom.');
   * }
   *
   * function draw() {
   *   // Calculate the coordinates.
   *   let x = frameCount;
   *   let y = 5 * tan(x * 0.1) + 50;
   *
   *   // Draw the point.
   *   point(x, y);
   * }
   * </code>
   * </div>
   */
  fn.tan = function(angle) {
    return Math.tan(this._toRadians(angle));
  };

  /**
   * Converts an angle measured in radians to its value in degrees.
   *
   * Degrees and radians are both units for measuring angles. There are 360˚ in
   * one full rotation. A full rotation is 2 &times; &pi; (about 6.28) radians.
   *
   * The same angle can be expressed in with either unit. For example, 90° is a
   * quarter of a full rotation. The same angle is 2 &times; &pi; &divide; 4
   * (about 1.57) radians.
   *
   * @method degrees
   * @param  {Number} radians radians value to convert to degrees.
   * @return {Number}         converted angle.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Calculate the angle conversion.
   *   let rad = QUARTER_PI;
   *   let deg = degrees(rad);
   *
   *   // Display the conversion.
   *   text(`${round(rad, 2)} rad = ${deg}˚`, 10, 50);
   *
   *   describe('The text "0.79 rad = 45˚".');
   * }
   * </code>
   * </div>
   */
  fn.degrees = angle => angle * constants.RAD_TO_DEG;

  /**
   * Converts an angle measured in degrees to its value in radians.
   *
   * Degrees and radians are both units for measuring angles. There are 360˚ in
   * one full rotation. A full rotation is 2 &times; &pi; (about 6.28) radians.
   *
   * The same angle can be expressed in with either unit. For example, 90° is a
   * quarter of a full rotation. The same angle is 2 &times; &pi; &divide; 4
   * (about 1.57) radians.
   *
   * @method radians
   * @param  {Number} degrees degree value to convert to radians.
   * @return {Number}         converted angle.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Caclulate the angle conversion.
   *   let deg = 45;
   *   let rad = radians(deg);
   *
   *   // Display the angle conversion.
   *   text(`${deg}˚ = ${round(rad, 3)} rad`, 10, 50);
   *
   *   describe('The text "45˚ = 0.785 rad".');
   * }
   * </code>
   * </div>
   */
  fn.radians = angle => angle * constants.DEG_TO_RAD;

  /**
   * Changes the unit system used to measure angles.
   *
   * Degrees and radians are both units for measuring angles. There are 360˚ in
   * one full rotation. A full rotation is 2 &times; &pi; (about 6.28) radians.
   *
   * Functions such as <a href="#/p5/rotate">rotate()</a> and
   * <a href="#/p5/sin">sin()</a> expect angles measured radians by default.
   * Calling `angleMode(DEGREES)` switches to degrees. Calling
   * `angleMode(RADIANS)` switches back to radians.
   *
   * Calling `angleMode()` with no arguments returns current angle mode, which
   * is either `RADIANS` or `DEGREES`.
   *
   * @method angleMode
   * @param {(RADIANS|DEGREES)} mode either RADIANS or DEGREES.
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Rotate 1/8 turn.
   *   rotate(QUARTER_PI);
   *
   *   // Draw a line.
   *   line(0, 0, 80, 0);
   *
   *   describe('A diagonal line radiating from the top-left corner of a square.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Use degrees.
   *   angleMode(DEGREES);
   *
   *   // Rotate 1/8 turn.
   *   rotate(45);
   *
   *   // Draw a line.
   *   line(0, 0, 80, 0);
   *
   *   describe('A diagonal line radiating from the top-left corner of a square.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(50);
   *
   *   // Calculate the angle to rotate.
   *   let angle = TWO_PI / 7;
   *
   *   // Move the origin to the center.
   *   translate(50, 50);
   *
   *   // Style the flower.
   *   noStroke();
   *   fill(255, 50);
   *
   *   // Draw the flower.
   *   for (let i = 0; i < 7; i += 1) {
   *     ellipse(0, 0, 80, 20);
   *     rotate(angle);
   *   }
   *
   *   describe('A translucent white flower on a dark background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(50);
   *
   *   // Use degrees.
   *   angleMode(DEGREES);
   *
   *   // Calculate the angle to rotate.
   *   let angle = 360 / 7;
   *
   *   // Move the origin to the center.
   *   translate(50, 50);
   *
   *   // Style the flower.
   *   noStroke();
   *   fill(255, 50);
   *
   *   // Draw the flower.
   *   for (let i = 0; i < 7; i += 1) {
   *     ellipse(0, 0, 80, 20);
   *     rotate(angle);
   *   }
   *
   *   describe('A translucent white flower on a dark background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe('A white ball on a string oscillates left and right.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Calculate the coordinates.
   *   let x = 30 * cos(frameCount * 0.05) + 50;
   *   let y = 50;
   *
   *   // Draw the oscillator.
   *   line(50, y, x, y);
   *   circle(x, y, 20);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Use degrees.
   *   angleMode(DEGREES);
   *
   *   describe('A white ball on a string oscillates left and right.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Calculate the coordinates.
   *   let x = 30 * cos(frameCount * 2.86) + 50;
   *   let y = 50;
   *
   *   // Draw the oscillator.
   *   line(50, y, x, y);
   *   circle(x, y, 20);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Draw the upper line.
   *   rotate(PI / 6);
   *   line(0, 0, 80, 0);
   *
   *   // Use degrees.
   *   angleMode(DEGREES);
   *
   *   // Draw the lower line.
   *   rotate(30);
   *   line(0, 0, 80, 0);
   *
   *   describe('Two diagonal lines radiating from the top-left corner of a square. The lines are oriented 30 degrees from the edges of the square and 30 degrees apart from each other.');
   * }
   * </code>
   * </div>
   */
  /**
   * @method angleMode
   * @return {(RADIANS|DEGREES)} mode either RADIANS or DEGREES
   */
  fn.angleMode = function(mode) {
    // p5._validateParameters('angleMode', arguments);
    if (typeof mode === 'undefined') {
      return this._angleMode;
    } else if (mode === DEGREES || mode === RADIANS) {
      const prevMode = this._angleMode;

      // No change
      if(mode === prevMode) return;

      // Otherwise adjust pRotation according to new mode
      // This is necessary for acceleration events to work properly
      if(mode === RADIANS) {
        // Change pRotation to radians
        this.pRotationX = this.pRotationX * constants.DEG_TO_RAD;
        this.pRotationY = this.pRotationY * constants.DEG_TO_RAD;
        this.pRotationZ = this.pRotationZ * constants.DEG_TO_RAD;
      } else {
        // Change pRotation to degrees
        this.pRotationX = this.pRotationX * constants.RAD_TO_DEG;
        this.pRotationY = this.pRotationY * constants.RAD_TO_DEG;
        this.pRotationZ = this.pRotationZ * constants.RAD_TO_DEG;
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
    if (this._angleMode === DEGREES) {
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
    if (this._angleMode === RADIANS) {
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
    if (this._angleMode === DEGREES) {
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
    if (this._angleMode === RADIANS) {
      return angle * constants.DEG_TO_RAD;
    }
    return angle;
  };
}

export default trigonometry;

if(typeof p5 !== 'undefined'){
  trigonometry(p5, p5.prototype);
}
