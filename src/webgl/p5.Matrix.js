/**
 * @requires constants
 * @todo see methods below needing further implementation.
 * future consideration: implement SIMD optimizations
 * when browser compatibility becomes available
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/
 *   Reference/Global_Objects/SIMD
 */

'use strict';

var p5 = require('../core/main');

var GLMAT_ARRAY_TYPE = Array;
var isMatrixArray = function(x) {
  return x instanceof Array;
};
if (typeof Float32Array !== 'undefined') {
  GLMAT_ARRAY_TYPE = Float32Array;
  isMatrixArray = function(x) {
    return x instanceof Array || x instanceof Float32Array;
  };
}

/**
 * A class to describe a 4x4 matrix
 * for model and view matrix manipulation in the p5js webgl renderer.
 * @class p5.Matrix
 * @private
 * @constructor
 * @param {Array} [mat4] array literal of our 4x4 matrix
 */
p5.Matrix = function() {
  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }

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
      : new GLMAT_ARRAY_TYPE([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }
  return this;
};

/**
 * Sets the x, y, and z component of the vector using two or three separate
 * variables, the data from a p5.Matrix, or the values from a float array.
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
p5.Matrix.prototype.set = function(inMatrix) {
  if (inMatrix instanceof p5.Matrix) {
    this.mat4 = inMatrix.mat4;
    return this;
  } else if (isMatrixArray(inMatrix)) {
    this.mat4 = inMatrix;
    return this;
  } else if (arguments.length === 16) {
    this.mat4[0] = arguments[0];
    this.mat4[1] = arguments[1];
    this.mat4[2] = arguments[2];
    this.mat4[3] = arguments[3];
    this.mat4[4] = arguments[4];
    this.mat4[5] = arguments[5];
    this.mat4[6] = arguments[6];
    this.mat4[7] = arguments[7];
    this.mat4[8] = arguments[8];
    this.mat4[9] = arguments[9];
    this.mat4[10] = arguments[10];
    this.mat4[11] = arguments[11];
    this.mat4[12] = arguments[12];
    this.mat4[13] = arguments[13];
    this.mat4[14] = arguments[14];
    this.mat4[15] = arguments[15];
  }
  return this;
};

/**
 * Gets a copy of the vector, returns a p5.Matrix object.
 *
 * @method get
 * @return {p5.Matrix} the copy of the p5.Matrix object
 */
p5.Matrix.prototype.get = function() {
  return new p5.Matrix(this.mat4, this.p5);
};

/**
 * return a copy of a matrix
 * @method copy
 * @return {p5.Matrix}   the result matrix
 */
p5.Matrix.prototype.copy = function() {
  var copied = new p5.Matrix(this.p5);
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
};

/**
 * return an identity matrix
 * @method identity
 * @return {p5.Matrix}   the result matrix
 */
p5.Matrix.identity = function(pInst) {
  return new p5.Matrix(pInst);
};

/**
 * transpose according to a given matrix
 * @method transpose
 * @param  {p5.Matrix|Float32Array|Number[]} a  the matrix to be
 *                                               based on to transpose
 * @chainable
 */
p5.Matrix.prototype.transpose = function(a) {
  var a01, a02, a03, a12, a13, a23;
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
};

/**
 * invert  matrix according to a give matrix
 * @method invert
 * @param  {p5.Matrix|Float32Array|Number[]} a   the matrix to be
 *                                                based on to invert
 * @chainable
 */
p5.Matrix.prototype.invert = function(a) {
  var a00, a01, a02, a03, a10, a11, a12, a13;
  var a20, a21, a22, a23, a30, a31, a32, a33;
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
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  var det =
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
};

/**
 * Inverts a 3x3 matrix
 * @method invert3x3
 * @chainable
 */
p5.Matrix.prototype.invert3x3 = function() {
  var a00 = this.mat3[0];
  var a01 = this.mat3[1];
  var a02 = this.mat3[2];
  var a10 = this.mat3[3];
  var a11 = this.mat3[4];
  var a12 = this.mat3[5];
  var a20 = this.mat3[6];
  var a21 = this.mat3[7];
  var a22 = this.mat3[8];
  var b01 = a22 * a11 - a12 * a21;
  var b11 = -a22 * a10 + a12 * a20;
  var b21 = a21 * a10 - a11 * a20;

  // Calculate the determinant
  var det = a00 * b01 + a01 * b11 + a02 * b21;
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
};

/**
 * transposes a 3x3 p5.Matrix by a mat3
 * @method transpose3x3
 * @param  {Number[]} mat3 1-dimensional array
 * @chainable
 */
p5.Matrix.prototype.transpose3x3 = function(mat3) {
  var a01 = mat3[1],
    a02 = mat3[2],
    a12 = mat3[5];
  this.mat3[1] = mat3[3];
  this.mat3[2] = mat3[6];
  this.mat3[3] = a01;
  this.mat3[5] = mat3[7];
  this.mat3[6] = a02;
  this.mat3[7] = a12;
  return this;
};

/**
 * converts a 4x4 matrix to its 3x3 inverse tranform
 * commonly used in MVMatrix to NMatrix conversions.
 * @method invertTranspose
 * @param  {p5.Matrix} mat4 the matrix to be based on to invert
 * @chainable
 * @todo  finish implementation
 */
p5.Matrix.prototype.inverseTranspose = function(matrix) {
  if (this.mat3 === undefined) {
    console.error('sorry, this function only works with mat3');
  } else {
    //convert mat4 -> mat3
    this.mat3[0] = matrix.mat4[0];
    this.mat3[1] = matrix.mat4[1];
    this.mat3[2] = matrix.mat4[2];
    this.mat3[3] = matrix.mat4[4];
    this.mat3[4] = matrix.mat4[5];
    this.mat3[5] = matrix.mat4[6];
    this.mat3[6] = matrix.mat4[8];
    this.mat3[7] = matrix.mat4[9];
    this.mat3[8] = matrix.mat4[10];
  }

  var inverse = this.invert3x3();
  // check inverse succeded
  if (inverse) {
    inverse.transpose3x3(this.mat3);
  } else {
    // in case of singularity, just zero the matrix
    for (var i = 0; i < 9; i++) {
      this.mat3[i] = 0;
    }
  }
  return this;
};

/**
 * inspired by Toji's mat4 determinant
 * @method determinant
 * @return {Number} Determinant of our 4x4 matrix
 */
p5.Matrix.prototype.determinant = function() {
  var d00 = this.mat4[0] * this.mat4[5] - this.mat4[1] * this.mat4[4],
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
  return d00 * d11 - d01 * d10 + d02 * d09 + d03 * d08 - d04 * d07 + d05 * d06;
};

/**
 * multiply two mat4s
 * @method mult
 * @param {p5.Matrix|Float32Array|Number[]} multMatrix The matrix
 *                                                we want to multiply by
 * @chainable
 */
p5.Matrix.prototype.mult = function(multMatrix) {
  var _src;

  if (multMatrix === this || multMatrix === this.mat4) {
    _src = this.copy().mat4; // only need to allocate in this rare case
  } else if (multMatrix instanceof p5.Matrix) {
    _src = multMatrix.mat4;
  } else if (isMatrixArray(multMatrix)) {
    _src = multMatrix;
  } else {
    return; // nothing to do.
  }

  // each row is used for the multiplier
  var b0 = this.mat4[0],
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
};

/**
 * scales a p5.Matrix by scalars or a vector
 * @method scale
 * @param  {p5.Vector|Float32Array|Number[]} s vector to scale by
 * @chainable
 */
p5.Matrix.prototype.scale = function(x, y, z) {
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
};

/**
 * rotate our Matrix around an axis by the given angle.
 * @method rotate
 * @param  {Number} a The angle of rotation in radians
 * @param  {p5.Vector|Number[]} axis  the axis(es) to rotate around
 * @chainable
 * inspired by Toji's gl-matrix lib, mat4 rotation
 */
p5.Matrix.prototype.rotate = function(a, x, y, z) {
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

  var len = Math.sqrt(x * x + y * y + z * z);
  x *= 1 / len;
  y *= 1 / len;
  z *= 1 / len;

  var a00 = this.mat4[0];
  var a01 = this.mat4[1];
  var a02 = this.mat4[2];
  var a03 = this.mat4[3];
  var a10 = this.mat4[4];
  var a11 = this.mat4[5];
  var a12 = this.mat4[6];
  var a13 = this.mat4[7];
  var a20 = this.mat4[8];
  var a21 = this.mat4[9];
  var a22 = this.mat4[10];
  var a23 = this.mat4[11];

  //sin,cos, and tan of respective angle
  var sA = Math.sin(a);
  var cA = Math.cos(a);
  var tA = 1 - cA;
  // Construct the elements of the rotation matrix
  var b00 = x * x * tA + cA;
  var b01 = y * x * tA + z * sA;
  var b02 = z * x * tA - y * sA;
  var b10 = x * y * tA - z * sA;
  var b11 = y * y * tA + cA;
  var b12 = z * y * tA + x * sA;
  var b20 = x * z * tA + y * sA;
  var b21 = y * z * tA - x * sA;
  var b22 = z * z * tA + cA;

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
};

/**
 * @todo  finish implementing this method!
 * translates
 * @method translate
 * @param  {Number[]} v vector to translate by
 * @chainable
 */
p5.Matrix.prototype.translate = function(v) {
  var x = v[0],
    y = v[1],
    z = v[2] || 0;
  this.mat4[12] += this.mat4[0] * x + this.mat4[4] * y + this.mat4[8] * z;
  this.mat4[13] += this.mat4[1] * x + this.mat4[5] * y + this.mat4[9] * z;
  this.mat4[14] += this.mat4[2] * x + this.mat4[6] * y + this.mat4[10] * z;
  this.mat4[15] += this.mat4[3] * x + this.mat4[7] * y + this.mat4[11] * z;
};

p5.Matrix.prototype.rotateX = function(a) {
  this.rotate(a, 1, 0, 0);
};
p5.Matrix.prototype.rotateY = function(a) {
  this.rotate(a, 0, 1, 0);
};
p5.Matrix.prototype.rotateZ = function(a) {
  this.rotate(a, 0, 0, 1);
};

/**
 * sets the perspective matrix
 * @method perspective
 * @param  {Number} fovy   [description]
 * @param  {Number} aspect [description]
 * @param  {Number} near   near clipping plane
 * @param  {Number} far    far clipping plane
 * @chainable
 */
p5.Matrix.prototype.perspective = function(fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2),
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
};

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
p5.Matrix.prototype.ortho = function(left, right, bottom, top, near, far) {
  var lr = 1 / (left - right),
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
};

/**
 * PRIVATE
 */
// matrix methods adapted from:
// https://developer.mozilla.org/en-US/docs/Web/WebGL/
// gluPerspective
//
// function _makePerspective(fovy, aspect, znear, zfar){
//    var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
//    var ymin = -ymax;
//    var xmin = ymin * aspect;
//    var xmax = ymax * aspect;
//    return _makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
//  }

////
//// glFrustum
////
//function _makeFrustum(left, right, bottom, top, znear, zfar){
//  var X = 2*znear/(right-left);
//  var Y = 2*znear/(top-bottom);
//  var A = (right+left)/(right-left);
//  var B = (top+bottom)/(top-bottom);
//  var C = -(zfar+znear)/(zfar-znear);
//  var D = -2*zfar*znear/(zfar-znear);
//  var frustrumMatrix =[
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
//var _mvMatrix =
//[
//  1.0,0.0,0.0,0.0,
//  0.0,1.0,0.0,0.0,
//  0.0,0.0,1.0,0.0,
//  0.0,0.0,0.0,1.0
//];

module.exports = p5.Matrix;
