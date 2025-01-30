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
function noise(p5, fn){
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
   * Returns random numbers that can be tuned to feel organic.
   *
   * Values returned by <a href="#/p5/random">random()</a> and
   * <a href="#/p5/randomGaussian">randomGaussian()</a> can change by large
   * amounts between function calls. By contrast, values returned by `noise()`
   * can be made "smooth". Calls to `noise()` with similar inputs will produce
   * similar outputs. `noise()` is used to create textures, motion, shapes,
   * terrains, and so on. Ken Perlin invented `noise()` while animating the
   * original <em>Tron</em> film in the 1980s.
   *
   * `noise()` always returns values between 0 and 1. It returns the same value
   * for a given input while a sketch is running. `noise()` produces different
   * results each time a sketch runs. The
   * <a href="#/p5/noiseSeed">noiseSeed()</a> function can be used to generate
   * the same sequence of Perlin noise values each time a sketch runs.
   *
   * The character of the noise can be adjusted in two ways. The first way is to
   * scale the inputs. `noise()` interprets inputs as coordinates. The sequence
   * of noise values will be smoother when the input coordinates are closer. The
   * second way is to use the <a href="#/p5/noiseDetail">noiseDetail()</a>
   * function.
   *
   * The version of `noise()` with one parameter computes noise values in one
   * dimension. This dimension can be thought of as space, as in `noise(x)`, or
   * time, as in `noise(t)`.
   *
   * The version of `noise()` with two parameters computes noise values in two
   * dimensions. These dimensions can be thought of as space, as in
   * `noise(x, y)`, or space and time, as in `noise(x, t)`.
   *
   * The version of `noise()` with three parameters computes noise values in
   * three dimensions. These dimensions can be thought of as space, as in
   * `noise(x, y, z)`, or space and time, as in `noise(x, y, t)`.
   *
   * @method noise
   * @param  {Number} x   x-coordinate in noise space.
   * @param  {Number} [y] y-coordinate in noise space.
   * @param  {Number} [z] z-coordinate in noise space.
   * @return {Number}     Perlin noise value at specified coordinates.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe('A black dot moves randomly on a gray square.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Calculate the coordinates.
   *   let x = 100 * noise(0.005 * frameCount);
   *   let y = 100 * noise(0.005 * frameCount + 10000);
   *
   *   // Draw the point.
   *   strokeWeight(5);
   *   point(x, y);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe('A black dot moves randomly on a gray square.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Set the noise level and scale.
   *   let noiseLevel = 100;
   *   let noiseScale = 0.005;
   *
   *   // Scale the input coordinate.
   *   let nt = noiseScale * frameCount;
   *
   *   // Compute the noise values.
   *   let x = noiseLevel * noise(nt);
   *   let y = noiseLevel * noise(nt + 10000);
   *
   *   // Draw the point.
   *   strokeWeight(5);
   *   point(x, y);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe('A hilly terrain drawn in gray against a black sky.');
   * }
   *
   * function draw() {
   *   // Set the noise level and scale.
   *   let noiseLevel = 100;
   *   let noiseScale = 0.02;
   *
   *   // Scale the input coordinate.
   *   let x = frameCount;
   *   let nx = noiseScale * x;
   *
   *   // Compute the noise value.
   *   let y = noiseLevel * noise(nx);
   *
   *   // Draw the line.
   *   line(x, 0, x, y);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe('A calm sea drawn in gray against a black sky.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Set the noise level and scale.
   *   let noiseLevel = 100;
   *   let noiseScale = 0.002;
   *
   *   // Iterate from left to right.
   *   for (let x = 0; x < 100; x += 1) {
   *     // Scale the input coordinates.
   *     let nx = noiseScale * x;
   *     let nt = noiseScale * frameCount;
   *
   *     // Compute the noise value.
   *     let y = noiseLevel * noise(nx, nt);
   *
   *     // Draw the line.
   *     line(x, 0, x, y);
   *   }
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Set the noise level and scale.
   *   let noiseLevel = 255;
   *   let noiseScale = 0.01;
   *
   *   // Iterate from top to bottom.
   *   for (let y = 0; y < 100; y += 1) {
   *     // Iterate from left to right.
   *     for (let x = 0; x < 100; x += 1) {
   *       // Scale the input coordinates.
   *       let nx = noiseScale * x;
   *       let ny = noiseScale * y;
   *
   *       // Compute the noise value.
   *       let c = noiseLevel * noise(nx, ny);
   *
   *       // Draw the point.
   *       stroke(c);
   *       point(x, y);
   *     }
   *   }
   *
   *   describe('A gray cloudy pattern.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe('A gray cloudy pattern that changes.');
   * }
   *
   * function draw() {
   *   // Set the noise level and scale.
   *   let noiseLevel = 255;
   *   let noiseScale = 0.009;
   *
   *   // Iterate from top to bottom.
   *   for (let y = 0; y < 100; y += 1) {
   *     // Iterate from left to right.
   *     for (let x = 0; x < width; x += 1) {
   *       // Scale the input coordinates.
   *       let nx = noiseScale * x;
   *       let ny = noiseScale * y;
   *       let nt = noiseScale * frameCount;
   *
   *       // Compute the noise value.
   *       let c = noiseLevel * noise(nx, ny, nt);
   *
   *       // Draw the point.
   *       stroke(c);
   *       point(x, y);
   *     }
   *   }
   * }
   * </code>
   * </div>
   */
  fn.noise = function(x, y = 0, z = 0) {
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
   * Adjusts the character of the noise produced by the
   * <a href="#/p5/noise">noise()</a> function.
   *
   * Perlin noise values are created by adding layers of noise together. The
   * noise layers, called octaves, are similar to harmonics in music. Lower
   * octaves contribute more to the output signal. They define the overall
   * intensity of the noise. Higher octaves create finer-grained details.
   *
   * By default, noise values are created by combining four octaves. Each higher
   * octave contributes half as much (50% less) compared to its predecessor.
   * `noiseDetail()` changes the number of octaves and the falloff amount. For
   * example, calling `noiseDetail(6, 0.25)` ensures that
   * <a href="#/p5/noise">noise()</a> will use six octaves. Each higher octave
   * will contribute 25% as much (75% less) compared to its predecessor. Falloff
   * values between 0 and 1 are valid. However, falloff values greater than 0.5
   * might result in noise values greater than 1.
   *
   * @method noiseDetail
   * @param {Number} lod number of octaves to be used by the noise.
   * @param {Number} falloff falloff factor for each octave.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Set the noise level and scale.
   *   let noiseLevel = 255;
   *   let noiseScale = 0.02;
   *
   *   // Iterate from top to bottom.
   *   for (let y = 0; y < 100; y += 1) {
   *     // Iterate from left to right.
   *     for (let x = 0; x < 50; x += 1) {
   *       // Scale the input coordinates.
   *       let nx = noiseScale * x;
   *       let ny = noiseScale * y;
   *
   *       // Compute the noise value with six octaves
   *       // and a low falloff factor.
   *       noiseDetail(6, 0.25);
   *       let c = noiseLevel * noise(nx, ny);
   *
   *       // Draw the left side.
   *       stroke(c);
   *       point(x, y);
   *
   *       // Compute the noise value with four octaves
   *       // and a high falloff factor.
   *       noiseDetail(4, 0.5);
   *       c = noiseLevel * noise(nx, ny);
   *
   *       // Draw the right side.
   *       stroke(c);
   *       point(x + 50, y);
   *     }
   *   }
   *
   *   describe('Two gray cloudy patterns. The pattern on the right is cloudier than the pattern on the left.');
   * }
   * </code>
   * </div>
   */
  fn.noiseDetail = function(lod, falloff) {
    if (lod > 0) {
      perlin_octaves = lod;
    }
    if (falloff > 0) {
      perlin_amp_falloff = falloff;
    }
  };

  /**
   * Sets the seed value for the <a href="#/p5/noise">noise()</a> function.
   *
   * By default, <a href="#/p5/noise">noise()</a> produces different results
   * each time a sketch is run. Calling `noiseSeed()` with a constant argument,
   * such as `noiseSeed(99)`, makes <a href="#/p5/noise">noise()</a> produce the
   * same results each time a sketch is run.
   *
   * @method noiseSeed
   * @param {Number} seed   seed value.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Set the noise seed for consistent results.
   *   noiseSeed(99);
   *
   *   describe('A black rectangle that grows randomly, first to the right and then to the left.');
   * }
   *
   * function draw() {
   *   // Set the noise level and scale.
   *   let noiseLevel = 100;
   *   let noiseScale = 0.005;
   *
   *   // Scale the input coordinate.
   *   let nt = noiseScale * frameCount;
   *
   *   // Compute the noise value.
   *   let x = noiseLevel * noise(nt);
   *
   *   // Draw the line.
   *   line(x, 0, x, height);
   * }
   * </code>
   * </div>
   */
  fn.noiseSeed = function(seed) {
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
}

export default noise;

if(typeof p5 !== 'undefined'){
  noise(p5, p5.prototype);
}
