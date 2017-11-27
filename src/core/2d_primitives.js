/**
 * @module Shape
 * @submodule 2D Primitives
 * @for p5
 * @requires core
 * @requires constants
 */

'use strict';

var p5 = require('./core');
var constants = require('./constants');
var canvas = require('./canvas');
require('./error_helpers');

/**
 * Draw an arc to the screen. If called with only a, b, c, d, start, and
 * stop, the arc will be drawn with OPEN mode. If mode is provided, the arc
 * will be drawn either OPEN, as a CHORD, or as a PIE as specified. The
 * origin may be changed with the ellipseMode() function.<br><br>
 *
 * @method arc
 * @param  {Number} a      x-coordinate of the arc's ellipse
 * @param  {Number} b      y-coordinate of the arc's ellipse
 * @param  {Number} c      width of the arc's ellipse by default
 * @param  {Number} d      height of the arc's ellipse by default
 * @param  {Number} start  angle to start the arc, specified in radians
 * @param  {Number} stop   angle to stop the arc, specified in radians
 * @param  {Constant} [mode] optional parameter to determine the way of drawing
 *                         the arc. Specify OPEN (default), CHORD or PIE
 * @param  {Number} [detailX]  (WebGL Only) optional parameter to
 *                         determine the number of verticies on
 *                         the perimiter of the arc. Default is 24.
 * @chainable
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
 * //Two corresponding arcs drawn in OPEN mode
 * arc(50, 45, 70, 70, PI+QUARTER_PI, 0, OPEN);
 * arc(45, 55, 70, 70, 0, PI+QUARTER_PI, OPEN);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * //Two corresponding arcs drawn in CHORD mode
 * arc(50, 45, 70, 70, PI+QUARTER_PI, 0, CHORD);
 * arc(45, 55, 70, 70, 0, PI+QUARTER_PI, CHORD);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * //Two corresponding arcs drawn in PIE mode
 * arc(50, 45, 70, 70, PI+QUARTER_PI, 0, PIE);
 * arc(45, 55, 70, 70, 0, PI+QUARTER_PI, PIE);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * //Arcs do not need to be drawn on a circle
 * //Two corresponding arcs with different heights.
 * arc(45, 50, 70, 70, HALF_PI, PI + HALF_PI, CHORD);
 * arc(55, 50, 70, 35, PI + HALF_PI, HALF_PI, CHORD);
 * </code>
 * </div>
 * @alt
 * shattered outline of an ellipse with a quarter of a white circle bottom-right.
 * white ellipse with black outline with top right missing.
 * white ellipse with top right missing with black outline around shape.
 * white ellipse with top right quarter missing with black outline around.
 * the shape.
 *
 */
p5.prototype.arc = function(x, y, w, h, start, stop, mode, xDetail) {

  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }

  p5._validateParameters('arc', args);
  if (!this._renderer._doStroke && !this._renderer._doFill) {
    return this;
  }
  if (this._angleMode === constants.DEGREES) {
    start = this.radians(start);
    stop = this.radians(stop);
  }

  // Make all angles positive...
  while (start < 0) {
    start += constants.TWO_PI;
  }
  while (stop < 0) {
    stop += constants.TWO_PI;
  }
  // ...and confine them to the interval [0,TWO_PI).
  start %= constants.TWO_PI;
  stop %= constants.TWO_PI;

  // account for full circle
  if (stop === start) {
    stop += constants.TWO_PI;
  }

  // Adjust angles to counter linear scaling.
  if (start <= constants.HALF_PI) {
    start = Math.atan(w / h * Math.tan(start));
  } else  if (start > constants.HALF_PI && start <= 3 * constants.HALF_PI) {
    start = Math.atan(w / h * Math.tan(start)) + constants.PI;
  } else {
    start = Math.atan(w / h * Math.tan(start)) + constants.TWO_PI;
  }
  if (stop <= constants.HALF_PI) {
    stop = Math.atan(w / h * Math.tan(stop));
  } else  if (stop > constants.HALF_PI && stop <= 3 * constants.HALF_PI) {
    stop = Math.atan(w / h * Math.tan(stop)) + constants.PI;
  } else {
    stop = Math.atan(w / h * Math.tan(stop)) + constants.TWO_PI;
  }

  // Exceed the interval if necessary in order to preserve the size and
  // orientation of the arc.
  if (start > stop) {
    stop += constants.TWO_PI;
  }
  // p5 supports negative width and heights for ellipses
  w = Math.abs(w);
  h = Math.abs(h);

  // adjust for ellipseMode
  var vals = canvas.modeAdjust(x, y, w, h, this._renderer._ellipseMode);

  this._renderer.arc(vals.x, vals.y, vals.w, vals.h, start, stop, mode, xDetail);
  return this;
};

/**
 * Draws an ellipse (oval) to the screen. An ellipse with equal width and
 * height is a circle. By default, the first two parameters set the location,
 * and the third and fourth parameters set the shape's width and height. If
 * no height is specified, the value of width is used for both the width and
 * height. If a negative height or width is specified, the absolute value is taken.
 * The origin may be changed with the ellipseMode() function.
 *
 * In WebGL mode, detailX can be used to cause the ellipse to resemble another
 * shape. A value of 6 will produce a hexagon.
 *
 *
 * @method ellipse
 * @param  {Number} x x-coordinate of the ellipse.
 * @param  {Number} y y-coordinate of the ellipse.
 * @param  {Number} w width of the ellipse.
 * @param  {Number} [h] height of the ellipse (default is equal to w)
 * @param  {Number} [detailX]  (WebGL Only) optional parameter to
 *                         determine the number of verticies on
 *                         the perimiter of the ellipse. Default is 24.
 * @chainable
 * @example
 * <div>
 * <code>
 * //A circular ellipse
 * ellipse(50, 50, 55, 55);
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * //An ellipse does not need to be circular
 * ellipse(50, 50, 55, 25);
 * </code>
 * </div>
 * @alt
 *white ellipse with black outline in middle-right of canvas that is 55x55.
 *
 */
p5.prototype.ellipse = function() {
  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }
  // Duplicate 3rd argument if only 3 given.
  if (args.length === 3) {
    args.push(args[2]);
  }

  p5._validateParameters('ellipse', args);
  // p5 supports negative width and heights for rects
  if (args[2] < 0){args[2] = Math.abs(args[2]);}
  if (args[3] < 0){args[3] = Math.abs(args[3]);}
  if (!this._renderer._doStroke && !this._renderer._doFill) {
    return this;
  }
  var vals = canvas.modeAdjust(
    args[0],
    args[1],
    args[2],
    args[3],
    this._renderer._ellipseMode);
  args[0] = vals.x;
  args[1] = vals.y;
  args[2] = vals.w;
  args[3] = vals.h;
  this._renderer.ellipse(args);
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
 * @chainable
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
 *
 * @alt
 *line 78 pixels long running from mid-top to bottom-right of canvas.
 *3 lines of various stroke sizes. Form top, bottom and right sides of a square.
 *
 */
////commented out original
// p5.prototype.line = function(x1, y1, x2, y2) {
//   if (!this._renderer._doStroke) {
//     return this;
//   }
//   if(this._renderer.isP3D){
//   } else {
//     this._renderer.line(x1, y1, x2, y2);
//   }
// };
p5.prototype.line = function() {
  if (!this._renderer._doStroke) {
    return this;
  }
  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }

  p5._validateParameters('line', args);
  //check whether we should draw a 3d line or 2d
  if (this._renderer.isP3D) {
    this._renderer.line(
      args[0],
      args[1],
      args[2],
      args[3],
      args[4],
      args[5]);
  } else {
    this._renderer.line(
      args[0],
      args[1],
      args[2],
      args[3]);
  }
  return this;
};

/**
 * Draws a point, a coordinate in space at the dimension of one pixel.
 * The first parameter is the horizontal value for the point, the second
 * value is the vertical value for the point. The color of the point is
 * determined by the current stroke.
 *
 * @method point
 * @param  {Number} x the x-coordinate
 * @param  {Number} y the y-coordinate
 * @chainable
 * @example
 * <div>
 * <code>
 * point(30, 20);
 * point(85, 20);
 * point(85, 75);
 * point(30, 75);
 * </code>
 * </div>
 *
 * @alt
 *4 points centered in the middle-right of the canvas.
 *
 */
p5.prototype.point = function() {
  if (!this._renderer._doStroke) {
    return this;
  }
  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }

  p5._validateParameters('point', args);
  //check whether we should draw a 3d line or 2d
  if (this._renderer.isP3D) {
    this._renderer.point(
      args[0],
      args[1],
      args[2]
    );
  } else {
    this._renderer.point(
      args[0],
      args[1]
    );
  }
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
 * @param {Number} x1 the x-coordinate of the first point
 * @param {Number} y1 the y-coordinate of the first point
 * @param {Number} x2 the x-coordinate of the second point
 * @param {Number} y2 the y-coordinate of the second point
 * @param {Number} x3 the x-coordinate of the third point
 * @param {Number} y3 the y-coordinate of the third point
 * @param {Number} x4 the x-coordinate of the fourth point
 * @param {Number} y4 the y-coordinate of the fourth point
 * @chainable
 * @example
 * <div>
 * <code>
 * quad(38, 31, 86, 20, 69, 63, 30, 76);
 * </code>
 * </div>
 *
 * @alt
 *irregular white quadrilateral shape with black outline mid-right of canvas.
 *
 */
/**
 * @method quad
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} x3
 * @param {Number} y3
 * @param {Number} x4
 * @param {Number} y4
 * @chainable
 */
p5.prototype.quad = function() {
  if (!this._renderer._doStroke && !this._renderer._doFill) {
    return this;
  }
  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }

  p5._validateParameters('quad', args);
  if (this._renderer.isP3D) {
    this._renderer.quad(
      args[0],
      args[1],
      args[2],
      args[3],
      args[4],
      args[5],
      args[6],
      args[7],
      args[8],
      args[9],
      args[10],
      args[11]
    );
  } else {
    this._renderer.quad(
      args[0],
      args[1],
      args[2],
      args[3],
      args[4],
      args[5],
      args[6],
      args[7]
    );
  }
  return this;
};

/**
* Draws a rectangle to the screen. A rectangle is a four-sided shape with
* every angle at ninety degrees. By default, the first two parameters set
* the location of the upper-left corner, the third sets the width, and the
* fourth sets the height. The way these parameters are interpreted, however,
* may be changed with the rectMode() function.
* <br><br>
* The fifth, sixth, seventh and eighth parameters, if specified,
* determine corner radius for the top-right, top-left, lower-right and
* lower-left corners, respectively. An omitted corner radius parameter is set
* to the value of the previously specified radius value in the parameter list.
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
* // Draw a rectangle at location (30, 20) with a width and height of 55.
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
* rect(30, 20, 55, 55, 20, 15, 10, 5);
* </code>
* </div>
*
* @alt
* 55x55 white rect with black outline in mid-right of canvas.
* 55x55 white rect with black outline and rounded edges in mid-right of canvas.
* 55x55 white rect with black outline and rounded edges of different radii.
*/
/**
* @method rect
* @param  {Number} x
* @param  {Number} y
* @param  {Number} w
* @param  {Number} h
* @param  {Number} [detailX]
* @param  {Number} [detailY]
* @chainable
*/
p5.prototype.rect = function() {
  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }
  if (!this._renderer._doStroke && !this._renderer._doFill) {
    return this;
  }

  p5._validateParameters('rect', args);
  var vals = canvas.modeAdjust(
    args[0],
    args[1],
    args[2],
    args[3],
    this._renderer._rectMode);
  args[0] = vals.x;
  args[1] = vals.y;
  args[2] = vals.w;
  args[3] = vals.h;
  this._renderer.rect(args);
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
* @chainable
* @example
* <div>
* <code>
* triangle(30, 75, 58, 20, 86, 75);
* </code>
* </div>
*
*@alt
* white triangle with black outline in mid-right of canvas.
*
*/
p5.prototype.triangle = function() {

  if (!this._renderer._doStroke && !this._renderer._doFill) {
    return this;
  }
  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }

  p5._validateParameters('triangle', args);
  this._renderer.triangle(args);
  return this;
};

module.exports = p5;
