//Retained Mode. The default mode for rendering 3D primitives
//in WEBGL.
'use strict';

import p5 from '../core/main';
import './p5.RendererGL';

// a render buffer definition
function BufferDef(size, src, dst, attr, map) {
  this.size = size; // the number of FLOATs in each vertex
  this.src = src; // the name of the model's source array
  this.dst = dst; // the name of the geometry's buffer
  this.attr = attr; // the name of the vertex attribute
  this.map = map; // optional, a transformation function to apply to src
}

var _flatten = p5.RendererGL.prototype._flatten;
var _vToNArray = p5.RendererGL.prototype._vToNArray;

var strokeBuffers = [
  new BufferDef(3, 'lineVertices', 'lineVertexBuffer', 'aPosition', _flatten),
  new BufferDef(4, 'lineNormals', 'lineNormalBuffer', 'aDirection', _flatten)
];

var fillBuffers = [
  new BufferDef(3, 'vertices', 'vertexBuffer', 'aPosition', _vToNArray),
  new BufferDef(3, 'vertexNormals', 'normalBuffer', 'aNormal', _vToNArray),
  new BufferDef(4, 'vertexColors', 'colorBuffer', 'aMaterialColor'),
  new BufferDef(3, 'vertexAmbients', 'ambientBuffer', 'aAmbientColor'),
  //new BufferDef(3, 'vertexSpeculars', 'specularBuffer', 'aSpecularColor'),
  new BufferDef(2, 'uvs', 'uvBuffer', 'aTexCoord', _flatten)
];

p5.RendererGL._textBuffers = [
  new BufferDef(3, 'vertices', 'vertexBuffer', 'aPosition', _vToNArray),
  new BufferDef(2, 'uvs', 'uvBuffer', 'aTexCoord', _flatten)
];

var hashCount = 0;
/**
 * _initBufferDefaults
 * @private
 * @description initializes buffer defaults. runs each time a new geometry is
 * registered
 * @param  {String} gId  key of the geometry object
 * @returns {Object} a new buffer object
 */
p5.RendererGL.prototype._initBufferDefaults = function(gId) {
  this._freeBuffers(gId);

  //@TODO remove this limit on hashes in gHash
  hashCount++;
  if (hashCount > 1000) {
    var key = Object.keys(this.gHash)[0];
    delete this.gHash[key];
    hashCount--;
  }

  //create a new entry in our gHash
  return (this.gHash[gId] = {});
};

p5.RendererGL.prototype._freeBuffers = function(gId) {
  var buffers = this.gHash[gId];
  if (!buffers) {
    return;
  }

  delete this.gHash[gId];
  hashCount--;

  var gl = this.GL;
  if (buffers.indexBuffer) {
    gl.deleteBuffer(buffers.indexBuffer);
  }

  function freeBuffers(defs) {
    for (var i = 0; i < defs.length; i++) {
      var def = defs[i];
      if (buffers[def.dst]) {
        gl.deleteBuffer(buffers[def.dst]);
        buffers[def.dst] = null;
      }
    }
  }

  // free all the buffers
  freeBuffers(strokeBuffers);
  freeBuffers(fillBuffers);
};

p5.RendererGL.prototype._prepareBuffers = function(buffers, shader, defs) {
  var model = buffers.model;
  var attributes = shader.attributes;
  var gl = this.GL;

  // loop through each of the buffer definitions
  for (var i = 0; i < defs.length; i++) {
    var def = defs[i];

    var attr = attributes[def.attr];
    if (!attr) continue;

    var buffer = buffers[def.dst];

    // check if the model has the appropriate source array
    var src = model[def.src];
    if (src) {
      // check if we need to create the GL buffer
      var createBuffer = !buffer;
      if (createBuffer) {
        // create and remember the buffer
        buffers[def.dst] = buffer = gl.createBuffer();
      }
      // bind the buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

      // check if we need to fill the buffer with data
      if (createBuffer || model.dirtyFlags[def.src] !== false) {
        var map = def.map;
        // get the values from the model, possibly transformed
        var values = map ? map(src) : src;

        // fill the buffer with the values
        this._bindBuffer(buffer, gl.ARRAY_BUFFER, values);

        // mark the model's source array as clean
        model.dirtyFlags[def.src] = false;
      }
      // enable the attribute
      shader.enableAttrib(attr, def.size);
    } else {
      if (buffer) {
        // remove the unused buffer
        gl.deleteBuffer(buffer);
        buffers[def.dst] = null;
      }
      // disable the vertex
      gl.disableVertexAttribArray(attr.index);
    }
  }
};

/**
 * creates a buffers object that holds the WebGL render buffers
 * for a geometry.
 * @private
 * @param  {String} gId    key of the geometry object
 * @param  {p5.Geometry}  model contains geometry data
 */
p5.RendererGL.prototype.createBuffers = function(gId, model) {
  var gl = this.GL;
  //initialize the gl buffers for our geom groups
  var buffers = this._initBufferDefaults(gId);
  buffers.model = model;

  var indexBuffer = buffers.indexBuffer;

  if (model.faces.length) {
    // allocate space for faces
    if (!indexBuffer) indexBuffer = buffers.indexBuffer = gl.createBuffer();
    var vals = p5.RendererGL.prototype._flatten(model.faces);
    this._bindBuffer(indexBuffer, gl.ELEMENT_ARRAY_BUFFER, vals, Uint16Array);

    // the vertex count is based on the number of faces
    buffers.vertexCount = model.faces.length * 3;
  } else {
    // the index buffer is unused, remove it
    if (indexBuffer) {
      gl.deleteBuffer(indexBuffer);
      buffers.indexBuffer = null;
    }
    // the vertex count comes directly from the model
    buffers.vertexCount = model.vertices ? model.vertices.length : 0;
  }

  buffers.lineVertexCount = model.lineVertices ? model.lineVertices.length : 0;

  return buffers;
};

/**
 * Draws buffers given a geometry key ID
 * @private
 * @param  {String} gId     ID in our geom hash
 * @chainable
 */
p5.RendererGL.prototype.drawBuffers = function(gId) {
  var gl = this.GL;
  var buffers = this.gHash[gId];

  if (this._doStroke && buffers.lineVertexCount > 0) {
    var strokeShader = this._getRetainedStrokeShader();
    this._setStrokeUniforms(strokeShader);
    this._prepareBuffers(buffers, strokeShader, strokeBuffers);
    this._applyColorBlend(this.curStrokeColor);
    this._drawArrays(gl.TRIANGLES, gId);
    strokeShader.unbindShader();
  }

  if (this._doFill) {
    var fillShader = this._getRetainedFillShader();
    this._setFillUniforms(fillShader);
    this._prepareBuffers(buffers, fillShader, fillBuffers);
    if (buffers.indexBuffer) {
      //vertex index buffer
      this._bindBuffer(buffers.indexBuffer, gl.ELEMENT_ARRAY_BUFFER);
    }
    this._applyColorBlend(this.curFillColor);
    this._drawElements(gl.TRIANGLES, gId);
    fillShader.unbindShader();
  }
  return this;
};

/**
 * Calls drawBuffers() with a scaled model/view matrix.
 *
 * This is used by various 3d primitive methods (in primitives.js, eg. plane,
 * box, torus, etc...) to allow caching of un-scaled geometries. Those
 * geometries are generally created with unit-length dimensions, cached as
 * such, and then scaled appropriately in this method prior to rendering.
 *
 * @private
 * @method drawBuffersScaled
 * @param {String} gId     ID in our geom hash
 * @param {Number} scaleX  the amount to scale in the X direction
 * @param {Number} scaleY  the amount to scale in the Y direction
 * @param {Number} scaleZ  the amount to scale in the Z direction
 */
p5.RendererGL.prototype.drawBuffersScaled = function(
  gId,
  scaleX,
  scaleY,
  scaleZ
) {
  var uMVMatrix = this.uMVMatrix.copy();
  try {
    this.uMVMatrix.scale(scaleX, scaleY, scaleZ);
    this.drawBuffers(gId);
  } finally {
    this.uMVMatrix = uMVMatrix;
  }
};

p5.RendererGL.prototype._drawArrays = function(drawMode, gId) {
  this.GL.drawArrays(drawMode, 0, this.gHash[gId].lineVertexCount);
  this._pixelsState._pixelsDirty = true;
  return this;
};

p5.RendererGL.prototype._drawElements = function(drawMode, gId) {
  var buffers = this.gHash[gId];
  var gl = this.GL;
  // render the fill
  if (buffers.indexBuffer) {
    // we're drawing faces
    gl.drawElements(gl.TRIANGLES, buffers.vertexCount, gl.UNSIGNED_SHORT, 0);
  } else {
    // drawing vertices
    gl.drawArrays(drawMode || gl.TRIANGLES, 0, buffers.vertexCount);
  }
  this._pixelsState._pixelsDirty = true;
};

p5.RendererGL.prototype._drawPoints = function(vertices, vertexBuffer) {
  var gl = this.GL;
  var pointShader = this._getImmediatePointShader();
  this._setPointUniforms(pointShader);

  this._bindBuffer(
    vertexBuffer,
    gl.ARRAY_BUFFER,
    this._vToNArray(vertices),
    Float32Array,
    gl.STATIC_DRAW
  );

  pointShader.enableAttrib(pointShader.attributes.aPosition, 3);

  gl.drawArrays(gl.Points, 0, vertices.length);

  pointShader.unbindShader();
  this._pixelsState._pixelsDirty = true;
};

export default p5.RendererGL;
