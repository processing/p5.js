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

  if(mId !== this._graphics.getCurShaderId()){
    this._graphics.saveShaders(mId);
  }

  return this;

};

/**
 * Binds a texture material to current object.
 * @param {image} image
 * @return {[type]} [description]
 */
p5.prototype.texture = function(image){

  var mId = 'normalVert|textureFrag';
  var gl = this._graphics.GL;
  var shaderProgram;

  if(!this._graphics.materialInHash(mId)){
    shaderProgram = this._graphics.initShaders('normalVert', 'textureFrag');
  }

  if(mId !== this._graphics.getCurShaderId()){
    this._graphics.saveShaders(mId);
  }
  //create a texture on the graphics card
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
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

  var color = this._graphics._pInst.color.apply(
    this._graphics._pInst, arguments);
  var colors = _normalizeColor(color.rgba);

  gl.uniform4f( shaderProgram.uMaterialColor,
    colors[0], colors[1], colors[2], colors[3]);

  if(mId !== this._graphics.getCurShaderId()){
    this._graphics.saveShaders(mId);
  }

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
