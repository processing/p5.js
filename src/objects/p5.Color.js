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
  p5.Color = function() {
    var pInst = arguments[0];
    var vals = arguments[1];
    
    var isRGB = pInst._colorMode === constants.RGB;
    var maxArr = isRGB ? pInst._maxRGB : pInst._maxHSB;

    var r, g, b, a;
    if (vals.length >= 3) {
      r = vals[0];
      g = vals[1];
      b = vals[2];
      a = typeof vals[3] === 'number' ? vals[3] : maxArr[3];
    } else {
      if (isRGB) {
        r = g = b = vals[0];
      } else {
        r = b = vals[0];
        g = 0;
      }
      a = typeof vals[1] === 'number' ? vals[1] : maxArr[3];
    }
    // we will need all these later, store them instead of recalc
    if (!isRGB) {
      this.hsba = [r, g, b, a];
    }
    this.rgba = p5.Color.getNormalizedColor.apply(pInst, [r, g, b, a]);
    this.colorString = p5.Color.getColorString(this.rgba);
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
   * @example
   * <div>
   * <code>
   * // todo
   * </code>
   * </div>
   */
  p5.Color.getNormalizedColor = function() {
    var isRGB = this._colorMode === constants.RGB;
    var maxArr = isRGB ? this._maxRGB : this._maxHSB;

    if (arguments[0] instanceof Array) { // already color object
      return p5.Color.getNormalizeColor.apply(this, arguments[0]);
    }
    var r, g, b, a, rgba;
    if (arguments.length >= 3) {
      r = arguments[0];
      g = arguments[1];
      b = arguments[2];
      a = typeof arguments[3] === 'number' ? arguments[3] : maxArr[3];
    } else {
      if (isRGB) {
        r = g = b = arguments[0];
      } else {
        r = b = arguments[0];
        g = 0;
      }
      a = typeof arguments[1] === 'number' ? arguments[1] : maxArr[3];
    }

    r *= 255/maxArr[0];
    g *= 255/maxArr[1];
    b *= 255/maxArr[2];
    a *= 255/maxArr[3];

    if (this._colorMode === constants.HSB) {
      rgba = p5.Color.hsv2rgb(r, g, b).concat(a);
    } else {
      rgba = [r, g, b, a];
    }

    return rgba;
  };

  p5.Color.hsv2rgb = function(h,s,v) {
    h /= 255;
    s /= 255;
    v /= 255;
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
  };

  p5.Color.rgb2hsv = function(r,g,b) {
    var var_R = r/255;                           //RGB from 0 to 255
    var var_G = g/255;
    var var_B = b/255;

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
        Math.round(V * 255)
      ];
  };

  p5.Color.getColorString = function(a) {
    for (var i=0; i<3; i++) {
      a[i] = Math.floor(a[i]);
    }
    var alpha = a[3] ? a[3]/255.0 : 1;
    return 'rgba('+a[0]+','+a[1]+','+a[2]+','+ alpha +')';
  };

  p5.Color.getColor = function() {
    if (arguments[0] instanceof p5.Color) {
      return arguments[0].colorString;
    } else {
      var c = p5.Color.getNormalizedColor.apply(this, arguments);
      return p5.Color.getColorString(c);
    }
  };

  return p5.Color;
});
