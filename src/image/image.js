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
   * @return {p5.Image}       the p5.Image object
   * @example
   * <div>
   * <code>
   * img = createImage(66, 66);
   * img.loadPixels();
   * for (i = 0; i < img.pixels.length; i++) {
   *   img.pixels[i] = color(0, 90, 102); 
   * }
   * img.updatePixels();
   * image(img, 17, 17);
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * img = createImage(66, 66);
   * img.loadPixels();
   * for (i = 0; i < img.pixels.length; i++) {
   *   img.pixels[i] = color(0, 90, 102, i % img.width * 2); 
   * }
   * img.updatePixels();
   * image(img, 17, 17);
   * image(img, 34, 34);
   * </code>
   * </div>
   */
  p5.prototype.createImage = function(width, height) {
    return new p5.Image(width, height);
  };


  return p5;

});
