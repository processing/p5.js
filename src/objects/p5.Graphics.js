/**
 * @todo : need to make a separate Graphics2D class and use this
 * class to decide which renderer to go with.
 * @module Rendering
 * @submodule Rendering
 * @for p5
 */
define(function(require) {

  var p5 = require('core');

  /**
   * Main graphics and rendering context, as well as the base API
   * implementation for p5.js "core". To be used as the superclass for 
   * Graphics2D and Graphics3D classes, respecitvely. The fields and methods
   * for this class are extensive, but mirror the normal drawing API for p5.
   *
   * @class p5.Graphics
   * @constructor
   * @extends p5.Element
   * @param {String} elt DOM node that is wrapped
   * @param {Object} [pInst] pointer to p5 instance
   * @param {Boolean} whether we're using it as main canvas
   */
  p5.Graphics = function(elt, pInst, isMainCanvas) {
    p5.Element.call(this, elt, pInst);
    this.canvas = elt;
    this._pInst = pInst;
    if (isMainCanvas) {
      this._isMainCanvas = true;
      // for pixel method sharing with pimage
      this._pInst._setProperty('_curElement', this);
      this._pInst._setProperty('canvas', this.canvas);
      this._pInst._setProperty('width', this.width);
      this._pInst._setProperty('height', this.height);
    } else { // hide if offscreen buffer by default
      this.canvas.style.display = 'none';
      this._styles = []; // non-main elt styles stored in p5.Graphics
    }
  };

  p5.Graphics.prototype = Object.create(p5.Element.prototype);

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