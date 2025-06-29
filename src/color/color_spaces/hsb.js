import { ColorSpace, sRGB } from 'colorjs.io/fn';

export default new ColorSpace({
  id: 'hsb',
  name: 'HSB',
  coords: {
    h: {
      refRange: [0, 360],
      type: 'angle',
      name: 'Hue'
    },
    s: {
      range: [0, 100],
      name: 'Saturation'
    },
    b: {
      range: [0, 100],
      name: 'Brightness'
    }
  },

  base: sRGB,

  fromBase: rgb => {
    const val = Math.max(...rgb);
    const chroma = val - Math.min(...rgb);

    let [red, green, blue] = rgb;

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

    return [hue / 6 * 360, sat * 100, val * 100];
  },
  toBase,

  formats: {
    default: {
      type: 'custom',
      serialize: (coords, alpha) => {
        const rgb = toBase(coords);
        let ret = `rgb(${
          Math.round(rgb[0] * 100 * 100) / 100
        }% ${
          Math.round(rgb[1] * 100 * 100) / 100
        }% ${
          Math.round(rgb[2] * 100 * 100) / 100
        }%`;

        if (alpha < 1) {
          ret += ` / ${alpha}`;
        }

        ret += ')';

        return ret;
      }
    },
    'hsb': {
      coords: ['<number> | <angle>', '<percentage>', '<percentage>']
    },
    'hsba': {
      coords: ['<number> | <angle>', '<percentage>', '<percentage>'],
      commans: true,
      lastAlpha: true
    }
  }
});

function toBase(hsb){
  const hue = hsb[0] / 360 * 6; // We will split hue into 6 sectors.
  const sat = hsb[1] / 100;
  const val = hsb[2] / 100;

  let RGB = [];

  if (sat === 0) {
    RGB = [val, val, val]; // Return early if grayscale.
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
    RGB = [red, green, blue];
  }

  return RGB;
}
