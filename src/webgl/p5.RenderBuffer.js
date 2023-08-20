import p5 from '../core/main';

p5.RenderBuffer = class {
  constructor(size, src, dst, attr, renderer, map){
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
    let model;
    if (geometry.model) {
      model = geometry.model;
    } else {
      model = geometry;
    }

    // loop through each of the buffer definitions
    const attr = attributes[this.attr];
    if (!attr) {
      return;
    }

    // check if the model has the appropriate source array
    let buffer = geometry[this.dst];
    const src = model[this.src];
    if (src.length > 0) {
    // check if we need to create the GL buffer
      const createBuffer = !buffer;
      if (createBuffer) {
      // create and remember the buffer
        geometry[this.dst] = buffer = gl.createBuffer();
      }
      // bind the buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

      // check if we need to fill the buffer with data
      if (createBuffer || model.dirtyFlags[this.src] !== false) {
        const map = this.map;
        // get the values from the model, possibly transformed
        const values = map ? map(src) : src;
        // fill the buffer with the values
        this._renderer._bindBuffer(buffer, gl.ARRAY_BUFFER, values);

        // mark the model's source array as clean
        model.dirtyFlags[this.src] = false;
      }
      // enable the attribute
      shader.enableAttrib(attr, this.size);
    } else {
      const loc = attr.location;
      if (loc === -1 || !this._renderer.registerEnabled.has(loc)) { return; }
      // Disable register corresponding to unused attribute
      gl.disableVertexAttribArray(loc);
      // Record register availability
      this._renderer.registerEnabled.delete(loc);
    }
  }
};

export default p5.RenderBuffer;
