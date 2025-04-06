/**
 * @module Math
 */

import { Vector } from "../p5.Vector";
import { MatrixInterface } from "./MatrixInterface";

const isPerfectSquare = (arr) => {
  const sqDimention = Math.sqrt(Array.from(arr).length);
  if (sqDimention % 1 !== 0) {
    throw new Error("Array length must be a perfect square.");
  }
  return true;
};

export let GLMAT_ARRAY_TYPE = Array;
export let isMatrixArray = (x) => Array.isArray(x);
if (typeof Float32Array !== "undefined") {
  GLMAT_ARRAY_TYPE = Float32Array;
  isMatrixArray = (x) => Array.isArray(x) || x instanceof Float32Array;
}

export class Matrix extends MatrixInterface {
  matrix;
  #sqDimention;

  constructor(...args) {
    super(...args);
    // This is default behavior when object
    // instantiated using createMatrix()
    if (isMatrixArray(args[0]) && isPerfectSquare(args[0])) {
      const sqDimention = Math.sqrt(Array.from(args[0]).length);
      this.#sqDimention = sqDimention;
      this.matrix = GLMAT_ARRAY_TYPE.from(args[0]);
    } else if (typeof args[0] === "number") {
      this.#sqDimention = Number(args[0]);
      this.matrix = this.#createIdentityMatrix(args[0]);
    }
    return this;
  }

  /**
   * Returns the 3x3 matrix if the dimensions are 3x3, otherwise returns `undefined`.
   *
   * This method returns the matrix if its dimensions are 3x3.
   * If the matrix is not 3x3, it returns `undefined`.
   *
   * @returns {Array|undefined} The 3x3 matrix or `undefined` if the matrix is not 3x3.
   */
  get mat3() {
    if (this.#sqDimention === 3) {
      return this.matrix;
    } else {
      return undefined;
    }
  }

  /**
   * Returns the 4x4 matrix if the dimensions are 4x4, otherwise returns `undefined`.
   *
   * This method returns the matrix if its dimensions are 4x4.
   * If the matrix is not 4x4, it returns `undefined`.
   *
   * @returns {Array|undefined} The 4x4 matrix or `undefined` if the matrix is not 4x4.
   */
  get mat4() {
    if (this.#sqDimention === 4) {
      return this.matrix;
    } else {
      return undefined;
    }
  }

  /**
   * Adds the corresponding elements of the given matrix to this matrix, if the dimentions are the same.
   *
   * @param {Matrix} matrix - The matrix to add to this matrix. It must have the same dimensions as this matrix.
   * @returns {Matrix} The resulting matrix after addition.
   * @throws {Error} If the matrices do not have the same dimensions.
   *
   * @example
   * const matrix1 = new p5.Matrix([1, 2, 3]);
   * const matrix2 = new p5.Matrix([4, 5, 6]);
   * matrix1.add(matrix2); // matrix1 is now [5, 7, 9]
   *
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   const matrix1 = new p5.Matrix([1, 2, 3, 4]);
   *   const matrix2 = new p5.Matrix([5, 6, 7, 8]);
   *   matrix1.add(matrix2);
   *   console.log(matrix1.matrix); // Output: [6, 8, 10, 12]
   * }
   * </code></div>
   */
  add(matrix) {
    if (this.matrix.length !== matrix.matrix.length) {
      throw new Error("Matrices must be of the same dimension to add.");
    }
    for (let i = 0; i < this.matrix.length; i++) {
      this.matrix[i] += matrix.matrix[i];
    }
    return this;
  }

  /**
   * Sets the value of a specific element in the matrix in column-major order.
   *
   * A matrix is stored in column-major order, meaning elements are arranged column by column.
   * This function allows you to update or change the value of a specific element
   * in the matrix by specifying its index in the column-major order and the new value.
   *
   * Parameters:
   * - `index` (number): The position in the matrix where the value should be set.
   *   Indices start from 0 and follow column-major order.
   * - `value` (any): The new value you want to assign to the specified element.
   *
   * Example:
   * If you have the following 3x3 matrix stored in column-major order:
   * ```
   * [
   *   1, 4, 7,  // Column 1
   *   2, 5, 8,  // Column 2
   *   3, 6, 9   // Column 3
   * ]
   * ```
   * Calling `setElement(4, 10)` will update the element at index 4
   * (which corresponds to row 2, column 2 in row-major order) to `10`.
   * The updated matrix will look like this:
   * ```
   * [
   *   1, 4, 7,
   *   2, 10, 8,
   *   3, 6, 9
   * ]
   * ```
   *
   * This function is useful for modifying specific parts of the matrix without
   * having to recreate the entire structure.
   *
   * @param {Number} index - The position in the matrix where the value should be set.
   *                         Must be a non-negative integer less than the length of the matrix.
   * @param {Number} value - The new value to be assigned to the specified position in the matrix.
   * @returns {Matrix} The current instance of the Matrix, allowing for method chaining.
   *
   * @example
   * // Assuming matrix is an instance of Matrix with initial values [1, 2, 3, 4] matrix.setElement(2, 99);
   * // Now the matrix values are [1, 2, 99, 4]
   *
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   const matrix = new p5.Matrix([1, 2, 3, 4]);
   *   matrix.setElement(2, 99);
   *   console.log(matrix.matrix); // Output: [1, 2, 99, 4]
   * }
   * </code></div>
   */
  setElement(index, value) {
    if (index >= 0 && index < this.matrix.length) {
      this.matrix[index] = value;
    }
    return this;
  }

  /**
   * Resets the current matrix to an identity matrix.
   *
   * This method replaces the current matrix with an identity matrix of the same dimensions.
   * An identity matrix is a square matrix with ones on the main diagonal and zeros elsewhere.
   * This is useful for resetting transformations or starting fresh with a clean matrix.
   *
   * @returns {Matrix} The current instance of the Matrix class, allowing for method chaining.
   *
   * @example
   * // Resetting a 4x4 matrix to an identity matrix
   * const matrix = new p5.Matrix(4);
   * matrix.scale(2, 2, 2); // Apply some transformations
   * console.log(matrix.matrix); // Output: Transformed matrix
   * matrix.reset(); // Reset to identity matrix
   * console.log(matrix.matrix); // Output: Identity matrix
   *
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   const matrix = new p5.Matrix(4);
   *   matrix.scale(2, 2, 2); // Apply scaling transformation
   *   console.log("Before reset:", matrix.matrix);
   *   matrix.reset(); // Reset to identity matrix
   *   console.log("After reset:", matrix.matrix);
   * }
   * </code></div>
   */
  reset() {
    this.matrix = this.#createIdentityMatrix(this.#sqDimention);
    return this;
  }

  /**
   * Replace the entire contents of a NxN matrix.
   *
   * This method allows you to replace the values of the current matrix with
   * those from another matrix, an array, or individual arguments. The input
   * can be a `Matrix` instance, an array of numbers, or individual numbers
   * that match the dimensions of the current matrix. The values are copied
   * without referencing the source object, ensuring that the original input
   * remains unchanged.
   *
   * If the input dimensions do not match the current matrix, an error will
   * be thrown to ensure consistency.
   *
   * @param {Matrix|Float32Array|Number[]} [inMatrix] - The input matrix, array,
   * or individual numbers to replace the current matrix values.
   * @returns {Matrix} The current instance of the Matrix class, allowing for
   * method chaining.
   *
   * @example
   * // Replacing the contents of a matrix with another matrix
   * const matrix1 = new p5.Matrix([1, 2, 3, 4]);
   * const matrix2 = new p5.Matrix([5, 6, 7, 8]);
   * matrix1.set(matrix2);
   * console.log(matrix1.matrix); // Output: [5, 6, 7, 8]
   *
   * // Replacing the contents of a matrix with an array
   * const matrix = new p5.Matrix([1, 2, 3, 4]);
   * matrix.set([9, 10, 11, 12]);
   * console.log(matrix.matrix); // Output: [9, 10, 11, 12]
   *
   * // Replacing the contents of a matrix with individual numbers
   * const matrix = new p5.Matrix(4); // Creates a 4x4 identity matrix
   * matrix.set(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
   * console.log(matrix.matrix); // Output: [1, 2, 3, ..., 16]
   *
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   const matrix = new p5.Matrix([1, 2, 3, 4]);
   *   console.log("Before set:", matrix.matrix);
   *   matrix.set([5, 6, 7, 8]);
   *   console.log("After set:", matrix.matrix); // Output: [5, 6, 7, 8]
   * }
   * </code></div>
   */
  set(inMatrix) {
    let refArray = GLMAT_ARRAY_TYPE.from([...arguments]);
    if (inMatrix instanceof Matrix) {
      refArray = GLMAT_ARRAY_TYPE.from(inMatrix.matrix);
    } else if (isMatrixArray(inMatrix)) {
      refArray = GLMAT_ARRAY_TYPE.from(inMatrix);
    }
    if (refArray.length !== this.matrix.length) {
      p5._friendlyError(
        `Expected same dimensions values but received different ${refArray.length}.`,
        "p5.Matrix.set"
      );
      return this;
    }
    this.matrix = refArray;
    return this;
  }

  /**
   * Gets a copy of the matrix, returns a p5.Matrix object.
   *
   * This method creates a new instance of the `Matrix` class and copies the
   * current matrix values into it. The returned matrix is independent of the
   * original, meaning changes to the copy will not affect the original matrix.
   *
   * This is useful when you need to preserve the current state of a matrix
   * while performing operations on a duplicate.
   *
   * @return {p5.Matrix} A new instance of the `Matrix` class containing the
   *                     same values as the original matrix.
   *
   * @example
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   const originalMatrix = new p5.Matrix([1, 2, 3, 4]);
   *   const copiedMatrix = originalMatrix.get();
   *   console.log("Original Matrix:", originalMatrix.matrix); // Output: [1, 2, 3, 4]
   *   console.log("Copied Matrix:", copiedMatrix.matrix); // Output: [1, 2, 3, 4]
   *
   *   // Modify the copied matrix
   *   copiedMatrix.setElement(2, 99);
   *   console.log("Modified Copied Matrix:", copiedMatrix.matrix); // Output: [1, 2, 99, 4]
   *   console.log("Original Matrix remains unchanged:", originalMatrix.matrix); // Output: [1, 2, 3, 4]
   * }
   * </code></div>
   */
  get() {
    return new Matrix(this.matrix); // TODO: Pass p5
  }

  /**
   * Return a copy of this matrix.
   * If this matrix is 4x4, a 4x4 matrix with exactly the same entries will be
   * generated. The same is true if this matrix is 3x3 or any NxN matrix.
   *
   * This method is useful when you need to preserve the current state of a matrix
   * while performing operations on a duplicate. The returned matrix is independent
   * of the original, meaning changes to the copy will not affect the original matrix.
   *
   * @return {p5.Matrix}   The result matrix.
   *
   * @example
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   const originalMatrix = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   *   const copiedMatrix = originalMatrix.copy();
   *   console.log("Original Matrix:", originalMatrix.matrix);
   *   console.log("Copied Matrix:", copiedMatrix.matrix);
   *
   *   // Modify the copied matrix
   *   copiedMatrix.setElement(4, 99);
   *   console.log("Modified Copied Matrix:", copiedMatrix.matrix);
   *   console.log("Original Matrix remains unchanged:", originalMatrix.matrix);
   * }
   * </code></div>
   */
  copy() {
    return new Matrix(this.matrix);
  }

  /**
   * Creates a copy of the current matrix instance.
   * This method is useful when you need a duplicate of the matrix
   * without modifying the original one.
   *
   * @returns {Matrix} A new matrix instance that is a copy of the current matrix.
   *
   * @example
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   const originalMatrix = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   *   const clonedMatrix = originalMatrix.clone();
   *   console.log("Original Matrix:", originalMatrix.matrix);
   *   console.log("Cloned Matrix:", clonedMatrix.matrix);
   *
   *   // Modify the cloned matrix
   *   clonedMatrix.setElement(4, 99);
   *   console.log("Modified Cloned Matrix:", clonedMatrix.matrix);
   *   console.log("Original Matrix remains unchanged:", originalMatrix.matrix);
   * }
   * </code></div>
   */
  clone() {
    return this.copy();
  }

  /**
   * Returns the diagonal elements of the matrix in the form of an array.
   * A NxN matrix will return an array of length N.
   *
   * This method extracts the diagonal elements of the matrix, which are the
   * elements where the row index equals the column index. For example, in a
   * 3x3 matrix:
   * ```
   * [
   *   1, 2, 3,
   *   4, 5, 6,
   *   7, 8, 9
   * ]
   * ```
   * The diagonal elements are [1, 5, 9].
   *
   * This is useful for operations that require the main diagonal of a matrix,
   * such as calculating the trace of a matrix or verifying if a matrix is diagonal.
   *
   * @return {Number[]} An array obtained by arranging the diagonal elements
   *                    of the matrix in ascending order of index.
   *
   * @example
   * // Extracting the diagonal elements of a matrix
   * const matrix = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   * const diagonal = matrix.diagonal(); // [1, 5, 9]
   *
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   const matrix = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   *   const diagonal = matrix.diagonal();
   *   console.log("Diagonal elements:", diagonal); // Output: [1, 5, 9]
   * }
   * </code></div>
   */
  diagonal() {
    const diagonal = [];
    for (let i = 0; i < this.#sqDimention; i++) {
      diagonal.push(this.matrix[i * (this.#sqDimention + 1)]);
    }
    return diagonal;
  }

  /**
   * This function is only for 3x3 matrices A function that returns a row vector of a NxN matrix.
   *
   * This method extracts a specific row from the matrix and returns it as a `p5.Vector`.
   * The row is determined by the `columnIndex` parameter, which specifies the column
   * index of the matrix. This is useful for operations that require working with
   * individual rows of a matrix, such as row transformations or dot products.
   *
   * @param {Number} columnIndex - The index of the column to extract as a row vector.
   *                               Must be a non-negative integer less than the matrix dimension.
   * @return {p5.Vector} A `p5.Vector` representing the extracted row of the matrix.
   *
   * @example
   * // Extracting a row vector from a 3x3 matrix
   * const matrix = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   * const rowVector = matrix.row(1); // Returns a vector [2, 5, 8]
   *
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   const matrix = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   *   const rowVector = matrix.row(1); // Extract the second row (index 1)
   *   console.log("Row Vector:", rowVector.toString()); // Output: Row Vector: [2, 5, 8]
   * }
   * </code></div>
   */
  row(columnIndex) {
    const columnVector = [];
    for (let i = 0; i < this.#sqDimention; i++) {
      columnVector.push(this.matrix[i * this.#sqDimention + columnIndex]);
    }
    return new Vector(...columnVector);
  }

  /**
   * A function that returns a column vector of a NxN matrix.
   *
   * This method extracts a specific column from the matrix and returns it as a `p5.Vector`.
   * The column is determined by the `rowIndex` parameter, which specifies the row index
   * of the matrix. This is useful for operations that require working with individual
   * columns of a matrix, such as column transformations or dot products.
   *
   * @param {Number} rowIndex - The index of the row to extract as a column vector.
   *                             Must be a non-negative integer less than the matrix dimension.
   * @return {p5.Vector} A `p5.Vector` representing the extracted column of the matrix.
   *
   * @example
   * // Extracting a column vector from a 3x3 matrix
   * const matrix = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   * const columnVector = matrix.column(1); // Returns a vector [4, 5, 6]
   *
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   const matrix = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   *   const columnVector = matrix.column(1); // Extract the second column (index 1)
   *   console.log("Column Vector:", columnVector.toString()); // Output: Column Vector: [4, 5, 6]
   * }
   * </code></div>
   */
  column(rowIndex) {
    const rowVector = [];
    for (let i = 0; i < this.#sqDimention; i++) {
      rowVector.push(this.matrix[rowIndex * this.#sqDimention + i]);
    }
    return new Vector(...rowVector);
  }

  /**
   * Transposes the given matrix `a` based on the square dimension of the matrix.
   *
   * This method rearranges the elements of the matrix such that the rows become columns
   * and the columns become rows. It handles matrices of different dimensions (4x4, 3x3, NxN)
   * by delegating to specific transpose methods for each case.
   *
   * If no argument is provided, the method transposes the current matrix instance.
   * If an argument is provided, it transposes the given matrix `a` and updates the current matrix.
   *
   * @param {Array} [a] - The matrix to be transposed. It should be a 2D array where each sub-array represents a row.
   *                      If omitted, the current matrix instance is transposed.
   * @returns {Matrix} - The current instance of the Matrix class, allowing for method chaining.
   *
   * @example
   * // Transposing a 3x3 matrix
   * const matrix = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   * matrix.transpose();
   * console.log(matrix.matrix); // Output: [1, 4, 7, 2, 5, 8, 3, 6, 9]
   *
   * // Transposing a 4x4 matrix
   * const matrix4x4 = new p5.Matrix(4);
   * matrix4x4.transpose();
   * console.log(matrix4x4.matrix); // Output: Transposed 4x4 identity matrix
   *
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   const matrix = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   *   console.log("Before transpose:", matrix.matrix);
   *   matrix.transpose();
   *   console.log("After transpose:", matrix.matrix); // Output: [1, 4, 7, 2, 5, 8, 3, 6, 9]
   * }
   * </code></div>
   */
  transpose(a) {
    if (this.#sqDimention === 4) {
      return this.#transpose4x4(a);
    } else if (this.#sqDimention === 3) {
      return this.#transpose3x3(a);
    } else {
      return this.#transposeNxN(a);
    }
  }

  /**
   * Multiplies the current matrix with another matrix or matrix-like array.
   *
   * This method supports several types of input:
   * - Another Matrix instance
   * - A matrix-like array (must be a perfect square, e.g., 4x4 or 3x3)
   * - Multiple arguments that form a perfect square matrix
   *
   * If the input is the same as the current matrix, a copy is made to avoid modifying the original matrix.
   *
   * The method determines the appropriate multiplication strategy based on the dimensions of the current matrix
   * and the input matrix. It supports 3x3, 4x4, and NxN matrices.
   *
   * @param {Matrix|Array|...number} multMatrix - The matrix or matrix-like array to multiply with.
   * @returns {Matrix|undefined} The resulting matrix after multiplication, or undefined if the input is invalid.
   * @chainable
   *
   * @example
   * // Multiplying two 3x3 matrices
   * const matrix1 = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   * const matrix2 = new p5.Matrix([9, 8, 7, 6, 5, 4, 3, 2, 1]);
   * matrix1.mult(matrix2);
   * console.log(matrix1.matrix); // Output: [30, 24, 18, 84, 69, 54, 138, 114, 90]
   *
   * // Multiplying a 4x4 matrix with another 4x4 matrix
   * const matrix4x4_1 = new p5.Matrix(4); // Identity matrix
   * const matrix4x4_2 = new p5.Matrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1]);
   * matrix4x4_1.mult(matrix4x4_2);
   * console.log(matrix4x4_1.matrix); // Output: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1]
   *
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   const matrix1 = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   *   const matrix2 = new p5.Matrix([9, 8, 7, 6, 5, 4, 3, 2, 1]);
   *   console.log("Before multiplication:", matrix1.matrix);
   *   matrix1.mult(matrix2);
   *   console.log("After multiplication:", matrix1.matrix); // Output: [30, 24, 18, 84, 69, 54, 138, 114, 90]
   * }
   * </code></div>
   */
  mult(multMatrix) {
    let _src;
    if (multMatrix === this || multMatrix === this.matrix) {
      _src = this.copy().matrix; // only need to allocate in this rare case
    } else if (multMatrix instanceof Matrix) {
      _src = multMatrix.matrix;
    } else if (isMatrixArray(multMatrix) && isPerfectSquare(multMatrix)) {
      _src = multMatrix;
    } else if (isPerfectSquare(arguments)) {
      _src = Array.from(arguments);
    } else {
      return; // nothing to do.
    }
    if (this.#sqDimention === 4 && _src.length === 16) {
      return this.#mult4x4(_src);
    } else if (this.#sqDimention === 3 && _src.length === 9) {
      return this.#mult3x3(_src);
    } else {
      return this.#multNxN(_src);
    }
  }

  /**
   * Takes a vector and returns the vector resulting from multiplying to that vector by this matrix from left. This function is only for 3x3 matrices.
   *
   * This method applies the current 3x3 matrix to a given vector, effectively
   * transforming the vector using the matrix. The resulting vector is returned
   * as a new vector or stored in the provided target vector.
   *
   * @param {p5.Vector} multVector - The vector to which this matrix applies.
   * @param {p5.Vector} [target] - The vector to receive the result. If not provided,
   *                               a copy of the input vector will be created and returned.
   * @return {p5.Vector} - The transformed vector after applying the matrix.
   *
   * @example
   * // Multiplying a 3x3 matrix with a vector
   * const matrix = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   * const vector = new p5.Vector(1, 2, 3);
   * const result = matrix.multiplyVec(vector);
   * console.log(result.toString()); // Output: Transformed vector
   *
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   const matrix = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   *   const vector = new p5.Vector(1, 2, 3);
   *   const result = matrix.multiplyVec(vector);
   *   console.log("Original Vector:", vector.toString()); // Output : Original Vector: [1, 2, 3]
   *   console.log("Transformed Vector:", result.toString()); // Output : Transformed Vector: [30, 36, 42]
   * }
   * </code></div>
   */
  multiplyVec(multVector, target) {
    if (target === undefined) {
      target = multVector.copy();
    }
    for (let i = 0; i < this.#sqDimention; i++) {
      target.values[i] = this.row(i).dot(multVector);
    }
    return target;
  }

  /**
   * Inverts a given matrix.
   *
   * This method inverts a matrix based on its dimensions. Currently, it supports
   * 3x3 and 4x4 matrices. If the matrix dimension is greater than 4, an error is thrown.
   *
   * For 4x4 matrices, it uses a specialized algorithm to compute the inverse.
   * For 3x3 matrices, it uses a different algorithm optimized for smaller matrices.
   *
   * If the matrix is singular (non-invertible), the method will return `null`.
   *
   * @param {Array} a - The matrix to be inverted. It should be a 2D array representing the matrix.
   * @returns {Array|null} - The inverted matrix, or `null` if the matrix is singular.
   * @throws {Error} - Throws an error if the matrix dimension is greater than 4.
   *
   * @example
   * // Inverting a 3x3 matrix
   * const matrix = new p5.Matrix([1, 2, 3, 0, 1, 4, 5, 6, 0]);
   * const invertedMatrix = matrix.invert();
   * console.log(invertedMatrix.matrix); // Output: Inverted 3x3 matrix
   *
   * // Inverting a 4x4 matrix
   * const matrix4x4 = new p5.Matrix(4); // Identity matrix
   * matrix4x4.scale(2, 2, 2);
   * const invertedMatrix4x4 = matrix4x4.invert();
   * console.log(invertedMatrix4x4.matrix); // Output: Inverted 4x4 matrix
   *
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   const matrix = new p5.Matrix([1, 2, 3, 0, 1, 4, 5, 6, 0]);
   *   console.log("Original Matrix:", matrix.matrix);
   *   const invertedMatrix = matrix.invert();
   *   if (invertedMatrix) {
   *     console.log("Inverted Matrix:", invertedMatrix.matrix);
   *   } else {
   *     console.log("Matrix is singular and cannot be inverted.");
   *   }
   * }
   * </code></div>
   */
  invert(a) {
    if (this.#sqDimention === 4) {
      return this.#invert4x4(a);
    } else if (this.#sqDimention === 3) {
      return this.#invert3x3(a);
    } else {
      throw new Error(
        "Invert is not implemented for N>4 at the moment, we are working on it"
      );
    }
  }

  /**
   * Creates a 3x3 matrix whose entries are the top left 3x3 part and returns it. This function is only for 4x4 matrices.
   *
   * This method extracts the top-left 3x3 portion of a 4x4 matrix and creates a new
   * 3x3 matrix from it. This is particularly useful in 3D graphics for operations
   * that require only the rotational or scaling components of a transformation matrix.
   *
   * If the current matrix is not 4x4, an error is thrown to ensure the method is used
   * correctly. The resulting 3x3 matrix is independent of the original matrix, meaning
   * changes to the new matrix will not affect the original.
   *
   * @return {p5.Matrix} A new 3x3 matrix containing the top-left portion of the original 4x4 matrix.
   * @throws {Error} If the current matrix is not 4x4.
   *
   * @example
   * // Extracting a 3x3 submatrix from a 4x4 matrix
   * const matrix4x4 = new p5.Matrix(4); // Creates a 4x4 identity matrix
   * matrix4x4.scale(2, 2, 2); // Apply scaling transformation
   * const subMatrix3x3 = matrix4x4.createSubMatrix3x3();
   * console.log("Original 4x4 Matrix:", matrix4x4.matrix);
   * console.log("Extracted 3x3 Submatrix:", subMatrix3x3.matrix);
   *
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   const matrix4x4 = new p5.Matrix(4); // Creates a 4x4 identity matrix
   *   matrix4x4.scale(2, 2, 2); // Apply scaling transformation
   *   console.log("Original 4x4 Matrix:", matrix4x4.matrix);
   *
   *   const subMatrix3x3 = matrix4x4.createSubMatrix3x3();
   *   console.log("Extracted 3x3 Submatrix:", subMatrix3x3.matrix);
   * }
   * </code></div>
   */
  createSubMatrix3x3() {
    if (this.#sqDimention === 4) {
      const result = new Matrix(3);
      result.mat3[0] = this.matrix[0];
      result.mat3[1] = this.matrix[1];
      result.mat3[2] = this.matrix[2];
      result.mat3[3] = this.matrix[4];
      result.mat3[4] = this.matrix[5];
      result.mat3[5] = this.matrix[6];
      result.mat3[6] = this.matrix[8];
      result.mat3[7] = this.matrix[9];
      result.mat3[8] = this.matrix[10];
      return result;
    } else {
      throw new Error("Matrix dimension must be 4 to create a 3x3 submatrix.");
    }
  }

  /**
   * Converts a 4×4 matrix to its 3×3 inverse transpose transform.
   * This is commonly used in MVMatrix to NMatrix conversions, particularly
   * in 3D graphics for transforming normal vectors.
   *
   * This method extracts the top-left 3×3 portion of a 4×4 matrix, inverts it,
   * and then transposes the result. If the matrix is singular (non-invertible),
   * the resulting matrix will be zeroed out.
   *
   * @param  {p5.Matrix} mat4 - The 4×4 matrix to be converted.
   * @returns {Matrix} The current instance of the Matrix class, allowing for method chaining.
   * @throws {Error} If the current matrix is not 3×3.
   *
   * @example
   * // Converting a 4×4 matrix to its 3×3 inverse transpose
   * const mat4 = new p5.Matrix(4); // Create a 4×4 identity matrix
   * mat4.scale(2, 2, 2); // Apply scaling transformation
   * const mat3 = new p5.Matrix(3); // Create a 3×3 matrix
   * mat3.inverseTranspose4x4(mat4);
   * console.log("Converted 3×3 Matrix:", mat3.matrix);
   *
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   const mat4 = new p5.Matrix(4); // Create a 4×4 identity matrix
   *   mat4.scale(2, 2, 2); // Apply scaling transformation
   *   console.log("Original 4×4 Matrix:", mat4.matrix);
   *
   *   const mat3 = new p5.Matrix(3); // Create a 3×3 matrix
   *   mat3.inverseTranspose4x4(mat4);
   *   console.log("Converted 3×3 Matrix:", mat3.matrix);
   * }
   * </code></div>
   */
  inverseTranspose4x4({ mat4 }) {
    if (this.#sqDimention !== 3) {
      throw new Error("This function only works with 3×3 matrices.");
    } else {
      // Convert mat4 -> mat3 by extracting the top-left 3×3 portion
      this.matrix[0] = mat4[0];
      this.matrix[1] = mat4[1];
      this.matrix[2] = mat4[2];
      this.matrix[3] = mat4[4];
      this.matrix[4] = mat4[5];
      this.matrix[5] = mat4[6];
      this.matrix[6] = mat4[8];
      this.matrix[7] = mat4[9];
      this.matrix[8] = mat4[10];
    }

    const inverse = this.invert();
    // Check if inversion succeeded
    if (inverse) {
      inverse.transpose(this.matrix);
    } else {
      // In case of singularity, zero out the matrix
      for (let i = 0; i < 9; i++) {
        this.matrix[i] = 0;
      }
    }
    return this;
  }

  /**
   * Applies a transformation matrix to the current matrix.
   *
   * This method multiplies the current matrix by another matrix, which can be provided
   * in several forms: another Matrix instance, an array representing a matrix, or as
   * individual arguments representing the elements of a 4x4 matrix.
   *
   * This operation is useful for combining transformations such as translation, rotation,
   * scaling, and perspective projection into a single matrix. By applying a transformation
   * matrix, you can modify the current matrix to represent a new transformation.
   *
   * @param {Matrix|Array|number} multMatrix - The matrix to multiply with. This can be:
   *   - An instance of the Matrix class.
   *   - An array of 16 numbers representing a 4x4 matrix.
   *   - 16 individual numbers representing the elements of a 4x4 matrix.
   * @returns {Matrix} The current matrix after applying the transformation.
   *
   * @example
   * <div class="norender"><code>
   * function setup() {
   *
   * // Assuming `matrix` is an instance of Matrix
   * const anotherMatrix = new p5.Matrix(4);
   * const anotherMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
   * matrix.apply(anotherMatrix);
   *
   * // Applying a transformation using an array
   * const matrixArray = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
   * matrix.apply(matrixArray);
   *
   * // Applying a transformation using individual arguments
   * matrix.apply(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
   *
   *
   *   // Create a 4x4 identity matrix
   *   const matrix = new p5.Matrix(4);
   *   console.log("Original Matrix:", matrix.matrix);
   *
   *   // Create a scaling transformation matrix
   *   const scalingMatrix = new p5.Matrix([2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1]);
   *
   *   // Apply the scaling transformation
   *   matrix.apply(scalingMatrix);
   *   console.log("After Scaling Transformation:", matrix.matrix);
   *
   *   // Apply a translation transformation using an array
   *   const translationMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 5, 5, 5, 1];
   *   matrix.apply(translationMatrix);
   *   console.log("After Translation Transformation:", matrix.matrix);
   * }
   * </code></div>
   */
  apply(multMatrix) {
    let _src;

    if (multMatrix === this || multMatrix === this.matrix) {
      _src = this.copy().matrix; // only need to allocate in this rare case
    } else if (multMatrix instanceof Matrix) {
      _src = multMatrix.matrix;
    } else if (isMatrixArray(multMatrix)) {
      _src = multMatrix;
    } else if (arguments.length === 16) {
      _src = arguments;
    } else {
      return; // nothing to do.
    }

    const mat4 = this.matrix;

    // each row is used for the multiplier
    const m0 = mat4[0];
    const m4 = mat4[4];
    const m8 = mat4[8];
    const m12 = mat4[12];
    mat4[0] = _src[0] * m0 + _src[1] * m4 + _src[2] * m8 + _src[3] * m12;
    mat4[4] = _src[4] * m0 + _src[5] * m4 + _src[6] * m8 + _src[7] * m12;
    mat4[8] = _src[8] * m0 + _src[9] * m4 + _src[10] * m8 + _src[11] * m12;
    mat4[12] = _src[12] * m0 + _src[13] * m4 + _src[14] * m8 + _src[15] * m12;

    const m1 = mat4[1];
    const m5 = mat4[5];
    const m9 = mat4[9];
    const m13 = mat4[13];
    mat4[1] = _src[0] * m1 + _src[1] * m5 + _src[2] * m9 + _src[3] * m13;
    mat4[5] = _src[4] * m1 + _src[5] * m5 + _src[6] * m9 + _src[7] * m13;
    mat4[9] = _src[8] * m1 + _src[9] * m5 + _src[10] * m9 + _src[11] * m13;
    mat4[13] = _src[12] * m1 + _src[13] * m5 + _src[14] * m9 + _src[15] * m13;

    const m2 = mat4[2];
    const m6 = mat4[6];
    const m10 = mat4[10];
    const m14 = mat4[14];
    mat4[2] = _src[0] * m2 + _src[1] * m6 + _src[2] * m10 + _src[3] * m14;
    mat4[6] = _src[4] * m2 + _src[5] * m6 + _src[6] * m10 + _src[7] * m14;
    mat4[10] = _src[8] * m2 + _src[9] * m6 + _src[10] * m10 + _src[11] * m14;
    mat4[14] = _src[12] * m2 + _src[13] * m6 + _src[14] * m10 + _src[15] * m14;

    const m3 = mat4[3];
    const m7 = mat4[7];
    const m11 = mat4[11];
    const m15 = mat4[15];
    mat4[3] = _src[0] * m3 + _src[1] * m7 + _src[2] * m11 + _src[3] * m15;
    mat4[7] = _src[4] * m3 + _src[5] * m7 + _src[6] * m11 + _src[7] * m15;
    mat4[11] = _src[8] * m3 + _src[9] * m7 + _src[10] * m11 + _src[11] * m15;
    mat4[15] = _src[12] * m3 + _src[13] * m7 + _src[14] * m11 + _src[15] * m15;

    return this;
  }

  /**
   * Scales a p5.Matrix by scalars or a vector.
   *
   * This method applies a scaling transformation to the current matrix.
   * Scaling is a transformation that enlarges or shrinks objects by a scale factor
   * along the x, y, and z axes. The scale factors can be provided as individual
   * numbers, an array, or a `p5.Vector`.
   *
   * If a `p5.Vector` or an array is provided, the x, y, and z components are extracted
   * from it. If the z component is not provided, it defaults to 1 (no scaling along the z-axis).
   *
   * @param {p5.Vector|Float32Array|Number[]} s - The vector or scalars to scale by.
   *                                              Can be a `p5.Vector`, an array, or individual numbers.
   * @returns {Matrix} The current instance of the Matrix class, allowing for method chaining.
   *
   * @example
   * // Scaling a matrix by individual scalars
   * const matrix = new p5.Matrix(4); // Create a 4x4 identity matrix
   * matrix.scale(2, 3, 4); // Scale by 2 along x, 3 along y, and 4 along z
   * console.log(matrix.matrix);
   *
   * // Scaling a matrix by a p5.Vector
   * const scaleVector = new p5.Vector(2, 3, 4);
   * matrix.scale(scaleVector);
   * console.log(matrix.matrix);
   *
   * // Scaling a matrix by an array
   * const scaleArray = [2, 3, 4];
   * matrix.scale(scaleArray);
   * console.log(matrix.matrix);
   *
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   const matrix = new p5.Matrix(4); // Create a 4x4 identity matrix
   *   console.log("Original Matrix:", matrix.matrix);
   *
   *   // Scale the matrix by individual scalars
   *   matrix.scale(2, 3, 4);
   *   console.log("Scaled Matrix (2, 3, 4):", matrix.matrix);
   *
   *   // Scale the matrix by a p5.Vector
   *   const scaleVector = new p5.Vector(1.5, 2.5, 3.5);
   *   matrix.scale(scaleVector);
   *   console.log("Scaled Matrix (Vector):", matrix.matrix);
   *
   *   // Scale the matrix by an array
   *   const scaleArray = [0.5, 0.5, 0.5];
   *   matrix.scale(scaleArray);
   *   console.log("Scaled Matrix (Array):", matrix.matrix);
   * }
   * </code></div>
   */
  scale(x, y, z) {
    if (x instanceof Vector) {
      // x is a vector, extract the components from it.
      y = x.y;
      z = x.z;
      x = x.x; // must be last
    } else if (x instanceof Array) {
      // x is an array, extract the components from it.
      y = x[1];
      z = x[2];
      x = x[0]; // must be last
    }

    this.matrix[0] *= x;
    this.matrix[1] *= x;
    this.matrix[2] *= x;
    this.matrix[3] *= x;
    this.matrix[4] *= y;
    this.matrix[5] *= y;
    this.matrix[6] *= y;
    this.matrix[7] *= y;
    this.matrix[8] *= z;
    this.matrix[9] *= z;
    this.matrix[10] *= z;
    this.matrix[11] *= z;

    return this;
  }

  /**
   * Rotate the Matrix around a specified axis by a given angle.
   *
   * This method applies a rotation transformation to the matrix, modifying its orientation
   * in 3D space. The rotation is performed around the provided axis, which can be defined
   * as a `p5.Vector` or an array of numbers representing the x, y, and z components of the axis.
   * Rotate our Matrix around an axis by the given angle.
   * @param  {Number} a The angle of rotation in radians.
   *                    Angles in radians are a measure of rotation, where 2π radians
   *                    represent a full circle (360 degrees). For example:
   *                    - π/2 radians = 90 degrees (quarter turn)
   *                    - π radians = 180 degrees (half turn)
   *                    - 2π radians = 360 degrees (full turn)
   *                    Use `Math.PI` for π or `p5`'s `PI` constant if using p5.js.
   * @param  {p5.Vector|Number[]} axis The axis or axes to rotate around.
   *                                   This defines the direction of the rotation.
   *                                   - If using a `p5.Vector`, it should represent
   *                                     the x, y, and z components of the axis.
   *                                   - If using an array, it should be in the form
   *                                     [x, y, z], where x, y, and z are numbers.
   *                                   For example:
   *                                   - [1, 0, 0] rotates around the x-axis.
   *                                   - [0, 1, 0] rotates around the y-axis.
   *                                   - [0, 0, 1] rotates around the z-axis.   *
   * @chainable
   * inspired by Toji's gl-matrix lib, mat4 rotation
   *
   * @example
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *   const matrix = new p5.Matrix(4); // Create a 4x4 identity matrix
   *   console.log("Original Matrix:", matrix.matrix.slice().toString()); // [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
   *
   *   // Translate the matrix by a 3D vector
   *   matrix.rotate4x4(Math.PI, [1,0,0]);
   *   console.log("After rotation of PI degrees on vector [1,0,0]:", matrix.matrix.slice().toString()); // [1,0,0,0,0,-1,1.2246468525851679e-16,0,0,-1.2246468525851679e-16,-1,0,0,0,0,1]
   * }
   * </code></div>
   */
  rotate4x4(a, x, y, z) {
    if (x instanceof Vector) {
      // x is a vector, extract the components from it.
      y = x.y;
      z = x.z;
      x = x.x; //must be last
    } else if (x instanceof Array) {
      // x is an array, extract the components from it.
      y = x[1];
      z = x[2];
      x = x[0]; //must be last
    }

    const len = Math.sqrt(x * x + y * y + z * z);
    x *= 1 / len;
    y *= 1 / len;
    z *= 1 / len;

    const a00 = this.matrix[0];
    const a01 = this.matrix[1];
    const a02 = this.matrix[2];
    const a03 = this.matrix[3];
    const a10 = this.matrix[4];
    const a11 = this.matrix[5];
    const a12 = this.matrix[6];
    const a13 = this.matrix[7];
    const a20 = this.matrix[8];
    const a21 = this.matrix[9];
    const a22 = this.matrix[10];
    const a23 = this.matrix[11];

    //sin,cos, and tan of respective angle
    const sA = Math.sin(a);
    const cA = Math.cos(a);
    const tA = 1 - cA;
    // Construct the elements of the rotation matrix
    const b00 = x * x * tA + cA;
    const b01 = y * x * tA + z * sA;
    const b02 = z * x * tA - y * sA;
    const b10 = x * y * tA - z * sA;
    const b11 = y * y * tA + cA;
    const b12 = z * y * tA + x * sA;
    const b20 = x * z * tA + y * sA;
    const b21 = y * z * tA - x * sA;
    const b22 = z * z * tA + cA;

    // rotation-specific matrix multiplication
    this.matrix[0] = a00 * b00 + a10 * b01 + a20 * b02;
    this.matrix[1] = a01 * b00 + a11 * b01 + a21 * b02;
    this.matrix[2] = a02 * b00 + a12 * b01 + a22 * b02;
    this.matrix[3] = a03 * b00 + a13 * b01 + a23 * b02;
    this.matrix[4] = a00 * b10 + a10 * b11 + a20 * b12;
    this.matrix[5] = a01 * b10 + a11 * b11 + a21 * b12;
    this.matrix[6] = a02 * b10 + a12 * b11 + a22 * b12;
    this.matrix[7] = a03 * b10 + a13 * b11 + a23 * b12;
    this.matrix[8] = a00 * b20 + a10 * b21 + a20 * b22;
    this.matrix[9] = a01 * b20 + a11 * b21 + a21 * b22;
    this.matrix[10] = a02 * b20 + a12 * b21 + a22 * b22;
    this.matrix[11] = a03 * b20 + a13 * b21 + a23 * b22;

    return this;
  }

  /**
   * Translates the current matrix by a given vector.
   *
   * This method applies a translation transformation to the current matrix.
   * Translation moves the matrix by a specified amount along the x, y, and z axes.
   * The input vector can be a 2D or 3D vector. If the z-component is not provided,
   * it defaults to 0, meaning no translation along the z-axis.
   *
   * @param {Number[]} v - A vector representing the translation. It should be an array
   *                       with two or three elements: [x, y, z]. The z-component is optional.
   * @returns {Matrix} The current instance of the Matrix class, allowing for method chaining.
   *
   * @example
   * // Translating a matrix by a 3D vector
   * const matrix = new p5.Matrix(4); // Create a 4x4 identity matrix
   * matrix.translate([10, 20, 30]); // Translate by 10 units along x, 20 along y, and 30 along z
   * console.log(matrix.matrix);
   *
   * // Translating a matrix by a 2D vector
   * matrix.translate([5, 15]); // Translate by 5 units along x and 15 along y
   * console.log(matrix.matrix);
   *
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *   const matrix = new p5.Matrix(4); // Create a 4x4 identity matrix
   *   console.log("Original Matrix:", matrix.matrix.slice().toString()); // [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
   *
   *   // Translate the matrix by a 3D vector
   *   matrix.translate([10, 20, 30]);
   *   console.log("After 3D Translation (10, 20, 30):", matrix.matrix.slice().toString()); // [1,0,0,0,0,1,0,0,0,0,1,0,10,20,30,1]
   *
   *   // Translate the matrix by a 2D vector
   *   matrix.translate([5, 15]);
   *   console.log("After 2D Translation (5, 15):", matrix.matrix.slice().toString()); // [1,0,0,0,0,1,0,0,0,0,1,0,15,35,30,1]
   * }
   * </code></div>
   */
  translate(v) {
    const x = v[0],
      y = v[1],
      z = v[2] || 0;
    this.matrix[12] +=
      this.matrix[0] * x + this.matrix[4] * y + this.matrix[8] * z;
    this.matrix[13] +=
      this.matrix[1] * x + this.matrix[5] * y + this.matrix[9] * z;
    this.matrix[14] +=
      this.matrix[2] * x + this.matrix[6] * y + this.matrix[10] * z;
    this.matrix[15] +=
      this.matrix[3] * x + this.matrix[7] * y + this.matrix[11] * z;
    return this;
  }

  /**
   * Rotates the matrix around the X-axis by a given angle.
   *
   * This method modifies the current matrix to apply a rotation transformation
   * around the X-axis. The rotation angle is specified in radians.
   *
   * Rotating around the X-axis means that the Y and Z coordinates of the matrix
   * are transformed while the X coordinates remain unchanged. This is commonly
   * used in 3D graphics to create animations or transformations along the X-axis.
   *
   * @param {Number} a - The angle in radians to rotate the matrix by.
   *
   * @example
   * // Rotating a matrix around the X-axis
   * const matrix = new p5.Matrix(4); // Create a 4x4 identity matrix
   * matrix.rotateX(Math.PI / 4); // Rotate 45 degrees around the X-axis
   * console.log(matrix.matrix);
   *
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   const matrix = new p5.Matrix(4); // Create a 4x4 identity matrix
   *   console.log("Original Matrix:", matrix.matrix);
   *
   *   // Rotate the matrix 45 degrees (PI/4 radians) around the X-axis
   *   matrix.rotateX(Math.PI / 4);
   *   console.log("After Rotation (X-axis, 45 degrees):", matrix.matrix);
   * }
   * </code></div>
   */
  rotateX(a) {
    this.rotate4x4(a, 1, 0, 0);
  }

  /**
   * Rotates the matrix around the Y-axis by a given angle.
   *
   * This method modifies the current matrix to apply a rotation transformation
   * around the Y-axis. The rotation is performed in 3D space, and the angle
   * is specified in radians. Rotating around the Y-axis means that the X and Z
   * coordinates of the matrix are transformed while the Y coordinates remain
   * unchanged. This is commonly used in 3D graphics to create animations or
   * transformations along the Y-axis.
   *
   * @param {Number} a - The angle in radians to rotate the matrix by. Positive
   * values rotate the matrix counterclockwise, and negative values rotate it
   * clockwise.
   *
   * @example
   * // Rotating a matrix around the Y-axis
   * const matrix = new p5.Matrix(4); // Create a 4x4 identity matrix
   * matrix.rotateY(Math.PI / 4); // Rotate 45 degrees around the Y-axis
   * console.log(matrix.matrix);
   *
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   const matrix = new p5.Matrix(4); // Create a 4x4 identity matrix
   *   console.log("Original Matrix:", matrix.matrix);
   *
   *   // Rotate the matrix 45 degrees (PI/4 radians) around the Y-axis
   *   matrix.rotateY(Math.PI / 4);
   *   console.log("After Rotation (Y-axis, 45 degrees):", matrix.matrix);
   * }
   * </code></div>
   */
  rotateY(a) {
    this.rotate4x4(a, 0, 1, 0);
  }

  /**
   * Rotates the matrix around the Z-axis by a given angle.
   *
   * This method modifies the current matrix to apply a rotation transformation
   * around the Z-axis. The rotation is performed in a 4x4 matrix context, which
   * is commonly used in 3D graphics to handle transformations. Rotating around
   * the Z-axis means that the X and Y coordinates of the matrix are transformed
   * while the Z coordinates remain unchanged.
   *
   * @param {Number} a - The angle in radians to rotate the matrix by. Positive
   * values rotate the matrix counterclockwise, and negative values rotate it
   * clockwise.
   *
   * @returns {Matrix} The current instance of the Matrix class, allowing for
   * method chaining.
   *
   * @example
   * // Rotating a matrix around the Z-axis
   * const matrix = new p5.Matrix(4); // Create a 4x4 identity matrix
   * matrix.rotateZ(Math.PI / 4); // Rotate 45 degrees around the Z-axis
   * console.log(matrix.matrix);
   *
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   const matrix = new p5.Matrix(4); // Create a 4x4 identity matrix
   *   console.log("Original Matrix:", matrix.matrix);
   *
   *   // Rotate the matrix 45 degrees (PI/4 radians) around the Z-axis
   *   matrix.rotateZ(Math.PI / 4);
   *   console.log("After Rotation (Z-axis, 45 degrees):", matrix.matrix);
   * }
   * </code></div>
   */
  rotateZ(a) {
    this.rotate4x4(a, 0, 0, 1);
  }

  /**
   * Sets the perspective projection matrix.
   *
   * This method modifies the current matrix to represent a perspective projection.
   * Perspective projection is commonly used in 3D graphics to simulate the effect
   * of objects appearing smaller as they move further away from the camera.
   *
   * The perspective matrix is defined by the field of view (fovy), aspect ratio,
   * and the near and far clipping planes. The near and far clipping planes define
   * the range of depth that will be rendered, with anything outside this range
   * being clipped.
   *
   * @param {Number} fovy - The field of view in the y direction, in radians.
   * @param {Number} aspect - The aspect ratio of the viewport (width / height).
   * @param {Number} near - The distance to the near clipping plane. Must be greater than 0.
   * @param {Number} far - The distance to the far clipping plane. Must be greater than the near value.
   * @returns {Matrix} The current instance of the Matrix class, allowing for method chaining.
   *
   * @example
   * // Setting a perspective projection matrix
   * const matrix = new p5.Matrix(4); // Create a 4x4 identity matrix
   * matrix.perspective(Math.PI / 4, 1.5, 0.1, 100); // Set perspective projection
   * console.log(matrix.matrix);
   *
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   const matrix = new p5.Matrix(4); // Create a 4x4 identity matrix
   *   console.log("Original Matrix:", matrix.matrix);
   *
   *   // Set a perspective projection with a 45-degree field of view,
   *   // an aspect ratio of 1.5, and near/far clipping planes at 0.1 and 100.
   *   matrix.perspective(Math.PI / 4, 1.5, 0.1, 100);
   *   console.log("Perspective Matrix:", matrix.matrix);
   * }
   * </code></div>
   */
  perspective(fovy, aspect, near, far) {
    const f = 1.0 / Math.tan(fovy / 2),
      nf = 1 / (near - far);

    this.matrix[0] = f / aspect;
    this.matrix[1] = 0;
    this.matrix[2] = 0;
    this.matrix[3] = 0;
    this.matrix[4] = 0;
    this.matrix[5] = f;
    this.matrix[6] = 0;
    this.matrix[7] = 0;
    this.matrix[8] = 0;
    this.matrix[9] = 0;
    this.matrix[10] = (far + near) * nf;
    this.matrix[11] = -1;
    this.matrix[12] = 0;
    this.matrix[13] = 0;
    this.matrix[14] = 2 * far * near * nf;
    this.matrix[15] = 0;

    return this;
  }

  /**
   * Sets this matrix to an orthographic projection matrix.
   *
   * An orthographic projection matrix is used to create a 2D rendering
   * of a 3D scene by projecting points onto a plane without perspective
   * distortion. This method modifies the current matrix to represent
   * the orthographic projection defined by the given parameters.
   *
   * @param {number} left - The coordinate for the left vertical clipping plane.
   * @param {number} right - The coordinate for the right vertical clipping plane.
   * @param {number} bottom - The coordinate for the bottom horizontal clipping plane.
   * @param {number} top - The coordinate for the top horizontal clipping plane.
   * @param {number} near - The distance to the near depth clipping plane. Must be positive.
   * @param {number} far - The distance to the far depth clipping plane. Must be positive.
   * @chainable
   * @returns {Matrix} The current matrix instance, updated with the orthographic projection.
   *
   * @example
   * <div class="norender"><code>
   * // Example using p5.js to demonstrate orthographic projection
   * function setup() {
   *  let orthoMatrix = new p5.Matrix(4);
   *  console.log(orthoMatrix.matrix.toString()) // Output: 1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1
   *  orthoMatrix.ortho(-200, 200, -200, 200, 0.1, 1000);
   *  console.log(orthoMatrix.matrix.toString()) // Output: [24 0.004999999888241291,0,0,0,0,0.004999999888241291,0,0,0,0,-0.0020002000965178013,0,0,0,-1.0002000331878662,1]
   *  applyMatrix(
   *     orthoMatrix.mat4[0], orthoMatrix.mat4[1], orthoMatrix.mat4[2], orthoMatrix.mat4[3],
   *     orthoMatrix.mat4[4], orthoMatrix.mat4[5], orthoMatrix.mat4[6], orthoMatrix.mat4[7],
   *     orthoMatrix.mat4[8], orthoMatrix.mat4[9], orthoMatrix.mat4[10], orthoMatrix.mat4[11],
   *     orthoMatrix.mat4[12], orthoMatrix.mat4[13], orthoMatrix.mat4[14], orthoMatrix.mat4[15]
   *  );
   *  console.log(orthoMatrix.matrix.toString()) // Output: [31 0.004999999888241291,0,0,0,0,0.004999999888241291,0,0,0,0,-0.0020002000965178013,0,0,0,-1.0002000331878662,1]
   *   }
   * </code></div>
   *
   */
  ortho(left, right, bottom, top, near, far) {
    const lr = 1 / (left - right),
      bt = 1 / (bottom - top),
      nf = 1 / (near - far);
    this.matrix[0] = -2 * lr;
    this.matrix[1] = 0;
    this.matrix[2] = 0;
    this.matrix[3] = 0;
    this.matrix[4] = 0;
    this.matrix[5] = -2 * bt;
    this.matrix[6] = 0;
    this.matrix[7] = 0;
    this.matrix[8] = 0;
    this.matrix[9] = 0;
    this.matrix[10] = 2 * nf;
    this.matrix[11] = 0;
    this.matrix[12] = (left + right) * lr;
    this.matrix[13] = (top + bottom) * bt;
    this.matrix[14] = (far + near) * nf;
    this.matrix[15] = 1;

    return this;
  }

  /**
   * Applies a matrix to a vector with x, y, z, w components and returns the result as an array.
   *
   * This method multiplies the current matrix by a 4D vector (x, y, z, w) and computes the resulting vector.
   * It is commonly used in 3D graphics for transformations such as translation, rotation, scaling, and perspective projection.
   *
   * The resulting vector is returned as an array of four numbers, representing the transformed x, y, z, and w components.
   *
   * @param {Number} x - The x component of the vector.
   * @param {Number} y - The y component of the vector.
   * @param {Number} z - The z component of the vector.
   * @param {Number} w - The w component of the vector.
   * @returns {Number[]} An array containing the transformed [x, y, z, w] components.
   *
   * @example
   * // Applying a matrix to a 4D vector
   * const matrix = new p5.Matrix(4); // Create a 4x4 identity matrix
   * const result = matrix.multiplyVec4(1, 2, 3, 1); // Transform the vector [1, 2, 3, 1]
   * console.log(result); // Output: [1, 2, 3, 1] (unchanged for identity matrix)
   *
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   const matrix = new p5.Matrix(4); // Create a 4x4 identity matrix
   *   console.log("Original Matrix:", matrix.matrix);
   *
   *   // Apply the matrix to a 4D vector
   *   const result = matrix.multiplyVec4(1, 2, 3, 1);
   *   console.log("Transformed Vector:", result); // Output: [1, 2, 3, 1]
   *
   *   // Modify the matrix (e.g., apply a translation)
   *   matrix.translate([5, 5, 5]);
   *   console.log("Modified Matrix:", matrix.matrix);
   *
   *   // Apply the modified matrix to the same vector
   *   const transformedResult = matrix.multiplyVec4(1, 2, 3, 1);
   *   console.log("Transformed Vector after Translation:", transformedResult); // Output: [6, 7, 8, 1]
   * }
   * </code></div>
   */
  multiplyVec4(x, y, z, w) {
    const result = new Array(4);
    const m = this.matrix;

    result[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    result[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    result[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    result[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;

    return result;
  }

  /**
   * Applies a matrix to a vector. The fourth component is set to 1.
   * Returns a vector consisting of the first
   * through third components of the result.
   *
   * This method multiplies the current matrix by a 4D vector (x, y, z, 1),
   * effectively transforming the vector using the matrix. The resulting
   * vector is returned as a new `p5.Vector` instance.
   *
   * This is useful for applying transformations such as translation,
   * rotation, scaling, or perspective projection to a point in 3D space.
   *
   * @param {p5.Vector} vector - The input vector to transform. It should
   *                              have x, y, and z components.
   * @return {p5.Vector} A new `p5.Vector` instance representing the transformed point.
   *
   * @example
   * // Applying a matrix to a 3D point
   * const matrix = new p5.Matrix(4); // Create a 4x4 identity matrix
   * const point = new p5.Vector(1, 2, 3); // Define a 3D point
   * const transformedPoint = matrix.multiplyPoint(point);
   * console.log(transformedPoint.toString()); // Output: [1, 2, 3] (unchanged for identity matrix)
   *
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   const matrix = new p5.Matrix(4); // Create a 4x4 identity matrix
   *   console.log("Original Matrix:", matrix.matrix);
   *
   *   // Define a 3D point
   *   const point = new p5.Vector(1, 2, 3);
   *   console.log("Original Point:", point.toString());
   *
   *   // Apply the matrix to the point
   *   const transformedPoint = matrix.multiplyPoint(point);
   *   console.log("Transformed Point:", transformedPoint.toString());
   *
   *   // Modify the matrix (e.g., apply a translation)
   *   matrix.translate([5, 5, 5]);
   *   console.log("Modified Matrix:", matrix.matrix);
   *
   *   // Apply the modified matrix to the same point
   *   const translatedPoint = matrix.multiplyPoint(point);
   *   console.log("Translated Point:", translatedPoint.toString()); // Output: [6, 7, 8]
   * }
   * </code></div>
   */
  multiplyPoint({ x, y, z }) {
    const array = this.multiplyVec4(x, y, z, 1);
    return new Vector(array[0], array[1], array[2]);
  }

  /**
   * Applies a matrix to a vector.
   * The fourth component is set to 1.
   * Returns the result of dividing the 1st to 3rd components
   * of the result by the 4th component as a vector.
   *
   * This method multiplies the current matrix by a 4D vector (x, y, z, 1),
   * effectively transforming the vector using the matrix. The resulting
   * vector is normalized by dividing its x, y, and z components by the w component.
   * This is useful for applying transformations such as perspective projection
   * to a point in 3D space.
   *
   * @param {p5.Vector} vector - The input vector to transform. It should
   *                              have x, y, and z components.
   * @return {p5.Vector} A new `p5.Vector` instance representing the transformed and normalized point.
   *
   * @example
   * // Applying a matrix to a 3D point and normalizing it
   * const matrix = new p5.Matrix(4); // Create a 4x4 identity matrix
   * const point = new p5.Vector(1, 2, 3); // Define a 3D point
   * const transformedPoint = matrix.multiplyAndNormalizePoint(point);
   * console.log(transformedPoint.toString()); // Output: [1, 2, 3] (unchanged for identity matrix)
   *
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   const matrix = new p5.Matrix(4); // Create a 4x4 identity matrix
   *   console.log("Original Matrix:", matrix.matrix);
   *
   *   // Define a 3D point
   *   const point = new p5.Vector(1, 2, 3);
   *   console.log("Original Point:", point.toString());
   *
   *   // Apply the matrix to the point and normalize it
   *   const transformedPoint = matrix.multiplyAndNormalizePoint(point);
   *   console.log("Transformed and Normalized Point:", transformedPoint.toString());
   *
   *   // Modify the matrix (e.g., apply a perspective transformation)
   *   matrix.perspective(Math.PI / 4, 1.5, 0.1, 100);
   *   console.log("Modified Matrix (Perspective):", matrix.matrix);
   *
   *   // Apply the modified matrix to the same point
   *   const perspectivePoint = matrix.multiplyAndNormalizePoint(point);
   *   console.log("Point after Perspective Transformation:", perspectivePoint.toString());
   * }
   * </code></div>
   */
  multiplyAndNormalizePoint({ x, y, z }) {
    const array = this.multiplyVec4(x, y, z, 1);
    array[0] /= array[3];
    array[1] /= array[3];
    array[2] /= array[3];
    return new Vector(array[0], array[1], array[2]);
  }

  /**
   * Applies a matrix to a vector.
   * The fourth component is set to 0.
   * Returns a vector consisting of the first
   * through third components of the result.
   *
   * This method multiplies the current matrix by a 4D vector (x, y, z, 0),
   * effectively transforming the direction vector using the matrix. The resulting
   * vector is returned as a new `p5.Vector` instance. This is particularly useful
   * for transforming direction vectors (e.g., normals) without applying translation.
   *
   * @param {p5.Vector} vector - The input vector to transform. It should
   *                              have x, y, and z components.
   * @return {p5.Vector} A new `p5.Vector` instance representing the transformed direction.
   *
   * @example
   * // Applying a matrix to a direction vector
   * const matrix = new p5.Matrix(4); // Create a 4x4 identity matrix
   * const direction = new p5.Vector(1, 0, 0); // Define a direction vector
   * const transformedDirection = matrix.multiplyDirection(direction);
   * console.log(transformedDirection.toString()); // Output: [1, 0, 0] (unchanged for identity matrix)
   *
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   const matrix = new p5.Matrix(4); // Create a 4x4 identity matrix
   *   console.log("Original Matrix:", matrix.matrix);
   *
   *   // Define a direction vector
   *   const direction = new p5.Vector(1, 0, 0);
   *   console.log("Original Direction:", direction.toString());
   *
   *   // Apply the matrix to the direction vector
   *   const transformedDirection = matrix.multiplyDirection(direction);
   *   console.log("Transformed Direction:", transformedDirection.toString());
   *
   *   // Modify the matrix (e.g., apply a rotation)
   *   matrix.rotateY(Math.PI / 4); // Rotate 45 degrees around the Y-axis
   *   console.log("Modified Matrix (Rotation):", matrix.matrix);
   *
   *   // Apply the modified matrix to the same direction vector
   *   const rotatedDirection = matrix.multiplyDirection(direction);
   *   console.log("Rotated Direction:", rotatedDirection.toString()); // Output: Rotated vector
   * }
   * </code></div>
   */
  multiplyDirection({ x, y, z }) {
    const array = this.multiplyVec4(x, y, z, 0);
    return new Vector(array[0], array[1], array[2]);
  }

  /**
   * Takes a vector and returns the vector resulting from multiplying. This function is only for 3x3 matrices.
   * that vector by this matrix from the left.
   *
   * This method applies the current 3x3 matrix to a given vector, effectively
   * transforming the vector using the matrix. The resulting vector is returned
   * as a new vector or stored in the provided target vector.
   *
   * This is useful for operations such as transforming points or directions
   * in 2D or 3D space using a 3x3 transformation matrix.
   *
   * @param {p5.Vector} multVector - The vector to which this matrix applies.
   * @param {p5.Vector} [target] - The vector to receive the result. If not provided,
   *                               a copy of the input vector will be created and returned.
   * @return {p5.Vector} - The transformed vector after applying the matrix.
   *
   * @example
   * // Multiplying a 3x3 matrix with a vector
   * const matrix = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   * const vector = new p5.Vector(1, 2, 3);
   * const result = matrix.multiplyVec3(vector);
   * console.log(result.toString()); // Output: Transformed vector
   *
   * // p5.js script example
   * <div class="norender"><code>
   * function setup() {
   *
   *   // Create a 3x3 matrix
   *   const matrix = new p5.Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   *   console.log("Original Matrix:", matrix.matrix);
   *
   *   // Define a vector
   *   const vector = new p5.Vector(1, 2, 3);
   *   console.log("Original Vector:", vector.toString()); // Output: [1, 2, 3]
   *
   *   // Apply the matrix to the vector
   *   const transformedVector = matrix.multiplyVec3(vector);
   *   console.log("Transformed Vector:", transformedVector.toString()); // Output: [30, 36, 42]
   *
   *   // Modify the matrix (e.g., apply a scaling transformation)
   *   matrix.scale(2, 2, 2);
   *   console.log("Modified Matrix (Scaling):", matrix.matrix); // Output: [2, 4, 6, 8, 10, 12, 14, 16, 18]
   *
   *   // Apply the modified matrix to the same vector
   *   const scaledVector = matrix.multiplyVec3(vector);
   *   console.log("Scaled Vector:", scaledVector.toString()); // Output: [60, 72, 84]
   * }
   * </code></div>
   */
  multiplyVec3(multVector, target) {
    if (target === undefined) {
      target = multVector.copy();
    }
    target.x = this.row(0).dot(multVector);
    target.y = this.row(1).dot(multVector);
    target.z = this.row(2).dot(multVector);
    return target;
  }

  // ====================
  // PRIVATE
  /**
   * Creates identity matrix
   * This method updates the current matrix with the result of the multiplication.
   *
   * @private
   */
  #createIdentityMatrix(dimension) {
    // This it to prevent loops in the most common 3x3 and 4x4 cases
    // TODO: check performance if it actually helps
    if (dimension === 3)
      return new GLMAT_ARRAY_TYPE([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    if (dimension === 4)
      return new GLMAT_ARRAY_TYPE([
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
      ]);
    const identityMatrix = new GLMAT_ARRAY_TYPE(dimension * dimension).fill(0);
    for (let i = 0; i < dimension; i++) {
      identityMatrix[i * dimension + i] = 1;
    }
    return identityMatrix;
  }

  /**
   * Multiplies the current 4x4 matrix with another 4x4 matrix.
   * This method updates the current matrix with the result of the multiplication.
   *
   * @private
   * @param {number[]} _src - A 16-element array representing the 4x4 matrix to multiply with.
   *
   * @returns {this} The current instance with the updated matrix.
   *
   * @example
   * // Assuming `matrix` is an instance of the Matrix class
   * const srcMatrix = [
   *   1, 0, 0, 0,
   *   0, 1, 0, 0,
   *   0, 0, 1, 0,
   *   0, 0, 0, 1
   * ];
   * matrix.#mult4x4(srcMatrix);
   */
  #mult4x4(_src) {
    // each row is used for the multiplier
    let b0 = this.matrix[0],
      b1 = this.matrix[1],
      b2 = this.matrix[2],
      b3 = this.matrix[3];
    this.matrix[0] = b0 * _src[0] + b1 * _src[4] + b2 * _src[8] + b3 * _src[12];
    this.matrix[1] = b0 * _src[1] + b1 * _src[5] + b2 * _src[9] + b3 * _src[13];
    this.matrix[2] =
      b0 * _src[2] + b1 * _src[6] + b2 * _src[10] + b3 * _src[14];
    this.matrix[3] =
      b0 * _src[3] + b1 * _src[7] + b2 * _src[11] + b3 * _src[15];

    b0 = this.matrix[4];
    b1 = this.matrix[5];
    b2 = this.matrix[6];
    b3 = this.matrix[7];
    this.matrix[4] = b0 * _src[0] + b1 * _src[4] + b2 * _src[8] + b3 * _src[12];
    this.matrix[5] = b0 * _src[1] + b1 * _src[5] + b2 * _src[9] + b3 * _src[13];
    this.matrix[6] =
      b0 * _src[2] + b1 * _src[6] + b2 * _src[10] + b3 * _src[14];
    this.matrix[7] =
      b0 * _src[3] + b1 * _src[7] + b2 * _src[11] + b3 * _src[15];

    b0 = this.matrix[8];
    b1 = this.matrix[9];
    b2 = this.matrix[10];
    b3 = this.matrix[11];
    this.matrix[8] = b0 * _src[0] + b1 * _src[4] + b2 * _src[8] + b3 * _src[12];
    this.matrix[9] = b0 * _src[1] + b1 * _src[5] + b2 * _src[9] + b3 * _src[13];
    this.matrix[10] =
      b0 * _src[2] + b1 * _src[6] + b2 * _src[10] + b3 * _src[14];
    this.matrix[11] =
      b0 * _src[3] + b1 * _src[7] + b2 * _src[11] + b3 * _src[15];

    b0 = this.matrix[12];
    b1 = this.matrix[13];
    b2 = this.matrix[14];
    b3 = this.matrix[15];
    this.matrix[12] =
      b0 * _src[0] + b1 * _src[4] + b2 * _src[8] + b3 * _src[12];
    this.matrix[13] =
      b0 * _src[1] + b1 * _src[5] + b2 * _src[9] + b3 * _src[13];
    this.matrix[14] =
      b0 * _src[2] + b1 * _src[6] + b2 * _src[10] + b3 * _src[14];
    this.matrix[15] =
      b0 * _src[3] + b1 * _src[7] + b2 * _src[11] + b3 * _src[15];

    return this;
  }

  /**
   * @param {p5.Matrix|Float32Array|Number[]} multMatrix The matrix
   *                                                we want to multiply by
   * @private
   * @chainable
   */
  #multNxN(multMatrix) {
    if (multMatrix.length !== this.matrix.length) {
      throw new Error("Matrices must be of the same dimension to multiply.");
    }
    const result = new GLMAT_ARRAY_TYPE(this.matrix.length).fill(0);
    for (let i = 0; i < this.#sqDimention; i++) {
      for (let j = 0; j < this.#sqDimention; j++) {
        for (let k = 0; k < this.#sqDimention; k++) {
          result[i * this.#sqDimention + j] +=
            this.matrix[i * this.#sqDimention + k] *
            multMatrix[k * this.#sqDimention + j];
        }
      }
    }
    this.matrix = result;
    return this;
  }

  /**
   * This function is only for 3x3 matrices.
   * multiply two mat3s. It is an operation to multiply the 3x3 matrix of
   * the argument from the right. Arguments can be a 3x3 p5.Matrix,
   * a Float32Array of length 9, or a javascript array of length 9.
   * In addition, it can also be done by enumerating 9 numbers.
   *
   * @param {p5.Matrix|Float32Array|Number[]} multMatrix The matrix
   *                                                we want to multiply by
   * @private
   * @chainable
   */
  #mult3x3(_src) {
    // each row is used for the multiplier
    let b0 = this.mat3[0];
    let b1 = this.mat3[1];
    let b2 = this.mat3[2];
    this.mat3[0] = b0 * _src[0] + b1 * _src[3] + b2 * _src[6];
    this.mat3[1] = b0 * _src[1] + b1 * _src[4] + b2 * _src[7];
    this.mat3[2] = b0 * _src[2] + b1 * _src[5] + b2 * _src[8];

    b0 = this.mat3[3];
    b1 = this.mat3[4];
    b2 = this.mat3[5];
    this.mat3[3] = b0 * _src[0] + b1 * _src[3] + b2 * _src[6];
    this.mat3[4] = b0 * _src[1] + b1 * _src[4] + b2 * _src[7];
    this.mat3[5] = b0 * _src[2] + b1 * _src[5] + b2 * _src[8];

    b0 = this.mat3[6];
    b1 = this.mat3[7];
    b2 = this.mat3[8];
    this.mat3[6] = b0 * _src[0] + b1 * _src[3] + b2 * _src[6];
    this.mat3[7] = b0 * _src[1] + b1 * _src[4] + b2 * _src[7];
    this.mat3[8] = b0 * _src[2] + b1 * _src[5] + b2 * _src[8];

    return this;
  }

  /**
   * Transposes a square matrix in place.
   * This method swaps the rows and columns of the matrix, effectively flipping it over its diagonal.
   *
   * @private
   * @returns {Matrix} The current instance of the Matrix, with the transposed values.
   */
  #transposeNxN() {
    const n = this.#sqDimention;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        this.matrix[i * n + j] = this.matrix[j * n + i];
      }
    }
    return this;
  }

  /**
   * transpose according to a given matrix
   * @param  {p5.Matrix|Float32Array|Number[]} a  the matrix to be
   *                                               based on to transpose
   * @private
   * @chainable
   */
  #transpose4x4(a) {
    console.log("====> 4x4");
    let a01, a02, a03, a12, a13, a23;
    if (a instanceof Matrix) {
      a01 = a.matrix[1];
      a02 = a.matrix[2];
      a03 = a.matrix[3];
      a12 = a.matrix[6];
      a13 = a.matrix[7];
      a23 = a.matrix[11];

      this.matrix[0] = a.matrix[0];
      this.matrix[1] = a.matrix[4];
      this.matrix[2] = a.matrix[8];
      this.matrix[3] = a.matrix[12];
      this.matrix[4] = a01;
      this.matrix[5] = a.matrix[5];
      this.matrix[6] = a.matrix[9];
      this.matrix[7] = a.matrix[13];
      this.matrix[8] = a02;
      this.matrix[9] = a12;
      this.matrix[10] = a.matrix[10];
      this.matrix[11] = a.matrix[14];
      this.matrix[12] = a03;
      this.matrix[13] = a13;
      this.matrix[14] = a23;
      this.matrix[15] = a.matrix[15];
    } else if (isMatrixArray(a)) {
      a01 = a[1];
      a02 = a[2];
      a03 = a[3];
      a12 = a[6];
      a13 = a[7];
      a23 = a[11];

      this.matrix[0] = a[0];
      this.matrix[1] = a[4];
      this.matrix[2] = a[8];
      this.matrix[3] = a[12];
      this.matrix[4] = a01;
      this.matrix[5] = a[5];
      this.matrix[6] = a[9];
      this.matrix[7] = a[13];
      this.matrix[8] = a02;
      this.matrix[9] = a12;
      this.matrix[10] = a[10];
      this.matrix[11] = a[14];
      this.matrix[12] = a03;
      this.matrix[13] = a13;
      this.matrix[14] = a23;
      this.matrix[15] = a[15];
    }
    return this;
  }

  /**
   * This function is only for 3x3 matrices.
   * transposes a 3×3 p5.Matrix by a mat3
   * If there is an array of arguments, the matrix obtained by transposing
   * the 3x3 matrix generated based on that array is set.
   * If no arguments, it transposes itself and returns it.
   *
   * @param  {Number[]} mat3 1-dimensional array
   * @private
   * @chainable
   */
  #transpose3x3(mat3) {
    if (mat3 === undefined) {
      mat3 = this.mat3;
    }
    const a01 = mat3[1];
    const a02 = mat3[2];
    const a12 = mat3[5];
    this.mat3[0] = mat3[0];
    this.mat3[1] = mat3[3];
    this.mat3[2] = mat3[6];
    this.mat3[3] = a01;
    this.mat3[4] = mat3[4];
    this.mat3[5] = mat3[7];
    this.mat3[6] = a02;
    this.mat3[7] = a12;
    this.mat3[8] = mat3[8];

    return this;
  }

  /**
   * Only 4x4 becasuse determinant is only 4x4 currently
   * invert  matrix according to a give matrix
   * @param  {p5.Matrix|Float32Array|Number[]} a   the matrix to be
   *                                                based on to invert
   * @private
   * @chainable
   */
  #invert4x4(a) {
    let a00, a01, a02, a03, a10, a11, a12, a13;
    let a20, a21, a22, a23, a30, a31, a32, a33;
    if (a instanceof Matrix) {
      a00 = a.matrix[0];
      a01 = a.matrix[1];
      a02 = a.matrix[2];
      a03 = a.matrix[3];
      a10 = a.matrix[4];
      a11 = a.matrix[5];
      a12 = a.matrix[6];
      a13 = a.matrix[7];
      a20 = a.matrix[8];
      a21 = a.matrix[9];
      a22 = a.matrix[10];
      a23 = a.matrix[11];
      a30 = a.matrix[12];
      a31 = a.matrix[13];
      a32 = a.matrix[14];
      a33 = a.matrix[15];
    } else if (isMatrixArray(a)) {
      a00 = a[0];
      a01 = a[1];
      a02 = a[2];
      a03 = a[3];
      a10 = a[4];
      a11 = a[5];
      a12 = a[6];
      a13 = a[7];
      a20 = a[8];
      a21 = a[9];
      a22 = a[10];
      a23 = a[11];
      a30 = a[12];
      a31 = a[13];
      a32 = a[14];
      a33 = a[15];
    }
    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    let det =
      b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      return null;
    }
    det = 1.0 / det;

    this.matrix[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    this.matrix[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    this.matrix[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    this.matrix[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    this.matrix[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    this.matrix[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    this.matrix[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    this.matrix[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    this.matrix[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    this.matrix[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    this.matrix[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    this.matrix[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    this.matrix[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    this.matrix[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    this.matrix[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    this.matrix[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return this;
  }

  /**
   * Inverts a 3×3 matrix
   * @chainable
   * @private
   */
  #invert3x3() {
    const a00 = this.mat3[0];
    const a01 = this.mat3[1];
    const a02 = this.mat3[2];
    const a10 = this.mat3[3];
    const a11 = this.mat3[4];
    const a12 = this.mat3[5];
    const a20 = this.mat3[6];
    const a21 = this.mat3[7];
    const a22 = this.mat3[8];
    const b01 = a22 * a11 - a12 * a21;
    const b11 = -a22 * a10 + a12 * a20;
    const b21 = a21 * a10 - a11 * a20;

    // Calculate the determinant
    let det = a00 * b01 + a01 * b11 + a02 * b21;
    if (!det) {
      return null;
    }
    det = 1.0 / det;
    this.mat3[0] = b01 * det;
    this.mat3[1] = (-a22 * a01 + a02 * a21) * det;
    this.mat3[2] = (a12 * a01 - a02 * a11) * det;
    this.mat3[3] = b11 * det;
    this.mat3[4] = (a22 * a00 - a02 * a20) * det;
    this.mat3[5] = (-a12 * a00 + a02 * a10) * det;
    this.mat3[6] = b21 * det;
    this.mat3[7] = (-a21 * a00 + a01 * a20) * det;
    this.mat3[8] = (a11 * a00 - a01 * a10) * det;
    return this;
  }

  /**
   * inspired by Toji's mat4 determinant
   * @return {Number} Determinant of our 4×4 matrix
   * @private
   */
  #determinant4x4() {
    if (this.#sqDimention !== 4) {
      throw new Error(
        "Determinant is only implemented for 4x4 matrices. We are working on it."
      );
    }

    const d00 =
        this.matrix[0] * this.matrix[5] - this.matrix[1] * this.matrix[4],
      d01 = this.matrix[0] * this.matrix[6] - this.matrix[2] * this.matrix[4],
      d02 = this.matrix[0] * this.matrix[7] - this.matrix[3] * this.matrix[4],
      d03 = this.matrix[1] * this.matrix[6] - this.matrix[2] * this.matrix[5],
      d04 = this.matrix[1] * this.matrix[7] - this.matrix[3] * this.matrix[5],
      d05 = this.matrix[2] * this.matrix[7] - this.matrix[3] * this.matrix[6],
      d06 = this.matrix[8] * this.matrix[13] - this.matrix[9] * this.matrix[12],
      d07 =
        this.matrix[8] * this.matrix[14] - this.matrix[10] * this.matrix[12],
      d08 =
        this.matrix[8] * this.matrix[15] - this.matrix[11] * this.matrix[12],
      d09 =
        this.matrix[9] * this.matrix[14] - this.matrix[10] * this.matrix[13],
      d10 =
        this.matrix[9] * this.matrix[15] - this.matrix[11] * this.matrix[13],
      d11 =
        this.matrix[10] * this.matrix[15] - this.matrix[11] * this.matrix[14];

    // Calculate the determinant
    return (
      d00 * d11 - d01 * d10 + d02 * d09 + d03 * d08 - d04 * d07 + d05 * d06
    );
  }

  /**
   * PRIVATE
   */
  // matrix methods adapted from:
  // https://developer.mozilla.org/en-US/docs/Web/WebGL/
  // gluPerspective
  //
  // function _makePerspective(fovy, aspect, znear, zfar){
  //    const ymax = znear * Math.tan(fovy * Math.PI / 360.0);
  //    const ymin = -ymax;
  //    const xmin = ymin * aspect;
  //    const xmax = ymax * aspect;
  //    return _makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
  //  }

  ////
  //// glFrustum
  ////
  //function _makeFrustum(left, right, bottom, top, znear, zfar){
  //  const X = 2*znear/(right-left);
  //  const Y = 2*znear/(top-bottom);
  //  const A = (right+left)/(right-left);
  //  const B = (top+bottom)/(top-bottom);
  //  const C = -(zfar+znear)/(zfar-znear);
  //  const D = -2*zfar*znear/(zfar-znear);
  //  const frustrumMatrix =[
  //  X, 0, A, 0,
  //  0, Y, B, 0,
  //  0, 0, C, D,
  //  0, 0, -1, 0
  //];
  //return frustrumMatrix;
  // }

  // function _setMVPMatrices(){
  ////an identity matrix
  ////@TODO use the p5.Matrix class to abstract away our MV matrices and
  ///other math
  //const _mvMatrix =
  //[
  //  1.0,0.0,0.0,0.0,
  //  0.0,1.0,0.0,0.0,
  //  0.0,0.0,1.0,0.0,
  //  0.0,0.0,0.0,1.0
  //];
}
