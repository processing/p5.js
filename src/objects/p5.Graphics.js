/**
 * @module Rendering
 * @submodule Rendering
 * @for p5.Graphics
 */
define(function(require) {

  var p5 = require('core');

  p5.Graphics = function(elt, pInst) {
    p5.Element.call(this, elt, pInst);
    this.canvas = elt;
    if (this._pInst) {
      // for pixel method sharing with pimage
      this._pInst._setProperty('canvas', elt);
    }
  };

  p5.Graphics.prototype = Object.create(p5.Element.prototype);

  return p5.Graphics;
});
