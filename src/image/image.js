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
import * as omggif from 'omggif';
import { Element } from '../dom/p5.Element';
import { Framebuffer } from '../webgl/p5.Framebuffer';

function image(p5, fn){
  /**
   * Creates a new <a href="#/p5.Image">p5.Image</a> object.
   *
   * `createImage()` uses the `width` and `height` parameters to set the new
   * <a href="#/p5.Image">p5.Image</a> object's dimensions in pixels. The new
   * <a href="#/p5.Image">p5.Image</a> can be modified by updating its
   * <a href="#/p5.Image/pixels">pixels</a> array or by calling its
   * <a href="#/p5.Image/get">get()</a> and
   * <a href="#/p5.Image/set">set()</a> methods. The
   * <a href="#/p5.Image/loadPixels">loadPixels()</a> method must be called
   * before reading or modifying pixel values. The
   * <a href="#/p5.Image/updatePixels">updatePixels()</a> method must be called
   * for updates to take effect.
   *
   * Note: The new <a href="#/p5.Image">p5.Image</a> object is transparent by
   * default.
   *
   * @method createImage
   * @param  {Integer} width  width in pixels.
   * @param  {Integer} height height in pixels.
   * @return {p5.Image}       new <a href="#/p5.Image">p5.Image</a> object.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a p5.Image object.
   *   let img = createImage(66, 66);
   *
   *   // Load the image's pixels into memory.
   *   img.loadPixels();
   *
   *   // Set all the image's pixels to black.
   *   for (let x = 0; x < img.width; x += 1) {
   *     for (let y = 0; y < img.height; y += 1) {
   *       img.set(x, y, 0);
   *     }
   *   }
   *
   *   // Update the image's pixel values.
   *   img.updatePixels();
   *
   *   // Draw the image.
   *   image(img, 17, 17);
   *
   *   describe('A black square drawn in the middle of a gray square.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a p5.Image object.
   *   let img = createImage(66, 66);
   *
   *   // Load the image's pixels into memory.
   *   img.loadPixels();
   *
   *   // Create a color gradient.
   *   for (let x = 0; x < img.width; x += 1) {
   *     for (let y = 0; y < img.height; y += 1) {
   *       // Calculate the transparency.
   *       let a = map(x, 0, img.width, 0, 255);
   *
   *       // Create a p5.Color object.
   *       let c = color(0, a);
   *
   *       // Set the pixel's color.
   *       img.set(x, y, c);
   *     }
   *   }
   *
   *   // Update the image's pixels.
   *   img.updatePixels();
   *
   *   // Display the image.
   *   image(img, 17, 17);
   *
   *   describe('A square with a horizontal color gradient that transitions from gray to black.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a p5.Image object.
   *   let img = createImage(66, 66);
   *
   *   // Load the pixels into memory.
   *   img.loadPixels();
   *   // Get the current pixel density.
   *   let d = pixelDensity();
   *
   *   // Calculate the pixel that is halfway through the image's pixel array.
   *   let halfImage = 4 * (d * img.width) * (d * img.height / 2);
   *
   *   // Set half of the image's pixels to black.
   *   for (let i = 0; i < halfImage; i += 4) {
   *     // Red.
   *     img.pixels[i] = 0;
   *     // Green.
   *     img.pixels[i + 1] = 0;
   *     // Blue.
   *     img.pixels[i + 2] = 0;
   *     // Alpha.
   *     img.pixels[i + 3] = 255;
   *   }
   *
   *   // Update the image's pixels.
   *   img.updatePixels();
   *
   *   // Display the image.
   *   image(img, 17, 17);
   *
   *   describe('A black square drawn in the middle of a gray square.');
   * }
   * </code>
   * </div>
   */
  fn.createImage = function(width, height) {
    // p5._validateParameters('createImage', arguments);
    return new p5.Image(width, height);
  };

  /**
   * Saves the current canvas as an image.
   *
   * By default, `saveCanvas()` saves the canvas as a PNG image called
   * `untitled.png`.
   *
   * The first parameter, `filename`, is optional. It's a string that sets the
   * file's name. If a file extension is included, as in
   * `saveCanvas('drawing.png')`, then the image will be saved using that
   * format.
   *
   * The second parameter, `extension`, is also optional. It sets the files format.
   * Either `'png'`, `'webp'`, or `'jpg'` can be used. For example, `saveCanvas('drawing', 'jpg')`
   * saves the canvas to a file called `drawing.jpg`.
   *
   * Note: The browser will either save the file immediately or prompt the user
   * with a dialogue window.
   *
   *  @method saveCanvas
   *  @param  {p5.Framebuffer|p5.Element|HTMLCanvasElement} selectedCanvas   reference to a
   *                                                          specific HTML5 canvas element.
   *  @param  {String} [filename]  file name. Defaults to 'untitled'.
   *  @param  {String} [extension] file extension, either 'png', 'webp', or 'jpg'. Defaults to 'png'.
   *
   *  @example
   * <div class='norender'>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *   background(255);
   *
   *   // Save the canvas to 'untitled.png'.
   *   saveCanvas();
   *
   *   describe('A white square.');
   * }
   * </code>
   * </div>
   *
   * <div class='norender'>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(255);
   *
   *   // Save the canvas to 'myCanvas.jpg'.
   *   saveCanvas('myCanvas.jpg');
   *
   *   describe('A white square.');
   * }
   * </code>
   * </div>
   *
   * <div class='norender'>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(255);
   *
   *   // Save the canvas to 'myCanvas.jpg'.
   *   saveCanvas('myCanvas', 'jpg');
   *
   *   describe('A white square.');
   * }
   * </code>
   * </div>
   *
   * <div class='norender'>
   * <code>
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *
   *   background(255);
   *
   *   // Save the canvas to 'untitled.png'.
   *   saveCanvas(cnv);
   *
   *   describe('A white square.');
   * }
   * </code>
   * </div>
   *
   * <div class='norender'>
   * <code>
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *
   *   background(255);
   *
   *   // Save the canvas to 'myCanvas.jpg'.
   *   saveCanvas(cnv, 'myCanvas.jpg');
   *
   *   describe('A white square.');
   * }
   * </code>
   * </div>
   *
   * <div class='norender'>
   * <code>
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *
   *   background(255);
   *
   *   // Save the canvas to 'myCanvas.jpg'.
   *   saveCanvas(cnv, 'myCanvas', 'jpg');
   *
   *   describe('A white square.');
   * }
   * </code>
   * </div>
   */
  /**
   *  @method saveCanvas
   *  @param  {String} [filename]
   *  @param  {String} [extension]
   */
  fn.saveCanvas = function(...args) {
    // copy arguments to array
    let htmlCanvas, filename, extension, temporaryGraphics;

    if (args[0] instanceof HTMLCanvasElement) {
      htmlCanvas = args[0];
      args.shift();
    } else if (args[0] instanceof Element) {
      htmlCanvas = args[0].elt;
      args.shift();
    } else if (args[0] instanceof Framebuffer) {
      const framebuffer = args[0];
      temporaryGraphics = this.createGraphics(framebuffer.width,
        framebuffer.height);
      temporaryGraphics.pixelDensity(framebuffer.pixelDensity());
      framebuffer.loadPixels();
      temporaryGraphics.loadPixels();
      temporaryGraphics.pixels.set(framebuffer.pixels);
      temporaryGraphics.updatePixels();

      htmlCanvas = temporaryGraphics._renderer.canvas;
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
      fn._checkFileExtension(filename, extension)[1] ||
      'png';

    let mimeType;
    switch (extension) {
      default:
        //case 'png':
        mimeType = 'image/png';
        break;
      case 'webp':
        mimeType = 'image/webp';
        break;
      case 'jpeg':
      case 'jpg':
        mimeType = 'image/jpeg';
        break;
    }

    htmlCanvas.toBlob(blob => {
      fn.downloadFile(blob, filename, extension);
      if(temporaryGraphics) temporaryGraphics.remove();
    }, mimeType);
  };

  // this is the old saveGif, left here for compatibility purposes
  // the only place I found it being used was on image/p5.Image.js, on the
  // save function. that has been changed to use this function.
  fn.encodeAndDownloadGif = function(pImg, filename) {
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
    // Sort all the unique palettes in descending order of their occurrence
    const palettesSortedByFreq = Object.keys(paletteFreqsAndFrames).sort(function(
      a,
      b
    ) {
      return paletteFreqsAndFrames[b].freq - paletteFreqsAndFrames[a].freq;
    });

    // The initial global palette is the one with the most occurrence
    const globalPalette = palettesSortedByFreq[0]
      .split(',')
      .map(a => parseInt(a));

    framesUsingGlobalPalette = framesUsingGlobalPalette.concat(
      paletteFreqsAndFrames[globalPalette].frames
    );

    const globalPaletteSet = new Set(globalPalette);

    // Build a more complete global palette
    // Iterate over the remaining palettes in the order of
    // their occurrence and see if the colors in this palette which are
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

      allFramesPixelColors[i].forEach((color, k) => {
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
      });

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
    fn.downloadFile(blob, filename, extension);
  };

  /**
   * Captures a sequence of frames from the canvas that can be saved as images.
   *
   * `saveFrames()` creates an array of frame objects. Each frame is stored as
   * an object with its file type, file name, and image data as a string. For
   * example, the first saved frame might have the following properties:
   *
   * `{ ext: 'png', filenmame: 'frame0', imageData: 'data:image/octet-stream;base64, abc123' }`.
   *
   * The first parameter, `filename`, sets the prefix for the file names. For
   * example, setting the prefix to `'frame'` would generate the image files
   * `frame0.png`, `frame1.png`, and so on.
   *
   * The second parameter, `extension`, sets the file type to either `'png'` or
   * `'jpg'`.
   *
   * The third parameter, `duration`, sets the duration to record in seconds.
   * The maximum duration is 15 seconds.
   *
   * The fourth parameter, `framerate`, sets the number of frames to record per
   * second. The maximum frame rate value is 22. Limits are placed on `duration`
   * and `framerate` to avoid using too much memory. Recording large canvases
   * can easily crash sketches or even web browsers.
   *
   * The fifth parameter, `callback`, is optional. If a function is passed,
   * image files won't be saved by default. The callback function can be used
   * to process an array containing the data for each captured frame. The array
   * of image data contains a sequence of objects with three properties for each
   * frame: `imageData`, `filename`, and `extension`.
   *
   * Note: Frames are downloaded as individual image files by default.
   *
   * @method saveFrames
   * @param  {String}   filename  prefix of file name.
   * @param  {String}   extension file extension, either 'jpg' or 'png'.
   * @param  {Number}   duration  duration in seconds to record. This parameter will be constrained to be less or equal to 15.
   * @param  {Number}   framerate number of frames to save per second. This parameter will be constrained to be less or equal to 22.
   * @param  {function(Array)} [callback] callback function that will be executed
                                    to handle the image data. This function
                                    should accept an array as argument. The
                                    array will contain the specified number of
                                    frames of objects. Each object has three
                                    properties: `imageData`, `filename`, and `extension`.
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe('A square repeatedly changes color from blue to pink.');
   * }
   *
   * function draw() {
   *   let r = frameCount % 255;
   *   let g = 50;
   *   let b = 100;
   *   background(r, g, b);
   * }
   *
   * // Save the frames when the user presses the 's' key.
   * function keyPressed() {
   *   if (key === 's') {
   *     saveFrames('frame', 'png', 1, 5);
   *   }
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe('A square repeatedly changes color from blue to pink.');
   * }
   *
   * function draw() {
   *   let r = frameCount % 255;
   *   let g = 50;
   *   let b = 100;
   *   background(r, g, b);
   * }
   *
   * // Print 5 frames when the user presses the mouse.
   * function mousePressed() {
   *   saveFrames('frame', 'png', 1, 5, printFrames);
   * }
   *
   * // Prints an array of objects containing raw image data, filenames, and extensions.
   * function printFrames(frames) {
   *   for (let frame of frames) {
   *     print(frame);
   *   }
   * }
   * </code>
   * </div>
   */
  fn.saveFrames = function(fName, ext, _duration, _fps, callback) {
    // p5._validateParameters('saveFrames', arguments);
    let duration = _duration || 3;
    duration = Math.max(Math.min(duration, 15), 0);
    duration = duration * 1000;
    let fps = _fps || 15;
    fps = Math.max(Math.min(fps, 22), 0);
    let count = 0;

    const makeFrame = fn._makeFrame;
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
          fn.downloadFile(f.imageData, f.filename, f.ext);
        }
      }
      frames = []; // clear frames
    }, duration + 0.01);
  };

  fn._makeFrame = function(filename, extension, _cnv) {
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
}

export default image;

if(typeof p5 !== 'undefined'){
  image(p5, p5.prototype);
}
