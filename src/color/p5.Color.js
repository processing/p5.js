/**
 * @module Color
 * @submodule Creating & Reading
 * @for p5
 * @requires core
 * @requires constants
 * @requires color_conversion
 */

import * as constants from "../core/constants";

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
  modeHsv,
  modeOklab,
  modeOklch,
  modeP3,
  modeRgb,
} from "culori/fn";

import {
  converter,
  parse,
  formatHex,
  formatHex8,
  formatRgb,
  formatHsl,
  formatCss,
} from "culori";

//Registering color spaces with useMode()
const hsl = useMode(modeHsl);
const hwb = useMode(modeHwb);
const oklab = useMode(modeOklab);
const oklch = useMode(modeOklch);
const p3 = useMode(modeP3);
const rgb = useMode(modeRgb);
const hsv = useMode(modeHsv);

console.time("culori");
let test = converter('rgb');
console.timeEnd("culori")

class Color {
  color;
  maxes;
  mode;

  constructor(
    vals,
    colorMode = "rgb",
    colorMaxes = { rgb: [255, 255, 255, 255] , hsb: [360, 100, 100, 1] }
  ) {
    //storing default rgb color mode and maxes
    this.mode = colorMode;
    this.maxes = colorMaxes;

    //if vals is an object or a non-array, non-null object
    if (typeof vals === "object" && !Array.isArray(vals) && vals !== null) {
      this.color = vals; //color-compatible format
      console.log("Color object detected:", this.color);
      console.log("Current color mode:", this.color.mode);
    } else if (typeof vals[0] === "string") {
      try {
        // parse the string
        //this.color = parse(vals[0]);
        let colorString = vals[0].trim();
        console.log("Original color string:", colorString); // Debugging
        // Preprocess string to replace 'hsb' or 'hsba' with 'hsv' or 'hsva' for Culori compatibility
        if (colorString.toLowerCase().startsWith("hsba(")) {
          colorString = colorString.replace(/hsba/i, "hsva");
        } else if (colorString.toLowerCase().startsWith("hsb(")) {
          colorString = colorString.replace(/hsb/i, "hsv");
        }

        console.log("Modified color string for parsing:", colorString); // Debugging
        // Parse the modified string
        this.color = parse(colorString);
        console.log("Color object detected:", this.color);
        console.log("Current color mode:", this.color.mode);
        console.log("Current alpha:", this.color.alpha);
      } catch (err) {
        // TODO: Invalid color string
        console.error("Invalid color string format:", vals[0], "\nError:", err);
      }
    } else {
      let alpha;

      if (vals.length === 4) {
        alpha = vals[vals.length - 1];
      } else if (vals.length === 2) {
        alpha = vals[1];
        vals = [vals[0], vals[0], vals[0]];
      } else if (vals.length === 1) {
        vals = [vals[0], vals[0], vals[0]];
      }
      alpha = alpha !== undefined ? alpha / this.maxes[this.mode][3] : 1;

      console.log("Color object detected:", vals);
      console.log("Current color mode:", this.mode);

      // _colorMode can be 'rgb', 'hsb', or 'hsl'
      // Color representation for Culori.js

      switch (this.mode) {
        case "rgb":
          this.color = {
            mode: "rgb",
            r: vals[0] / this.maxes[this.mode][0], // R /255 -> Range [0 , 1]
            g: vals[1] / this.maxes[this.mode][1], // G /255
            b: vals[2] / this.maxes[this.mode][2], // B /255
            alpha: alpha,
          };
          break;
        case "hsv": 
          this.color = {
            mode: "hsv", // Culori uses "hsv" instead of "hsb"
            h: (vals[0] / this.maxes[this.mode][0]) * 360, //(H/360) * 360 -> Range [0, 360]
            s: vals[1] / this.maxes[this.mode][1], //S /100                 [0,1]
            v: vals[2] / this.maxes[this.mode][2], //V /100                 [0,1]
            alpha: alpha,
          };

          break;
        case "hsl":
          this.color = {
            mode: "hsl",
            h: (vals[0] / this.maxes[this.mode][0]) * 360, //(H/360) * 360 ->Range [0, 360]
            s: vals[1] / this.maxes[this.mode][1], //S / 100               [0,1]
            l: vals[2] / this.maxes[this.mode][2], //L / 100               [0,1]
            alpha: alpha,
          };
          break;
        default:
          console.error("Invalid color mode");
      }

      // // Use converter to ensure compatibility with Culori's color space conversion
      //const convertToSpace = converter(this.mode);
      //this.color = convertToSpace(this.color); // Convert color to specified space

      // Convert 'hsb' to 'hsv' and 'hsba' to 'hsva' for compatibility with Culori
      const convertToSpace = converter(
        this.mode === "hsb" || this.mode === "hsba"
          ? this.mode === "hsb"
            ? "hsv"
            : "hsva"
          : this.mode
      );
      this.color = convertToSpace(this.color); // Convert color to specified space
      //console.log("Converted color object:", this.color);
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

  //Culori.js doesn't have a single serialize function
  //it rather has the following methods to serialize
  //colours to strings in various formats
  toString(format) {
    switch (format) {
      case "hex": //cover cases #rgb | #rgba | #rrggbb
        return formatHex(this.color);
      case "hex8": //cover case #rrggbbaa
        return formatHex8(this.color);
      case "rgb": //cover cases  rgb and rgba
        return formatRgb(this.color);
      case "hsl": //cover case hsl and hsla
        return formatHsl(this.color);
      case "css": //returns color mode and normalized color values
        return formatCss(this.color); 
      default:
        // Fallback to a default format, like RGB
        return formatRgb(this.color);
    }
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
    const red_val = new_red / this.maxes[constants.RGB][0]; //normalize red value
    if (this.mode === constants.RGB) {
      //this.color.coords[0] = red_val;
      this.color.r = red_val;
    } else {
      // Handling Non-RGB Color Modes
      //const space = this.color.space.id;
      //const representation = to(this.color, 'srgb');
      //representation.coords[0] = red_val;
      //this.color = to(representation, space);
      const space = this.color.mode;
      const representation = converter("rgb")(this.color); //temporarily convert to RGB
      representation.r = red_val; //update red value
      this.color = converter(space)(representation); //convert back to original space
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
    if (this.mode === constants.RGB) {
      //this.color.coords[1] = green_val;
      this.color.g = green_val;
    } else {
      // Will do an imprecise conversion to 'srgb', not recommended
      //const space = this.color.space.id;
      //const representation = to(this.color, 'srgb');
      //representation.coords[1] = green_val;
      //this.color = to(representation, space);
      const space = this.color.mode;
      const representation = converter("rgb")(this.color); //temporarily convert to RGB
      representation.g = green_val; //update green value
      this.color = converter(space)(representation); //convert back to original space
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
    if (this.mode === constants.RGB) {
      //this.color.coords[2] = blue_val;
      this.color.b = blue_val;
    } else {
      // Will do an imprecise conversion to 'srgb', not recommended
      //const space = this.color.space.id;
      //const representation = to(this.color, 'srgb');
      //representation.coords[2] = blue_val;
      //this.color = to(representation, space);
      const space = this.color.mode;
      const representation = converter("rgb")(this.color); //temporarily convert to RGB
      representation.b = blue_val; //update red value
      this.color = converter(space)(representation); //convert back to original space
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
    console.log("Updated alpha:", this.color.alpha);
  }

  _getRed() {
    if (this.mode === constants.RGB) {
      console.log("The color mode is RGB");
      //Check if the color is in RGB format; otherwise, convert it to RGB
      if (typeof this.color.r === "undefined") {
        const rgbColor = converter("rgb")(this.color); //Convert to RGB
        return rgbColor.r * this.maxes[constants.RGB][0]; //Access red channel and scale
      } else {
        //return this.color.coords[0] * this.maxes[constants.RGB][0];
        return this.color.r * this.maxes[constants.RGB][0];
      }
    } else {
      // Will do an imprecise conversion to 'srgb', not recommended
      //return to(this.color, 'srgb').coords[0] * this.maxes[constants.RGB][0];
      const rgbColor = converter("rgb")(this.color); //Convert to RGB
      return rgbColor.r * this.maxes[constants.RGB][0]; //Access red channel and scale
    }
  }

  _getGreen() {
    if (this.mode === constants.RGB) {
      console.log("The color mode is RGB");
      //Check if the color is in RGB format; otherwise, convert it to RGB
      if (typeof this.color.g === "undefined") {
        //Convert to RGB first, if `g` (green channel) is not directly accessible
        const rgbColor = converter("rgb")(this.color);
        return rgbColor.g * this.maxes[constants.RGB][1];
      } else {
        //if color is already in RGB, just use it directly
        return this.color.g * this.maxes[constants.RGB][1];
      }
    } else {
      console.log("The color mode is something else");
      const rgbColor = converter("rgb")(this.color); //Convert to RGB
      return rgbColor.g * this.maxes[constants.RGB][1]; //Access green channel and scale
    }
  }

  _getBlue() {
    if (this.mode === constants.RGB) {
      console.log("The color mode is RGB");
      // Check if the color is in RGB format; otherwise, convert it to RGB
      if (typeof this.color.b === "undefined") {
        // Convert to RGB first, if `b` (blue channel) is not directly accessible
        const rgbColor = converter("rgb")(this.color); // Convert to RGB
        return rgbColor.b * this.maxes[constants.RGB][2];
      } else {
        // If color is already in RGB, just use it directly
        return this.color.b * this.maxes[constants.RGB][2];
      }
    } else {
      console.log("The color mode is something else");
      const rgbColor = converter("rgb")(this.color); //Convert to RGB
      return rgbColor.b * this.maxes[constants.RGB][2]; //Access blue channel and scale
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
    if (this.mode === constants.HSB || this.mode === constants.HSL) {
      if (typeof this.color.h === "undefined"){
        const hslColor = converter("hsl")(this.color);
        return (hslColor.h / 360) * this.maxes[this.mode][0];
      } else {
        return (this.color.h / 360) * this.maxes[this.mode][0];
      }
    } else {
      // Will do an imprecise conversion to 'HSL', not recommended
      //return to(this.color, 'hsl').coords[0] / 360 * this.maxes[this.mode][0];
      const hslColor = converter("hsl")(this.color); //Convert to HSL
      console.log("If color mode isn't HSB||HSL", hslColor);
      return (hslColor.h / 360) * this.maxes[this.mode][0]; //Access Hue channel and scale
    }
  }

  /**
   * Saturation is scaled differently in HSB and HSL. This function will return
   * the HSB saturation when supplied with an HSB color object, but will default
   * to the HSL saturation otherwise.
   */

    /**According to Culori.js The hue is identical across all color models in this 
    * family; however, the saturaton is computed differently in each. 
    * The saturation in HSL is not interchangeable with the saturation 
    * from HSV, nor HSI. */

  _getSaturation() {
    if (this.mode === constants.HSB || this.mode === constants.HSL) {
      if (typeof this.color.s == "undefined"){
        //HSL or HSB colorMode, but input color is of different color space
        //default to HSL colorMode for now
        const hslColor = converter("hsl")(this.color);
        return hslColor.s * this.maxes[this.mode][1];
      } else {
        console.log("The color mode is HSL or HSB")
        return this.color.s * this.maxes[this.mode][1];
      }
    } else {
      // Will do an imprecise conversion to 'HSL', not recommended
      const hslColor = converter("hsl")(this.color); //Convert to HSL
      console.log("If color mode isn't HSB||HSL", hslColor);
      return hslColor.s * this.maxes[this.mode][1]; //Access Hue channel and scale
    }
  }

  //HSB/ HSV - Brightness channel
  _getBrightness() {
    if (this.mode === constants.HSB) {
      //return this.color.coords[2] / 100 * this.maxes[this.mode][2];
      return this.color.v * this.maxes[this.mode][2];
    } else {
      // Will do an imprecise conversion to 'HSB', not recommended
      //return to(this.color, 'hsb').coords[2] / 100 * this.maxes[this.mode][2];
      const hsbColor = converter("hsv")(this.color); //Convert to HSV
      return hsbColor.v * this.maxes[this.mode][2]; //Access Brightness channel and scale
    }
  }

  //HSL - Lightness channel
  _getLightness() {
    if (this.mode === constants.HSL) {
      //return this.color.coords[2] / 100 * this.maxes[this.mode][2];
      console.log("The color mode is HSL", this.color)
      return (this.color.l) * this.maxes[this.mode][2];
    } else {
      // Will do an imprecise conversion to 'HSL', not recommended
      //return to(this.color, 'hsl').coords[2] / 100 * this.maxes[this.mode][2];
      console.log("The color mode is not HSL")
      const hslColor = converter("hsl")(this.color); //Convert to HSL
      return hslColor.l * this.maxes[this.mode][2]; //Access Lightness channel and scale
    }
  }

  // get _array() {
  //   return [...this.color.coords, this.color.alpha];
  // }

  //Since Culori.js uses plain objects with named properties,
  //get_array would need to adjust to this structure.
  get _array() {
    // For RGB mode, check for `r`, `g`, and `b`; for HSL, check for `h`, `s`, and `l`, etc.
    const colorComponents = [];

    if (this.color.mode === "rgb") {
      colorComponents.push(this.color.r, this.color.g, this.color.b);
    } else if (this.color.mode === "hsl") {
      colorComponents.push(this.color.h, this.color.s, this.color.l);
    } else if (this.color.mode === "hsv") {
      colorComponents.push(this.color.h, this.color.s, this.color.v);
    }
    // Add alpha, if present, or default to 1 if alpha is undefined
    colorComponents.push(this.color.alpha !== undefined ? this.color.alpha : 1);

    return colorComponents;
  }

  get levels() {
    return this._array.map((v) => v * 255);
  }
}

function color(p5, fn) {
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
export { Color };

if (typeof p5 !== "undefined") {
  color(p5, p5.prototype);
}
