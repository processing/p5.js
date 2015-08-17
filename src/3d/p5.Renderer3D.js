'use strict';

var p5 = require('../core/core');
var shader = require('./shader');
require('../core/p5.Renderer');
require('./p5.Matrix');
var uMVMatrixStack = [];
var shaderStack = [];
var RESOLUTION = 1000;

//@TODO should probably implement an override for these attributes
var attributes = {
  alpha: false,
  depth: true,
  stencil: true,
  antialias: false,
  premultipliedAlpha: false,
  preserveDrawingBuffer: false
};

/**
 * 3D graphics class.  Can also be used as an off-screen graphics buffer.
 * A p5.Renderer3D object can be constructed
 *
 */
p5.Renderer3D = function(elt, pInst, isMainCanvas) {
  p5.Renderer.call(this, elt, pInst, isMainCanvas);

  try {
    this.drawingContext = this.canvas.getContext('webgl', attributes) ||
      this.canvas.getContext('experimental-webgl', attributes);
    if (this.drawingContext === null) {
      throw new Error('Error creating webgl context');
    } else {
      console.log('p5.Renderer3D: enabled webgl context');
    }
  } catch (er) {
    throw new Error(er);
  }

  this.isP3D = true; //lets us know we're in 3d mode
  this.GL = this.drawingContext;
  var gl = this.GL;
  gl.clearColor(1.0, 1.0, 1.0, 1.0); //background is initialized white
  gl.clearDepth(1);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  //create our default matrices
  this.initMatrix();
  this.initHash();
  this.resetStack();
  //for immedidate mode
  this.verticeBuffer = gl.createBuffer();
  this.colorBuffer = gl.createBuffer();
  return this;
};

/**
 * [prototype description]
 * @type {[type]}
 */
p5.Renderer3D.prototype = Object.create(p5.Renderer.prototype);

/**
 * [_applyDefaults description]
 * @return {[type]} [description]
 */
p5.Renderer3D.prototype._applyDefaults = function() {
  return this;
};

/**
 * [resize description]
 * @param  {[type]} w [description]
 * @param  {  } h [description]
 * @return {[type]}   [description]
 */
p5.Renderer3D.prototype.resize = function(w,h) {
  var gl = this.GL;
  p5.Renderer.prototype.resize.call(this, w, h);
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
};

//////////////////////////////////////////////
// BACKGROUND | Setting
//////////////////////////////////////////////

/**
 * [background description]
 * @return {[type]} [description]
 */
p5.Renderer3D.prototype.background = function() {
  var gl = this.GL;
  var _col = this._pInst.color.apply(this._pInst, arguments);
  // gl.clearColor(0.0,0.0,0.0,1.0);
  var _r = (_col.rgba[0]) / 255;
  var _g = (_col.rgba[1]) / 255;
  var _b = (_col.rgba[2]) / 255;
  var _a = (_col.rgba[3]) / 255;
  gl.clearColor(_r, _g, _b, _a);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  this.resetMatrix();
  this.resetStack();
};

//@TODO implement this
// p5.Renderer3D.prototype.clear = function() {
//@TODO
// };

//////////////////////////////////////////////
// SHADER
//////////////////////////////////////////////

/**
 * [initShaders description]
 * @param  {[type]} vertId [description]
 * @param  {[type]} fragId [description]
 * @return {[type]}        [description]
 */
p5.Renderer3D.prototype.initShaders = function(vertId, fragId, immediateMode) {
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
  gl.useProgram(shaderProgram);
  //END SHADERS SETUP

  // @TODO replace 4th argument with far plane once we implement
  // a view frustrum
  shaderProgram.uResolution =
    gl.getUniformLocation(shaderProgram, 'uResolution');
  gl.uniform1f(shaderProgram.uResolution, RESOLUTION);

  //vertex position Attribute
  shaderProgram.vertexPositionAttribute =
    gl.getAttribLocation(shaderProgram, 'aPosition');
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  //@TODO: figure out a better way instead of if statement
  if(immediateMode === undefined){
    //vertex normal Attribute
    shaderProgram.vertexNormalAttribute =
      gl.getAttribLocation(shaderProgram, 'aNormal');
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    //normal Matrix uniform
    shaderProgram.uNMatrixUniform =
    gl.getUniformLocation(shaderProgram, 'uNormalMatrix');

    //texture coordinate Attribute
    shaderProgram.textureCoordAttribute =
      gl.getAttribLocation(shaderProgram, 'aTexCoord');
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.samplerUniform =
    gl.getUniformLocation(shaderProgram, 'uSampler');
  }

  //projection Matrix uniform
  shaderProgram.uPMatrixUniform =
    gl.getUniformLocation(shaderProgram, 'uTransformMatrix');
  //model view Matrix uniform
  shaderProgram.uMVMatrixUniform =
    gl.getUniformLocation(shaderProgram, 'uModelviewMatrix');

  this.mHash[vertId + '|' + fragId] = shaderProgram;

  return shaderProgram;
};

p5.Renderer3D.prototype.getShader = function(vertId, fragId) {
  var mId = vertId+ '|' + fragId;

  if(!this.materialInHash(mId)){
    this.initShaders(vertId, fragId);
  }

  if(mId !== this.getCurShaderId()){
    this.saveShaders(mId);
  }

  return this.mHash[mId];
};

/**
 * Sets the Matrix Uniforms inside our default shader.
 * @param {String} shaderKey key of current shader
 */
p5.Renderer3D.prototype.setMatrixUniforms = function(shaderKey) {
  var gl = this.GL;
  var shaderProgram = this.mHash[shaderKey];

  gl.useProgram(shaderProgram);

  gl.uniformMatrix4fv(
    shaderProgram.uPMatrixUniform,
    false, this.uPMatrix.mat4);

  gl.uniformMatrix4fv(
    shaderProgram.uMVMatrixUniform,
    false, this.uMVMatrix.mat4);

  this.uNMatrix = new p5.Matrix();
  this.uNMatrix.invert(this.uMVMatrix);
  this.uNMatrix.transpose(this.uNMatrix);

  gl.uniformMatrix4fv(
    shaderProgram.uNMatrixUniform,
    false, this.uNMatrix.mat4);
};

//////////////////////////////////////////////
// STACK | for shader, vertex, color and mode
//////////////////////////////////////////////

p5.Renderer3D.prototype.saveShaders = function(mId){
  shaderStack.push(mId);
};

p5.Renderer3D.prototype.getCurColor = function() {
  return this.colorStack[this.colorStack.length-1] || [0.5, 0.5, 0.5, 1.0];
};

p5.Renderer3D.prototype.getCurShaderId = function(){
  var mId = shaderStack[shaderStack.length - 1];
  if(mId === undefined){
    //default shader: basicMaterial
    mId = 'normalVert|basicFrag';
    var gl = this.GL;
    var shaderProgram =
     this.initShaders('normalVert', 'basicFrag');
    shaderProgram.uMaterialColor = gl.getUniformLocation(
      shaderProgram, 'uMaterialColor' );
    var colors = this.getCurColor();
    gl.uniform4f( shaderProgram.uMaterialColor,
    colors[0], colors[1], colors[2], colors[3]);
    this.saveShaders(mId);
  }
  return mId;
};

p5.Renderer3D.prototype.resetStack = function(){
  shaderStack = [];
  //holding colors declaration, like [0, 120, 0]
  this.colorStack = [];
  //holding mode, like TIANGLE or 'LINES'
  this.modeStack = [];
  //holding 'fill' or 'stroke'
  this.drawModeStack = [];
  //holding an array of vertex position
  this.verticeStack = [];
  //holding lights
  this.lightStack = [];
};

//////////////////////////////////////////////
// HASH | for material and geometry
//////////////////////////////////////////////

/**
 * [initBuffer description]
 * @return {[type]} [description]
 */
p5.Renderer3D.prototype.initHash = function(){
  this.gHash = {};
  this.mHash = {};
};

/**
 * [geometryInHash description]
 * @param  {[type]} gId [description]
 * @return {[type]}     [description]
 */
p5.Renderer3D.prototype.geometryInHash = function(gId){
  return this.gHash[gId] !== undefined;
};

/**
 * [materialInHash description]
 * @param  {[type]} mId [description]
 * @return {[type]}     [description]
 */
p5.Renderer3D.prototype.materialInHash = function(mId){
  return this.mHash[mId] !== undefined;
};

//////////////////////////////////////////////
// MATRIX
//////////////////////////////////////////////

/**
 * [initMatrix description]
 * @return {[type]} [description]
 */
p5.Renderer3D.prototype.initMatrix = function(){
  this.uMVMatrix = new p5.Matrix();
  this.uPMatrix  = new p5.Matrix();
  this.uNMatrix = new p5.Matrix();
  var _w = this.width;
  var _h = this.height;
  this.uPMatrix.perspective(60 / 180 * Math.PI, _w / _h, 0.1, 100);
};

/**
 * resets the model view matrix to a mat4 identity
 * matrix.
 * @return {void}
 */
p5.Renderer3D.prototype.resetMatrix = function() {
  this.uMVMatrix = p5.Matrix.identity();
};

/**
 * [translate description]
 * @param  {[type]} x [description]
 * @param  {[type]} y [description]
 * @param  {[type]} z [description]
 * @return {[type]}   [description]
 * @todo implement handle for components or vector as args
 */
p5.Renderer3D.prototype.translate = function(x, y, z) {
  //@TODO: figure out how to fit the resolution
  x = x / RESOLUTION;
  y = -y / RESOLUTION;
  z = z / RESOLUTION;
  this.uMVMatrix.translate([x,y,z]);
  return this;
};

/**
 * Scales the Model View Matrix by a vector
 * @param  {Number} x [description]
 * @param  {Number} y [description]
 * @param  {Number} z [description]
 * @return {this}   [description]
 */
p5.Renderer3D.prototype.scale = function(x, y, z) {
  this.uMVMatrix.scale([x,y,z]);
  return this;
};

/**
 * [rotateX description]
 * @param  {[type]} rad [description]
 * @return {[type]}     [description]
 */
p5.Renderer3D.prototype.rotateX = function(rad) {
  this.uMVMatrix.rotateX(rad);
  return this;
};

/**
 * [rotateY description]
 * @param  {[type]} rad [description]
 * @return {[type]}     [description]
 */
p5.Renderer3D.prototype.rotateY = function(rad) {
  this.uMVMatrix.rotateY(rad);
  return this;
};

/**
 * [rotateZ description]
 * @param  {[type]} rad [description]
 * @return {[type]}     [description]
 */
p5.Renderer3D.prototype.rotateZ = function(rad) {
  this.uMVMatrix.rotateZ(rad);
  return this;
};

/**
 * pushes a copy of the model view matrix onto the
 * MV Matrix stack.
 * NOTE to self: could probably make this more readable
 * @return {[type]} [description]
 */
p5.Renderer3D.prototype.push = function() {
  uMVMatrixStack.push(this.uMVMatrix.copy());
};

/**
 * [pop description]
 * @return {[type]} [description]
 */
p5.Renderer3D.prototype.pop = function() {
  if (uMVMatrixStack.length === 0) {
    throw 'Invalid popMatrix!';
  }
  this.uMVMatrix = uMVMatrixStack.pop();
};

module.exports = p5.Renderer3D;