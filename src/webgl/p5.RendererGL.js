'use strict';

var p5 = require('../core/core');
var shader = require('./shader');
require('../core/p5.Renderer');
require('./p5.Matrix');
var uMVMatrixStack = [];

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
 * 3D graphics class
 * @class p5.RendererGL
 * @constructor
 * @extends p5.Renderer
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
  this.fill(255, 255, 255, 255);
  this.stroke(0, 0, 0, 255);
  this.pointSize = 5.0;//default point/stroke

  this.emptyTexture = null;
  this.curShader = null;

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
p5.RendererGL.prototype._initShaders = function(vertId, fragId, isImmediateMode) {
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

  shaderProgram.attributes = {};

  var numAttributes = gl.getProgramParameter(shaderProgram,
    gl.ACTIVE_ATTRIBUTES);
  for(var i = 0; i < numAttributes; ++i){
    var attributeInfo = gl.getActiveAttrib(shaderProgram, i);
    var name = attributeInfo.name;
    var location = gl.getAttribLocation(shaderProgram, name);
    var attribute = {};
    attribute.name = name;
    attribute.location = location;
    attribute.type = attributeInfo.type;
    attribute.size = attributeInfo.size;
    shaderProgram.attributes[name] = attribute;
  }

  // Inspect shader and cache uniform info

  shaderProgram.uniforms = {};

  var numUniforms = gl.getProgramParameter(shaderProgram,
    gl.ACTIVE_UNIFORMS);

  var samplerIndex = 0;
  for(i = 0; i < numUniforms; ++i){
    var uniformInfo = gl.getActiveUniform(shaderProgram, i);
    var uniform = {};
    uniform.location = gl.getUniformLocation(shaderProgram, uniformInfo.name);
    uniform.size = uniformInfo.size;
    var uniformName = uniformInfo.name;
    //uniforms thats are arrays have their name returned as
    //someUniform[0] which is a bit silly so we trim it
    //off here. The size property tells us that its an array
    //so we dont lose any information by doing this
    if(uniformInfo.size > 1) {
      uniformName = uniformName.substring(0,
        uniformName.indexOf('[0]'));
    }
    uniform.name = uniformName;
    uniform.type = uniformInfo.type;
    if(uniform.type === gl.SAMPLER_2D)
    {
      uniform.samplerIndex = samplerIndex;
      samplerIndex++;
    }
    shaderProgram.uniforms[uniformName] = uniform;
  }

  this._createEmptyTexture();

  return shaderProgram;
};


/**
 * Wrapper around gl.useProgram to make sure
 * we only switch shaders when neccessary
 */
p5.RendererGL.prototype._useShader = function(shaderProgram){
  var gl = this.GL;
  if(shaderProgram === this.curShader) {
    return;
  }
  gl.useProgram(shaderProgram);
  this.curShader = shaderProgram;
  return shaderProgram;
};

p5.RendererGL.prototype._setMatrixUniforms = function(shaderKey) {
  var shaderProgram = this.mHash[shaderKey];

  this._useShader(shaderProgram);
  this._setUniform('uProjectionMatrix', this.uPMatrix.mat4);
  this._setUniform('uModelViewMatrix', this.uMVMatrix.mat4);

  this.uNMatrix.inverseTranspose(this.uMVMatrix);
  this._setUniform('uNormalMatrix', this.uNMatrix.mat3);
};

/**
 * Wrapper around gl.uniform functions.
 * As we store uniform info in the shader we can use that
 * to do type checking on the supplied data and call
 * the appropriate function.
 */
p5.RendererGL.prototype._setUniform = function(uniformName, data)
{
  //@todo update all current gl.uniformXX calls

  var gl = this.GL;
  var shaderProgram = this.curShader;
  if(!this.curShader) {
    //@todo warning?
    return;
  }
  var uniform = shaderProgram.uniforms[uniformName];
  if(!uniform) {
    //@todo warning?
    return;
  }
  var location = uniform.location;

  switch(uniform.type){
    case gl.BOOL:{
      if(data === true) {
        gl.uniform1i(location, 1);
      }
      else {
        gl.uniform1i(location, 0);
      }
      return;
    }
    case gl.INT:{
      gl.uniform1i(location, data);
      break;
    }
    case gl.FLOAT:{
      if(uniform.size > 1){
        gl.uniform1fv(location, data);
      }
      else{
        gl.uniform1f(location, data);
      }
      break;
    }
    case gl.FLOAT_MAT3:{
      gl.uniformMatrix3fv(location, false, data);
      break;
    }
    case gl.FLOAT_MAT4:{
      gl.uniformMatrix4fv(location, false, data);
      break;
    }
    case gl.FLOAT_VEC2:{
      if(uniform.size > 1){
        gl.uniform2fv(location, data);
      }
      else{
        gl.uniform2f(location, data[0], data[1]);
      }
      break;
    }
    case gl.FLOAT_VEC3:{
      if(uniform.size > 1){
        gl.uniform3fv(location, data);
      }
      else{
        gl.uniform3f(location, data[0], data[1], data[2]);
      }
      break;
    }
    case gl.FLOAT_VEC4:{
      if(uniform.size > 1){
        gl.uniform4fv(location, data);
      }
      else{
        gl.uniform4f(location, data[0], data[1], data[2], data[3]);
      }
      break;
    }
    case gl.SAMPLER_2D:{
      gl.activeTexture(gl.TEXTURE0 + uniform.samplerIndex);
      gl.bindTexture(gl.TEXTURE_2D, data);
      gl.uniform1i(location, uniform.samplerIndex);
      break;
    }
    //@todo complete all types
  }
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
    this.newShader = true;
  }
  this.curShaderId = mId;

  return this.mHash[this.curShaderId];
};

p5.RendererGL.prototype._getCurShaderId = function(){
  //if the shader ID is not yet defined
  if (this.drawMode !== 'fill' && this.curShaderId === undefined){
    //default shader: normalMaterial()
    this._getShader('normalVert', 'normalFrag');
  } else if (this.drawMode === 'fill'){
    // note that this._getShader will check if the shader already exists
    // by looking up the shader id (composed of vertexShaderId|fragmentShaderId)
    // in the material hash. If the material isn't found in the hash, it
    // creates a new one using this._initShaders--however, we'd like
    // use the cached version as often as possible, so we defer to this._getShader
    // here instead of calling this._initShaders directly.
    var shaderProgram;
    if (this.isImmediateDrawing) {
      shaderProgram = this._getShader('immediateVert', 'vertexColorFrag', true);
    } else {
      shaderProgram = this._getShader('normalVert', 'basicFrag', false);
    }
    // this should be safe, but...
    this._useShader(shaderProgram);
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
  var shaderProgram;
  //see material.js for more info on color blending in webgl
  var colors = this._applyColorBlend.apply(this, arguments);
  this.curFillColor = colors;
  this.drawMode = 'fill';
  if (this.isImmediateDrawing){
    shaderProgram = this._getShader('immediateVert','vertexColorFrag');
    this._useShader(shaderProgram);
  } else {
    shaderProgram = this._getShader('normalVert', 'basicFrag');
    this._useShader(shaderProgram);
    //RetainedMode uses a webgl uniform to pass color vals
    //in ImmediateMode, we want access to each vertex so therefore
    //we cannot use a uniform.
    this._setUniform('uMaterialColor', colors);
  }
  return this;
};

p5.RendererGL.prototype.noFill = function() {
  var gl = this.GL;
  var shaderProgram = this._getShader('normalVert', 'basicFrag');
  this._useShader(shaderProgram);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  this.drawMode = 'wireframe';
  if(this.curStrokeColor) {
    this._setNoFillStroke();
  }
  return this;
};

p5.RendererGL.prototype.stroke = function(r, g, b, a) {
  var color = this._pInst.color.apply(this._pInst, arguments);
  var colorNormalized = color._array;
  this.curStrokeColor = colorNormalized;
  if(this.drawMode === 'wireframe') {
    this._setNoFillStroke();
  }
  return this;
};

p5.RendererGL.prototype._setNoFillStroke = function() {
  var shaderProgram = this.mHash[this.curShaderId];
  this._useShader(shaderProgram);
  this._setUniform('uMaterialColor', this.curStrokeColor);
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
