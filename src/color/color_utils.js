/**
 * module Utils
 * submodule Color Utils
 * @for p5
 */

var p5 = require('../core/core');

p5.ColorUtils = {};

/**
 * For a color expressed as an HSBA array, return the corresponding RGBA value
 * @param {Array} hsba An 'array' object that represents a list of HSB colors
 * @param {Array} maxes An 'array' object that represents the HSB range maxes
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
    RGBA = [Math.round(v*255), Math.round(v*255), Math.round(v*255), a*255];
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
    var r;
    var g;
    var b;
    if(var_i===0){
      r = v;
      g = var_3;
      b = var_1;
    }else if(var_i===1){
      r = var_2;
      g = v;
      b = var_1;
    }else if(var_i===2){
      r = var_1;
      g = v;
      b = var_3;
    }else if(var_i===3){
      r = var_1;
      g = var_2;
      b = v;
    }else if (var_i===4){
      r = var_3;
      g = var_1;
      b = v;
    }else{
      r = v;
      g = var_1;
      b = var_2;
    }
    RGBA = [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255),
      a * 255
    ];
  }
  return RGBA;
};

/**
 * For a color expressed as an RGBA array, return the corresponding HSBA value
 *
 * @param {Array} rgba An 'array' object that represents a list of RGB colors
 * @param {Array} maxes An 'array' object that represents the RGB range maxes
 * @return {Array} an array of HSB values, scaled by the HSB-space maxes
 */
p5.ColorUtils.rgbaToHSBA = function(rgba, maxes) {
  var r = rgba[0]/maxes[0];
  var g = rgba[1]/maxes[1];
  var b = rgba[2]/maxes[2];
  var a = rgba[3]/maxes[3];

  var min = Math.min(r, g, b); //Min. value of RGB
  var max = Math.max(r, g, b); //Max. value of RGB
  var delta_max = max - min;             //Delta RGB value

  var h;
  var s;
  var v = max;

  if (delta_max === 0) { //This is a gray, no chroma...
    h = 0; //HSV results from 0 to 1
    s = 0;
  }
  else { //Chromatic data...
    s = delta_max/max;

    var delta_r = ( ( ( max - r ) / 6 ) + ( delta_max / 2 ) ) / delta_max;
    var delta_g = ( ( ( max - g ) / 6 ) + ( delta_max / 2 ) ) / delta_max;
    var delta_b = ( ( ( max - b ) / 6 ) + ( delta_max / 2 ) ) / delta_max;

    if (r === max) {
      h = delta_b - delta_g;
    } else if (g === max) {
      h = 1/3 + delta_r - delta_b;
    } else if (b === max) {
      h = 2/3 + delta_g - delta_r;
    }

    if (h < 0) {
      h += 1;
    }
    if (h > 1) {
      h -= 1;
    }
  }
  return [
      Math.round(h * 360),
      Math.round(s * 100),
      Math.round(v * 100),
      a * 1
    ];
};

/**
 * For a color expressed as an HSLA array, return the corresponding RGBA value
 *
 * @param  {Array} hsla An 'array' object that represents a list of HSL colors
 * @param  {Array} maxes An 'array' object that represents the HSL range maxes
 *
 * @return {Array} an array of RGBA values, on a scale of 0-255
 */
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
  var rgba = [];
  if(s === 0){
    rgba = [Math.round(l*255), Math.round(l*255), Math.round(l*255), a];
  } else {
    var m, n, r, g, b;

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

    r = convert( m, n, h + ( 1 / 3 ) );
    g = convert( m, n, h );
    b = convert( m, n, h - ( 1 / 3 ) );

    rgba = [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255),
      Math.round(a * 255)
    ];

  }

  return rgba;

};

/**
 * For a color expressed as an RGBA array, return the corresponding HSBA value
 *
 * @param {Array} rgba An 'array' object that represents a list of RGB colors
 * @param {Array} maxes An 'array' object that represents the RGB range maxes
 * @return {Array} an array of HSL values, scaled by the HSL-space maxes
 */
p5.ColorUtils.rgbaToHSLA = function(rgba, maxes) {
  var r = rgba[0]/maxes[0];
  var g = rgba[1]/maxes[1];
  var b = rgba[2]/maxes[2];
  var a = rgba[3]/maxes[3];

  var min = Math.min(r, g, b); //Min. value of RGB
  var max = Math.max(r, g, b); //Max. value of RGB
  var delta_max = max - min;             //Delta RGB value

  var h;
  var s;
  var l = (max + min) / 2;

  var delta_r;
  var delta_g;
  var delta_b;

  if (delta_max === 0) { // This is a gray, no chroma...
    h = 0;             // HSL results from 0 to 1
    s = 0;
  } else {              // Chromatic data...

    delta_r = ( ( ( max - r ) / 6 ) + ( delta_max / 2 ) ) / delta_max;
    delta_g = ( ( ( max - g ) / 6 ) + ( delta_max / 2 ) ) / delta_max;
    delta_b = ( ( ( max - b ) / 6 ) + ( delta_max / 2 ) ) / delta_max;

    if ( r === max ){
      h = delta_b - delta_g;
    } else if ( g === max ){
      h = ( 1 / 3 ) + delta_r - delta_b;
    } else if ( b === max ) {
      h = ( 2 / 3 ) + delta_g - delta_r;
    }

    if ( h < 0 ) {
      h += 1;
    }

    if ( h > 1 ) {
      h -= 1;
    }

    if ( l < 0.5 ){
      s = delta_max / ( max + min );
    } else {
      s = delta_max / ( 2 - max - min );
    }

  }
  return [
      Math.round(h * 360),
      Math.round(s * 100),
      Math.round(l * 100),
      a * 1
    ];
};

module.exports = p5.ColorUtils;
