/**
 * @module Shape
 * @submodule 2D Primitives
 * @for p5
 * @requires core
 * @requires constants
 */

import p5 from '../main';
import * as constants from '../constants';
import canvas from '../helpers';
import '../friendly_errors/fes_core';
import '../friendly_errors/file_errors';
import '../friendly_errors/validate_params';

/**
 * This function does 3 things:
 *
 *   1. Bounds the desired start/stop angles for an arc (in radians) so that:
 *
 *          0 <= start < TWO_PI ;    start <= stop < start + TWO_PI
 *
 *      This means that the arc rendering functions don't have to be concerned
 *      with what happens if stop is smaller than start, or if the arc 'goes
 *      round more than once', etc.: they can just start at start and increase
 *      until stop and the correct arc will be drawn.
 *
 *   2. Optionally adjusts the angles within each quadrant to counter the naive
 *      scaling of the underlying ellipse up from the unit circle.  Without
 *      this, the angles become arbitrary when width != height: 45 degrees
 *      might be drawn at 5 degrees on a 'wide' ellipse, or at 85 degrees on
 *      a 'tall' ellipse.
 *
 *   3. Flags up when start and stop correspond to the same place on the
 *      underlying ellipse.  This is useful if you want to do something special
 *      there (like rendering a whole ellipse instead).
 */
p5.prototype._normalizeArcAngles = (
  start,
  stop,
  width,
  height,
  correctForScaling
) => {
  const epsilon = 0.00001; // Smallest visible angle on displays up to 4K.
  let separation;

  // The order of the steps is important here: each one builds upon the
  // adjustments made in the steps that precede it.

  // Constrain both start and stop to [0,TWO_PI).
  start = start - constants.TWO_PI * Math.floor(start / constants.TWO_PI);
  stop = stop - constants.TWO_PI * Math.floor(stop / constants.TWO_PI);

  // Get the angular separation between the requested start and stop points.
  //
  // Technically this separation only matches what gets drawn if
  // correctForScaling is enabled.  We could add a more complicated calculation
  // for when the scaling is uncorrected (in which case the drawn points could
  // end up pushed together or pulled apart quite dramatically relative to what
  // was requested), but it would make things more opaque for little practical
  // benefit.
  //
  // (If you do disable correctForScaling and find that correspondToSamePoint
  // is set too aggressively, the easiest thing to do is probably to just make
  // epsilon smaller...)
  separation = Math.min(
    Math.abs(start - stop),
    constants.TWO_PI - Math.abs(start - stop)
  );

  // Optionally adjust the angles to counter linear scaling.
  if (correctForScaling) {
    if (start <= constants.HALF_PI) {
      start = Math.atan(width / height * Math.tan(start));
    } else if (start > constants.HALF_PI && start <= 3 * constants.HALF_PI) {
      start = Math.atan(width / height * Math.tan(start)) + constants.PI;
    } else {
      start = Math.atan(width / height * Math.tan(start)) + constants.TWO_PI;
    }
    if (stop <= constants.HALF_PI) {
      stop = Math.atan(width / height * Math.tan(stop));
    } else if (stop > constants.HALF_PI && stop <= 3 * constants.HALF_PI) {
      stop = Math.atan(width / height * Math.tan(stop)) + constants.PI;
    } else {
      stop = Math.atan(width / height * Math.tan(stop)) + constants.TWO_PI;
    }
  }

  // Ensure that start <= stop < start + TWO_PI.
  if (start > stop) {
    stop += constants.TWO_PI;
  }

  return {
    start,
    stop,
    correspondToSamePoint: separation < epsilon
  };
};

/**
 * Draw an arc to the screen. If called with only x, y, w, h, start and stop,
 * the arc will be drawn and filled as an open pie segment. If a mode parameter
 * is provided, the arc will be filled like an open semi-circle (OPEN), a closed
 * semi-circle (CHORD), or as a closed pie segment (PIE). The origin may be changed
 * with the <a href="#/p5/ellipseMode">ellipseMode()</a> function.
 *
 * The arc is always drawn clockwise from wherever start falls to wherever stop
 * falls on the ellipse.Adding or subtracting TWO_PI to either angle does not
 * change where they fall. If both start and stop fall at the same place, a full
 * ellipse will be drawn. Be aware that the y-axis increases in the downward
 * direction, therefore angles are measured clockwise from the positive
 * x-direction ("3 o'clock").
 *
 * @method arc
 * @param  {Number} x      x-coordinate of the arc's ellipse
 * @param  {Number} y      y-coordinate of the arc's ellipse
 * @param  {Number} w      width of the arc's ellipse by default
 * @param  {Number} h      height of the arc's ellipse by default
 * @param  {Number} start  angle to start the arc, specified in radians
 * @param  {Number} stop   angle to stop the arc, specified in radians
 * @param  {Constant} [mode] optional parameter to determine the way of drawing
 *                         the arc. either CHORD, PIE or OPEN
 * @param  {Number} [detail] optional parameter for WebGL mode only. This is to
 *                         specify the number of vertices that makes up the
 *                         perimeter of the arc. Default value is 25.
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * arc(50, 55, 50, 50, 0, HALF_PI);
 * noFill();
 * arc(50, 55, 60, 60, HALF_PI, PI);
 * arc(50, 55, 70, 70, PI, PI + QUARTER_PI);
 * arc(50, 55, 80, 80, PI + QUARTER_PI, TWO_PI);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * arc(50, 50, 80, 80, 0, PI + QUARTER_PI);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * arc(50, 50, 80, 80, 0, PI + QUARTER_PI, OPEN);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * arc(50, 50, 80, 80, 0, PI + QUARTER_PI, CHORD);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * arc(50, 50, 80, 80, 0, PI + QUARTER_PI, PIE);
 * </code>
 * </div>
 *
 * @alt
 *shattered outline of an ellipse with a quarter of a white circle bottom-right.
 *white ellipse with top right quarter missing.
 *white ellipse with black outline with top right missing.
 *white ellipse with top right missing with black outline around shape.
 *white ellipse with top right quarter missing with black outline around the shape.
 */
p5.prototype.arc = function(x, y, w, h, start, stop, mode, detail) {
  p5._validateParameters('arc', arguments);

  // if the current stroke and fill settings wouldn't result in something
  // visible, exit immediately
  if (!this._renderer._doStroke && !this._renderer._doFill) {
    return this;
  }

  start = this._toRadians(start);
  stop = this._toRadians(stop);

  // p5 supports negative width and heights for ellipses
  w = Math.abs(w);
  h = Math.abs(h);

  const vals = canvas.modeAdjust(x, y, w, h, this._renderer._ellipseMode);
  const angles = this._normalizeArcAngles(start, stop, vals.w, vals.h, true);

  if (angles.correspondToSamePoint) {
    // If the arc starts and ends at (near enough) the same place, we choose to
    // draw an ellipse instead.  This is preferable to faking an ellipse (by
    // making stop ever-so-slightly less than start + TWO_PI) because the ends
    // join up to each other rather than at a vertex at the centre (leaving
    // an unwanted spike in the stroke/fill).
    this._renderer.ellipse([vals.x, vals.y, vals.w, vals.h, detail]);
  } else {
    this._renderer.arc(
      vals.x,
      vals.y,
      vals.w,
      vals.h,
      angles.start, // [0, TWO_PI)
      angles.stop, // [start, start + TWO_PI)
      mode,
      detail
    );
  }

  return this;
};

/**
 * Draws an ellipse (oval) to the screen. By default, the first two parameters
 * set the location of the center of the ellipse, and the third and fourth
 * parameters set the shape's width and height. If no height is specified, the
 * value of width is used for both the width and height. If a negative height or
 * width is specified, the absolute value is taken.
 *
 * An ellipse with equal width and height is a circle.The origin may be changed
 * with the <a href="#/p5/ellipseMode">ellipseMode()</a> function.
 *
 * @method ellipse
 * @param  {Number} x x-coordinate of the center of ellipse.
 * @param  {Number} y y-coordinate of the center of ellipse.
 * @param  {Number} w width of the ellipse.
 * @param  {Number} [h] height of the ellipse.
 * @chainable
 * @example
 * <div>
 * <code>
 * ellipse(56, 46, 55, 55);
 * </code>
 * </div>
 *
 * @alt
 *white ellipse with black outline in middle-right of canvas that is 55x55
 */

/**
 * @method ellipse
 * @param  {Number} x
 * @param  {Number} y
 * @param  {Number} w
 * @param  {Number} h
 * @param  {Integer} detail number of radial sectors to draw (for WebGL mode)
 */
p5.prototype.ellipse = function(x, y, w, h, detailX) {
  p5._validateParameters('ellipse', arguments);
  return this._renderEllipse.apply(this, arguments);
};

/**
 * Draws a circle to the screen. A circle is a simple closed shape.It is the set
 * of all points in a plane that are at a given distance from a given point,
 * the centre.This function is a special case of the ellipse() function, where
 * the width and height of the ellipse are the same. Height and width of the
 * ellipse correspond to the diameter of the circle. By default, the first two
 * parameters set the location of the centre of the circle, the third sets the
 * diameter of the circle.
 *
 * @method circle
 * @param  {Number} x  x-coordinate of the centre of the circle.
 * @param  {Number} y  y-coordinate of the centre of the circle.
 * @param  {Number} d  diameter of the circle.
 * @chainable
 * @example
 * <div>
 * <code>
 * // Draw a circle at location (30, 30) with a diameter of 20.
 * circle(30, 30, 20);
 * </code>
 * </div>
 *
 * @alt
 * white circle with black outline in mid of canvas that is 55x55.
 */
p5.prototype.circle = function() {
  p5._validateParameters('circle', arguments);
  const args = Array.prototype.slice.call(arguments, 0, 2);
  args.push(arguments[2]);
  args.push(arguments[2]);
  return this._renderEllipse.apply(this, args);
};

// internal method for drawing ellipses (without parameter validation)
p5.prototype._renderEllipse = function(x, y, w, h, detailX) {
  // if the current stroke and fill settings wouldn't result in something
  // visible, exit immediately
  if (!this._renderer._doStroke && !this._renderer._doFill) {
    return this;
  }

  // p5 supports negative width and heights for rects
  if (w < 0) {
    w = Math.abs(w);
  }

  if (typeof h === 'undefined') {
    // Duplicate 3rd argument if only 3 given.
    h = w;
  } else if (h < 0) {
    h = Math.abs(h);
  }

  const vals = canvas.modeAdjust(x, y, w, h, this._renderer._ellipseMode);
  this._renderer.ellipse([vals.x, vals.y, vals.w, vals.h, detailX]);

  return this;
};

/**
 * Draws a line (a direct path between two points) to the screen. If called with
 * only 4 parameters, it will draw a line in 2D with a default width of 1 pixel.
 * This width can be modified by using the <a href="#/p5/strokeWeight">
 * strokeWeight()</a> function. A line cannot be filled, therefore the <a
 * href="#/p5/fill">fill()</a> function will not affect the color of a line. So to
 * color a line, use the <a href="#/p5/stroke">stroke()</a> function.
 *
 * @method line
 * @param  {Number} x1 the x-coordinate of the first point
 * @param  {Number} y1 the y-coordinate of the first point
 * @param  {Number} x2 the x-coordinate of the second point
 * @param  {Number} y2 the y-coordinate of the second point
 * @chainable
 * @example
 * <div>
 * <code>
 * line(30, 20, 85, 75);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * line(30, 20, 85, 20);
 * stroke(126);
 * line(85, 20, 85, 75);
 * stroke(255);
 * line(85, 75, 30, 75);
 * </code>
 * </div>
 *
 * @alt
 * An example showing a line 78 pixels long running from mid-top to bottom-right of canvas.
 * An example showing 3 lines of various stroke sizes. Form top, bottom and right sides of a square.
 */

/**
 * @method line
 * @param  {Number} x1
 * @param  {Number} y1
 * @param  {Number} z1 the z-coordinate of the first point
 * @param  {Number} x2
 * @param  {Number} y2
 * @param  {Number} z2 the z-coordinate of the second point
 * @chainable
 */
p5.prototype.line = function(...args) {
  p5._validateParameters('line', args);

  if (this._renderer._doStroke) {
    this._renderer.line(...args);
  }

  return this;
};

/**
 * Draws a point, a coordinate in space at the dimension of one pixel.
 * The first parameter is the horizontal value for the point, the second
 * param is the vertical value for the point. The color of the point is
 * changed with the <a href="#/p5/stroke">stroke()</a> function. The size of the point
 * can be changed with the <a href="#/p5/strokeWeight">strokeWeight()</a> function.
 *
 * @method point
 * @param  {Number} x the x-coordinate
 * @param  {Number} y the y-coordinate
 * @param  {Number} [z] the z-coordinate (for WebGL mode)
 * @chainable
 * @example
 * <div>
 * <code>
 * point(30, 20);
 * point(85, 20);
 * point(85, 75);
 * point(30, 75);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * point(30, 20);
 * point(85, 20);
 * stroke('purple'); // Change the color
 * strokeWeight(10); // Make the points 10 pixels in size
 * point(85, 75);
 * point(30, 75);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let a = createVector(10, 10);
 * point(a);
 * let b = createVector(10, 20);
 * point(b);
 * point(createVector(20, 10));
 * point(createVector(20, 20));
 * </code>
 * </div>
 *
 * @alt
 * 4 points centered in the middle-right of the canvas.
 * 2 large points and 2 large purple points centered in the middle-right of the canvas.
 * Vertices of a square of length 10 pixels towards the top-left of the canvas.
 */

/**
 * @method point
 * @param {p5.Vector} coordinate_vector the coordinate vector
 * @chainable
 */
p5.prototype.point = function(...args) {
  p5._validateParameters('point', args);

  if (this._renderer._doStroke) {
    if (args.length === 1 && args[0] instanceof p5.Vector) {
      this._renderer.point.call(
        this._renderer,
        args[0].x,
        args[0].y,
        args[0].z
      );
    } else {
      this._renderer.point(...args);
    }
  }

  return this;
};

/**
 * Draws a quad on the canvas. A quad is a quadrilateral, a four sided polygon. It is
 * similar to a rectangle, but the angles between its edges are not
 * constrained to ninety degrees. The first pair of parameters (x1,y1)
 * sets the first vertex and the subsequent pairs should proceed
 * clockwise or counter-clockwise around the defined shape.
 * z-arguments only work when quad() is used in WEBGL mode.
 *
 * @method quad
 * @param {Number} x1 the x-coordinate of the first point
 * @param {Number} y1 the y-coordinate of the first point
 * @param {Number} x2 the x-coordinate of the second point
 * @param {Number} y2 the y-coordinate of the second point
 * @param {Number} x3 the x-coordinate of the third point
 * @param {Number} y3 the y-coordinate of the third point
 * @param {Number} x4 the x-coordinate of the fourth point
 * @param {Number} y4 the y-coordinate of the fourth point
 * @chainable
 * @example
 * <div>
 * <code>
 * quad(38, 31, 86, 20, 69, 63, 30, 76);
 * </code>
 * </div>
 *
 * @alt
 *irregular white quadrilateral shape with black outline mid-right of canvas.
 */
/**
 * @method quad
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} z1 the z-coordinate of the first point
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} z2 the z-coordinate of the second point
 * @param {Number} x3
 * @param {Number} y3
 * @param {Number} z3 the z-coordinate of the third point
 * @param {Number} x4
 * @param {Number} y4
 * @param {Number} z4 the z-coordinate of the fourth point
 * @chainable
 */
p5.prototype.quad = function(...args) {
  p5._validateParameters('quad', args);

  if (this._renderer._doStroke || this._renderer._doFill) {
    if (this._renderer.isP3D && args.length !== 12) {
      // if 3D and we weren't passed 12 args, assume Z is 0
      // prettier-ignore
      this._renderer.quad.call(
        this._renderer,
        args[0], args[1], 0,
        args[2], args[3], 0,
        args[4], args[5], 0,
        args[6], args[7], 0);
    } else {
      this._renderer.quad(...args);
    }
  }

  return this;
};

/**
 * Draws a rectangle on the canvas. A rectangle is a four-sided closed shape with
 * every angle at ninety degrees. By default, the first two parameters set
 * the location of the upper-left corner, the third sets the width, and the
 * fourth sets the height. The way these parameters are interpreted, may be
 * changed with the <a href="#/p5/rectMode">rectMode()</a> function.
 *
 * The fifth, sixth, seventh and eighth parameters, if specified,
 * determine corner radius for the top-left, top-right, lower-right and
 * lower-left corners, respectively. An omitted corner radius parameter is set
 * to the value of the previously specified radius value in the parameter list.
 *
 * @method rect
 * @param  {Number} x  x-coordinate of the rectangle.
 * @param  {Number} y  y-coordinate of the rectangle.
 * @param  {Number} w  width of the rectangle.
 * @param  {Number} [h]  height of the rectangle.
 * @param  {Number} [tl] optional radius of top-left corner.
 * @param  {Number} [tr] optional radius of top-right corner.
 * @param  {Number} [br] optional radius of bottom-right corner.
 * @param  {Number} [bl] optional radius of bottom-left corner.
 * @chainable
 * @example
 * <div>
 * <code>
 * // Draw a rectangle at location (30, 20) with a width and height of 55.
 * rect(30, 20, 55, 55);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Draw a rectangle with rounded corners, each having a radius of 20.
 * rect(30, 20, 55, 55, 20);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Draw a rectangle with rounded corners having the following radii:
 * // top-left = 20, top-right = 15, bottom-right = 10, bottom-left = 5.
 * rect(30, 20, 55, 55, 20, 15, 10, 5);
 * </code>
 * </div>
 *
 * @alt
 * 55x55 white rect with black outline in mid-right of canvas.
 * 55x55 white rect with black outline and rounded edges in mid-right of canvas.
 * 55x55 white rect with black outline and rounded edges of different radii.
 */

/**
 * @method rect
 * @param  {Number} x
 * @param  {Number} y
 * @param  {Number} w
 * @param  {Number} h
 * @param  {Integer} [detailX] number of segments in the x-direction (for WebGL mode)
 * @param  {Integer} [detailY] number of segments in the y-direction (for WebGL mode)
 * @chainable
 */
p5.prototype.rect = function() {
  p5._validateParameters('rect', arguments);
  return this._renderRect.apply(this, arguments);
};

/**
 * Draws a square to the screen. A square is a four-sided shape with every angle
 * at ninety degrees, and equal side size. This function is a special case of the
 * rect() function, where the width and height are the same, and the parameter
 * is called "s" for side size. By default, the first two parameters set the
 * location of the upper-left corner, the third sets the side size of the square.
 * The way these parameters are interpreted, may be changed with the <a
 * href="#/p5/rectMode">rectMode()</a> function.
 *
 * The fourth, fifth, sixth and seventh parameters, if specified,
 * determine corner radius for the top-left, top-right, lower-right and
 * lower-left corners, respectively. An omitted corner radius parameter is set
 * to the value of the previously specified radius value in the parameter list.
 *
 * @method square
 * @param  {Number} x  x-coordinate of the square.
 * @param  {Number} y  y-coordinate of the square.
 * @param  {Number} s  side size of the square.
 * @param  {Number} [tl] optional radius of top-left corner.
 * @param  {Number} [tr] optional radius of top-right corner.
 * @param  {Number} [br] optional radius of bottom-right corner.
 * @param  {Number} [bl] optional radius of bottom-left corner.
 * @chainable
 * @example
 * <div>
 * <code>
 * // Draw a square at location (30, 20) with a side size of 55.
 * square(30, 20, 55);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Draw a square with rounded corners, each having a radius of 20.
 * square(30, 20, 55, 20);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Draw a square with rounded corners having the following radii:
 * // top-left = 20, top-right = 15, bottom-right = 10, bottom-left = 5.
 * square(30, 20, 55, 20, 15, 10, 5);
 * </code>
 * </div>
 *
 * @alt
 * 55x55 white square with black outline in mid-right of canvas.
 * 55x55 white square with black outline and rounded edges in mid-right of canvas.
 * 55x55 white square with black outline and rounded edges of different radii.
 */
p5.prototype.square = function(x, y, s, tl, tr, br, bl) {
  p5._validateParameters('square', arguments);
  // duplicate width for height in case of square
  return this._renderRect.call(this, x, y, s, s, tl, tr, br, bl);
};

// internal method to have renderer draw a rectangle
p5.prototype._renderRect = function() {
  if (this._renderer._doStroke || this._renderer._doFill) {
    // duplicate width for height in case only 3 arguments is provided
    if (arguments.length === 3) {
      arguments[3] = arguments[2];
    }
    const vals = canvas.modeAdjust(
      arguments[0],
      arguments[1],
      arguments[2],
      arguments[3],
      this._renderer._rectMode
    );

    const args = [vals.x, vals.y, vals.w, vals.h];
    // append the additional arguments (either cornder radii, or
    // segment details) to the argument list
    for (let i = 4; i < arguments.length; i++) {
      args[i] = arguments[i];
    }
    this._renderer.rect(args);
  }

  return this;
};

/**
 * Draws a trangle to the canvas. A triangle is a plane created by connecting
 * three points. The first two arguments specify the first point, the middle two
 * arguments specify the second point, and the last two arguments specify the
 * third point.
 *
 * @method triangle
 * @param  {Number} x1 x-coordinate of the first point
 * @param  {Number} y1 y-coordinate of the first point
 * @param  {Number} x2 x-coordinate of the second point
 * @param  {Number} y2 y-coordinate of the second point
 * @param  {Number} x3 x-coordinate of the third point
 * @param  {Number} y3 y-coordinate of the third point
 * @chainable
 * @example
 * <div>
 * <code>
 * triangle(30, 75, 58, 20, 86, 75);
 * </code>
 * </div>
 *
 *@alt
 * white triangle with black outline in mid-right of canvas.
 */
p5.prototype.triangle = function(...args) {
  p5._validateParameters('triangle', args);

  if (this._renderer._doStroke || this._renderer._doFill) {
    this._renderer.triangle(args);
  }

  return this;
};

export default p5;
