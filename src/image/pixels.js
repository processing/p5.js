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
 * <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
 * /Global_Objects/Uint8ClampedArray' target='_blank'>Uint8ClampedArray</a>
 * containing the values for all the pixels in the display window.
 * These values are numbers. This array is the size (include an appropriate
 * factor for <a href="#/p5/pixelDensity">pixelDensity</a>) of the display window x4,
 * representing the R, G, B, A values in order for each pixel, moving from
 * left to right across each row, then down each column. Retina and other
 * high density displays will have more pixels[] (by a factor of
 * pixelDensity^2).
 * For example, if the image is 100x100 pixels, there will be 40,000. On a
 * retina display, there will be 160,000.
 *
 * The first four values (indices 0-3) in the array will be the R, G, B, A
 * values of the pixel at (0, 0). The second four values (indices 4-7) will
 * contain the R, G, B, A values of the pixel at (1, 0). More generally, to
 * set values for a pixel at (x, y):
 * ```javascript
 * let d = pixelDensity();
 * for (let i = 0; i < d; i++) {
 *   for (let j = 0; j < d; j++) {
 *     // loop over
 *     index = 4 * ((y * d + j) * width * d + (x * d + i));
 *     pixels[index] = r;
 *     pixels[index+1] = g;
 *     pixels[index+2] = b;
 *     pixels[index+3] = a;
 *   }
 * }
 * ```
 * While the above method is complex, it is flexible enough to work with
 * any pixelDensity. Note that <a href="#/p5/set">set()</a> will automatically take care of
 * setting all the appropriate values in <a href="#/p5/pixels">pixels[]</a> for a given (x, y) at
 * any pixelDensity, but the performance may not be as fast when lots of
 * modifications are made to the pixel array.
 *
 * Before accessing this array, the data must loaded with the <a href="#/p5/loadPixels">loadPixels()</a>
 * function. After the array data has been modified, the <a href="#/p5/updatePixels">updatePixels()</a>
 * function must be run to update the changes.
 *
 * Note that this is not a standard javascript array.  This means that
 * standard javascript functions such as <a href="#/p5/slice">slice()</a> or
 * <a href="#/p5/arrayCopy">arrayCopy()</a> do not
 * work.
 *
 * @property {Number[]} pixels
 * @example
 * <div>
 * <code>
 * let pink = color(255, 102, 204);
 * loadPixels();
 * let d = pixelDensity();
 * let halfImage = 4 * (width * d) * (height / 2 * d);
 * for (let i = 0; i < halfImage; i += 4) {
 *   pixels[i] = red(pink);
 *   pixels[i + 1] = green(pink);
 *   pixels[i + 2] = blue(pink);
 *   pixels[i + 3] = alpha(pink);
 * }
 * updatePixels();
 * </code>
 * </div>
 *
 * @alt
 * top half of canvas pink, bottom grey
 */
p5.prototype.pixels = [];

/**
 * Copies a region of pixels from one image to another, using a specified
 * blend mode to do the operation.
 *
 * @method blend
 * @param  {p5.Image} srcImage source image
 * @param  {Integer} sx X coordinate of the source's upper left corner
 * @param  {Integer} sy Y coordinate of the source's upper left corner
 * @param  {Integer} sw source image width
 * @param  {Integer} sh source image height
 * @param  {Integer} dx X coordinate of the destination's upper left corner
 * @param  {Integer} dy Y coordinate of the destination's upper left corner
 * @param  {Integer} dw destination image width
 * @param  {Integer} dh destination image height
 * @param  {Constant} blendMode the blend mode. either
 *     BLEND, DARKEST, LIGHTEST, DIFFERENCE,
 *     MULTIPLY, EXCLUSION, SCREEN, REPLACE, OVERLAY, HARD_LIGHT,
 *     SOFT_LIGHT, DODGE, BURN, ADD or NORMAL.
 *
 * @example
 * <div><code>
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
 * }
 * </code></div>
 * <div><code>
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
 * }
 * </code></div>
 * <div><code>
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
 * }
 * </code></div>
 *
 * @alt
 * image of rocky mountains. Brick images on left and right. Right overexposed
 * image of rockies. Brickwall images on left and right. Right mortar transparent
 * image of rockies. Brickwall images on left and right. Right translucent
 *
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
 * @param  {Constant} blendMode
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
 * Copies a region of the canvas to another region of the canvas
 * and copies a region of pixels from an image used as the srcImg parameter
 * into the canvas srcImage is specified this is used as the source. If
 * the source and destination regions aren't the same size, it will
 * automatically resize source pixels to fit the specified
 * target region.
 *
 * @method copy
 * @param  {p5.Image|p5.Element} srcImage source image
 * @param  {Integer} sx X coordinate of the source's upper left corner
 * @param  {Integer} sy Y coordinate of the source's upper left corner
 * @param  {Integer} sw source image width
 * @param  {Integer} sh source image height
 * @param  {Integer} dx X coordinate of the destination's upper left corner
 * @param  {Integer} dy Y coordinate of the destination's upper left corner
 * @param  {Integer} dw destination image width
 * @param  {Integer} dh destination image height
 *
 * @example
 * <div><code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/rockies.jpg');
 * }
 *
 * function setup() {
 *   background(img);
 *   copy(img, 7, 22, 10, 10, 35, 25, 50, 50);
 *   stroke(255);
 *   noFill();
 *   // Rectangle shows area being copied
 *   rect(7, 22, 10, 10);
 * }
 * </code></div>
 *
 * @alt
 * image of rocky mountains. Brick images on left and right. Right overexposed
 * image of rockies. Brickwall images on left and right. Right mortar transparent
 * image of rockies. Brickwall images on left and right. Right translucent
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
  srcImage.loadPixels();
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
 * Applies a filter to the canvas. The presets options are:
 *
 * THRESHOLD
 * Converts the image to black and white pixels depending if they are above or
 * below the threshold defined by the level parameter. The parameter must be
 * between 0.0 (black) and 1.0 (white). If no level is specified, 0.5 is used.
 *
 * GRAY
 * Converts any colors in the image to grayscale equivalents. No parameter
 * is used.
 *
 * OPAQUE
 * Sets the alpha channel to entirely opaque. No parameter is used.
 *
 * INVERT
 * Sets each pixel to its inverse value. No parameter is used.
 *
 * POSTERIZE
 * Limits each channel of the image to the number of colors specified as the
 * parameter. The parameter can be set to values between 2 and 255, but
 * results are most noticeable in the lower ranges.
 *
 * BLUR
 * Executes a Gaussian blur with the level parameter specifying the extent
 * of the blurring. If no parameter is used, the blur is equivalent to
 * Gaussian blur of radius 1. Larger values increase the blur.
 *
 * ERODE
 * Reduces the light areas. No parameter is used.
 *
 * DILATE
 * Increases the light areas. No parameter is used.
 *
 * filter() does not work in WEBGL mode.
 * A similar effect can be achieved in WEBGL mode using custom
 * shaders. Adam Ferriss has written
 * a <a href="https://github.com/aferriss/p5jsShaderExamples"
 * target='_blank'>selection of shader examples</a> that contains many
 * of the effects present in the filter examples.
 *
 * @method filter
 * @param  {Constant} filterType  either THRESHOLD, GRAY, OPAQUE, INVERT,
 *                                POSTERIZE, BLUR, ERODE, DILATE or BLUR.
 *                                See Filters.js for docs on
 *                                each available filter
 * @param  {Number} [filterParam] an optional parameter unique
 *                                to each filter, see above
 *
 * @example
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   img = loadImage('assets/bricks.jpg');
 * }
 * function setup() {
 *   image(img, 0, 0);
 *   filter(THRESHOLD);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   img = loadImage('assets/bricks.jpg');
 * }
 * function setup() {
 *   image(img, 0, 0);
 *   filter(GRAY);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   img = loadImage('assets/bricks.jpg');
 * }
 * function setup() {
 *   image(img, 0, 0);
 *   filter(OPAQUE);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   img = loadImage('assets/bricks.jpg');
 * }
 * function setup() {
 *   image(img, 0, 0);
 *   filter(INVERT);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   img = loadImage('assets/bricks.jpg');
 * }
 * function setup() {
 *   image(img, 0, 0);
 *   filter(POSTERIZE, 3);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   img = loadImage('assets/bricks.jpg');
 * }
 * function setup() {
 *   image(img, 0, 0);
 *   filter(DILATE);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   img = loadImage('assets/bricks.jpg');
 * }
 * function setup() {
 *   image(img, 0, 0);
 *   filter(BLUR, 3);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   img = loadImage('assets/bricks.jpg');
 * }
 * function setup() {
 *   image(img, 0, 0);
 *   filter(ERODE);
 * }
 * </code>
 * </div>
 *
 * @alt
 * black and white image of a brick wall.
 * greyscale image of a brickwall
 * image of a brickwall
 * jade colored image of a brickwall
 * red and pink image of a brickwall
 * image of a brickwall
 * blurry image of a brickwall
 * image of a brickwall
 * image of a brickwall with less detail
 */
p5.prototype.filter = function(operation, value) {
  p5._validateParameters('filter', arguments);
  if (this.canvas !== undefined) {
    Filters.apply(this.canvas, Filters[operation], value);
  } else {
    Filters.apply(this.elt, Filters[operation], value);
  }
};

/**
 * Get a region of pixels, or a single pixel, from the canvas.
 *
 * Returns an array of [R,G,B,A] values for any pixel or grabs a section of
 * an image. If no parameters are specified, the entire image is returned.
 * Use the x and y parameters to get the value of one pixel. Get a section of
 * the display window by specifying additional w and h parameters. When
 * getting an image, the x and y parameters define the coordinates for the
 * upper-left corner of the image, regardless of the current <a href="#/p5/imageMode">imageMode()</a>.
 *
 * Getting the color of a single pixel with get(x, y) is easy, but not as fast
 * as grabbing the data directly from <a href="#/p5/pixels">pixels[]</a>. The equivalent statement to
 * get(x, y) using <a href="#/p5/pixels">pixels[]</a> with pixel density d is
 * ```javascript
 * let x, y, d; // set these to the coordinates
 * let off = (y * width + x) * d * 4;
 * let components = [
 *   pixels[off],
 *   pixels[off + 1],
 *   pixels[off + 2],
 *   pixels[off + 3]
 * ];
 * print(components);
 * ```
 * See the reference for <a href="#/p5/pixels">pixels[]</a> for more information.
 *
 * If you want to extract an array of colors or a subimage from an p5.Image object,
 * take a look at <a href="#/p5.Image/get">p5.Image.get()</a>
 *
 * @method get
 * @param  {Number}         x x-coordinate of the pixel
 * @param  {Number}         y y-coordinate of the pixel
 * @param  {Number}         w width
 * @param  {Number}         h height
 * @return {p5.Image}       the rectangle <a href="#/p5.Image">p5.Image</a>
 * @example
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   img = loadImage('assets/rockies.jpg');
 * }
 * function setup() {
 *   image(img, 0, 0);
 *   let c = get();
 *   image(c, width / 2, 0);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   img = loadImage('assets/rockies.jpg');
 * }
 * function setup() {
 *   image(img, 0, 0);
 *   let c = get(50, 90);
 *   fill(c);
 *   noStroke();
 *   rect(25, 25, 50, 50);
 * }
 * </code>
 * </div>
 *
 * @alt
 * 2 images of the rocky mountains, side-by-side
 * Image of the rocky mountains with 50x50 green rect in center of canvas
 */
/**
 * @method get
 * @return {p5.Image}      the whole <a href="#/p5.Image">p5.Image</a>
 */
/**
 * @method get
 * @param  {Number}        x
 * @param  {Number}        y
 * @return {Number[]}      color of pixel at x,y in array format [R, G, B, A]
 */
p5.prototype.get = function(x, y, w, h) {
  p5._validateParameters('get', arguments);
  return this._renderer.get(...arguments);
};

/**
 * Loads the pixel data for the display window into the <a href="#/p5/pixels">pixels[]</a> array. This
 * function must always be called before reading from or writing to <a href="#/p5/pixels">pixels[]</a>.
 * Note that only changes made with <a href="#/p5/set">set()</a> or direct manipulation of <a href="#/p5/pixels">pixels[]</a>
 * will occur.
 *
 * @method loadPixels
 * @example
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   img = loadImage('assets/rockies.jpg');
 * }
 *
 * function setup() {
 *   image(img, 0, 0, width, height);
 *   let d = pixelDensity();
 *   let halfImage = 4 * (width * d) * (height * d / 2);
 *   loadPixels();
 *   for (let i = 0; i < halfImage; i++) {
 *     pixels[i + halfImage] = pixels[i];
 *   }
 *   updatePixels();
 * }
 * </code>
 * </div>
 *
 * @alt
 * two images of the rocky mountains. one on top, one on bottom of canvas.
 */
p5.prototype.loadPixels = function(...args) {
  p5._validateParameters('loadPixels', args);
  this._renderer.loadPixels();
};

/**
 * Changes the color of any pixel, or writes an image directly to the
 * display window.
 * The x and y parameters specify the pixel to change and the c parameter
 * specifies the color value. This can be a <a href="#/p5.Color">p5.Color</a> object, or [R, G, B, A]
 * pixel array. It can also be a single grayscale value.
 * When setting an image, the x and y parameters define the coordinates for
 * the upper-left corner of the image, regardless of the current <a href="#/p5/imageMode">imageMode()</a>.
 *
 * After using <a href="#/p5/set">set()</a>, you must call <a href="#/p5/updatePixels">updatePixels()</a> for your changes to appear.
 * This should be called once all pixels have been set, and must be called before
 * calling .<a href="#/p5/get">get()</a> or drawing the image.
 *
 * Setting the color of a single pixel with set(x, y) is easy, but not as
 * fast as putting the data directly into <a href="#/p5/pixels">pixels[]</a>. Setting the <a href="#/p5/pixels">pixels[]</a>
 * values directly may be complicated when working with a retina display,
 * but will perform better when lots of pixels need to be set directly on
 * every loop. See the reference for <a href="#/p5/pixels">pixels[]</a> for more information.
 *
 * @method set
 * @param {Number}              x x-coordinate of the pixel
 * @param {Number}              y y-coordinate of the pixel
 * @param {Number|Number[]|Object} c insert a grayscale value | a pixel array |
 *                                a <a href="#/p5.Color">p5.Color</a> object | a <a href="#/p5.Image">p5.Image</a> to copy
 * @example
 * <div>
 * <code>
 * let black = color(0);
 * set(30, 20, black);
 * set(85, 20, black);
 * set(85, 75, black);
 * set(30, 75, black);
 * updatePixels();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * for (let i = 30; i < width - 15; i++) {
 *   for (let j = 20; j < height - 25; j++) {
 *     let c = color(204 - j, 153 - i, 0);
 *     set(i, j, c);
 *   }
 * }
 * updatePixels();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   img = loadImage('assets/rockies.jpg');
 * }
 *
 * function setup() {
 *   set(0, 0, img);
 *   updatePixels();
 *   line(0, 0, width, height);
 *   line(0, height, width, 0);
 * }
 * </code>
 * </div>
 *
 * @alt
 * 4 black points in the shape of a square middle-right of canvas.
 * square with orangey-brown gradient lightening at bottom right.
 * image of the rocky mountains. with lines like an 'x' through the center.
 */
p5.prototype.set = function(x, y, imgOrCol) {
  this._renderer.set(x, y, imgOrCol);
};
/**
 * Updates the display window with the data in the <a href="#/p5/pixels">pixels[]</a> array.
 * Use in conjunction with <a href="#/p5/loadPixels">loadPixels()</a>. If you're only reading pixels from
 * the array, there's no need to call <a href="#/p5/updatePixels">updatePixels()</a> — updating is only
 * necessary to apply changes. <a href="#/p5/updatePixels">updatePixels()</a> should be called anytime the
 * pixels array is manipulated or <a href="#/p5/set">set()</a> is called, and only changes made with
 * <a href="#/p5/set">set()</a> or direct changes to <a href="#/p5/pixels">pixels[]</a> will occur.
 *
 * @method updatePixels
 * @param  {Number} [x]    x-coordinate of the upper-left corner of region
 *                         to update
 * @param  {Number} [y]    y-coordinate of the upper-left corner of region
 *                         to update
 * @param  {Number} [w]    width of region to update
 * @param  {Number} [h]    height of region to update
 * @example
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   img = loadImage('assets/rockies.jpg');
 * }
 *
 * function setup() {
 *   image(img, 0, 0, width, height);
 *   let d = pixelDensity();
 *   let halfImage = 4 * (width * d) * (height * d / 2);
 *   loadPixels();
 *   for (let i = 0; i < halfImage; i++) {
 *     pixels[i + halfImage] = pixels[i];
 *   }
 *   updatePixels();
 * }
 * </code>
 * </div>
 * @alt
 * two images of the rocky mountains. one on top, one on bottom of canvas.
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
