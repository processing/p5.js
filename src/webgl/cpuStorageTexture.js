/**
 * Data textures for CPU storage buffers on the WebGL renderer.
 *
 * Material and filter shaders run on the GPU. To let them read the
 * same `uniformStorage()` data without changing user code, each CPU storage
 * buffer is uploaded as a floating-point data texture and storage reads in
 * GLSL become `texelFetch()` calls (see `strands_glslBackend.js`).
 *
 * Layout, in texels of RGBA32F with a fixed width so the shader can compute
 * coordinates from an index alone:
 * - Scalar lists use one texel per element (red channel).
 * - Structs pack each field into whole texels (`ceil(dim / 4)` per field);
 *   `stride` is the texel count per element and baked field offsets come
 *   from the buffer schema. `stride` is a shader uniform because buffers can
 *   be rebound under the same name with a different layout.
 */

export const CPU_STORAGE_TEX_WIDTH = 256;

function fieldComponents(field, value) {
  if (typeof value === 'number') return [value];
  if (Array.isArray(value)) return value.slice(0, field.dim);
  if (value?.isVector) {
    return ['x', 'y', 'z', 'w'].slice(0, field.dim).map(c => value[c]);
  }
  if (value?.isColor) return value._getRGBA().slice(0, field.dim);
  return [Number(value)];
}

function texelCountForDim(dim) {
  return Math.max(1, Math.ceil(dim / 4));
}

// Computes the texture layout for a buffer
export function cpuStorageLayout(buffer) {
  const count = buffer.length;
  let fields = null;
  let stride = 1;
  if (buffer._schema) {
    let offset = 0;
    fields = buffer._schema.fields.map(field => {
      const entry = { ...field, offset };
      offset += texelCountForDim(field.dim);
      return entry;
    });
    stride = offset;
  }
  const texels = Math.max(count * stride, 1);
  return {
    fields,
    stride,
    count,
    width: CPU_STORAGE_TEX_WIDTH,
    height: Math.max(1, Math.ceil(texels / CPU_STORAGE_TEX_WIDTH))
  };
}

// `Packs buffer contents into an RGBA float pixel array following a layout.
export function packCpuStorage(buffer, layout) {
  const pixels = new Float32Array(layout.width * layout.height * 4);
  if (!buffer._schema) {
    const data = buffer.data;
    for (let i = 0; i < layout.count; i++) {
      pixels[i * 4] = Number(data[i]);
    }
    return pixels;
  }
  const items = buffer.data;
  for (let e = 0; e < layout.count; e++) {
    const item = items[e];
    for (const field of layout.fields) {
      const comps = fieldComponents(field, item[field.name]);
      for (let k = 0; k < field.dim; k++) {
        pixels[(e * layout.stride + field.offset) * 4 + k] = Number(comps[k] ?? 0);
      }
    }
  }
  return pixels;
}

// A GL texture view of a CPU storage buffer
export class CpuStorageTexture {
  constructor(renderer, buffer) {
    this._renderer = renderer;
    this._buffer = buffer;
    this._isCpuStorageTexture = true;
    this._glTexture = null;
    this._uploadedVersion = -1;
    this._programLocs = new Map();
  }

  bindTexture() {
    const gl = this._renderer.GL;
    if (!this._glTexture) {
      this._glTexture = gl.createTexture();
    }
    gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
  }

  update() {
    const buffer = this._buffer;
    if (buffer._cpuVersion === this._uploadedVersion && this._glTexture) {
      return;
    }
    const gl = this._renderer.GL;
    const layout = cpuStorageLayout(buffer);
    const pixels = packCpuStorage(buffer, layout);
    this.bindTexture();
    // Data textures must not be alpha-premultiplied on upload (p5 leaves
    // premultiplying on outside text drawing, which would zero RGB wherever
    // alpha is 0, e.g. a scalar list holding 1.0 in red).
    const previousPremultiply = gl.getParameter(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA32F,
      layout.width,
      layout.height,
      0,
      gl.RGBA,
      gl.FLOAT,
      pixels
    );
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, previousPremultiply);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this._layout = layout;
    this._uploadedVersion = buffer._cpuVersion;
  }
}

// Returns the cached data texture for a CPU storage buffer on a renderer,
// creating it on first use.
export function cpuStorageTextureFor(renderer, buffer) {
  const cached = renderer.textures.get(buffer);
  if (cached) return cached;
  const texture = new CpuStorageTexture(renderer, buffer);
  renderer.textures.set(buffer, texture);
  return texture;
}
