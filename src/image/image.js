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
   * .pixels gives access to an array containing the values for all the pixels 
   * in the display window.
   * These values are numbers. This array is the size of the display window x4,
   * representing the R, G, B, A values in order for each pixel, moving from 
   * left to right across each row, then down each column. See .pixels for
   * more info. It may also be simpler to use set() or get().
   * <br><br>
   * Before accessing the pixels of an image, the data must loaded with the 
   * loadPixels()
   * function. After the array data has been modified, the updatePixels()
   * function must be run to update the changes.
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
   * for (i = 0; i < img.width; i++) {
   *   for (j = 0; j < img.height; j++) {
   *     img.set(i, j, color(0, 90, 102)); 
   *   }
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
   * for (i = 0; i < img.width; i++) {
   *   for (j = 0; j < img.height; j++) {
   *     img.set(i, j, color(0, 90, 102, i % img.width * 2)); 
   *   }
   * }
   * img.updatePixels();
   * image(img, 17, 17);
   * image(img, 34, 34);
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * var pink = color(255, 102, 204);
   * img = createImage(66, 66);
   * img.loadPixels();
   * for (var i = 0; i < 4*(width*height/2); i+=4) {
   *   img.pixels[i] = red(pink);
   *   img.pixels[i+1] = green(pink);
   *   img.pixels[i+2] = blue(pink);
   *   img.pixels[i+3] = alpha(pink);
   * }
   * img.updatePixels();
   * image(img, 17, 17);
   * </code>
   * </div>
   */
  p5.prototype.createImage = function(width, height) {
    return new p5.Image(width, height);
  };


  return p5;

});
