/**
 * @module Rendering
 * @submodule Rendering
 * @for p5
 */

'use strict';

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
 * @param {Number} w            width
 * @param {Number} h            height
 * @param {Constant} renderer   the renderer to use, either P2D or WEBGL
 * @param {p5} [pInst]          pointer to p5 instance
 */
p5.Graphics = function(w, h, renderer, pInst) {
  var r = renderer || constants.P2D;

  this.canvas = document.createElement('canvas');
  var node = pInst._userNode || document.body;
  node.appendChild(this.canvas);

  p5.Element.call(this, this.canvas, pInst, false);

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

  this._renderer.resize(w, h);
  this._renderer._applyDefaults();

  this.name = 'p5.Graphics'; // for friendly debugger system
  return this;
};

p5.Graphics.prototype = Object.create(p5.Element.prototype);

/**
 * @method remove
 */
p5.Graphics.prototype.remove = function() {
  if (this.elt.parentNode) {
    this.elt.parentNode.removeChild(this.elt);
  }
  for (var elt_ev in this._events) {
    this.elt.removeEventListener(elt_ev, this._events[elt_ev]);
  }
};

module.exports = p5.Graphics;
