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
  //immediateMode vertices & buffers, create them now!
  if(this.immediateMode.vertexPositions === undefined){
    this.immediateMode.vertexPositions = [];
    this.immediateMode.vertexColors = [];
    this.immediateMode.uvCoords = [];
    this.immediateMode.vertexBuffer = this.GL.createBuffer();
    this.immediateMode.colorBuffer = this.GL.createBuffer();
    this.immediateMode.uvBuffer = this.GL.createBuffer();
  } else {
    this.immediateMode.vertexPositions.length = 0;
    this.immediateMode.vertexColors.length = 0;
    this.immediateMode.uvCoords.length = 0;
  }
  this.isImmediateDrawing = true;
  return this;
};
/**
 * adds a vertex to be drawn in a custom Shape.
 * @param  {Number} x x-coordinate of vertex
 * @param  {Number} y y-coordinate of vertex
 * @param  {Number} z z-coordinate of vertex
 * @return {p5.RendererGL}   [description]
 * @TODO implement handling of p5.Vector args
 */
p5.RendererGL.prototype.vertex = function(){
  var x, y, z, u, v;

  // default to (x, y) mode: all other arugments assumed to be 0.
  x = arguments[0];
  y = arguments[1];
  z = u = v = 0;

  if (arguments.length === 3) {
    // (x, y, z) mode: (u, v) assumed to be 0.
    z = arguments[2];
  } else if (arguments.length === 4) {
    // (x, y, u, v) mode: z assumed to be 0.
    u = arguments[2];
    v = arguments[3];
  } else if (arguments.length === 5) {
    // (x, y, z, u, v) mode
    z = arguments[2];
    u = arguments[3];
    v = arguments[4];
  }

  this.immediateMode.vertexPositions.push(x, y, z);
  var vertexColor = this.curFillColor || [0.5, 0.5, 0.5, 1.0];
  this.immediateMode.vertexColors.push(
    vertexColor[0],
    vertexColor[1],
    vertexColor[2],
    vertexColor[3]);

  this.immediateMode.uvCoords.push(u, v);

  return this;
};

/**
 * End shape drawing and render vertices to screen.
 * @return {p5.RendererGL} [description]
 */
p5.RendererGL.prototype.endShape =
function(mode, isCurve, isBezier,isQuadratic, isContour, shapeKind){

  var gl = this.GL;
  var shader = this.curShader;
  if (shader === this._getColorShader()) {
    // this is the fill/stroke shader for retain mode.
    // must switch to immediate mode shader before drawing!
    shader = this.setShader(this._getImmediateModeShader());

    // note that if we're using the texture shader...
    // this shouldn't change. :)
  }
  shader.bindShader();

  //vertex position Attribute
  var data = new Float32Array(this.immediateMode.vertexPositions);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.immediateMode.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
  shader.enableAttrib(shader.attributes.aPosition.location,
    3, gl.FLOAT, false, 0, 0);

  if (this.drawMode === 'fill') {
    data = new Float32Array(this.immediateMode.vertexColors);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.immediateMode.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
    shader.enableAttrib(shader.attributes.aVertexColor.location,
      4, gl.FLOAT, false, 0, 0);
  }

  if (this.drawMode === 'texture'){
    //texture coordinate Attribute
    data = new Float32Array(this.immediateMode.uvCoords);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.immediateMode.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
    shader.enableAttrib(shader.attributes.aTexCoord.location,
      2, gl.FLOAT, false, 0, 0);
  }

  if(mode){
    if(this.drawMode === 'fill' || this.drawMode ==='texture'){
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
      this.immediateMode.vertexPositions.length / 3);
  }
  //clear out our vertexPositions & colors arrays
  //after rendering
  this.immediateMode.vertexPositions.length = 0;
  this.immediateMode.vertexColors.length = 0;
  this.immediateMode.uvCoords.length = 0;
  this.isImmediateDrawing = false;

  // todo / optimizations? leave bound until another shader is set?
  shader.unbindShader();
  return this;
};


module.exports = p5.RendererGL;