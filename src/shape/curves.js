define(function (require) {

  'use strict';

  var Processing = require('../core/core');

  Processing.prototype.bezier = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    this.curElement.context.beginPath();
    this.curElement.context.moveTo(x1, y1);
    this.curElement.context.bezierCurveTo(x2, y2, x3, y3, x4, y4);
    this.curElement.context.stroke();

    return this;
  };

  Processing.prototype.bezierDetail = function() {
    // TODO

  };

  Processing.prototype.bezierPoint = function() {
    // TODO

  };

  Processing.prototype.bezierTangent = function() {
    // TODO

  };

  Processing.prototype.curve = function() {
    // TODO

  };

  Processing.prototype.curveDetail = function() {
    // TODO

  };

  Processing.prototype.curvePoint = function() {
    // TODO

  };

  Processing.prototype.curveTangent = function() {
    // TODO

  };

  Processing.prototype.curveTightness = function() {
    // TODO

  };

  return Processing;

});