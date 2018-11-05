/**
 * @module Image
 * @submodule Pixels
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/main');
var Filters = require('./filters');
require('../color/p5.Color');

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
 * <br><br>
 * The first four values (indices 0-3) in the array will be the R, G, B, A
 * values of the pixel at (0, 0). The second four values (indices 4-7) will
 * contain the R, G, B, A values of the pixel at (1, 0). More generally, to
 * set values for a pixel at (x, y):
 * ```javascript
 * var d = pixelDensity();
 * for (var i = 0; i < d; i++) {
 *   for (var j = 0; j < d; j++) {
 *     // loop over
 *     idx = 4 * ((y * d + j) * width * d + (x * d + i));
 *     pixels[idx] = r;
 *     pixels[idx+1] = g;
 *     pixels[idx+2] = b;
 *     pixels[idx+3] = a;
 *   }
 * }
 * ```
 * <p>While the above method is complex, it is flexible enough to work with
 * any pixelDensity. Note that <a href="#/p5/set">set()</a> will automatically take care of
 * setting all the appropriate values in <a href="#/p5/pixels">pixels[]</a> for a given (x, y) at
 * any pixelDensity, but the performance may not be as fast when lots of
 * modifications are made to the pixel array.
 * <br><br>
 * Before accessing this array, the data must loaded with the <a href="#/p5/loadPixels">loadPixels()</a>
 * function. After the array data has been modified, the <a href="#/p5/updatePixels">updatePixels()</a>
 * function must be run to update the changes.
 * <br><br>
 * Note that this is not a standard javascript array.  This means that
 * standard javascript functions such as <a href="#/p5/slice">slice()</a> or
 * <a href="#/p5/arrayCopy">arrayCopy()</a> do not
 * work.</p>
 *
 * @property {Number[]} pixels
 * @example
 * <div>
 * <code>
 * var pink = color(255, 102, 204);
 * loadPixels();
 * var d = pixelDensity();
 * var halfImage = 4 * (width * d) * (height / 2 * d);
 * for (var i = 0; i < halfImage; i += 4) {
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
 *
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
 * var img0;
 * var img1;
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
 * var img0;
 * var img1;
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
 * var img0;
 * var img1;
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
p5.prototype.blend = function() {
  p5._validateParameters('blend', arguments);
  if (this._renderer) {
    this._renderer.blend.apply(this._renderer, arguments);
  } else {
    p5.Renderer2D.prototype.blend.apply(this, arguments);
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
 * var img;
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
 *
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
p5.prototype.copy = function() {
  p5._validateParameters('copy', arguments);
  p5.Renderer2D.prototype.copy.apply(this._renderer, arguments);
};

/**
 * Applies a filter to the canvas.
 * <br><br>
 *
 * The presets options are:
 * <br><br>
 *
 * THRESHOLD
 * Converts the image to black and white pixels depending if they are above or
 * below the threshold defined by the level parameter. The parameter must be
 * between 0.0 (black) and 1.0 (white). If no level is specified, 0.5 is used.
 * <br><br>
 *
 * GRAY
 * Converts any colors in the image to grayscale equivalents. No parameter
 * is used.
 * <br><br>
 *
 * OPAQUE
 * Sets the alpha channel to entirely opaque. No parameter is used.
 * <br><br>
 *
 * INVERT
 * Sets each pixel to its inverse value. No parameter is used.
 * <br><br>
 *
 * POSTERIZE
 * Limits each channel of the image to the number of colors specified as the
 * parameter. The parameter can be set to values between 2 and 255, but
 * results are most noticeable in the lower ranges.
 * <br><br>
 *
 * BLUR
 * Executes a Gaussian blur with the level parameter specifying the extent
 * of the blurring. If no parameter is used, the blur is equivalent to
 * Gaussian blur of radius 1. Larger values increase the blur.
 * <br><br>
 *
 * ERODE
 * Reduces the light areas. No parameter is used.
 * <br><br>
 *
 * DILATE
 * Increases the light areas. No parameter is used.
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
 * var img;
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
 * var img;
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
 * var img;
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
 * var img;
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
 * var img;
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
 * var img;
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
 * var img;
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
 * var img;
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
 *
 */
p5.prototype.filter = function(operation, value) {
  p5._validateParameters('filter', arguments);
  if (this.canvas !== undefined) {
    Filters.apply(this.canvas, Filters[operation.toLowerCase()], value);
  } else {
    Filters.apply(this.elt, Filters[operation.toLowerCase()], value);
  }
};

/**
 * Returns an array of [R,G,B,A] values for any pixel or grabs a section of
 * an image. If no parameters are specified, the entire image is returned.
 * Use the x and y parameters to get the value of one pixel. Get a section of
 * the display window by specifying additional w and h parameters. When
 * getting an image, the x and y parameters define the coordinates for the
 * upper-left corner of the image, regardless of the current <a href="#/p5/imageMode">imageMode()</a>.
 * <br><br>
 * If the pixel requested is outside of the image window, [0,0,0,255] is
 * returned. To get the numbers scaled according to the current color ranges
 * and taking into account <a href="#/p5/colorMode">colorMode</a>, use <a href="#/p5/getColor">getColor</a> instead of get.
 * <br><br>
 * Getting the color of a single pixel with get(x, y) is easy, but not as fast
 * as grabbing the data directly from <a href="#/p5/pixels">pixels[]</a>. The equivalent statement to
 * get(x, y) using <a href="#/p5/pixels">pixels[]</a> with pixel density d is
 * <code>
 * var x, y, d; // set these to the coordinates
 * var off = (y * width + x) * d * 4;
 * var components = [
 *   pixels[off],
 *   pixels[off + 1],
 *   pixels[off + 2],
 *   pixels[off + 3]
 * ];
 * print(components);
 * </code>
 * <br><br>
 * See the reference for <a href="#/p5/pixels">pixels[]</a> for more information.
 *
 * If you want to extract an array of colors or a subimage from an p5.Image object,
 * take a look at <a href="#/p5.Image/get">p5.Image.get()</a>
 *
 * @method get
 * @param  {Number}         [x] x-coordinate of the pixel
 * @param  {Number}         [y] y-coordinate of the pixel
 * @param  {Number}         [w] width
 * @param  {Number}         [h] height
 * @return {Number[]|p5.Image}  values of pixel at x,y in array format
 *                              [R, G, B, A] or <a href="#/p5.Image">p5.Image</a>
 * @example
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage('assets/rockies.jpg');
 * }
 * function setup() {
 *   image(img, 0, 0);
 *   var c = get();
 *   image(c, width / 2, 0);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage('assets/rockies.jpg');
 * }
 * function setup() {
 *   image(img, 0, 0);
 *   var c = get(50, 90);
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
 *
 */
p5.prototype.get = function(x, y, w, h) {
  if (typeof w === 'undefined' && typeof h === 'undefined') {
    if (typeof x === 'undefined' && typeof y === 'undefined') {
      x = y = 0;
      w = this.width;
      h = this.height;
    } else {
      w = h = 1;
    }
  }

  // if the section does not overlap the canvas
  if (x + w < 0 || y + h < 0 || x >= this.width || y >= this.height) {
    // TODO: is this valid for w,h > 1 ?
    return [0, 0, 0, 255];
  }

  // round down to get integer numbers
  x = Math.floor(x);
  y = Math.floor(y);
  w = Math.floor(w);
  h = Math.floor(h);

  if (this instanceof p5.Image) {
    return p5.Renderer2D.prototype.get.call(this, x, y, w, h);
  } else {
    return this._renderer.get(x, y, w, h);
  }
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
 * var img;
 * function preload() {
 *   img = loadImage('assets/rockies.jpg');
 * }
 *
 * function setup() {
 *   image(img, 0, 0);
 *   var d = pixelDensity();
 *   var halfImage = 4 * (img.width * d) * (img.height * d / 2);
 *   loadPixels();
 *   for (var i = 0; i < halfImage; i++) {
 *     pixels[i + halfImage] = pixels[i];
 *   }
 *   updatePixels();
 * }
 * </code>
 * </div>
 *
 * @alt
 * two images of the rocky mountains. one on top, one on bottom of canvas.
 *
 */
p5.prototype.loadPixels = function() {
  p5._validateParameters('loadPixels', arguments);
  this._renderer.loadPixels();
};

/**
 * <p>Changes the color of any pixel, or writes an image directly to the
 * display window.</p>
 * <p>The x and y parameters specify the pixel to change and the c parameter
 * specifies the color value. This can be a <a href="#/p5.Color">p5.Color</a> object, or [R, G, B, A]
 * pixel array. It can also be a single grayscale value.
 * When setting an image, the x and y parameters define the coordinates for
 * the upper-left corner of the image, regardless of the current <a href="#/p5/imageMode">imageMode()</a>.
 * </p>
 * <p>
 * After using <a href="#/p5/set">set()</a>, you must call <a href="#/p5/updatePixels">updatePixels()</a> for your changes to appear.
 * This should be called once all pixels have been set, and must be called before
 * calling .<a href="#/p5/get">get()</a> or drawing the image.
 * </p>
 * <p>Setting the color of a single pixel with set(x, y) is easy, but not as
 * fast as putting the data directly into <a href="#/p5/pixels">pixels[]</a>. Setting the <a href="#/p5/pixels">pixels[]</a>
 * values directly may be complicated when working with a retina display,
 * but will perform better when lots of pixels need to be set directly on
 * every loop.</p>
 * <p>See the reference for <a href="#/p5/pixels">pixels[]</a> for more information.</p>
 *
 * @method set
 * @param {Number}              x x-coordinate of the pixel
 * @param {Number}              y y-coordinate of the pixel
 * @param {Number|Number[]|Object} c insert a grayscale value | a pixel array |
 *                                a <a href="#/p5.Color">p5.Color</a> object | a <a href="#/p5.Image">p5.Image</a> to copy
 * @example
 * <div>
 * <code>
 * var black = color(0);
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
 * for (var i = 30; i < width - 15; i++) {
 *   for (var j = 20; j < height - 25; j++) {
 *     var c = color(204 - j, 153 - i, 0);
 *     set(i, j, c);
 *   }
 * }
 * updatePixels();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * var img;
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
 * var img;
 * function preload() {
 *   img = loadImage('assets/rockies.jpg');
 * }
 *
 * function setup() {
 *   image(img, 0, 0);
 *   var d = pixelDensity();
 *   var halfImage = 4 * (img.width * d) * (img.height * d / 2);
 *   loadPixels();
 *   for (var i = 0; i < halfImage; i++) {
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

module.exports = p5;
