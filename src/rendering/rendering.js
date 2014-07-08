/**
 * @module Rendering
 * @submodule Rendering
 * @for p5
 */
define(function(require) {

  var p5 = require('core');
  var constants = require('constants');


  /**
   * Creates a canvas element in the document.
   *
   * @method createCanvas
   * @param  {Number} w width of the canvas
   * @param  {Number} h height of the canvas
   * @return {Object} canvas generated
   */
  p5.prototype.createCanvas = function(w, h, isDefault) {
    var c;
    if (isDefault) {
      c = document.createElement('canvas');
      c.id = 'defaultCanvas';
      // store in elements array
      this._elements.push(c);

    } else { // resize the default canvas if new one is created
      c = document.getElementById('defaultCanvas');
      if (c) {
        c.id = ''; // remove default id
      } else { // probably user calling createCanvas more than once... uhoh
        // c = document.createElement('canvas');

        // // store in elements array
        // this._elements.push(c);

        var warn = 'Warning: createCanvas more than once NOT recommended.';
        warn += ' Very unpredictable behavior may result.';
        console.log(warn);
      }
    }

    c.setAttribute('width', w*this._pixelDensity);
    c.setAttribute('height', h*this._pixelDensity);
    c.setAttribute('style',
      'width:'+w+'px !important; height:'+h+'px !important;');

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

    var elt = new p5.Graphics(c, this);
    this.scale(this._pixelDensity, this._pixelDensity);
    return elt;
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
    c.setAttribute('width', w);
    c.setAttribute('height', h);
    //c.style.visibility='hidden';
    document.body.appendChild(c);
    
    // store in elements array
    this._elements.push(c);

    var elt = new p5.Graphics(c);

    for (var p in p5.prototype) {
      if (!elt.hasOwnProperty(p)) {
        if (typeof p5.prototype[p] === 'function') {
          elt[p] = p5.prototype[p].bind(elt);
        } else {
          elt[p] = p5.prototype[p];
        }
      }
    }
    return elt;
  };

  /**
   * Blends the pixels in the display window according to the defined mode. 
   * There is a choice of the following modes to blend the source pixels (A) 
   * with the ones of pixels already in the display window (B):
   * <ul>
   * <li><code>BLEND</code> - linear interpolation of colours: C = 
   * A*factor + B. This is the default blending mode.</li>
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
      mode === constants.BURN) {
      this.canvas.getContext('2d').globalCompositeOperation = mode;
    } else {
      throw new Error('Mode '+mode+' not recognized.');
    }
  };

  return p5;

});
