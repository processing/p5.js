/**
 * @module Image
 * @submodule Loading & Displaying
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/main');
var Filters = require('./filters');
var canvas = require('../core/helpers');
var constants = require('../core/constants');

require('../core/error_helpers');

/**
 * Loads an image from a path and creates a <a href="#/p5.Image">p5.Image</a> from it.
 * <br><br>
 * The image may not be immediately available for rendering
 * If you want to ensure that the image is ready before doing
 * anything with it, place the <a href="#/p5/loadImage">loadImage()</a> call in <a href="#/p5/preload">preload()</a>.
 * You may also supply a callback function to handle the image when it's ready.
 * <br><br>
 * The path to the image should be relative to the HTML file
 * that links in your sketch. Loading an image from a URL or other
 * remote location may be blocked due to your browser's built-in
 * security.
 *
 * @method loadImage
 * @param  {String} path Path of the image to be loaded
 * @param  {function(p5.Image)} [successCallback] Function to be called once
 *                                the image is loaded. Will be passed the
 *                                <a href="#/p5.Image">p5.Image</a>.
 * @param  {function(Event)}    [failureCallback] called with event error if
 *                                the image fails to load.
 * @return {p5.Image}             the <a href="#/p5.Image">p5.Image</a> object
 * @example
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
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
 *   loadImage('assets/laDefense.jpg', img => {
 *     image(img, 0, 0);
 *   });
 * }
 * </code>
 * </div>
 *
 * @alt
 * image of the underside of a white umbrella and grided ceililng above
 * image of the underside of a white umbrella and grided ceililng above
 *
 */
p5.prototype.loadImage = function(path, successCallback, failureCallback) {
  p5._validateParameters('loadImage', arguments);
  var img = new Image();
  var pImg = new p5.Image(1, 1, this);

  var self = this;
  img.onload = function() {
    pImg.width = pImg.canvas.width = img.width;
    pImg.height = pImg.canvas.height = img.height;

    // Draw the image into the backing canvas of the p5.Image
    pImg.drawingContext.drawImage(img, 0, 0);
    pImg.modified = true;

    if (typeof successCallback === 'function') {
      successCallback(pImg);
    }

    self._decrementPreload();
  };
  img.onerror = function(e) {
    p5._friendlyFileLoadError(0, img.src);
    if (typeof failureCallback === 'function') {
      failureCallback(e);
    } else {
      console.error(e);
    }
  };

  // Set crossOrigin in case image is served with CORS headers.
  // This will let us draw to the canvas without tainting it.
  // See https://developer.mozilla.org/en-US/docs/HTML/CORS_Enabled_Image
  // When using data-uris the file will be loaded locally
  // so we don't need to worry about crossOrigin with base64 file types.
  if (path.indexOf('data:image/') !== 0) {
    img.crossOrigin = 'Anonymous';
  }

  // start loading the image
  img.src = path;

  return pImg;
};

/**
 * Validates clipping params. Per drawImage spec sWidth and sHight cannot be
 * negative or greater than image intrinsic width and height
 * @private
 * @param {Number} sVal
 * @param {Number} iVal
 * @returns {Number}
 * @private
 */
function _sAssign(sVal, iVal) {
  if (sVal > 0 && sVal < iVal) {
    return sVal;
  } else {
    return iVal;
  }
}

/**
 * Draw an image to the p5.js canvas.
 *
 * This function can be used with different numbers of parameters. The
 * simplest use requires only three parameters: img, x, and y—where (x, y) is
 * the position of the image. Two more parameters can optionally be added to
 * specify the width and height of the image.
 *
 * This function can also be used with all eight Number parameters. To
 * differentiate between all these parameters, p5.js uses the language of
 * "destination rectangle" (which corresponds to "dx", "dy", etc.) and "source
 * image" (which corresponds to "sx", "sy", etc.) below. Specifying the
 * "source image" dimensions can be useful when you want to display a
 * subsection of the source image instead of the whole thing. Here's a diagram
 * to explain further:
 * <img src="assets/drawImage.png"></img>
 *
 * @method image
 * @param  {p5.Image|p5.Element} img    the image to display
 * @param  {Number}   x     the x-coordinate of the top-left corner of the image
 * @param  {Number}   y     the y-coordinate of the top-left corner of the image
 * @param  {Number}   [width]  the width to draw the image
 * @param  {Number}   [height] the height to draw the image
 * @example
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 * function setup() {
 *   // Top-left corner of the img is at (0, 0)
 *   // Width and height are the img's original width and height
 *   image(img, 0, 0);
 * }
 * </code>
 * </div>
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 * function setup() {
 *   background(50);
 *   // Top-left corner of the img is at (10, 10)
 *   // Width and height are 50 x 50
 *   image(img, 10, 10, 50, 50);
 * }
 * </code>
 * </div>
 * <div>
 * <code>
 * function setup() {
 *   // Here, we use a callback to display the image after loading
 *   loadImage('assets/laDefense.jpg', img => {
 *     image(img, 0, 0);
 *   });
 * }
 * </code>
 * </div>
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   img = loadImage('assets/gradient.png');
 * }
 * function setup() {
 *   // 1. Background image
 *   // Top-left corner of the img is at (0, 0)
 *   // Width and height are the img's original width and height, 100 x 100
 *   image(img, 0, 0);
 *   // 2. Top right image
 *   // Top-left corner of destination rectangle is at (50, 0)
 *   // Destination rectangle width and height are 40 x 20
 *   // The next parameters are relative to the source image:
 *   // - Starting at position (50, 50) on the source image, capture a 50 x 50
 *   // subsection
 *   // - Draw this subsection to fill the dimensions of the destination rectangle
 *   image(img, 50, 0, 40, 20, 50, 50, 50, 50);
 * }
 * </code>
 * </div>
 * @alt
 * image of the underside of a white umbrella and gridded ceiling above
 * image of the underside of a white umbrella and gridded ceiling above
 *
 */
/**
 * @method image
 * @param  {p5.Image|p5.Element} img
 * @param  {Number}   dx     the x-coordinate of the destination
 *                           rectangle in which to draw the source image
 * @param  {Number}   dy     the y-coordinate of the destination
 *                           rectangle in which to draw the source image
 * @param  {Number}   dWidth  the width of the destination rectangle
 * @param  {Number}   dHeight the height of the destination rectangle
 * @param  {Number}   sx     the x-coordinate of the subsection of the source
 * image to draw into the destination rectangle
 * @param  {Number}   sy     the y-coordinate of the subsection of the source
 * image to draw into the destination rectangle
 * @param {Number}    [sWidth] the width of the subsection of the
 *                           source image to draw into the destination
 *                           rectangle
 * @param {Number}    [sHeight] the height of the subsection of the
 *                            source image to draw into the destination rectangle
 */
p5.prototype.image = function(
  img,
  dx,
  dy,
  dWidth,
  dHeight,
  sx,
  sy,
  sWidth,
  sHeight
) {
  // set defaults per spec: https://goo.gl/3ykfOq

  p5._validateParameters('image', arguments);

  var defW = img.width;
  var defH = img.height;

  if (img.elt && img.elt.videoWidth && !img.canvas) {
    // video no canvas
    defW = img.elt.videoWidth;
    defH = img.elt.videoHeight;
  }

  var _dx = dx;
  var _dy = dy;
  var _dw = dWidth || defW;
  var _dh = dHeight || defH;
  var _sx = sx || 0;
  var _sy = sy || 0;
  var _sw = sWidth || defW;
  var _sh = sHeight || defH;

  _sw = _sAssign(_sw, defW);
  _sh = _sAssign(_sh, defH);

  // This part needs cleanup and unit tests
  // see issues https://github.com/processing/p5.js/issues/1741
  // and https://github.com/processing/p5.js/issues/1673
  var pd = 1;

  if (img.elt && !img.canvas && img.elt.style.width) {
    //if img is video and img.elt.size() has been used and
    //no width passed to image()
    if (img.elt.videoWidth && !dWidth) {
      pd = img.elt.videoWidth;
    } else {
      //all other cases
      pd = img.elt.width;
    }
    pd /= parseInt(img.elt.style.width, 10);
  }

  _sx *= pd;
  _sy *= pd;
  _sh *= pd;
  _sw *= pd;

  var vals = canvas.modeAdjust(_dx, _dy, _dw, _dh, this._renderer._imageMode);

  // tint the image if there is a tint
  this._renderer.image(img, _sx, _sy, _sw, _sh, vals.x, vals.y, vals.w, vals.h);
};

/**
 * Sets the fill value for displaying images. Images can be tinted to
 * specified colors or made transparent by including an alpha value.
 * <br><br>
 * To apply transparency to an image without affecting its color, use
 * white as the tint color and specify an alpha value. For instance,
 * tint(255, 128) will make an image 50% transparent (assuming the default
 * alpha range of 0-255, which can be changed with <a href="#/p5/colorMode">colorMode()</a>).
 * <br><br>
 * The value for the gray parameter must be less than or equal to the current
 * maximum value as specified by <a href="#/p5/colorMode">colorMode()</a>. The default maximum value is
 * 255.
 *
 *
 * @method tint
 * @param  {Number}        v1      red or hue value relative to
 *                                 the current color range
 * @param  {Number}        v2      green or saturation value
 *                                 relative to the current color range
 * @param  {Number}        v3      blue or brightness value
 *                                 relative to the current color range
 * @param  {Number}        [alpha]
 *
 * @example
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 * function setup() {
 *   image(img, 0, 0);
 *   tint(0, 153, 204); // Tint blue
 *   image(img, 50, 0);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 * function setup() {
 *   image(img, 0, 0);
 *   tint(0, 153, 204, 126); // Tint blue and set transparency
 *   image(img, 50, 0);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 * function setup() {
 *   image(img, 0, 0);
 *   tint(255, 126); // Apply transparency without changing color
 *   image(img, 50, 0);
 * }
 * </code>
 * </div>
 *
 * @alt
 * 2 side by side images of umbrella and ceiling, one image with blue tint
 * Images of umbrella and ceiling, one half of image with blue tint
 * 2 side by side images of umbrella and ceiling, one image translucent
 *
 */

/**
 * @method tint
 * @param  {String}        value   a color string
 */

/**
 * @method tint
 * @param  {Number}        gray   a gray value
 * @param  {Number}        [alpha]
 */

/**
 * @method tint
 * @param  {Number[]}      values  an array containing the red,green,blue &
 *                                 and alpha components of the color
 */

/**
 * @method tint
 * @param  {p5.Color}      color   the tint color
 */
p5.prototype.tint = function() {
  p5._validateParameters('tint', arguments);
  var c = this.color.apply(this, arguments);
  this._renderer._tint = c.levels;
};

/**
 * Removes the current fill value for displaying images and reverts to
 * displaying images with their original hues.
 *
 * @method noTint
 * @example
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   img = loadImage('assets/bricks.jpg');
 * }
 * function setup() {
 *   tint(0, 153, 204); // Tint blue
 *   image(img, 0, 0);
 *   noTint(); // Disable tint
 *   image(img, 50, 0);
 * }
 * </code>
 * </div>
 *
 * @alt
 * 2 side by side images of bricks, left image with blue tint
 *
 */
p5.prototype.noTint = function() {
  this._renderer._tint = null;
};

/**
 * Apply the current tint color to the input image, return the resulting
 * canvas.
 *
 * @private
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

  for (var i = 0; i < pixels.length; i += 4) {
    var r = pixels[i];
    var g = pixels[i + 1];
    var b = pixels[i + 2];
    var a = pixels[i + 3];

    newPixels[i] = r * this._renderer._tint[0] / 255;
    newPixels[i + 1] = g * this._renderer._tint[1] / 255;
    newPixels[i + 2] = b * this._renderer._tint[2] / 255;
    newPixels[i + 3] = a * this._renderer._tint[3] / 255;
  }

  tmpCtx.putImageData(id, 0, 0);
  return tmpCanvas;
};

/**
 * Set image mode. Modifies the location from which images are drawn by
 * changing the way in which parameters given to <a href="#/p5/image">image()</a> are interpreted.
 * The default mode is imageMode(CORNER), which interprets the second and
 * third parameters of <a href="#/p5/image">image()</a> as the upper-left corner of the image. If
 * two additional parameters are specified, they are used to set the image's
 * width and height.
 * <br><br>
 * imageMode(CORNERS) interprets the second and third parameters of <a href="#/p5/image">image()</a>
 * as the location of one corner, and the fourth and fifth parameters as the
 * opposite corner.
 * <br><br>
 * imageMode(CENTER) interprets the second and third parameters of <a href="#/p5/image">image()</a>
 * as the image's center point. If two additional parameters are specified,
 * they are used to set the image's width and height.
 *
 * @method imageMode
 * @param {Constant} mode either CORNER, CORNERS, or CENTER
 * @example
 *
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   img = loadImage('assets/bricks.jpg');
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
 * let img;
 * function preload() {
 *   img = loadImage('assets/bricks.jpg');
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
 * let img;
 * function preload() {
 *   img = loadImage('assets/bricks.jpg');
 * }
 * function setup() {
 *   imageMode(CENTER);
 *   image(img, 50, 50, 80, 80);
 * }
 * </code>
 * </div>
 *
 * @alt
 * small square image of bricks
 * horizontal rectangle image of bricks
 * large square image of bricks
 *
 */
p5.prototype.imageMode = function(m) {
  p5._validateParameters('imageMode', arguments);
  if (
    m === constants.CORNER ||
    m === constants.CORNERS ||
    m === constants.CENTER
  ) {
    this._renderer._imageMode = m;
  }
};

module.exports = p5;
