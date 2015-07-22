'use strict';

var p5 = require('../core/core');
var shaders = require('./shaders');
require('../core/p5.Renderer');
require('./p5.Matrix');
var gl;
var uMVMatrixStack = [];
var shaderStack = [];

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
      throw 'Error creating webgl context';
    } else {
      console.log('p5.Renderer3D: enabled webgl context');
    }
  } catch (er) {
    console.error(er);
  }

  this.isP3D = true; //lets us know we're in 3d mode
  gl = this.drawingContext;
  gl.clearColor(1.0, 1.0, 1.0, 1.0); //background is initialized white
  gl.clearDepth(1);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  //create our default matrices
  this.initHash();
  this.initMatrix();
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
 * @param  {[type]} h [description]
 * @return {[type]}   [description]
 */
p5.Renderer3D.prototype.resize = function(w,h) {
  p5.Renderer.prototype.resize.call(this, w,h);
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
};

//////////////////////////////////////////////
// COLOR | Setting
//////////////////////////////////////////////

/**
 * [background description]
 * @return {[type]} [description]
 */
p5.Renderer3D.prototype.background = function() {
  var _col = this._pInst.color.apply(this._pInst, arguments);
  // gl.clearColor(0.0,0.0,0.0,1.0);
  var _r = (_col.color_array[0]) / 255;
  var _g = (_col.color_array[1]) / 255;
  var _b = (_col.color_array[2]) / 255;
  var _a = (_col.color_array[3]) / 255;
  gl.clearColor(_r, _g, _b, _a);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  this.resetMatrix();
  this.emptyShaderStack();
};

//@TODO implement this
// p5.Renderer3D.prototype.clear = function() {
//@TODO
// };

//@TODO implement this
// p5.Renderer3D.prototype.fill = function() {
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
p5.Renderer3D.prototype.initShaders = function(vertId, fragId) {
  //set up our default shaders by:
  // 1. create the shader,
  // 2. load the shader source,
  // 3. compile the shader
  var _vertShader = gl.createShader(gl.VERTEX_SHADER);
  //load in our default vertex shader
  gl.shaderSource(_vertShader, shaders[vertId]);
  gl.compileShader(_vertShader);
  // if our vertex shader failed compilation?
  if (!gl.getShaderParameter(_vertShader, gl.COMPILE_STATUS)) {
    alert('Yikes! An error occurred compiling the shaders:' +
      gl.getShaderInfoLog(_vertShader));
    return null;
  }

  var _fragShader = gl.createShader(gl.FRAGMENT_SHADER);
  //load in our material frag shader
  gl.shaderSource(_fragShader, shaders[fragId]);
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

  // var vertexResolution =
  // gl.getUniformLocation(shaderProgram, 'u_resolution');
  // @TODO replace 4th argument with far plane once we implement
  // a view frustrum

  //vertex position Attribute
  shaderProgram.vertexPositionAttribute =
    gl.getAttribLocation(shaderProgram, 'position');
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  //vertex normal Attribute
  shaderProgram.vertexNormalAttribute =
    gl.getAttribLocation(shaderProgram, 'normal');
  gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

  //projection Matrix uniform
  shaderProgram.uPMatrixUniform =
    gl.getUniformLocation(shaderProgram, 'transformMatrix');
  //model view Matrix uniform
  shaderProgram.uMVMatrixUniform =
    gl.getUniformLocation(shaderProgram, 'modelviewMatrix');

  //normal Matrix uniform
  shaderProgram.uNMatrixUniform =
  gl.getUniformLocation(shaderProgram, 'normalMatrix');

  this.mHash[vertId + '|' + fragId] = shaderProgram;

  return shaderProgram;
};

/**
 * [saveShaders description]
 * @return {[type]} [description]
 */
p5.Renderer3D.prototype.saveShaders = function(mId){
  shaderStack.push(mId);
};

/**
 * [emptyShaderStack description]
 * @return {[type]} [description]
 */
p5.Renderer3D.prototype.emptyShaderStack = function(){
  shaderStack = [];
};

/**
 * [getCurShader description]
 * @return {[type]} [description]
 */
p5.Renderer3D.prototype.getCurShaderKey = function(){
  var key = shaderStack[shaderStack.length - 1];
  if(key === undefined){
    //@TODO: make a default shader
    key = 'normalVert|normalFrag';
    this.initShaders('normalVert', 'normalFrag');
    this.saveShaders(key);
  }
  return key;
};

//////////////////////////////////////////////
// HASH | Stroing geometriy and materil info
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
// BUFFER | deal with gl buffer
//////////////////////////////////////////////

/**
 * [initBuffer description]
 * @param  {String} gId    key of the geometry object
 * @param  {Object} obj    an object containing geometry information
 */
p5.Renderer3D.prototype.initBuffer = function(gId, obj) {

  this.gHash[gId] = {};
  this.gHash[gId].len = obj.len;
  this.gHash[gId].vertexBuffer = gl.createBuffer();
  this.gHash[gId].normalBuffer = gl.createBuffer();
  this.gHash[gId].indexBuffer = gl.createBuffer();

  var shaderProgram = this.mHash[this.getCurShaderKey()];

  gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].vertexBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER, new Float32Array(obj.vertices), gl.STATIC_DRAW);
  gl.vertexAttribPointer(
    shaderProgram.vertexPositionAttribute,
    3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].normalBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER, new Float32Array(obj.vertexNormals), gl.STATIC_DRAW);
  gl.vertexAttribPointer(
    shaderProgram.vertexNormalAttribute,
    3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.gHash[gId].indexBuffer);
  gl.bufferData
   (gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(obj.faces), gl.STATIC_DRAW);
};

/**
 * [drawBuffer description]
 * @param  {String} gId     key of the geometery object
 */
p5.Renderer3D.prototype.drawBuffer = function(gId) {

  var shaderKey = this.getCurShaderKey();
  var shaderProgram = this.mHash[shaderKey];

  gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].vertexBuffer);
  gl.vertexAttribPointer(
    shaderProgram.vertexPositionAttribute,
    3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.gHash[gId].normalBuffer);
  gl.vertexAttribPointer(
    shaderProgram.vertexNormalAttribute,
    3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.gHash[gId].indexBuffer);

  this.setMatrixUniforms(shaderKey);

  gl.drawElements(
    gl.TRIANGLES, this.gHash[gId].len,
     gl.UNSIGNED_SHORT, 0);
};

/**
 * Sets the Matrix Uniforms inside our default shader.
 * @param {String} shaderKey key of current shader
 */
p5.Renderer3D.prototype.setMatrixUniforms = function(shaderKey) {

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
  x = x / 100;
  y = -y / 100;
  z = z / 100;
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

/**
 * [orbitControl description]
 * @return {[type]} [description]
 */
//@TODO: fix this fake orbitControl
p5.prototype.orbitControl = function(){
  if(this.mouseIsPressed){
    this.rotateX((this.mouseX - this.width / 2) / (this.width / 2));
    this.rotateY((this.mouseY - this.height / 2) / (this.width / 2));
  }
  return this;
};

/**
 * PRIVATE
 */
// matrix methods adapted from:
// https://developer.mozilla.org/en-US/docs/Web/WebGL/
// gluPerspective
//
// function _makePerspective(fovy, aspect, znear, zfar){
//    var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
//    var ymin = -ymax;
//    var xmin = ymin * aspect;
//    var xmax = ymax * aspect;
//    return _makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
//  }

////
//// glFrustum
////
//function _makeFrustum(left, right, bottom, top, znear, zfar){
//  var X = 2*znear/(right-left);
//  var Y = 2*znear/(top-bottom);
//  var A = (right+left)/(right-left);
//  var B = (top+bottom)/(top-bottom);
//  var C = -(zfar+znear)/(zfar-znear);
//  var D = -2*zfar*znear/(zfar-znear);
//  var frustrumMatrix =[
//  X, 0, A, 0,
//  0, Y, B, 0,
//  0, 0, C, D,
//  0, 0, -1, 0
//];
//return frustrumMatrix;
// }

// function _setMVPMatrices(){
////an identity matrix
////@TODO use the p5.Matrix class to abstract away our MV matrices and
///other math
//var _mvMatrix =
//[
//  1.0,0.0,0.0,0.0,
//  0.0,1.0,0.0,0.0,
//  0.0,0.0,1.0,0.0,
//  0.0,0.0,0.0,1.0
//];

module.exports = p5.Renderer3D;