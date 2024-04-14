/**
 * @module Image
 * @submodule Loading & Displaying
 * @for p5
 * @requires core
 */

import p5 from '../core/main';
import canvas from '../core/helpers';
import * as constants from '../core/constants';
import * as omggif from 'omggif';
import { GIFEncoder, quantize, nearestColorIndex } from 'gifenc';

import '../core/friendly_errors/validate_params';
import '../core/friendly_errors/file_errors';
import '../core/friendly_errors/fes_core';

/**
 * Loads an image to create a <a href="#/p5.Image">p5.Image</a> object.
 *
 * `loadImage()` interprets the first parameter one of three ways. If the path
 * to an image file is provided, `loadImage()` will load it. Paths to local
 * files should be relative, such as `'assets/thundercat.jpg'`. URLs such as
 * `'https://example.com/thundercat.jpg'` may be blocked due to browser
 * security. Raw image data can also be passed as a base64 encoded image in
 * the form `'data:image/png;base64,arandomsequenceofcharacters'`.
 *
 * The second parameter is optional. If a function is passed, it will be
 * called once the image has loaded. The callback function can optionally use
 * the new <a href="#/p5.Image">p5.Image</a> object.
 *
 * The third parameter is also optional. If a function is passed, it will be
 * called if the image fails to load. The callback function can optionally use
 * the event error.
 *
 * Images can take time to load. Calling `loadImage()` in
 * <a href="#/p5/preload">preload()</a> ensures images load before they're
 * used in <a href="#/p5/setup">setup()</a> or <a href="#/p5/draw">draw()</a>.
 *
 * @method loadImage
 * @param  {String} path path of the image to be loaded or base64 encoded image.
 * @param  {function(p5.Image)} [successCallback] function called with
 *                               <a href="#/p5.Image">p5.Image</a> once it
 *                               loads.
 * @param  {function(Event)}    [failureCallback] function called with event
 *                               error if the image fails to load.
 * @return {p5.Image}            the <a href="#/p5.Image">p5.Image</a> object.
 * @example
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 *
 * function setup() {
 *   image(img, 0, 0);
 *   describe('Image of the underside of a white umbrella and a gridded ceiling.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   loadImage('assets/laDefense.jpg', img => {
 *     image(img, 0, 0);
 *   });
 *   describe('Image of the underside of a white umbrella and a gridded ceiling.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   loadImage('assets/laDefense.jpg', success, failure);
 * }
 *
 * function success(img) {
 *   image(img, 0, 0);
 *   describe('Image of the underside of a white umbrella and a gridded ceiling.');
 * }
 *
 * function failure(event) {
 *   console.error('Oops!', event);
 * }
 * </code>
 * </div>
 */
p5.prototype.loadImage = async function(
  path,
  successCallback,
  failureCallback
) {
  p5._validateParameters('loadImage', arguments);
  const pImg = new p5.Image(1, 1, this);
  const self = this;

  const req = new Request(path, {
    method: 'GET',
    mode: 'cors'
  });

  return fetch(path, req)
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
              try{
                _createGif(
                  byteArray,
                  pImg,
                  successCallback,
                  failureCallback,
                  (pImg => {
                    self._decrementPreload();
                  }).bind(self)
                );
              }catch(e){
                console.error(e.toString(), e.stack);
                if (typeof failureCallback === 'function') {
                  failureCallback(e);
                  self._decrementPreload();
                } else {
                  console.error(e);
                }
              }
            }
          },
          e => {
            if (typeof failureCallback === 'function') {
              failureCallback(e);
              self._decrementPreload();
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
            self._decrementPreload();
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
      return pImg;
    })
    .catch(e => {
      p5._friendlyFileLoadError(0, path);
      if (typeof failureCallback === 'function') {
        failureCallback(e);
        self._decrementPreload();
      } else {
        console.error(e);
      }
    });
  // return pImg;
};

/**
 * Generates a gif from a sketch and saves it to a file. `saveGif()` may be
 * called in <a href="#/p5/setup">setup()</a> or at any point while a sketch
 * is running.
 *
 * The first parameter, `fileName`, sets the gif's file name. The second
 * parameter, `duration`, sets the gif's duration in seconds.
 *
 * The third parameter, `options`, is optional. If an object is passed,
 * `saveGif()` will use its properties to customize the gif. `saveGif()`
 * recognizes the properties `delay`, `units`, `silent`,
 * `notificationDuration`, and `notificationID`.
 *
 * @method saveGif
 * @param  {String} filename file name of gif.
 * @param  {Number} duration duration in seconds to capture from the sketch.
 * @param  {Object} [options] an object that can contain five more properties:
 *                  `delay`, a Number specifying how much time to wait before recording;
 *                  `units`, a String that can be either 'seconds' or 'frames'. By default it's 'seconds’;
 *                  `silent`, a Boolean that defines presence of progress notifications. By default it’s `false`;
 *                  `notificationDuration`, a Number that defines how long in seconds the final notification
 *                  will live. By default it's `0`, meaning the notification will never be removed;
 *                  `notificationID`, a String that specifies the id of the notification's DOM element. By default it’s `'progressBar’`.
 *
 * @example
 * <div>
 * <code>
 * function draw() {
 *   background(200);
 *   let c = frameCount % 255;
 *   fill(c);
 *   circle(50, 50, 25);
 *
 *   describe('A circle drawn in the middle of a gray square. The circle changes color from black to white, then repeats.');
 * }
 *
 * function keyPressed() {
 *   if (key === 's') {
 *     saveGif('mySketch', 5);
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype.saveGif = async function(
  fileName,
  duration,
  options = {
    delay: 0,
    units: 'seconds',
    silent: false,
    notificationDuration: 0,
    notificationID: 'progressBar'
  }
) {
  // validate parameters
  if (typeof fileName !== 'string') {
    throw TypeError('fileName parameter must be a string');
  }
  if (typeof duration !== 'number') {
    throw TypeError('Duration parameter must be a number');
  }

  // extract variables for more comfortable use
  const delay = (options && options.delay) || 0;  // in seconds
  const units = (options && options.units) || 'seconds';  // either 'seconds' or 'frames'
  const silent = (options && options.silent) || false;
  const notificationDuration = (options && options.notificationDuration) || 0;
  const notificationID = (options && options.notificationID) || 'progressBar';

  // if arguments in the options object are not correct, cancel operation
  if (typeof delay !== 'number') {
    throw TypeError('Delay parameter must be a number');
  }
  // if units is not seconds nor frames, throw error
  if (units !== 'seconds' && units !== 'frames') {
    throw TypeError('Units parameter must be either "frames" or "seconds"');
  }

  if (typeof silent !== 'boolean') {
    throw TypeError('Silent parameter must be a boolean');
  }

  if (typeof notificationDuration !== 'number') {
    throw TypeError('Notification duration parameter must be a number');
  }

  if (typeof notificationID !== 'string') {
    throw TypeError('Notification ID parameter must be a string');
  }

  this._recording = true;

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

  if (document.getElementById(notificationID) !== null)
    document.getElementById(notificationID).remove();

  let p;
  if (!silent){
    p = this.createP('');
    p.id(notificationID);
    p.style('font-size', '16px');
    p.style('font-family', 'Montserrat');
    p.style('background-color', '#ffffffa0');
    p.style('padding', '8px');
    p.style('border-radius', '10px');
    p.position(0, 0);
  }

  let pixels;
  let gl;
  if (this._renderer instanceof p5.RendererGL) {
    // if we have a WEBGL context, initialize the pixels array
    // and the gl context to use them inside the loop
    gl = this.drawingContext;
    pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
  }

  // stop the loop since we are going to manually redraw
  this.noLoop();

  // Defer execution until the rest of the call stack finishes, allowing the
  // rest of `setup` to be called (and, importantly, canvases hidden in setup
  // to be unhidden.)
  //
  // Waiting on this empty promise means we'll continue as soon as setup
  // finishes without waiting for another frame.
  await Promise.resolve();

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

    if (this._renderer instanceof p5.RendererGL) {
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

      data = _flipPixels(pixels, this.width, this.height);
    } else {
      data = this.drawingContext.getImageData(0, 0, this.width, this.height)
        .data;
    }

    frames.push(data);
    frameIterator++;

    if (!silent) {
      p.html(
        'Saved frame <b>' +
        frames.length.toString() +
        '</b> out of ' +
        nFrames.toString()
      );
    }
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  if (!silent) p.html('Frames processed, generating color palette...');

  this.loop();
  this.pixelDensity(lastPixelDensity);

  // create the gif encoder and the colorspace format
  const gif = GIFEncoder();

  // calculate the global palette for this set of frames
  const globalPalette = _generateGlobalPalette(frames);

  // Rather than using applyPalette() from the gifenc library, we use our
  // own function to map frame pixels to a palette color. This way, we can
  // cache palette color mappings between frames for extra performance, and
  // use our own caching mechanism to avoid flickering colors from cache
  // key collisions.
  const paletteCache = {};
  const getIndexedFrame = frame => {
    const length = frame.length / 4;
    const index = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      const key =
        (frame[i * 4] << 24) |
        (frame[i * 4 + 1] << 16) |
        (frame[i * 4 + 2] << 8) |
        frame[i * 4 + 3];
      if (paletteCache[key] === undefined) {
        paletteCache[key] = nearestColorIndex(
          globalPalette,
          frame.slice(i * 4, (i + 1) * 4)
        );
      }
      index[i] = paletteCache[key];
    }
    return index;
  };

  // the way we designed the palette means we always take the last index for transparency
  const transparentIndex = globalPalette.length - 1;

  // we are going to iterate the frames in pairs, n-1 and n
  let prevIndexedFrame = [];
  for (let i = 0; i < frames.length; i++) {
    //const indexedFrame = applyPalette(frames[i], globalPaletteWithoutAlpha, 'rgba565');
    const indexedFrame = getIndexedFrame(frames[i]);

    // Make a copy of the palette-applied frame before editing the original
    // to use transparent pixels
    const originalIndexedFrame = indexedFrame.slice();

    if (i === 0) {
      gif.writeFrame(indexedFrame, this.width, this.height, {
        palette: globalPalette,
        delay: gifFrameDelay,
        dispose: 1
      });
    } else {
      // Matching pixels between frames can be set to full transparency,
      // allowing the previous frame's pixels to show through. We only do
      // this for pixels that get mapped to the same quantized color so that
      // the resulting image would be the same.
      for (let i = 0; i < indexedFrame.length; i++) {
        if (indexedFrame[i] === prevIndexedFrame[i]) {
          indexedFrame[i] = transparentIndex;
        }
      }

      // Write frame into the encoder
      gif.writeFrame(indexedFrame, this.width, this.height, {
        delay: gifFrameDelay,
        transparent: true,
        transparentIndex,
        dispose: 1
      });
    }

    prevIndexedFrame = originalIndexedFrame;

    if (!silent) {
      p.html(
        'Rendered frame <b>' + i.toString() + '</b> out of ' + nFrames.toString()
      );
    }


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
  this._recording = false;
  this.loop();

  if (!silent){
    p.html('Done. Downloading your gif!🌸');
    if(notificationDuration > 0)
      setTimeout(() => p.remove(), notificationDuration * 1000);
  }

  p5.prototype.downloadFile(blob, fileName, extension);
};

function _flipPixels(pixels, width, height) {
  // extracting the pixels using readPixels returns
  // an upside down image. we have to flip it back
  // first. this solution is proposed by gman on
  // this stack overflow answer:
  // https://stackoverflow.com/questions/41969562/how-can-i-flip-the-result-of-webglrenderingcontext-readpixels

  const halfHeight = parseInt(height / 2);
  const bytesPerRow = width * 4;

  // make a temp buffer to hold one row
  const temp = new Uint8Array(width * 4);
  for (let y = 0; y < halfHeight; ++y) {
    const topOffset = y * bytesPerRow;
    const bottomOffset = (height - y - 1) * bytesPerRow;

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
    allColors.set(frames[f], f * frames[0].length);
  }

  // quantize this massive array into 256 colors and return it!
  let colorPalette = quantize(allColors, 256, {
    format: 'rgba4444',
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

  if (frames.length > 1) {
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
 * @param {(LEFT|RIGHT|CENTER)} xAlign either LEFT, RIGHT or CENTER
 * @param {(TOP|BOTTOM|CENTER)} yAlign either TOP, BOTTOM or CENTER
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
 * @param {(LEFT|RIGHT|CENTER)} xAlign either LEFT, RIGHT or CENTER
 * @param {(TOP|BOTTOM|CENTER)} yAlign either TOP, BOTTOM or CENTER
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
 * @param {(CONTAIN|COVER)} [fit] either CONTAIN or COVER
 * @param {(LEFT|RIGHT|CENTER)} xAlign either LEFT, RIGHT or CENTER
 * @param {(TOP|BOTTOM|CENTER)} yAlign either TOP, BOTTOM or CENTER
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
 * Draws a source image to the canvas.
 *
 * The first parameter, `img`, is the source image to be drawn. The second and
 * third parameters, `dx` and `dy`, set the coordinates of the destination
 * image's top left corner. See <a href="#/p5/imageMode">imageMode()</a> for
 * other ways to position images.
 *
 * Here's a diagram that explains how optional parameters work in `image()`:
 *
 * <img src="assets/drawImage.png"></img>
 *
 * The fourth and fifth parameters, `dw` and `dh`, are optional. They set the
 * the width and height to draw the destination image. By default, `image()`
 * draws the full source image at its original size.
 *
 * The sixth and seventh parameters, `sx` and `sy`, are also optional.
 * These coordinates define the top left corner of a subsection to draw from
 * the source image.
 *
 * The eighth and ninth parameters, `sw` and `sh`, are also optional.
 * They define the width and height of a subsection to draw from the source
 * image. By default, `image()` draws the full subsection that begins at
 * (`sx`, `sy`) and extends to the edges of the source image.
 *
 * The ninth parameter, `fit`, is also optional. It enables a subsection of
 * the source image to be drawn without affecting its aspect ratio. If
 * `CONTAIN` is passed, the full subsection will appear within the destination
 * rectangle. If `COVER` is passed, the subsection will completely cover the
 * destination rectangle. This may have the effect of zooming into the
 * subsection.
 *
 * The tenth and eleventh paremeters, `xAlign` and `yAlign`, are also
 * optional. They determine how to align the fitted subsection. `xAlign` can
 * be set to either `LEFT`, `RIGHT`, or `CENTER`. `yAlign` can be set to
 * either `TOP`, `BOTTOM`, or `CENTER`. By default, both `xAlign` and `yAlign`
 * are set to `CENTER`.
 *
 * @method image
 * @param  {p5.Image|p5.Element|p5.Texture|p5.Framebuffer|p5.FramebufferTexture} img image to display.
 * @param  {Number}   x x-coordinate of the top-left corner of the image.
 * @param  {Number}   y y-coordinate of the top-left corner of the image.
 * @param  {Number}   [width]  width to draw the image.
 * @param  {Number}   [height] height to draw the image.
 * @example
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 *
 * function setup() {
 *   background(50);
 *   image(img, 0, 0);
 *
 *   describe('An image of the underside of a white umbrella with a gridded ceiling above.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 *
 * function setup() {
 *   background(50);
 *   image(img, 10, 10);
 *
 *   describe('An image of the underside of a white umbrella with a gridded ceiling above. The image has dark gray borders on its left and top.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 *
 * function setup() {
 *   background(50);
 *   image(img, 0, 0, 50, 50);
 *
 *   describe('An image of the underside of a white umbrella with a gridded ceiling above. The image is drawn in the top left corner of a dark gray square.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 *
 * function setup() {
 *   background(50);
 *   image(img, 25, 25, 50, 50, 25, 25, 50, 50);
 *
 *   describe('An image of a gridded ceiling drawn in the center of a dark gray square.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/moonwalk.jpg');
 * }
 *
 * function setup() {
 *   background(50);
 *   image(img, 0, 0, width, height, 0, 0, img.width, img.height, CONTAIN);
 *
 *   describe('An image of an astronaut on the moon. The top and bottom borders of the image are dark gray.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   // Image is 50 x 50 pixels.
 *   img = loadImage('assets/laDefense50.png');
 * }
 *
 * function setup() {
 *   background(50);
 *   image(img, 0, 0, width, height, 0, 0, img.width, img.height, COVER);
 *
 *   describe('A pixelated image of the underside of a white umbrella with a gridded ceiling above.');
 * }
 * </code>
 * </div>
 */
/**
 * @method image
 * @param  {p5.Image|p5.Element|p5.Texture|p5.Framebuffer|p5.FramebufferTexture} img
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
 * @param {(CONTAIN|COVER)} [fit] either CONTAIN or COVER
 * @param {(LEFT|RIGHT|CENTER)} [xAlign=CENTER] either LEFT, RIGHT or CENTER default is CENTER
 * @param {(TOP|BOTTOM|CENTER)} [yAlign=CENTER] either TOP, BOTTOM or CENTER default is CENTER
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

  if (img.elt) {
    defW = defW !== undefined ? defW : img.elt.width;
    defH = defH !== undefined ? defH : img.elt.height;
  }
  if (img.elt && img.elt.videoWidth && !img.canvas) {
    // video no canvas
    defW = defW !== undefined ? defW : img.elt.videoWidth;
    defH = defH !== undefined ? defH : img.elt.videoHeight;
  }

  let _dx = dx;
  let _dy = dy;
  let _dw = dWidth || defW;
  let _dh = dHeight || defH;
  let _sx = sx || 0;
  let _sy = sy || 0;
  let _sw = sWidth !== undefined ? sWidth : defW;
  let _sh = sHeight !== undefined ? sHeight : defH;

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
 * Tints images using a specified color.
 *
 * The version of `tint()` with one parameter interprets it one of four ways.
 * If the parameter is a number, it's interpreted as a grayscale value. If the
 * parameter is a string, it's interpreted as a CSS color string. An array of
 * `[R, G, B, A]` values or a <a href="#/p5.Color">p5.Color</a> object can
 * also be used to set the tint color.
 *
 * The version of `tint()` with two parameters uses the first one as a
 * grayscale value and the second as an alpha value. For example, calling
 * `tint(255, 128)` will make an image 50% transparent.
 *
 * The version of `tint()` with three parameters interprets them as RGB or
 * HSB values, depending on the current
 * <a href="#/p5/colorMode">colorMode()</a>. The optional fourth parameter
 * sets the alpha value. For example, `tint(255, 0, 0, 100)` will give images
 * a red tint and make them transparent.
 *
 * @method tint
 * @param  {Number}        v1      red or hue value.
 * @param  {Number}        v2      green or saturation value.
 * @param  {Number}        v3      blue or brightness.
 * @param  {Number}        [alpha]
 *
 * @example
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 *
 * function setup() {
 *   image(img, 0, 0);
 *   tint('red');
 *   image(img, 50, 0);
 *
 *   describe('Two images of an umbrella and a ceiling side-by-side. The image on the right has a red tint.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 *
 * function setup() {
 *   image(img, 0, 0);
 *   tint(255, 0, 0);
 *   image(img, 50, 0);
 *
 *   describe('Two images of an umbrella and a ceiling side-by-side. The image on the right has a red tint.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 *
 * function setup() {
 *   image(img, 0, 0);
 *   tint(255, 0, 0, 100);
 *   image(img, 50, 0);
 *
 *   describe('Two images of an umbrella and a ceiling side-by-side. The image on the right has a transparent red tint.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 *
 * function setup() {
 *   image(img, 0, 0);
 *   tint(255, 180);
 *   image(img, 50, 0);
 *
 *   describe('Two images of an umbrella and a ceiling side-by-side. The image on the right is transparent.');
 * }
 * </code>
 * </div>
 */
/**
 * @method tint
 * @param  {String}        value   CSS color string.
 */

/**
 * @method tint
 * @param  {Number}        gray   grayscale value.
 * @param  {Number}        [alpha]
 */

/**
 * @method tint
 * @param  {Number[]}      values  array containing the red, green, blue &
 *                                 alpha components of the color.
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
 * Removes the current tint set by <a href="#/p5/tint">tint()</a> and restores
 * images to their original colors.
 *
 * @method noTint
 * @example
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/laDefense.jpg');
 * }
 * function setup() {
 *   tint('red');
 *   image(img, 0, 0);
 *   noTint();
 *   image(img, 50, 0);
 *
 *   describe('Two images of an umbrella and a ceiling side-by-side. The image on the left has a red tint.');
 * }
 * </code>
 * </div>
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
 * Changes the location from which images are drawn when
 * <a href="#/p5/image">image()</a> is called.
 *
 * By default, the first
 * two parameters of <a href="#/p5/image">image()</a> are the x- and
 * y-coordinates of the image's upper-left corner. The next parameters are
 * its width and height. This is the same as calling `imageMode(CORNER)`.
 *
 * `imageMode(CORNERS)` also uses the first two parameters of
 * <a href="#/p5/image">image()</a> as the x- and y-coordinates of the image's
 * top-left corner. The third and fourth parameters are the coordinates of its
 * bottom-right corner.
 *
 * `imageMode(CENTER)` uses the first two parameters of
 * <a href="#/p5/image">image()</a> as the x- and y-coordinates of the image's
 * center. The next parameters are its width and height.
 *
 * @method imageMode
 * @param {(CORNER|CORNERS|CENTER)} mode either CORNER, CORNERS, or CENTER.
 * @example
 *
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/bricks.jpg');
 * }
 *
 * function setup() {
 *   background(200);
 *   imageMode(CORNER);
 *   image(img, 10, 10, 50, 50);
 *
 *   describe('A square image of a brick wall is drawn at the top left of a gray square.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/bricks.jpg');
 * }
 *
 * function setup() {
 *   background(200);
 *   imageMode(CORNERS);
 *   image(img, 10, 10, 90, 40);
 *
 *   describe('An image of a brick wall is drawn on a gray square. The image is squeezed into a small rectangular area.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let img;
 *
 * function preload() {
 *   img = loadImage('assets/bricks.jpg');
 * }
 *
 * function setup() {
 *   background(200);
 *   imageMode(CENTER);
 *   image(img, 50, 50, 80, 80);
 *
 *   describe('A square image of a brick wall is drawn on a gray square.');
 * }
 * </code>
 * </div>
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
