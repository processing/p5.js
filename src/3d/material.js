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
 * [uvMaterial description]
 * @return {[type]} [description]
 */
p5.prototype.uvMaterial = function(){

  var mId = 'normalVert|uvFrag';

  if(!this._graphics.materialInHash(mId)){
    this._graphics.initShaders('normalVert', 'uvFrag');
  }

  if(mId !== this._graphics.getCurShaderId()){
    this._graphics.saveShaders(mId);
  }

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
