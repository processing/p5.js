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
 * Draws an arc to the canvas. Arcs are drawn along the outer edge of an ellipse
 * (oval) defined by the `x`, `y`, `w`, and `h` parameters. Use the `start` and `stop`
 * parameters to specify the angles (in radians) at which to draw the arc. Arcs are
 * always drawn clockwise from `start` to `stop`. The origin of the arc's ellipse may
 * be changed with the <a href="#/p5/ellipseMode">ellipseMode()</a> function.
 *
 * The optional `mode` parameter determines the arc's fill style. The fill modes are
 * a semi-circle (`OPEN`), a closed semi-circle (`CHORD`), or a closed pie segment (`PIE`).
 *
 * @method arc
 * @param  {Number} x      x-coordinate of the arc's ellipse.
 * @param  {Number} y      y-coordinate of the arc's ellipse.
 * @param  {Number} w      width of the arc's ellipse by default.
 * @param  {Number} h      height of the arc's ellipse by default.
 * @param  {Number} start  angle to start the arc, specified in radians.
 * @param  {Number} stop   angle to stop the arc, specified in radians.
 * @param  {(CHORD|PIE|OPEN)} [mode] optional parameter to determine the way of drawing
 *                         the arc. either CHORD, PIE, or OPEN.
 * @param  {Integer} [detail] optional parameter for WebGL mode only. This is to
 *                         specify the number of vertices that makes up the
 *                         perimeter of the arc. Default value is 25. Won't
 *                         draw a stroke for a detail of more than 50.
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
 * describe(
 *   'A shattered outline of an ellipse with a quarter of a white circle at the bottom-right.'
 * );
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * arc(50, 50, 80, 80, 0, PI + QUARTER_PI);
 * describe('A white ellipse with the top-right third missing. The bottom is outlined in black.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * arc(50, 50, 80, 80, 0, PI + QUARTER_PI, OPEN);
 * describe(
 *   'A white ellipse missing a section from the top-right. The bottom is outlined in black.'
 * );
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * arc(50, 50, 80, 80, 0, PI + QUARTER_PI, CHORD);
 * describe('A white ellipse with a black outline missing a section from the top-right.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * arc(50, 50, 80, 80, 0, PI + QUARTER_PI, PIE);
 * describe('A white ellipse with a black outline. The top-right third is missing.');
 * </code>
 * </div>
 *
 */
p5.prototype.arc = function(x, y, w, h, start, stop, mode, detail) {
  p5._validateParameters('arc', arguments);

  // if the current stroke and fill settings wouldn't result in something
  // visible, exit immediately
  if (!this._renderer._doStroke && !this._renderer._doFill) {
    return this;
  }

  if (start === stop) {
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

    //accessible Outputs
    if (this._accessibleOutputs.grid || this._accessibleOutputs.text) {
      this._accsOutput('arc', [
        vals.x,
        vals.y,
        vals.w,
        vals.h,
        angles.start,
        angles.stop,
        mode
      ]);
    }
  }

  return this;
};

/**
 * Draws an ellipse (oval) to the canvas. An ellipse with equal width and height
 * is a circle. By default, the first two parameters set the location of the
 * center of the ellipse. The third and fourth parameters set the shape's width
 * and height, respectively. The origin may be changed with the
 * <a href="#/p5/ellipseMode">ellipseMode()</a> function.
 *
 * If no height is specified, the value of width is used for both the width and
 * height. If a negative height or width is specified, the absolute value is
 * taken.
 *
 * @method ellipse
 * @param  {Number} x x-coordinate of the center of the ellipse.
 * @param  {Number} y y-coordinate of the center of the ellipse.
 * @param  {Number} w width of the ellipse.
 * @param  {Number} [h] height of the ellipse.
 * @chainable
 * @example
 * <div>
 * <code>
 * ellipse(56, 46, 55, 55);
 * describe('A white ellipse with black outline in middle of a gray canvas.');
 * </code>
 * </div>
 *
 */

/**
 * @method ellipse
 * @param  {Number} x
 * @param  {Number} y
 * @param  {Number} w
 * @param  {Number} h
 * @param  {Integer} [detail] optional parameter for WebGL mode only. This is to
 *                         specify the number of vertices that makes up the
 *                         perimeter of the ellipse. Default value is 25. Won't
 *                         draw a stroke for a detail of more than 50.
 */
p5.prototype.ellipse = function(x, y, w, h, detailX) {
  p5._validateParameters('ellipse', arguments);
  return this._renderEllipse(...arguments);
};

/**
 * Draws a circle to the canvas. A circle is a round shape. Every point on the
 * edge of a circle is the same distance from its center. By default, the first
 * two parameters set the location of the center of the circle. The third
 * parameter sets the shape's width and height (diameter). The origin may be
 * changed with the <a href="#/p5/ellipseMode">ellipseMode()</a> function.
 *
 * @method circle
 * @param  {Number} x  x-coordinate of the center of the circle.
 * @param  {Number} y  y-coordinate of the center of the circle.
 * @param  {Number} d  diameter of the circle.
 * @chainable
 * @example
 * <div>
 * <code>
 * circle(30, 30, 20);
 * describe('A white circle with black outline in the middle of a gray canvas.');
 * </code>
 * </div>
 *
 */
p5.prototype.circle = function() {
  p5._validateParameters('circle', arguments);
  const args = Array.prototype.slice.call(arguments, 0, 2);
  args.push(arguments[2]);
  args.push(arguments[2]);
  return this._renderEllipse(...args);
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

  //accessible Outputs
  if (this._accessibleOutputs.grid || this._accessibleOutputs.text) {
    this._accsOutput('ellipse', [vals.x, vals.y, vals.w, vals.h]);
  }

  return this;
};

/**
 * Draws a line, a straight path between two points. Its default width is one pixel.
 * The version of `line()` with four parameters draws the line in 2D. To color a line,
 * use the <a href="#/p5/stroke">stroke()</a> function. To change its width, use the
 * <a href="#/p5/strokeWeight">strokeWeight()</a> function. A line
 * can't be filled, so the <a href="#/p5/fill">fill()</a> function won't affect
 * the color of a  line.
 *
 * The version of `line()` with six parameters allows the line to be drawn in 3D
 * space. Doing so requires adding the `WEBGL` argument to
 * <a href="#/p5/createCanvas">createCanvas()</a>.
 *
 * @method line
 * @param  {Number} x1 the x-coordinate of the first point.
 * @param  {Number} y1 the y-coordinate of the first point.
 * @param  {Number} x2 the x-coordinate of the second point.
 * @param  {Number} y2 the y-coordinate of the second point.
 * @chainable
 * @example
 * <div>
 * <code>
 * line(30, 20, 85, 75);
 * describe(
 *   'A black line on a gray canvas running from top-center to bottom-right.'
 * );
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
 * describe(
 *   'Three lines drawn in grayscale on a gray canvas. They form the top, right, and bottom sides of a square.'
 * );
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   describe('A black line drawn on a gray canvas.');
 * }
 *
 * function draw() {
 *   background(220);
 *   line(0, 0, 0, 10, 10, 0);
 * }
 * </code>
 * </div>
 *
 */

/**
 * @method line
 * @param  {Number} x1
 * @param  {Number} y1
 * @param  {Number} z1 the z-coordinate of the first point.
 * @param  {Number} x2
 * @param  {Number} y2
 * @param  {Number} z2 the z-coordinate of the second point.
 * @chainable
 */
p5.prototype.line = function(...args) {
  p5._validateParameters('line', args);

  if (this._renderer._doStroke) {
    this._renderer.line(...args);
  }

  //accessible Outputs
  if (this._accessibleOutputs.grid || this._accessibleOutputs.text) {
    this._accsOutput('line', args);
  }

  return this;
};

/**
 * Draws a point, a single coordinate in space. Its default size is one pixel. The first two
 * parameters are the point's x- and y-coordinates, respectively. To color a point, use
 * the <a href="#/p5/stroke">stroke()</a> function. To change its size, use the
 * <a href="#/p5/strokeWeight">strokeWeight()</a> function.
 *
 * The version of `point()` with three parameters allows the point to be drawn in 3D
 * space. Doing so requires adding the `WEBGL` argument to
 * <a href="#/p5/createCanvas">createCanvas()</a>.
 *
 * The version of point() with one parameter allows the point's location to be set with
 * a <a href="#/p5/p5.Vector">p5.Vector</a> object.
 *
 * @method point
 * @param  {Number} x the x-coordinate.
 * @param  {Number} y the y-coordinate.
 * @param  {Number} [z] the z-coordinate (for WebGL mode).
 * @chainable
 * @example
 * <div>
 * <code>
 * point(30, 20);
 * point(85, 20);
 * point(85, 75);
 * point(30, 75);
 * describe(
 *   'Four small, black points drawn on a gray canvas. The points form the corners of a square.'
 * );
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * point(30, 20);
 * point(85, 20);
 * stroke('purple');
 * strokeWeight(10);
 * point(85, 75);
 * point(30, 75);
 * describe(
 *   'Four points drawn on a gray canvas. Two are black and two are purple. The points form the corners of a square.'
 * );
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let a = createVector(10, 10);
 * point(a);
 * let b = createVector(10, 20);
 * point(b);
 * let c = createVector(20, 10);
 * point(c);
 * let d = createVector(20, 20);
 * point(d);
 * describe(
 *   'Four small, black points drawn on a gray canvas. The points form the corners of a square.'
 * );
 * </code>
 * </div>
 *
 */

/**
 * @method point
 * @param {p5.Vector} coordinateVector the coordinate vector.
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
      //accessible Outputs
      if (this._accessibleOutputs.grid || this._accessibleOutputs.text) {
        this._accsOutput('point', args);
      }
    }
  }

  return this;
};

/**
 * Draws a quad to the canvas. A quad is a quadrilateral, a four-sided
 * polygon. Some examples of quads include rectangles, squares, rhombuses,
 * and trapezoids. The first pair of parameters (`x1`,`y1`) sets the quad's
 * first point. The following pairs of parameters set the coordinates for
 * its next three points. Parameters should proceed clockwise or
 * counter-clockwise around the shape.
 *
 * The version of `quad()` with twelve parameters allows the quad to be drawn
 * in 3D space. Doing so requires adding the `WEBGL` argument to
 * <a href="#/p5/createCanvas">createCanvas()</a>.
 *
 * @method quad
 * @param {Number} x1 the x-coordinate of the first point.
 * @param {Number} y1 the y-coordinate of the first point.
 * @param {Number} x2 the x-coordinate of the second point.
 * @param {Number} y2 the y-coordinate of the second point.
 * @param {Number} x3 the x-coordinate of the third point.
 * @param {Number} y3 the y-coordinate of the third point.
 * @param {Number} x4 the x-coordinate of the fourth point.
 * @param {Number} y4 the y-coordinate of the fourth point.
 * @param {Integer} [detailX] number of segments in the x-direction.
 * @param {Integer} [detailY] number of segments in the y-direction.
 * @chainable
 * @example
 * <div>
 * <code>
 * quad(20, 20, 80, 20, 80, 80, 20, 80);
 * describe('A white square with a black outline drawn on a gray canvas.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * quad(20, 30, 80, 30, 80, 70, 20, 70);
 * describe('A white rectangle with a black outline drawn on a gray canvas.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * quad(50, 62, 86, 50, 50, 38, 14, 50);
 * describe('A white rhombus with a black outline drawn on a gray canvas.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * quad(20, 50, 80, 30, 80, 70, 20, 70);
 * describe('A white trapezoid with a black outline drawn on a gray canvas.');
 * </code>
 * </div>
 */
/**
 * @method quad
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} z1 the z-coordinate of the first point.
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} z2 the z-coordinate of the second point.
 * @param {Number} x3
 * @param {Number} y3
 * @param {Number} z3 the z-coordinate of the third point.
 * @param {Number} x4
 * @param {Number} y4
 * @param {Number} z4 the z-coordinate of the fourth point.
 * @param {Integer} [detailX]
 * @param {Integer} [detailY]
 * @chainable
 */
p5.prototype.quad = function(...args) {
  p5._validateParameters('quad', args);

  if (this._renderer._doStroke || this._renderer._doFill) {
    if (this._renderer.isP3D && args.length < 12) {
      // if 3D and we weren't passed 12 args, assume Z is 0
      this._renderer.quad.call(
        this._renderer,
        args[0], args[1], 0,
        args[2], args[3], 0,
        args[4], args[5], 0,
        args[6], args[7], 0,
        args[8], args[9]);
    } else {
      this._renderer.quad(...args);
      //accessibile outputs
      if (this._accessibleOutputs.grid || this._accessibleOutputs.text) {
        this._accsOutput('quadrilateral', args);
      }
    }
  }

  return this;
};

/**
 * Draws a rectangle to the canvas. A rectangle is a four-sided polygon with
 * every angle at ninety degrees. By default, the first two parameters set the
 * location of the rectangle's upper-left corner. The third and fourth set the
 * shape's the width and height, respectively. The way these parameters are
 * interpreted may be changed with the <a href="#/p5/rectMode">rectMode()</a>
 * function.
 *
 * The version of `rect()` with five parameters creates a rounded rectangle. The
 * fifth parameter is used as the radius value for all four corners.
 *
 * The version of `rect()` with eight parameters also creates a rounded rectangle.
 * When using eight parameters, the latter four set the radius of the arc at
 * each corner separately. The radii start with the top-left corner and move
 * clockwise around the rectangle. If any of these parameters are omitted, they
 * are set to the value of the last specified corner radius.
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
 * rect(30, 20, 55, 55);
 * describe('A white rectangle with a black outline on a gray canvas.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * rect(30, 20, 55, 55, 20);
 * describe(
 *   'A white rectangle with a black outline and round edges on a gray canvas.'
 * );
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * rect(30, 20, 55, 55, 20, 15, 10, 5);
 * describe('A white rectangle with a black outline and round edges of different radii.');
 * </code>
 * </div>
 *
 */

/**
 * @method rect
 * @param  {Number} x
 * @param  {Number} y
 * @param  {Number} w
 * @param  {Number} h
 * @param  {Integer} [detailX] number of segments in the x-direction (for WebGL mode).
 * @param  {Integer} [detailY] number of segments in the y-direction (for WebGL mode).
 * @chainable
 */
p5.prototype.rect = function(...args) {
  p5._validateParameters('rect', args);
  return this._renderRect(...args);
};

/**
 * Draws a square to the canvas. A square is a four-sided polygon with every
 * angle at ninety degrees and equal side lengths. By default, the first two
 * parameters set the location of the square's upper-left corner. The third
 * parameter sets its side size. The way these parameters are interpreted may
 * be changed with the <a href="#/p5/rectMode">rectMode()</a> function.
 *
 * The version of `square()` with four parameters creates a rounded square. The
 * fourth parameter is used as the radius value for all four corners.
 *
 * The version of `square()` with seven parameters also creates a rounded square.
 * When using seven parameters, the latter four set the radius of the arc at
 * each corner separately. The radii start with the top-left corner and move
 * clockwise around the square. If any of these parameters are omitted, they
 * are set to the value of the last specified corner radius.
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
 * square(30, 20, 55);
 * describe('A white square with a black outline in on a gray canvas.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * square(30, 20, 55, 20);
 * describe(
 *   'A white square with a black outline and round edges on a gray canvas.'
 * );
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * square(30, 20, 55, 20, 15, 10, 5);
 * describe('A white square with a black outline and round edges of different radii.');
 * </code>
 * </div>
 *
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

    //accessible outputs
    if (this._accessibleOutputs.grid || this._accessibleOutputs.text) {
      this._accsOutput('rectangle', [vals.x, vals.y, vals.w, vals.h]);
    }
  }

  return this;
};

/**
 * Draws a triangle to the canvas. A triangle is a three-sided polygon. The
 * first two parameters specify the triangle's first point `(x1,y1)`. The middle
 * two parameters specify its second point `(x2,y2)`. And the last two parameters
 * specify its third point `(x3, y3)`.
 *
 * @method triangle
 * @param  {Number} x1 x-coordinate of the first point.
 * @param  {Number} y1 y-coordinate of the first point.
 * @param  {Number} x2 x-coordinate of the second point.
 * @param  {Number} y2 y-coordinate of the second point.
 * @param  {Number} x3 x-coordinate of the third point.
 * @param  {Number} y3 y-coordinate of the third point.
 * @chainable
 * @example
 * <div>
 * <code>
 * triangle(30, 75, 58, 20, 86, 75);
 * describe('A white triangle with a black outline on a gray canvas.');
 * </code>
 * </div>
 *
 */
p5.prototype.triangle = function(...args) {
  p5._validateParameters('triangle', args);

  if (this._renderer._doStroke || this._renderer._doFill) {
    this._renderer.triangle(args);
  }

  //accessible outputs
  if (this._accessibleOutputs.grid || this._accessibleOutputs.text) {
    this._accsOutput('triangle', args);
  }

  return this;
};

export default p5;
