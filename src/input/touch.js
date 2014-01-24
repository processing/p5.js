define(function (require) {

  'use strict';

  var Processing = require('core');

  Processing.prototype.setTouchPoints = function(e) {
    this._setProperty('touchX', e.changedTouches[0].pageX);
    this._setProperty('touchY', e.changedTouches[0].pageY);
    var touches = [];
    for (var n = 0; n < this.sketchCanvases.length; n++) {
      this.sketches[n].touches = [];
    }
    for(var i = 0; i < e.changedTouches.length; i++){
      var ct = e.changedTouches[i];
      touches[i] = {x: ct.pageX, y: ct.pageY};
      for (var m = 0; m < this.sketchCanvases.length; n++) {
        var s = this.sketches[m];
        var c = this.sketchCanvases[m];
        var bounds = c.elt.getBoundingClientRect();
        s.touches[i] = {x: ct.pageX - bounds.left, y: ct.pageY - bounds.top};
      }
    }
    this._setProperty('touches', touches);
  };

  Processing.prototype.ontouchstart = function(e) {
    this.setTouchPoints(e);
    if(typeof this.touchStarted === 'function') {
      this.touchStarted(e);
    }
    var m = typeof touchMoved === 'function';
    for (var i = 0; i < this.sketches.length; i++) {
      var s = this.sketches[i];
      if (typeof s.touchStarted === 'function') {
        s.touchStarted(e);
      }
      m |= typeof s.touchMoved === 'function';
    }
    if(m) {
      e.preventDefault();
    }
  };
  Processing.prototype.ontouchmove = function(e) {
    this.setTouchPoints(e);
    if(typeof this.touchMoved === 'function') {
      this.touchMoved(e);
    }
    for (var i = 0; i < this.sketches.length; i++) {
      var s = this.sketches[i];
      if (typeof s.touchMoved === 'function') {
        s.touchMoved(e);
      }
    }
  };
  Processing.prototype.ontouchend = function(e) {
    this.setTouchPoints(e);
    if(typeof this.touchEnded === 'function') {
      this.touchEnded(e);
    }
    for (var i = 0; i < this.sketches.length; i++) {
      var s = this.sketches[i];
      if (typeof s.touchEnded === 'function') {
        s.touchEnded(e);
      }
    }
  };

  return Processing;

});
