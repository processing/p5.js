define(function (require) {

  'use strict';

  var p5 = require('core');

  p5.prototype.day = function() {
    return new Date().getDate();
  };

  p5.prototype.hour = function() {
    return new Date().getHours();
  };

  p5.prototype.minute = function() {
    return new Date().getMinutes();
  };

  p5.prototype.millis = function() {
    return new Date().getTime() - this._startTime;
  };

  p5.prototype.month = function() {
    return new Date().getMonth();
  };

  p5.prototype.second = function() {
    return new Date().getSeconds();
  };

  p5.prototype.year = function() {
    return new Date().getFullYear();
  };

  return p5;

});