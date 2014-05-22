/**
 * @module Color
 * @for Setting
 * @requires core
 * @requires constants
 */
define(function (require) {

  'use strict';

  var p5 = require('core');
  var constants = require('constants');

  /**
   * The background() function sets the color used for the background of the
   * p5.js canvas. The default background is light gray. This function is
   * typically used within draw() to clear the display window at the beginning
   * of each frame, but it can be used inside setup() to set the background on
   * the first frame of animation or if the backgound need only be set once. 
   *
   * @method background
   * @param {Number|Array} v1   gray value, red or hue value (depending on the
   *                            current color mode), or color Array
   * @param {Number|Array} [v2] green or saturation value (depending on the
   *                            current color mode)
   * @param {Number|Array} [v3] blue or brightness value (depending on the
   *                            current color mode)
   * @param {Number|Array} [a]  opacity of the background
   */
  p5.prototype.background = function() {
    var c = this.getNormalizedColor(arguments);
    // save out the fill
    var curFill = this.curElement.context.fillStyle;
    // create background rect
    this.curElement.context.fillStyle = this.getCSSRGBAColor(c);
    this.curElement.context.fillRect(0, 0, this.width, this.height);
    // reset fill
    this.curElement.context.fillStyle = curFill;
  };

  /**
   * Clears the pixels within a buffer. This function only works on PGraphics
   * objects created with the createCanvas() function; it won't work with the
   * main display window. Unlike the main graphics context, pixels in
   * additional graphics areas created with createGraphics() can be entirely
   * or partially transparent. This function clears everything to make all of
   * the pixels 100% transparent.
   *
   * @method clear
   */
  p5.prototype.clear = function() {
    this.curElement.context.clearRect(0, 0, this.width, this.height);
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
   */
  p5.prototype.colorMode = function(mode) {
    if (mode === constants.RGB || mode === constants.HSB) {
      this.settings.colorMode = mode;
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
   */
  p5.prototype.fill = function() {
    var c = this.getNormalizedColor(arguments);
    this.curElement.context.fillStyle = this.getCSSRGBAColor(c);
  };

  /**
   * Disables filling geometry. If both noStroke() and noFill() are called,
   * nothing will be drawn to the screen.
   *
   * @method noFill
   */
  p5.prototype.noFill = function() {
    this.curElement.context.fillStyle = 'rgba(0,0,0,0)';
  };

  /**
   * Disables drawing the stroke (outline). If both noStroke() and noFill()
   * are called, nothing will be drawn to the screen.
   *
   * @method noStroke
   */
  p5.prototype.noStroke = function() {
    this.curElement.context.strokeStyle = 'rgba(0,0,0,0)';
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
   */
  p5.prototype.stroke = function() {
    var c = this.getNormalizedColor(arguments);
    this.curElement.context.strokeStyle = this.getCSSRGBAColor(c);
  };

  /**
   * For a number of different inputs, returns a color formatted as
   * [r, g, b, a].
   * 
   * @method getNormalizedColor 
   * @param {Array-like} args An 'array-like' object that represents a list of
   *                          arguments
   * @return {Array}          a color formatted as [r, g, b, a]
   *                          Example:
   *                          input        ==> output
   *                          g            ==> [g, g, g, 255]
   *                          g,a          ==> [g, g, g, a]
   *                          r, g, b      ==> [r, g, b, 255]
   *                          r, g, b, a   ==> [r, g, b, a]
   *                          [g]          ==> [g, g, g, 255]
   *                          [g, a]       ==> [g, g, g, a]
   *                          [r, g, b]    ==> [r, g, b, 255]
   *                          [r, g, b, a] ==> [r, g, b, a]
   */
  p5.prototype.getNormalizedColor = function(args) {
    var r, g, b, a, rgba;
    var _args = typeof args[0].length === 'number' ? args[0] : args;
    if (_args.length >= 3) {
      r = _args[0];
      g = _args[1];
      b = _args[2];
      a = typeof _args[3] === 'number' ? _args[3] : 255;
    } else {
      r = g = b = _args[0];
      a = typeof _args[1] === 'number' ? _args[1] : 255;
    }
    if (this.settings.colorMode === constants.HSB) {
      rgba = hsv2rgb(r, g, b).concat(a);
    } else {
      rgba = [r, g, b, a];
    }

    return rgba;
  };

  function hsv2rgb(h,s,v) {
    // Adapted from http://www.easyrgb.com/math.html
    // hsv values = 0 - 1, rgb values = 0 - 255
    var RGB = [];
    if(s===0){
      RGB = [Math.round(v*255), Math.round(v*255), Math.round(v*255)];
    }else{
      // h must be < 1
      var var_h = h * 6;
      if (var_h===6) {
        var_h = 0;
      }
      //Or ... var_i = floor( var_h )
      var var_i = Math.floor( var_h );
      var var_1 = v*(1-s);
      var var_2 = v*(1-s*(var_h-var_i));
      var var_3 = v*(1-s*(1-(var_h-var_i)));
      var var_r;
      var var_g;
      var var_b;
      if(var_i===0){
        var_r = v;
        var_g = var_3;
        var_b = var_1;
      }else if(var_i===1){
        var_r = var_2;
        var_g = v;
        var_b = var_1;
      }else if(var_i===2){
        var_r = var_1;
        var_g = v;
        var_b = var_3;
      }else if(var_i===3){
        var_r = var_1;
        var_g = var_2;
        var_b = v;
      }else if (var_i===4){
        var_r = var_3;
        var_g = var_1;
        var_b = v;
      }else{
        var_r = v;
        var_g = var_1;
        var_b = var_2;
      }
      RGB= [
        Math.round(var_r * 255),
        Math.round(var_g * 255),
        Math.round(var_b * 255)
      ];
    }
    return RGB;
  }

  p5.prototype.getCSSRGBAColor = function(arr) {
    var a = arr.map(function(val) {
      return Math.floor(val);
    });
    var alpha = a[3] ? (a[3]/255.0) : 1;
    return 'rgba('+a[0]+','+a[1]+','+a[2]+','+ alpha +')';
  };

  return p5;

});
