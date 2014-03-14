define(function (require) {

  'use strict';

  var p5 = require('core');
  var polarGeometry = require('polargeometry');
  var constants = require('constants');

  p5.prototype.acos = Math.acos;

  p5.prototype.asin = Math.asin;

  p5.prototype.atan = Math.atan;

  p5.prototype.atan2 = Math.atan2;

  p5.prototype.cos = function(x) {
    return Math.cos(this.radians(x));
  };

  p5.prototype.degrees = function(angle) {
    return this.settings.angleMode === constants.DEGREES ? angle : polarGeometry.radiansToDegrees(angle);
  };

  p5.prototype.radians = function(angle) {
    return this.settings.angleMode === constants.RADIANS ? angle : polarGeometry.degreesToRadians(angle);
  };

  p5.prototype.sin = function(x) {
    return Math.sin(this.radians(x));
  };

  p5.prototype.tan = function(x) {
    return Math.tan(this.radians(x));
  };

  p5.prototype.angleMode = function(mode) {
    if (mode === constants.DEGREES || mode === constants.RADIANS) {
      this.settings.angleMode = mode;
    }
  };

  return p5;

});