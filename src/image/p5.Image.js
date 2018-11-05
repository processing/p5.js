/**
 * @module Image
 * @submodule Image
 * @requires core
 * @requires constants
 * @requires filters
 */

/**
 * This module defines the <a href="#/p5.Image">p5.Image</a> class and P5 methods for
 * drawing images to the main display canvas.
 */

'use strict';

var p5 = require('../core/main');
var Filters = require('./filters');

/*
 * Class methods
 */

/**
 * Creates a new <a href="#/p5.Image">p5.Image</a>. A <a href="#/p5.Image">p5.Image</a> is a canvas backed representation of an
 * image.
 * <br><br>
 * p5 can display .gif, .jpg and .png images. Images may be displayed
 * in 2D and 3D space. Before an image is used, it must be loaded with the
 * <a href="#/p5/loadImage">loadImage()</a> function. The <a href="#/p5.Image">p5.Image</a> class contains fields for the width and
 * height of the image, as well as an array called <a href="#/p5.Image/pixels">pixels[]</a> that contains the
 * values for every pixel in the image.
 * <br><br>
 * The methods described below allow easy access to the image's pixels and
 * alpha channel and simplify the process of compositing.
 * <br><br>
 * Before using the <a href="#/p5.Image/pixels">pixels[]</a> array, be sure to use the <a href="#/p5.Image/loadPixels">loadPixels()</a> method on
 * the image to make sure that the pixel data is properly loaded.
 * @example
 * <div><code>
 * function setup() {
 *   var img = createImage(100, 100); // same as new p5.Image(100, 100);
 *   img.loadPixels();
 *   createCanvas(100, 100);
 *   background(0);
 *
 *   // helper for writing color to array
 *   function writeColor(image, x, y, red, green, blue, alpha) {
 *     var index = (x + y * width) * 4;
 *     image.pixels[index] = red;
 *     image.pixels[index + 1] = green;
 *     image.pixels[index + 2] = blue;
 *     image.pixels[index + 3] = alpha;
 *   }
 *
 *   var x, y;
 *   // fill with random colors
 *   for (y = 0; y < img.height; y++) {
 *     for (x = 0; x < img.width; x++) {
 *       var red = random(255);
 *       var green = random(255);
 *       var blue = random(255);
 *       var alpha = 255;
 *       writeColor(img, x, y, red, green, blue, alpha);
 *     }
 *   }
 *
 *   // draw a red line
 *   y = 0;
 *   for (x = 0; x < img.width; x++) {
 *     writeColor(img, x, y, 255, 0, 0, 255);
 *   }
 *
 *   // draw a green line
 *   y = img.height - 1;
 *   for (x = 0; x < img.width; x++) {
 *     writeColor(img, x, y, 0, 255, 0, 255);
 *   }
 *
 *   img.updatePixels();
 *   image(img, 0, 0);
 * }
 * </code></div>
 *
 *
 * @class p5.Image
 * @param {Number} width
 * @param {Number} height
 */
p5.Image = function(width, height) {
  /**
   * Image width.
   * @property {Number} width
   * @readOnly
   * @example
   * <div><code>
   * var img;
   * function preload() {
   *   img = loadImage('assets/rockies.jpg');
   * }
   *
   * function setup() {
   *   createCanvas(100, 100);
   *   image(img, 0, 0);
   *   for (var i = 0; i < img.width; i++) {
   *     var c = img.get(i, img.height / 2);
   *     stroke(c);
   *     line(i, height / 2, i, height);
   *   }
   * }
   * </code></div>
   *
   * @alt
   * rocky mountains in top and horizontal lines in corresponding colors in bottom.
   *
   */
  this.width = width;
  /**
   * Image height.
   * @property {Number} height
   * @readOnly
   * @example
   * <div><code>
   * var img;
   * function preload() {
   *   img = loadImage('assets/rockies.jpg');
   * }
   *
   * function setup() {
   *   createCanvas(100, 100);
   *   image(img, 0, 0);
   *   for (var i = 0; i < img.height; i++) {
   *     var c = img.get(img.width / 2, i);
   *     stroke(c);
   *     line(0, i, width / 2, i);
   *   }
   * }
   * </code></div>
   *
   * @alt
   * rocky mountains on right and vertical lines in corresponding colors on left.
   *
   */
  this.height = height;
  this.canvas = document.createElement('canvas');
  this.canvas.width = this.width;
  this.canvas.height = this.height;
  this.drawingContext = this.canvas.getContext('2d');
  this._pixelDensity = 1;
  //used for webgl texturing only
  this._modified = false;
  this._pixelsDirty = true;
  /**
   * Array containing the values for all the pixels in the display window.
   * These values are numbers. This array is the size (include an appropriate
   * factor for pixelDensity) of the display window x4,
   * representing the R, G, B, A values in order for each pixel, moving from
   * left to right across each row, then down each column. Retina and other
   * high denisty displays may have more pixels (by a factor of
   * pixelDensity^2).
   * For example, if the image is 100x100 pixels, there will be 40,000. With
   * pixelDensity = 2, there will be 160,000. The first four values
   * (indices 0-3) in the array will be the R, G, B, A values of the pixel at
   * (0, 0). The second four values (indices 4-7) will contain the R, G, B, A
   * values of the pixel at (1, 0). More generally, to set values for a pixel
   * at (x, y):
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
   * <br><br>
   * Before accessing this array, the data must loaded with the <a href="#/p5.Image/loadPixels">loadPixels()</a>
   * function. After the array data has been modified, the <a href="#/p5.Image/updatePixels">updatePixels()</a>
   * function must be run to update the changes.
   * @property {Number[]} pixels
   * @example
   * <div>
   * <code>
   * var img = createImage(66, 66);
   * img.loadPixels();
   * for (var i = 0; i < img.width; i++) {
   *   for (var j = 0; j < img.height; j++) {
   *     img.set(i, j, color(0, 90, 102));
   *   }
   * }
   * img.updatePixels();
   * image(img, 17, 17);
   * </code>
   * </div>
   * <div>
   * <code>
   * var pink = color(255, 102, 204);
   * var img = createImage(66, 66);
   * img.loadPixels();
   * for (var i = 0; i < 4 * (width * height / 2); i += 4) {
   *   img.pixels[i] = red(pink);
   *   img.pixels[i + 1] = green(pink);
   *   img.pixels[i + 2] = blue(pink);
   *   img.pixels[i + 3] = alpha(pink);
   * }
   * img.updatePixels();
   * image(img, 17, 17);
   * </code>
   * </div>
   *
   * @alt
   * 66x66 turquoise rect in center of canvas
   * 66x66 pink rect in center of canvas
   *
   */
  this.pixels = [];
};

/**
 * Helper fxn for sharing pixel methods
 *
 */
p5.Image.prototype._setProperty = function(prop, value) {
  this[prop] = value;
  this.setModified(true);
};

/**
 * Loads the pixels data for this image into the [pixels] attribute.
 *
 * @method loadPixels
 * @example
 * <div><code>
 * var myImage;
 * var halfImage;
 *
 * function preload() {
 *   myImage = loadImage('assets/rockies.jpg');
 * }
 *
 * function setup() {
 *   myImage.loadPixels();
 *   halfImage = 4 * width * height / 2;
 *   for (var i = 0; i < halfImage; i++) {
 *     myImage.pixels[i + halfImage] = myImage.pixels[i];
 *   }
 *   myImage.updatePixels();
 * }
 *
 * function draw() {
 *   image(myImage, 0, 0);
 * }
 * </code></div>
 *
 * @alt
 * 2 images of rocky mountains vertically stacked
 *
 */
p5.Image.prototype.loadPixels = function() {
  p5.Renderer2D.prototype.loadPixels.call(this);
  this.setModified(true);
};

/**
 * Updates the backing canvas for this image with the contents of
 * the [pixels] array.
 *
 * @method updatePixels
 * @param {Integer} x x-offset of the target update area for the
 *                              underlying canvas
 * @param {Integer} y y-offset of the target update area for the
 *                              underlying canvas
 * @param {Integer} w height of the target update area for the
 *                              underlying canvas
 * @param {Integer} h height of the target update area for the
 *                              underlying canvas
 * @example
 * <div><code>
 * var myImage;
 * var halfImage;
 *
 * function preload() {
 *   myImage = loadImage('assets/rockies.jpg');
 * }
 *
 * function setup() {
 *   myImage.loadPixels();
 *   halfImage = 4 * width * height / 2;
 *   for (var i = 0; i < halfImage; i++) {
 *     myImage.pixels[i + halfImage] = myImage.pixels[i];
 *   }
 *   myImage.updatePixels();
 * }
 *
 * function draw() {
 *   image(myImage, 0, 0);
 * }
 * </code></div>
 *
 * @alt
 * 2 images of rocky mountains vertically stacked
 *
 */
/**
 * @method updatePixels
 */
p5.Image.prototype.updatePixels = function(x, y, w, h) {
  p5.Renderer2D.prototype.updatePixels.call(this, x, y, w, h);
  this.setModified(true);
};

/**
 * Get a region of pixels from an image.
 *
 * If no params are passed, those whole image is returned,
 * if x and y are the only params passed a single pixel is extracted
 * if all params are passed a rectangle region is extracted and a <a href="#/p5.Image">p5.Image</a>
 * is returned.
 *
 * Returns undefined if the region is outside the bounds of the image
 *
 * @method get
 * @param  {Number}               [x] x-coordinate of the pixel
 * @param  {Number}               [y] y-coordinate of the pixel
 * @param  {Number}               [w] width
 * @param  {Number}               [h] height
 * @return {Number[]|Color|p5.Image}  color of pixel at x,y in array format
 *                                    [R, G, B, A] or <a href="#/p5.Image">p5.Image</a>
 * @example
 * <div><code>
 * var myImage;
 * var c;
 *
 * function preload() {
 *   myImage = loadImage('assets/rockies.jpg');
 * }
 *
 * function setup() {
 *   background(myImage);
 *   noStroke();
 *   c = myImage.get(60, 90);
 *   fill(c);
 *   rect(25, 25, 50, 50);
 * }
 *
 * //get() returns color here
 * </code></div>
 *
 * @alt
 * image of rocky mountains with 50x50 green rect in front
 *
 */
p5.Image.prototype.get = function(x, y, w, h) {
  return p5.prototype.get.call(this, x, y, w, h);
};

/**
 * Set the color of a single pixel or write an image into
 * this <a href="#/p5.Image">p5.Image</a>.
 *
 * Note that for a large number of pixels this will
 * be slower than directly manipulating the pixels array
 * and then calling <a href="#/p5.Image/updatePixels">updatePixels()</a>.
 *
 * @method set
 * @param {Number}              x x-coordinate of the pixel
 * @param {Number}              y y-coordinate of the pixel
 * @param {Number|Number[]|Object}   a grayscale value | pixel array |
 *                                a <a href="#/p5.Color">p5.Color</a> | image to copy
 * @example
 * <div>
 * <code>
 * var img = createImage(66, 66);
 * img.loadPixels();
 * for (var i = 0; i < img.width; i++) {
 *   for (var j = 0; j < img.height; j++) {
 *     img.set(i, j, color(0, 90, 102, (i % img.width) * 2));
 *   }
 * }
 * img.updatePixels();
 * image(img, 17, 17);
 * image(img, 34, 34);
 * </code>
 * </div>
 *
 * @alt
 * 2 gradated dark turquoise rects fade left. 1 center 1 bottom right of canvas
 *
 */
p5.Image.prototype.set = function(x, y, imgOrCol) {
  p5.Renderer2D.prototype.set.call(this, x, y, imgOrCol);
  this.setModified(true);
};

/**
 * Resize the image to a new width and height. To make the image scale
 * proportionally, use 0 as the value for the wide or high parameter.
 * For instance, to make the width of an image 150 pixels, and change
 * the height using the same proportion, use resize(150, 0).
 *
 * @method resize
 * @param {Number} width the resized image width
 * @param {Number} height the resized image height
 * @example
 * <div><code>
 * var img;
 *
 * function preload() {
 *   img = loadImage('assets/rockies.jpg');
 * }

 * function draw() {
 *   image(img, 0, 0);
 * }
 *
 * function mousePressed() {
 *   img.resize(50, 100);
 * }
 * </code></div>
 *
 * @alt
 * image of rocky mountains. zoomed in
 *
 */
p5.Image.prototype.resize = function(width, height) {
  // Copy contents to a temporary canvas, resize the original
  // and then copy back.
  //
  // There is a faster approach that involves just one copy and swapping the
  // this.canvas reference. We could switch to that approach if (as i think
  // is the case) there an expectation that the user would not hold a
  // reference to the backing canvas of a p5.Image. But since we do not
  // enforce that at the moment, I am leaving in the slower, but safer
  // implementation.

  // auto-resize
  if (width === 0 && height === 0) {
    width = this.canvas.width;
    height = this.canvas.height;
  } else if (width === 0) {
    width = this.canvas.width * height / this.canvas.height;
  } else if (height === 0) {
    height = this.canvas.height * width / this.canvas.width;
  }

  width = Math.floor(width);
  height = Math.floor(height);

  var tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  // prettier-ignore
  tempCanvas.getContext('2d').drawImage(
    this.canvas,
    0, 0, this.canvas.width, this.canvas.height,
    0, 0, tempCanvas.width, tempCanvas.height
  );

  // Resize the original canvas, which will clear its contents
  this.canvas.width = this.width = width;
  this.canvas.height = this.height = height;

  //Copy the image back

  // prettier-ignore
  this.drawingContext.drawImage(
    tempCanvas,
    0, 0, width, height,
    0, 0, width, height
  );

  if (this.pixels.length > 0) {
    this.loadPixels();
  }

  this.setModified(true);
  this._pixelsDirty = true;
};

/**
 * Copies a region of pixels from one image to another. If no
 * srcImage is specified this is used as the source. If the source
 * and destination regions aren't the same size, it will
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
 * @example
 * <div><code>
 * var photo;
 * var bricks;
 * var x;
 * var y;
 *
 * function preload() {
 *   photo = loadImage('assets/rockies.jpg');
 *   bricks = loadImage('assets/bricks.jpg');
 * }
 *
 * function setup() {
 *   x = bricks.width / 2;
 *   y = bricks.height / 2;
 *   photo.copy(bricks, 0, 0, x, y, 0, 0, x, y);
 *   image(photo, 0, 0);
 * }
 * </code></div>
 *
 * @alt
 * image of rocky mountains and smaller image on top of bricks at top left
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
p5.Image.prototype.copy = function() {
  var srcImage, sx, sy, sw, sh, dx, dy, dw, dh;
  if (arguments.length === 9) {
    srcImage = arguments[0];
    sx = arguments[1];
    sy = arguments[2];
    sw = arguments[3];
    sh = arguments[4];
    dx = arguments[5];
    dy = arguments[6];
    dw = arguments[7];
    dh = arguments[8];
  } else if (arguments.length === 8) {
    srcImage = this;
    sx = arguments[0];
    sy = arguments[1];
    sw = arguments[2];
    sh = arguments[3];
    dx = arguments[4];
    dy = arguments[5];
    dw = arguments[6];
    dh = arguments[7];
  } else {
    throw new Error('Signature not supported');
  }
  p5.Renderer2D._copyHelper(this, srcImage, sx, sy, sw, sh, dx, dy, dw, dh);
  this._pixelsDirty = true;
};

/**
 * Masks part of an image from displaying by loading another
 * image and using it's alpha channel as an alpha channel for
 * this image.
 *
 * @method mask
 * @param {p5.Image} srcImage source image
 * @example
 * <div><code>
 * var photo, maskImage;
 * function preload() {
 *   photo = loadImage('assets/rockies.jpg');
 *   maskImage = loadImage('assets/mask2.png');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100);
 *   photo.mask(maskImage);
 *   image(photo, 0, 0);
 * }
 * </code></div>
 *
 * @alt
 * image of rocky mountains with white at right
 *
 *
 * http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
 *
 */
// TODO: - Accept an array of alpha values.
//       - Use other channels of an image. p5 uses the
//       blue channel (which feels kind of arbitrary). Note: at the
//       moment this method does not match native processings original
//       functionality exactly.
p5.Image.prototype.mask = function(p5Image) {
  if (p5Image === undefined) {
    p5Image = this;
  }
  var currBlend = this.drawingContext.globalCompositeOperation;

  var scaleFactor = 1;
  if (p5Image instanceof p5.Renderer) {
    scaleFactor = p5Image._pInst._pixelDensity;
  }

  var copyArgs = [
    p5Image,
    0,
    0,
    scaleFactor * p5Image.width,
    scaleFactor * p5Image.height,
    0,
    0,
    this.width,
    this.height
  ];

  this.drawingContext.globalCompositeOperation = 'destination-in';
  p5.Image.prototype.copy.apply(this, copyArgs);
  this.drawingContext.globalCompositeOperation = currBlend;
  this.setModified(true);
};

/**
 * Applies an image filter to a <a href="#/p5.Image">p5.Image</a>
 *
 * @method filter
 * @param  {Constant} filterType  either THRESHOLD, GRAY, OPAQUE, INVERT,
 *                                POSTERIZE, BLUR, ERODE, DILATE or BLUR.
 *                                See Filters.js for docs on
 *                                each available filter
 * @param  {Number} [filterParam] an optional parameter unique
 *                                to each filter, see above
 * @example
 * <div><code>
 * var photo1;
 * var photo2;
 *
 * function preload() {
 *   photo1 = loadImage('assets/rockies.jpg');
 *   photo2 = loadImage('assets/rockies.jpg');
 * }
 *
 * function setup() {
 *   photo2.filter('gray');
 *   image(photo1, 0, 0);
 *   image(photo2, width / 2, 0);
 * }
 * </code></div>
 *
 * @alt
 * 2 images of rocky mountains left one in color, right in black and white
 *
 */
p5.Image.prototype.filter = function(operation, value) {
  Filters.apply(this.canvas, Filters[operation.toLowerCase()], value);
  this.setModified(true);
};

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
 * Available blend modes are: normal | multiply | screen | overlay |
 *            darken | lighten | color-dodge | color-burn | hard-light |
 *            soft-light | difference | exclusion | hue | saturation |
 *            color | luminosity
 *
 *
 * http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
 * @example
 * <div><code>
 * var mountains;
 * var bricks;
 *
 * function preload() {
 *   mountains = loadImage('assets/rockies.jpg');
 *   bricks = loadImage('assets/bricks_third.jpg');
 * }
 *
 * function setup() {
 *   mountains.blend(bricks, 0, 0, 33, 100, 67, 0, 33, 100, ADD);
 *   image(mountains, 0, 0);
 *   image(bricks, 0, 0);
 * }
 * </code></div>
 * <div><code>
 * var mountains;
 * var bricks;
 *
 * function preload() {
 *   mountains = loadImage('assets/rockies.jpg');
 *   bricks = loadImage('assets/bricks_third.jpg');
 * }
 *
 * function setup() {
 *   mountains.blend(bricks, 0, 0, 33, 100, 67, 0, 33, 100, DARKEST);
 *   image(mountains, 0, 0);
 *   image(bricks, 0, 0);
 * }
 * </code></div>
 * <div><code>
 * var mountains;
 * var bricks;
 *
 * function preload() {
 *   mountains = loadImage('assets/rockies.jpg');
 *   bricks = loadImage('assets/bricks_third.jpg');
 * }
 *
 * function setup() {
 *   mountains.blend(bricks, 0, 0, 33, 100, 67, 0, 33, 100, LIGHTEST);
 *   image(mountains, 0, 0);
 *   image(bricks, 0, 0);
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
p5.Image.prototype.blend = function() {
  p5.prototype.blend.apply(this, arguments);
  this.setModified(true);
};

/**
 * helper method for web GL mode to indicate that an image has been
 * changed or unchanged since last upload. gl texture upload will
 * set this value to false after uploading the texture.
 * @method setModified
 * @param {boolean} val sets whether or not the image has been
 * modified.
 * @private
 */
p5.Image.prototype.setModified = function(val) {
  this._modified = val; //enforce boolean?
};

/**
 * helper method for web GL mode to figure out if the image
 * has been modified and might need to be re-uploaded to texture
 * memory between frames.
 * @method isModified
 * @private
 * @return {boolean} a boolean indicating whether or not the
 * image has been updated or modified since last texture upload.
 */
p5.Image.prototype.isModified = function() {
  return this._modified;
};

/**
 * Saves the image to a file and force the browser to download it.
 * Accepts two strings for filename and file extension
 * Supports png (default) and jpg.
 *
 * @method save
 * @param {String} filename give your file a name
 * @param  {String} extension 'png' or 'jpg'
 * @example
 * <div><code>
 * var photo;
 *
 * function preload() {
 *   photo = loadImage('assets/rockies.jpg');
 * }
 *
 * function draw() {
 *   image(photo, 0, 0);
 * }
 *
 * function keyTyped() {
 *   if (key === 's') {
 *     photo.save('photo', 'png');
 *   }
 * }
 * </code></div>
 *
 * @alt
 * image of rocky mountains.
 *
 */
p5.Image.prototype.save = function(filename, extension) {
  p5.prototype.saveCanvas(this.canvas, filename, extension);
};

module.exports = p5.Image;
