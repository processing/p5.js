export class GeometryBufferCache {
  constructor(renderer) {
    this.renderer = renderer;
    this.cache = {};
  }

  numCached() {
    return Object.keys(this.cache).length;
  }

  isCached(gid) {
    return this.cache[gid] !== undefined;
  }

  getGeometryByID(gid) {
    return this.cache[gid]?.geometry;
  }

  getCached(model) {
    return this.getCachedID(model.gid);
  }

  getCachedID(gid) {
    return this.cache[gid];
  }

  ensureCached(geometry) {
    const gid = geometry.gid;
    if (!gid) {
      throw new Error('The p5.Geometry you passed in has no gid property!');
    }

    if (this.isCached(geometry.gid)) return this.getCached(geometry);

    const gl = this.renderer.GL;

    //initialize the gl buffers for our geom groups
    this.freeBuffers(gid);

    if (Object.keys(this.cache).length > 1000) {
      const key = Object.keys(this.cache)[0];
      this.freeBuffers(key);
    }

    //create a new entry in our cache
    const buffers = {};
    this.cache[gid] = buffers;

    buffers.geometry = geometry;

    let indexBuffer = buffers.indexBuffer;

    if (geometry.faces.length) {
      // allocate space for faces
      if (!indexBuffer) indexBuffer = buffers.indexBuffer = gl.createBuffer();
      const vals = geometry.faces.flat();

      // If any face references a vertex with an index greater than the maximum
      // un-singed 16 bit integer, then we need to use a Uint32Array instead of a
      // Uint16Array
      const hasVertexIndicesOverMaxUInt16 = vals.some(v => v > 65535);
      let type = hasVertexIndicesOverMaxUInt16 ? Uint32Array : Uint16Array;
      this.renderer._bindBuffer(indexBuffer, gl.ELEMENT_ARRAY_BUFFER, vals, type);

      // If we're using a Uint32Array for our indexBuffer we will need to pass a
      // different enum value to WebGL draw triangles. This happens in
      // the _drawElements function.
      buffers.indexBufferType = hasVertexIndicesOverMaxUInt16
        ? gl.UNSIGNED_INT
        : gl.UNSIGNED_SHORT;
    } else {
      // the index buffer is unused, remove it
      if (indexBuffer) {
        gl.deleteBuffer(indexBuffer);
        buffers.indexBuffer = null;
      }
    }

    return buffers;
  }

  freeBuffers(gid) {
    const buffers = this.cache[gid];
    if (!buffers) {
      return;
    }

    delete this.cache[gid];

    const gl = this.renderer.GL;
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
    freeBuffers(this.renderer.buffers.stroke);
    freeBuffers(this.renderer.buffers.fill);
    freeBuffers(this.renderer.buffers.user);
  }
}
