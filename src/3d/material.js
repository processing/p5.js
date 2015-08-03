'use strict';

var p5 = require('../core/core');

/**
* [normal description]
* @return {[type]} [description]
*/
p5.prototype.normalMaterial = function(){
  this._graphics.getShader('normalVert', 'normalFrag');
  return this;
};

/**
 * [textureMaterial description]
 * @return {[type]} [description]
 */
p5.prototype.textureMaterial = function(){
  this._graphics.getShader('normalVert', 'textureFrag');
  return this;

};

p5.prototype.basicMaterial = function(){

  var gl = this._graphics.GL;

  var shaderProgram = this._graphics.getShader('normalVert', 'basicFrag');

  gl.useProgram(shaderProgram);
  shaderProgram.uMaterialColor = gl.getUniformLocation(
    shaderProgram, 'uMaterialColor' );

  var color = this._graphics._pInst.color.apply(
    this._graphics._pInst, arguments);
  var colors = _normalizeColor(color.rgba);

  gl.uniform4f( shaderProgram.uMaterialColor,
    colors[0], colors[1], colors[2], colors[3]);

  return this;

};

p5.prototype.ambientMaterial = function() {

  var gl = this._graphics.GL;
  var mId = this._graphics.getCurShaderId();
  var shaderProgram = this._graphics.mHash[mId];

  gl.useProgram(shaderProgram);
  shaderProgram.uMaterialColor = gl.getUniformLocation(
    shaderProgram, 'uMaterialColor' );

  var color = this._graphics._pInst.color.apply(
    this._graphics._pInst, arguments);
  var colors = _normalizeColor(color.rgba);

  gl.uniform4f( shaderProgram.uMaterialColor,
    colors[0], colors[1], colors[2], colors[3]);

  return this;
};

p5.prototype.specularMaterial = function() {

  return this;
};


function _normalizeColor(_arr){
  var arr = [];
  _arr.forEach(function(val){
    arr.push(val/255);
  });
  return arr;
}

module.exports = p5;
