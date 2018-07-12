/**
 * @module Shape
 * @submodule Attributes
 * @for p5
 * @requires core
 * @requires constants
 */

'use strict';

var p5 = require('../main');
var constants = require('../constants');

/**
 * Modifies the location from which ellipses are drawn by changing the way
 * in which parameters given to <a href="#/p5/ellipse">ellipse()</a> are interpreted.
 * <br><br>
 * The default mode is ellipseMode(CENTER), which interprets the first two
 * parameters of <a href="#/p5/ellipse">ellipse()</a> as the shape's center point, while the third and
 * fourth parameters are its width and height.
 * <br><br>
 * ellipseMode(RADIUS) also uses the first two parameters of <a href="#/p5/ellipse">ellipse()</a> as
 * the shape's center point, but uses the third and fourth parameters to
 * specify half of the shapes's width and height.
 * <br><br>
 * ellipseMode(CORNER) interprets the first two parameters of <a href="#/p5/ellipse">ellipse()</a> as
 * the upper-left corner of the shape, while the third and fourth parameters
 * are its width and height.
 * <br><br>
 * ellipseMode(CORNERS) interprets the first two parameters of <a href="#/p5/ellipse">ellipse()</a> as
 * the location of one corner of the ellipse's bounding box, and the third
 * and fourth parameters as the location of the opposite corner.
 * <br><br>
 * The parameter must be written in ALL CAPS because Javascript is a
 * case-sensitive language.
 *
 * @method ellipseMode
 * @param  {Constant} mode either CENTER, RADIUS, CORNER, or CORNERS
 * @chainable
 * @example
 * <div>
 * <code>
 * ellipseMode(RADIUS); // Set ellipseMode to RADIUS
 * fill(255); // Set fill to white
 * ellipse(50, 50, 30, 30); // Draw white ellipse using RADIUS mode
 *
 * ellipseMode(CENTER); // Set ellipseMode to CENTER
 * fill(100); // Set fill to gray
 * ellipse(50, 50, 30, 30); // Draw gray ellipse using CENTER mode
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * ellipseMode(CORNER); // Set ellipseMode is CORNER
 * fill(255); // Set fill to white
 * ellipse(25, 25, 50, 50); // Draw white ellipse using CORNER mode
 *
 * ellipseMode(CORNERS); // Set ellipseMode to CORNERS
 * fill(100); // Set fill to gray
 * ellipse(25, 25, 50, 50); // Draw gray ellipse using CORNERS mode
 * </code>
 * </div>
 *
 * @alt
 * 60x60 white ellipse and 30x30 grey ellipse with black outlines at center.
 * 60x60 white ellipse @center and 30x30 grey ellipse top-right, black outlines.
 *
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
 *
 */
p5.prototype.noSmooth = function() {
  this._renderer.noSmooth();
  return this;
};

/**
 * Modifies the location from which rectangles are drawn by changing the way
 * in which parameters given to <a href="#/p5/rect">rect()</a> are interpreted.
 * <br><br>
 * The default mode is rectMode(CORNER), which interprets the first two
 * parameters of <a href="#/p5/rect">rect()</a> as the upper-left corner of the shape, while the
 * third and fourth parameters are its width and height.
 * <br><br>
 * rectMode(CORNERS) interprets the first two parameters of <a href="#/p5/rect">rect()</a> as the
 * location of one corner, and the third and fourth parameters as the
 * location of the opposite corner.
 * <br><br>
 * rectMode(CENTER) interprets the first two parameters of <a href="#/p5/rect">rect()</a> as the
 * shape's center point, while the third and fourth parameters are its
 * width and height.
 * <br><br>
 * rectMode(RADIUS) also uses the first two parameters of <a href="#/p5/rect">rect()</a> as the
 * shape's center point, but uses the third and fourth parameters to specify
 * half of the shapes's width and height.
 * <br><br>
 * The parameter must be written in ALL CAPS because Javascript is a
 * case-sensitive language.
 *
 * @method rectMode
 * @param  {Constant} mode either CORNER, CORNERS, CENTER, or RADIUS
 * @chainable
 * @example
 * <div>
 * <code>
 * rectMode(CORNER); // Default rectMode is CORNER
 * fill(255); // Set fill to white
 * rect(25, 25, 50, 50); // Draw white rect using CORNER mode
 *
 * rectMode(CORNERS); // Set rectMode to CORNERS
 * fill(100); // Set fill to gray
 * rect(25, 25, 50, 50); // Draw gray rect using CORNERS mode
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * rectMode(RADIUS); // Set rectMode to RADIUS
 * fill(255); // Set fill to white
 * rect(50, 50, 30, 30); // Draw white rect using RADIUS mode
 *
 * rectMode(CENTER); // Set rectMode to CENTER
 * fill(100); // Set fill to gray
 * rect(50, 50, 30, 30); // Draw gray rect using CENTER mode
 * </code>
 * </div>
 *
 * @alt
 * 50x50 white rect at center and 25x25 grey rect in the top left of the other.
 * 50x50 white rect at center and 25x25 grey rect in the center of the other.
 *
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
 *
 */
p5.prototype.smooth = function() {
  this._renderer.smooth();
  return this;
};

/**
 * Sets the style for rendering line endings. These ends are either squared,
 * extended, or rounded, each of which specified with the corresponding
 * parameters: SQUARE, PROJECT, and ROUND. The default cap is ROUND.
 *
 * @method strokeCap
 * @param  {Constant} cap either SQUARE, PROJECT, or ROUND
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
 * </code>
 * </div>
 *
 * @alt
 * 3 lines. Top line: rounded ends, mid: squared, bottom:longer squared ends.
 *
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
 * are either mitered, beveled, or rounded and specified with the
 * corresponding parameters MITER, BEVEL, and ROUND. The default joint is
 * MITER.
 *
 * @method strokeJoin
 * @param  {Constant} join either MITER, BEVEL, ROUND
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
 * </code>
 * </div>
 *
 * @alt
 * Right-facing arrowhead shape with pointed tip in center of canvas.
 * Right-facing arrowhead shape with flat tip in center of canvas.
 * Right-facing arrowhead shape with rounded tip in center of canvas.
 *
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
 * Sets the width of the stroke used for lines, points, and the border
 * around shapes. All widths are set in units of pixels.
 *
 * @method strokeWeight
 * @param  {Number} weight the weight (in pixels) of the stroke
 * @chainable
 * @example
 * <div>
 * <code>
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
 *
 */
p5.prototype.strokeWeight = function(w) {
  p5._validateParameters('strokeWeight', arguments);
  this._renderer.strokeWeight(w);
  return this;
};

module.exports = p5;
