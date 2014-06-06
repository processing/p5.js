/**
 * @module Environment
 * @for Environment
 * @requires core
 * @requires constants
 */
define(function(require) {

  'use strict';

  var p5 = require('core');
  var C = require('constants');

  var standardCursors = [C.ARROW, C.CROSS, C.HAND, C.MOVE, C.TEXT, C.WAIT];

  p5.prototype._frameRate = 0;
  p5.prototype._lastFrameTime = 0;
  p5.prototype._targetFrameRate = 60;

  /**
   * Sets the cursor to a predefined symbol or an image, or makes it visible
   * if already hidden. If you are trying to set an image as the cursor, the
   * recommended size is 16x16 or 32x32 pixels. It is not possible to load an
   * image as the cursor if you are exporting your program for the Web, and not
   * all MODES work with all browsers. The values for parameters x and y must
   * be less than the dimensions of the image. 
   *
   * @method cursor
   * @param {Number/Constant} type either ARROW, CROSS, HAND, MOVE, TEXT, or
   *                               WAIT, or path for image
   * @param {Number}          [x]  the horizontal active spot of the cursor
   * @param {Number}          [y]  the vertical active spot of the cursor
   */
  p5.prototype.cursor = function(type, x, y) {
    var cursor = 'auto';
    var canvas = this._curElement.elt;
    if (standardCursors.indexOf(type) > -1) {
      // Standard css cursor
      cursor = type;
    } else if (typeof type === 'string') {
      var coords = '';
      if (x && y && (typeof x === 'number' && typeof y === 'number')) {
        // Note that x and y values must be unit-less positive integers < 32
        // https://developer.mozilla.org/en-US/docs/Web/CSS/cursor
        coords = x + ' ' + y;
      }
      if (type.substring(0, 6) !== 'http://') {
        // Image (absolute url)
        cursor = 'url(' + type + ') ' + coords + ', auto';
      } else if (/\.(cur|jpg|jpeg|gif|png|CUR|JPG|JPEG|GIF|PNG)$/.test(type)) {
        // Image file (relative path) - Separated for performance reasons
        cursor = 'url(' + type + ') ' + coords + ', auto';
      } else {
        // Any valid string for the css cursor property
        cursor = type;
      }
    }
    canvas.style.cursor = cursor;
  };

  /**
   * Specifies the number of frames to be displayed every second. For example,
   * the function call frameRate(30) will attempt to refresh 30 times a second.
   * If the processor is not fast enough to maintain the specified rate, the
   * frame rate will not be achieved. Setting the frame rate within setup() is
   * recommended. The default rate is 60 frames per second. This is the same as
   * setFrameRate(val).
   *
   * Calling frameRate() with no arguments returns the current framerate. This
   * is the same as getFrameRate().
   *
   * @method frameRate
   * @param  {Number} [fps] number of frames to be displayed every second
   * @return {Number}       current frameRate
   */
  p5.prototype.frameRate = function(fps) {
    if (typeof fps === 'undefined') {
      return this._frameRate;
    } else {
      this._setProperty('_targetFrameRate', fps);
      this._runFrames();
      return this;
    }
  };
  /**
   * Returns the current framerate.
   *
   * @return {Number} current frameRate
   */
  p5.prototype.getFrameRate = function() {
    return this.frameRate();
  };

  /**
   * Specifies the number of frames to be displayed every second. For example,
   * the function call frameRate(30) will attempt to refresh 30 times a second.
   * If the processor is not fast enough to maintain the specified rate, the
   * frame rate will not be achieved. Setting the frame rate within setup() is
   * recommended. The default rate is 60 frames per second.
   *
   * Calling frameRate() with no arguments returns the current framerate.
   *
   * @param {Number} [fps] number of frames to be displayed every second
   */
  p5.prototype.setFrameRate = function(fps) {
    return this.frameRate(fps);
  };

  /**
   * Hides the cursor from view. 
   * 
   * @method noCursor
   */
  p5.prototype.noCursor = function() {
    this._curElement.elt.style.cursor = 'none';
  };

  return p5;

});