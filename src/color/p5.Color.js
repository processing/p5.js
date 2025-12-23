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
  contrastWCAG21,
  contrastAPCA,
  P3
} from 'colorjs.io/fn';
import HSBSpace from './color_spaces/hsb.js';

const map = (n, start1, stop1, start2, stop2, clamp) => {
  let result = ((n - start1) / (stop1 - start1) * (stop2 - start2) + start2);
  if (clamp) {
    result = Math.max(result, Math.min(start2, stop2));
    result = Math.min(result, Math.max(start2, stop2));
  }
  return result;
}

const toHexComponent = (v) => {
  const vInt = ~~(v * 255);
  const hex = vInt.toString(16)
  if (hex.length < 2) {
    return '0' + hex
  } else {
    return hex
  }
}

const serializationMap = new Map();




class Color {
  static colorMap = {};
  static #colorjsMaxes = {};
  static #grayscaleMap = {};

  // Used to add additional color modes to p5.js
  // Uses underlying library's definition
  static addColorMode(mode, definition){
    ColorSpace.register(definition);
    Color.colorMap[mode] = definition.id;

    // Get colorjs maxes
    Color.#colorjsMaxes[mode] = Object.values(definition.coords)
      .reduce((acc, v) => {
        acc.push(v.refRange || v.range);
        return acc;
      }, []);
    Color.#colorjsMaxes[mode].push([0, 1]);

    // Get grayscale mapping
    Color.#grayscaleMap[mode] = definition.fromGray;
  }

  constructor(vals, colorMode, colorMaxes, { clamp = false } = {}) {
    // This changes with the color object
    this._cachedMode = colorMode || RGB;

    if(vals instanceof Color){
      // Received Color object to be used for color mode conversion
      const mode = colorMode ?
        Color.colorMap[colorMode] :
        Color.colorMap[vals.mode];
      this._initialize = () => {
        this._cachedColor = to(vals._color, mode);
        this._cachedMode = mode;
      };

    }else if (typeof vals === 'object' && !Array.isArray(vals) && vals !== null){
      // Received color.js object to be used internally
      const mode = colorMode ?
        Color.colorMap[colorMode] :
        vals.spaceId;
      this._initialize = () => {
        this._cachedColor = to(vals, mode);
        this._cachedMode = colorMode || Object.entries(Color.colorMap)
          .find(([key, val]) => {
            return val === this._cachedColor.spaceId;
          });
      };

    } else if(typeof vals[0] === 'string') {
      // Received string
      this._defaultStringValue = vals[0];
      this._initialize = () => {
        try{
          this._cachedColor = parse(vals[0]);
          const [mode] = Object.entries(Color.colorMap).find(([key, val]) => {
            return val === this._cachedColor.spaceId;
          });
          this._cachedMode = mode;
          this._cachedColor = to(this._cachedColor, this._cachedColor.spaceId);
        }catch(err){
          // TODO: Invalid color string
          throw new Error('Invalid color string');
        }
      };

    }else{
      // Received individual channel values
      let mappedVals;

      if(colorMaxes){
        // NOTE: need to consider different number of arguments (eg. CMYK)
        if(vals.length === 4){
          mappedVals = Color.mapColorRange(vals, this._cachedMode, colorMaxes, clamp);
        }else if(vals.length === 3){
          mappedVals = Color.mapColorRange(
            [vals[0], vals[1], vals[2]],
            this._cachedMode,
            colorMaxes,
            clamp
          );
          mappedVals.push(1);
        }else if(vals.length === 2){
          // Grayscale with alpha
          if(Color.#grayscaleMap[this._cachedMode]){
            mappedVals = Color.#grayscaleMap[this._cachedMode](
              vals[0],
              colorMaxes,
              clamp
            );
          }else{
            mappedVals = Color.mapColorRange(
              [vals[0], vals[0], vals[0]],
              this._cachedMode,
              colorMaxes,
              clamp
            );
          }
          const alphaMaxes = Array.isArray(colorMaxes[colorMaxes.length-1]) ?
            colorMaxes[colorMaxes.length-1] :
            [0, colorMaxes[colorMaxes.length-1]];
          mappedVals.push(
            map(
              vals[1],
              alphaMaxes[0],
              alphaMaxes[1],
              0,
              1,
              clamp
            )
          );
        }else if(vals.length === 1){
          // Grayscale only
          if(Color.#grayscaleMap[this._cachedMode]){
            mappedVals = Color.#grayscaleMap[this._cachedMode](
              vals[0],
              colorMaxes,
              clamp
            );
          }else{
            mappedVals = Color.mapColorRange(
              [vals[0], vals[0], vals[0]],
              this._cachedMode,
              colorMaxes,
              clamp
            );
          }
          mappedVals.push(1);
        }else{
          throw new Error('Invalid color');
        }
      }else{
        mappedVals = vals;
      }
      if (this._cachedMode === RGB) {
        if (mappedVals[3] === 1) {
          // Faster for the browser to parse than rgba
          this._defaultStringValue = '#' + toHexComponent(mappedVals[0]) + toHexComponent(mappedVals[1]) + toHexComponent(mappedVals[2]);
        } else {
          this._defaultStringValue = '#' + toHexComponent(mappedVals[0]) + toHexComponent(mappedVals[1]) + toHexComponent(mappedVals[2]) + toHexComponent(mappedVals[3]);;
        }
      }

      this._initialize = () => {
        const space = Color.colorMap[this._cachedMode] || console.error('Invalid color mode');
        const coords = mappedVals.slice(0, 3);

        const color = {
          space,
          coords,
          alpha: mappedVals[3]
        };
        this._cachedColor = to(color, space);
      };
    }
  }

  // Color mode of the Color object, uses p5 color modes
  get mode() {
    if (this._initialize) {
      this._initialize();
      this._initialize = undefined;
    }
    return this._cachedMode;
  }
  set mode(newMode) {
    if (this._initialize) {
      this._initialize();
      this._initialize = undefined;
    }
    this._cachedMode = newMode;
  }
  // Reference to underlying color object depending on implementation
  // Not meant to be used publicly unless the implementation is known for sure
  get _color() {
    if (this._initialize) {
      this._initialize();
      this._initialize = undefined;
    }
    return this._cachedColor;
  }
  set _color(newColor) {
    if (this._initialize) {
      this._initialize();
      this._initialize = undefined;
    }
    this._cachedColor = newColor;
  }

  // Convert from p5 color range to color.js color range
  static mapColorRange(origin, mode, maxes, clamp){
    const p5Maxes = maxes.map(max => {
      if(!Array.isArray(max)){
        return [0, max];
      }else{
        return max;
      }
    });
    const colorjsMaxes = Color.#colorjsMaxes[mode];

    return origin.map((channel, i) => {
      const newval = map(
        channel,
        p5Maxes[i][0], p5Maxes[i][1],
        colorjsMaxes[i][0], colorjsMaxes[i][1],
        clamp
      );
      return newval;
    });
  }

  // Convert from color.js color range to p5 color range
  static unmapColorRange(origin, mode, maxes){
    const p5Maxes = maxes.map(max => {
      if(!Array.isArray(max)){
        return [0, max];
      }else{
        return max;
      }
    });
    const colorjsMaxes = Color.#colorjsMaxes[mode];

    return origin.map((channel, i) => {
      const newval = map(
        channel,
        colorjsMaxes[i][0], colorjsMaxes[i][1],
        p5Maxes[i][0], p5Maxes[i][1]
      );
      return newval;
    });
  }

  // Will do conversion in-Gamut as out of Gamut conversion is only really useful for futher conversions
  #toColorMode(mode){
    return new Color(this._color, mode);
  }

  // Get raw coordinates of underlying library, can differ between libraries
  get _array() {
    return this._getRGBA();
  }

  array(){
    return this._array;
  }

  lerp(color, amt, mode){
    // Find the closest common ancestor color space
    let spaceIndex = -1;
    while(
      (
        spaceIndex+1 < this._color.space.path.length ||
        spaceIndex+1 < color._color.space.path.length
      ) &&
      this._color.space.path[spaceIndex+1] ===
        color._color.space.path[spaceIndex+1]
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
   * @example
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
    if (format === undefined && this._defaultStringValue !== undefined) {
      return this._defaultStringValue;
    }

    const key = `${this._color.space.id}-${this._color.coords.join(',')}-${this._color.alpha}-${format}`;
    let colorString = serializationMap.get(key);

    if(!colorString){
      colorString = serialize(this._color, {
        format
      });
      if (serializationMap.size > 1000) {
        serializationMap.delete(serializationMap.keys().next().value)
      }
      serializationMap.set(key, colorString);
    }
    return colorString;
  }

  /**
   * Checks the contrast between two colors. This method returns a boolean
   * value to indicate if the two color has enough contrast. `true` means that
   * the colors has enough contrast to be used as background color and body
   * text color. `false` means there is not enough contrast.
   *
   * A second argument can be passed to the method, `options` , which defines
   * the algorithm to be used. The algorithms currently supported are
   * WCAG 2.1 (`'WCAG21'`) or APCA (`'APCA'`). The default is WCAG 2.1. If a
   * value of `'all'` is passed to the `options` argument, an object containing
   * more details is returned. The details object will include the calculated
   * contrast value of the colors and different passing criteria.
   *
   * For more details about color contrast, you can check out
   * <a href="https://colorjs.io/docs/contrast">this page from color.js</a>, and the
   * <a href="https://webaim.org/resources/contrastchecker/">WebAIM color contrast checker.</a>
   *
   * @param {Color} other
   * @returns {boolean|object}
   * @example
   * <div>
   * <code>
   * let bgColor, fg1Color, fg2Color, msg1, msg2;
   * function setup() {
   *   createCanvas(100, 100);
   *   bgColor = color(0);
   *   fg1Color = color(100);
   *   fg2Color = color(220);
   *
   *   if(bgColor.contrast(fg1Color)){
   *     msg1 = 'good';
   *   }else{
   *     msg1 = 'bad';
   *   }
   *
   *   if(bgColor.contrast(fg2Color)){
   *     msg2 = 'good';
   *   }else{
   *     msg2 = 'bad';
   *   }
   *
   *   describe('A black canvas with a faint grey word saying "bad" at the top left and a brighter light grey word saying "good" in the middle of the canvas.');
   * }
   *
   * function draw(){
   *   background(bgColor);
   *
   *   textSize(18);
   *
   *   fill(fg1Color);
   *   text(msg1, 10, 30);
   *
   *   fill(fg2Color);
   *   text(msg2, 10, 60);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let bgColor, fgColor, contrast;
   * function setup() {
   *   createCanvas(100, 100);
   *   bgColor = color(0);
   *   fgColor = color(200);
   *   contrast = bgColor.contrast(fgColor, 'all');
   *
   *   describe('A black canvas with four short lines of grey text that respectively says: "WCAG 2.1", "12.55", "APCA", and "-73.30".');
   * }
   *
   * function draw(){
   *   background(bgColor);
   *
   *   textSize(14);
   *
   *   fill(fgColor);
   *   text('WCAG 2.1', 10, 25);
   *   text(nf(contrast.WCAG21.value, 0, 2), 10, 40);
   *
   *   text('APCA', 10, 70);
   *   text(nf(contrast.APCA.value, 0, 2), 10, 85);
   * }
   * </code>
   * </div>
   */
  contrast(other_color, options='WCAG21') {
    if(options !== 'all'){
      let contrastVal, minimum;
      switch(options){
        case 'WCAG21':
          contrastVal = contrastWCAG21(this._color, other_color._color);
          minimum = 4.5;
          break;
        case 'APCA':
          contrastVal = Math.abs(contrastAPCA(this._color, other_color._color));
          minimum = 75;
          break;
        default:
          return null;
      }

      return contrastVal >= minimum;
    }else{
      const wcag21Value = contrastWCAG21(this._color, other_color._color);
      const apcaValue = contrastAPCA(this._color, other_color._color);
      return {
        WCAG21: {
          value: wcag21Value,
          passedMinimum: wcag21Value >= 4.5,
          passedAAA: wcag21Value >= 7
        },
        APCA: {
          value: apcaValue,
          passedMinimum: Math.abs(apcaValue) >= 75
        }
      };
    }
  };

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
  setRed(new_red, max=[0, 1]) {
    this._defaultStringValue = undefined;
    if(!Array.isArray(max)){
      max = [0, max];
    }

    const colorjsMax = Color.#colorjsMaxes[RGB][0];
    const newval = map(new_red, max[0], max[1], colorjsMax[0], colorjsMax[1]);

    if(this.mode === RGB || this.mode === RGBHDR){
      this._color.coords[0] = newval;
    }else{
      // Will do an imprecise conversion to 'srgb', not recommended
      const space = this._color.space.id;
      const representation = to(this._color, 'srgb');
      representation.coords[0] = newval;
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
   */
  setGreen(new_green, max=[0, 1]) {
    this._defaultStringValue = undefined;
    if(!Array.isArray(max)){
      max = [0, max];
    }

    const colorjsMax = Color.#colorjsMaxes[RGB][1];
    const newval = map(new_green, max[0], max[1], colorjsMax[0], colorjsMax[1]);

    if(this.mode === RGB || this.mode === RGBHDR){
      this._color.coords[1] = newval;
    }else{
      // Will do an imprecise conversion to 'srgb', not recommended
      const space = this._color.space.id;
      const representation = to(this._color, 'srgb');
      representation.coords[1] = newval;
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
   */
  setBlue(new_blue, max=[0, 1]) {
    this._defaultStringValue = undefined;
    if(!Array.isArray(max)){
      max = [0, max];
    }

    const colorjsMax = Color.#colorjsMaxes[RGB][2];
    const newval = map(new_blue, max[0], max[1], colorjsMax[0], colorjsMax[1]);

    if(this.mode === RGB || this.mode === RGBHDR){
      this._color.coords[2] = newval;
    }else{
      // Will do an imprecise conversion to 'srgb', not recommended
      const space = this._color.space.id;
      const representation = to(this._color, 'srgb');
      representation.coords[2] = newval;
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
   */
  setAlpha(new_alpha, max=[0, 1]) {
    this._defaultStringValue = undefined;
    if(!Array.isArray(max)){
      max = [0, max];
    }

    const colorjsMax = Color.#colorjsMaxes[this.mode][3];
    const newval = map(new_alpha, max[0], max[1], colorjsMax[0], colorjsMax[1]);

    this._color.alpha = newval;
  }

  _getRGBA(maxes=[1, 1, 1, 1]) {
    // Get colorjs maxes
    const colorjsMaxes = Color.#colorjsMaxes[RGB];

    // Normalize everything to 0,1 or the provided range (map)
    let coords = structuredClone(to(this._color, 'srgb').coords);
    coords.push(this._color.alpha);

    const rangeMaxes = maxes.map((v) => {
      if(!Array.isArray(v)){
        return [0, v];
      }else{
        return v
      }
    });

    coords = coords.map((coord, i) => {
      return map(
        coord,
        colorjsMaxes[i][0], colorjsMaxes[i][1],
        rangeMaxes[i][0], rangeMaxes[i][1]
      );
    });

    return coords;
  }

  _getMode() {
    return this.mode;
  }

  _getRed(max=[0, 1]) {
    if(!Array.isArray(max)){
      max = [0, max];
    }

    if(this.mode === RGB || this.mode === RGBHDR){
      const colorjsMax = Color.#colorjsMaxes[this.mode][0];
      return map(
        this._color.coords[0],
        colorjsMax[0], colorjsMax[1],
        max[0], max[1]
      );
    }else{
      // Will do an imprecise conversion to 'srgb', not recommended
      const colorjsMax = Color.#colorjsMaxes[RGB][0];
      return map(to(this._color, 'srgb').coords[0], colorjsMax[0], colorjsMax[1], max[0], max[1]);
    }
  }

  /**
   * This function extracts the green value from a color object and
   * returns it in the range 0–255 by default. When `colorMode()` is given to an
   * RBG value, the green value within the givin range is returned
   */
  _getGreen(max=[0, 1]) {
    if(!Array.isArray(max)){
      max = [0, max];
    }

    if(this.mode === RGB || this.mode === RGBHDR){
      const colorjsMax = Color.#colorjsMaxes[this.mode][1];
      return map(
        this._color.coords[1],
        colorjsMax[0], colorjsMax[1],
        max[0], max[1]
      );
    }else{
      // Will do an imprecise conversion to 'srgb', not recommended
      const colorjsMax = Color.#colorjsMaxes[RGB][1];
      return map(to(this._color, 'srgb').coords[1], colorjsMax[0], colorjsMax[1], max[0], max[1]);
    }
  }

  _getBlue(max=[0, 1]) {
    if(!Array.isArray(max)){
      max = [0, max];
    }

    if(this.mode === RGB || this.mode === RGBHDR){
      const colorjsMax = Color.#colorjsMaxes[this.mode][2];
      return map(
        this._color.coords[2],
        colorjsMax[0], colorjsMax[1],
        max[0], max[1]
      );
    }else{
      // Will do an imprecise conversion to 'srgb', not recommended
      const colorjsMax = Color.#colorjsMaxes[RGB][2];
      return map(to(this._color, 'srgb').coords[2], colorjsMax[0], colorjsMax[1], max[0], max[1]);
    }
  }

  _getAlpha(max=[0, 1]) {
    if(!Array.isArray(max)){
      max = [0, max];
    }

    const colorjsMax = Color.#colorjsMaxes[this.mode][3];
    return map(this._color.alpha, colorjsMax[0], colorjsMax[1], max[0], max[1]);
  }

  /**
   * Hue is the same in HSB and HSL, but the maximum value may be different.
   * This function will return the HSB-normalized saturation when supplied with
   * an HSB color object, but will default to the HSL-normalized saturation
   * otherwise.
   */
  _getHue(max=[0, 360]) {
    if(!Array.isArray(max)){
      max = [0, max];
    }

    if(this.mode === HSB || this.mode === HSL){
      const colorjsMax = Color.#colorjsMaxes[this.mode][0];
      return map(
        this._color.coords[0],
        colorjsMax[0], colorjsMax[1],
        max[0], max[1]
      );
    }else{
      // Will do an imprecise conversion to 'HSL', not recommended
      const colorjsMax = Color.#colorjsMaxes[HSL][0];
      return map(to(this._color, 'hsl').coords[0], colorjsMax[0], colorjsMax[1], max[0], max[1]);
    }
  }

  /**
   * Saturation is scaled differently in HSB and HSL. This function will return
   * the HSB saturation when supplied with an HSB color object, but will default
   * to the HSL saturation otherwise.
   */
  _getSaturation(max=[0, 100]) {
    if(!Array.isArray(max)){
      max = [0, max];
    }

    if(this.mode === HSB || this.mode === HSL){
      const colorjsMax = Color.#colorjsMaxes[this.mode][1];
      return map(
        this._color.coords[1],
        colorjsMax[0], colorjsMax[1],
        max[0], max[1]
      );
    }else{
      // Will do an imprecise conversion to 'HSL', not recommended
      const colorjsMax = Color.#colorjsMaxes[HSL][1];
      return map(to(this._color, 'hsl').coords[1], colorjsMax[0], colorjsMax[1], max[0], max[1]);
    }
  }

  /**
   * Brightness obtains the HSB brightness value from either a p5.Color object,
   * an array of color components, or a CSS color string.Depending on value,
   * when `colorMode()` is set to HSB, this function will return the
   * brightness value in the range. By default, this function will return
   * the HSB brightness within the range 0 - 100.
   */
  _getBrightness(max=[0, 100]) {
    if(!Array.isArray(max)){
      max = [0, max];
    }

    if(this.mode === HSB){
      const colorjsMax = Color.#colorjsMaxes[this.mode][2];
      return map(
        this._color.coords[2],
        colorjsMax[0], colorjsMax[1],
        max[0], max[1]
      );
    }else{
      // Will do an imprecise conversion to 'HSB', not recommended
      const colorjsMax = Color.#colorjsMaxes[HSB][2];
      return map(to(this._color, 'hsb').coords[2], colorjsMax[0], colorjsMax[1], max[0], max[1]);
    }
  }

  _getLightness(max=[0, 100]) {
    if(!Array.isArray(max)){
      max = [0, max];
    }

    if(this.mode === HSL){
      const colorjsMax = Color.#colorjsMaxes[this.mode][2];
      return map(
        this._color.coords[2],
        colorjsMax[0], colorjsMax[1],
        max[0], max[1]
      );
    }else{
      // Will do an imprecise conversion to 'HSL', not recommended
      const colorjsMax = Color.#colorjsMaxes[HSL][2];
      return map(to(this._color, 'hsl').coords[2], colorjsMax[0], colorjsMax[1], max[0], max[1]);
    }
  }
}

function color(p5, fn, lifecycles){
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
   * @param {p5} pInst                      pointer to p5 instance.
   *
   * @param {Number[]|String} vals            an array containing the color values
   *                                          for red, green, blue and alpha channel
   *                                          or CSS color.
   */
  /**
   * @class p5.Color
   * @param {Number[]|String} vals
   */
  p5.Color = Color;

  sRGB.fromGray = P3.fromGray = function(val, maxes, clamp){
    // Use blue max
    const p5Maxes = maxes.map(max => {
      if(!Array.isArray(max)){
        return [0, max];
      }else{
        return max;
      }
    });

    const v = map(val, p5Maxes[2][0], p5Maxes[2][1], 0, 1, clamp);
    return [v, v, v];
  };

  HSBSpace.fromGray = HSLSpace.fromGray = function(val, maxes, clamp){
    // Use brightness max
    const p5Maxes = maxes.map(max => {
      if(!Array.isArray(max)){
        return [0, max];
      }else{
        return max;
      }
    });

    const v = map(val, p5Maxes[2][0], p5Maxes[2][1], 0, 100, clamp);
    return [0, 0, v];
  };

  HWBSpace.fromGray = function(val, maxes, clamp){
    // Use Whiteness and Blackness to create number line
    const p5Maxes = maxes.map(max => {
      if(!Array.isArray(max)){
        return [0, max];
      }else{
        return max;
      }
    });

    const wbMax =
      (Math.abs(p5Maxes[1][0] - p5Maxes[1][1])) / 2 +
      (Math.abs(p5Maxes[2][0] - p5Maxes[2][1])) / 2;

    const nVal = map(val, 0, wbMax, 0, 100);
    let white, black;
    if(nVal < 50){
      black = nVal;
      white = 100 - nVal;
    }else if(nVal >= 50){
      white = nVal;
      black = 100 - nVal;
    }
    return [0, white, black];
  };

  Lab.fromGray =
  LCHSpace.fromGray =
  OKLab.fromGray =
  OKLCHSpace.fromGray =
  function(val, maxes, clamp){
    // Use lightness max
    const p5Maxes = maxes.map(max => {
      if(!Array.isArray(max)){
        return [0, max];
      }else{
        return max;
      }
    });

    const v = map(val, p5Maxes[0][0], p5Maxes[0][1], 0, 100, clamp);
    return [v, 0, 0];
  };

  // Register color modes and initialize Color maxes to what p5 has set for itself
  p5.Color.addColorMode(RGB, sRGB);
  p5.Color.addColorMode(RGBHDR, P3);
  p5.Color.addColorMode(HSB, HSBSpace);
  p5.Color.addColorMode(HSL, HSLSpace);
  p5.Color.addColorMode(HWB, HWBSpace);
  p5.Color.addColorMode(LAB, Lab);
  p5.Color.addColorMode(LCH, LCHSpace);
  p5.Color.addColorMode(OKLAB, OKLab);
  p5.Color.addColorMode(OKLCH, OKLCHSpace);

  lifecycles.presetup = function(){
    const pInst = this;

    // Decorate set methods
    const setMethods = ['Red', 'Green', 'Blue', 'Alpha'];
    for(let i in setMethods){
      const method = setMethods[i];
      const setCopy = p5.Color.prototype['set' + method];
      p5.Color.prototype['set' + method] = function(newval, max){
        max = max || pInst?._renderer?.states?.colorMaxes?.[RGB][i];
        return setCopy.call(this, newval, max);
      };
    }

    // Decorate get methods
    function decorateGet(channel, modes){
      const getCopy = p5.Color.prototype['_get' + channel];
      p5.Color.prototype['_get' + channel] = function(max){
        if(Object.keys(modes).includes(this.mode)){
          max = max ||
            pInst?._renderer?.states?.colorMaxes?.[this.mode][modes[this.mode]];
        }else{
          const defaultMode = Object.keys(modes)[0];
          max = max ||
            pInst
              ?._renderer
              ?.states
              ?.colorMaxes
              ?.[defaultMode][modes[defaultMode]];
        }

        return getCopy.call(this, max);
      };
    }

    decorateGet('Red', {
      [RGB]: 0,
      [RGBHDR]: 0
    });
    decorateGet('Green', {
      [RGB]: 1,
      [RGBHDR]: 1
    });
    decorateGet('Blue', {
      [RGB]: 2,
      [RGBHDR]: 2
    });
    decorateGet('Alpha', {
      [RGB]: 3,
      [RGBHDR]: 3,
      [HSB]: 3,
      [HSL]: 3,
      [HWB]: 3,
      [LAB]: 3,
      [LCH]: 3,
      [OKLAB]: 3,
      [OKLCH]: 3
    });

    decorateGet('Hue', {
      [HSL]: 0,
      [HSB]: 0,
      [HWB]: 0,
      [LCH]: 2,
      [OKLCH]: 2
    });
    decorateGet('Saturation', {
      [HSL]: 1,
      [HSB]: 1
    });
    decorateGet('Brightness', {
      [HSB]: 2
    });
    decorateGet('Lightness', {
      [HSL]: 2
    });
  };
}

export default color;
export { Color };

if(typeof p5 !== 'undefined'){
  color(p5, p5.prototype);
}
