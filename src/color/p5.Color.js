/**
 * @module Color
 * @submodule Creating & Reading
 * @for p5
 * @requires core
 * @requires constants
 * @requires color_conversion
 */

import * as constants from '../core/constants';
// import {
//   ColorSpace,
//   to,
//   // toGamut,
//   serialize,
//   parse,
//   // range,

//   XYZ_D65,
//   sRGB_Linear,
//   sRGB,
//   HSL,
//   HSV,
//   HWB,

//   XYZ_D50,
//   Lab,
//   LCH,

//   OKLab,
//   OKLCH,

//   P3_Linear,
//   P3,

//   A98RGB_Linear,
//   A98RGB
// } from 'colorjs.io/fn';


//for CSS string parsing 
//import 'culori/css';

//importing culori/fn to optimize bundle size and
//'opting into' the tree-shakable version
// handle operations and conversions within color spaces
import {
  //converter, // string or color objects -> return object
  //parse, // string -> return object
  useMode,
  modeHsl,
  modeHwb,
  modeOklab,
  modeOklch,
  modeP3,
  modeRgb
} from 'culori/fn';

import {converter, parse} from 'culori';

//Registering color spaces with useMode()
const hsl = useMode(modeHsl);
const hwb = useMode(modeHwb);
const oklab = useMode(modeOklab);
const oklch = useMode(modeOklch);
const p3 = useMode(modeP3);
const rgb = useMode(modeRgb);

// ColorSpace.register(XYZ_D65);
// ColorSpace.register(sRGB_Linear);
// ColorSpace.register(sRGB);
// ColorSpace.register(HSL);
// ColorSpace.register(HSV);
// ColorSpace.register(HWB);
// ColorSpace.register(HSB);

// ColorSpace.register(XYZ_D50);
// ColorSpace.register(Lab);
// ColorSpace.register(LCH);

// ColorSpace.register(OKLab);
// ColorSpace.register(OKLCH);

// ColorSpace.register(P3_Linear);
// ColorSpace.register(P3);

// ColorSpace.register(A98RGB_Linear);
// ColorSpace.register(A98RGB);

class Color {
  color;
  maxes;
  mode;

  constructor(vals, colorMode='rgb', colorMaxes={rgb: [255, 255, 255, 255]}) {
    
    //storing default rgb color mode and maxes
    this.mode = colorMode;
    this.maxes = colorMaxes;

    //if vals is an object
    if (typeof vals === 'object' && !Array.isArray(vals) && vals !== null){
      this.color = vals; //color-compatible format
      console.log("Color object detected:", this.color);
      console.log("Current color mode:", this.color.mode);

    } else if( typeof vals[0] === 'string') {
      try{
        // parse the string
        this.color = parse(vals[0]);
      }catch(err){
        // TODO: Invalid color string
        console.error('Invalid color string');
      }

    }else{
      let alpha;

      if(vals.length === 4){
        alpha = vals[vals.length-1];
      }else if (vals.length === 2){
        alpha = vals[1];
        vals = [vals[0], vals[0], vals[0]];
      }else if(vals.length === 1){
        vals = [vals[0], vals[0], vals[0]];
      }
      alpha = alpha !== undefined
        ? alpha / this.maxes[this.mode][3]
        : 1;

      // _colorMode can be 'rgb', 'hsb', or 'hsl'
      // These should map to color.js color space
      let space = 'rgb';
      let coords = vals;
      switch(this.mode){
        case 'rgb':
          space = 'rgb';
          coords = [
            vals[0] / this.maxes[this.mode][0],
            vals[1] / this.maxes[this.mode][1],
            vals[2] / this.maxes[this.mode][2]
          ];
          break;
        case 'hsb':
          // TODO: need implementation
          space = 'hsb';
          coords = [
            vals[0] / this.maxes[this.mode][0] * 360,
            vals[1] / this.maxes[this.mode][1] ,
            vals[2] / this.maxes[this.mode][2] 
          ];
          break;
        case 'hsl':
          space = 'hsl';
          coords = [
            vals[0] / this.maxes[this.mode][0] * 360,
            vals[1] / this.maxes[this.mode][1] ,
            vals[2] / this.maxes[this.mode][2] 
          ];
          break;
        default:
          console.error('Invalid color mode');
      }

      // Set the color object with space, coordinates, and alpha
      this.color = { space, coords, alpha };
      console.log("Constructed color object:", this.color);

      // Use converter to ensure compatibility with Culori's color space conversion
      const convertToSpace = converter(space);
      this.color = convertToSpace(this.color); // Convert color to specified space
      console.log("Converted color object:", this.color);

      // const color = {
      //   space,
      //   coords,
      //   alpha
      // };
      // //this.color = to(color, space);
      // this.color = converter(space);
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
  // toString(format) {
  //   // NOTE: memoize
  //   return serialize(this.color, {
  //     format
  //   });
  // }

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
    const red_val = new_red / this.maxes[constants.RGB][0];
    if(this.mode === constants.RGB){
      this.color.coords[0] = red_val;
    }else{
      // Will do an imprecise conversion to 'srgb', not recommended
      const space = this.color.space.id;
      const representation = to(this.color, 'srgb');
      representation.coords[0] = red_val;
      this.color = to(representation, space);
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
    const green_val = new_green / this.maxes[constants.RGB][1];
    if(this.mode === constants.RGB){
      this.color.coords[1] = green_val;
    }else{
      // Will do an imprecise conversion to 'srgb', not recommended
      const space = this.color.space.id;
      const representation = to(this.color, 'srgb');
      representation.coords[1] = green_val;
      this.color = to(representation, space);
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
    const blue_val = new_blue / this.maxes[constants.RGB][2];
    if(this.mode === constants.RGB){
      this.color.coords[2] = blue_val;
    }else{
      // Will do an imprecise conversion to 'srgb', not recommended
      const space = this.color.space.id;
      const representation = to(this.color, 'srgb');
      representation.coords[2] = blue_val;
      this.color = to(representation, space);
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
    this.color.alpha = new_alpha / this.maxes[this.mode][3];
  }

  _getRed() {
    if(this.mode === constants.RGB){
      return this.color.coords[0] * this.maxes[constants.RGB][0];
    }else{
      // Will do an imprecise conversion to 'srgb', not recommended
      return to(this.color, 'srgb').coords[0] * this.maxes[constants.RGB][0];
    }
  }

  _getGreen() {
    if(this.mode === constants.RGB){
      return this.color.coords[1] * this.maxes[constants.RGB][1];
    }else{
      // Will do an imprecise conversion to 'srgb', not recommended
      return to(this.color, 'srgb').coords[1]  * this.maxes[constants.RGB][1];
    }
  }

  _getBlue() {
    if(this.mode === constants.RGB){
      return this.color.coords[2]  * this.maxes[constants.RGB][2];
    }else{
      // Will do an imprecise conversion to 'srgb', not recommended
      return to(this.color, 'srgb').coords[2]  * this.maxes[constants.RGB][2];
    }
  }

  _getAlpha() {
    return this.color.alpha * this.maxes[this.mode][3];
  }

  _getMode() {
    return this.mode;
  }

  _getMaxes() {
    return this.maxes;
  }

  /**
   * Hue is the same in HSB and HSL, but the maximum value may be different.
   * This function will return the HSB-normalized saturation when supplied with
   * an HSB color object, but will default to the HSL-normalized saturation
   * otherwise.
   */
  _getHue() {
    if(this.mode === constants.HSB || this.mode === constants.HSL){
      return this.color.coords[0] / 360 * this.maxes[this.mode][0];
    }else{
      // Will do an imprecise conversion to 'HSL', not recommended
      return to(this.color, 'hsl').coords[0] / 360 * this.maxes[this.mode][0];
    }
  }

  /**
   * Saturation is scaled differently in HSB and HSL. This function will return
   * the HSB saturation when supplied with an HSB color object, but will default
   * to the HSL saturation otherwise.
   */
  _getSaturation() {
    if(this.mode === constants.HSB || this.mode === constants.HSL){
      return this.color.coords[1] / 100 * this.maxes[this.mode][1];
    }else{
      // Will do an imprecise conversion to 'HSL', not recommended
      return to(this.color, 'hsl').coords[1] / 100 * this.maxes[this.mode][1];
    }
  }

  _getBrightness() {
    if(this.mode === constants.HSB){
      return this.color.coords[2] / 100 * this.maxes[this.mode][2];
    }else{
      // Will do an imprecise conversion to 'HSB', not recommended
      return to(this.color, 'hsb').coords[2] / 100 * this.maxes[this.mode][2];
    }
  }

  _getLightness() {
    if(this.mode === constants.HSL){
      return this.color.coords[2] / 100 * this.maxes[this.mode][2];
    }else{
      // Will do an imprecise conversion to 'HSB', not recommended
      return to(this.color, 'hsl').coords[2] / 100 * this.maxes[this.mode][2];
    }
  }

  get _array() {
    return [...this.color.coords, this.color.alpha];
  }

  get levels() {
    return this._array.map(v => v * 255);
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
}

export default color;
export { Color }

if(typeof p5 !== 'undefined'){
  color(p5, p5.prototype);
}
