import nj from "@d4c/numjs/build/module/numjs.min.js";
import { Vector } from "../p5.Vector";
import { MatrixInterface } from "./MatrixInterface";

/**
 * @requires constants
 * @todo see methods below needing further implementation.
 * future consideration: implement SIMD optimizations
 * when browser compatibility becomes available
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/
 *   Reference/Global_Objects/SIMD
 */

let GLMAT_ARRAY_TYPE = Array;
let isMatrixArray = (x) => Array.isArray(x);
if (typeof Float32Array !== "undefined") {
  GLMAT_ARRAY_TYPE = Float32Array;
  isMatrixArray = (x) => Array.isArray(x) || x instanceof Float32Array;
}

/**
 * A class to describe a matrix, which can be either a 3×3 or 4×4 matrix,
 * for various matrix manipulations in the p5.js webgl renderer.
 * This class provides methods for common matrix operations such as
 * multiplication, inversion, transposition, and transformation.
 * It supports both 3×3 matrices, typically used for normal transformations,
 * and 4×4 matrices, commonly used for model, view, and projection transformations.
 *
 * @class MatrixNumjs
 * @private
 * @param {Array} [mat4] column-major array literal of our 4×4 matrix
 * @param {Array} [mat3] column-major array literal of our 3×3 matrix
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create Vector objects.
 *   let p1 = createMatrix(1,1,1,1,1,1,1,1,1);
 *   console.log(p1);
 * }
 * </code>
 * </div>
 */
// const matrixEngine = "numjs";
export class MatrixNumjs extends MatrixInterface{
  constructor(...args) {
    // This is default behavior when object
    super(...args)

    if (args[0] === 3) {
      this._mat3 = Array.isArray(args[1]) ? nj.array(args[1]) : nj.identity(3);
    } else {
      this._mat4 = Array.isArray(args[0]) ? nj.array(args[0]) : nj.identity(4);
    }
    return this;
  }

  get mat3() {
    return this._mat3?.flatten().tolist();
  }
  get mat4() {
    return this._mat4?.flatten().tolist();
  }
  /**
   * Resets the matrix to the identity matrix.
   *
   * If the matrix is a 3x3 matrix (`mat3`), it sets the matrix to:
   * [1, 0, 0,
   *  0, 1, 0,
   *  0, 0, 1]
   *
   * If the matrix is a 4x4 matrix (`mat4`), it sets the matrix to:
   * [1, 0, 0, 0,
   *  0, 1, 0, 0,
   *  0, 0, 1, 0,
   *  0, 0, 0, 1]
   *
   * @returns {this} The current instance for chaining.
   */
  reset() {
    if (this._mat3) {
      this._mat3 = nj.identity(3).flatten();
    } else if (this._mat4) {
      this._mat4 = nj.identity(4).flatten();
    }
    return this;
  }

  /**
   * Replace the entire contents of a 4x4 matrix.
   * If providing an array or a MatrixNumjs, the values will be copied without
   * referencing the source object.
   * Can also provide 16 numbers as individual arguments.
   *
   * @param {MatrixNumjs|Float32Array|Number[]} [inMatrix] the input MatrixNumjs or
   *                                     an Array of length 16
   * @chainable
   */
  /**
   * @param {Number[]} elements 16 numbers passed by value to avoid
   *                                     array copying.
   * @chainable
   */
  set(inMatrix) {
    let refArray = [...arguments];
    if (inMatrix instanceof MatrixNumjs) {
      refArray = inMatrix.mat4;
    } else if (isMatrixArray(inMatrix)) {
      refArray = inMatrix;
    }
    if (refArray.length !== 16) {
      // p5._friendlyError(
      //   `Expected 16 values but received ${refArray.length}.`,
      //   "MatrixNumjs.set"
      // );
      return this;
    }
    this._mat4 = nj.array(refArray);
    return this;
  }

  setElement(index, value) {
    if (this._mat3) {
      this._mat3.set(index, value);
    }
    return this;
  }


  /**
   * Gets a copy of the vector, returns a MatrixNumjs object.
   *
   * @return {MatrixNumjs} the copy of the MatrixNumjs object
   */
  get() {
    let temp = new MatrixNumjs(this.mat4);
    return new MatrixNumjs(this.mat4);
  }

  /**
   * return a copy of this matrix.
   * If this matrix is 4x4, a 4x4 matrix with exactly the same entries will be
   * generated. The same is true if this matrix is 3x3.
   *
   * @return {MatrixNumjs}   the result matrix
   */
  copy() {
    if (this._mat3 !== undefined) {
      const copied3x3 = new MatrixNumjs(3, this._mat3.tolist());
      copied3x3._mat3 = copied3x3._mat3.flatten();
      return copied3x3;
    }
    const copied = new MatrixNumjs(this._mat4.tolist());
    // copied.set(this);
    copied._mat4 = copied._mat4.flatten();
    return copied;
  }

  /**
   * Creates a copy of the current matrix.
   *
   * @returns {MatrixNumjs} A new matrix that is a copy of the current matrix.
   */
  clone() {
    return this.copy();
  }

  /**
   * return an identity matrix
   * @return {MatrixNumjs}   the result matrix
   */
  static identity(pInst) {
    return new MatrixNumjs(pInst);
  }

  /**
   * transpose according to a given matrix
   * @param  {MatrixNumjs|Float32Array|Number[]} a  the matrix to be
   *                                               based on to transpose
   * @chainable
   */
  transpose(a) {
    if (a instanceof MatrixNumjs) {
      if (a._mat3) {
        this._mat3 = nj.array(a.mat3).reshape(3, 3).transpose().flatten();
      } else if (a._mat4) {
        this._mat4 = nj.array(a.mat4).reshape(4, 4).transpose().flatten();
      }
    } else if (isMatrixArray(a)) {
      if (a.length === 9) {
        let temp3 = new MatrixNumjs(3, a);
        this._mat3 = nj.array(temp3.mat3).reshape(3, 3).transpose().flatten();
      } else if (a.length === 16) {
        let temp4 = new MatrixNumjs(a);
        this._mat4 = nj.array(temp4.mat4).reshape(4, 4).transpose().flatten();
      }
    }
    return this;
  }

  /**
   * invert  matrix according to a give matrix
   * @param  {MatrixNumjs|Float32Array|Number[]} a   the matrix to be
   *                                                based on to invert
   * @chainable
   */
  invert(a) {
    let a00, a01, a02, a03, a10, a11, a12, a13;
    let a20, a21, a22, a23, a30, a31, a32, a33;
    if (a instanceof MatrixNumjs) {
      a00 = a._mat4.get(0);
      a01 = a._mat4.get(1);
      a02 = a._mat4.get(2);
      a03 = a._mat4.get(3);
      a10 = a._mat4.get(4);
      a11 = a._mat4.get(5);
      a12 = a._mat4.get(6);
      a13 = a._mat4.get(7);
      a20 = a._mat4.get(8);
      a21 = a._mat4.get(9);
      a22 = a._mat4.get(10);
      a23 = a._mat4.get(11);
      a30 = a._mat4.get(12);
      a31 = a._mat4.get(13);
      a32 = a._mat4.get(14);
      a33 = a._mat4.get(15);
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

    this._mat4.set(0, (a11 * b11 - a12 * b10 + a13 * b09) * det);
    this._mat4.set(1, (a02 * b10 - a01 * b11 - a03 * b09) * det);
    this._mat4.set(2, (a31 * b05 - a32 * b04 + a33 * b03) * det);
    this._mat4.set(3, (a22 * b04 - a21 * b05 - a23 * b03) * det);
    this._mat4.set(4, (a12 * b08 - a10 * b11 - a13 * b07) * det);
    this._mat4.set(5, (a00 * b11 - a02 * b08 + a03 * b07) * det);
    this._mat4.set(6, (a32 * b02 - a30 * b05 - a33 * b01) * det);
    this._mat4.set(7, (a20 * b05 - a22 * b02 + a23 * b01) * det);
    this._mat4.set(8, (a10 * b10 - a11 * b08 + a13 * b06) * det);
    this._mat4.set(9, (a01 * b08 - a00 * b10 - a03 * b06) * det);
    this._mat4.set(10, (a30 * b04 - a31 * b02 + a33 * b00) * det);
    this._mat4.set(11, (a21 * b02 - a20 * b04 - a23 * b00) * det);
    this._mat4.set(12, (a11 * b07 - a10 * b09 - a12 * b06) * det);
    this._mat4.set(13, (a00 * b09 - a01 * b07 + a02 * b06) * det);
    this._mat4.set(14, (a31 * b01 - a30 * b03 - a32 * b00) * det);
    this._mat4.set(15, (a20 * b03 - a21 * b01 + a22 * b00) * det);

    return this;
  }

  /**
   * Inverts a 3×3 matrix
   * @chainable
   */
  invert3x3() {
    const a00 = this._mat3.get(0);
    const a01 = this._mat3.get(1);
    const a02 = this._mat3.get(2);
    const a10 = this._mat3.get(3);
    const a11 = this._mat3.get(4);
    const a12 = this._mat3.get(5);
    const a20 = this._mat3.get(6);
    const a21 = this._mat3.get(7);
    const a22 = this._mat3.get(8);
    const b01 = a22 * a11 - a12 * a21;
    const b11 = -a22 * a10 + a12 * a20;
    const b21 = a21 * a10 - a11 * a20;

    // Calculate the determinant
    let det = a00 * b01 + a01 * b11 + a02 * b21;
    if (!det) {
      return null;
    }
    det = 1.0 / det;
    this._mat3.set(0, b01 * det);
    this._mat3.set(1, (-a22 * a01 + a02 * a21) * det);
    this._mat3.set(2, (a12 * a01 - a02 * a11) * det);
    this._mat3.set(3, b11 * det);
    this._mat3.set(4, (a22 * a00 - a02 * a20) * det);
    this._mat3.set(5, (-a12 * a00 + a02 * a10) * det);
    this._mat3.set(6, b21 * det);
    this._mat3.set(7, (-a21 * a00 + a01 * a20) * det);
    this._mat3.set(8, (a11 * a00 - a01 * a10) * det);
    return this;
  }

  /**
   * This function is only for 3x3 matrices.
   * transposes a 3×3 MatrixNumjs by a mat3
   * If there is an array of arguments, the matrix obtained by transposing
   * the 3x3 matrix generated based on that array is set.
   * If no arguments, it transposes itself and returns it.
   *
   * @param  {Number[]} mat3 1-dimensional array
   * @chainable
   */
  transpose3x3(mat3) {
    if (mat3 === undefined) {
      mat3 = this._mat3;
      this._mat3 = this._mat3.reshape(3, 3).transpose().flatten();
    } else {
      const temp = new MatrixNumjs(3, mat3);
      temp._mat3 = temp._mat3.reshape(3, 3).transpose().flatten();
      this._mat3 = temp._mat3;
    }
    return this;
  }

  /**
   * converts a 4×4 matrix to its 3×3 inverse transform
   * commonly used in MVMatrix to NMatrix conversions.
   * @param  {MatrixNumjs} mat4 the matrix to be based on to invert
   * @chainable
   * @todo  finish implementation
   */
  inverseTranspose({ mat4 }) {
    if (this._mat3 === undefined) {
      // p5._friendlyError("sorry, this function only works with mat3");
    } else {
      //convert mat4 -> mat3
      this._mat3 = this._mat3.flatten();
      this._mat3.set(0, mat4[0]);
      this._mat3.set(1, mat4[1]);
      this._mat3.set(2, mat4[2]);
      this._mat3.set(3, mat4[4]);
      this._mat3.set(4, mat4[5]);
      this._mat3.set(5, mat4[6]);
      this._mat3.set(6, mat4[8]);
      this._mat3.set(7, mat4[9]);
      this._mat3.set(8, mat4[10]);
    }

    const inverse = this.invert3x3();
    // check inverse succeeded
    if (inverse) {
      inverse.transpose3x3(this._mat3);
    } else {
      // in case of singularity, just zero the matrix
      for (let i = 0; i < 9; i++) {
        this._mat3.set(i, 0);
      }
    }
    return this;
  }

  /**
   * inspired by Toji's mat4 determinant
   * @return {Number} Determinant of our 4×4 matrix
   */
  determinant() {
    const d00 =
        this._mat4.get(0) * this._mat4.get(5) -
        this._mat4.get(1) * this._mat4.get(4),
      d01 =
        this._mat4.get(0) * this._mat4.get(6) -
        this._mat4.get(2) * this._mat4.get(4),
      d02 =
        this._mat4.get(0) * this._mat4.get(7) -
        this._mat4.get(3) * this._mat4.get(4),
      d03 =
        this._mat4.get(1) * this._mat4.get(6) -
        this._mat4.get(2) * this._mat4.get(5),
      d04 =
        this._mat4.get(1) * this._mat4.get(7) -
        this._mat4.get(3) * this._mat4.get(5),
      d05 =
        this._mat4.get(2) * this._mat4.get(7) -
        this._mat4.get(3) * this._mat4.get(6),
      d06 =
        this._mat4.get(8) * this._mat4.get(13) -
        this._mat4.get(9) * this._mat4.get(12),
      d07 =
        this._mat4.get(8) * this._mat4.get(14) -
        this._mat4.get(10) * this._mat4.get(12),
      d08 =
        this._mat4.get(8) * this._mat4.get(15) -
        this._mat4.get(11) * this._mat4.get(12),
      d09 =
        this._mat4.get(9) * this._mat4.get(14) -
        this._mat4.get(10) * this._mat4.get(13),
      d10 =
        this._mat4.get(9) * this._mat4.get(15) -
        this._mat4.get(11) * this._mat4.get(13),
      d11 =
        this._mat4.get(10) * this._mat4.get(15) -
        this._mat4.get(11) * this._mat4.get(14);

    // Calculate the determinant
    return (
      d00 * d11 - d01 * d10 + d02 * d09 + d03 * d08 - d04 * d07 + d05 * d06
    );
  }

  /**
   * multiply two mat4s
   * @param {MatrixNumjs|Float32Array|Number[]} multMatrix The matrix
   *                                                we want to multiply by
   * @chainable
   */
  mult(multMatrix) {
    if (isMatrixArray(multMatrix)) {
      multMatrix = new MatrixNumjs(multMatrix);
    }
    if (this._mat3 !== undefined) {
      let a = this._mat3.reshape(3, 3);
      a = a.dot(multMatrix._mat3?.reshape(3, 3)).flatten();
      this._mat3 = a;
    } else if (this._mat4 !== undefined) {
      let a = this._mat4.reshape(4, 4);
      a = a.dot(multMatrix._mat4?.reshape(4, 4)).flatten();
      this._mat4 = a;
    }
    return this;
  }

  apply(multMatrix) {
    let _src;

    if (multMatrix === this || multMatrix === this._mat4) {
      _src = this.copy().mat4; // only need to allocate in this rare case
    } else if (multMatrix instanceof MatrixNumjs) {
      _src = multMatrix.mat4;
    } else if (isMatrixArray(multMatrix)) {
      _src = multMatrix;
    } else if (arguments.length === 16) {
      _src = arguments;
    } else {
      return; // nothing to do.
    }

    const mat4 = this._mat4.tolist();

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
    this._mat4 = nj.array(mat4);
    return this;
  }

  /**
   * scales a MatrixNumjs by scalars or a vector
   * @param  {Vector|Float32Array|Number[]} s vector to scale by
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
    this._mat4 = this._mat4.flatten();
    const vect = nj.array([x, y, z, 1]);
    this._mat4.set(0, x * this._mat4.get(0));
    this._mat4.set(1, x * this._mat4.get(1));
    this._mat4.set(2, x * this._mat4.get(2));
    this._mat4.set(3, x * this._mat4.get(3));
    this._mat4.set(4, y * this._mat4.get(4));
    this._mat4.set(5, y * this._mat4.get(5));
    this._mat4.set(6, y * this._mat4.get(6));
    this._mat4.set(7, y * this._mat4.get(7));
    this._mat4.set(8, z * this._mat4.get(8));
    this._mat4.set(9, z * this._mat4.get(9));
    this._mat4.set(10, z * this._mat4.get(10));
    this._mat4.set(11, z * this._mat4.get(11));
    return this;
  }

  /**
   * rotate our Matrix around an axis by the given angle.
   * @param  {Number} a The angle of rotation in radians
   * @param  {Vector|Number[]} axis  the axis(es) to rotate around
   * @chainable
   * inspired by Toji's gl-matrix lib, mat4 rotation
   */
  rotate(a, x, y, z) {
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

    // const aMat = this._mat4.reshape(4,4)
    this._mat4 = this._mat4.flatten();
    const a00 = this._mat4.get(0);
    const a01 = this._mat4.get(1);
    const a02 = this._mat4.get(2);
    const a03 = this._mat4.get(3);
    const a10 = this._mat4.get(4);
    const a11 = this._mat4.get(5);
    const a12 = this._mat4.get(6);
    const a13 = this._mat4.get(7);
    const a20 = this._mat4.get(8);
    const a21 = this._mat4.get(9);
    const a22 = this._mat4.get(10);
    const a23 = this._mat4.get(11);

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
    this._mat4.set(0, a00 * b00 + a10 * b01 + a20 * b02);
    this._mat4.set(1, a01 * b00 + a11 * b01 + a21 * b02);
    this._mat4.set(2, a02 * b00 + a12 * b01 + a22 * b02);
    this._mat4.set(3, a03 * b00 + a13 * b01 + a23 * b02);
    this._mat4.set(4, a00 * b10 + a10 * b11 + a20 * b12);
    this._mat4.set(5, a01 * b10 + a11 * b11 + a21 * b12);
    this._mat4.set(6, a02 * b10 + a12 * b11 + a22 * b12);
    this._mat4.set(7, a03 * b10 + a13 * b11 + a23 * b12);
    this._mat4.set(8, a00 * b20 + a10 * b21 + a20 * b22);
    this._mat4.set(9, a01 * b20 + a11 * b21 + a21 * b22);
    this._mat4.set(10, a02 * b20 + a12 * b21 + a22 * b22);
    this._mat4.set(11, a03 * b20 + a13 * b21 + a23 * b22);
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
    this._mat4 = this._mat4.flatten();
    this._mat4.set(
      12,
      this._mat4.get(0) * x +
        this._mat4.get(4) * y +
        this._mat4.get(8) * z +
        this._mat4.get(12)
    );
    this._mat4.set(
      13,
      this._mat4.get(1) * x +
        this._mat4.get(5) * y +
        this._mat4.get(9) * z +
        this._mat4.get(13)
    );
    this._mat4.set(
      14,
      this._mat4.get(2) * x +
        this._mat4.get(6) * y +
        this._mat4.get(10) * z +
        this._mat4.get(14)
    );
    this._mat4.set(
      15,
      this._mat4.get(3) * x +
        this._mat4.get(7) * y +
        this._mat4.get(11) * z +
        this._mat4.get(15)
    );
  }

  rotateX(a) {
    this.rotate(a, 1, 0, 0);
  }
  rotateY(a) {
    this.rotate(a, 0, 1, 0);
  }
  rotateZ(a) {
    this.rotate(a, 0, 0, 1);
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

    this._mat4 = this._mat4.flatten();
    this._mat4.set(0, f / aspect);
    this._mat4.set(1, 0);
    this._mat4.set(2, 0);
    this._mat4.set(3, 0);
    this._mat4.set(4, 0);
    this._mat4.set(5, f);
    this._mat4.set(6, 0);
    this._mat4.set(7, 0);
    this._mat4.set(8, 0);
    this._mat4.set(9, 0);
    this._mat4.set(10, (far + near) * nf);
    this._mat4.set(11, -1);
    this._mat4.set(12, 0);
    this._mat4.set(13, 0);
    this._mat4.set(14, 2 * far * near * nf);
    this._mat4.set(15, 0);

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
    this._mat4 = this._mat4.flatten();
    this._mat4.set(0, -2 * lr);
    this._mat4.set(1, 0);
    this._mat4.set(2, 0);
    this._mat4.set(3, 0);
    this._mat4.set(4, 0);
    this._mat4.set(5, -2 * bt);
    this._mat4.set(6, 0);
    this._mat4.set(7, 0);
    this._mat4.set(8, 0);
    this._mat4.set(9, 0);
    this._mat4.set(10, 2 * nf);
    this._mat4.set(11, 0);
    this._mat4.set(12, (left + right) * lr);
    this._mat4.set(13, (top + bottom) * bt);
    this._mat4.set(14, (far + near) * nf);
    this._mat4.set(15, 1);

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
    const m = this._mat4;

    result[0] = m.get(0) * x + m.get(4) * y + m.get(8) * z + m.get(12) * w;
    result[1] = m.get(1) * x + m.get(5) * y + m.get(9) * z + m.get(13) * w;
    result[2] = m.get(2) * x + m.get(6) * y + m.get(10) * z + m.get(14) * w;
    result[3] = m.get(3) * x + m.get(7) * y + m.get(11) * z + m.get(15) * w;

    return result;
  }

  /**
   * Applies a matrix to a vector.
   * The fourth component is set to 1.
   * Returns a vector consisting of the first
   * through third components of the result.
   *
   * @param {Vector}
   * @return {Vector}
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
   * @param {Vector}
   * @return {Vector}
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
   * @param {Vector}
   * @return {Vector}
   */
  multiplyDirection({ x, y, z }) {
    const array = this.multiplyVec4(x, y, z, 0);
    return new Vector(array[0], array[1], array[2]);
  }

  /**
   * This function is only for 3x3 matrices.
   * multiply two mat3s. It is an operation to multiply the 3x3 matrix of
   * the argument from the right. Arguments can be a 3x3 MatrixNumjs,
   * a Float32Array of length 9, or a javascript array of length 9.
   * In addition, it can also be done by enumerating 9 numbers.
   *
   * @param {MatrixNumjs|Float32Array|Number[]} multMatrix The matrix
   *                                                we want to multiply by
   * @chainable
   */
  mult3x3(multMatrix) {
    let _src;
    let tempMatrix = multMatrix;
    if (multMatrix === this || multMatrix === this._mat3) {
      // mat3; // only need to allocate in this rare case
    } else if (multMatrix instanceof MatrixNumjs) {
      _src = multMatrix.mat3;
    } else if (isMatrixArray(multMatrix)) {
      multMatrix._mat3 = nj.array(arguments);
    } else if (arguments.length === 9) {
      tempMatrix = new MatrixNumjs(3, Array.from(arguments));
    } else {
      return; // nothing to do.
    }
    let a = this._mat3.reshape(3, 3);
    a = a.dot(tempMatrix._mat3.reshape(3, 3)).flatten();
    this._mat3 = a;
    return this;
  }

  /**
   * This function is only for 3x3 matrices.
   * A function that returns a column vector of a 3x3 matrix.
   *
   * @param {Number} columnIndex matrix column number
   * @return {Vector}
   */
  column(columnIndex) {
    // let temp = this._mat3.reshape(3,3)
    let vect = new Vector(
      this._mat3.tolist()[3 * columnIndex],
      this._mat3.tolist()[3 * columnIndex + 1],
      this._mat3.tolist()[3 * columnIndex + 2]
    );
    return vect;
  }

  /**
   * This function is only for 3x3 matrices.
   * A function that returns a row vector of a 3x3 matrix.
   *
   * @param {Number} rowIndex matrix row number
   * @return {Vector}
   */
  row(rowIndex) {
    return new Vector(
      this._mat3.tolist()[rowIndex],
      this._mat3.tolist()[rowIndex + 3],
      this._mat3.tolist()[rowIndex + 6]
    );
  }

  /**
   * Returns the diagonal elements of the matrix in the form of an array.
   * A 3x3 matrix will return an array of length 3.
   * A 4x4 matrix will return an array of length 4.
   *
   * @return {Number[]} An array obtained by arranging the diagonal elements
   *                    of the matrix in ascending order of index
   */
  diagonal() {
    if (this._mat3 !== undefined) {
      return this._mat3.reshape(3, 3).diag().tolist();
    }
    return this._mat4.reshape(4, 4).diag().tolist();
  }

  /**
   * This function is only for 3x3 matrices.
   * Takes a vector and returns the vector resulting from multiplying to
   * that vector by this matrix from left.
   *
   * @param {Vector} multVector the vector to which this matrix applies
   * @param {Vector} [target] The vector to receive the result
   * @return {Vector}
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

  /**
   * This function is only for 4x4 matrices.
   * Creates a 3x3 matrix whose entries are the top left 3x3 part and returns it.
   *
   * @return {MatrixNumjs}
   */
  createSubMatrix3x3() {
    const result = new MatrixNumjs(3);
    result._mat3 = result._mat3.flatten();
    result._mat3.set(0, this._mat4.get(0));
    result._mat3.set(1, this._mat4.get(1));
    result._mat3.set(2, this._mat4.get(2));
    result._mat3.set(3, this._mat4.get(4));
    result._mat3.set(4, this._mat4.get(5));
    result._mat3.set(5, this._mat4.get(6));
    result._mat3.set(6, this._mat4.get(8));
    result._mat3.set(7, this._mat4.get(9));
    result._mat3.set(8, this._mat4.get(10));
    return result;
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
  ////@TODO use the MatrixNumjs class to abstract away our MV matrices and
  ///other math
  //const _mvMatrix =
  //[
  //  1.0,0.0,0.0,0.0,
  //  0.0,1.0,0.0,0.0,
  //  0.0,0.0,1.0,0.0,
  //  0.0,0.0,0.0,1.0
  //];
}

