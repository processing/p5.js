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

'use strict';

var p5 = require('../core/core');

var PERLIN_YWRAPB = 4;
var PERLIN_YWRAP = 1<<PERLIN_YWRAPB;
var PERLIN_ZWRAPB = 8;
var PERLIN_ZWRAP = 1<<PERLIN_ZWRAPB;
var PERLIN_SIZE = 4095;

var perlin_octaves = 4; // default to medium smooth
var perlin_amp_falloff = 0.5; // 50% reduction/octave

// [toxi 031112]
// Maybe we should have a lookup table for speed

var SINCOS_PRECISION = 0.5;
var SINCOS_LENGTH = Math.floor(360 / SINCOS_PRECISION);
var sinLUT = new Array(SINCOS_LENGTH);
var cosLUT = new Array(SINCOS_LENGTH);
var DEG_TO_RAD = Math.PI/180.0;
for (var i = 0; i < SINCOS_LENGTH; i++) {
  sinLUT[i] = Math.sin(i * DEG_TO_RAD * SINCOS_PRECISION);
  cosLUT[i] = Math.cos(i * DEG_TO_RAD * SINCOS_PRECISION);
}

var perlin_PI = SINCOS_LENGTH;
perlin_PI >>= 1;

var perlin;


/**
 * Returns the Perlin noise value at specified coordinates. Perlin noise is
 * a random sequence generator producing a more natural ordered, harmonic
 * succession of numbers compared to the standard <b>random()</b> function.
 * It was invented by Ken Perlin in the 1980s and been used since in
 * graphical applications to produce procedural textures, natural motion,
 * shapes, terrains etc.<br /><br /> The main difference to the
 * <b>random()</b> function is that Perlin noise is defined in an infinite
 * n-dimensional space where each pair of coordinates corresponds to a
 * fixed semi-random value (fixed only for the lifespan of the program).
 * The resulting value will always be between 0.0 and 1.0. p5.js can
 * compute 1D, 2D and 3D noise, depending on the number of coordinates
 * given. The noise value can be animated by moving through the noise space
 * as demonstrated in the example above. The 2nd and 3rd dimension can also
 * be interpreted as time.<br /><br />The actual noise is structured
 * similar to an audio signal, in respect to the function's use of
 * frequencies. Similar to the concept of harmonics in physics, perlin
 * noise is computed over several octaves which are added together for the
 * final result. <br /><br />Another way to adjust the character of the
 * resulting sequence is the scale of the input coordinates. As the
 * function works within an infinite space the value of the coordinates
 * doesn't matter as such, only the distance between successive coordinates
 * does (eg. when using <b>noise()</b> within a loop). As a general rule
 * the smaller the difference between coordinates, the smoother the
 * resulting noise sequence will be. Steps of 0.005-0.03 work best for most
 * applications, but this will differ depending on use.
 *
 *
 * @method noise
 * @param  {Number} x   x-coordinate in noise space
 * @param  {Number} y   y-coordinate in noise space
 * @param  {Number} z   z-coordinate in noise space
 * @return {Number}     Perlin noise value (between 0 and 1) at specified
 *                      coordinates
 * @example
 * <div>
 * <code>var xoff = 0.0;
 *
 * function draw() {
 *   background(204);
 *   xoff = xoff + .01;
 *   var n = noise(xoff) * width;
 *   line(n, 0, n, height);
 * }
 * </code>
 * </div>
 * <div>
 * <code>var noiseScale=0.02;
 *
 * function draw() {
 *   background(0);
 *   for (var x=0; x < width; x++) {
 *     var noiseVal = noise((mouseX+x)*noiseScale, mouseY*noiseScale);
 *     stroke(noiseVal*255);
 *     line(x, mouseY+noiseVal*80, x, height);
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype.noise = function(x,y,z) {
  // is this legit?
  y = y || 0;
  z = z || 0;

  if (perlin == null) {
    // need to deal with seeding?
    //if (perlinRandom == null) {
    //  perlinRandom = new Random();
    //}

    perlin = new Array(PERLIN_SIZE + 1);
    for (var i = 0; i < PERLIN_SIZE + 1; i++) {
      perlin[i] = Math.random();
    }
  }

  if (x<0) { x=-x; }
  if (y<0) { y=-y; }
  if (z<0) { z=-z; }

  var xi=Math.floor(x), yi=Math.floor(y), zi=Math.floor(z);
  var xf = x - xi;
  var yf = y - yi;
  var zf = z - zi;
  var rxf, ryf;

  var r=0;
  var ampl=0.5;

  var n1,n2,n3;

  // Is this right do just have this here?
  var noise_fsc = function(i) {
    // using cosine lookup table
    return 0.5*(1.0-cosLUT[Math.floor(i*perlin_PI)%SINCOS_LENGTH]);
  };

  for (var o=0; o<perlin_octaves; o++) {
    var of=xi+(yi<<PERLIN_YWRAPB)+(zi<<PERLIN_ZWRAPB);

    rxf= noise_fsc(xf);
    ryf= noise_fsc(yf);

    n1  = perlin[of&PERLIN_SIZE];
    n1 += rxf*(perlin[(of+1)&PERLIN_SIZE]-n1);
    n2  = perlin[(of+PERLIN_YWRAP)&PERLIN_SIZE];
    n2 += rxf*(perlin[(of+PERLIN_YWRAP+1)&PERLIN_SIZE]-n2);
    n1 += ryf*(n2-n1);

    of += PERLIN_ZWRAP;
    n2  = perlin[of&PERLIN_SIZE];
    n2 += rxf*(perlin[(of+1)&PERLIN_SIZE]-n2);
    n3  = perlin[(of+PERLIN_YWRAP)&PERLIN_SIZE];
    n3 += rxf*(perlin[(of+PERLIN_YWRAP+1)&PERLIN_SIZE]-n3);
    n2 += ryf*(n3-n2);

    n1 += noise_fsc(zf)*(n2-n1);

    r += n1*ampl;
    ampl *= perlin_amp_falloff;
    xi<<=1;
    xf*=2;
    yi<<=1;
    yf*=2;
    zi<<=1;
    zf*=2;

    if (xf>=1.0) { xi++; xf--; }
    if (yf>=1.0) { yi++; yf--; }
    if (zf>=1.0) { zi++; zf--; }
  }
  return r;
};



// [toxi 040903]
// make perlin noise quality user controlled to allow
// for different levels of detail. lower values will produce
// smoother results as higher octaves are suppressed

/**
 *
 * Adjusts the character and level of detail produced by the Perlin noise
 * function. Similar to harmonics in physics, noise is computed over
 * several octaves. Lower octaves contribute more to the output signal and
 * as such define the overall intensity of the noise, whereas higher octaves
 * create finer grained details in the noise sequence. By default, noise is
 * computed over 4 octaves with each octave contributing exactly half than
 * its predecessor, starting at 50% strength for the 1st octave. This
 * falloff amount can be changed by adding an additional function
 * parameter. Eg. a falloff factor of 0.75 means each octave will now have
 * 75% impact (25% less) of the previous lower octave. Any value between
 * 0.0 and 1.0 is valid, however note that values greater than 0.5 might
 * result in greater than 1.0 values returned by <b>noise()</b>.<br /><br
 * />By changing these parameters, the signal created by the <b>noise()</b>
 * function can be adapted to fit very specific needs and characteristics.
 *
 * @method noiseDetail
 * @param {Number} lod number of octaves to be used by the noise
 * @param {Number} falloff falloff factor for each octave
 * @example
 * <div>
 * <code>
 *
 * var noiseVal;
 * var noiseScale=0.02;
 *
 * function setup() {
 *   createCanvas(100,100);
 * }
 *
 * function draw() {
 *   background(0);
 *   for (var y = 0; y < height; y++) {
 *     for (var x = 0; x < width/2; x++) {
 *       noiseDetail(2,0.2);
 *       noiseVal = noise((mouseX+x) * noiseScale,
 *                        (mouseY+y) * noiseScale);
 *       stroke(noiseVal*255);
 *       point(x,y);
 *       noiseDetail(8,0.65);
 *       noiseVal = noise((mouseX + x + width/2) * noiseScale,
 *                        (mouseY + y) * noiseScale);
 *       stroke(noiseVal*255);
 *       point(x + width/2, y);
 *     }
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype.noiseDetail = function(lod, falloff) {
  if (lod>0)     { perlin_octaves=lod; }
  if (falloff>0) { perlin_amp_falloff=falloff; }
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
 * <code>var xoff = 0.0;
 *
 * function setup() {
 *   noiseSeed(99);
 *   stroke(0, 10);
 * }
 *
 * function draw() {
 *   xoff = xoff + .01;
 *   var n = noise(xoff) * width;
 *   line(n, 0, n, height);
 * }
 * </code>
 * </div>
 */
p5.prototype.noiseSeed = function(seed) {
  // Linear Congruential Generator
  // Variant of a Lehman Generator
  var lcg = (function() {
    // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
    // m is basically chosen to be large (as it is the max period)
    // and for its relationships to a and c
    var m = 4294967296,
    // a - 1 should be divisible by m's prime factors
    a = 1664525,
     // c and m should be co-prime
    c = 1013904223,
    seed, z;
    return {
      setSeed : function(val) {
        // pick a random seed if val is undefined or null
        // the >>> 0 casts the seed to an unsigned 32-bit integer
        z = seed = (val == null ? Math.random() * m : val) >>> 0;
      },
      getSeed : function() {
        return seed;
      },
      rand : function() {
        // define the recurrence relationship
        z = (a * z + c) % m;
        // return a float in [0, 1)
        // if z = m then z / m = 0 therefore (z % m) / m < 1 always
        return z / m;
      }
    };
  }());

  lcg.setSeed(seed);
  perlin = new Array(PERLIN_SIZE + 1);
  for (var i = 0; i < PERLIN_SIZE + 1; i++) {
    perlin[i] = lcg.rand();
  }
};

module.exports = p5;
