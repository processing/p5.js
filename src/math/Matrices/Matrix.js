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
/**
 * The `Matrix` class represents a mathematical matrix and provides various methods for matrix operations.
 * 
 * This class extends the `MatrixInterface` and includes methods for creating, manipulating, and performing
 * operations on matrices. It supports both 3x3 and 4x4 matrices, as well as general NxN matrices.
 * 
 * @class
 * @extends MatrixInterface
 * 
 * @example
 * // Creating a 3x3 matrix from an array
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
 */
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
      this.matrix = Array.from(args[0]);
    } else if (typeof args[0] === "number") {
      this.#sqDimention = Number(args[0]);
      this.matrix = this.#createIdentityMatrix(args[0]);
    }
    return this;
  }

  /**
   * Getter for a 3x3 matrix.
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
   * Getter for a 4x4 matrix.
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
   * Adds the corresponding elements of the given matrix to this matrix.
   * 
   * @param {Matrix} matrix - The matrix to add to this matrix. It must have the same dimensions as this matrix.
   * @returns {Matrix} The resulting matrix after addition.
   * @throws {Error} If the matrices do not have the same dimensions.
   * 
   * @example
   * const matrix1 = new Matrix([1, 2, 3]);
   * const matrix2 = new Matrix([4, 5, 6]);
   * matrix1.add(matrix2); // matrix1 is now [5, 7, 9]
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
   * Sets the value of a specific element in the matrix.
   *
   * @param {number} index - The position in the matrix where the value should be set. 
   *                         Must be a non-negative integer less than the length of the matrix.
   * @param {*} value - The new value to be assigned to the specified position in the matrix.
   * @returns {Matrix} The current instance of the Matrix, allowing for method chaining.
   *
   * @example
   * // Assuming matrix is an instance of Matrix with initial values [1, 2, 3]
   * matrix.setElement(1, 10);
   * // Now the matrix values are [1, 10, 3]
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
   * 
   * @returns {Matrix} The current instance of the Matrix class, allowing for method chaining.
   */
  reset() {
    this.matrix = this.#createIdentityMatrix(this.#sqDimention);
    return this;
  }

  /**
   * Replace the entire contents of a NxN matrix.
   * If providing an array or a p5.Matrix, the values will be copied without
   * referencing the source object.
   * Can also provide NxN numbers as individual arguments.
   *
   * @param {p5.Matrix|Float32Array|Number[]} [inMatrix] the input p5.Matrix or
   *                                     an Array of length 16
   * @chainable
   */
  /**
   * @param {Number[]} elements 16 numbers passed by value to avoid
   *                                     array copying.
   * @chainable
   */
  set(inMatrix) {
    let refArray = Array.from([...arguments]);
    if (inMatrix instanceof Matrix) {
      refArray = inMatrix.matrix;
    } else if (isMatrixArray(inMatrix)) {
      refArray = inMatrix;
    }
    if (refArray.length !== this.matrix.length) {
      p5._friendlyError(
        `Expected same dimentions values but received different ${refArray.length}.`,
        "p5.Matrix.set"
      );
      return this;
    }
    this.matrix = [...refArray];
    this.#sqDimention = Math.sqrt(this.matrix.length)
    return this;
  }

  /**
   * Gets a copy of the vector, returns a p5.Matrix object.
   *
   * @return {p5.Matrix} the copy of the p5.Matrix object
   */
  get() {
    return new Matrix(this.matrix); // TODO: Pass p5
  }

  /**
   * return a copy of this matrix.
   * If this matrix is 4x4, a 4x4 matrix with exactly the same entries will be
   * generated. The same is true if this matrix is 3x3.
   *
   * @return {p5.Matrix}   the result matrix
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
   */
  clone() {
    return this.copy();
  }
  /**
   * Returns the diagonal elements of the matrix in the form of an array.
   * A NxN matrix will return an array of length N.
   *
   * @return {Number[]} An array obtained by arranging the diagonal elements
   *                    of the matrix in ascending order of index
   */
  diagonal() {
    const diagonal = [];
    for (let i = 0; i < this.#sqDimention; i++) {
      diagonal.push(this.matrix[i * (this.#sqDimention + 1)]);
    }
    return diagonal;
  }

  /**
   * This function is only for 3x3 matrices.
   * A function that returns a row vector of a NxN matrix.
   *
   * @param {Number} columnIndex matrix column number
   * @return {p5.Vector}
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
   * @param {Number} rowIndex matrix row number
   * @return {p5.Vector}
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
   * @param {Array} a - The matrix to be transposed. It should be a 2D array where each sub-array represents a row.
   * @returns {Array} - The transposed matrix.
   */
  transpose(a) {
    // TODO: Cristian: What does passing an argument to a transpose mean?
    // In the codebase this is never done in any reference
    // Actually transposse of a 4x4 is never done dierectly,
    // I'm thinking it is incorrect, transpose3x3 is only used for inverseTranspose4x4
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
   * @param {Matrix|Array|...number} multMatrix - The matrix or matrix-like array to multiply with.
   * @returns {Matrix|undefined} The resulting matrix after multiplication, or undefined if the input is invalid.
   * @chainable
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
   * This function is only for 3x3 matrices.
   * Takes a vector and returns the vector resulting from multiplying to
   * that vector by this matrix from left.
   *
   * @param {p5.Vector} multVector the vector to which this matrix applies
   * @param {p5.Vector} [target] The vector to receive the result
   * @return {p5.Vector}
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
   * @param {Array} a - The matrix to be inverted. It should be a 2D array representing the matrix.
   * @returns {Array} - The inverted matrix.
   * @throws {Error} - Throws an error if the matrix dimension is greater than 4.
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
   * This function is only for 4x4 matrices.
   * Creates a 3x3 matrix whose entries are the top left 3x3 part and returns it.
   *
   * @return {p5.Matrix}
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
   * Converts a 4×4 matrix to its 3×3 inverse transform
   * commonly used in MVMatrix to NMatrix conversions.
   * @param  {p5.Matrix} mat4 the matrix to be based on to invert
   * @chainable
   * @todo  finish implementation
   */
  inverseTranspose4x4({ mat4 }) {
    if (this.#sqDimention !== 3) {
      p5._friendlyError("sorry, this function only works with mat3");
    } else {
      //convert mat4 -> mat3
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
    // check inverse succeeded
    if (inverse) {
      inverse.transpose(this.matrix);
    } else {
      // in case of singularity, just zero the matrix
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
   * @param {Matrix|Array|number} multMatrix - The matrix to multiply with. This can be:
   *   - An instance of the Matrix class.
   *   - An array of 16 numbers representing a 4x4 matrix.
   *   - 16 individual numbers representing the elements of a 4x4 matrix.
   * @returns {Matrix} The current matrix after applying the transformation.
   *
   * @example
   * // Assuming `matrix` is an instance of Matrix
   * const anotherMatrix = new Matrix();
   * matrix.apply(anotherMatrix);
   *
   * @example
   * // Applying a transformation using an array
   * const matrixArray = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
   * matrix.apply(matrixArray);
   *
   * @example
   * // Applying a transformation using individual arguments
   * matrix.apply(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
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
   * scales a p5.Matrix by scalars or a vector
   * @param  {p5.Vector|Float32Array|Number[]} s vector to scale by
   * @chainable
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
   * rotate our Matrix around an axis by the given angle.
   * @param  {Number} a The angle of rotation in radians
   * @param  {p5.Vector|Number[]} axis  the axis(es) to rotate around
   * @chainable
   * inspired by Toji's gl-matrix lib, mat4 rotation
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
   * @todo  finish implementing this method!
   * translates
   * @param  {Number[]} v vector to translate by
   * @chainable
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
  }

  /**
   * Rotates the matrix around the X-axis by a given angle.
   *
   * This method modifies the current matrix to apply a rotation transformation
   * around the X-axis. The rotation angle is specified in radians.
   *
   * @param {number} a - The angle in radians to rotate the matrix by.
   */
  rotateX(a) {
    this.rotate4x4(a, 1, 0, 0);
  }

  /**
   * Rotates the matrix around the Y-axis by a given angle.
   *
   * This method modifies the current matrix to apply a rotation transformation
   * around the Y-axis. The rotation is performed in 3D space, and the angle
   * is specified in radians.
   *
   * @param {number} a - The angle in radians to rotate the matrix by. Positive
   * values rotate the matrix counterclockwise, and negative values rotate it
   * clockwise.
   */
  rotateY(a) {
    this.rotate4x4(a, 0, 1, 0);
  }

  /**
   * Rotates the matrix around the Z-axis by a given angle.
   *
   * @param {number} a - The angle in radians to rotate the matrix by.
   * 
   * This method modifies the current matrix to apply a rotation transformation
   * around the Z-axis. The rotation is performed in a 4x4 matrix context, which
   * is commonly used in 3D graphics to handle transformations.
   *
   * Example usage:
   * ```
   * const matrix = new Matrix();
   * matrix.rotateZ(Math.PI / 4); // Rotates the matrix 45 degrees around the Z-axis
   * ```
   */
  rotateZ(a) {
    this.rotate4x4(a, 0, 0, 1);
  }

  /**
   * sets the perspective matrix
   * @param  {Number} fovy   [description]
   * @param  {Number} aspect [description]
   * @param  {Number} near   near clipping plane
   * @param  {Number} far    far clipping plane
   * @chainable
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
   * sets the ortho matrix
   * @param  {Number} left   [description]
   * @param  {Number} right  [description]
   * @param  {Number} bottom [description]
   * @param  {Number} top    [description]
   * @param  {Number} near   near clipping plane
   * @param  {Number} far    far clipping plane
   * @chainable
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
   * apply a matrix to a vector with x,y,z,w components
   * get the results in the form of an array
   * @param {Number}
   * @return {Number[]}
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
   * Applies a matrix to a vector.
   * The fourth component is set to 1.
   * Returns a vector consisting of the first
   * through third components of the result.
   *
   * @param {p5.Vector}
   * @return {p5.Vector}
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
   * @param {p5.Vector}
   * @return {p5.Vector}
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
   * @param {p5.Vector}
   * @return {p5.Vector}
   */
  multiplyDirection({ x, y, z }) {
    const array = this.multiplyVec4(x, y, z, 0);
    return new Vector(array[0], array[1], array[2]);
  }

  /**
   * This function is only for 3x3 matrices.
   * Takes a vector and returns the vector resulting from multiplying to
   * that vector by this matrix from left.
   *
   * @param {p5.Vector} multVector the vector to which this matrix applies
   * @param {p5.Vector} [target] The vector to receive the result
   * @return {p5.Vector}
   */
  /**
   * This function is only for 3x3 matrices.
   * Takes a vector and returns the vector resulting from multiplying to
   * that vector by this matrix from left.
   *
   * @param {p5.Vector} multVector the vector to which this matrix applies
   * @param {p5.Vector} [target] The vector to receive the result
   * @return {p5.Vector}
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
