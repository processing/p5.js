/**
 * @private
 * @param {Uint8Array|Float32Array|undefined} pixels An existing pixels array to reuse if the size is the same
 * @param {WebGLRenderingContext} gl The WebGL context
 * @param {WebGLFramebuffer|null} framebuffer The Framebuffer to read
 * @param {Number} x The x coordiante to read, premultiplied by pixel density
 * @param {Number} y The y coordiante to read, premultiplied by pixel density
 * @param {Number} width The width in pixels to be read (factoring in pixel density)
 * @param {Number} height The height in pixels to be read (factoring in pixel density)
 * @param {GLEnum} format Either RGB or RGBA depending on how many channels to read
 * @param {GLEnum} type The datatype of each channel, e.g. UNSIGNED_BYTE or FLOAT
 * @param {Number|undefined} flipY If provided, the total height with which to flip the y axis about
 * @returns {Uint8Array|Float32Array} pixels A pixels array with the current state of the
 * WebGL context read into it
 */
export function readPixelsWebGL(
  pixels,
  gl,
  framebuffer,
  x,
  y,
  width,
  height,
  format,
  type,
  flipY
) {
  // Record the currently bound framebuffer so we can go back to it after, and
  // bind the framebuffer we want to read from
  const prevFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

  const channels = format === gl.RGBA ? 4 : 3;

  // Make a pixels buffer if it doesn't already exist
  const len = width * height * channels;
  const TypedArrayClass = type === gl.UNSIGNED_BYTE ? Uint8Array : Float32Array;
  if (!(pixels instanceof TypedArrayClass) || pixels.length !== len) {
    pixels = new TypedArrayClass(len);
  }

  gl.readPixels(
    x,
    flipY ? flipY - y - height : y,
    width,
    height,
    format,
    type,
    pixels
  );

  // Re-bind whatever was previously bound
  gl.bindFramebuffer(gl.FRAMEBUFFER, prevFramebuffer);

  if (flipY) {
    // WebGL pixels are inverted compared to 2D pixels, so we have to flip
    // the resulting rows. Adapted from https://stackoverflow.com/a/41973289
    const halfHeight = Math.floor(height / 2);
    const tmpRow = new TypedArrayClass(width * channels);
    for (let y = 0; y < halfHeight; y++) {
      const topOffset = y * width * 4;
      const bottomOffset = (height - y - 1) * width * 4;
      tmpRow.set(pixels.subarray(topOffset, topOffset + width * 4));
      pixels.copyWithin(topOffset, bottomOffset, bottomOffset + width * 4);
      pixels.set(tmpRow, bottomOffset);
    }
  }

  return pixels;
}

/**
 * @private
 * @param {WebGLRenderingContext} gl The WebGL context
 * @param {WebGLFramebuffer|null} framebuffer The Framebuffer to read
 * @param {Number} x The x coordinate to read, premultiplied by pixel density
 * @param {Number} y The y coordinate to read, premultiplied by pixel density
 * @param {GLEnum} format Either RGB or RGBA depending on how many channels to read
 * @param {GLEnum} type The datatype of each channel, e.g. UNSIGNED_BYTE or FLOAT
 * @param {Number|undefined} flipY If provided, the total height with which to flip the y axis about
 * @returns {Number[]} pixels The channel data for the pixel at that location
 */
export function readPixelWebGL(gl, framebuffer, x, y, format, type, flipY) {
  // Record the currently bound framebuffer so we can go back to it after, and
  // bind the framebuffer we want to read from
  const prevFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

  const channels = format === gl.RGBA ? 4 : 3;
  const TypedArrayClass = type === gl.UNSIGNED_BYTE ? Uint8Array : Float32Array;
  const pixels = new TypedArrayClass(channels);

  gl.readPixels(x, flipY ? flipY - y - 1 : y, 1, 1, format, type, pixels);

  // Re-bind whatever was previously bound
  gl.bindFramebuffer(gl.FRAMEBUFFER, prevFramebuffer);

  return Array.from(pixels);
}
