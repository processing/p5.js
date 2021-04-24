/**
 * @module Math
 * @submodule Matrix
 * @for p5
 * @requires core
 */

import p5 from '../core/main';

/**
 * Creates a new <a href="#/p5.MatrixTensor">p5.MatrixTensor</a> (the datatype for storing matrices). This provides a
 * n by n matrix.
 *
 * @method createMatrixTensor
 * @param {Number} [x] the x component of the matrix
 * @param {Number} [y] the y component of the matrix
 * @return {p5.MatrixTensor}
 * @example
 * <div><code>
 * let m1;
 * function setup() {
 *   createCanvas(100, 100);
 *   stroke(0);
 *   //Creating the matrix
 *   m1 = createMatrixTensor(3, 4);
 *   //Setting values
 *   m1.randomize(0, 1);
 *   m1.map(x => round(x * 10) / 10);
 * }
 * function draw() {
 *   background(121);
 *   translate(12, 25);
 *   for (let x = 0; x < m1.cols; x++) {
 *     for (let y = 0; y < m1.rows; y++) {
 *       text(m1.getValue(x, y), x * 30, y * 20);
 *     }
 *   }
 * }
 * </code></div>
 */
p5.prototype.createMatrixTensor = function(x, y) {
  if (this instanceof p5) {
    return new p5.MatrixTensor(this, arguments);
  } else {
    return new p5.MatrixTensor(x, y);
  }
};

export default p5;
