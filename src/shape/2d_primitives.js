/**
 * @module Shape
 * @submodule 2D Primitives
 * @for p5
 * @requires core
 * @requires constants
 */

import * as constants from '../core/constants';
import canvas from '../core/helpers';

function primitives(p5, fn){
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
  fn._normalizeArcAngles = (
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
   * Draws an arc.
   *
   * An arc is a section of an ellipse defined by the `x`, `y`, `w`, and
   * `h` parameters. `x` and `y` set the location of the arc's center. `w` and
   * `h` set the arc's width and height. See
   * <a href="#/p5/ellipse">ellipse()</a> and
   * <a href="#/p5/ellipseMode">ellipseMode()</a> for more details.
   *
   * The fifth and sixth parameters, `start` and `stop`, set the angles
   * between which to draw the arc. Arcs are always drawn clockwise from
   * `start` to `stop`. Angles are always given in radians.
   *
   * The seventh parameter, `mode`, is optional. It determines the arc's fill
   * style. The fill modes are a semi-circle (`OPEN`), a closed semi-circle
   * (`CHORD`), or a closed pie segment (`PIE`).
   *
   * The eighth parameter, `detail`, is also optional. It determines how many
   * vertices are used to draw the arc in WebGL mode. The default value is 25.
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
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   arc(50, 50, 80, 80, 0, PI + HALF_PI);
   *
   *   describe('A white circle on a gray canvas. The top-right quarter of the circle is missing.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   arc(50, 50, 80, 40, 0, PI + HALF_PI);
   *
   *   describe('A white ellipse on a gray canvas. The top-right quarter of the ellipse is missing.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Bottom-right.
   *   arc(50, 55, 50, 50, 0, HALF_PI);
   *
   *   noFill();
   *
   *   // Bottom-left.
   *   arc(50, 55, 60, 60, HALF_PI, PI);
   *
   *   // Top-left.
   *   arc(50, 55, 70, 70, PI, PI + QUARTER_PI);
   *
   *   // Top-right.
   *   arc(50, 55, 80, 80, PI + QUARTER_PI, TWO_PI);
   *
   *   describe(
   *     'A shattered outline of an circle with a quarter of a white circle at the bottom-right.'
   *   );
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
   *   // Default fill mode.
   *   arc(50, 50, 80, 80, 0, PI + QUARTER_PI);
   *
   *   describe('A white circle with the top-right third missing. The bottom is outlined in black.');
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
   *   // OPEN fill mode.
   *   arc(50, 50, 80, 80, 0, PI + QUARTER_PI, OPEN);
   *
   *   describe(
   *     'A white circle missing a section from the top-right. The bottom is outlined in black.'
   *   );
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
   *   // CHORD fill mode.
   *   arc(50, 50, 80, 80, 0, PI + QUARTER_PI, CHORD);
   *
   *   describe('A white circle with a black outline missing a section from the top-right.');
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
   *   // PIE fill mode.
   *   arc(50, 50, 80, 80, 0, PI + QUARTER_PI, PIE);
   *
   *   describe('A white circle with a black outline. The top-right third is missing.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   background(200);
   *
   *   // PIE fill mode.
   *   arc(0, 0, 80, 80, 0, PI + QUARTER_PI, PIE);
   *
   *   describe('A white circle with a black outline. The top-right third is missing.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   background(200);
   *
   *   // PIE fill mode with 5 vertices.
   *   arc(0, 0, 80, 80, 0, PI + QUARTER_PI, PIE, 5);
   *
   *   describe('A white circle with a black outline. The top-right third is missing.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe('A yellow circle on a black background. The circle opens and closes its mouth.');
   * }
   *
   * function draw() {
   *   background(0);
   *
   *   // Style the arc.
   *   noStroke();
   *   fill(255, 255, 0);
   *
   *   // Update start and stop angles.
   *   let biteSize = PI / 16;
   *   let startAngle = biteSize * sin(frameCount * 0.1) + biteSize;
   *   let endAngle = TWO_PI - startAngle;
   *
   *   // Draw the arc.
   *   arc(50, 50, 80, 80, startAngle, endAngle, PIE);
   * }
   * </code>
   * </div>
   */
  fn.arc = function(x, y, w, h, start, stop, mode, detail) {
    // this.validate("p5.arc", arguments);
    // p5._validateParameters('arc', arguments);

    // if the current stroke and fill settings wouldn't result in something
    // visible, exit immediately
    if (!this._renderer.states.strokeColor && !this._renderer.states.fillColor) {
      return this;
    }

    if (start === stop) {
      return this;
    }

    start = this._toRadians(start);
    stop = this._toRadians(stop);

    const vals = canvas.modeAdjust(x, y, w, h, this._renderer.states.ellipseMode);
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
   * Draws an ellipse (oval).
   *
   * An ellipse is a round shape defined by the `x`, `y`, `w`, and
   * `h` parameters. `x` and `y` set the location of its center. `w` and
   * `h` set its width and height. See
   * <a href="#/p5/ellipseMode">ellipseMode()</a> for other ways to set
   * its position.
   *
   * If no height is set, the value of width is used for both the width and
   * height. If a negative height or width is specified, the absolute value is
   * taken.
   *
   * The fifth parameter, `detail`, is also optional. It determines how many
   * vertices are used to draw the ellipse in WebGL mode. The default value is
   * 25.
   *
   * @method ellipse
   * @param  {Number} x x-coordinate of the center of the ellipse.
   * @param  {Number} y y-coordinate of the center of the ellipse.
   * @param  {Number} w width of the ellipse.
   * @param  {Number} [h] height of the ellipse.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   ellipse(50, 50, 80, 80);
   *
   *   describe('A white circle on a gray canvas.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   ellipse(50, 50, 80);
   *
   *   describe('A white circle on a gray canvas.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   ellipse(50, 50, 80, 40);
   *
   *   describe('A white ellipse on a gray canvas.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   background(200);
   *
   *   ellipse(0, 0, 80, 40);
   *
   *   describe('A white ellipse on a gray canvas.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   background(200);
   *
   *   // Use 6 vertices.
   *   ellipse(0, 0, 80, 40, 6);
   *
   *   describe('A white hexagon on a gray canvas.');
   * }
   * </code>
   * </div>
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
  fn.ellipse = function(x, y, w, h, detailX) {
    // p5._validateParameters('ellipse', arguments);
    return this._renderEllipse(...arguments);
  };

  /**
   * Draws a circle.
   *
   * A circle is a round shape defined by the `x`, `y`, and `d` parameters.
   * `x` and `y` set the location of its center. `d` sets its width and height (diameter).
   * Every point on the circle's edge is the same distance, `0.5 * d`, from its center.
   * `0.5 * d` (half the diameter) is the circle's radius.
   * See <a href="#/p5/ellipseMode">ellipseMode()</a> for other ways to set its position.
   *
   * @method circle
   * @param  {Number} x  x-coordinate of the center of the circle.
   * @param  {Number} y  y-coordinate of the center of the circle.
   * @param  {Number} d  diameter of the circle.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   circle(50, 50, 25);
   *
   *   describe('A white circle with black outline in the middle of a gray canvas.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   background(200);
   *
   *   circle(0, 0, 25);
   *
   *   describe('A white circle with black outline in the middle of a gray canvas.');
   * }
   * </code>
   * </div>
   */
  fn.circle = function(...args) {
    // p5._validateParameters('circle', args);
    const argss = args.slice( 0, 2);
    argss.push(args[2], args[2]);
    return this._renderEllipse(...argss);
  };

  // internal method for drawing ellipses (without parameter validation)
  fn._renderEllipse = function(x, y, w, h, detailX) {
    // if the current stroke and fill settings wouldn't result in something
    // visible, exit immediately
    if (!this._renderer.states.strokeColor && !this._renderer.states.fillColor) {
      return this;
    }

    // Duplicate 3rd argument if only 3 given.
    if (typeof h === 'undefined') {
      h = w;
    }

    const vals = canvas.modeAdjust(x, y, w, h, this._renderer.states.ellipseMode);
    this._renderer.ellipse([vals.x, vals.y, vals.w, vals.h, detailX]);

    //accessible Outputs
    if (this._accessibleOutputs.grid || this._accessibleOutputs.text) {
      this._accsOutput('ellipse', [vals.x, vals.y, vals.w, vals.h]);
    }

    return this;
  };

  /**
   * Draws a straight line between two points.
   *
   * A line's default width is one pixel. The version of `line()` with four
   * parameters draws the line in 2D. To color a line, use the
   * <a href="#/p5/stroke">stroke()</a> function. To change its width, use the
   * <a href="#/p5/strokeWeight">strokeWeight()</a> function. A line
   * can't be filled, so the <a href="#/p5/fill">fill()</a> function won't
   * affect the line's color.
   *
   * The version of `line()` with six parameters allows the line to be drawn in
   * 3D space. Doing so requires adding the `WEBGL` argument to
   * <a href="#/p5/createCanvas">createCanvas()</a>.
   *
   * @method line
   * @param  {Number} x1 the x-coordinate of the first point.
   * @param  {Number} y1 the y-coordinate of the first point.
   * @param  {Number} x2 the x-coordinate of the second point.
   * @param  {Number} y2 the y-coordinate of the second point.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   line(30, 20, 85, 75);
   *
   *   describe(
   *     'A black line on a gray canvas running from top-center to bottom-right.'
   *   );
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Style the line.
   *   stroke('magenta');
   *   strokeWeight(5);
   *
   *   line(30, 20, 85, 75);
   *
   *   describe(
   *     'A thick, magenta line on a gray canvas running from top-center to bottom-right.'
   *   );
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
   *   // Top.
   *   line(30, 20, 85, 20);
   *
   *   // Right.
   *   stroke(126);
   *   line(85, 20, 85, 75);
   *
   *   // Bottom.
   *   stroke(255);
   *   line(85, 75, 30, 75);
   *
   *   describe(
   *     'Three lines drawn in grayscale on a gray canvas. They form the top, right, and bottom sides of a square.'
   *   );
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   background(200);
   *
   *   line(-20, -30, 35, 25);
   *
   *   describe(
   *     'A black line on a gray canvas running from top-center to bottom-right.'
   *   );
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A black line connecting two spheres. The scene spins slowly.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Rotate around the y-axis.
   *   rotateY(frameCount * 0.01);
   *
   *   // Draw a line.
   *   line(0, 0, 0, 30, 20, -10);
   *
   *   // Draw the center sphere.
   *   sphere(10);
   *
   *   // Translate to the second point.
   *   translate(30, 20, -10);
   *
   *   // Draw the bottom-right sphere.
   *   sphere(10);
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
  fn.line = function(...args) {
    // p5._validateParameters('line', args);

    if (this._renderer.states.strokeColor) {
      this._renderer.line(...args);
    }

    //accessible Outputs
    if (this._accessibleOutputs.grid || this._accessibleOutputs.text) {
      this._accsOutput('line', args);
    }

    return this;
  };

  /**
   * Draws a single point in space.
   *
   * A point's default width is one pixel. To color a point, use the
   * <a href="#/p5/stroke">stroke()</a> function. To change its width, use the
   * <a href="#/p5/strokeWeight">strokeWeight()</a> function. A point
   * can't be filled, so the <a href="#/p5/fill">fill()</a> function won't
   * affect the point's color.
   *
   * The version of `point()` with two parameters allows the point's location to
   * be set with its x- and y-coordinates, as in `point(10, 20)`.
   *
   * The version of `point()` with three parameters allows the point to be drawn
   * in 3D space with x-, y-, and z-coordinates, as in `point(10, 20, 30)`.
   * Doing so requires adding the `WEBGL` argument to
   * <a href="#/p5/createCanvas">createCanvas()</a>.
   *
   * The version of `point()` with one parameter allows the point's location to
   * be set with a <a href="#/p5/p5.Vector">p5.Vector</a> object.
   *
   * @method point
   * @param  {Number} x the x-coordinate.
   * @param  {Number} y the y-coordinate.
   * @param  {Number} [z] the z-coordinate (for WebGL mode).
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Top-left.
   *   point(30, 20);
   *
   *   // Top-right.
   *   point(85, 20);
   *
   *   // Bottom-right.
   *   point(85, 75);
   *
   *   // Bottom-left.
   *   point(30, 75);
   *
   *   describe(
   *     'Four small, black points drawn on a gray canvas. The points form the corners of a square.'
   *   );
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
   *   // Top-left.
   *   point(30, 20);
   *
   *   // Top-right.
   *   point(70, 20);
   *
   *   // Style the next points.
   *   stroke('purple');
   *   strokeWeight(10);
   *
   *   // Bottom-right.
   *   point(70, 80);
   *
   *   // Bottom-left.
   *   point(30, 80);
   *
   *   describe(
   *     'Four points drawn on a gray canvas. Two are black and two are purple. The points form the corners of a square.'
   *   );
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
   *   // Top-left.
   *   let a = createVector(30, 20);
   *   point(a);
   *
   *   // Top-right.
   *   let b = createVector(70, 20);
   *   point(b);
   *
   *   // Bottom-right.
   *   let c = createVector(70, 80);
   *   point(c);
   *
   *   // Bottom-left.
   *   let d = createVector(30, 80);
   *   point(d);
   *
   *   describe(
   *     'Four small, black points drawn on a gray canvas. The points form the corners of a square.'
   *   );
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('Two purple points drawn on a gray canvas.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the points.
   *   stroke('purple');
   *   strokeWeight(10);
   *
   *   // Top-left.
   *   point(-20, -30);
   *
   *   // Bottom-right.
   *   point(20, 30);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('Two purple points drawn on a gray canvas. The scene spins slowly.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Rotate around the y-axis.
   *   rotateY(frameCount * 0.01);
   *
   *   // Style the points.
   *   stroke('purple');
   *   strokeWeight(10);
   *
   *   // Top-left.
   *   point(-20, -30, 0);
   *
   *   // Bottom-right.
   *   point(20, 30, -50);
   * }
   * </code>
   * </div>
   */

  /**
   * @method point
   * @param {p5.Vector} coordinateVector the coordinate vector.
   * @chainable
   */
  fn.point = function(...args) {
    // p5._validateParameters('point', args);

    if (this._renderer.states.strokeColor) {
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
   * Draws a quadrilateral (four-sided shape).
   *
   * Quadrilaterals include rectangles, squares, rhombuses, and trapezoids. The
   * first pair of parameters `(x1, y1)` sets the quad's first point. The next
   * three pairs of parameters set the coordinates for its next three points
   * `(x2, y2)`, `(x3, y3)`, and `(x4, y4)`. Points should be added in either
   * clockwise or counter-clockwise order.
   *
   * The version of `quad()` with twelve parameters allows the quad to be drawn
   * in 3D space. Doing so requires adding the `WEBGL` argument to
   * <a href="#/p5/createCanvas">createCanvas()</a>.
   *
   * The thirteenth and fourteenth parameters are optional. In WebGL mode, they
   * set the number of segments used to draw the quadrilateral in the x- and
   * y-directions. They're both 2 by default.
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
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   quad(20, 20, 80, 20, 80, 80, 20, 80);
   *
   *   describe('A white square with a black outline drawn on a gray canvas.');
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
   *   quad(20, 30, 80, 30, 80, 70, 20, 70);
   *
   *   describe('A white rectangle with a black outline drawn on a gray canvas.');
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
   *   quad(50, 62, 86, 50, 50, 38, 14, 50);
   *
   *   describe('A white rhombus with a black outline drawn on a gray canvas.');
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
   *   quad(20, 50, 80, 30, 80, 70, 20, 70);
   *
   *   describe('A white trapezoid with a black outline drawn on a gray canvas.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   background(200);
   *
   *   quad(-30, -30, 30, -30, 30, 30, -30, 30);
   *
   *   describe('A white square with a black outline drawn on a gray canvas.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A wavy white surface spins around on gray canvas.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Rotate around the y-axis.
   *   rotateY(frameCount * 0.01);
   *
   *   // Draw the quad.
   *   quad(-30, -30, 0, 30, -30, 0, 30, 30, 20, -30, 30, -20);
   * }
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
  fn.quad = function(...args) {
    // p5._validateParameters('quad', args);

    if (this._renderer.states.strokeColor || this._renderer.states.fillColor) {
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
   * Draws a rectangle.
   *
   * A rectangle is a four-sided shape defined by the `x`, `y`, `w`, and `h`
   * parameters. `x` and `y` set the location of its top-left corner. `w` sets
   * its width and `h` sets its height. Every angle in the rectangle measures
   * 90˚. See <a href="#/p5/rectMode">rectMode()</a> for other ways to define
   * rectangles.
   *
   * The version of `rect()` with five parameters creates a rounded rectangle. The
   * fifth parameter sets the radius for all four corners.
   *
   * The version of `rect()` with eight parameters also creates a rounded
   * rectangle. Each of the last four parameters set the radius of a corner. The
   * radii start with the top-left corner and move clockwise around the
   * rectangle. If any of these parameters are omitted, they are set to the
   * value of the last radius that was set.
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
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   rect(30, 20, 55, 55);
   *
   *   describe('A white square with a black outline on a gray canvas.');
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
   *   rect(30, 20, 55, 40);
   *
   *   describe('A white rectangle with a black outline on a gray canvas.');
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
   *   // Give all corners a radius of 20.
   *   rect(30, 20, 55, 50, 20);
   *
   *   describe('A white rectangle with a black outline and round edges on a gray canvas.');
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
   *   // Give each corner a unique radius.
   *   rect(30, 20, 55, 50, 20, 15, 10, 5);
   *
   *   describe('A white rectangle with a black outline and round edges of different radii.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   background(200);
   *
   *   rect(-20, -30, 55, 55);
   *
   *   describe('A white square with a black outline on a gray canvas.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A white square spins around on gray canvas.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Rotate around the y-axis.
   *   rotateY(frameCount * 0.01);
   *
   *   // Draw the rectangle.
   *   rect(-20, -30, 55, 55);
   * }
   * </code>
   * </div>
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
  fn.rect = function(...args) {
    // p5._validateParameters('rect', args);
    return this._renderRect(...args);
  };

  /**
   * Draws a square.
   *
   * A square is a four-sided shape defined by the `x`, `y`, and `s`
   * parameters. `x` and `y` set the location of its top-left corner. `s` sets
   * its width and height. Every angle in the square measures 90˚ and all its
   * sides are the same length. See <a href="#/p5/rectMode">rectMode()</a> for
   * other ways to define squares.
   *
   * The version of `square()` with four parameters creates a rounded square.
   * The fourth parameter sets the radius for all four corners.
   *
   * The version of `square()` with seven parameters also creates a rounded
   * square. Each of the last four parameters set the radius of a corner. The
   * radii start with the top-left corner and move clockwise around the
   * square. If any of these parameters are omitted, they are set to the
   * value of the last radius that was set.
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
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   square(30, 20, 55);
   *
   *   describe('A white square with a black outline in on a gray canvas.');
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
   *   // Give all corners a radius of 20.
   *   square(30, 20, 55, 20);
   *
   *   describe(
   *     'A white square with a black outline and round edges on a gray canvas.'
   *   );
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
   *   // Give each corner a unique radius.
   *   square(30, 20, 55, 20, 15, 10, 5);
   *
   *   describe('A white square with a black outline and round edges of different radii.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   background(200);
   *
   *   square(-20, -30, 55);
   *
   *   describe('A white square with a black outline in on a gray canvas.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A white square spins around on gray canvas.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Rotate around the y-axis.
   *   rotateY(frameCount * 0.01);
   *
   *   // Draw the square.
   *   square(-20, -30, 55);
   * }
   * </code>
   * </div>
   */
  fn.square = function(x, y, s, tl, tr, br, bl) {
    // p5._validateParameters('square', arguments);
    // duplicate width for height in case of square
    return this._renderRect.call(this, x, y, s, s, tl, tr, br, bl);
  };

  // internal method to have renderer draw a rectangle
  fn._renderRect = function() {
    if (this._renderer.states.strokeColor || this._renderer.states.fillColor) {
      // duplicate width for height in case only 3 arguments is provided
      if (arguments.length === 3) {
        arguments[3] = arguments[2];
      }
      const vals = canvas.modeAdjust(
        arguments[0],
        arguments[1],
        arguments[2],
        arguments[3],
        this._renderer.states.rectMode
      );

      // For the default rectMode (CORNER), restore a possible negative width/height
      // removed by modeAdjust(). This results in flipped/mirrored rendering,
      // which is especially noticable when using WEGBL rendering and texture().
      // Note that this behavior only applies to rect(), NOT to ellipse() and arc().
      if (this._renderer.states.rectMode === constants.CORNER) {
        vals.w = arguments[2];
        vals.h = arguments[3];
      }

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
   * Draws a triangle.
   *
   * A triangle is a three-sided shape defined by three points. The
   * first two parameters specify the triangle's first point `(x1, y1)`. The
   * middle two parameters specify its second point `(x2, y2)`. And the last two
   * parameters specify its third point `(x3, y3)`.
   *
   * @method triangle
   * @param  {Number} x1 x-coordinate of the first point.
   * @param  {Number} y1 y-coordinate of the first point.
   * @param  {Number} x2 x-coordinate of the second point.
   * @param  {Number} y2 y-coordinate of the second point.
   * @param  {Number} x3 x-coordinate of the third point.
   * @param  {Number} y3 y-coordinate of the third point.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   triangle(30, 75, 58, 20, 86, 75);
   *
   *   describe('A white triangle with a black outline on a gray canvas.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   background(200);
   *
   *   triangle(-20, 25, 8, -30, 36, 25);
   *
   *   describe('A white triangle with a black outline on a gray canvas.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A white triangle spins around on a gray canvas.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Rotate around the y-axis.
   *   rotateY(frameCount * 0.01);
   *
   *   // Draw the triangle.
   *   triangle(-20, 25, 8, -30, 36, 25);
   * }
   * </code>
   * </div>
   */
  fn.triangle = function(...args) {
    // p5._validateParameters('triangle', args);

    if (this._renderer.states.strokeColor || this._renderer.states.fillColor) {
      this._renderer.triangle(args);
    }

    //accessible outputs
    if (this._accessibleOutputs.grid || this._accessibleOutputs.text) {
      this._accsOutput('triangle', args);
    }

    return this;
  };
}

export default primitives;

if(typeof p5 !== 'undefined'){
  primitives(p5, p5.prototype);
}
