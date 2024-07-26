/**
 * @module Rendering
 * @submodule Rendering
 * @for p5
 */

import p5 from './main';
import * as constants from './constants';

/**
 * A class to describe a drawing surface that's separate from the main canvas.
 *
 * Each `p5.Graphics` object provides a dedicated drawing surface called a
 * *graphics buffer*. Graphics buffers are helpful when drawing should happen
 * offscreen. For example, separate scenes can be drawn offscreen and
 * displayed only when needed.
 *
 * `p5.Graphics` objects have nearly all the drawing features of the main
 * canvas. For example, calling the method `myGraphics.circle(50, 50, 20)`
 * draws to the graphics buffer. The resulting image can be displayed on the
 * main canvas by passing the `p5.Graphics` object to the
 * <a href="#/p5/image">image()</a> function, as in `image(myGraphics, 0, 0)`.
 *
 * Note: <a href="#/p5/createGraphics">createGraphics()</a> is the recommended
 * way to create an instance of this class.
 *
 * @class p5.Graphics
 * @constructor
 * @extends p5.Element
 * @param {Number} width width of the graphics buffer in pixels.
 * @param {Number} height height of the graphics buffer in pixels.
 * @param {Constant} renderer renderer to use, either P2D or WEBGL.
 * @param {p5} [pInst] sketch instance.
 * @param {HTMLCanvasElement} [canvas] existing `&lt;canvas&gt;` element to use.
 *
 * @example
 * <div>
 * <code>
 * let pg;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Create a p5.Graphics object.
 *   pg = createGraphics(50, 50);
 *
 *   // Draw to the p5.Graphics object.
 *   pg.background(100);
 *   pg.circle(25, 25, 20);
 *
 *   describe('A dark gray square with a white circle at its center drawn on a gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Display the p5.Graphics object.
 *   image(pg, 25, 25);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Click the canvas to display the graphics buffer.
 *
 * let pg;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Create a p5.Graphics object.
 *   pg = createGraphics(50, 50);
 *
 *   describe('A square appears on a gray background when the user presses the mouse. The square cycles between white and black.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Calculate the background color.
 *   let bg = frameCount % 255;
 *
 *   // Draw to the p5.Graphics object.
 *   pg.background(bg);
 *
 *   // Display the p5.Graphics object while
 *   // the user presses the mouse.
 *   if (mouseIsPressed === true) {
 *     image(pg, 25, 25);
 *   }
 * }
 * </code>
 * </div>
 */
p5.Graphics = class extends p5.Element {
  constructor(w, h, renderer, pInst, canvas) {
    let canvasTemp;
    if (canvas) {
      canvasTemp = canvas;
    } else {
      canvasTemp = document.createElement('canvas');
    }

    super(canvasTemp, pInst);
    this.canvas = canvasTemp;

    const r = renderer || constants.P2D;

    const node = pInst._userNode || document.body;
    if (!canvas) {
      node.appendChild(this.canvas);
    }

    // bind methods and props of p5 to the new object
    for (const p in p5.prototype) {
      if (!this[p]) {
        if (typeof p5.prototype[p] === 'function') {
          this[p] = p5.prototype[p].bind(this);
        } else {
          this[p] = p5.prototype[p];
        }
      }
    }

    p5.prototype._initializeInstanceVariables.apply(this);
    this.width = w;
    this.height = h;
    this._pixelDensity = pInst._pixelDensity;

    if (r === constants.WEBGL) {
      this._renderer = new p5.RendererGL(this.canvas, this, false);
      const { adjustedWidth, adjustedHeight } =
        this._renderer._adjustDimensions(w, h);
      w = adjustedWidth;
      h = adjustedHeight;
    } else {
      this._renderer = new p5.Renderer2D(this.canvas, this, false);
    }
    pInst._elements.push(this);

    Object.defineProperty(this, 'deltaTime', {
      get() {
        return this._pInst.deltaTime;
      }
    });

    this._renderer.resize(w, h);
    this._renderer._applyDefaults();
    return this;
  }

  /**
 * Resets the graphics buffer's transformations and lighting.
 *
 * By default, the main canvas resets certain transformation and lighting
 * values each time <a href="#/p5/draw">draw()</a> executes. `p5.Graphics`
 * objects must reset these values manually by calling `myGraphics.reset()`.
 *
 * @method reset
 *
 * @example
 * <div>
 * <code>
 * let pg;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Create a p5.Graphics object.
 *   pg = createGraphics(60, 60);
 *
 *   describe('A white circle moves downward slowly within a dark square. The circle resets at the top of the dark square when the user presses the mouse.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Translate the p5.Graphics object's coordinate system.
 *   // The translation accumulates; the white circle moves.
 *   pg.translate(0, 0.1);
 *
 *   // Draw to the p5.Graphics object.
 *   pg.background(100);
 *   pg.circle(30, 0, 10);
 *
 *   // Display the p5.Graphics object.
 *   image(pg, 20, 20);
 *
 *   // Translate the main canvas' coordinate system.
 *   // The translation doesn't accumulate; the dark
 *   // square is always in the same place.
 *   translate(0, 0.1);
 *
 *   // Reset the p5.Graphics object when the
 *   // user presses the mouse.
 *   if (mouseIsPressed === true) {
 *     pg.reset();
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let pg;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Create a p5.Graphics object.
 *   pg = createGraphics(60, 60);
 *
 *   describe('A white circle at the center of a dark gray square. The image is drawn on a light gray background.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Translate the p5.Graphics object's coordinate system.
 *   pg.translate(30, 30);
 *
 *   // Draw to the p5.Graphics object.
 *   pg.background(100);
 *   pg.circle(0, 0, 10);
 *
 *   // Display the p5.Graphics object.
 *   image(pg, 20, 20);
 *
 *   // Reset the p5.Graphics object automatically.
 *   pg.reset();
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let pg;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Create a p5.Graphics object using WebGL mode.
 *   pg = createGraphics(100, 100, WEBGL);
 *
 *   describe("A sphere lit from above with a red light. The sphere's surface becomes glossy while the user clicks and holds the mouse.");
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Add a red point light from the top-right.
 *   pg.pointLight(255, 0, 0, 50, -100, 50);
 *
 *   // Style the sphere.
 *   // It should appear glossy when the
 *   // lighting values are reset.
 *   pg.noStroke();
 *   pg.specularMaterial(255);
 *   pg.shininess(100);
 *
 *   // Draw the sphere.
 *   pg.sphere(30);
 *
 *   // Display the p5.Graphics object.
 *   image(pg, -50, -50);
 *
 *   // Reset the p5.Graphics object when
 *   // the user presses the mouse.
 *   if (mouseIsPressed === true) {
 *     pg.reset();
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let pg;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Create a p5.Graphics object using WebGL mode.
 *   pg = createGraphics(100, 100, WEBGL);
 *
 *   describe('A sphere with a glossy surface is lit from the top-right by a red light.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Add a red point light from the top-right.
 *   pg.pointLight(255, 0, 0, 50, -100, 50);
 *
 *   // Style the sphere.
 *   pg.noStroke();
 *   pg.specularMaterial(255);
 *   pg.shininess(100);
 *
 *   // Draw the sphere.
 *   pg.sphere(30);
 *
 *   // Display the p5.Graphics object.
 *   image(pg, 0, 0);
 *
 *   // Reset the p5.Graphics object automatically.
 *   pg.reset();
 * }
 * </code>
 * </div>
 */
  reset() {
    this._renderer.resetMatrix();
    if (this._renderer.isP3D) {
      this._renderer._update();
    }
  }

  /**
 * Removes the graphics buffer from the web page.
 *
 * Calling `myGraphics.remove()` removes the graphics buffer's
 * `&lt;canvas&gt;` element from the web page. The graphics buffer also uses
 * a bit of memory on the CPU that can be freed like so:
 *
 * ```js
 * // Remove the graphics buffer from the web page.
 * myGraphics.remove();
 *
 * // Delete the graphics buffer from CPU memory.
 * myGraphics = undefined;
 * ```
 *
 * Note: All variables that reference the graphics buffer must be assigned
 * the value `undefined` to delete the graphics buffer from CPU memory. If any
 * variable still refers to the graphics buffer, then it won't be garbage
 * collected.
 *
 * @method remove
 *
 * @example
 * <div>
 * <code>
 * // Double-click to remove the p5.Graphics object.
 *
 * let pg;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Create a p5.Graphics object.
 *   pg = createGraphics(60, 60);
 *
 *   // Draw to the p5.Graphics object.
 *   pg.background(100);
 *   pg.circle(30, 30, 20);
 *
 *   describe('A white circle at the center of a dark gray square disappears when the user double-clicks.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Display the p5.Graphics object if
 *   // it's available.
 *   if (pg) {
 *     image(pg, 20, 20);
 *   }
 * }
 *
 * // Remove the p5.Graphics object when the
 * // the user double-clicks.
 * function doubleClicked() {
 *   // Remove the p5.Graphics object from the web page.
 *   pg.remove();
 *   pg = undefined;
 * }
 * </code>
 * </div>
 */
  remove() {
    if (this.elt.parentNode) {
      this.elt.parentNode.removeChild(this.elt);
    }
    const idx = this._pInst._elements.indexOf(this);
    if (idx !== -1) {
      this._pInst._elements.splice(idx, 1);
    }
    for (const elt_ev in this._events) {
      this.elt.removeEventListener(elt_ev, this._events[elt_ev]);
    }

    this._renderer = undefined;
    this.canvas = undefined;
    this.elt = undefined;
  }


  /**
   * Creates a new <a href="#/p5.Framebuffer">p5.Framebuffer</a> object with
   * the same WebGL context as the graphics buffer.
   *
   * <a href="#/p5.Framebuffer">p5.Framebuffer</a> objects are separate drawing
   * surfaces that can be used as textures in WebGL mode. They're similar to
   * <a href="#/p5.Graphics">p5.Graphics</a> objects and generally run much
   * faster when used as textures. Creating a
   * <a href="#/p5.Framebuffer">p5.Framebuffer</a> object in the same context
   * as the graphics buffer makes this speedup possible.
   *
   * The parameter, `options`, is optional. An object can be passed to configure
   * the <a href="#/p5.Framebuffer">p5.Framebuffer</a> object. The available
   * properties are:
   *
   * - `format`: data format of the texture, either `UNSIGNED_BYTE`, `FLOAT`, or `HALF_FLOAT`. Default is `UNSIGNED_BYTE`.
   * - `channels`: whether to store `RGB` or `RGBA` color channels. Default is to match the graphics buffer which is `RGBA`.
   * - `depth`: whether to include a depth buffer. Default is `true`.
   * - `depthFormat`: data format of depth information, either `UNSIGNED_INT` or `FLOAT`. Default is `FLOAT`.
   * - `stencil`: whether to include a stencil buffer for masking. `depth` must be `true` for this feature to work. Defaults to the value of `depth` which is `true`.
   * - `antialias`: whether to perform anti-aliasing. If set to `true`, as in `{ antialias: true }`, 2 samples will be used by default. The number of samples can also be set, as in `{ antialias: 4 }`. Default is to match <a href="#/p5/setAttributes">setAttributes()</a> which is `false` (`true` in Safari).
   * - `width`: width of the <a href="#/p5.Framebuffer">p5.Framebuffer</a> object. Default is to always match the graphics buffer width.
   * - `height`: height of the <a href="#/p5.Framebuffer">p5.Framebuffer</a> object. Default is to always match the graphics buffer height.
   * - `density`: pixel density of the <a href="#/p5.Framebuffer">p5.Framebuffer</a> object. Default is to always match the graphics buffer pixel density.
   * - `textureFiltering`: how to read values from the <a href="#/p5.Framebuffer">p5.Framebuffer</a> object. Either `LINEAR` (nearby pixels will be interpolated) or `NEAREST` (no interpolation). Generally, use `LINEAR` when using the texture as an image and `NEAREST` if reading the texture as data. Default is `LINEAR`.
   *
   * If the `width`, `height`, or `density` attributes are set, they won't
   * automatically match the graphics buffer and must be changed manually.
   *
   * @method createFramebuffer
   * @param {Object} [options] configuration options.
   * @return {p5.Framebuffer} new framebuffer.
   *
   * @example
   * <div>
   * <code>
   * // Click and hold a mouse button to change shapes.
   *
   * let pg;
   * let torusLayer;
   * let boxLayer;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a p5.Graphics object using WebGL mode.
   *   pg = createGraphics(100, 100, WEBGL);
   *
   *   // Create the p5.Framebuffer objects.
   *   torusLayer = pg.createFramebuffer();
   *   boxLayer = pg.createFramebuffer();
   *
   *   describe('A grid of white toruses rotating against a dark gray background. The shapes become boxes while the user holds a mouse button.');
   * }
   *
   * function draw() {
   *   // Update and draw the layers offscreen.
   *   drawTorus();
   *   drawBox();
   *
   *   // Choose the layer to display.
   *   let layer;
   *   if (mouseIsPressed === true) {
   *     layer = boxLayer;
   *   } else {
   *     layer = torusLayer;
   *   }
   *
   *   // Draw to the p5.Graphics object.
   *   pg.background(50);
   *
   *   // Iterate from left to right.
   *   for (let x = -50; x < 50; x += 25) {
   *     // Iterate from top to bottom.
   *     for (let y = -50; y < 50; y += 25) {
   *       // Draw the layer to the p5.Graphics object
   *       pg.image(layer, x, y, 25, 25);
   *     }
   *   }
   *
   *   // Display the p5.Graphics object.
   *   image(pg, 0, 0);
   * }
   *
   * // Update and draw the torus layer offscreen.
   * function drawTorus() {
   *   // Start drawing to the torus p5.Framebuffer.
   *   torusLayer.begin();
   *
   *   // Clear the drawing surface.
   *   pg.clear();
   *
   *   // Turn on the lights.
   *   pg.lights();
   *
   *   // Rotate the coordinate system.
   *   pg.rotateX(frameCount * 0.01);
   *   pg.rotateY(frameCount * 0.01);
   *
   *   // Style the torus.
   *   pg.noStroke();
   *
   *   // Draw the torus.
   *   pg.torus(20);
   *
   *   // Start drawing to the torus p5.Framebuffer.
   *   torusLayer.end();
   * }
   *
   * // Update and draw the box layer offscreen.
   * function drawBox() {
   *   // Start drawing to the box p5.Framebuffer.
   *   boxLayer.begin();
   *
   *   // Clear the drawing surface.
   *   pg.clear();
   *
   *   // Turn on the lights.
   *   pg.lights();
   *
   *   // Rotate the coordinate system.
   *   pg.rotateX(frameCount * 0.01);
   *   pg.rotateY(frameCount * 0.01);
   *
   *   // Style the box.
   *   pg.noStroke();
   *
   *   // Draw the box.
   *   pg.box(30);
   *
   *   // Start drawing to the box p5.Framebuffer.
   *   boxLayer.end();
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click and hold a mouse button to change shapes.
   *
   * let pg;
   * let torusLayer;
   * let boxLayer;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create an options object.
   *   let options = { width: 25, height: 25 };
   *
   *   // Create a p5.Graphics object using WebGL mode.
   *   pg = createGraphics(100, 100, WEBGL);
   *
   *   // Create the p5.Framebuffer objects.
   *   // Use options for configuration.
   *   torusLayer = pg.createFramebuffer(options);
   *   boxLayer = pg.createFramebuffer(options);
   *
   *   describe('A grid of white toruses rotating against a dark gray background. The shapes become boxes while the user holds a mouse button.');
   * }
   *
   * function draw() {
   *   // Update and draw the layers offscreen.
   *   drawTorus();
   *   drawBox();
   *
   *   // Choose the layer to display.
   *   let layer;
   *   if (mouseIsPressed === true) {
   *     layer = boxLayer;
   *   } else {
   *     layer = torusLayer;
   *   }
   *
   *   // Draw to the p5.Graphics object.
   *   pg.background(50);
   *
   *   // Iterate from left to right.
   *   for (let x = -50; x < 50; x += 25) {
   *     // Iterate from top to bottom.
   *     for (let y = -50; y < 50; y += 25) {
   *       // Draw the layer to the p5.Graphics object
   *       pg.image(layer, x, y);
   *     }
   *   }
   *
   *   // Display the p5.Graphics object.
   *   image(pg, 0, 0);
   * }
   *
   * // Update and draw the torus layer offscreen.
   * function drawTorus() {
   *   // Start drawing to the torus p5.Framebuffer.
   *   torusLayer.begin();
   *
   *   // Clear the drawing surface.
   *   pg.clear();
   *
   *   // Turn on the lights.
   *   pg.lights();
   *
   *   // Rotate the coordinate system.
   *   pg.rotateX(frameCount * 0.01);
   *   pg.rotateY(frameCount * 0.01);
   *
   *   // Style the torus.
   *   pg.noStroke();
   *
   *   // Draw the torus.
   *   pg.torus(5, 2.5);
   *
   *   // Start drawing to the torus p5.Framebuffer.
   *   torusLayer.end();
   * }
   *
   * // Update and draw the box layer offscreen.
   * function drawBox() {
   *   // Start drawing to the box p5.Framebuffer.
   *   boxLayer.begin();
   *
   *   // Clear the drawing surface.
   *   pg.clear();
   *
   *   // Turn on the lights.
   *   pg.lights();
   *
   *   // Rotate the coordinate system.
   *   pg.rotateX(frameCount * 0.01);
   *   pg.rotateY(frameCount * 0.01);
   *
   *   // Style the box.
   *   pg.noStroke();
   *
   *   // Draw the box.
   *   pg.box(7.5);
   *
   *   // Start drawing to the box p5.Framebuffer.
   *   boxLayer.end();
   * }
   * </code>
   * </div>
   */
  createFramebuffer(options) {
    return new p5.Framebuffer(this, options);
  }
};

export default p5.Graphics;
