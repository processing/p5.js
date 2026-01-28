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

    if (this.isCached(gid)) return this.getCached(geometry);

    // Cache maintenance
    this.freeBuffers(gid);
    if (Object.keys(this.cache).length > 1000) {
      const key = Object.keys(this.cache)[0];
      this.freeBuffers(key);
    }

    const buffers = { geometry };
    this.cache[gid] = buffers;

    const indices = geometry.faces.length ? geometry.faces.flat() : null;

    // Determine index buffer type
    let indexType = null;
    if (indices) {
      // If any face references a vertex with an index greater than the maximum
      // un-singed 16 bit integer, then we need to use a Uint32Array instead of a
      // Uint16Array
      const hasVertexIndicesOverMaxUInt16 = indices.some(i => i > 65535);
      indexType = hasVertexIndicesOverMaxUInt16 ? Uint32Array : Uint16Array;
    }

    this.renderer._ensureGeometryBuffers(buffers, indices, indexType);

    return buffers;
  }

  freeBuffers(gid) {
    const buffers = this.cache[gid];
    if (!buffers) {
      return;
    }

    delete this.cache[gid];

    this.renderer._freeBuffers(buffers);
  }
}
