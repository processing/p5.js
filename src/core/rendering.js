/**
 * @module Rendering
 * @submodule Rendering
 * @for p5
 */

import p5 from './main';
import * as constants from './constants';
import './p5.Graphics';
import Renderer2D from './p5.Renderer2D';
import RendererGL from '../webgl/p5.RendererGL';
let defaultId = 'defaultCanvas0'; // this gets set again in createCanvas
const defaultClass = 'p5Canvas';
// Attach renderers object to p5 class, new renderer can be similarly attached
const renderers = p5.renderers = {
  [constants.P2D]: Renderer2D,
  [constants.WEBGL]: RendererGL,
  [constants.WEBGL2]: RendererGL
};

/**
 * Creates a canvas element in the document and sets its dimensions
 * in pixels. This method should be called only once at the start of <a href="#/p5/setup">setup()</a>.
 * Calling <a href="#/p5/createCanvas">createCanvas</a> more than once in a
 * sketch will result in very unpredictable behavior. If you want more than
 * one drawing canvas you could use <a href="#/p5/createGraphics">createGraphics()</a>
 * (hidden by default but it can be shown).
 *
 * Important note: in 2D mode (i.e. when `p5.Renderer` is not set) the origin (0,0)
 * is positioned at the top left of the screen. In 3D mode (i.e. when `p5.Renderer`
 * is set to `WEBGL`), the origin is positioned at the center of the canvas.
 * See [this issue](https://github.com/processing/p5.js/issues/1545) for more information.
 *
 * A WebGL canvas will use a WebGL2 context if it is supported by the browser.
 * Check the <a href="#/p5/webglVersion">webglVersion</a> property to check what
 * version is being used, or call <a href="#/p5/setAttributes">setAttributes({ version: 1 })</a>
 * to create a WebGL1 context.
 *
 * The system variables width and height are set by the parameters passed to this
 * function. If <a href="#/p5/createCanvas">createCanvas()</a> is not used, the
 * window will be given a default size of 100×100 pixels.
 *
 * Optionally, an existing canvas can be passed using a selector, ie. `document.getElementById('')`.
 * If specified, avoid using `setAttributes()` afterwards, as this will remove and recreate the existing canvas.
 *
 * For more ways to position the canvas, see the
 * <a href='https://github.com/processing/p5.js/wiki/Positioning-your-canvas'>
 * positioning the canvas</a> wiki page.
 *
 * @method createCanvas
 * @param  {Number} w width of the canvas
 * @param  {Number} h height of the canvas
 * @param  {(P2D|WEBGL)} [renderer] either P2D or WEBGL
 * @param  {HTMLCanvasElement} [canvas] existing html canvas element
 * @return {p5.Renderer} pointer to p5.Renderer holding canvas
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 50);
 *   background(153);
 *   line(0, 0, width, height);
 * }
 * </code>
 * </div>
 *
 * @alt
 * Black line extending from top-left of canvas to bottom right.
 */
/**
 * @method createCanvas
 * @param  {Number} w
 * @param  {Number} h
 * @param  {HTMLCanvasElement} [canvas]
 * @return {p5.Renderer} pointer to p5.Renderer holding canvas
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
    // NOTE: this is to guard against multiple default canvas being created
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
  // if (r === constants.WEBGL) {
  //   this._setProperty('_renderer', new p5.RendererGL(c, this, true));
  //   this._elements.push(this._renderer);
  // } else {
  //   //P2D mode
  //   if (!this._defaultGraphicsCreated) {
  //     this._setProperty('_renderer', new p5.Renderer2D(c, this, true));
  //     this._defaultGraphicsCreated = true;
  //     this._elements.push(this._renderer);
  //   }
  // }
  this._setProperty('_renderer', new renderers[r](c, this, true));
  this._defaultGraphicsCreated = true;
  this._elements.push(this._renderer);
  this._renderer.resize(w, h);
  this._renderer._applyDefaults();
  return this._renderer;
};

/**
 * Resizes the canvas to given width and height. The canvas will be cleared
 * and draw will be called immediately, allowing the sketch to re-render itself
 * in the resized canvas.
 * @method resizeCanvas
 * @param  {Number} w width of the canvas
 * @param  {Number} h height of the canvas
 * @param  {Boolean} [noRedraw] don't redraw the canvas immediately
 * @example
 * <div class="norender"><code>
 * function setup() {
 *   createCanvas(windowWidth, windowHeight);
 * }
 *
 * function draw() {
 *   background(0, 100, 200);
 * }
 *
 * function windowResized() {
 *   resizeCanvas(windowWidth, windowHeight);
 * }
 * </code></div>
 *
 * @alt
 * No image displayed.
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
 * Removes the default canvas for a p5 sketch that doesn't require a canvas
 * @method noCanvas
 * @example
 * <div>
 * <code>
 * function setup() {
 *   noCanvas();
 * }
 * </code>
 * </div>
 *
 * @alt
 * no image displayed
 */
p5.prototype.noCanvas = function() {
  if (this.canvas) {
    this.canvas.parentNode.removeChild(this.canvas);
  }
};

/**
 * Creates and returns a new p5.Graphics object. Use this class if you need
 * to draw into an off-screen graphics buffer. The two parameters define the
 * width and height in pixels.
 *
 * A WebGL p5.Graphics will use a WebGL2 context if it is supported by the browser.
 * Check the <a href="#/p5/webglVersion">pg.webglVersion</a> property of the renderer
 * to check what version is being used, or call <a href="#/p5/setAttributes">pg.setAttributes({ version: 1 })</a>
 * to create a WebGL1 context.
 *
 * Optionally, an existing canvas can be passed using a selector, ie. document.getElementById('').
 * By default this canvas will be hidden (offscreen buffer), to make visible, set element's style to display:block;
 *
 * @method createGraphics
 * @param  {Number} w width of the offscreen graphics buffer
 * @param  {Number} h height of the offscreen graphics buffer
 * @param  {(P2D|WEBGL)} [renderer] either P2D or WEBGL
 *                               undefined defaults to p2d
 * @param  {HTMLCanvasElement} [canvas] existing html canvas element
 * @return {p5.Graphics} offscreen graphics buffer
 * @example
 * <div>
 * <code>
 * let pg;
 * function setup() {
 *   createCanvas(100, 100);
 *   pg = createGraphics(100, 100);
 * }
 *
 * function draw() {
 *   background(200);
 *   pg.background(100);
 *   pg.noStroke();
 *   pg.ellipse(pg.width / 2, pg.height / 2, 50, 50);
 *   image(pg, 50, 50);
 *   image(pg, 0, 0, 50, 50);
 * }
 * </code>
 * </div>
 *
 * @alt
 * 4 grey squares alternating light and dark grey. White quarter circle mid-left.
 */
/**
 * @method createGraphics
 * @param  {Number} w
 * @param  {Number} h
 * @param  {HTMLCanvasElement} [canvas]
 * @return {p5.Graphics} offscreen graphics buffer
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
 * Creates and returns a new <a href="#/p5.Framebuffer">p5.Framebuffer</a>, a
 * high-performance WebGL object that you can draw to and then use as a texture.
 *
 * Options can include:
 * - `format`: The data format of the texture, either `UNSIGNED_BYTE`, `FLOAT`, or `HALF_FLOAT`. The default is `UNSIGNED_BYTE`.
 * - `channels`: What color channels to store, either `RGB` or `RGBA`. The default is to match the channels in the main canvas (with alpha unless disabled with `setAttributes`.)
 * - `depth`: A boolean, whether or not to include a depth buffer. Defaults to true.
 * - `depthFormat`: The data format for depth information, either `UNSIGNED_INT` or `FLOAT`. The default is `FLOAT` if available, or `UNSIGNED_INT` otherwise.
 * - `stencil`: A boolean, whether or not to include a stencil buffer, which can be used for masking. This may only be used if also using a depth buffer. Defaults to the value of `depth`, which is true if not provided.
 * - `antialias`: Boolean or Number, whether or not to render with antialiased edges, and if so, optionally the number of samples to use. Defaults to whether or not the main canvas is antialiased, using a default of 2 samples if so. Antialiasing is only supported when WebGL 2 is available.
 * - `width`: The width of the texture. Defaults to matching the main canvas.
 * - `height`: The height of the texture. Defaults to matching the main canvas.
 * - `density`: The pixel density of the texture. Defaults to the pixel density of the main canvas.
 * - `textureFiltering`: Either `LINEAR` (nearby pixels will be interpolated when reading values from the color texture) or `NEAREST` (no interpolation.) Generally, use `LINEAR` when using the texture as an image, and use `NEAREST` if reading the texture as data. Defaults to `LINEAR`.
 *
 * If `width`, `height`, or `density` are specified, then the framebuffer will
 * keep that size until manually changed. Otherwise, it will be autosized, and
 * it will update to match the main canvas's size and density when the main
 * canvas changes.
 *
 * @method createFramebuffer
 * @param {Object} [options] An optional object with configuration
 * @return {p5.Framebuffer}
 *
 * @example
 * <div>
 * <code>
 * let prev, next;
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   prev = createFramebuffer({ format: FLOAT });
 *   next = createFramebuffer({ format: FLOAT });
 *   noStroke();
 * }
 *
 * function draw() {
 *   // Swap prev and next so that we can use the previous
 *   // frame as a texture when drawing the current frame
 *   [prev, next] = [next, prev];
 *
 *   // Draw to the framebuffer
 *   next.begin();
 *   background(255);
 *
 *   push();
 *   tint(255, 253);
 *   image(prev, -width/2, -height/2);
 *   // Make sure the image plane doesn't block you from seeing any part
 *   // of the scene
 *   clearDepth();
 *   pop();
 *
 *   push();
 *   normalMaterial();
 *   translate(25*sin(frameCount * 0.014), 25*sin(frameCount * 0.02), 0);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   box(12);
 *   pop();
 *   next.end();
 *
 *   image(next, -width/2, -height/2);
 * }
 * </code>
 * </div>
 *
 * @alt
 * A red, green, and blue box (using normalMaterial) moves and rotates around
 * the canvas, leaving a trail behind it that slowly grows and fades away.
 */
p5.prototype.createFramebuffer = function(options) {
  return new p5.Framebuffer(this, options);
};

/**
 * This makes the canvas forget how far from the camera everything that has
 * been drawn was. Use this if you want to make sure the next thing you draw
 * will not draw behind anything that is already on the canvas.
 *
 * This is useful for things like feedback effects, where you want the previous
 * frame to act like a background for the next frame, and not like a plane in
 * 3D space in the scene.
 *
 * This method is only available in WebGL mode. Since 2D mode does not have
 * 3D depth, anything you draw will always go on top of the previous content on
 * the canvas anyway.
 *
 * @method clearDepth
 * @param {Number} [depth] The value, between 0 and 1, to reset the depth to, where
 * 0 corresponds to a value as close as possible to the camera before getting
 * clipped, and 1 corresponds to a value as far away from the camera as possible.
 * The default value is 1.
 *
 * @example
 * <div>
 * <code>
 * let prev, next;
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *   prev = createFramebuffer({ format: FLOAT });
 *   next = createFramebuffer({ format: FLOAT });
 *   noStroke();
 * }
 *
 * function draw() {
 *   // Swap prev and next so that we can use the previous
 *   // frame as a texture when drawing the current frame
 *   [prev, next] = [next, prev];
 *
 *   // Draw to the framebuffer
 *   next.begin();
 *   background(255);
 *
 *   push();
 *   tint(255, 253);
 *   image(prev, -width/2, -height/2);
 *   // Make sure the image plane doesn't block you from seeing any part
 *   // of the scene
 *   clearDepth();
 *   pop();
 *
 *   push();
 *   normalMaterial();
 *   translate(25*sin(frameCount * 0.014), 25*sin(frameCount * 0.02), 0);
 *   rotateX(frameCount * 0.01);
 *   rotateY(frameCount * 0.01);
 *   box(12);
 *   pop();
 *   next.end();
 *
 *   image(next, -width/2, -height/2);
 * }
 * </code>
 * </div>
 *
 * @alt
 * A red, green, and blue box (using normalMaterial) moves and rotates around
 * the canvas, leaving a trail behind it that slowly grows and fades away.
 */
p5.prototype.clearDepth = function(depth) {
  this._assert3d('clearDepth');
  this._renderer.clearDepth(depth);
};

/**
 * Blends the pixels in the display window according to the defined mode.
 * There is a choice of the following modes to blend the source pixels (A)
 * with the ones of pixels already in the display window (B):
 * <ul>
 * <li><code>BLEND</code> - linear interpolation of colours: C =
 * A*factor + B. <b>This is the default blending mode.</b></li>
 * <li><code>ADD</code> - sum of A and B</li>
 * <li><code>DARKEST</code> - only the darkest colour succeeds: C =
 * min(A*factor, B).</li>
 * <li><code>LIGHTEST</code> - only the lightest colour succeeds: C =
 * max(A*factor, B).</li>
 * <li><code>DIFFERENCE</code> - subtract colors from underlying image.
 * <em>(2D)</em></li>
 * <li><code>EXCLUSION</code> - similar to <code>DIFFERENCE</code>, but less
 * extreme.</li>
 * <li><code>MULTIPLY</code> - multiply the colors, result will always be
 * darker.</li>
 * <li><code>SCREEN</code> - opposite multiply, uses inverse values of the
 * colors.</li>
 * <li><code>REPLACE</code> - the pixels entirely replace the others and
 * don't utilize alpha (transparency) values.</li>
 * <li><code>REMOVE</code> - removes pixels from B with the alpha strength of A.</li>
 * <li><code>OVERLAY</code> - mix of <code>MULTIPLY</code> and <code>SCREEN
 * </code>. Multiplies dark values, and screens light values. <em>(2D)</em></li>
 * <li><code>HARD_LIGHT</code> - <code>SCREEN</code> when greater than 50%
 * gray, <code>MULTIPLY</code> when lower. <em>(2D)</em></li>
 * <li><code>SOFT_LIGHT</code> - mix of <code>DARKEST</code> and
 * <code>LIGHTEST</code>. Works like <code>OVERLAY</code>, but not as harsh. <em>(2D)</em>
 * </li>
 * <li><code>DODGE</code> - lightens light tones and increases contrast,
 * ignores darks. <em>(2D)</em></li>
 * <li><code>BURN</code> - darker areas are applied, increasing contrast,
 * ignores lights. <em>(2D)</em></li>
 * <li><code>SUBTRACT</code> - remainder of A and B <em>(3D)</em></li>
 * </ul>
 *
 * <em>(2D)</em> indicates that this blend mode <b>only</b> works in the 2D renderer.<br>
 * <em>(3D)</em> indicates that this blend mode <b>only</b> works in the WEBGL renderer.
 *
 * @method blendMode
 * @param  {(BLEND|DARKEST|LIGHTEST|DIFFERENCE|MULTIPLY|EXCLUSION|SCREEN|REPLACE|OVERLAY|HARD_LIGHT|SOFT_LIGHT|DODGE|BURN|ADD|REMOVE|SUBTRACT)} mode blend mode to set for canvas.
 *                either BLEND, DARKEST, LIGHTEST, DIFFERENCE, MULTIPLY,
 *                EXCLUSION, SCREEN, REPLACE, OVERLAY, HARD_LIGHT,
 *                SOFT_LIGHT, DODGE, BURN, ADD, REMOVE or SUBTRACT
 * @example
 * <div>
 * <code>
 * blendMode(LIGHTEST);
 * strokeWeight(30);
 * stroke(80, 150, 255);
 * line(25, 25, 75, 75);
 * stroke(255, 50, 50);
 * line(75, 25, 25, 75);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * blendMode(MULTIPLY);
 * strokeWeight(30);
 * stroke(80, 150, 255);
 * line(25, 25, 75, 75);
 * stroke(255, 50, 50);
 * line(75, 25, 25, 75);
 * </code>
 * </div>
 *
 * @alt
 * translucent image thick red & blue diagonal rounded lines intersecting center
 * Thick red & blue diagonal rounded lines intersecting center. dark at overlap
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
 * The p5.js API provides a lot of functionality for creating graphics, but there is
 * some native HTML5 Canvas functionality that is not exposed by p5. You can still call
 * it directly using the variable `drawingContext`, as in the example shown. This is
 * the equivalent of calling `canvas.getContext('2d');` or `canvas.getContext('webgl');`.
 * See this
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D">
 * reference for the native canvas API</a> for possible drawing functions you can call.
 *
 * @property drawingContext
 * @example
 * <div>
 * <code>
 * function setup() {
 *   drawingContext.shadowOffsetX = 5;
 *   drawingContext.shadowOffsetY = -5;
 *   drawingContext.shadowBlur = 10;
 *   drawingContext.shadowColor = 'black';
 *   background(200);
 *   ellipse(width / 2, height / 2, 50, 50);
 * }
 * </code>
 * </div>
 *
 * @alt
 * white ellipse with shadow blur effect around edges
 */

export default p5;
