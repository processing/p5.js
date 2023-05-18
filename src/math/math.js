/**
 * @module Math
 * @submodule Vector
 * @for p5
 * @requires core
 */

import p5 from '../core/main';

/**
 * Creates a new <a href="#/p5.Vector">p5.Vector</a> (the datatype for storing vectors). This provides a
 * two or three-dimensional vector, specifically a Euclidean (also known as
 * geometric) vector. A vector is an entity that has both magnitude and
 * direction.
 *
 * Vectors created with createVector() are slightly different than vectors created with new p5.Vector(),
 * as they have references to some p5.js functions.
 * When using <a href="#/p5.Vector/rotate">rotate()</a> and <a href="#/p5.Vector/setHeading">setHeading()</a>,
 * the method of specifying arguments differs depending on the angleMode.
 * Must be in the range 0-360 if DEGREES is specified.
 * Also, the results of <a href="#/p5.Vector/heading">heading()</a> and <a href="#/p5.Vector/angleBetween">angleBetween()</a>
 * return values in the range 0 to 360 when DEGREES is specified for angleMode.
 * For vectors created in the form new p5.Vector() , both the value specification and return range are always in radians.
 * It is not affected by angleMode().
 *
 * @method createVector
 * @param {Number} [x] x component of the vector
 * @param {Number} [y] y component of the vector
 * @param {Number} [z] z component of the vector
 * @return {p5.Vector}
 * @example
 * <div class = "norender">
 * <code>
 * function setup() {
 *   angleMode(DEGREES);
 *
 *   const v1 = createVector(1, 1);
 *   print(v1.heading()); // 45
 *
 *   const v2 = new p5.Vector(1, 1);
 *   print(v2.heading()); // 0.7853981633974483
 * }
 * </code>
 * </div>
 *
 * <div><code>
 * let v1;
 * function setup() {
 *   createCanvas(100, 100);
 *   stroke(255, 0, 255);
 *   v1 = createVector(width / 2, height / 2);
 * }
 *
 * function draw() {
 *   background(255);
 *   line(v1.x, v1.y, mouseX, mouseY);
 *   describe('draws a line from center of canvas to mouse pointer position.');
 * }
 * </code></div>
 */
p5.prototype.createVector = function(x, y, z) {
  if (this instanceof p5) {
    return new p5.Vector(
      this._fromRadians.bind(this),
      this._toRadians.bind(this),
      this.random.bind(this),
      ...arguments
    );
  } else {
    return new p5.Vector(x, y, z);
  }
};

export default p5;
