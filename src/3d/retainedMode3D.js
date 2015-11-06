//retained mode is used by rendering 3d_primitives

'use strict';

var p5 = require('../core/core');
var hashCount = 0;

/**
 * _createBuffer
 * @param  {String} gId  key of the geometry object
 * @param  {Array}  arr  array holding bject containing geometry information
 */
p5.Renderer3D.prototype._createBuffer = function(gId, arr) {

  hashCount ++;
  if(hashCount > 1000){
    var key = Object.keys(this.gHash)[0];
    delete this.gHash[key];
    hashCount --;
  }

  var gl = this.GL;
  this.gHash[gId] = {};
  this.gHash[gId].len = [];
  this.gHash[gId].vertexBuffer = [];
  this.gHash[gId].normalBuffer = [];
  this.gHash[gId].uvBuffer = [];
  this.gHash[gId].indexBuffer =[];

  arr.forEach(function(obj){
    this.gHash[gId].len.push(obj.len);
    this.gHash[gId].vertexBuffer.push(gl.createBuffer());
    this.gHash[gId].normalBuffer.push(gl.createBuffer());
    this.gHash[gId].uvBuffer.push(gl.createBuffer());
    this.gHash[gId].indexBuffer.push(gl.createBuffer());
  }.bind(this));
};

/**
 * initBuffer description
 * @param  {String} gId    key of the geometry object
 * @param  {Array}  arr    array holding bject containing geometry information
 */
p5.Renderer3D.prototype.initBuffer = function(gId, arr) {
  this._setDefaultCamera();
  var gl = this.GL;
  this._createBuffer(gId, arr);

  var shaderProgram = this.mHash[this._getCurShaderId()];

  arr.forEach(function(obj, i){
    gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].vertexBuffer[i]);
    gl.bufferData(
      gl.ARRAY_BUFFER, new Float32Array(obj.vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(
      shaderProgram.vertexPositionAttribute,
      3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].normalBuffer[i]);
    gl.bufferData(
      gl.ARRAY_BUFFER, new Float32Array(obj.vertexNormals), gl.STATIC_DRAW);
    gl.vertexAttribPointer(
      shaderProgram.vertexNormalAttribute,
      3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].uvBuffer[i]);
    gl.bufferData(
      gl.ARRAY_BUFFER, new Float32Array(obj.uvs), gl.STATIC_DRAW);
    gl.vertexAttribPointer(
      shaderProgram.textureCoordAttribute,
      2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.gHash[gId].indexBuffer[i]);
    gl.bufferData
     (gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(obj.faces), gl.STATIC_DRAW);
  }.bind(this));
};

/**
 * Draws a buffer given a geometry key ID
 * @param  {String} gId     ID in our geom hash
 */
p5.Renderer3D.prototype.drawBuffer = function(gId) {
  this._setDefaultCamera();
  var gl = this.GL;
  var shaderKey = this._getCurShaderId();
  var shaderProgram = this.mHash[shaderKey];

  this.gHash[gId].len.forEach(function(d, i){
    gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].vertexBuffer[i]);
    gl.vertexAttribPointer(
      shaderProgram.vertexPositionAttribute,
      3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].normalBuffer[i]);
    gl.vertexAttribPointer(
      shaderProgram.vertexNormalAttribute,
      3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].uvBuffer[i]);
    gl.vertexAttribPointer(
      shaderProgram.textureCoordAttribute,
      2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.gHash[gId].indexBuffer[i]);

    this._setMatrixUniforms(shaderKey);

    gl.drawElements(
      gl.TRIANGLES, this.gHash[gId].len[i],
       gl.UNSIGNED_SHORT, 0);
  }.bind(this));
};

module.exports = p5.Renderer3D;