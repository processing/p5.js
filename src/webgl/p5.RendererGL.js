'use strict';

var p5 = require('../core/main');
var constants = require('../core/constants');
var libtess = require('libtess');
require('./p5.Shader');
require('./p5.Camera');
require('../core/p5.Renderer');
require('./p5.Matrix');
var fs = require('fs');

var defaultShaders = {
  immediateVert: fs.readFileSync(
    __dirname + '/shaders/immediate.vert',
    'utf-8'
  ),
  vertexColorVert: fs.readFileSync(
    __dirname + '/shaders/vertexColor.vert',
    'utf-8'
  ),
  vertexColorFrag: fs.readFileSync(
    __dirname + '/shaders/vertexColor.frag',
    'utf-8'
  ),
  normalVert: fs.readFileSync(__dirname + '/shaders/normal.vert', 'utf-8'),
  normalFrag: fs.readFileSync(__dirname + '/shaders/normal.frag', 'utf-8'),
  basicFrag: fs.readFileSync(__dirname + '/shaders/basic.frag', 'utf-8'),
  lightVert: fs.readFileSync(__dirname + '/shaders/light.vert', 'utf-8'),
  lightTextureFrag: fs.readFileSync(
    __dirname + '/shaders/light_texture.frag',
    'utf-8'
  ),
  phongVert: fs.readFileSync(__dirname + '/shaders/phong.vert', 'utf-8'),
  phongFrag: fs.readFileSync(__dirname + '/shaders/phong.frag', 'utf-8'),
  fontVert: fs.readFileSync(__dirname + '/shaders/font.vert', 'utf-8'),
  fontFrag: fs.readFileSync(__dirname + '/shaders/font.frag', 'utf-8'),
  lineVert: fs.readFileSync(__dirname + '/shaders/line.vert', 'utf-8'),
  lineFrag: fs.readFileSync(__dirname + '/shaders/line.frag', 'utf-8'),
  pointVert: fs.readFileSync(__dirname + '/shaders/point.vert', 'utf-8'),
  pointFrag: fs.readFileSync(__dirname + '/shaders/point.frag', 'utf-8')
};

/**
 * 3D graphics class
 * @private
 * @class p5.RendererGL
 * @constructor
 * @extends p5.Renderer
 * @todo extend class to include public method for offscreen
 * rendering (FBO).
 *
 */
p5.RendererGL = function(elt, pInst, isMainCanvas, attr) {
  p5.Renderer.call(this, elt, pInst, isMainCanvas);
  this._setAttributeDefaults(pInst);
  this._initContext();
  this.isP3D = true; //lets us know we're in 3d mode
  this.GL = this.drawingContext;

  // lights

  this._enableLighting = false;

  this.ambientLightColors = [];
  this.directionalLightDirections = [];
  this.directionalLightColors = [];

  this.pointLightPositions = [];
  this.pointLightColors = [];

  this.curFillColor = [1, 1, 1, 1];
  this.curStrokeColor = [0, 0, 0, 1];
  this.curBlendMode = constants.BLEND;
  this.blendExt = this.GL.getExtension('EXT_blend_minmax');

  this._useSpecularMaterial = false;
  this._useNormalMaterial = false;
  this._useShininess = 1;

  /**
   * model view, projection, & normal
   * matrices
   */
  this.uMVMatrix = new p5.Matrix();
  this.uPMatrix = new p5.Matrix();
  this.uNMatrix = new p5.Matrix('mat3');

  // Camera
  this._curCamera = new p5.Camera(this);
  this._curCamera._computeCameraDefaultSettings();
  this._curCamera._setDefaultCamera();

  //Geometry & Material hashes
  this.gHash = {};

  this._defaultLightShader = undefined;
  this._defaultImmediateModeShader = undefined;
  this._defaultNormalShader = undefined;
  this._defaultColorShader = undefined;
  this._defaultPointShader = undefined;

  this._pointVertexBuffer = this.GL.createBuffer();

  this.userFillShader = undefined;
  this.userStrokeShader = undefined;
  this.userPointShader = undefined;

  //Imediate Mode
  //default drawing is done in Retained Mode
  this.isImmediateDrawing = false;
  this.immediateMode = {};

  this.pointSize = 5.0; //default point size
  this.curStrokeWeight = 1;

  // array of textures created in this gl context via this.getTexture(src)
  this.textures = [];

  this.textureMode = constants.IMAGE;
  // default wrap settings
  this.textureWrapX = constants.CLAMP;
  this.textureWrapY = constants.CLAMP;
  this._tex = null;
  this._curveTightness = 6;

  // lookUpTable for coefficients needed to be calculated for bezierVertex, same are used for curveVertex
  this._lookUpTableBezier = [];
  // lookUpTable for coefficients needed to be calculated for quadraticVertex
  this._lookUpTableQuadratic = [];

  // current curveDetail in the Bezier lookUpTable
  this._lutBezierDetail = 0;
  // current curveDetail in the Quadratic lookUpTable
  this._lutQuadraticDetail = 0;

  this._tessy = this._initTessy();

  this.fontInfos = {};

  return this;
};

p5.RendererGL.prototype = Object.create(p5.Renderer.prototype);

//////////////////////////////////////////////
// Setting
//////////////////////////////////////////////

p5.RendererGL.prototype._setAttributeDefaults = function(pInst) {
  var defaults = {
    alpha: false,
    depth: true,
    stencil: true,
    antialias: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: true,
    perPixelLighting: false
  };
  if (pInst._glAttributes === null) {
    pInst._glAttributes = defaults;
  } else {
    pInst._glAttributes = Object.assign(defaults, pInst._glAttributes);
  }
  return;
};

p5.RendererGL.prototype._initContext = function() {
  try {
    this.drawingContext =
      this.canvas.getContext('webgl', this._pInst._glAttributes) ||
      this.canvas.getContext('experimental-webgl', this._pInst._glAttributes);
    if (this.drawingContext === null) {
      throw new Error('Error creating webgl context');
    } else {
      console.log('p5.RendererGL: enabled webgl context');
      var gl = this.drawingContext;
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      this._viewport = this.drawingContext.getParameter(
        this.drawingContext.VIEWPORT
      );
    }
  } catch (er) {
    throw er;
  }
};

//This is helper function to reset the context anytime the attributes
//are changed with setAttributes()

p5.RendererGL.prototype._resetContext = function(options, callback) {
  var w = this.width;
  var h = this.height;
  var defaultId = this.canvas.id;
  var c = this.canvas;
  if (c) {
    c.parentNode.removeChild(c);
  }
  c = document.createElement('canvas');
  c.id = defaultId;
  if (this._pInst._userNode) {
    this._pInst._userNode.appendChild(c);
  } else {
    document.body.appendChild(c);
  }
  this._pInst.canvas = c;

  var renderer = new p5.RendererGL(this._pInst.canvas, this._pInst, true);
  this._pInst._setProperty('_renderer', renderer);
  renderer.resize(w, h);
  renderer._applyDefaults();
  this._pInst._elements.push(renderer);

  if (typeof callback === 'function') {
    //setTimeout with 0 forces the task to the back of the queue, this ensures that
    //we finish switching out the renderer
    setTimeout(function() {
      callback.apply(window._renderer, options);
    }, 0);
  }
};
/**
 * @module Rendering
 * @submodule Rendering
 * @for p5
 */
/**
 * Set attributes for the WebGL Drawing context.
 * This is a way of adjusting how the WebGL
 * renderer works to fine-tune the display and performance.
 * <br><br>
 * Note that this will reinitialize the drawing context
 * if called after the WebGL canvas is made.
 * <br><br>
 * If an object is passed as the parameter, all attributes
 * not declared in the object will be set to defaults.
 * <br><br>
 * The available attributes are:
 * <br>
 * alpha - indicates if the canvas contains an alpha buffer
 * default is false
 * <br><br>
 * depth - indicates whether the drawing buffer has a depth buffer
 * of at least 16 bits - default is true
 * <br><br>
 * stencil - indicates whether the drawing buffer has a stencil buffer
 * of at least 8 bits
 * <br><br>
 * antialias - indicates whether or not to perform anti-aliasing
 * default is false
 * <br><br>
 * premultipliedAlpha - indicates that the page compositor will assume
 * the drawing buffer contains colors with pre-multiplied alpha
 * default is false
 * <br><br>
 * preserveDrawingBuffer - if true the buffers will not be cleared and
 * and will preserve their values until cleared or overwritten by author
 * (note that p5 clears automatically on draw loop)
 * default is true
 * <br><br>
 * perPixelLighting - if true, per-pixel lighting will be used in the
 * lighting shader.
 * default is false
 * <br><br>
 * @method setAttributes
 * @for p5
 * @param  {String}  key Name of attribute
 * @param  {Boolean}        value New value of named attribute
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw() {
 *   background(255);
 *   push();
 *   rotateZ(frameCount * 0.02);
 *   rotateX(frameCount * 0.02);
 *   rotateY(frameCount * 0.02);
 *   fill(0, 0, 0);
 *   box(50);
 *   pop();
 * }
 * </code>
 * </div>
 * <br>
 * Now with the antialias attribute set to true.
 * <br>
 * <div>
 * <code>
 * function setup() {
 *   setAttributes('antialias', true);
 *   createCanvas(100, 100, WEBGL);
 * }
 *
 * function draw() {
 *   background(255);
 *   push();
 *   rotateZ(frameCount * 0.02);
 *   rotateX(frameCount * 0.02);
 *   rotateY(frameCount * 0.02);
 *   fill(0, 0, 0);
 *   box(50);
 *   pop();
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // press the mouse button to enable perPixelLighting
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   noStroke();
 *   fill(255);
 * }
 *
 * var lights = [
 *   { c: '#f00', t: 1.12, p: 1.91, r: 0.2 },
 *   { c: '#0f0', t: 1.21, p: 1.31, r: 0.2 },
 *   { c: '#00f', t: 1.37, p: 1.57, r: 0.2 },
 *   { c: '#ff0', t: 1.12, p: 1.91, r: 0.7 },
 *   { c: '#0ff', t: 1.21, p: 1.31, r: 0.7 },
 *   { c: '#f0f', t: 1.37, p: 1.57, r: 0.7 }
 * ];
 *
 * function draw() {
 *   var t = millis() / 1000 + 1000;
 *   background(0);
 *   directionalLight(color('#222'), 1, 1, 1);
 *
 *   for (var i = 0; i < lights.length; i++) {
 *     var light = lights[i];
 *     pointLight(
 *       color(light.c),
 *       p5.Vector.fromAngles(t * light.t, t * light.p, width * light.r)
 *     );
 *   }
 *
 *   specularMaterial(255);
 *   sphere(width * 0.1);
 *
 *   rotateX(t * 0.77);
 *   rotateY(t * 0.83);
 *   rotateZ(t * 0.91);
 *   torus(width * 0.3, width * 0.07, 24, 10);
 * }
 *
 * function mousePressed() {
 *   setAttributes('perPixelLighting', true);
 *   noStroke();
 *   fill(255);
 * }
 * function mouseReleased() {
 *   setAttributes('perPixelLighting', false);
 *   noStroke();
 *   fill(255);
 * }
 * </code>
 * </div>
 *
 * @alt a rotating cube with smoother edges
 */
/**
 * @method setAttributes
 * @for p5
 * @param  {Object}  obj object with key-value pairs
 */

p5.prototype.setAttributes = function(key, value) {
  var unchanged = true;
  if (typeof value !== 'undefined') {
    //first time modifying the attributes
    if (this._glAttributes === null) {
      this._glAttributes = {};
    }
    if (this._glAttributes[key] !== value) {
      //changing value of previously altered attribute
      this._glAttributes[key] = value;
      unchanged = false;
    }
    //setting all attributes with some change
  } else if (key instanceof Object) {
    if (this._glAttributes !== key) {
      this._glAttributes = key;
      unchanged = false;
    }
  }
  //@todo_FES
  if (!this._renderer.isP3D || unchanged) {
    return;
  }

  if (!this._setupDone) {
    for (var x in this._renderer.gHash) {
      if (this._renderer.gHash.hasOwnProperty(x)) {
        console.error(
          'Sorry, Could not set the attributes, you need to call setAttributes() ' +
            'before calling the other drawing methods in setup()'
        );
        return;
      }
    }
  }

  this.push();
  this._renderer._resetContext();
  this.pop();

  if (this._renderer._curCamera) {
    this._renderer._curCamera._renderer = this._renderer;
  }
};

/**
 * @class p5.RendererGL
 */

p5.RendererGL.prototype._update = function() {
  // reset model view and apply initial camera transform
  // (containing only look at info; no projection).
  this.uMVMatrix.set(
    this._curCamera.cameraMatrix.mat4[0],
    this._curCamera.cameraMatrix.mat4[1],
    this._curCamera.cameraMatrix.mat4[2],
    this._curCamera.cameraMatrix.mat4[3],
    this._curCamera.cameraMatrix.mat4[4],
    this._curCamera.cameraMatrix.mat4[5],
    this._curCamera.cameraMatrix.mat4[6],
    this._curCamera.cameraMatrix.mat4[7],
    this._curCamera.cameraMatrix.mat4[8],
    this._curCamera.cameraMatrix.mat4[9],
    this._curCamera.cameraMatrix.mat4[10],
    this._curCamera.cameraMatrix.mat4[11],
    this._curCamera.cameraMatrix.mat4[12],
    this._curCamera.cameraMatrix.mat4[13],
    this._curCamera.cameraMatrix.mat4[14],
    this._curCamera.cameraMatrix.mat4[15]
  );

  // reset light data for new frame.

  this.ambientLightColors.length = 0;
  this.directionalLightDirections.length = 0;
  this.directionalLightColors.length = 0;

  this.pointLightPositions.length = 0;
  this.pointLightColors.length = 0;

  this._enableLighting = false;
};

/**
 * [background description]
 */
p5.RendererGL.prototype.background = function() {
  var _col = this._pInst.color.apply(this._pInst, arguments);
  var _r = _col.levels[0] / 255;
  var _g = _col.levels[1] / 255;
  var _b = _col.levels[2] / 255;
  var _a = _col.levels[3] / 255;
  this.GL.clearColor(_r, _g, _b, _a);
  this.GL.depthMask(true);
  this.GL.clear(this.GL.COLOR_BUFFER_BIT | this.GL.DEPTH_BUFFER_BIT);
  this._pixelsState._pixelsDirty = true;
};

//////////////////////////////////////////////
// COLOR
//////////////////////////////////////////////
/**
 * Basic fill material for geometry with a given color
 * @method  fill
 * @class p5.RendererGL
 * @param  {Number|Number[]|String|p5.Color} v1  gray value,
 * red or hue value (depending on the current color mode),
 * or color Array, or CSS color string
 * @param  {Number}            [v2] green or saturation value
 * @param  {Number}            [v3] blue or brightness value
 * @param  {Number}            [a]  opacity
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 * }
 *
 * function draw() {
 *   background(0);
 *   noStroke();
 *   fill(100, 100, 240);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   box(75, 75, 75);
 * }
 * </code>
 * </div>
 *
 * @alt
 * black canvas with purple cube spinning
 *
 */
p5.RendererGL.prototype.fill = function(v1, v2, v3, a) {
  //see material.js for more info on color blending in webgl
  var color = p5.prototype.color.apply(this._pInst, arguments);
  this.curFillColor = color._array;
  this.drawMode = constants.FILL;
  this._useNormalMaterial = false;
  this._tex = null;
};

/**
 * Basic stroke material for geometry with a given color
 * @method  stroke
 * @param  {Number|Number[]|String|p5.Color} v1  gray value,
 * red or hue value (depending on the current color mode),
 * or color Array, or CSS color string
 * @param  {Number}            [v2] green or saturation value
 * @param  {Number}            [v3] blue or brightness value
 * @param  {Number}            [a]  opacity
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(200, 200, WEBGL);
 * }
 *
 * function draw() {
 *   background(0);
 *   stroke(240, 150, 150);
 *   fill(100, 100, 240);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   box(75, 75, 75);
 * }
 * </code>
 * </div>
 *
 * @alt
 * black canvas with purple cube with pink outline spinning
 *
 */
p5.RendererGL.prototype.stroke = function(r, g, b, a) {
  //@todo allow transparency in stroking currently doesn't have
  //any impact and causes problems with specularMaterial
  arguments[3] = 255;
  var color = p5.prototype.color.apply(this._pInst, arguments);
  this.curStrokeColor = color._array;
};

p5.RendererGL.prototype.strokeCap = function(cap) {
  // @TODO : to be implemented
  console.error('Sorry, strokeCap() is not yet implemented in WEBGL mode');
};

p5.RendererGL.prototype.blendMode = function(mode) {
  if (
    mode === constants.DARKEST ||
    mode === constants.LIGHTEST ||
    mode === constants.ADD ||
    mode === constants.BLEND ||
    mode === constants.SUBTRACT ||
    mode === constants.SCREEN ||
    mode === constants.EXCLUSION ||
    mode === constants.REPLACE ||
    mode === constants.MULTIPLY
  )
    this.curBlendMode = mode;
  else if (
    mode === constants.BURN ||
    mode === constants.OVERLAY ||
    mode === constants.HARD_LIGHT ||
    mode === constants.SOFT_LIGHT ||
    mode === constants.DODGE
  ) {
    console.warn(
      'BURN, OVERLAY, HARD_LIGHT, SOFT_LIGHT, and DODGE only work for blendMode in 2D mode.'
    );
  }
};

/**
 * Change weight of stroke
 * @method  strokeWeight
 * @param  {Number} stroke weight to be used for drawing
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(200, 400, WEBGL);
 *   setAttributes('antialias', true);
 * }
 *
 * function draw() {
 *   background(0);
 *   noStroke();
 *   translate(0, -100, 0);
 *   stroke(240, 150, 150);
 *   fill(100, 100, 240);
 *   push();
 *   strokeWeight(8);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   sphere(75);
 *   pop();
 *   push();
 *   translate(0, 200, 0);
 *   strokeWeight(1);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   sphere(75);
 *   pop();
 * }
 * </code>
 * </div>
 *
 * @alt
 * black canvas with two purple rotating spheres with pink
 * outlines the sphere on top has much heavier outlines,
 *
 */
p5.RendererGL.prototype.strokeWeight = function(w) {
  if (this.curStrokeWeight !== w) {
    this.pointSize = w;
    this.curStrokeWeight = w;
  }
};

// x,y are canvas-relative (pre-scaled by _pixelDensity)
p5.RendererGL.prototype._getPixel = function(x, y) {
  var pixelsState = this._pixelsState;
  var imageData, index;
  if (pixelsState._pixelsDirty) {
    imageData = new Uint8Array(4);
    // prettier-ignore
    this.drawingContext.readPixels(
      x, y, 1, 1,
      this.drawingContext.RGBA, this.drawingContext.UNSIGNED_BYTE,
      imageData
    );
    index = 0;
  } else {
    imageData = pixelsState.pixels;
    index = (Math.floor(x) + Math.floor(y) * this.canvas.width) * 4;
  }
  return [
    imageData[index + 0],
    imageData[index + 1],
    imageData[index + 2],
    imageData[index + 3]
  ];
};

/**
 * Loads the pixels data for this canvas into the pixels[] attribute.
 * Note that updatePixels() and set() do not work.
 * Any pixel manipulation must be done directly to the pixels[] array.
 *
 * @private
 * @method loadPixels
 *
 */

p5.RendererGL.prototype.loadPixels = function() {
  var pixelsState = this._pixelsState;
  if (!pixelsState._pixelsDirty) return;
  pixelsState._pixelsDirty = false;

  //@todo_FES
  if (this._pInst._glAttributes.preserveDrawingBuffer !== true) {
    console.log(
      'loadPixels only works in WebGL when preserveDrawingBuffer ' + 'is true.'
    );
    return;
  }

  //if there isn't a renderer-level temporary pixels buffer
  //make a new one
  var pixels = pixelsState.pixels;
  var len = this.GL.drawingBufferWidth * this.GL.drawingBufferHeight * 4;
  if (!(pixels instanceof Uint8Array) || pixels.length !== len) {
    pixels = new Uint8Array(len);
    this._pixelsState._setProperty('pixels', pixels);
  }

  var pd = this._pInst._pixelDensity;
  // prettier-ignore
  this.GL.readPixels(
    0, 0, this.width * pd, this.height * pd,
    this.GL.RGBA, this.GL.UNSIGNED_BYTE,
    pixels
  );
};

//////////////////////////////////////////////
// HASH | for geometry
//////////////////////////////////////////////

p5.RendererGL.prototype.geometryInHash = function(gId) {
  return this.gHash[gId] !== undefined;
};

/**
 * [resize description]
 * @private
 * @param  {Number} w [description]
 * @param  {Number} h [description]
 */
p5.RendererGL.prototype.resize = function(w, h) {
  p5.Renderer.prototype.resize.call(this, w, h);
  this.GL.viewport(
    0,
    0,
    this.GL.drawingBufferWidth,
    this.GL.drawingBufferHeight
  );
  this._viewport = this.GL.getParameter(this.GL.VIEWPORT);

  this._curCamera._resize();

  //resize pixels buffer
  var pixelsState = this._pixelsState;
  pixelsState._pixelsDirty = true;
  if (typeof pixelsState.pixels !== 'undefined') {
    pixelsState._setProperty(
      'pixels',
      new Uint8Array(
        this.GL.drawingBufferWidth * this.GL.drawingBufferHeight * 4
      )
    );
  }
};

/**
 * clears color and depth buffers
 * with r,g,b,a
 * @private
 * @param {Number} r normalized red val.
 * @param {Number} g normalized green val.
 * @param {Number} b normalized blue val.
 * @param {Number} a normalized alpha val.
 */
p5.RendererGL.prototype.clear = function() {
  var _r = arguments[0] || 0;
  var _g = arguments[1] || 0;
  var _b = arguments[2] || 0;
  var _a = arguments[3] || 0;
  this.GL.clearColor(_r, _g, _b, _a);
  this.GL.clear(this.GL.COLOR_BUFFER_BIT | this.GL.DEPTH_BUFFER_BIT);
  this._pixelsState._pixelsDirty = true;
};

p5.RendererGL.prototype.applyMatrix = function(a, b, c, d, e, f) {
  if (arguments.length === 16) {
    p5.Matrix.prototype.apply.apply(this.uMVMatrix, arguments);
  } else {
    // prettier-ignore
    this.uMVMatrix.apply([
      a, b, 0, 0,
      c, d, 0, 0,
      0, 0, 1, 0,
      e, f, 0, 1,
    ]);
  }
};

/**
 * [translate description]
 * @private
 * @param  {Number} x [description]
 * @param  {Number} y [description]
 * @param  {Number} z [description]
 * @chainable
 * @todo implement handle for components or vector as args
 */
p5.RendererGL.prototype.translate = function(x, y, z) {
  if (x instanceof p5.Vector) {
    z = x.z;
    y = x.y;
    x = x.x;
  }
  this.uMVMatrix.translate([x, y, z]);
  return this;
};

/**
 * Scales the Model View Matrix by a vector
 * @private
 * @param  {Number | p5.Vector | Array} x [description]
 * @param  {Number} [y] y-axis scalar
 * @param  {Number} [z] z-axis scalar
 * @chainable
 */
p5.RendererGL.prototype.scale = function(x, y, z) {
  this.uMVMatrix.scale(x, y, z);
  return this;
};

p5.RendererGL.prototype.rotate = function(rad, axis) {
  if (typeof axis === 'undefined') {
    return this.rotateZ(rad);
  }
  p5.Matrix.prototype.rotate.apply(this.uMVMatrix, arguments);
  return this;
};

p5.RendererGL.prototype.rotateX = function(rad) {
  this.rotate(rad, 1, 0, 0);
  return this;
};

p5.RendererGL.prototype.rotateY = function(rad) {
  this.rotate(rad, 0, 1, 0);
  return this;
};

p5.RendererGL.prototype.rotateZ = function(rad) {
  this.rotate(rad, 0, 0, 1);
  return this;
};

p5.RendererGL.prototype.push = function() {
  // get the base renderer style
  var style = p5.Renderer.prototype.push.apply(this);

  // add webgl-specific style properties
  var properties = style.properties;

  properties.uMVMatrix = this.uMVMatrix.copy();
  properties.uPMatrix = this.uPMatrix.copy();
  properties._curCamera = this._curCamera;

  // make a copy of the current camera for the push state
  // this preserves any references stored using 'createCamera'
  this._curCamera = this._curCamera.copy();

  properties.ambientLightColors = this.ambientLightColors.slice();

  properties.directionalLightDirections = this.directionalLightDirections.slice();
  properties.directionalLightColors = this.directionalLightColors.slice();

  properties.pointLightPositions = this.pointLightPositions.slice();
  properties.pointLightColors = this.pointLightColors.slice();

  properties.userFillShader = this.userFillShader;
  properties.userStrokeShader = this.userStrokeShader;
  properties.userPointShader = this.userPointShader;

  properties.pointSize = this.pointSize;
  properties.curStrokeWeight = this.curStrokeWeight;
  properties.curStrokeColor = this.curStrokeColor;
  properties.curFillColor = this.curFillColor;

  properties._useSpecularMaterial = this._useSpecularMaterial;
  properties._useShininess = this._useShininess;

  properties._enableLighting = this._enableLighting;
  properties._useNormalMaterial = this._useNormalMaterial;
  properties._tex = this._tex;
  properties.drawMode = this.drawMode;

  return style;
};

p5.RendererGL.prototype.resetMatrix = function() {
  this.uMVMatrix = p5.Matrix.identity(this._pInst);
  return this;
};

//////////////////////////////////////////////
// SHADER
//////////////////////////////////////////////

/*
 * shaders are created and cached on a per-renderer basis,
 * on the grounds that each renderer will have its own gl context
 * and the shader must be valid in that context.
 */

p5.RendererGL.prototype._getImmediateStrokeShader = function() {
  // select the stroke shader to use
  var stroke = this.userStrokeShader;
  if (!stroke || !stroke.isStrokeShader()) {
    return this._getLineShader();
  }
  return stroke;
};

p5.RendererGL.prototype._getRetainedStrokeShader =
  p5.RendererGL.prototype._getImmediateStrokeShader;

/*
 * selects which fill shader should be used based on renderer state,
 * for use with begin/endShape and immediate vertex mode.
 */
p5.RendererGL.prototype._getImmediateFillShader = function() {
  if (this._useNormalMaterial) {
    return this._getNormalShader();
  }

  var fill = this.userFillShader;
  if (this._enableLighting) {
    if (!fill || !fill.isLightShader()) {
      return this._getLightShader();
    }
  } else if (this._tex) {
    if (!fill || !fill.isTextureShader()) {
      return this._getLightShader();
    }
  } else if (!fill /*|| !fill.isColorShader()*/) {
    return this._getImmediateModeShader();
  }
  return fill;
};

/*
 * selects which fill shader should be used based on renderer state
 * for retained mode.
 */
p5.RendererGL.prototype._getRetainedFillShader = function() {
  if (this._useNormalMaterial) {
    return this._getNormalShader();
  }

  var fill = this.userFillShader;
  if (this._enableLighting) {
    if (!fill || !fill.isLightShader()) {
      return this._getLightShader();
    }
  } else if (this._tex) {
    if (!fill || !fill.isTextureShader()) {
      return this._getLightShader();
    }
  } else if (!fill /* || !fill.isColorShader()*/) {
    return this._getColorShader();
  }
  return fill;
};

p5.RendererGL.prototype._getImmediatePointShader = function() {
  // select the point shader to use
  var point = this.userPointShader;
  if (!point || !point.isPointShader()) {
    return this._getPointShader();
  }
  return point;
};

p5.RendererGL.prototype._getRetainedLineShader =
  p5.RendererGL.prototype._getImmediateLineShader;

p5.RendererGL.prototype._getLightShader = function() {
  if (!this._defaultLightShader) {
    if (this._pInst._glAttributes.perPixelLighting) {
      this._defaultLightShader = new p5.Shader(
        this,
        defaultShaders.phongVert,
        defaultShaders.phongFrag
      );
    } else {
      this._defaultLightShader = new p5.Shader(
        this,
        defaultShaders.lightVert,
        defaultShaders.lightTextureFrag
      );
    }
  }

  return this._defaultLightShader;
};

p5.RendererGL.prototype._getImmediateModeShader = function() {
  if (!this._defaultImmediateModeShader) {
    this._defaultImmediateModeShader = new p5.Shader(
      this,
      defaultShaders.immediateVert,
      defaultShaders.vertexColorFrag
    );
  }

  return this._defaultImmediateModeShader;
};

p5.RendererGL.prototype._getNormalShader = function() {
  if (!this._defaultNormalShader) {
    this._defaultNormalShader = new p5.Shader(
      this,
      defaultShaders.normalVert,
      defaultShaders.normalFrag
    );
  }

  return this._defaultNormalShader;
};

p5.RendererGL.prototype._getColorShader = function() {
  if (!this._defaultColorShader) {
    this._defaultColorShader = new p5.Shader(
      this,
      defaultShaders.normalVert,
      defaultShaders.basicFrag
    );
  }

  return this._defaultColorShader;
};

p5.RendererGL.prototype._getPointShader = function() {
  if (!this._defaultPointShader) {
    this._defaultPointShader = new p5.Shader(
      this,
      defaultShaders.pointVert,
      defaultShaders.pointFrag
    );
  }
  return this._defaultPointShader;
};

p5.RendererGL.prototype._getLineShader = function() {
  if (!this._defaultLineShader) {
    this._defaultLineShader = new p5.Shader(
      this,
      defaultShaders.lineVert,
      defaultShaders.lineFrag
    );
  }

  return this._defaultLineShader;
};

p5.RendererGL.prototype._getFontShader = function() {
  if (!this._defaultFontShader) {
    this.GL.getExtension('OES_standard_derivatives');
    this._defaultFontShader = new p5.Shader(
      this,
      defaultShaders.fontVert,
      defaultShaders.fontFrag
    );
  }
  return this._defaultFontShader;
};

p5.RendererGL.prototype._getEmptyTexture = function() {
  if (!this._emptyTexture) {
    // a plain white texture RGBA, full alpha, single pixel.
    var im = new p5.Image(1, 1);
    im.set(0, 0, 255);
    this._emptyTexture = new p5.Texture(this, im);
  }
  return this._emptyTexture;
};

p5.RendererGL.prototype.getTexture = function(img) {
  var textures = this.textures;
  for (var it = 0; it < textures.length; ++it) {
    var texture = textures[it];
    if (texture.src === img) return texture;
  }

  var tex = new p5.Texture(this, img);
  textures.push(tex);
  return tex;
};

p5.RendererGL.prototype._setStrokeUniforms = function(strokeShader) {
  strokeShader.bindShader();

  // set the uniform values
  strokeShader.setUniform('uMaterialColor', this.curStrokeColor);
  strokeShader.setUniform('uStrokeWeight', this.curStrokeWeight);
};

p5.RendererGL.prototype._setFillUniforms = function(fillShader) {
  fillShader.bindShader();

  // TODO: optimize
  fillShader.setUniform('uMaterialColor', this.curFillColor);
  fillShader.setUniform('isTexture', !!this._tex);
  if (this._tex) {
    fillShader.setUniform('uSampler', this._tex);
  }
  fillShader.setUniform('uSpecular', this._useSpecularMaterial);
  fillShader.setUniform('uShininess', this._useShininess);

  fillShader.setUniform('uUseLighting', this._enableLighting);

  var pointLightCount = this.pointLightColors.length / 3;
  fillShader.setUniform('uPointLightCount', pointLightCount);
  fillShader.setUniform('uPointLightLocation', this.pointLightPositions);
  fillShader.setUniform('uPointLightColor', this.pointLightColors);

  var directionalLightCount = this.directionalLightColors.length / 3;
  fillShader.setUniform('uDirectionalLightCount', directionalLightCount);
  fillShader.setUniform('uLightingDirection', this.directionalLightDirections);
  fillShader.setUniform('uDirectionalColor', this.directionalLightColors);

  // TODO: sum these here...
  var ambientLightCount = this.ambientLightColors.length / 3;
  fillShader.setUniform('uAmbientLightCount', ambientLightCount);
  fillShader.setUniform('uAmbientColor', this.ambientLightColors);
  fillShader.bindTextures();
};

p5.RendererGL.prototype._setPointUniforms = function(pointShader) {
  pointShader.bindShader();

  // set the uniform values
  pointShader.setUniform('uMaterialColor', this.curStrokeColor);
  // @todo is there an instance where this isn't stroke weight?
  // should be they be same var?
  pointShader.setUniform('uPointSize', this.pointSize);
};

/* Binds a buffer to the drawing context
 * when passed more than two arguments it also updates or initializes
 * the data associated with the buffer
 */
p5.RendererGL.prototype._bindBuffer = function(
  buffer,
  target,
  values,
  type,
  usage
) {
  this.GL.bindBuffer(target, buffer);
  if (values !== undefined) {
    var data = new type(values);
    this.GL.bufferData(target, data, usage);
  }
};

///////////////////////////////
//// UTILITY FUNCTIONS
//////////////////////////////
/**
 * turn a two dimensional array into one dimensional array
 * @private
 * @param  {Array} arr 2-dimensional array
 * @return {Array}     1-dimensional array
 * [[1, 2, 3],[4, 5, 6]] -> [1, 2, 3, 4, 5, 6]
 */
p5.RendererGL.prototype._flatten = function(arr) {
  //when empty, return empty
  if (arr.length === 0) {
    return [];
  } else if (arr.length > 20000) {
    //big models , load slower to avoid stack overflow
    //faster non-recursive flatten via axelduch
    //stackoverflow.com/questions/27266550/how-to-flatten-nested-array-in-javascript
    var toString = Object.prototype.toString;
    var arrayTypeStr = '[object Array]';
    var result = [];
    var nodes = arr.slice();
    var node;
    node = nodes.pop();
    do {
      if (toString.call(node) === arrayTypeStr) {
        nodes.push.apply(nodes, node);
      } else {
        result.push(node);
      }
    } while (nodes.length && (node = nodes.pop()) !== undefined);
    result.reverse(); // we reverse result to restore the original order
    return result;
  } else {
    //otherwise if model within limits for browser
    //use faster recursive loading
    return [].concat.apply([], arr);
  }
};

/**
 * turn a p5.Vector Array into a one dimensional number array
 * @private
 * @param  {p5.Vector[]} arr  an array of p5.Vector
 * @return {Number[]}     a one dimensional array of numbers
 * [p5.Vector(1, 2, 3), p5.Vector(4, 5, 6)] ->
 * [1, 2, 3, 4, 5, 6]
 */
p5.RendererGL.prototype._vToNArray = function(arr) {
  return this._flatten(
    arr.map(function(item) {
      return [item.x, item.y, item.z];
    })
  );
};

/**
 * ensures that p5 is using a 3d renderer. throws an error if not.
 */
p5.prototype._assert3d = function(name) {
  if (!this._renderer.isP3D)
    throw new Error(
      name +
        "() is only supported in WEBGL mode. If you'd like to use 3D graphics" +
        ' and WebGL, see  https://p5js.org/examples/form-3d-primitives.html' +
        ' for more information.'
    );
};

// function to initialize GLU Tesselator

p5.RendererGL.prototype._initTessy = function initTesselator() {
  // function called for each vertex of tesselator output
  function vertexCallback(data, polyVertArray) {
    polyVertArray[polyVertArray.length] = data[0];
    polyVertArray[polyVertArray.length] = data[1];
    polyVertArray[polyVertArray.length] = data[2];
  }

  function begincallback(type) {
    if (type !== libtess.primitiveType.GL_TRIANGLES) {
      console.log('expected TRIANGLES but got type: ' + type);
    }
  }

  function errorcallback(errno) {
    console.log('error callback');
    console.log('error number: ' + errno);
  }
  // callback for when segments intersect and must be split
  function combinecallback(coords, data, weight) {
    return [coords[0], coords[1], coords[2]];
  }

  function edgeCallback(flag) {
    // don't really care about the flag, but need no-strip/no-fan behavior
  }

  var tessy = new libtess.GluTesselator();
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA, vertexCallback);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_BEGIN, begincallback);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR, errorcallback);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE, combinecallback);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_EDGE_FLAG, edgeCallback);

  return tessy;
};

p5.RendererGL.prototype._triangulate = function(contours) {
  // libtess will take 3d verts and flatten to a plane for tesselation
  // since only doing 2d tesselation here, provide z=1 normal to skip
  // iterating over verts only to get the same answer.
  // comment out to test normal-generation code
  this._tessy.gluTessNormal(0, 0, 1);

  var triangleVerts = [];
  this._tessy.gluTessBeginPolygon(triangleVerts);

  for (var i = 0; i < contours.length; i++) {
    this._tessy.gluTessBeginContour();
    var contour = contours[i];
    for (var j = 0; j < contour.length; j += 3) {
      var coords = [contour[j], contour[j + 1], contour[j + 2]];
      this._tessy.gluTessVertex(coords, coords);
    }
    this._tessy.gluTessEndContour();
  }

  // finish polygon
  this._tessy.gluTessEndPolygon();

  return triangleVerts;
};

// function to calculate BezierVertex Coefficients
p5.RendererGL.prototype._bezierCoefficients = function(t) {
  var t2 = t * t;
  var t3 = t2 * t;
  var mt = 1 - t;
  var mt2 = mt * mt;
  var mt3 = mt2 * mt;
  return [mt3, 3 * mt2 * t, 3 * mt * t2, t3];
};

// function to calculate QuadraticVertex Coefficients
p5.RendererGL.prototype._quadraticCoefficients = function(t) {
  var t2 = t * t;
  var mt = 1 - t;
  var mt2 = mt * mt;
  return [mt2, 2 * mt * t, t2];
};

// function to convert Bezier coordinates to Catmull Rom Splines
p5.RendererGL.prototype._bezierToCatmull = function(w) {
  var p1 = w[1];
  var p2 = w[1] + (w[2] - w[0]) / this._curveTightness;
  var p3 = w[2] - (w[3] - w[1]) / this._curveTightness;
  var p4 = w[2];
  var p = [p1, p2, p3, p4];
  return p;
};

module.exports = p5.RendererGL;
