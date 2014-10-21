/**
 * @module Rendering
 * @submodule Rendering
 * @for p5
 */
define(function(require) {

  var p5 = require('core');
  var constants = require('constants');

  /**
   * Main graphics and rendering context, as well as the base API
   * implementation for p5.js "core". Use this class if you need to draw into
   * an off-screen graphics buffer. A p5.Graphics object can be constructed
   * with the <code>createGraphics()</code> function. The fields and methods
   * for this class are extensive, but mirror the normal drawing API for p5.
   *
   * @class p5.Graphics
   * @constructor
   * @extends p5.Element
   * @param {String} elt DOM node that is wrapped
   * @param {Object} [pInst] pointer to p5 instance
   * @example
   * <div>
   * <code>
   * var pg;
   * function setup() {
   *   createCanvas(100, 100);
   *   pg = createGraphics(40, 40);
   * }
   * function draw() {
   *   background(200);
   *   pg.background(100);
   *   pg.noStroke();
   *   pg.ellipse(pg.width/2, pg.height/2, 50, 50);
   *   image(pg, 9, 30);
   *   image(pg, 51, 30);
   * }
   * </code>
   * </div>
   */
  p5.Graphics = function(elt, pInst, isMainCanvas) {
    p5.Element.call(this, elt, pInst);
    this.canvas = elt;
    this.drawingContext = this.canvas.getContext('2d');
    this._pInst = pInst;
    if (isMainCanvas) {
      this._isMainCanvas = true;
      // for pixel method sharing with pimage
      this._pInst._setProperty('_curElement', this);
      this._pInst._setProperty('canvas', this.canvas);
      this._pInst._setProperty('drawingContext', this.drawingContext);
      this._pInst._setProperty('width', this.width);
      this._pInst._setProperty('height', this.height);
    } else { // hide if offscreen buffer by default
      this.canvas.style.display = 'none';
      this._styles = []; // non-main elt styles stored in p5.Graphics
    }
  };

  p5.Graphics.prototype = Object.create(p5.Element.prototype);

  p5.Graphics.prototype._applyDefaults = function() {
    this.drawingContext.fillStyle = '#FFFFFF';
    this.drawingContext.strokeStyle = '#000000';
    this.drawingContext.lineCap = constants.ROUND;
    this.drawingContext.font = 'normal 12px sans-serif';
  };

  p5.Graphics.prototype.resize = function(w, h) {
    this.width = w;
    this.height = h;
    this.elt.width = w * this._pInst._pixelDensity;
    this.elt.height = h * this._pInst._pixelDensity;
    this.elt.style.width = w +'px';
    this.elt.style.height = h + 'px';
    if (this._isMainCanvas) {
      this._pInst._setProperty('width', this.width);
      this._pInst._setProperty('height', this.height);
    }
    this.drawingContext.scale(this._pInst._pixelDensity,
                              this._pInst._pixelDensity);
  };

  return p5.Graphics;
});
