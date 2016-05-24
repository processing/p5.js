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
p5.RendererGL.prototype.beginShape = function(mode){
  //default shape mode is line_strip
  this.immediateMode.shapeMode = (mode !== undefined ) ?
    mode : constants.LINE_STRIP;
  //if we haven't yet initialized our
  //immediateMode buffers, create them now!
  if(this.immediateMode.vertexBuffer === undefined){
    this.immediateMode.vertexBuffer = this.GL.createBuffer();
    this.immediateMode.strokeColorBuffer = this.GL.createBuffer();
    this.immediateMode.fillColorBuffer = this.GL.createBuffer();

  }
  this.isImmediateDrawing = true;
  return this;
};

/**
 * End shape drawing and render vertices to screen.
 * @return {p5.RendererGL} [description]
 */
p5.RendererGL.prototype.endShape = function
  (mode,
  vertices,
  isCurve,
  isBezier,
  isQuadratic,
  sContour,
  shapeKind){
  var gl = this.GL;
  var vertPositions = [];
  var vertStrokeCols = [];
  var vertFillCols = [];
  for (var i = 0; i < vertices.length; i++) {
    //splice x,y,z components into vertPositions arr
    vertPositions.push(
      vertices[i][0],
      vertices[i][1],
      vertices[i][2]);
    vertStrokeCols.push(
      vertices[i][vertices.length-1][0],
      vertices[i][vertices.length-1][1],
      vertices[i][vertices.length-1][2],
      vertices[i][vertices.length-1][3]
      );
    vertFillCols.push(
      vertices[i][vertices.length-2][0],
      vertices[i][vertices.length-2][1],
      vertices[i][vertices.length-2][2],
      vertices[i][vertices.length-2][3]
      );
  }
  this._bindImmediateBuffers(
    vertPositions,
    vertStrokeCols,
    vertFillCols);
  if(mode){
    //@todo this is error prone because calls to stroke
    //will result in this.drawMode === 'stroke'.
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
    gl.enable(gl.BLEND);
    gl.drawArrays(this.immediateMode.shapeMode, 0,
      vertPositions.length / 3);
  }
  this.isImmediateDrawing = false;
  return this;
};
/**
 * Bind immediateMode buffers to data,
 * then draw gl arrays
 * @param  {Array} vertices Numbers array representing
 *                          vertex positions
 * @return {p5.RendererGL}
 */
p5.RendererGL.prototype._bindImmediateBuffers =
function(vertices, strokeColors, fillColors){
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

  shaderProgram.vertexStrokeColorAttribute =
    gl.getAttribLocation(shaderProgram, 'aVertexStrokeColor');
  gl.enableVertexAttribArray(shaderProgram.vertexStrokeColorAttribute);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.immediateMode.strokeColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(strokeColors),gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(shaderProgram.vertexStrokeColorAttribute,
    4, gl.FLOAT, false, 0, 0);

  shaderProgram.vertexFillColorAttribute =
    gl.getAttribLocation(shaderProgram, 'aVertexFillColor');
  gl.enableVertexAttribArray(shaderProgram.vertexFillColorAttribute);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.immediateMode.fillColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(fillColors),gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(shaderProgram.vertexFillColorAttribute,
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

p5.RendererGL.prototype._getColorVertexShader = function(){
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

module.exports = p5.RendererGL;