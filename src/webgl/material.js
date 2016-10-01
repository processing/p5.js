/**
 * @module Lights, Camera
 * @submodule Material
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');
var shader = require('./shader');
//require('./p5.Texture');

/**
 * Normal material for geometry. You can view all
 * possible materials in this
 * <a href="https://p5js.org/examples/examples/3D_Materials.php">example</a>.
 * @method normalMaterial
 * @return {p5}                the p5 object
 * @example
 * <div>
 * <code>
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw(){
 *  background(200);
 *  normalMaterial();
 *  sphere(50);
 * }
 * </code>
 * </div>
 *
 * @alt
 * Red, green and blue gradient.
 *
 */
p5.prototype.normalMaterial = function(){
  this._renderer.currentShader = shader.normal;
  return this;
};

/**
 * Texture for geometry.  You can view other possible materials in this
 * <a href="https://p5js.org/examples/examples/3D_Materials.php">example</a>.
 * @method texture
 * @param {p5.Image | p5.MediaElement | p5.Graphics} tex 2-dimensional graphics
 *                    to render as texture
 * @return {p5}                the p5 object
 * @example
 * <div>
 * <code>
 * var img;
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 *   img = loadImage("assets/laDefense.jpg");
 * }
 *
 * function draw(){
 *   background(0);
 *   rotateZ(frameCount * 0.01);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   //pass image as texture
 *   texture(img);
 *   box(200, 200, 200);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * var pg;
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 *   pg = createGraphics(200, 200);
 *   pg.textSize(100);
 * }
 *
 * function draw(){
 *   background(0);
 *   pg.background(255);
 *   pg.text('hello!', 0, 100);
 *   //pass image as texture
 *   texture(pg);
 *   plane(200);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * var vid;
 * function preload(){
 *   vid = createVideo("assets/fingers.mov");
 *   vid.hide();
 *   vid.loop();
 * }
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw(){
 *   background(0);
 *   //pass video frame as texture
 *   texture(vid);
 *   plane(200);
 * }
 * </code>
 * </div>
 *
 * @alt
 * Rotating view of many images umbrella and grid roof on a 3d plane
 * black canvas
 * black canvas
 *
 */
p5.prototype.texture = function(tex){
  this._renderer._setUniform('uSampler', tex);
  this._renderer.shaderDefines.USE_TEXTURE = true;
};

/**
 * Texture Util functions
 */
p5.RendererGL.prototype._applyTexUniform = function(textureObj, slot){
  var gl = this.GL;
  var textureData;

  gl.activeTexture(gl.TEXTURE0 + slot);
  //if argument is not already a texture
  //create a new one
  if(!textureObj.isTexture){
    if (textureObj instanceof p5.Image) {
      textureData = textureObj.canvas;
    }
    //if param is a video
    else if (typeof p5.MediaElement !== 'undefined' &&
             textureObj instanceof p5.MediaElement){
      if(!textureObj.loadedmetadata) {return;}
      textureData = textureObj.elt;
    }
    //used with offscreen 2d graphics renderer
    else if(textureObj instanceof p5.Graphics){
      textureData = textureObj.elt;
    }
    var tex = gl.createTexture();
    textureObj._setProperty('tex', tex);
    textureObj._setProperty('isTexture', true);
    this._bind(tex, textureData);
  }
  else {
    if(textureObj instanceof p5.Graphics ||
      (typeof p5.MediaElement !== 'undefined' &&
      textureObj instanceof p5.MediaElement)){
      textureData = textureObj.elt;
    }
    else if(textureObj instanceof p5.Image){
      textureData = textureObj.canvas;
    }
    this._bind(textureObj.tex, textureData);
  }

  gl.bindTexture(gl.TEXTURE_2D, textureObj.tex);
};

p5.RendererGL.prototype._bind = function(tex, data){
  var gl = this.GL;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0,
    gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texParameteri(gl.TEXTURE_2D,
  gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,
  gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,
  gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,
  gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindTexture(gl.TEXTURE_2D, null);
};

/**
 * Checks whether val is a pot
 * more info on power of 2 here:
 * https://www.opengl.org/wiki/NPOT_Texture
 * @param  {Number}  value
 * @return {Boolean}
 */
// function _isPowerOf2 (value){
//   return (value & (value - 1)) === 0;
// }

/**
 * returns the next highest power of 2 value
 * @param  {Number} value [description]
 * @return {Number}       [description]
 */
// function _nextHighestPOT (value){
//   --value;
//   for (var i = 1; i < 32; i <<= 1) {
//     value = value | value >> i;
//   }
//   return value + 1;

/**
 * Ambient material for geometry with a given color. You can view all
 * possible materials in this
 * <a href="https://p5js.org/examples/examples/3D_Materials.php">example</a>.
 * @method  ambientMaterial
 * @param  {Number|Array|String|p5.Color} v1  gray value,
 * red or hue value (depending on the current color mode),
 * or color Array, or CSS color string
 * @param  {Number}            [v2] optional: green or saturation value
 * @param  {Number}            [v3] optional: blue or brightness value
 * @param  {Number}            [a]  optional: opacity
* @return {p5}                 the p5 object
 * @example
 * <div>
 * <code>
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 * }
 * function draw(){
 *  background(0);
 *  ambientLight(100);
 *  pointLight(250, 250, 250, 100, 100, 0);
 *  ambientMaterial(250);
 *  sphere(50);
 * }
 * </code>
 * </div>
 *
 * @alt
 * radiating light source from top right of canvas
 *
 */
p5.prototype.ambientMaterial = function(v1, v2, v3, a) {
  this._renderer.currentShader = shader.default;

  var colors = this._renderer._applyColorBlend.apply(this._renderer, arguments);
  this._renderer._setUniform('uMaterialColor', colors);
  this._renderer._setUniform('uSpecular', 0, '1i');
  this._renderer.shaderDefines.USE_LIGHTS = true;

  return this;
};

/**
 * Specular material for geometry with a given color. You can view all
 * possible materials in this
 * <a href="https://p5js.org/examples/examples/3D_Materials.php">example</a>.
 * @method specularMaterial
 * @param  {Number|Array|String|p5.Color} v1  gray value,
 * red or hue value (depending on the current color mode),
 * or color Array, or CSS color string
 * @param  {Number}            [v2] optional: green or saturation value
 * @param  {Number}            [v3] optional: blue or brightness value
 * @param  {Number}            [a]  optional: opacity
 * @return {p5}                the p5 object
 * @example
 * <div>
 * <code>
 * function setup(){
 *   createCanvas(100, 100, WEBGL);
 * }
 * function draw(){
 *  background(0);
 *  ambientLight(100);
 *  pointLight(250, 250, 250, 100, 100, 0);
 *  specularMaterial(250);
 *  sphere(50);
 * }
 * </code>
 * </div>
 *
 * @alt
 * diffused radiating light source from top right of canvas
 *
 */
p5.prototype.specularMaterial = function(v1, v2, v3, a) {
  this._renderer.currentShader = shader.default;

  var colors = this._renderer._applyColorBlend.apply(this._renderer, arguments);
  this._renderer._setUniform('uMaterialColor', colors);
  this._renderer._setUniform('uSpecular', 1, '1i');
  this._renderer.shaderDefines.USE_LIGHTS = true;

  return this;
};

/**
 * @private blends colors according to color components.
 * If alpha value is less than 1, we need to enable blending
 * on our gl context.  Otherwise opaque objects need to a depthMask.
 * @param  {Number} v1 [description]
 * @param  {Number} v2 [description]
 * @param  {Number} v3 [description]
 * @param  {Number} a  [description]
 * @return {[Number]}  Normalized numbers array
 */
p5.RendererGL.prototype._applyColorBlend = function(v1,v2,v3,a){
  var gl = this.GL;
  var color = this._pInst.color.apply(
    this._pInst, arguments);
  var colors = color._array;
  if(colors[colors.length-1] < 1.0){
    gl.depthMask(false);
    gl.enable(gl.BLEND);
    gl.blendEquation( gl.FUNC_ADD );
    gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
  } else {
    gl.depthMask(true);
    gl.disable(gl.BLEND);
  }
  return colors;
};

/**
 * Load a shader from external files
 * @method loadShader
 * @return {p5.Shader}
 * @example
 * <div>
 * <code>
 * [TODO: Add example]
 *
 * @alt
 * [TODO: Add alt text]
 *
 */
p5.prototype.loadShader = function(fragShader, vertShader) {
  var loadedShader = new p5.Shader();
  loadedShader.shaderKey = fragShader + '|' + vertShader;

  this.loadStrings(fragShader, function(result) {
    loadedShader.fragSource = result.join('\n');
  });

  if(vertShader !== undefined) {
    this.loadStrings(vertShader, function(result) {
      loadedShader.vertSource = result.join('\n');
    });
  } else {
    loadedShader.vertSource = shader.lightVert;
  }

  return loadedShader;
};

/**
 * Use the specified shader for rendering shapes. Shaders are only compatible
 * with the WebGL renderer, not the default renderer.
 * @method shader
 * @param  {p5.Shader} shader Shader object that you've previously loaded
 * @return {p5}                the p5 object
 * @example
 * <div>
 * <code>
 * [TODO: Add example]
 *
 * @alt
 * [TODO: Add alt text]
 *
 */
p5.prototype.shader = function(shader) {
  this._renderer.currentShader = shader;
  return this;
};

/**
 * Restores the default shader. Code that runs after resetShader() will not
 * be affected by previously defined shaders.
 * @method resetShader
 * @return {p5}                the p5 object
 * @example
 * <div>
 * <code>
 * [TODO: Add example]
 *
 * @alt
 * [TODO: Add alt text]
 *
 */
p5.prototype.resetShader = function() {
  this._renderer.currentShader = shader.default;
  return this;
};

module.exports = p5;
