/**
 * @module Color
 * @submodule Setting
 * @for p5
 * @requires core
 * @requires constants
 */

import * as constants from '../core/constants';
import { RGB, RGBHDR, HSL, HSB, HWB, LAB, LCH, OKLAB, OKLCH } from './creating_reading';

function setting(p5, fn){
  /**
   * Starts defining a shape that will mask any shapes drawn afterward.
   *
   * Any shapes drawn between `beginClip()` and
   * <a href="#/p5/endClip">endClip()</a> will add to the mask shape. The mask
   * will apply to anything drawn after <a href="#/p5/endClip">endClip()</a>.
   *
   * The parameter, `options`, is optional. If an object with an `invert`
   * property is passed, as in `beginClip({ invert: true })`, it will be used to
   * set the masking mode. `{ invert: true }` inverts the mask, creating holes
   * in shapes that are masked. `invert` is `false` by default.
   *
   * Masks can be contained between the
   * <a href="#/p5/push">push()</a> and <a href="#/p5/pop">pop()</a> functions.
   * Doing so allows unmasked shapes to be drawn after masked shapes.
   *
   * Masks can also be defined in a callback function that's passed to
   * <a href="#/p5/clip">clip()</a>.
   *
   * @method beginClip
   * @param {Object} [options] an object containing clip settings.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a mask.
   *   beginClip();
   *   triangle(15, 37, 30, 13, 43, 37);
   *   circle(45, 45, 7);
   *   endClip();
   *
   *   // Draw a backing shape.
   *   square(5, 5, 45);
   *
   *   describe('A white triangle and circle on a gray background.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create an inverted mask.
   *   beginClip({ invert: true });
   *   triangle(15, 37, 30, 13, 43, 37);
   *   circle(45, 45, 7);
   *   endClip();
   *
   *   // Draw a backing shape.
   *   square(5, 5, 45);
   *
   *   describe('A white square at the top-left corner of a gray square. The white square has a triangle and a circle cut out of it.');
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
   *   noStroke();
   *
   *   // Draw a masked shape.
   *   push();
   *   // Create a mask.
   *   beginClip();
   *   triangle(15, 37, 30, 13, 43, 37);
   *   circle(45, 45, 7);
   *   endClip();
   *
   *   // Draw a backing shape.
   *   square(5, 5, 45);
   *   pop();
   *
   *   // Translate the origin to the center.
   *   translate(50, 50);
   *
   *   // Draw an inverted masked shape.
   *   push();
   *   // Create an inverted mask.
   *   beginClip({ invert: true });
   *   triangle(15, 37, 30, 13, 43, 37);
   *   circle(45, 45, 7);
   *   endClip();
   *
   *   // Draw a backing shape.
   *   square(5, 5, 45);
   *   pop();
   *
   *   describe('In the top left, a white triangle and circle. In the bottom right, a white square with a triangle and circle cut out of it.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A silhouette of a rotating torus colored fuchsia.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Create a mask.
   *   beginClip();
   *   push();
   *   rotateX(frameCount * 0.01);
   *   rotateY(frameCount * 0.01);
   *   scale(0.5);
   *   torus(30, 15);
   *   pop();
   *   endClip();
   *
   *   // Draw a backing shape.
   *   noStroke();
   *   fill('fuchsia');
   *   plane(100);
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A silhouette of a rotating torus colored with a gradient from cyan to purple.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Create a mask.
   *   beginClip();
   *   push();
   *   rotateX(frameCount * 0.01);
   *   rotateY(frameCount * 0.01);
   *   scale(0.5);
   *   torus(30, 15);
   *   pop();
   *   endClip();
   *
   *   // Draw a backing shape.
   *   noStroke();
   *   beginShape(QUAD_STRIP);
   *   fill(0, 255, 255);
   *   vertex(-width / 2, -height / 2);
   *   vertex(width / 2, -height / 2);
   *   fill(100, 0, 100);
   *   vertex(-width / 2, height / 2);
   *   vertex(width / 2, height / 2);
   *   endShape();
   * }
   * </code>
   * </div>
   */
  fn.beginClip = function(options = {}) {
    this._renderer.beginClip(options);
  };

  /**
   * Ends defining a mask that was started with
   * <a href="#/p5/beginClip">beginClip()</a>.
   *
   * @method endClip
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a mask.
   *   beginClip();
   *   triangle(15, 37, 30, 13, 43, 37);
   *   circle(45, 45, 7);
   *   endClip();
   *
   *   // Draw a backing shape.
   *   square(5, 5, 45);
   *
   *   describe('A white triangle and circle on a gray background.');
   * }
   * </code>
   * </div>
   */
  fn.endClip = function() {
    this._renderer.endClip();
  };

  /**
   * Defines a shape that will mask any shapes drawn afterward.
   *
   * The first parameter, `callback`, is a function that defines the mask.
   * Any shapes drawn in  `callback` will add to the mask shape. The mask
   * will apply to anything drawn after `clip()` is called.
   *
   * The second parameter, `options`, is optional. If an object with an `invert`
   * property is passed, as in `beginClip({ invert: true })`, it will be used to
   * set the masking mode. `{ invert: true }` inverts the mask, creating holes
   * in shapes that are masked. `invert` is `false` by default.
   *
   * Masks can be contained between the
   * <a href="#/p5/push">push()</a> and <a href="#/p5/pop">pop()</a> functions.
   * Doing so allows unmasked shapes to be drawn after masked shapes.
   *
   * Masks can also be defined with <a href="#/p5/beginClip">beginClip()</a>
   * and <a href="#/p5/endClip">endClip()</a>.
   *
   * @method clip
   * @param {Function} callback a function that draws the mask shape.
   * @param {Object} [options] an object containing clip settings.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a mask.
   *   clip(mask);
   *
   *   // Draw a backing shape.
   *   square(5, 5, 45);
   *
   *   describe('A white triangle and circle on a gray background.');
   * }
   *
   * // Declare a function that defines the mask.
   * function mask() {
   *   triangle(15, 37, 30, 13, 43, 37);
   *   circle(45, 45, 7);
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create an inverted mask.
   *   clip(mask, { invert: true });
   *
   *   // Draw a backing shape.
   *   square(5, 5, 45);
   *
   *   describe('A white square at the top-left corner of a gray square. The white square has a triangle and a circle cut out of it.');
   * }
   *
   * // Declare a function that defines the mask.
   * function mask() {
   *   triangle(15, 37, 30, 13, 43, 37);
   *   circle(45, 45, 7);
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
   *   noStroke();
   *
   *   // Draw a masked shape.
   *   push();
   *   // Create a mask.
   *   clip(mask);
   *
   *   // Draw a backing shape.
   *   square(5, 5, 45);
   *   pop();
   *
   *   // Translate the origin to the center.
   *   translate(50, 50);
   *
   *   // Draw an inverted masked shape.
   *   push();
   *   // Create an inverted mask.
   *   clip(mask, { invert: true });
   *
   *   // Draw a backing shape.
   *   square(5, 5, 45);
   *   pop();
   *
   *   describe('In the top left, a white triangle and circle. In the bottom right, a white square with a triangle and circle cut out of it.');
   * }
   *
   * // Declare a function that defines the mask.
   * function mask() {
   *   triangle(15, 37, 30, 13, 43, 37);
   *   circle(45, 45, 7);
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A silhouette of a rotating torus colored fuchsia.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Create a mask.
   *   clip(mask);
   *
   *   // Draw a backing shape.
   *   noStroke();
   *   fill('fuchsia');
   *   plane(100);
   * }
   *
   * // Declare a function that defines the mask.
   * function mask() {
   *   push();
   *   rotateX(frameCount * 0.01);
   *   rotateY(frameCount * 0.01);
   *   scale(0.5);
   *   torus(30, 15);
   *   pop();
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A silhouette of a rotating torus colored with a gradient from cyan to purple.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Create a mask.
   *   clip(mask);
   *
   *   // Draw a backing shape.
   *   noStroke();
   *   beginShape(QUAD_STRIP);
   *   fill(0, 255, 255);
   *   vertex(-width / 2, -height / 2);
   *   vertex(width / 2, -height / 2);
   *   fill(100, 0, 100);
   *   vertex(-width / 2, height / 2);
   *   vertex(width / 2, height / 2);
   *   endShape();
   * }
   *
   * // Declare a function that defines the mask.
   * function mask() {
   *   push();
   *   rotateX(frameCount * 0.01);
   *   rotateY(frameCount * 0.01);
   *   scale(0.5);
   *   torus(30, 15);
   *   pop();
   * }
   * </code>
   * </div>
   */
  fn.clip = function(callback, options) {
    this._renderer.beginClip(options);
    callback();
    this._renderer.endClip(options);
  };

  /**
   * Sets the color used for the background of the canvas.
   *
   * By default, the background is transparent. `background()` is typically used
   * within <a href="#/p5/draw">draw()</a> to clear the display window at the
   * beginning of each frame. It can also be used inside
   * <a href="#/p5/setup">setup()</a> to set the background on the first frame
   * of animation.
   *
   * The version of `background()` with one parameter interprets the value one
   * of four ways. If the parameter is a `Number`, it's interpreted as a grayscale
   * value. If the parameter is a `String`, it's interpreted as a CSS color string.
   * RGB, RGBA, HSL, HSLA, hex, and named color strings are supported. If the
   * parameter is a <a href="#/p5.Color">p5.Color</a> object, it will be used as
   * the background color. If the parameter is a
   * <a href="#/p5.Image">p5.Image</a> object, it will be used as the background
   * image.
   *
   * The version of `background()` with two parameters interprets the first one
   * as a grayscale value. The second parameter sets the alpha (transparency)
   * value.
   *
   * The version of `background()` with three parameters interprets them as RGB,
   * HSB, or HSL colors, depending on the current
   * <a href="#/p5/colorMode">colorMode()</a>. By default, colors are specified
   * in RGB values. Calling `background(255, 204, 0)` sets the background a bright
   * yellow color.
   *
   * @method background
   * @param {p5.Color} color  any value created by the <a href="#/p5/color">color()</a> function
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // A grayscale value.
   *   background(51);
   *
   *   describe('A canvas with a dark charcoal gray background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // A grayscale value and an alpha value.
   *   background(51, 0.4);
   *   describe('A canvas with a transparent gray background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // R, G & B values.
   *   background(255, 204, 0);
   *
   *   describe('A canvas with a yellow background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Use HSB color.
   *   colorMode(HSB);
   *
   *   // H, S & B values.
   *   background(255, 204, 100);
   *
   *   describe('A canvas with a royal blue background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // A CSS named color.
   *   background('red');
   *
   *   describe('A canvas with a red background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Three-digit hex RGB notation.
   *   background('#fae');
   *
   *   describe('A canvas with a pink background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Six-digit hex RGB notation.
   *   background('#222222');
   *
   *   describe('A canvas with a black background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Integer RGB notation.
   *   background('rgb(0, 255, 0)');
   *
   *   describe('A canvas with a bright green background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Integer RGBA notation.
   *   background('rgba(0, 255, 0, 0.25)');
   *
   *   describe('A canvas with a transparent green background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Percentage RGB notation.
   *   background('rgb(100%, 0%, 10%)');
   *
   *   describe('A canvas with a red background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Percentage RGBA notation.
   *   background('rgba(100%, 0%, 100%, 0.5)');
   *
   *   describe('A canvas with a transparent purple background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // A p5.Color object.
   *   let c = color(0, 0, 255);
   *   background(c);
   *
   *   describe('A canvas with a blue background.');
   * }
   * </code>
   * </div>
   *
   */

  /**
   * @method background
   * @param {String} colorstring color string, possible formats include: integer
   *                         rgb() or rgba(), percentage rgb() or rgba(),
   *                         3-digit hex, 6-digit hex.
   * @param {Number} [a]         opacity of the background relative to current
   *                             color range (default is 0-255).
   * @chainable
   */

  /**
   * @method background
   * @param {Number} gray   specifies a value between white and black.
   * @param {Number} [a]
   * @chainable
   */

  /**
   * @method background
   * @param {Number} v1     red value if color mode is RGB, or hue value if color mode is HSB.
   * @param {Number} v2     green value if color mode is RGB, or saturation value if color mode is HSB.
   * @param {Number} v3     blue value if color mode is RGB, or brightness value if color mode is HSB.
   * @param  {Number} [a]
   * @chainable
   */

  /**
   * @method background
   * @param  {Number[]}      values  an array containing the red, green, blue
   *                                 and alpha components of the color.
   * @chainable
   */

  /**
   * @method background
   * @param {p5.Image} image     image created with <a href="#/p5/loadImage">loadImage()</a>
   *                             or <a href="#/p5/createImage">createImage()</a>,
   *                             to set as background.
   *                             (must be same size as the sketch window).
   * @param  {Number}  [a]
   * @chainable
   */
  fn.background = function(...args) {
    this._renderer.background(...args);
    return this;
  };

  /**
   * Clears the pixels on the canvas.
   *
   * `clear()` makes every pixel 100% transparent. Calling `clear()` doesn't
   * clear objects created by `createX()` functions such as
   * <a href="#/p5/createGraphics">createGraphics()</a>,
   * <a href="#/p5/createVideo">createVideo()</a>, and
   * <a href="#/p5/createImg">createImg()</a>. These objects will remain
   * unchanged after calling `clear()` and can be redrawn.
   *
   * In WebGL mode, this function can clear the screen to a specific color. It
   * interprets four numeric parameters as normalized RGBA color values. It also
   * clears the depth buffer. If you are not using the WebGL renderer, these
   * parameters will have no effect.
   *
   * @method clear
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   describe('A gray square. White circles are drawn as the user moves the mouse. The circles disappear when the user presses the mouse.');
   * }
   *
   * function draw() {
   *   circle(mouseX, mouseY, 20);
   * }
   *
   * function mousePressed() {
   *   clear();
   *   background(200);
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
   *   background(200);
   *
   *   pg = createGraphics(60, 60);
   *   pg.background(200);
   *   pg.noStroke();
   *   pg.circle(pg.width / 2, pg.height / 2, 15);
   *   image(pg, 20, 20);
   *
   *   describe('A white circle drawn on a gray square. The square gets smaller when the mouse is pressed.');
   * }
   *
   * function mousePressed() {
   *   clear();
   *   image(pg, 20, 20);
   * }
   * </code>
   * </div>
   *
   * @param {Number} [r] normalized red value.
   * @param {Number} [g] normalized green value.
   * @param {Number} [b] normalized blue value.
   * @param {Number} [a] normalized alpha value.
   */
  fn.clear = function(...args) {
    const _r = args[0] || 0;
    const _g = args[1] || 0;
    const _b = args[2] || 0;
    const _a = args[3] || 0;

    this._renderer.clear(_r, _g, _b, _a);
    return this;
  };

  /**
   * Changes the way color values are interpreted.
   *
   * By default, the `Number` parameters for <a href="#/p5/fill">fill()</a>,
   * <a href="#/p5/stroke">stroke()</a>,
   * <a href="#/p5/background">background()</a>, and
   * <a href="#/p5/color">color()</a> are defined by values between 0 and 255
   * using the RGB color model. This is equivalent to calling
   * `colorMode(RGB, 255)`. Pure red is `color(255, 0, 0)` in this model.
   *
   * Calling `colorMode(RGB, 100)` sets colors to use RGB color values
   * between 0 and 100. Pure red is `color(100, 0, 0)` in this model.
   *
   * Calling `colorMode(HSB)` or `colorMode(HSL)` changes to HSB or HSL systems instead of RGB.
   * Pure red is `color(0, 100, 100)` in HSB and `color(0, 100, 50)` in HSL.
   *
   * Some additional color modes that p5.js supports are:
   *
   * `RGBHDR` - High Dynamic Range RGB defined within the Display P3 color space.
   *          Colors are expressed with an extended dynamic range. To render these colors
   *          accurately, you must use the HDR canvas.
   *
   * `HWB`    - Hue, Whiteness, Blackness.
   *          Similar to HSB and HSL, this mode uses a hue angle.
   *          Instead of saturation and lightness, HWB defines colors based on the percentage
   *          of whiteness and blackness. This is the color model used by Chrome's GUI color picker.
   *          Pure red in HWB is represented as `color(0, 0, 0)` (i.e., hue 0 with 0% whiteness and 0% blackness).
   *    
   *          <img src="assets/hwb.png"></img>
   *
   * `LAB`    - Also known as CIE Lab, this color mode defines colors with Lightness, Alpha, and Beta.
   *          It is widely used in professional color measurement contexts due to its perceptual uniformity.
   *
   * `LCH`    - A more intuitive representation of the CIE Lab color space using Lightness, Chroma, and Hue.
   *          This mode separates the color's chromatic intensity (chroma) from its lightness,
   *          simplifying color selection and manipulation.
   *
   * `OKLAB`  - A variant of the CIE Lab color space that corrects for non-uniformities inherent in LAB.
   *          The adjustment provides a more perceptually accurate and uniform representation,
   *          which is particularly beneficial for smooth color transitions.
   *
   * `OKLCH`  - An easier-to-use representation of OKLAB, expressing colors in terms of Lightness, Chroma, and Hue.
   *          This mode retains the perceptual benefits of OKLAB while offering a more intuitive format for color manipulation.
   *
   * <a href="#/p5.Color">p5.Color</a> objects remember the mode that they were
   * created in. Changing modes doesn't affect their appearance.
   *
   *  `Single-value (Grayscale) Colors`:    
   *  When a color is specified with only one parameter (e.g., `color(g)`), p5.js will interpret it
   *  as a grayscale color. However, how that single parameter translates into a grayscale value
   *  depends on the color mode:
   *
   * - `RGB, HSB, and HSL`: In RGB, the single value is interpreted using the “blue” maximum 
   *   (i.e., the single parameter is mapped to the blue channel's max). 
   *   In HSB and HSL, the single value is mapped to Brightness and Lightness max respectively with hue=0 . 
   *   and saturation=0.
   *
   * - `LAB, LCH, OKLAB, and OKLCH`: The single value is taken to be the `lightness (L)` component,
   *   with the specified max range for that channel.
   *
   * - `HWB`: Grayscale relies on both the `whiteness (W)` and `blackness (B)` channels. Since
   *   a single value cannot directly account for two distinct channels, the library uses an
   *   average of their max values to interpret the single grayscale parameter. For instance,
   *   if W has a max of 50 and B has a max of 100, then the single grayscale parameter
   *   is mapped using (50 + 100) / 2 = 75 as its effective maximum. More complex or negative
   *   ranges are currently not handled, so results in those cases may be ambiguous.
   *
   * @method colorMode
   * @param {RGB|HSB|HSL|RGBHDR|HWB|LAB|LCH|OKLAB|OKLCH} mode   either RGB, HSB, HSL,
   *          or one of the extended modes described above.
   * @param {Number}  [max]  range for all values.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Fill with pure red.
   *   fill(255, 0, 0);
   *
   *   circle(50, 50, 25);
   *
   *   describe('A gray square with a red circle at its center.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Use RGB color with values in the range 0-100.
   *   colorMode(RGB, 100);
   *
   *   // Fill with pure red.
   *   fill(100, 0, 0);
   *
   *   circle(50, 50, 25);
   *
   *   describe('A gray square with a red circle at its center.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Use HSB color.
   *   colorMode(HSB);
   *
   *   // Fill with pure red.
   *   fill(0, 100, 100);
   *
   *   circle(50, 50, 25);
   *
   *   describe('A gray square with a red circle at its center.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Use HSL color.
   *   colorMode(HSL);
   *
   *   // Fill with pure red.
   *   fill(0, 100, 50);
   *
   *   circle(50, 50, 25);
   *
   *   describe('A gray square with a red circle at its center.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *   
   *   // Draw a neutral gray background using the default color mode.
   *   background(200); 
   *   
   *   // Switch to HWB color mode.
   *   // (Assuming p5.js supports HWB with a range of:
   *   // hue: 0–360, whiteness: 0–100, blackness: 0–100.)
   *   colorMode(HWB);
   *   
   *   // Set fill to pure red in HWB.
   *   // Pure red in HWB is: hue = 0°, whiteness = 0%, blackness = 0%.
   *   fill(0, 0, 0);
   *   
   *   // Draw a circle at the center.
   *   circle(50, 50, 25);
   *   
   *   describe('A gray square with a red circle at its center, drawn using HWB color mode.');
   * }
   * </code>
   * </div>
   * 
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *   
   *   // Draw a neutral gray background using the default color mode.
   *   background(200);
   *   
   *   // Switch to LAB color mode.
   *   // In this mode, L typically ranges from 0 to 100 while a and b span roughly -128 to 127.
   *   colorMode(LAB);
   *   
   *   // Set fill to pure red in LAB.
   *   // The sRGB red (255, 0, 0) converts approximately to LAB as:
   *   // L = 53, a = 80, b = 67.
   *   fill(53, 80, 67);
   *   
   *   // Draw a circle at the center.
   *   circle(50, 50, 25);
   *   
   *   describe('A gray square with a red circle at its center, drawn using LAB color mode.');
   * }
   * </code>
   * </div>
   * 
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *   
   *   // Draw a neutral gray background.
   *   background(200);
   *   
   *   // Switch to LCH color mode.
   *   // In LCH, colors are defined by Lightness, Chroma, and Hue (in degrees).
   *   colorMode(LCH);
   *   
   *   // Set fill to an approximation of pure red in LCH:
   *   // Lightness ≈ 53, Chroma ≈ 104, Hue ≈ 40°.
   *   fill(53, 104, 40);
   *   
   *   // Draw a circle at the center.
   *   circle(50, 50, 25);
   *   
   *   describe('A gray square with a red circle at its center, drawn using LCH color mode.');
   * }
   * </code>  
   * </div>
   * 
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Use RGB color with values in the range 0-100.
   *   colorMode(RGB, 100);
   *
   *   for (let x = 0; x < 100; x += 1) {
   *     for (let y = 0; y < 100; y += 1) {
   *       stroke(x, y, 0);
   *       point(x, y);
   *     }
   *   }
   *
   *   describe(
   *     'A diagonal green to red gradient from bottom-left to top-right with shading transitioning to black at top-left corner.'
   *   );
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Use HSB color with values in the range 0-100.
   *   colorMode(HSB, 100);
   *
   *   for (let x = 0; x < 100; x += 1) {
   *     for (let y = 0; y < 100; y += 1) {
   *       stroke(x, y, 100);
   *       point(x, y);
   *     }
   *   }
   *
   *   describe('A rainbow gradient from left-to-right. Brightness transitions to white at the top.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a p5.Color object.
   *   let myColor = color(180, 175, 230);
   *   background(myColor);
   *
   *   // Use RGB color with values in the range 0-1.
   *   colorMode(RGB, 1);
   *
   *   // Get the red, green, and blue color components.
   *   let redValue = red(myColor);
   *   let greenValue = green(myColor);
   *   let blueValue = blue(myColor);
   *
   *   // Round the color components for display.
   *   redValue = round(redValue, 2);
   *   greenValue = round(greenValue, 2);
   *   blueValue = round(blueValue, 2);
   *
   *   // Display the color components.
   *   text(`Red: ${redValue}`, 10, 10, 80, 80);
   *   text(`Green: ${greenValue}`, 10, 40, 80, 80);
   *   text(`Blue: ${blueValue}`, 10, 70, 80, 80);
   *
   *   describe('A purple canvas with the red, green, and blue decimal values of the color written on it.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(255);
   *
   *   // Use RGB color with alpha values in the range 0-1.
   *   colorMode(RGB, 255, 255, 255, 1);
   *
   *   noFill();
   *   strokeWeight(4);
   *   stroke(255, 0, 10, 0.3);
   *   circle(40, 40, 50);
   *   circle(50, 60, 50);
   *
   *   describe('Two overlapping translucent pink circle outlines.');
   * }
   * </code>
   * </div>
   * 
   * @example
   * <div>
   * <code>
   * let hslGraphic, lchGraphic, oklchGraphic;
   *
   * function setup() {
   *   createCanvas(600, 200);
   *   noLoop();
   *
   *   // Create three graphics objects for HSL, LCH, and OKLCH color modes
   *   hslGraphic = createGraphics(200, 200);
   *   lchGraphic = createGraphics(200, 200);
   *   oklchGraphic = createGraphics(200, 200);
   *
   *   // Draw HSL color wheel
   *   colorMode(HSL);
   *   hslGraphic.translate(100, 100);
   *   for (let i = 0; i < 1000; i++) {
   *     hslGraphic.stroke(360 / 1000 * i, 70, 50);
   *     hslGraphic.line(0, 0, hslGraphic.width / 2, 0);
   *     hslGraphic.rotate(TAU / 1000);
   *   }
   *
   *   // Draw LCH color wheel
   *   colorMode(LCH);
   *   lchGraphic.translate(100, 100);
   *   for (let i = 0; i < 1000; i++) {
   *     lchGraphic.stroke(54, 106, 360 / 1000 * i);
   *     lchGraphic.line(0, 0, lchGraphic.width / 2, 0);
   *     lchGraphic.rotate(TAU / 1000);
   *   }
   *
   *   // Draw OKLCH color wheel
   *   colorMode(OKLCH);
   *   oklchGraphic.translate(100, 100);
   *   for (let i = 0; i < 1000; i++) {
   *     oklchGraphic.stroke(54, 106, 360 / 1000 * i);
   *     oklchGraphic.line(0, 0, oklchGraphic.width / 2, 0);
   *     oklchGraphic.rotate(TAU / 1000);
   *   }
   * }
   *
   * function draw() {
   *   // Set the styles
   *   colorMode(RGB);
   *   background(220);
   *
   *   // Display the color wheels
   *   image(hslGraphic, 0, 0);
   *   image(lchGraphic, 200, 0);
   *   image(oklchGraphic, 400, 0);
   * }
   * </code>
   * </div>
   * 
   * @example
   * <div>
   * <code>
   * // Example: Single-value (Grayscale) colors in different color modes.
   * // The rectangle is filled with one parameter, but its final color depends
   * // on how that parameter is interpreted by the current color mode.
   *
   * function setup() {
   *   createCanvas(100, 100);
   *   noStroke();
   *   noLoop();
   * }
   *
   * function draw() {
   *   // Set color mode to RGB with range 0-255
   *   colorMode(RGB, 255);
   *   
   *   // Fill with single grayscale value
   *   fill(128);
   *   rect(0, 0, 100, 100);
   *
   *   // Add text label
   *   fill(0); // Switch to black text for clarity
   *   textSize(14);
   *   text("RGB (128)", 10, 20);
   * }
   * </code>
   * </div>
   */

  /**
   * @method colorMode
   * @param {RGB|HSB|HSL|RGBHDR|HWB|LAB|LCH|OKLAB|OKLCH} mode
   * @param {Number} max1     range for the red or hue depending on the
   *                              current color mode.
   * @param {Number} max2     range for the green or saturation depending
   *                              on the current color mode.
   * @param {Number} max3     range for the blue or brightness/lightness
   *                              depending on the current color mode.
   * @param {Number} [maxA]   range for the alpha.
   *
   * @return {String}      The current color mode.
   */
  fn.colorMode = function(mode, max1, max2, max3, maxA) {
    // p5._validateParameters('colorMode', arguments);
    if (
      [
        RGB,
        RGBHDR,
        HSB,
        HSL,
        HWB,
        LAB,
        LCH,
        OKLAB,
        OKLCH
      ].includes(mode)
    ) {
      // Set color mode.
      this._renderer.states.setValue('colorMode', mode);

      // Set color maxes.
      this._renderer.states.setValue('colorMaxes', this._renderer.states.colorMaxes.clone());
      const maxes = this._renderer.states.colorMaxes[mode];
      if (arguments.length === 2) {
        maxes[0] = max1; // Red
        maxes[1] = max1; // Green
        maxes[2] = max1; // Blue
        maxes[3] = max1; // Alpha
      } else if (arguments.length === 4) {
        maxes[0] = max1; // Red
        maxes[1] = max2; // Green
        maxes[2] = max3; // Blue
      } else if (arguments.length === 5) {
        maxes[0] = max1; // Red
        maxes[1] = max2; // Green
        maxes[2] = max3; // Blue
        maxes[3] = maxA; // Alpha
      }
    }

    return this._renderer.states.colorMode;
  };

  /**
   * Sets the color used to fill shapes.
   *
   * Calling `fill(255, 165, 0)` or `fill('orange')` means all shapes drawn
   * after the fill command will be filled with the color orange.
   *
   * The version of `fill()` with one parameter interprets the value one of
   * three ways. If the parameter is a `Number`, it's interpreted as a grayscale
   * value. If the parameter is a `String`, it's interpreted as a CSS color
   * string. A <a href="#/p5.Color">p5.Color</a> object can also be provided to
   * set the fill color.
   *
   * The version of `fill()` with three parameters interprets them as RGB, HSB,
   * or HSL colors, depending on the current
   * <a href="#/p5/colorMode">colorMode()</a>. The default color space is RGB,
   * with each value in the range from 0 to 255.
   *
   * @method fill
   * @param  {Number}        v1      red value if color mode is RGB or hue value if color mode is HSB.
   * @param  {Number}        v2      green value if color mode is RGB or saturation value if color mode is HSB.
   * @param  {Number}        v3      blue value if color mode is RGB or brightness value if color mode is HSB.
   * @param  {Number}        [alpha] alpha value, controls transparency (0 - transparent, 255 - opaque).
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // A grayscale value.
   *   fill(51);
   *   square(20, 20, 60);
   *
   *   describe('A dark charcoal gray square with a black outline.');
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
   *   // R, G & B values.
   *   fill(255, 204, 0);
   *   square(20, 20, 60);
   *
   *   describe('A yellow square with a black outline.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(100);
   *
   *   // Use HSB color.
   *   colorMode(HSB);
   *
   *   // H, S & B values.
   *   fill(255, 204, 100);
   *   square(20, 20, 60);
   *
   *   describe('A royal blue square with a black outline.');
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
   *   // A CSS named color.
   *   fill('red');
   *   square(20, 20, 60);
   *
   *   describe('A red square with a black outline.');
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
   *   // Three-digit hex RGB notation.
   *   fill('#fae');
   *   square(20, 20, 60);
   *
   *   describe('A pink square with a black outline.');
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
   *   // Six-digit hex RGB notation.
   *   fill('#A251FA');
   *   square(20, 20, 60);
   *
   *   describe('A purple square with a black outline.');
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
   *   // Integer RGB notation.
   *   fill('rgb(0, 255, 0)');
   *   square(20, 20, 60);
   *
   *   describe('A bright green square with a black outline.');
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
   *   // Integer RGBA notation.
   *   fill('rgba(0, 255, 0, 0.25)');
   *   square(20, 20, 60);
   *
   *   describe('A soft green rectange with a black outline.');
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
   *   // Percentage RGB notation.
   *   fill('rgb(100%, 0%, 10%)');
   *   square(20, 20, 60);
   *
   *   describe('A red square with a black outline.');
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
   *   // Percentage RGBA notation.
   *   fill('rgba(100%, 0%, 100%, 0.5)');
   *   square(20, 20, 60);
   *
   *   describe('A dark fuchsia square with a black outline.');
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
   *   // A p5.Color object.
   *   let c = color(0, 0, 255);
   *   fill(c);
   *   square(20, 20, 60);
   *
   *   describe('A blue square with a black outline.');
   * }
   * </code>
   * </div>
   */

  /**
   * @method fill
   * @param  {String}        value   a color string.
   * @chainable
   */

  /**
   * @method fill
   * @param  {Number}        gray   a grayscale value.
   * @param  {Number}        [alpha]
   * @chainable
   */

  /**
   * @method fill
   * @param  {Number[]}      values  an array containing the red, green, blue &
   *                                 and alpha components of the color.
   * @chainable
   */

  /**
   * @method fill
   * @param  {p5.Color}      color   the fill color.
   * @chainable
   */
  fn.fill = function(...args) {
    this._renderer.fill(...args);
    return this;
  };

  /**
   * Disables setting the fill color for shapes.
   *
   * Calling `noFill()` is the same as making the fill completely transparent,
   * as in `fill(0, 0)`. If both <a href="#/p5/noStroke">noStroke()</a> and
   * `noFill()` are called, nothing will be drawn to the screen.
   *
   * @method noFill
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Draw the top square.
   *   square(32, 10, 35);
   *
   *   // Draw the bottom square.
   *   noFill();
   *   square(32, 55, 35);
   *
   *   describe('A white square on above an empty square. Both squares have black outlines.');
   * }
   * </code>
   * </div>
   *
   * <div modernizr='webgl'>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A purple cube wireframe spinning on a black canvas.');
   * }
   *
   * function draw() {
   *   background(0);
   *
   *   // Style the box.
   *   noFill();
   *   stroke(100, 100, 240);
   *
   *   // Rotate the coordinates.
   *   rotateX(frameCount * 0.01);
   *   rotateY(frameCount * 0.01);
   *
   *   // Draw the box.
   *   box(45);
   * }
   * </code>
   * </div>
   */
  fn.noFill = function() {
    this._renderer.noFill();
    return this;
  };

  /**
   * Disables drawing points, lines, and the outlines of shapes.
   *
   * Calling `noStroke()` is the same as making the stroke completely transparent,
   * as in `stroke(0, 0)`. If both `noStroke()` and
   * <a href="#/p5/noFill">noFill()</a> are called, nothing will be drawn to the
   * screen.
   *
   * @method noStroke
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   noStroke();
   *   square(20, 20, 60);
   *
   *   describe('A white square with no outline.');
   * }
   * </code>
   * </div>
   *
   * <div modernizr='webgl'>
   * <code>
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *
   *   describe('A pink cube with no edge outlines spinning on a black canvas.');
   * }
   *
   * function draw() {
   *   background(0);
   *
   *   // Style the box.
   *   noStroke();
   *   fill(240, 150, 150);
   *
   *   // Rotate the coordinates.
   *   rotateX(frameCount * 0.01);
   *   rotateY(frameCount * 0.01);
   *
   *   // Draw the box.
   *   box(45);
   * }
   * </code>
   * </div>
   */
  fn.noStroke = function() {
    this._renderer.states.setValue('strokeColor', null);
    return this;
  };

  /**
   * Sets the color used to draw points, lines, and the outlines of shapes.
   *
   * Calling `stroke(255, 165, 0)` or `stroke('orange')` means all shapes drawn
   * after calling `stroke()` will be filled with the color orange. The way
   * these parameters are interpreted may be changed with the
   * <a href="#/p5/colorMode">colorMode()</a> function.
   *
   * The version of `stroke()` with one parameter interprets the value one of
   * three ways. If the parameter is a `Number`, it's interpreted as a grayscale
   * value. If the parameter is a `String`, it's interpreted as a CSS color
   * string. A <a href="#/p5.Color">p5.Color</a> object can also be provided to
   * set the stroke color.
   *
   * The version of `stroke()` with two parameters interprets the first one as a
   * grayscale value. The second parameter sets the alpha (transparency) value.
   *
   * The version of `stroke()` with three parameters interprets them as RGB, HSB,
   * or HSL colors, depending on the current `colorMode()`.
   *
   * The version of `stroke()` with four parameters interprets them as RGBA, HSBA,
   * or HSLA colors, depending on the current `colorMode()`. The last parameter
   * sets the alpha (transparency) value.
   *
   * @method stroke
   * @param  {Number}        v1      red value if color mode is RGB or hue value if color mode is HSB.
   * @param  {Number}        v2      green value if color mode is RGB or saturation value if color mode is HSB.
   * @param  {Number}        v3      blue value if color mode is RGB or brightness value if color mode is HSB.
   * @param  {Number}        [alpha] alpha value, controls transparency (0 - transparent, 255 - opaque).
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // A grayscale value.
   *   strokeWeight(4);
   *   stroke(51);
   *   square(20, 20, 60);
   *
   *   describe('A white square with a dark charcoal gray outline.');
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
   *   // R, G & B values.
   *   stroke(255, 204, 0);
   *   strokeWeight(4);
   *   square(20, 20, 60);
   *
   *   describe('A white square with a yellow outline.');
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
   *   // Use HSB color.
   *   colorMode(HSB);
   *
   *   // H, S & B values.
   *   strokeWeight(4);
   *   stroke(255, 204, 100);
   *   square(20, 20, 60);
   *
   *   describe('A white square with a royal blue outline.');
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
   *   // A CSS named color.
   *   stroke('red');
   *   strokeWeight(4);
   *   square(20, 20, 60);
   *
   *   describe('A white square with a red outline.');
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
   *   // Three-digit hex RGB notation.
   *   stroke('#fae');
   *   strokeWeight(4);
   *   square(20, 20, 60);
   *
   *   describe('A white square with a pink outline.');
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
   *   // Six-digit hex RGB notation.
   *   stroke('#222222');
   *   strokeWeight(4);
   *   square(20, 20, 60);
   *
   *   describe('A white square with a black outline.');
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
   *   // Integer RGB notation.
   *   stroke('rgb(0, 255, 0)');
   *   strokeWeight(4);
   *   square(20, 20, 60);
   *
   *   describe('A white square with a bright green outline.');
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
   *   // Integer RGBA notation.
   *   stroke('rgba(0, 255, 0, 0.25)');
   *   strokeWeight(4);
   *   square(20, 20, 60);
   *
   *   describe('A white square with a soft green outline.');
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
   *   // Percentage RGB notation.
   *   stroke('rgb(100%, 0%, 10%)');
   *   strokeWeight(4);
   *   square(20, 20, 60);
   *
   *   describe('A white square with a red outline.');
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
   *   // Percentage RGBA notation.
   *   stroke('rgba(100%, 0%, 100%, 0.5)');
   *   strokeWeight(4);
   *   square(20, 20, 60);
   *
   *   describe('A white square with a dark fuchsia outline.');
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
   *   // A p5.Color object.
   *   stroke(color(0, 0, 255));
   *   strokeWeight(4);
   *   square(20, 20, 60);
   *
   *   describe('A white square with a blue outline.');
   * }
   * </code>
   * </div>
   */

  /**
   * @method stroke
   * @param  {String}        value   a color string.
   * @chainable
   */

  /**
   * @method stroke
   * @param  {Number}        gray   a grayscale value.
   * @param  {Number}        [alpha]
   * @chainable
   */

  /**
   * @method stroke
   * @param  {Number[]}      values  an array containing the red, green, blue,
   *                                 and alpha components of the color.
   * @chainable
   */

  /**
   * @method stroke
   * @param  {p5.Color}      color   the stroke color.
   * @chainable
   */
  fn.stroke = function(...args) {
    this._renderer.stroke(...args);
    return this;
  };

  /**
   * Starts using shapes to erase parts of the canvas.
   *
   * All drawing that follows `erase()` will subtract from the canvas, revealing
   * the web page underneath. The erased areas will become transparent, allowing
   * the content behind the canvas to show through. The
   * <a href="#/p5/fill">fill()</a>, <a href="#/p5/stroke">stroke()</a>, and
   * <a href="#/p5/blendMode">blendMode()</a> have no effect once `erase()` is
   * called.
   *
   * The `erase()` function has two optional parameters. The first parameter
   * sets the strength of erasing by the shape's interior. A value of 0 means
   * that no erasing will occur. A value of 255 means that the shape's interior
   * will fully erase the content underneath. The default value is 255
   * (full strength).
   *
   * The second parameter sets the strength of erasing by the shape's edge. A
   * value of 0 means that no erasing will occur. A value of 255 means that the
   * shape's edge will fully erase the content underneath. The default value is
   * 255 (full strength).
   *
   * To cancel the erasing effect, use the <a href="#/p5/noErase">noErase()</a>
   * function.
   *
   * `erase()` has no effect on drawing done with the
   * <a href="#/p5/image">image()</a> and
   * <a href="#/p5/background">background()</a> functions.
   *
   * @method erase
   * @param  {Number}   [strengthFill]      a number (0-255) for the strength of erasing under a shape's interior.
   *                                        Defaults to 255, which is full strength.
   * @param  {Number}   [strengthStroke]    a number (0-255) for the strength of erasing under a shape's edge.
   *                                        Defaults to 255, which is full strength.
   *
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(100, 100, 250);
   *
   *   // Draw a pink square.
   *   fill(250, 100, 100);
   *   square(20, 20, 60);
   *
   *   // Erase a circular area.
   *   erase();
   *   circle(25, 30, 30);
   *   noErase();
   *
   *   describe('A purple canvas with a pink square in the middle. A circle is erased from the top-left, leaving a hole.');
   * }
   * </code>
   * </div>
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(100, 100, 250);
   *
   *   // Draw a pink square.
   *   fill(250, 100, 100);
   *   square(20, 20, 60);
   *
   *   // Erase a circular area.
   *   strokeWeight(5);
   *   erase(150, 255);
   *   circle(25, 30, 30);
   *   noErase();
   *
   *   describe('A purple canvas with a pink square in the middle. A circle at the top-left partially erases its interior and a fully erases its outline.');
   * }
   * </code>
   * </div>
   */
  fn.erase = function(opacityFill = 255, opacityStroke = 255) {
    this._renderer.erase(opacityFill, opacityStroke);

    return this;
  };

  /**
   * Ends erasing that was started with <a href="#/p5/erase">erase()</a>.
   *
   * The <a href="#/p5/fill">fill()</a>, <a href="#/p5/stroke">stroke()</a>, and
   * <a href="#/p5/blendMode">blendMode()</a> settings will return to what they
   * were prior to calling <a href="#/p5/erase">erase()</a>.
   *
   * @method noErase
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(235, 145, 15);
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(30, 45, 220);
   *   rect(30, 10, 10, 80);
   *
   *   // Erase a circle.
   *   erase();
   *   circle(50, 50, 60);
   *   noErase();
   *
   *   // Draw the right rectangle.
   *   rect(70, 10, 10, 80);
   *
   *   describe('An orange canvas with two tall blue rectangles. A circular hole in the center erases the rectangle on the left but not the one on the right.');
   * }
   * </code>
   * </div>
   */
  fn.noErase = function() {
    this._renderer.noErase();
    return this;
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
   * @param  {(BLEND|DARKEST|LIGHTEST|DIFFERENCE|MULTIPLY|EXCLUSION|SCREEN|REPLACE|OVERLAY|HARD_LIGHT|SOFT_LIGHT|DODGE|BURN|ADD|REMOVE|SUBTRACT)} mode blend mode to set.
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
   *   background(200);
   *
   *   // Use the default blend mode.
   *   blendMode(BLEND);
   *
   *   // Style the lines.
   *   strokeWeight(30);
   *
   *   // Draw the blue line.
   *   stroke('blue');
   *   line(25, 25, 75, 75);
   *
   *   // Draw the red line.
   *   stroke('red');
   *   line(75, 25, 25, 75);
   *
   *   describe('A blue line and a red line form an X on a gray background.');
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
   *   // Set the blend mode.
   *   blendMode(ADD);
   *
   *   // Style the lines.
   *   strokeWeight(30);
   *
   *   // Draw the blue line.
   *   stroke('blue');
   *   line(25, 25, 75, 75);
   *
   *   // Draw the red line.
   *   stroke('red');
   *   line(75, 25, 25, 75);
   *
   *   describe('A faint blue line and a faint red line form an X on a gray background. The area where they overlap is faint magenta.');
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
   *   // Set the blend mode.
   *   blendMode(DARKEST);
   *
   *   // Style the lines.
   *   strokeWeight(30);
   *
   *   // Draw the blue line.
   *   stroke('blue');
   *   line(25, 25, 75, 75);
   *
   *   // Draw the red line.
   *   stroke('red');
   *   line(75, 25, 25, 75);
   *
   *   describe('A blue line and a red line form an X on a gray background. The area where they overlap is black.');
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
   *   // Set the blend mode.
   *   blendMode(LIGHTEST);
   *
   *   // Style the lines.
   *   strokeWeight(30);
   *
   *   // Draw the blue line.
   *   stroke('blue');
   *   line(25, 25, 75, 75);
   *
   *   // Draw the red line.
   *   stroke('red');
   *   line(75, 25, 25, 75);
   *
   *   describe('A faint blue line and a faint red line form an X on a gray background. The area where they overlap is faint magenta.');
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
   *   // Set the blend mode.
   *   blendMode(EXCLUSION);
   *
   *   // Style the lines.
   *   strokeWeight(30);
   *
   *   // Draw the blue line.
   *   stroke('blue');
   *   line(25, 25, 75, 75);
   *
   *   // Draw the red line.
   *   stroke('red');
   *   line(75, 25, 25, 75);
   *
   *   describe('A yellow line and a cyan line form an X on a gray background. The area where they overlap is green.');
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
   *   // Set the blend mode.
   *   blendMode(MULTIPLY);
   *
   *   // Style the lines.
   *   strokeWeight(30);
   *
   *   // Draw the blue line.
   *   stroke('blue');
   *   line(25, 25, 75, 75);
   *
   *   // Draw the red line.
   *   stroke('red');
   *   line(75, 25, 25, 75);
   *
   *   describe('A blue line and a red line form an X on a gray background. The area where they overlap is black.');
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
   *   // Set the blend mode.
   *   blendMode(SCREEN);
   *
   *   // Style the lines.
   *   strokeWeight(30);
   *
   *   // Draw the blue line.
   *   stroke('blue');
   *   line(25, 25, 75, 75);
   *
   *   // Draw the red line.
   *   stroke('red');
   *   line(75, 25, 25, 75);
   *
   *   describe('A faint blue line and a faint red line form an X on a gray background. The area where they overlap is faint magenta.');
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
   *   // Set the blend mode.
   *   blendMode(REPLACE);
   *
   *   // Style the lines.
   *   strokeWeight(30);
   *
   *   // Draw the blue line.
   *   stroke('blue');
   *   line(25, 25, 75, 75);
   *
   *   // Draw the red line.
   *   stroke('red');
   *   line(75, 25, 25, 75);
   *
   *   describe('A diagonal red line.');
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
   *   // Set the blend mode.
   *   blendMode(REMOVE);
   *
   *   // Style the lines.
   *   strokeWeight(30);
   *
   *   // Draw the blue line.
   *   stroke('blue');
   *   line(25, 25, 75, 75);
   *
   *   // Draw the red line.
   *   stroke('red');
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
   *   background(200);
   *
   *   // Set the blend mode.
   *   blendMode(DIFFERENCE);
   *
   *   // Style the lines.
   *   strokeWeight(30);
   *
   *   // Draw the blue line.
   *   stroke('blue');
   *   line(25, 25, 75, 75);
   *
   *   // Draw the red line.
   *   stroke('red');
   *   line(75, 25, 25, 75);
   *
   *   describe('A yellow line and a cyan line form an X on a gray background. The area where they overlap is green.');
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
   *   // Set the blend mode.
   *   blendMode(OVERLAY);
   *
   *   // Style the lines.
   *   strokeWeight(30);
   *
   *   // Draw the blue line.
   *   stroke('blue');
   *   line(25, 25, 75, 75);
   *
   *   // Draw the red line.
   *   stroke('red');
   *   line(75, 25, 25, 75);
   *
   *   describe('A faint blue line and a faint red line form an X on a gray background. The area where they overlap is bright magenta.');
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
   *   // Set the blend mode.
   *   blendMode(HARD_LIGHT);
   *
   *   // Style the lines.
   *   strokeWeight(30);
   *
   *   // Draw the blue line.
   *   stroke('blue');
   *   line(25, 25, 75, 75);
   *
   *   // Draw the red line.
   *   stroke('red');
   *   line(75, 25, 25, 75);
   *
   *   describe('A blue line and a red line form an X on a gray background.');
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
   *   // Set the blend mode.
   *   blendMode(SOFT_LIGHT);
   *
   *   // Style the lines.
   *   strokeWeight(30);
   *
   *   // Draw the blue line.
   *   stroke('blue');
   *   line(25, 25, 75, 75);
   *
   *   // Draw the red line.
   *   stroke('red');
   *   line(75, 25, 25, 75);
   *
   *   describe('A faint blue line and a faint red line form an X on a gray background. The area where they overlap is violet.');
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
   *   // Set the blend mode.
   *   blendMode(DODGE);
   *
   *   // Style the lines.
   *   strokeWeight(30);
   *
   *   // Draw the blue line.
   *   stroke('blue');
   *   line(25, 25, 75, 75);
   *
   *   // Draw the red line.
   *   stroke('red');
   *   line(75, 25, 25, 75);
   *
   *   describe('A faint blue line and a faint red line form an X on a gray background. The area where they overlap is faint violet.');
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
   *   // Set the blend mode.
   *   blendMode(BURN);
   *
   *   // Style the lines.
   *   strokeWeight(30);
   *
   *   // Draw the blue line.
   *   stroke('blue');
   *   line(25, 25, 75, 75);
   *
   *   // Draw the red line.
   *   stroke('red');
   *   line(75, 25, 25, 75);
   *
   *   describe('A blue line and a red line form an X on a gray background. The area where they overlap is black.');
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
   *   // Set the blend mode.
   *   blendMode(SUBTRACT);
   *
   *   // Style the lines.
   *   strokeWeight(30);
   *
   *   // Draw the blue line.
   *   stroke('blue');
   *   line(25, 25, 75, 75);
   *
   *   // Draw the red line.
   *   stroke('red');
   *   line(75, 25, 25, 75);
   *
   *   describe('A yellow line and a turquoise line form an X on a gray background. The area where they overlap is green.');
   * }
   * </code>
   * </div>
   */
  fn.blendMode = function (mode) {
    // p5._validateParameters('blendMode', arguments);
    if (mode === constants.NORMAL) {
      // Warning added 3/26/19, can be deleted in future (1.0 release?)
      console.warn(
        'NORMAL has been deprecated for use in blendMode. defaulting to BLEND instead.'
      );
      mode = constants.BLEND;
    }
    this._renderer.blendMode(mode);
  };
}

export default setting;

if(typeof p5 !== 'undefined'){
  setting(p5, p5.prototype);
}
