define(function (require) {

  'use strict';

  var Processing = require('../core/core');
  var polarGeometry = require('../var/polargeometry');

  Processing.prototype.acos = Math.acos;

  Processing.prototype.asin = Math.asin;

  Processing.prototype.atan = Math.atan;

  Processing.prototype.atan2 = Math.atan2;

  Processing.prototype.cos = function(x) {
    return Math.cos(this.radians(x));
  };

  Processing.prototype.degrees = function(angle) {
    return this.settings.angleMode === 'degrees' ? angle : polarGeometry.radiansToDegrees(angle);
  };

  Processing.prototype.radians = function(angle) {
    return this.settings.angleMode === 'radians' ? angle : polarGeometry.degreesToRadians(angle);
  };

  Processing.prototype.sin = function(x) {
    return Math.sin(this.radians(x));
  };

  Processing.prototype.tan = function(x) {
    return Math.tan(this.radians(x));
  };

  return Processing;

});