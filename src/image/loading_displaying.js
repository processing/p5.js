define(function (require) {

  'use strict';

  var Processing = require('core');
  var canvas = require('canvas');
  var constants = require('constants');

  Processing.prototype.image = function() {
    var vals;
    if (arguments.length < 5) {
      vals = canvas.modeAdjust(arguments[1], arguments[2], arguments[0].width, arguments[0].height, this.settings.imageMode);
    } else {
      vals = canvas.modeAdjust(arguments[1], arguments[2], arguments[3], arguments[4], this.settings.imageMode);
    }
    this.curElement.context.drawImage(arguments[0].sourceImage, vals.x, vals.y, vals.w, vals.h);
  };

  Processing.prototype.imageMode = function(m) {
    if (m == constants.CORNER || m == constants.CORNERS || m == constants.CENTER) {
      this.settings.imageMode = m;
    }
  };

  function getPixels(img) {
    var c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    var ctx = c.getContext('2d');
    ctx.drawImage(img);
    return ctx.getImageData(0,0,c.width,c.height);
  }

  //// PIXELS ////////////////////////////////

  Processing.prototype.blend = function() {
    // TODO

  };

  Processing.prototype.copy = function() {
    // TODO

  };

  Processing.prototype.filter = function() {
    // TODO

  };

  Processing.prototype.get = function(x, y) {
    var pix = this.curElement.context.getImageData(0, 0, width, height).data;
    /*if (typeof w !== 'undefined' && typeof h !== 'undefined') {
      var region = [];
      for (var j=0; j<h; j++) {
        for (var i=0; i<w; i++) {
          region[i*w+j] = pix[(y+j)*width+(x+i)];
        }
      }
      return region;
    }*/
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

  Processing.prototype.loadPixels = function() {
    var a = this.curElement.context.getImageData(0, 0, width, height).data;
    var pixels = [];
    for (var i=0; i < a.length; i+=4) {
      pixels.push([a[i], a[i+1], a[i+2], a[i+3]]); // each pixels entry: [r, g, b, a]
    }
    this._setProperty('pixels', pixels);
  };

  Processing.prototype.set = function() {
    // TODO

  };

  Processing.prototype.updatePixels = function() {
    /*if (typeof this.pixels !== 'undefined') {
      var imgd = this.curElement.context.getImageData(x, y, width, height);
      imgd = this.pixels;
      context.putImageData(imgd, 0, 0);
    }*/
  };

  return Processing;

});
