define(function (require) {

  'use strict';

  var Processing = require('core');
  var polarGeometry = require('polargeometry');
  var constants = require('constants');

  Processing.prototype.acos = Math.acos;

  Processing.prototype.asin = Math.asin;

  Processing.prototype.atan = Math.atan;

  Processing.prototype.atan2 = Math.atan2;

  Processing.prototype.cos = function(x) {
    return Math.cos(this.radians(x));
  };

  Processing.prototype.degrees = function(angle) {
    return this.settings.angleMode === constants.DEGREES ? angle : polarGeometry.radiansToDegrees(angle);
  };

  Processing.prototype.radians = function(angle) {
    return this.settings.angleMode === constants.RADIANS ? angle : polarGeometry.degreesToRadians(angle);
  };

  Processing.prototype.sin = function(x) {
    return Math.sin(this.radians(x));
  };

  Processing.prototype.tan = function(x) {
    return Math.tan(this.radians(x));
  };

  Processing.prototype.angleMode = function(mode) {
    if (mode === constants.DEGREES || mode === constants.RADIANS) {
      this.settings.angleMode = mode;
    }
  };

  return Processing;

});