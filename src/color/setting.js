/**
 * @module Color
 * @submodule Setting
 * @for p5
 * @requires core
 * @requires constants
 */
define(function (require) {

  'use strict';

  var p5 = require('core');
  var constants = require('constants');
  require('p5.Color');

  p5.prototype._doStroke = true;
  p5.prototype._doFill = true;
  p5.prototype._colorMode = constants.RGB;
  p5.prototype._maxRGB = [255, 255, 255, 255];
  p5.prototype._maxHSB = [255, 255, 255, 255];

  /**
   * The background() function sets the color used for the background of the
   * p5.js canvas. The default background is light gray. This function is
   * typically used within draw() to clear the display window at the beginning
   * of each frame, but it can be used inside setup() to set the background on
   * the first frame of animation or if the background need only be set once.
   *
   * @method background
   * @param {Number|Color|p5.Image} v1   gray value, red or hue value 
   *                                     (depending on the current color mode),
   *                                     or color or p5.Image
   * @param {Number|Array}          [v2] green or saturation value (depending on
   *                                     the current color mode)
   * @param {Number|Array}          [v3] blue or brightness value (depending on 
   *                                     the current color mode)
   * @param {Number|Array}          [a]  opacity of the background
   * @example
   * <div>
   * <code>
   * background(51);   
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * background(255, 204, 0);
   * </code>
   * </div>
   */
  p5.prototype.background = function() {
    this.drawingContext.save();
    this.drawingContext.setTransform(1, 0, 0, 1, 0, 0);
    this.drawingContext.scale(this._pixelDensity, this._pixelDensity);
    if (arguments[0] instanceof p5.Image) {
      this.image(arguments[0], 0, 0, this.width, this.height);
    } else {
      var curFill = this.drawingContext.fillStyle;
      // create background rect
      var color = this.color.apply(this, arguments);
      var newFill = color.toString();
      this.drawingContext.fillStyle = newFill;
      this.drawingContext.fillRect(0, 0, this.width, this.height);
      // reset fill
      this.drawingContext.fillStyle = curFill;
    }
    this.drawingContext.restore();
  };

  /**
   * Clears the pixels within a buffer. This function only works on p5.Canvas
   * objects created with the createCanvas() function; it won't work with the
   * main display window. Unlike the main graphics context, pixels in
   * additional graphics areas created with createGraphics() can be entirely
   * or partially transparent. This function clears everything to make all of
   * the pixels 100% transparent.
   *
   * @method clear
   * @example
   * <div>
   * <code>
   * </code>
   * </div>
   */
  p5.prototype.clear = function() {
    this.drawingContext.clearRect(0, 0, this.width, this.height);
  };

  /**
   * Changes the way p5.js interprets color data. By default, the parameters
   * for fill(), stroke(), background(), and color() are defined by values
   * between 0 and 255 using the RGB color model. The colorMode() function is
   * used to switch color systems. 
   * 
   * @method colorMode
   * @param {Number|Constant} mode either RGB or HSB, corresponding to
   *                               Red/Green/Blue and Hue/Saturation/Brightness
   * @param {Number|Constant} max1 range for the red or hue depending on the 
   *                               current color mode, or range for all values
   * @param {Number|Constant} max2 range for the green or saturation depending 
   *                               on the current color mode
   * @param {Number|Constant} max3 range for the blue or brightness depending
   *                               on the current color mode
   * @param {Number|Constant} maxA range for the alpha
   * @example
   * <div>
   * <code>
   * noStroke();
   * colorMode(RGB, 100);
   * for (i = 0; i < 100; i++) {
   *   for (j = 0; j < 100; j++) {
   *     stroke(i, j, 0);
   *     point(i, j);
   *   }
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * noStroke();
   * colorMode(HSB, 100);
   * for (i = 0; i < 100; i++) {
   *   for (j = 0; j < 100; j++) {
   *     stroke(i, j, 100);
   *     point(i, j);
   *   }
   * }
   * </code>
   * </div>
   */
  p5.prototype.colorMode = function() {
    if (arguments[0] === constants.RGB || arguments[0] === constants.HSB) {
      this._colorMode = arguments[0];
    
      var isRGB = this._colorMode === constants.RGB;
      var maxArr = isRGB ? this._maxRGB : this._maxHSB;

      if (arguments.length === 2) {
        maxArr[0] = arguments[1];
        maxArr[1] = arguments[1];
        maxArr[2] = arguments[1];
        maxArr[3] = arguments[1];
      }
      else if (arguments.length > 2) {
        maxArr[0] = arguments[1];
        maxArr[1] = arguments[2];
        maxArr[2] = arguments[3];
      }
      if (arguments.length === 5) {
        maxArr[3] = arguments[4];
      }
    }
  };

  /**
   * Sets the color used to fill shapes. For example, if you run
   * fill(204, 102, 0), all subsequent shapes will be filled with orange. This
   * color is either specified in terms of the RGB or HSB color depending on
   * the current colorMode(). (The default color space is RGB, with each value
   * in the range from 0 to 255.) 
   * 
   * @method fill
   * @param {Number|Array} v1   gray value, red or hue value (depending on the
   *                            current color mode), or color Array
   * @param {Number|Array} [v2] green or saturation value (depending on the
   *                            current color mode)
   * @param {Number|Array} [v3] blue or brightness value (depending on the
   *                            current color mode)
   * @param {Number|Array} [a]  opacity of the background
   * @example
   * <div>
   * <code>
   * fill(153);
   * rect(30, 20, 55, 55);   
   * </code>
   * </div>
   * 
   * <div>
   * <code>
   * fill(204, 102, 0);
   * rect(30, 20, 55, 55);
   * </code>
   * </div>
   */
  p5.prototype.fill = function() {
    this._setProperty('_doFill', true);
    var ctx = this.drawingContext;
    var color = this.color.apply(this, arguments);
    ctx.fillStyle = color.toString();
  };

  /**
   * Disables filling geometry. If both noStroke() and noFill() are called,
   * nothing will be drawn to the screen.
   *
   * @method noFill
   * @example
   * <div>
   * <code>
   * rect(15, 10, 55, 55);
   * noFill();
   * rect(30, 20, 55, 55);
   * </code>
   * </div>
   */
  p5.prototype.noFill = function() {
    this._setProperty('_doFill', false);
  };

  /**
   * Disables drawing the stroke (outline). If both noStroke() and noFill()
   * are called, nothing will be drawn to the screen.
   *
   * @method noStroke
   * @example
   * <div>
   * <code>
   * noStroke();
   * rect(30, 20, 55, 55);
   * </code>
   * </div>
   */
  p5.prototype.noStroke = function() {
    this._setProperty('_doStroke', false);
  };

  /**
   * Sets the color used to draw lines and borders around shapes. This color
   * is either specified in terms of the RGB or HSB color depending on the
   * current colorMode() (the default color space is RGB, with each value in
   * the range from 0 to 255). 
   *
   * @method stroke
   * @param {Number|Array} v1   gray value, red or hue value (depending on the
   *                            current color mode), or color Array
   * @param {Number|Array} [v2] green or saturation value (depending on the
   *                            current color mode)
   * @param {Number|Array} [v3] blue or brightness value (depending on the
   *                            current color mode)
   * @param {Number|Array} [a]  opacity of the background
   * @example
   * <div>
   * <code>
   * stroke(153);
   * rect(30, 20, 55, 55);   
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * stroke(204, 102, 0);
   * rect(30, 20, 55, 55);
   * </code>
   * </div>
   */
  p5.prototype.stroke = function() {
    this._setProperty('_doStroke', true);
    var ctx = this.drawingContext;
    var color = this.color.apply(this, arguments);
    ctx.strokeStyle = color.toString();
  };



  return p5;

});
