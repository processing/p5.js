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
  push.apply(im.vertexNormals, this._normal);
  push.apply(im.vertexAmbients, this._ambientColor);
  push.apply(im.vertexSpeculars, this._specularColor);
  push.apply(im.vertexEmissives, this._emissiveColor);
  im.vertexShininesses.push(this._specularPower);
  im.uvs.push(u, v);
};

/**
 * Sets the current normal vector. Used for drawing three dimensional
 * shapes and surfaces, normal() specifies a vector perpendicular to a
 * shape's surface which, in turn, determines how lighting affects it.
 * p5.js attempts to automatically assign normals to shapes,
 * but since that's imperfect, this is a better option when you want
 * more control. This function is identical to glNormal3f() in OpenGL.
 *
 * @method normal
 * @param {Number} x the normal's x-component
 * @param {Number} y the normal's y-component
 * @param {Number} z the normal's z-component
 * @chainable
 */
/**
 * @method normal
 * @param {p5.Vector|Number[]} vec the normal
 * @chainable
 */
p5.RendererGL.prototype.normal = function(x, y, z) {
  if (x instanceof p5.Vector) {
    z = x.z;
    y = x.y;
    x = x.x; // must be last
  } else if (Array.isArray(x)) {
    z = x[2] || 0;
    y = x[1] || 0;
    x = z[0] || 0; // must be last
  }
  var len = Math.sqrt(x * x + y * y + z * z);
  this._normal = [x / len, y / len, z / len];
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
  if (!this.isImmediateDrawing) {
    throw new Error('endShape called without matching beginShape');
  }

  var im = this.immediateMode;

  if (this._doFill || this._doStroke) {
    var gl = this.GL;
    var drawMode;

    if (this._doFill) {
      // determine the draw mode to use
      switch (this.shapeMode) {
        case constants.POINTS:
          drawMode = gl.POINTS;
          break;

        case constants.LINES:
          drawMode = null;
          break;

        case constants.TRIANGLES:
          drawMode = gl.TRIANGLES;
          break;

        default:
        case constants.TRIANGLE_FAN:
          drawMode = gl.TRIANGLE_FAN;
          break;

        case constants.TRIANGLE_STRIP:
          drawMode = gl.TRIANGLE_STRIP;
          break;

        case constants.QUADS:
        case constants.QUAD_STRIP:
          throw new Error(
            'sorry, ' + im.shapeMode + ' not yet implemented in webgl mode.'
          );
      }
    }

    var i;
    if (this._doStroke && !this._enableNormal) {
      // create the edges, based on the type of shape
      switch (this.shapeMode) {
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
            if (mode === constants.CLOSE) {
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

    // select the stroke shader
    var stroke = this.curStrokeShader;
    if (!stroke || !stroke.isStrokeShader()) {
      stroke = this._getLineShader();
    }
    // render the fill
    this._renderStroke(geometry, stroke);

    if (drawMode) {
      //select the fill shader
      var fill = this.curFillShader;
      if (this._enableNormal) {
        fill = this._getNormalShader();
      } else if (this._enableLighting) {
        if (!fill || !fill.isLightShader()) {
          fill = this._getImmediateLightShader();
        }
      } else {
        if (!fill /*|| !fill.isColorShader()*/) {
          fill = this._getImmediateFlatShader();
        }
      }

      // render the fill
      this._renderFill(geometry, fill, drawMode);
    }
  }

  // reset the immediate geometry
  im.reset();
  im.vertexAmbients.length = 0;
  im.vertexSpeculars.length = 0;
  im.vertexEmissives.length = 0;

  this.isImmediateDrawing = false;
};

module.exports = p5.RendererGL;
