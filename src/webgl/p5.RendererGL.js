'use strict';

var p5 = require('../core/core');
var builtInShaders = require('./shader');
require('../core/p5.Renderer');
require('./p5.Matrix');
require('./p5.Shader');
var uMVMatrixStack = [];
var RESOLUTION = 1000;

//@TODO should implement public method
//to override these attributes
var attributes = {
  alpha: true,
  depth: true,
  stencil: true,
  antialias: false,
  premultipliedAlpha: false,
  preserveDrawingBuffer: false
};

/**
 * @class p5.RendererGL
 * @constructor
 * @extends p5.Renderer
 * 3D graphics class.
 * @todo extend class to include public method for offscreen
 * rendering (FBO).
 *
 */
p5.RendererGL = function(elt, pInst, isMainCanvas) {
  p5.Renderer.call(this, elt, pInst, isMainCanvas);
  this._initContext();

  this.isP3D = true; //lets us know we're in 3d mode
  this.GL = this.drawingContext;
  //lights
  this.ambientLightCount = 0;
  this.directionalLightCount = 0;
  this.pointLightCount = 0;
  //camera
  this._curCamera = null;

  p5.Shader._setGlobal('uResolution', RESOLUTION);
  p5.Shader._setGlobal('uModelViewMatrix', new p5.Matrix());
  p5.Shader._setGlobal('uProjectionMatrix', new p5.Matrix());
  p5.Shader._setGlobal('uNormalMatrix', new p5.Matrix('mat3'));
  //TODO: Possibly Normal Matrix doesn't work in immediate mode? Investigate.

  //Geometry & Material hashes
  this.gHash = {};
  this.mHash = {};

  //Optional shader flags that will be passed in as #define commands
  this.shaderDefines = {};

  //Built-in shaders
  this.currentShader = builtInShaders.default;

  //Counter for keeping track of which texture slots are currently occupied
  this.texCount = 0;
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
    this.drawingContext = this.canvas.getContext('webgl', attributes) ||
      this.canvas.getContext('experimental-webgl', attributes);
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
//detect if user didn't set the camera
//then call this function below
p5.RendererGL.prototype._setDefaultCamera = function(){
  if(this._curCamera === null){
    var _w = this.width;
    var _h = this.height;

    p5.Shader._setGlobal('uProjectionMatrix', p5.Matrix.identity());
    p5.Shader._getGlobal('uProjectionMatrix').perspective(60 / 180 * Math.PI,
                                                      _w / _h, 0.1, 10000);
    this._curCamera = 'default';
  }
};

p5.RendererGL.prototype._update = function() {
  p5.Shader._setGlobal('uModelViewMatrix', p5.Matrix.identity());
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
 * [_compileShader description]
 * @param  {string} vertId  [description]
 * @param  {string} fragId  [description]
 * @param  {array}  [flags] Array of strings
 * @return {[type]}         [description]
 */
p5.RendererGL.prototype._compileShader = function(shader) {
  var gl = this.GL;
  var vertSource = shader.vertSource;
  var fragSource = shader.fragSource;

  //Figure out any flags that need to be appended to the shader
  var flagPrefix = '';
  for(var flag in this.shaderDefines) {
    if(this.shaderDefines[flag]) {
      flagPrefix += '#define ' + flag + '\n';
    }
  }

  var shaders = [flagPrefix + vertSource, flagPrefix + fragSource];
  var mId = shaders.toString();

  if(!this.materialInHash(mId)) {
    var shaderTypes = [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER];
    var shaderProgram = gl.createProgram();

    for(var i = 0; i < 2; ++i) {
      var newShader = gl.createShader(shaderTypes[i]);
      gl.shaderSource(newShader, flagPrefix + shaders[i]);
      gl.compileShader(newShader);
      if (!gl.getShaderParameter(newShader, gl.COMPILE_STATUS)) {
        console.log('Yikes! An error occurred compiling the shaders:' +
          gl.getShaderInfoLog(newShader));
        return null;
      }
      gl.attachShader(shaderProgram, newShader);
    }

    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.log('Snap! Error linking shader program');
    }

    this.mHash[mId] = shaderProgram;
  }

  this.curShaderId = mId;
  return this.mHash[this.curShaderId];
};

//////////////////////////////////////////////
// UNIFORMS
//////////////////////////////////////////////

/**
 * Apply saved uniforms to specified shader.
 */
p5.RendererGL.prototype._applyUniforms = function(shaderKey, uniformsObj)
{
  var gl = this.GL;
  var shaderProgram = this.mHash[shaderKey];
  var uObj = uniformsObj || this._uniforms;

  for(var uName in uObj) {
    //TODO: This caching might break if one shader is used w/ multiple instances
    if(!(shaderKey in uObj[uName].location)) {
      uObj[uName].location[shaderKey] =
          gl.getUniformLocation(shaderProgram, uName);
    }
    var location = uObj[uName].location[shaderKey];
    var data;

    var type = uObj[uName].type;
    var functionName = 'uniform' + type;
    if(type === 'texture') {
      this._applyTexUniform(uObj[uName].data, this.texCount);
      gl.uniform1i(location, this.texCount);
      this.texCount++;
    } else if(type.substring(0, 6) === 'Matrix') {
      if(type === 'Matrix3fv') {
        data = uObj[uName].data.mat3;
      } else {
        data = uObj[uName].data.mat4;
      }
      gl[functionName](location, false, data);
    } else {
      data = uObj[uName].data;

      if(data instanceof p5.Vector) {
        data = data.array();
      } else if(data instanceof p5.Color) {
        data = data._array;
      }

      gl[functionName](location, data);
    }
  }
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
  // var gl = this.GL;
  // var shaderProgram;
  //see material.js for more info on color blending in webgl
  var colors = this._applyColorBlend.apply(this, arguments);
  this.curFillColor = colors;
  this.drawMode = 'fill';

  this.shaderDefines.USE_LIGHTS = false;
  p5.Shader._setGlobal('uMaterialColor', colors);
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
  p5.Shader._setGlobal('resolution', this.width, this.height);
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
  //@TODO: figure out how to fit the resolution
  x = x / RESOLUTION;
  y = -y / RESOLUTION;
  z = z / RESOLUTION;
  this._getUniform('uModelViewMatrix').translate([x,y,z]);
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
  p5.Shader._getGlobal('uModelViewMatrix').scale([x,y,z]);
  return this;
};

p5.RendererGL.prototype.rotate = function(rad, axis){
  p5.Shader._getGlobal('uModelViewMatrix').rotate(rad, axis);
  p5.Shader._getGlobal('uNormalMatrix').inverseTranspose(
                                      p5.Shader._getGlobal('uModelViewMatrix'));
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
  uMVMatrixStack.push(p5.Shader._getGlobal('uModelViewMatrix').copy());
};

/**
 * [pop description]
 * @return {[type]} [description]
 */
p5.RendererGL.prototype.pop = function() {
  if (uMVMatrixStack.length === 0) {
    throw new Error('Invalid popMatrix!');
  }
  p5.Shader._setGlobal('uModelViewMatrix', uMVMatrixStack.pop());
};

p5.RendererGL.prototype.resetMatrix = function() {
  p5.Shader._setGlobal('uModelViewMatrix', p5.Matrix.identity());
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
