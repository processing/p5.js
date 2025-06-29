/**
 * @module Math
 * @requires constants
 * @todo see methods below needing further implementation.
 * future consideration: implement SIMD optimizations
 * when browser compatibility becomes available
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/
 *   Reference/Global_Objects/SIMD
 */
import { Matrix } from "./Matrices/Matrix";
// import { MatrixNumjs as Matrix } from './Matrices/MatrixNumjs'

function matrix(p5, fn) {
  /**
   * A class to describe a matrix
   * for model and view matrix manipulation in the p5js webgl renderer.
   * The `Matrix` class represents a mathematical matrix and provides various methods for matrix operations.
   *
   * The `Matrix` class represents a mathematical matrix and provides various methods for matrix operations.
   * This class extends the `MatrixInterface` and includes methods for creating, manipulating, and performing
   * operations on matrices. It supports both 3x3 and 4x4 matrices, as well as general NxN matrices.
   * @private
   * @class p5.Matrix
   * @param {Array} [mat4] column-major array literal of our 4×4 matrix
   * @example
   * // Creating a 3x3 matrix from an array using column major arrangement
   * const matrix = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   *
   * // Creating a 4x4 identity matrix
   * const identityMatrix = new p5.Matrix(4);
   *
   * // Adding two matrices
   * const matrix1 = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   * const matrix2 = new p5.Matrix([9, 8, 7, 6, 5, 4, 3, 2, 1]);
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
   * <div class="norender"><code>
   * function setup() {
   *
   *   // Create a 4x4 identity matrix
   *   const matrix = new p5.Matrix(4);
   *   console.log("Original p5.Matrix:", matrix.matrix.toString()); // Output: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
   *
   *   // Add two matrices
   *   const matrix1 = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   *   const matrix2 = new p5.Matrix([9, 8, 7, 6, 5, 4, 3, 2, 1]);
   *   matrix1.add(matrix2);
   *   console.log("After Addition:", matrix1.matrix.toString()); // Output: [10, 10, 10, 10, 10, 10, 10, 10, 10]
   *
   *   // Reset the matrix to an identity matrix
   *   matrix.reset();
   *   console.log("Reset p5.Matrix:", matrix.matrix.toString()); // [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
   *
   *   // Apply a scaling transformation
   *   matrix.scale(2, 2, 2);
   *   console.log("Scaled p5.Matrix:", matrix.matrix.toString()); // [2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1]
   *
   *   // Apply a rotation around the X-axis
   *   matrix.rotate4x4(Math.PI / 4, 1, 0, 0);
   *   console.log("Rotated p5.Matrix (X-axis):", matrix.matrix.toString()); // [2, 0, 0, 0, 0, 1.4142135381698608, 1.4142135381698608, 0, 0, -1.4142135381698608, 1.4142135381698608, 0, 0, 0, 0, 1]
   *
   *   // Apply a perspective transformation
   *   matrix.perspective(Math.PI / 4, 1, 0.1, 100);
   *   console.log("Perspective p5.Matrix:", matrix.matrix.toString());// [2.4142136573791504, 0, 0, 0, 0, 2.4142136573791504, 0, 0, 0, 0, -1.0020020008087158, -1, 0, 0, -0.20020020008087158, 0]
   *
   *   // Multiply a vector by the matrix
   *   const vector = new p5.Vector(1, 2, 3);
   *   const transformedVector = matrix.multiplyPoint(vector);
   *   console.log("Transformed Vector:", transformedVector.toString());
   * }
   * </code></div>
   */
  p5.Matrix = Matrix;
}

export default matrix;
export { Matrix };

if (typeof p5 !== "undefined") {
  matrix(p5, p5.prototype);
}
