/**
 * @module Image
 * @submodule Image
 * @for p5
 * @requires core
 */

/**
 * This module defines the p5 methods for the <a href="#/p5.Image">p5.Image</a> class
 * for drawing images to the main display canvas.
 */
'use strict';

import p5 from '../core/main';
import omggif from 'omggif';

// This is not global, but ESLint is not aware that
// this module is implicitly enclosed with Browserify: this overrides the
// redefined-global error and permits using the name "frames" for the array
// of saved animation frames.

/* global frames:true */ let frames = []; // eslint-disable-line no-unused-vars

/**
 * Creates a new <a href="#/p5.Image">p5.Image</a> (the datatype for storing images). This provides a
 * fresh buffer of pixels to play with. Set the size of the buffer with the
 * width and height parameters.
 * <br><br>
 * .<a href="#/p5.Image/pixels">pixels</a> gives access to an array containing the values for all the pixels
 * in the display window.
 * These values are numbers. This array is the size (including an appropriate
 * factor for the <a href="#/p5/pixelDensity">pixelDensity</a>) of the display window x4,
 * representing the R, G, B, A values in order for each pixel, moving from
 * left to right across each row, then down each column. See .<a href="#/p5.Image/pixels">pixels</a> for
 * more info. It may also be simpler to use <a href="#/p5.Image/set">set()</a> or <a href="#/p5.Image/get">get()</a>.
 * <br><br>
 * Before accessing the pixels of an image, the data must loaded with the
 * <a href="#/p5.Image/loadPixels">loadPixels()</a> function. After the array data has been modified, the
 * <a href="#/p5.Image/updatePixels">updatePixels()</a> function must be run to update the changes.
 *
 * @method createImage
 * @param  {Integer} width  width in pixels
 * @param  {Integer} height height in pixels
 * @return {p5.Image}       the <a href="#/p5.Image">p5.Image</a> object
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
 *
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
 * <div>
 * <code>
 * let pink = color(255, 102, 204);
 * let img = createImage(66, 66);
 * img.loadPixels();
 * let d = pixelDensity();
 * let halfImage = 4 * (img.width * d) * (img.height / 2 * d);
 * for (let i = 0; i < halfImage; i += 4) {
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
 * 66x66 dark turquoise rect in center of canvas.
 * 2 gradated dark turquoise rects fade left. 1 center 1 bottom right of canvas
 * no image displayed
 *
 */
p5.prototype.createImage = function(width, height) {
  p5._validateParameters('createImage', arguments);
  return new p5.Image(width, height);
};

/**
 *  Save the current canvas as an image. The browser will either save the
 *  file immediately, or prompt the user with a dialogue window.
 *
 *  @method saveCanvas
 *  @param  {p5.Element|HTMLCanvasElement} selectedCanvas   a variable
 *                                  representing a specific html5 canvas (optional)
 *  @param  {String} [filename]
 *  @param  {String} [extension]      'jpg' or 'png'
 *
 *  @example
 * <div class='norender notest'><code>
 * function setup() {
 *   let c = createCanvas(100, 100);
 *   background(255, 0, 0);
 *   saveCanvas(c, 'myCanvas', 'jpg');
 * }
 * </code></div>
 * <div class='norender notest'><code>
 * // note that this example has the same result as above
 * // if no canvas is specified, defaults to main canvas
 * function setup() {
 *   let c = createCanvas(100, 100);
 *   background(255, 0, 0);
 *   saveCanvas('myCanvas', 'jpg');
 *
 *   // all of the following are valid
 *   saveCanvas(c, 'myCanvas', 'jpg');
 *   saveCanvas(c, 'myCanvas.jpg');
 *   saveCanvas(c, 'myCanvas');
 *   saveCanvas(c);
 *   saveCanvas('myCanvas', 'png');
 *   saveCanvas('myCanvas');
 *   saveCanvas();
 * }
 * </code></div>
 *
 * @alt
 * no image displayed
 * no image displayed
 * no image displayed
 */
/**
 *  @method saveCanvas
 *  @param  {String} [filename]
 *  @param  {String} [extension]
 */
p5.prototype.saveCanvas = function() {
  p5._validateParameters('saveCanvas', arguments);

  // copy arguments to array
  const args = [].slice.call(arguments);
  let htmlCanvas, filename, extension;

  if (arguments[0] instanceof HTMLCanvasElement) {
    htmlCanvas = arguments[0];
    args.shift();
  } else if (arguments[0] instanceof p5.Element) {
    htmlCanvas = arguments[0].elt;
    args.shift();
  } else {
    htmlCanvas = this._curElement && this._curElement.elt;
  }

  if (args.length >= 1) {
    filename = args[0];
  }
  if (args.length >= 2) {
    extension = args[1];
  }

  extension =
    extension ||
    p5.prototype._checkFileExtension(filename, extension)[1] ||
    'png';

  let mimeType;
  switch (extension) {
    default:
      //case 'png':
      mimeType = 'image/png';
      break;
    case 'jpeg':
    case 'jpg':
      mimeType = 'image/jpeg';
      break;
  }

  htmlCanvas.toBlob(function(blob) {
    p5.prototype.downloadFile(blob, filename, extension);
  }, mimeType);
};

p5.prototype.saveGif = function(pImg, filename) {
  const props = pImg.gifProperties;

  //convert loopLimit back into Netscape Block formatting
  let loopLimit = props.loopLimit;
  if (loopLimit === 1) {
    loopLimit = null;
  } else if (loopLimit === null) {
    loopLimit = 0;
  }
  const gifFormatDelay = props.delay / 10;
  const opts = {
    loop: loopLimit,
    delay: gifFormatDelay
  };

  const buffer = new Uint8Array(
    pImg.width * pImg.height * props.numFrames * gifFormatDelay
  );
  const gifWriter = new omggif.GifWriter(buffer, pImg.width, pImg.height, opts);
  const palette = [];
  //loop over frames and build pixel -> palette index for each
  for (let i = 0; i < props.numFrames; i++) {
    const pixelPaletteIndex = new Uint8Array(pImg.width * pImg.height);
    const data = props.frames[i].data;
    const dataLength = data.length;
    for (let j = 0, k = 0; j < dataLength; j += 4, k++) {
      const r = data[j + 0];
      const g = data[j + 1];
      const b = data[j + 2];
      const color = (r << 16) | (g << 8) | (b << 0);
      const index = palette.indexOf(color);
      if (index === -1) {
        pixelPaletteIndex[k] = palette.length;
        palette.push(color);
      } else {
        pixelPaletteIndex[k] = index;
      }
    }
    // force palette to be power of 2
    let powof2 = 1;
    while (powof2 < palette.length) {
      powof2 <<= 1;
    }
    palette.length = powof2;
    opts.palette = new Uint32Array(palette);
    gifWriter.addFrame(0, 0, pImg.width, pImg.height, pixelPaletteIndex, opts);
  }
  gifWriter.end();
  const extension = 'gif';
  const blob = new Blob([buffer], { type: 'image/gif' });
  p5.prototype.downloadFile(blob, filename, extension);
};

/**
 *  Capture a sequence of frames that can be used to create a movie.
 *  Accepts a callback. For example, you may wish to send the frames
 *  to a server where they can be stored or converted into a movie.
 *  If no callback is provided, the browser will pop up save dialogues in an
 *  attempt to download all of the images that have just been created. With the
 *  callback provided the image data isn't saved by default but instead passed
 *  as an argument to the callback function as an array of objects, with the
 *  size of array equal to the total number of frames.
 *
 *  Note that <a href="#/p5.Image/saveFrames">saveFrames()</a> will only save the first 15 frames of an animation.
 *  To export longer animations, you might look into a library like
 *  <a href="https://github.com/spite/ccapture.js/">ccapture.js</a>.
 *
 *  @method saveFrames
 *  @param  {String}   filename
 *  @param  {String}   extension 'jpg' or 'png'
 *  @param  {Number}   duration  Duration in seconds to save the frames for.
 *  @param  {Number}   framerate  Framerate to save the frames in.
 *  @param  {function(Array)} [callback] A callback function that will be executed
                                  to handle the image data. This function
                                  should accept an array as argument. The
                                  array will contain the specified number of
                                  frames of objects. Each object has three
                                  properties: imageData - an
                                  image/octet-stream, filename and extension.
 *  @example
 *  <div><code>
 * function draw() {
 *   background(mouseX);
 * }
 *
 * function mousePressed() {
 *   saveFrames('out', 'png', 1, 25, data => {
 *     print(data);
 *   });
 * }
</code></div>
 *
 * @alt
 * canvas background goes from light to dark with mouse x.
 *
 */
p5.prototype.saveFrames = function(fName, ext, _duration, _fps, callback) {
  p5._validateParameters('saveFrames', arguments);
  let duration = _duration || 3;
  duration = p5.prototype.constrain(duration, 0, 15);
  duration = duration * 1000;
  let fps = _fps || 15;
  fps = p5.prototype.constrain(fps, 0, 22);
  let count = 0;

  const makeFrame = p5.prototype._makeFrame;
  const cnv = this._curElement.elt;
  const frameFactory = setInterval(function() {
    makeFrame(fName + count, ext, cnv);
    count++;
  }, 1000 / fps);

  setTimeout(function() {
    clearInterval(frameFactory);
    if (callback) {
      callback(frames);
    } else {
      for (let i = 0; i < frames.length; i++) {
        const f = frames[i];
        p5.prototype.downloadFile(f.imageData, f.filename, f.ext);
      }
    }
    frames = []; // clear frames
  }, duration + 0.01);
};

p5.prototype._makeFrame = function(filename, extension, _cnv) {
  let cnv;
  if (this) {
    cnv = this._curElement.elt;
  } else {
    cnv = _cnv;
  }
  let mimeType;
  if (!extension) {
    extension = 'png';
    mimeType = 'image/png';
  } else {
    switch (extension.toLowerCase()) {
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
  const downloadMime = 'image/octet-stream';
  let imageData = cnv.toDataURL(mimeType);
  imageData = imageData.replace(mimeType, downloadMime);

  const thisFrame = {};
  thisFrame.imageData = imageData;
  thisFrame.filename = filename;
  thisFrame.ext = extension;
  frames.push(thisFrame);
};

export default p5;
