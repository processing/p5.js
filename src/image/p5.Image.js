/**
 * @module Image
 * @submodule Image
 * @requires core
 * @requires constants
 * @requires filters
 */

/**
 * This module defines the p5.Image class and P5 methods for
 * drawing images to the main display canvas.
 */

'use strict';

var p5 = require('../core/core');
var Filters = require('./filters');

/*
 * Class methods
 */

/**
 * Creates a new p5.Image. A p5.Image is a canvas backed representation of an
 * image. p5 can display .gif, .jpg and .png images. Images may be displayed
 * in 2D and 3D space. Before an image is used, it must be loaded with the
 * loadImage() function. The p5.Image class contains fields for the width and
 * height of the image, as well as an array called pixels[] that contains the
 * values for every pixel in the image. The methods described below allow
 * easy access to the image's pixels and alpha channel and simplify the
 * process of compositing.
 *
 * Before using the pixels[] array, be sure to use the loadPixels() method on
 * the image to make sure that the pixel data is properly loaded.
 *
 * @class p5.Image
 * @constructor
 * @param {Number} width
 * @param {Number} height
 * @param {Object} pInst An instance of a p5 sketch.
 */
p5.Image = function(width, height){
  /**
   * Image width.
   * @property width
   */
  this.width = width;
  /**
   * Image height.
   * @property height
   */
  this.height = height;
  this.canvas = document.createElement('canvas');
  this.canvas.width = this.width;
  this.canvas.height = this.height;
  this.drawingContext = this.canvas.getContext('2d');
  this.pixelDensity = 1;
  //used for webgl texturing only
  this.isTexture = false;
  /**
   * Array containing the values for all the pixels in the display window.
   * These values are numbers. This array is the size (include an appropriate
   * factor for pixelDensity) of the display window x4,
   * representing the R, G, B, A values in order for each pixel, moving from
   * left to right across each row, then down each column. Retina and other
   * high denisty displays may have more pixels[] (by a factor of
   * pixelDensity^2).
   * For example, if the image is 100x100 pixels, there will be 40,000. With
   * pixelDensity = 2, there will be 160,000. The first four values
   * (indices 0-3) in the array will be the R, G, B, A values of the pixel at
   * (0, 0). The second four values (indices 4-7) will contain the R, G, B, A
   * values of the pixel at (1, 0). More generally, to set values for a pixel
   * at (x, y):
   * <code><pre>var d = pixelDensity;
   * for (var i = 0; i < d; i++) {
   *   for (var j = 0; j < d; j++) {
   *     // loop over
   *     idx = 4*((y * d + j) * width * d + (x * d + i));
   *     pixels[idx] = r;
   *     pixels[idx+1] = g;
   *     pixels[idx+2] = b;
   *     pixels[idx+3] = a;
   *   }
   * }
   * </pre></code>
   * <br><br>
   * Before accessing this array, the data must loaded with the loadPixels()
   * function. After the array data has been modified, the updatePixels()
   * function must be run to update the changes.
   * @property pixels[]
   * @example
   * <div>
   * <code>
   * img = createImage(66, 66);
   * img.loadPixels();
   * for (i = 0; i < img.width; i++) {
   *   for (j = 0; j < img.height; j++) {
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
   * img = createImage(66, 66);
   * img.loadPixels();
   * for (var i = 0; i < 4*(width*height/2); i+=4) {
   *   img.pixels[i] = red(pink);
   *   img.pixels[i+1] = green(pink);
   *   img.pixels[i+2] = blue(pink);
   *   img.pixels[i+3] = alpha(pink);
   * }
   * img.updatePixels();
   * image(img, 17, 17);
   * </code>
   * </div>
   */
  this.pixels = [];
};

/**
 * Helper fxn for sharing pixel methods
 *
 */
p5.Image.prototype._setProperty = function (prop, value) {
  this[prop] = value;
};

/**
 * Loads the pixels data for this image into the [pixels] attribute.
 *
 * @method loadPixels
 */
p5.Image.prototype.loadPixels = function(){
  p5.Renderer2D.prototype.loadPixels.call(this);
};

/**
 * Updates the backing canvas for this image with the contents of
 * the [pixels] array.
 *
 * @method updatePixels
 * @param {Integer|undefined} x x-offset of the target update area for the
 *                              underlying canvas
 * @param {Integer|undefined} y y-offset of the target update area for the
 *                              underlying canvas
 * @param {Integer|undefined} w height of the target update area for the
 *                              underlying canvas
 * @param {Integer|undefined} h height of the target update area for the
 *                              underlying canvas
 */
p5.Image.prototype.updatePixels = function(x, y, w, h){
  p5.Renderer2D.prototype.updatePixels.call(this, x, y, w, h);
};

/**
 * Get a region of pixels from an image.
 *
 * If no params are passed, those whole image is returned,
 * if x and y are the only params passed a single pixel is extracted
 * if all params are passed a rectangle region is extracted and a p5.Image
 * is returned.
 *
 * Returns undefined if the region is outside the bounds of the image
 *
 * @method get
 * @param  {Number}               [x] x-coordinate of the pixel
 * @param  {Number}               [y] y-coordinate of the pixel
 * @param  {Number}               [w] width
 * @param  {Number}               [h] height
 * @return {Array/Color | p5.Image}     color of pixel at x,y in array format
 *                                    [R, G, B, A] or p5.Image
 */
p5.Image.prototype.get = function(x, y, w, h){
  return p5.Renderer2D.prototype.get.call(this, x, y, w, h);
};

/**
 * Set the color of a single pixel or write an image into
 * this p5.Image.
 *
 * Note that for a large number of pixels this will
 * be slower than directly manipulating the pixels array
 * and then calling updatePixels().
 *
 * @method set
 * @param {Number}              x x-coordinate of the pixel
 * @param {Number}              y y-coordinate of the pixel
 * @param {Number|Array|Object}   a grayscale value | pixel array |
 *                                a p5.Color | image to copy
 * @example
 * <div>
 * <code>
 * img = createImage(66, 66);
 * img.loadPixels();
 * for (i = 0; i < img.width; i++) {
 *   for (j = 0; j < img.height; j++) {
 *     img.set(i, j, color(0, 90, 102, i % img.width * 2));
 *   }
 * }
 * img.updatePixels();
 * image(img, 17, 17);
 * image(img, 34, 34);
 * </code>
 * </div>
 */
p5.Image.prototype.set = function(x, y, imgOrCol){
  p5.Renderer2D.prototype.set.call(this, x, y, imgOrCol);
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
 * function setup() {
 *   img = loadImage("assets/rockies.jpg");
 * }

 * function draw() {
 *   image(img, 0, 0);
 * }
 *
 * function mousePressed() {
 *   img.resize(50, 100);
 * }
 * </code></div>
 */
p5.Image.prototype.resize = function(width, height){

  // Copy contents to a temporary canvas, resize the original
  // and then copy back.
  //
  // There is a faster approach that involves just one copy and swapping the
  // this.canvas reference. We could switch to that approach if (as i think
  // is the case) there an expectation that the user would not hold a
  // reference to the backing canvas of a p5.Image. But since we do not
  // enforce that at the moment, I am leaving in the slower, but safer
  // implementation.
  width = width || this.canvas.width;
  height = height || this.canvas.height;

  var tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  tempCanvas.getContext('2d').drawImage(this.canvas,
    0, 0, this.canvas.width, this.canvas.height,
    0, 0, tempCanvas.width, tempCanvas.height
  );


  // Resize the original canvas, which will clear its contents
  this.canvas.width = this.width = width;
  this.canvas.height = this.height = height;

  //Copy the image back

  this.drawingContext.drawImage(tempCanvas,
    0, 0, width, height,
    0, 0, width, height
  );

  if(this.pixels.length > 0){
    this.loadPixels();
  }
};

/**
 * Copies a region of pixels from one image to another. If no
 * srcImage is specified this is used as the source. If the source
 * and destination regions aren't the same size, it will
 * automatically resize source pixels to fit the specified
 * target region.
 *
 * @method copy
 * @param  {p5.Image|undefined} srcImage source image
 * @param  {Integer} sx X coordinate of the source's upper left corner
 * @param  {Integer} sy Y coordinate of the source's upper left corner
 * @param  {Integer} sw source image width
 * @param  {Integer} sh source image height
 * @param  {Integer} dx X coordinate of the destination's upper left corner
 * @param  {Integer} dy Y coordinate of the destination's upper left corner
 * @param  {Integer} dw destination image width
 * @param  {Integer} dh destination image height
 */
p5.Image.prototype.copy = function () {
  p5.prototype.copy.apply(this, arguments);
};

/**
 * Masks part of an image from displaying by loading another
 * image and using it's alpha channel as an alpha channel for
 * this image.
 *
 * @method mask
 * @param {p5.Image|undefined} srcImage source image
 *
 * TODO: - Accept an array of alpha values.
 *       - Use other channels of an image. p5 uses the
 *       blue channel (which feels kind of arbitrary). Note: at the
 *       moment this method does not match native processings original
 *       functionality exactly.
 *
 * http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
 *
 */
p5.Image.prototype.mask = function(p5Image) {
  if(p5Image === undefined){
    p5Image = this;
  }
  var currBlend = this.drawingContext.globalCompositeOperation;

  var scaleFactor = 1;
  if (p5Image instanceof p5.Renderer) {
    scaleFactor = p5Image._pInst.pixelDensity;
  }

  var copyArgs = [
    p5Image,
    0,
    0,
    scaleFactor*p5Image.width,
    scaleFactor*p5Image.height,
    0,
    0,
    this.width,
    this.height
  ];

  this.drawingContext.globalCompositeOperation = 'destination-in';
  this.copy.apply(this, copyArgs);
  this.drawingContext.globalCompositeOperation = currBlend;
};

/**
 * Applies an image filter to a p5.Image
 *
 * @method filter
 * @param {String} operation one of threshold, gray, invert, posterize and
 *                           opaque see Filters.js for docs on each available
 *                           filter
 * @param {Number|undefined} value
 */
p5.Image.prototype.filter = function(operation, value) {
  Filters.apply(this.canvas, Filters[operation.toLowerCase()], value);
};

/**
 * Copies a region of pixels from one image to another, using a specified
 * blend mode to do the operation.
 *
 * @method blend
 * @param  {p5.Image|undefined} srcImage source image
 * @param  {Integer} sx X coordinate of the source's upper left corner
 * @param  {Integer} sy Y coordinate of the source's upper left corner
 * @param  {Integer} sw source image width
 * @param  {Integer} sh source image height
 * @param  {Integer} dx X coordinate of the destination's upper left corner
 * @param  {Integer} dy Y coordinate of the destination's upper left corner
 * @param  {Integer} dw destination image width
 * @param  {Integer} dh destination image height
 * @param  {Integer} blendMode the blend mode
 *
 * Available blend modes are: normal | multiply | screen | overlay |
 *            darken | lighten | color-dodge | color-burn | hard-light |
 *            soft-light | difference | exclusion | hue | saturation |
 *            color | luminosity
 *
 *
 * http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
 *
 */
p5.Image.prototype.blend = function() {
  p5.prototype.blend.apply(this, arguments);
};

/**
 * Saves the image to a file and force the browser to download it.
 * Accepts two strings for filename and file extension
 * Supports png (default) and jpg.
 *
 * @method save
 * @param {String} filename give your file a name
 * @param  {String} extension 'png' or 'jpg'
 */
p5.Image.prototype.save = function(filename, extension) {
  var mimeType;
  if (!extension) {
    extension = 'png';
    mimeType = 'image/png';
  }
  else {
    // en.wikipedia.org/wiki/Comparison_of_web_browsers#Image_format_support
    switch(extension.toLowerCase()){
    case 'png':
      mimeType = 'image/png';
      break;
    case 'jpeg':
      mimeType = 'image/jpeg';
      break;
    case 'jpg':
      mimeType = 'image/jpeg';
      break;
    default:
      mimeType = 'image/png';
      break;
    }
  }
  var downloadMime = 'image/octet-stream';
  var imageData = this.canvas.toDataURL(mimeType);
  imageData = imageData.replace(mimeType, downloadMime);

  //Make the browser download the file
  p5.prototype.downloadFile(imageData, filename, extension);
};

/**
 * creates a gl texture
 * used in WEBGL mode only
 * @param  {[type]} tex [description]
 * @return {[type]}     [description]
 */
p5.Image.prototype.createTexture = function(tex){
  //this.texture = tex;
  return this;
};

module.exports = p5.Image;
