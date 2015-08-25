/**
 * @module Lights, Camera
 * @submodule Material
 * @for p5
 * @requires core
 * @requires p5.Texture
 */

'use strict';

var p5 = require('../core/core');
require('./p5.Texture');

/**
 * normal material for geometry
 * @method normalMaterial
 * @return {p5}
 * @example
 * <div>
 * <code>
 * //please call this function before doing any transformation
 * function setup(){
 *   createCanvas(windowWidth, windowHeight, 'webgl');
 * }
 * function draw(){
 *  background(255);
 *  normalMaterial();
 *  sphere(100);
 * }
 * </code>
 * </div>
 */
p5.prototype.normalMaterial = function(){
  this._graphics._getShader('normalVert', 'normalFrag');
  return this;
};

/**
 * texture for geometry
 * @method texture
 * @return {p5}
 * @example
 * <div>
 * <code>
 * var img;
 * function preload(){
 *   img = loadImage("assets/cat.jpg");
 * }
 * function setup(){
 *   createCanvas(windowWidth, windowHeight, 'webgl');
 * }
 * function draw(){
 *   background(255);
 *   rotateZ(frameCount * 0.02);
 *   rotateX(frameCount * 0.02);
 *   rotateY(frameCount * 0.02);
 *   // pass image as texture
 *   texture(img);
 *   box(60);
 * }
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

/**
 * basic material for geometry with a given color
 * @method  basicMaterial
 * @param  {Number|Array|String|p5.Color} v1  gray value,
 * red or hue value (depending on the current color mode),
 * or color Array, or CSS color string
 * @param  {Number}            [v2] optional: green or saturation value
 * @param  {Number}            [v3] optional: blue or brightness value
 * @param  {Number}            [a]  optional: opacity
 * @return {p5}
 * @example
 * <div>
 * <code>
 * function setup(){
 *   createCanvas(windowWidth, windowHeight, 'webgl');
 * }
 * function draw(){
 *  background(0);
 *  rotateX(frameCount * 0.02);
 *  rotateZ(frameCount * 0.02);
 *  basicMaterial(250, 0, 0);
 *  box(100);
 * }
 * </code>
 * </div>
 */
p5.prototype.basicMaterial = function(v1, v2, v3, a){
  var gl = this._graphics.GL;

  var shaderProgram = this._graphics._getShader('normalVert', 'basicFrag');

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

/**
 * ambient material for geometry with a given color
 * @method  ambientMaterial
 * @param  {Number|Array|String|p5.Color} v1  gray value,
 * red or hue value (depending on the current color mode),
 * or color Array, or CSS color string
 * @param  {Number}            [v2] optional: green or saturation value
 * @param  {Number}            [v3] optional: blue or brightness value
 * @param  {Number}            [a]  optional: opacity
 * @return {p5}
 * @example
 * <div>
 * <code>
 * function setup(){
 *   createCanvas(windowWidth, windowHeight, 'webgl');
 * }
 * function draw(){
 *  background(0);
 *  pointLight(250, 250, 250, 100, 100, 0);
 *  ambientMaterial(250);
 *  sphere(100, 128);
 * }
 * </code>
 * </div>
 */
p5.prototype.ambientMaterial = function(v1, v2, v3, a) {
  var gl = this._graphics.GL;
  var shaderProgram = this._graphics._getShader('lightVert', 'lightFrag');

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

/**
 * specular material for geometry with a given color
 * @method specularMaterial
 * @param  {Number|Array|String|p5.Color} v1  gray value,
 * red or hue value (depending on the current color mode),
 * or color Array, or CSS color string
 * @param  {Number}            [v2] optional: green or saturation value
 * @param  {Number}            [v3] optional: blue or brightness value
 * @param  {Number}            [a]  optional: opacity
 * @return {p5}
 * @example
 * <div>
 * <code>
 * function setup(){
 *   createCanvas(windowWidth, windowHeight, 'webgl');
 * }
 * function draw(){
 *  background(0);
 *  pointLight(250, 250, 250, 100, 100, 0);
 *  specularMaterial(250);
 *  sphere(100, 128);
 * }
 * </code>
 * </div>
 */
p5.prototype.specularMaterial = function(v1, v2, v3, a) {
  var gl = this._graphics.GL;
  var shaderProgram = this._graphics._getShader('lightVert', 'lightFrag');

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