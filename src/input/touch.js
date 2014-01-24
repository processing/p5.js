define(function (require) {

  'use strict';

  var Processing = require('core');

  Processing.prototype.setTouchPoints = function(e) {
    this._setProperty('touchX', e.changedTouches[0].pageX);
    this._setProperty('touchY', e.changedTouches[0].pageY);
    var touches = [];
    for(var i = 0; i < e.changedTouches.length; i++){
      var ct = e.changedTouches[i];
      touches[i] = {x: ct.pageX, y: ct.pageY};
    }
    this._setProperty('touches', touches);
  };

  Processing.prototype.ontouchstart = function(e) {
    this.setTouchPoints(e);
    if(typeof this.touchStarted === 'function') {
      this.touchStarted(e);
    }
    var m = typeof touchMoved === 'function';
    if(m) {
      e.preventDefault();
    }
  };
  Processing.prototype.ontouchmove = function(e) {
    this.setTouchPoints(e);
    if(typeof this.touchMoved === 'function') {
      this.touchMoved(e);
    }
  };
  Processing.prototype.ontouchend = function(e) {
    this.setTouchPoints(e);
    if(typeof this.touchEnded === 'function') {
      this.touchEnded(e);
    }
  };

  return Processing;

});
