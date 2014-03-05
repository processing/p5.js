/*global ImageData:false */

define(function (require) {

  /**
   * This module defines the filters for use with image buffers.
   *
   * This module is basically a collection of functions stored in an object
   * as opposed to modules. The functions are destructive, modifying
   * the passed in canvas rather than creating a copy.
   *
   * Generally speaking users of this module will use the Filters.apply method
   * on a canvas to create an effect.
   *
   * A number of functions are borrowed/adapted from http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
   * or the java processing implmentation.
   */

  'use strict';


  var Filters = {};



  /*
   * Helper functions
   */
  

  /**
   * Returns the pixel buffer for a canvas
   * 
   * @private
   * 
   * @param  {Canvas|ImageData} Canvas 
   * @return {Uint8ClampedArray} a one-dimensional array containing the data
   *                             in the RGBA order, with integer values between 0 and 255
   */
  Filters._toPixels = function(canvas){
    if(canvas instanceof ImageData) {
      return canvas.data;
    } else {
      return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    }
  };

  /**
   * Returns the ImageData object for a canvas
   * https://developer.mozilla.org/en-US/docs/Web/API/ImageData
   *
   * @private
   * 
   * @param  {Canvas|ImageData} canvas
   * @return {ImageData} Holder of pixel data (and width and height)
   *                     for a canvas
   */
  Filters._toImageData = function(canvas){
    if(canvas instanceof ImageData) {
      return canvas;
    } else {
      return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    }
  };  

  /**
   * Returns a blank ImageData object.
   *
   * @private
   * 
   * @param  {Integer} width
   * @param  {Integer} height
   * @return {ImageData}  
   */
  Filters._createImageData = function(width, height) {
    Filters._tmpCanvas = document.createElement('canvas');
    Filters._tmpCtx = Filters._tmpCanvas.getContext('2d');
    return this._tmpCtx.createImageData(width, height);
  };


  /**
   * Applys a filter function to a canvas. 
   * 
   * The difference between this and the actual filter functions defined below
   * is that the filter functions generally modify the pixel buffer but do
   * not actually put that data back to the canvas (where it would actually
   * update what is visible). By contrast this method does make the changes actually
   * visible in the canvas.
   *
   * The apply method is the method that callers of this module would generally use.
   * It has been separated from the actual filters to support an advanced use case
   * of creating a filter chain that executes without actually updating the canvas
   * in between everystep.   
   * 
   * @param  {[type]} func   [description]
   * @param  {[type]} canvas [description]
   * @param  {[type]} level  [description]
   * @return {[type]}        [description]
   */
  Filters.apply = function(canvas, func, filterParam){
    var ctx = canvas.getContext('2d');
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    //Filters can either return a new ImageData object, or just modify
    //the one they received.
    var newImageData = func(imageData, filterParam);
    if(newImageData instanceof ImageData){
      ctx.putImageData(newImageData, 0, 0, 0, 0, canvas.width, canvas.height);
    } else{
      ctx.putImageData(imageData, 0, 0, 0, 0, canvas.width, canvas.height);
    }
  };


  /*
   * Filters
   */


  /**
   * Converts the image to black and white pixels depending if they are above or 
   * below the threshold defined by the level parameter. The parameter must be
   * between 0.0 (black) and 1.0 (white). If no level is specified, 0.5 is used.
   *
   * Borrowed from http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
   * 
   * @param  {Canvas} canvas 
   * @param  {Float} level     
   */
  Filters.threshold = function(canvas, level){
    var pixels = Filters._toPixels(canvas);

    if(level === undefined){
        level = 0.5;
    }
    var thresh = Math.floor(level * 255);

    for (var i = 0; i < pixels.length; i+=4) {
      var r = pixels[i];
      var g = pixels[i+1];
      var b = pixels[i+2];
      var grey = (0.2126*r + 0.7152*g + 0.0722*b);
      var val;
      if(grey >= thresh){
        val = 255;
      } else {
        val = 0;
      }
      pixels[i] = pixels[i+1] = pixels[i+2] = val;
    }

  };

  
  /**
   * Converts any colors in the image to grayscale equivalents. No parameter is used.
   *
   * Borrowed from http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
   * 
   * @param  {Canvas} canvas
   */
  Filters.gray = function(canvas){
    var pixels = Filters._toPixels(canvas);

    for (var i = 0; i < pixels.length; i+=4) {
      var r = pixels[i];
      var g = pixels[i+1];
      var b = pixels[i+2];

      // CIE luminance for RGB
      var gray = (0.2126*r + 0.7152*g + 0.0722*b);

      pixels[i] = pixels[i+1] = pixels[i+2] = gray;
    }

  };

  /**
   * Sets the alpha channel to entirely opaque. No parameter is used.
   * 
   * @param  {Canvas} canvas   
   */
  Filters.opaque = function(canvas){
    var pixels = Filters._toPixels(canvas);

    for (var i = 0; i < pixels.length; i+=4) {
      pixels[i+3] = 255;
    }

    return pixels;
  };

  /**
   * Sets each pixel to its inverse value. No parameter is used.
   * @param  {Invert}   
   */
  Filters.invert = function(canvas){
    var pixels = Filters._toPixels(canvas);

    for (var i = 0; i < pixels.length; i+=4) {
      pixels[i] = 255 - pixels[i];
      pixels[i+1] = 255 - pixels[i+1];
      pixels[i+2] = 255 - pixels[i+2];
    }

  };
  
  
  /**
   * Limits each channel of the image to the number of colors specified as 
   * the parameter. The parameter can be set to values between 2 and 255, but
   * results are most noticeable in the lower ranges.
   *
   * Adapted from java based processing implementation
   * 
   * @param  {Canvas} canvas
   * @param  {Integer} level    
   */
  Filters.posterize = function(canvas, level){
    var pixels = Filters._toPixels(canvas);

    if ((level < 2) || (level > 255)) {
      throw new Error('Level must be greater than 2 and less than 255 for posterize');
    }

    var levels1 = level - 1;
    for (var i = 0; i < pixels.length; i++) {
      var rlevel = (pixels[i] >> 16) & 0xff;
      var glevel = (pixels[i] >> 8) & 0xff;
      var blevel = pixels[i] & 0xff;
      rlevel = (((rlevel * level) >> 8) * 255) / levels1;
      glevel = (((glevel * level) >> 8) * 255) / levels1;
      blevel = (((blevel * level) >> 8) * 255) / levels1;
      pixels[i] = ((0xff000000 & pixels[i]) |
                     (rlevel << 16) |
                     (glevel << 8) |
                     blevel);
      }

  };

  
  
  // TODO  

  // BLUR
  // ERODE - Reduces the light areas. No parameter is used.
  // DILATE - Increases the light areas. No parameter is used.

  return Filters;

});