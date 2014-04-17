/**
 * @module Image
 * @for Loading & Displaying
 * @requires core
 */
define(function (require) {

  'use strict';

  var p5 = require('core');
  

  // function getPixels(img) {
  //   var c = document.createElement('canvas');
  //   c.width = img.width;
  //   c.height = img.height;
  //   var ctx = c.getContext('2d');
  //   ctx.drawImage(img);
  //   return ctx.getImageData(0,0,c.width,c.height);
  // }

  //// PIXELS ////////////////////////////////

  p5.prototype.blend = function() {
    // TODO

  };

  p5.prototype.copy = function() {
    // TODO

  };

  p5.prototype.filter = function() {
    // TODO

  };
  /**
   * Reads the color of any pixel or grabs a section of an image. If no parameters are specified, the entire image is returned. Use the x and y parameters to get the value of one pixel. Get a section of the display window by specifying additional w and h parameters. When getting an image, the x and y parameters define the coordinates for the upper-left corner of the image, regardless of the current imageMode().
   *
   * If the pixel requested is outside of the image window, black is returned. The numbers returned are scaled according to the current color ranges, but only RGB values are returned by this function. For example, even though you may have drawn a shape with colorMode(HSB), the numbers returned will be in RGB format. 
   *
   * Getting the color of a single pixel with get(x, y) is easy, but not as fast as grabbing the data directly from pixels[]. The equivalent statement to get(x, y) using pixels[] is pixels[y*width+x]. See the reference for pixels[] for more information.
   *
   * @method get
   * @param {Number} [x] x-coordinate of the pixel
   * @param {Number} [y] y-coordinate of the pixel
   * @return {Array/Color} color of pixel at x,y in array format [R, G, B, A]
   */
  p5.prototype.get = function(x, y) {
    var width = this.width;
    var height = this.height;
    var pix = this.curElement.context.getImageData(0, 0, width, height).data;
    if (typeof x !== 'undefined' && typeof y !== 'undefined') {
      if (x >= 0 && x < width && y >= 0 && y < height) {
        var offset = 4*y*width+4*x;
        var c = [pix[offset], pix[offset+1], pix[offset+2], pix[offset+3]];
        return c;
      } else {
        return [0, 0, 0, 255];
      }
    } else {
      return [0, 0, 0, 255];
    }
  };
  /**
   * Loads the pixel data for the display window into the pixels[] array. This function must always be called before reading from or writing to pixels[].
   *
   * @method loadPixels
   */
  p5.prototype.loadPixels = function() {
    var width = this.width;
    var height = this.height;
    var a = this.curElement.context.getImageData(0, 0, width, height).data;
    var pixels = [];
    for (var i=0; i < a.length; i+=4) {
      pixels.push([a[i], a[i+1], a[i+2], a[i+3]]); // each pixels entry: [r, g, b, a]
    }
    this._setProperty('pixels', pixels);
  };
  /**
   * Changes the color of any pixel, or writes an image directly to the display window.
   *
   * The x and y parameters specify the pixel to change and the c parameter specifies the color value. The c parameter is interpreted according to the current color mode. (The default color mode is RGB values from 0 to 255.) When setting an image, the x and y parameters define the coordinates for the upper-left corner of the image, regardless of the current imageMode(). 
   * 
   * Setting the color of a single pixel with set(x, y) is easy, but not as fast as putting the data directly into pixels[]. The equivalent statement to set(x, y, #000000) using pixels[] is pixels[y*width+x] = #000000. See the reference for pixels[] for more information.
   *
   * @method set
   * @param {Number} x x-coordinate of the pixel
   * @param {Number} y y-coordinate of the pixel
   * @param {Number|Array|Object} insert a grayscale value | a color array | image to copy
   */
  p5.prototype.set = function (x, y, imgOrCol) {
    var idx = y * this.width + x;
    if (typeof imgOrCol === 'number') {
      if (!this.pixels) {
        this.loadPixels();
      }
      if (idx < this.pixels.length) {
        this.pixels[idx] = [imgOrCol, imgOrCol, imgOrCol, 255];
        this.updatePixels();
      }
    }
    else if (imgOrCol instanceof Array) {
      if (imgOrCol.length < 4) {
        imgOrCol[3] = 255;
      }
      if (!this.pixels) {
        this.loadPixels();
      }
      if (idx < this.pixels.length) {
        this.pixels[idx] = imgOrCol;
        this.updatePixels();
      }
    } else {
      this.curElement.context.drawImage(imgOrCol.canvas, x, y);
      this.loadPixels();
    }
  };
  /**
   * Updates the display window with the data in the pixels[] array. Use in conjunction with loadPixels(). If you're only reading pixels from the array, there's no need to call updatePixels() — updating is only necessary to apply changes. 
   *
   * @method updatePixels
   */
  p5.prototype.updatePixels = function() {
    var imageData = this.curElement.context.getImageData(0, 0, this.width, this.height);
    var data = imageData.data;
    for (var i = 0; i < this.pixels.length; i += 1) {
      var j = i * 4;
      data[j] = this.pixels[i][0];
      data[j + 1] = this.pixels[i][1];
      data[j + 2] = this.pixels[i][2];
      data[j + 3] = this.pixels[i][3];
    }
    this.curElement.context.putImageData(imageData, 0, 0, 0, 0, this.width, this.height);
  };

  return p5;

});
