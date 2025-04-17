/**
 * @module Math
 * @for p5
 * @requires core
 */

function math(p5, fn) {
  /**
   * Creates a new <a href="#/p5.Vector">p5.Vector</a> object.
   *
   * A vector can be thought of in different ways. In one view, a vector is like
   * an arrow pointing in space. Vectors have both magnitude (length) and
   * direction. This view is helpful for programming motion.
   *
   * A vector's components determine its magnitude and direction. For example,
   * calling `createVector(3, 4)` creates a new
   * <a href="#/p5.Vector">p5.Vector</a> object with an x-component of 3 and a
   * y-component of 4. From the origin, this vector's tip is 3 units to the
   * right and 4 units down.
   *
   * You can also pass N dimensions to the `createVector` function. For example,
   * calling `createVector(1, 2, 3, 4)` creates a vector with four components.
   * This allows for flexibility in representing vectors in higher-dimensional
   * spaces.
   *
   * <a href="#/p5.Vector">p5.Vector</a> objects are often used to program
   * motion because they simplify the math. For example, a moving ball has a
   * position and a velocity. Position describes where the ball is in space. The
   * ball's position vector extends from the origin to the ball's center.
   * Velocity describes the ball's speed and the direction it's moving. If the
   * ball is moving straight up, its velocity vector points straight up. Adding
   * the ball's velocity vector to its position vector moves it, as in
   * `pos.add(vel)`. Vector math relies on methods inside the
   * <a href="#/p5.Vector">p5.Vector</a> class.
   *
   * @method createVector
   * @param {...Number} components Components of the vector.
   * @return {p5.Vector} new <a href="#/p5.Vector">p5.Vector</a> object.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create p5.Vector objects.
   *   let p1 = createVector(25, 25);
   *   let p2 = createVector(50, 50);
   *   let p3 = createVector(75, 75);
   *
   *   // Draw the dots.
   *   strokeWeight(5);
   *   point(p1);
   *   point(p2);
   *   point(p3);
   *
   *   describe('Three black dots form a diagonal line from top left to bottom right.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let pos;
   * let vel;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create p5.Vector objects.
   *   pos = createVector(50, 100);
   *   vel = createVector(0, -1);
   *
   *   describe('A black dot moves from bottom to top on a gray square. The dot reappears at the bottom when it reaches the top.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Add velocity to position.
   *   pos.add(vel);
   *
   *   // If the dot reaches the top of the canvas,
   *   // restart from the bottom.
   *   if (pos.y < 0) {
   *     pos.y = 100;
   *   }
   *
   *   // Draw the dot.
   *   strokeWeight(5);
   *   point(pos);
   * }
   * </code>
   * </div>
   */
  fn.createVector = function (x, y, z) {
    if (this instanceof p5) {
      return new p5.Vector(
        this._fromRadians.bind(this),
        this._toRadians.bind(this),
        ...arguments
      );
    } else {
      return new p5.Vector(x, y, z);
    }
  };

  /**
   * Creates a new <a href="#/p5.Matrix">p5.Matrix</a> object.
   *
   * A matrix is a mathematical concept that is useful in many fields, including
   * computer graphics. In p5.js, matrices are used to perform transformations
   * on shapes and images. The `createMatrix` method can take a column-major
   * array representation of a square matrix as an argument. In the current implementation we only use squared matrices.
   *
   * @private
   * @method createMatrix
   * @param {Array<Number>} components Column-major array representation of the square matrix.
   *
   * @return {p5.Matrix} new <a href="#/p5.Matrix">p5.Matrix</a> object.
   *
   * @example
   * <div class="norender">
   * <code>
   * function setup() {
   *   let matrix = createMatrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   * }
   * </code>
   * </div>
   */
  fn.createMatrix = function (...args) {
    return new p5.Matrix(...args);
  };
}

export default math;

if (typeof p5 !== "undefined") {
  math(p5, p5.prototype);
}
