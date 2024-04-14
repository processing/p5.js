/**
 * @module Image
 * @submodule Pixels
 * @for p5
 * @requires core
 */

import p5 from '../core/main';
import Filters from './filters';
import '../color/p5.Color';

/**
 * An array containing the color of each pixel on the canvas. Colors are
 * stored as numbers representing red, green, blue, and alpha (RGBA) values.
 * `pixels` is a one-dimensional array for performance reasons.
 *
 * Each pixel occupies four elements in the `pixels` array, one for each RGBA
 * value. For example, the pixel at coordinates (0, 0) stores its RGBA values
 * at `pixels[0]`, `pixels[1]`, `pixels[2]`, and `pixels[3]`, respectively.
 * The next pixel at coordinates (1, 0) stores its RGBA values at `pixels[4]`,
 * `pixels[5]`, `pixels[6]`, and `pixels[7]`. And so on. The `pixels` array
 * for a 100&times;100 canvas has 100 &times; 100 &times; 4 = 40,000 elements.
 *
 * Some displays use several smaller pixels to set the color at a single
 * point. The <a href="#/p5/pixelDensity">pixelDensity()</a> function returns
 * the pixel density of the canvas. High density displays often have a
 * <a href="#/p5/pixelDensity">pixelDensity()</a> of 2. On such a display, the
 * `pixels` array for a 100&times;100 canvas has 200 &times; 200 &times; 4 =
 * 160,000 elements.
 *
 * Accessing the RGBA values for a point on the canvas requires a little math
 * as shown below. The <a href="#/p5/loadPixels">loadPixels()</a> function
 * must be called before accessing the `pixels` array. The
 * <a href="#/p5/updatePixels">updatePixels()</a> function must be called
 * after any changes are made.
 *
 * @property {Number[]} pixels
 *
 * @example
 * <div>
 * <code>
 * loadPixels();
 * let x = 50;
 * let y = 50;
 * let d = pixelDensity();
 * for (let i = 0; i < d; i += 1) {
 *   for (let j = 0; j < d; j += 1) {
 *     let index = 4 * ((y * d + j) * width * d + (x * d + i));
 *     // Red.
 *     pixels[index] = 0;
 *     // Green.
 *     pixels[index + 1] = 0;
 *     // Blue.
 *     pixels[index + 2] = 0;
 *     // Alpha.
 *     pixels[index + 3] = 255;
 *   }
 * }
 * updatePixels();
 *
 * describe('A black dot in the middle of a gray rectangle.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * loadPixels();
 * let d = pixelDensity();
 * let halfImage = 4 * (d * width) * (d * height / 2);
 * for (let i = 0; i < halfImage; i += 4) {
 *   // Red.
 *   pixels[i] = 255;
 *   // Green.
 *   pixels[i + 1] = 0;
 *   // Blue.
 *   pixels[i + 2] = 0;
 *   // Alpha.
 *   pixels[i + 3] = 255;
 * }
 * updatePixels();
 *
 * describe('A red rectangle drawn above a gray rectangle.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let pink = color(255, 102, 204);
 * loadPixels();
 * let d = pixelDensity();
 * let halfImage = 4 * (d * width) * (d * height / 2);
 * for (let i = 0; i < halfImage; i += 4) {
 *   pixels[i] = red(pink);
 *   pixels[i + 1] = green(pink);
 *   pixels[i + 2] = blue(pink);
 *   pixels[i + 3] = alpha(pink);
 * }
 * updatePixels();
 *
 * describe('A pink rectangle drawn above a gray rectangle.');
 * </code>
 * </div>
 */
p5.prototype.pixels = [];

/**
 * Copies a region of pixels from one image to another. The `blendMode`
 * parameter blends the images' colors to create different effects.
 *
 * @method blend
 * @param  {p5.Image} srcImage source image.
 * @param  {Integer} sx x-coordinate of the source's upper-left corner.
 * @param  {Integer} sy y-coordinate of the source's upper-left corner.
 * @param  {Integer} sw source image width.
 * @param  {Integer} sh source image height.
 * @param  {Integer} dx x-coordinate of the destination's upper-left corner.
 * @param  {Integer} dy y-coordinate of the destination's upper-left corner.
 * @param  {Integer} dw destination image width.
 * @param  {Integer} dh destination image height.
 * @param  {(BLEND|DARKEST|LIGHTEST|DIFFERENCE|MULTIPLY|EXCLUSION|SCREEN|REPLACE|OVERLAY|HARD_LIGHT|SOFT_LIGHT|DODGE|BURN|ADD|NORMAL)} blendMode the blend mode. either
 *     BLEND, DARKEST, LIGHTEST, DIFFERENCE,
 *     MULTIPLY, EXCLUSION, SCREEN, REPLACE, OVERLAY, HARD_LIGHT,
 *     SOFT_LIGHT, DODGE, BURN, ADD or NORMAL.
 *
 * @example
 * <div>
 * <code>
 * let img0;
 * let img1;
 *
 * function preload() {
 *   img0 = loadImage('assets/rockies.jpg');
 *   img1 = loadImage('assets/bricks_third.jpg');
 * }
 *
 * function setup() {
 *   background(img0);
 *   image(img1, 0, 0);
 *   blend(img1, 0, 0, 33, 100, 67, 0, 33, 100, LIGHTEST);
 *
 *   describe('A wall of bricks in front of a mountain landscape. The same wall of bricks appears faded on the right of the image.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img0;
 * let img1;
 *
 * function preload() {
 *   img0 = loadImage('assets/rockies.jpg');
 *   img1 = loadImage('assets/bricks_third.jpg');
 * }
 *
 * function setup() {
 *   background(img0);
 *   image(img1, 0, 0);
 *   blend(img1, 0, 0, 33, 100, 67, 0, 33, 100, DARKEST);
 *
 *   describe('A wall of bricks in front of a mountain landscape. The same wall of bricks appears transparent on the right of the image.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img0;
 * let img1;
 *
 * function preload() {
 *   img0 = loadImage('assets/rockies.jpg');
 *   img1 = loadImage('assets/bricks_third.jpg');
 * }
 *
 * function setup() {
 *   background(img0);
 *   image(img1, 0, 0);
 *   blend(img1, 0, 0, 33, 100, 67, 0, 33, 100, ADD);
 *
 *   describe('A wall of bricks in front of a mountain landscape. The same wall of bricks appears washed out on the right of the image.');
 * }
 * </code>
 * </div>
 */
/**
 * @method blend
 * @param  {Integer} sx
 * @param  {Integer} sy
 * @param  {Integer} sw
 * @param  {Integer} sh
 * @param  {Integer} dx
 * @param  {Integer} dy
 * @param  {Integer} dw
 * @param  {Integer} dh
 * @param  {(BLEND|DARKEST|LIGHTEST|DIFFERENCE|MULTIPLY|EXCLUSION|SCREEN|REPLACE|OVERLAY|HARD_LIGHT|SOFT_LIGHT|DODGE|BURN|ADD|NORMAL)} blendMode
 */
p5.prototype.blend = function(...args) {
  p5._validateParameters('blend', args);
  if (this._renderer) {
    this._renderer.blend(...args);
  } else {
    p5.Renderer2D.prototype.blend.apply(this, args);
  }
};

/**
 * Copies pixels from a source image to a region of the canvas. The source
 * image can be the canvas itself or a <a href="#/p5.Image">p5.Image</a>
 * object. `copy()` will scale pixels from the source region if it isn't the
 * same size as the destination region.
 *
 * @method copy
 * @param  {p5.Image|p5.Element} srcImage source image.
 * @param  {Integer} sx x-coordinate of the source's upper-left corner.
 * @param  {Integer} sy y-coordinate of the source's upper-left corner.
 * @param  {Integer} sw source image width.
 * @param  {Integer} sh source image height.
 * @param  {Integer} dx x-coordinate of the destination's upper-left corner.
 * @param  {Integer} dy y-coordinate of the destination's upper-left corner.
 * @param  {Integer} dw destination image width.
 * @param  {Integer} dh destination image height.
 *
 * @example
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/rockies.jpg');
 * }
 *
 * function setup() {
 *   background(img);
 *   copy(img, 7, 22, 10, 10, 35, 25, 50, 50);
 *   // Show copied region.
 *   stroke(255);
 *   noFill();
 *   square(7, 22, 10);
 *
 *   describe('An image of a mountain landscape. A square region is outlined in white. A larger square contains a pixelated view of the outlined region.');
 * }
 * </code>
 * </div>
 */
/**
 * @method copy
 * @param  {Integer} sx
 * @param  {Integer} sy
 * @param  {Integer} sw
 * @param  {Integer} sh
 * @param  {Integer} dx
 * @param  {Integer} dy
 * @param  {Integer} dw
 * @param  {Integer} dh
 */
p5.prototype.copy = function(...args) {
  p5._validateParameters('copy', args);

  let srcImage, sx, sy, sw, sh, dx, dy, dw, dh;
  if (args.length === 9) {
    srcImage = args[0];
    sx = args[1];
    sy = args[2];
    sw = args[3];
    sh = args[4];
    dx = args[5];
    dy = args[6];
    dw = args[7];
    dh = args[8];
  } else if (args.length === 8) {
    srcImage = this;
    sx = args[0];
    sy = args[1];
    sw = args[2];
    sh = args[3];
    dx = args[4];
    dy = args[5];
    dw = args[6];
    dh = args[7];
  } else {
    throw new Error('Signature not supported');
  }

  p5.prototype._copyHelper(this, srcImage, sx, sy, sw, sh, dx, dy, dw, dh);
};

p5.prototype._copyHelper = (
  dstImage,
  srcImage,
  sx,
  sy,
  sw,
  sh,
  dx,
  dy,
  dw,
  dh
) => {
  const s = srcImage.canvas.width / srcImage.width;
  // adjust coord system for 3D when renderer
  // ie top-left = -width/2, -height/2
  let sxMod = 0;
  let syMod = 0;
  if (srcImage._renderer && srcImage._renderer.isP3D) {
    sxMod = srcImage.width / 2;
    syMod = srcImage.height / 2;
  }
  if (dstImage._renderer && dstImage._renderer.isP3D) {
    dstImage.push();
    dstImage.resetMatrix();
    dstImage.noLights();
    dstImage.blendMode(dstImage.BLEND);
    dstImage.imageMode(dstImage.CORNER);
    p5.RendererGL.prototype.image.call(
      dstImage._renderer,
      srcImage,
      sx + sxMod,
      sy + syMod,
      sw,
      sh,
      dx,
      dy,
      dw,
      dh
    );
    dstImage.pop();
  } else {
    dstImage.drawingContext.drawImage(
      srcImage.canvas,
      s * (sx + sxMod),
      s * (sy + syMod),
      s * sw,
      s * sh,
      dx,
      dy,
      dw,
      dh
    );
  }
};

/**
 * Applies an image filter to the canvas. The preset options are:
 *
 * `INVERT`
 * Inverts the colors in the image. No parameter is used.
 *
 * `GRAY`
 * Converts the image to grayscale. No parameter is used.
 *
 * `THRESHOLD`
 * Converts the image to black and white. Pixels with a grayscale value
 * above a given threshold are converted to white. The rest are converted to
 * black. The threshold must be between 0.0 (black) and 1.0 (white). If no
 * value is specified, 0.5 is used.
 *
 * `OPAQUE`
 * Sets the alpha channel to entirely opaque. No parameter is used.
 *
 * `POSTERIZE`
 * Limits the number of colors in the image. Each color channel is limited to
 * the number of colors specified. Values between 2 and 255 are valid, but
 * results are most noticeable with lower values. The default value is 4.
 *
 * `BLUR`
 * Blurs the image. The level of blurring is specified by a blur radius. Larger
 * values increase the blur. The default value is 4. A gaussian blur is used
 * in `P2D` mode. A box blur is used in `WEBGL` mode.
 *
 * `ERODE`
 * Reduces the light areas. No parameter is used.
 *
 * `DILATE`
 * Increases the light areas. No parameter is used.
 *
 * `filter()` uses WebGL in the background by default because it's faster.
 * This can be disabled in `P2D` mode by adding a `false` argument, as in
 * `filter(BLUR, false)`. This may be useful to keep computation off the GPU
 * or to work around a lack of WebGL support.
 *
 * In `WEBGL` mode, `filter()` can also use custom shaders. See
 * <a href="#/p5/createFilterShader">createFilterShader()</a> for more
 * information.
 *
 *
 * @method filter
 * @param  {(THRESHOLD|GRAY|OPAQUE|INVERT|POSTERIZE|BLUR|ERODE|DILATE|BLUR)} filterType  either THRESHOLD, GRAY, OPAQUE, INVERT,
 *                                POSTERIZE, BLUR, ERODE, DILATE or BLUR.
 * @param  {Number} [filterParam] parameter unique to each filter.
 * @param  {Boolean} [useWebGL=true]   flag to control whether to use fast
 *                                WebGL filters (GPU) or original image
 *                                filters (CPU); defaults to `true`.
 *
 * @example
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/bricks.jpg');
 * }
 *
 * function setup() {
 *   image(img, 0, 0);
 *   filter(INVERT);
 *
 *   describe('A blue brick wall.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/bricks.jpg');
 * }
 *
 * function setup() {
 *   image(img, 0, 0);
 *   filter(GRAY);
 *
 *   describe('A brick wall drawn in grayscale.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/bricks.jpg');
 * }
 *
 * function setup() {
 *   image(img, 0, 0);
 *   filter(THRESHOLD);
 *
 *   describe('A brick wall drawn in black and white.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/bricks.jpg');
 * }
 *
 * function setup() {
 *   image(img, 0, 0);
 *   filter(OPAQUE);
 *
 *   describe('A red brick wall.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/bricks.jpg');
 * }
 *
 * function setup() {
 *   image(img, 0, 0);
 *   filter(POSTERIZE, 3);
 *
 *   describe('An image of a red brick wall drawn with limited color palette.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/bricks.jpg');
 * }
 *
 * function setup() {
 *   image(img, 0, 0);
 *   filter(BLUR, 3);
 *
 *   describe('A blurry image of a red brick wall.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/bricks.jpg');
 * }
 *
 * function setup() {
 *   image(img, 0, 0);
 *   filter(DILATE);
 *
 *   describe('A red brick wall with bright lines between each brick.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/bricks.jpg');
 * }
 *
 * function setup() {
 *   image(img, 0, 0);
 *   filter(ERODE);
 *
 *   describe('A red brick wall with faint lines between each brick.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/bricks.jpg');
 * }
 *
 * function setup() {
 *   image(img, 0, 0);
 *   // Don't use WebGL.
 *   filter(BLUR, 3, false);
 *
 *   describe('A blurry image of a red brick wall.');
 * }
 * </code>
 * </div>
 */

/**
 * @method getFilterGraphicsLayer
 * @private
 * @returns {p5.Graphics}
 */
p5.prototype.getFilterGraphicsLayer = function() {
  return this._renderer.getFilterGraphicsLayer();
};

/**
 * @method filter
 * @param  {(THRESHOLD|GRAY|OPAQUE|INVERT|POSTERIZE|BLUR|ERODE|DILATE|BLUR)} filterType
 * @param  {Number} [filterParam]
 * @param  {Boolean} [useWebGL=true]
 */
/**
 * @method filter
 * @param {p5.Shader}  shaderFilter  shader that's been loaded, with the
 *                                   frag shader using a `tex0` uniform.
 */
p5.prototype.filter = function(...args) {
  p5._validateParameters('filter', arguments);

  let { shader, operation, value, useWebGL } = parseFilterArgs(...args);

  // when passed a shader, use it directly
  if (this._renderer.isP3D && shader) {
    p5.RendererGL.prototype.filter.call(this._renderer, shader);
    return;
  }

  // when opting out of webgl, use old pixels method
  if (!useWebGL && !this._renderer.isP3D) {
    if (this.canvas !== undefined) {
      Filters.apply(this.canvas, Filters[operation], value);
    } else {
      Filters.apply(this.elt, Filters[operation], value);
    }
    return;
  }

  if(!useWebGL && this._renderer.isP3D) {
    console.warn('filter() with useWebGL=false is not supported in WEBGL');
  }

  // when this is a webgl renderer, apply constant shader filter
  if (this._renderer.isP3D) {
    p5.RendererGL.prototype.filter.call(this._renderer, operation, value);
  }

  // when this is P2D renderer, create/use hidden webgl renderer
  else {
    const filterGraphicsLayer = this.getFilterGraphicsLayer();

    // copy p2d canvas contents to secondary webgl renderer
    // dest
    filterGraphicsLayer.copy(
      // src
      this._renderer,
      // src coods
      0, 0, this.width, this.height,
      // dest coords
      -this.width/2, -this.height/2, this.width, this.height
    );
    //clearing the main canvas
    this._renderer.clear();

    this._renderer.resetMatrix();
    // filter it with shaders
    filterGraphicsLayer.filter(...args);

    // copy secondary webgl renderer back to original p2d canvas
    this.copy(
      // src
      filterGraphicsLayer._renderer,
      // src coods
      0, 0, this.width, this.height,
      // dest coords
      0, 0, this.width, this.height
    );
    filterGraphicsLayer.clear(); // prevent feedback effects on p2d canvas
  }
};

function parseFilterArgs(...args) {
  // args could be:
  // - operation, value, [useWebGL]
  // - operation, [useWebGL]
  // - shader

  let result = {
    shader: undefined,
    operation: undefined,
    value: undefined,
    useWebGL: true
  };

  if (args[0] instanceof p5.Shader) {
    result.shader = args[0];
    return result;
  }
  else {
    result.operation = args[0];
  }

  if (args.length > 1 && typeof args[1] === 'number') {
    result.value = args[1];
  }

  if (args[args.length-1] === false) {
    result.useWebGL = false;
  }
  return result;
}

/**
 * Gets a pixel or a region of pixels from the canvas.
 *
 * `get()` is easy to use but it's not as fast as
 * <a href="#/p5/pixels">pixels</a>. Use <a href="#/p5/pixels">pixels</a>
 * to read many pixel values.
 *
 * The version of `get()` with no parameters returns the entire canvas.
 *
 * The version of `get()` with two parameters interprets them as
 * coordinates. It returns an array with the `[R, G, B, A]` values of the
 * pixel at the given point.
 *
 * The version of `get()` with four parameters interprets them as coordinates
 * and dimensions. It returns a subsection of the canvas as a
 * <a href="#/p5.Image">p5.Image</a> object. The first two parameters are the
 * coordinates for the upper-left corner of the subsection. The last two
 * parameters are the width and height of the subsection.
 *
 * Use <a href="#/p5.Image/get">p5.Image.get()</a> to work directly with
 * <a href="#/p5.Image">p5.Image</a> objects.
 *
 * @method get
 * @param  {Number}         x x-coordinate of the pixel.
 * @param  {Number}         y y-coordinate of the pixel.
 * @param  {Number}         w width of the subsection to be returned.
 * @param  {Number}         h height of the subsection to be returned.
 * @return {p5.Image}       subsection as a <a href="#/p5.Image">p5.Image</a> object.
 * @example
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/rockies.jpg');
 * }
 *
 * function setup() {
 *   image(img, 0, 0);
 *   let c = get();
 *   image(c, width / 2, 0);
 *
 *   describe('Two identical mountain landscapes shown side-by-side.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/rockies.jpg');
 * }
 *
 * function setup() {
 *   image(img, 0, 0);
 *   let c = get(50, 90);
 *   fill(c);
 *   noStroke();
 *   square(25, 25, 50);
 *
 *   describe('A mountain landscape with an olive green square in its center.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/rockies.jpg');
 * }
 *
 * function setup() {
 *   image(img, 0, 0);
 *   let c = get(0, 0, width / 2, height / 2);
 *   image(c, width / 2, height / 2);
 *
 *   describe('A mountain landscape drawn on top of another mountain landscape.');
 * }
 * </code>
 * </div>
 */
/**
 * @method get
 * @return {p5.Image}      whole canvas as a <a href="#/p5.Image">p5.Image</a>.
 */
/**
 * @method get
 * @param  {Number}        x
 * @param  {Number}        y
 * @return {Number[]}      color of the pixel at (x, y) in array format `[R, G, B, A]`.
 */
p5.prototype.get = function(x, y, w, h) {
  p5._validateParameters('get', arguments);
  return this._renderer.get(...arguments);
};

/**
 * Loads the current value of each pixel on the canvas into the
 * <a href="#/p5/pixels">pixels</a> array. This
 * function must be called before reading from or writing to
 * <a href="#/p5/pixels">pixels</a>.
 *
 * @method loadPixels
 * @example
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/rockies.jpg');
 * }
 *
 * function setup() {
 *   image(img, 0, 0, width, height);
 *   let d = pixelDensity();
 *   let halfImage = 4 * (d * width) * (d * height / 2);
 *   loadPixels();
 *   for (let i = 0; i < halfImage; i += 1) {
 *     pixels[i + halfImage] = pixels[i];
 *   }
 *   updatePixels();
 *
 *   describe('Two identical images of mountain landscapes, one on top of the other.');
 * }
 * </code>
 * </div>
 */
p5.prototype.loadPixels = function(...args) {
  p5._validateParameters('loadPixels', args);
  this._renderer.loadPixels();
};

/**
 * Sets the color of a pixel or draws an image to the canvas.
 *
 * `set()` is easy to use but it's not as fast as
 * <a href="#/p5/pixels">pixels</a>. Use <a href="#/p5/pixels">pixels</a>
 * to set many pixel values.
 *
 * `set()` interprets the first two parameters as x- and y-coordinates. It
 * interprets the last parameter as a grayscale value, a `[R, G, B, A]` pixel
 * array, a <a href="#/p5.Color">p5.Color</a> object, or a
 * <a href="#/p5.Image">p5.Image</a> object. If an image is passed, the first
 * two parameters set the coordinates for the image's upper-left corner,
 * regardless of the current <a href="#/p5/imageMode">imageMode()</a>.
 *
 * <a href="#/p5/updatePixels">updatePixels()</a> must be called after using
 * `set()` for changes to appear.
 *
 * @method set
 * @param {Number}              x x-coordinate of the pixel.
 * @param {Number}              y y-coordinate of the pixel.
 * @param {Number|Number[]|Object} c grayscale value | pixel array |
 *                                <a href="#/p5.Color">p5.Color</a> object | <a href="#/p5.Image">p5.Image</a> to copy.
 * @example
 * <div>
 * <code>
 * set(30, 20, 0);
 * set(85, 20, 0);
 * set(85, 75, 0);
 * set(30, 75, 0);
 * updatePixels();
 *
 * describe('Four black dots arranged in a square drawn on a gray background.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let black = color(0);
 * set(30, 20, black);
 * set(85, 20, black);
 * set(85, 75, black);
 * set(30, 75, black);
 * updatePixels();
 *
 * describe('Four black dots arranged in a square drawn on a gray background.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * for (let x = 0; x < width; x += 1) {
 *   for (let y = 0; y < height; y += 1) {
 *     let c = map(x, 0, width, 0, 255);
 *     set(x, y, c);
 *   }
 * }
 * updatePixels();
 *
 * describe('A horiztonal color gradient from black to white.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/rockies.jpg');
 * }
 *
 * function setup() {
 *   set(0, 0, img);
 *   updatePixels();
 *
 *   describe('An image of a mountain landscape.');
 * }
 * </code>
 * </div>
 */
p5.prototype.set = function(x, y, imgOrCol) {
  this._renderer.set(x, y, imgOrCol);
};

/**
 * Updates the canvas with the RGBA values in the
 * <a href="#/p5/pixels">pixels</a> array.
 *
 * `updatePixels()` only needs to be called after changing values in the
 * <a href="#/p5/pixels">pixels</a> array. Such changes can be made directly
 * after calling <a href="#/p5/loadPixels">loadPixels()</a> or by calling
 * <a href="#/p5/set">set()</a>.
 *
 * @method updatePixels
 * @param  {Number} [x]    x-coordinate of the upper-left corner of region
 *                         to update.
 * @param  {Number} [y]    y-coordinate of the upper-left corner of region
 *                         to update.
 * @param  {Number} [w]    width of region to update.
 * @param  {Number} [h]    height of region to update.
 * @example
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/rockies.jpg');
 * }
 *
 * function setup() {
 *   image(img, 0, 0, width, height);
 *   let d = pixelDensity();
 *   let halfImage = 4 * (d * width) * (d * height / 2);
 *   loadPixels();
 *   for (let i = 0; i < halfImage; i += 1) {
 *     pixels[i + halfImage] = pixels[i];
 *   }
 *   updatePixels();
 *
 *   describe('Two identical images of mountain landscapes, one on top of the other.');
 * }
 * </code>
 * </div>
 */
p5.prototype.updatePixels = function(x, y, w, h) {
  p5._validateParameters('updatePixels', arguments);
  // graceful fail - if loadPixels() or set() has not been called, pixel
  // array will be empty, ignore call to updatePixels()
  if (this.pixels.length === 0) {
    return;
  }
  this._renderer.updatePixels(x, y, w, h);
};

export default p5;
