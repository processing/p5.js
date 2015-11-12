/**
 * @module Rendering
 * @submodule Rendering
 * @for p5
 */

var p5 = require('./core');
var constants = require('./constants');

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
 * @param {String} elt DOM node that is wrapped
 * @param {Object} [pInst] pointer to p5 instance
 * @param {Boolean} whether we're using it as main canvas
 */
p5.Graphics = function(w, h, renderer, pInst) {

  var r = renderer || constants.P2D;

  var c = document.createElement('canvas');
  var node = this._userNode || document.body;
  node.appendChild(c);

  p5.Element.call(this, c, pInst, false);
  this._styles = [];
  this.width = w;
  this.height = h;
  this._pixelDensity = pInst._pixelDensity;

  if (r === constants.WEBGL) {
    this._renderer = new p5.Renderer3D(c, pInst, false);
  } else {
    this._renderer = new p5.Renderer2D(c, pInst, false);
  }

  this._renderer.resize(w, h);
  this._renderer._applyDefaults();

  pInst._elements.push(this);

  // bind methods and props of p5 to the new object
  for (var p in p5.prototype) {
    if (!this[p]) {
      if (typeof p5.prototype[p] === 'function') {
        this[p] = p5.prototype[p].bind(this);
      } else {
        this[p] = p5.prototype[p];
      }
    }
  }

  return this;
};

p5.Graphics.prototype = Object.create(p5.Element.prototype);

module.exports = p5.Graphics;
