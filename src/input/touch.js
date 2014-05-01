define(function (require) {

  'use strict';

  var p5 = require('core');

  p5.prototype.setTouchPoints = function(e) {
    var context = this._isGlobal ? window : this;
    context._setProperty('touchX', e.changedTouches[0].pageX);
    context._setProperty('touchY', e.changedTouches[0].pageY);
    var touches = [];
    for(var i = 0; i < e.changedTouches.length; i++){
      var ct = e.changedTouches[i];
      touches[i] = {x: ct.pageX, y: ct.pageY};
    }
    context._setProperty('touches', touches);
  };

  p5.prototype.ontouchstart = function(e) {
    var context = this._isGlobal ? window : this;
    context.setTouchPoints(e);
    if(typeof context.touchStarted === 'function') {
      e.preventDefault();
      context.touchStarted(e);
    }
  };
  p5.prototype.ontouchmove = function(e) {
    var context = this._isGlobal ? window : this;
    context.setTouchPoints(e);
    if(typeof context.touchMoved === 'function') {
      e.preventDefault();
      context.touchMoved(e);
    }
  };
  p5.prototype.ontouchend = function(e) {
    var context = this._isGlobal ? window : this;
    context.setTouchPoints(e);
    if(typeof context.touchEnded === 'function') {
      e.preventDefault();
      context.touchEnded(e);
    }
  };

  return p5;

});
