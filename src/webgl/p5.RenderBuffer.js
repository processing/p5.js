class RenderBuffer {
  constructor(size, src, dst, attr, renderer, map) {
    this.size = size; // the number of FLOATs in each vertex
    this.src = src; // the name of the model's source array
    this.dst = dst; // the name of the geometry's buffer
    this.attr = attr; // the name of the vertex attribute
    this._renderer = renderer;
    this.map = map; // optional, a transformation function to apply to src
  }

  default(cb) {
    this.default = cb;
    return this;
  }

  /**
   * Enables and binds the buffers used by shader when the appropriate data exists in geometry.
   * Must always be done prior to drawing geometry in WebGL.
   * @param {p5.Geometry} geometry Geometry that is going to be drawn
   * @param {p5.Shader} shader Active shader
   * @private
   */
  _prepareBuffer(geometry, shader) {
    this._renderer._prepareBuffer(this, geometry, shader);
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
