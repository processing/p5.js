/**
 * @module Image
 * @submodule Loading & Displaying
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');
var Filters = require('./filters');
var canvas = require('../core/canvas');
var constants = require('../core/constants');

require('../core/error_helpers');

/**
 * Loads an image from a path and creates a p5.Image from it.
 *
 * The image may not be immediately available for rendering
 * If you want to ensure that the image is ready before doing
 * anything with it you can do perform those operations in the
 * callback, or place the loadImage() call in preload().
 *
 * @method loadImage
 * @param  {String} path Path of the image to be loaded
 * @param  {Function(p5.Image)} [successCallback] Function to be called once
 *                                the image is loaded. Will be passed the
 *                                p5.Image.
 * @param  {Function(Event)}    [failureCallback] called with event error if
 *                                the image fails to load.
 * @return {p5.Image}             the p5.Image object
 * @example
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/laDefense.jpg");
 * }
 * function setup() {
 *   image(img, 0, 0);
 * }
 * </code>
 * </div>
 * <div>
 * <code>
 * function setup() {
 *   // here we use a callback to display the image after loading
 *   loadImage("assets/laDefense.jpg", function(img) {
 *     image(img, 0, 0);
 *   });
 * }
 * </code>
 * </div>
 */
p5.prototype.loadImage = function(path, successCallback, failureCallback) {
  var img = new Image();
  var pImg = new p5.Image(1, 1, this);

  img.onload = function() {
    pImg.width = pImg.canvas.width = img.width;
    pImg.height = pImg.canvas.height = img.height;

    // Draw the image into the backing canvas of the p5.Image
    pImg.canvas.getContext('2d').drawImage(img, 0, 0);

    if (typeof successCallback === 'function') {
      successCallback(pImg);
    }
  };
  img.onerror = function(e) {
    p5._friendlyFileLoadError(0,img.src);
    if (typeof failureCallback === 'function') {
      failureCallback(e);
    }
  };

  //set crossOrigin in case image is served which CORS headers
  //this will let us draw to canvas without tainting it.
  //see https://developer.mozilla.org/en-US/docs/HTML/CORS_Enabled_Image
  // When using data-uris the file will be loaded locally
  // so we don't need to worry about crossOrigin with base64 file types
  if(path.indexOf('data:image/') !== 0) {
    img.crossOrigin = 'Anonymous';
  }

  //start loading the image
  img.src = path;

  return pImg;
};

/**
 * Draw an image to the main canvas of the p5js sketch
 *
 * @method image
 * @param  {p5.Image} image    the image to display
 * @param  {Number}   [x=0]    x-coordinate of the image
 * @param  {Number}   [y=0]    y-coordinate of the image
 * @param  {Number}   [width]  width to display the image
 * @param  {Number}   [height] height to display the image
 * @example
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/laDefense.jpg");
 * }
 * function setup() {
 *   image(img, 0, 0);
 * }
 * </code>
 * </div>
 * <div>
 * <code>
 * function setup() {
 *   // here we use a callback to display the image after loading
 *   loadImage("assets/laDefense.jpg", function(img) {
 *     image(img, 0, 0);
 *   });
 * }
 * </code>
 * </div>
 */
p5.prototype.image = function(img, x, y, width, height) {
  // Temporarily disabling until options for p5.Graphics are added.
  // this._validateParameters(
  //   'image',
  //   arguments,
  //   [
  //     ['p5.Image', 'Number', 'Number'],
  //     ['p5.Image', 'Number', 'Number', 'Number', 'Number']
  //   ]
  // );

  // set defaults
  x = x || 0;
  y = y || 0;
  width = width || img.width;
  height = height || img.height;
  var vals = canvas.modeAdjust(x, y, width, height, this._imageMode);
  // tint the image if there is a tint
  this._graphics.image(img, vals.x, vals.y, vals.w, vals.h);
};

/**
 * Sets the fill value for displaying images. Images can be tinted to
 * specified colors or made transparent by including an alpha value.
 *
 * To apply transparency to an image without affecting its color, use
 * white as the tint color and specify an alpha value. For instance,
 * tint(255, 128) will make an image 50% transparent (assuming the default
 * alpha range of 0-255, which can be changed with colorMode()).
 *
 * The value for the gray parameter must be less than or equal to the current
 * maximum value as specified by colorMode(). The default maximum value is
 * 255.
 *
 * @method tint
 * @param {Number|Array} v1   gray value, red or hue value (depending on the
 *                            current color mode), or color Array
 * @param {Number|Array} [v2] green or saturation value (depending on the
 *                            current color mode)
 * @param {Number|Array} [v3] blue or brightness value (depending on the
 *                            current color mode)
 * @param {Number|Array} [a]  opacity of the background
 * @example
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/laDefense.jpg");
 * }
 * function setup() {
 *   image(img, 0, 0);
 *   tint(0, 153, 204);  // Tint blue
 *   image(img, 50, 0);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/laDefense.jpg");
 * }
 * function setup() {
 *   image(img, 0, 0);
 *   tint(0, 153, 204, 126);  // Tint blue and set transparency
 *   image(img, 50, 0);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/laDefense.jpg");
 * }
 * function setup() {
 *   image(img, 0, 0);
 *   tint(255, 126);  // Apply transparency without changing color
 *   image(img, 50, 0);
 * }
 * </code>
 * </div>
 */
p5.prototype.tint = function () {
  var c = this.color.apply(this, arguments);
  this._tint = c.rgba;
};

/**
 * Removes the current fill value for displaying images and reverts to
 * displaying images with their original hues.
 *
 * @method noTint
 * @example
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/bricks.jpg");
 * }
 * function setup() {
 *   tint(0, 153, 204);  // Tint blue
 *   image(img, 0, 0);
 *   noTint();  // Disable tint
 *   image(img, 50, 0);
 * }
 * </code>
 * </div>
 */
p5.prototype.noTint = function() {
  this._tint = null;
};

/**
 * Apply the current tint color to the input image, return the resulting
 * canvas.
 *
 * @param {p5.Image} The image to be tinted
 * @return {canvas} The resulting tinted canvas
 *
 */
p5.prototype._getTintedImageCanvas = function(img) {
  if (!img.canvas) {
    return img;
  }
  var pixels = Filters._toPixels(img.canvas);
  var tmpCanvas = document.createElement('canvas');
  tmpCanvas.width = img.canvas.width;
  tmpCanvas.height = img.canvas.height;
  var tmpCtx = tmpCanvas.getContext('2d');
  var id = tmpCtx.createImageData(img.canvas.width, img.canvas.height);
  var newPixels = id.data;

  for(var i = 0; i < pixels.length; i += 4) {
    var r = pixels[i];
    var g = pixels[i+1];
    var b = pixels[i+2];
    var a = pixels[i+3];

    newPixels[i] = r*this._tint[0]/255;
    newPixels[i+1] = g*this._tint[1]/255;
    newPixels[i+2] = b*this._tint[2]/255;
    newPixels[i+3] = a*this._tint[3]/255;
  }

  tmpCtx.putImageData(id, 0, 0);
  return tmpCanvas;
};

/**
 * Set image mode. Modifies the location from which images are drawn by
 * changing the way in which parameters given to image() are interpreted.
 * The default mode is imageMode(CORNER), which interprets the second and
 * third parameters of image() as the upper-left corner of the image. If
 * two additional parameters are specified, they are used to set the image's
 * width and height.
 *
 * imageMode(CORNERS) interprets the second and third parameters of image()
 * as the location of one corner, and the fourth and fifth parameters as the
 * opposite corner.
 * imageMode(CENTER) interprets the second and third parameters of image()
 * as the image's center point. If two additional parameters are specified,
 * they are used to set the image's width and height.
 *
 * @method imageMode
 * @param {String} m The mode: either CORNER, CORNERS, or CENTER.
 * @example
 *
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/bricks.jpg");
 * }
 * function setup() {
 *   imageMode(CORNER);
 *   image(img, 10, 10, 50, 50);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/bricks.jpg");
 * }
 * function setup() {
 *   imageMode(CORNERS);
 *   image(img, 10, 10, 90, 40);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * var img;
 * function preload() {
 *   img = loadImage("assets/bricks.jpg");
 * }
 * function setup() {
 *   imageMode(CENTER);
 *   image(img, 50, 50, 80, 80);
 * }
 * </code>
 * </div>
 */
p5.prototype.imageMode = function(m) {
  if (m === constants.CORNER ||
    m === constants.CORNERS ||
    m === constants.CENTER) {
    this._imageMode = m;
  }
};


module.exports = p5;
