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
     * The bezierPoint() function evaluates quadratic bezier at point t for points a, b, c, d.
     * The parameter t varies between 0 and 1. The a and d parameters are the
     * on-curve points, b and c are the control points. To make a two-dimensional
     * curve, call this function once with the x coordinates and a second time
     * with the y coordinates to get the location of a bezier curve at t.
     *
     * @param {float} a   coordinate of first point on the curve
     * @param {float} b   coordinate of first control point
     * @param {float} c   coordinate of second control point
     * @param {float} d   coordinate of second point on the curve
     * @param {float} t   value between 0 and 1
     * @return {number}
     *
     */
  Processing.prototype.bezierPoint = function(a, b, c, d, t) {
    return (1 - t) * (1 - t) * (1 - t) * a + 3 * (1 - t) * (1 - t) * t * b + 3 * (1 - t) * t * t * c + t * t * t * d;
  };

    /**
     * The bezierTangent() function calculates the tangent of a point on a Bezier curve.
     *
     * @param {float} a   coordinate of first point on the curve
     * @param {float} b   coordinate of first control point
     * @param {float} c   coordinate of second control point
     * @param {float} d   coordinate of second point on the curve
     * @param {float} t   value between 0 and 1
     * @return {number}
     *
     */
  Processing.prototype.bezierTangent = function(a, b, c, d, t) {
    return (3 * t * t * (-a + 3 * b - 3 * c + d) + 6 * t * (a - 2 * b + c) + 3 * (-a + b));
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