/**
 * Welcome to RendererGL Immediate Mode.
 * Immediate mode is used for drawing custom shapes
 * from a set of vertices.  Immediate Mode is activated
 * when you call beginShape() & de-activated when you call endShape().
 * Immediate mode is a style of programming borrowed
 * from OpenGL's (now-deprecated) immediate mode.
 * It differs from p5.js' default, Retained Mode, which caches
 * geometries and buffers on the CPU to reduce the number of webgl
 * draw calls. Retained mode is more efficient & performative,
 * however, Immediate Mode is useful for sketching quick
 * geometric ideas.
 */
'use strict';

var p5 = require('../core/core');
var constants = require('../core/constants');

/**
 * Begin shape drawing.  This is a helpful way of generating
 * custom shapes quickly.  However in WEBGL mode, application
 * performance will likely drop as a result of too many calls to
 * beginShape() / endShape().  As a high performance alternative,
 * please use p5.js geometry primitives.
 * @param  {Number} mode webgl primitives mode.  beginShape supports the
 *                       following modes:
 *                       POINTS,LINES,LINE_STRIP,LINE_LOOP,TRIANGLES,
 *                       TRIANGLE_STRIP,and TRIANGLE_FAN.
 * @return {[type]}      [description]
 */
p5.Renderer3D.prototype.beginShape = function(mode){
  //default shape mode is line_strip
  this.immediateMode.shapeMode = (mode !== undefined ) ?
    mode : constants.LINE_STRIP;
  //if we haven't yet initialized our
  //immediateMode vertices & buffers, create them now!
  if(this.immediateMode.vertexPositions === undefined){
    this.immediateMode.vertexPositions = [];
    this.immediateMode.vertexBuffer = this.GL.createBuffer();
    this.immediateMode.colorBuffer = this.GL.createBuffer();
  } else {
    this.immediateMode.vertexPositions.length = 0;
  }
  return this;
};
/**
 * adds a vertex to be drawn in a custom Shape.
 * @param  {Number} x x-coordinate of vertex
 * @param  {Number} y y-coordinate of vertex
 * @param  {Number} z z-coordinate of vertex
 * @return {p5.Renderer3D}   [description]
 * @TODO implement handling of p5.Vector args
 */
p5.Renderer3D.prototype.vertex = function(x, y, z){
  this.immediateMode.vertexPositions.push(x, y, z);
  return this;
};

/**
 * End shape drawing and render vertices to screen.
 * @return {p5.Renderer3D} [description]
 */
p5.Renderer3D.prototype.endShape = function(){
  var gl = this.GL;
  this._bindImmediateBuffers(this.immediateMode.vertexPositions);
  //QUADS & QUAD_STRIP are not supported primitives modes
  //in webgl.
  if(this.immediateMode.shapeMode === constants.QUADS ||
    this.immediateMode.shapeMode === constants.QUAD_STRIP){
    throw new Error('sorry, ' + this.immediateMode.shapeMode+
      ' not yet implemented in webgl mode.');
  } else {
    gl.drawArrays(this.immediateMode.shapeMode, 0,
      this.immediateMode.vertexPositions.length / 3);
  }
  //clear out our vertexPositions array
  //after rendering
  this.immediateMode.vertexPositions.length = 0;
  return this;
};
/**
 * Bind immediateMode buffers to data,
 * then draw gl arrays
 * @param  {Array} vertices Numbers array representing
 *                          vertex positions
 * @return {p5.Renderer3D}
 */
p5.Renderer3D.prototype._bindImmediateBuffers = function(vertices){
  this._setDefaultCamera();
  var gl = this.GL;
  var shaderProgram = this._getColorVertexShader();

  gl.bindBuffer(gl.ARRAY_BUFFER, this.immediateMode.vertexBuffer);

  gl.bufferData(
    gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
    3, gl.FLOAT, false, 0, 0);

  var vertexColorBuffer = this.immediateMode.colorBuffer;
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);

  var color = this.curColor || [0.5, 0.5, 0.5, 1.0];
  var colors = [];
  for(var i = 0; i < vertices.length / 3; i++){
    colors = colors.concat(color);
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
    4, gl.FLOAT, false, 0, 0);
  //matrix
  var mId = 'immediateVert|vertexColorFrag';
  this._setMatrixUniforms(mId);
  return this;
};
//@TODO
p5.Renderer3D.prototype._strokeCheck = function(){
  if(this.drawMode === 'stroke'){
    throw new Error(
      'stroke for shapes in 3D not yet implemented, use fill for now :('
    );
  }
};
//@TODO
p5.Renderer3D.prototype.strokeWeight = function() {
  throw new Error('strokeWeight for 3d not yet implemented');
};

//////////////////////////////////////////////
// COLOR
//////////////////////////////////////////////
p5.Renderer3D.prototype.stroke = function(r, g, b, a) {
  var color = this._pInst.color.apply(this._pInst, arguments);
  var colorNormalized = color._normalize();
  this.curColor = colorNormalized;
  this.drawMode = 'stroke';
  return this;
};

p5.Renderer3D.prototype._getColorVertexShader = function(){
  var gl = this.GL;
  var mId = 'immediateVert|vertexColorFrag';
  var shaderProgram;

  if(!this.materialInHash(mId)){
    shaderProgram =
      this._initShaders('immediateVert', 'vertexColorFrag', true);
    this.mHash[mId] = shaderProgram;
    shaderProgram.vertexColorAttribute =
    gl.getAttribLocation(shaderProgram, 'aVertexColor');
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
  }else{
    shaderProgram = this.mHash[mId];
  }
  return shaderProgram;
};

module.exports = p5.Renderer3D;