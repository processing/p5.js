/**
 * @module Rendering
 * @submodule Rendering
 * @for p5
 */

import p5 from './main';
import * as constants from './constants';

/**
 * Thin wrapper around a renderer, to be used for creating a
 * graphics buffer object. Use this class if you need
 * to draw into an off-screen graphics buffer. The two parameters define the
 * width and height in pixels. The fields and methods for this class are
 * extensive, but mirror the normal drawing API for p5.
 *
 * @class p5.Graphics
 * @constructor
 * @extends p5.Element
 * @param {Number} w            width
 * @param {Number} h            height
 * @param {Constant} renderer   the renderer to use, either P2D or WEBGL
 * @param {p5} [pInst]          pointer to p5 instance
 */
p5.Graphics = function(w, h, renderer, pInst) {
  const r = renderer || constants.P2D;

  this.canvas = document.createElement('canvas');
  const node = pInst._userNode || document.body;
  node.appendChild(this.canvas);

  p5.Element.call(this, this.canvas, pInst);

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
  } else {
    this._renderer = new p5.Renderer2D(this.canvas, this, false);
  }
  pInst._elements.push(this);

  Object.defineProperty(this, 'deltaTime', {
    get: function() {
      return this._pInst.deltaTime;
    }
  });

  this._renderer.resize(w, h);
  this._renderer._applyDefaults();
  return this;
};

p5.Graphics.prototype = Object.create(p5.Element.prototype);

/**
 * Resets certain values such as those modified by functions in the Transform category
 * and in the Lights category that are not automatically reset
 * with graphics buffer objects. Calling this in <a href='#/p5/draw'>draw()</a> will copy the behavior
 * of the standard canvas.
 *
 * @method reset
 * @example
 *
 * <div><code>
 * let pg;
 * function setup() {
 *   createCanvas(100, 100);
 *   background(0);
 *   pg = createGraphics(50, 100);
 *   pg.fill(0);
 *   frameRate(5);
 * }
 *
 * function draw() {
 *   image(pg, width / 2, 0);
 *   pg.background(255);
 *   // p5.Graphics object behave a bit differently in some cases
 *   // The normal canvas on the left resets the translate
 *   // with every loop through draw()
 *   // the graphics object on the right doesn't automatically reset
 *   // so translate() is additive and it moves down the screen
 *   rect(0, 0, width / 2, 5);
 *   pg.rect(0, 0, width / 2, 5);
 *   translate(0, 5, 0);
 *   pg.translate(0, 5, 0);
 * }
 * function mouseClicked() {
 *   // if you click you will see that
 *   // reset() resets the translate back to the initial state
 *   // of the Graphics object
 *   pg.reset();
 * }
 * </code></div>
 *
 * @alt
 * A white line on a black background stays still on the top-left half.
 * A black line animates from top to bottom on a white background on the right half.
 * When clicked, the black line starts back over at the top.
 */
p5.Graphics.prototype.reset = function() {
  this._renderer.resetMatrix();
  if (this._renderer.isP3D) {
    this._renderer._update();
  }
};

/**
 * Removes a Graphics object from the page and frees any resources
 * associated with it.
 *
 * @method remove
 *
 * @example
 * <div class='norender'><code>
 * let bg;
 * function setup() {
 *   bg = createCanvas(100, 100);
 *   bg.background(0);
 *   image(bg, 0, 0);
 *   bg.remove();
 * }
 * </code></div>
 *
 * <div><code>
 * let bg;
 * function setup() {
 *   pixelDensity(1);
 *   createCanvas(100, 100);
 *   stroke(255);
 *   fill(0);
 *
 *   // create and draw the background image
 *   bg = createGraphics(100, 100);
 *   bg.background(200);
 *   bg.ellipse(50, 50, 80, 80);
 * }
 * function draw() {
 *   let t = millis() / 1000;
 *   // draw the background
 *   if (bg) {
 *     image(bg, frameCount % 100, 0);
 *     image(bg, frameCount % 100 - 100, 0);
 *   }
 *   // draw the foreground
 *   let p = p5.Vector.fromAngle(t, 35).add(50, 50);
 *   ellipse(p.x, p.y, 30);
 * }
 * function mouseClicked() {
 *   // remove the background
 *   if (bg) {
 *     bg.remove();
 *     bg = null;
 *   }
 * }
 * </code></div>
 *
 * @alt
 * no image
 * a multi-colored circle moving back and forth over a scrolling background.
 */
p5.Graphics.prototype.remove = function() {
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
};

export default p5.Graphics;
