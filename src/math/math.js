/**
 * @module Math
 * @submodule Math
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');


/**
 * Creates a new p5.Vector (the datatype for storing vectors). This provides a
 * two or three dimensional vector, specifically a Euclidean (also known as
 * geometric) vector. A vector is an entity that has both magnitude and
 * direction.
 *
 * @method createVector
 * @param {Number} [x] x component of the vector
 * @param {Number} [y] y component of the vector
 * @param {Number} [z] z component of the vector
 */
p5.prototype.createVector = function (x, y, z) {
  if (this instanceof p5) {
    return new p5.Vector(this, arguments);
  } else {
    return new p5.Vector(x, y, z);
  }
};

module.exports = p5;
