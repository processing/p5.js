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
 * This value is then converted to the necessary number of frames to generate it, depending
 * on the value of units. More on that on the next paragraph.
 *
 * An optional object that can contain two more arguments: delay (number) and units (string).
 *
 * `delay`, specifying how much time we should wait before recording
 *
 * `units`, a string that can be either 'seconds' or 'frames'. By default it's 'seconds'.
 *
 * `units` specifies how the duration and delay arguments will behave.
 * If 'seconds', these arguments will correspond to seconds, meaning that 3 seconds worth of animation
 * will be created. If 'frames', the arguments now correspond to the number of frames you want your
 * animation to be, if you are very sure of this number.
 *
 * It is not recommended to write this function inside setup, since it won't work properly.
 * The recommended use can be seen in the example, where we use it inside an event function,
 * like keyPressed or mousePressed.
 *
 * @method saveGif
 * @param  {String} filename File name of your gif
 * @param  {Number} duration Duration in seconds that you wish to capture from your sketch
 * @param  {Object} options An optional object that can contain two more arguments: delay, specifying
 * how much time we should wait before recording, and units, a string that can be either 'seconds' or
 * 'frames'. By default it's 'seconds'.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 * }
 *
 * function draw() {
 *   colorMode(RGB);
 *   background(30);
 *
 *   // create a bunch of circles that move in... circles!
 *   for (let i = 0; i < 10; i++) {
 *     let opacity = map(i, 0, 10, 0, 255);
 *     noStroke();
 *     fill(230, 250, 90, opacity);
 *     circle(
 *       30 * sin(frameCount / (30 - i)) + width / 2,
 *       30 * cos(frameCount / (30 - i)) + height / 2,
 *       10
 *     );
 *   }
 * }
 *
 * // you can put it in the mousePressed function,
 * // or keyPressed for example
 * function keyPressed() {
 *   // this will download the first 5 seconds of the animation!
 *   if (key === 's') {
 *     saveGif('mySketch', 5);
 *   }
 * }
 * </code>
 * </div>
 *
 * @alt
 * animation of a group of yellow circles moving in circles over a dark background
 */
p5.prototype.saveGif = async function(
  fileName,
  duration,
  options = { delay: 0, units: 'seconds' }
) {
  // validate parameters
  if (typeof fileName !== 'string') {
    throw TypeError('fileName parameter must be a string');
  }
  if (typeof duration !== 'number') {
    throw TypeError('Duration parameter must be a number');
  }
  // if arguments in the options object are not correct, cancel operation
  if (typeof options.delay !== 'number') {
    throw TypeError('Delay parameter must be a number');
  }
  // if units is not seconds nor frames, throw error
  if (options.units !== 'seconds' && options.units !== 'frames') {
    throw TypeError('Units parameter must be either "frames" or "seconds"');
  }

  // extract variables for more comfortable use
  let units = options.units;
  let delay = options.delay;

  //   console.log(options);

  // get the project's framerate
  let _frameRate = this._targetFrameRate;
  // if it is undefined or some non useful value, assume it's 60
  if (_frameRate === Infinity || _frameRate === undefined || _frameRate === 0) {
    _frameRate = 60;
  }

  // calculate frame delay based on frameRate

  // this delay has nothing to do with the
  // delay in options, but rather is the delay
  // we have to specify to the gif encoder between frames.
  let gifFrameDelay = 1 / _frameRate * 1000;

  // constrain it to be always greater than 20,
  // otherwise it won't work in some browsers and systems
  // reference: https://stackoverflow.com/questions/64473278/gif-frame-duration-seems-slower-than-expected
  gifFrameDelay = gifFrameDelay < 20 ? 20 : gifFrameDelay;

  // check the mode we are in and how many frames
  // that duration translates to
  const nFrames = units === 'seconds' ? duration * _frameRate : duration;
  const nFramesDelay = units === 'seconds' ? delay * _frameRate : delay;
  const totalNumberOfFrames = nFrames + nFramesDelay;

  // initialize variables for the frames processing
  let frameIterator = nFramesDelay;
  this.frameCount = frameIterator;

  const lastPixelDensity = this._pixelDensity;
  this.pixelDensity(1);

  // We first take every frame that we are going to use for the animation
  let frames = [];

  let progressBarIdName = 'p5.gif.progressBar';
  if (document.getElementById(progressBarIdName) !== null)
    document.getElementById(progressBarIdName).remove();

  let p = this.createP('');
  p.id('progressBar');

  p.style('font-size', '16px');
  p.style('font-family', 'Montserrat');
  p.style('background-color', '#ffffffa0');
  p.style('padding', '8px');
  p.style('border-radius', '10px');
  p.position(0, 0);

  let pixels;
  let gl;
  if (this.drawingContext instanceof WebGLRenderingContext) {
    // if we have a WEBGL context, initialize the pixels array
    // and the gl context to use them inside the loop
    gl = document.getElementById('defaultCanvas0').getContext('webgl');
    pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
  }

  // stop the loop since we are going to manually redraw
  this.noLoop();

  while (frameIterator < totalNumberOfFrames) {
    /*
      we draw the next frame. this is important, since
      busy sketches or low end devices might take longer
      to render some frames. So we just wait for the frame
      to be drawn and immediately save it to a buffer and continue
    */
    this.redraw();

    // depending on the context we'll extract the pixels one way
    // or another
    let data = undefined;

    if (this.drawingContext instanceof WebGLRenderingContext) {
      pixels = new Uint8Array(
        gl.drawingBufferWidth * gl.drawingBufferHeight * 4
      );
      gl.readPixels(
        0,
        0,
        gl.drawingBufferWidth,
        gl.drawingBufferHeight,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixels
      );

      data = _flipPixels(pixels);
    } else {
      data = this.drawingContext.getImageData(0, 0, this.width, this.height)
        .data;
    }

    frames.push(data);
    frameIterator++;

    p.html(
      'Saved frame <b>' +
        frames.length.toString() +
        '</b> out of ' +
        nFrames.toString()
    );
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  p.html('Frames processed, generating color palette...');

  this.loop();
  this.pixelDensity(lastPixelDensity);

  // create the gif encoder and the colorspace format
  const gif = GIFEncoder();

  // calculate the global palette for this set of frames
  const globalPalette = _generateGlobalPalette(frames);

  // the way we designed the palette means we always take the last index for transparency
  const transparentIndex = globalPalette.length - 1;

  // we are going to iterate the frames in pairs, n-1 and n
  for (let i = 0; i < frames.length; i++) {
    if (i === 0) {
      const indexedFrame = applyPalette(frames[i], globalPalette, {
        format: 'rgba4444'
      });
      gif.writeFrame(indexedFrame, this.width, this.height, {
        palette: globalPalette,
        delay: gifFrameDelay,
        dispose: 1
      });
      continue;
    }

    // matching pixels between frames can be set to full transparency,
    // kinda digging a "hole" into the frame to see the pixels that where behind it
    // (which would be the exact same, so not noticeable changes)
    // this helps make the file quite smaller
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

      // if the pixels are equal, save this index to be used later
      if (_pixelEquals(currPixel, lastPixel)) {
        matchingPixelsInFrames.push(p / 4);
      }
    }
    // we decide on one of this colors to be fully transparent
    // Apply palette to RGBA data to get an indexed bitmap
    const indexedFrame = applyPalette(currFramePixels, globalPalette, {
      format: 'rgba4444'
    });

    for (let i = 0; i < matchingPixelsInFrames.length; i++) {
      // here, we overwrite whatever color this pixel was assigned to
      // with the color that we decided we are going to use as transparent.
      // down in writeFrame we are going to tell the encoder that whenever
      // it runs into "transparentIndex", just dig a hole there allowing to
      // see through what was in the frame before it.
      let pixelIndex = matchingPixelsInFrames[i];
      indexedFrame[pixelIndex] = transparentIndex;
    }

    // Write frame into the encoder
    gif.writeFrame(indexedFrame, this.width, this.height, {
      delay: gifFrameDelay,
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

function _flipPixels(pixels) {
  // extracting the pixels using readPixels returns
  // an upside down image. we have to flip it back
  // first. this solution is proposed by gman on
  // this stack overflow answer:
  // https://stackoverflow.com/questions/41969562/how-can-i-flip-the-result-of-webglrenderingcontext-readpixels

  var halfHeight = parseInt(height / 2);
  var bytesPerRow = width * 4;

  // make a temp buffer to hold one row
  var temp = new Uint8Array(width * 4);
  for (var y = 0; y < halfHeight; ++y) {
    var topOffset = y * bytesPerRow;
    var bottomOffset = (height - y - 1) * bytesPerRow;

    // make copy of a row on the top half
    temp.set(pixels.subarray(topOffset, topOffset + bytesPerRow));

    // copy a row from the bottom half to the top
    pixels.copyWithin(topOffset, bottomOffset, bottomOffset + bytesPerRow);

    // copy the copy of the top half row to the bottom half
    pixels.set(temp, bottomOffset);
  }
  return pixels;
}

function _generateGlobalPalette(frames) {
  // make an array the size of every possible color in every possible frame
  // that is: width * height * frames.
  let allColors = new Uint8Array(frames.length * frames[0].length);

  // put every frame one after the other in sequence.
  // this array will hold absolutely every pixel from the animation.
  // the set function on the Uint8Array works super fast tho!
  for (let f = 0; f < frames.length; f++) {
    allColors.set(frames[0], f * frames[0].length);
  }

  // quantize this massive array into 256 colors and return it!
  let colorPalette = quantize(allColors, 256, {
    format: 'rgba444',
    oneBitAlpha: true
  });

  // when generating the palette, we have to leave space for 1 of the
  // indices to be a random color that does not appear anywhere in our
  // animation to use for transparency purposes. So, if the palette is full
  // (has 256 colors), we overwrite the last one with a random, fully transparent
  // color. Otherwise, we just push a new color into the palette the same way.

  // this guarantees that when using the transparency index, there are no matches
  // between some colors of the animation and the "holes" we want to dig on them,
  // which would cause pieces of some frames to be transparent and thus look glitchy.
  if (colorPalette.length === 256) {
    colorPalette[colorPalette.length - 1] = [
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255,
      0
    ];
  } else {
    colorPalette.push([
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255,
      0
    ]);
  }
  return colorPalette;
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
 * @private
 * @param {Constant} xAlign either LEFT, RIGHT or CENTER
 * @param {Constant} yAlign either TOP, BOTTOM or CENTER
 * @param {Number} dx
 * @param {Number} dy
 * @param {Number} dw
 * @param {Number} dh
 * @param {Number} sw
 * @param {Number} sh
 * @returns {Object}
 */

function _imageContain(xAlign, yAlign, dx, dy, dw, dh, sw, sh) {
  const r = Math.max(sw / dw, sh / dh);
  const [adjusted_dw, adjusted_dh] = [sw / r, sh / r];
  let x = dx;
  let y = dy;

  if (xAlign === constants.CENTER) {
    x += (dw - adjusted_dw) / 2;
  } else if (xAlign === constants.RIGHT) {
    x += dw - adjusted_dw;
  }

  if (yAlign === constants.CENTER) {
    y += (dh - adjusted_dh) / 2;
  } else if (yAlign === constants.BOTTOM) {
    y += dh - adjusted_dh;
  }
  return { x, y, w: adjusted_dw, h: adjusted_dh };
}
/**
 * @private
 * @param {Constant} xAlign either LEFT, RIGHT or CENTER
 * @param {Constant} yAlign either TOP, BOTTOM or CENTER
 * @param {Number} dw
 * @param {Number} dh
 * @param {Number} sx
 * @param {Number} sy
 * @param {Number} sw
 * @param {Number} sh
 * @returns {Object}
 */

function _imageCover(xAlign, yAlign, dw, dh, sx, sy, sw, sh) {
  const r = Math.max(dw / sw, dh / sh);
  const [adjusted_sw, adjusted_sh] = [dw / r, dh / r];

  let x = sx;
  let y = sy;

  if (xAlign === constants.CENTER) {
    x += (sw - adjusted_sw) / 2;
  } else if (xAlign === constants.RIGHT) {
    x += sw - adjusted_sw;
  }

  if (yAlign === constants.CENTER) {
    y += (sh - adjusted_sh) / 2;
  } else if (yAlign === constants.BOTTOM) {
    y += sh - adjusted_sh;
  }

  return { x, y, w: adjusted_sw, h: adjusted_sh };
}

/**
 * @private
 * @param {Constant} [fit] either CONTAIN or COVER
 * @param {Constant} xAlign either LEFT, RIGHT or CENTER
 * @param {Constant} yAlign either TOP, BOTTOM or CENTER
 * @param {Number} dx
 * @param {Number} dy
 * @param {Number} dw
 * @param {Number} dh
 * @param {Number} sx
 * @param {Number} sy
 * @param {Number} sw
 * @param {Number} sh
 * @returns {Object}
 */
function _imageFit(fit, xAlign, yAlign, dx, dy, dw, dh, sx, sy, sw, sh) {
  if (fit === constants.COVER) {
    const { x, y, w, h } = _imageCover(xAlign, yAlign, dw, dh, sx, sy, sw, sh);
    sx = x;
    sy = y;
    sw = w;
    sh = h;
  }

  if (fit === constants.CONTAIN) {
    const { x, y, w, h } = _imageContain(
      xAlign,
      yAlign,
      dx,
      dy,
      dw,
      dh,
      sw,
      sh
    );
    dx = x;
    dy = y;
    dw = w;
    dh = h;
  }
  return { sx, sy, sw, sh, dx, dy, dw, dh };
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
 * This function can also be used with eight Number parameters. To
 * differentiate between all these parameters, p5.js uses the language of
 * "destination rectangle" (which corresponds to "dx", "dy", etc.) and "source
 * image" (which corresponds to "sx", "sy", etc.) below. Specifying the
 * "source image" dimensions can be useful when you want to display a
 * subsection of the source image instead of the whole thing. Here's a diagram
 * to explain further:
 * <img src="assets/drawImage.png"></img>
 *
 * This function can also be used to draw images without distorting the orginal aspect ratio,
 * by adding 9th parameter, fit, which can either be COVER or CONTAIN.
 * CONTAIN, as the name suggests, contains the whole image within the specified destination box
 * without distorting the image ratio.
 * COVER covers the entire destination box.
 *
 *
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
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   // dimensions of image are 780 x 440
 *   // dimensions of canvas are 100 x 100
 *   img = loadImage('assets/moonwalk.jpg');
 * }
 * function setup() {
 *   // CONTAIN the whole image without distorting the image's aspect ratio
 *   // CONTAIN the image within the specified destination box and display at LEFT,CENTER position
 *   background(color('green'));
 *   image(img, 0, 0, width, height, 0, 0, img.width, img.height, CONTAIN, LEFT);
 * }
 * </code>
 * </div>
 * <div>
 * <code>
 * let img;
 * function preload() {
 *   img = loadImage('assets/laDefense50.png'); // dimensions of image are 50 x 50
 * }
 * function setup() {
 *   // COVER the whole destination box without distorting the image's aspect ratio
 *   // COVER the specified destination box which is of dimension 100 x 100
 *   // Without specifying xAlign or yAlign, the image will be
 *   // centered in the destination box in both axes
 *   image(img, 0, 0, width, height, 0, 0, img.width, img.height, COVER);
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
 * @param {Constant} [fit] either CONTAIN or COVER
 * @param {Constant} [xAlign] either LEFT, RIGHT or CENTER default is CENTER
 * @param {Constant} [yAlign] either TOP, BOTTOM or CENTER default is CENTER
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
  sHeight,
  fit,
  xAlign,
  yAlign
) {
  // set defaults per spec: https://goo.gl/3ykfOq

  p5._validateParameters('image', arguments);

  let defW = img.width;
  let defH = img.height;
  yAlign = yAlign || constants.CENTER;
  xAlign = xAlign || constants.CENTER;

  if (img.elt && img.elt.videoWidth && !img.canvas) {
    // video no canvas
    defW = img.elt.videoWidth;
    defH = img.elt.videoHeight;
  }

  let _dx = dx;
  let _dy = dy;
  let _dw = dWidth || defW;
  let _dh = dHeight || defH;
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

  let vals = canvas.modeAdjust(_dx, _dy, _dw, _dh, this._renderer._imageMode);
  vals = _imageFit(
    fit,
    xAlign,
    yAlign,
    vals.x,
    vals.y,
    vals.w,
    vals.h,
    _sx,
    _sy,
    _sw,
    _sh
  );

  // tint the image if there is a tint
  this._renderer.image(
    img,
    vals.sx,
    vals.sy,
    vals.sw,
    vals.sh,
    vals.dx,
    vals.dy,
    vals.dw,
    vals.dh
  );
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
