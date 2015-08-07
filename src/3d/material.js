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
    gl.useProgram(shaderProgram);
  }
  //create a texture on the graphics card
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);

  if (image instanceof p5.Image) {
    image.loadPixels();
    var data = new Uint8Array(image.pixels);
    gl.texImage2D(gl.TEXTURE_2D, 0,
      gl.RGBA, image.width, image.height,
      0, gl.RGBA, gl.UNSIGNED_BYTE, data);
  }
  else {
    //@TODO handle following cases:
    //- raw Image() src data
    //- 2D canvas (p5 inst)
    //- video and pass into fbo
  }
  if (_isPowerOf2(image.width) && _isPowerOf2(image.height)) {
    gl.generateMipmap(gl.TEXTURE_2D);
  } else {
    gl.texParameteri(gl.TETXURE_2D,
      gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TETXURE_2D,
      gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TETXURE_2D,
      gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }
  gl.bindTexture(gl.TEXTURE_2D, null);

  if(mId !== this._graphics.getCurShaderId()){
    this._graphics.saveShaders(mId);
  }
  return this;
};

/*
@TODO:
function initTextureFramebuffer (gl){
  var rttFramebuffer;
  var rttTexture;
  rttFramebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);
  rttFramebuffer.width = 512;
  rttFramebuffer.height = 512;

  rttTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, rttTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,
    gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
    rttFramebuffer.width, rttFramebuffer.height,
    0, gl.RGBA, gl.UNSIGNED_BYTE, null);

  var renderbuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16,
    rttFramebuffer.width, rttFramebuffer.height);

  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D, rttTexture, 0);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
    gl.RENDERBUFFER, renderbuffer);

  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}
*/

/**
 * Checks whether val is a pot so we
 * don't throw mipmap errors
 * @param  {Number}  value
 * @return {Boolean}
 */
function _isPowerOf2 (value) {
  return (value & (value - 1)) === 0;
}

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
