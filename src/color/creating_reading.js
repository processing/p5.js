/**
 * @module Color
 * @for Creating & Reading
 * @requires core
 */
define(function (require) {

  'use strict';

  var p5 = require('core');

  /**
   * Extracts the alpha value from a color.
   * 
   * @method alpha
   * @param {Array} an array representing a color
   */
  p5.prototype.alpha = function(rgb) {
    if (rgb.length > 3) {
      return rgb[3];
    } else {
      return 255;
    }
  };

  /**
   * Extracts the blue value from a color, scaled to match current colorMode(). 
   * 
   * @method blue
   * @param {Array} an array representing a color
   */
  p5.prototype.blue = function(rgb) {
    if (rgb.length > 2) {
      return rgb[2];
    } else {
      return 0;
    }
  };

  /**
   * Extracts the brightness value from a color. 
   * 
   * @method brightness
   * @param {Array} an array representing a color
   */
  p5.prototype.brightness = function(hsv) {
    if (hsv.length > 2) {
      return hsv[2];
    } else {
      return 0;
    }
  };

  /**
   * Creates colors for storing in variables of the color datatype. The
   * parameters are interpreted as RGB or HSB values depending on the
   * current colorMode(). The default mode is RGB values from 0 to 255
   * and, therefore, the function call color(255, 204, 0) will return a
   * bright yellow color.
   * 
   * Note that if only one value is provided to color(), it will be interpreted
   * as a grayscale value. Add a second value, and it will be used for alpha
   * transparency. When three values are specified, they are interpreted as
   * either RGB or HSB values. Adding a fourth value applies alpha
   * transparency.
   * 
   * Colors are stored as Numbers or Arrays.
   * 
   * @method color
   * @param  {Number} v1      gray value or red or hue value relative to the 
   *                          current color range
   * @param  {Number} [v2]    gray value or green or saturation value relative
   *                          to the current color range (or alpha value if
   *                          first param is gray value)
   * @param  {Number} [v3]    gray value or blue or brightness value relative
   *                          to the current color range
   * @param  {Number} [alpha] alpha value relative to current color range
   * @return {Array}          resulting color
   */
  p5.prototype.color = function() {
    return this.getNormalizedColor(arguments);
  };

  /**
   * Extracts the green value from a color, scaled to match current
   * colorMode(). 
   * 
   * @method green
   * @param {Array} an array representing a color
   */
  p5.prototype.green = function(rgb) {
    if (rgb.length > 2) {
      return rgb[1];
    } else {
      return 0;
    }
  };

  /**
   * Extracts the hue value from a color. 
   * 
   * @method hue
   * @param {Array} an array representing a color
   */
  p5.prototype.hue = function(hsv) {
    if (hsv.length > 2) {
      return hsv[0];
    } else {
      return 0;
    }
  };

  /**
   * Calculates a color or colors between two color at a specific increment.
   * The amt parameter is the amount to interpolate between the two values
   * where 0.0 equal to the first point, 0.1 is very near the first point,
   * 0.5 is halfway in between, etc. An amount below 0 will be treated as 0.
   * Likewise, amounts above 1 will be capped at 1. This is different from
   * the behavior of lerp(), but necessary because otherwise numbers outside
   * the range will produce strange and unexpected colors.
   * 
   * @method lerpColor
   * @param  {Array/Number} c1  interpolate from this color
   * @param  {Array/Number} c2  interpolate to this color
   * @param  {Number}       amt number between 0 and 1
   * @return {Array/Number}     interpolated color
   */
  p5.prototype.lerpColor = function(c1, c2, amt) {
    if (typeof c1 === 'Array') {
      var c = [];
      for (var i=0; i<c1.length; i++) {
        c.push(p5.prototype.lerp(c1[i], c2[i], amt));
      }
      return c;
    } else {
      return p5.prototype.lerp(c1, c2, amt);
    }
  };

  /**
   * Extracts the red value from a color, scaled to match current colorMode(). 
   * 
   * @method red
   * @param {Array} rgb an array representing a color
   */
  p5.prototype.red = function(rgb) {
    if (rgb.length > 2) {
      return rgb[0];
    } else {
      return 0;
    }
  };

  /**
   * Extracts the saturation value from a color. 
   * 
   * @method saturation
   * @param {Array} an array representing a color
   */
  p5.prototype.saturation = function(hsv) {
    if (hsv.length > 2) {
      return hsv[1];
    } else {
      return 0;
    }
  };

  return p5;

});
