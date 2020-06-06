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

import p5 from '../core/main';
import Filters from './filters';

/*
 * Class methods
 */

/**
 * Creates a new <a href="#/p5.Image">p5.Image</a>. A <a href="#/p5.Image">p5.Image</a> is a canvas backed representation of an
 * image.
 *
 * p5 can display .gif, .jpg and .png images. Images may be displayed
 * in 2D and 3D space. Before an image is used, it must be loaded with the
 * <a href="#/p5/loadImage">loadImage()</a> function. The <a href="#/p5.Image">p5.Image</a> class contains fields for the width and
 * height of the image, as well as an array called <a href="#/p5.Image/pixels">pixels[]</a> that contains the
 * values for every pixel in the image.
 *
 * The methods described below allow easy access to the image's pixels and
 * alpha channel and simplify the process of compositing.
 *
 * Before using the <a href="#/p5.Image/pixels">pixels[]</a> array, be sure to use the <a href="#/p5.Image/loadPixels">loadPixels()</a> method on
 * the image to make sure that the pixel data is properly loaded.
 * @example
 * <div><code>
 * function setup() {
 *   let img = createImage(100, 100); // same as new p5.Image(100, 100);
 *   img.loadPixels();
 *   createCanvas(100, 100);
 *   background(0);
 *
 *   // helper for writing color to array
 *   function writeColor(image, x, y, red, green, blue, alpha) {
 *     let index = (x + y * width) * 4;
 *     image.pixels[index] = red;
 *     image.pixels[index + 1] = green;
 *     image.pixels[index + 2] = blue;
 *     image.pixels[index + 3] = alpha;
 *   }
 *
 *   let x, y;
 *   // fill with random colors
 *   for (y = 0; y < img.height; y++) {
 *     for (x = 0; x < img.width; x++) {
 *       let red = random(255);
 *       let green = random(255);
 *       let blue = random(255);
 *       let alpha = 255;
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
 * @class p5.Image
 * @constructor
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
   * let img;
   * function preload() {
   *   img = loadImage('assets/rockies.jpg');
   * }
   *
   * function setup() {
   *   createCanvas(100, 100);
   *   image(img, 0, 0);
   *   for (let i = 0; i < img.width; i++) {
   *     let c = img.get(i, img.height / 2);
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
   * let img;
   * function preload() {
   *   img = loadImage('assets/rockies.jpg');
   * }
   *
   * function setup() {
   *   createCanvas(100, 100);
   *   image(img, 0, 0);
   *   for (let i = 0; i < img.height; i++) {
   *     let c = img.get(img.width / 2, i);
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
  this._pixelsState = this;
  this._pixelDensity = 1;
  //Object for working with GIFs, defaults to null
  this.gifProperties = null;
  //For WebGL Texturing only: used to determine whether to reupload texture to GPU
  this._modified = false;
  /**
   * Array containing the values for all the pixels in the display window.
   * These values are numbers. This array is the size (include an appropriate
   * factor for pixelDensity) of the display window x4,
   * representing the R, G, B, A values in order for each pixel, moving from
   * left to right across each row, then down each column. Retina and other
   * high density displays may have more pixels (by a factor of
   * pixelDensity^2).
   * For example, if the image is 100x100 pixels, there will be 40,000. With
   * pixelDensity = 2, there will be 160,000. The first four values
   * (indices 0-3) in the array will be the R, G, B, A values of the pixel at
   * (0, 0). The second four values (indices 4-7) will contain the R, G, B, A
   * values of the pixel at (1, 0). More generally, to set values for a pixel
   * at (x, y):
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
   *
   * Before accessing this array, the data must loaded with the <a href="#/p5.Image/loadPixels">loadPixels()</a>
   * function. After the array data has been modified, the <a href="#/p5.Image/updatePixels">updatePixels()</a>
   * function must be run to update the changes.
   * @property {Number[]} pixels
   * @example
   * <div>
   * <code>
   * let img = createImage(66, 66);
   * img.loadPixels();
   * for (let i = 0; i < img.width; i++) {
   *   for (let j = 0; j < img.height; j++) {
   *     img.set(i, j, color(0, 90, 102));
   *   }
   * }
   * img.updatePixels();
   * image(img, 17, 17);
   * </code>
   * </div>
   * <div>
   * <code>
   * let pink = color(255, 102, 204);
   * let img = createImage(66, 66);
   * img.loadPixels();
   * for (let i = 0; i < 4 * (width * height / 2); i += 4) {
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
 * Helper function for animating GIF-based images with time
 */
p5.Image.prototype._animateGif = function(pInst) {
  const props = this.gifProperties;
  if (props.playing) {
    props.timeDisplayed += pInst.deltaTime;
    const curDelay = props.frames[props.displayIndex].delay;
    if (props.timeDisplayed >= curDelay) {
      //GIF is bound to 'realtime' so can skip frames
      const skips = Math.floor(props.timeDisplayed / curDelay);
      props.timeDisplayed = 0;
      props.displayIndex += skips;
      props.loopCount = Math.floor(props.displayIndex / props.numFrames);
      if (props.loopLimit !== null && props.loopCount >= props.loopLimit) {
        props.playing = false;
      } else {
        const ind = props.displayIndex % props.numFrames;
        this.drawingContext.putImageData(props.frames[ind].image, 0, 0);
        props.displayIndex = ind;
        this.setModified(true);
      }
    }
  }
};

/**
 * Helper fxn for sharing pixel methods
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
 * let myImage;
 * let halfImage;
 *
 * function preload() {
 *   myImage = loadImage('assets/rockies.jpg');
 * }
 *
 * function setup() {
 *   myImage.loadPixels();
 *   halfImage = 4 * myImage.width * myImage.height / 2;
 *   for (let i = 0; i < halfImage; i++) {
 *     myImage.pixels[i + halfImage] = myImage.pixels[i];
 *   }
 *   myImage.updatePixels();
 * }
 *
 * function draw() {
 *   image(myImage, 0, 0, width, height);
 * }
 * </code></div>
 *
 * @alt
 * 2 images of rocky mountains vertically stacked
 */
p5.Image.prototype.loadPixels = function() {
  p5.Renderer2D.prototype.loadPixels.call(this);
  this.setModified(true);
};

/**
 * Updates the backing canvas for this image with the contents of
 * the [pixels] array.
 *
 * If this image is an animated GIF then the pixels will be updated
 * in the frame that is currently displayed.
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
 * let myImage;
 * let halfImage;
 *
 * function preload() {
 *   myImage = loadImage('assets/rockies.jpg');
 * }
 *
 * function setup() {
 *   myImage.loadPixels();
 *   halfImage = 4 * myImage.width * myImage.height / 2;
 *   for (let i = 0; i < halfImage; i++) {
 *     myImage.pixels[i + halfImage] = myImage.pixels[i];
 *   }
 *   myImage.updatePixels();
 * }
 *
 * function draw() {
 *   image(myImage, 0, 0, width, height);
 * }
 * </code></div>
 *
 * @alt
 * 2 images of rocky mountains vertically stacked
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
 * If no params are passed, the whole image is returned.
 * If x and y are the only params passed a single pixel is extracted.
 * If all params are passed a rectangle region is extracted and a <a href="#/p5.Image">p5.Image</a>
 * is returned.
 *
 * @method get
 * @param  {Number}               x x-coordinate of the pixel
 * @param  {Number}               y y-coordinate of the pixel
 * @param  {Number}               w width
 * @param  {Number}               h height
 * @return {p5.Image}             the rectangle <a href="#/p5.Image">p5.Image</a>
 * @example
 * <div><code>
 * let myImage;
 * let c;
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
p5.Image.prototype.get = function(x, y, w, h) {
  p5._validateParameters('p5.Image.get', arguments);
  return p5.Renderer2D.prototype.get.apply(this, arguments);
};

p5.Image.prototype._getPixel = p5.Renderer2D.prototype._getPixel;

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
 * let img = createImage(66, 66);
 * img.loadPixels();
 * for (let i = 0; i < img.width; i++) {
 *   for (let j = 0; j < img.height; j++) {
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
 * let img;
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

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;

  if (this.gifProperties) {
    const props = this.gifProperties;
    //adapted from github.com/LinusU/resize-image-data
    const nearestNeighbor = (src, dst) => {
      let pos = 0;
      for (let y = 0; y < dst.height; y++) {
        for (let x = 0; x < dst.width; x++) {
          const srcX = Math.floor(x * src.width / dst.width);
          const srcY = Math.floor(y * src.height / dst.height);
          let srcPos = (srcY * src.width + srcX) * 4;
          dst.data[pos++] = src.data[srcPos++]; // R
          dst.data[pos++] = src.data[srcPos++]; // G
          dst.data[pos++] = src.data[srcPos++]; // B
          dst.data[pos++] = src.data[srcPos++]; // A
        }
      }
    };
    for (let i = 0; i < props.numFrames; i++) {
      const resizedImageData = this.drawingContext.createImageData(
        width,
        height
      );
      nearestNeighbor(props.frames[i].image, resizedImageData);
      props.frames[i].image = resizedImageData;
    }
  }

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
 * let photo;
 * let bricks;
 * let x;
 * let y;
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
p5.Image.prototype.copy = function(...args) {
  p5.prototype.copy.apply(this, args);
};

/**
 * Masks part of an image from displaying by loading another
 * image and using its alpha channel as an alpha channel for
 * this image.
 *
 * @method mask
 * @param {p5.Image} srcImage source image
 * @example
 * <div><code>
 * let photo, maskImage;
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
 * http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
 */
// TODO: - Accept an array of alpha values.
//       - Use other channels of an image. p5 uses the
//       blue channel (which feels kind of arbitrary). Note: at the
//       moment this method does not match native processing's original
//       functionality exactly.
p5.Image.prototype.mask = function(p5Image) {
  if (p5Image === undefined) {
    p5Image = this;
  }
  const currBlend = this.drawingContext.globalCompositeOperation;

  let scaleFactor = 1;
  if (p5Image instanceof p5.Renderer) {
    scaleFactor = p5Image._pInst._pixelDensity;
  }

  const copyArgs = [
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
 * let photo1;
 * let photo2;
 *
 * function preload() {
 *   photo1 = loadImage('assets/rockies.jpg');
 *   photo2 = loadImage('assets/rockies.jpg');
 * }
 *
 * function setup() {
 *   photo2.filter(GRAY);
 *   image(photo1, 0, 0);
 *   image(photo2, width / 2, 0);
 * }
 * </code></div>
 *
 * @alt
 * 2 images of rocky mountains left one in color, right in black and white
 */
p5.Image.prototype.filter = function(operation, value) {
  Filters.apply(this.canvas, Filters[operation], value);
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
 * http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
 * @example
 * <div><code>
 * let mountains;
 * let bricks;
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
 * let mountains;
 * let bricks;
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
 * let mountains;
 * let bricks;
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
p5.Image.prototype.blend = function(...args) {
  p5._validateParameters('p5.Image.blend', arguments);
  p5.prototype.blend.apply(this, args);
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
 * Supports png (default), jpg, and gif
 *<br><br>
 * Note that the file will only be downloaded as an animated GIF
 * if the p5.Image was loaded from a GIF file.
 * @method save
 * @param {String} filename give your file a name
 * @param  {String} extension 'png' or 'jpg'
 * @example
 * <div><code>
 * let photo;
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
 */
p5.Image.prototype.save = function(filename, extension) {
  if (this.gifProperties) {
    p5.prototype.saveGif(this, filename);
  } else {
    p5.prototype.saveCanvas(this.canvas, filename, extension);
  }
};

// GIF Section
/**
 * Starts an animated GIF over at the beginning state.
 *
 * @method reset
 * @example
 * <div><code>
 * let gif;
 *
 * function preload() {
 *   gif = loadImage('assets/arnott-wallace-wink-loop-once.gif');
 * }
 *
 * function draw() {
 *   background(255);
 *   // The GIF file that we loaded only loops once
 *   // so it freezes on the last frame after playing through
 *   image(gif, 0, 0);
 * }
 *
 * function mousePressed() {
 *   // Click to reset the GIF and begin playback from start
 *   gif.reset();
 * }
 * </code></div>
 * @alt
 * Animated image of a cartoon face that winks once and then freezes
 * When you click it animates again, winks once and freezes
 */
p5.Image.prototype.reset = function() {
  if (this.gifProperties) {
    const props = this.gifProperties;
    props.playing = true;
    props.timeSinceStart = 0;
    props.timeDisplayed = 0;
    props.loopCount = 0;
    props.displayIndex = 0;
    this.drawingContext.putImageData(props.frames[0].image, 0, 0);
  }
};

/**
 * Gets the index for the frame that is currently visible in an animated GIF.
 *
 * @method getCurrentFrame
 * @return {Number}       The index for the currently displaying frame in animated GIF
 * @example
 * <div><code>
 * let gif;
 *
 * function preload() {
 *   gif = loadImage('assets/arnott-wallace-eye-loop-forever.gif');
 * }
 *
 * function draw() {
 *   let frame = gif.getCurrentFrame();
 *   image(gif, 0, 0);
 *   text(frame, 10, 90);
 * }
 * </code></div>
 * @alt
 * Animated image of a cartoon eye looking around and then
 * looking outwards, in the lower-left hand corner a number counts
 * up quickly to 124 and then starts back over at 0
 */
p5.Image.prototype.getCurrentFrame = function() {
  if (this.gifProperties) {
    const props = this.gifProperties;
    return props.displayIndex % props.numFrames;
  }
};

/**
 * Sets the index of the frame that is currently visible in an animated GIF
 *
 * @method setFrame
 * @param {Number}       index the index for the frame that should be displayed
 * @example
 * <div><code>
 * let gif;
 *
 * function preload() {
 *   gif = loadImage('assets/arnott-wallace-eye-loop-forever.gif');
 * }
 *
 * // Move your mouse up and down over canvas to see the GIF
 * // frames animate
 * function draw() {
 *   gif.pause();
 *   image(gif, 0, 0);
 *   // Get the highest frame number which is the number of frames - 1
 *   let maxFrame = gif.numFrames() - 1;
 *   // Set the current frame that is mapped to be relative to mouse position
 *   let frameNumber = floor(map(mouseY, 0, height, 0, maxFrame, true));
 *   gif.setFrame(frameNumber);
 * }
 * </code></div>
 * @alt
 * A still image of a cartoon eye that looks around when you move your mouse
 * up and down over the canvas
 */
p5.Image.prototype.setFrame = function(index) {
  if (this.gifProperties) {
    const props = this.gifProperties;
    if (index < props.numFrames && index >= 0) {
      props.timeDisplayed = 0;
      props.displayIndex = index;
      this.drawingContext.putImageData(props.frames[index].image, 0, 0);
    } else {
      console.log(
        'Cannot set GIF to a frame number that is higher than total number of frames or below zero.'
      );
    }
  }
};

/**
 * Returns the number of frames in an animated GIF
 *
 * @method numFrames
 * @return {Number}
 * @example     The number of frames in the animated GIF
 * <div><code>
 * let gif;
 *
 * function preload() {
 *   gif = loadImage('assets/arnott-wallace-eye-loop-forever.gif');
 * }
 *
 * // Move your mouse up and down over canvas to see the GIF
 * // frames animate
 * function draw() {
 *   gif.pause();
 *   image(gif, 0, 0);
 *   // Get the highest frame number which is the number of frames - 1
 *   let maxFrame = gif.numFrames() - 1;
 *   // Set the current frame that is mapped to be relative to mouse position
 *   let frameNumber = floor(map(mouseY, 0, height, 0, maxFrame, true));
 *   gif.setFrame(frameNumber);
 * }
 * </code></div>
 * @alt
 * A still image of a cartoon eye that looks around when you move your mouse
 * up and down over the canvas
 */
p5.Image.prototype.numFrames = function() {
  if (this.gifProperties) {
    return this.gifProperties.numFrames;
  }
};

/**
 * Plays an animated GIF that was paused with
 * <a href="#/p5.Image/pause">pause()</a>
 *
 * @method play
 * @example
 * <div><code>
 * let gif;
 *
 * function preload() {
 *   gif = loadImage('assets/nancy-liang-wind-loop-forever.gif');
 * }
 *
 * function draw() {
 *   background(255);
 *   image(gif, 0, 0);
 * }
 *
 * function mousePressed() {
 *   gif.pause();
 * }
 *
 * function mouseReleased() {
 *   gif.play();
 * }
 * </code></div>
 * @alt
 * An animated GIF of a drawing of small child with
 * hair blowing in the wind, when you click the image
 * freezes when you release it animates again
 */
p5.Image.prototype.play = function() {
  if (this.gifProperties) {
    this.gifProperties.playing = true;
  }
};

/**
 * Pauses an animated GIF.
 *
 * @method pause
 * @example
 * <div><code>
 * let gif;
 *
 * function preload() {
 *   gif = loadImage('assets/nancy-liang-wind-loop-forever.gif');
 * }
 *
 * function draw() {
 *   background(255);
 *   image(gif, 0, 0);
 * }
 *
 * function mousePressed() {
 *   gif.pause();
 * }
 *
 * function mouseReleased() {
 *   gif.play();
 * }
 * </code></div>
 * @alt
 * An animated GIF of a drawing of small child with
 * hair blowing in the wind, when you click the image
 * freezes when you release it animates again
 */
p5.Image.prototype.pause = function() {
  if (this.gifProperties) {
    this.gifProperties.playing = false;
  }
};

/**
 * Changes the delay between frames in an animated GIF. There is an optional second parameter that
 * indicates an index for a specific frame that should have its delay modified. If no index is given, all frames
 * will have the new delay.
 *
 * @method delay
 * @param {Number}    d the amount in milliseconds to delay between switching frames
 * @param {Number}    [index] the index of the frame that should have the new delay value {optional}
 * @example
 * <div><code>
 * let gifFast, gifSlow;
 *
 * function preload() {
 *   gifFast = loadImage('assets/arnott-wallace-eye-loop-forever.gif');
 *   gifSlow = loadImage('assets/arnott-wallace-eye-loop-forever.gif');
 * }
 *
 * function setup() {
 *   gifFast.resize(width / 2, height / 2);
 *   gifSlow.resize(width / 2, height / 2);
 *
 *   //Change the delay here
 *   gifFast.delay(10);
 *   gifSlow.delay(100);
 * }
 *
 * function draw() {
 *   background(255);
 *   image(gifFast, 0, 0);
 *   image(gifSlow, width / 2, 0);
 * }
 * </code></div>
 * @alt
 * Two animated gifs of cartoon eyes looking around
 * The gif on the left animates quickly, on the right
 * the animation is much slower
 */
p5.Image.prototype.delay = function(d, index) {
  if (this.gifProperties) {
    const props = this.gifProperties;
    if (index < props.numFrames && index >= 0) {
      props.frames[index].delay = d;
    } else {
      // change all frames
      for (const frame of props.frames) {
        frame.delay = d;
      }
    }
  }
};

export default p5.Image;
