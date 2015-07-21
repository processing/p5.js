'use strict';

var p5 = require('../core/core');

/**
 * [createBuffer description]
 * @param  {[type]} gId [description]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
p5.Renderer3D.prototype.createBuffer = function(gId, obj) {
  var gl = this.GL;
  this.gHash[gId] = {};
  this.gHash[gId].len = obj.len;
  this.gHash[gId].vertexBuffer = gl.createBuffer();
  this.gHash[gId].normalBuffer = gl.createBuffer();
  this.gHash[gId].indexBuffer = gl.createBuffer();
};

/**
 * [initBuffer description]
 * @param  {String} gId    key of the geometry object
 * @param  {Object} obj    an object containing geometry information
 */
p5.Renderer3D.prototype.initBuffer = function(gId, obj) {
  var gl = this.GL;
  this.createBuffer(gId, obj);

  var shaderProgram = this.mHash[this.getCurShaderKey()];

  gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].vertexBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER, new Float32Array(obj.vertices), gl.STATIC_DRAW);
  gl.vertexAttribPointer(
    shaderProgram.vertexPositionAttribute,
    3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].normalBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER, new Float32Array(obj.vertexNormals), gl.STATIC_DRAW);
  gl.vertexAttribPointer(
    shaderProgram.vertexNormalAttribute,
    3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.gHash[gId].indexBuffer);
  gl.bufferData
   (gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(obj.faces), gl.STATIC_DRAW);
};

/**
 * [drawBuffer description]
 * @param  {String} gId     key of the geometery object
 */
p5.Renderer3D.prototype.drawBuffer = function(gId) {
  var gl = this.GL;
  var shaderKey = this.getCurShaderKey();
  var shaderProgram = this.mHash[shaderKey];

  gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].vertexBuffer);
  gl.vertexAttribPointer(
    shaderProgram.vertexPositionAttribute,
    3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].normalBuffer);
  gl.vertexAttribPointer(
    shaderProgram.vertexNormalAttribute,
    3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.gHash[gId].indexBuffer);

  this.setMatrixUniforms(shaderKey);

  gl.drawElements(
    gl.TRIANGLES, this.gHash[gId].len,
     gl.UNSIGNED_SHORT, 0);
};

/**
 * Sets the Matrix Uniforms inside our default shader.
 * @param {String} shaderKey key of current shader
 */
p5.Renderer3D.prototype.setMatrixUniforms = function(shaderKey) {
  var gl = this.GL;
  var shaderProgram = this.mHash[shaderKey];

  gl.useProgram(shaderProgram);

  gl.uniformMatrix4fv(
    shaderProgram.uPMatrixUniform,
    false, this.uPMatrix.mat4);

  gl.uniformMatrix4fv(
    shaderProgram.uMVMatrixUniform,
    false, this.uMVMatrix.mat4);

  this.uNMatrix = new p5.Matrix();
  this.uNMatrix.invert(this.uMVMatrix);
  this.uNMatrix.transpose(this.uNMatrix);

  gl.uniformMatrix4fv(
    shaderProgram.uNMatrixUniform,
    false, this.uNMatrix.mat4);
};

module.exports = p5.Renderer3D;