define(function (require) {

  'use strict';

  var p5 = require('core');

  p5.prototype.bezier = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    this.curElement.context.beginPath();
    this.curElement.context.moveTo(x1, y1);
    this.curElement.context.bezierCurveTo(x2, y2, x3, y3, x4, y4);
    this.curElement.context.stroke();

    return this;
  };

  p5.prototype.bezierDetail = function() {
    // TODO

  };

  p5.prototype.bezierPoint = function() {
    // TODO

  };

  p5.prototype.bezierTangent = function() {
    // TODO

  };

  p5.prototype.curve = function() {
    // TODO

  };

  p5.prototype.curveDetail = function() {
    // TODO

  };

  p5.prototype.curvePoint = function() {
    // TODO

  };

  p5.prototype.curveTangent = function() {
    // TODO

  };

  p5.prototype.curveTightness = function() {
    // TODO

  };

  return p5;

});