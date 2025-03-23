/**
 * @module Math
 * @requires constants
 * @todo see methods below needing further implementation.
 * future consideration: implement SIMD optimizations
 * when browser compatibility becomes available
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/
 *   Reference/Global_Objects/SIMD
 */
import { Matrix } from './Matrices/Matrix'
// import { MatrixNumjs as Matrix } from './Matrices/MatrixNumjs'



function matrix(p5, fn){
  /**
   * A class to describe a 4×4 matrix
   * for model and view matrix manipulation in the p5js webgl renderer.
   * @class p5.Matrix
   * @extends MatrixInterface
   * @param {Array} [mat4] column-major array literal of our 4×4 matrix
   * @example
   * // Creating a 3x3 matrix from an array using column major arrangement
   * const matrix = new Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   *
   * // Creating a 4x4 identity matrix
   * const identityMatrix = new Matrix(4);
   *
   * // Adding two matrices
   * const matrix1 = new Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   * const matrix2 = new Matrix([9, 8, 7, 6, 5, 4, 3, 2, 1]);
   * matrix1.add(matrix2); // matrix1 is now [10, 10, 10, 10, 10, 10, 10, 10, 10]
   *
   * // Setting an element in the matrix
   * matrix.setElement(0, 10); // matrix is now [10, 2, 3, 4, 5, 6, 7, 8, 9]
   *
   * // Resetting the matrix to an identity matrix
   * matrix.reset();
   *
   * // Getting the diagonal elements of the matrix
   * const diagonal = matrix.diagonal(); // [1, 1, 1]
   *
   * // Transposing the matrix
   * matrix.transpose();
   *
   * // Multiplying two matrices
   * matrix1.mult(matrix2);
   *
   * // Inverting the matrix
   * matrix.invert();
   *
   * // Scaling the matrix
   * matrix.scale(2, 2, 2);
   *
   * // Rotating the matrix around an axis
   * matrix.rotate4x4(Math.PI / 4, 1, 0, 0);
   *
   * // Applying a perspective transformation
   * matrix.perspective(Math.PI / 4, 1, 0.1, 100);
   *
   * // Applying an orthographic transformation
   * matrix.ortho(-1, 1, -1, 1, 0.1, 100);
   *
   * // Multiplying a vector by the matrix
   * const vector = new Vector(1, 2, 3);
   * const result = matrix.multiplyPoint(vector);
   *
   * // p5.js script example
   * <div><code>
   * function setup() {
   *   noCanvas();
   *   // Create a 4x4 identity matrix
   *   const matrix = new Matrix(4);
   *   console.log("Original Matrix:", matrix.matrix);
   *
   *   // Add two matrices
   *   const matrix1 = new Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   *   const matrix2 = new Matrix([9, 8, 7, 6, 5, 4, 3, 2, 1]);
   *   matrix1.add(matrix2);
   *   console.log("After Addition:", matrix1.matrix); // Output: [10, 10, 10, 10, 10, 10, 10, 10, 10]
   *
   *   // Reset the matrix to an identity matrix
   *   matrix.reset();
   *   console.log("Reset Matrix:", matrix.matrix);
   *
   *   // Apply a scaling transformation
   *   matrix.scale(2, 2, 2);
   *   console.log("Scaled Matrix:", matrix.matrix);
   *
   *   // Apply a rotation around the X-axis
   *   matrix.rotate4x4(Math.PI / 4, 1, 0, 0);
   *   console.log("Rotated Matrix (X-axis):", matrix.matrix);
   *
   *   // Apply a perspective transformation
   *   matrix.perspective(Math.PI / 4, 1, 0.1, 100);
   *   console.log("Perspective Matrix:", matrix.matrix);
   *
   *   // Multiply a vector by the matrix
   *   const vector = new Vector(1, 2, 3);
   *   const transformedVector = matrix.multiplyPoint(vector);
   *   console.log("Transformed Vector:", transformedVector.toString());
   * }
   * </code></div>
   */
  p5.Matrix = Matrix;
}

export default matrix;
export { Matrix };

if(typeof p5 !== 'undefined'){
  matrix(p5, p5.prototype);
}
