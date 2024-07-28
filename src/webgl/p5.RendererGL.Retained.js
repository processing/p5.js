//Retained Mode. The default mode for rendering 3D primitives
//in WEBGL.
import p5 from '../core/main';
import './p5.RendererGL';
import './p5.RenderBuffer';
import * as constants from '../core/constants';

/**
 * @param {p5.Geometry} geometry The model whose resources will be freed
 */
p5.RendererGL.prototype.freeGeometry = function(geometry) {
  if (!geometry.gid) {
    console.warn('The model you passed to freeGeometry does not have an id!');
    return;
  }
  this._freeBuffers(geometry.gid);
};

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
  if (Object.keys(this.retainedMode.geometry).length > 1000) {
    const key = Object.keys(this.retainedMode.geometry)[0];
    this._freeBuffers(key);
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

    // If any face references a vertex with an index greater than the maximum
    // un-singed 16 bit integer, then we need to use a Uint32Array instead of a
    // Uint16Array
    const hasVertexIndicesOverMaxUInt16 = vals.some(v => v > 65535);
    let type = hasVertexIndicesOverMaxUInt16 ? Uint32Array : Uint16Array;
    this._bindBuffer(indexBuffer, gl.ELEMENT_ARRAY_BUFFER, vals, type);

    // If we're using a Uint32Array for our indexBuffer we will need to pass a
    // different enum value to WebGL draw triangles. This happens in
    // the _drawElements function.
    buffers.indexBufferType = hasVertexIndicesOverMaxUInt16
      ? gl.UNSIGNED_INT
      : gl.UNSIGNED_SHORT;

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

  buffers.lineVertexCount = model.lineVertices
    ? model.lineVertices.length / 3
    : 0;

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

  if (
    !this.geometryBuilder &&
    this._doFill &&
    this.retainedMode.geometry[gId].vertexCount > 0
  ) {
    this._useVertexColor = (geometry.model.vertexColors.length > 0);
    const fillShader = this._getRetainedFillShader();
    this._setFillUniforms(fillShader);
    for (const buff of this.retainedMode.buffers.fill) {
      buff._prepareBuffer(geometry, fillShader);
    }
    fillShader.disableRemainingAttributes();
    if (geometry.indexBuffer) {
      //vertex index buffer
      this._bindBuffer(geometry.indexBuffer, gl.ELEMENT_ARRAY_BUFFER);
    }
    this._applyColorBlend(
      this.curFillColor,
      geometry.model.hasFillTransparency()
    );
    this._drawElements(gl.TRIANGLES, gId);
    fillShader.unbindShader();
  }

  if (!this.geometryBuilder && this._doStroke && geometry.lineVertexCount > 0) {
    this._useLineColor = (geometry.model.vertexStrokeColors.length > 0);
    const strokeShader = this._getRetainedStrokeShader();
    this._setStrokeUniforms(strokeShader);
    for (const buff of this.retainedMode.buffers.stroke) {
      buff._prepareBuffer(geometry, strokeShader);
    }
    strokeShader.disableRemainingAttributes();
    this._applyColorBlend(
      this.curStrokeColor,
      geometry.model.hasStrokeTransparency()
    );
    this._drawArrays(gl.TRIANGLES, gId);
    strokeShader.unbindShader();
  }

  if (this.geometryBuilder) {
    this.geometryBuilder.addRetained(geometry);
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
  let originalModelMatrix = this.uModelMatrix.copy();
  try {
    this.uModelMatrix.scale(scaleX, scaleY, scaleZ);

    this.drawBuffers(gId);
  } finally {

    this.uModelMatrix = originalModelMatrix;
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
    // If this model is using a Uint32Array we need to ensure the
    // OES_element_index_uint WebGL extension is enabled.
    if (
      this._pInst.webglVersion !== constants.WEBGL2 &&
      buffers.indexBufferType === gl.UNSIGNED_INT
    ) {
      if (!gl.getExtension('OES_element_index_uint')) {
        throw new Error(
          'Unable to render a 3d model with > 65535 triangles. Your web browser does not support the WebGL Extension OES_element_index_uint.'
        );
      }
    }
    // we're drawing faces
    gl.drawElements(
      gl.TRIANGLES,
      buffers.vertexCount,
      buffers.indexBufferType,
      0
    );
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

  this._applyColorBlend(this.curStrokeColor);

  gl.drawArrays(gl.Points, 0, vertices.length);

  pointShader.unbindShader();
};

export default p5.RendererGL;
