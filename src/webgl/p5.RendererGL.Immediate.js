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
 * @method beginShape
 * @param  {Number} mode webgl primitives mode.  beginShape supports the
 *                       following modes:
 *                       POINTS,LINES,LINE_STRIP,LINE_LOOP,TRIANGLES,
 *                       TRIANGLE_STRIP,and TRIANGLE_FAN.
 * @chainable
 */
p5.RendererGL.prototype.beginShape = function(mode) {
  //default shape mode is line_strip
  this.immediateMode.shapeMode =
    mode !== undefined ? mode : constants.LINE_STRIP;
  //if we haven't yet initialized our
  //immediateMode vertices & buffers, create them now!
  if (this.immediateMode.vertices === undefined) {
    this.immediateMode.vertices = [];
    this.immediateMode.edges = [];
    this.immediateMode.lineVertices = [];
    this.immediateMode.vertexColors = [];
    this.immediateMode.lineNormals = [];
    this.immediateMode.uvCoords = [];
    this.immediateMode.vertexBuffer = this.GL.createBuffer();
    this.immediateMode.colorBuffer = this.GL.createBuffer();
    this.immediateMode.uvBuffer = this.GL.createBuffer();
    this.immediateMode.lineVertexBuffer = this.GL.createBuffer();
    this.immediateMode.lineNormalBuffer = this.GL.createBuffer();
  } else {
    this.immediateMode.vertices.length = 0;
    this.immediateMode.edges.length = 0;
    this.immediateMode.lineVertices.length = 0;
    this.immediateMode.lineNormals.length = 0;
    this.immediateMode.vertexColors.length = 0;
    this.immediateMode.uvCoords.length = 0;
  }
  this.isImmediateDrawing = true;
  return this;
};
/**
 * adds a vertex to be drawn in a custom Shape.
 * @method vertex
 * @param  {Number} x x-coordinate of vertex
 * @param  {Number} y y-coordinate of vertex
 * @param  {Number} z z-coordinate of vertex
 * @chainable
 * @TODO implement handling of p5.Vector args
 */
p5.RendererGL.prototype.vertex = function() {
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
  var vert = new p5.Vector(x, y, z);
  this.immediateMode.vertices.push(vert);
  var vertexColor = this.curFillColor || [0.5, 0.5, 0.5, 1.0];
  this.immediateMode.vertexColors.push(
    vertexColor[0],
    vertexColor[1],
    vertexColor[2],
    vertexColor[3]
  );

  this.immediateMode.uvCoords.push(u, v);

  return this;
};

/**
 * End shape drawing and render vertices to screen.
 * @chainable
 */
p5.RendererGL.prototype.endShape = function(
  mode,
  isCurve,
  isBezier,
  isQuadratic,
  isContour,
  shapeKind
) {
  this._useImmediateModeShader();

  if (this.curStrokeShader.active === true) {
    for (var i = 0; i < this.immediateMode.vertices.length - 1; i++) {
      this.immediateMode.edges.push([i, i + 1]);
    }
    if (mode === constants.CLOSE) {
      this.immediateMode.edges.push([
        this.immediateMode.vertices.length - 1,
        0
      ]);
    }

    this._edgesToVertices(this.immediateMode);
    this._drawStrokeImmediateMode();
  }
  if (this.curFillShader.active === true) {
    this._drawFillImmediateMode(
      mode,
      isCurve,
      isBezier,
      isQuadratic,
      isContour,
      shapeKind
    );
  }
  //clear out our vertexPositions & colors arrays
  //after rendering
  this.immediateMode.vertices.length = 0;
  this.immediateMode.vertexColors.length = 0;
  this.immediateMode.uvCoords.length = 0;
  this.isImmediateDrawing = false;

  return this;
};

p5.RendererGL.prototype._drawFillImmediateMode = function(
  mode,
  isCurve,
  isBezier,
  isQuadratic,
  isContour,
  shapeKind
) {
  var gl = this.GL;
  this.curFillShader.bindShader();

  // initialize the fill shader's 'aPosition' buffer
  if (this.curFillShader.attributes.aPosition) {
    //vertex position Attribute
    this._bindBuffer(
      this.immediateMode.vertexBuffer,
      gl.ARRAY_BUFFER,
      this._vToNArray(this.immediateMode.vertices),
      Float32Array,
      gl.DYNAMIC_DRAW
    );

    this.curFillShader.enableAttrib(
      this.curFillShader.attributes.aPosition.location,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  // initialize the fill shader's 'aVertexColor' buffer
  if (
    this.drawMode === constants.FILL &&
    this.curFillShader.attributes.aVertexColor
  ) {
    this._bindBuffer(
      this.immediateMode.colorBuffer,
      gl.ARRAY_BUFFER,
      this.immediateMode.vertexColors,
      Float32Array,
      gl.DYNAMIC_DRAW
    );

    this.curFillShader.enableAttrib(
      this.curFillShader.attributes.aVertexColor.location,
      4,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  // initialize the fill shader's 'aTexCoord' buffer
  if (
    this.drawMode === constants.TEXTURE &&
    this.curFillShader.attributes.aTexCoord
  ) {
    //texture coordinate Attribute
    this._bindBuffer(
      this.immediateMode.uvBuffer,
      gl.ARRAY_BUFFER,
      this.immediateMode.uvCoords,
      Float32Array,
      gl.DYNAMIC_DRAW
    );

    this.curFillShader.enableAttrib(
      this.curFillShader.attributes.aTexCoord.location,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  //if (true || mode) {
  if (this.drawMode === constants.FILL || this.drawMode === constants.TEXTURE) {
    switch (this.immediateMode.shapeMode) {
      case constants.LINE_STRIP:
      case constants.LINES:
      case constants.TRIANGLES:
        this.immediateMode.shapeMode = constants.TRIANGLE_FAN;
        break;
    }
  } else {
    switch (this.immediateMode.shapeMode) {
      case constants.LINE_STRIP:
      case constants.LINES:
        this.immediateMode.shapeMode = constants.LINE_LOOP;
        break;
    }
  }
  //}
  //QUADS & QUAD_STRIP are not supported primitives modes
  //in webgl.
  if (
    this.immediateMode.shapeMode === constants.QUADS ||
    this.immediateMode.shapeMode === constants.QUAD_STRIP
  ) {
    throw new Error(
      'sorry, ' +
        this.immediateMode.shapeMode +
        ' not yet implemented in webgl mode.'
    );
  } else {
    gl.enable(gl.BLEND);
    gl.drawArrays(
      this.immediateMode.shapeMode,
      0,
      this.immediateMode.vertices.length
    );
  }
  // todo / optimizations? leave bound until another shader is set?
  this.curFillShader.unbindShader();
};

p5.RendererGL.prototype._drawStrokeImmediateMode = function() {
  var gl = this.GL;
  this.curStrokeShader.bindShader();

  // initialize the stroke shader's 'aPosition' buffer
  if (this.curStrokeShader.attributes.aPosition) {
    this._bindBuffer(
      this.immediateMode.lineVertexBuffer,
      gl.ARRAY_BUFFER,
      this._flatten(this.immediateMode.lineVertices),
      Float32Array,
      gl.STATIC_DRAW
    );

    this.curStrokeShader.enableAttrib(
      this.curStrokeShader.attributes.aPosition.location,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  // initialize the stroke shader's 'aDirection' buffer
  if (this.curStrokeShader.attributes.aDirection) {
    this._bindBuffer(
      this.immediateMode.lineNormalBuffer,
      gl.ARRAY_BUFFER,
      this._flatten(this.immediateMode.lineNormals),
      Float32Array,
      gl.STATIC_DRAW
    );
    this.curStrokeShader.enableAttrib(
      this.curStrokeShader.attributes.aDirection.location,
      4,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  gl.drawArrays(gl.TRIANGLES, 0, this.immediateMode.lineVertices.length);

  // todo / optimizations? leave bound until another shader is set?
  this.curStrokeShader.unbindShader();
};

module.exports = p5.RendererGL;
