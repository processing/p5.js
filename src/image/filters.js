/*global ImageData:false */

/**
 * This module defines the filters for use with image buffers.
 *
 * This module is basically a collection of functions stored in an object
 * as opposed to modules. The functions are destructive, modifying
 * the passed in canvas rather than creating a copy.
 *
 * Generally speaking users of this module will use the Filters.apply method
 * on a canvas to create an effect.
 *
 * A number of functions are borrowed/adapted from
 * http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
 * or the java processing implementation.
 */

const Filters = {};

/*
 * Helper functions
 */

/**
 * Returns the pixel buffer for a canvas
 *
 * @private
 *
 * @param  {Canvas|ImageData} canvas the canvas to get pixels from
 * @return {Uint8ClampedArray}       a one-dimensional array containing
 *                                   the data in thc RGBA order, with integer
 *                                   values between 0 and 255
 */
Filters._toPixels = function(canvas) {
  if (canvas instanceof ImageData) {
    return canvas.data;
  } else {
    return canvas
      .getContext('2d')
      .getImageData(0, 0, canvas.width, canvas.height).data;
  }
};

/**
 * Returns a 32 bit number containing ARGB data at ith pixel in the
 * 1D array containing pixels data.
 *
 * @private
 *
 * @param  {Uint8ClampedArray} data array returned by _toPixels()
 * @param  {Integer}           i    index of a 1D Image Array
 * @return {Integer}                32 bit integer value representing
 *                                  ARGB value.
 */
Filters._getARGB = function(data, i) {
  const offset = i * 4;
  return (
    ((data[offset + 3] << 24) & 0xff000000) |
    ((data[offset] << 16) & 0x00ff0000) |
    ((data[offset + 1] << 8) & 0x0000ff00) |
    (data[offset + 2] & 0x000000ff)
  );
};

/**
 * Modifies pixels RGBA values to values contained in the data object.
 *
 * @private
 *
 * @param {Uint8ClampedArray} pixels array returned by _toPixels()
 * @param {Int32Array}        data   source 1D array where each value
 *                                   represents ARGB values
 */
Filters._setPixels = function(pixels, data) {
  let offset = 0;
  for (let i = 0, al = pixels.length; i < al; i++) {
    offset = i * 4;
    pixels[offset + 0] = (data[i] & 0x00ff0000) >>> 16;
    pixels[offset + 1] = (data[i] & 0x0000ff00) >>> 8;
    pixels[offset + 2] = data[i] & 0x000000ff;
    pixels[offset + 3] = (data[i] & 0xff000000) >>> 24;
  }
};

/**
 * Returns the ImageData object for a canvas
 * https://developer.mozilla.org/en-US/docs/Web/API/ImageData
 *
 * @private
 *
 * @param  {Canvas|ImageData} canvas canvas to get image data from
 * @return {ImageData}               Holder of pixel data (and width and
 *                                   height) for a canvas
 */
Filters._toImageData = function(canvas) {
  if (canvas instanceof ImageData) {
    return canvas;
  } else {
    return canvas
      .getContext('2d')
      .getImageData(0, 0, canvas.width, canvas.height);
  }
};

/**
 * Returns a blank ImageData object.
 *
 * @private
 *
 * @param  {Integer} width
 * @param  {Integer} height
 * @return {ImageData}
 */
Filters._createImageData = function(width, height) {
  Filters._tmpCanvas = document.createElement('canvas');
  Filters._tmpCtx = Filters._tmpCanvas.getContext('2d');
  return this._tmpCtx.createImageData(width, height);
};

/**
 * Applys a filter function to a canvas.
 *
 * The difference between this and the actual filter functions defined below
 * is that the filter functions generally modify the pixel buffer but do
 * not actually put that data back to the canvas (where it would actually
 * update what is visible). By contrast this method does make the changes
 * actually visible in the canvas.
 *
 * The apply method is the method that callers of this module would generally
 * use. It has been separated from the actual filters to support an advanced
 * use case of creating a filter chain that executes without actually updating
 * the canvas in between everystep.
 *
 * @private
 * @param  {HTMLCanvasElement} canvas [description]
 * @param  {function(ImageData,Object)} func   [description]
 * @param  {Object} filterParam  [description]
 */
Filters.apply = function(canvas, func, filterParam) {
  const pixelsState = canvas.getContext('2d');
  const imageData = pixelsState.getImageData(0, 0, canvas.width, canvas.height);

  //Filters can either return a new ImageData object, or just modify
  //the one they received.
  const newImageData = func(imageData, filterParam);
  if (newImageData instanceof ImageData) {
    pixelsState.putImageData(
      newImageData,
      0,
      0,
      0,
      0,
      canvas.width,
      canvas.height
    );
  } else {
    pixelsState.putImageData(
      imageData,
      0,
      0,
      0,
      0,
      canvas.width,
      canvas.height
    );
  }
};

/*
 * Filters
 */

/**
 * Converts the image to black and white pixels depending if they are above or
 * below the threshold defined by the level parameter. The parameter must be
 * between 0.0 (black) and 1.0 (white). If no level is specified, 0.5 is used.
 *
 * Borrowed from http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
 *
 * @private
 * @param  {Canvas} canvas
 * @param  {Float} level
 */
Filters.threshold = function(canvas, level) {
  const pixels = Filters._toPixels(canvas);

  if (level === undefined) {
    level = 0.5;
  }
  const thresh = Math.floor(level * 255);

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    let val;
    if (gray >= thresh) {
      val = 255;
    } else {
      val = 0;
    }
    pixels[i] = pixels[i + 1] = pixels[i + 2] = val;
  }
};

/**
 * Converts any colors in the image to grayscale equivalents.
 * No parameter is used.
 *
 * Borrowed from http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
 *
 * @private
 * @param {Canvas} canvas
 */
Filters.gray = function(canvas) {
  const pixels = Filters._toPixels(canvas);

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    // CIE luminance for RGB
    const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    pixels[i] = pixels[i + 1] = pixels[i + 2] = gray;
  }
};

/**
 * Sets the alpha channel to entirely opaque. No parameter is used.
 *
 * @private
 * @param {Canvas} canvas
 */
Filters.opaque = function(canvas) {
  const pixels = Filters._toPixels(canvas);

  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i + 3] = 255;
  }

  return pixels;
};

/**
 * Sets each pixel to its inverse value. No parameter is used.
 * @private
 * @param  {Canvas} canvas
 */
Filters.invert = function(canvas) {
  const pixels = Filters._toPixels(canvas);

  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = 255 - pixels[i];
    pixels[i + 1] = 255 - pixels[i + 1];
    pixels[i + 2] = 255 - pixels[i + 2];
  }
};

/**
 * Limits each channel of the image to the number of colors specified as
 * the parameter. The parameter can be set to values between 2 and 255, but
 * results are most noticeable in the lower ranges.
 *
 * Adapted from java based processing implementation
 *
 * @private
 * @param  {Canvas} canvas
 * @param  {Integer} level
 */
Filters.posterize = function(canvas, level) {
  const pixels = Filters._toPixels(canvas);

  if (level < 2 || level > 255) {
    throw new Error(
      'Level must be greater than 2 and less than 255 for posterize'
    );
  }

  const levels1 = level - 1;
  for (let i = 0; i < pixels.length; i += 4) {
    const rlevel = pixels[i];
    const glevel = pixels[i + 1];
    const blevel = pixels[i + 2];

    pixels[i] = ((rlevel * level) >> 8) * 255 / levels1;
    pixels[i + 1] = ((glevel * level) >> 8) * 255 / levels1;
    pixels[i + 2] = ((blevel * level) >> 8) * 255 / levels1;
  }
};

/**
 * reduces the bright areas in an image
 * @private
 * @param  {Canvas} canvas
 */
Filters.dilate = function(canvas) {
  const pixels = Filters._toPixels(canvas);
  let currIdx = 0;
  const maxIdx = pixels.length ? pixels.length / 4 : 0;
  const out = new Int32Array(maxIdx);
  let currRowIdx, maxRowIdx, colOrig, colOut, currLum;

  let idxRight, idxLeft, idxUp, idxDown;
  let colRight, colLeft, colUp, colDown;
  let lumRight, lumLeft, lumUp, lumDown;

  while (currIdx < maxIdx) {
    currRowIdx = currIdx;
    maxRowIdx = currIdx + canvas.width;
    while (currIdx < maxRowIdx) {
      colOrig = colOut = Filters._getARGB(pixels, currIdx);
      idxLeft = currIdx - 1;
      idxRight = currIdx + 1;
      idxUp = currIdx - canvas.width;
      idxDown = currIdx + canvas.width;

      if (idxLeft < currRowIdx) {
        idxLeft = currIdx;
      }
      if (idxRight >= maxRowIdx) {
        idxRight = currIdx;
      }
      if (idxUp < 0) {
        idxUp = 0;
      }
      if (idxDown >= maxIdx) {
        idxDown = currIdx;
      }
      colUp = Filters._getARGB(pixels, idxUp);
      colLeft = Filters._getARGB(pixels, idxLeft);
      colDown = Filters._getARGB(pixels, idxDown);
      colRight = Filters._getARGB(pixels, idxRight);

      //compute luminance
      currLum =
        77 * ((colOrig >> 16) & 0xff) +
        151 * ((colOrig >> 8) & 0xff) +
        28 * (colOrig & 0xff);
      lumLeft =
        77 * ((colLeft >> 16) & 0xff) +
        151 * ((colLeft >> 8) & 0xff) +
        28 * (colLeft & 0xff);
      lumRight =
        77 * ((colRight >> 16) & 0xff) +
        151 * ((colRight >> 8) & 0xff) +
        28 * (colRight & 0xff);
      lumUp =
        77 * ((colUp >> 16) & 0xff) +
        151 * ((colUp >> 8) & 0xff) +
        28 * (colUp & 0xff);
      lumDown =
        77 * ((colDown >> 16) & 0xff) +
        151 * ((colDown >> 8) & 0xff) +
        28 * (colDown & 0xff);

      if (lumLeft > currLum) {
        colOut = colLeft;
        currLum = lumLeft;
      }
      if (lumRight > currLum) {
        colOut = colRight;
        currLum = lumRight;
      }
      if (lumUp > currLum) {
        colOut = colUp;
        currLum = lumUp;
      }
      if (lumDown > currLum) {
        colOut = colDown;
        currLum = lumDown;
      }
      out[currIdx++] = colOut;
    }
  }
  Filters._setPixels(pixels, out);
};

/**
 * increases the bright areas in an image
 * @private
 * @param  {Canvas} canvas
 */
Filters.erode = function(canvas) {
  const pixels = Filters._toPixels(canvas);
  let currIdx = 0;
  const maxIdx = pixels.length ? pixels.length / 4 : 0;
  const out = new Int32Array(maxIdx);
  let currRowIdx, maxRowIdx, colOrig, colOut, currLum;
  let idxRight, idxLeft, idxUp, idxDown;
  let colRight, colLeft, colUp, colDown;
  let lumRight, lumLeft, lumUp, lumDown;

  while (currIdx < maxIdx) {
    currRowIdx = currIdx;
    maxRowIdx = currIdx + canvas.width;
    while (currIdx < maxRowIdx) {
      colOrig = colOut = Filters._getARGB(pixels, currIdx);
      idxLeft = currIdx - 1;
      idxRight = currIdx + 1;
      idxUp = currIdx - canvas.width;
      idxDown = currIdx + canvas.width;

      if (idxLeft < currRowIdx) {
        idxLeft = currIdx;
      }
      if (idxRight >= maxRowIdx) {
        idxRight = currIdx;
      }
      if (idxUp < 0) {
        idxUp = 0;
      }
      if (idxDown >= maxIdx) {
        idxDown = currIdx;
      }
      colUp = Filters._getARGB(pixels, idxUp);
      colLeft = Filters._getARGB(pixels, idxLeft);
      colDown = Filters._getARGB(pixels, idxDown);
      colRight = Filters._getARGB(pixels, idxRight);

      //compute luminance
      currLum =
        77 * ((colOrig >> 16) & 0xff) +
        151 * ((colOrig >> 8) & 0xff) +
        28 * (colOrig & 0xff);
      lumLeft =
        77 * ((colLeft >> 16) & 0xff) +
        151 * ((colLeft >> 8) & 0xff) +
        28 * (colLeft & 0xff);
      lumRight =
        77 * ((colRight >> 16) & 0xff) +
        151 * ((colRight >> 8) & 0xff) +
        28 * (colRight & 0xff);
      lumUp =
        77 * ((colUp >> 16) & 0xff) +
        151 * ((colUp >> 8) & 0xff) +
        28 * (colUp & 0xff);
      lumDown =
        77 * ((colDown >> 16) & 0xff) +
        151 * ((colDown >> 8) & 0xff) +
        28 * (colDown & 0xff);

      if (lumLeft < currLum) {
        colOut = colLeft;
        currLum = lumLeft;
      }
      if (lumRight < currLum) {
        colOut = colRight;
        currLum = lumRight;
      }
      if (lumUp < currLum) {
        colOut = colUp;
        currLum = lumUp;
      }
      if (lumDown < currLum) {
        colOut = colDown;
        currLum = lumDown;
      }

      out[currIdx++] = colOut;
    }
  }
  Filters._setPixels(pixels, out);
};

// BLUR

// internal kernel stuff for the gaussian blur filter
let blurRadius;
let blurKernelSize;
let blurKernel;
let blurMult;

/*
 * Port of https://github.com/processing/processing/blob/
 * master/core/src/processing/core/PImage.java#L1250
 *
 * Optimized code for building the blur kernel.
 * further optimized blur code (approx. 15% for radius=20)
 * bigger speed gains for larger radii (~30%)
 * added support for various image types (ALPHA, RGB, ARGB)
 * [toxi 050728]
 */
function buildBlurKernel(r) {
  let radius = (r * 3.5) | 0;
  radius = radius < 1 ? 1 : radius < 248 ? radius : 248;

  if (blurRadius !== radius) {
    blurRadius = radius;
    blurKernelSize = (1 + blurRadius) << 1;
    blurKernel = new Int32Array(blurKernelSize);
    blurMult = new Array(blurKernelSize);
    for (let l = 0; l < blurKernelSize; l++) {
      blurMult[l] = new Int32Array(256);
    }

    let bk, bki;
    let bm, bmi;

    for (let i = 1, radiusi = radius - 1; i < radius; i++) {
      blurKernel[radius + i] = blurKernel[radiusi] = bki = radiusi * radiusi;
      bm = blurMult[radius + i];
      bmi = blurMult[radiusi--];
      for (let j = 0; j < 256; j++) {
        bm[j] = bmi[j] = bki * j;
      }
    }
    bk = blurKernel[radius] = radius * radius;
    bm = blurMult[radius];

    for (let k = 0; k < 256; k++) {
      bm[k] = bk * k;
    }
  }
}

// Port of https://github.com/processing/processing/blob/
// master/core/src/processing/core/PImage.java#L1433
function blurARGB(canvas, radius) {
  const pixels = Filters._toPixels(canvas);
  const width = canvas.width;
  const height = canvas.height;
  const numPackedPixels = width * height;
  const argb = new Int32Array(numPackedPixels);
  for (let j = 0; j < numPackedPixels; j++) {
    argb[j] = Filters._getARGB(pixels, j);
  }
  let sum, cr, cg, cb, ca;
  let read, ri, ym, ymi, bk0;
  const a2 = new Int32Array(numPackedPixels);
  const r2 = new Int32Array(numPackedPixels);
  const g2 = new Int32Array(numPackedPixels);
  const b2 = new Int32Array(numPackedPixels);
  let yi = 0;
  buildBlurKernel(radius);
  let x, y, i;
  let bm;
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      cb = cg = cr = ca = sum = 0;
      read = x - blurRadius;
      if (read < 0) {
        bk0 = -read;
        read = 0;
      } else {
        if (read >= width) {
          break;
        }
        bk0 = 0;
      }
      for (i = bk0; i < blurKernelSize; i++) {
        if (read >= width) {
          break;
        }
        const c = argb[read + yi];
        bm = blurMult[i];
        ca += bm[(c & -16777216) >>> 24];
        cr += bm[(c & 16711680) >> 16];
        cg += bm[(c & 65280) >> 8];
        cb += bm[c & 255];
        sum += blurKernel[i];
        read++;
      }
      ri = yi + x;
      a2[ri] = ca / sum;
      r2[ri] = cr / sum;
      g2[ri] = cg / sum;
      b2[ri] = cb / sum;
    }
    yi += width;
  }
  yi = 0;
  ym = -blurRadius;
  ymi = ym * width;
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      cb = cg = cr = ca = sum = 0;
      if (ym < 0) {
        bk0 = ri = -ym;
        read = x;
      } else {
        if (ym >= height) {
          break;
        }
        bk0 = 0;
        ri = ym;
        read = x + ymi;
      }
      for (i = bk0; i < blurKernelSize; i++) {
        if (ri >= height) {
          break;
        }
        bm = blurMult[i];
        ca += bm[a2[read]];
        cr += bm[r2[read]];
        cg += bm[g2[read]];
        cb += bm[b2[read]];
        sum += blurKernel[i];
        ri++;
        read += width;
      }
      argb[x + yi] =
        ((ca / sum) << 24) |
        ((cr / sum) << 16) |
        ((cg / sum) << 8) |
        (cb / sum);
    }
    yi += width;
    ymi += width;
    ym++;
  }
  Filters._setPixels(pixels, argb);
}

Filters.blur = function(canvas, radius) {
  blurARGB(canvas, radius);
};

export default Filters;
