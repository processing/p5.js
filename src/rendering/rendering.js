/**
 * @module Rendering
 * @submodule Rendering
 * @for p5
 */
define(function(require) {

  var p5 = require('core');
  var constants = require('constants');


  /**
   * Creates a canvas element in the document, and sets the dimensions of it
   * in pixels. This method should be called only once at the start of setup.
   * Calling createCanvas more than once in a sketch will result in very
   * unpredicable behavior. If you want more more than one drawing canvas
   * you could use createGraphics (hidden by default but it can be shown).<br>
   * The system variables width and height are set by the parameters passed
   * to this function. If createCanvas() is not used, the window will be
   * given a default size of 100x100 pixels.
   *
   * @method createCanvas
   * @param  {Number} w width of the canvas
   * @param  {Number} h height of the canvas
   * @return {Object} canvas generated
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
   */
  p5.prototype.createCanvas = function(w, h, isDefault) {
    var c;
    if (isDefault) {
      c = document.createElement('canvas');
      c.id = 'defaultCanvas';
    } else { // resize the default canvas if new one is created
      c = this.canvas;
    }

    // set to invisible if still in setup (to prevent flashing with manipulate)
    if (!this._setupDone) {
      c.className += ' p5_hidden'; // tag to show later
      c.style.visibility='hidden';
    }

    if (this._userNode) { // user input node case
      this._userNode.appendChild(c);
    } else {
      document.body.appendChild(c);
    }

    if (!this._defaultGraphics) {
      this._defaultGraphics = new p5.Graphics(c, this, true);
      this._elements.push(this._defaultGraphics);
    }
    
    this._defaultGraphics.resize(w, h);
    this._defaultGraphics._applyDefaults();
    return this._defaultGraphics;
  };

  /**
   * Resizes the canvas to given width and height. Note that the
   * canvas will be cleared so anything drawn previously in setup
   * or draw will disappear on resize. Setup will not be called
   * again.
   * @method resizeCanvas
   * @example
   * <div class="norender"><code>
   * function setup() {
   *   createCanvas(windowWidth, windowHeight);
   * }
   *
   * function draw() {
   *  background(0, 100, 200);
   * }
   *
   * function windowResized() {
   *   resizeCanvas(windowWidth, windowHeight);
   * }
   * </code></div>
   */
  p5.prototype.resizeCanvas = function (w, h, noRedraw) {
    if (this._defaultGraphics) {
      this._defaultGraphics.resize(w, h);
      this._defaultGraphics._applyDefaults();
      if (!noRedraw) {
        this.redraw();
      }
    }
  };


  /**
   * Removes the default canvas for a p5 sketch that doesn't
   * require a canvas
   * @method noCanvas
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
   * Creates and returns a new p5.Graphics object. Use this class if you need
   * to draw into an off-screen graphics buffer. The two parameters define the
   * width and height in pixels.
   *
   * @method createGraphics
   * @param  {Number} w width of the offscreen graphics buffer
   * @param  {Number} h height of the offscreen graphics buffer
   * @return {Object} offscreen graphics buffer
   * @example
   * <div>
   * <code>
   * var pg;
   * function setup() {
   *   createCanvas(100, 100);
   *   pg = createGraphics(100, 100);
   * }
   * function draw() {
   *   background(200);
   *   pg.background(100);
   *   pg.noStroke();
   *   pg.ellipse(pg.width/2, pg.height/2, 50, 50);
   *   image(pg, 50, 50);
   *   image(pg, 0, 0, 50, 50);
   * }
   * </code>
   * </div>
   */
  p5.prototype.createGraphics = function(w, h) {
    var c = document.createElement('canvas');
    //c.style.visibility='hidden';
    var node = this._userNode || document.body;
    node.appendChild(c);

    var pg = new p5.Graphics(c, this, false);
    // store in elements array
    this._elements.push(pg);

    for (var p in p5.prototype) {
      if (!pg.hasOwnProperty(p)) {
        if (typeof p5.prototype[p] === 'function') {
          pg[p] = p5.prototype[p].bind(pg);
        } else {
          pg[p] = p5.prototype[p];
        }
      }
    }
    pg.resize(w, h);
    pg._applyDefaults();
    return pg;
  };

  /**
   * Blends the pixels in the display window according to the defined mode.
   * There is a choice of the following modes to blend the source pixels (A)
   * with the ones of pixels already in the display window (B):
   * <ul>
   * <li><code>BLEND</code> - linear interpolation of colours: C =
   * A*factor + B. This is the default blending mode.</li>
   * <li><code>ADD</code> - sum of A and B</li>
   * <li><code>DARKEST</code> - only the darkest colour succeeds: C =
   * min(A*factor, B).</li>
   * <li><code>LIGHTEST</code> - only the lightest colour succeeds: C =
   * max(A*factor, B).</li>
   * <li><code>DIFFERENCE</code> - subtract colors from underlying image.</li>
   * <li><code>EXCLUSION</code> - similar to <code>DIFFERENCE</code>, but less
   * extreme.</li>
   * <li><code>MULTIPLY</code> - multiply the colors, result will always be
   * darker.</li>
   * <li><code>SCREEN</code> - opposite multiply, uses inverse values of the
   * colors.</li>
   * <li><code>REPLACE</code> - the pixels entirely replace the others and
   * don't utilize alpha (transparency) values.</li>
   * <li><code>OVERLAY</code> - mix of <code>MULTIPLY</code> and <code>SCREEN
   * </code>. Multiplies dark values, and screens light values.</li>
   * <li><code>HARD_LIGHT</code> - <code>SCREEN</code> when greater than 50%
   * gray, <code>MULTIPLY</code> when lower.</li>
   * <li><code>SOFT_LIGHT</code> - mix of <code>DARKEST</code> and
   * <code>LIGHTEST</code>. Works like <code>OVERLAY</code>, but not as harsh.
   * </li>
   * <li><code>DODGE</code> - lightens light tones and increases contrast,
   * ignores darks.</li>
   * <li><code>BURN</code> - darker areas are applied, increasing contrast,
   * ignores lights.</li>
   * </ul>
   *
   * @method blendMode
   * @param  {String/Constant} mode blend mode to set for canvas
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
   */
  p5.prototype.blendMode = function(mode) {
    if (mode === constants.BLEND || mode === constants.DARKEST ||
      mode === constants.LIGHTEST || mode === constants.DIFFERENCE ||
      mode === constants.MULTIPLY || mode === constants.EXCLUSION ||
      mode === constants.SCREEN || mode === constants.REPLACE ||
      mode === constants.OVERLAY || mode === constants.HARD_LIGHT ||
      mode === constants.SOFT_LIGHT || mode === constants.DODGE ||
      mode === constants.BURN || mode === constants.ADD ||
      mode === constants.NORMAL) {
      this.drawingContext.globalCompositeOperation = mode;
    } else {
      throw new Error('Mode '+mode+' not recognized.');
    }
  };

  return p5;

});
