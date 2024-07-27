/**
 * @module Color
 * @submodule Creating & Reading
 * @for p5
 * @requires core
 * @requires constants
 * @requires color_conversion
 */

import p5 from '../core/main';
import * as constants from '../core/constants';
import color_conversion from './color_conversion';
import {
  ColorSpace,
  to,
  // toGamut,
  serialize,
  parse,
  // range,

  XYZ_D65,
  sRGB_Linear,
  sRGB,
  HSL,
  HSV,
  HWB,

  XYZ_D50,
  Lab,
  LCH,

  OKLab,
  OKLCH,

  P3_Linear,
  P3,

  A98RGB_Linear,
  A98RGB
} from 'colorjs.io/fn';

ColorSpace.register(XYZ_D65);
ColorSpace.register(sRGB_Linear);
ColorSpace.register(sRGB);
ColorSpace.register(HSL);
ColorSpace.register(HSV);
ColorSpace.register(HWB);

ColorSpace.register(XYZ_D50);
ColorSpace.register(Lab);
ColorSpace.register(LCH);

ColorSpace.register(OKLab);
ColorSpace.register(OKLCH);

ColorSpace.register(P3_Linear);
ColorSpace.register(P3);

ColorSpace.register(A98RGB_Linear);
ColorSpace.register(A98RGB);

// console.log(ColorSpace.registry);

/**
 * A class to describe a color.
 *
 * Each `p5.Color` object stores the color mode
 * and level maxes that were active during its construction. These values are
 * used to interpret the arguments passed to the object's constructor. They
 * also determine output formatting such as when
 * <a href="#/p5/saturation">saturation()</a> is called.
 *
 * Color is stored internally as an array of ideal RGBA values in floating
 * point form, normalized from 0 to 1. These values are used to calculate the
 * closest screen colors, which are RGBA levels from 0 to 255. Screen colors
 * are sent to the renderer.
 *
 * When different color representations are calculated, the results are cached
 * for performance. These values are normalized, floating-point numbers.
 *
 * Note: <a href="#/p5/color">color()</a> is the recommended way to create an
 * instance of this class.
 *
 * @class p5.Color
 * @param {p5} [pInst]                      pointer to p5 instance.
 *
 * @param {Number[]|String} vals            an array containing the color values
 *                                          for red, green, blue and alpha channel
 *                                          or CSS color.
 */
p5.Color = class Color {
  color;

  constructor(pInst, vals) {
    if(typeof vals[0] === 'string'){
      try{
        this.color = parse(vals[0]);
      }catch(err){
        // TODO: Invalid color string
        console.error('Invalid color string');
      }

    }else{
      let alpha = 1;

      if(vals.length === 4){
        alpha = vals.pop() / 255;
      }else if (vals.length === 2){
        alpha = vals[1] / 255;
        vals = [vals[0], vals[0], vals[0]];
      }else if(vals.length === 1){
        vals = [vals[0], vals[0], vals[0]];
      }

      // _colorMode can be 'rgb', 'hsb', or 'hsl'
      // These should map to color.js color space
      let space = 'srgb';
      let coords = vals;
      switch(pInst._colorMode){
        case 'rgb':
          space = 'srgb';
          coords = vals.map(
            (c, i) => c / pInst._colorMaxes[pInst._colorMode][i]
          );
          break;
        case 'hsb':
          // TODO: need implementation
          break;
        case 'hsl':
          space = 'hsl';
          coords = [
            vals[0] / pInst._colorMaxes[pInst._colorMode][0] * 360,
            vals[1] / pInst._colorMaxes[pInst._colorMode][1] * 100,
            vals[2] / pInst._colorMaxes[pInst._colorMode][2] * 100
          ];
          break;
        default:
          console.error('Invalid color mode');
      }

      const color = {
        space,
        coords,
        alpha
      };
      this.color = to(color, space);
    }
  }

  /**
   * Returns the color formatted as a `String`.
   *
   * Calling `myColor.toString()` can be useful for debugging, as in
   * `print(myColor.toString())`. It's also helpful for using p5.js with other
   * libraries.
   *
   * The parameter, `format`, is optional. If a format string is passed, as in
   * `myColor.toString('#rrggbb')`, it will determine how the color string is
   * formatted. By default, color strings are formatted as `'rgba(r, g, b, a)'`.
   *
   * @param {String} [format] how the color string will be formatted.
   * Leaving this empty formats the string as rgba(r, g, b, a).
   * '#rgb' '#rgba' '#rrggbb' and '#rrggbbaa' format as hexadecimal color codes.
   * 'rgb' 'hsb' and 'hsl' return the color formatted in the specified color mode.
   * 'rgba' 'hsba' and 'hsla' are the same as above but with alpha channels.
   * 'rgb%' 'hsb%' 'hsl%' 'rgba%' 'hsba%' and 'hsla%' format as percentages.
   * @return {String} the formatted string.
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a p5.Color object.
   *   let myColor = color('darkorchid');
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *
   *   // Display the text.
   *   text(myColor.toString('#rrggbb'), 50, 50);
   *
   *   describe('The text "#9932cc" written in purple on a gray background.');
   * }
   * </code>
   * </div>
   */
  toString(format) {
    // NOTE: memoize
    return serialize(this.color, {
      format
    });
  }

  /**
   * Sets the red component of a color.
   *
   * The range depends on the <a href="#/p5/colorMode">colorMode()</a>. In the
   * default RGB mode it's between 0 and 255.
   *
   * @param {Number} red the new red value.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a p5.Color object.
   *   let c = color(255, 128, 128);
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 20, 35, 60);
   *
   *   // Change the red value.
   *   c.setRed(64);
   *
   *   // Draw the right rectangle.
   *   fill(c);
   *   rect(50, 20, 35, 60);
   *
   *   describe('Two rectangles. The left one is salmon pink and the right one is teal.');
   * }
   * </code>
   * </div>
   */
  setRed(new_red) {
    this._array[0] = new_red / this.maxes[constants.RGB][0];
    this._calculateLevels();
  }

  /**
   * Sets the green component of a color.
   *
   * The range depends on the <a href="#/p5/colorMode">colorMode()</a>. In the
   * default RGB mode it's between 0 and 255.
   *
   * @param {Number} green the new green value.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a p5.Color object.
   *   let c = color(255, 128, 128);
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 20, 35, 60);
   *
   *   // Change the green value.
   *   c.setGreen(255);
   *
   *   // Draw the right rectangle.
   *   fill(c);
   *   rect(50, 20, 35, 60);
   *
   *   describe('Two rectangles. The left one is salmon pink and the right one is yellow.');
   * }
   * </code>
   * </div>
   **/
  setGreen(new_green) {
    this._array[1] = new_green / this.maxes[constants.RGB][1];
    this._calculateLevels();
  }

  /**
   * Sets the blue component of a color.
   *
   * The range depends on the <a href="#/p5/colorMode">colorMode()</a>. In the
   * default RGB mode it's between 0 and 255.
   *
   * @param {Number} blue the new blue value.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a p5.Color object.
   *   let c = color(255, 128, 128);
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 20, 35, 60);
   *
   *   // Change the blue value.
   *   c.setBlue(255);
   *
   *   // Draw the right rectangle.
   *   fill(c);
   *   rect(50, 20, 35, 60);
   *
   *   describe('Two rectangles. The left one is salmon pink and the right one is pale fuchsia.');
   * }
   * </code>
   * </div>
   **/
  setBlue(new_blue) {
    this._array[2] = new_blue / this.maxes[constants.RGB][2];
    this._calculateLevels();
  }

  /**
   * Sets the alpha (transparency) value of a color.
   *
   * The range depends on the
   * <a href="#/p5/colorMode">colorMode()</a>. In the default RGB mode it's
   * between 0 and 255.
   *
   * @param {Number} alpha the new alpha value.
   *
   * @example
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a p5.Color object.
   *   let c = color(255, 128, 128);
   *
   *   // Draw the left rectangle.
   *   noStroke();
   *   fill(c);
   *   rect(15, 20, 35, 60);
   *
   *   // Change the alpha value.
   *   c.setAlpha(128);
   *
   *   // Draw the right rectangle.
   *   fill(c);
   *   rect(50, 20, 35, 60);
   *
   *   describe('Two rectangles. The left one is salmon pink and the right one is faded pink.');
   * }
   * </code>
   * </div>
   **/
  setAlpha(new_alpha) {
    this._array[3] = new_alpha / this.maxes[this.mode][3];
    this._calculateLevels();
  }

  // calculates and stores the closest screen levels
  _calculateLevels() {
    const array = this._array;
    // (loop backwards for performance)
    const levels = (this.levels = new Array(array.length));
    for (let i = array.length - 1; i >= 0; --i) {
      levels[i] = Math.round(array[i] * 255);
    }

    // Clear cached HSL/HSB values
    this.hsla = null;
    this.hsba = null;
  }

  _getAlpha() {
    return this._array[3] * this.maxes[this.mode][3];
  }

  _getMode() {
    return this.mode;
  }

  _getMaxes() {
    return this.maxes;
  }

  _getBlue() {
    return this._array[2] * this.maxes[constants.RGB][2];
  }

  _getBrightness() {
    if (!this.hsba) {
      this.hsba = color_conversion._rgbaToHSBA(this._array);
    }
    return this.hsba[2] * this.maxes[constants.HSB][2];
  }

  _getGreen() {
    return this._array[1] * this.maxes[constants.RGB][1];
  }

  /**
   * Hue is the same in HSB and HSL, but the maximum value may be different.
   * This function will return the HSB-normalized saturation when supplied with
   * an HSB color object, but will default to the HSL-normalized saturation
   * otherwise.
   */
  _getHue() {
    if (this.mode === constants.HSB) {
      if (!this.hsba) {
        this.hsba = color_conversion._rgbaToHSBA(this._array);
      }
      return this.hsba[0] * this.maxes[constants.HSB][0];
    } else {
      if (!this.hsla) {
        this.hsla = color_conversion._rgbaToHSLA(this._array);
      }
      return this.hsla[0] * this.maxes[constants.HSL][0];
    }
  }

  _getLightness() {
    if (!this.hsla) {
      this.hsla = color_conversion._rgbaToHSLA(this._array);
    }
    return this.hsla[2] * this.maxes[constants.HSL][2];
  }

  _getRed() {
    return this._array[0] * this.maxes[constants.RGB][0];
  }

  /**
   * Saturation is scaled differently in HSB and HSL. This function will return
   * the HSB saturation when supplied with an HSB color object, but will default
   * to the HSL saturation otherwise.
   */
  _getSaturation() {
    if (this.mode === constants.HSB) {
      if (!this.hsba) {
        this.hsba = color_conversion._rgbaToHSBA(this._array);
      }
      return this.hsba[1] * this.maxes[constants.HSB][1];
    } else {
      if (!this.hsla) {
        this.hsla = color_conversion._rgbaToHSLA(this._array);
      }
      return this.hsla[1] * this.maxes[constants.HSL][1];
    }
  }
};

export default p5.Color;
