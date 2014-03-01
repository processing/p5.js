define(function (require) {

  'use strict';

  var Processing = require('core');

  Processing.prototype.cursor = function(type) {
    this.curElement.style.cursor = type || 'auto';
  };

  Processing.prototype.frameRate = function(fps) {
    if (typeof fps === 'undefined') {
        return this._frameRate;
    } else {
      this._setProperty('_targetFrameRate', fps);
      this._runFrames();
      return this;
    }
  };

  Processing.prototype.getFrameRate = function() {
    return this.frameRate();
  };

  Processing.prototype.setFrameRate = function(fps) {
    return this.frameRate(fps);
  };

  Processing.prototype.noCursor = function() {
    this.curElement.style.cursor = 'none';
  };

  return Processing;

});