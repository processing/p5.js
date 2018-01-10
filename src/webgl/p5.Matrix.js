/**
 *
 *
 * PMatrix3D             p5.Matrix
 *
 * m00 m01 m02 m03       m0 m4 m8  m12
 * m10 m11 m12 m13       m1 m5 m9  m13
 * m20 m21 m22 m23       m2 m6 m10 m14
 * m30 m31 m32 m33       m3 m7 m11 m15
 *
 *
 * p5.Matrix.mat4 = [m0, m1, m2, ... m13, m14, m15]
 * p5.Matrix.mat3 = [m0, m1, m2, ... m6, m7, m8]
 *
 *
 * X axis ........ [ m0,  m1,  m2,  m3  ]
 * Y axis ........ [ m4,  m5,  m6,  m7  ]
 * Z axis ........ [ m8,  m9,  m10, m11 ]
 * translation ... [ m12, m13, m14, m15 ]
 *
 *
 */

/**
 *
 * TODO:
 *
 *  1) remove p5-reference from Matrix class.
 *  2) better separation of 3x3 and 4x4 Matrix.
 *     Or get rid of 3x3 at all, it isnt required.
 *     A normalmatrix can be created from a 4x4 matrix as well and simply
 *     extracted as 3x3 when setting the shader-uniforms.
 *
 */

'use strict';

var p5 = require('../core/core');
var constants = require('../core/constants');
var GLMAT = Float32Array || Array;

/**
 * A class to describe a 4x4 or 3x3 transformation matrix for the p5js webgl
 * renderer.
 *
 * <pre>
 *   <s>construction examples:</s>
 *
 *   new p5.Matrix(); // new 4x4 matrix
 *   new p5.Matrix('mat3'); // new 3x3 matrix
 *
 *   new p5.Matrix(p5.Matrix | Float32Array | Array); // copy
 *
 *   new p5.Matrix(p5); // new 4x4 matrix + p5-reference
 * </pre>
 *
 * @class p5.Matrix
 * @private
 * @constructor
 * @param {} empty - default 4x4-matrix
 * @param {p5.Matrix} copy-constructor
 * @param {Float32Array | Array} matrix data as array, (will be copied).
 * @param {String} 'mat3' - a hint, to create a 3x3-matrix. (see TODO)
 * @param {p5} reference to parent p5 instance. (see TODO)
 * @chainable
 */
p5.Matrix = function() {
  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }

  // check if last arg is p5-reference
  if (args.length && args[args.length - 1] instanceof p5) {
    this.p5 = args[args.length - 1];
  }

  // assume, args[0] is a (typed) array[16]
  var mat;

  // 1) copy constructor
  if (args[0] instanceof p5.Matrix) {
    var other = args[0];
    if (other.p5) this.p5 = other.p5;
    if (other.mat3) this.mat3 = other.mat3.slice();
    if (other.mat4) this.mat4 = other.mat4.slice();
  } else if (args[0] === 'mat3') {
    // 2) 3x3 matrix: check for 'mat3' and eventually given array
    // assume, args[1] is a (typed) array[9]
    mat = args[1];

    // if no valid array, create 3x3 identity
    // note: .length check, instead of .constructor check.
    if (!mat || mat.length !== 9) {
      mat = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    }
    // if available create as Float32Array
    if (Float32Array) {
      mat = new Float32Array(mat);
    }
    this.mat3 = mat;
  } else {
    // 3) 4x4 matrix: this is basically default when no args are given
    // assume, args[0] is a (typed) array[16]
    mat = args[0];

    // if no valid array, create 4x4 identity
    // note: .length check, instead of .constructor check.
    if (!mat || mat.length !== 16) {
      mat = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    }
    // if available create as Float32Array
    if (Float32Array) {
      mat = new Float32Array(mat);
    }
    this.mat4 = mat;
  }

  this.name = 'p5.Matrix'; // for friendly debugger system
  return this;
};

/**
 * Creates and returns a new (deep) copy of this matrix.
 * A copy can also be made by using the copy-constructor.
 *
 * @method copy
 * @return {p5.Matrix} matrix
 * @chainable
 */
p5.Matrix.prototype.copy = function() {
  return new p5.Matrix(this);
};

/**
 * Returns the data (array, length 16 or 9) of this matrix.
 * @method getArray
 * @return {Float32Array} matrix-array
 */
p5.Matrix.prototype.getArray = function() {
  return this.mat4 || this.mat3;
};

/**
 * Returns true if this is a 3x3 matrix.
 * @method isMat3
 * @return {boolean}
 */
p5.Matrix.prototype.isMat3 = function() {
  return this.mat3 && this.mat3.length === 9 && this.mat4 === undefined;
};

/**
 * Returns true if this is a 4x4 matrix.
 * @method isMat3
 * @return {boolean}
 */
p5.Matrix.prototype.isMat4 = function() {
  return this.mat4 && this.mat4.length === 16 && this.mat3 === undefined;
};

/**
 * Creates a new identity matrix.
 *
 * @method identity
 * @return {p5.Matrix} matrix
 * @chainable
 */
p5.Matrix.identity = function() {
  return new p5.Matrix(arguments);
};

/**
 * resets the matrix as identity matrix.
 *
 * @method identity
 * @chainable
 */
p5.Matrix.prototype.identity = function() {
  var mat = this.mat4 || this.mat3;
  if (mat.length === 16) {
    mat[0] = 1;
    mat[4] = 0;
    mat[8] = 0;
    mat[12] = 0;
    mat[1] = 0;
    mat[5] = 1;
    mat[9] = 0;
    mat[13] = 0;
    mat[2] = 0;
    mat[6] = 0;
    mat[10] = 1;
    mat[14] = 0;
    mat[3] = 0;
    mat[7] = 0;
    mat[11] = 0;
    mat[15] = 1;
  } else {
    mat[0] = 1;
    mat[3] = 0;
    mat[6] = 0;
    mat[1] = 0;
    mat[4] = 1;
    mat[7] = 0;
    mat[2] = 0;
    mat[5] = 0;
    mat[8] = 1;
  }
  return this;
};

/**
 * Sets the matrix data (array).
 * Can also be used to extract the rotation (basis) from a 4x4 matrix
 * into a 3x3 matrix.
 * E.g. to build a normalmatrix.
 *
 * <pre>
 *   var m4 = ...
 *   var m3 = new p5.Matrix('mat3').set(m4);
 *       m3.invert().transpose(). // to build a normalmatrix
 * </pre>
 *
 * @method set
 * @param {p5.Matrix | Float32Array | Array} var-args
 * @chainable
 */
p5.Matrix.prototype.set = function() {
  var argslen = arguments.length;
  var args = undefined;

  if (argslen === 1) {
    // valid if either p5.Matrix or GLMAT
    args = arguments[0];
  } else if (argslen === 9 || argslen === 16) {
    // valid if an array[9] or array[16]
    args = new GLMAT(argslen);
    for (var i = 0; i < argslen; ++i) {
      args[i] = arguments[i];
    }
  } else {
    // no valid args
    return this;
  }

  if (args === this) {
    return this;
  }

  // possible mappings:
  //   1) this.mat4 <- msrc.mat4
  //   2) this.mat4 <- msrc.mat3
  //   3) this.mat3 <- msrc.mat4
  //   4) this.mat3 <- msrc.mat3

  var msrc = args.mat4 || args.mat3 || args;
  var mdst = this.mat4 || this.mat3;

  if (mdst.length === 16) {
    if (msrc.length === 16) {
      // this.mat4 < msrc.mat4
      mdst.set(msrc); // copy
    } else {
      // this.mat4 < msrc.mat3
      mdst[0] = msrc[0];
      mdst[4] = msrc[3];
      mdst[8] = msrc[6];
      mdst[1] = msrc[1];
      mdst[5] = msrc[4];
      mdst[9] = msrc[7];
      mdst[2] = msrc[2];
      mdst[6] = msrc[5];
      mdst[10] = msrc[8];
    }
  } else {
    if (msrc.length === 16) {
      // this.mat3 < msrc.mat4
      mdst[0] = msrc[0];
      mdst[3] = msrc[4];
      mdst[6] = msrc[8];
      mdst[1] = msrc[1];
      mdst[4] = msrc[5];
      mdst[7] = msrc[9];
      mdst[2] = msrc[2];
      mdst[5] = msrc[6];
      mdst[8] = msrc[10];
    } else {
      // this.mat3 < msrc.mat3
      mdst.set(msrc); // copy
    }
  }

  return this;
};

/**
 * Multiplies a vector with this matrix:
 *
 * operation: vdst = mat * vsrc
 *
 * note: src can be equal to vdst.
 *
 * @method multVec
 * @param {p5.Vector | Float32Array | Array} vsrc vector
 * @param {p5.Vector | Float32Array | Array} dst vector-result (optional)
 * @returns {Float32Array | Array} the resulting vector
 */
p5.Matrix.prototype.multVec = function(vsrc, vdst) {
  vdst = vdst instanceof Array ? vdst : [];

  var x = 0,
    y = 0,
    z = 0,
    w = 1;

  if (vsrc instanceof p5.Vector) {
    x = vsrc.x;
    y = vsrc.y;
    z = vsrc.z;
  } else if (vsrc instanceof Array) {
    x = vsrc[0];
    y = vsrc[1];
    z = vsrc[2];
    w = vsrc[3];
    w = w === undefined ? 1 : w;
  }

  var mat = this.mat4 || this.mat3;
  if (mat.length === 16) {
    vdst[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12] * w;
    vdst[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13] * w;
    vdst[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14] * w;
    vdst[3] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15] * w;
  } else {
    vdst[0] = mat[0] * x + mat[3] * y + mat[6] * z;
    vdst[1] = mat[1] * x + mat[4] * y + mat[7] * z;
    vdst[2] = mat[2] * x + mat[5] * y + mat[8] * z;
  }

  return vdst;
};

/**
 * Matrix Multiplication: mC = mA * mB
 *
 * operation: mC(mdst|this) = mA(this) * mB(mright)
 *
 * note: both matrices must be of the same size ... mat4 or mat3
 *
 * @method mult
 * @param {p5.Matrix | Float32Array | Array} mright (right side)
 * @param {p5.Matrix | Float32Array | Array} mdst matrix-result (optional)
 * @returns {p5.Matrix} this matrix, as the result of the multiplication
 * @chainable
 */
p5.Matrix.prototype.mult = function(mright, mdst) {
  var x, y, z, w;
  var a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15;

  var mC = mdst || this;
  var mA = this;
  var mB = mright;

  mC = mC.mat4 || mC.mat3 || mC;
  mA = mA.mat4 || mA.mat3 || mA;
  mB = mB.mat4 || mB.mat3 || mB;

  if (mC.length === 16) {
    a0 = mA[0];
    a1 = mA[1];
    a2 = mA[2];
    a3 = mA[3];
    a4 = mA[4];
    a5 = mA[5];
    a6 = mA[6];
    a7 = mA[7];
    a8 = mA[8];
    a9 = mA[9];
    a10 = mA[10];
    a11 = mA[11];
    a12 = mA[12];
    a13 = mA[13];
    a14 = mA[14];
    a15 = mA[15];

    x = mB[0];
    y = mB[1];
    z = mB[2];
    w = mB[3];
    mC[0] = x * a0 + y * a4 + z * a8 + w * a12;
    mC[1] = x * a1 + y * a5 + z * a9 + w * a13;
    mC[2] = x * a2 + y * a6 + z * a10 + w * a14;
    mC[3] = x * a3 + y * a7 + z * a11 + w * a15;

    x = mB[4];
    y = mB[5];
    z = mB[6];
    w = mB[7];
    mC[4] = x * a0 + y * a4 + z * a8 + w * a12;
    mC[5] = x * a1 + y * a5 + z * a9 + w * a13;
    mC[6] = x * a2 + y * a6 + z * a10 + w * a14;
    mC[7] = x * a3 + y * a7 + z * a11 + w * a15;

    x = mB[8];
    y = mB[9];
    z = mB[10];
    w = mB[11];
    mC[8] = x * a0 + y * a4 + z * a8 + w * a12;
    mC[9] = x * a1 + y * a5 + z * a9 + w * a13;
    mC[10] = x * a2 + y * a6 + z * a10 + w * a14;
    mC[11] = x * a3 + y * a7 + z * a11 + w * a15;

    x = mB[12];
    y = mB[13];
    z = mB[14];
    w = mB[15];
    mC[12] = x * a0 + y * a4 + z * a8 + w * a12;
    mC[13] = x * a1 + y * a5 + z * a9 + w * a13;
    mC[14] = x * a2 + y * a6 + z * a10 + w * a14;
    mC[15] = x * a3 + y * a7 + z * a11 + w * a15;
  } else {
    a0 = mA[0];
    a1 = mA[1];
    a2 = mA[2];
    a3 = mA[3];
    a4 = mA[4];
    a5 = mA[5];
    a6 = mA[6];
    a7 = mA[7];
    a8 = mA[8];

    x = mB[0];
    y = mB[1];
    z = mB[2];
    mC[0] = x * a0 + y * a3 + z * a6;
    mC[1] = x * a1 + y * a4 + z * a7;
    mC[2] = x * a2 + y * a5 + z * a8;

    x = mB[3];
    y = mB[4];
    z = mB[5];
    mC[3] = x * a0 + y * a3 + z * a6;
    mC[4] = x * a1 + y * a4 + z * a7;
    mC[5] = x * a2 + y * a5 + z * a8;

    x = mB[6];
    y = mB[7];
    z = mB[8];
    mC[6] = x * a0 + y * a3 + z * a6;
    mC[7] = x * a1 + y * a4 + z * a7;
    mC[8] = x * a2 + y * a5 + z * a8;
  }

  return this;
};

/**
 * Matrix Pre-Multiplication: mC = mA * mB
 *
 * operation: mC(mdst|this) = mA(mleft) * mB(this)
 *
 * note: both matrices must be of the same size ... mat4 or mat3
 *
 * @method mult
 * @param {p5.Matrix | Float32Array | Array} mleft matrix (left side)
 * @returns {p5.Matrix} this matrix, as the result of the multiplication
 * @chainable
 */
p5.Matrix.prototype.premult = function(mleft) {
  mleft.mult(this, this);
  return this;
};

/**
 * If this matrix owns a p5-reference it will respect the p5._angleMode flag.
 *
 * TODO: find a better way for doing this
 *       or, get rid of anglemode and the p5 instance
 *
 * @method assertAngleMode
 * @param {Number} angle
 * @returns {Number} the angle (deg or rad)
 */
p5.Matrix.prototype.assertAngleMode = function(angle) {
  var p5 = this.p5;
  if (p5 && p5._angleMode === constants.DEGREES) {
    return angle * Math.PI / 180.0;
  } else {
    return angle;
  }
};

/**
 * Rotates a matrix by an angle around an axis.
 *
 * @method rotate
 * @param {Number} angle
 * @param {p5.Vector | Float32Array | Array} axis
 * @chainable
 */
p5.Matrix.prototype.rotate = function(angle, axis) {
  var x, y, z;

  if (axis instanceof p5.Vector) {
    x = axis.x;
    y = axis.y;
    z = axis.z;
  } else if (axis instanceof Array) {
    x = axis[0];
    y = axis[1];
    z = axis[2];
  }

  // normalize axis
  var len = x * x + y * y + z * z;
  if (len === 0.0) {
    return null;
  } else if (len !== 1.0) {
    len = 1.0 / Math.sqrt(len);
    x *= len;
    y *= len;
    z *= len;
  }

  // rotation coeffs
  angle = this.assertAngleMode(angle);
  var sA = Math.sin(angle);
  var cA = Math.cos(angle);
  var tA = 1 - cA;

  // rotation matrix
  var x0 = x * x * tA + cA;
  var x1 = x * y * tA - z * sA;
  var x2 = x * z * tA + y * sA;

  var y0 = y * x * tA + z * sA;
  var y1 = y * y * tA + cA;
  var y2 = y * z * tA - x * sA;

  var z0 = z * x * tA - y * sA;
  var z1 = z * y * tA + x * sA;
  var z2 = z * z * tA + cA;

  // this = this * mRotation
  if (this.mat4) {
    this.mult([x0, y0, z0, 0, x1, y1, z1, 0, x2, y2, z2, 0, 0, 0, 0, 1]);
  } else {
    this.mult([x0, y0, z0, x1, y1, z1, x2, y2, z2]);
  }

  return this;
};

/**
 * Rotates a matrix around the X-Axis.
 *
 * @method rotateX
 * @param {Number} angle
 * @chainable
 */
p5.Matrix.prototype.rotateX = function(angle) {
  angle = this.assertAngleMode(angle);
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  this.mult([1, 0, 0, 0, 0, c, +s, 0, 0, -s, c, 0, 0, 0, 0, 1]);

  return this;
};

/**
 * Rotates a matrix around the Y-Axis.
 *
 * @method rotateY
 * @param {Number} angle
 * @chainable
 */
p5.Matrix.prototype.rotateY = function(angle) {
  angle = this.assertAngleMode(angle);
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  this.mult([c, 0, -s, 0, 0, 1, 0, 0, +s, 0, c, 0, 0, 0, 0, 1]);

  return this;
};

/**
 * Rotates a matrix around the Z-Axis.
 *
 * @method rotateY
 * @param {Number} angle
 * @chainable
 */
p5.Matrix.prototype.rotateZ = function(angle) {
  angle = this.assertAngleMode(angle);
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  this.mult([c, +s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

  return this;
};

/**
 * @method shearX
 * @param {Number} angle
 * @chainable
 */
p5.Matrix.prototype.shearX = function(angle) {
  angle = this.assertAngleMode(angle);
  var t = Math.tan(angle);
  // prettier-ignore
  this.mult([1, 0, 0, 0, 
             t, 1, 0, 0, 
             0, 0, 1, 0, 
             0, 0, 0, 1]);

  return this;
};

/**
 * @method shearY
 * @param {Number} angle
 * @chainable
 */
p5.Matrix.prototype.shearY = function(angle) {
  angle = this.assertAngleMode(angle);
  var t = Math.tan(angle);
  // prettier-ignore
  this.mult([1, t, 0, 0, 
             0, 1, 0, 0, 
             0, 0, 1, 0, 
             0, 0, 0, 1]);

  return this;
};

/**
 * Scales this matrix by a given vector or scalar.
 *
 * @method scale
 * @param {p5.Vector|Array|Number} vsrc the scale in x,y,z
 * @chainable
 */
p5.Matrix.prototype.scale = function(vsrc) {
  var x = 1,
    y = 1,
    z = 1;
  if (vsrc instanceof p5.Vector) {
    x = vsrc.x;
    y = vsrc.y;
    z = vsrc.z;
  } else if (vsrc instanceof Array) {
    x = vsrc[0];
    y = vsrc[1];
    z = vsrc[2];
  } else if (typeof vsrc === 'number') {
    x = y = z = vsrc;
  } else {
    // last resort, hope we got some numbers
    x = arguments[0] || 1;
    y = arguments[1] || 1;
    z = arguments[2] || 1;
  }
  var mat = this.mat4 || this.mat3;

  if (mat.length === 16) {
    mat[0] *= x;
    mat[4] *= y;
    mat[8] *= z;
    mat[1] *= x;
    mat[5] *= y;
    mat[9] *= z;
    mat[2] *= x;
    mat[6] *= y;
    mat[10] *= z;
    mat[3] *= x;
    mat[7] *= y;
    mat[11] *= z;
  } else {
    mat[0] *= x;
    mat[3] *= y;
    mat[6] *= z;
    mat[1] *= x;
    mat[4] *= y;
    mat[7] *= z;
    mat[2] *= x;
    mat[5] *= y;
    mat[8] *= z;
  }
  return this;
};

/**
 * Translates this matrix by a given vector.
 *
 * @method translate
 * @param {p5.Vector|Array|Number} vsrc the translation in x,y,z
 * @chainable
 */
p5.Matrix.prototype.translate = function(vsrc) {
  var mat = this.mat4;
  if (mat) {
    var x = 0,
      y = 0,
      z = 0;
    if (vsrc instanceof p5.Vector) {
      x = vsrc.x;
      y = vsrc.y;
      z = vsrc.z;
    } else if (vsrc instanceof Array) {
      x = vsrc[0];
      y = vsrc[1];
      z = vsrc[2];
    } else {
      // last resort, hope we got some numbers
      x = arguments[0] || 0;
      y = arguments[1] || 0;
      z = arguments[2] || 0;
    }
    mat[12] += mat[0] * x + mat[4] * y + mat[8] * z;
    mat[13] += mat[1] * x + mat[5] * y + mat[9] * z;
    mat[14] += mat[2] * x + mat[6] * y + mat[10] * z;
    mat[15] += mat[3] * x + mat[7] * y + mat[11] * z;
  }
  return this;
};

/**
 * sets a column of the matrix.
 *
 * @method setColumn
 * @param {Number} col the column index
 * @param {Array} vsrc the column vector (length 4 or 3)
 * @chainable
 */
p5.Matrix.prototype.setColumn = function(col, vsrc) {
  if (this.mat4) {
    col *= 4;
    this.mat4[col++] = vsrc[0];
    this.mat4[col++] = vsrc[1];
    this.mat4[col++] = vsrc[2];
    this.mat4[col++] = vsrc[3];
  } else {
    col *= 3;
    this.mat3[col++] = vsrc[0];
    this.mat3[col++] = vsrc[1];
    this.mat3[col++] = vsrc[2];
  }

  return this;
};

/**
 * sets a row of the matrix.
 *
 * @method setRow
 * @param {Number} row the row index
 * @param {Array} vsrc the row vector (length 4 or 3)
 * @chainable
 */
p5.Matrix.prototype.setRow = function(row, vsrc) {
  if (this.mat4) {
    row *= 4;
    this.mat4[(row += 4)] = vsrc[0];
    this.mat4[(row += 4)] = vsrc[1];
    this.mat4[(row += 4)] = vsrc[2];
    this.mat4[(row += 4)] = vsrc[3];
  } else {
    row *= 3;
    this.mat3[(row += 3)] = vsrc[0];
    this.mat3[(row += 3)] = vsrc[1];
    this.mat3[(row += 3)] = vsrc[2];
  }

  return this;
};

/**
 * Transpose this matrix by itself or based on a given Matrix.
 *
 * @method transpose
 * @param {p5.matrix|Array} msrc (optional) source of transpose
 * @param {p5.matrix|Array} mdst (optional) result of transpose
 * @chainable
 */
p5.Matrix.prototype.transpose = function(msrc, mdst) {
  msrc = msrc || this;
  mdst = mdst || this;

  var a = mdst.mat4 || mdst.mat3 || mdst;
  var b = msrc.mat4 || msrc.mat3 || msrc;

  var b1, b2, b3, b5, b6, b7, b11;

  if (a.length === 16) {
    b1 = b[1];
    b2 = b[2];
    b3 = b[3];
    b6 = b[6];
    b7 = b[7];
    b11 = b[11];

    a[0] = b[0];
    a[1] = b[4];
    a[2] = b[8];
    a[3] = b[12];
    a[4] = b1;
    a[5] = b[5];
    a[6] = b[9];
    a[7] = b[13];
    a[8] = b2;
    a[9] = b6;
    a[10] = b[10];
    a[11] = b[14];
    a[12] = b3;
    a[13] = b7;
    a[14] = b11;
    a[15] = b[15];
  } else {
    b1 = b[1];
    b2 = b[2];
    b5 = b[5];

    a[0] = b[0];
    a[1] = b[3];
    a[2] = b[6];
    a[3] = b1;
    a[4] = b[4];
    a[5] = b[7];
    a[6] = b2;
    a[7] = b5;
    a[8] = b[8];
  }

  return this;
};

/**
 * Invert this matrix by itself or based on a given Matrix.
 *
 * @method invert
 * @param {p5.matrix|Array} msrc (optional) source of invert
 * @param {p5.matrix|Array} mdst (optional) result of invert
 * @chainable
 */
p5.Matrix.prototype.invert = function(msrc, mdst) {
  msrc = msrc || this;
  mdst = mdst || this;

  mdst = mdst.mat4 || mdst.mat3 || mdst;
  msrc = msrc.mat4 || msrc.mat3 || msrc;

  var a00,
    a01,
    a02,
    a03,
    a10,
    a11,
    a12,
    a13,
    a20,
    a21,
    a22,
    a23,
    a30,
    a31,
    a32,
    a33;
  var b00, b01, b02, b03, b04, b05, b06, b07, b08, b09, b10, b11, b21;
  var det;

  if (msrc.length === 16) {
    a00 = msrc[0];
    a01 = msrc[1];
    a02 = msrc[2];
    a03 = msrc[3];
    a10 = msrc[4];
    a11 = msrc[5];
    a12 = msrc[6];
    a13 = msrc[7];
    a20 = msrc[8];
    a21 = msrc[9];
    a22 = msrc[10];
    a23 = msrc[11];
    a30 = msrc[12];
    a31 = msrc[13];
    a32 = msrc[14];
    a33 = msrc[15];

    b00 = a00 * a11 - a01 * a10;
    b01 = a00 * a12 - a02 * a10;
    b02 = a00 * a13 - a03 * a10;
    b03 = a01 * a12 - a02 * a11;
    b04 = a01 * a13 - a03 * a11;
    b05 = a02 * a13 - a03 * a12;
    b06 = a20 * a31 - a21 * a30;
    b07 = a20 * a32 - a22 * a30;
    b08 = a20 * a33 - a23 * a30;
    b09 = a21 * a32 - a22 * a31;
    b10 = a21 * a33 - a23 * a31;
    b11 = a22 * a33 - a23 * a32;

    // determinant
    det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      return undefined;
    }
    det = 1.0 / det;

    mdst[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    mdst[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    mdst[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    mdst[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    mdst[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    mdst[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    mdst[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    mdst[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    mdst[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    mdst[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    mdst[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    mdst[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    mdst[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    mdst[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    mdst[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    mdst[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  } else {
    a00 = msrc[0];
    a01 = msrc[1];
    a02 = msrc[2];
    a10 = msrc[3];
    a11 = msrc[4];
    a12 = msrc[5];
    a20 = msrc[6];
    a21 = msrc[7];
    a22 = msrc[8];

    b01 = +a22 * a11 - a12 * a21;
    b11 = -a22 * a10 + a12 * a20;
    b21 = +a21 * a10 - a11 * a20;

    // determinant
    det = a00 * b01 + a01 * b11 + a02 * b21;
    if (!det) {
      return undefined;
    }
    det = 1.0 / det;

    mdst[0] = b01 * det;
    mdst[1] = (-a22 * a01 + a02 * a21) * det;
    mdst[2] = (a12 * a01 - a02 * a11) * det;
    mdst[3] = b11 * det;
    mdst[4] = (a22 * a00 - a02 * a20) * det;
    mdst[5] = (-a12 * a00 + a02 * a10) * det;
    mdst[6] = b21 * det;
    mdst[7] = (-a21 * a00 + a01 * a20) * det;
    mdst[8] = (a11 * a00 - a01 * a10) * det;
  }

  return this;
};

/**
 * Computes and returns the determinant of this matrix.
 *
 * @method determinant
 * @returns {Number} the resulting determinant
 */
p5.Matrix.prototype.determinant = function() {
  var a00,
    a01,
    a02,
    a03,
    a10,
    a11,
    a12,
    a13,
    a20,
    a21,
    a22,
    a23,
    a30,
    a31,
    a32,
    a33;
  var b00, b01, b02, b03, b04, b05, b06, b07, b08, b09, b10, b11, b21;
  var det;
  var mat;

  if (this.mat4) {
    mat = this.mat4;
    a00 = mat[0];
    a01 = mat[1];
    a02 = mat[2];
    a03 = mat[3];
    a10 = mat[4];
    a11 = mat[5];
    a12 = mat[6];
    a13 = mat[7];
    a20 = mat[8];
    a21 = mat[9];
    a22 = mat[10];
    a23 = mat[11];
    a30 = mat[12];
    a31 = mat[13];
    a32 = mat[14];
    a33 = mat[15];

    b00 = a00 * a11 - a01 * a10;
    b01 = a00 * a12 - a02 * a10;
    b02 = a00 * a13 - a03 * a10;
    b03 = a01 * a12 - a02 * a11;
    b04 = a01 * a13 - a03 * a11;
    b05 = a02 * a13 - a03 * a12;
    b06 = a20 * a31 - a21 * a30;
    b07 = a20 * a32 - a22 * a30;
    b08 = a20 * a33 - a23 * a30;
    b09 = a21 * a32 - a22 * a31;
    b10 = a21 * a33 - a23 * a31;
    b11 = a22 * a33 - a23 * a32;

    det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  } else {
    mat = this.mat3;
    a00 = mat[0];
    a01 = mat[1];
    a02 = mat[2];
    a10 = mat[3];
    a11 = mat[4];
    a12 = mat[5];
    a20 = mat[6];
    a21 = mat[7];
    a22 = mat[8];

    b01 = +a22 * a11 - a12 * a21;
    b11 = -a22 * a10 + a12 * a20;
    b21 = +a21 * a10 - a11 * a20;

    det = a00 * b01 + a01 * b11 + a02 * b21;
  }

  return det;
};

/**
 * Inverts and Tranposes this Matrix.
 *
 * If this matrix is 3x3 and the source is e.g. a 4x4 modelview matrix, the
 * result is a normalmatrix, used for transforming normals/directions in
 * camera-space.
 *
 * operation: this.set(source).invert().transpose();
 *
 * @param {p5.matrix|Array} msrc (optional) source of invert/transpose
 * @chainable
 */
p5.Matrix.prototype.inverseTranspose = function(msrc) {
  // set source matrix, 4x4 or 3x3
  this.set(msrc || this);

  // invert
  var rval = this.invert();
  if (rval === undefined) {
    return undefined;
  }
  // transpose
  this.transpose();

  // return self
  return this;
};

/**
 * Inverts this 3x3 matrix.
 * @deprecated use matrix.invert();
 */
p5.Matrix.prototype.invert3x3 = function(msrc) {
  return this.invert(msrc || this);
};

/**
 * Tranposes this 3x3 matrix.
 *
 * @deprecated use matrix.transpose();
 */
p5.Matrix.prototype.transpose3x3 = function(msrc) {
  return this.transpose(msrc || this);
};

/**
 * Creates a perspective projection-matrix.
 *
 * @param {Number} fovy Field of View in Y
 * @param {Number} aspect aspect ratio
 * @param {Number} near near clip-plane
 * @param {Number} near far far-plane
 * @chainable
 */
p5.Matrix.prototype.perspective = function(fovy, aspect, near, far) {
  var mat = this.mat4;
  if (mat) {
    var f = 1.0 / Math.tan(fovy / 2);
    var nf = near - far;

    mat[0] = f / aspect;
    mat[1] = 0;
    mat[2] = 0;
    mat[3] = 0;

    mat[4] = 0;
    mat[5] = f * -1; // -1, processing Y-axis
    mat[6] = 0;
    mat[7] = 0;

    mat[8] = 0;
    mat[9] = 0;
    mat[10] = (near + far) / nf;
    mat[11] = -1;
    mat[12] = 0;

    mat[13] = 0;
    mat[14] = 2 * near * far / nf;
    mat[15] = 0;
  }

  return this;
};

/**
 * Creates a frustum projection-matrix.
 *
 * @param {Number} left clipping plane
 * @param {Number} right clipping plane
 * @param {Number} bottom clipping plane
 * @param {Number} top clipping plane
 * @param {Number} near clipping plane
 * @param {Number} far clipping plane
 * @chainable
 */
p5.Matrix.prototype.frustum = function(left, right, bottom, top, near, far) {
  var mat = this.mat4;
  if (mat) {
    var rl = right - left;
    var tb = top - bottom;
    var nf = near - far;

    mat[0] = 2 * near / rl;
    mat[1] = 0;
    mat[2] = 0;
    mat[3] = 0;

    mat[4] = 0;
    mat[5] = 2 * near / tb * -1; // -1, processing Y-axis
    mat[6] = 0;
    mat[7] = 0;

    mat[8] = (right + left) / rl;
    mat[9] = (top + bottom) / tb;
    mat[10] = (near + far) / nf;
    mat[11] = -1.0;

    mat[12] = 0;
    mat[13] = 0;
    mat[14] = 2 * near * far / nf;
    mat[15] = 0;
  }

  return this;
};

/**
 * Creates a orthographic projection-matrix.
 *
 * @param {Number} left clipping plane
 * @param {Number} right clipping plane
 * @param {Number} bottom clipping plane
 * @param {Number} top clipping plane
 * @param {Number} near clipping plane
 * @param {Number} far clipping plane
 * @chainable
 */
p5.Matrix.prototype.ortho = function(left, right, bottom, top, near, far) {
  var mat = this.mat4;
  if (mat) {
    var lr = left - right;
    var bt = bottom - top;
    var nf = near - far;

    mat[0] = -2 / lr;
    mat[1] = 0;
    mat[2] = 0;
    mat[3] = 0;

    mat[4] = 0;
    mat[5] = -2 / bt * -1; // -1, processing Y-axis
    mat[6] = 0;
    mat[7] = 0;

    mat[8] = 0;
    mat[9] = 0;
    mat[10] = 2 / nf;
    mat[11] = 0;

    mat[12] = (left + right) / lr;
    mat[13] = (bottom + top) / bt;
    mat[14] = (near + far) / nf;
    mat[15] = 1;
  }

  return this;
};

/**
 * Creates a formate mutliline-String of this matrix.
 *
 * @returns {String}
 */
p5.Matrix.prototype.toString = function() {
  var s0, s1, s2, s3;
  var p = 4;
  var m = this.mat4 || this.mat3;
  if (m.length === 16) {
    s0 =
      m[0].toFixed(p) +
      ', ' +
      m[4].toFixed(p) +
      ', ' +
      m[8].toFixed(p) +
      ', ' +
      m[12].toFixed(p) +
      '\n';
    s1 =
      m[1].toFixed(p) +
      ', ' +
      m[5].toFixed(p) +
      ', ' +
      m[9].toFixed(p) +
      ', ' +
      m[13].toFixed(p) +
      '\n';
    s2 =
      m[2].toFixed(p) +
      ', ' +
      m[6].toFixed(p) +
      ', ' +
      m[10].toFixed(p) +
      ', ' +
      m[14].toFixed(p) +
      '\n';
    s3 =
      m[3].toFixed(p) +
      ', ' +
      m[7].toFixed(p) +
      ', ' +
      m[11].toFixed(p) +
      ', ' +
      m[15].toFixed(p) +
      '\n';
    return s0 + s1 + s2 + s3;
  } else {
    s0 =
      m[0].toFixed(p) + ', ' + m[3].toFixed(p) + ', ' + m[6].toFixed(p) + '\n';
    s1 =
      m[1].toFixed(p) + ', ' + m[4].toFixed(p) + ', ' + m[7].toFixed(p) + '\n';
    s2 =
      m[2].toFixed(p) + ', ' + m[5].toFixed(p) + ', ' + m[8].toFixed(p) + '\n';
    return s0 + s1 + s2;
  }
};

/**
 * print this matrix to the console.
 * @chainable
 */
p5.Matrix.prototype.print = function() {
  console.log(this.toString());
  return this;
};
