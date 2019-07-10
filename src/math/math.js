/**
 * @module Math
 * @submodule Math
 * @for p5
 * @requires core
 */

'use strict';

import p5 from '../core/main';

/**
 * Creates a new <a href="#/p5.Vector">p5.Vector</a> (the datatype for storing vectors). This provides a
 * two or three dimensional vector, specifically a Euclidean (also known as
 * geometric) vector. A vector is an entity that has both magnitude and
 * direction.
 *
 * @method createVector
 * @param {Number} [x] x component of the vector
 * @param {Number} [y] y component of the vector
 * @param {Number} [z] z component of the vector
 * @return {p5.Vector}
 * @example
 * <div modernizr='webgl'><code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   noStroke();
 *   fill(255, 102, 204);
 * }
 *
 * function draw() {
 *   background(255);
 *   pointLight(color(255), createVector(sin(millis() / 1000) * 20, -40, -10));
 *   scale(0.75);
 *   sphere();
 * }
 * </code></div>
 *
 * @alt
 * a purple sphere lit by a point light oscillating horizontally
 */
p5.prototype.createVector = function(x, y, z) {
  if (this instanceof p5) {
    return new p5.Vector(this, arguments);
  } else {
    return new p5.Vector(x, y, z);
  }
};

export default p5;
