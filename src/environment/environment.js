define(function(require) {

  'use strict';

  var p5 = require('core');
  var C = require('constants');

  var standardCursors = [C.ARROW, C.CROSS, C.HAND, C.MOVE, C.TEXT, C.WAIT];

  p5.prototype.cursor = function(type, x, y) {
    var cursor = 'auto';
    var canvas = this.curElement.elt;
    if (standardCursors.indexOf(type) > -1) {
      // Standard css cursor
      cursor = type;
    } else if (typeof type === 'string') {
      var coords = '';
      if (x && y && (typeof x === 'number' && typeof y === 'number')) {
        // Note that x and y values must be unit-less positive integers < 32
        // https://developer.mozilla.org/en-US/docs/Web/CSS/cursor
        coords = x + ' ' + y;
      }
      if (type.substring(0, 6) !== 'http://') {
        // Image (absolute url)
        cursor = 'url(' + type + ') ' + coords + ', auto';
      } else if (/\.(cur|jpg|jpeg|gif|png|CUR|JPG|JPEG|GIF|PNG)$/.test(type)) {
        // Image file (relative path) - Separated for performance reasons
        cursor = 'url(' + type + ') ' + coords + ', auto';
      } else {
        // Any valid string for the css cursor property
        cursor = type;
      }
    }
    canvas.style.cursor = cursor;
  };

  p5.prototype.frameRate = function(fps) {
    if (typeof fps === 'undefined') {
      return this._frameRate;
    } else {
      this._setProperty('_targetFrameRate', fps);
      this._runFrames();
      return this;
    }
  };

  p5.prototype.getFrameRate = function() {
    return this.frameRate();
  };

  p5.prototype.setFrameRate = function(fps) {
    return this.frameRate(fps);
  };

  p5.prototype.noCursor = function() {
    this.curElement.elt.style.cursor = 'none';
  };

  return p5;

});