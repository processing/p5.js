/**
 * @module Shape
 * @submodule Curves
 * @for p5
 * @requires core
 */

function curves(p5, fn){
  /**
   * Draws a Bézier curve.
   *
   * Bézier curves can form shapes and curves that slope gently. They're defined
   * by two anchor points and two control points. Bézier curves provide more
   * control than the spline curves created with the
   * <a href="#/p5/curve">curve()</a> function.
   *
   * The first two parameters, `x1` and `y1`, set the first anchor point. The
   * first anchor point is where the curve starts.
   *
   * The next four parameters, `x2`, `y2`, `x3`, and `y3`, set the two control
   * points. The control points "pull" the curve towards them.
   *
   * The seventh and eighth parameters, `x4` and `y4`, set the last anchor
   * point. The last anchor point is where the curve ends.
   *
   * Bézier curves can also be drawn in 3D using WebGL mode. The 3D version of
   * `bezier()` has twelve arguments because each point has x-, y-,
   * and z-coordinates.
   *
   * @method bezier
   * @param  {Number} x1 x-coordinate of the first anchor point.
   * @param  {Number} y1 y-coordinate of the first anchor point.
   * @param  {Number} x2 x-coordinate of the first control point.
   * @param  {Number} y2 y-coordinate of the first control point.
   * @param  {Number} x3 x-coordinate of the second control point.
   * @param  {Number} y3 y-coordinate of the second control point.
   * @param  {Number} x4 x-coordinate of the second anchor point.
   * @param  {Number} y4 y-coordinate of the second anchor point.
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
   *   // Draw the anchor points in black.
   *   stroke(0);
   *   strokeWeight(5);
   *   point(85, 20);
   *   point(15, 80);
   *
   *   // Draw the control points in red.
   *   stroke(255, 0, 0);
   *   point(10, 10);
   *   point(90, 90);
   *
   *   // Draw a black bezier curve.
   *   noFill();
   *   stroke(0);
   *   strokeWeight(1);
   *   bezier(85, 20, 10, 10, 90, 90, 15, 80);
   *
   *   // Draw red lines from the anchor points to the control points.
   *   stroke(255, 0, 0);
   *   line(85, 20, 10, 10);
   *   line(15, 80, 90, 90);
   *
   *   describe(
   *     'A gray square with three curves. A black s-curve has two straight, red lines that extend from its ends. The endpoints of all the curves are marked with dots.'
   *   );
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click the mouse near the red dot in the top-left corner
   * // and drag to change the curve's shape.
   *
   * let x2 = 10;
   * let y2 = 10;
   * let isChanging = false;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe(
   *     'A gray square with three curves. A black s-curve has two straight, red lines that extend from its ends. The endpoints of all the curves are marked with dots.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Draw the anchor points in black.
   *   stroke(0);
   *   strokeWeight(5);
   *   point(85, 20);
   *   point(15, 80);
   *
   *   // Draw the control points in red.
   *   stroke(255, 0, 0);
   *   point(x2, y2);
   *   point(90, 90);
   *
   *   // Draw a black bezier curve.
   *   noFill();
   *   stroke(0);
   *   strokeWeight(1);
   *   bezier(85, 20, x2, y2, 90, 90, 15, 80);
   *
   *   // Draw red lines from the anchor points to the control points.
   *   stroke(255, 0, 0);
   *   line(85, 20, x2, y2);
   *   line(15, 80, 90, 90);
   * }
   *
   * // Start changing the first control point if the user clicks near it.
   * function mousePressed() {
   *   if (dist(mouseX, mouseY, x2, y2) < 20) {
   *     isChanging = true;
   *   }
   * }
   *
   * // Stop changing the first control point when the user releases the mouse.
   * function mouseReleased() {
   *   isChanging = false;
   * }
   *
   * // Update the first control point while the user drags the mouse.
   * function mouseDragged() {
   *   if (isChanging === true) {
   *     x2 = mouseX;
   *     y2 = mouseY;
   *   }
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background('skyblue');
   *
   *   // Draw the red balloon.
   *   fill('red');
   *   bezier(50, 60, 5, 15, 95, 15, 50, 60);
   *
   *   // Draw the balloon string.
   *   line(50, 60, 50, 80);
   *
   *   describe('A red balloon in a blue sky.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A red balloon in a blue sky. The balloon rotates slowly, revealing that it is flat.');
   * }
   *
   * function draw() {
   *   background('skyblue');
   *
   *   // Rotate around the y-axis.
   *   rotateY(frameCount * 0.01);
   *
   *   // Draw the red balloon.
   *   fill('red');
   *   bezier(0, 0, 0, -45, -45, 0, 45, -45, 0, 0, 0, 0);
   *
   *   // Draw the balloon string.
   *   line(0, 0, 0, 0, 20, 0);
   * }
   * </code>
   * </div>
   */

  /**
   * @method bezier
   * @param  {Number} x1
   * @param  {Number} y1
   * @param  {Number} z1 z-coordinate of the first anchor point.
   * @param  {Number} x2
   * @param  {Number} y2
   * @param  {Number} z2 z-coordinate of the first control point.
   * @param  {Number} x3
   * @param  {Number} y3
   * @param  {Number} z3 z-coordinate of the second control point.
   * @param  {Number} x4
   * @param  {Number} y4
   * @param  {Number} z4 z-coordinate of the second anchor point.
   * @chainable
   */
  fn.bezier = function(...args) {
    // p5._validateParameters('bezier', args);

    // if the current stroke and fill settings wouldn't result in something
    // visible, exit immediately
    if (!this._renderer.states.strokeColor && !this._renderer.states.fillColor) {
      return this;
    }

    this._renderer.bezier(...args);

    return this;
  };

  /**
   * Calculates coordinates along a Bézier curve using interpolation.
   *
   * `bezierPoint()` calculates coordinates along a Bézier curve using the
   * anchor and control points. It expects points in the same order as the
   * <a href="#/p5/bezier">bezier()</a> function. `bezierPoint()` works one axis
   * at a time. Passing the anchor and control points' x-coordinates will
   * calculate the x-coordinate of a point on the curve. Passing the anchor and
   * control points' y-coordinates will calculate the y-coordinate of a point on
   * the curve.
   *
   * The first parameter, `a`, is the coordinate of the first anchor point.
   *
   * The second and third parameters, `b` and `c`, are the coordinates of the
   * control points.
   *
   * The fourth parameter, `d`, is the coordinate of the last anchor point.
   *
   * The fifth parameter, `t`, is the amount to interpolate along the curve. 0
   * is the first anchor point, 1 is the second anchor point, and 0.5 is halfway
   * between them.
   *
   * @method bezierPoint
   * @param {Number} a coordinate of first control point.
   * @param {Number} b coordinate of first anchor point.
   * @param {Number} c coordinate of second anchor point.
   * @param {Number} d coordinate of second control point.
   * @param {Number} t amount to interpolate between 0 and 1.
   * @return {Number} coordinate of the point on the curve.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Set the coordinates for the curve's anchor and control points.
   *   let x1 = 85;
   *   let x2 = 10;
   *   let x3 = 90;
   *   let x4 = 15;
   *   let y1 = 20;
   *   let y2 = 10;
   *   let y3 = 90;
   *   let y4 = 80;
   *
   *   // Style the curve.
   *   noFill();
   *
   *   // Draw the curve.
   *   bezier(x1, y1, x2, y2, x3, y3, x4, y4);
   *
   *   // Draw circles along the curve's path.
   *   fill(255);
   *
   *   // Top-right.
   *   let x = bezierPoint(x1, x2, x3, x4, 0);
   *   let y = bezierPoint(y1, y2, y3, y4, 0);
   *   circle(x, y, 5);
   *
   *   // Center.
   *   x = bezierPoint(x1, x2, x3, x4, 0.5);
   *   y = bezierPoint(y1, y2, y3, y4, 0.5);
   *   circle(x, y, 5);
   *
   *   // Bottom-left.
   *   x = bezierPoint(x1, x2, x3, x4, 1);
   *   y = bezierPoint(y1, y2, y3, y4, 1);
   *   circle(x, y, 5);
   *
   *   describe('A black s-curve on a gray square. The endpoints and center of the curve are marked with white circles.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe('A black s-curve on a gray square. A white circle moves back and forth along the curve.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Set the coordinates for the curve's anchor and control points.
   *   let x1 = 85;
   *   let x2 = 10;
   *   let x3 = 90;
   *   let x4 = 15;
   *   let y1 = 20;
   *   let y2 = 10;
   *   let y3 = 90;
   *   let y4 = 80;
   *
   *   // Draw the curve.
   *   noFill();
   *   bezier(x1, y1, x2, y2, x3, y3, x4, y4);
   *
   *   // Calculate the circle's coordinates.
   *   let t = 0.5 * sin(frameCount * 0.01) + 0.5;
   *   let x = bezierPoint(x1, x2, x3, x4, t);
   *   let y = bezierPoint(y1, y2, y3, y4, t);
   *
   *   // Draw the circle.
   *   fill(255);
   *   circle(x, y, 5);
   * }
   * </code>
   * </div>
   */
  fn.bezierPoint = function(a, b, c, d, t) {
    // p5._validateParameters('bezierPoint', arguments);

    const adjustedT = 1 - t;
    return (
      Math.pow(adjustedT, 3) * a +
      3 * Math.pow(adjustedT, 2) * t * b +
      3 * adjustedT * Math.pow(t, 2) * c +
      Math.pow(t, 3) * d
    );
  };

  /**
   * Calculates coordinates along a line that's tangent to a Bézier curve.
   *
   * Tangent lines skim the surface of a curve. A tangent line's slope equals
   * the curve's slope at the point where it intersects.
   *
   * `bezierTangent()` calculates coordinates along a tangent line using the
   * Bézier curve's anchor and control points. It expects points in the same
   * order as the <a href="#/p5/bezier">bezier()</a> function. `bezierTangent()`
   * works one axis at a time. Passing the anchor and control points'
   * x-coordinates will calculate the x-coordinate of a point on the tangent
   * line. Passing the anchor and control points' y-coordinates will calculate
   * the y-coordinate of a point on the tangent line.
   *
   * The first parameter, `a`, is the coordinate of the first anchor point.
   *
   * The second and third parameters, `b` and `c`, are the coordinates of the
   * control points.
   *
   * The fourth parameter, `d`, is the coordinate of the last anchor point.
   *
   * The fifth parameter, `t`, is the amount to interpolate along the curve. 0
   * is the first anchor point, 1 is the second anchor point, and 0.5 is halfway
   * between them.
   *
   * @method bezierTangent
   * @param {Number} a coordinate of first anchor point.
   * @param {Number} b coordinate of first control point.
   * @param {Number} c coordinate of second control point.
   * @param {Number} d coordinate of second anchor point.
   * @param {Number} t amount to interpolate between 0 and 1.
   * @return {Number} coordinate of a point on the tangent line.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Set the coordinates for the curve's anchor and control points.
   *   let x1 = 85;
   *   let x2 = 10;
   *   let x3 = 90;
   *   let x4 = 15;
   *   let y1 = 20;
   *   let y2 = 10;
   *   let y3 = 90;
   *   let y4 = 80;
   *
   *   // Style the curve.
   *   noFill();
   *
   *   // Draw the curve.
   *   bezier(x1, y1, x2, y2, x3, y3, x4, y4);
   *
   *   // Draw tangents along the curve's path.
   *   fill(255);
   *
   *   // Top-right circle.
   *   stroke(0);
   *   let x = bezierPoint(x1, x2, x3, x4, 0);
   *   let y = bezierPoint(y1, y2, y3, y4, 0);
   *   circle(x, y, 5);
   *
   *   // Top-right tangent line.
   *   // Scale the tangent point to draw a shorter line.
   *   stroke(255, 0, 0);
   *   let tx = 0.1 * bezierTangent(x1, x2, x3, x4, 0);
   *   let ty = 0.1 * bezierTangent(y1, y2, y3, y4, 0);
   *   line(x + tx, y + ty, x - tx, y - ty);
   *
   *   // Center circle.
   *   stroke(0);
   *   x = bezierPoint(x1, x2, x3, x4, 0.5);
   *   y = bezierPoint(y1, y2, y3, y4, 0.5);
   *   circle(x, y, 5);
   *
   *   // Center tangent line.
   *   // Scale the tangent point to draw a shorter line.
   *   stroke(255, 0, 0);
   *   tx = 0.1 * bezierTangent(x1, x2, x3, x4, 0.5);
   *   ty = 0.1 * bezierTangent(y1, y2, y3, y4, 0.5);
   *   line(x + tx, y + ty, x - tx, y - ty);
   *
   *   // Bottom-left circle.
   *   stroke(0);
   *   x = bezierPoint(x1, x2, x3, x4, 1);
   *   y = bezierPoint(y1, y2, y3, y4, 1);
   *   circle(x, y, 5);
   *
   *   // Bottom-left tangent.
   *   // Scale the tangent point to draw a shorter line.
   *   stroke(255, 0, 0);
   *   tx = 0.1 * bezierTangent(x1, x2, x3, x4, 1);
   *   ty = 0.1 * bezierTangent(y1, y2, y3, y4, 1);
   *   line(x + tx, y + ty, x - tx, y - ty);
   *
   *   describe(
   *     'A black s-curve on a gray square. The endpoints and center of the curve are marked with white circles. Red tangent lines extend from the white circles.'
   *   );
   * }
   * </code>
   * </div>
   */
  fn.bezierTangent = function(a, b, c, d, t) {
    // p5._validateParameters('bezierTangent', arguments);

    const adjustedT = 1 - t;
    return (
      3 * d * Math.pow(t, 2) -
      3 * c * Math.pow(t, 2) +
      6 * c * adjustedT * t -
      6 * b * adjustedT * t +
      3 * b * Math.pow(adjustedT, 2) -
      3 * a * Math.pow(adjustedT, 2)
    );
  };

  /**
   * Draws a curve using a Catmull-Rom spline.
   *
   * Spline curves can form shapes and curves that slope gently. They’re like
   * cables that are attached to a set of points. Splines are defined by two
   * anchor points and two control points.
   *
   * The first two parameters, `x1` and `y1`, set the first control point. This
   * point isn’t drawn and can be thought of as the curve’s starting point.
   *
   * The next four parameters, `x2`, `y2`, `x3`, and `y3`, set the two anchor
   * points. The anchor points are the start and end points of the curve’s
   * visible segment.
   *
   * The seventh and eighth parameters, `x4` and `y4`, set the last control
   * point. This point isn’t drawn and can be thought of as the curve’s ending
   * point.
   *
   * Spline curves can also be drawn in 3D using WebGL mode. The 3D version of
   * `spline()` has twelve arguments because each point has x-, y-, and
   * z-coordinates.
   *
   * @method spline
   * @param  {Number} x1 x-coordinate of the first control point.
   * @param  {Number} y1 y-coordinate of the first control point.
   * @param  {Number} x2 x-coordinate of the first anchor point.
   * @param  {Number} y2 y-coordinate of the first anchor point.
   * @param  {Number} x3 x-coordinate of the second anchor point.
   * @param  {Number} y3 y-coordinate of the second anchor point.
   * @param  {Number} x4 x-coordinate of the second control point.
   * @param  {Number} y4 y-coordinate of the second control point.
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
   *   // Draw a black spline curve.
   *   noFill();
   *   strokeWeight(1);
   *   stroke(0);
   *   spline(5, 26, 73, 24, 73, 61, 15, 65);
   *
   *   // Draw red spline curves from the anchor points to the control points.
   *   stroke(255, 0, 0);
   *   spline(5, 26, 5, 26, 73, 24, 73, 61);
   *   spline(73, 24, 73, 61, 15, 65, 15, 65);
   *
   *   // Draw the anchor points in black.
   *   strokeWeight(5);
   *   stroke(0);
   *   point(73, 24);
   *   point(73, 61);
   *
   *   // Draw the control points in red.
   *   stroke(255, 0, 0);
   *   point(5, 26);
   *   point(15, 65);
   *
   *   describe(
   *     'A gray square with a curve drawn in three segments. The curve is a sideways U shape with red segments on top and bottom, and a black segment on the right. The endpoints of all the segments are marked with dots.'
   *   );
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let x1 = 5;
   * let y1 = 26;
   * let isChanging = false;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe(
   *     'A gray square with a curve drawn in three segments. The curve is a sideways U shape with red segments on top and bottom, and a black segment on the right. The endpoints of all the segments are marked with dots.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Draw a black spline curve.
   *   noFill();
   *   strokeWeight(1);
   *   stroke(0);
   *   spline(x1, y1, 73, 24, 73, 61, 15, 65);
   *
   *   // Draw red spline curves from the anchor points to the control points.
   *   stroke(255, 0, 0);
   *   spline(x1, y1, x1, y1, 73, 24, 73, 61);
   *   spline(73, 24, 73, 61, 15, 65, 15, 65);
   *
   *   // Draw the anchor points in black.
   *   strokeWeight(5);
   *   stroke(0);
   *   point(73, 24);
   *   point(73, 61);
   *
   *   // Draw the control points in red.
   *   stroke(255, 0, 0);
   *   point(x1, y1);
   *   point(15, 65);
   * }
   *
   * // Start changing the first control point if the user clicks near it.
   * function mousePressed() {
   *   if (dist(mouseX, mouseY, x1, y1) < 20) {
   *     isChanging = true;
   *   }
   * }
   *
   * // Stop changing the first control point when the user releases the mouse.
   * function mouseReleased() {
   *   isChanging = false;
   * }
   *
   * // Update the first control point while the user drags the mouse.
   * function mouseDragged() {
   *   if (isChanging === true) {
   *     x1 = mouseX;
   *     y1 = mouseY;
   *   }
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background('skyblue');
   *
   *   // Draw the red balloon.
   *   fill('red');
   *   spline(-150, 275, 50, 60, 50, 60, 250, 275);
   *
   *   // Draw the balloon string.
   *   line(50, 60, 50, 80);
   *
   *   describe('A red balloon in a blue sky.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A red balloon in a blue sky.');
   * }
   *
   * function draw() {
   *   background('skyblue');
   *
   *   // Rotate around the y-axis.
   *   rotateY(frameCount * 0.01);
   *
   *   // Draw the red balloon.
   *   fill('red');
   *   spline(-200, 225, 0, 0, 10, 0, 0, 10, 0, 200, 225, 0);
   *
   *   // Draw the balloon string.
   *   line(0, 10, 0, 0, 30, 0);
   * }
   * </code>
   * </div>
   */

  /**
   * @method spline
   * @param  {Number} x1
   * @param  {Number} y1
   * @param  {Number} z1 z-coordinate of the first control point.
   * @param  {Number} x2
   * @param  {Number} y2
   * @param  {Number} z2 z-coordinate of the first anchor point.
   * @param  {Number} x3
   * @param  {Number} y3
   * @param  {Number} z3 z-coordinate of the second anchor point.
   * @param  {Number} x4
   * @param  {Number} y4
   * @param  {Number} z4 z-coordinate of the second control point.
   * @chainable
   */
  fn.spline = function(...args) {
    if (!this._renderer.states.strokeColor && !this._renderer.states.fillColor) {
      return this;
    }
    this._renderer.spline(...args);

    return this;
  };

  /**
   * Calculates coordinates along a spline curve using interpolation.
   *
   * `splinePoint()` calculates coordinates along a spline curve using the
   * anchor and control points. It expects points in the same order as the
   * <a href="#/p5/spline">spline()</a> function. `splinePoint()` works one axis
   * at a time. Passing the anchor and control points' x-coordinates will
   * calculate the x-coordinate of a point on the curve. Passing the anchor and
   * control points' y-coordinates will calculate the y-coordinate of a point on
   * the curve.
   *
   * The first parameter, `a`, is the coordinate of the first control point.
   *
   * The second and third parameters, `b` and `c`, are the coordinates of the
   * anchor points.
   *
   * The fourth parameter, `d`, is the coordinate of the last control point.
   *
   * The fifth parameter, `t`, is the amount to interpolate along the curve. 0
   * is the first anchor point, 1 is the second anchor point, and 0.5 is halfway
   * between them.
   *
   * @method splinePoint
   * @param {Number} a coordinate of first anchor point.
   * @param {Number} b coordinate of first control point.
   * @param {Number} c coordinate of second control point.
   * @param {Number} d coordinate of second anchor point.
   * @param {Number} t amount to interpolate between 0 and 1.
   * @return {Number} coordinate of a point on the curve.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Set the coordinates for the curve's anchor and control points.
   *   let x1 = 5;
   *   let y1 = 26;
   *   let x2 = 73;
   *   let y2 = 24;
   *   let x3 = 73;
   *   let y3 = 61;
   *   let x4 = 15;
   *   let y4 = 65;
   *
   *   // Draw the curve.
   *   noFill();
   *   spline(x1, y1, x2, y2, x3, y3, x4, y4);
   *
   *   // Draw circles along the curve's path.
   *   fill(255);
   *
   *   // Top.
   *   let x = splinePoint(x1, x2, x3, x4, 0);
   *   let y = splinePoint(y1, y2, y3, y4, 0);
   *   circle(x, y, 5);
   *
   *   // Center.
   *   x = splinePoint(x1, x2, x3, x4, 0.5);
   *   y = splinePoint(y1, y2, y3, y4, 0.5);
   *   circle(x, y, 5);
   *
   *   // Bottom.
   *   x = splinePoint(x1, x2, x3, x4, 1);
   *   y = splinePoint(y1, y2, y3, y4, 1);
   *   circle(x, y, 5);
   *
   *   describe('A black curve on a gray square. The endpoints and center of the curve are marked with white circles.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe('A black curve on a gray square. A white circle moves back and forth along the curve.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Set the coordinates for the curve's anchor and control points.
   *   let x1 = 5;
   *   let y1 = 26;
   *   let x2 = 73;
   *   let y2 = 24;
   *   let x3 = 73;
   *   let y3 = 61;
   *   let x4 = 15;
   *   let y4 = 65;
   *
   *   // Draw the curve.
   *   noFill();
   *   spline(x1, y1, x2, y2, x3, y3, x4, y4);
   *
   *   // Calculate the circle's coordinates.
   *   let t = 0.5 * sin(frameCount * 0.01) + 0.5;
   *   let x = splinePoint(x1, x2, x3, x4, t);
   *   let y = splinePoint(y1, y2, y3, y4, t);
   *
   *   // Draw the circle.
   *   fill(255);
   *   circle(x, y, 5);
   * }
   * </code>
   * </div>
   */
  fn.splinePoint = function(a, b, c, d, t) {
    const s = this._renderer.states.splineProperties.tightness,
      t3 = t * t * t,
      t2 = t * t,
      f1 = (s - 1) / 2 * t3 + (1 - s) * t2 + (s - 1) / 2 * t,
      f2 = (s + 3) / 2 * t3 + (-5 - s) / 2 * t2 + 1.0,
      f3 = (-3 - s) / 2 * t3 + (s + 2) * t2 + (1 - s) / 2 * t,
      f4 = (1 - s) / 2 * t3 + (s - 1) / 2 * t2;
    return a * f1 + b * f2 + c * f3 + d * f4;
  };

  /**
   * Calculates coordinates along a line that's tangent to a spline curve.
   *
   * Tangent lines skim the surface of a curve. A tangent line's slope equals
   * the curve's slope at the point where it intersects.
   *
   * `splineTangent()` calculates coordinates along a tangent line using the
   * spline curve's anchor and control points. It expects points in the same
   * order as the <a href="#/p5/spline">spline()</a> function. `splineTangent()`
   * works one axis at a time. Passing the anchor and control points'
   * x-coordinates will calculate the x-coordinate of a point on the tangent
   * line. Passing the anchor and control points' y-coordinates will calculate
   * the y-coordinate of a point on the tangent line.
   *
   * The first parameter, `a`, is the coordinate of the first control point.
   *
   * The second and third parameters, `b` and `c`, are the coordinates of the
   * anchor points.
   *
   * The fourth parameter, `d`, is the coordinate of the last control point.
   *
   * The fifth parameter, `t`, is the amount to interpolate along the curve. 0
   * is the first anchor point, 1 is the second anchor point, and 0.5 is halfway
   * between them.
   *
   * @method splineTangent
   * @param {Number} a coordinate of first control point.
   * @param {Number} b coordinate of first anchor point.
   * @param {Number} c coordinate of second anchor point.
   * @param {Number} d coordinate of second control point.
   * @param {Number} t amount to interpolate between 0 and 1.
   * @return {Number} coordinate of a point on the tangent line.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Set the coordinates for the curve's anchor and control points.
   *   let x1 = 5;
   *   let y1 = 26;
   *   let x2 = 73;
   *   let y2 = 24;
   *   let x3 = 73;
   *   let y3 = 61;
   *   let x4 = 15;
   *   let y4 = 65;
   *
   *   // Draw the curve.
   *   noFill();
   *   spline(x1, y1, x2, y2, x3, y3, x4, y4);
   *
   *   // Draw tangents along the curve's path.
   *   fill(255);
   *
   *   // Top circle.
   *   stroke(0);
   *   let x = splinePoint(x1, x2, x3, x4, 0);
   *   let y = splinePoint(y1, y2, y3, y4, 0);
   *   circle(x, y, 5);
   *
   *   // Top tangent line.
   *   // Scale the tangent point to draw a shorter line.
   *   stroke(255, 0, 0);
   *   let tx = 0.2 * splineTangent(x1, x2, x3, x4, 0);
   *   let ty = 0.2 * splineTangent(y1, y2, y3, y4, 0);
   *   line(x + tx, y + ty, x - tx, y - ty);
   *
   *   // Center circle.
   *   stroke(0);
   *   x = splinePoint(x1, x2, x3, x4, 0.5);
   *   y = splinePoint(y1, y2, y3, y4, 0.5);
   *   circle(x, y, 5);
   *
   *   // Center tangent line.
   *   // Scale the tangent point to draw a shorter line.
   *   stroke(255, 0, 0);
   *   tx = 0.2 * splineTangent(x1, x2, x3, x4, 0.5);
   *   ty = 0.2 * splineTangent(y1, y2, y3, y4, 0.5);
   *   line(x + tx, y + ty, x - tx, y - ty);
   *
   *   // Bottom circle.
   *   stroke(0);
   *   x = splinePoint(x1, x2, x3, x4, 1);
   *   y = splinePoint(y1, y2, y3, y4, 1);
   *   circle(x, y, 5);
   *
   *   // Bottom tangent line.
   *   // Scale the tangent point to draw a shorter line.
   *   stroke(255, 0, 0);
   *   tx = 0.2 * splineTangent(x1, x2, x3, x4, 1);
   *   ty = 0.2 * splineTangent(y1, y2, y3, y4, 1);
   *   line(x + tx, y + ty, x - tx, y - ty);
   *
   *   describe(
   *     'A black curve on a gray square. A white circle moves back and forth along the curve.'
   *   );
   * }
   * </code>
   * </div>
   */
  fn.splineTangent = function(a, b, c, d, t) {
    const s = this._renderer.states.splineProperties.tightness,
      tt3 = t * t * 3,
      t2 = t * 2,
      f1 = (s - 1) / 2 * tt3 + (1 - s) * t2 + (s - 1) / 2,
      f2 = (s + 3) / 2 * tt3 + (-5 - s) / 2 * t2,
      f3 = (-3 - s) / 2 * tt3 + (s + 2) * t2 + (1 - s) / 2,
      f4 = (1 - s) / 2 * tt3 + (s - 1) / 2 * t2;
    return a * f1 + b * f2 + c * f3 + d * f4;
  };
}

export default curves;

if(typeof p5 !== 'undefined'){
  curves(p5, p5.prototype);
}
