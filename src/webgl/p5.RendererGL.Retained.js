//Retained Mode. The default mode for rendering 3D primitives
//in WEBGL.
import * as constants from '../core/constants';
import { RendererGL } from './p5.RendererGL';
import { RenderBuffer } from './p5.RenderBuffer';

function rendererGLRetained(p5, fn){
  /**
   * @param {p5.Geometry} geometry The model whose resources will be freed
   */
  RendererGL.prototype.freeGeometry = function(geometry) {
    if (!geometry.gid) {
      console.warn('The model you passed to freeGeometry does not have an id!');
      return;
    }
    this._freeBuffers(geometry.gid);
  };

  RendererGL.prototype._freeBuffers = function(gid) {
    const buffers = this.geometryBufferCache[gid];
    if (!buffers) {
      return;
    }

    delete this.geometryBufferCache[gid];

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
    freeBuffers(this.buffers.stroke);
    freeBuffers(this.buffers.fill);
    freeBuffers(this.buffers.user);
  };

  /**
   * Creates a buffers object that holds the WebGL render buffers
   * for a geometry.
   * @private
   * @param  {p5.Geometry}  model contains geometry data
   */
  RendererGL.prototype.createBuffers = function(model) {
    const gl = this.GL;

    const gid = model.gid;
    if (!gid) {
      throw new Error('The p5.Geometry you passed in has no gid property!');
    }

    //initialize the gl buffers for our geom groups
    this._freeBuffers(gid);

    //@TODO remove this limit on hashes in geometryBufferCache
    if (Object.keys(this.geometryBufferCache).length > 1000) {
      const key = Object.keys(this.geometryBufferCache)[0];
      this._freeBuffers(key);
    }

    //create a new entry in our geometryBufferCache
    const buffers = {};
    this.geometryBufferCache[gid] = buffers;

    buffers.model = model;

    let indexBuffer = buffers.indexBuffer;

    if (model.faces.length) {
      // allocate space for faces
      if (!indexBuffer) indexBuffer = buffers.indexBuffer = gl.createBuffer();
      const vals = RendererGL.prototype._flatten(model.faces);

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
      // TODO: delete?
      // the vertex count comes directly from the model
      buffers.vertexCount = model.vertices ? model.vertices.length : 0;
    }

    // TODO: delete?
    buffers.lineVertexCount = model.lineVertices
      ? model.lineVertices.length / 3
      : 0;

    for (const propName in model.userVertexProperties) {
      const prop = model.userVertexProperties[propName];
      this.buffers.user.push(
        new RenderBuffer(prop.getDataSize(), prop.getSrcName(), prop.getDstName(), prop.getName(), this)
      );
    }
    return buffers;
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
   * @param {String} gid     ID in our geom hash
   * @param {Number} scaleX  the amount to scale in the X direction
   * @param {Number} scaleY  the amount to scale in the Y direction
   * @param {Number} scaleZ  the amount to scale in the Z direction
   */
  RendererGL.prototype.drawBuffersScaled = function(
    model,
    scaleX,
    scaleY,
    scaleZ
  ) {
    let originalModelMatrix = this.states.uModelMatrix.copy();
    try {
      this.states.uModelMatrix.scale(scaleX, scaleY, scaleZ);

      if (this.geometryBuilder) {
        this.geometryBuilder.addRetained(model);
      } else {
        this._drawGeometry(model);
      }
    } finally {

      this.states.uModelMatrix = originalModelMatrix;
    }
  };

  RendererGL.prototype._drawPoints = function(vertices, vertexBuffer) {
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

    this._applyColorBlend(this.states.curStrokeColor);

    gl.drawArrays(gl.Points, 0, vertices.length);

    pointShader.unbindShader();
  };
}

export default rendererGLRetained;

if(typeof p5 !== 'undefined'){
  rendererGLRetained(p5, p5.prototype);
}
