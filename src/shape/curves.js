define(function (require) {

  'use strict';

  var Processing = require('core');

  Processing.prototype.bezier = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    this.curElement.context.beginPath();
    this.curElement.context.moveTo(x1, y1);
    for (var i = 0; i <= this._bezierDetail; i++) { //for each point as considered by detail, iterate
      var t = i / parseFloat(this._bezierDetail);
      var x = Processing.prototype.bezierPoint(x1, x2, x3, x4, t);
      var y = Processing.prototype.bezierPoint(y1, y2, y3, y4, t);
      this.curElement.context.lineTo(x, y);
    }
    this.curElement.context.stroke();


    return this;
  };

  /**
   * Sets the resolution at which Beziers display.
   *
   * The default value is 20.
   *
   * Returns void
   *
   * @param  {Int} resolution of the curves
   */
  Processing.prototype.bezierDetail = function(d) {
    this._setProperty('_bezierDetail', d);

    return this;
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

  /**
   * Calculates the tangent of a point on a Bezier curve
   *
   * Evaluates the tangent at point t for points a, b, c, d.
   * The parameter t varies between 0 and 1, a and d are points
   * on the curve, and b and c are the control points
   *
   * Returns float
   *
   * @param  {Float} a coordinate of first point on the curve
   * @param  {Float} b coordinate of first control point
   * @param  {Float} c coordinate of second control point
   * @param  {Float} d coordinate of second point on the curve
   * @param  {Float} t value between 0 and 1
   */

  Processing.prototype.bezierTangent = function(a, b, c, d, t) {
    var adjustedT = 1-t;

    return 3*d*Math.pow(t,2) - 3*c*Math.pow(t,2) + 6*c*adjustedT*t - 6*b*adjustedT*t + 3*b*Math.pow(adjustedT,2) - 3*a*Math.pow(adjustedT,2);
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
