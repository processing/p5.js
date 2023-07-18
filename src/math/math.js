/**
 * @module Math
 * @submodule Vector
 * @for p5
 * @requires core
 */

import p5 from '../core/main';

/**
 * Creates a new <a href="#/p5.Vector">p5.Vector</a> object. A vector is like
 * an arrow pointing in 2D or 3D space. Vectors have both magnitude (length)
 * and direction. They are often used to program motion.
 *
 * @method createVector
 * @param {Number} [x] x component of the vector.
 * @param {Number} [y] y component of the vector.
 * @param {Number} [z] z component of the vector.
 * @return {p5.Vector}
 * @example
 * <div>
 * <code>
 * let v1 = createVector(25, 25);
 * let v2 = createVector(50, 50);
 * let v3 = createVector(75, 75);
 *
 * strokeWeight(5);
 * point(v1);
 * point(v2);
 * point(v3);
 *
 * describe('Three black dots form a diagonal line from top left to bottom right.');
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
 *   pos = createVector(50, 50);
 *   vel = createVector(1, 0);
 *
 *   describe('A black dot moves from left to right on a gray square. The dot returns to the left when it reaches the right.');
 * }
 *
 * function draw() {
 *   background(220);
 *
 *   pos.add(vel);
 *
 *   strokeWeight(5);
 *   point(pos);
 *
 *   if (pos.x > width) {
 *     pos.x = 0;
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype.createVector = function(x, y, z) {
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

export default p5;
