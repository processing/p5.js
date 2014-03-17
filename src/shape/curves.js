define(function (require) {

  'use strict';

  var Processing = require('core');

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

  /**
   * Calculate a point on the Bezier Curve
   *
   * Evaluates the Bezier at point t for points a, b, c, d.
   * The parameter t varies between 0 and 1, a and d are points
   * on the curve, and b and c are the control points.
   * This can be done once with the x coordinates and a second time
   * with the y coordinates to get the location of a bezier curve at t.
   *
   * Returns float
   *
   * @param  {Float} a coordinate of first point on the curve
   * @param  {Float} b coordinate of first control point
   * @param  {Float} c coordinate of second control point
   * @param  {Float} d coordinate of second point on the curve
   * @param  {Float} t value between 0 and 1
   */

  Processing.prototype.bezierPoint = function(a, b, c, d, t) {
    var adjustedT = 1-t;

    return Math.pow(adjustedT,3)*a + 3*(Math.pow(adjustedT,2))*t*b + 3*adjustedT*Math.pow(t,2)*c + Math.pow(t,3)*d;
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
