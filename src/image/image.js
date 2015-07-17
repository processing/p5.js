/**
 * @module Image
 * @submodule Image
 * @for p5
 * @requires core
 */

/**
 * This module defines the p5 methods for the p5.Image class
 * for drawing images to the main display canvas.
 */
'use strict';


var p5 = require('../core/core');
var constants = require('../core/constants');

/* global frames:true */// This is not global, but JSHint is not aware that
// this module is implicitly enclosed with Browserify: this overrides the
// redefined-global error and permits using the name "frames" for the array
// of saved animation frames.
var frames = [];

p5.prototype._imageMode = constants.CORNER;
p5.prototype._tint = null;

/**
 * Creates a new p5.Image (the datatype for storing images). This provides a
 * fresh buffer of pixels to play with. Set the size of the buffer with the
 * width and height parameters.
 *
 * .pixels gives access to an array containing the values for all the pixels
 * in the display window.
 * These values are numbers. This array is the size (including an appropriate
 * factor for the pixelDensity) of the display window x4,
 * representing the R, G, B, A values in order for each pixel, moving from
 * left to right across each row, then down each column. See .pixels for
 * more info. It may also be simpler to use set() or get().
 * <br><br>
 * Before accessing the pixels of an image, the data must loaded with the
 * loadPixels()
 * function. After the array data has been modified, the updatePixels()
 * function must be run to update the changes.
 *
 * @method createImage
 * @param  {Integer} width  width in pixels
 * @param  {Integer} height height in pixels
 * @return {p5.Image}       the p5.Image object
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
 *
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
 *
 * <div>
 * <code>
 * var pink = color(255, 102, 204);
 * img = createImage(66, 66);
 * img.loadPixels();
 * var d = pixelDensity;
 * var halfImage = 4 * (width * d) * (height/2 * d);
 * for (var i = 0; i < halfImage; i+=4) {
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
p5.prototype.createImage = function(width, height) {
  return new p5.Image(width, height);
};

/**
 *  Save the current canvas as an image. In Safari, will open the
 *  image in the window and the user must provide their own
 *  filename on save-as. Other browsers will either save the
 *  file immediately, or prompt the user with a dialogue window.
 *
 *  @method saveCanvas
 *  @param  {[selectedCanvas]} canvas a variable representing a
 *                             specific html5 canvas (optional)
 *  @param  {[String]} filename
 *  @param  {[String]} extension 'jpg' or 'png'
 *  @example
 *  <div class='norender'><code>
 *  function setup() {
 *    var c = createCanvas(100, 100);
 *    background(255, 0, 0);
 *    saveCanvas(c, 'myCanvas', 'jpg');
 *  }
 *  </code></div>
 *  <div class='norender'><code>
 *  // note that this example has the same result as above
 *  // if no canvas is specified, defaults to main canvas
 *  function setup() {
 *    createCanvas(100, 100);
 *    background(255, 0, 0);
 *    saveCanvas('myCanvas', 'jpg');
 *  }
 *  </code></div>
 *  <div class='norender'><code>
 *  // all of the following are valid
 *  saveCanvas(c, 'myCanvas', 'jpg');
 *  saveCanvas(c, 'myCanvas');
 *  saveCanvas(c);
 *  saveCanvas('myCanvas', 'png');
 *  saveCanvas('myCanvas');
 *  saveCanvas();
 *  </code></div>
 */
p5.prototype.saveCanvas = function() {

  var cnv, filename, extension;
  if (arguments.length === 3) {
    cnv = arguments[0];
    filename = arguments[1];
    extension = arguments[2];
  } else if (arguments.length === 2) {
    if (typeof arguments[0] === 'object') {
      cnv = arguments[0];
      filename = arguments[1];
    } else {
      filename = arguments[0];
      extension = arguments[1];
    }
  } else if (arguments.length === 1) {
    if (typeof arguments[0] === 'object') {
      cnv = arguments[0];
    } else {
      filename = arguments[0];
    }
  }

  if (cnv instanceof p5.Element) {
    cnv = cnv.elt;
  }
  if (!(cnv instanceof HTMLCanvasElement)) {
    cnv = null;
  }

  if (!extension) {
    extension = p5.prototype._checkFileExtension(filename, extension)[1];
    if (extension === '') {
      extension = 'png';
    }
  }

  if (!cnv) {
    if (this._curElement && this._curElement.elt) {
      cnv = this._curElement.elt;
    }
  }

  if ( p5.prototype._isSafari() ) {
    var aText = 'Hello, Safari user!\n';
    aText += 'Now capturing a screenshot...\n';
    aText += 'To save this image,\n';
    aText += 'go to File --> Save As.\n';
    alert(aText);
    window.location.href = cnv.toDataURL();
  } else {
    var mimeType;
    if (typeof(extension) === 'undefined') {
      extension = 'png';
      mimeType = 'image/png';
    }
    else {
      switch(extension){
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
    var imageData = cnv.toDataURL(mimeType);
    imageData = imageData.replace(mimeType, downloadMime);

    p5.prototype.downloadFile(imageData, filename, extension);
  }
};

/**
 *  Capture a sequence of frames that can be used to create a movie.
 *  Accepts a callback. For example, you may wish to send the frames
 *  to a server where they can be stored or converted into a movie.
 *  If no callback is provided, the browser will attempt to download
 *  all of the images that have just been created.
 *
 *  @method saveFrames
 *  @param  {[type]}   filename  [description]
 *  @param  {[type]}   extension [description]
 *  @param  {[type]}   _duration [description]
 *  @param  {[type]}   _fps      [description]
 *  @param  {[Function]} callback  [description]
 *  @return {[type]}             [description]
 */
p5.prototype.saveFrames = function(fName, ext, _duration, _fps, callback) {
  var duration = _duration || 3;
  duration = p5.prototype.constrain(duration, 0, 15);
  duration = duration * 1000;
  var fps = _fps || 15;
  fps = p5.prototype.constrain(fps, 0, 22);
  var count = 0;

  var makeFrame = p5.prototype._makeFrame;
  var cnv = this._curElement.elt;
  var frameFactory = setInterval(function(){
    makeFrame(fName + count, ext, cnv);
    count++;
  },1000/fps);

  setTimeout(function(){
    clearInterval(frameFactory);
    if (callback) {
      callback(frames);
    }
    else {
      for (var i = 0; i < frames.length; i++) {
        var f = frames[i];
        p5.prototype.downloadFile(f.imageData, f.filename, f.ext);
      }
    }
    frames = []; // clear frames
  }, duration + 0.01);
};

p5.prototype._makeFrame = function(filename, extension, _cnv) {
  var cnv;
  if (this) {
    cnv = this._curElement.elt;
  } else {
    cnv = _cnv;
  }
  var mimeType;
  if (!extension) {
    extension = 'png';
    mimeType = 'image/png';
  }
  else {
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
  var imageData = cnv.toDataURL(mimeType);
  imageData = imageData.replace(mimeType, downloadMime);

  var thisFrame = {};
  thisFrame.imageData = imageData;
  thisFrame.filename = filename;
  thisFrame.ext = extension;
  frames.push(thisFrame);
};

module.exports = p5;
