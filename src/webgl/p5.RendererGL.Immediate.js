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
 *                       TRIANGLE_STRIP, TRIANGLE_FAN, QUADS, QUAD_STRIP,
 *                       and TESS(WEBGL only)
 * @chainable
 */
p5.RendererGL.prototype.beginShape = function(mode) {
  this.immediateMode.shapeMode =
    mode !== undefined ? mode : constants.TESS;
  this.immediateMode.geometry.reset();
  this.immediateMode.contourIndices = [];
  return this;
};

const immediateBufferStrides = {
  vertices: 1,
  vertexNormals: 1,
  vertexColors: 4,
  vertexStrokeColors: 4,
  uvs: 2
};

p5.RendererGL.prototype.beginContour = function() {
  if (this.immediateMode.shapeMode !== constants.TESS) {
    throw new Error('WebGL mode can only use contours with beginShape(TESS).');
  }
  this.immediateMode.contourIndices.push(
    this.immediateMode.geometry.vertices.length
  );
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
  // WebGL 1 doesn't support QUADS or QUAD_STRIP, so we duplicate data to turn
  // QUADS into TRIANGLES and QUAD_STRIP into TRIANGLE_STRIP. (There is no extra
  // work to convert QUAD_STRIP here, since the only difference is in how edges
  // are rendered.)
  if (this.immediateMode.shapeMode === constants.QUADS) {
    // A finished quad turned into triangles should leave 6 vertices in the
    // buffer:
    // 0--3     0   3--5
    // |  | --> | \  \ |
    // 1--2     1--2   4
    // When vertex index 3 is being added, add the necessary duplicates.
    if (this.immediateMode.geometry.vertices.length % 6 === 3) {
      for (const key in immediateBufferStrides) {
        const stride = immediateBufferStrides[key];
        const buffer = this.immediateMode.geometry[key];
        buffer.push(
          ...buffer.slice(
            buffer.length - 3 * stride,
            buffer.length - 2 * stride
          ),
          ...buffer.slice(buffer.length - stride, buffer.length)
        );
      }
    }
  }

  let z, u, v;

  // default to (x, y) mode: all other arguments assumed to be 0.
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
  this.immediateMode.geometry.vertexNormals.push(this._currentNormal);
  const vertexColor = this.curFillColor || [0.5, 0.5, 0.5, 1.0];
  this.immediateMode.geometry.vertexColors.push(
    vertexColor[0],
    vertexColor[1],
    vertexColor[2],
    vertexColor[3]
  );
  const lineVertexColor = this.curStrokeColor || [0.5, 0.5, 0.5, 1];
  this.immediateMode.geometry.vertexStrokeColors.push(
    lineVertexColor[0],
    lineVertexColor[1],
    lineVertexColor[2],
    lineVertexColor[3]
  );

  if (this.textureMode === constants.IMAGE && !this.isProcessingVertices) {
    if (this._tex !== null) {
      if (this._tex.width > 0 && this._tex.height > 0) {
        u /= this._tex.width;
        v /= this._tex.height;
      }
    } else if (
      this.userFillShader !== undefined ||
      this.userStrokeShader !== undefined ||
      this.userPointShader !== undefined
    ) {
    // Do nothing if user-defined shaders are present
    } else if (
      this._tex === null &&
      arguments.length >= 4
    ) {
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
 * Sets the normal to use for subsequent vertices.
 * @private
 * @method normal
 * @param  {Number} x
 * @param  {Number} y
 * @param  {Number} z
 * @chainable
 *
 * @method normal
 * @param  {Vector} v
 * @chainable
 */
p5.RendererGL.prototype.normal = function(xorv, y, z) {
  if (xorv instanceof p5.Vector) {
    this._currentNormal = xorv;
  } else {
    this._currentNormal = new p5.Vector(xorv, y, z);
  }

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
  shapeKind,
  count = 1
) {
  if (this.immediateMode.shapeMode === constants.POINTS) {
    this._drawPoints(
      this.immediateMode.geometry.vertices,
      this.immediateMode.buffers.point
    );
    return this;
  }
  // When we are drawing a shape then the shape mode is TESS,
  // but in case of triangle we can skip the breaking into small triangle
  // this can optimize performance by skipping the step of breaking it into triangles
  if (this.immediateMode.geometry.vertices.length === 3 &&
      this.immediateMode.shapeMode === constants.TESS
  ) {
    this.immediateMode.shapeMode === constants.TRIANGLES;
  }

  this.isProcessingVertices = true;
  this._processVertices(...arguments);
  this.isProcessingVertices = false;

  // LINE_STRIP and LINES are not used for rendering, instead
  // they only indicate a way to modify vertices during the _processVertices() step
  if (
    this.immediateMode.shapeMode === constants.LINE_STRIP ||
    this.immediateMode.shapeMode === constants.LINES
  ) {
    this.immediateMode.shapeMode = constants.TRIANGLE_FAN;
  }

  // WebGL doesn't support the QUADS and QUAD_STRIP modes, so we
  // need to convert them to a supported format. In `vertex()`, we reformat
  // the input data into the formats specified below.
  if (this.immediateMode.shapeMode === constants.QUADS) {
    this.immediateMode.shapeMode = constants.TRIANGLES;
  } else if (this.immediateMode.shapeMode === constants.QUAD_STRIP) {
    this.immediateMode.shapeMode = constants.TRIANGLE_STRIP;
  }

  if (this._doFill) {
    if (
      !this.geometryBuilder &&
      this.immediateMode.geometry.vertices.length >= 3
    ) {
      this._drawImmediateFill(count);
    }
  }
  if (this._doStroke) {
    if (
      !this.geometryBuilder &&
      this.immediateMode.geometry.lineVertices.length >= 1
    ) {
      this._drawImmediateStroke();
    }
  }

  if (this.geometryBuilder) {
    this.geometryBuilder.addImmediate();
  }

  this.isBezier = false;
  this.isQuadratic = false;
  this.isCurve = false;
  this.immediateMode._bezierVertex.length = 0;
  this.immediateMode._quadraticVertex.length = 0;
  this.immediateMode._curveVertex.length = 0;
  return this;
};

/**
 * Called from endShape(). This function calculates the stroke vertices for custom shapes and
 * tesselates shapes when applicable.
 * @private
 * @param  {Number} mode webgl primitives mode.  beginShape supports the
 *                       following modes:
 *                       POINTS,LINES,LINE_STRIP,LINE_LOOP,TRIANGLES,
 *                       TRIANGLE_STRIP, TRIANGLE_FAN and TESS(WEBGL only)
 */
p5.RendererGL.prototype._processVertices = function(mode) {
  if (this.immediateMode.geometry.vertices.length === 0) return;

  const calculateStroke = this._doStroke;
  const shouldClose = mode === constants.CLOSE;
  if (calculateStroke) {
    this.immediateMode.geometry.edges = this._calculateEdges(
      this.immediateMode.shapeMode,
      this.immediateMode.geometry.vertices,
      shouldClose
    );
    if (!this.geometryBuilder) {
      this.immediateMode.geometry._edgesToVertices();
    }
  }
  // For hollow shapes, user must set mode to TESS
  const convexShape = this.immediateMode.shapeMode === constants.TESS;
  // If the shape has a contour, we have to re-triangulate to cut out the
  // contour region
  const hasContour = this.immediateMode.contourIndices.length > 0;
  // We tesselate when drawing curves or convex shapes
  const shouldTess =
    this._doFill &&
    (
      this.isBezier ||
      this.isQuadratic ||
      this.isCurve ||
      convexShape ||
      hasContour
    ) &&
    this.immediateMode.shapeMode !== constants.LINES;

  if (shouldTess) {
    this._tesselateShape();
  }
};

/**
 * Called from _processVertices(). This function calculates the stroke vertices for custom shapes and
 * tesselates shapes when applicable.
 * @private
 * @returns  {Array[Number]} indices for custom shape vertices indicating edges.
 */
p5.RendererGL.prototype._calculateEdges = function(
  shapeMode,
  verts,
  shouldClose
) {
  const res = [];
  let i = 0;
  const contourIndices = this.immediateMode.contourIndices.slice();
  let contourStart = 0;
  switch (shapeMode) {
    case constants.TRIANGLE_STRIP:
      for (i = 0; i < verts.length - 2; i++) {
        res.push([i, i + 1]);
        res.push([i, i + 2]);
      }
      res.push([i, i + 1]);
      break;
    case constants.TRIANGLE_FAN:
      for (i = 1; i < verts.length - 1; i++) {
        res.push([0, i]);
        res.push([i, i + 1]);
      }
      res.push([0, verts.length - 1]);
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
    case constants.QUADS:
      // Quads have been broken up into two triangles by `vertex()`:
      // 0   3--5
      // | \  \ |
      // 1--2   4
      for (i = 0; i < verts.length - 5; i += 6) {
        res.push([i, i + 1]);
        res.push([i + 1, i + 2]);
        res.push([i + 3, i + 5]);
        res.push([i + 4, i + 5]);
      }
      break;
    case constants.QUAD_STRIP:
      // 0---2---4
      // |   |   |
      // 1---3---5
      for (i = 0; i < verts.length - 2; i += 2) {
        res.push([i, i + 1]);
        res.push([i, i + 2]);
        res.push([i + 1, i + 3]);
      }
      res.push([i, i + 1]);
      break;
    default:
      // TODO: handle contours in other modes too
      for (i = 0; i < verts.length; i++) {
        // Handle breaks between contours
        if (i + 1 < verts.length && i + 1 !== contourIndices[0]) {
          res.push([i, i + 1]);
        } else {
          if (shouldClose || contourStart) {
            res.push([i, contourStart]);
          }
          if (contourIndices.length > 0) {
            contourStart = contourIndices.shift();
          }
        }
      }
      break;
  }
  if (shapeMode !== constants.TESS && shouldClose) {
    res.push([verts.length - 1, 0]);
  }
  return res;
};

/**
 * Called from _processVertices() when applicable. This function tesselates immediateMode.geometry.
 * @private
 */
p5.RendererGL.prototype._tesselateShape = function() {
  // TODO: handle non-TESS shape modes that have contours
  this.immediateMode.shapeMode = constants.TRIANGLES;
  const contours = [[]];
  for (let i = 0; i < this.immediateMode.geometry.vertices.length; i++) {
    if (
      this.immediateMode.contourIndices.length > 0 &&
      this.immediateMode.contourIndices[0] === i
    ) {
      this.immediateMode.contourIndices.shift();
      contours.push([]);
    }
    contours[contours.length-1].push(
      this.immediateMode.geometry.vertices[i].x,
      this.immediateMode.geometry.vertices[i].y,
      this.immediateMode.geometry.vertices[i].z,
      this.immediateMode.geometry.uvs[i * 2],
      this.immediateMode.geometry.uvs[i * 2 + 1],
      this.immediateMode.geometry.vertexColors[i * 4],
      this.immediateMode.geometry.vertexColors[i * 4 + 1],
      this.immediateMode.geometry.vertexColors[i * 4 + 2],
      this.immediateMode.geometry.vertexColors[i * 4 + 3],
      this.immediateMode.geometry.vertexNormals[i].x,
      this.immediateMode.geometry.vertexNormals[i].y,
      this.immediateMode.geometry.vertexNormals[i].z
    );
  }
  const polyTriangles = this._triangulate(contours);
  const originalVertices = this.immediateMode.geometry.vertices;
  this.immediateMode.geometry.vertices = [];
  this.immediateMode.geometry.vertexNormals = [];
  this.immediateMode.geometry.uvs = [];
  const colors = [];
  for (
    let j = 0, polyTriLength = polyTriangles.length;
    j < polyTriLength;
    j = j + p5.RendererGL.prototype.tessyVertexSize
  ) {
    colors.push(...polyTriangles.slice(j + 5, j + 9));
    this.normal(...polyTriangles.slice(j + 9, j + 12));
    this.vertex(...polyTriangles.slice(j, j + 5));
  }
  if (this.geometryBuilder) {
    // Tesselating the face causes the indices of edge vertices to stop being
    // correct. When rendering, this is not a problem, since _edgesToVertices
    // will have been called before this, and edge vertex indices are no longer
    // needed. However, the geometry builder still needs this information, so
    // when one is active, we need to update the indices.
    //
    // We record index mappings in a Map so that once we have found a
    // corresponding vertex, we don't need to loop to find it again.
    const newIndex = new Map();
    this.immediateMode.geometry.edges =
      this.immediateMode.geometry.edges.map(edge => edge.map(origIdx => {
        if (!newIndex.has(origIdx)) {
          const orig = originalVertices[origIdx];
          let newVertIndex = this.immediateMode.geometry.vertices.findIndex(
            v =>
              orig.x === v.x &&
              orig.y === v.y &&
              orig.z === v.z
          );
          if (newVertIndex === -1) {
            // The tesselation process didn't output a vertex with the exact
            // coordinate as before, potentially due to numerical issues. This
            // doesn't happen often, but in this case, pick the closest point
            let closestDist = Infinity;
            let closestIndex = 0;
            for (
              let i = 0;
              i < this.immediateMode.geometry.vertices.length;
              i++
            ) {
              const vert = this.immediateMode.geometry.vertices[i];
              const dX = orig.x - vert.x;
              const dY = orig.y - vert.y;
              const dZ = orig.z - vert.z;
              const dist = dX*dX + dY*dY + dZ*dZ;
              if (dist < closestDist) {
                closestDist = dist;
                closestIndex = i;
              }
            }
            newVertIndex = closestIndex;
          }
          newIndex.set(origIdx, newVertIndex);
        }
        return newIndex.get(origIdx);
      }));
  }
  this.immediateMode.geometry.vertexColors = colors;
};

/**
 * Called from endShape(). Responsible for calculating normals, setting shader uniforms,
 * enabling all appropriate buffers, applying color blend, and drawing the fill geometry.
 * @private
 */
p5.RendererGL.prototype._drawImmediateFill = function(count = 1) {
  const gl = this.GL;
  this._useVertexColor = (this.immediateMode.geometry.vertexColors.length > 0);

  let shader;
  shader = this._getImmediateFillShader();

  this._setFillUniforms(shader);

  for (const buff of this.immediateMode.buffers.fill) {
    buff._prepareBuffer(this.immediateMode.geometry, shader);
  }
  shader.disableRemainingAttributes();

  this._applyColorBlend(this.curFillColor);

  if (count === 1) {
    gl.drawArrays(
      this.immediateMode.shapeMode,
      0,
      this.immediateMode.geometry.vertices.length
    );
  }
  else {
    try {
      gl.drawArraysInstanced(
        this.immediateMode.shapeMode,
        0,
        this.immediateMode.geometry.vertices.length,
        count
      );
    }
    catch (e) {
      console.log('🌸 p5.js says: Instancing is only supported in WebGL2 mode');
    }
  }
  shader.unbindShader();
};

/**
 * Called from endShape(). Responsible for calculating normals, setting shader uniforms,
 * enabling all appropriate buffers, applying color blend, and drawing the stroke geometry.
 * @private
 */
p5.RendererGL.prototype._drawImmediateStroke = function() {
  const gl = this.GL;

  this._useLineColor =
    (this.immediateMode.geometry.vertexStrokeColors.length > 0);

  const shader = this._getImmediateStrokeShader();
  this._setStrokeUniforms(shader);
  for (const buff of this.immediateMode.buffers.stroke) {
    buff._prepareBuffer(this.immediateMode.geometry, shader);
  }
  shader.disableRemainingAttributes();
  this._applyColorBlend(this.curStrokeColor);

  gl.drawArrays(
    gl.TRIANGLES,
    0,
    this.immediateMode.geometry.lineVertices.length / 3
  );
  shader.unbindShader();
};

export default p5.RendererGL;
