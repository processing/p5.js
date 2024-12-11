/**
 * @module Color
 * @submodule Creating & Reading
 * @for p5
 * @requires core
 * @requires color_conversion
 */

import { RGB, RGBHDR, HSL, HSB, HWB, LAB, LCH, OKLAB, OKLCH } from './creating_reading';

import {
  ColorSpace,
  to,
  toGamut,
  serialize,
  parse,
  range,

  sRGB,
  HSL as HSLSpace,
  HWB as HWBSpace,

  Lab,
  LCH as LCHSpace,

  OKLab,
  OKLCH as OKLCHSpace,

  P3
} from 'colorjs.io/fn';
import HSBSpace from './color_spaces/hsb.js';

const map = (n, start1, stop1, start2, stop2) =>
  ((n - start1) / (stop1 - start1) * (stop2 - start2) + start2);

class Color {
  // Reference to underlying color object depending on implementation
  // Not meant to be used publicly unless the implementation is known for sure
  _color;
  // Color mode of the Color object, uses p5 color modes
  mode;

  static colorMap = {};
  static colorMaxes = {};
  static #colorjsMaxes = {};

  // Used to add additional color modes to p5.js
  // Uses underlying library's definition
  static addColorMode(mode, definition, maxes){
    ColorSpace.register(definition);
    Color.colorMap[mode] = definition.id;
    // Get colorjs maxes
    Color.#colorjsMaxes[mode] = Object.values(definition.coords).reduce((acc, v) => {
        acc.push(v.refRange || v.range);
        return acc;
      }, []);
    Color.#colorjsMaxes[mode].push([0, 1]);

    if(maxes){
      Color.colorMaxes[mode] = maxes;
    }else{
      Color.colorMaxes[mode] = structuredClone(Color.#colorjsMaxes[mode]);
    }
  }

  // TODO: memoize map/unmap methods
  // Convert from p5 color range to color.js color range
  #mapColorRange(origin){
    const p5Maxes = Color.colorMaxes[this.mode].map((max) => {
      if(!Array.isArray(max)){
        return [0, max];
      }else{
        return max;
      }
    });
    const colorjsMaxes = Color.#colorjsMaxes[this.mode];

    return origin.map((channel, i) => {
      const newval = map(channel, p5Maxes[i][0], p5Maxes[i][1], colorjsMaxes[i][0], colorjsMaxes[i][1]);
      return newval;
    });
  }

  // Convert from color.js color range to p5 color range
  #unmapColorRange(origin){
    const p5Maxes = Color.colorMaxes[this.mode].map((max) => {
      if(!Array.isArray(max)){
        return [0, max];
      }else{
        return max;
      }
    });
    const colorjsMaxes = Color.#colorjsMaxes[this.mode];

    return origin.map((channel, i) => {
      const newval = map(channel, colorjsMaxes[i][0], colorjsMaxes[i][1], p5Maxes[i][0], p5Maxes[i][1]);
      return newval;
    });
  }

  // Will do conversion in-Gamut as out of Gamut conversion is only really useful for futher conversions
  #toColorMode(mode){

  }

  constructor(vals, colorMode=RGB) {
    // This changes with the color object
    this.mode = colorMode;

    if (typeof vals === 'object' && !Array.isArray(vals) && vals !== null){
      this._color = vals;
      this.mode = vals.mode;

    } else if(typeof vals[0] === 'string') {
      try{
        this._color = parse(vals[0]);
        const [mode] = Object.entries(Color.colorMap).find(([key, val]) => {
          return val === this._color.spaceId;
        });
        this.mode = mode;
        this._color = to(this._color, this._color.spaceId);
      }catch(err){
        // TODO: Invalid color string
        console.error('Invalid color string');
      }

    }else{
      let alpha;

      if(vals.length === 4){
        alpha = vals.pop();
      }else if (vals.length === 2){
        alpha = vals[1];
        vals = [vals[0], vals[0], vals[0]];
      }else if(vals.length === 1){
        vals = [vals[0], vals[0], vals[0]];
      }
      const alphaMaxes = Array.isArray(Color.colorMaxes[this.mode][3]) ?
        Color.colorMaxes[this.mode][3] :
        [0, Color.colorMaxes[this.mode][3]];
      alpha = alpha !== undefined ?
        map(alpha, alphaMaxes[0], alphaMaxes[1], 0, 1)
        : 1;

      const space = Color.colorMap[this.mode] || console.error('Invalid color mode');
      const coords = this.#mapColorRange(vals);

      const color = {
        space,
        coords,
        alpha
      };
      this._color = toGamut(color, space);
    }
  }

  // Get raw coordinates of underlying library, can differ between libraries
  get _array() {
    return [...this._color.coords, this._color.alpha];
  }

  // Get coordinates mapped to current color maxes
  get _levels() {
    return this.#unmapColorRange(this._array);
  }

  lerp(color, amt, mode){
    // Find the closest common ancestor color space
    let spaceIndex = -1;
    while(
      (
        spaceIndex+1 < this._color.space.path.length ||
        spaceIndex+1 < color._color.space.path.length
      ) &&
      this._color.space.path[spaceIndex+1] === color._color.space.path[spaceIndex+1]
    ){
      spaceIndex += 1;
    }

    if (spaceIndex === -1) {
      // This probably will not occur in practice
      throw new Error('Cannot lerp colors. No common color space found');
    }

    const obj = range(this._color, color._color, {
      space: this._color.space.path[spaceIndex].id
    })(amt);

    return new Color(obj, mode || this.mode);
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
    return serialize(this._color, {
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
    const red_val = new_red / Color.colorMaxes[RGB][0];

    if(this.mode === RGB){
      this._color.coords[0] = red_val;
    }else{
      // Will do an imprecise conversion to 'srgb', not recommended
      const space = this._color.space.id;
      const representation = to(this._color, 'srgb');
      representation.coords[0] = red_val;
      this._color = to(representation, space);
    }
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
    const green_val = new_green / Color.colorMaxes[RGB][1];
    if(this.mode === RGB){
      this._color.coords[1] = green_val;
    }else{
      // Will do an imprecise conversion to 'srgb', not recommended
      const space = this._color.space.id;
      const representation = to(this._color, 'srgb');
      representation.coords[1] = green_val;
      this._color = to(representation, space);
    }
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
    const blue_val = new_blue / Color.colorMaxes[RGB][2];
    if(this.mode === RGB){
      this._color.coords[2] = blue_val;
    }else{
      // Will do an imprecise conversion to 'srgb', not recommended
      const space = this._color.space.id;
      const representation = to(this._color, 'srgb');
      representation.coords[2] = blue_val;
      this._color = to(representation, space);
    }
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
    this._color.alpha = new_alpha / Color.colorMaxes[this.mode][3];
  }

  _getRed() {
    if(this.mode === RGB){
      return this._color.coords[0] * Color.colorMaxes[RGB][0];
    }else{
      // Will do an imprecise conversion to 'srgb', not recommended
      return toGamut(this._color, 'srgb').coords[0] * Color.colorMaxes[RGB][0];
    }
  }

  _getGreen() {
    if(this.mode === RGB){
      return this._color.coords[1] * Color.colorMaxes[RGB][1];
    }else{
      // Will do an imprecise conversion to 'srgb', not recommended
      return toGamut(this._color, 'srgb').coords[1]  * Color.colorMaxes[RGB][1];
    }
  }

  _getBlue() {
    if(this.mode === RGB){
      return this._color.coords[2]  * Color.colorMaxes[RGB][2];
    }else{
      // Will do an imprecise conversion to 'srgb', not recommended
      return toGamut(this._color, 'srgb').coords[2]  * Color.colorMaxes[RGB][2];
    }
  }

  _getAlpha() {
    return this._color.alpha * Color.colorMaxes[this.mode][3];
  }

  _getRGBA(maxes=[1, 1, 1, 1]) {
    // Get colorjs maxes
    const colorjsMaxes = Color.#colorjsMaxes[this.mode];

    // Normalize everything to 0,1 or the provided range (map)
    let coords = structuredClone(toGamut(this._color, 'srgb').coords);
    coords.push(this._color.alpha);

    const rangeMaxes = maxes.map((v) => {
      if(!Array.isArray(v)){
        return [0, v];
      }else{
        return v
      }
    });

    coords = coords.map((coord, i) => {
      return map(coord, colorjsMaxes[i][0], colorjsMaxes[i][1], rangeMaxes[i][0], rangeMaxes[i][1]);
    });

    return coords;
  }

  _getMode() {
    return this.mode;
  }

  _getMaxes() {
    return Color.colorMaxes;
  }

  /**
   * Hue is the same in HSB and HSL, but the maximum value may be different.
   * This function will return the HSB-normalized saturation when supplied with
   * an HSB color object, but will default to the HSL-normalized saturation
   * otherwise.
   */
  _getHue() {
    if(this.mode === HSB || this.mode === HSL){
      return this._color.coords[0] / 360 * Color.colorMaxes[this.mode][0];
    }else{
      // Will do an imprecise conversion to 'HSL', not recommended
      return to(this._color, 'hsl').coords[0] / 360 * Color.colorMaxes[this.mode][0];
    }
  }

  /**
   * Saturation is scaled differently in HSB and HSL. This function will return
   * the HSB saturation when supplied with an HSB color object, but will default
   * to the HSL saturation otherwise.
   */
  _getSaturation() {
    if(this.mode === HSB || this.mode === HSL){
      return this._color.coords[1] / 100 * Color.colorMaxes[this.mode][1];
    }else{
      // Will do an imprecise conversion to 'HSL', not recommended
      return to(this._color, 'hsl').coords[1] / 100 * Color.colorMaxes[this.mode][1];
    }
  }

  _getBrightness() {
    if(this.mode === HSB){
      return this._color.coords[2] / 100 * Color.colorMaxes[this.mode][2];
    }else{
      // Will do an imprecise conversion to 'HSB', not recommended
      return to(this._color, 'hsb').coords[2] / 100 * Color.colorMaxes[this.mode][2];
    }
  }

  _getLightness() {
    if(this.mode === HSL){
      return this._color.coords[2] / 100 * Color.colorMaxes[this.mode][2];
    }else{
      // Will do an imprecise conversion to 'HSL', not recommended
      return to(this._color, 'hsl').coords[2] / 100 * Color.colorMaxes[this.mode][2];
    }
  }
}

function color(p5, fn){
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
  p5.Color = Color;

  // Register color modes and initialize Color maxes to what p5 has set for itself
  p5.Color.addColorMode(RGB, sRGB, fn._colorMaxes?.[RGB]);
  p5.Color.addColorMode(RGBHDR, P3, fn._colorMaxes?.[RGBHDR]);
  p5.Color.addColorMode(HSB, HSBSpace, fn._colorMaxes?.[HSB]);
  p5.Color.addColorMode(HSL, HSLSpace, fn._colorMaxes?.[HSL]);
  p5.Color.addColorMode(HWB, HWBSpace, fn._colorMaxes?.[HWB]);
  p5.Color.addColorMode(LAB, Lab, fn._colorMaxes?.[LAB]);
  p5.Color.addColorMode(LCH, LCHSpace, fn._colorMaxes?.[LCH]);
  p5.Color.addColorMode(OKLAB, OKLab, fn._colorMaxes?.[OKLAB]);
  p5.Color.addColorMode(OKLCH, OKLCHSpace, fn._colorMaxes?.[OKLCH]);
}

export default color;
export { Color }

if(typeof p5 !== 'undefined'){
  color(p5, p5.prototype);
}
