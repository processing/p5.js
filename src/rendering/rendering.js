/**
 * @module Rendering
 * @submodule Rendering
 * @for p5
 */
define(function(require) {

  var p5 = require('core');
  /**
   * Creates a p5.Graphics object.
   */
  p5.prototype.createGraphics = function(w, h) {
    var c = document.createElement('canvas');
    c.setAttribute('width', w);
    c.setAttribute('height', h);
    //c.style.visibility='hidden';
    document.body.appendChild(c);
    
    var elt = new p5.Graphics(c);
    this._applyDefaults.call(this);
    return elt;
  };

  return p5;

});
