//////////////////////////////////////////////////////////////

// http://mrl.nyu.edu/~perlin/noise/
// Adapting from PApplet.java
// which was adapted from toxi
// which was adapted from the german demo group farbrausch
// as used in their demo "art": http://www.farb-rausch.de/fr010src.zip

// someday we might consider using "improved noise"
// http://mrl.nyu.edu/~perlin/paper445.pdf
// See: https://github.com/shiffman/The-Nature-of-Code-Examples-p5.js/
//      blob/master/introduction/Noise1D/noise.js

/**
 * @module Math
 * @submodule Noise
 * @for p5
 * @requires core
 */

import p5 from '../core/main';

const PERLIN_YWRAPB = 4;
const PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
const PERLIN_ZWRAPB = 8;
const PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
const PERLIN_SIZE = 4095;

let perlin_octaves = 4; // default to medium smooth
let perlin_amp_falloff = 0.5; // 50% reduction/octave

const scaled_cosine = i => 0.5 * (1.0 - Math.cos(i * Math.PI));

let perlin; // will be initialized lazily by noise() or noiseSeed()

/**
 * Returns the Perlin noise value at specified coordinates. Perlin noise is
 * a random sequence generator producing a more naturally ordered, harmonic
 * succession of numbers compared to the standard <b>random()</b> function.
 * It was invented by Ken Perlin in the 1980s and been used since in
 * graphical applications to produce procedural textures, natural motion,
 * shapes, terrains etc.<br /><br /> The main difference to the
 * <b>random()</b> function is that Perlin noise is defined in an infinite
 * n-dimensional space where each pair of coordinates corresponds to a
 * fixed semi-random value (fixed only for the lifespan of the program; see
 * the <a href="#/p5/noiseSeed">noiseSeed()</a> function). p5.js can compute 1D, 2D and 3D noise,
 * depending on the number of coordinates given. The resulting value will
 * always be between 0.0 and 1.0. The noise value can be animated by moving
 * through the noise space as demonstrated in the example above. The 2nd
 * and 3rd dimension can also be interpreted as time.<br /><br />The actual
 * noise is structured similar to an audio signal, in respect to the
 * function's use of frequencies. Similar to the concept of harmonics in
 * physics, perlin noise is computed over several octaves which are added
 * together for the final result. <br /><br />Another way to adjust the
 * character of the resulting sequence is the scale of the input
 * coordinates. As the function works within an infinite space the value of
 * the coordinates doesn't matter as such, only the distance between
 * successive coordinates does (eg. when using <b>noise()</b> within a
 * loop). As a general rule the smaller the difference between coordinates,
 * the smoother the resulting noise sequence will be. Steps of 0.005-0.03
 * work best for most applications, but this will differ depending on use.
 *
 * @method noise
 * @param  {Number} x   x-coordinate in noise space
 * @param  {Number} [y] y-coordinate in noise space
 * @param  {Number} [z] z-coordinate in noise space
 * @return {Number}     Perlin noise value (between 0 and 1) at specified
 *                      coordinates
 * @example
 * <div>
 * <code>
 * let xoff = 0.0;
 *
 * function draw() {
 *   background(204);
 *   xoff = xoff + 0.01;
 *   let n = noise(xoff) * width;
 *   line(n, 0, n, height);
 * }
 * </code>
 * </div>
 * <div>
 * <code>let noiseScale=0.02;
 *
 * function draw() {
 *   background(0);
 *   for (let x=0; x < width; x++) {
 *     let noiseVal = noise((mouseX+x)*noiseScale, mouseY*noiseScale);
 *     stroke(noiseVal*255);
 *     line(x, mouseY+noiseVal*80, x, height);
 *   }
 * }
 * </code>
 * </div>
 *
 * @alt
 * vertical line moves left to right with updating noise values.
 * horizontal wave pattern effected by mouse x-position & updating noise values.
 */

p5.prototype.noise = function(x, y = 0, z = 0) {
  if (perlin == null) {
    perlin = new Array(PERLIN_SIZE + 1);
    for (let i = 0; i < PERLIN_SIZE + 1; i++) {
      perlin[i] = Math.random();
    }
  }

  if (x < 0) {
    x = -x;
  }
  if (y < 0) {
    y = -y;
  }
  if (z < 0) {
    z = -z;
  }

  let xi = Math.floor(x),
    yi = Math.floor(y),
    zi = Math.floor(z);
  let xf = x - xi;
  let yf = y - yi;
  let zf = z - zi;
  let rxf, ryf;

  let r = 0;
  let ampl = 0.5;

  let n1, n2, n3;

  for (let o = 0; o < perlin_octaves; o++) {
    let of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);

    rxf = scaled_cosine(xf);
    ryf = scaled_cosine(yf);

    n1 = perlin[of & PERLIN_SIZE];
    n1 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n1);
    n2 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
    n2 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
    n1 += ryf * (n2 - n1);

    of += PERLIN_ZWRAP;
    n2 = perlin[of & PERLIN_SIZE];
    n2 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n2);
    n3 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
    n3 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
    n2 += ryf * (n3 - n2);

    n1 += scaled_cosine(zf) * (n2 - n1);

    r += n1 * ampl;
    ampl *= perlin_amp_falloff;
    xi <<= 1;
    xf *= 2;
    yi <<= 1;
    yf *= 2;
    zi <<= 1;
    zf *= 2;

    if (xf >= 1.0) {
      xi++;
      xf--;
    }
    if (yf >= 1.0) {
      yi++;
      yf--;
    }
    if (zf >= 1.0) {
      zi++;
      zf--;
    }
  }
  return r;
};

/**
 *
 * Adjusts the character and level of detail produced by the Perlin noise
 * function. Similar to harmonics in physics, noise is computed over
 * several octaves. Lower octaves contribute more to the output signal and
 * as such define the overall intensity of the noise, whereas higher octaves
 * create finer grained details in the noise sequence.
 *
 * By default, noise is computed over 4 octaves with each octave contributing
 * exactly half than its predecessor, starting at 50% strength for the 1st
 * octave. This falloff amount can be changed by adding an additional function
 * parameter. Eg. a falloff factor of 0.75 means each octave will now have
 * 75% impact (25% less) of the previous lower octave. Any value between
 * 0.0 and 1.0 is valid, however note that values greater than 0.5 might
 * result in greater than 1.0 values returned by <b>noise()</b>.
 *
 * By changing these parameters, the signal created by the <b>noise()</b>
 * function can be adapted to fit very specific needs and characteristics.
 *
 * @method noiseDetail
 * @param {Number} lod number of octaves to be used by the noise
 * @param {Number} falloff falloff factor for each octave
 * @example
 * <div>
 * <code>
 * let noiseVal;
 * let noiseScale = 0.02;
 *
 * function setup() {
 *   createCanvas(100, 100);
 * }
 *
 * function draw() {
 *   background(0);
 *   for (let y = 0; y < height; y++) {
 *     for (let x = 0; x < width / 2; x++) {
 *       noiseDetail(2, 0.2);
 *       noiseVal = noise((mouseX + x) * noiseScale, (mouseY + y) * noiseScale);
 *       stroke(noiseVal * 255);
 *       point(x, y);
 *       noiseDetail(8, 0.65);
 *       noiseVal = noise(
 *         (mouseX + x + width / 2) * noiseScale,
 *         (mouseY + y) * noiseScale
 *       );
 *       stroke(noiseVal * 255);
 *       point(x + width / 2, y);
 *     }
 *   }
 * }
 * </code>
 * </div>
 *
 * @alt
 * 2 vertical grey smokey patterns affected my mouse x-position and noise.
 */
p5.prototype.noiseDetail = function(lod, falloff) {
  if (lod > 0) {
    perlin_octaves = lod;
  }
  if (falloff > 0) {
    perlin_amp_falloff = falloff;
  }
};

/**
 * Sets the seed value for <b>noise()</b>. By default, <b>noise()</b>
 * produces different results each time the program is run. Set the
 * <b>value</b> parameter to a constant to return the same pseudo-random
 * numbers each time the software is run.
 *
 * @method noiseSeed
 * @param {Number} seed   the seed value
 * @example
 * <div>
 * <code>let xoff = 0.0;
 *
 * function setup() {
 *   noiseSeed(99);
 *   stroke(0, 10);
 * }
 *
 * function draw() {
 *   xoff = xoff + .01;
 *   let n = noise(xoff) * width;
 *   line(n, 0, n, height);
 * }
 * </code>
 * </div>
 *
 * @alt
 * vertical grey lines drawing in pattern affected by noise.
 */
p5.prototype.noiseSeed = function(seed) {
  // Linear Congruential Generator
  // Variant of a Lehman Generator
  const lcg = (() => {
    // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
    // m is basically chosen to be large (as it is the max period)
    // and for its relationships to a and c
    const m = 4294967296;
    // a - 1 should be divisible by m's prime factors
    const a = 1664525;
    // c and m should be co-prime
    const c = 1013904223;
    let seed, z;
    return {
      setSeed(val) {
        // pick a random seed if val is undefined or null
        // the >>> 0 casts the seed to an unsigned 32-bit integer
        z = seed = (val == null ? Math.random() * m : val) >>> 0;
      },
      getSeed() {
        return seed;
      },
      rand() {
        // define the recurrence relationship
        z = (a * z + c) % m;
        // return a float in [0, 1)
        // if z = m then z / m = 0 therefore (z % m) / m < 1 always
        return z / m;
      }
    };
  })();

  lcg.setSeed(seed);
  perlin = new Array(PERLIN_SIZE + 1);
  for (let i = 0; i < PERLIN_SIZE + 1; i++) {
    perlin[i] = lcg.rand();
  }
};

export default p5;
