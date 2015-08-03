'use strict';

var p5 = require('../core/core');

p5.prototype.ambientLight = function(r, g, b, a){

  var gl = this._graphics.GL;
  var shaderProgram = this._graphics.getShader(
    'directionalLightVert', 'lightFrag');

  gl.useProgram(shaderProgram);
  shaderProgram.uAmbientColor = gl.getUniformLocation(
    shaderProgram, 'uAmbientColor' );

  var color = this._graphics._pInst.color.apply(
    this._graphics._pInst, arguments);
  var colors = _normalizeColor(color.rgba);

  gl.uniform4f( shaderProgram.uAmbientColor,
    colors[0], colors[1], colors[2], colors[3]);

  return this;
};

p5.prototype.directionalLight = function(r, g, b, a, x, y, z) {

  var gl = this._graphics.GL;
  var shaderProgram = this._graphics.getShader(
    'directionalLightVert', 'lightFrag');

  gl.useProgram(shaderProgram);
  shaderProgram.uDirectionalColor = gl.getUniformLocation(
    shaderProgram, 'uDirectionalColor' );

  var color = this._graphics._pInst.color.apply(
    this._graphics._pInst, [r, g, b, a]);
  var colors = _normalizeColor(color.rgba);

  gl.uniform4f( shaderProgram.uDirectionalColor,
    colors[0], colors[1], colors[2], colors[3]);

  shaderProgram.uLightingDirection = gl.getUniformLocation(
    shaderProgram, 'uLightingDirection' );
  gl.uniform3f( shaderProgram.uLightingDirection, x, y, z);

  return this;
};

p5.prototype.pointLight = function() {
  // body...
};

function _normalizeColor(_arr){
  var arr = [];
  _arr.forEach(function(val){
    arr.push(val/255);
  });
  return arr;
}

module.exports = p5;
