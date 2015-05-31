/**
 * module Utils
 * submodule Color Utils
 * @for p5
 */
define(function(require) {
  var p5 = require('core');

  p5.ColorUtils = {};

  /**
   * For a color expressed as an HSBA array, return the corresponding RGBA value
   * 
   * @param {Array} hsba An 'array' object that represents a list of
   *                          HSB colors on a scale of 0-255
   * @return {Array} an array of RGBA values, on a scale of 0-255
   */
  p5.ColorUtils.hsbaToRGBA = function(hsba, maxes) {
    var h = hsba[0];
    var s = hsba[1];
    var v = hsba[2];
    var a = hsba[3] || maxes[3];
    h /= maxes[0];
    s /= maxes[1];
    v /= maxes[2];
    a /= maxes[3];
    // Adapted from http://www.easyrgb.com/math.html
    // hsv values = 0 - 1, rgb values = 0 - 255
    var RGBA = [];
    if(s===0){
      RGBA = [Math.round(v*255), Math.round(v*255), Math.round(v*255), a];
    } else {
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
      RGBA = [
        Math.round(var_r * 255),
        Math.round(var_g * 255),
        Math.round(var_b * 255),
        Math.round(a * 255)
      ];
    }
    return RGBA;
  };

  /**
   * For a color expressed as an RGBA array, return the corresponding HSBA value
   * 
   * @param {Array} rgba An 'array' object that represents a list of
   *                          RGB colors on a scale of 0-255
   * @return {Array} an array of HSB values, on a scale of 0-255
   */
  p5.ColorUtils.rgbaToHSBA = function(rgba, maxes) {
    var var_R = rgba[0]/maxes[0];
    var var_G = rgba[1]/maxes[1];
    var var_B = rgba[2]/maxes[2];
    var var_A = rgba[3]/maxes[3];

    var var_Min = Math.min(var_R, var_G, var_B); //Min. value of RGB
    var var_Max = Math.max(var_R, var_G, var_B); //Max. value of RGB
    var del_Max = var_Max - var_Min;             //Delta RGB value 

    var H;
    var S;
    var V = var_Max;
    var A = var_A;

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
        Math.round(A * 255)
      ];
  };

  p5.ColorUtils.hslaToRGBA = function(hsla, maxes){
    var h = hsla[0];
    var s = hsla[1];
    var l = hsla[2];
    var a = hsla[3] || maxes[3];
    h /= maxes[0];
    s /= maxes[1];
    l /= maxes[2];
    a /= maxes[3];
    // Adapted from http://www.easyrgb.com/math.html
    // hsl values = 0 - 1, rgb values = 0 - 255
    var RGBA = [];
    if(s === 0){
      RGBA = [Math.round(l*255), Math.round(l*255), Math.round(l*255), a];
    } else {
      var m, n, var_r, var_g, var_b, var_a;

      n = l < 0.5 ? l * (1 + s) : (l + s) - (s * l);
      m = 2 * l - n;

      var convert = function(x, y, hue){
        if (hue < 0) {
          hue += 1;
        } else if (hue > 1) {
          hue -= 1;
        }

        if ( ( 6 * hue ) < 1 ) {
          return ( x + ( y - x ) * 6 * hue );
        } else if ( ( 2 * hue ) < 1 ) {
          return ( y );
        } else if ( ( 3 * hue ) < 2 ) {
          return ( x + ( y - x ) * ( ( 2 / 3 ) - hue ) * 6 );
        } else {
          return x;
        }
      };

      var_r = convert( m, n, h + ( 1 / 3 ) );
      var_g = convert( m, n, h );
      var_b = convert( m, n, h - ( 1 / 3 ) );
      var_a = a;

      RGBA = [
        Math.round(var_r * 255),
        Math.round(var_g * 255),
        Math.round(var_b * 255),
        Math.round(var_a * 255)
      ];

    }

    return RGBA;

  };
  
  return p5.ColorUtils;
});
