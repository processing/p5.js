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

  Processing.prototype.bezierPoint = function() {
    // TODO

  };

  Processing.prototype.bezierTangent = function() {
    // TODO

  };

  Processing.prototype.curve = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    this.curElement.context.moveTo(x1,y1);
    this.curElement.context.beginPath();
    for (var i = 0; i <= this._curveDetail; i++) {
      var t = parseFloat(i/this._curveDetail);
      var x = Processing.prototype.curvePoint(x1,x2,x3,x4,t);
      var y = Processing.prototype.curvePoint(y1,y2,y3,y4,t);
      this.curElement.context.lineTo(x,y);
    }
    this.curElement.context.stroke();
    this.curElement.context.closePath();

    return this;
  };

  /**
   * Sets the resolution at which curves display.
   *
   * The default value is 20.
   *
   * Returns void
   *
   * @param  {Int} resolution of the curves
   */
  Processing.prototype.curveDetail = function(d) {
    this._setProperty('_curveDetail', d);

    return this;
  };

  /**
   * Calculate a point on the Curve
   *
   * Evaluates the Bezier at point t for points a, b, c, d.
   * The parameter t varies between 0 and 1, a and d are points
   * on the curve, and b and c are the control points.
   * This can be done once with the x coordinates and a second time
   * with the y coordinates to get the location of a curve at t.
   *
   * Returns float
   *
   * @param  {Float} a coordinate of first point on the curve
   * @param  {Float} b coordinate of first control point
   * @param  {Float} c coordinate of second control point
   * @param  {Float} d coordinate of second point on the curve
   * @param  {Float} t value between 0 and 1
   */

  Processing.prototype.curvePoint = function(a, b,c, d, t) {
    var t3 = t*t*t,
      t2 = t*t,
      f1 = -0.5 * t3 + t2 - 0.5 * t,
      f2 = 1.5 * t3 - 2.5 * t2 + 1.0,
      f3 = -1.5 * t3 + 2.0 * t2 + 0.5 * t,
      f4 = 0.5 * t3 - 0.5 * t2;

    return a*f1 + b*f2 + c*f3 + d*f4;
  };

  Processing.prototype.curveTangent = function() {
    // TODO

  };

  Processing.prototype.curveTightness = function() {
    // TODO

  };

  return Processing;

});