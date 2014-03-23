define(function (require) {

  'use strict';

  var p5 = require('core');

  p5.prototype.cursor = function(type) {
    this.curElement.style.cursor = type || 'auto';
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
    this.curElement.style.cursor = 'none';
  };

  return p5;

});