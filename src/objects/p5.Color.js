/**
 * @module Color
 * @submodule Creating & Reading
 * @for p5
 */
define(function(require) {

  var p5 = require('core');
  var constants = require('constants');

  /**
   * 
   * @class p5.Color
   * @constructor
   */
  p5.Color = function (pInst, vals) {
    if (vals instanceof Array) {
      this.rgba = vals;
    } else {
      var formatted = p5.Color._getFormattedColor.apply(pInst, vals);
      if (pInst._colorMode === constants.HSB) {
        this.hsba = formatted;
        this.rgba = p5.Color._getRGB(formatted);
      } else {
        this.rgba = formatted;
      }
    }
    var c = p5.Color._normalizeColorArray.call(pInst, this.rgba);
    this.colorString = p5.Color._getColorString(c);
    return this;
  };

  // p5.Color.prototype.r = function(val) {
  //   if (typeof val === 'undefined') {
  //     p = document.getElementById(p);
  //   } else if (p instanceof p5.Element) {
  //     p = p.elt;
  //   }
  //   p.appendChild(this.elt);
  // };



  /**
   * For a number of different inputs, returns a color formatted as
   * [r, g, b, a].
   * 
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
   * @example
   * <div>
   * <code>
   * // todo
   * </code>
   * </div>
   */
  p5.Color._getFormattedColor = function () {
    if (arguments[0] instanceof Array) {
      return p5.Color.getNormalizedColor.apply(this, arguments[0]);
    }
    var r, g, b, a;
    if (arguments.length >= 3) {
      r = arguments[0];
      g = arguments[1];
      b = arguments[2];
      a = typeof arguments[3] === 'number' ? arguments[3] : 255;
    } else {
      if (this._colorMode === constants.RGB) {
        r = g = b = arguments[0];
      } else {
        r = b = arguments[0];
        g = 0;
      }
      a = typeof arguments[1] === 'number' ? arguments[1] : 255;
    }
    return [
      r,
      g,
      b,
      a
    ];
  };
  /**
   * Normalizes an array based on max vals.
   * @param {Array} array A four value array rgba or hsba array.
   * @return {Array}
   */
  p5.Color._normalizeColorArray = function (arr) {
    var isRGB = this._colorMode === constants.RGB;
    var maxArr = isRGB ? this._maxRGB : this._maxHSB;
    arr[0] *= 255 / maxArr[0];
    arr[1] *= 255 / maxArr[1];
    arr[2] *= 255 / maxArr[2];
    arr[3] *= 255 / maxArr[3];
    return arr;
  };

  p5.Color._getRGB = function(hsba) {
    var h = hsba[0];
    var s = hsba[1];
    var v = hsba[2];
    h /= 255;
    s /= 255;
    v /= 255;
    // Adapted from http://www.easyrgb.com/math.html
    // hsv values = 0 - 1, rgb values = 0 - 255
    var RGBA = [];
    if(s===0){
      RGBA = [Math.round(v*255), Math.round(v*255), Math.round(v*255), hsba[3]];
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
      RGBA= [
        Math.round(var_r * 255),
        Math.round(var_g * 255),
        Math.round(var_b * 255),
        hsba[3]
      ];
    }
    return RGBA;
  };

  p5.Color._getHSB = function(rgba) {
    var var_R = rgba[0]/255;
    var var_G = rgba[1]/255;
    var var_B = rgba[2]/255;

    var var_Min = Math.min(var_R, var_G, var_B); //Min. value of RGB
    var var_Max = Math.max(var_R, var_G, var_B); //Max. value of RGB
    var del_Max = var_Max - var_Min;             //Delta RGB value 

    var H;
    var S;
    var V = var_Max;

    if (del_Max === 0) { //This is a gray, no chroma...
      H = 0; //HSV results from 0 to 1
      S = 0;
    }
    else { //Chromatic data...
      S = del_Max/var_Max;

      var del_R = ( ( ( var_Max - var_R ) / 6 ) + ( del_Max / 2 ) ) / del_Max;
      var del_G = ( ( ( var_Max - var_G ) / 6 ) + ( del_Max / 2 ) ) / del_Max;
      var del_B = ( ( ( var_Max - var_B ) / 6 ) + ( del_Max / 2 ) ) / del_Max;

      if (var_R === var_Max) {
        H = del_B - del_G;
      } else if (var_G === var_Max) {
        H = 1/3 + del_R - del_B;
      } else if (var_B === var_Max) {
        H = 2/3 + del_G - del_R;
      }

      if (H<0) {
        H += 1;
      }
      if (H>1) {
        H -= 1;
      }
    }
    return [
        Math.round(H * 255),
        Math.round(S * 255),
        Math.round(V * 255),
        rgba[3]
      ];
  };

  p5.Color._getColorString = function(a) {
    for (var i=0; i<3; i++) {
      a[i] = Math.floor(a[i]);
    }
    var alpha = typeof a[3] !== 'undefined' ? a[3] / 255 : 1;
    return 'rgba('+a[0]+','+a[1]+','+a[2]+','+ alpha +')';
  };

  p5.Color._getCanvasColor = function () {
    if (arguments[0] instanceof p5.Color) {
      if (arguments.length === 1) {
        return arguments[0].colorString;
      } else {
        var c = arguments[0].rgba;
        c[3] = arguments[1];
        c = p5.Color._normalizeColorArray.call(this, c);
        return p5.Color._getColorString(c);
      }
    } else if (arguments[0] instanceof Array) {
      if (arguments.length === 1) {
        return p5.Color._getColorString(arguments[0]);
      } else {
        var isRGB = this._colorMode === constants.RGB;
        var maxA = isRGB ? this._maxRGB[3] : this._maxHSB[3];
        arguments[0][3] = 255 * arguments[1] / maxA;
        return p5.Color._getColorString(arguments[0]);
      }
    } else {
      var e = p5.Color._getFormattedColor.apply(this, arguments);
      e = p5.Color._normalizeColorArray.call(this, e);
      if (this._colorMode === constants.HSB) {
        e = p5.Color._getRGB(e);
      }
      return p5.Color._getColorString(e);
    }
  };

  return p5.Color;
});
