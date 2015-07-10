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
  g = g / 255 || r;
  b = b / 255 || r;
  a = a || 1.0;

  var mId = 'normalVert|basicFrag';

  if(!this._graphics.materialInHash(mId)){
    //@TODO: figure out how to do this
    // var sp = this._graphics.initShaders(
    // shaders.normalVert, shaders.basicFrag, {
    //   uMaterialColor: [r, g, b, a]
    // });
    // sp.uMaterialColorLoc = gl.getUniformLocation(
    // shaderProgram, 'uMaterialColor' );
    //  gl.uniform4f( program.uMaterialColorLoc, 1.0, 1.0, 1.0, 1.0 );
    this._graphics.initShaders('normalVert', 'basicFrag');
  }

  this._graphics.saveShaders(mId);

  return this;

};

module.exports = p5;