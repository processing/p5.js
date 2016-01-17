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
  var shaderKey = this._getCurShaderId();
  var shaderProgram = this.mHash[shaderKey];
  //vertex position Attribute
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
  this._setMatrixUniforms(shaderKey);
  //@todo implement in all shaders (not just immediateVert)
  //set our default point size
  // this._setUniform1f(shaderKey,
  //   'uPointSize',
  //   this.pointSize);
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
 * @method bezier
 * @param  {Number} x1 x-coordinate for the first anchor point
 * @param  {Number} y1 y-coordinate for the first anchor point
 * @param  {Number} z1 z-coordinate for the first anchor point
 * @param  {Number} x2 x-coordinate for the first control point
 * @param  {Number} y2 y-coordinate for the first control point
 * @param  {Number} z2 z-coordinate for the first control point
 * @param  {Number} x3 x-coordinate for the first anchor point
 * @param  {Number} y3 y-coordinate for the first anchor point
 * @param  {Number} z3 z-coordinate for the first anchor point
 * @param  {Number} x4 x-coordinate for the first control point
 * @param  {Number} y4 y-coordinate for the first control point
 * @param  {Number} z4 z-coordinate for the first control point
 * @return {p5.Renderer3D}   [description]
 * @example
 * <div>
 * <code>
 *background(0, 0, 0);
 *noFill();
 *stroke(255);
 *bezier(250,250,0, 100,100,0, 100,0,0, 0,100,0);
 * </code>
 * </div>
 */
//this implementation of bezier curve is based on Bernstein polynomial
p5.Renderer3D.prototype.bezier = function(args){
  var bezierDetail=args[12] || 20;//value of Bezier detail
  this.beginShape();
  var coeff=[0,0,0,0];//  Bernstein polynomial coeffecients
  var vertex=[0,0,0]; //(x,y,z) coordinates of points in bezier curve
  for(var i=0; i<=bezierDetail; i++){
    coeff[0]=Math.pow(1-(i/bezierDetail),3);
    coeff[1]=(3*(i/bezierDetail)) * (Math.pow(1-(i/bezierDetail),2));
    coeff[2]=(3*Math.pow(i/bezierDetail,2)) * (1-(i/bezierDetail));
    coeff[3]=Math.pow(i/bezierDetail,3);
    vertex[0]=args[0]*coeff[0] + args[3]*coeff[1] +
              args[6]*coeff[2] + args[9]*coeff[3];
    vertex[1]=args[1]*coeff[0] + args[4]*coeff[1] +
              args[7]*coeff[2] + args[10]*coeff[3];
    vertex[2]=args[2]*coeff[0] + args[5]*coeff[1] +
              args[8]*coeff[2] + args[11]*coeff[3];
    this.vertex(vertex[0],vertex[1],vertex[2]);
  }
  this.endShape();
  return this;
};


//////////////////////////////////////////////
//Curve
//////////////////////////////////////////////

/**
 * Draws a curved line on the screen between two points, given as the
 * middle four parameters. The first two parameters are a control point, as
 * if the curve came from this point even though it's not drawn. The last
 * two parameters similarly describe the other control point. <br /><br />
 * Longer curves can be created by putting a series of curve() functions
 * together or using curveVertex(). An additional function called
 * curveTightness() provides control for the visual quality of the curve.
 * The curve() function is an implementation of Catmull-Rom splines.
 *
 * @method curve
 * @param  {Number} x1 x-coordinate for the beginning control point
 * @param  {Number} y1 y-coordinate for the beginning control point
 * @param  {Number} z1 z-coordinate for the beginning control point
 * @param  {Number} x2 x-coordinate for the first point
 * @param  {Number} y2 y-coordinate for the first point
 * @param  {Number} z2 z-coordinate for the first point
 * @param  {Number} x3 x-coordinate for the second point
 * @param  {Number} y3 y-coordinate for the second point
 * @param  {Number} z3 z-coordinate for the second point
 * @param  {Number} x4 x-coordinate for the ending control point
 * @param  {Number} y4 y-coordinate for the ending control point
 * @param  {Number} z4 z-coordinate for the ending control point
 * @return {Object}    the p5 object
 * @example
 * <div>
 * <code>
 * noFill();
 * stroke(255, 102, 0);
 * curve(5,26,0, 5,26,0, 73,24,0, 73,61,0);
 * stroke(0);
 * curve(5,26,0, 73,24,0, 73,61,0, 15,65,0);
 * stroke(255, 102, 0);
 * curve(73,24,0, 73,61,0, 15,65,0, 15,65,0);
 * </code>
 * </div>
 */

p5.Renderer3D.prototype.curve=function(args){
  var curveDetail=args[12];
  this.beginShape();
  var coeff=[0,0,0,0];//coeffecients of the equation
  var vertex=[0,0,0]; //(x,y,z) coordinates of points in bezier curve
  for(var i=0; i<=curveDetail; i++){
    coeff[0]=Math.pow((i/curveDetail),3) * 0.5;
    coeff[1]=Math.pow((i/curveDetail),2) * 0.5;
    coeff[2]=(i/curveDetail) * 0.5;
    coeff[3]=0.5;
    vertex[0]=coeff[0]*(-args[0] + (3*args[3]) - (3*args[6]) +args[9]) +
              coeff[1]*((2*args[0]) - (5*args[3]) + (4*args[6]) - args[9]) +
              coeff[2]*(-args[0] + args[6]) +
              coeff[3]*(2*args[3]);
    vertex[1]=coeff[0]*(-args[1] + (3*args[4]) - (3*args[7]) +args[10]) +
              coeff[1]*((2*args[1]) - (5*args[4]) + (4*args[7]) - args[10]) +
              coeff[2]*(-args[1] + args[7]) +
              coeff[3]*(2*args[4]);
    vertex[2]=coeff[0]*(-args[2] + (3*args[5]) - (3*args[8]) +args[11]) +
              coeff[1]*((2*args[2]) - (5*args[5]) + (4*args[8]) - args[11]) +
              coeff[2]*(-args[2] + args[8]) +
              coeff[3]*(2*args[5]);
    this.vertex(vertex[0],vertex[1],vertex[2]);
  }
  this.endShape();
  return this;
};

module.exports = p5.Renderer3D;
