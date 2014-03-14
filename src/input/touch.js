define(function (require) {

  'use strict';

  var p5 = require('core');

  p5.prototype.setTouchPoints = function(e) {
    this._setProperty('touchX', e.changedTouches[0].pageX);
    this._setProperty('touchY', e.changedTouches[0].pageY);
    var touches = [];
    for(var i = 0; i < e.changedTouches.length; i++){
      var ct = e.changedTouches[i];
      touches[i] = {x: ct.pageX, y: ct.pageY};
    }
    this._setProperty('touches', touches);
  };

  p5.prototype.ontouchstart = function(e) {
    this.setTouchPoints(e);
    if(typeof this.touchStarted === 'function') {
      this.touchStarted(e);
    }
    var m = typeof touchMoved === 'function';
    if(m) {
      e.preventDefault();
    }
  };
  p5.prototype.ontouchmove = function(e) {
    this.setTouchPoints(e);
    if(typeof this.touchMoved === 'function') {
      this.touchMoved(e);
    }
  };
  p5.prototype.ontouchend = function(e) {
    this.setTouchPoints(e);
    if(typeof this.touchEnded === 'function') {
      this.touchEnded(e);
    }
  };

  return p5;

});
