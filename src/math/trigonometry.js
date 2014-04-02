define(function (require) {

  'use strict';

  var p5 = require('core');
  var polarGeometry = require('polargeometry');
  var constants = require('constants');

  p5.prototype.acos = function(x) {
    return Math.acos(this.radians(x));
  };

  p5.prototype.asin = function(x) {
    return Math.asin(this.radians(x));
  };

  p5.prototype.atan = function(x) {
    return Math.atan(this.radians(x));
  };

  p5.prototype.atan2 = function (y, x) {
    if (this.settings.angleMode === constants.RADIANS) {
      return Math.atan2(y, x);
    } else {
      return polarGeometry.radiansToDegrees(Math.atan2(y, x));
    }
  };

  p5.prototype.cos = function(x) {
    return Math.cos(this.radians(x));
  };

  p5.prototype.sin = function(x) {
    return Math.sin(this.radians(x));
  };

  p5.prototype.tan = function(x) {
    return Math.tan(this.radians(x));
  };

  p5.prototype.degrees = function(angle) {
    return polarGeometry.radiansToDegrees(angle);
  };

  p5.prototype.radians = function(angle) {
    return polarGeometry.degreesToRadians(angle);
  };

  p5.prototype.angleMode = function(mode) {
    if (mode === constants.DEGREES || mode === constants.RADIANS) {
      this.settings.angleMode = mode;

    }
  };

  return p5;

});
