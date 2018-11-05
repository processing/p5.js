/**
 * @module Lights, Camera
 * @submodule Material
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/main');
var constants = require('../core/constants');
require('./p5.Texture');

/**
 * Loads a custom shader from the provided vertex and fragment
 * shader paths. The shader files are loaded asynchronously in the
 * background, so this method should be used in <a href="#/p5/preload">preload()</a>.
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
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * var mandel;
 * function preload() {
 *   // load the shader definitions from files
 *   mandel = loadShader('assets/shader.vert', 'assets/shader.frag');
 * }
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   // use the shader
 *   shader(mandel);
 *   noStroke();
 *   mandel.setUniform('p', [-0.74364388703, 0.13182590421]);
 * }
 *
 * function draw() {
 *   mandel.setUniform('r', 1.5 * exp(-6.5 * (1 + sin(millis() / 2000))));
 *   quad(-1, -1, 1, -1, 1, 1, -1, 1);
 * }
 * </code>
 * </div>
 *
 * @alt
 * zooming Mandelbrot set. a colorful, infinitely detailed fractal.
 */
p5.prototype.loadShader = function(vertFilename, fragFilename) {
  p5._validateParameters('loadShader', arguments);
  var loadedShader = new p5.Shader();

  var self = this;
  var loadedFrag = false;
  var loadedVert = false;

  this.loadStrings(fragFilename, function(result) {
    loadedShader._fragSrc = result.join('\n');
    loadedFrag = true;
    if (loadedVert) {
      self._decrementPreload();
    }
  });
  this.loadStrings(vertFilename, function(result) {
    loadedShader._vertSrc = result.join('\n');
    loadedVert = true;
    if (loadedFrag) {
      self._decrementPreload();
    }
  });

  return loadedShader;
};

/**
 * @method createShader
 * @param {String} vertSrc source code for the vertex shader
 * @param {String} fragSrc source code for the fragment shader
 * @returns {p5.Shader} a shader object created from the provided
 * vertex and fragment shaders.
 *
 * @example
 * <div modernizr='webgl'>
 * <code>
 * // the 'varying's are shared between both vertex & fragment shaders
 * var varying = 'precision highp float; varying vec2 vPos;';
 *
 * // the vertex shader is called for each vertex
 * var vs =
 *   varying +
 *   'attribute vec3 aPosition;' +
 *   'void main() { vPos = (gl_Position = vec4(aPosition,1.0)).xy; }';
 *
 * // the fragment shader is called for each pixel
 * var fs =
 *   varying +
 *   'uniform vec2 p;' +
 *   'uniform float r;' +
 *   'const int I = 500;' +
 *   'void main() {' +
 *   '  vec2 c = p + vPos * r, z = c;' +
 *   '  float n = 0.0;' +
 *   '  for (int i = I; i > 0; i --) {' +
 *   '    if(z.x*z.x+z.y*z.y > 4.0) {' +
 *   '      n = float(i)/float(I);' +
 *   '      break;' +
 *   '    }' +
 *   '    z = vec2(z.x*z.x-z.y*z.y, 2.0*z.x*z.y) + c;' +
 *   '  }' +
 *   '  gl_FragColor = vec4(0.5-cos(n*17.0)/2.0,0.5-cos(n*13.0)/2.0,0.5-cos(n*23.0)/2.0,1.0);' +
 *   '}';
 *
 * var mandel;
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   // create and initialize the shader
 *   mandel = createShader(vs, fs);
 *   shader(mandel);
 *   noStroke();
 *
 *   // 'p' is the center point of the Mandelbrot image
 *   mandel.setUniform('p', [-0.74364388703, 0.13182590421]);
 * }
 *
 * function draw() {
 *   // 'r' is the size of the image in Mandelbrot-space
 *   mandel.setUniform('r', 1.5 * exp(-6.5 * (1 + sin(millis() / 2000))));
 *   quad(-1, -1, 1, -1, 1, 1, -1, 1);
 * }
 * </code>
 * </div>
 *
 * @alt
 * zooming Mandelbrot set. a colorful, infinitely detailed fractal.
 */
p5.prototype.createShader = function(vertSrc, fragSrc) {
  this._assert3d('createShader');
  p5._validateParameters('createShader', arguments);
  return new p5.Shader(this._renderer, vertSrc, fragSrc);
};

/**
 * The <a href="#/p5/shader">shader()</a> function lets the user provide a custom shader
 * to fill in shapes in WEBGL mode. Users can create their
 * own shaders by loading vertex and fragment shaders with
 * <a href="#/p5/loadShader">loadShader()</a>.
 *
 * @method shader
 * @chainable
 * @param {p5.Shader} [s] the desired <a href="#/p5.Shader">p5.Shader</a> to use for rendering
 * shapes.
 */
p5.prototype.shader = function(s) {
  this._assert3d('shader');
  p5._validateParameters('shader', arguments);
  if (s._renderer === undefined) {
    s._renderer = this._renderer;
  }
  if (s.isStrokeShader()) {
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
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw() {
 *   background(200);
 *   normalMaterial();
 *   sphere(50);
 * }
 * </code>
 * </div>
 *
 * @alt
 * Red, green and blue gradient.
 *
 */
p5.prototype.normalMaterial = function() {
  this._assert3d('normalMaterial');
  p5._validateParameters('normalMaterial', arguments);
  this._renderer.drawMode = constants.FILL;
  this._renderer.setFillShader(this._renderer._getNormalShader());
  this._renderer.curFillColor = [1, 1, 1, 1];
  this.noStroke();
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
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw() {
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
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   pg = createGraphics(200, 200);
 *   pg.textSize(100);
 * }
 *
 * function draw() {
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
 * function preload() {
 *   vid = createVideo('assets/fingers.mov');
 *   vid.hide();
 *   vid.loop();
 * }
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw() {
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
p5.prototype.texture = function(tex) {
  this._assert3d('texture');
  p5._validateParameters('texture', arguments);
  this._renderer.drawMode = constants.TEXTURE;
  this._renderer.textureImage = tex;
  var shader = this._renderer._useLightShader();
  shader.setUniform('uSpecular', false);
  shader.setUniform('isTexture', true);
  shader.setUniform('uSampler', tex);
  this.noStroke();
  return this;
};

/**
 * Sets the coordinate space for texture mapping. The default mode is IMAGE
 * which refers to the actual coordinates of the image.
 * NORMAL refers to a normalized space of values ranging from 0 to 1.
 * This function only works in WEBGL mode.
 *
 * With IMAGE, if an image is 100 x 200 pixels, mapping the image onto the entire
 * size of a quad would require the points (0,0) (100, 0) (100,200) (0,200).
 * The same mapping in NORMAL is (0,0) (1,0) (1,1) (0,1).
 * @method  textureMode
 * @param {Constant} mode either IMAGE or NORMAL
 * @example
 * <div>
 * <code>
 * var img;
 *
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw() {
 *   texture(img);
 *   textureMode(NORMAL);
 *   beginShape();
 *   vertex(-50, -50, 0, 0);
 *   vertex(50, -50, 1, 0);
 *   vertex(50, 50, 1, 1);
 *   vertex(-50, 50, 0, 1);
 *   endShape();
 * }
 * </code>
 * </div>
 *
 * @alt
 * the underside of a white umbrella and gridded ceiling above
 *
 * <div>
 * <code>
 * var img;
 *
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw() {
 *   texture(img);
 *   textureMode(NORMAL);
 *   beginShape();
 *   vertex(-50, -50, 0, 0);
 *   vertex(50, -50, img.width, 0);
 *   vertex(50, 50, img.width, img.height);
 *   vertex(-50, 50, 0, img.height);
 *   endShape();
 * }
 * </code>
 * </div>
 *
 * @alt
 * the underside of a white umbrella and gridded ceiling above
 *
 */
p5.prototype.textureMode = function(mode) {
  if (mode !== constants.IMAGE && mode !== constants.NORMAL) {
    console.warn(
      'You tried to set ' + mode + ' textureMode only supports IMAGE & NORMAL '
    );
  } else {
    this._renderer.textureMode = mode;
  }
};

/**
 * Ambient material for geometry with a given color. You can view all
 * possible materials in this
 * <a href="https://p5js.org/examples/3d-materials.html">example</a>.
 * @method  ambientMaterial
 * @param  {Number} v1  gray value, red or hue value
 *                         (depending on the current color mode),
 * @param  {Number} [v2] green or saturation value
 * @param  {Number} [v3] blue or brightness value
 * @param  {Number} [a]  opacity
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 * function draw() {
 *   background(0);
 *   ambientLight(100);
 *   pointLight(250, 250, 250, 100, 100, 0);
 *   ambientMaterial(250);
 *   sphere(50);
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
 * @param  {Number[]|String|p5.Color} color  color, color Array, or CSS color string
 * @chainable
 */
p5.prototype.ambientMaterial = function(v1, v2, v3, a) {
  this._assert3d('ambientMaterial');
  p5._validateParameters('ambientMaterial', arguments);
  var color = p5.prototype.color.apply(this, arguments);
  this._renderer.curFillColor = color._array;

  var shader = this._renderer._useLightShader();
  shader.setUniform('uMaterialColor', this._renderer.curFillColor);
  shader.setUniform('uSpecular', false);
  shader.setUniform('isTexture', false);
  return this;
};

/**
 * Specular material for geometry with a given color. You can view all
 * possible materials in this
 * <a href="https://p5js.org/examples/3d-materials.html">example</a>.
 * @method specularMaterial
 * @param  {Number} v1  gray value, red or hue value
 *                       (depending on the current color mode),
 * @param  {Number} [v2] green or saturation value
 * @param  {Number} [v3] blue or brightness value
 * @param  {Number} [a]  opacity
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 * function draw() {
 *   background(0);
 *   ambientLight(100);
 *   pointLight(250, 250, 250, 100, 100, 0);
 *   specularMaterial(250);
 *   sphere(50);
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
 * @param  {Number[]|String|p5.Color} color color Array, or CSS color string
 * @chainable
 */
p5.prototype.specularMaterial = function(v1, v2, v3, a) {
  this._assert3d('specularMaterial');
  p5._validateParameters('specularMaterial', arguments);
  var color = p5.prototype.color.apply(this, arguments);
  this._renderer.curFillColor = color._array;

  var shader = this._renderer._useLightShader();
  shader.setUniform('uMaterialColor', this._renderer.curFillColor);
  shader.setUniform('uSpecular', true);
  shader.setUniform('isTexture', false);
  return this;
};

/**
 * @private blends colors according to color components.
 * If alpha value is less than 1, we need to enable blending
 * on our gl context.  Otherwise opaque objects need to a depthMask.
 * @param  {Number[]} color [description]
 * @return {Number[]]}  Normalized numbers array
 */
p5.RendererGL.prototype._applyColorBlend = function(colors) {
  var gl = this.GL;

  var isTexture = this.drawMode === constants.TEXTURE;
  if (isTexture || colors[colors.length - 1] < 1.0) {
    gl.depthMask(isTexture);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  } else {
    gl.depthMask(true);
    gl.disable(gl.BLEND);
  }
  return colors;
};

module.exports = p5;
