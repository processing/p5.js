//retained mode is used by rendering 3d_primitives

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
  this.gHash[gId].uvBuffer = gl.createBuffer();
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

  var shaderProgram = this.mHash[this.getCurShaderId()];

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

  gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].uvBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER, new Float32Array(obj.uvs), gl.STATIC_DRAW);
  gl.vertexAttribPointer(
    shaderProgram.textureCoordAttribute,
    2, gl.FLOAT, false, 0, 0);

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
  var shaderKey = this.getCurShaderId();
  var shaderProgram = this.mHash[shaderKey];

  gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].vertexBuffer);
  gl.vertexAttribPointer(
    shaderProgram.vertexPositionAttribute,
    3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].normalBuffer);
  gl.vertexAttribPointer(
    shaderProgram.vertexNormalAttribute,
    3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].uvBuffer);
  gl.vertexAttribPointer(
    shaderProgram.textureCoordAttribute,
    2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.gHash[gId].indexBuffer);

  this.setMatrixUniforms(shaderKey);

  gl.drawElements(
    gl.TRIANGLES, this.gHash[gId].len,
     gl.UNSIGNED_SHORT, 0);
};

module.exports = p5.Renderer3D;