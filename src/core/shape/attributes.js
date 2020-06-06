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
 * Modifies the location from which ellipses are drawn by changing the way in
 * which parameters given to <a href="#/p5/ellipse">ellipse()</a>,
 * <a href="#/p5/circle">circle()</a> and <a href="#/p5/arc">arc()</a> are interpreted.
 *
 * The default mode is CENTER, in which the first two parameters are interpreted
 * as the shape's center point's x and y coordinates respectively, while the third
 * and fourth parameters are its width and height.
 *
 * ellipseMode(RADIUS) also uses the first two parameters as the shape's center
 * point's x and y coordinates, but uses the third and fourth parameters to
 * specify half of the shapes's width and height.
 *
 * ellipseMode(CORNER) interprets the first two parameters as the upper-left
 * corner of the shape, while the third and fourth parameters are its width
 * and height.
 *
 * ellipseMode(CORNERS) interprets the first two parameters as the location of
 * one corner of the ellipse's bounding box, and the third and fourth parameters
 * as the location of the opposite corner.
 *
 * The parameter to this method must be written in ALL CAPS because they are
 * predefined as constants in ALL CAPS and Javascript is a case-sensitive language.
 *
 * @method ellipseMode
 * @param  {Constant} mode either CENTER, RADIUS, CORNER, or CORNERS
 * @chainable
 * @example
 * <div>
 * <code>
 * // Example showing RADIUS and CENTER ellipsemode with 2 overlaying ellipses
 * ellipseMode(RADIUS);
 * fill(255);
 * ellipse(50, 50, 30, 30); // Outer white ellipse
 * ellipseMode(CENTER);
 * fill(100);
 * ellipse(50, 50, 30, 30); // Inner gray ellipse
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Example showing CORNER and CORNERS ellipseMode with 2 overlaying ellipses
 * ellipseMode(CORNER);
 * fill(255);
 * ellipse(25, 25, 50, 50); // Outer white ellipse
 * ellipseMode(CORNERS);
 * fill(100);
 * ellipse(25, 25, 50, 50); // Inner gray ellipse
 * </code>
 * </div>
 *
 * @alt
 * 60x60 white ellipse and 30x30 grey ellipse with black outlines at center.
 * 60x60 white ellipse and 30x30 grey ellipse top-right with black outlines.
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
 * Draws all geometry with jagged (aliased) edges. Note that <a href="#/p5/smooth">smooth()</a> is
 * active by default in 2D mode, so it is necessary to call <a href="#/p5/noSmooth">noSmooth()</a> to disable
 * smoothing of geometry, images, and fonts. In 3D mode, <a href="#/p5/noSmooth">noSmooth()</a> is enabled
 * by default, so it is necessary to call <a href="#/p5/smooth">smooth()</a> if you would like
 * smooth (antialiased) edges on your geometry.
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
 * </code>
 * </div>
 *
 * @alt
 * 2 pixelated 36x36 white ellipses to left & right of center, black background
 */
p5.prototype.noSmooth = function() {
  this.setAttributes('antialias', false);
  if (!this._renderer.isP3D) {
    if ('imageSmoothingEnabled' in this.drawingContext) {
      this.drawingContext.imageSmoothingEnabled = false;
    }
  }
  return this;
};

/**
 * Modifies the location from which rectangles are drawn by changing the way
 * in which parameters given to <a href="#/p5/rect">rect()</a> are interpreted.
 *
 * The default mode is CORNER, which interprets the first two parameters as the
 * upper-left corner of the shape, while the third and fourth parameters are its
 * width and height.
 *
 * rectMode(CORNERS) interprets the first two parameters as the location of
 * one of the corner, and the third and fourth parameters as the location of
 * the diagonally opposite corner. Note, the rectangle is drawn between the
 * coordinates, so it is not neccesary that the first corner be the upper left
 * corner.
 *
 * rectMode(CENTER) interprets the first two parameters as the shape's center
 * point, while the third and fourth parameters are its width and height.
 *
 * rectMode(RADIUS) also uses the first two parameters as the shape's center
 * point, but uses the third and fourth parameters to specify half of the shapes's
 * width and height respectively.
 *
 * The parameter to this method must be written in ALL CAPS because they are
 * predefined as constants in ALL CAPS and Javascript is a case-sensitive language.
 *
 * @method rectMode
 * @param  {Constant} mode either CORNER, CORNERS, CENTER, or RADIUS
 * @chainable
 * @example
 * <div>
 * <code>
 * rectMode(CORNER);
 * fill(255);
 * rect(25, 25, 50, 50); // Draw white rectangle using CORNER mode
 *
 * rectMode(CORNERS);
 * fill(100);
 * rect(25, 25, 50, 50); // Draw gray rectanle using CORNERS mode
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * rectMode(RADIUS);
 * fill(255);
 * rect(50, 50, 30, 30); // Draw white rectangle using RADIUS mode
 *
 * rectMode(CENTER);
 * fill(100);
 * rect(50, 50, 30, 30); // Draw gray rectangle using CENTER mode
 * </code>
 * </div>
 *
 * @alt
 * 50x50 white rect at center and 25x25 grey rect in the top left of the other.
 * 50x50 white rect at center and 25x25 grey rect in the center of the other.
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
 * improve image quality of resized images. Note that <a href="#/p5/smooth">smooth()</a> is active by
 * default in 2D mode; <a href="#/p5/noSmooth">noSmooth()</a> can be used to disable smoothing of geometry,
 * images, and fonts. In 3D mode, <a href="#/p5/noSmooth">noSmooth()</a> is enabled
 * by default, so it is necessary to call <a href="#/p5/smooth">smooth()</a> if you would like
 * smooth (antialiased) edges on your geometry.
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
 * </code>
 * </div>
 *
 * @alt
 * 2 pixelated 36x36 white ellipses one left one right of center. On black.
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
 * Sets the style for rendering line endings. These ends are either rounded,
 * squared or extended, each of which specified with the corresponding
 * parameters: ROUND, SQUARE and PROJECT. The default cap is ROUND.
 *
 * The parameter to this method must be written in ALL CAPS because they are
 * predefined as constants in ALL CAPS and Javascript is a case-sensitive language.
 *
 * @method strokeCap
 * @param  {Constant} cap either ROUND, SQUARE or PROJECT
 * @chainable
 * @example
 * <div>
 * <code>
 * // Example of different strokeCaps
 * strokeWeight(12.0);
 * strokeCap(ROUND);
 * line(20, 30, 80, 30);
 * strokeCap(SQUARE);
 * line(20, 50, 80, 50);
 * strokeCap(PROJECT);
 * line(20, 70, 80, 70);
 * </code>
 * </div>
 *
 * @alt
 * 3 lines. Top line: rounded ends, mid: squared, bottom:longer squared ends.
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
 * Sets the style of the joints which connect line segments. These joints
 * are either mitered, beveled or rounded and specified with the
 * corresponding parameters MITER, BEVEL and ROUND. The default joint is
 * MITER.
 *
 * The parameter to this method must be written in ALL CAPS because they are
 * predefined as constants in ALL CAPS and Javascript is a case-sensitive language.
 *
 * @method strokeJoin
 * @param  {Constant} join either MITER, BEVEL, ROUND
 * @chainable
 * @example
 * <div>
 * <code>
 * // Example of MITER type of joints
 * noFill();
 * strokeWeight(10.0);
 * strokeJoin(MITER);
 * beginShape();
 * vertex(35, 20);
 * vertex(65, 50);
 * vertex(35, 80);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Example of BEVEL type of joints
 * noFill();
 * strokeWeight(10.0);
 * strokeJoin(BEVEL);
 * beginShape();
 * vertex(35, 20);
 * vertex(65, 50);
 * vertex(35, 80);
 * endShape();
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // Example of ROUND type of joints
 * noFill();
 * strokeWeight(10.0);
 * strokeJoin(ROUND);
 * beginShape();
 * vertex(35, 20);
 * vertex(65, 50);
 * vertex(35, 80);
 * endShape();
 * </code>
 * </div>
 *
 * @alt
 * Right-facing arrowhead shape with pointed tip in center of canvas.
 * Right-facing arrowhead shape with flat tip in center of canvas.
 * Right-facing arrowhead shape with rounded tip in center of canvas.
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
 * Sets the width of the stroke used for lines, points and the border around
 * shapes. All widths are set in units of pixels.
 *
 * @method strokeWeight
 * @param  {Number} weight the weight of the stroke (in pixels)
 * @chainable
 * @example
 * <div>
 * <code>
 * // Example of different stroke weights
 * strokeWeight(1); // Default
 * line(20, 20, 80, 20);
 * strokeWeight(4); // Thicker
 * line(20, 40, 80, 40);
 * strokeWeight(10); // Beastly
 * line(20, 70, 80, 70);
 * </code>
 * </div>
 *
 * @alt
 * 3 horizontal black lines. Top line: thin, mid: medium, bottom:thick.
 */
p5.prototype.strokeWeight = function(w) {
  p5._validateParameters('strokeWeight', arguments);
  this._renderer.strokeWeight(w);
  return this;
};

export default p5;
