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
 * @private
 * @method beginShape
 * @param  {Number} mode webgl primitives mode.  beginShape supports the
 *                       following modes:
 *                       POINTS,LINES,LINE_STRIP,LINE_LOOP,TRIANGLES,
 *                       TRIANGLE_STRIP,and TRIANGLE_FAN.
 * @chainable
 */
p5.RendererGL.prototype.beginShape = function(mode) {
  if (this.isImmediateDrawing) {
    throw new Error('beginShape called twice in a row');
  }

  //default shape mode is line_strip
  this.shapeMode = mode !== undefined ? mode : constants.LINE_STRIP;

  this.isImmediateDrawing = true;
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
 * @TODO implement handling of p5.Vector args
 */
p5.RendererGL.prototype.vertex = function(x, y) {
  var z, u, v;

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

  var im = this.immediateMode;
  var push = Array.prototype.push;
  im.vertices.push(new p5.Vector(x, y, z));
  push.apply(im.vertexColors, this._diffuseColor);
  push.apply(im.vertexAmbients, this._ambientColor);
  im.uvs.push(u, v);
};

var dms = {};
if (typeof WebGLRenderingContext !== 'undefined') {
  dms[constants.POINTS] = WebGLRenderingContext.POINTS;
  dms[constants.LINES] = null;
  dms[constants.TRIANGLES] = WebGLRenderingContext.TRIANGLES;
  dms[constants.TRIANGLE_FAN] = WebGLRenderingContext.TRIANGLE_FAN;
  dms[constants.TRIANGLE_STRIP] = WebGLRenderingContext.TRIANGLE_STRIP;
  dms[constants.QUADS] = 'QUADS not yet implemented in webgl mode.';
  dms[constants.QUAD_STRIP] = 'QUAD_STRIP not yet implemented in webgl mode.';
}

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
  if (!this.isImmediateDrawing) {
    throw new Error('endShape called without matching beginShape');
  }

  var im = this.immediateMode;

  if (this._doFill || this._doStroke) {
    var gl = this.GL;
    var shapeMode = this.shapeMode;

    var close = mode === constants.CLOSE;
    if (close) {
      if (shapeMode === constants.TRIANGLE_FAN) {
        im._duplicateVertex(1);
      } else if (shapeMode === constants.TRIANGLE_FAN) {
        im._duplicateVertex(0);
      }
    }

    var i, drawMode, fillShader;
    if (this._doFill) {
      // determine the draw mode to use

      var vertices = im.vertices;
      var normals = im.vertexNormals;

      drawMode = dms[shapeMode];
      if (typeof drawMode === 'undefined') drawMode = gl.TRIANGLE_FAN;
      else if (typeof drawMode === 'string') throw new Error(drawMode);

      if (drawMode) {
        fillShader = this._getImmediateFillShader();
        fillShader.init(); // so we can check the aNormal attribute:

        if (fillShader.attributes.aNormal) {
          var pn, pc, n;

          switch (shapeMode) {
            case constants.TRIANGLES:
              for (i = 0; i < vertices.length - 2; i += 3) {
                n = im._computeNormal(i, i + 1, i + 2);
                normals.push(n, n, n);
              }
              break;

            default:
            case constants.TRIANGLE_FAN:
              pn = im._computeNormal(0, 1, 2);
              pc = pn.copy();
              normals.push(pc); // center vertex

              normals.push(pn);
              for (i = 1; i < vertices.length - 1; i += 1) {
                n = im._computeNormal(0, i, i + 1).add(pn);
                n.normalize();
                normals.push(n);
                pc.add(n);
                pn = n;
              }
              normals.push(p5.Vector.add(vertices[1], pn).normalize());
              pc.normalize();
              break;

            case constants.TRIANGLE_STRIP:
              pn = im._computeNormal(0, 1, 2);
              normals.push(pn);
              for (i = 1; i < vertices.length - 1; i += 2) {
                n = im._computeNormal(i, i + 2, i + 1).add(pn);
                n.normalize();
                normals.push(n, n);
                pn = n;
              }
              normals.push(pn);
              break;
          }
        }
      }
    }

    if (this._doStroke && !this._useNormalMaterial) {
      // create the edges, based on the type of shape
      switch (shapeMode) {
        case constants.POINTS:
          // TODO:
          break;

        case constants.LINES:
          for (i = 0; i < im.vertices.length - 1; i += 2) {
            im.edges.push([i, i + 1]);
          }
          break;

        case constants.TRIANGLES:
          for (i = 0; i < im.vertices.length - 2; i += 3) {
            im.edges.push([i, i + 1], [i + 1, i + 2], [i + 2, i]);
          }
          break;

        case constants.TRIANGLE_FAN:
          for (i = 1; i < im.vertices.length - 1; i += 1) {
            im.edges.push([0, i], [i, i + 1]);
          }
          im.edges.push([im.vertices.length - 1, 0]);
          break;

        case constants.TRIANGLE_STRIP:
          for (i = 0; i < im.vertices.length - 2; i += 1) {
            im.edges.push([i, i + 1], [i, i + 2]);
          }
          im.edges.push([im.vertices.length - 2, im.vertices.length - 1]);
          break;

        default:
          for (i = 0; i < im.vertices.length - 1; i++) {
            im.edges.push([i, i + 1]);
          }
          if (this.drawMode !== constants.TEXTURE) {
            if (close) {
              im.edges.push([im.vertices.length - 1, 0]);
            }
          }
          break;
      }

      im._edgesToVertices();
    }

    this._setDefaultCamera();

    this.createBuffers('immediate', im);
    var geometry = this.gHash['immediate'];

    if (this._doStroke && !this._useNormalMaterial) {
      // render the stroke
      this._renderStroke(geometry, this._getImmediateStrokeShader());
    }

    if (drawMode && fillShader) {
      // render the fill
      this._renderFill(geometry, fillShader, drawMode);
    }
  }

  // reset the immediate geometry
  im.reset();
  im.vertexAmbients.length = 0;
  //im.vertexSpeculars.length = 0;

  this.isImmediateDrawing = false;
};

module.exports = p5.RendererGL;
