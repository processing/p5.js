/**
 * @module Color
 * @submodule Color Conversion
 * @for p5
 * @requires core
 */

/**
 * Conversions adapted from <http://www.easyrgb.com/en/math.php>.
 *
 * In these functions, hue is always in the range [0, 1], just like all other
 * components are in the range [0, 1]. 'Brightness' and 'value' are used
 * interchangeably.
 */

import p5 from '../core/main';
p5.ColorConversion = {
  /**
   * Convert an HSBA array to HSLA.
   */
  _hsbaToHSLA(hsba) {
    const hue = hsba[0];
    let sat = hsba[1];
    const val = hsba[2];

    // Calculate lightness.
    const li = (2 - sat) * val / 2;

    // Convert saturation.
    if (li !== 0) {
      if (li === 1) {
        sat = 0;
      } else if (li < 0.5) {
        sat = sat / (2 - sat);
      } else {
        sat = sat * val / (2 - li * 2);
      }
    }

    // Hue and alpha stay the same.
    return [hue, sat, li, hsba[3]];
  },

  /**
   * Convert an HSBA array to RGBA.
   */
  _hsbaToRGBA(hsba) {
    const hue = hsba[0] * 6; // We will split hue into 6 sectors.
    const sat = hsba[1];
    const val = hsba[2];

    let RGBA = [];

    if (sat === 0) {
      RGBA = [val, val, val, hsba[3]]; // Return early if grayscale.
    } else {
      const sector = Math.floor(hue);
      const tint1 = val * (1 - sat);
      const tint2 = val * (1 - sat * (hue - sector));
      const tint3 = val * (1 - sat * (1 + sector - hue));
      let red, green, blue;
      if (sector === 1) {
        // Yellow to green.
        red = tint2;
        green = val;
        blue = tint1;
      } else if (sector === 2) {
        // Green to cyan.
        red = tint1;
        green = val;
        blue = tint3;
      } else if (sector === 3) {
        // Cyan to blue.
        red = tint1;
        green = tint2;
        blue = val;
      } else if (sector === 4) {
        // Blue to magenta.
        red = tint3;
        green = tint1;
        blue = val;
      } else if (sector === 5) {
        // Magenta to red.
        red = val;
        green = tint1;
        blue = tint2;
      } else {
        // Red to yellow (sector could be 0 or 6).
        red = val;
        green = tint3;
        blue = tint1;
      }
      RGBA = [red, green, blue, hsba[3]];
    }

    return RGBA;
  },

  /**
   * Convert an HSLA array to HSBA.
   */
  _hslaToHSBA(hsla) {
    const hue = hsla[0];
    let sat = hsla[1];
    const li = hsla[2];

    // Calculate brightness.
    let val;
    if (li < 0.5) {
      val = (1 + sat) * li;
    } else {
      val = li + sat - li * sat;
    }

    // Convert saturation.
    sat = 2 * (val - li) / val;

    // Hue and alpha stay the same.
    return [hue, sat, val, hsla[3]];
  },

  /**
   * Convert an HSLA array to RGBA.
   *
   * We need to change basis from HSLA to something that can be more easily be
   * projected onto RGBA. We will choose hue and brightness as our first two
   * components, and pick a convenient third one ('zest') so that we don't need
   * to calculate formal HSBA saturation.
   */
  _hslaToRGBA(hsla) {
    const hue = hsla[0] * 6; // We will split hue into 6 sectors.
    const sat = hsla[1];
    const li = hsla[2];

    let RGBA = [];

    if (sat === 0) {
      RGBA = [li, li, li, hsla[3]]; // Return early if grayscale.
    } else {
      // Calculate brightness.
      let val;
      if (li < 0.5) {
        val = (1 + sat) * li;
      } else {
        val = li + sat - li * sat;
      }

      // Define zest.
      const zest = 2 * li - val;

      // Implement projection (project onto green by default).
      const hzvToRGB = (hue, zest, val) => {
        if (hue < 0) {
          // Hue must wrap to allow projection onto red and blue.
          hue += 6;
        } else if (hue >= 6) {
          hue -= 6;
        }
        if (hue < 1) {
          // Red to yellow (increasing green).
          return zest + (val - zest) * hue;
        } else if (hue < 3) {
          // Yellow to cyan (greatest green).
          return val;
        } else if (hue < 4) {
          // Cyan to blue (decreasing green).
          return zest + (val - zest) * (4 - hue);
        } else {
          // Blue to red (least green).
          return zest;
        }
      };

      // Perform projections, offsetting hue as necessary.
      RGBA = [
        hzvToRGB(hue + 2, zest, val),
        hzvToRGB(hue, zest, val),
        hzvToRGB(hue - 2, zest, val),
        hsla[3]
      ];
    }

    return RGBA;
  },

  /**
   * Convert an RGBA array to HSBA.
   */
  _rgbaToHSBA(rgba) {
    const red = rgba[0];
    const green = rgba[1];
    const blue = rgba[2];

    const val = Math.max(red, green, blue);
    const chroma = val - Math.min(red, green, blue);

    let hue, sat;
    if (chroma === 0) {
      // Return early if grayscale.
      hue = 0;
      sat = 0;
    } else {
      sat = chroma / val;
      if (red === val) {
        // Magenta to yellow.
        hue = (green - blue) / chroma;
      } else if (green === val) {
        // Yellow to cyan.
        hue = 2 + (blue - red) / chroma;
      } else if (blue === val) {
        // Cyan to magenta.
        hue = 4 + (red - green) / chroma;
      }
      if (hue < 0) {
        // Confine hue to the interval [0, 1).
        hue += 6;
      } else if (hue >= 6) {
        hue -= 6;
      }
    }

    return [hue / 6, sat, val, rgba[3]];
  },

  /**
   * Convert an RGBA array to HSLA.
   */
  _rgbaToHSLA(rgba) {
    const red = rgba[0];
    const green = rgba[1];
    const blue = rgba[2];

    const val = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const li = val + min; // We will halve this later.
    const chroma = val - min;

    let hue, sat;
    if (chroma === 0) {
      // Return early if grayscale.
      hue = 0;
      sat = 0;
    } else {
      if (li < 1) {
        sat = chroma / li;
      } else {
        sat = chroma / (2 - li);
      }
      if (red === val) {
        // Magenta to yellow.
        hue = (green - blue) / chroma;
      } else if (green === val) {
        // Yellow to cyan.
        hue = 2 + (blue - red) / chroma;
      } else if (blue === val) {
        // Cyan to magenta.
        hue = 4 + (red - green) / chroma;
      }
      if (hue < 0) {
        // Confine hue to the interval [0, 1).
        hue += 6;
      } else if (hue >= 6) {
        hue -= 6;
      }
    }

    return [hue / 6, sat, li / 2, rgba[3]];
  }
};
export default p5.ColorConversion;
