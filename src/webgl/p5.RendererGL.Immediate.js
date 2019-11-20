/**
 * Welcome to RendererGL Immediate Mode.
 * Immediate mode is used for drawing custom shapes
 * from a set of vertices.  Immediate Mode is activated
 * when you call <a href="#/p5/beginShape">beginShape()</a> & de-activated when you call <a href="#/p5/endShape">endShape()</a>.
 * Immediate mode is a style of programming borrowed
 * from OpenGL's (now-deprecated) immediate mode.
 * It differs from p5.js' default, Retained Mode, which caches
 * geometries and buffers on the CPU to reduce the number of webgl
 * draw calls. Retained mode is more efficient & performative,
 * however, Immediate Mode is useful for sketching quick
 * geometric ideas.
 */
import p5 from '../core/main';
import * as constants from '../core/constants';
import './p5.RenderBuffer';

/**
 * Begin shape drawing.  This is a helpful way of generating
 * custom shapes quickly.  However in WEBGL mode, application
 * performance will likely drop as a result of too many calls to
 * <a href="#/p5/beginShape">beginShape()</a> / <a href="#/p5/endShape">endShape()</a>.  As a high performance alternative,
 * please use p5.js geometry primitives.
 * @private
 * @method beginShape
 * @param  {Number} mode webgl primitives mode.  beginShape supports the
 *                       following modes:
 *                       POINTS,LINES,LINE_STRIP,LINE_LOOP,TRIANGLES,
 *                       TRIANGLE_STRIP, TRIANGLE_FAN and TESS(WEBGL only)
 * @chainable
 */
p5.RendererGL.prototype.beginShape = function(mode) {
  this.immediateMode.shapeMode =
    mode !== undefined ? mode : constants.LINE_STRIP;
  this.immediateMode.geometry.reset();
  return this;
};

/**
 * adds a vertex to be drawn in a custom Shape.
 * @private
 * @method vertex
 * @param  {Number} x x-coordinate of vertex
 * @param  {Number} y y-coordinate of vertex
 * @param  {Number} z z-coordinate of vertex
 * @chainable
 * @TODO implement handling of <a href="#/p5.Vector">p5.Vector</a> args
 */
p5.RendererGL.prototype.vertex = function(x, y) {
  let z, u, v;

  // default to (x, y) mode: all other arugments assumed to be 0.
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
  const vert = new p5.Vector(x, y, z);
  this.immediateMode.geometry.vertices.push(vert);
  const vertexColor = this.curFillColor || [0.5, 0.5, 0.5, 1.0];
  this.immediateMode.geometry.vertexColors.push(
    vertexColor[0],
    vertexColor[1],
    vertexColor[2],
    vertexColor[3]
  );

  if (this.textureMode === constants.IMAGE) {
    if (this._tex !== null) {
      if (this._tex.width > 0 && this._tex.height > 0) {
        u /= this._tex.width;
        v /= this._tex.height;
      }
    } else if (this._tex === null && arguments.length >= 4) {
      // Only throw this warning if custom uv's have  been provided
      console.warn(
        'You must first call texture() before using' +
          ' vertex() with image based u and v coordinates'
      );
    }
  }

  this.immediateMode.geometry.uvs.push(u, v);

  this.immediateMode._bezierVertex[0] = x;
  this.immediateMode._bezierVertex[1] = y;
  this.immediateMode._bezierVertex[2] = z;

  this.immediateMode._quadraticVertex[0] = x;
  this.immediateMode._quadraticVertex[1] = y;
  this.immediateMode._quadraticVertex[2] = z;

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
  if (this.immediateMode.shapeMode === constants.POINTS) {
    this._drawPoints(
      this.immediateMode.geometry.vertices,
      this.immediateMode.buffers.point
    );
    return this;
  }
  this._processVertices(...arguments);
  if (this.immediateMode.geometry.vertices.length > 1) {
    this._drawImmediateFill();
    this._drawImmediateStroke();
  }
  this.isBezier = false;
  this.isQuadratic = false;
  this.isCurve = false;
  this.immediateMode._bezierVertex.length = 0;
  this.immediateMode._quadraticVertex.length = 0;
  this.immediateMode._curveVertex.length = 0;
  return this;
};

p5.RendererGL.prototype._processVertices = function(mode) {
  if (this.immediateMode.geometry.vertices.length === 0) return;

  const calculateStroke = this._doStroke && this.drawMode !== constants.TEXTURE;
  const shouldClose = mode === constants.CLOSE;
  if (calculateStroke) {
    this.immediateMode.geometry.edges = this._calculateEdges(
      this.immediateMode.shapeMode,
      this.immediateMode.geometry.vertices,
      shouldClose
    );
    this.immediateMode.geometry._edgesToVertices();
  }
  // For hollow shapes, user must set mode to TESS
  const convexShape = this.immediateMode.shapeMode === constants.TESS;
  // We tesselate when drawing curves or convex shapes
  const shouldTess =
    (this.isBezier || this.isQuadratic || this.isCurve || convexShape) &&
    this.immediateMode.shapeMode !== constants.LINES;

  if (shouldTess) {
    this._tesselateShape();
  }
};

p5.RendererGL.prototype._calculateEdges = function(
  shapeMode,
  verts,
  shouldClose
) {
  const res = [];
  let i = 0;
  switch (shapeMode) {
    case constants.TRIANGLE_STRIP:
      for (i = 0; i < verts - 2; i++) {
        res.push([i, i + 1]);
        res.push([i, i + 2]);
      }
      res.push([i, i + 1]);
      break;
    case constants.TRIANGLES:
      for (i = 0; i < verts.length - 2; i = i + 3) {
        res.push([i, i + 1]);
        res.push([i + 1, i + 2]);
        res.push([i + 2, i]);
      }
      break;
    case constants.LINES:
      for (i = 0; i < verts.length - 1; i = i + 2) {
        res.push([i, i + 1]);
      }
      break;
    default:
      for (i = 0; i < verts.length - 1; i++) {
        res.push([i, i + 1]);
      }
      break;
  }
  if (shouldClose) {
    res.push([verts.length - 1, 0]);
  }
  return res;
};

p5.RendererGL.prototype._tesselateShape = function() {
  this.immediateMode.shapeMode = constants.TRIANGLES;
  const contours = [
    new Float32Array(this._vToNArray(this.immediateMode.geometry.vertices))
  ];
  const polyTriangles = this._triangulate(contours);
  this.immediateMode.geometry.vertices = [];
  for (
    let j = 0, polyTriLength = polyTriangles.length;
    j < polyTriLength;
    j = j + 3
  ) {
    this.vertex(polyTriangles[j], polyTriangles[j + 1], polyTriangles[j + 2]);
  }
};

p5.RendererGL.prototype._drawImmediateFill = function() {
  const gl = this.GL;
  const shader = this._getImmediateFillShader();

  this._calculateNormals(shader, this.immediateMode.geometry);
  this._setFillUniforms(shader);

  for (const buff of this.immediateMode.buffers.fill) {
    buff._prepareBuffer(this.immediateMode.geometry, shader);
  }

  if (this.drawMode === constants.FILL || this.drawMode === constants.TEXTURE) {
    switch (this.immediateMode.shapeMode) {
      case constants.LINE_STRIP:
      case constants.LINES:
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

  this._applyColorBlend(this.curFillColor);
  gl.drawArrays(
    this.immediateMode.shapeMode,
    0,
    this.immediateMode.geometry.vertices.length
  );

  shader.unbindShader();
};

p5.RendererGL.prototype._drawImmediateStroke = function() {
  const gl = this.GL;
  const shader = this._getImmediateStrokeShader();
  this._setStrokeUniforms(shader);
  for (const buff of this.immediateMode.buffers.stroke) {
    buff._prepareBuffer(this.immediateMode.geometry, shader);
  }
  this._applyColorBlend(this.curStrokeColor);
  gl.drawArrays(
    gl.TRIANGLES,
    0,
    this.immediateMode.geometry.lineVertices.length
  );
  shader.unbindShader();
};

p5.RendererGL.prototype._calculateNormals = function(shader, geometry) {
  if (geometry.vertices % 3 !== 0) {
    return;
  }
  if (shader.attributes['aNormal']) {
    geometry.computeFaces().computerNormals();
  }
};

export default p5.RendererGL;
