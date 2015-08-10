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
 * @example
 * <div>
 * <code>
 * var img;
 * var theta = 0;
 * img = loadImage("assets/cat.jpg");
 * background(255, 255, 255, 255);
 * translate(0, 0, -200);
 * push();
 * rotateZ(theta * mouseX * 0.001);
 * rotateX(theta * mouseX * 0.001);
 * rotateY(theta * mouseX * 0.001);
 * // pass image as texture
 * texture(img);
 * box(40);
 * pop();
 * theta += 0.05;
 * </code>
 * </div>
 */
p5.prototype.texture = function(image){
  var gl = this._graphics.GL;
  var shaderProgram = this._graphics.getShader('normalVert',
    'textureFrag');
  gl.useProgram(shaderProgram);
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
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, 'uSampler'), 0);
  return this;
};

/**
 * Helper function; Checks whether val is a pot
 * more info on power of 2 here:
 * https://www.opengl.org/wiki/NPOT_Texture
 * @param  {Number}  value
 * @return {Boolean}
 */
function _isPowerOf2 (value) {
  return (value & (value - 1)) === 0;
}

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