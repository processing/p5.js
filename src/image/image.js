/**
 * @module Image
 * @submodule Image
 * @for p5
 * @requires core
 */
define(function (require) {

  /**
   * This module defines the p5 methods for the p5.Image class
   * for drawing images to the main display canvas.
   */

  'use strict';


  var p5 = require('core');
  var constants = require('constants');

  p5.prototype._imageMode = constants.CORNER;
  p5.prototype._tint = null;

  /**
   * Creates a new p5.Image (the datatype for storing images). This provides a
   * fresh buffer of pixels to play with. Set the size of the buffer with the
   * width and height parameters.
   *
   * @method createImage
   * @param  {Integer} width  width in pixels
   * @param  {Integer} height height in pixels
   * @return {p5.Image}         the p5.Image object
   */
  p5.prototype.createImage = function(width, height) {
    return new p5.Image(width, height);
  };


  return p5;

});
