//Retained Mode. The default mode for rendering 3D primitives
//in WEBGL.
import p5 from '../core/main';
import './p5.RendererGL';
import './p5.RenderBuffer';

let hashCount = 0;
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

  //@TODO remove this limit on hashes in retainedMode.geometry
  hashCount++;
  if (hashCount > 1000) {
    const key = Object.keys(this.retainedMode.geometry)[0];
    delete this.retainedMode.geometry[key];
    hashCount--;
  }

  //create a new entry in our retainedMode.geometry
  return (this.retainedMode.geometry[gId] = {});
};

p5.RendererGL.prototype._freeBuffers = function(gId) {
  const buffers = this.retainedMode.geometry[gId];
  if (!buffers) {
    return;
  }

  delete this.retainedMode.geometry[gId];
  hashCount--;

  const gl = this.GL;
  if (buffers.indexBuffer) {
    gl.deleteBuffer(buffers.indexBuffer);
  }

  function freeBuffers(defs) {
    for (const def of defs) {
      if (buffers[def.dst]) {
        gl.deleteBuffer(buffers[def.dst]);
        buffers[def.dst] = null;
      }
    }
  }

  // free all the buffers
  freeBuffers(this.retainedMode.buffers.stroke);
  freeBuffers(this.retainedMode.buffers.fill);
};

/**
 * creates a buffers object that holds the WebGL render buffers
 * for a geometry.
 * @private
 * @param  {String} gId    key of the geometry object
 * @param  {p5.Geometry}  model contains geometry data
 */
p5.RendererGL.prototype.createBuffers = function(gId, model) {
  const gl = this.GL;
  //initialize the gl buffers for our geom groups
  const buffers = this._initBufferDefaults(gId);
  buffers.model = model;

  let indexBuffer = buffers.indexBuffer;

  if (model.faces.length) {
    // allocate space for faces
    if (!indexBuffer) indexBuffer = buffers.indexBuffer = gl.createBuffer();
    const vals = p5.RendererGL.prototype._flatten(model.faces);
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
  const gl = this.GL;
  const geometry = this.retainedMode.geometry[gId];

  if (this._doStroke && geometry.lineVertexCount > 0) {
    const strokeShader = this._getRetainedStrokeShader();
    this._setStrokeUniforms(strokeShader);
    for (const buff of this.retainedMode.buffers.stroke) {
      buff._prepareBuffer(geometry, strokeShader);
    }
    this._applyColorBlend(this.curStrokeColor);
    this._drawArrays(gl.TRIANGLES, gId);
    strokeShader.unbindShader();
  }

  if (this._doFill) {
    const fillShader = this._getRetainedFillShader();
    this._setFillUniforms(fillShader);
    for (const buff of this.retainedMode.buffers.fill) {
      buff._prepareBuffer(geometry, fillShader);
    }
    if (geometry.indexBuffer) {
      //vertex index buffer
      this._bindBuffer(geometry.indexBuffer, gl.ELEMENT_ARRAY_BUFFER);
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
  const uMVMatrix = this.uMVMatrix.copy();
  try {
    this.uMVMatrix.scale(scaleX, scaleY, scaleZ);
    this.drawBuffers(gId);
  } finally {
    this.uMVMatrix = uMVMatrix;
  }
};

p5.RendererGL.prototype._drawArrays = function(drawMode, gId) {
  this.GL.drawArrays(
    drawMode,
    0,
    this.retainedMode.geometry[gId].lineVertexCount
  );
  return this;
};

p5.RendererGL.prototype._drawElements = function(drawMode, gId) {
  const buffers = this.retainedMode.geometry[gId];
  const gl = this.GL;
  // render the fill
  if (buffers.indexBuffer) {
    // we're drawing faces
    gl.drawElements(gl.TRIANGLES, buffers.vertexCount, gl.UNSIGNED_SHORT, 0);
  } else {
    // drawing vertices
    gl.drawArrays(drawMode || gl.TRIANGLES, 0, buffers.vertexCount);
  }
};

p5.RendererGL.prototype._drawPoints = function(vertices, vertexBuffer) {
  const gl = this.GL;
  const pointShader = this._getImmediatePointShader();
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
};

export default p5.RendererGL;
