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

const SECTORS = 6;

/**
 * Confine hue to the interval [0, 6).
 */
const wrapHue = h => (h + SECTORS) % SECTORS;

/**
 * Calculate brightness/value from lightness and saturation.
 */
const valueFromLightness = (li, sat) =>
  li < 0.5 ? (1 + sat) * li : li + sat - li * sat;

const isGray = chroma => chroma === 0;

p5.ColorConversion = {

  /**
   * Convert an HSBA array to HSLA.
   */
  _hsbaToHSLA([h, s, v, a]) {
    // Calculate lightness.
    const li = (2 - s) * v / 2;

    // Convert saturation.
    if (li === 0 || li === 1) {
      return [h, 0, li, a];
    }

    const sat =
      li < 0.5
        ? s / (2 - s)
        : (s * v) / (2 - 2 * li);

    // Hue and alpha stay the same.
    return [h, sat, li, a];
  },

  /**
   * Convert an HSBA array to RGBA.
   */
  _hsbaToRGBA([h, s, v, a]) {
    const hue = h * SECTORS; // We will split hue into 6 sectors.

    if (s === 0) {
      // Return early if grayscale.
      return [v, v, v, a];
    }

    const sector = Math.floor(hue);
    const tint1 = v * (1 - s);
    const tint2 = v * (1 - s * (hue - sector));
    const tint3 = v * (1 - s * (1 + sector - hue));

    switch (sector) {
      case 1:
        // Yellow to green.
        return [tint2, v, tint1, a];
      case 2:
        // Green to cyan.
        return [tint1, v, tint3, a];
      case 3:
        // Cyan to blue.
        return [tint1, tint2, v, a];
      case 4:
        // Blue to magenta.
        return [tint3, tint1, v, a];
      case 5:
        // Magenta to red.
        return [v, tint1, tint2, a];
      default:
        // Red to yellow (sector could be 0 or 6).
        return [v, tint3, tint1, a];
    }
  },

  /**
   * Convert an HSLA array to HSBA.
   */
  _hslaToHSBA([h, s, li, a]) {
    // Calculate brightness.
    const v = valueFromLightness(li, s);

    // Convert saturation.
    const sat = v === 0 ? 0 : (2 * (v - li)) / v;

    // Hue and alpha stay the same.
    return [h, sat, v, a];
  },

  /**
   * Convert an HSLA array to RGBA.
   *
   * We need to change basis from HSLA to something that can be more easily be
   * projected onto RGBA. We will choose hue and brightness as our first two
   * components, and pick a convenient third one ('zest') so that we don't need
   * to calculate formal HSBA saturation.
   */
  _hslaToRGBA([h, s, li, a]) {
    const hue = h * SECTORS; // We will split hue into 6 sectors.

    if (s === 0) {
      // Return early if grayscale.
      return [li, li, li, a];
    }

    // Calculate brightness.
    const v = valueFromLightness(li, s);

    // Define zest.
    const z = 2 * li - v;

    // Implement projection (project onto green by default).
    const project = h =>
      h < 1
        ? z + (v - z) * h
        : h < 3
          ? v
          : h < 4
            ? z + (v - z) * (4 - h)
            : z;

    // Perform projections, offsetting hue as necessary.
    return [
      project(wrapHue(hue + 2)),
      project(wrapHue(hue)),
      project(wrapHue(hue - 2)),
      a
    ];
  },

  /**
   * Convert an RGBA array to HSBA.
   */
  _rgbaToHSBA([r, g, b, a]) {
    const v = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const chroma = v - min;

    if (isGray(chroma)) {
      // Return early if grayscale.
      return [0, 0, v, a];
    }

    let h;
    if (r === v) {
      // Magenta to yellow.
      h = (g - b) / chroma;
    } else if (g === v) {
      // Yellow to cyan.
      h = 2 + (b - r) / chroma;
    } else {
      // Cyan to magenta.
      h = 4 + (r - g) / chroma;
    }

    return [wrapHue(h) / SECTORS, chroma / v, v, a];
  },

  /**
   * Convert an RGBA array to HSLA.
   */
  _rgbaToHSLA([r, g, b, a]) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const chroma = max - min;
    const li = (max + min) / 2;

    if (isGray(chroma)) {
      // Return early if grayscale.
      return [0, 0, li, a];
    }

    const sat =
      li < 0.5
        ? chroma / (max + min)
        : chroma / (2 - max - min);

    let h;
    if (r === max) {
      // Magenta to yellow.
      h = (g - b) / chroma;
    } else if (g === max) {
      // Yellow to cyan.
      h = 2 + (b - r) / chroma;
    } else {
      // Cyan to magenta.
      h = 4 + (r - g) / chroma;
    }

    return [wrapHue(h) / SECTORS, sat, li, a];
  }
};

export default p5.ColorConversion;