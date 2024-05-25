/**
 * @requires constants
 * @todo see methods below needing further implementation.
 * future consideration: implement SIMD optimizations
 * when browser compatibility becomes available
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/
 *   Reference/Global_Objects/SIMD
 */

import p5 from '../core/main';

let GLMAT_ARRAY_TYPE = Array;
let isMatrixArray = x => Array.isArray(x);
if (typeof Float32Array !== 'undefined') {
  GLMAT_ARRAY_TYPE = Float32Array;
  isMatrixArray = x => Array.isArray(x) || x instanceof Float32Array;
}

/**
 * A class to describe a 4×4 matrix
 * for model and view matrix manipulation in the p5js webgl renderer.
 * @class p5.Matrix
 * @private
 * @constructor
 * @param {Array} [mat4] column-major array literal of our 4×4 matrix
 */
p5.Matrix = class {
  constructor(...args){

    // This is default behavior when object
    // instantiated using createMatrix()
    // @todo implement createMatrix() in core/math.js
    if (args.length && args[args.length - 1] instanceof p5) {
      this.p5 = args[args.length - 1];
    }

    if (args[0] === 'mat3') {
      this.mat3 = Array.isArray(args[1])
        ? args[1]
        : new GLMAT_ARRAY_TYPE([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    } else {
      this.mat4 = Array.isArray(args[0])
        ? args[0]
        : new GLMAT_ARRAY_TYPE(
          [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }
    return this;
  }

  reset() {
    if (this.mat3) {
      this.mat3.set([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    } else if (this.mat4) {
      this.mat4.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }
    return this;
  }

  /**
 * Replace the entire contents of a 4x4 matrix.
 * If providing an array or a p5.Matrix, the values will be copied without
 * referencing the source object.
 * Can also provide 16 numbers as individual arguments.
 *
 * @method set
 * @param {p5.Matrix|Float32Array|Number[]} [inMatrix] the input p5.Matrix or
 *                                     an Array of length 16
 * @chainable
 */
  /**
 * @method set
 * @param {Number[]} elements 16 numbers passed by value to avoid
 *                                     array copying.
 * @chainable
 */
  set(inMatrix) {
    let refArray = arguments;
    if (inMatrix instanceof p5.Matrix) {
      refArray = inMatrix.mat4;
    } else if (isMatrixArray(inMatrix)) {
      refArray = inMatrix;
    }
    if (refArray.length !== 16) {
      p5._friendlyError(
        `Expected 16 values but received ${refArray.length}.`,
        'p5.Matrix.set'
      );
      return this;
    }
    for (let i = 0; i < 16; i++) {
      this.mat4[i] = refArray[i];
    }
    return this;
  }

  /**
 * Gets a copy of the vector, returns a p5.Matrix object.
 *
 * @method get
 * @return {p5.Matrix} the copy of the p5.Matrix object
 */
  get() {
    return new p5.Matrix(this.mat4, this.p5);
  }

  /**
 * return a copy of this matrix.
 * If this matrix is 4x4, a 4x4 matrix with exactly the same entries will be
 * generated. The same is true if this matrix is 3x3.
 *
 * @method copy
 * @return {p5.Matrix}   the result matrix
 */
  copy() {
    if (this.mat3 !== undefined) {
      const copied3x3 = new p5.Matrix('mat3', this.p5);
      copied3x3.mat3[0] = this.mat3[0];
      copied3x3.mat3[1] = this.mat3[1];
      copied3x3.mat3[2] = this.mat3[2];
      copied3x3.mat3[3] = this.mat3[3];
      copied3x3.mat3[4] = this.mat3[4];
      copied3x3.mat3[5] = this.mat3[5];
      copied3x3.mat3[6] = this.mat3[6];
      copied3x3.mat3[7] = this.mat3[7];
      copied3x3.mat3[8] = this.mat3[8];
      return copied3x3;
    }
    const copied = new p5.Matrix(this.p5);
    copied.mat4[0] = this.mat4[0];
    copied.mat4[1] = this.mat4[1];
    copied.mat4[2] = this.mat4[2];
    copied.mat4[3] = this.mat4[3];
    copied.mat4[4] = this.mat4[4];
    copied.mat4[5] = this.mat4[5];
    copied.mat4[6] = this.mat4[6];
    copied.mat4[7] = this.mat4[7];
    copied.mat4[8] = this.mat4[8];
    copied.mat4[9] = this.mat4[9];
    copied.mat4[10] = this.mat4[10];
    copied.mat4[11] = this.mat4[11];
    copied.mat4[12] = this.mat4[12];
    copied.mat4[13] = this.mat4[13];
    copied.mat4[14] = this.mat4[14];
    copied.mat4[15] = this.mat4[15];
    return copied;
  }

  /**
 * return an identity matrix
 * @method identity
 * @return {p5.Matrix}   the result matrix
 */
  static identity(pInst){
    return new p5.Matrix(pInst);
  }

  /**
 * transpose according to a given matrix
 * @method transpose
 * @param  {p5.Matrix|Float32Array|Number[]} a  the matrix to be
 *                                               based on to transpose
 * @chainable
 */
  transpose(a) {
    let a01, a02, a03, a12, a13, a23;
    if (a instanceof p5.Matrix) {
      a01 = a.mat4[1];
      a02 = a.mat4[2];
      a03 = a.mat4[3];
      a12 = a.mat4[6];
      a13 = a.mat4[7];
      a23 = a.mat4[11];

      this.mat4[0] = a.mat4[0];
      this.mat4[1] = a.mat4[4];
      this.mat4[2] = a.mat4[8];
      this.mat4[3] = a.mat4[12];
      this.mat4[4] = a01;
      this.mat4[5] = a.mat4[5];
      this.mat4[6] = a.mat4[9];
      this.mat4[7] = a.mat4[13];
      this.mat4[8] = a02;
      this.mat4[9] = a12;
      this.mat4[10] = a.mat4[10];
      this.mat4[11] = a.mat4[14];
      this.mat4[12] = a03;
      this.mat4[13] = a13;
      this.mat4[14] = a23;
      this.mat4[15] = a.mat4[15];
    } else if (isMatrixArray(a)) {
      a01 = a[1];
      a02 = a[2];
      a03 = a[3];
      a12 = a[6];
      a13 = a[7];
      a23 = a[11];

      this.mat4[0] = a[0];
      this.mat4[1] = a[4];
      this.mat4[2] = a[8];
      this.mat4[3] = a[12];
      this.mat4[4] = a01;
      this.mat4[5] = a[5];
      this.mat4[6] = a[9];
      this.mat4[7] = a[13];
      this.mat4[8] = a02;
      this.mat4[9] = a12;
      this.mat4[10] = a[10];
      this.mat4[11] = a[14];
      this.mat4[12] = a03;
      this.mat4[13] = a13;
      this.mat4[14] = a23;
      this.mat4[15] = a[15];
    }
    return this;
  }

  /**
 * invert  matrix according to a give matrix
 * @method invert
 * @param  {p5.Matrix|Float32Array|Number[]} a   the matrix to be
 *                                                based on to invert
 * @chainable
 */
  invert(a) {
    let a00, a01, a02, a03, a10, a11, a12, a13;
    let a20, a21, a22, a23, a30, a31, a32, a33;
    if (a instanceof p5.Matrix) {
      a00 = a.mat4[0];
      a01 = a.mat4[1];
      a02 = a.mat4[2];
      a03 = a.mat4[3];
      a10 = a.mat4[4];
      a11 = a.mat4[5];
      a12 = a.mat4[6];
      a13 = a.mat4[7];
      a20 = a.mat4[8];
      a21 = a.mat4[9];
      a22 = a.mat4[10];
      a23 = a.mat4[11];
      a30 = a.mat4[12];
      a31 = a.mat4[13];
      a32 = a.mat4[14];
      a33 = a.mat4[15];
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

    this.mat4[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    this.mat4[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    this.mat4[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    this.mat4[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    this.mat4[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    this.mat4[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    this.mat4[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    this.mat4[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    this.mat4[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    this.mat4[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    this.mat4[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    this.mat4[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    this.mat4[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    this.mat4[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    this.mat4[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    this.mat4[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return this;
  }

  /**
 * Inverts a 3×3 matrix
 * @method invert3x3
 * @chainable
 */
  invert3x3() {
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
 * This function is only for 3x3 matrices.
 * transposes a 3×3 p5.Matrix by a mat3
 * If there is an array of arguments, the matrix obtained by transposing
 * the 3x3 matrix generated based on that array is set.
 * If no arguments, it transposes itself and returns it.
 *
 * @method transpose3x3
 * @param  {Number[]} mat3 1-dimensional array
 * @chainable
 */
  transpose3x3(mat3) {
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
 * converts a 4×4 matrix to its 3×3 inverse transform
 * commonly used in MVMatrix to NMatrix conversions.
 * @method invertTranspose
 * @param  {p5.Matrix} mat4 the matrix to be based on to invert
 * @chainable
 * @todo  finish implementation
 */
  inverseTranspose({ mat4 }) {
    if (this.mat3 === undefined) {
      p5._friendlyError('sorry, this function only works with mat3');
    } else {
    //convert mat4 -> mat3
      this.mat3[0] = mat4[0];
      this.mat3[1] = mat4[1];
      this.mat3[2] = mat4[2];
      this.mat3[3] = mat4[4];
      this.mat3[4] = mat4[5];
      this.mat3[5] = mat4[6];
      this.mat3[6] = mat4[8];
      this.mat3[7] = mat4[9];
      this.mat3[8] = mat4[10];
    }

    const inverse = this.invert3x3();
    // check inverse succeeded
    if (inverse) {
      inverse.transpose3x3(this.mat3);
    } else {
    // in case of singularity, just zero the matrix
      for (let i = 0; i < 9; i++) {
        this.mat3[i] = 0;
      }
    }
    return this;
  }

  /**
 * inspired by Toji's mat4 determinant
 * @method determinant
 * @return {Number} Determinant of our 4×4 matrix
 */
  determinant() {
    const d00 = this.mat4[0] * this.mat4[5] - this.mat4[1] * this.mat4[4],
      d01 = this.mat4[0] * this.mat4[6] - this.mat4[2] * this.mat4[4],
      d02 = this.mat4[0] * this.mat4[7] - this.mat4[3] * this.mat4[4],
      d03 = this.mat4[1] * this.mat4[6] - this.mat4[2] * this.mat4[5],
      d04 = this.mat4[1] * this.mat4[7] - this.mat4[3] * this.mat4[5],
      d05 = this.mat4[2] * this.mat4[7] - this.mat4[3] * this.mat4[6],
      d06 = this.mat4[8] * this.mat4[13] - this.mat4[9] * this.mat4[12],
      d07 = this.mat4[8] * this.mat4[14] - this.mat4[10] * this.mat4[12],
      d08 = this.mat4[8] * this.mat4[15] - this.mat4[11] * this.mat4[12],
      d09 = this.mat4[9] * this.mat4[14] - this.mat4[10] * this.mat4[13],
      d10 = this.mat4[9] * this.mat4[15] - this.mat4[11] * this.mat4[13],
      d11 = this.mat4[10] * this.mat4[15] - this.mat4[11] * this.mat4[14];

    // Calculate the determinant
    return d00 * d11 - d01 * d10 + d02 * d09 +
    d03 * d08 - d04 * d07 + d05 * d06;
  }

  /**
 * multiply two mat4s
 * @method mult
 * @param {p5.Matrix|Float32Array|Number[]} multMatrix The matrix
 *                                                we want to multiply by
 * @chainable
 */
  mult(multMatrix) {
    let _src;

    if (multMatrix === this || multMatrix === this.mat4) {
      _src = this.copy().mat4; // only need to allocate in this rare case
    } else if (multMatrix instanceof p5.Matrix) {
      _src = multMatrix.mat4;
    } else if (isMatrixArray(multMatrix)) {
      _src = multMatrix;
    } else if (arguments.length === 16) {
      _src = arguments;
    } else {
      return; // nothing to do.
    }

    // each row is used for the multiplier
    let b0 = this.mat4[0],
      b1 = this.mat4[1],
      b2 = this.mat4[2],
      b3 = this.mat4[3];
    this.mat4[0] = b0 * _src[0] + b1 * _src[4] + b2 * _src[8] + b3 * _src[12];
    this.mat4[1] = b0 * _src[1] + b1 * _src[5] + b2 * _src[9] + b3 * _src[13];
    this.mat4[2] = b0 * _src[2] + b1 * _src[6] + b2 * _src[10] + b3 * _src[14];
    this.mat4[3] = b0 * _src[3] + b1 * _src[7] + b2 * _src[11] + b3 * _src[15];

    b0 = this.mat4[4];
    b1 = this.mat4[5];
    b2 = this.mat4[6];
    b3 = this.mat4[7];
    this.mat4[4] = b0 * _src[0] + b1 * _src[4] + b2 * _src[8] + b3 * _src[12];
    this.mat4[5] = b0 * _src[1] + b1 * _src[5] + b2 * _src[9] + b3 * _src[13];
    this.mat4[6] = b0 * _src[2] + b1 * _src[6] + b2 * _src[10] + b3 * _src[14];
    this.mat4[7] = b0 * _src[3] + b1 * _src[7] + b2 * _src[11] + b3 * _src[15];

    b0 = this.mat4[8];
    b1 = this.mat4[9];
    b2 = this.mat4[10];
    b3 = this.mat4[11];
    this.mat4[8] = b0 * _src[0] + b1 * _src[4] + b2 * _src[8] + b3 * _src[12];
    this.mat4[9] = b0 * _src[1] + b1 * _src[5] + b2 * _src[9] + b3 * _src[13];
    this.mat4[10] = b0 * _src[2] + b1 * _src[6] + b2 * _src[10] + b3 * _src[14];
    this.mat4[11] = b0 * _src[3] + b1 * _src[7] + b2 * _src[11] + b3 * _src[15];

    b0 = this.mat4[12];
    b1 = this.mat4[13];
    b2 = this.mat4[14];
    b3 = this.mat4[15];
    this.mat4[12] = b0 * _src[0] + b1 * _src[4] + b2 * _src[8] + b3 * _src[12];
    this.mat4[13] = b0 * _src[1] + b1 * _src[5] + b2 * _src[9] + b3 * _src[13];
    this.mat4[14] = b0 * _src[2] + b1 * _src[6] + b2 * _src[10] + b3 * _src[14];
    this.mat4[15] = b0 * _src[3] + b1 * _src[7] + b2 * _src[11] + b3 * _src[15];

    return this;
  }

  apply(multMatrix) {
    let _src;

    if (multMatrix === this || multMatrix === this.mat4) {
      _src = this.copy().mat4; // only need to allocate in this rare case
    } else if (multMatrix instanceof p5.Matrix) {
      _src = multMatrix.mat4;
    } else if (isMatrixArray(multMatrix)) {
      _src = multMatrix;
    } else if (arguments.length === 16) {
      _src = arguments;
    } else {
      return; // nothing to do.
    }

    const mat4 = this.mat4;

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
 * @method scale
 * @param  {p5.Vector|Float32Array|Number[]} s vector to scale by
 * @chainable
 */
  scale(x, y, z) {
    if (x instanceof p5.Vector) {
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

    this.mat4[0] *= x;
    this.mat4[1] *= x;
    this.mat4[2] *= x;
    this.mat4[3] *= x;
    this.mat4[4] *= y;
    this.mat4[5] *= y;
    this.mat4[6] *= y;
    this.mat4[7] *= y;
    this.mat4[8] *= z;
    this.mat4[9] *= z;
    this.mat4[10] *= z;
    this.mat4[11] *= z;

    return this;
  }

  /**
 * rotate our Matrix around an axis by the given angle.
 * @method rotate
 * @param  {Number} a The angle of rotation in radians
 * @param  {p5.Vector|Number[]} axis  the axis(es) to rotate around
 * @chainable
 * inspired by Toji's gl-matrix lib, mat4 rotation
 */
  rotate(a, x, y, z) {
    if (x instanceof p5.Vector) {
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

    const a00 = this.mat4[0];
    const a01 = this.mat4[1];
    const a02 = this.mat4[2];
    const a03 = this.mat4[3];
    const a10 = this.mat4[4];
    const a11 = this.mat4[5];
    const a12 = this.mat4[6];
    const a13 = this.mat4[7];
    const a20 = this.mat4[8];
    const a21 = this.mat4[9];
    const a22 = this.mat4[10];
    const a23 = this.mat4[11];

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
    this.mat4[0] = a00 * b00 + a10 * b01 + a20 * b02;
    this.mat4[1] = a01 * b00 + a11 * b01 + a21 * b02;
    this.mat4[2] = a02 * b00 + a12 * b01 + a22 * b02;
    this.mat4[3] = a03 * b00 + a13 * b01 + a23 * b02;
    this.mat4[4] = a00 * b10 + a10 * b11 + a20 * b12;
    this.mat4[5] = a01 * b10 + a11 * b11 + a21 * b12;
    this.mat4[6] = a02 * b10 + a12 * b11 + a22 * b12;
    this.mat4[7] = a03 * b10 + a13 * b11 + a23 * b12;
    this.mat4[8] = a00 * b20 + a10 * b21 + a20 * b22;
    this.mat4[9] = a01 * b20 + a11 * b21 + a21 * b22;
    this.mat4[10] = a02 * b20 + a12 * b21 + a22 * b22;
    this.mat4[11] = a03 * b20 + a13 * b21 + a23 * b22;

    return this;
  }

  /**
 * @todo  finish implementing this method!
 * translates
 * @method translate
 * @param  {Number[]} v vector to translate by
 * @chainable
 */
  translate(v) {
    const x = v[0],
      y = v[1],
      z = v[2] || 0;
    this.mat4[12] += this.mat4[0] * x + this.mat4[4] * y + this.mat4[8] * z;
    this.mat4[13] += this.mat4[1] * x + this.mat4[5] * y + this.mat4[9] * z;
    this.mat4[14] += this.mat4[2] * x + this.mat4[6] * y + this.mat4[10] * z;
    this.mat4[15] += this.mat4[3] * x + this.mat4[7] * y + this.mat4[11] * z;
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
 * @method perspective
 * @param  {Number} fovy   [description]
 * @param  {Number} aspect [description]
 * @param  {Number} near   near clipping plane
 * @param  {Number} far    far clipping plane
 * @chainable
 */
  perspective(fovy, aspect, near, far) {
    const f = 1.0 / Math.tan(fovy / 2),
      nf = 1 / (near - far);

    this.mat4[0] = f / aspect;
    this.mat4[1] = 0;
    this.mat4[2] = 0;
    this.mat4[3] = 0;
    this.mat4[4] = 0;
    this.mat4[5] = f;
    this.mat4[6] = 0;
    this.mat4[7] = 0;
    this.mat4[8] = 0;
    this.mat4[9] = 0;
    this.mat4[10] = (far + near) * nf;
    this.mat4[11] = -1;
    this.mat4[12] = 0;
    this.mat4[13] = 0;
    this.mat4[14] = 2 * far * near * nf;
    this.mat4[15] = 0;

    return this;
  }

  /**
 * sets the ortho matrix
 * @method ortho
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
    this.mat4[0] = -2 * lr;
    this.mat4[1] = 0;
    this.mat4[2] = 0;
    this.mat4[3] = 0;
    this.mat4[4] = 0;
    this.mat4[5] = -2 * bt;
    this.mat4[6] = 0;
    this.mat4[7] = 0;
    this.mat4[8] = 0;
    this.mat4[9] = 0;
    this.mat4[10] = 2 * nf;
    this.mat4[11] = 0;
    this.mat4[12] = (left + right) * lr;
    this.mat4[13] = (top + bottom) * bt;
    this.mat4[14] = (far + near) * nf;
    this.mat4[15] = 1;

    return this;
  }

  /**
 * apply a matrix to a vector with x,y,z,w components
 * get the results in the form of an array
 * @method multiplyVec4
 * @param {Number}
 * @return {Number[]}
 */
  multiplyVec4(x, y, z, w) {
    const result = new Array(4);
    const m = this.mat4;

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
 * @method multiplyPoint
 * @param {p5.Vector}
 * @return {p5.Vector}
 */
  multiplyPoint({ x, y, z }) {
    const array = this.multiplyVec4(x, y, z, 1);
    return new p5.Vector(array[0], array[1], array[2]);
  }

  /**
 * Applies a matrix to a vector.
 * The fourth component is set to 1.
 * Returns the result of dividing the 1st to 3rd components
 * of the result by the 4th component as a vector.
 *
 * @method multiplyAndNormalizePoint
 * @param {p5.Vector}
 * @return {p5.Vector}
 */
  multiplyAndNormalizePoint({ x, y, z }) {
    const array = this.multiplyVec4(x, y, z, 1);
    array[0] /= array[3];
    array[1] /= array[3];
    array[2] /= array[3];
    return new p5.Vector(array[0], array[1], array[2]);
  }

  /**
 * Applies a matrix to a vector.
 * The fourth component is set to 0.
 * Returns a vector consisting of the first
 * through third components of the result.
 *
 * @method multiplyDirection
 * @param {p5.Vector}
 * @return {p5.Vector}
 */
  multiplyDirection({ x, y, z }) {
    const array = this.multiplyVec4(x, y, z, 0);
    return new p5.Vector(array[0], array[1], array[2]);
  }

  /**
 * This function is only for 3x3 matrices.
 * multiply two mat3s. It is an operation to multiply the 3x3 matrix of
 * the argument from the right. Arguments can be a 3x3 p5.Matrix,
 * a Float32Array of length 9, or a javascript array of length 9.
 * In addition, it can also be done by enumerating 9 numbers.
 *
 * @method mult3x3
 * @param {p5.Matrix|Float32Array|Number[]} multMatrix The matrix
 *                                                we want to multiply by
 * @chainable
 */
  mult3x3(multMatrix) {
    let _src;

    if (multMatrix === this || multMatrix === this.mat3) {
      _src = this.copy().mat3; // only need to allocate in this rare case
    } else if (multMatrix instanceof p5.Matrix) {
      _src = multMatrix.mat3;
    } else if (isMatrixArray(multMatrix)) {
      _src = multMatrix;
    } else if (arguments.length === 9) {
      _src = arguments;
    } else {
      return; // nothing to do.
    }

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
 * This function is only for 3x3 matrices.
 * A function that returns a column vector of a 3x3 matrix.
 *
 * @method column
 * @param {Number} columnIndex matrix column number
 * @return {p5.Vector}
 */
  column(columnIndex) {
    return new p5.Vector(
      this.mat3[3 * columnIndex],
      this.mat3[3 * columnIndex + 1],
      this.mat3[3 * columnIndex + 2]
    );
  }

  /**
 * This function is only for 3x3 matrices.
 * A function that returns a row vector of a 3x3 matrix.
 *
 * @method row
 * @param {Number} rowIndex matrix row number
 * @return {p5.Vector}
 */
  row(rowIndex) {
    return new p5.Vector(
      this.mat3[rowIndex],
      this.mat3[rowIndex + 3],
      this.mat3[rowIndex + 6]
    );
  }

  /**
 * Returns the diagonal elements of the matrix in the form of an array.
 * A 3x3 matrix will return an array of length 3.
 * A 4x4 matrix will return an array of length 4.
 *
 * @method diagonal
 * @return {Number[]} An array obtained by arranging the diagonal elements
 *                    of the matrix in ascending order of index
 */
  diagonal() {
    if (this.mat3 !== undefined) {
      return [this.mat3[0], this.mat3[4], this.mat3[8]];
    }
    return [this.mat4[0], this.mat4[5], this.mat4[10], this.mat4[15]];
  }

  /**
 * This function is only for 3x3 matrices.
 * Takes a vector and returns the vector resulting from multiplying to
 * that vector by this matrix from left.
 *
 * @method multiplyVec3
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

  /**
 * This function is only for 4x4 matrices.
 * Creates a 3x3 matrix whose entries are the top left 3x3 part and returns it.
 *
 * @method createSubMatrix3x3
 * @return {p5.Matrix}
 */
  createSubMatrix3x3() {
    const result = new p5.Matrix('mat3');
    result.mat3[0] = this.mat4[0];
    result.mat3[1] = this.mat4[1];
    result.mat3[2] = this.mat4[2];
    result.mat3[3] = this.mat4[4];
    result.mat3[4] = this.mat4[5];
    result.mat3[5] = this.mat4[6];
    result.mat3[6] = this.mat4[8];
    result.mat3[7] = this.mat4[9];
    result.mat3[8] = this.mat4[10];
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
////@TODO use the p5.Matrix class to abstract away our MV matrices and
///other math
//const _mvMatrix =
//[
//  1.0,0.0,0.0,0.0,
//  0.0,1.0,0.0,0.0,
//  0.0,0.0,1.0,0.0,
//  0.0,0.0,0.0,1.0
//];
};
export default p5.Matrix;
