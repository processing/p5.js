define(function (require) {

  'use strict';

  var Processing = require('../core/core');

  Processing.prototype.day = function() {
    return new Date().getDate();
  };

  Processing.prototype.hour = function() {
    return new Date().getHours();
  };

  Processing.prototype.minute = function() {
    return new Date().getMinutes();
  };

  Processing.prototype.millis = function() {
    return new Date().getTime() - this.startTime;
  };

  Processing.prototype.month = function() {
    return new Date().getMonth();
  };

  Processing.prototype.second = function() {
    return new Date().getSeconds();
  };

  Processing.prototype.year = function() {
    return new Date().getFullYear();
  };

  return Processing;

});