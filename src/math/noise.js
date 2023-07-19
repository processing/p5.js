//////////////////////////////////////////////////////////////

// http://mrl.nyu.edu/~perlin/noise/
// Adapting from PApplet.java
// which was adapted from toxi
// which was adapted from the german demo group farbrausch
// as used in their demo "art": http://www.farb-rausch.de/fr010src.zip

// someday we might consider using "improved noise"
// http://mrl.nyu.edu/~perlin/paper445.pdf
// See: https://github.com/shiffman/The-Nature-of-Code-Examples-p5.js/
//      blob/main/introduction/Noise1D/noise.js

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
 * Returns the Perlin noise value at specified coordinates. The value returned
 * will always be between 0.0 and 1.0.
 *
 * Perlin noise values are random numbers that can be tuned to feel more
 * organic. `noise()` produces a sequence of pseudo-random numbers that are
 * "smooth". Noise is used to produce textures, motion, shapes, terrains, and
 * so on. Ken Perlin invented `noise()` while animating the original
 * <em>Tron</em> film in the 1980s.
 *
 * Perlin noise is defined in an infinite n-dimensional space. In theory,
 * `noise()` could output pseudo-random numbers given any number of inputs.
 * The p5.js `noise()` function can compute 1D, 2D, and 3D noise, depending on
 * the number of input coordinates given.
 *
 * `noise()` returns the same value for a given input while a sketch is
 * running. `noise()` returns different values each time a sketch runs. The
 * <a href="#/p5/noiseSeed">noiseSeed()</a> function can be used to generate a
 * specific sequence of noise values.
 *
 * One way to adjust the character of the noise values is to scale the input
 * coordinates. As a general rule, the sequence of noise values will be
 * smoother when the input coordinates are closer together. Steps of
 * 0.005-0.03 work best for most applications, but this will differ depending
 * on use.
 *
 * The version of `noise()` with one parameter computes noise values in one
 * dimension. This dimension is often interpreted as space, as in `noise(x)`.
 *
 * The version of `noise()` with two parameters computes noise values in two
 * dimensions. The dimensions are often interpreted as space or space and time, as in
 * `noise(x, y)` or `noise(x, t)`.
 *
 * The version of `noise()` with three parameters computes noise values in
 * three dimensions. The dimensions are often interpreted as space or space and time,
 * as in `noise(x, y, z)` or `noise(x, y, t)`.
 *
 * @method noise
 * @param  {Number} x   x-coordinate in noise space.
 * @param  {Number} [y] y-coordinate in noise space.
 * @param  {Number} [z] z-coordinate in noise space.
 * @return {Number}     Perlin noise value (between 0 and 1) at specified
 *                      coordinates.
 * @example
 * <div>
 * <code>
 * function draw() {
 *   background(204);
 *   let noiseScale = 0.005;
 *   let x = width * noise(noiseScale * frameCount);
 *   let y = height * noise(noiseScale * frameCount + 10000);
 *   circle(x, y, 5);
 *
 *   describe('A white circle moves randomly on a gray square.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function draw() {
 *   background(255);
 *
 *   let noiseScale = map(mouseX, 0, width, 0.001, 0.1);
 *   for (let x = 0; x < width; x += 1) {
 *     let y = height * noise(noiseScale * x);
 *     line(x, 0, x, y);
 *   }
 *
 *   describe('A wave pattern that changes based on the mouse position.');
 * }
 * </code>
 * </div>
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
 * Adjusts the character and level of detail produced by the
 * <a href="#/p5/noiseDetail">noiseDetail()</a> function.
 *
 * Perlin noise values are computed over several octaves, similar to harmonics
 * in physics. Lower octaves contribute more to the output signal. They define
 * the overall intensity of the noise. Higher octaves create finer-grained
 * details in the noise sequence.
 *
 * By default, noise is computed over four octaves. Each octave contributes
 * exactly half as much as its predecessor. `noiseDetail()` changes the number
 * of octaves and the falloff amount. For example, calling
 * `noiseDetail(6, 0.25)` ensures that <a href="#/p5/noise">noise()</a> will
 * use six octaves. Each octave will now have 25% impact (75% less) compared
 * to the previous lower octave. Falloff values between 0.0 and 1.0 are valid.
 * However, falloff values greater than 0.5 might result in noise values
 * greater than 1.0.
 *
 * By changing these parameters, the signal created by the
 * <a href="#/p5/noise">noise()</a> function can be adapted to fit very
 * specific needs and characteristics.
 *
 * @method noiseDetail
 * @param {Number} lod number of octaves to be used by the noise.
 * @param {Number} falloff falloff factor for each octave.
 * @example
 * <div>
 * <code>
 * function draw() {
 *   background(0);
 *   let noiseScale = 0.02;
 *   for (let y = 0; y < height; y += 1) {
 *     for (let x = 0; x < width / 2; x += 1) {
 *       // Left side.
 *       noiseDetail(4, 0.1);
 *       let noiseVal = noise(x * noiseScale, y * noiseScale);
 *       stroke(noiseVal * 255);
 *       point(x, y);
 *       // Right side.
 *       noiseDetail(4, 0.5);
 *       noiseVal = noise(x * noiseScale, y * noiseScale);
 *       stroke(noiseVal * 255);
 *       point(x + width / 2, y);
 *     }
 *   }
 *
 *   describe('Two gray smokey patterns. The pattern on the left is smoother than the pattern on the right.');
 * }
 * </code>
 * </div>
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
 * Sets the seed value for <a href="#/p5/noise">noise()</a>. By default,
 * <a href="#/p5/noise">noise()</a> produces different results each time
 * a sketch is run. Set the `seed` parameter to a constant to return
 * the same pseudo-random numbers each time the sketch is run.
 *
 * @method noiseSeed
 * @param {Number} seed   the seed value.
 * @example
 * <div>
 * <code>
 * function setup() {
 *   noiseSeed(99);
 *   background(255);
 * }
 *
 * function draw() {
 *   let noiseScale = 0.005;
 *   let x = width * noise(noiseScale * frameCount);
 *   line(x, 0, x, height);
 *
 *   describe('A black rectangle that grows randomly, first to the right and then to the left.');
 * }
 * </code>
 * </div>
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
