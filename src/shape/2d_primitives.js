/**
 * @module Shape
 * @submodule 2D Primitives
 * @for p5
 * @requires core
 * @requires canvas
 * @requires constants
 */
define(function (require) {

  'use strict';

  var p5 = require('core');
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
    this._graphics.arc(x, y, width, height, start, stop, mode);
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
  p5.prototype.ellipse = function(x, y, width, height) {
    if (!this._doStroke && !this._doFill) {
      return this;
    }
    this._graphics.ellipse(x, y, width, height);
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
  p5.prototype.line = function(x1, y1, x2, y2) {
    if (!this._doStroke) {
      return this;
    }
    this._graphics.line(x1, y1, x2, y2);
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
  * may be changed with the rectMode() function.
  *
  * @method rect
  * @param  {Number} a x-coordinate of the rectangle
  * @param  {Number} b y-coordinate of the rectangle
  * @param  {Number} c width of the rectangle
  * @param  {Number} d height of the rectangle
  * @return {p5}       the p5 object
  * @example
  * <div>
  * <code>
  * rect(30, 20, 55, 55);
  * </code>
  * </div>
  */
  p5.prototype.rect = function(a, b, c, d) {
    if (!this._doStroke && !this._doFill) {
      return;
    }
    this._graphics.rect(a, b, c, d);
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
