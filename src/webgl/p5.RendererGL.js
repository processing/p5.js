'use strict';

var p5 = require('../core/core');
var shader = require('./shader');
require('../core/p5.Renderer');
require('./p5.Matrix');
var uMVMatrixStack = [];

/**
 * 3D graphics class
 * @class p5.RendererGL
 * @constructor
 * @extends p5.Renderer
 * @todo extend class to include public method for offscreen
 * rendering (FBO).
 *
 */
p5.RendererGL = function(elt, pInst, isMainCanvas, attr) {
  p5.Renderer.call(this, elt, pInst, isMainCanvas);
  this.attributes = {};
  attr = attr || {};
  this.attributes.alpha = attr.alpha || true;
  this.attributes.depth = attr.depth || true;
  this.attributes.stencil = attr.stencil || true;
  this.attributes.antialias = attr.antialias || false;
  this.attributes.premultipliedAlpha = attr.premultipliedAlpha || false;
  this.attributes.preserveDrawingBuffer = attr.preserveDrawingBuffer || false;

  this._initContext();
  this.isP3D = true; //lets us know we're in 3d mode
  this.GL = this.drawingContext;
  //lights
  this.ambientLightCount = 0;
  this.directionalLightCount = 0;
  this.pointLightCount = 0;
  //camera
  this._curCamera = null;
  /**
   * model view, projection, & normal
   * matrices
   */
  this.uMVMatrix = new p5.Matrix();
  this.uPMatrix  = new p5.Matrix();
  this.uNMatrix = new p5.Matrix('mat3');
  //Geometry & Material hashes
  this.gHash = {};
  this.mHash = {};
  //Imediate Mode
  //default drawing is done in Retained Mode
  this.isImmediateDrawing = false;
  this.immediateMode = {};
  this.curFillColor = [0.5,0.5,0.5,1.0];
  this.curStrokeColor = [0.5,0.5,0.5,1.0];
  this.pointSize = 5.0;//default point/stroke
  return this;
};

p5.RendererGL.prototype = Object.create(p5.Renderer.prototype);

//////////////////////////////////////////////
// Setting
//////////////////////////////////////////////

p5.RendererGL.prototype._initContext = function() {
  try {
    this.drawingContext = this.canvas.getContext('webgl', this.attributes) ||
      this.canvas.getContext('experimental-webgl', this.attributes);
    if (this.drawingContext === null) {
      throw new Error('Error creating webgl context');
    } else {
      console.log('p5.RendererGL: enabled webgl context');
      var gl = this.drawingContext;
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
  } catch (er) {
    throw new Error(er);
  }
};

//The context needs to be reset anytime we want to change the attributes
p5.RendererGL.prototype._resetContext = function(options, callback) {
  var w = this.width;
  var h = this.height;
  var defaultId = 'defaultCanvas0';
  var c = document.getElementById(defaultId);
  if(c){
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
  this._pInst._setProperty('_renderer', new p5.RendererGL(this._pInst.canvas,
    this._pInst, true, this.attributes));
  this._pInst._isdefaultGraphics = true;
  this._pInst._renderer.resize(w, h);
  this._pInst._renderer._applyDefaults();
  this._pInst._elements.push(this._renderer);
  if(typeof callback === 'function') {
    //setTimeout with 0 forces the task to the back of the queue, this ensures that
    //we finish switching out the renderer
    setTimeout(function() {
      callback.apply(window._renderer, [options[0], options[1],
        options[2], options[3]]);
    }, 0);
  }
};

p5.prototype.setAttributes = function() {
  if(!this._renderer.isP3D) {
    console.log('setAttributes() only works in WebGL');
    return;
  }
  if(arguments.length === 2) {
    this._renderer.attributes.alpha = arguments[0] ===
      'alpha' ? arguments[1] : true;
    this._renderer.attributes.depth = arguments[0] ===
      'depth' ? arguments[1] : true;
    this._renderer.attributes.stencil = arguments[0] ===
      'stencil' ? arguments[1] : true;
    this._renderer.attributes.antialias = arguments[0] ===
      'antialias' ? arguments[1] : true;
    this._renderer.attributes.premultipliedAlpha = arguments[0] ===
      'premultipliedAlpha' ? arguments[1] : true;
    this._renderer.attributes.preserveDrawingBuffer = arguments[0] ===
      'preserveDrawingBuffer' ? arguments[1] : true;
  } else if(arguments.length === 1) {
    for(var key in arguments[0]) {
      if(this._renderer.attributes.hasOwnProperty(key)) {
        this._renderer.attributes[key] = arguments[0][key];
      }
    }
  } else {
    console.log('setAttributes() only accepts an object or a key-value pair' +
      'as an argument');
    return;
  }
  this._renderer._resetContext();
};

//detect if user didn't set the camera
//then call this function below
p5.RendererGL.prototype._setDefaultCamera = function(){
  if(this._curCamera === null){
    var _w = this.width;
    var _h = this.height;
    this.uPMatrix = p5.Matrix.identity();
    var cameraZ = (this.height / 2) / Math.tan(Math.PI * 30 / 180);
    this.uPMatrix.perspective(60 / 180 * Math.PI, _w / _h,
                              cameraZ * 0.1, cameraZ * 10);
    this._curCamera = 'default';
  }
};

p5.RendererGL.prototype._update = function() {
  this.uMVMatrix = p5.Matrix.identity();
  this.translate(0, 0, -(this.height / 2) / Math.tan(Math.PI * 30 / 180));
  this.ambientLightCount = 0;
  this.directionalLightCount = 0;
  this.pointLightCount = 0;
};

/**
 * [background description]
 * @return {[type]} [description]
 */
p5.RendererGL.prototype.background = function() {
  var gl = this.GL;
  var _col = this._pInst.color.apply(this._pInst, arguments);
  var _r = (_col.levels[0]) / 255;
  var _g = (_col.levels[1]) / 255;
  var _b = (_col.levels[2]) / 255;
  var _a = (_col.levels[3]) / 255;
  gl.clearColor(_r, _g, _b, _a);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

//@TODO implement this
// p5.RendererGL.prototype.clear = function() {
//@TODO
// };

//////////////////////////////////////////////
// SHADER
//////////////////////////////////////////////

/**
 * [_initShaders description]
 * @param  {string} vertId [description]
 * @param  {string} fragId [description]
 * @return {[type]}        [description]
 */
p5.RendererGL.prototype._initShaders =
function(vertId, fragId, isImmediateMode) {
  var gl = this.GL;
  //set up our default shaders by:
  // 1. create the shader,
  // 2. load the shader source,
  // 3. compile the shader
  var _vertShader = gl.createShader(gl.VERTEX_SHADER);
  //load in our default vertex shader
  gl.shaderSource(_vertShader, shader[vertId]);
  gl.compileShader(_vertShader);
  // if our vertex shader failed compilation?
  if (!gl.getShaderParameter(_vertShader, gl.COMPILE_STATUS)) {
    alert('Yikes! An error occurred compiling the shaders:' +
      gl.getShaderInfoLog(_vertShader));
    return null;
  }

  var _fragShader = gl.createShader(gl.FRAGMENT_SHADER);
  //load in our material frag shader
  gl.shaderSource(_fragShader, shader[fragId]);
  gl.compileShader(_fragShader);
  // if our frag shader failed compilation?
  if (!gl.getShaderParameter(_fragShader, gl.COMPILE_STATUS)) {
    alert('Darn! An error occurred compiling the shaders:' +
      gl.getShaderInfoLog(_fragShader));
    return null;
  }

  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, _vertShader);
  gl.attachShader(shaderProgram, _fragShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Snap! Error linking shader program');
  }
  //END SHADERS SETUP

  this._getLocation(shaderProgram, isImmediateMode);

  return shaderProgram;
};

p5.RendererGL.prototype._getLocation =
function(shaderProgram, isImmediateMode) {
  var gl = this.GL;
  gl.useProgram(shaderProgram);

  //projection Matrix uniform
  shaderProgram.uPMatrixUniform =
    gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
  //model view Matrix uniform
  shaderProgram.uMVMatrixUniform =
    gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');

  //@TODO: figure out a better way instead of if statement
  if(isImmediateMode === undefined){
    //normal Matrix uniform
    shaderProgram.uNMatrixUniform =
    gl.getUniformLocation(shaderProgram, 'uNormalMatrix');

    shaderProgram.samplerUniform =
    gl.getUniformLocation(shaderProgram, 'uSampler');
  }
};

/**
 * Sets a shader uniform given a shaderProgram and uniform string
 * @param {String} shaderKey key to material Hash.
 * @param {String} uniform location in shader.
 * @param { Number} data data to bind uniform.  Float data type.
 * @todo currently this function sets uniform1f data.
 * Should generalize function to accept any uniform
 * data type.
 */
p5.RendererGL.prototype._setUniform1f = function(shaderKey,uniform,data)
{
  var gl = this.GL;
  var shaderProgram = this.mHash[shaderKey];
  gl.useProgram(shaderProgram);
  shaderProgram[uniform] = gl.getUniformLocation(shaderProgram, uniform);
  gl.uniform1f(shaderProgram[uniform], data);
  return this;
};

p5.RendererGL.prototype._setMatrixUniforms = function(shaderKey) {
  var gl = this.GL;
  var shaderProgram = this.mHash[shaderKey];

  gl.useProgram(shaderProgram);

  gl.uniformMatrix4fv(
    shaderProgram.uPMatrixUniform,
    false, this.uPMatrix.mat4);

  gl.uniformMatrix4fv(
    shaderProgram.uMVMatrixUniform,
    false, this.uMVMatrix.mat4);

  this.uNMatrix.inverseTranspose(this.uMVMatrix);

  gl.uniformMatrix3fv(
    shaderProgram.uNMatrixUniform,
    false, this.uNMatrix.mat3);
};
//////////////////////////////////////////////
// GET CURRENT | for shader and color
//////////////////////////////////////////////
p5.RendererGL.prototype._getShader = function(vertId, fragId, isImmediateMode) {
  var mId = vertId + '|' + fragId;
  //create it and put it into hashTable
  if(!this.materialInHash(mId)){
    var shaderProgram = this._initShaders(vertId, fragId, isImmediateMode);
    this.mHash[mId] = shaderProgram;
  }
  this.curShaderId = mId;

  return this.mHash[this.curShaderId];
};

p5.RendererGL.prototype._getCurShaderId = function(){
  //if the shader ID is not yet defined
  if(this.drawMode !== 'fill' && this.curShaderId === undefined){
    //default shader: normalMaterial()
    var mId = 'normalVert|normalFrag';
    var shaderProgram = this._initShaders('normalVert', 'normalFrag');
    this.mHash[mId] = shaderProgram;
    this.curShaderId = mId;
  } else if(this.isImmediateDrawing && this.drawMode === 'fill'){
    // note that this._getShader will check if the shader already exists
    // by looking up the shader id (composed of vertexShaderId|fragmentShaderId)
    // in the material hash. If the material isn't found in the hash, it
    // creates a new one using this._initShaders--however, we'd like
    // use the cached version as often as possible, so we defer to this._getShader
    // here instead of calling this._initShaders directly.
    this._getShader('immediateVert', 'vertexColorFrag', true);
  }

  return this.curShaderId;
};

//////////////////////////////////////////////
// COLOR
//////////////////////////////////////////////
/**
 * Basic fill material for geometry with a given color
 * @method  fill
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
 *
 * function draw(){
 *  background(0);
 *  fill(250, 0, 0);
 *  rotateX(frameCount * 0.01);
 *  rotateY(frameCount * 0.01);
 *  rotateZ(frameCount * 0.01);
 *  box(200, 200, 200);
 * }
 * </code>
 * </div>
 *
 * @alt
 * red canvas
 *
 */
p5.RendererGL.prototype.fill = function(v1, v2, v3, a) {
  var gl = this.GL;
  var shaderProgram;
  //see material.js for more info on color blending in webgl
  var colors = this._applyColorBlend.apply(this, arguments);
  this.curFillColor = colors;
  this.drawMode = 'fill';
  if(this.isImmediateDrawing){
    shaderProgram =
    this._getShader('immediateVert','vertexColorFrag');
    gl.useProgram(shaderProgram);
  } else {
    shaderProgram =
    this._getShader('normalVert', 'basicFrag');
    gl.useProgram(shaderProgram);
    //RetainedMode uses a webgl uniform to pass color vals
    //in ImmediateMode, we want access to each vertex so therefore
    //we cannot use a uniform.
    shaderProgram.uMaterialColor = gl.getUniformLocation(
      shaderProgram, 'uMaterialColor' );
    gl.uniform4f( shaderProgram.uMaterialColor,
      colors[0],
      colors[1],
      colors[2],
      colors[3]);
  }
  return this;
};
p5.RendererGL.prototype.stroke = function(r, g, b, a) {
  var color = this._pInst.color.apply(this._pInst, arguments);
  var colorNormalized = color._array;
  this.curStrokeColor = colorNormalized;
  this.drawMode = 'stroke';
  return this;
};

//@TODO
p5.RendererGL.prototype._strokeCheck = function(){
  if(this.drawMode === 'stroke'){
    throw new Error(
      'stroke for shapes in 3D not yet implemented, use fill for now :('
    );
  }
};

p5.RendererGL.prototype.loadPixels = function() {
  var pd = this._pInst._pixelDensity;
  var x = arguments[0] || 0;
  var y = arguments[1] || 0;
  var w = arguments[2] || this.width;
  var h = arguments[3] || this.height;
  w *= pd;
  h *= pd;
  var gl = this.GL;
  var attribs = gl.getContextAttributes();
  //the first time we loadPixels if the user didn't already change the attribute
  //preserveDrawingBuffer to true, we need to reset the context with
  //preserveDrawingBuffer set to true
  if(attribs.preserveDrawingBuffer === false) {
    this.attributes.preserveDrawingBuffer = true;
    this._resetContext([x, y, w, h], this._readPixels);
  } else {
    this._readPixels(x, y, w, h);
  }
};

p5.RendererGL.prototype._readPixels = function() {
  var x = arguments[0] || 0;
  var y = arguments[1] || 0;
  var w = arguments[2] || this.width;
  var h = arguments[3] || this.height;
  var gl = this.GL;
  var pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
  gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  this._pInst._setProperty('pixels', pixels);
};

/**
 * [strokeWeight description]
 * @param  {Number} pointSize stroke point size
 * @return {[type]}           [description]
 * @todo  strokeWeight currently works on points only.
 * implement on all wireframes and strokes.
 */
p5.RendererGL.prototype.strokeWeight = function(pointSize) {
  this.pointSize = pointSize;
  return this;
};
//////////////////////////////////////////////
// HASH | for material and geometry
//////////////////////////////////////////////

p5.RendererGL.prototype.geometryInHash = function(gId){
  return this.gHash[gId] !== undefined;
};

p5.RendererGL.prototype.materialInHash = function(mId){
  return this.mHash[mId] !== undefined;
};

/**
 * [resize description]
 * @param  {[type]} w [description]
 * @param  {[tyoe]} h [description]
 * @return {[type]}   [description]
 */
p5.RendererGL.prototype.resize = function(w,h) {
  var gl = this.GL;
  p5.Renderer.prototype.resize.call(this, w, h);
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  // If we're using the default camera, update the aspect ratio
  if(this._curCamera === 'default') {
    this._curCamera = null;
    this._setDefaultCamera();
  }
};

/**
 * clears color and depth buffers
 * with r,g,b,a
 * @param {Number} r normalized red val.
 * @param {Number} g normalized green val.
 * @param {Number} b normalized blue val.
 * @param {Number} a normalized alpha val.
 */
p5.RendererGL.prototype.clear = function() {
  var gl = this.GL;
  gl.clearColor(arguments[0],
    arguments[1],
    arguments[2],
    arguments[3]);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

/**
 * [translate description]
 * @param  {[type]} x [description]
 * @param  {[type]} y [description]
 * @param  {[type]} z [description]
 * @return {[type]}   [description]
 * @todo implement handle for components or vector as args
 */
p5.RendererGL.prototype.translate = function(x, y, z) {
  this.uMVMatrix.translate([x,-y,z]);
  return this;
};

/**
 * Scales the Model View Matrix by a vector
 * @param  {Number | p5.Vector | Array} x [description]
 * @param  {Number} [y] y-axis scalar
 * @param  {Number} [z] z-axis scalar
 * @return {this}   [description]
 */
p5.RendererGL.prototype.scale = function(x,y,z) {
  this.uMVMatrix.scale([x,y,z]);
  return this;
};

p5.RendererGL.prototype.rotate = function(rad, axis){
  this.uMVMatrix.rotate(rad, axis);
  return this;
};

p5.RendererGL.prototype.rotateX = function(rad) {
  this.rotate(rad, [1,0,0]);
  return this;
};

p5.RendererGL.prototype.rotateY = function(rad) {
  this.rotate(rad, [0,1,0]);
  return this;
};

p5.RendererGL.prototype.rotateZ = function(rad) {
  this.rotate(rad, [0,0,1]);
  return this;
};

/**
 * pushes a copy of the model view matrix onto the
 * MV Matrix stack.
 */
p5.RendererGL.prototype.push = function() {
  uMVMatrixStack.push(this.uMVMatrix.copy());
};

/**
 * [pop description]
 * @return {[type]} [description]
 */
p5.RendererGL.prototype.pop = function() {
  if (uMVMatrixStack.length === 0) {
    throw new Error('Invalid popMatrix!');
  }
  this.uMVMatrix = uMVMatrixStack.pop();
};

p5.RendererGL.prototype.resetMatrix = function() {
  this.uMVMatrix = p5.Matrix.identity();
  this.translate(0, 0, -800);
  return this;
};

// Text/Typography
// @TODO:
p5.RendererGL.prototype._applyTextProperties = function() {
  //@TODO finish implementation
  console.error('text commands not yet implemented in webgl');
};
module.exports = p5.RendererGL;
