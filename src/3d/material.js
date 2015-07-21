'use strict';

var p5 = require('../core/core');

/**
* [normal description]
* @return {[type]} [description]
*/
p5.prototype.normalMaterial = function(){

  var mId = 'normalVert|normalFrag';

  if(!this._graphics.materialInHash(mId)){
    this._graphics.initShaders('normalVert', 'normalFrag');
  }

  this._graphics.saveShaders(mId);

  return this;

};

/**
* [basic description]
* @param  {[type]} r [description]
* @param  {[type]} g [description]
* @param  {[type]} b [description]
* @param  {[type]} a [description]
* @return {[type]}   [description]
*/
p5.prototype.basicMaterial = function(r, g, b, a){

  r = r / 255 || 0.5;
  g = g === undefined? r : g / 255;
  b = b === undefined? r : b / 255;
  a = a || 1.0;

  var mId = 'normalVert|basicFrag';
  var gl = this._graphics.GL;
  var shaderProgram;

  if(!this._graphics.materialInHash(mId)){
    shaderProgram =
     this._graphics.initShaders('normalVert', 'basicFrag');
  }else{
    shaderProgram = this._graphics.mHash[mId];
  }
  gl.useProgram(shaderProgram);
  shaderProgram.uMaterialColor = gl.getUniformLocation(
    shaderProgram, 'uMaterialColor' );
  gl.uniform4f( shaderProgram.uMaterialColor, r, g, b, a );

  this._graphics.saveShaders(mId);

  return this;

};

module.exports = p5;
