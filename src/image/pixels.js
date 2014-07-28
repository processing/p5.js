/**
 * @module Image
 * @submodule Pixels
 * @for p5
 * @requires core
 */
define(function (require) {

  'use strict';

  var p5 = require('core');
  var Filters = require('filters');
  var constants = require('constants');
  require('p5.Color');

  /**
   * Array containing the values for all the pixels in the display window.
   * These values are numbers. This array is the size of the display window x4,
   * representing the R, G, B, A values in order for each pixel, moving from 
   * left to right across each row, then down each column. For example, 
   * if the image is 100x100 pixels, there will be 40000. The first four values
   * (indices 0-3) in the array will be the R, G, B, A values of the pixel at 
   * (0, 0). The second four values (indices 4-7) will contain the R, G, B, A
   * values of the pixel at (1, 0). More generally, to values for a pixel at 
   * (x, y) are: <code>pixels[y*width+x]</code>, 
   * <code>pixels[y*width+x+1]</code>, <code>pixels[y*width+x+2]</code>,
   * <code>pixels[y*width+x+3]</code>.<br><br>
   *
   * Before accessing this array, the data must loaded with the loadPixels()
   * function. After the array data has been modified, the updatePixels()
   * function must be run to update the changes.
   *
   * @property pixels[]
   */
  p5.prototype.pixels = [];

  // function getPixels(img) {
  //   var c = document.createElement('canvas');
  //   c.width = img.width;
  //   c.height = img.height;
  //   var ctx = c.getContext('2d');
  //   ctx.drawImage(img);
  //   return ctx.getImageData(0,0,c.width,c.height);
  // }

  //// PIXELS ////////////////////////////////

  /**
   * Copies a region of pixels from one image to another, using a specified
   * blend mode to do the operation.
   * 
   * @method blend
   * @param  {p5.Image|undefined} srcImage source image
   * @param  {Integer} sx X coordinate of the source's upper left corner
   * @param  {Integer} sy Y coordinate of the source's upper left corner
   * @param  {Integer} sw source image width
   * @param  {Integer} sh source image height
   * @param  {Integer} dx X coordinate of the destination's upper left corner
   * @param  {Integer} dy Y coordinate of the destination's upper left corner
   * @param  {Integer} dw destination image width
   * @param  {Integer} dh destination image height
   * @param  {Integer} blendMode the blend mode
   *
   * Available blend modes are: normal | multiply | screen | overlay | 
   *            darken | lighten | color-dodge | color-burn | hard-light | 
   *            soft-light | difference | exclusion | hue | saturation | 
   *            color | luminosity

   * 
   * http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
   * 
   */
  p5.prototype.blend = function() {
    var currBlend = this.canvas.getContext('2d').globalCompositeOperation;
    var blendMode = arguments[arguments.length - 1];
    var copyArgs = Array.prototype.slice.call(
      arguments,
      0,
      arguments.length - 1
    );

    this.canvas.getContext('2d').globalCompositeOperation = blendMode;
    this.copy.apply(this, copyArgs);
    this.canvas.getContext('2d').globalCompositeOperation = currBlend;
  };

  /**
   * Copies a region of the canvas to another region of the canvas  
   * and copies a region of pixels from an image used as the srcImg parameter
   * into the canvas srcImage is specified this is used as the source. If
   * the source and destination regions aren't the same size, it will
   * automatically resize source pixels to fit the specified
   * target region.
   *
   * @method copy
   * @param  {p5.Image|undefined} srcImage source image
   * @param  {Integer} sx X coordinate of the source's upper left corner
   * @param  {Integer} sy Y coordinate of the source's upper left corner
   * @param  {Integer} sw source image width
   * @param  {Integer} sh source image height
   * @param  {Integer} dx X coordinate of the destination's upper left corner
   * @param  {Integer} dy Y coordinate of the destination's upper left corner
   * @param  {Integer} dw destination image width
   * @param  {Integer} dh destination image height
   */
  p5.prototype.copy = function() {
    var srcImage, sx, sy, sw, sh, dx, dy, dw, dh;
    if(arguments.length === 9){
      srcImage = arguments[0];
      sx = arguments[1];
      sy = arguments[2];
      sw = arguments[3];
      sh = arguments[4];
      dx = arguments[5];
      dy = arguments[6];
      dw = arguments[7];
      dh = arguments[8];
    } else if(arguments.length === 8){
      sx = arguments[0];
      sy = arguments[1];
      sw = arguments[2];
      sh = arguments[3];
      dx = arguments[4];
      dy = arguments[5];
      dw = arguments[6];
      dh = arguments[7];

      srcImage = this;
    } else {
      throw new Error('Signature not supported');
    }

    this.canvas.getContext('2d').drawImage(srcImage.canvas,
      sx, sy, sw, sh, dx, dy, dw, dh
    );
  };

  /**
   * Applies a filter to the canvas
   * 
   * @method filter
   * @param  {String}           operation one of threshold, gray, invert,
   *                                      posterize and opaque. see filters.js
   *                                      for docs on each available filter
   * @param  {Number|undefined} value
   */
  p5.prototype.filter = function(operation, value) {
    Filters.apply(this.canvas, Filters[operation.toLowerCase()], value);
  };

  /**
   * Returns an array of [R,G,B,A] values for any pixel or grabs a section of
   * an image. If no parameters are specified, the entire image is returned. 
   * Use the x and y parameters to get the value of one pixel. Get a section of
   * the display window by specifying additional w and h parameters. When 
   * getting an image, the x and y parameters define the coordinates for the 
   * upper-left corner of the image, regardless of the current imageMode().
   *
   * If the pixel requested is outside of the image window, [0,0,0,255] is 
   * returned. To get the numbers scaled according to the current color ranges
   * and taking into account colorMode, use getColor instead of get.
   *
   * Getting the color of a single pixel with get(x, y) is easy, but not as fast
   * as grabbing the data directly from pixels[]. The equivalent statement to
   * get(x, y) using pixels[] is [ pixels[y*width+x], pixels[y*width+x+1], 
   * pixels[y*width+x+2], pixels[y*width+3] ]. See the reference for
   * pixels[] for more information.
   *
   * @method get
   * @param  {Number}         [x] x-coordinate of the pixel
   * @param  {Number}         [y] y-coordinate of the pixel
   * @param  {Number}         [w] width
   * @param  {Number}         [h] height
   * @return {Array|p5.Image}     values of pixel at x,y in array format
   *                              [R, G, B, A] or p5.Image
   */
  p5.prototype.get = function(x, y, w, h){
    if (x === undefined && y === undefined &&
        w === undefined && h === undefined){
      x = 0;
      y = 0;
      w = this.width;
      h = this.height;
    } else if (w === undefined && h === undefined) {
      w = 1;
      h = 1;
    }

    if(x > this.width || y > this.height || x < 0 || y < 0){
      return [0, 0, 0, 255];
    }

    var imageData = this.canvas.getContext('2d').getImageData(x, y, w, h);
    var data = imageData.data;

    if (w === 1 && h === 1){
      var pixels = [];
      
      for (var i = 0; i < data.length; i += 4) {
        pixels.push(data[i], data[i+1], data[i+2], data[i+3]);
      }
      
      return pixels;
    } else {
      //auto constrain the width and height to
      //dimensions of the source image
      w = Math.min(w, this.width);
      h = Math.min(h, this.height);

      var region = new p5.Image(w, h);
      region.canvas.getContext('2d').putImageData(imageData, 0, 0, 0, 0, w, h);

      return region;
    }
  };

  /**
   * Reads an array of [R,G,B,A] values for any pixel or grabs a section of an 
   * image. If no parameters are specified, the entire image is returned. Use 
   * the x and y parameters to get the value of one pixel. Get a section of 
   * the display window by specifying additional w and h parameters. When 
   * getting an image, the x and y parameters define the coordinates for the 
   * upper-left corner of the image, regardless of the current imageMode().
   *
   * If the pixel requested is outside of the image window, [0,0,0,255] is 
   * returned. To get the numbers scaled according to the current color ranges
   * and taking into account colorMode, use getColor instead of get.
   *
   * Getting the color of a single pixel with get(x, y) is easy, but not as fast
   * as grabbing the data directly from pixels[]. The equivalent statement to
   * get(x, y) using pixels[] is [ pixels[y*width+x], pixels[y*width+x+1], 
   * pixels[y*width+x+2], pixels[y*width+3] ]. See the reference for
   * pixels[] for more information.
   *
   * @method getColor
   * @param  {Number}         [x] x-coordinate of the pixel
   * @param  {Number}         [y] y-coordinate of the pixel
   * @param  {Number}         [w] width
   * @param  {Number}         [h] height
   * @return {Array|p5.Image}     values of pixel at x,y in array format
   *                              [R, G, B, A] or p5.Image
   */
  p5.prototype.getColor = function(x, y){
    var arr = this.get(x, y);
    return new p5.Color(this, arr, constants.RGB);
  };
  /**
   * Loads the pixel data for the display window into the pixels[] array. This
   * function must always be called before reading from or writing to pixels[].
   *
   * @method loadPixels
   */
  p5.prototype.loadPixels = function() {
    var width = this.width;
    var height = this.height;
    var imageData = this.canvas.getContext('2d').getImageData(
      0,
      0,
      width,
      height);
    this._setProperty('imageData', imageData);
    this._setProperty('pixels', imageData.data);
  };

  /**
   * Changes the color of any pixel, or writes an image directly to the display
   * window.
   *
   * The x and y parameters specify the pixel to change and the c parameter
   * specifies the color value. The c parameter is interpreted according to the
   * current color mode. (The default color mode is RGB values from 0 to 255.)
   * When setting an image, the x and y parameters define the coordinates for
   * the upper-left corner of the image, regardless of the current imageMode(). 
   * 
   * Setting the color of a single pixel with set(x, y) is easy, but not as
   * fast as putting the data directly into pixels[]. The equivalent statement
   * to set(x, y, #000000) using pixels[] is pixels[y*width+x] = #000000.
   * See the reference for pixels[] for more information.
   *
   * @method set
   * @param {Number}              x x-coordinate of the pixel
   * @param {Number}              y y-coordinate of the pixel
   * @param {Number|Array|Object}   insert a grayscale value | a color array |
   *                                image to copy
   */
  p5.prototype.set = function (x, y, imgOrCol) {
    if (imgOrCol instanceof p5.Image) {
      this.canvas.getContext('2d').drawImage(imgOrCol.canvas, x, y);
      this.loadPixels.call(this);
    } else {
      var idx = 4*(y * this.width + x);
      if (!this.pixels) {
        this.loadPixels.call(this);
      }
      if (typeof imgOrCol === 'number') {
        if (idx < this.pixels.length) {
          this.pixels[idx] = imgOrCol;
          this.pixels[idx+1] = imgOrCol;
          this.pixels[idx+2] = imgOrCol;
          this.pixels[idx+3] = 255;
          //this.updatePixels.call(this);
        }
      }
      else if (imgOrCol instanceof Array) {
        if (imgOrCol.length < 4) {
          throw new Error('pixel array must be of the form [R, G, B, A]');
        }
        if (idx < this.pixels.length) {
          this.pixels[idx] = imgOrCol[0];
          this.pixels[idx+1] = imgOrCol[1];
          this.pixels[idx+2] = imgOrCol[2];
          this.pixels[idx+3] = imgOrCol[3];
          //this.updatePixels.call(this);
        }
      } else if (imgOrCol instanceof p5.Color) {
        if (idx < this.pixels.length) {
          this.pixels[idx] = imgOrCol.rgba[0];
          this.pixels[idx+1] = imgOrCol.rgba[1];
          this.pixels[idx+2] = imgOrCol.rgba[2];
          this.pixels[idx+3] = imgOrCol.rgba[3];
          //this.updatePixels.call(this);
        }
      }
    }
  };
  /**
   * Updates the display window with the data in the pixels[] array.
   * Use in conjunction with loadPixels(). If you're only reading pixels from
   * the array, there's no need to call updatePixels() — updating is only
   * necessary to apply changes. 
   *
   * @method updatePixels
   */
  p5.prototype.updatePixels = function (x, y, w, h) {
    if (x === undefined &&
      y === undefined &&
      w === undefined &&
      h === undefined) {
      x = 0;
      y = 0;
      w = this.width;
      h = this.height;
    }
    this.canvas.getContext('2d').putImageData(this.imageData, x, y, 0, 0, w, h);
  };

  return p5;

});
