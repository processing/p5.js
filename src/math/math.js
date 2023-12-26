/**
 * @module Math
 * @submodule Vector
 * @for p5
 * @requires core
 */

import p5 from '../core/main';

/**
 * Creates a new <a href="#/p5.Vector">p5.Vector</a> object. A vector is like
 * an arrow pointing in space. Vectors have both magnitude (length)
 * and direction. Calling `createVector()` without arguments sets the new
 * vector's components to 0.
 *
 * <a href="#/p5.Vector">p5.Vector</a> objects are often used to program
 * motion because they simplify the math. For example, a moving ball has a
 * position and velocity. Position describes where the ball is in space. The
 * ball's position vector extends from the origin to the ball's center.
 * Velocity describes the ball's speed and the direction it's moving. If the
 * ball is moving straight up, its velocity vector points straight up. Adding
 * the ball's velocity vector to its position vector moves it, as in
 * `pos.add(vel)`. Vector math relies on methods inside the
 * <a href="#/p5.Vector">p5.Vector</a> class.
 *
 * @method createVector
 * @param {Number} [x] x component of the vector.
 * @param {Number} [y] y component of the vector.
 * @param {Number} [z] z component of the vector.
 * @return {p5.Vector} new <a href="#/p5.Vector">p5.Vector</a> object.
 * @example
 * <div>
 * <code>
 * let p1 = createVector(25, 25);
 * let p2 = createVector(50, 50);
 * let p3 = createVector(75, 75);
 *
 * strokeWeight(5);
 * point(p1);
 * point(p2);
 * point(p3);
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
 *   pos = createVector(width / 2, height);
 *   vel = createVector(0, -1);
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   pos.add(vel);
 *
 *   if (pos.y < 0) {
 *     pos.y = height;
 *   }
 *
 *   strokeWeight(5);
 *   point(pos);
 *
 *   describe('A black dot moves from bottom to top on a gray square. The dot reappears at the bottom when it reaches the top.');
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
