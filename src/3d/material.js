'use strict';

var p5 = require('../core/core');
require('./p5.Texture');

/**
* [normal description]
* @return {[type]} [description]
*/
p5.prototype.normalMaterial = function(){
  this._graphics.getShader('normalVert', 'normalFrag');
  return this;
};

/**
 * @TODO refactor into its own p5.Texture class ||
 * create a texture hash map data structure to keep
 * track of active textures.
 * 
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
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  // Currently buggy, likely bc of p5 object types
  // if(!this._isPowerOf2(image.width) || !this._isPowerOf2(image.height)){
  //   image.width = _nextHighestPOT(image.width);
  //   image.height = _nextHighestPOT(image.height);
  // }
  if (image instanceof p5.Image) {
    image.loadPixels();
    var data = new Uint8Array(image.pixels);
    gl.texImage2D(gl.TEXTURE_2D, 0,
      gl.RGBA, image.width, image.height,
      0, gl.RGBA, gl.UNSIGNED_BYTE, data);
  }
  //if param is a video
  else if (image instanceof p5.MediaElement){
    if(!image.loadedmetadata) {return;}
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
    gl.UNSIGNED_BYTE, image.elt);
  }
  else {
    //@TODO handle following cases:
    //- 2D canvas (p5 inst)
  }
  
  if (_isPowerOf2(image.width) && _isPowerOf2(image.height)) {
    gl.generateMipmap(gl.TEXTURE_2D);
  } else {
    image.width = _nextHighestPOT(image.width);
    image.height = _nextHighestPOT(image.height);
    gl.texParameteri(gl.TETXURE_2D,
      gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TETXURE_2D,
      gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TETXURE_2D,
      gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }
  //this is where we'd activate multi textures
  //eg. gl.activeTexture(gl.TEXTURE0 + (unit || 0));
  //but for now we just have a single texture.
  //@TODO need to extend this functionality
  gl.activeTexture(gl.TEXTURE0 + 0);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, 'uSampler'), 0);
  return this;
};

/**
 * Helper functions; Checks whether val is a pot
 * more info on power of 2 here:
 * https://www.opengl.org/wiki/NPOT_Texture
 * @param  {Number}  value
 * @return {Boolean}
 */
function _isPowerOf2 (value){
  return (value & (value - 1)) === 0;
}

/**
 * returns the next highest power of 2 value
 * @param  {Number} value [description]
 * @return {Number}       [description]
 */
function _nextHighestPOT (value){
  --value;
  for (var i = 1; i < 32; i <<= 1) {
    value = value | value >> i;
  }
  return value + 1;
}

p5.prototype.basicMaterial = function(r, g, b, a){

  var gl = this._graphics.GL;

  var shaderProgram = this._graphics.getShader('normalVert', 'basicFrag');

  gl.useProgram(shaderProgram);
  shaderProgram.uMaterialColor = gl.getUniformLocation(
    shaderProgram, 'uMaterialColor' );

  var color = this._graphics._pInst.color.apply(
    this._graphics._pInst, arguments);
  var colors = color._normalize();

  gl.uniform4f( shaderProgram.uMaterialColor,
    colors[0], colors[1], colors[2], colors[3]);

  return this;

};

p5.prototype.ambientMaterial = function(r, g, b, a) {

  var gl = this._graphics.GL;
  var shaderProgram = this._graphics.getShader('lightVert', 'lightFrag');

  gl.useProgram(shaderProgram);
  shaderProgram.uMaterialColor = gl.getUniformLocation(
    shaderProgram, 'uMaterialColor' );

  var color = this._graphics._pInst.color.apply(
    this._graphics._pInst, arguments);
  var colors = color._normalize();

  gl.uniform4f(shaderProgram.uMaterialColor,
    colors[0], colors[1], colors[2], colors[3]);

  shaderProgram.uSpecular = gl.getUniformLocation(
    shaderProgram, 'uSpecular' );
  gl.uniform1i(shaderProgram.uSpecular, false);

  return this;
};

p5.prototype.specularMaterial = function(r, g, b, a) {

  var gl = this._graphics.GL;
  var shaderProgram = this._graphics.getShader('lightVert', 'lightFrag');

  gl.useProgram(shaderProgram);
  shaderProgram.uMaterialColor = gl.getUniformLocation(
    shaderProgram, 'uMaterialColor' );

  var color = this._graphics._pInst.color.apply(
    this._graphics._pInst, arguments);
  var colors = color._normalize();

  gl.uniform4f(shaderProgram.uMaterialColor,
    colors[0], colors[1], colors[2], colors[3]);

  shaderProgram.uSpecular = gl.getUniformLocation(
    shaderProgram, 'uSpecular' );
  gl.uniform1i(shaderProgram.uSpecular, true);

  return this;
};

module.exports = p5;