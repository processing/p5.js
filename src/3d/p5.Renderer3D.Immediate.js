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

var bezierDetail = 30;


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
    this.immediateMode.vertexColors = [];
    this.immediateMode.vertexBuffer = this.GL.createBuffer();
    this.immediateMode.colorBuffer = this.GL.createBuffer();
  } else {
    this.immediateMode.vertexPositions.length = 0;
    this.immediateMode.vertexColors.length = 0;
  }
  this.isImmediateDrawing = true;
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
  var vertexColor = this.curColor || [0.5, 0.5, 0.5, 1.0];
  this.immediateMode.vertexColors.push(
    vertexColor[0],
    vertexColor[1],
    vertexColor[2],
    vertexColor[3]);
  return this;
};

/**
 * End shape drawing and render vertices to screen.
 * @return {p5.Renderer3D} [description]
 */
p5.Renderer3D.prototype.endShape =
function(mode, isCurve, isBezier,isQuadratic, isContour, shapeKind){
  var gl = this.GL;
  this._bindImmediateBuffers(
    this.immediateMode.vertexPositions,
    this.immediateMode.vertexColors);
  if(mode){
    if(this.drawMode === 'fill'){
      switch(this.immediateMode.shapeMode){
        case constants.LINE_STRIP:
          this.immediateMode.shapeMode = constants.TRIANGLE_FAN;
          break;
        case constants.LINES:
          this.immediateMode.shapeMode = constants.TRIANGLE_FAN;
          break;
        case constants.TRIANGLES:
          this.immediateMode.shapeMode = constants.TRIANGLE_FAN;
          break;
      }
    } else {
      switch(this.immediateMode.shapeMode){
        case constants.LINE_STRIP:
          this.immediateMode.shapeMode = constants.LINE_LOOP;
          break;
        case constants.LINES:
          this.immediateMode.shapeMode = constants.LINE_LOOP;
          break;
      }
    }
  }
  //QUADS & QUAD_STRIP are not supported primitives modes
  //in webgl.
  if(this.immediateMode.shapeMode === constants.QUADS ||
    this.immediateMode.shapeMode === constants.QUAD_STRIP){
    throw new Error('sorry, ' + this.immediateMode.shapeMode+
      ' not yet implemented in webgl mode.');
  }
  else {
    gl.drawArrays(this.immediateMode.shapeMode, 0,
      this.immediateMode.vertexPositions.length / 3);
  }
  //clear out our vertexPositions & colors arrays
  //after rendering
  this.immediateMode.vertexPositions.length = 0;
  this.immediateMode.vertexColors.length = 0;
  this.isImmediateDrawing = false;
  return this;
};
/**
 * Bind immediateMode buffers to data,
 * then draw gl arrays
 * @param  {Array} vertices Numbers array representing
 *                          vertex positions
 * @return {p5.Renderer3D}
 */
p5.Renderer3D.prototype._bindImmediateBuffers = function(vertices, colors){
  this._setDefaultCamera();
  var gl = this.GL;
  var shaderProgram = this._getColorVertexShader();
  //vertex position Attribute
  //@todo this is messy.
  shaderProgram.vertexPositionAttribute =
    gl.getAttribLocation(shaderProgram, 'aPosition');
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.immediateMode.vertexBuffer);

  gl.bufferData(
    gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
    3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.immediateMode.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
    4, gl.FLOAT, false, 0, 0);
  //matrix
  var mId = 'immediateVert|vertexColorFrag';
  this._setMatrixUniforms(mId);
  //set our default point size
  this._setUniform1f(mId,
    'uPointSize',
    this.pointSize);
  return this;
};

//////////////////////////////////////////////
// COLOR
//////////////////////////////////////////////

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

//////////////////////////////////////////////
//Bezier
//////////////////////////////////////////////

/**
 * adds a vertex to be drawn in a custom Shape.
 * @method bezier
 * @param  {Number} x1 x-coordinate for the first anchor point
 * @param  {Number} y1 y-coordinate for the first anchor point
 * @param  {Number} x2 x-coordinate for the first control point
 * @param  {Number} y2 y-coordinate for the first control point
 * @param  {Number} x3 x-coordinate for the second control point
 * @param  {Number} y3 y-coordinate for the second control point
 * @param  {Number} x4 x-coordinate for the second anchor point
 * @param  {Number} y4 y-coordinate for the second anchor point
 * @return {p5.Renderer3D}   [description]
 * @TODO implement bezier in 3D
 * @example
 * <div>
 * <code>
 *background(0, 0, 0);
 *noFill();
 *stroke(255);
 *bezier(250,250,0, 100, 100,0,100,0,0, 0,100,0);
 * </code>
 * </div>
 */
//this implementation of bezier curve is based on Bernstein polynomial
p5.prototype.bezier = function(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4) {
  this.beginShape();
  var coeff=[0,0,0,0];//  Bernstein polynomial coeffecients
  var x=[0,0,0]; //(x,y,z) coordinates of points in bezier curve
  for(var i=0; i<=bezierDetail; i++){
    coeff[0]=Math.pow(1-(i/bezierDetail),3);
    coeff[1]=(3*(i/bezierDetail)) * (Math.pow(1-(i/bezierDetail),2));
    coeff[2]=(3*Math.pow(i/bezierDetail,2)) * (1-(i/bezierDetail));
    coeff[3]=Math.pow(i/bezierDetail,3);
    x[0]=x1*coeff[0] + x2*coeff[1] + x3*coeff[2] + x4*coeff[3];
    x[1]=y1*coeff[0] + y2*coeff[1] + y3*coeff[2] + y4*coeff[3];
    x[2]=z1*coeff[0] + z2*coeff[1] + z3*coeff[2] + z4*coeff[3];
    this.vertex(x[0],x[1],x[2]);
  }
  this.endShape();
  return this;
};

module.exports = p5.Renderer3D;
