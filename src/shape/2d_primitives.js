/**
 * @module Shape
 * @submodule 2D Primitives
 * @for p5
 * @requires core
 * @requires constants
 */
define(function (require) {

  'use strict';

  var p5 = require('core');
  var constants = require('constants');

  // source: https://sites.google.com/site/hansmuller/flex-blog/CircularArc.mxml
  // blog post: http://hansmuller-flex.blogspot.ca/
  //            2011/04/approximating-circular-arc-with-cubic.html
  // update to blog post: http://hansmuller-flex.blogspot.com/2011/10/
  //                      more-about-approximating-circular-arcs.html

  var EPSILON = 0.00001;  // Roughly 1/1000th of a degree, see below

  /**
   *  Return a array of objects that represent bezier curves which approximate 
   *  the circular arc centered at the origin, from startAngle to endAngle 
   *  (radians) with the specified radius.
   *
   *  Each bezier curve is an object with four points, where x1,y1 and
   *  x4,y4 are the arc's end points and x2,y2 and x3,y3 are the cubic bezier's
   *  control points.
   */
  p5.prototype._createArc = function(radius, startAngle, endAngle) {
    var twoPI = Math.PI * 2;

    var curves = [];
    var piOverTwo = Math.PI / 2.0;
    var sgn = (startAngle < endAngle) ? 1 : -1;

    var a1 = startAngle;
    var totalAngle = Math.min(twoPI, Math.abs(endAngle - startAngle));
    while (totalAngle > EPSILON) {
      var a2 = a1 + sgn * Math.min(totalAngle, piOverTwo);
      curves.push(this._createSmallArc(radius, a1, a2));
      totalAngle -= Math.abs(a2 - a1);
      a1 = a2;
    }

    return curves;
  };

  /**
   *  Cubic bezier approximation of a circular arc centered at the origin,
   *  from (radians) a1 to a2, where a2-a1 < pi/2.  The arc's radius is r.
   *
   *  Returns an object with four points, where x1,y1 and x4,y4 are the arc's 
   *  end points and x2,y2 and x3,y3 are the cubic bezier's control points.
   *
   *  This algorithm is based on the approach described in:
   *  A. Riškus, "Approximation of a Cubic Bezier Curve by Circular Arcs and 
   *  Vice Versa," Information Technology and Control, 35(4), 2006 pp. 371-378.
   */
  p5.prototype._createSmallArc = function(r, a1, a2) {
    // Compute all four points for an arc that subtends the same total angle
    // but is centered on the X-axis

    var a = (a2 - a1) / 2.0; // 

    var x4 = r * Math.cos(a);
    var y4 = r * Math.sin(a);
    var x1 = x4;
    var y1 = -y4;

    var q1 = x1*x1 + y1*y1;
    var q2 = q1 + x1*x4 + y1*y4;
    var k2 = 4/3 * (Math.sqrt(2 * q1 * q2) - q2) / (x1 * y4 - y1 * x4);

    var x2 = x1 - k2 * y1;
    var y2 = y1 + k2 * x1;
    var x3 = x2;
    var y3 = -y2;

    // Find the arc points actual locations by computing x1,y1 and x4,y4 
    // and rotating the control points by a + a1

    var ar = a + a1;
    var cos_ar = Math.cos(ar);
    var sin_ar = Math.sin(ar);

    return {
      x1: r * Math.cos(a1),
      y1: r * Math.sin(a1),
      x2: x2 * cos_ar - y2 * sin_ar,
      y2: x2 * sin_ar + y2 * cos_ar,
      x3: x3 * cos_ar - y3 * sin_ar,
      y3: x3 * sin_ar + y3 * cos_ar,
      x4: r * Math.cos(a2),
      y4: r * Math.sin(a2)
    };
  };

  /**
   * Draw an arc.
   *
   * If a,b,c,d,start and stop are the only params provided, draws an
   * open pie.
   *
   * If mode is provided draws the arc either open, chord or pie, dependent
   * on the variable provided.
   * 
   * @method arc
   * @param  {Number} a      x-coordinate of the arc's ellipse
   * @param  {Number} b      y-coordinate of the arc's ellipse
   * @param  {Number} c      width of the arc's ellipse by default
   * @param  {Number} d      height of the arc's ellipse by default
   * @param  {Number} start  angle to start the arc, specified in radians
   * @param  {Number} stop   angle to stop the arc, specified in radians
   * @param  {String} [mode] optional parameter to determine the way of drawing
   *                         the arc
   * @return {Object}        the p5 object
   * @example
   * <div>
   * <code>
   * arc(50, 55, 50, 50, 0, HALF_PI);
   * noFill();
   * arc(50, 55, 60, 60, HALF_PI, PI);
   * arc(50, 55, 70, 70, PI, PI+QUARTER_PI);
   * arc(50, 55, 80, 80, PI+QUARTER_PI, TWO_PI);
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * arc(50, 50, 80, 80, 0, PI+QUARTER_PI, OPEN);
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * arc(50, 50, 80, 80, 0, PI+QUARTER_PI, CHORD);
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * arc(50, 50, 80, 80, 0, PI+QUARTER_PI, PIE);
   * </code>
   * </div>
   */
	p5.prototype.arc = function(x, y, width, height, start, stop, mode) {
    if (!this._doStroke && !this._doFill) {
      return this;
    }
    if (this._angleMode === constants.DEGREES) {
      start = this.radians(start);
      stop = this.radians(stop);
    }
    var curves = this._createArc(1.0, start, stop);
    this._graphics.arc(x, y, width, height, start, stop, mode, curves);
    return this;
  };

  /**
   * Draws an ellipse (oval) to the screen. An ellipse with equal width and
   * height is a circle. By default, the first two parameters set the location,
   * and the third and fourth parameters set the shape's width and height. The
   * origin may be changed with the ellipseMode() function. 
   * 
   * @method ellipse
   * @param  {Number} a x-coordinate of the ellipse.
   * @param  {Number} b y-coordinate of the ellipse.
   * @param  {Number} c width of the ellipse.
   * @param  {Number} d height of the ellipse.
   * @return {p5}       the p5 object
   * @example
   * <div>
   * <code>
   * ellipse(56, 46, 55, 55);
   * </code>
   * </div>
   */
  p5.prototype.ellipse = function(x, y, w, h) {
    if (!this._doStroke && !this._doFill) {
      return this;
    }
    // p5 supports negative width and heights for ellipses
    w = Math.abs(w);
    h = Math.abs(h);
    //@TODO add catch block here if this._graphics 
    //doesn't have the method implemented yet
    this._graphics.ellipse(x, y, w, h);
    return this;
  };
  /**
   * Draws a line (a direct path between two points) to the screen. The version
   * of line() with four parameters draws the line in 2D. To color a line, use
   * the stroke() function. A line cannot be filled, therefore the fill()
   * function will not affect the color of a line. 2D lines are drawn with a
   * width of one pixel by default, but this can be changed with the
   * strokeWeight() function.
   * 
   * @method line
   * @param  {Number} x1 the x-coordinate of the first point
   * @param  {Number} y1 the y-coordinate of the first point
   * @param  {Number} x2 the x-coordinate of the second point
   * @param  {Number} y2 the y-coordinate of the second point
   * @return {p5}        the p5 object
   * @example
   * <div>
   * <code>
   * line(30, 20, 85, 75);
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * line(30, 20, 85, 20);
   * stroke(126);
   * line(85, 20, 85, 75);
   * stroke(255);
   * line(85, 75, 30, 75);
   * </code>
   * </div>
   */
  
  ////commented out original
  // p5.prototype.line = function(x1, y1, x2, y2) {
  //   if (!this._doStroke) {
  //     return this;
  //   }
  //   if(this._graphics.isP3D){
  //   } else {
  //     this._graphics.line(x1, y1, x2, y2);      
  //   }
  // };
  p5.prototype.line = function() {
    if (!this._doStroke) {
      return this;
    }
    //check whether we should draw a 3d line or 2d
    if(this._graphics.isP3D){
      this._graphics.line(arguments[0],
        arguments[1],
        arguments[2],
        arguments[3],
        arguments[4],
        arguments[5]);
    } else {
      this._graphics.line(arguments[0],
        arguments[1],
        arguments[2],
        arguments[3]);
    }
  };

  /**
   * Draws a point, a coordinate in space at the dimension of one pixel.
   * The first parameter is the horizontal value for the point, the second
   * value is the vertical value for the point.
   * 
   * @method point
   * @param  {Number} x the x-coordinate
   * @param  {Number} y the y-coordinate
   * @return {p5}       the p5 object
   * @example
   * <div>
   * <code>
   * point(30, 20);
   * point(85, 20);
   * point(85, 75);
   * point(30, 75);
   * </code>
   * </div>
   */
  p5.prototype.point = function(x, y) {
    if (!this._doStroke) {
      return this;
    }
    this._graphics.point(x, y);
    return this;
  };


  /**
   * Draw a quad. A quad is a quadrilateral, a four sided polygon. It is
   * similar to a rectangle, but the angles between its edges are not
   * constrained to ninety degrees. The first pair of parameters (x1,y1)
   * sets the first vertex and the subsequent pairs should proceed
   * clockwise or counter-clockwise around the defined shape.
   * 
   * @method quad
   * @param {type} x1 the x-coordinate of the first point
   * @param {type} y1 the y-coordinate of the first point 
   * @param {type} x2 the x-coordinate of the second point
   * @param {type} y2 the y-coordinate of the second point
   * @param {type} x3 the x-coordinate of the third point
   * @param {type} y3 the y-coordinate of the third point
   * @param {type} x4 the x-coordinate of the fourth point
   * @param {type} y4 the y-coordinate of the fourth point
   * @return {p5}     the p5 object
   * @example
   * <div>
   * <code>   
   * quad(38, 31, 86, 20, 69, 63, 30, 76);
   * </code>
   * </div>
   */
  p5.prototype.quad = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    if (!this._doStroke && !this._doFill) {
      return this;
    }
    this._graphics.quad(x1, y1, x2, y2, x3, y3, x4, y4);
    return this;
  };

  /**
  * Draws a rectangle to the screen. A rectangle is a four-sided shape with
  * every angle at ninety degrees. By default, the first two parameters set
  * the location of the upper-left corner, the third sets the width, and the
  * fourth sets the height. The way these parameters are interpreted, however,
  * may be changed with the rectMode() function. If provided, the fifth, sixth
  * seventh and eighth parameters, if specified, determine corner radius for
  * the top-right, top-left, lower-right and lower-left corners, respectively.
  * An omitted corner radius parameter is set to the value of the previously
  * specified radius value in the parameter list.
  *
  * @method rect
  * @param  {Number} x  x-coordinate of the rectangle.
  * @param  {Number} y  y-coordinate of the rectangle.
  * @param  {Number} w  width of the rectangle.
  * @param  {Number} h  height of the rectangle.
  * @param  {Number} [tl] optional radius of top-left corner.
  * @param  {Number} [tr] optional radius of top-right corner.
  * @param  {Number} [br] optional radius of bottom-right corner.
  * @param  {Number} [bl] optional radius of bottom-left corner.
  * @return {p5}          the p5 object.
  * @example
  * <div>
  * <code>
  * // Draw a rectangle at location (30, 25) with a width and height of 55.
  * rect(30, 20, 55, 55);
  * </code>
  * </div>
  *
  * <div>
  * <code>
  * // Draw a rectangle with rounded corners, each having a radius of 20.
  * rect(30, 20, 55, 55, 20);
  * </code>
  * </div>
  *
  * <div>
  * <code>
  * // Draw a rectangle with rounded corners having the following radii:
  * // top-left = 20, top-right = 15, bottom-right = 10, bottom-left = 5.
  * rect(30, 20, 55, 55, 20, 15, 10, 5)
  * </code>
  * </div>
  */

  p5.prototype.rect = function (x, y, w, h, tl, tr, br, bl) {
    if (!this._doStroke && !this._doFill) {
      return;
    }
    this._graphics.rect(x, y, w, h, tl, tr, br, bl);
    return this;
  };

  /**
  * A triangle is a plane created by connecting three points. The first two
  * arguments specify the first point, the middle two arguments specify the
  * second point, and the last two arguments specify the third point.
  * 
  * @method triangle
  * @param  {Number} x1 x-coordinate of the first point
  * @param  {Number} y1 y-coordinate of the first point
  * @param  {Number} x2 x-coordinate of the second point
  * @param  {Number} y2 y-coordinate of the second point
  * @param  {Number} x3 x-coordinate of the third point
  * @param  {Number} y3 y-coordinate of the third point
  * @return {p5}        the p5 object
  * @example
  * <div>
  * <code>
  * triangle(30, 75, 58, 20, 86, 75);
  * </code>
  * </div>
  */
  p5.prototype.triangle = function(x1, y1, x2, y2, x3, y3) {
    if (!this._doStroke && !this._doFill) {
      return this;
    }
    this._graphics.triangle(x1, y1, x2, y2, x3, y3);
    return this;
  };

  return p5;

});