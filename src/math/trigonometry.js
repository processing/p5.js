define(function (require) {

  'use strict';

  var p5 = require('core');
  var polarGeometry = require('polargeometry');
  var constants = require('constants');

  p5.prototype.acos = function(ratio) {
    if (this.settings.angleMode === constants.RADIANS) {
      return Math.acos(ratio);
    } else {
      return polarGeometry.radiansToDegrees(Math.acos(ratio));
    }
  };

  p5.prototype.asin = function(ratio) {
    if (this.settings.angleMode === constants.RADIANS) {
      return Math.asin(ratio);
    } else {
      return polarGeometry.radiansToDegrees(Math.asin(ratio));
    }
  };

  p5.prototype.atan = function(ratio) {
    if (this.settings.angleMode === constants.RADIANS) {
      return Math.atan(ratio);
    } else {
      return polarGeometry.radiansToDegrees(Math.atan(ratio));
    }
  };

  p5.prototype.atan2 = function (y, x) {
    if (this.settings.angleMode === constants.RADIANS) {
      return Math.atan2(y, x);
    } else {
      return polarGeometry.radiansToDegrees(Math.atan2(y, x));
    }
  };

  p5.prototype.cos = function(angle) {
    if (this.settings.angleMode === constants.RADIANS) {
      return Math.cos(angle);
    } else {
      return Math.cos(this.radians(angle));
    }
  };

  p5.prototype.sin = function(angle) {
    if (this.settings.angleMode === constants.RADIANS) {
      return Math.sin(angle);
    } else {
      return Math.sin(this.radians(angle));
    }
  };

  p5.prototype.tan = function(angle) {
    if (this.settings.angleMode === constants.RADIANS) {
      return Math.tan(angle);
    } else {
      return Math.tan(this.radians(angle));
    }
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
