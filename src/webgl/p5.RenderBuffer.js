class RenderBuffer {
  constructor(size, src, dst, attr, renderer, map) {
    this.size = size; // the number of FLOATs in each vertex
    this.src = src; // the name of the model's source array
    this.dst = dst; // the name of the geometry's buffer
    this.attr = attr; // the name of the vertex attribute
    this._renderer = renderer;
    this.map = map; // optional, a transformation function to apply to src
  }

  /**
   * Enables and binds the buffers used by shader when the appropriate data exists in geometry.
   * Must always be done prior to drawing geometry in WebGL.
   * @param {p5.Geometry} geometry Geometry that is going to be drawn
   * @param {p5.Shader} shader Active shader
   * @private
   */
  _prepareBuffer(geometry, shader) {
    const attributes = shader.attributes;
    const gl = this._renderer.GL;
    const glBuffers = this._renderer._getOrMakeCachedBuffers(geometry);

    // loop through each of the buffer definitions
    const attr = attributes[this.attr];
    if (!attr) {
      return;
    }
    // check if the geometry has the appropriate source array
    let buffer = glBuffers[this.dst];
    const src = geometry[this.src];
    if (src && src.length > 0) {
      // check if we need to create the GL buffer
      const createBuffer = !buffer;
      if (createBuffer) {
        // create and remember the buffer
        glBuffers[this.dst] = buffer = gl.createBuffer();
      }
      // bind the buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

      // check if we need to fill the buffer with data
      if (createBuffer || geometry.dirtyFlags[this.src] !== false) {
        const map = this.map;
        // get the values from the geometry, possibly transformed
        const values = map ? map(src) : src;
        // fill the buffer with the values
        this._renderer._bindBuffer(buffer, gl.ARRAY_BUFFER, values);
        // mark the geometry's source array as clean
        geometry.dirtyFlags[this.src] = false;
      }
      // enable the attribute
      shader.enableAttrib(attr, this.size);
    } else {
      const loc = attr.location;
      if (loc === -1 || !this._renderer.registerEnabled.has(loc)) {
        return;
      }
      // Disable register corresponding to unused attribute
      gl.disableVertexAttribArray(loc);
      // Record register availability
      this._renderer.registerEnabled.delete(loc);
    }
  }
}

function renderBuffer(p5, fn) {
  p5.RenderBuffer = RenderBuffer;
}

export default renderBuffer;
export { RenderBuffer };

if (typeof p5 !== "undefined") {
  renderBuffer(p5, p5.prototype);
}
