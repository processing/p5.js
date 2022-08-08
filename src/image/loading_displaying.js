/**
 * @module Image
 * @submodule Loading & Displaying
 * @for p5
 * @requires core
 */

import p5 from '../core/main';
import canvas from '../core/helpers';
import * as constants from '../core/constants';
import omggif from 'omggif';
import { GIFEncoder, quantize, applyPalette } from 'gifenc';

import '../core/friendly_errors/validate_params';
import '../core/friendly_errors/file_errors';
import '../core/friendly_errors/fes_core';

/**
 * Loads an image from a path and creates a <a href="#/p5.Image">p5.Image</a> from it.
 *
 * The image may not be immediately available for rendering.
 * If you want to ensure that the image is ready before doing
 * anything with it, place the <a href="#/p5/loadImage">loadImage()</a> call in <a href="#/p5/preload">preload()</a>.
 * You may also supply a callback function to handle the image when it's ready.
 *
 * The path to the image should be relative to the HTML file
 * that links in your sketch. Loading an image from a URL or other
 * remote location may be blocked due to your browser's built-in
 * security.

 * You can also pass in a string of a base64 encoded image as an alternative to the file path.
 * Remember to add "data:image/png;base64," in front of the string.
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
 */
p5.prototype.loadImage = function(path, successCallback, failureCallback) {
  p5._validateParameters('loadImage', arguments);
  const pImg = new p5.Image(1, 1, this);
  const self = this;

  const req = new Request(path, {
    method: 'GET',
    mode: 'cors'
  });

  fetch(path, req)
    .then(response => {
      // GIF section
      const contentType = response.headers.get('content-type');
      if (contentType === null) {
        console.warn(
          'The image you loaded does not have a Content-Type header. If you are using the online editor consider reuploading the asset.'
        );
      }
      if (contentType && contentType.includes('image/gif')) {
        response.arrayBuffer().then(
          arrayBuffer => {
            if (arrayBuffer) {
              const byteArray = new Uint8Array(arrayBuffer);
              _createGif(
                byteArray,
                pImg,
                successCallback,
                failureCallback,
                (pImg => {
                  self._decrementPreload();
                }).bind(self)
              );
            }
          },
          e => {
            if (typeof failureCallback === 'function') {
              failureCallback(e);
            } else {
              console.error(e);
            }
          }
        );
      } else {
        // Non-GIF Section
        const img = new Image();

        img.onload = () => {
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

        img.onerror = e => {
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
      }
      pImg.modified = true;
    })
    .catch(e => {
      p5._friendlyFileLoadError(0, path);
      if (typeof failureCallback === 'function') {
        failureCallback(e);
      } else {
        console.error(e);
      }
    });
  return pImg;
};

/**
 * Generates a gif of your current animation and downloads it to your computer!
 *
 * The duration argument specifies how many seconds you want to record from your animation.
 * This value is then converted to the necessary number of frames to generate it.
 *
 * With the delay argument, you can tell the function to skip the first `delay` seconds
 * of the animation, and then download the `duration` next seconds. This means that regardless
 * of the value of `delay`, your gif will always be `duration` seconds long.
 *
 * @method saveGif
 * @param  {String} filename File name of your gif
 * @param  {String} duration Duration in seconds that you wish to capture from your sketch
 * @param  {String} delay Duration in seconds that you wish to wait before starting to capture
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *   colorMode(HSL);
 * }

 * function draw() {
 *   // create some cool dynamic background
 *   let hue = map(sin(frameCount / 100), -1, 1, 0, 100);
 *   background(hue, 40, 60);

 *   // create a circle that moves diagonally
 *   circle(
 *     100 * sin(frameCount / 10) + width / 2,
 *     100 * sin(frameCount / 10) + height / 2,
 *     10
 *   );
 * }

 * // you can put it in the mousePressed function,
 * // or keyPressed for example
 * function mousePressed() {
 *   // this will download the first two seconds of my animation!
 *   saveGif('mySketch', 2);
 * }
 * </code>
 * </div>
 *
 * @alt
 * animation of a circle moving smoothly diagonally
 */
p5.prototype.saveGif = async function(...args) {
  // process args

  let fileName;
  let seconds;
  let delay;

  //   this section takes care of parsing and processing
  //   the arguments in the correct format
  switch (args.length) {
    case 2:
      fileName = args[0];
      seconds = args[1];
      break;
    case 3:
      fileName = args[0];
      seconds = args[1];
      delay = args[2];
      break;
  }

  if (!delay) {
    delay = 0;
  }

  // get the project's framerate
  // if it is undefined or some non useful value, assume it's 60
  let _frameRate = this._targetFrameRate;
  if (_frameRate === Infinity || _frameRate === undefined || _frameRate === 0) {
    _frameRate = 60;
  }

  // because the input was in seconds, we now calculate
  // how many frames those seconds translate to
  let nFrames = Math.ceil(seconds * _frameRate);
  let nFramesDelay = Math.ceil(delay * _frameRate);

  //   initialize variables for the frames processing
  var count = nFramesDelay;

  this.noLoop();
  // we start on the frame set by the delay argument
  frameCount = nFramesDelay;

  const lastPixelDensity = this._pixelDensity;
  this.pixelDensity(1);

  // We first take every frame that we are going to use for the animation
  let frames = [];

  if (document.getElementById('progressBar') !== null)
    document.getElementById('progressBar').remove();

  let p = this.createP('');
  p.id('progressBar');

  p.style('font-size', '16px');
  p.style('font-family', 'Montserrat');
  p.style('background-color', '#ffffffa0');
  p.style('padding', '8px');
  p.style('border-radius', '10px');
  p.position(0, 0);

  while (count < nFrames + nFramesDelay) {
    /*
      we draw the next frame. this is important, since
      busy sketches or low end devices might take longer
      to render some frames. So we just wait for the frame
      to be drawn and immediately save it to a buffer and continue
      */
    this.redraw();

    const data = this.drawingContext.getImageData(0, 0, this.width, this.height)
      .data;

    frames.push(data);
    count++;

    p.html(
      'Saved frame <b>' +
        frames.length.toString() +
        '</b> out of ' +
        nFrames.toString()
    );
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  p.html('Frames processed, encoding gif. This may take a while...');

  this.loop();
  this.pixelDensity(lastPixelDensity);

  // create the gif encoder and the colorspace format
  const gif = GIFEncoder();
  const format = 'rgb444';

  // calculate the global palette for this set of frames
  const globalPalette = _generateGlobalPalette(frames, format);
  const transparentIndex = globalPalette.length - 1;

  // we are going to iterate the frames in pairs, n-1 and n
  for (let i = 0; i < frames.length; i++) {
    if (i === 0) {
      const indexedFrame = applyPalette(frames[i], globalPalette, { format });
      gif.writeFrame(indexedFrame, this.width, this.height, {
        palette: globalPalette,
        delay: 20,
        dispose: 1
      });
      continue;
    }

    // matching pixels between frames can be set to full transparency,
    // kinda digging a "hole" into the frame to see the pixels that where behind it
    // (which would be the exact same, so not noticeable changes)
    // this helps make the file smaller
    let currFramePixels = frames[i];
    let lastFramePixels = frames[i - 1];
    let matchingPixelsInFrames = [];
    for (let p = 0; p < currFramePixels.length; p += 4) {
      let currPixel = [
        currFramePixels[p],
        currFramePixels[p + 1],
        currFramePixels[p + 2],
        currFramePixels[p + 3]
      ];
      let lastPixel = [
        lastFramePixels[p],
        lastFramePixels[p + 1],
        lastFramePixels[p + 2],
        lastFramePixels[p + 3]
      ];
      if (_pixelEquals(currPixel, lastPixel)) {
        matchingPixelsInFrames.push(parseInt(p / 4));
      }
    }
    // we decide on one of this colors to be fully transparent
    // Apply palette to RGBA data to get an indexed bitmap
    const indexedFrame = applyPalette(currFramePixels, globalPalette, {
      format
    });

    // console.log(transparentIndex, globalPalette[transparentIndex]);

    for (let mp of matchingPixelsInFrames) {
      // here, we overwrite whatever color this pixel was assigned to
      // with the color that we decided we are going to use as transparent.
      // down in writeFrame we are going to tell the encoder that whenever
      // it runs into "transparentIndex", just dig a hole there allowing to
      // see through what was in the frame before it.
      indexedFrame[mp] = transparentIndex;
    }
    // Write frame into the encoder

    gif.writeFrame(indexedFrame, this.width, this.height, {
      delay: 20,
      transparent: true,
      transparentIndex: transparentIndex,
      dispose: 1
    });

    p.html(
      'Rendered frame <b>' + i.toString() + '</b> out of ' + nFrames.toString()
    );

    // this just makes the process asynchronous, preventing
    // that the encoding locks up the browser
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  gif.finish();

  // Get a direct typed array view into the buffer to avoid copying it
  const buffer = gif.bytesView();
  const extension = 'gif';
  const blob = new Blob([buffer], {
    type: 'image/gif'
  });

  frames = [];
  this.loop();

  p.html('Done. Downloading your gif!🌸');
  p5.prototype.downloadFile(blob, fileName, extension);
};

function _generateGlobalPalette(frames, format) {
  // for each frame, we'll keep track of the count of
  // every unique color. that is: how many times does
  // this particular color appear in every frame?
  // Then we'll sort the colors and pick the top 256!

  // calculate the frequency table for the colors
  let colorFreq = {};
  for (let f = 0; f < frames.length; f++) {
    /**
     * here, we use the quantize function in a rather unusual way.
     * the quantize function will return a subset of colors for
     * the given array of pixels. this is kinda like a "sum up" of
     * the most important colors in the image, which will prevent us
     * from exhaustively analyzing every pixel from every frame.
     *
     * in this case, we can just analyze the subset of the most
     * important colors from each frame, which is actually more
     * than enough for it to work properly.
     */
    let currPalette = quantize(frames[f], 256, { format });

    for (let c = 0; c < currPalette.length; c++) {
      // colors are in the format [r, g, b, (a)], as in [255, 127, 45, 255]
      // we'll convert the array to its string representation so it can be used as an index!

      let colorStr = currPalette[c].toString();

      if (colorFreq[colorStr] === undefined) {
        colorFreq[colorStr] = 1;
      } else {
        colorFreq[colorStr] = colorFreq[colorStr] + 1;
      }
    }
  }

  // at this point colorFreq is a dict with {color: count},
  // telling us how many times each color appears in the whole animation

  // we create a new view into the dictionary as an array, in the form
  // ['color', count]
  let dictItems = Object.keys(colorFreq).map(function(key) {
    return [key, colorFreq[key]];
  });

  // with that view, we can now properly sort the array based
  // on the second component of each element
  dictItems.sort(function(first, second) {
    return second[1] - first[1];
  });

  // we process it undoing the string operation coverting that into
  // an array of strings (['255', '127', '45']) and then we convert
  // that again to an array of integers
  let colorsSortedByFreq = dictItems.map(i =>
    i[0].split(',').map(n => parseInt(n))
  );

  // now we simply extract the top 256 colors!
  return colorsSortedByFreq.splice(0, 256);
}

function _pixelEquals(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

/**
 * Helper function for loading GIF-based images
 */
function _createGif(
  arrayBuffer,
  pImg,
  successCallback,
  failureCallback,
  finishCallback
) {
  const gifReader = new omggif.GifReader(arrayBuffer);
  pImg.width = pImg.canvas.width = gifReader.width;
  pImg.height = pImg.canvas.height = gifReader.height;
  const frames = [];
  const numFrames = gifReader.numFrames();
  let framePixels = new Uint8ClampedArray(pImg.width * pImg.height * 4);
  if (numFrames > 1) {
    const loadGIFFrameIntoImage = (frameNum, gifReader) => {
      try {
        gifReader.decodeAndBlitFrameRGBA(frameNum, framePixels);
      } catch (e) {
        p5._friendlyFileLoadError(8, pImg.src);
        if (typeof failureCallback === 'function') {
          failureCallback(e);
        } else {
          console.error(e);
        }
      }
    };
    for (let j = 0; j < numFrames; j++) {
      const frameInfo = gifReader.frameInfo(j);
      const prevFrameData = pImg.drawingContext.getImageData(
        0,
        0,
        pImg.width,
        pImg.height
      );
      framePixels = prevFrameData.data.slice();
      loadGIFFrameIntoImage(j, gifReader);
      const imageData = new ImageData(framePixels, pImg.width, pImg.height);
      pImg.drawingContext.putImageData(imageData, 0, 0);
      let frameDelay = frameInfo.delay;
      // To maintain the default of 10FPS when frameInfo.delay equals to 0
      if (frameDelay === 0) {
        frameDelay = 10;
      }
      frames.push({
        image: pImg.drawingContext.getImageData(0, 0, pImg.width, pImg.height),
        delay: frameDelay * 10 //GIF stores delay in one-hundredth of a second, shift to ms
      });

      // Some GIFs are encoded so that they expect the previous frame
      // to be under the current frame. This can occur at a sub-frame level
      //
      // Values :    0 -   No disposal specified. The decoder is
      //                   not required to take any action.
      //             1 -   Do not dispose. The graphic is to be left
      //                   in place.
      //             2 -   Restore to background color. The area used by the
      //                   graphic must be restored to the background color.
      //             3 -   Restore to previous. The decoder is required to
      //                   restore the area overwritten by the graphic with
      //                   what was there prior to rendering the graphic.
      //          4-7 -    To be defined.
      if (frameInfo.disposal === 2) {
        // Restore background color
        pImg.drawingContext.clearRect(
          frameInfo.x,
          frameInfo.y,
          frameInfo.width,
          frameInfo.height
        );
      } else if (frameInfo.disposal === 3) {
        // Restore previous
        pImg.drawingContext.putImageData(
          prevFrameData,
          0,
          0,
          frameInfo.x,
          frameInfo.y,
          frameInfo.width,
          frameInfo.height
        );
      }
    }

    //Uses Netscape block encoding
    //to repeat forever, this will be 0
    //to repeat just once, this will be null
    //to repeat N times (1<N), should contain integer for loop number
    //this is changed to more usable values for us
    //to repeat forever, loopCount = null
    //everything else is just the number of loops
    let loopLimit = gifReader.loopCount();
    if (loopLimit === null) {
      loopLimit = 1;
    } else if (loopLimit === 0) {
      loopLimit = null;
    }

    // we used the pImg for painting and saving during load
    // so we have to reset it to the first frame
    pImg.drawingContext.putImageData(frames[0].image, 0, 0);

    pImg.gifProperties = {
      displayIndex: 0,
      loopLimit,
      loopCount: 0,
      frames,
      numFrames,
      playing: true,
      timeDisplayed: 0,
      lastChangeTime: 0
    };
  }

  if (typeof successCallback === 'function') {
    successCallback(pImg);
  }
  finishCallback();
}

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
 * @param  {p5.Image|p5.Element|p5.Texture} img    the image to display
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
 *   // Width and height are 50×50
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
 *   // Width and height are the img's original width and height, 100×100
 *   image(img, 0, 0);
 *   // 2. Top right image
 *   // Top-left corner of destination rectangle is at (50, 0)
 *   // Destination rectangle width and height are 40×20
 *   // The next parameters are relative to the source image:
 *   // - Starting at position (50, 50) on the source image, capture a 50×50
 *   // subsection
 *   // - Draw this subsection to fill the dimensions of the destination rectangle
 *   image(img, 50, 0, 40, 20, 50, 50, 50, 50);
 * }
 * </code>
 * </div>
 * @alt
 * image of the underside of a white umbrella and gridded ceiling above
 * image of the underside of a white umbrella and gridded ceiling above
 */
/**
 * @method image
 * @param  {p5.Image|p5.Element|p5.Texture} img
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

  let defW = img.width;
  let defH = img.height;

  if (img.elt && img.elt.videoWidth && !img.canvas) {
    // video no canvas
    defW = img.elt.videoWidth;
    defH = img.elt.videoHeight;
  }

  const _dx = dx;
  const _dy = dy;
  const _dw = dWidth || defW;
  const _dh = dHeight || defH;
  let _sx = sx || 0;
  let _sy = sy || 0;
  let _sw = sWidth || defW;
  let _sh = sHeight || defH;

  _sw = _sAssign(_sw, defW);
  _sh = _sAssign(_sh, defH);

  // This part needs cleanup and unit tests
  // see issues https://github.com/processing/p5.js/issues/1741
  // and https://github.com/processing/p5.js/issues/1673
  let pd = 1;

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

  const vals = canvas.modeAdjust(_dx, _dy, _dw, _dh, this._renderer._imageMode);

  // tint the image if there is a tint
  this._renderer.image(img, _sx, _sy, _sw, _sh, vals.x, vals.y, vals.w, vals.h);
};

/**
 * Sets the fill value for displaying images. Images can be tinted to
 * specified colors or made transparent by including an alpha value.
 *
 * To apply transparency to an image without affecting its color, use
 * white as the tint color and specify an alpha value. For instance,
 * tint(255, 128) will make an image 50% transparent (assuming the default
 * alpha range of 0-255, which can be changed with <a href="#/p5/colorMode">colorMode()</a>).
 *
 * The value for the gray parameter must be less than or equal to the current
 * maximum value as specified by <a href="#/p5/colorMode">colorMode()</a>. The default maximum value is
 * 255.
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
p5.prototype.tint = function(...args) {
  p5._validateParameters('tint', args);
  const c = this.color(...args);
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
 */
p5.prototype._getTintedImageCanvas =
  p5.Renderer2D.prototype._getTintedImageCanvas;

/**
 * Set image mode. Modifies the location from which images are drawn by
 * changing the way in which parameters given to <a href="#/p5/image">image()</a> are interpreted.
 * The default mode is imageMode(CORNER), which interprets the second and
 * third parameters of <a href="#/p5/image">image()</a> as the upper-left corner of the image. If
 * two additional parameters are specified, they are used to set the image's
 * width and height.
 *
 * imageMode(CORNERS) interprets the second and third parameters of <a href="#/p5/image">image()</a>
 * as the location of one corner, and the fourth and fifth parameters as the
 * opposite corner.
 *
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

export default p5;
