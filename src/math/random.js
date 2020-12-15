/**
 * @module Math
 * @submodule Random
 * @for p5
 * @requires core
 */

import p5 from '../core/main';

// variables used for random number generators
const randomStateProp = '_lcg_random_state';
// Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
// m is basically chosen to be large (as it is the max period)
// and for its relationships to a and c
const m = 4294967296;
// a - 1 should be divisible by m's prime factors
const a = 1664525;
// c and m should be co-prime
const c = 1013904223;
let y2 = 0;

// Linear Congruential Generator that stores its state at instance[stateProperty]
p5.prototype._lcg = function(stateProperty) {
  // define the recurrence relationship
  this[stateProperty] = (a * this[stateProperty] + c) % m;
  // return a float in [0, 1)
  // we've just used % m, so / m is always < 1
  return this[stateProperty] / m;
};

p5.prototype._lcgSetSeed = function(stateProperty, val) {
  // pick a random seed if val is undefined or null
  // the >>> 0 casts the seed to an unsigned 32-bit integer
  this[stateProperty] = (val == null ? Math.random() * m : val) >>> 0;
};

/**
 * Sets the seed value for <a href="#/p5/random">random()</a>.
 *
 * By default, <a href="#/p5/random">random()</a> produces different results each time the program
 * is run. Set the seed parameter to a constant to return the same
 * pseudo-random numbers each time the software is run.
 *
 * @method randomSeed
 * @param {Number} seed   the seed value
 * @example
 * <div>
 * <code>
 * randomSeed(99);
 * for (let i = 0; i < 100; i++) {
 *   let r = random(0, 255);
 *   stroke(r);
 *   line(i, 0, i, 100);
 * }
 * </code>
 * </div>
 *
 * @alt
 * many vertical lines drawn in white, black or grey.
 */
p5.prototype.randomSeed = function(seed) {
  this._lcgSetSeed(randomStateProp, seed);
  this._gaussian_previous = false;
};

/**
 * Return a random floating-point number.
 *
 * Takes either 0, 1 or 2 arguments.
 *
 * If no argument is given, returns a random number from 0
 * up to (but not including) 1.
 *
 * If one argument is given and it is a number, returns a random number from 0
 * up to (but not including) the number.
 *
 * If one argument is given and it is an array, returns a random element from
 * that array.
 *
 * If two arguments are given, returns a random number from the
 * first argument up to (but not including) the second argument.
 *
 * @method random
 * @param  {Number} [min]   the lower bound (inclusive)
 * @param  {Number} [max]   the upper bound (exclusive)
 * @return {Number} the random number
 * @example
 * <div>
 * <code>
 * for (let i = 0; i < 100; i++) {
 *   let r = random(50);
 *   stroke(r * 5);
 *   line(50, i, 50 + r, i);
 * }
 * </code>
 * </div>
 * <div>
 * <code>
 * for (let i = 0; i < 100; i++) {
 *   let r = random(-50, 50);
 *   line(50, i, 50 + r, i);
 * }
 * </code>
 * </div>
 * <div>
 * <code>
 * // Get a random element from an array using the random(Array) syntax
 * let words = ['apple', 'bear', 'cat', 'dog'];
 * let word = random(words); // select random word
 * text(word, 10, 50); // draw the word
 * </code>
 * </div>
 *
 * @alt
 * 100 horizontal lines from center canvas to right. size+fill change each time
 * 100 horizontal lines from center of canvas. height & side change each render
 * word displayed at random. Either apple, bear, cat, or dog
 */
/**
 * @method random
 * @param  {Array} choices   the array to choose from
 * @return {*} the random element from the array
 * @example
 */
p5.prototype.random = function(min, max) {
  p5._validateParameters('random', arguments);
  let rand;

  if (this[randomStateProp] != null) {
    rand = this._lcg(randomStateProp);
  } else {
    rand = Math.random();
  }
  if (typeof min === 'undefined') {
    return rand;
  } else if (typeof max === 'undefined') {
    if (min instanceof Array) {
      return min[Math.floor(rand * min.length)];
    } else {
      return rand * min;
    }
  } else {
    if (min > max) {
      const tmp = min;
      min = max;
      max = tmp;
    }

    return rand * (max - min) + min;
  }
};

/**
 *
 * Returns a random number fitting a Gaussian, or
 * normal, distribution. There is theoretically no minimum or maximum
 * value that <a href="#/p5/randomGaussian">randomGaussian()</a> might return. Rather, there is
 * just a very low probability that values far from the mean will be
 * returned; and a higher probability that numbers near the mean will
 * be returned.
 *
 * Takes either 0, 1 or 2 arguments.<br>
 * If no args, returns a mean of 0 and standard deviation of 1.<br>
 * If one arg, that arg is the mean (standard deviation is 1).<br>
 * If two args, first is mean, second is standard deviation.
 *
 * @method randomGaussian
 * @param  {Number} [mean]  the mean
 * @param  {Number} [sd]    the standard deviation
 * @return {Number} the random number
 * @example
 * <div>
 * <code>
 * for (let y = 0; y < 100; y++) {
 *   let x = randomGaussian(50, 15);
 *   line(50, y, x, y);
 * }
 * </code>
 * </div>
 * <div>
 * <code>
 * let distribution = new Array(360);
 *
 * function setup() {
 *   createCanvas(100, 100);
 *   for (let i = 0; i < distribution.length; i++) {
 *     distribution[i] = floor(randomGaussian(0, 15));
 *   }
 * }
 *
 * function draw() {
 *   background(204);
 *
 *   translate(width / 2, width / 2);
 *
 *   for (let i = 0; i < distribution.length; i++) {
 *     rotate(TWO_PI / distribution.length);
 *     stroke(0);
 *     let dist = abs(distribution[i]);
 *     line(0, 0, dist, 0);
 *   }
 * }
 * </code>
 * </div>
 * @alt
 * 100 horizontal lines from center of canvas. height & side change each render
 * black lines radiate from center of canvas. size determined each render
 */
p5.prototype.randomGaussian = function(mean, sd = 1) {
  let y1, x1, x2, w;
  if (this._gaussian_previous) {
    y1 = y2;
    this._gaussian_previous = false;
  } else {
    do {
      x1 = this.random(2) - 1;
      x2 = this.random(2) - 1;
      w = x1 * x1 + x2 * x2;
    } while (w == 0 || w >= 1);
    w = Math.sqrt(-2 * Math.log(w) / w);
    y1 = x1 * w;
    y2 = x2 * w;
    this._gaussian_previous = true;
  }

  const m = mean || 0;
  return y1 * sd + m;
};

export default p5;
