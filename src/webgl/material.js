/**
 * @module Lights, Camera
 * @submodule Material
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');
var constants = require('../core/constants');
require('./p5.Texture');


/**
 * Loads a custom shader from the provided vertex and fragment
 * shader paths. The shader files are loaded asynchronously in the
 * background, so this method should be used in preload().
 *
 * For now, there are three main types of shaders. p5 will automatically
 * supply appropriate vertices, normals, colors, and lighting attributes
 * if the parameters defined in the shader match the names.
 *
 * @method loadShader
 * @param {String} [vertFilename] path to file containing vertex shader
 * source code
 * @param {String} [fragFilename] path to file containing fragment shader
 * source code
 * @return {p5.Shader} a shader object created from the provided
 * vertex and fragment shader files.
 */
p5.prototype.loadShader = function (vertFilename, fragFilename) {
  var loadedShader = new p5.Shader();

  var self = this;
  var loadedFrag = false;
  var loadedVert = false;

  this.loadStrings(fragFilename, function(result) {
    loadedShader._fragSrc = result.join('\n');
    loadedFrag = true;
    if (!loadedVert) {
      self._incrementPreload();
    }
  });
  this.loadStrings(vertFilename, function(result) {
    loadedShader._vertSrc = result.join('\n');
    loadedVert = true;
    if (!loadedFrag) {
      self._incrementPreload();
    }
  });

  return loadedShader;
};


/**
 * The shader() function lets the user provide a custom shader
 * to fill in shapes in WEBGL mode. Users can create their
 * own shaders by loading vertex and fragment shaders with
 * loadShader().
 *
 * @method shader
 * @chainable
 * @param {p5.Shader} [s] the desired p5.Shader to use for rendering
 * shapes.
 */
p5.prototype.shader = function (s) {
  if (s._renderer === undefined) {
    s._renderer = this._renderer;
  }
  if(s.isStrokeShader()) {
    this._renderer.setStrokeShader(s);
  } else {
    this._renderer.setFillShader(s);
  }
  return this;
};

/**
 * Normal material for geometry. You can view all
 * possible materials in this
 * <a href="https://p5js.org/examples/3d-materials.html">example</a>.
 * @method normalMaterial
 * @chainable
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
  this._renderer.drawMode = constants.FILL;
  this._renderer.setFillShader(this._renderer._getNormalShader());
  this._renderer.noStroke();
  return this;
};

/**
 * Texture for geometry.  You can view other possible materials in this
 * <a href="https://p5js.org/examples/3d-materials.html">example</a>.
 * @method texture
 * @param {p5.Image|p5.MediaElement|p5.Graphics} tex 2-dimensional graphics
 *                    to render as texture
 * @chainable
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
p5.prototype.texture = function(){
  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }
  this._renderer.GL.depthMask(true);
  this._renderer.GL.enable(this._renderer.GL.BLEND);
  this._renderer.GL.blendFunc(this._renderer.GL.SRC_ALPHA, this._renderer.GL.ONE_MINUS_SRC_ALPHA);

  this._renderer.drawMode = constants.TEXTURE;
  if (! this._renderer.curFillShader.isTextureShader()) {
    this._renderer.setFillShader(this._renderer._getLightShader());
  }
  this._renderer.curFillShader.setUniform('uSpecular', false);
  this._renderer.curFillShader.setUniform('isTexture', true);
  this._renderer.curFillShader.setUniform('uSampler', args[0]);
  this._renderer.noStroke();
  return this;
};


/**
 * Ambient material for geometry with a given color. You can view all
 * possible materials in this
 * <a href="https://p5js.org/examples/3d-materials.html">example</a>.
 * @method  ambientMaterial
 * @param  {Number} v1  gray value, red or hue value
 *                         (depending on the current color mode)
 * @param  {Number} [v2] green or saturation value
 * @param  {Number} [v3] blue or brightness value
 * @param  {Number} [a]  opacity
 * @chainable
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
/**
 * @method  ambientMaterial
 * @param  {Array|String|p5.Color} color  color, color Array, or CSS color string
 * @chainable
 */
p5.prototype.ambientMaterial = function(v1, v2, v3, a) {
  if (! this._renderer.curFillShader.isLightShader()) {
    this._renderer.setFillShader(this._renderer._getLightShader());
  }
  var colors = this._renderer._applyColorBlend.apply(this._renderer, arguments);
  this._renderer.curFillShader.setUniform('uMaterialColor', colors);
  this._renderer.curFillShader.setUniform('uSpecular', false);
  this._renderer.curFillShader.setUniform('isTexture', false);
  return this;
};

/**
 * Specular material for geometry with a given color. You can view all
 * possible materials in this
 * <a href="https://p5js.org/examples/3d-materials.html">example</a>.
 * @method specularMaterial
 * @param  {Number} v1   gray value, red or hue value
 *                        (depending on the current color mode),
 * @param  {Number} [v2] green or saturation value
 * @param  {Number} [v3] blue or brightness value
 * @param  {Number} [a]  opacity
 * @chainable
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
/**
 * @method specularMaterial
 * @param  {Array|String|p5.Color} color color Array, or CSS color string
 * @chainable
 */
p5.prototype.specularMaterial = function(v1, v2, v3, a) {
  if (! this._renderer.curFillShader.isLightShader()) {
    this._renderer.setFillShader(this._renderer._getLightShader());
  }

  var colors = this._renderer._applyColorBlend.apply(this._renderer, arguments);
  this._renderer.curFillShader.setUniform('uMaterialColor', colors);
  this._renderer.curFillShader.setUniform('uSpecular', true);
  this._renderer.curFillShader.setUniform('isTexture', false);
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

module.exports = p5;
