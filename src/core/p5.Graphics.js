/**
 * @module Rendering
 * @submodule Rendering
 * @for p5
 */

import * as constants from './constants';
import { RGB, HSB, HSL } from '../color/creating_reading';
import primitives2D from '../shape/2d_primitives';
import attributes from '../shape/attributes';
import curves from '../shape/curves';
import vertex from '../shape/vertex';
import setting from '../color/setting';
import image from '../image/image';
import loadingDisplaying from '../image/loading_displaying';
import pixels from '../image/pixels';
import transform from './transform';
import { Framebuffer } from '../webgl/p5.Framebuffer';

import primitives3D from '../webgl/3d_primitives';
import light from '../webgl/light';
import material from '../webgl/material';
import creatingReading from '../color/creating_reading';
import trigonometry from '../math/trigonometry';
import { renderers } from './rendering';

class Graphics {
  constructor(w, h, renderer, pInst, canvas) {
    const r = renderer || constants.P2D;

    this._pInst = pInst;
    this._renderer = new renderers[r](this._pInst, w, h, false, canvas);

    this._initializeInstanceVariables(this);

    this._renderer._applyDefaults();
    return this;
  }

  get deltaTime(){
    return this._pInst.deltaTime;
  }

  get canvas(){
    return this._renderer?.canvas;
  }

  get drawingContext(){
    return this._renderer.drawingContext;
  }

  get width(){
    return this._renderer?.width;
  }

  get height(){
    return this._renderer?.height;
  }

  get pixels(){
    return this._renderer?.pixels;
  }

  pixelDensity(val){
    let returnValue;
    if (typeof val === 'number') {
      if (val !== this._renderer._pixelDensity) {
        this._renderer._pixelDensity = val;
      }
      returnValue = this;
      this.resizeCanvas(this.width, this.height, true); // as a side effect, it will clear the canvas
    } else {
      returnValue = this._renderer._pixelDensity;
    }
    return returnValue;
  }

  resizeCanvas(w, h){
    this._renderer.resize(w, h);
  }

  /**
   * Resets the graphics buffer's transformations and lighting.
   *
   * By default, the main canvas resets certain transformation and lighting
   * values each time <a href="#/p5/draw">draw()</a> executes. `p5.Graphics`
   * objects must reset these values manually by calling `myGraphics.reset()`.
   *
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
    this._renderer.remove();
    this._renderer = undefined;
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
    return new Framebuffer(this._renderer, options);
  }

  _assert3d(name) {
    if (!this._renderer.isP3D)
      throw new Error(
        `${name}() is only supported in WEBGL mode. If you'd like to use 3D graphics and WebGL, see  https://p5js.org/examples/form-3d-primitives.html for more information.`
      );
  };

  _initializeInstanceVariables() {
    this._accessibleOutputs = {
      text: false,
      grid: false,
      textLabel: false,
      gridLabel: false
    };

    this._styles = [];

    // this._colorMode = RGB;
    // this._colorMaxes = {
    //   rgb: [255, 255, 255, 255],
    //   hsb: [360, 100, 100, 1],
    //   hsl: [360, 100, 100, 1]
    // };

    this._downKeys = {}; //Holds the key codes of currently pressed keys
  }
};

function graphics(p5, fn){
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
   * @extends p5.Element
   * @param {Number} w            width width of the graphics buffer in pixels.
   * @param {Number} h            height height of the graphics buffer in pixels.
   * @param {(P2D|WEBGL|P2DHDR)} renderer   the renderer to use, either P2D or WEBGL.
   * @param {p5} [pInst]          sketch instance.
   * @param {HTMLCanvasElement} [canvas]     existing `&lt;canvas&gt;` element to use.
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
  p5.Graphics = Graphics;

  // Shapes
  primitives2D(p5, p5.Graphics.prototype);
  attributes(p5, p5.Graphics.prototype);
  curves(p5, p5.Graphics.prototype);
  vertex(p5, p5.Graphics.prototype);

  setting(p5, p5.Graphics.prototype);
  loadingDisplaying(p5, p5.Graphics.prototype);
  image(p5, p5.Graphics.prototype);
  pixels(p5, p5.Graphics.prototype);

  transform(p5, p5.Graphics.prototype);

  primitives3D(p5, p5.Graphics.prototype);
  light(p5, p5.Graphics.prototype);
  material(p5, p5.Graphics.prototype);
  creatingReading(p5, p5.Graphics.prototype);
  trigonometry(p5, p5.Graphics.prototype);
}

export default graphics;
export { Graphics };
