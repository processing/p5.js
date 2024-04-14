/**
 * @module Shape
 * @submodule Attributes
 * @for p5
 * @requires core
 * @requires constants
 */

import p5 from '../main';
import * as constants from '../constants';

/**
 * Modifies the location from which ellipses, circles, and arcs are drawn. By default, the
 * first two parameters are the x- and y-coordinates of the shape's center. The next
 * parameters are its width and height. This is equivalent to calling `ellipseMode(CENTER)`.
 *
 * `ellipseMode(RADIUS)` also uses the first two parameters to set the x- and y-coordinates
 * of the shape's center. The next parameters are half of the shapes's width and height.
 * Calling `ellipse(0, 0, 10, 15)` draws a shape with a width of 20 and height of 30.
 *
 * `ellipseMode(CORNER)` uses the first two parameters as the upper-left corner of the
 * shape. The next parameters are its width and height.
 *
 * `ellipseMode(CORNERS)` uses the first two parameters as the location of one corner
 * of the ellipse's bounding box. The third and fourth parameters are the location of the
 * opposite corner.
 *
 * The argument passed to `ellipseMode()` must be written in ALL CAPS because the constants
 * `CENTER`, `RADIUS`, `CORNER`, and `CORNERS` are defined this way. JavaScript is a
 * case-sensitive language.
 *
 * @method ellipseMode
 * @param  {(CENTER|RADIUS|CORNER|CORNERS)} mode either CENTER, RADIUS, CORNER, or CORNERS
 * @chainable
 * @example
 * <div>
 * <code>
 * ellipseMode(RADIUS);
 * fill(255);
 * ellipse(50, 50, 30, 30);
 * ellipseMode(CENTER);
 * fill(100);
 * ellipse(50, 50, 30, 30);
 * describe('A white circle with a gray circle at its center. Both circles have black outlines.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * ellipseMode(CORNER);
 * fill(255);
 * ellipse(25, 25, 50, 50);
 * ellipseMode(CORNERS);
 * fill(100);
 * ellipse(25, 25, 50, 50);
 * describe('A white circle with a gray circle at its top-left corner. Both circles have black outlines.');
 * </code>
 * </div>
 */
p5.prototype.ellipseMode = function(m) {
  p5._validateParameters('ellipseMode', arguments);
  if (
    m === constants.CORNER ||
    m === constants.CORNERS ||
    m === constants.RADIUS ||
    m === constants.CENTER
  ) {
    this._renderer._ellipseMode = m;
  }
  return this;
};

/**
 * Draws all geometry with jagged (aliased) edges.
 *
 * <a href="#/p5/smooth">smooth()</a> is active by default in 2D mode. It's necessary to call
 * <a href="#/p5/noSmooth">noSmooth()</a> to disable smoothing of geometry, images, and fonts.
 *
 * In WebGL mode, <a href="#/p5/noSmooth">noSmooth()</a> is active by default. It's necessary
 * to call <a href="#/p5/smooth">smooth()</a> to draw smooth (antialiased) edges.
 *
 * @method noSmooth
 * @chainable
 * @example
 * <div>
 * <code>
 * background(0);
 * noStroke();
 * smooth();
 * ellipse(30, 48, 36, 36);
 * noSmooth();
 * ellipse(70, 48, 36, 36);
 * describe('Two pixelated white circles on a black background.');
 * </code>
 * </div>
 */
p5.prototype.noSmooth = function() {
  if (!this._renderer.isP3D) {
    if ('imageSmoothingEnabled' in this.drawingContext) {
      this.drawingContext.imageSmoothingEnabled = false;
    }
  } else {
    this.setAttributes('antialias', false);
  }
  return this;
};

/**
 * Modifies the location from which rectangles and squares are drawn. By default,
 * the first two parameters are the x- and y-coordinates of the shape's upper-left
 * corner. The next parameters are its width and height. This is equivalent to
 * calling `rectMode(CORNER)`.
 *
 * `rectMode(CORNERS)` also uses the first two parameters as the location of one of
 * the corners. The third and fourth parameters are the location of the opposite
 * corner.
 *
 * `rectMode(CENTER)` uses the first two parameters as the x- and y-coordinates of
 * the shape's center. The next parameters are its width and height.
 *
 * `rectMode(RADIUS)` also uses the first two parameters as the x- and y-coordinates
 * of the shape's center. The next parameters are half of the shape's width and
 * height.
 *
 * The argument passed to `rectMode()` must be written in ALL CAPS because the
 * constants `CENTER`, `RADIUS`, `CORNER`, and `CORNERS` are defined this way.
 * JavaScript is a case-sensitive language.
 *
 * @method rectMode
 * @param  {(CENTER|RADIUS|CORNER|CORNERS)} mode either CORNER, CORNERS, CENTER, or RADIUS
 * @chainable
 * @example
 * <div>
 * <code>
 * rectMode(CORNER);
 * fill(255);
 * rect(25, 25, 50, 50);
 *
 * rectMode(CORNERS);
 * fill(100);
 * rect(25, 25, 50, 50);
 *
 * describe('A small gray square drawn at the top-left corner of a white square.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * rectMode(RADIUS);
 * fill(255);
 * rect(50, 50, 30, 30);
 *
 * rectMode(CENTER);
 * fill(100);
 * rect(50, 50, 30, 30);
 *
 * describe('A small gray square drawn at the center of a white square.');
 * </code>
 * </div>
 */
p5.prototype.rectMode = function(m) {
  p5._validateParameters('rectMode', arguments);
  if (
    m === constants.CORNER ||
    m === constants.CORNERS ||
    m === constants.RADIUS ||
    m === constants.CENTER
  ) {
    this._renderer._rectMode = m;
  }
  return this;
};

/**
 * Draws all geometry with smooth (anti-aliased) edges. <a href="#/p5/smooth">smooth()</a> will also
 * improve image quality of resized images.
 *
 * <a href="#/p5/smooth">smooth()</a> is active by default in 2D mode. It's necessary to call
 * <a href="#/p5/noSmooth">noSmooth()</a> to disable smoothing of geometry, images, and fonts.
 *
 * In WebGL mode, <a href="#/p5/noSmooth">noSmooth()</a> is active by default. It's necessary
 * to call <a href="#/p5/smooth">smooth()</a> to draw smooth (antialiased) edges.
 *
 * @method smooth
 * @chainable
 * @example
 * <div>
 * <code>
 * background(0);
 * noStroke();
 * smooth();
 * ellipse(30, 48, 36, 36);
 * noSmooth();
 * ellipse(70, 48, 36, 36);
 * describe('Two pixelated white circles on a black background.');
 * </code>
 * </div>
 */
p5.prototype.smooth = function() {
  this.setAttributes('antialias', true);
  if (!this._renderer.isP3D) {
    if ('imageSmoothingEnabled' in this.drawingContext) {
      this.drawingContext.imageSmoothingEnabled = true;
    }
  }
  return this;
};

/**
 * Sets the style for rendering line endings. These ends are either rounded
 * (`ROUND`), squared (`SQUARE`), or extended (`PROJECT`). The default cap is
 * `ROUND`.
 *
 * The argument passed to `strokeCap()` must be written in ALL CAPS because
 * the constants `ROUND`, `SQUARE`, and `PROJECT` are defined this way.
 * JavaScript is a case-sensitive language.
 *
 * @method strokeCap
 * @param  {(ROUND|SQUARE|PROJECT)} cap either ROUND, SQUARE, or PROJECT
 * @chainable
 * @example
 * <div>
 * <code>
 * strokeWeight(12.0);
 * strokeCap(ROUND);
 * line(20, 30, 80, 30);
 * strokeCap(SQUARE);
 * line(20, 50, 80, 50);
 * strokeCap(PROJECT);
 * line(20, 70, 80, 70);
 * describe('Three horizontal lines. The top line has rounded ends, the middle line has squared ends, and the bottom line has longer, squared ends.');
 * </code>
 * </div>
 */
p5.prototype.strokeCap = function(cap) {
  p5._validateParameters('strokeCap', arguments);
  if (
    cap === constants.ROUND ||
    cap === constants.SQUARE ||
    cap === constants.PROJECT
  ) {
    this._renderer.strokeCap(cap);
  }
  return this;
};

/**
 * Sets the style of the joints which connect line segments. These joints are
 * either mitered (`MITER`), beveled (`BEVEL`), or rounded (`ROUND`). The default
 * joint is `MITER` in 2D mode and `ROUND` in WebGL mode.
 *
 * The argument passed to `strokeJoin()` must be written in ALL CAPS because
 * the constants `MITER`, `BEVEL`, and `ROUND` are defined this way.
 * JavaScript is a case-sensitive language.
 *
 * @method strokeJoin
 * @param  {(MITER|BEVEL|ROUND)} join either MITER, BEVEL, or ROUND
 * @chainable
 * @example
 * <div>
 * <code>
 * noFill();
 * strokeWeight(10.0);
 * strokeJoin(MITER);
 * beginShape();
 * vertex(35, 20);
 * vertex(65, 50);
 * vertex(35, 80);
 * endShape();
 * describe('A right-facing arrowhead shape with a pointed tip in center of canvas.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * noFill();
 * strokeWeight(10.0);
 * strokeJoin(BEVEL);
 * beginShape();
 * vertex(35, 20);
 * vertex(65, 50);
 * vertex(35, 80);
 * endShape();
 * describe('A right-facing arrowhead shape with a flat tip in center of canvas.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * noFill();
 * strokeWeight(10.0);
 * strokeJoin(ROUND);
 * beginShape();
 * vertex(35, 20);
 * vertex(65, 50);
 * vertex(35, 80);
 * endShape();
 * describe('A right-facing arrowhead shape with a rounded tip in center of canvas.');
 * </code>
 * </div>
 */
p5.prototype.strokeJoin = function(join) {
  p5._validateParameters('strokeJoin', arguments);
  if (
    join === constants.ROUND ||
    join === constants.BEVEL ||
    join === constants.MITER
  ) {
    this._renderer.strokeJoin(join);
  }
  return this;
};

/**
 * Sets the width of the stroke used for lines, points, and the border around
 * shapes. All widths are set in units of pixels.
 *
 * Note that `strokeWeight()` is affected by any transformation or scaling that
 * has been applied previously.
 *
 * @method strokeWeight
 * @param  {Number} weight the weight of the stroke (in pixels).
 * @chainable
 * @example
 * <div>
 * <code>
 * // Default.
 * line(20, 20, 80, 20);
 * // Thicker.
 * strokeWeight(4);
 * line(20, 40, 80, 40);
 * // Beastly.
 * strokeWeight(10);
 * line(20, 70, 80, 70);
 * describe('Three horizontal black lines. The top line is thin, the middle is medium, and the bottom is thick.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Default.
 * line(20, 20, 80, 20);
 * // Adding scale transformation.
 * scale(5);
 * // Coordinates adjusted for scaling.
 * line(4, 8, 16, 8);
 * describe('Two horizontal black lines. The top line is thin and the bottom is five times thicker than the top.');
 * </code>
 * </div>
 */
p5.prototype.strokeWeight = function(w) {
  p5._validateParameters('strokeWeight', arguments);
  this._renderer.strokeWeight(w);
  return this;
};

export default p5;
