/**
 * @module Rendering
 * @submodule Rendering
 * @for p5
 */

import p5 from './main';
import * as constants from './constants';
import './p5.Graphics';
import './p5.Renderer2D';
import '../webgl/p5.RendererGL';
let defaultId = 'defaultCanvas0'; // this gets set again in createCanvas
const defaultClass = 'p5Canvas';

/**
 * Creates a canvas element on the web page.
 *
 * `createCanvas()` creates the main drawing canvas for a sketch. It should
 * only be called once at the beginning of <a href="#/p5/setup">setup()</a>.
 * Calling `createCanvas()` more than once causes unpredictable behavior.
 *
 * The first two parameters, `width` and `height`, are optional. They set the
 * dimensions of the canvas and the values of the
 * <a href="#/p5/width">width</a> and <a href="#/p5/height">height</a> system
 * variables. For example, calling `createCanvas(900, 500)` creates a canvas
 * that's 900×500 pixels. By default, `width` and `height` are both 100.
 *
 * The third parameter is also optional. If either of the constants `P2D` or
 * `WEBGL` is passed, as in `createCanvas(900, 500, WEBGL)`, then it will set
 * the sketch's rendering mode. If an existing
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement" target="_blank">HTMLCanvasElement</a>
 * is passed, as in `createCanvas(900, 500, myCanvas)`, then it will be used
 * by the sketch.
 *
 * The fourth parameter is also optional. If an existing
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement" target="_blank">HTMLCanvasElement</a>
 * is passed, as in `createCanvas(900, 500, WEBGL, myCanvas)`, then it will be
 * used by the sketch.
 *
 * Note: In WebGL mode, the canvas will use a WebGL2 context if it's supported
 * by the browser. Check the <a href="#/p5/webglVersion">webglVersion</a>
 * system variable to check what version is being used, or call
 * `setAttributes({ version: 1 })` to create a WebGL1 context.
 *
 * @method createCanvas
 * @param  {Number} [width] width of the canvas. Defaults to 100.
 * @param  {Number} [height] height of the canvas. Defaults to 100.
 * @param  {Constant} [renderer] either P2D or WEBGL. Defaults to `P2D`.
 * @param  {HTMLCanvasElement} [canvas] existing canvas element that should be used for the sketch.
 * @return {p5.Renderer} new `p5.Renderer` that holds the canvas.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(180);
 *
 *   // Draw a diagonal line.
 *   line(0, 0, width, height);
 *
 *   describe('A diagonal line drawn from top-left to bottom-right on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 50);
 *
 *   background(180);
 *
 *   // Draw a diagonal line.
 *   line(0, 0, width, height);
 *
 *   describe('A diagonal line drawn from top-left to bottom-right on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Use WebGL mode.
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   background(180);
 *
 *   // Draw a diagonal line.
 *   line(-width / 2, -height / 2, width / 2, height / 2);
 *
 *   describe('A diagonal line drawn from top-left to bottom-right on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   // Create a p5.Render object.
 *   let cnv = createCanvas(50, 50);
 *
 *   // Position the canvas.
 *   cnv.position(10, 20);
 *
 *   background(180);
 *
 *   // Draw a diagonal line.
 *   line(0, 0, width, height);
 *
 *   describe('A diagonal line drawn from top-left to bottom-right on a gray background.');
 * }
 * </code>
 * </div>
 */
/**
 * @method createCanvas
 * @param  {Number} [width]
 * @param  {Number} [height]
 * @param  {HTMLCanvasElement} [canvas]
 * @return {p5.Renderer}
 */
p5.prototype.createCanvas = function(w, h, renderer, canvas) {
  p5._validateParameters('createCanvas', arguments);
  //optional: renderer, otherwise defaults to p2d

  let r;
  if (arguments[2] instanceof HTMLCanvasElement) {
    renderer = constants.P2D;
    canvas = arguments[2];
  } else {
    r = renderer || constants.P2D;
  }

  let c;

  if (canvas) {
    c = document.getElementById(defaultId);
    if (c) {
      c.parentNode.removeChild(c); //replace the existing defaultCanvas
    }
    c = canvas;
    this._defaultGraphicsCreated = false;
  } else {
    if (r === constants.WEBGL) {
      c = document.getElementById(defaultId);
      if (c) {
        //if defaultCanvas already exists
        c.parentNode.removeChild(c); //replace the existing defaultCanvas
        const thisRenderer = this._renderer;
        this._elements = this._elements.filter(e => e !== thisRenderer);
      }
      c = document.createElement('canvas');
      c.id = defaultId;
      c.classList.add(defaultClass);
    } else {
      if (!this._defaultGraphicsCreated) {
        if (canvas) {
          c = canvas;
        } else {
          c = document.createElement('canvas');
        }
        let i = 0;
        while (document.getElementById(`defaultCanvas${i}`)) {
          i++;
        }
        defaultId = `defaultCanvas${i}`;
        c.id = defaultId;
        c.classList.add(defaultClass);
      } else {
        // resize the default canvas if new one is created
        c = this.canvas;
      }
    }

    // set to invisible if still in setup (to prevent flashing with manipulate)
    if (!this._setupDone) {
      c.dataset.hidden = true; // tag to show later
      c.style.visibility = 'hidden';
    }

    if (this._userNode) {
      // user input node case
      this._userNode.appendChild(c);
    } else {
      //create main element
      if (document.getElementsByTagName('main').length === 0) {
        let m = document.createElement('main');
        document.body.appendChild(m);
      }
      //append canvas to main
      document.getElementsByTagName('main')[0].appendChild(c);
    }
  }

  // Init our graphics renderer
  //webgl mode
  if (r === constants.WEBGL) {
    this._setProperty('_renderer', new p5.RendererGL(c, this, true));
    this._elements.push(this._renderer);
    const dimensions =
      this._renderer._adjustDimensions(w, h);
    w = dimensions.adjustedWidth;
    h = dimensions.adjustedHeight;
  } else {
    //P2D mode
    if (!this._defaultGraphicsCreated) {
      this._setProperty('_renderer', new p5.Renderer2D(c, this, true));
      this._defaultGraphicsCreated = true;
      this._elements.push(this._renderer);
    }
  }
  this._renderer.resize(w, h);
  this._renderer._applyDefaults();
  return this._renderer;
};

/**
 * Resizes the canvas to a given width and height.
 *
 * `resizeCanvas()` immediately clears the canvas and calls
 * <a href="#/p5/redraw">redraw()</a>. It's common to call `resizeCanvas()`
 * within the body of <a href="#/p5/windowResized">windowResized()</a> like
 * so:
 *
 * ```js
 * function windowResized() {
 *   resizeCanvas(windowWidth, windowHeight);
 * }
 * ```
 *
 * The first two parameters, `width` and `height`, set the dimensions of the
 * canvas. They also the values of the <a href="#/p5/width">width</a> and
 * <a href="#/p5/height">height</a> system variables. For example, calling
 * `resizeCanvas(300, 500)` resizes the canvas to 300×500 pixels, then sets
 * <a href="#/p5/width">width</a> to 300 and
 * <a href="#/p5/height">height</a> 500.
 *
 * The third parameter, `noRedraw`, is optional. If `true` is passed, as in
 * `resizeCanvas(300, 500, true)`, then the canvas will be canvas to 300×500
 * pixels but the <a href="#/p5/redraw">redraw()</a> function won't be called
 * immediately. By default, <a href="#/p5/redraw">redraw()</a> is called
 * immediately when `resizeCanvas()` finishes executing.
 *
 * @method resizeCanvas
 * @param  {Number} width width of the canvas.
 * @param  {Number} height height of the canvas.
 * @param  {Boolean} [noRedraw] whether to delay calling
 *                              <a href="#/p5/redraw">redraw()</a>. Defaults
 *                              to `false`.
 *
 * @example
 * <div>
 * <code>
 * // Double-click to resize the canvas.
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A white circle drawn on a gray background. The canvas shrinks by half the first time the user double-clicks.'
 *   );
 * }
 *
 * function draw() {
 *   background(180);
 *
 *   // Draw a circle at the center of the canvas.
 *   circle(width / 2, height / 2, 20);
 * }
 *
 * // Resize the canvas when the user double-clicks.
 * function doubleClicked() {
 *   resizeCanvas(50, 50);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Resize the web browser to change the canvas size.
 *
 * function setup() {
 *   createCanvas(windowWidth, windowHeight);
 *
 *   describe('A white circle drawn on a gray background.');
 * }
 *
 * function draw() {
 *   background(180);
 *
 *   // Draw a circle at the center of the canvas.
 *   circle(width / 2, height / 2, 20);
 * }
 *
 * // Always resize the canvas to fill the browser window.
 * function windowResized() {
 *   resizeCanvas(windowWidth, windowHeight);
 * }
 * </code>
 * </div>
 */
p5.prototype.resizeCanvas = function(w, h, noRedraw) {
  p5._validateParameters('resizeCanvas', arguments);
  if (this._renderer) {
    // save canvas properties
    const props = {};
    for (const key in this.drawingContext) {
      const val = this.drawingContext[key];
      if (typeof val !== 'object' && typeof val !== 'function') {
        props[key] = val;
      }
    }
    if (this._renderer instanceof p5.RendererGL) {
      const dimensions =
        this._renderer._adjustDimensions(w, h);
      w = dimensions.adjustedWidth;
      h = dimensions.adjustedHeight;
    }
    this.width = w;
    this.height = h;
    // Make sure width and height are updated before the renderer resizes so
    // that framebuffers updated from the resize read the correct size
    this._renderer.resize(w, h);
    // reset canvas properties
    for (const savedKey in props) {
      try {
        this.drawingContext[savedKey] = props[savedKey];
      } catch (err) {
        // ignore read-only property errors
      }
    }
    if (!noRedraw) {
      this.redraw();
    }
  }
  //accessible Outputs
  if (this._addAccsOutput()) {
    this._updateAccsOutput();
  }
};

/**
 * Removes the default canvas.
 *
 * By default, a 100×100 pixels canvas is created without needing to call
 * <a href="#/p5/createCanvas">createCanvas()</a>. `noCanvas()` removes the
 * default canvas for sketches that don't need it.
 *
 * @method noCanvas
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   noCanvas();
 * }
 * </code>
 * </div>
 */
p5.prototype.noCanvas = function() {
  if (this.canvas) {
    this.canvas.parentNode.removeChild(this.canvas);
  }
};

/**
 * Creates a <a href="#/p5.Graphics">p5.Graphics</a> object.
 *
 * `createGraphics()` creates an offscreen drawing canvas (graphics buffer)
 * and returns it as a <a href="#/p5.Graphics">p5.Graphics</a> object. Drawing
 * to a separate graphics buffer can be helpful for performance and for
 * organizing code.
 *
 * The first two parameters, `width` and `height`, are optional. They set the
 * dimensions of the <a href="#/p5.Graphics">p5.Graphics</a> object. For
 * example, calling `createGraphics(900, 500)` creates a graphics buffer
 * that's 900×500 pixels.
 *
 * The third parameter is also optional. If either of the constants `P2D` or
 * `WEBGL` is passed, as in `createGraphics(900, 500, WEBGL)`, then it will set
 * the <a href="#/p5.Graphics">p5.Graphics</a> object's rendering mode. If an
 * existing
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement" target="_blank">HTMLCanvasElement</a>
 * is passed, as in `createGraphics(900, 500, myCanvas)`, then it will be used
 * by the graphics buffer.
 *
 * The fourth parameter is also optional. If an existing
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement" target="_blank">HTMLCanvasElement</a>
 * is passed, as in `createGraphics(900, 500, WEBGL, myCanvas)`, then it will be
 * used by the graphics buffer.
 *
 * Note: In WebGL mode, the <a href="#/p5.Graphics">p5.Graphics</a> object
 * will use a WebGL2 context if it's supported by the browser. Check the
 * <a href="#/p5/webglVersion">webglVersion</a> system variable to check what
 * version is being used, or call `setAttributes({ version: 1 })` to create a
 * WebGL1 context.
 *
 * @method createGraphics
 * @param  {Number} width width of the graphics buffer.
 * @param  {Number} height height of the graphics buffer.
 * @param  {Constant} [renderer] either P2D or WEBGL. Defaults to P2D.
 * @param  {HTMLCanvasElement} [canvas] existing canvas element that should be
 *                                      used for the graphics buffer..
 * @return {p5.Graphics} new graphics buffer.
 *
 * @example
 * <div>
 * <code>
 * //  Double-click to draw the contents of the graphics buffer.
 *
 * let pg;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(180);
 *
 *   // Create the p5.Graphics object.
 *   pg = createGraphics(50, 50);
 *
 *   // Draw to the graphics buffer.
 *   pg.background(100);
 *   pg.circle(pg.width / 2, pg.height / 2, 20);
 *
 *   describe('A gray square. A smaller, darker square with a white circle at its center appears when the user double-clicks.');
 * }
 *
 * // Display the graphics buffer when the user double-clicks.
 * function doubleClicked() {
 *   if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 100) {
 *     image(pg, 25, 25);
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * //  Double-click to draw the contents of the graphics buffer.
 *
 * let pg;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(180);
 *
 *   // Create the p5.Graphics object in WebGL mode.
 *   pg = createGraphics(50, 50, WEBGL);
 *
 *   // Draw to the graphics buffer.
 *   pg.background(100);
 *   pg.lights();
 *   pg.noStroke();
 *   pg.rotateX(QUARTER_PI);
 *   pg.rotateY(QUARTER_PI);
 *   pg.torus(15, 5);
 *
 *   describe('A gray square. A smaller, darker square with a white torus at its center appears when the user double-clicks.');
 * }
 *
 * // Display the graphics buffer when the user double-clicks.
 * function doubleClicked() {
 *   if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 100) {
 *     image(pg, 25, 25);
 *   }
 * }
 * </code>
 * </div>
 */
/**
 * @method createGraphics
 * @param  {Number} width
 * @param  {Number} height
 * @param  {HTMLCanvasElement} [canvas]
 * @return {p5.Graphics}
 */
p5.prototype.createGraphics = function(w, h, ...args) {
/**
  * args[0] is expected to be renderer
  * args[1] is expected to be canvas
  */
  if (args[0] instanceof HTMLCanvasElement) {
    args[1] = args[0];
    args[0] = constants.P2D;
  }
  p5._validateParameters('createGraphics', arguments);
  return new p5.Graphics(w, h, args[0], this, args[1]);
};

/**
 * Creates and a new <a href="#/p5.Framebuffer">p5.Framebuffer</a> object.
 *
 * <a href="#/p5.Framebuffer">p5.Framebuffer</a> objects are separate drawing
 * surfaces that can be used as textures in WebGL mode. They're similar to
 * <a href="#/p5.Graphics">p5.Graphics</a> objects and generally run much
 * faster when used as textures.
 *
 * The parameter, `options`, is optional. An object can be passed to configure
 * the <a href="#/p5.Framebuffer">p5.Framebuffer</a> object. The available
 * properties are:
 *
 * - `format`: data format of the texture, either `UNSIGNED_BYTE`, `FLOAT`, or `HALF_FLOAT`. Default is `UNSIGNED_BYTE`.
 * - `channels`: whether to store `RGB` or `RGBA` color channels. Default is to match the main canvas which is `RGBA`.
 * - `depth`: whether to include a depth buffer. Default is `true`.
 * - `depthFormat`: data format of depth information, either `UNSIGNED_INT` or `FLOAT`. Default is `FLOAT`.
 * - `stencil`: whether to include a stencil buffer for masking. `depth` must be `true` for this feature to work. Defaults to the value of `depth` which is `true`.
 * - `antialias`: whether to perform anti-aliasing. If set to `true`, as in `{ antialias: true }`, 2 samples will be used by default. The number of samples can also be set, as in `{ antialias: 4 }`. Default is to match <a href="#/p5/setAttributes">setAttributes()</a> which is `false` (`true` in Safari).
 * - `width`: width of the <a href="#/p5.Framebuffer">p5.Framebuffer</a> object. Default is to always match the main canvas width.
 * - `height`: height of the <a href="#/p5.Framebuffer">p5.Framebuffer</a> object. Default is to always match the main canvas height.
 * - `density`: pixel density of the <a href="#/p5.Framebuffer">p5.Framebuffer</a> object. Default is to always match the main canvas pixel density.
 * - `textureFiltering`: how to read values from the <a href="#/p5.Framebuffer">p5.Framebuffer</a> object. Either `LINEAR` (nearby pixels will be interpolated) or `NEAREST` (no interpolation). Generally, use `LINEAR` when using the texture as an image and `NEAREST` if reading the texture as data. Default is `LINEAR`.
 *
 * If the `width`, `height`, or `density` attributes are set, they won't automatically match the main canvas and must be changed manually.
 *
 * Note: `createFramebuffer()` can only be used in WebGL mode.
 *
 * @method createFramebuffer
 * @param {Object} [options] configuration options.
 * @return {p5.Framebuffer} new framebuffer.
 *
 * @example
 * <div>
 * <code>
 * let myBuffer;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   // Create a p5.Framebuffer object.
 *   myBuffer = createFramebuffer();
 *
 *   describe('A grid of white toruses rotating against a dark gray background.');
 * }
 *
 * function draw() {
 *   background(50);
 *
 *   // Start drawing to the p5.Framebuffer object.
 *   myBuffer.begin();
 *
 *   // Clear the drawing surface.
 *   clear();
 *
 *   // Turn on the lights.
 *   lights();
 *
 *   // Rotate the coordinate system.
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *
 *   // Style the torus.
 *   noStroke();
 *
 *   // Draw the torus.
 *   torus(20);
 *
 *   // Stop drawing to the p5.Framebuffer object.
 *   myBuffer.end();
 *
 *   // Iterate from left to right.
 *   for (let x = -50; x < 50; x += 25) {
 *     // Iterate from top to bottom.
 *     for (let y = -50; y < 50; y += 25) {
 *       // Draw the p5.Framebuffer object to the canvas.
 *       image(myBuffer, x, y, 25, 25);
 *     }
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let myBuffer;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   // Create an options object.
 *   let options = { width: 25, height: 25 };
 *
 *   // Create a p5.Framebuffer object.
 *   // Use options for configuration.
 *   myBuffer = createFramebuffer(options);
 *
 *   describe('A grid of white toruses rotating against a dark gray background.');
 * }
 *
 * function draw() {
 *   background(50);
 *
 *   // Start drawing to the p5.Framebuffer object.
 *   myBuffer.begin();
 *
 *   // Clear the drawing surface.
 *   clear();
 *
 *   // Turn on the lights.
 *   lights();
 *
 *   // Rotate the coordinate system.
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *
 *   // Style the torus.
 *   noStroke();
 *
 *   // Draw the torus.
 *   torus(5, 2.5);
 *
 *   // Stop drawing to the p5.Framebuffer object.
 *   myBuffer.end();
 *
 *   // Iterate from left to right.
 *   for (let x = -50; x < 50; x += 25) {
 *     // Iterate from top to bottom.
 *     for (let y = -50; y < 50; y += 25) {
 *       // Draw the p5.Framebuffer object to the canvas.
 *       image(myBuffer, x, y);
 *     }
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype.createFramebuffer = function(options) {
  return new p5.Framebuffer(this, options);
};

/**
 * Clears the depth buffer in WebGL mode.
 *
 * `clearDepth()` clears information about how far objects are from the camera
 * in 3D space. This information is stored in an object called the
 * *depth buffer*. Clearing the depth buffer ensures new objects aren't drawn
 * behind old ones. Doing so can be useful for feedback effects in which the
 * previous frame serves as the background for the current frame.
 *
 * The parameter, `depth`, is optional. If a number is passed, as in
 * `clearDepth(0.5)`, it determines the range of objects to clear from the
 * depth buffer. 0 doesn't clear any depth information, 0.5 clears depth
 * information halfway between the near and far clipping planes, and 1 clears
 * depth information all the way to the far clipping plane. By default,
 * `depth` is 1.
 *
 * Note: `clearDepth()` can only be used in WebGL mode.
 *
 * @method clearDepth
 * @param {Number} [depth] amount of the depth buffer to clear between 0
 *                         (none) and 1 (far clipping plane). Defaults to 1.
 *
 * @example
 * <div>
 * <code>
 * let previous;
 * let current;
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   // Create the p5.Framebuffer objects.
 *   previous = createFramebuffer({ format: FLOAT });
 *   current = createFramebuffer({ format: FLOAT });
 *
 *   describe(
 *     'A multicolor box drifts from side to side on a white background. It leaves a trail that fades over time.'
 *   );
 * }
 *
 * function draw() {
 *   // Swap the previous p5.Framebuffer and the
 *   // current one so it can be used as a texture.
 *   [previous, current] = [current, previous];
 *
 *   // Start drawing to the current p5.Framebuffer.
 *   current.begin();
 *
 *   // Paint the background.
 *   background(255);
 *
 *   // Draw the previous p5.Framebuffer.
 *   // Clear the depth buffer so the previous
 *   // frame doesn't block the current one.
 *   push();
 *   tint(255, 250);
 *   image(previous, -50, -50);
 *   clearDepth();
 *   pop();
 *
 *   // Draw the box on top of the previous frame.
 *   push();
 *   let x = 25 * sin(frameCount * 0.01);
 *   let y = 25 * sin(frameCount * 0.02);
 *   translate(x, y, 0);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   normalMaterial();
 *   box(12);
 *   pop();
 *
 *   // Stop drawing to the current p5.Framebuffer.
 *   current.end();
 *
 *   // Display the current p5.Framebuffer.
 *   image(current, -50, -50);
 * }
 * </code>
 * </div>
 */
p5.prototype.clearDepth = function(depth) {
  this._assert3d('clearDepth');
  this._renderer.clearDepth(depth);
};

/**
 * Sets the way colors blend when added to the canvas.
 *
 * By default, drawing with a solid color paints over the current pixel values
 * on the canvas. `blendMode()` offers many options for blending colors.
 *
 * Shapes, images, and text can be used as sources for drawing to the canvas.
 * A source pixel changes the color of the canvas pixel where it's drawn. The
 * final color results from blending the source pixel's color with the canvas
 * pixel's color. RGB color values from the source and canvas pixels are
 * compared, added, subtracted, multiplied, and divided to create different
 * effects. Red values with red values, greens with greens, and blues with
 * blues.
 *
 * The parameter, `mode`, sets the blend mode. For example, calling
 * `blendMode(ADD)` sets the blend mode to `ADD`. The following blend modes
 * are available in both 2D and WebGL mode:
 *
 * - `BLEND`: color values from the source overwrite the canvas. This is the default mode.
 * - `ADD`: color values from the source are added to values from the canvas.
 * - `DARKEST`: keeps the darkest color value.
 * - `LIGHTEST`: keeps the lightest color value.
 * - `EXCLUSION`: similar to `DIFFERENCE` but with less contrast.
 * - `MULTIPLY`: color values from the source are multiplied with values from the canvas. The result is always darker.
 * - `SCREEN`: all color values are inverted, then multiplied, then inverted again. The result is always lighter. (Opposite of `MULTIPLY`)
 * - `REPLACE`: the last source drawn completely replaces the rest of the canvas.
 * - `REMOVE`: overlapping pixels are removed by making them completely transparent.
 *
 * The following blend modes are only available in 2D mode:
 *
 * - `DIFFERENCE`: color values from the source are subtracted from the values from the canvas. If the difference is a negative number, it's made positive.
 * - `OVERLAY`: combines `MULTIPLY` and `SCREEN`. Dark values in the canvas get darker and light values get lighter.
 * - `HARD_LIGHT`: combines `MULTIPLY` and `SCREEN`. Dark values in the source get darker and light values get lighter.
 * - `SOFT_LIGHT`: a softer version of `HARD_LIGHT`.
 * - `DODGE`: lightens light tones and increases contrast. Divides the canvas color values by the inverted color values from the source.
 * - `BURN`: darkens dark tones and increases contrast. Divides the source color values by the inverted color values from the canvas, then inverts the result.
 *
 * The following blend modes are only available in WebGL mode:
 *
 * - `SUBTRACT`: RGB values from the source are subtracted from the values from the canvas. If the difference is a negative number, it's made positive. Alpha (transparency) values from the source and canvas are added.
 *
 * @method blendMode
 * @param  {Constant} mode blend mode to set.
 *                either BLEND, DARKEST, LIGHTEST, DIFFERENCE, MULTIPLY,
 *                EXCLUSION, SCREEN, REPLACE, OVERLAY, HARD_LIGHT,
 *                SOFT_LIGHT, DODGE, BURN, ADD, REMOVE or SUBTRACT
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(180);
 *
 *   // Use the default blend mode.
 *   blendMode(BLEND);
 *
 *   // Style the lines.
 *   strokeWeight(30);
 *
 *   // Draw the first line.
 *   stroke('#1a85ff');
 *   line(25, 25, 75, 75);
 *
 *   // Draw the second line.
 *   stroke('#d41159');
 *   line(75, 25, 25, 75);
 *
 *   describe('A Sky Blue line and a Deep Rose line form an X on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(180);
 *
 *   // Set the blend mode.
 *   blendMode(HARD_LIGHT);
 *
 *   // Style the lines.
 *   strokeWeight(30);
 *
 *   // Draw the first line.
 *   stroke('#1a85ff');
 *   line(25, 25, 75, 75);
 *
 *   // Draw the second line.
 *   stroke('#d41159');
 *   line(75, 25, 25, 75);
 *
 *   describe('An ocean blue line and a hot pink line form an X on a gray background. The area where they overlap is Magenta purple.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(180);
 *
 *   // Set the blend mode.
 *   blendMode(ADD);
 *
 *   // Style the lines.
 *   strokeWeight(30);
 *
 *   // Draw the first line.
 *   stroke('#1a85ff');
 *   line(25, 25, 75, 75);
 *
 *   // Draw the second line.
 *   stroke('#d41159');
 *   line(75, 25, 25, 75);
 *
 *   describe('An icy blue line and a light lavender line form an X on a gray background. The area where they overlap is white.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(180);
 *
 *   // Set the blend mode.
 *   blendMode(DARKEST);
 *
 *   // Style the lines.
 *   strokeWeight(30);
 *
 *   // Draw the first line.
 *   stroke('#1a85ff');
 *   line(25, 25, 75, 75);
 *
 *   // Draw the second line.
 *   stroke('#d41159');
 *   line(75, 25, 25, 75);
 *
 *   describe('A steel blue line and a cranberry line form an X on a gray background. The area where they overlap is deep purple.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(180);
 *
 *   // Set the blend mode.
 *   blendMode(BURN);
 *
 *   // Style the lines.
 *   strokeWeight(30);
 *
 *   // Draw the first line.
 *   stroke('#1a85ff');
 *   line(25, 25, 75, 75);
 *
 *   // Draw the second line.
 *   stroke('#d41159');
 *   line(75, 25, 25, 75);
 *
 *   describe('A cobalt blue line and a burgundy line form an X on a gray background. The area where they overlap is black.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(180);
 *
 *   // Set the blend mode.
 *   blendMode(LIGHTEST);
 *
 *   // Style the lines.
 *   strokeWeight(30);
 *
 *   // Draw the first line.
 *   stroke('#1a85ff');
 *   line(25, 25, 75, 75);
 *
 *   // Draw the second line.
 *   stroke('#d41159');
 *   line(75, 25, 25, 75);
 *
 *   describe('A pale lavender line and a soft beige line form an X on a gray background. The area where they overlap is pale lilac.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(180);
 *
 *   // Set the blend mode.
 *   blendMode(EXCLUSION);
 *
 *   // Style the lines.
 *   strokeWeight(30);
 *
 *   // Draw the first line.
 *   stroke('#1a85ff');
 *   line(25, 25, 75, 75);
 *
 *   // Draw the second line.
 *   stroke('#d41159');
 *   line(75, 25, 25, 75);
 *
 *   describe('An earthy brown line and a muted sage line form an X on a gray background. The area where they overlap is sage green.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(180);
 *
 *   // Set the blend mode.
 *   blendMode(MULTIPLY);
 *
 *   // Style the lines.
 *   strokeWeight(30);
 *
 *   // Draw the first line.
 *   stroke('#1a85ff');
 *   line(25, 25, 75, 75);
 *
 *   // Draw the second line.
 *   stroke('#d41159');
 *   line(75, 25, 25, 75);
 *
 *   describe('A slate blue line and a plum line form an X on a gray background. The area where they overlap is dark Indigo.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(180);
 *
 *   // Set the blend mode.
 *   blendMode(SCREEN);
 *
 *   // Style the lines.
 *   strokeWeight(30);
 *
 *   // Draw the first line.
 *   stroke('#1a85ff');
 *   line(25, 25, 75, 75);
 *
 *   // Draw the second line.
 *   stroke('#d41159');
 *   line(75, 25, 25, 75);
 *
 *   describe('A baby blue line and a peach pink line form an X on a gray background. The area where they overlap is misty lilac.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(180);
 *
 *   // Set the blend mode.
 *   blendMode(REPLACE);
 *
 *   // Style the lines.
 *   strokeWeight(30);
 *
 *   // Draw the first line.
 *   stroke('#1a85ff');
 *   line(25, 25, 75, 75);
 *
 *   // Draw the second line.
 *   stroke('#d41159');
 *   line(75, 25, 25, 75);
 *
 *   describe('A diagonal deep rose line.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(180);
 *
 *   // Set the blend mode.
 *   blendMode(REMOVE);
 *
 *   // Style the lines.
 *   strokeWeight(30);
 *
 *   // Draw the first line.
 *   stroke('#1a85ff');
 *   line(25, 25, 75, 75);
 *
 *   // Draw the second line.
 *   stroke('#d41159');
 *   line(75, 25, 25, 75);
 *
 *   describe('The silhouette of an X is missing from a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(180);
 *
 *   // Set the blend mode.
 *   blendMode(DIFFERENCE);
 *
 *   // Style the lines.
 *   strokeWeight(30);
 *
 *   // Draw the first line.
 *   stroke('#1a85ff');
 *   line(25, 25, 75, 75);
 *
 *   // Draw the second line.
 *   stroke('#d41159');
 *   line(75, 25, 25, 75);
 *
 *   describe('A light burgundy line and a forest green line form an X on a gray background. The area where they overlap is dark cocoa.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(180);
 *
 *   // Set the blend mode.
 *   blendMode(OVERLAY);
 *
 *   // Style the lines.
 *   strokeWeight(30);
 *
 *   // Draw the first line.
 *   stroke('#1a85ff');
 *   line(25, 25, 75, 75);
 *
 *   // Draw the second line.
 *   stroke('#d41159');
 *   line(75, 25, 25, 75);
 *
 *   describe('A cornflower blue line and a light rose line form an X on a gray background. The area where they overlap is violet.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(180);
 *
 *   // Set the blend mode.
 *   blendMode(SOFT_LIGHT);
 *
 *   // Style the lines.
 *   strokeWeight(30);
 *
 *   // Draw the first line.
 *   stroke('#1a85ff');
 *   line(25, 25, 75, 75);
 *
 *   // Draw the second line.
 *   stroke('#d41159');
 *   line(75, 25, 25, 75);
 *
 *   describe('A pale sky line and a rose blush line form an X on a gray background. The area where they overlap is lavender.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(180);
 *
 *   // Set the blend mode.
 *   blendMode(DODGE);
 *
 *   // Style the lines.
 *   strokeWeight(30);
 *
 *   // Draw the first line.
 *   stroke('#1a85ff');
 *   line(25, 25, 75, 75);
 *
 *   // Draw the second line.
 *   stroke('#d41159');
 *   line(75, 25, 25, 75);
 *
 *   describe('An aqua blue line and a light pink line form an X on a gray background. The area where they overlap is white.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   // Create a canvas with WEBGL mode.
 *   createCanvas(100, 100, WEBGL);
 *
 *   // Set the background color.
 *   background(180);
 *
 *   // Set the blend mode to SUBTRACT.
 *   blendMode(SUBTRACT);
 *
 *   // Style the lines.
 *   strokeWeight(30);
 *
 *   // Draw the blue line.
 *   stroke('#1a85ff');
 *   line(-25, -25, 25, 25);
 *
 *   // Draw the red line.
 *   stroke('#d41159');
 *   line(25, -25, -25, 25);
 *
 *   describe('A burnt orange and a sea green line form an X on a gray background. The area where they overlap is forest green.');
 * }
 * </code>
 * </div>
 */
p5.prototype.blendMode = function(mode) {
  p5._validateParameters('blendMode', arguments);
  if (mode === constants.NORMAL) {
    // Warning added 3/26/19, can be deleted in future (1.0 release?)
    console.warn(
      'NORMAL has been deprecated for use in blendMode. defaulting to BLEND instead.'
    );
    mode = constants.BLEND;
  }
  this._renderer.blendMode(mode);
};

/**
 * A system variable that provides direct access to the sketch's
 * `&lt;canvas&gt;` element.
 *
 * The `&lt;canvas&gt;` element provides many specialized features that aren't
 * included in the p5.js library. The `drawingContext` system variable
 * provides access to these features by exposing the sketch's
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D">CanvasRenderingContext2D</a>
 * object.
 *
 * @property drawingContext
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(180);
 *
 *   // Style the circle using shadows.
 *   drawingContext.shadowOffsetX = 5;
 *   drawingContext.shadowOffsetY = -5;
 *   drawingContext.shadowBlur = 10;
 *   drawingContext.shadowColor = 'black';
 *
 *   // Draw the circle.
 *   circle(50, 50, 40);
 *
 *   describe("A white circle on a gray background. The circle's edges are shadowy.");
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background('skyblue');
 *
 *   // Style the circle using a color gradient.
 *   let myGradient = drawingContext.createRadialGradient(50, 50, 3, 50, 50, 40);
 *   myGradient.addColorStop(0, 'yellow');
 *   myGradient.addColorStop(0.6, 'orangered');
 *   myGradient.addColorStop(1, 'yellow');
 *   drawingContext.fillStyle = myGradient;
 *   drawingContext.strokeStyle = 'rgba(0, 0, 0, 0)';
 *
 *   // Draw the circle.
 *   circle(50, 50, 40);
 *
 *   describe('A fiery sun drawn on a light blue background.');
 * }
 * </code>
 * </div>
 */

export default p5;
