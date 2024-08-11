/**
 * @module Transform
 * @submodule Transform
 * @for p5
 * @requires core
 * @requires constants
 */

import p5 from './main';

/**
 * Applies a transformation matrix to the coordinate system.
 *
 * Transformations such as
 * <a href="#/p5/translate">translate()</a>,
 * <a href="#/p5/rotate">rotate()</a>, and
 * <a href="#/p5/scale">scale()</a>
 * use matrix-vector multiplication behind the scenes. A table of numbers,
 * called a matrix, encodes each transformation. The values in the matrix
 * then multiply each point on the canvas, which is represented by a vector.
 *
 * `applyMatrix()` allows for many transformations to be applied at once. See
 * <a href="https://en.wikipedia.org/wiki/Transformation_matrix" target="_blank">Wikipedia</a>
 * and <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Matrix_math_for_the_web" target="_blank">MDN</a>
 * for more details about transformations.
 *
 * There are two ways to call `applyMatrix()` in two and three dimensions.
 *
 * In 2D mode, the parameters `a`, `b`, `c`, `d`, `e`, and `f`, correspond to
 * elements in the following transformation matrix:
 *
 * > <img style="max-width: 150px" src="assets/transformation-matrix.png"
 * alt="The transformation matrix used when applyMatrix is called in 2D mode."/>
 *
 * The numbers can be passed individually, as in
 * `applyMatrix(2, 0, 0, 0, 2, 0)`. They can also be passed in an array, as in
 * `applyMatrix([2, 0, 0, 0, 2, 0])`.
 *
 * In 3D mode, the parameters `a`, `b`, `c`, `d`, `e`, `f`, `g`, `h`, `i`,
 * `j`, `k`, `l`, `m`, `n`, `o`, and `p` correspond to elements in the
 * following transformation matrix:
 *
 * <img style="max-width: 300px" src="assets/transformation-matrix-4-4.png"
 * alt="The transformation matrix used when applyMatrix is called in 3D mode."/>
 *
 * The numbers can be passed individually, as in
 * `applyMatrix(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1)`. They can
 * also be passed in an array, as in
 * `applyMatrix([2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1])`.
 *
 * By default, transformations accumulate. The
 * <a href="#/p5/push">push()</a> and <a href="#/p5/pop">pop()</a> functions
 * can be used to isolate transformations within distinct drawing groups.
 *
 * Note: Transformations are reset at the beginning of the draw loop. Calling
 * `applyMatrix()` inside the <a href="#/p5/draw">draw()</a> function won't
 * cause shapes to transform continuously.
 *
 * @method applyMatrix
 * @param  {Array} arr an array containing the elements of the transformation matrix. Its length should be either 6 (2D) or 16 (3D).
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('A white circle on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Translate the origin to the center.
 *   applyMatrix(1, 0, 0, 1, 50, 50);
 *
 *   // Draw the circle at coordinates (0, 0).
 *   circle(0, 0, 40);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('A white circle on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Translate the origin to the center.
 *   let m = [1, 0, 0, 1, 50, 50];
 *   applyMatrix(m);
 *
 *   // Draw the circle at coordinates (0, 0).
 *   circle(0, 0, 40);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe("A white rectangle on a gray background. The rectangle's long axis runs from top-left to bottom-right.");
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Rotate the coordinate system 1/8 turn.
 *   let angle = QUARTER_PI;
 *   let ca = cos(angle);
 *   let sa = sin(angle);
 *   applyMatrix(ca, sa, -sa, ca, 0, 0);
 *
 *   // Draw a rectangle at coordinates (50, 0).
 *   rect(50, 0, 40, 20);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'Two white squares on a gray background. The larger square appears at the top-center. The smaller square appears at the top-left.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Draw a square at (30, 20).
 *   square(30, 20, 40);
 *
 *   // Scale the coordinate system by a factor of 0.5.
 *   applyMatrix(0.5, 0, 0, 0.5, 0, 0);
 *
 *   // Draw a square at (30, 20).
 *   // It appears at (15, 10) after scaling.
 *   square(30, 20, 40);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('A white quadrilateral on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Calculate the shear factor.
 *   let angle = QUARTER_PI;
 *   let shearFactor = 1 / tan(HALF_PI - angle);
 *
 *   // Shear the coordinate system along the x-axis.
 *   applyMatrix(1, 0, shearFactor, 1, 0, 0);
 *
 *   // Draw the square.
 *   square(0, 0, 50);
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
 *   describe('A white cube rotates slowly against a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Rotate the coordinate system a little more each frame.
 *   let angle = frameCount * 0.01;
 *   let ca = cos(angle);
 *   let sa = sin(angle);
 *   applyMatrix(ca, 0, sa, 0, 0, 1, 0, 0, -sa, 0, ca, 0, 0, 0, 0, 1);
 *
 *   // Draw a box.
 *   box();
 * }
 * </code>
 * </div>
 */
/**
 * @method applyMatrix
 * @param  {Number} a an element of the transformation matrix.
 * @param  {Number} b an element of the transformation matrix.
 * @param  {Number} c an element of the transformation matrix.
 * @param  {Number} d an element of the transformation matrix.
 * @param  {Number} e an element of the transformation matrix.
 * @param  {Number} f an element of the transformation matrix.
 * @chainable
 */
/**
 * @method applyMatrix
 * @param  {Number} a
 * @param  {Number} b
 * @param  {Number} c
 * @param  {Number} d
 * @param  {Number} e
 * @param  {Number} f
 * @param  {Number} g an element of the transformation matrix.
 * @param  {Number} h an element of the transformation matrix.
 * @param  {Number} i an element of the transformation matrix.
 * @param  {Number} j an element of the transformation matrix.
 * @param  {Number} k an element of the transformation matrix.
 * @param  {Number} l an element of the transformation matrix.
 * @param  {Number} m an element of the transformation matrix.
 * @param  {Number} n an element of the transformation matrix.
 * @param  {Number} o an element of the transformation matrix.
 * @param  {Number} p an element of the transformation matrix.
 * @chainable
 */
p5.prototype.applyMatrix = function(...args) {
  let isTypedArray = args[0] instanceof Object.getPrototypeOf(Uint8Array);
  if (Array.isArray(args[0]) || isTypedArray) {
    this._renderer.applyMatrix(...args[0]);
  } else {
    this._renderer.applyMatrix(...args);
  }
  return this;
};

/**
 * Clears all transformations applied to the coordinate system.
 *
 * @method resetMatrix
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'Two circles drawn on a gray background. A blue circle is at the top-left and a red circle is at the bottom-right.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Translate the origin to the center.
 *   translate(50, 50);
 *
 *   // Draw a blue circle at the coordinates (25, 25).
 *   fill('blue');
 *   circle(25, 25, 20);
 *
 *   // Clear all transformations.
 *   // The origin is now at the top-left corner.
 *   resetMatrix();
 *
 *   // Draw a red circle at the coordinates (25, 25).
 *   fill('red');
 *   circle(25, 25, 20);
 * }
 * </code>
 * </div>
 */
p5.prototype.resetMatrix = function() {
  this._renderer.resetMatrix();
  return this;
};

/**
 * Rotates the coordinate system.
 *
 * By default, the positive x-axis points to the right and the positive y-axis
 * points downward. The `rotate()` function changes this orientation by
 * rotating the coordinate system about the origin. Everything drawn after
 * `rotate()` is called will appear to be rotated.
 *
 * The first parameter, `angle`, is the amount to rotate. For example, calling
 * `rotate(1)` rotates the coordinate system clockwise 1 radian which is
 * nearly 57˚. `rotate()` interprets angle values using the current
 * <a href="#/p5/angleMode">angleMode()</a>.
 *
 * The second parameter, `axis`, is optional. It's used to orient 3D rotations
 * in WebGL mode. If a <a href="#/p5.Vector">p5.Vector</a> is passed, as in
 * `rotate(QUARTER_PI, myVector)`, then the coordinate system will rotate
 * `QUARTER_PI` radians about `myVector`. If an array of vector components is
 * passed, as in `rotate(QUARTER_PI, [1, 0, 0])`, then the coordinate system
 * will rotate `QUARTER_PI` radians about a vector with the components
 * `[1, 0, 0]`.
 *
 * By default, transformations accumulate. For example, calling `rotate(1)`
 * twice has the same effect as calling `rotate(2)` once. The
 * <a href="#/p5/push">push()</a> and <a href="#/p5/pop">pop()</a> functions
 * can be used to isolate transformations within distinct drawing groups.
 *
 * Note: Transformations are reset at the beginning of the draw loop. Calling
 * `rotate(1)` inside the <a href="#/p5/draw">draw()</a> function won't cause
 * shapes to spin.
 *
 * @method rotate
 * @param  {Number} angle angle of rotation in the current <a href="#/p5/angleMode">angleMode()</a>.
 * @param  {p5.Vector|Number[]} [axis] axis to rotate about in 3D.
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     "A white rectangle on a gray background. The rectangle's long axis runs from top-left to bottom-right."
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Rotate the coordinate system 1/8 turn.
 *   rotate(QUARTER_PI);
 *
 *   // Draw a rectangle at coordinates (50, 0).
 *   rect(50, 0, 40, 20);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     "A white rectangle on a gray background. The rectangle's long axis runs from top-left to bottom-right."
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Rotate the coordinate system 1/16 turn.
 *   rotate(QUARTER_PI / 2);
 *
 *   // Rotate the coordinate system another 1/16 turn.
 *   rotate(QUARTER_PI / 2);
 *
 *   // Draw a rectangle at coordinates (50, 0).
 *   rect(50, 0, 40, 20);
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
 *   describe(
 *     "A white rectangle on a gray background. The rectangle's long axis runs from top-left to bottom-right."
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Rotate the coordinate system 1/8 turn.
 *   rotate(45);
 *
 *   // Draw a rectangle at coordinates (50, 0).
 *   rect(50, 0, 40, 20);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A white rectangle on a gray background. The rectangle rotates slowly about the top-left corner. It disappears and reappears periodically.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Rotate the coordinate system a little more each frame.
 *   let angle = frameCount * 0.01;
 *   rotate(angle);
 *
 *   // Draw a rectangle at coordinates (50, 0).
 *   rect(50, 0, 40, 20);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe("A cube on a gray background. The cube's front face points to the top-right.");
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Rotate the coordinate system 1/8 turn about
 *   // the axis [1, 1, 0].
 *   let axis = createVector(1, 1, 0);
 *   rotate(QUARTER_PI, axis);
 *
 *   // Draw a box.
 *   box();
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe("A cube on a gray background. The cube's front face points to the top-right.");
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Rotate the coordinate system 1/8 turn about
 *   // the axis [1, 1, 0].
 *   let axis = [1, 1, 0];
 *   rotate(QUARTER_PI, axis);
 *
 *   // Draw a box.
 *   box();
 * }
 * </code>
 * </div>
 */
p5.prototype.rotate = function(angle, axis) {
  p5._validateParameters('rotate', arguments);
  this._renderer.rotate(this._toRadians(angle), axis);
  return this;
};

/**
 * Rotates the coordinate system about the x-axis in WebGL mode.
 *
 * The parameter, `angle`, is the amount to rotate. For example, calling
 * `rotateX(1)` rotates the coordinate system about the x-axis by 1 radian.
 * `rotateX()` interprets angle values using the current
 * <a href="#/p5/angleMode">angleMode()</a>.
 *
 * By default, transformations accumulate. For example, calling `rotateX(1)`
 * twice has the same effect as calling `rotateX(2)` once. The
 * <a href="#/p5/push">push()</a> and <a href="#/p5/pop">pop()</a> functions
 * can be used to isolate transformations within distinct drawing groups.
 *
 * Note: Transformations are reset at the beginning of the draw loop. Calling
 * `rotateX(1)` inside the <a href="#/p5/draw">draw()</a> function won't cause
 * shapes to spin.
 *
 * @method  rotateX
 * @param  {Number} angle angle of rotation in the current <a href="#/p5/angleMode">angleMode()</a>.
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
 *   describe('A white cube on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Rotate the coordinate system 1/8 turn.
 *   rotateX(QUARTER_PI);
 *
 *   // Draw a box.
 *   box();
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
 *   describe('A white cube on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Rotate the coordinate system 1/16 turn.
 *   rotateX(QUARTER_PI / 2);
 *
 *   // Rotate the coordinate system 1/16 turn.
 *   rotateX(QUARTER_PI / 2);
 *
 *   // Draw a box.
 *   box();
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
 *   // Use degrees.
 *   angleMode(DEGREES);
 *
 *   describe('A white cube on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Rotate the coordinate system 1/8 turn.
 *   rotateX(45);
 *
 *   // Draw a box.
 *   box();
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
 *   describe('A white cube rotates slowly against a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Rotate the coordinate system a little more each frame.
 *   let angle = frameCount * 0.01;
 *   rotateX(angle);
 *
 *   // Draw a box.
 *   box();
 * }
 * </code>
 * </div>
 */
p5.prototype.rotateX = function(angle) {
  this._assert3d('rotateX');
  p5._validateParameters('rotateX', arguments);
  this._renderer.rotateX(this._toRadians(angle));
  return this;
};

/**
 * Rotates the coordinate system about the y-axis in WebGL mode.
 *
 * The parameter, `angle`, is the amount to rotate. For example, calling
 * `rotateY(1)` rotates the coordinate system about the y-axis by 1 radian.
 * `rotateY()` interprets angle values using the current
 * <a href="#/p5/angleMode">angleMode()</a>.
 *
 * By default, transformations accumulate. For example, calling `rotateY(1)`
 * twice has the same effect as calling `rotateY(2)` once. The
 * <a href="#/p5/push">push()</a> and <a href="#/p5/pop">pop()</a> functions
 * can be used to isolate transformations within distinct drawing groups.
 *
 * Note: Transformations are reset at the beginning of the draw loop. Calling
 * `rotateY(1)` inside the <a href="#/p5/draw">draw()</a> function won't cause
 * shapes to spin.
 *
 * @method rotateY
 * @param  {Number} angle angle of rotation in the current <a href="#/p5/angleMode">angleMode()</a>.
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
 *   describe('A white cube on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Rotate the coordinate system 1/8 turn.
 *   rotateY(QUARTER_PI);
 *
 *   // Draw a box.
 *   box();
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
 *   describe('A white cube on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Rotate the coordinate system 1/16 turn.
 *   rotateY(QUARTER_PI / 2);
 *
 *   // Rotate the coordinate system 1/16 turn.
 *   rotateY(QUARTER_PI / 2);
 *
 *   // Draw a box.
 *   box();
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
 *   // Use degrees.
 *   angleMode(DEGREES);
 *
 *   describe('A white cube on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Rotate the coordinate system 1/8 turn.
 *   rotateY(45);
 *
 *   // Draw a box.
 *   box();
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
 *   describe('A white cube rotates slowly against a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Rotate the coordinate system a little more each frame.
 *   let angle = frameCount * 0.01;
 *   rotateY(angle);
 *
 *   // Draw a box.
 *   box();
 * }
 * </code>
 * </div>
 */
p5.prototype.rotateY = function(angle) {
  this._assert3d('rotateY');
  p5._validateParameters('rotateY', arguments);
  this._renderer.rotateY(this._toRadians(angle));
  return this;
};

/**
 * Rotates the coordinate system about the z-axis in WebGL mode.
 *
 * The parameter, `angle`, is the amount to rotate. For example, calling
 * `rotateZ(1)` rotates the coordinate system about the z-axis by 1 radian.
 * `rotateZ()` interprets angle values using the current
 * <a href="#/p5/angleMode">angleMode()</a>.
 *
 * By default, transformations accumulate. For example, calling `rotateZ(1)`
 * twice has the same effect as calling `rotateZ(2)` once. The
 * <a href="#/p5/push">push()</a> and <a href="#/p5/pop">pop()</a> functions
 * can be used to isolate transformations within distinct drawing groups.
 *
 * Note: Transformations are reset at the beginning of the draw loop. Calling
 * `rotateZ(1)` inside the <a href="#/p5/draw">draw()</a> function won't cause
 * shapes to spin.
 *
 * @method rotateZ
 * @param  {Number} angle angle of rotation in the current <a href="#/p5/angleMode">angleMode()</a>.
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
 *   describe('A white cube on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Rotate the coordinate system 1/8 turn.
 *   rotateZ(QUARTER_PI);
 *
 *   // Draw a box.
 *   box();
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
 *   describe('A white cube on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Rotate the coordinate system 1/16 turn.
 *   rotateZ(QUARTER_PI / 2);
 *
 *   // Rotate the coordinate system 1/16 turn.
 *   rotateZ(QUARTER_PI / 2);
 *
 *   // Draw a box.
 *   box();
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
 *   // Use degrees.
 *   angleMode(DEGREES);
 *
 *   describe('A white cube on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Rotate the coordinate system 1/8 turn.
 *   rotateZ(45);
 *
 *   // Draw a box.
 *   box();
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
 *   describe('A white cube rotates slowly against a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Rotate the coordinate system a little more each frame.
 *   let angle = frameCount * 0.01;
 *   rotateZ(angle);
 *
 *   // Draw a box.
 *   box();
 * }
 * </code>
 * </div>
 */
p5.prototype.rotateZ = function(angle) {
  this._assert3d('rotateZ');
  p5._validateParameters('rotateZ', arguments);
  this._renderer.rotateZ(this._toRadians(angle));
  return this;
};

/**
 * Scales the coordinate system.
 *
 * By default, shapes are drawn at their original scale. A rectangle that's 50
 * pixels wide appears to take up half the width of a 100 pixel-wide canvas.
 * The `scale()` function can shrink or stretch the coordinate system so that
 * shapes appear at different sizes. There are two ways to call `scale()` with
 * parameters that set the scale factor(s).
 *
 * The first way to call `scale()` uses numbers to set the amount of scaling.
 * The first parameter, `s`, sets the amount to scale each axis. For example,
 * calling `scale(2)` stretches the x-, y-, and z-axes by a factor of 2. The
 * next two parameters, `y` and `z`, are optional. They set the amount to
 * scale the y- and z-axes. For example, calling `scale(2, 0.5, 1)` stretches
 * the x-axis by a factor of 2, shrinks the y-axis by a factor of 0.5, and
 * leaves the z-axis unchanged.
 *
 * The second way to call `scale()` uses a <a href="#/p5.Vector">p5.Vector</a>
 * object to set the scale factors. For example, calling `scale(myVector)`
 * uses the x-, y-, and z-components of `myVector` to set the amount of
 * scaling along the x-, y-, and z-axes. Doing so is the same as calling
 * `scale(myVector.x, myVector.y, myVector.z)`.
 *
 * By default, transformations accumulate. For example, calling `scale(1)`
 * twice has the same effect as calling `scale(2)` once. The
 * <a href="#/p5/push">push()</a> and <a href="#/p5/pop">pop()</a> functions
 * can be used to isolate transformations within distinct drawing groups.
 *
 * Note: Transformations are reset at the beginning of the draw loop. Calling
 * `scale(2)` inside the <a href="#/p5/draw">draw()</a> function won't cause
 * shapes to grow continuously.
 *
 * @method scale
 * @param  {Number|p5.Vector|Number[]} s amount to scale along the positive x-axis.
 * @param  {Number} [y] amount to scale along the positive y-axis. Defaults to `s`.
 * @param  {Number} [z] amount to scale along the positive z-axis. Defaults to `y`.
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'Two white squares on a gray background. The larger square appears at the top-center. The smaller square appears at the top-left.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Draw a square at (30, 20).
 *   square(30, 20, 40);
 *
 *   // Scale the coordinate system by a factor of 0.5.
 *   scale(0.5);
 *
 *   // Draw a square at (30, 20).
 *   // It appears at (15, 10) after scaling.
 *   square(30, 20, 40);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('A rectangle and a square drawn in white on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Draw a square at (30, 20).
 *   square(30, 20, 40);
 *
 *   // Scale the coordinate system by factors of
 *   // 0.5 along the x-axis and
 *   // 1.3 along the y-axis.
 *   scale(0.5, 1.3);
 *
 *   // Draw a square at (30, 20).
 *   // It appears as a rectangle at (15, 26) after scaling.
 *   square(30, 20, 40);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('A rectangle and a square drawn in white on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Draw a square at (30, 20).
 *   square(30, 20, 40);
 *
 *   // Create a p5.Vector object.
 *   let v = createVector(0.5, 1.3);
 *
 *   // Scale the coordinate system by factors of
 *   // 0.5 along the x-axis and
 *   // 1.3 along the y-axis.
 *   scale(v);
 *
 *   // Draw a square at (30, 20).
 *   // It appears as a rectangle at (15, 26) after scaling.
 *   square(30, 20, 40);
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
 *   describe(
 *     'A red box and a blue box drawn on a gray background. The red box appears embedded in the blue box.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Enable orbiting with the mouse.
 *   orbitControl();
 *
 *   // Turn on the lights.
 *   lights();
 *
 *   // Style the spheres.
 *   noStroke();
 *
 *   // Draw the red sphere.
 *   fill('red');
 *   box();
 *
 *   // Scale the coordinate system by factors of
 *   // 0.5 along the x-axis and
 *   // 1.3 along the y-axis and
 *   // 2 along the z-axis.
 *   scale(0.5, 1.3, 2);
 *
 *   // Draw the blue sphere.
 *   fill('blue');
 *   box();
 * }
 * </code>
 * </div>
 */
/**
 * @method scale
 * @param  {p5.Vector|Number[]} scales vector whose components should be used to scale.
 * @chainable
 */
p5.prototype.scale = function(x, y, z) {
  p5._validateParameters('scale', arguments);
  // Only check for Vector argument type if Vector is available
  if (x instanceof p5.Vector) {
    const v = x;
    x = v.x;
    y = v.y;
    z = v.z;
  } else if (Array.isArray(x)) {
    const rg = x;
    x = rg[0];
    y = rg[1];
    z = rg[2] || 1;
  }
  if (isNaN(y)) {
    y = z = x;
  } else if (isNaN(z)) {
    z = 1;
  }

  this._renderer.scale(x, y, z);

  return this;
};

/**
 * Shears the x-axis so that shapes appear skewed.
 *
 * By default, the x- and y-axes are perpendicular. The `shearX()` function
 * transforms the coordinate system so that x-coordinates are translated while
 * y-coordinates are fixed.
 *
 * The first parameter, `angle`, is the amount to shear. For example, calling
 * `shearX(1)` transforms all x-coordinates using the formula
 * `x = x + y * tan(angle)`. `shearX()` interprets angle values using the
 * current <a href="#/p5/angleMode">angleMode()</a>.
 *
 * By default, transformations accumulate. For example, calling
 * `shearX(1)` twice has the same effect as calling `shearX(2)` once. The
 * <a href="#/p5/push">push()</a> and
 * <a href="#/p5/pop">pop()</a> functions can be used to isolate
 * transformations within distinct drawing groups.
 *
 * Note: Transformations are reset at the beginning of the draw loop. Calling
 * `shearX(1)` inside the <a href="#/p5/draw">draw()</a> function won't
 * cause shapes to shear continuously.
 *
 * @method shearX
 * @param  {Number} angle angle to shear by in the current <a href="#/p5/angleMode">angleMode()</a>.
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('A white quadrilateral on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Shear the coordinate system along the x-axis.
 *   shearX(QUARTER_PI);
 *
 *   // Draw the square.
 *   square(0, 0, 50);
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
 *   describe('A white quadrilateral on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Shear the coordinate system along the x-axis.
 *   shearX(45);
 *
 *   // Draw the square.
 *   square(0, 0, 50);
 * }
 * </code>
 * </div>
 */
p5.prototype.shearX = function(angle) {
  p5._validateParameters('shearX', arguments);
  const rad = this._toRadians(angle);
  this._renderer.applyMatrix(1, 0, Math.tan(rad), 1, 0, 0);
  return this;
};

/**
 * Shears the y-axis so that shapes appear skewed.
 *
 * By default, the x- and y-axes are perpendicular. The `shearY()` function
 * transforms the coordinate system so that y-coordinates are translated while
 * x-coordinates are fixed.
 *
 * The first parameter, `angle`, is the amount to shear. For example, calling
 * `shearY(1)` transforms all y-coordinates using the formula
 * `y = y + x * tan(angle)`. `shearY()` interprets angle values using the
 * current <a href="#/p5/angleMode">angleMode()</a>.
 *
 * By default, transformations accumulate. For example, calling
 * `shearY(1)` twice has the same effect as calling `shearY(2)` once. The
 * <a href="#/p5/push">push()</a> and
 * <a href="#/p5/pop">pop()</a> functions can be used to isolate
 * transformations within distinct drawing groups.
 *
 * Note: Transformations are reset at the beginning of the draw loop. Calling
 * `shearY(1)` inside the <a href="#/p5/draw">draw()</a> function won't
 * cause shapes to shear continuously.
 *
 * @method shearY
 * @param  {Number} angle angle to shear by in the current <a href="#/p5/angleMode">angleMode()</a>.
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('A white quadrilateral on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Shear the coordinate system along the x-axis.
 *   shearY(QUARTER_PI);
 *
 *   // Draw the square.
 *   square(0, 0, 50);
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
 *   describe('A white quadrilateral on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Shear the coordinate system along the x-axis.
 *   shearY(45);
 *
 *   // Draw the square.
 *   square(0, 0, 50);
 * }
 * </code>
 * </div>
 */
p5.prototype.shearY = function(angle) {
  p5._validateParameters('shearY', arguments);
  const rad = this._toRadians(angle);
  this._renderer.applyMatrix(1, Math.tan(rad), 0, 1, 0, 0);
  return this;
};

/**
 * Translates the coordinate system.
 *
 * By default, the origin `(0, 0)` is at the sketch's top-left corner in 2D
 * mode and center in WebGL mode. The `translate()` function shifts the origin
 * to a different position. Everything drawn after `translate()` is called
 * will appear to be shifted. There are two ways to call `translate()` with
 * parameters that set the origin's position.
 *
 * The first way to call `translate()` uses numbers to set the amount of
 * translation. The first two parameters, `x` and `y`, set the amount to
 * translate along the positive x- and y-axes. For example, calling
 * `translate(20, 30)` translates the origin 20 pixels along the x-axis and 30
 * pixels along the y-axis. The third parameter, `z`, is optional. It sets the
 * amount to translate along the positive z-axis. For example, calling
 * `translate(20, 30, 40)` translates the origin 20 pixels along the x-axis,
 * 30 pixels along the y-axis, and 40 pixels along the z-axis.
 *
 * The second way to call `translate()` uses a
 * <a href="#/p5.Vector">p5.Vector</a> object to set the amount of
 * translation. For example, calling `translate(myVector)` uses the x-, y-,
 * and z-components of `myVector` to set the amount to translate along the x-,
 * y-, and z-axes. Doing so is the same as calling
 * `translate(myVector.x, myVector.y, myVector.z)`.
 *
 * By default, transformations accumulate. For example, calling
 * `translate(10, 0)` twice has the same effect as calling
 * `translate(20, 0)` once. The <a href="#/p5/push">push()</a> and
 * <a href="#/p5/pop">pop()</a> functions can be used to isolate
 * transformations within distinct drawing groups.
 *
 * Note: Transformations are reset at the beginning of the draw loop. Calling
 * `translate(10, 0)` inside the <a href="#/p5/draw">draw()</a> function won't
 * cause shapes to move continuously.
 *
 * @method translate
 * @param  {Number} x amount to translate along the positive x-axis.
 * @param  {Number} y amount to translate along the positive y-axis.
 * @param  {Number} [z] amount to translate along the positive z-axis.
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('A white circle on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Translate the origin to the center.
 *   translate(50, 50);
 *
 *   // Draw a circle at coordinates (0, 0).
 *   circle(0, 0, 40);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'Two circles drawn on a gray background. The blue circle on the right overlaps the red circle at the center.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Translate the origin to the center.
 *   translate(50, 50);
 *
 *   // Draw the red circle.
 *   fill('red');
 *   circle(0, 0, 40);
 *
 *   // Translate the origin to the right.
 *   translate(25, 0);
 *
 *   // Draw the blue circle.
 *   fill('blue');
 *   circle(0, 0, 40);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('A white circle moves slowly from left to right on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Calculate the x-coordinate.
 *   let x = frameCount * 0.2;
 *
 *   // Translate the origin.
 *   translate(x, 50);
 *
 *   // Draw a circle at coordinates (0, 0).
 *   circle(0, 0, 40);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe('A white circle on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Create a p5.Vector object.
 *   let v = createVector(50, 50);
 *
 *   // Translate the origin by the vector.
 *   translate(v);
 *
 *   // Draw a circle at coordinates (0, 0).
 *   circle(0, 0, 40);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe(
 *     'Two spheres sitting side-by-side on gray background. The sphere at the center is red. The sphere on the right is blue.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Turn on the lights.
 *   lights();
 *
 *   // Style the spheres.
 *   noStroke();
 *
 *   // Draw the red sphere.
 *   fill('red');
 *   sphere(10);
 *
 *   // Translate the origin to the right.
 *   translate(30, 0, 0);
 *
 *   // Draw the blue sphere.
 *   fill('blue');
 *   sphere(10);
 * }
 * </code>
 * </div>
 */
/**
 * @method translate
 * @param  {p5.Vector} vector vector by which to translate.
 * @chainable
 */
p5.prototype.translate = function(x, y, z) {
  p5._validateParameters('translate', arguments);
  if (this._renderer.isP3D) {
    this._renderer.translate(x, y, z);
  } else {
    this._renderer.translate(x, y);
  }
  return this;
};

export default p5;
