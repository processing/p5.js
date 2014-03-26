define(function (require) {

  'use strict';

  var p5 = require('core');

  p5.prototype.bezier = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    this.curElement.context.beginPath();
    this.curElement.context.moveTo(x1, y1);
    for (var i = 0; i <= this._bezierDetail; i++) { //for each point as considered by detail, iterate
      var t = i / parseFloat(this._bezierDetail);
      var x = p5.prototype.bezierPoint(x1, x2, x3, x4, t);
      var y = p5.prototype.bezierPoint(y1, y2, y3, y4, t);
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
   * @param  {Number} resolution of the curves
   */
  p5.prototype.bezierDetail = function(d) {
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
   * Returns Number
   *
   * @param  {Number} a coordinate of first point on the curve
   * @param  {Number} b coordinate of first control point
   * @param  {Number} c coordinate of second control point
   * @param  {Number} d coordinate of second point on the curve
   * @param  {Number} t value between 0 and 1
   */

  p5.prototype.bezierPoint = function(a, b, c, d, t) {
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
   * Returns Number
   *
   * @param  {Number} a coordinate of first point on the curve
   * @param  {Number} b coordinate of first control point
   * @param  {Number} c coordinate of second control point
   * @param  {Number} d coordinate of second point on the curve
   * @param  {Number} t value between 0 and 1
   */

  p5.prototype.bezierTangent = function(a, b, c, d, t) {
    var adjustedT = 1-t;

    return 3*d*Math.pow(t,2) - 3*c*Math.pow(t,2) + 6*c*adjustedT*t - 6*b*adjustedT*t + 3*b*Math.pow(adjustedT,2) - 3*a*Math.pow(adjustedT,2);
  };

  p5.prototype.curve = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    this.curElement.context.moveTo(x1,y1);
    this.curElement.context.beginPath();
    for (var i = 0; i <= this._curveDetail; i++) {
      var t = parseFloat(i/this._curveDetail);
      var x = p5.prototype.curvePoint(x1,x2,x3,x4,t);
      var y = p5.prototype.curvePoint(y1,y2,y3,y4,t);
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
   * @param  {Number} resolution of the curves
   */
  p5.prototype.curveDetail = function(d) {
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
   * Returns Number
   *
   * @param  {Number} a coordinate of first point on the curve
   * @param  {Number} b coordinate of first control point
   * @param  {Number} c coordinate of second control point
   * @param  {Number} d coordinate of second point on the curve
   * @param  {Number} t value between 0 and 1
   */

  p5.prototype.curvePoint = function(a, b,c, d, t) {
    var t3 = t*t*t,
      t2 = t*t,
      f1 = -0.5 * t3 + t2 - 0.5 * t,
      f2 = 1.5 * t3 - 2.5 * t2 + 1.0,
      f3 = -1.5 * t3 + 2.0 * t2 + 0.5 * t,
      f4 = 0.5 * t3 - 0.5 * t2;
    return a*f1 + b*f2 + c*f3 + d*f4;
  };

  /**
   * Calculates the tangent of a point on a curve
   *
   * Evaluates the tangent at point t for points a, b, c, d.
   * The parameter t varies between 0 and 1, a and d are points
   * on the curve, and b and c are the control points
   *
   * Returns Number
   *
   * @param  {Number} a coordinate of first point on the curve
   * @param  {Number} b coordinate of first control point
   * @param  {Number} c coordinate of second control point
   * @param  {Number} d coordinate of second point on the curve
   * @param  {Number} t value between 0 and 1
   */

  p5.prototype.curveTangent = function(a, b,c, d, t) {
    var t2 = t*t,
      f1 = (-3*t2)/2 + 2*t - 0.5,
      f2 = (9*t2)/2 - 5*t,
      f3 = (-9*t2)/2 + 4*t + 0.5,
      f4 = (3*t2)/2 - t;
    return a*f1 + b*f2 + c*f3 + d*f4;
  };

  p5.prototype.curveTightness = function() {
    // TODO

  };

  return p5;

});