define(function (require) {

  'use strict';

  var Processing = require('core');
  var constants = require('constants');

  Processing.prototype.background = function() {
    var c = this.getNormalizedColor(arguments);
    // save out the fill
    var curFill = this.curElement.context.fillStyle;
    // create background rect
    this.curElement.context.fillStyle = this.getCSSRGBAColor(c);
    this.curElement.context.fillRect(0, 0, this.width, this.height);
    // reset fill
    this.curElement.context.fillStyle = curFill;
  };
  Processing.prototype.clear = function() {
    this.curElement.context.clearRect(0, 0, this.width, this.height);
  };
  Processing.prototype.colorMode = function(mode) {
    if (mode == constants.RGB || mode == constants.HSB)
      this.settings.colorMode = mode;
  };
  Processing.prototype.fill = function() {
    var c = this.getNormalizedColor(arguments);
    this.curElement.context.fillStyle = this.getCSSRGBAColor(c);
  };
  Processing.prototype.noFill = function() {
    this.curElement.context.fillStyle = 'rgba(0,0,0,0)';
  };
  Processing.prototype.noStroke = function() {
    this.curElement.context.strokeStyle = 'rgba(0,0,0,0)';
  };
  Processing.prototype.stroke = function() {
    var c = this.getNormalizedColor(arguments);
    this.curElement.context.strokeStyle = this.getCSSRGBAColor(c);
  };


  /**
  * getNormalizedColor For a number of different inputs,
  *                    returns a color formatted as [r, g, b, a]
  *
  * @param {'array-like' object} args An 'array-like' object that
  *                                   represents a list of arguments
  *
  * @return {Array} returns a color formatted as [r, g, b, a]
  *                 input        ==> output
  *                 g            ==> [g, g, g, 255]
  *                 g,a          ==> [g, g, g, a]
  *                 r, g, b      ==> [r, g, b, 255]
  *                 r, g, b, a   ==> [r, g, b, a]
  *                 [g]          ==> [g, g, g, 255]
  *                 [g, a]       ==> [g, g, g, a]
  *                 [r, g, b]    ==> [r, g, b, 255]
  *                 [r, g, b, a] ==> [r, g, b, a]
  */
  Processing.prototype.getNormalizedColor = function(args) {
    var r, g, b, a, rgba;
    var _args = typeof args[0].length === 'number' ? args[0] : args;
    if (_args.length >= 3) {
      r = _args[0];
      g = _args[1];
      b = _args[2];
      a = typeof _args[3] === 'number' ? _args[3] : 255;
    } else {
      r = g = b = _args[0];
      a = typeof _args[1] === 'number' ? _args[1] : 255;
    }
    if (this.settings.colorMode == constants.HSB) {
      rgba = hsv2rgb(r, g, b).concat(a);
    } else {
      rgba = [r, g, b, a];
    }

    return rgba;
  };

  Processing.prototype.getCSSRGBAColor = function(arr) {
    var a = arr.map(function(val) {
      return Math.floor(val);
    });
    var alpha = a[3] ? (a[3]/255.0) : 1;
    return 'rgba('+a[0]+','+a[1]+','+a[2]+','+ alpha +')';
  };

  return Processing;

});
