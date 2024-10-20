/**
 * @module Shape
 * @submodule Vertex
 * @for p5
 * @requires core
 * @requires constants
 */

import p5 from '../main';
import * as constants from '../constants';
let shapeKind = null;
let vertices = [];
let contourVertices = [];
let isBezier = false;
let isCurve = false;
let isQuadratic = false;
let isContour = false;
let isFirstContour = true;

/**
 * Begins creating a hole within a flat shape.
 *
 * The `beginContour()` and <a href="#/p5/endContour">endContour()</a>
 * functions allow for creating negative space within custom shapes that are
 * flat. `beginContour()` begins adding vertices to a negative space and
 * <a href="#/p5/endContour">endContour()</a> stops adding them.
 * `beginContour()` and <a href="#/p5/endContour">endContour()</a> must be
 * called between <a href="#/p5/beginShape">beginShape()</a> and
 * <a href="#/p5/endShape">endShape()</a>.
 *
 * Transformations such as <a href="#/p5/translate">translate()</a>,
 * <a href="#/p5/rotate">rotate()</a>, and <a href="#/p5/scale">scale()</a>
 * don't work between `beginContour()` and
 * <a href="#/p5/endContour">endContour()</a>. It's also not possible to use
 * other shapes, such as <a href="#/p5/ellipse">ellipse()</a> or
 * <a href="#/p5/rect">rect()</a>, between `beginContour()` and
 * <a href="#/p5/endContour">endContour()</a>.
 *
 * Note: The vertices that define a negative space must "wind" in the opposite
 * direction from the outer shape. First, draw vertices for the outer shape
 * clockwise order. Then, draw vertices for the negative space in
 * counter-clockwise order.
 *
 * @method beginContour
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
 *   // Start drawing the shape.
 *   beginShape();
 *
 *   // Exterior vertices, clockwise winding.
 *   vertex(10, 10);
 *   vertex(90, 10);
 *   vertex(90, 90);
 *   vertex(10, 90);
 *
 *   // Interior vertices, counter-clockwise winding.
 *   beginContour();
 *   vertex(30, 30);
 *   vertex(30, 70);
 *   vertex(70, 70);
 *   vertex(70, 30);
 *   endContour();
 *
 *   // Stop drawing the shape.
 *   endShape(CLOSE);
 *
 *   describe('A white square with a square hole in its center drawn on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Click and drag the mouse to view the scene from different angles.
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe('A white square with a square hole in its center drawn on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Start drawing the shape.
 *   beginShape();
 *
 *   // Exterior vertices, clockwise winding.
 *   vertex(-40, -40);
 *   vertex(40, -40);
 *   vertex(40, 40);
 *   vertex(-40, 40);
 *
 *   // Interior vertices, counter-clockwise winding.
 *   beginContour();
 *   vertex(-20, -20);
 *   vertex(-20, 20);
 *   vertex(20, 20);
 *   vertex(20, -20);
 *   endContour();
 *
 *   // Stop drawing the shape.
 *   endShape(CLOSE);
 * }
 * </code>
 * </div>
 */
p5.prototype.beginContour = function() {
  if (this._renderer.isP3D) {
    this._renderer.beginContour();
  } else {
    contourVertices = [];
    isContour = true;
  }
  return this;
};

/**
 * Begins adding vertices to a custom shape.
 *
 * The `beginShape()` and <a href="#/p5/endShape">endShape()</a> functions
 * allow for creating custom shapes in 2D or 3D. `beginShape()` begins adding
 * vertices to a custom shape and <a href="#/p5/endShape">endShape()</a> stops
 * adding them.
 *
 * The parameter, `kind`, sets the kind of shape to make. By default, any
 * irregular polygon can be drawn. The available modes for kind are:
 *
 * - `POINTS` to draw a series of points.
 * - `LINES` to draw a series of unconnected line segments.
 * - `TRIANGLES` to draw a series of separate triangles.
 * - `TRIANGLE_FAN` to draw a series of connected triangles sharing the first vertex in a fan-like fashion.
 * - `TRIANGLE_STRIP` to draw a series of connected triangles in strip fashion.
 * - `QUADS` to draw a series of separate quadrilaterals (quads).
 * - `QUAD_STRIP` to draw quad strip using adjacent edges to form the next quad.
 * - `TESS` to create a filling curve by explicit tessellation (WebGL only).
 *
 * After calling `beginShape()`, shapes can be built by calling
 * <a href="#/p5/vertex">vertex()</a>,
 * <a href="#/p5/bezierVertex">bezierVertex()</a>,
 * <a href="#/p5/quadraticVertex">quadraticVertex()</a>, and/or
 * <a href="#/p5/curveVertex">curveVertex()</a>. Calling
 * <a href="#/p5/endShape">endShape()</a> will stop adding vertices to the
 * shape. Each shape will be outlined with the current stroke color and filled
 * with the current fill color.
 *
 * Transformations such as <a href="#/p5/translate">translate()</a>,
 * <a href="#/p5/rotate">rotate()</a>, and
 * <a href="#/p5/scale">scale()</a> don't work between `beginShape()` and
 * <a href="#/p5/endShape">endShape()</a>. It's also not possible to use
 * other shapes, such as <a href="#/p5/ellipse">ellipse()</a> or
 * <a href="#/p5/rect">rect()</a>, between `beginShape()` and
 * <a href="#/p5/endShape">endShape()</a>.
 *
 * @method beginShape
 * @param  {Constant} [kind] either POINTS, LINES, TRIANGLES, TRIANGLE_FAN
 *                                TRIANGLE_STRIP, QUADS, QUAD_STRIP or TESS.
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
 *   // Start drawing the shape.
 *   beginShape();
 *
 *   // Add vertices.
 *   vertex(30, 20);
 *   vertex(85, 20);
 *   vertex(85, 75);
 *   vertex(30, 75);
 *
 *   // Stop drawing the shape.
 *   endShape(CLOSE);
 *
 *   describe('A white square on a gray background.');
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
 *   // Start drawing the shape.
 *   // Only draw the vertices (points).
 *   beginShape(POINTS);
 *
 *   // Add vertices.
 *   vertex(30, 20);
 *   vertex(85, 20);
 *   vertex(85, 75);
 *   vertex(30, 75);
 *
 *   // Stop drawing the shape.
 *   endShape();
 *
 *   describe('Four black dots that form a square are drawn on a gray background.');
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
 *   // Start drawing the shape.
 *   // Only draw lines between alternating pairs of vertices.
 *   beginShape(LINES);
 *
 *   // Add vertices.
 *   vertex(30, 20);
 *   vertex(85, 20);
 *   vertex(85, 75);
 *   vertex(30, 75);
 *
 *   // Stop drawing the shape.
 *   endShape();
 *
 *   describe('Two horizontal black lines on a gray background.');
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
 *   // Style the shape.
 *   noFill();
 *
 *   // Start drawing the shape.
 *   beginShape();
 *
 *   // Add vertices.
 *   vertex(30, 20);
 *   vertex(85, 20);
 *   vertex(85, 75);
 *   vertex(30, 75);
 *
 *   // Stop drawing the shape.
 *   endShape();
 *
 *   describe('Three black lines form a sideways U shape on a gray background.');
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
 *   // Style the shape.
 *   noFill();
 *
 *   // Start drawing the shape.
 *   beginShape();
 *
 *   // Add vertices.
 *   vertex(30, 20);
 *   vertex(85, 20);
 *   vertex(85, 75);
 *   vertex(30, 75);
 *
 *   // Stop drawing the shape.
 *   // Connect the first and last vertices.
 *   endShape(CLOSE);
 *
 *   describe('A black outline of a square drawn on a gray background.');
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
 *   // Start drawing the shape.
 *   // Draw a series of triangles.
 *   beginShape(TRIANGLES);
 *
 *   // Left triangle.
 *   vertex(30, 75);
 *   vertex(40, 20);
 *   vertex(50, 75);
 *
 *   // Right triangle.
 *   vertex(60, 20);
 *   vertex(70, 75);
 *   vertex(80, 20);
 *
 *   // Stop drawing the shape.
 *   endShape();
 *
 *   describe('Two white triangles drawn on a gray background.');
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
 *   // Start drawing the shape.
 *   // Draw a series of triangles.
 *   beginShape(TRIANGLE_STRIP);
 *
 *   // Add vertices.
 *   vertex(30, 75);
 *   vertex(40, 20);
 *   vertex(50, 75);
 *   vertex(60, 20);
 *   vertex(70, 75);
 *   vertex(80, 20);
 *   vertex(90, 75);
 *
 *   // Stop drawing the shape.
 *   endShape();
 *
 *   describe('Five white triangles that are interleaved drawn on a gray background.');
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
 *   // Start drawing the shape.
 *   // Draw a series of triangles that share their first vertex.
 *   beginShape(TRIANGLE_FAN);
 *
 *   // Add vertices.
 *   vertex(57.5, 50);
 *   vertex(57.5, 15);
 *   vertex(92, 50);
 *   vertex(57.5, 85);
 *   vertex(22, 50);
 *   vertex(57.5, 15);
 *
 *   // Stop drawing the shape.
 *   endShape();
 *
 *   describe('Four white triangles form a square are drawn on a gray background.');
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
 *   // Start drawing the shape.
 *   // Draw a series of quadrilaterals.
 *   beginShape(QUADS);
 *
 *   // Left rectangle.
 *   vertex(30, 20);
 *   vertex(30, 75);
 *   vertex(50, 75);
 *   vertex(50, 20);
 *
 *   // Right rectangle.
 *   vertex(65, 20);
 *   vertex(65, 75);
 *   vertex(85, 75);
 *   vertex(85, 20);
 *
 *   // Stop drawing the shape.
 *   endShape();
 *
 *   describe('Two white rectangles drawn on a gray background.');
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
 *   // Start drawing the shape.
 *   // Draw a series of quadrilaterals.
 *   beginShape(QUAD_STRIP);
 *
 *   // Add vertices.
 *   vertex(30, 20);
 *   vertex(30, 75);
 *   vertex(50, 20);
 *   vertex(50, 75);
 *   vertex(65, 20);
 *   vertex(65, 75);
 *   vertex(85, 20);
 *   vertex(85, 75);
 *
 *   // Stop drawing the shape.
 *   endShape();
 *
 *   describe('Three white rectangles that share edges are drawn on a gray background.');
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
 *   // Start drawing the shape.
 *   // Draw a series of quadrilaterals.
 *   beginShape(TESS);
 *
 *   // Add the vertices.
 *   vertex(-30, -30, 0);
 *   vertex(30, -30, 0);
 *   vertex(30, -10, 0);
 *   vertex(-10, -10, 0);
 *   vertex(-10, 10, 0);
 *   vertex(30, 10, 0);
 *   vertex(30, 30, 0);
 *   vertex(-30, 30, 0);
 *
 *   // Stop drawing the shape.
 *   // Connect the first and last vertices.
 *   endShape(CLOSE);
 *
 *   describe('A blocky C shape drawn in white on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Click and drag with the mouse to view the scene from different angles.
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe('A blocky C shape drawn in red, blue, and green on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Start drawing the shape.
 *   // Draw a series of quadrilaterals.
 *   beginShape(TESS);
 *
 *   // Add the vertices.
 *   fill('red');
 *   stroke('red');
 *   vertex(-30, -30, 0);
 *   vertex(30, -30, 0);
 *   vertex(30, -10, 0);
 *   fill('green');
 *   stroke('green');
 *   vertex(-10, -10, 0);
 *   vertex(-10, 10, 0);
 *   vertex(30, 10, 0);
 *   fill('blue');
 *   stroke('blue');
 *   vertex(30, 30, 0);
 *   vertex(-30, 30, 0);
 *
 *   // Stop drawing the shape.
 *   // Connect the first and last vertices.
 *   endShape(CLOSE);
 * }
 * </code>
 * </div>
 */
p5.prototype.beginShape = function(kind) {
  p5._validateParameters('beginShape', arguments);
  if (this._renderer.isP3D) {
    this._renderer.beginShape(...arguments);
  } else {
    if (
      kind === constants.POINTS ||
      kind === constants.LINES ||
      kind === constants.TRIANGLES ||
      kind === constants.TRIANGLE_FAN ||
      kind === constants.TRIANGLE_STRIP ||
      kind === constants.QUADS ||
      kind === constants.QUAD_STRIP
    ) {
      shapeKind = kind;
    } else {
      shapeKind = null;
    }

    vertices = [];
    contourVertices = [];
  }
  return this;
};

/**
 * Adds a Bézier curve segment to a custom shape.
 *
 * `bezierVertex()` adds a curved segment to custom shapes. The Bézier curves
 * it creates are defined like those made by the
 * <a href="#/p5/bezier">bezier()</a> function. `bezierVertex()` must be
 * called between the
 * <a href="#/p5/beginShape">beginShape()</a> and
 * <a href="#/p5/endShape">endShape()</a> functions. The curved segment uses
 * the previous vertex as the first anchor point, so there must be at least
 * one call to <a href="#/p5/vertex">vertex()</a> before `bezierVertex()` can
 * be used.
 *
 * The first four parameters, `x2`, `y2`, `x3`, and `y3`, set the curve’s two
 * control points. The control points "pull" the curve towards them.
 *
 * The fifth and sixth parameters, `x4`, and `y4`, set the last anchor point.
 * The last anchor point is where the curve ends.
 *
 * Bézier curves can also be drawn in 3D using WebGL mode. The 3D version of
 * `bezierVertex()` has eight arguments because each point has x-, y-, and
 * z-coordinates.
 *
 * Note: `bezierVertex()` won’t work when an argument is passed to
 * <a href="#/p5/beginShape">beginShape()</a>.
 *
 * @method bezierVertex
 * @param  {Number} x2 x-coordinate of the first control point.
 * @param  {Number} y2 y-coordinate of the first control point.
 * @param  {Number} x3 x-coordinate of the second control point.
 * @param  {Number} y3 y-coordinate of the second control point.
 * @param  {Number} x4 x-coordinate of the anchor point.
 * @param  {Number} y4 y-coordinate of the anchor point.
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
 *   // Style the shape.
 *   noFill();
 *
 *   // Start drawing the shape.
 *   beginShape();
 *
 *   // Add the first anchor point.
 *   vertex(30, 20);
 *
 *   // Add the Bézier vertex.
 *   bezierVertex(80, 0, 80, 75, 30, 75);
 *
 *   // Stop drawing the shape.
 *   endShape();
 *
 *   describe('A black C curve on a gray background.');
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
 *   // Draw the anchor points in black.
 *   stroke(0);
 *   strokeWeight(5);
 *   point(30, 20);
 *   point(30, 75);
 *
 *   // Draw the control points in red.
 *   stroke(255, 0, 0);
 *   point(80, 0);
 *   point(80, 75);
 *
 *   // Style the shape.
 *   noFill();
 *   stroke(0);
 *   strokeWeight(1);
 *
 *   // Start drawing the shape.
 *   beginShape();
 *
 *   // Add the first anchor point.
 *   vertex(30, 20);
 *
 *   // Add the Bézier vertex.
 *   bezierVertex(80, 0, 80, 75, 30, 75);
 *
 *   // Stop drawing the shape.
 *   endShape();
 *
 *   // Draw red lines from the anchor points to the control points.
 *   stroke(255, 0, 0);
 *   line(30, 20, 80, 0);
 *   line(30, 75, 80, 75);
 *
 *   describe(
 *     'A gray square with three curves. A black curve has two straight, red lines that extend from its ends. The endpoints of all the curves are marked with dots.'
 *   );
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Click the mouse near the red dot in the top-right corner
 * // and drag to change the curve's shape.
 *
 * let x2 = 80;
 * let y2 = 0;
 * let isChanging = false;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A gray square with three curves. A black curve has two straight, red lines that extend from its ends. The endpoints of all the curves are marked with dots.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Draw the anchor points in black.
 *   stroke(0);
 *   strokeWeight(5);
 *   point(30, 20);
 *   point(30, 75);
 *
 *   // Draw the control points in red.
 *   stroke(255, 0, 0);
 *   point(x2, y2);
 *   point(80, 75);
 *
 *   // Style the shape.
 *   noFill();
 *   stroke(0);
 *   strokeWeight(1);
 *
 *   // Start drawing the shape.
 *   beginShape();
 *
 *   // Add the first anchor point.
 *   vertex(30, 20);
 *
 *   // Add the Bézier vertex.
 *   bezierVertex(x2, y2, 80, 75, 30, 75);
 *
 *   // Stop drawing the shape.
 *   endShape();
 *
 *   // Draw red lines from the anchor points to the control points.
 *   stroke(255, 0, 0);
 *   line(30, 20, x2, y2);
 *   line(30, 75, 80, 75);
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
 *   background(200);
 *
 *   // Start drawing the shape.
 *   beginShape();
 *
 *   // Add the first anchor point.
 *   vertex(30, 20);
 *
 *   // Add the Bézier vertices.
 *   bezierVertex(80, 0, 80, 75, 30, 75);
 *   bezierVertex(50, 80, 60, 25, 30, 20);
 *
 *   // Stop drawing the shape.
 *   endShape();
 *
 *   describe('A crescent moon shape drawn in white on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Click and drag the mouse to view the scene from different angles.
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe('A crescent moon shape drawn in white on a blue background. When the user drags the mouse, the scene rotates and a second moon is revealed.');
 * }
 *
 * function draw() {
 *   background('midnightblue');
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Style the moons.
 *   noStroke();
 *   fill('lemonchiffon');
 *
 *   // Draw the first moon.
 *   beginShape();
 *   vertex(-20, -30, 0);
 *   bezierVertex(30, -50, 0, 30, 25, 0, -20, 25, 0);
 *   bezierVertex(0, 30, 0, 10, -25, 0, -20, -30, 0);
 *   endShape();
 *
 *   // Draw the second moon.
 *   beginShape();
 *   vertex(-20, -30, -20);
 *   bezierVertex(30, -50, -20, 30, 25, -20, -20, 25, -20);
 *   bezierVertex(0, 30, -20, 10, -25, -20, -20, -30, -20);
 *   endShape();
 * }
 * </code>
 * </div>
 */

/**
 * @method bezierVertex
 * @param  {Number} x2
 * @param  {Number} y2
 * @param  {Number} z2 z-coordinate of the first control point.
 * @param  {Number} x3
 * @param  {Number} y3
 * @param  {Number} z3 z-coordinate of the second control point.
 * @param  {Number} x4
 * @param  {Number} y4
 * @param  {Number} z4 z-coordinate of the anchor point.
 * @chainable
 */
p5.prototype.bezierVertex = function(...args) {
  p5._validateParameters('bezierVertex', args);
  if (this._renderer.isP3D) {
    this._renderer.bezierVertex(...args);
  } else {
    if (vertices.length === 0) {
      p5._friendlyError(
        'vertex() must be used once before calling bezierVertex()',
        'bezierVertex'
      );
    } else {
      isBezier = true;
      const vert = [];
      for (let i = 0; i < args.length; i++) {
        vert[i] = args[i];
      }
      vert.isVert = false;
      if (isContour) {
        contourVertices.push(vert);
      } else {
        vertices.push(vert);
      }
    }
  }
  return this;
};

/**
 * Adds a spline curve segment to a custom shape.
 *
 * `curveVertex()` adds a curved segment to custom shapes. The spline curves
 * it creates are defined like those made by the
 * <a href="#/p5/curve">curve()</a> function. `curveVertex()` must be called
 * between the <a href="#/p5/beginShape">beginShape()</a> and
 * <a href="#/p5/endShape">endShape()</a> functions.
 *
 * Spline curves can form shapes and curves that slope gently. They’re like
 * cables that are attached to a set of points. Splines are defined by two
 * anchor points and two control points. `curveVertex()` must be called at
 * least four times between
 * <a href="#/p5/beginShape">beginShape()</a> and
 * <a href="#/p5/endShape">endShape()</a> in order to draw a curve:
 *
 * ```js
 * beginShape();
 *
 * // Add the first control point.
 * curveVertex(84, 91);
 *
 * // Add the anchor points to draw between.
 * curveVertex(68, 19);
 * curveVertex(21, 17);
 *
 * // Add the second control point.
 * curveVertex(32, 91);
 *
 * endShape();
 * ```
 *
 * The code snippet above would only draw the curve between the anchor points,
 * similar to the <a href="#/p5/curve">curve()</a> function. The segments
 * between the control and anchor points can be drawn by calling
 * `curveVertex()` with the coordinates of the control points:
 *
 * ```js
 * beginShape();
 *
 * // Add the first control point and draw a segment to it.
 * curveVertex(84, 91);
 * curveVertex(84, 91);
 *
 * // Add the anchor points to draw between.
 * curveVertex(68, 19);
 * curveVertex(21, 17);
 *
 * // Add the second control point.
 * curveVertex(32, 91);
 *
 * // Uncomment the next line to draw the segment to the second control point.
 * // curveVertex(32, 91);
 *
 * endShape();
 * ```
 *
 * The first two parameters, `x` and `y`, set the vertex’s location. For
 * example, calling `curveVertex(10, 10)` adds a point to the curve at
 * `(10, 10)`.
 *
 * Spline curves can also be drawn in 3D using WebGL mode. The 3D version of
 * `curveVertex()` has three arguments because each point has x-, y-, and
 * z-coordinates. By default, the vertex’s z-coordinate is set to 0.
 *
 * Note: `curveVertex()` won’t work when an argument is passed to
 * <a href="#/p5/beginShape">beginShape()</a>.
 *
 * @method curveVertex
 * @param {Number} x x-coordinate of the vertex
 * @param {Number} y y-coordinate of the vertex
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
 *   // Style the shape.
 *   noFill();
 *   strokeWeight(1);
 *
 *   // Start drawing the shape.
 *   beginShape();
 *
 *   // Add the first control point.
 *   curveVertex(32, 91);
 *
 *   // Add the anchor points.
 *   curveVertex(21, 17);
 *   curveVertex(68, 19);
 *
 *   // Add the second control point.
 *   curveVertex(84, 91);
 *
 *   // Stop drawing the shape.
 *   endShape();
 *
 *   // Style the anchor and control points.
 *   strokeWeight(5);
 *
 *   // Draw the anchor points in black.
 *   stroke(0);
 *   point(21, 17);
 *   point(68, 19);
 *
 *   // Draw the control points in red.
 *   stroke(255, 0, 0);
 *   point(32, 91);
 *   point(84, 91);
 *
 *   describe(
 *     'A black curve drawn on a gray background. The curve has black dots at its ends. Two red dots appear near the bottom of the canvas.'
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
 *   // Style the shape.
 *   noFill();
 *   strokeWeight(1);
 *
 *   // Start drawing the shape.
 *   beginShape();
 *
 *   // Add the first control point and draw a segment to it.
 *   curveVertex(32, 91);
 *   curveVertex(32, 91);
 *
 *   // Add the anchor points.
 *   curveVertex(21, 17);
 *   curveVertex(68, 19);
 *
 *   // Add the second control point.
 *   curveVertex(84, 91);
 *
 *   // Stop drawing the shape.
 *   endShape();
 *
 *   // Style the anchor and control points.
 *   strokeWeight(5);
 *
 *   // Draw the anchor points in black.
 *   stroke(0);
 *   point(21, 17);
 *   point(68, 19);
 *
 *   // Draw the control points in red.
 *   stroke(255, 0, 0);
 *   point(32, 91);
 *   point(84, 91);
 *
 *   describe(
 *     'A black curve drawn on a gray background. The curve passes through one red dot and two black dots. Another red dot appears near the bottom of the canvas.'
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
 *   // Style the shape.
 *   noFill();
 *   strokeWeight(1);
 *
 *   // Start drawing the shape.
 *   beginShape();
 *
 *   // Add the first control point and draw a segment to it.
 *   curveVertex(32, 91);
 *   curveVertex(32, 91);
 *
 *   // Add the anchor points.
 *   curveVertex(21, 17);
 *   curveVertex(68, 19);
 *
 *   // Add the second control point and draw a segment to it.
 *   curveVertex(84, 91);
 *   curveVertex(84, 91);
 *
 *   // Stop drawing the shape.
 *   endShape();
 *
 *   // Style the anchor and control points.
 *   strokeWeight(5);
 *
 *   // Draw the anchor points in black.
 *   stroke(0);
 *   point(21, 17);
 *   point(68, 19);
 *
 *   // Draw the control points in red.
 *   stroke(255, 0, 0);
 *   point(32, 91);
 *   point(84, 91);
 *
 *   describe(
 *     'A black U curve drawn upside down on a gray background. The curve passes from one red dot through two black dots and ends at another red dot.'
 *   );
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Click the mouse near the red dot in the bottom-left corner
 * // and drag to change the curve's shape.
 *
 * let x1 = 32;
 * let y1 = 91;
 * let isChanging = false;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A black U curve drawn upside down on a gray background. The curve passes from one red dot through two black dots and ends at another red dot.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Style the shape.
 *   noFill();
 *   stroke(0);
 *   strokeWeight(1);
 *
 *   // Start drawing the shape.
 *   beginShape();
 *
 *   // Add the first control point and draw a segment to it.
 *   curveVertex(x1, y1);
 *   curveVertex(x1, y1);
 *
 *   // Add the anchor points.
 *   curveVertex(21, 17);
 *   curveVertex(68, 19);
 *
 *   // Add the second control point and draw a segment to it.
 *   curveVertex(84, 91);
 *   curveVertex(84, 91);
 *
 *   // Stop drawing the shape.
 *   endShape();
 *
 *   // Style the anchor and control points.
 *   strokeWeight(5);
 *
 *   // Draw the anchor points in black.
 *   stroke(0);
 *   point(21, 17);
 *   point(68, 19);
 *
 *   // Draw the control points in red.
 *   stroke(255, 0, 0);
 *   point(x1, y1);
 *   point(84, 91);
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
 *   background(200);
 *
 *   // Start drawing the shape.
 *   beginShape();
 *
 *   // Add the first control point and draw a segment to it.
 *   curveVertex(32, 91);
 *   curveVertex(32, 91);
 *
 *   // Add the anchor points.
 *   curveVertex(21, 17);
 *   curveVertex(68, 19);
 *
 *   // Add the second control point.
 *   curveVertex(84, 91);
 *   curveVertex(84, 91);
 *
 *   // Stop drawing the shape.
 *   endShape();
 *
 *   describe('A ghost shape drawn in white on a gray background.');
 * }
 * </code>
 * </div>
 */

/**
 * @method curveVertex
 * @param {Number} x
 * @param {Number} y
 * @param {Number} [z] z-coordinate of the vertex.
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * // Click and drag the mouse to view the scene from different angles.
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe('A ghost shape drawn in white on a blue background. When the user drags the mouse, the scene rotates to reveal the outline of a second ghost.');
 * }
 *
 * function draw() {
 *   background('midnightblue');
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Draw the first ghost.
 *   noStroke();
 *   fill('ghostwhite');
 *
 *   beginShape();
 *   curveVertex(-28, 41, 0);
 *   curveVertex(-28, 41, 0);
 *   curveVertex(-29, -33, 0);
 *   curveVertex(18, -31, 0);
 *   curveVertex(34, 41, 0);
 *   curveVertex(34, 41, 0);
 *   endShape();
 *
 *   // Draw the second ghost.
 *   noFill();
 *   stroke('ghostwhite');
 *
 *   beginShape();
 *   curveVertex(-28, 41, -20);
 *   curveVertex(-28, 41, -20);
 *   curveVertex(-29, -33, -20);
 *   curveVertex(18, -31, -20);
 *   curveVertex(34, 41, -20);
 *   curveVertex(34, 41, -20);
 *   endShape();
 * }
 * </code>
 * </div>
 */
p5.prototype.curveVertex = function(...args) {
  p5._validateParameters('curveVertex', args);
  if (this._renderer.isP3D) {
    this._renderer.curveVertex(...args);
  } else {
    isCurve = true;
    this.vertex(args[0], args[1]);
  }
  return this;
};

/**
 * Stops creating a hole within a flat shape.
 *
 * The <a href="#/p5/beginContour">beginContour()</a> and `endContour()`
 * functions allow for creating negative space within custom shapes that are
 * flat. <a href="#/p5/beginContour">beginContour()</a> begins adding vertices
 * to a negative space and `endContour()` stops adding them.
 * <a href="#/p5/beginContour">beginContour()</a> and `endContour()` must be
 * called between <a href="#/p5/beginShape">beginShape()</a> and
 * <a href="#/p5/endShape">endShape()</a>.
 *
 * Transformations such as <a href="#/p5/translate">translate()</a>,
 * <a href="#/p5/rotate">rotate()</a>, and <a href="#/p5/scale">scale()</a>
 * don't work between <a href="#/p5/beginContour">beginContour()</a> and
 * `endContour()`. It's also not possible to use other shapes, such as
 * <a href="#/p5/ellipse">ellipse()</a> or <a href="#/p5/rect">rect()</a>,
 * between <a href="#/p5/beginContour">beginContour()</a> and `endContour()`.
 *
 * Note: The vertices that define a negative space must "wind" in the opposite
 * direction from the outer shape. First, draw vertices for the outer shape
 * clockwise order. Then, draw vertices for the negative space in
 * counter-clockwise order.
 *
 * @method endContour
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
 *   // Start drawing the shape.
 *   beginShape();
 *
 *   // Exterior vertices, clockwise winding.
 *   vertex(10, 10);
 *   vertex(90, 10);
 *   vertex(90, 90);
 *   vertex(10, 90);
 *
 *   // Interior vertices, counter-clockwise winding.
 *   beginContour();
 *   vertex(30, 30);
 *   vertex(30, 70);
 *   vertex(70, 70);
 *   vertex(70, 30);
 *   endContour();
 *
 *   // Stop drawing the shape.
 *   endShape(CLOSE);
 *
 *   describe('A white square with a square hole in its center drawn on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Click and drag the mouse to view the scene from different angles.
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe('A white square with a square hole in its center drawn on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Start drawing the shape.
 *   beginShape();
 *
 *   // Exterior vertices, clockwise winding.
 *   vertex(-40, -40);
 *   vertex(40, -40);
 *   vertex(40, 40);
 *   vertex(-40, 40);
 *
 *   // Interior vertices, counter-clockwise winding.
 *   beginContour();
 *   vertex(-20, -20);
 *   vertex(-20, 20);
 *   vertex(20, 20);
 *   vertex(20, -20);
 *   endContour();
 *
 *   // Stop drawing the shape.
 *   endShape(CLOSE);
 * }
 * </code>
 * </div>
 */
p5.prototype.endContour = function() {
  if (this._renderer.isP3D) {
    return this;
  }

  const vert = contourVertices[0].slice(); // copy all data
  vert.isVert = contourVertices[0].isVert;
  vert.moveTo = false;
  contourVertices.push(vert);

  // prevent stray lines with multiple contours
  if (isFirstContour) {
    vertices.push(vertices[0]);
    isFirstContour = false;
  }

  for (let i = 0; i < contourVertices.length; i++) {
    vertices.push(contourVertices[i]);
  }
  return this;
};

/**
 * Begins adding vertices to a custom shape.
 *
 * The <a href="#/p5/beginShape">beginShape()</a> and `endShape()` functions
 * allow for creating custom shapes in 2D or 3D.
 * <a href="#/p5/beginShape">beginShape()</a> begins adding vertices to a
 * custom shape and `endShape()` stops adding them.
 *
 * The first parameter, `mode`, is optional. By default, the first and last
 * vertices of a shape aren't connected. If the constant `CLOSE` is passed, as
 * in `endShape(CLOSE)`, then the first and last vertices will be connected.
 *
 * The second parameter, `count`, is also optional. In WebGL mode, it’s more
 * efficient to draw many copies of the same shape using a technique called
 * <a href="https://webglfundamentals.org/webgl/lessons/webgl-instanced-drawing.html" target="_blank">instancing</a>.
 * The `count` parameter tells WebGL mode how many copies to draw. For
 * example, calling `endShape(CLOSE, 400)` after drawing a custom shape will
 * make it efficient to draw 400 copies. This feature requires
 * <a href="https://p5js.org/tutorials/intro-to-shaders/" target="_blank">writing a custom shader</a>.
 *
 * After calling <a href="#/p5/beginShape">beginShape()</a>, shapes can be
 * built by calling <a href="#/p5/vertex">vertex()</a>,
 * <a href="#/p5/bezierVertex">bezierVertex()</a>,
 * <a href="#/p5/quadraticVertex">quadraticVertex()</a>, and/or
 * <a href="#/p5/curveVertex">curveVertex()</a>. Calling
 * `endShape()` will stop adding vertices to the
 * shape. Each shape will be outlined with the current stroke color and filled
 * with the current fill color.
 *
 * Transformations such as <a href="#/p5/translate">translate()</a>,
 * <a href="#/p5/rotate">rotate()</a>, and
 * <a href="#/p5/scale">scale()</a> don't work between
 * <a href="#/p5/beginShape">beginShape()</a> and `endShape()`. It's also not
 * possible to use other shapes, such as <a href="#/p5/ellipse">ellipse()</a> or
 * <a href="#/p5/rect">rect()</a>, between
 * <a href="#/p5/beginShape">beginShape()</a> and `endShape()`.
 *
 * @method endShape
 * @param  {Constant} [mode] use CLOSE to close the shape
 * @param  {Integer} [count] number of times you want to draw/instance the shape (for WebGL mode).
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
 *   // Style the shapes.
 *   noFill();
 *
 *   // Left triangle.
 *   beginShape();
 *   vertex(20, 20);
 *   vertex(45, 20);
 *   vertex(45, 80);
 *   endShape(CLOSE);
 *
 *   // Right triangle.
 *   beginShape();
 *   vertex(50, 20);
 *   vertex(75, 20);
 *   vertex(75, 80);
 *   endShape();
 *
 *   describe(
 *     'Two sets of black lines drawn on a gray background. The three lines on the left form a right triangle. The two lines on the right form a right angle.'
 *   );
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Note: A "uniform" is a global variable within a shader program.
 *
 * // Create a string with the vertex shader program.
 * // The vertex shader is called for each vertex.
 * let vertSrc = `#version 300 es
 *
 * precision mediump float;
 *
 * in vec3 aPosition;
 * flat out int instanceID;
 *
 * uniform mat4 uModelViewMatrix;
 * uniform mat4 uProjectionMatrix;
 *
 * void main() {
 *
 *   // Copy the instance ID to the fragment shader.
 *   instanceID = gl_InstanceID;
 *   vec4 positionVec4 = vec4(aPosition, 1.0);
 *
 *   // gl_InstanceID represents a numeric value for each instance.
 *   // Using gl_InstanceID allows us to move each instance separately.
 *   // Here we move each instance horizontally by ID * 23.
 *   float xOffset = float(gl_InstanceID) * 23.0;
 *
 *   // Apply the offset to the final position.
 *   gl_Position = uProjectionMatrix * uModelViewMatrix * (positionVec4 -
 *     vec4(xOffset, 0.0, 0.0, 0.0));
 * }
 * `;
 *
 * // Create a string with the fragment shader program.
 * // The fragment shader is called for each pixel.
 * let fragSrc = `#version 300 es
 *
 * precision mediump float;
 *
 * out vec4 outColor;
 * flat in int instanceID;
 * uniform float numInstances;
 *
 * void main() {
 *   vec4 red = vec4(1.0, 0.0, 0.0, 1.0);
 *   vec4 blue = vec4(0.0, 0.0, 1.0, 1.0);
 *
 *   // Normalize the instance ID.
 *   float normId = float(instanceID) / numInstances;
 *
 *   // Mix between two colors using the normalized instance ID.
 *   outColor = mix(red, blue, normId);
 * }
 * `;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   // Create a p5.Shader object.
 *   let myShader = createShader(vertSrc, fragSrc);
 *
 *   background(220);
 *
 *   // Compile and apply the p5.Shader.
 *   shader(myShader);
 *
 *   // Set the numInstances uniform.
 *   myShader.setUniform('numInstances', 4);
 *
 *   // Translate the origin to help align the drawing.
 *   translate(25, -10);
 *
 *   // Style the shapes.
 *   noStroke();
 *
 *   // Draw the shapes.
 *   beginShape();
 *   vertex(0, 0);
 *   vertex(0, 20);
 *   vertex(20, 20);
 *   vertex(20, 0);
 *   vertex(0, 0);
 *   endShape(CLOSE, 4);
 *
 *   describe('A row of four squares. Their colors transition from purple on the left to red on the right');
 * }
 * </code>
 * </div>
 */
p5.prototype.endShape = function(mode, count = 1) {
  p5._validateParameters('endShape', arguments);
  if (count < 1) {
    console.log('🌸 p5.js says: You can not have less than one instance');
    count = 1;
  }

  if (this._renderer.isP3D) {
    this._renderer.endShape(
      mode,
      isCurve,
      isBezier,
      isQuadratic,
      isContour,
      shapeKind,
      count
    );
  } else {
    if (count !== 1) {
      console.log('🌸 p5.js says: Instancing is only supported in WebGL2 mode');
    }
    if (vertices.length === 0) {
      return this;
    }
    if (!this._renderer._doStroke && !this._renderer._doFill) {
      return this;
    }

    const closeShape = mode === constants.CLOSE;

    // if the shape is closed, the first element is also the last element
    if (closeShape && !isContour) {
      vertices.push(vertices[0]);
    }

    this._renderer.endShape(
      mode,
      vertices,
      isCurve,
      isBezier,
      isQuadratic,
      isContour,
      shapeKind
    );

    // Reset some settings
    isCurve = false;
    isBezier = false;
    isQuadratic = false;
    isContour = false;
    isFirstContour = true;

    // If the shape is closed, the first element was added as last element.
    // We must remove it again to prevent the list of vertices from growing
    // over successive calls to endShape(CLOSE)
    if (closeShape) {
      vertices.pop();
    }
  }
  return this;
};

/**
 * Adds a quadratic Bézier curve segment to a custom shape.
 *
 * `quadraticVertex()` adds a curved segment to custom shapes. The Bézier
 * curve segments it creates are similar to those made by the
 * <a href="#/p5/bezierVertex">bezierVertex()</a> function.
 * `quadraticVertex()` must be called between the
 * <a href="#/p5/beginShape">beginShape()</a> and
 * <a href="#/p5/endShape">endShape()</a> functions. The curved segment uses
 * the previous vertex as the first anchor point, so there must be at least
 * one call to <a href="#/p5/vertex">vertex()</a> before `quadraticVertex()` can
 * be used.
 *
 * The first two parameters, `cx` and `cy`, set the curve’s control point.
 * The control point "pulls" the curve towards its.
 *
 * The last two parameters, `x3`, and `y3`, set the last anchor point. The
 * last anchor point is where the curve ends.
 *
 * Bézier curves can also be drawn in 3D using WebGL mode. The 3D version of
 * `bezierVertex()` has eight arguments because each point has x-, y-, and
 * z-coordinates.
 *
 * Note: `quadraticVertex()` won’t work when an argument is passed to
 * <a href="#/p5/beginShape">beginShape()</a>.
 *
 * @method quadraticVertex
 * @param  {Number} cx x-coordinate of the control point.
 * @param  {Number} cy y-coordinate of the control point.
 * @param  {Number} x3 x-coordinate of the anchor point.
 * @param  {Number} y3 y-coordinate of the anchor point.
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
 *   // Style the curve.
 *   noFill();
 *
 *   // Draw the curve.
 *   beginShape();
 *   vertex(20, 20);
 *   quadraticVertex(80, 20, 50, 50);
 *   endShape();
 *
 *   describe('A black curve drawn on a gray square. The curve starts at the top-left corner and ends at the center.');
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
 *   // Draw the curve.
 *   noFill();
 *   beginShape();
 *   vertex(20, 20);
 *   quadraticVertex(80, 20, 50, 50);
 *   endShape();
 *
 *   // Draw red lines from the anchor points to the control point.
 *   stroke(255, 0, 0);
 *   line(20, 20, 80, 20);
 *   line(50, 50, 80, 20);
 *
 *   // Draw the anchor points in black.
 *   strokeWeight(5);
 *   stroke(0);
 *   point(20, 20);
 *   point(50, 50);
 *
 *   // Draw the control point in red.
 *   stroke(255, 0, 0);
 *   point(80, 20);
 *
 *   describe('A black curve that starts at the top-left corner and ends at the center. Its anchor and control points are marked with dots. Red lines connect both anchor points to the control point.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Click the mouse near the red dot in the top-right corner
 * // and drag to change the curve's shape.
 *
 * let x2 = 80;
 * let y2 = 20;
 * let isChanging = false;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('A black curve that starts at the top-left corner and ends at the center. Its anchor and control points are marked with dots. Red lines connect both anchor points to the control point.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Style the curve.
 *   noFill();
 *   strokeWeight(1);
 *   stroke(0);
 *
 *   // Draw the curve.
 *   beginShape();
 *   vertex(20, 20);
 *   quadraticVertex(x2, y2, 50, 50);
 *   endShape();
 *
 *   // Draw red lines from the anchor points to the control point.
 *   stroke(255, 0, 0);
 *   line(20, 20, x2, y2);
 *   line(50, 50, x2, y2);
 *
 *   // Draw the anchor points in black.
 *   strokeWeight(5);
 *   stroke(0);
 *   point(20, 20);
 *   point(50, 50);
 *
 *   // Draw the control point in red.
 *   stroke(255, 0, 0);
 *   point(x2, y2);
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
 *   background(200);
 *
 *   // Start drawing the shape.
 *   beginShape();
 *
 *   // Add the curved segments.
 *   vertex(20, 20);
 *   quadraticVertex(80, 20, 50, 50);
 *   quadraticVertex(20, 80, 80, 80);
 *
 *   // Add the straight segments.
 *   vertex(80, 10);
 *   vertex(20, 10);
 *   vertex(20, 20);
 *
 *   // Stop drawing the shape.
 *   endShape();
 *
 *   describe('A white puzzle piece drawn on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Click the and drag the mouse to view the scene from a different angle.
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe('A white puzzle piece on a dark gray background. When the user clicks and drags the scene, the outline of a second puzzle piece is revealed.');
 * }
 *
 * function draw() {
 *   background(50);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Style the first puzzle piece.
 *   noStroke();
 *   fill(255);
 *
 *   // Draw the first puzzle piece.
 *   beginShape();
 *   vertex(-30, -30, 0);
 *   quadraticVertex(30, -30, 0, 0, 0, 0);
 *   quadraticVertex(-30, 30, 0, 30, 30, 0);
 *   vertex(30, -40, 0);
 *   vertex(-30, -40, 0);
 *   vertex(-30, -30, 0);
 *   endShape();
 *
 *   // Style the second puzzle piece.
 *   stroke(255);
 *   noFill();
 *
 *   // Draw the second puzzle piece.
 *   beginShape();
 *   vertex(-30, -30, -20);
 *   quadraticVertex(30, -30, -20, 0, 0, -20);
 *   quadraticVertex(-30, 30, -20, 30, 30, -20);
 *   vertex(30, -40, -20);
 *   vertex(-30, -40, -20);
 *   vertex(-30, -30, -20);
 *   endShape();
 * }
 * </code>
 * </div>
 */

/**
 * @method quadraticVertex
 * @param  {Number} cx
 * @param  {Number} cy
 * @param  {Number} cz z-coordinate of the control point.
 * @param  {Number} x3
 * @param  {Number} y3
 * @param  {Number} z3 z-coordinate of the anchor point.
 */
p5.prototype.quadraticVertex = function(...args) {
  p5._validateParameters('quadraticVertex', args);
  if (this._renderer.isP3D) {
    this._renderer.quadraticVertex(...args);
  } else {
    //if we're drawing a contour, put the points into an
    // array for inside drawing
    if (this._contourInited) {
      const pt = {};
      pt.x = args[0];
      pt.y = args[1];
      pt.x3 = args[2];
      pt.y3 = args[3];
      pt.type = constants.QUADRATIC;
      this._contourVertices.push(pt);

      return this;
    }
    if (vertices.length > 0) {
      isQuadratic = true;
      const vert = [];
      for (let i = 0; i < args.length; i++) {
        vert[i] = args[i];
      }
      vert.isVert = false;
      if (isContour) {
        contourVertices.push(vert);
      } else {
        vertices.push(vert);
      }
    } else {
      p5._friendlyError(
        'vertex() must be used once before calling quadraticVertex()',
        'quadraticVertex'
      );
    }
  }
  return this;
};

/**
 * Adds a vertex to a custom shape.
 *
 * `vertex()` sets the coordinates of vertices drawn between the
 * <a href="#/p5/beginShape">beginShape()</a> and
 * <a href="#/p5/endShape">endShape()</a> functions.
 *
 * The first two parameters, `x` and `y`, set the x- and y-coordinates of the
 * vertex.
 *
 * The third parameter, `z`, is optional. It sets the z-coordinate of the
 * vertex in WebGL mode. By default, `z` is 0.
 *
 * The fourth and fifth parameters, `u` and `v`, are also optional. They set
 * the u- and v-coordinates for the vertex’s texture when used with
 * <a href="#/p5/endShape">endShape()</a>. By default, `u` and `v` are both 0.
 *
 * @method vertex
 * @param  {Number} x x-coordinate of the vertex.
 * @param  {Number} y y-coordinate of the vertex.
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
 *   // Style the shape.
 *   strokeWeight(3);
 *
 *   // Start drawing the shape.
 *   // Only draw the vertices.
 *   beginShape(POINTS);
 *
 *   // Add the vertices.
 *   vertex(30, 20);
 *   vertex(85, 20);
 *   vertex(85, 75);
 *   vertex(30, 75);
 *
 *   // Stop drawing the shape.
 *   endShape();
 *
 *   describe('Four black dots that form a square are drawn on a gray background.');
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
 *   // Start drawing the shape.
 *   beginShape();
 *
 *   // Add vertices.
 *   vertex(30, 20);
 *   vertex(85, 20);
 *   vertex(85, 75);
 *   vertex(30, 75);
 *
 *   // Stop drawing the shape.
 *   endShape(CLOSE);
 *
 *   describe('A white square on a gray background.');
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
 *   // Start drawing the shape.
 *   beginShape();
 *
 *   // Add vertices.
 *   vertex(-20, -30, 0);
 *   vertex(35, -30, 0);
 *   vertex(35, 25, 0);
 *   vertex(-20, 25, 0);
 *
 *   // Stop drawing the shape.
 *   endShape(CLOSE);
 *
 *   describe('A white square on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe('A white square spins around slowly on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Rotate around the y-axis.
 *   rotateY(frameCount * 0.01);
 *
 *   // Start drawing the shape.
 *   beginShape();
 *
 *   // Add vertices.
 *   vertex(-20, -30, 0);
 *   vertex(35, -30, 0);
 *   vertex(35, 25, 0);
 *   vertex(-20, 25, 0);
 *
 *   // Stop drawing the shape.
 *   endShape(CLOSE);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * // Load an image to apply as a texture.
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe('A photograph of a ceiling rotates slowly against a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Rotate around the y-axis.
 *   rotateY(frameCount * 0.01);
 *
 *   // Style the shape.
 *   noStroke();
 *
 *   // Apply the texture.
 *   texture(img);
 *   textureMode(NORMAL);
 *
 *   // Start drawing the shape
 *   beginShape();
 *
 *   // Add vertices.
 *   vertex(-20, -30, 0, 0, 0);
 *   vertex(35, -30, 0, 1, 0);
 *   vertex(35, 25, 0, 1, 1);
 *   vertex(-20, 25, 0, 0, 1);
 *
 *   // Stop drawing the shape.
 *   endShape();
 * }
 * </code>
 * </div>
 */
/**
 * @method vertex
 * @param  {Number} x
 * @param  {Number} y
 * @param  {Number} [z]   z-coordinate of the vertex. Defaults to 0.
 * @chainable
 */
/**
 * @method vertex
 * @param  {Number} x
 * @param  {Number} y
 * @param  {Number} [z]
 * @param  {Number} [u]   u-coordinate of the vertex's texture. Defaults to 0.
 * @param  {Number} [v]   v-coordinate of the vertex's texture. Defaults to 0.
 * @chainable
 */
p5.prototype.vertex = function(x, y, moveTo, u, v) {
  if (this._renderer.isP3D) {
    this._renderer.vertex(...arguments);
  } else {
    const vert = [];
    vert.isVert = true;
    vert[0] = x;
    vert[1] = y;
    vert[2] = 0;
    vert[3] = 0;
    vert[4] = 0;
    vert[5] = this._renderer._getFill();
    vert[6] = this._renderer._getStroke();

    if (moveTo) {
      vert.moveTo = moveTo;
    }
    if (isContour) {
      if (contourVertices.length === 0) {
        vert.moveTo = true;
      }
      contourVertices.push(vert);
    } else {
      vertices.push(vert);
    }
  }
  return this;
};

/**
 * Sets the normal vector for vertices in a custom 3D shape.
 *
 * 3D shapes created with <a href="#/p5/beginShape">beginShape()</a> and
 * <a href="#/p5/endShape">endShape()</a> are made by connecting sets of
 * points called vertices. Each vertex added with
 * <a href="#/p5/vertex">vertex()</a> has a normal vector that points away
 * from it. The normal vector controls how light reflects off the shape.
 *
 * `normal()` can be called two ways with different parameters to define the
 * normal vector's components.
 *
 * The first way to call `normal()` has three parameters, `x`, `y`, and `z`.
 * If `Number`s are passed, as in `normal(1, 2, 3)`, they set the x-, y-, and
 * z-components of the normal vector.
 *
 * The second way to call `normal()` has one parameter, `vector`. If a
 * <a href="#/p5.Vector">p5.Vector</a> object is passed, as in
 * `normal(myVector)`, its components will be used to set the normal vector.
 *
 * `normal()` changes the normal vector of vertices added to a custom shape
 * with <a href="#/p5/vertex">vertex()</a>. `normal()` must be called between
 * the <a href="#/p5/beginShape">beginShape()</a> and
 * <a href="#/p5/endShape">endShape()</a> functions, just like
 * <a href="#/p5/vertex">vertex()</a>. The normal vector set by calling
 * `normal()` will affect all following vertices until `normal()` is called
 * again:
 *
 * ```js
 * beginShape();
 *
 * // Set the vertex normal.
 * normal(-0.4, -0.4, 0.8);
 *
 * // Add a vertex.
 * vertex(-30, -30, 0);
 *
 * // Set the vertex normal.
 * normal(0, 0, 1);
 *
 * // Add vertices.
 * vertex(30, -30, 0);
 * vertex(30, 30, 0);
 *
 * // Set the vertex normal.
 * normal(0.4, -0.4, 0.8);
 *
 * // Add a vertex.
 * vertex(-30, 30, 0);
 *
 * endShape();
 * ```
 *
 * @method normal
 * @param  {p5.Vector} vector vertex normal as a <a href="#/p5.Vector">p5.Vector</a> object.
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * // Click the and drag the mouse to view the scene from a different angle.
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe(
 *     'A colorful square on a black background. The square changes color and rotates when the user drags the mouse. Parts of its surface reflect light in different directions.'
 *   );
 * }
 *
 * function draw() {
 *   background(0);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Style the shape.
 *   normalMaterial();
 *   noStroke();
 *
 *   // Draw the shape.
 *   beginShape();
 *   vertex(-30, -30, 0);
 *   vertex(30, -30, 0);
 *   vertex(30, 30, 0);
 *   vertex(-30, 30, 0);
 *   endShape();
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Click the and drag the mouse to view the scene from a different angle.
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe(
 *     'A colorful square on a black background. The square changes color and rotates when the user drags the mouse. Parts of its surface reflect light in different directions.'
 *   );
 * }
 *
 * function draw() {
 *   background(0);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Style the shape.
 *   normalMaterial();
 *   noStroke();
 *
 *   // Draw the shape.
 *   // Use normal() to set vertex normals.
 *   beginShape();
 *   normal(-0.4, -0.4, 0.8);
 *   vertex(-30, -30, 0);
 *
 *   normal(0, 0, 1);
 *   vertex(30, -30, 0);
 *   vertex(30, 30, 0);
 *
 *   normal(0.4, -0.4, 0.8);
 *   vertex(-30, 30, 0);
 *   endShape();
 * }
 * </code>
 * </div>
 *
 * <div class='notest'>
 * <code>
 * // Click the and drag the mouse to view the scene from a different angle.
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe(
 *     'A colorful square on a black background. The square changes color and rotates when the user drags the mouse. Parts of its surface reflect light in different directions.'
 *   );
 * }
 *
 * function draw() {
 *   background(0);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Style the shape.
 *   normalMaterial();
 *   noStroke();
 *
 *   // Create p5.Vector objects.
 *   let n1 = createVector(-0.4, -0.4, 0.8);
 *   let n2 = createVector(0, 0, 1);
 *   let n3 = createVector(0.4, -0.4, 0.8);
 *
 *   // Draw the shape.
 *   // Use normal() to set vertex normals.
 *   beginShape();
 *   normal(n1);
 *   vertex(-30, -30, 0);
 *
 *   normal(n2);
 *   vertex(30, -30, 0);
 *   vertex(30, 30, 0);
 *
 *   normal(n3);
 *   vertex(-30, 30, 0);
 *   endShape();
 * }
 * </code>
 * </div>
 */

/**
 * @method normal
 * @param  {Number} x x-component of the vertex normal.
 * @param  {Number} y y-component of the vertex normal.
 * @param  {Number} z z-component of the vertex normal.
 * @chainable
 */
p5.prototype.normal = function(x, y, z) {
  this._assert3d('normal');
  p5._validateParameters('normal', arguments);
  this._renderer.normal(...arguments);

  return this;
};

export default p5;
