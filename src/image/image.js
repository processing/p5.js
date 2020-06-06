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
import p5 from '../core/main';
import omggif from 'omggif';

/**
 * Creates a new <a href="#/p5.Image">p5.Image</a> (the datatype for storing images). This provides a
 * fresh buffer of pixels to play with. Set the size of the buffer with the
 * width and height parameters.
 *
 * .<a href="#/p5.Image/pixels">pixels</a> gives access to an array containing the values for all the pixels
 * in the display window.
 * These values are numbers. This array is the size (including an appropriate
 * factor for the <a href="#/p5/pixelDensity">pixelDensity</a>) of the display window x4,
 * representing the R, G, B, A values in order for each pixel, moving from
 * left to right across each row, then down each column. See .<a href="#/p5.Image/pixels">pixels</a> for
 * more info. It may also be simpler to use <a href="#/p5.Image/set">set()</a> or <a href="#/p5.Image/get">get()</a>.
 *
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

  htmlCanvas.toBlob(blob => {
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
  const buffer = new Uint8Array(pImg.width * pImg.height * props.numFrames);

  const allFramesPixelColors = [];

  // Used to determine the occurrence of unique palettes and the frames
  // which use them
  const paletteFreqsAndFrames = {};

  // Pass 1:
  //loop over frames and get the frequency of each palette
  for (let i = 0; i < props.numFrames; i++) {
    const paletteSet = new Set();
    const data = props.frames[i].image.data;
    const dataLength = data.length;
    // The color for each pixel in this frame ( for easier lookup later )
    const pixelColors = new Uint32Array(pImg.width * pImg.height);
    for (let j = 0, k = 0; j < dataLength; j += 4, k++) {
      const r = data[j + 0];
      const g = data[j + 1];
      const b = data[j + 2];
      const color = (r << 16) | (g << 8) | (b << 0);
      paletteSet.add(color);

      // What color does this pixel have in this frame ?
      pixelColors[k] = color;
    }

    // A way to put use the entire palette as an object key
    const paletteStr = [...paletteSet].sort().toString();
    if (paletteFreqsAndFrames[paletteStr] === undefined) {
      paletteFreqsAndFrames[paletteStr] = { freq: 1, frames: [i] };
    } else {
      paletteFreqsAndFrames[paletteStr].freq += 1;
      paletteFreqsAndFrames[paletteStr].frames.push(i);
    }

    allFramesPixelColors.push(pixelColors);
  }

  let framesUsingGlobalPalette = [];

  // Now to build the global palette
  // Sort all the unique palettes in descending order of their occurence
  const palettesSortedByFreq = Object.keys(paletteFreqsAndFrames).sort(function(
    a,
    b
  ) {
    return paletteFreqsAndFrames[b].freq - paletteFreqsAndFrames[a].freq;
  });

  // The initial global palette is the one with the most occurence
  const globalPalette = palettesSortedByFreq[0]
    .split(',')
    .map(a => parseInt(a));

  framesUsingGlobalPalette = framesUsingGlobalPalette.concat(
    paletteFreqsAndFrames[globalPalette].frames
  );

  const globalPaletteSet = new Set(globalPalette);

  // Build a more complete global palette
  // Iterate over the remaining palettes in the order of
  // their occurence and see if the colors in this palette which are
  // not in the global palette can be added there, while keeping the length
  // of the global palette <= 256
  for (let i = 1; i < palettesSortedByFreq.length; i++) {
    const palette = palettesSortedByFreq[i].split(',').map(a => parseInt(a));

    const difference = palette.filter(x => !globalPaletteSet.has(x));
    if (globalPalette.length + difference.length <= 256) {
      for (let j = 0; j < difference.length; j++) {
        globalPalette.push(difference[j]);
        globalPaletteSet.add(difference[j]);
      }

      // All frames using this palette now use the global palette
      framesUsingGlobalPalette = framesUsingGlobalPalette.concat(
        paletteFreqsAndFrames[palettesSortedByFreq[i]].frames
      );
    }
  }

  framesUsingGlobalPalette = new Set(framesUsingGlobalPalette);

  // Build a lookup table of the index of each color in the global palette
  // Maps a color to its index
  const globalIndicesLookup = {};
  for (let i = 0; i < globalPalette.length; i++) {
    if (!globalIndicesLookup[globalPalette[i]]) {
      globalIndicesLookup[globalPalette[i]] = i;
    }
  }

  // force palette to be power of 2
  let powof2 = 1;
  while (powof2 < globalPalette.length) {
    powof2 <<= 1;
  }
  globalPalette.length = powof2;

  // global opts
  const opts = {
    loop: loopLimit,
    palette: new Uint32Array(globalPalette)
  };
  const gifWriter = new omggif.GifWriter(buffer, pImg.width, pImg.height, opts);
  let previousFrame = {};

  // Pass 2
  // Determine if the frame needs a local palette
  // Also apply transparency optimization. This function will often blow up
  // the size of a GIF if not for transparency. If a pixel in one frame has
  // the same color in the previous frame, that pixel can be marked as
  // transparent. We decide one particular color as transparent and make all
  // transparent pixels take this color. This helps in later in compression.
  for (let i = 0; i < props.numFrames; i++) {
    const localPaletteRequired = !framesUsingGlobalPalette.has(i);
    const palette = localPaletteRequired ? [] : globalPalette;
    const pixelPaletteIndex = new Uint8Array(pImg.width * pImg.height);

    // Lookup table mapping color to its indices
    const colorIndicesLookup = {};

    // All the colors that cannot be marked transparent in this frame
    const cannotBeTransparent = new Set();

    for (let k = 0; k < allFramesPixelColors[i].length; k++) {
      const color = allFramesPixelColors[i][k];
      if (localPaletteRequired) {
        if (colorIndicesLookup[color] === undefined) {
          colorIndicesLookup[color] = palette.length;
          palette.push(color);
        }
        pixelPaletteIndex[k] = colorIndicesLookup[color];
      } else {
        pixelPaletteIndex[k] = globalIndicesLookup[color];
      }

      if (i > 0) {
        // If even one pixel of this color has changed in this frame
        // from the previous frame, we cannot mark it as transparent
        if (allFramesPixelColors[i - 1][k] !== color) {
          cannotBeTransparent.add(color);
        }
      }
    }

    const frameOpts = {};

    // Transparency optimization
    const canBeTransparent = palette.filter(a => !cannotBeTransparent.has(a));
    if (canBeTransparent.length > 0) {
      // Select a color to mark as transparent
      const transparent = canBeTransparent[0];
      const transparentIndex = localPaletteRequired
        ? colorIndicesLookup[transparent]
        : globalIndicesLookup[transparent];
      if (i > 0) {
        for (let k = 0; k < allFramesPixelColors[i].length; k++) {
          // If this pixel in this frame has the same color in previous frame
          if (allFramesPixelColors[i - 1][k] === allFramesPixelColors[i][k]) {
            pixelPaletteIndex[k] = transparentIndex;
          }
        }
        frameOpts.transparent = transparentIndex;
        // If this frame has any transparency, do not dispose the previous frame
        previousFrame.frameOpts.disposal = 1;
      }
    }
    frameOpts.delay = props.frames[i].delay / 10; // Move timing back into GIF formatting
    if (localPaletteRequired) {
      // force palette to be power of 2
      let powof2 = 1;
      while (powof2 < palette.length) {
        powof2 <<= 1;
      }
      palette.length = powof2;
      frameOpts.palette = new Uint32Array(palette);
    }
    if (i > 0) {
      // add the frame that came before the current one
      gifWriter.addFrame(
        0,
        0,
        pImg.width,
        pImg.height,
        previousFrame.pixelPaletteIndex,
        previousFrame.frameOpts
      );
    }
    // previous frame object should now have details of this frame
    previousFrame = {
      pixelPaletteIndex,
      frameOpts
    };
  }

  previousFrame.frameOpts.disposal = 1;
  // add the last frame
  gifWriter.addFrame(
    0,
    0,
    pImg.width,
    pImg.height,
    previousFrame.pixelPaletteIndex,
    previousFrame.frameOpts
  );

  const extension = 'gif';
  const blob = new Blob([buffer.slice(0, gifWriter.end())], {
    type: 'image/gif'
  });
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
  let frames = [];
  const frameFactory = setInterval(() => {
    frames.push(makeFrame(fName + count, ext, cnv));
    count++;
  }, 1000 / fps);

  setTimeout(() => {
    clearInterval(frameFactory);
    if (callback) {
      callback(frames);
    } else {
      for (const f of frames) {
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
  return thisFrame;
};

export default p5;
