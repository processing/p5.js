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
 * Use the <a href="#/p5/beginContour">beginContour()</a> and
 * <a href="#/p5/endContour">endContour()</a> functions to create negative shapes
 * within shapes such as the center of the letter 'O'. <a href="#/p5/beginContour">beginContour()</a>
 * begins recording vertices for the shape and <a href="#/p5/endContour">endContour()</a> stops recording.
 * The vertices that define a negative shape must "wind" in the opposite direction
 * from the exterior shape. First draw vertices for the exterior clockwise order, then for internal shapes, draw vertices
 * shape in counter-clockwise.
 *
 * These functions can only be used within a <a href="#/p5/beginShape">beginShape()</a>/<a href="#/p5/endShape">endShape()</a> pair and
 * transformations such as <a href="#/p5/translate">translate()</a>, <a href="#/p5/rotate">rotate()</a>, and <a href="#/p5/scale">scale()</a> do not work
 * within a <a href="#/p5/beginContour">beginContour()</a>/<a href="#/p5/endContour">endContour()</a> pair. It is also not possible to use
 * other shapes, such as <a href="#/p5/ellipse">ellipse()</a> or <a href="#/p5/rect">rect()</a> within.
 *
 * @method beginContour
 * @chainable
 * @example
 * <div>
 * <code>
 * translate(50, 50);
 * stroke(255, 0, 0);
 * beginShape();
 * // Exterior part of shape, clockwise winding
 * vertex(-40, -40);
 * vertex(40, -40);
 * vertex(40, 40);
 * vertex(-40, 40);
 * // Interior part of shape, counter-clockwise winding
 * beginContour();
 * vertex(-20, -20);
 * vertex(-20, 20);
 * vertex(20, 20);
 * vertex(20, -20);
 * endContour();
 * endShape(CLOSE);
 * </code>
 * </div>
 *
 * @alt
 * white rect and smaller grey rect with red outlines in center of canvas.
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
 * Using the <a href="#/p5/beginShape">beginShape()</a> and <a href="#/p5/endShape">endShape()</a> functions allow creating more
 * complex forms. <a href="#/p5/beginShape">beginShape()</a> begins recording vertices for a shape and
 * <a href="#/p5/endShape">endShape()</a> stops recording. The value of the kind parameter tells it which
 * types of shapes to create from the provided vertices. With no mode
 * specified, the shape can be any irregular polygon.
 *
 * The parameters available for <a href="#/p5/beginShape">beginShape()</a> are:
 *
 * POINTS
 * Draw a series of points
 *
 * LINES
 * Draw a series of unconnected line segments (individual lines)
 *
 * TRIANGLES
 * Draw a series of separate triangles
 *
 * TRIANGLE_FAN
 * Draw a series of connected triangles sharing the first vertex in a fan-like fashion
 *
 * TRIANGLE_STRIP
 * Draw a series of connected triangles in strip fashion
 *
 * QUADS
 * Draw a series of separate quads
 *
 * QUAD_STRIP
 * Draw quad strip using adjacent edges to form the next quad
 *
 * TESS (WEBGL only)
 * Handle irregular polygon for filling curve by explicit tessellation
 *
 * After calling the <a href="#/p5/beginShape">beginShape()</a> function, a series of <a href="#/p5/vertex">vertex()</a> commands must follow. To stop
 * drawing the shape, call <a href="#/p5/endShape">endShape()</a>. Each shape will be outlined with the
 * current stroke color and filled with the fill color.
 *
 * Transformations such as <a href="#/p5/translate">translate()</a>, <a href="#/p5/rotate">rotate()</a>, and <a href="#/p5/scale">scale()</a> do not work
 * within <a href="#/p5/beginShape">beginShape()</a>. It is also not possible to use other shapes, such as
 * <a href="#/p5/ellipse">ellipse()</a> or <a href="#/p5/rect">rect()</a> within <a href="#/p5/beginShape">beginShape()</a>.
 *
 * @method beginShape
 * @param  {POINTS|LINES|TRIANGLES|TRIANGLE_FAN|TRIANGLE_STRIP|QUADS|QUAD_STRIP|TESS} [kind] either POINTS, LINES, TRIANGLES, TRIANGLE_FAN
 *                                TRIANGLE_STRIP, QUADS, QUAD_STRIP or TESS
 * @chainable
 * @example
 * <div>
 * <code>
 * beginShape();
 * vertex(30, 20);
 * vertex(85, 20);
 * vertex(85, 75);
 * vertex(30, 75);
 * endShape(CLOSE);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * beginShape(POINTS);
 * vertex(30, 20);
 * vertex(85, 20);
 * vertex(85, 75);
 * vertex(30, 75);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * beginShape(LINES);
 * vertex(30, 20);
 * vertex(85, 20);
 * vertex(85, 75);
 * vertex(30, 75);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * noFill();
 * beginShape();
 * vertex(30, 20);
 * vertex(85, 20);
 * vertex(85, 75);
 * vertex(30, 75);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * noFill();
 * beginShape();
 * vertex(30, 20);
 * vertex(85, 20);
 * vertex(85, 75);
 * vertex(30, 75);
 * endShape(CLOSE);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * beginShape(TRIANGLES);
 * vertex(30, 75);
 * vertex(40, 20);
 * vertex(50, 75);
 * vertex(60, 20);
 * vertex(70, 75);
 * vertex(80, 20);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * beginShape(TRIANGLE_STRIP);
 * vertex(30, 75);
 * vertex(40, 20);
 * vertex(50, 75);
 * vertex(60, 20);
 * vertex(70, 75);
 * vertex(80, 20);
 * vertex(90, 75);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * beginShape(TRIANGLE_FAN);
 * vertex(57.5, 50);
 * vertex(57.5, 15);
 * vertex(92, 50);
 * vertex(57.5, 85);
 * vertex(22, 50);
 * vertex(57.5, 15);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * beginShape(QUADS);
 * vertex(30, 20);
 * vertex(30, 75);
 * vertex(50, 75);
 * vertex(50, 20);
 * vertex(65, 20);
 * vertex(65, 75);
 * vertex(85, 75);
 * vertex(85, 20);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * beginShape(QUAD_STRIP);
 * vertex(30, 20);
 * vertex(30, 75);
 * vertex(50, 20);
 * vertex(50, 75);
 * vertex(65, 20);
 * vertex(65, 75);
 * vertex(85, 20);
 * vertex(85, 75);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * beginShape(TESS);
 * vertex(20, 20);
 * vertex(80, 20);
 * vertex(80, 40);
 * vertex(40, 40);
 * vertex(40, 60);
 * vertex(80, 60);
 * vertex(80, 80);
 * vertex(20, 80);
 * endShape(CLOSE);
 * </code>
 * </div>
 *
 * @alt
 * white square-shape with black outline in middle-right of canvas.
 * 4 black points in a square shape in middle-right of canvas.
 * 2 horizontal black lines. In the top-right and bottom-right of canvas.
 * 3 line shape with horizontal on top, vertical in middle and horizontal bottom.
 * square line shape in middle-right of canvas.
 * 2 white triangle shapes mid-right canvas. left one pointing up and right down.
 * 5 horizontal interlocking and alternating white triangles in mid-right canvas.
 * 4 interlocking white triangles in 45 degree rotated square-shape.
 * 2 white rectangle shapes in mid-right canvas. Both 20×55.
 * 3 side-by-side white rectangles center rect is smaller in mid-right canvas.
 * Thick white l-shape with black outline mid-top-left of canvas.
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
 * Specifies vertex coordinates for Bezier curves. Each call to
 * bezierVertex() defines the position of two control points and
 * one anchor point of a Bezier curve, adding a new segment to a
 * line or shape. For WebGL mode bezierVertex() can be used in 2D
 * as well as 3D mode. 2D mode expects 6 parameters, while 3D mode
 * expects 9 parameters (including z coordinates).
 *
 * The first time bezierVertex() is used within a <a href="#/p5/beginShape">beginShape()</a>
 * call, it must be prefaced with a call to <a href="#/p5/vertex">vertex()</a> to set the first anchor
 * point. This function must be used between <a href="#/p5/beginShape">beginShape()</a> and <a href="#/p5/endShape">endShape()</a>
 * and only when there is no MODE or POINTS parameter specified to
 * <a href="#/p5/beginShape">beginShape()</a>.
 *
 * @method bezierVertex
 * @param  {Number} x2 x-coordinate for the first control point
 * @param  {Number} y2 y-coordinate for the first control point
 * @param  {Number} x3 x-coordinate for the second control point
 * @param  {Number} y3 y-coordinate for the second control point
 * @param  {Number} x4 x-coordinate for the anchor point
 * @param  {Number} y4 y-coordinate for the anchor point
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * noFill();
 * beginShape();
 * vertex(30, 20);
 * bezierVertex(80, 0, 80, 75, 30, 75);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * beginShape();
 * vertex(30, 20);
 * bezierVertex(80, 0, 80, 75, 30, 75);
 * bezierVertex(50, 80, 60, 25, 30, 20);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   setAttributes('antialias', true);
 * }
 * function draw() {
 *   orbitControl();
 *   background(50);
 *   strokeWeight(4);
 *   stroke(255);
 *   point(-25, 30);
 *   point(25, 30);
 *   point(25, -30);
 *   point(-25, -30);
 *
 *   strokeWeight(1);
 *   noFill();
 *
 *   beginShape();
 *   vertex(-25, 30);
 *   bezierVertex(25, 30, 25, -30, -25, -30);
 *   endShape();
 *
 *   beginShape();
 *   vertex(-25, 30, 20);
 *   bezierVertex(25, 30, 20, 25, -30, 20, -25, -30, 20);
 *   endShape();
 * }
 * </code>
 * </div>
 *
 * @alt
 * crescent-shaped line in middle of canvas. Points facing left.
 * white crescent shape in middle of canvas. Points facing left.
 * crescent shape in middle of canvas with another crescent shape on positive z-axis.
 */

/**
 * @method bezierVertex
 * @param  {Number} x2
 * @param  {Number} y2
 * @param  {Number} z2 z-coordinate for the first control point (for WebGL mode)
 * @param  {Number} x3
 * @param  {Number} y3
 * @param  {Number} z3 z-coordinate for the second control point (for WebGL mode)
 * @param  {Number} x4
 * @param  {Number} y4
 * @param  {Number} z4 z-coordinate for the anchor point (for WebGL mode)
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
 * Specifies vertex coordinates for curves. This function may only
 * be used between <a href="#/p5/beginShape">beginShape()</a> and <a href="#/p5/endShape">endShape()</a> and only when there
 * is no MODE parameter specified to <a href="#/p5/beginShape">beginShape()</a>.
 * For WebGL mode curveVertex() can be used in 2D as well as 3D mode.
 * 2D mode expects 2 parameters, while 3D mode expects 3 parameters.
 *
 * The first and last points in a series of curveVertex() lines will be used to
 * guide the beginning and end of the curve. A minimum of four
 * points is required to draw a tiny curve between the second and
 * third points. Adding a fifth point with curveVertex() will draw
 * the curve between the second, third, and fourth points. The
 * curveVertex() function is an implementation of Catmull-Rom
 * splines.
 *
 * @method curveVertex
 * @param {Number} x x-coordinate of the vertex
 * @param {Number} y y-coordinate of the vertex
 * @chainable
 * @example
 * <div>
 * <code>
 * strokeWeight(5);
 * point(84, 91);
 * point(68, 19);
 * point(21, 17);
 * point(32, 91);
 * strokeWeight(1);
 *
 * noFill();
 * beginShape();
 * curveVertex(84, 91);
 * curveVertex(84, 91);
 * curveVertex(68, 19);
 * curveVertex(21, 17);
 * curveVertex(32, 91);
 * curveVertex(32, 91);
 * endShape();
 * </code>
 * </div>
 *
 * @alt
 * Upside-down u-shape line, mid canvas. left point extends beyond canvas view.
 */

/**
 * @method curveVertex
 * @param {Number} x
 * @param {Number} y
 * @param {Number} [z] z-coordinate of the vertex (for WebGL mode)
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   setAttributes('antialias', true);
 * }
 * function draw() {
 *   orbitControl();
 *   background(50);
 *   strokeWeight(4);
 *   stroke(255);
 *
 *   point(-25, 25);
 *   point(-25, 25);
 *   point(-25, -25);
 *   point(25, -25);
 *   point(25, 25);
 *   point(25, 25);
 *
 *   strokeWeight(1);
 *   noFill();
 *
 *   beginShape();
 *   curveVertex(-25, 25);
 *   curveVertex(-25, 25);
 *   curveVertex(-25, -25);
 *   curveVertex(25, -25);
 *   curveVertex(25, 25);
 *   curveVertex(25, 25);
 *   endShape();
 *
 *   beginShape();
 *   curveVertex(-25, 25, 20);
 *   curveVertex(-25, 25, 20);
 *   curveVertex(-25, -25, 20);
 *   curveVertex(25, -25, 20);
 *   curveVertex(25, 25, 20);
 *   curveVertex(25, 25, 20);
 *   endShape();
 * }
 * </code>
 * </div>
 *
 * @alt
 * Upside-down u-shape line, mid canvas with the same shape in positive z-axis.
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
 * Use the <a href="#/p5/beginContour">beginContour()</a> and <a href="#/p5/endContour">endContour()</a> functions to create negative
 * shapes within shapes such as the center of the letter 'O'. <a href="#/p5/beginContour">beginContour()</a>
 * begins recording vertices for the shape and <a href="#/p5/endContour">endContour()</a> stops recording.
 * The vertices that define a negative shape must "wind" in the opposite
 * direction from the exterior shape. First draw vertices for the exterior
 * clockwise order, then for internal shapes, draw vertices
 * shape in counter-clockwise.
 *
 * These functions can only be used within a <a href="#/p5/beginShape">beginShape()</a>/<a href="#/p5/endShape">endShape()</a> pair and
 * transformations such as <a href="#/p5/translate">translate()</a>, <a href="#/p5/rotate">rotate()</a>, and <a href="#/p5/scale">scale()</a> do not work
 * within a <a href="#/p5/beginContour">beginContour()</a>/<a href="#/p5/endContour">endContour()</a> pair. It is also not possible to use
 * other shapes, such as <a href="#/p5/ellipse">ellipse()</a> or <a href="#/p5/rect">rect()</a> within.
 *
 * @method endContour
 * @chainable
 * @example
 * <div>
 * <code>
 * translate(50, 50);
 * stroke(255, 0, 0);
 * beginShape();
 * // Exterior part of shape, clockwise winding
 * vertex(-40, -40);
 * vertex(40, -40);
 * vertex(40, 40);
 * vertex(-40, 40);
 * // Interior part of shape, counter-clockwise winding
 * beginContour();
 * vertex(-20, -20);
 * vertex(-20, 20);
 * vertex(20, 20);
 * vertex(20, -20);
 * endContour();
 * endShape(CLOSE);
 * </code>
 * </div>
 *
 * @alt
 * white rect and smaller grey rect with red outlines in center of canvas.
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
 * The <a href="#/p5/endShape">endShape()</a> function is the companion to <a href="#/p5/beginShape">beginShape()</a> and may only be
 * called after <a href="#/p5/beginShape">beginShape()</a>. When <a href="#/p5/endshape">endShape()</a> is called, all of the image
 * data defined since the previous call to <a href="#/p5/beginShape">beginShape()</a> is written into the image
 * buffer. The constant CLOSE is the value for the `mode` parameter to close
 * the shape (to connect the beginning and the end).
 * When using instancing with <a href="#/p5/endShape">endShape()</a> the instancing will not apply to the strokes.
 * When the count parameter is used with a value greater than 1, it enables instancing for shapes built when in WEBGL mode. Instancing
 * is a feature that allows the GPU to efficiently draw multiples of the same shape. It's often used for particle effects or other
 * times when you need a lot of repetition. In order to take advantage of instancing, you will also need to write your own custom
 * shader using the gl_InstanceID keyword. You can read more about instancing
 * <a href="https://webglfundamentals.org/webgl/lessons/webgl-instanced-drawing.html">here</a> or by working from the example on this
 * page.
 *
 * @method endShape
 * @param  {CLOSE} [mode] use CLOSE to close the shape
 * @param  {Integer} [count] number of times you want to draw/instance the shape (for WebGL mode).
 * @chainable
 * @example
 * <div>
 * <code>
 * noFill();
 *
 * beginShape();
 * vertex(20, 20);
 * vertex(45, 20);
 * vertex(45, 80);
 * endShape(CLOSE);
 *
 * beginShape();
 * vertex(50, 20);
 * vertex(75, 20);
 * vertex(75, 80);
 * endShape();
 * </code>
 * </div>
 *
 * @example
 * <div>
 * <code>
 * let fx;
 * let vs = `#version 300 es
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
 *   // copy the instance ID to the fragment shader
 *   instanceID = gl_InstanceID;
 *   vec4 positionVec4 = vec4(aPosition, 1.0);
 *
 *   // gl_InstanceID represents a numeric value for each instance
 *   // using gl_InstanceID allows us to move each instance separately
 *   // here we move each instance horizontally by id * 23
 *   float xOffset = float(gl_InstanceID) * 23.0;
 *
 *   // apply the offset to the final position
 *   gl_Position = uProjectionMatrix * uModelViewMatrix * (positionVec4 -
 *     vec4(xOffset, 0.0, 0.0, 0.0));
 * }
 * `;
 * let fs = `#version 300 es
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
 *   // Normalize the instance id
 *   float normId = float(instanceID) / numInstances;
 *
 *   // Mix between two colors using the normalized instance id
 *   outColor = mix(red, blue, normId);
 * }
 * `;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   fx = createShader(vs, fs);
 * }
 *
 * function draw() {
 *   background(220);
 *
 *   // strokes aren't instanced, and are rather used for debug purposes
 *   shader(fx);
 *   fx.setUniform('numInstances', 4);
 *
 *   // this doesn't have to do with instancing, this is just for centering the squares
 *   translate(25, -10);
 *
 *   // here we draw the squares we want to instance
 *   beginShape();
 *   vertex(0, 0);
 *   vertex(0, 20);
 *   vertex(20, 20);
 *   vertex(20, 0);
 *   vertex(0, 0);
 *   endShape(CLOSE, 4);
 *
 *   resetShader();
 * }
 * </code>
 * </div>
 *
 * @alt
 * Triangle line shape with smallest interior angle on bottom and upside-down L.
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
 * Specifies vertex coordinates for quadratic Bezier curves. Each call to
 * quadraticVertex() defines the position of one control points and one
 * anchor point of a Bezier curve, adding a new segment to a line or shape.
 * The first time quadraticVertex() is used within a <a href="#/p5/beginShape">beginShape()</a> call, it
 * must be prefaced with a call to <a href="#/p5/vertex">vertex()</a> to set the first anchor point.
 * For WebGL mode quadraticVertex() can be used in 2D as well as 3D mode.
 * 2D mode expects 4 parameters, while 3D mode expects 6 parameters
 * (including z coordinates).
 *
 * This function must be used between <a href="#/p5/beginShape">beginShape()</a> and <a href="#/p5/endShape">endShape()</a>
 * and only when there is no MODE or POINTS parameter specified to
 * <a href="#/p5/beginShape">beginShape()</a>.
 *
 * @method quadraticVertex
 * @param  {Number} cx x-coordinate for the control point
 * @param  {Number} cy y-coordinate for the control point
 * @param  {Number} x3 x-coordinate for the anchor point
 * @param  {Number} y3 y-coordinate for the anchor point
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * strokeWeight(5);
 * point(20, 20);
 * point(80, 20);
 * point(50, 50);
 *
 * noFill();
 * strokeWeight(1);
 * beginShape();
 * vertex(20, 20);
 * quadraticVertex(80, 20, 50, 50);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * strokeWeight(5);
 * point(20, 20);
 * point(80, 20);
 * point(50, 50);
 *
 * point(20, 80);
 * point(80, 80);
 * point(80, 60);
 *
 * noFill();
 * strokeWeight(1);
 * beginShape();
 * vertex(20, 20);
 * quadraticVertex(80, 20, 50, 50);
 * quadraticVertex(20, 80, 80, 80);
 * vertex(80, 60);
 * endShape();
 * </code>
 * </div>
 *
 * @alt
 * arched-shaped black line with 4 pixel thick stroke weight.
 * backwards s-shaped black line with 4 pixel thick stroke weight.
 */

/**
 * @method quadraticVertex
 * @param  {Number} cx
 * @param  {Number} cy
 * @param  {Number} cz z-coordinate for the control point (for WebGL mode)
 * @param  {Number} x3
 * @param  {Number} y3
 * @param  {Number} z3 z-coordinate for the anchor point (for WebGL mode)
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   setAttributes('antialias', true);
 * }
 * function draw() {
 *   orbitControl();
 *   background(50);
 *   strokeWeight(4);
 *   stroke(255);
 *
 *   point(-35, -35);
 *   point(35, -35);
 *   point(0, 0);
 *   point(-35, 35);
 *   point(35, 35);
 *   point(35, 10);
 *
 *   strokeWeight(1);
 *   noFill();
 *
 *   beginShape();
 *   vertex(-35, -35);
 *   quadraticVertex(35, -35, 0, 0);
 *   quadraticVertex(-35, 35, 35, 35);
 *   vertex(35, 10);
 *   endShape();
 *
 *   beginShape();
 *   vertex(-35, -35, 20);
 *   quadraticVertex(35, -35, 20, 0, 0, 20);
 *   quadraticVertex(-35, 35, 20, 35, 35, 20);
 *   vertex(35, 10, 20);
 *   endShape();
 * }
 * </code>
 * </div>
 *
 * @alt
 * backwards s-shaped black line with the same s-shaped line in positive z-axis.
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
 * All shapes are constructed by connecting a series of vertices. <a href="#/p5/vertex">vertex()</a>
 * is used to specify the vertex coordinates for points, lines, triangles,
 * quads, and polygons. It is used exclusively within the <a href="#/p5/beginShape">beginShape()</a> and
 * <a href="#/p5/endShape">endShape()</a> functions.
 *
 * @method vertex
 * @param  {Number} x x-coordinate of the vertex
 * @param  {Number} y y-coordinate of the vertex
 * @chainable
 * @example
 * <div>
 * <code>
 * strokeWeight(3);
 * beginShape(POINTS);
 * vertex(30, 20);
 * vertex(85, 20);
 * vertex(85, 75);
 * vertex(30, 75);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * createCanvas(100, 100, WEBGL);
 * background(240, 240, 240);
 * fill(237, 34, 93);
 * noStroke();
 * beginShape();
 * vertex(0, 35);
 * vertex(35, 0);
 * vertex(0, -35);
 * vertex(-35, 0);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * createCanvas(100, 100, WEBGL);
 * background(240, 240, 240);
 * fill(237, 34, 93);
 * noStroke();
 * beginShape();
 * vertex(-10, 10);
 * vertex(0, 35);
 * vertex(10, 10);
 * vertex(35, 0);
 * vertex(10, -8);
 * vertex(0, -35);
 * vertex(-10, -8);
 * vertex(-35, 0);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * strokeWeight(3);
 * stroke(237, 34, 93);
 * beginShape(LINES);
 * vertex(10, 35);
 * vertex(90, 35);
 * vertex(10, 65);
 * vertex(90, 65);
 * vertex(35, 10);
 * vertex(35, 90);
 * vertex(65, 10);
 * vertex(65, 90);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Click to change the number of sides.
 * // In WebGL mode, custom shapes will only
 * // display hollow fill sections when
 * // all calls to vertex() use the same z-value.
 *
 * let sides = 3;
 * let angle, px, py;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   setAttributes('antialias', true);
 *   fill(237, 34, 93);
 *   strokeWeight(3);
 * }
 *
 * function draw() {
 *   background(200);
 *   rotateX(frameCount * 0.01);
 *   rotateZ(frameCount * 0.01);
 *   ngon(sides, 0, 0, 80);
 * }
 *
 * function mouseClicked() {
 *   if (sides > 6) {
 *     sides = 3;
 *   } else {
 *     sides++;
 *   }
 * }
 *
 * function ngon(n, x, y, d) {
 *   beginShape(TESS);
 *   for (let i = 0; i < n + 1; i++) {
 *     angle = TWO_PI / n * i;
 *     px = x + sin(angle) * d / 2;
 *     py = y - cos(angle) * d / 2;
 *     vertex(px, py, 0);
 *   }
 *   for (let i = 0; i < n + 1; i++) {
 *     angle = TWO_PI / n * i;
 *     px = x + sin(angle) * d / 4;
 *     py = y - cos(angle) * d / 4;
 *     vertex(px, py, 0);
 *   }
 *   endShape();
 * }
 * </code>
 * </div>
 * @alt
 * 4 black points in a square shape in middle-right of canvas.
 * 4 points making a diamond shape.
 * 8 points making a star.
 * 8 points making 4 lines.
 * A rotating 3D shape with a hollow section in the middle.
 */
/**
 * @method vertex
 * @param  {Number} x
 * @param  {Number} y
 * @param  {Number} [z]   z-coordinate of the vertex.
 *                       Defaults to 0 if not specified.
 * @chainable
 */
/**
 * @method vertex
 * @param  {Number} x
 * @param  {Number} y
 * @param  {Number} [z]
 * @param  {Number} [u]   the vertex's texture u-coordinate
 * @param  {Number} [v]   the vertex's texture v-coordinate
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
 * Sets the 3d vertex normal to use for subsequent vertices drawn with
 * <a href="#/p5/vertex">vertex()</a>. A normal is a vector that is generally
 * nearly perpendicular to a shape's surface which controls how much light will
 * be reflected from that part of the surface.
 *
 * @method normal
 * @param  {Vector} vector A p5.Vector representing the vertex normal.
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   noStroke();
 * }
 *
 * function draw() {
 *   background(255);
 *   rotateY(frameCount / 100);
 *   normalMaterial();
 *   beginShape(TRIANGLE_STRIP);
 *   normal(-0.4, 0.4, 0.8);
 *   vertex(-30, 30, 0);
 *
 *   normal(0, 0, 1);
 *   vertex(-30, -30, 30);
 *   vertex(30, 30, 30);
 *
 *   normal(0.4, -0.4, 0.8);
 *   vertex(30, -30, 0);
 *   endShape();
 * }
 * </code>
 * </div>
 */

/**
 * @method normal
 * @param  {Number} x The x component of the vertex normal.
 * @param  {Number} y The y component of the vertex normal.
 * @param  {Number} z The z component of the vertex normal.
 * @chainable
 */
p5.prototype.normal = function(x, y, z) {
  this._assert3d('normal');
  p5._validateParameters('normal', arguments);
  this._renderer.normal(...arguments);

  return this;
};

export default p5;
