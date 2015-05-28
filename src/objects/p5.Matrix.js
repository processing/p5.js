/**
 * @module Matrix
 * @submodule Math
 * @requires constants
 * @todo see methods below needing further implementation.
 */
define(function (require) {

  'use strict';

  var p5 = require('core');
  var polarGeometry = require('polargeometry');
  var constants = require('constants');

  /**
   * A class to describe a 4x4 matrix 
   * for model and view matrix manipulation in the p5js webgl renderer.
   * @class p5.Matrix
   * @constructor
   * @param {Array} [mat4] array literal of our 4x4 matrix
   */
  p5.Matrix = function() {
    // This is how it comes in with createMatrix()
    if(arguments[0] instanceof p5) {
      // save reference to p5 if passed in
      this.p5 = arguments[0];
      this.mat4  = arguments[1] ||
        [1,0,0,0,
         0,1,0,0,
         0,0,1,0,
         0,0,0,1];
    // This is what we'll get with new p5.Matrix()
    // a mat4 identity matrix
    } else {
      this.mat4 = arguments[0] ||
        [1,0,0,0,
         0,1,0,0,
         0,0,1,0,
         0,0,0,1];
    }
  };


  /**
   * Sets the x, y, and z component of the vector using two or three separate
   * variables, the data from a p5.Matrix, or the values from a float array.
   * @method set
   *
   * @param {p5.Matrix|Array} [inMatrix] the input p5.Matrix or 
   *                                     an Array of length 16
   */
  p5.Matrix.prototype.set = function (inMatrix) {
    if (inMatrix instanceof p5.Matrix) {
      this.mat4 = inMatrix.mat4;
      return this;
    }
    else if (inMatrix instanceof Array) {
      this.mat4 = inMatrix;
      return this;
    }
    return this;
  };

  /**
   * Gets a copy of the vector, returns a p5.Matrix object.
   *
   * @method get
   * @return {p5.Matrix} the copy of the p5.Matrix object
   */
  p5.Matrix.prototype.get = function () {
    return new p5.Matrix(this.mat4);
  };

  /**
   * transposes values of our mat4 matrix
   * @param {p5.Matrix | Array } [varname] [description]
   * @return {p5.Matrix} our transposed matrix
   */
  p5.Matrix.prototype.transpose = function(transposeMatrix){
    if(transposeMatrix instanceof p5.Matrix){
      this.mat4[0] = transposeMatrix.mat4[0];
      this.mat4[1] = transposeMatrix.mat4[4];
      this.mat4[2] = transposeMatrix.mat4[8];
      this.mat4[3] = transposeMatrix.mat4[12];
      this.mat4[4] = transposeMatrix.mat4[1];
      this.mat4[5] = transposeMatrix.mat4[5];
      this.mat4[6] = transposeMatrix.mat4[9];
      this.mat4[7] = transposeMatrix.mat4[13];
      this.mat4[8] = transposeMatrix.mat4[2];
      this.mat4[9] = transposeMatrix.mat4[6];
      this.mat4[10] = transposeMatrix.mat4[10];
      this.mat4[11] = transposeMatrix.mat4[14];
      this.mat4[12] = transposeMatrix.mat4[3];
      this.mat4[13] = transposeMatrix.mat4[7];
      this.mat4[14] = transposeMatrix.mat4[11];
      this.mat4[15] = transposeMatrix.mat4[15];
    }
    else if(transposeMatrix instanceof Array) {
      this.mat4[0] = transposeMatrix[0];
      this.mat4[1] = transposeMatrix[4];
      this.mat4[2] = transposeMatrix[8];
      this.mat4[3] = transposeMatrix[12];
      this.mat4[4] = transposeMatrix[1];
      this.mat4[5] = transposeMatrix[5];
      this.mat4[6] = transposeMatrix[9];
      this.mat4[7] = transposeMatrix[13];
      this.mat4[8] = transposeMatrix[2];
      this.mat4[9] = transposeMatrix[6];
      this.mat4[10] = transposeMatrix[10];
      this.mat4[11] = transposeMatrix[14];
      this.mat4[12] = transposeMatrix[3];
      this.mat4[13] = transposeMatrix[7];
      this.mat4[14] = transposeMatrix[11];
      this.mat4[15] = transposeMatrix[15];
    }
    return this;
  };

  /**
   * @return {Number} Determinant of our 4x4 matrix
   * inspired by Toji's mat4 determinant
   */
  p5.Matrix.prototype.determinant = function(){
    var d00 = (this.mat4[0] * this.mat4[5]) - (this.mat4[1] * this.mat4[4]),
      d01 = (this.mat4[0] * this.mat4[6]) - (this.mat4[2] * this.mat4[4]),
      d02 = (this.mat4[0] * this.mat4[7]) - (this.mat4[3] * this.mat4[4]),
      d03 = (this.mat4[1] * this.mat4[6]) - (this.mat4[2] * this.mat4[5]),
      d04 = (this.mat4[1] * this.mat4[7]) - (this.mat4[3] * this.mat4[5]),
      d05 = (this.mat4[2] * this.mat4[7]) - (this.mat4[3] * this.mat4[6]),
      d06 = (this.mat4[8] * this.mat4[13]) - (this.mat4[9] * this.mat4[12]),
      d07 = (this.mat4[8] * this.mat4[14]) - (this.mat4[10] * this.mat4[12]),
      d08 = (this.mat4[8] * this.mat4[15]) - (this.mat4[11] * this.mat4[12]),
      d09 = (this.mat4[9] * this.mat4[14]) - (this.mat4[10] * this.mat4[13]),
      d10 = (this.mat4[9] * this.mat4[15]) - (this.mat4[11] * this.mat4[13]),
      d11 = (this.mat4[10] * this.mat4[15]) - (this.mat4[11] * this.mat4[14]);

    // Calculate the determinant
    return d00 * d11 - d01 * d10 + d02 * d09 +
      d03 * d08 - d04 * d07 + d05 * d06;
  };

  /**
   * multiply two mat4s
   * @param {p5.Matrix | Array} multMatrix The matrix we want to multiply by
   * @return {[type]} [description]
   */
  p5.Matrix.prototype.mult = function(multMatrix){
    var _dest = new Array(16);
    var _src = new Array(16);

    if(multMatrix instanceof p5.Matrix) {
      _src = multMatrix.mat4;
    }
    else if(multMatrix instanceof Array){
      _src = multMatrix;
    }

    // each row is used for the multiplier
    var b0  = this.mat4[0], b1 = this.mat4[1],
      b2 = this.mat4[2], b3 = this.mat4[3];
    _dest[0] = b0*_src[0] + b1*_src[4] + b2*_src[8] + b3*_src[12];
    _dest[1] = b0*_src[1] + b1*_src[5] + b2*_src[9] + b3*_src[13];
    _dest[2] = b0*_src[2] + b1*_src[6] + b2*_src[10] + b3*_src[14];
    _dest[3] = b0*_src[3] + b1*_src[7] + b2*_src[11] + b3*_src[15];

    b0 = this.mat4[4];
    b1 = this.mat4[5];
    b2 = this.mat4[6];
    b3 = this.mat4[7];
    _dest[4] = b0*_src[0] + b1*_src[4] + b2*_src[8] + b3*_src[12];
    _dest[5] = b0*_src[1] + b1*_src[5] + b2*_src[9] + b3*_src[13];
    _dest[6] = b0*_src[2] + b1*_src[6] + b2*_src[10] + b3*_src[14];
    _dest[7] = b0*_src[3] + b1*_src[7] + b2*_src[11] + b3*_src[15];

    b0 = this.mat4[8];
    b1 = this.mat4[9];
    b2 = this.mat4[10];
    b3 = this.mat4[11];
    _dest[8] = b0*_src[0] + b1*_src[4] + b2*_src[8] + b3*_src[12];
    _dest[9] = b0*_src[1] + b1*_src[5] + b2*_src[9] + b3*_src[13];
    _dest[10] = b0*_src[2] + b1*_src[6] + b2*_src[10] + b3*_src[14];
    _dest[11] = b0*_src[3] + b1*_src[7] + b2*_src[11] + b3*_src[15];

    b0 = this.mat4[12];
    b1 = this.mat4[13];
    b2 = this.mat4[14];
    b3 = this.mat4[15];
    _dest[12] = b0*_src[0] + b1*_src[4] + b2*_src[8] + b3*_src[12];
    _dest[13] = b0*_src[1] + b1*_src[5] + b2*_src[9] + b3*_src[13];
    _dest[14] = b0*_src[2] + b1*_src[6] + b2*_src[10] + b3*_src[14];
    _dest[15] = b0*_src[3] + b1*_src[7] + b2*_src[11] + b3*_src[15];
    
    this.mat4 = _dest;

    return this;
  };

  /**
   * [scale description]
   * @param  {p5.Vector} p5v A 3d vector
   * @return {[type]}     [description]
   */
  p5.Matrix.prototype.scale = function(p5v) {
    var x = p5v.x, y = p5v.y, z = p5v.z;
    var _dest = new Array(16);
    
    for (var i = 0; i < this.mat4.length; i++) {
      var row = i % 4;
      switch(row){
      case 0:
        _dest[i] = this.mat4[i]*x;
        break;
      case 1:
        _dest[i] = this.mat4[i]*y;
        break;
      case 2:
        _dest[i] = this.mat4[i]*z;
        break;
      case 3:
        _dest[i] = this.mat4[i];
        break;
      }
    }
    this.mat4 = _dest;
    return this;
  };

  /**
   * rotate our Matrix around an axis by the given angle.
   * @param  {Number} a The angle of rotation in radians
   * @param  {p5.Vector | Array} axis  the axis(es) to rotate around
   * @return {[type]}       [description]
   * inspired by Toji's gl-matrix lib, mat4 rotation
   */
  p5.Matrix.prototype.rotate = function(a, axis){
    var x, y, z, _a, len;

    if (this.p5) {
      if (this.p5._angleMode === constants.DEGREES) {
        _a = polarGeometry.degreesToRadians(a);
      }
    }
    else {
      _a = a;
    }
    if (axis instanceof p5.Vector) {
      x = axis.x;
      y = axis.y;
      z = axis.z;
    }
    else if (axis instanceof Array) {
      x = axis[0];
      y = axis[1];
      z = axis[2];
    }

    len = Math.sqrt(x * x + y * y + z * z);
    x *= (1/len);
    y *= (1/len);
    z *= (1/len);
    
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
    var sA = Math.sin(_a);
    var cA = Math.cos(_a);
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
   * TODO implement these methods
   */
  p5.Matrix.prototype.rotateX = function(){};
  p5.Matrix.prototype.rotateY = function(){};
  p5.Matrix.prototype.rotateZ = function(){};
  p5.Matrix.prototype.translate = function(){};
  p5.Matrix.prototype.invert = function(){};

  return p5.Matrix;
});