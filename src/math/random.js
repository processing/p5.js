/**
 * @module Math
 * @submodule Random
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

var seeded = false;

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

/**
 * Sets the seed value for random().
 *
 * By default, random() produces different results each time the program
 * is run. Set the seed parameter to a constant to return the same
 * pseudo-random numbers each time the software is run.
 *
 * @method randomSeed
 * @param {Number} seed   the seed value
 * @example
 * <div>
 * <code>
 * randomSeed(99);
 * for (var i=0; i < 100; i++) {
 *   var r = random(0, 255);
 *   stroke(r);
 *   line(i, 0, i, 100);
 * }
 * </code>
 * </div>
 */
p5.prototype.randomSeed = function(seed) {
  lcg.setSeed(seed);
  seeded = true;
};

/**
 * Return a random number.
 *
 * Takes either 0, 1 or 2 arguments.
 * If no argument is given, returns a random number between 0 and 1.
 * If one argument is given, returns a random number between 0 and the number.
 * If two arguments are given, returns a random number between them,
 * inclusive.
 *
 * @method random
 * @param  {Number} min   the lower bound
 * @param  {Number} max   the upper bound
 * @return {Number} the random number
 * @example
 * <div>
 * <code>
 * for (var i = 0; i < 100; i++) {
 *   var r = random(50);
 *   stroke(r*5);
 *   line(50, i, 50+r, i);
 * }
 * </code>
 * </div>
 * <div>
 * <code>
 * for (var i = 0; i < 100; i++) {
 *   var r = random(-50, 50);
 *   line(50,i,50+r,i);
 * }
 * </code>
 * </div>
 * <div>
 * <code>
 * // Get a random element from an array
 * var words = [ "apple", "bear", "cat", "dog" ];
 * var index = floor(random(words.length));  // Convert to integer
 * text(words[index],10,50);  // Displays one of the four words
 * </code>
 * </div>
 */
p5.prototype.random = function (min, max) {

  var rand;

  if (seeded) {
    rand  = lcg.rand();
  } else {
    rand = Math.random();
  }

  if (arguments.length === 0) {
    return rand;
  } else
  if (arguments.length === 1) {
    return rand * min;
  } else {
    if (min > max) {
      var tmp = min;
      min = max;
      max = tmp;
    }

    return rand * (max-min) + min;
  }
};


/**
 *
 * Returns a random number fitting a Gaussian, or
 * normal, distribution. There is theoretically no minimum or maximum
 * value that <b>randomGaussian()</b> might return. Rather, there is
 * just a very low probability that values far from the mean will be
 * returned; and a higher probability that numbers near the mean will
 * be returned.
 * Takes either 0, 1 or 2 arguments.
 * If no args, returns a mean of 0 and standard deviation of 1
 * If one arg, that arg is the mean (standard deviation is 1)
 * If two args, first is mean, second is standard deviation
 *
 * @method randomGaussian
 * @param  {Number} mean  the mean
 * @param  {Number} sd    the standard deviation
 * @return {Number} the random number
 * @example
 * <div>
 * <code>for (var y = 0; y < 100; y++) {
 *  var x = randomGaussian(50,15);
 *  line(50, y, x, y);
 *}
 * </code>
 * </div>
 * <div>
 * <code>
 *var distribution = new Array(360);
 *
 *function setup() {
 *  createCanvas(100, 100);
 *  for (var i = 0; i < distribution.length; i++) {
 *    distribution[i] = floor(randomGaussian(0,15));
 *  }
 *}
 *
 *function draw() {
 *  background(204);
 *
 *  translate(width/2, width/2);
 *
 *  for (var i = 0; i < distribution.length; i++) {
 *    rotate(TWO_PI/distribution.length);
 *    stroke(0);
 *    var dist = abs(distribution[i]);
 *    line(0, 0, dist, 0);
 *  }
 *}
 * </code>
 * </div>
 */
var y2;
var previous = false;
p5.prototype.randomGaussian = function(mean, sd)  {
  var y1,x1,x2,w;
  if (previous) {
    y1 = y2;
    previous = false;
  } else {
    do {
      x1 = this.random(2) - 1;
      x2 = this.random(2) - 1;
      w = x1 * x1 + x2 * x2;
    } while (w >= 1);
    w = Math.sqrt((-2 * Math.log(w))/w);
    y1 = x1 * w;
    y2 = x2 * w;
    previous = true;
  }

  var m = mean || 0;
  var s = sd || 1;
  return y1*s + m;
};

module.exports = p5;
