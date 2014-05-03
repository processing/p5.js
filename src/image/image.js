/**
 * @module Image
 * @requires core
 * @requires canvas
 * @requires constants
 * @requires filters
 */
define(function (require) {

  /**
   * This module defines the PImage class and P5 methods for
   * drawing images to the main display canvas.
   */

  'use strict';

  var p5 = require('core');
  var canvas = require('canvas');
  var constants = require('constants');
  var Filters = require('filters');

  /*
   * Global/P5 methods
   */

  /**
   * Create a new empty PImage object.
   * @method createImage
   * @param  {Integer} width
   * @param  {Integer} height
   * @return {PImage} the PImage object
   * @for Image
   */
  p5.prototype.createImage = function(width, height) {
    return new PImage(width, height);
  };

  /**
   * Loads an image from a path and creates a PImage from it.
   *
   * The image may not be immediately available for rendering
   * If you want to ensure that the image is ready before doing
   * anything with it you can do perform those operations in the
   * callback.
   * 
   * @method loadImage
   * @param  {String}   path
   * @param  {Function} callback Function to be called once the image is loaded. Will be passed the PImage.
   * @return {PImage} the PImage object
   * @for Loading & Displaying
   */
  p5.prototype.loadImage = function(path, callback) {
    var img = new Image();
    var pImg = new PImage(1, 1, this);

    img.onload = function() {
      pImg.width = pImg.canvas.width = img.width;
      pImg.height = pImg.canvas.height = img.height;

      // Draw the image into the backing canvas of the pImage
      pImg.canvas.getContext('2d').drawImage(img, 0, 0);

      if (typeof callback !== 'undefined') {
        callback(pImg);
      }
    };

    //set crossOrigin in case image is served which CORS headers
    //this will let us draw to canvas without tainting it.
    //see https://developer.mozilla.org/en-US/docs/HTML/CORS_Enabled_Image
    img.crossOrigin = 'Anonymous';

    //start loading the image
    img.src = path;

    return pImg;
  };

  /**
   * Draw an image to the main canvas of the p5js sketch
   *
   * @method image
   * @param  {PImage} image
   * @param  {[type]} x
   * @param  {[type]} y
   * @param  {[type]} width
   * @param  {[type]} height   
   * @for Loading & Displaying
   */
  p5.prototype.image = function(image, x, y, width, height) {
    if (width === undefined){
      width = image.width;
    }
    if (height === undefined){
      height = image.height;
    }
    var vals = canvas.modeAdjust(x, y, width, height, this.settings.imageMode);
    this.curElement.context.drawImage(image.canvas, vals.x, vals.y, vals.w, vals.h);
  };

  /**
   * Set image mode. Modifies the location from which images are drawn by changing the way in which parameters given to image() are intepreted.

The default mode is imageMode(CORNER), which interprets the second and third parameters of image() as the upper-left corner of the image. If two additional parameters are specified, they are used to set the image's width and height.

imageMode(CORNERS) interprets the second and third parameters of image() as the location of one corner, and the fourth and fifth parameters as the opposite corner.

imageMode(CENTER) interprets the second and third parameters of image() as the image's center point. If two additional parameters are specified, they are used to set the image's width and height.

The parameter must be written in ALL CAPS because Processing is a case-sensitive language. 
   * @method imageMode
   * @param {String} m The mode: either CORNER, CORNERS, or CENTER.
   * @for Loading & Displaying
   */
  p5.prototype.imageMode = function(m) {
    if (m === constants.CORNER || m === constants.CORNERS || m === constants.CENTER) {
      this.settings.imageMode = m;
    }
  };


  /*
   * Class methods
   */


  /**
   * Creates a new PImage. A PImage is a canvas backed representation of an image.
   * p5 can display .gif, .jpg and .png images. Images may be displayed in 2D and 3D space. Before an image is used, it must be loaded with the loadImage() function. The PImage class contains fields for the width and height of the image, as well as an array called pixels[] that contains the values for every pixel in the image. The methods described below allow easy access to the image's pixels and alpha channel and simplify the process of compositing.

Before using the pixels[] array, be sure to use the loadPixels() method on the image to make sure that the pixel data is properly loaded.
   * 
   * @constructor
   * @class PImage
   * @param {Number} width 
   * @param {Number} height 
   * @param {Object} pInst An instance of a p5 sketch.
   */
  function PImage(width, height){
    this.width = width;
    this.height = height;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.pixels = [];
  }
  p5.prototype.PImage = PImage; // hack to access PImage outside module??

  /**
   * Helper fxn for sharing pixel methods
   *
   */
  PImage.prototype._setProperty = function (prop, value) {
    this[prop] = value;
  };

  /**
   * Loads the pixels data for this image into the [pixels] attribute.
   * 
   * @method loadPixels
   * @for PImage
   */
  PImage.prototype.loadPixels = function(){
    p5.prototype.loadPixels.call(this);
  };

  /**
   * Updates the backing canvas for this image with the contents of
   * the [pixels] array.
   *
   *
   * @method updatePixels
   * @param  {Integer|undefined} x x offset of the target update area for the
   *                               underlying canvas
   * @param  {Integer|undefined} y y offset of the target update area for the
   *                               underlying canvas
   * @param  {Integer|undefined} w height of the target update area for the
   *                               underlying canvas
   * @param  {Integer|undefined} h height of the target update area for the
   *                               underlying canvas
   * @for PImage
   */
  PImage.prototype.updatePixels = function(x, y, w, h){
    p5.prototype.updatePixels.call(this, x, y, w, h);
  };

  /**
   * Get a region of pixels from an image.
   *
   * If no params are passed, those whole image is returned,
   * if x and y are the only params passed a single pixel is extracted
   * if all params are passed a rectangle region is extracted and a Pimage is
   * returned.
   *
   * Returns undefined if the region is outside the bounds of the image
   *
   * @method get
   * @for PImage
   * @param {Number} [x] x-coordinate of the pixel
   * @param {Number} [y] y-coordinate of the pixel
   * @param  {Number} w width
   * @param  {Number} h height
   * @return {Array/Color | PImage} color of pixel at x,y in array format [R, G, B, A] or PImage
   */
  PImage.prototype.get = function(x, y, w, h){
    return p5.prototype.get.call(this, x, y, w, h);
  };

  /**
   * Set the color of a single pixel or write an image into
   * this PImage.
   *
   * Note that for a large number of pixels this will
   * be slower than directly manipulating the pixels array
   * and then calling updatePixels()
   *
   * TODO: Should me make the update operation toggleable?
   *
   * @method set
   * @for PImage
   * @param {Number} x x-coordinate of the pixel
   * @param {Number} y y-coordinate of the pixel
   * @param {Number|Array|Object} insert a grayscale value | a color array | image to copy
   */
  PImage.prototype.set = function(x, y, imgOrCol){
    p5.prototype.set.call(this, x, y, imgOrCol);
  };


  /**
   * Resize this PImage.
   * @method resize
   * @for PImage
   * @param  {[type]} width  [description]
   * @param  {[type]} height [description]
   * @return {[type]}        [description]
   */
  PImage.prototype.resize = function(width, height){

    // Copy contents to a temporary canvas, resize the original
    // and then copy back.
    //
    // There is a faster approach that involves just one copy and swapping the
    // this.canvas reference. We could switch to that approach if (as i think is
    // the case) there an expectation that the user would not hold a reference to
    // the backing canvas of a pImage. But since we do not enforece that at the
    // moment, I am leaving in the slower, but safer implementation.

    var tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    tempCanvas.getContext('2d').drawImage(this.canvas,
      0, 0, this.canvas.width, this.canvas.height,
      0, 0, tempCanvas.width, tempCanvas.width
    );


    // Resize the original canvas, which will clear its contents
    this.canvas.width = this.width = width;
    this.canvas.height = this.height = height;

    //Copy the image back

    this.canvas.getContext('2d').drawImage(tempCanvas,
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
   * @for PImage
   * @param  {PImage|undefined} srcImage source image
   * @param  {Integer} sx X coordinate of the source's upper left corner
   * @param  {Integer} sy Y coordinate of the source's upper left corner
   * @param  {Integer} sw source image width
   * @param  {Integer} sh source image height
   * @param  {Integer} dx X coordinate of the destination's upper left corner
   * @param  {Integer} dy Y coordinate of the destination's upper left corner
   * @param  {Integer} dw destination image width
   * @param  {Integer} dh destination image height
   */
  PImage.prototype.copy = function() {
    var srcImage, sx, sy, sw, sh, dx, dy, dw, dh;
    if(arguments.length === 9){
      srcImage = arguments[0];
      sx = arguments[1];
      sy = arguments[2];
      sw = arguments[3];
      sh = arguments[4];
      dx = arguments[5];
      dy = arguments[6];
      dw = arguments[7];
      dh = arguments[8];
    } else if(arguments.length === 8){
      sx = arguments[0];
      sy = arguments[1];
      sw = arguments[2];
      sh = arguments[3];
      dx = arguments[4];
      dy = arguments[5];
      dw = arguments[6];
      dh = arguments[7];

      srcImage = this;
    } else {
      throw new Error('Signature not supported');
    }

    this.canvas.getContext('2d').drawImage(srcImage.canvas,
      sx, sy, sw, sh, dx, dy, dw, dh
    );
  };




  /**
   * Masks part of an image from displaying by loading another
   * image and using it's alpha channel as an alpha channel for
   * this image.
   * 
   * @method mask
   * @for PImage
   * @param  {PImage|undefined} srcImage source image
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
  PImage.prototype.mask = function(pImage) {
    if(pImage === undefined){
      pImage = this;
    }
    var currBlend = this.canvas.getContext('2d').globalCompositeOperation;

    var copyArgs = [pImage, 0, 0, pImage.width, pImage.height, 0, 0, this.width, this.height];

    this.canvas.getContext('2d').globalCompositeOperation = 'destination-out';
    this.copy.apply(this, copyArgs);
    this.canvas.getContext('2d').globalCompositeOperation = currBlend;
  };

  /**
   * Applies an image filter to a PImage
   * 
   * @method filter
   * @for PImage
   * @param  {String} operation one of threshold, gray, invert, posterize and opaque
   *                            see Filters.js for docs on each available filter
   * @param  {Number|undefined} value
   */
  PImage.prototype.filter = function(operation, value) {
    Filters.apply(this.canvas, Filters[operation.toLowerCase()], value);
  };

  /**
   * Copies a region of pixels from one image to another, using a specified
   * blend mode to do the operation.
   * 
   * @method blend
   * @for PImage
   * @param  {PImage|undefined} srcImage source image
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
   * http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
   * 
   */
  PImage.prototype.blend = function() {
    var currBlend = this.canvas.getContext('2d').globalCompositeOperation;
    var blendMode = arguments[arguments.length - 1];
    var copyArgs = Array.prototype.slice.call(arguments, 0, arguments.length - 1);

    this.canvas.getContext('2d').globalCompositeOperation = blendMode;
    this.copy.apply(this, copyArgs);
    this.canvas.getContext('2d').globalCompositeOperation = currBlend;
  };

  /**
   * Saves the image to a file and forces the browser to download it.
   * Supports png and jpg.
   * 
   * @method save
   * @for PImage
   * @param  {[type]} extension
   *
   * TODO: There doesn't seem to be a way to give the force the
   * browser to download a file *and* give it a name. Which is why 
   * this function currently only take an extension parameter.
   * 
   */
  PImage.prototype.save = function(extension) {
    // var components = name.split('.');
    // var extension = components[components.length - 1];
    var mimeType;
    
    // http://en.wikipedia.org/wiki/Comparison_of_web_browsers#Image_format_support
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

    if(mimeType !== undefined){
      var downloadMime = 'image/octet-stream';
      var imageData = this.canvas.toDataURL(mimeType);
      imageData = imageData.replace(mimeType, downloadMime);
      
      //Make the browser download the file
      window.location.href = imageData;
    }
  };
  return PImage;
});
