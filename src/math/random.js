/**
 * @module Math
 * @submodule Random
 * @for p5
 * @requires core
 */

function random(p5, fn){
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
  fn._lcg = function(stateProperty) {
    // define the recurrence relationship
    this[stateProperty] = (a * this[stateProperty] + c) % m;
    // return a float in [0, 1)
    // we've just used % m, so / m is always < 1
    return this[stateProperty] / m;
  };

  fn._lcgSetSeed = function(stateProperty, val) {
    // pick a random seed if val is undefined or null
    // the >>> 0 casts the seed to an unsigned 32-bit integer
    this[stateProperty] = (val == null ? Math.random() * m : val) >>> 0;
  };

  /**
   * Sets the seed value for the <a href="#/p5/random">random()</a> and
   * <a href="#/p5/randomGaussian">randomGaussian()</a> functions.
   *
   * By default, <a href="#/p5/random">random()</a> and
   * <a href="#/p5/randomGaussian">randomGaussian()</a> produce different
   * results each time a sketch is run. Calling `randomSeed()` with a constant
   * argument, such as `randomSeed(99)`, makes these functions produce the same
   * results each time a sketch is run.
   *
   * @method randomSeed
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
   *   // Get random coordinates.
   *   let x = random(0, 100);
   *   let y = random(0, 100);
   *
   *   // Draw the white circle.
   *   circle(x, y, 10);
   *
   *   // Set a random seed for consistency.
   *   randomSeed(99);
   *
   *   // Get random coordinates.
   *   x = random(0, 100);
   *   y = random(0, 100);
   *
   *   // Draw the black circle.
   *   fill(0);
   *   circle(x, y, 10);
   *
   *   describe('A white circle appears at a random position. A black circle appears at (27.4, 25.8).');
   * }
   * </code>
   * </div>
   */
  fn.randomSeed = function(seed) {
    this._lcgSetSeed(randomStateProp, seed);
    this._gaussian_previous = false;
  };

  /**
   * Returns a random number or a random element from an array.
   *
   * `random()` follows uniform distribution, which means that all outcomes are
   * equally likely. When `random()` is used to generate numbers, all
   * numbers in the output range are equally likely to be returned. When
   * `random()` is used to select elements from an array, all elements are
   * equally likely to be chosen.
   *
   * By default, `random()` produces different results each time a sketch runs.
   * The <a href="#/p5/randomSeed">randomSeed()</a> function can be used to
   * generate the same sequence of numbers or choices each time a sketch runs.
   *
   * The version of `random()` with no parameters returns a random number from 0
   * up to but not including 1.
   *
   * The version of `random()` with one parameter works one of two ways. If the
   * argument passed is a number, `random()` returns a random number from 0 up
   * to but not including the number. For example, calling `random(5)` returns
   * values between 0 and 5. If the argument passed is an array, `random()`
   * returns a random element from that array. For example, calling
   * `random(['🦁', '🐯', '🐻'])` returns either a lion, tiger, or bear emoji.
   *
   * The version of `random()` with two parameters returns a random number from
   * a given range. The arguments passed set the range's lower and upper bounds.
   * For example, calling `random(-5, 10.2)` returns values from -5 up to but
   * not including 10.2.
   *
   * @method random
   * @param  {Number} [min]   lower bound (inclusive).
   * @param  {Number} [max]   upper bound (exclusive).
   * @return {Number} random number.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Get random coordinates between 0 and 100.
   *   let x = random(0, 100);
   *   let y = random(0, 100);
   *
   *   // Draw a point.
   *   strokeWeight(5);
   *   point(x, y);
   *
   *   describe('A black dot appears in a random position on a gray square.');
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
   *   // Get random coordinates between 0 and 100.
   *   let x = random(100);
   *   let y = random(100);
   *
   *   // Draw the point.
   *   strokeWeight(5);
   *   point(x, y);
   *
   *   describe('A black dot appears in a random position on a gray square.');
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
   *   // Create an array of emoji strings.
   *   let animals = ['🦁', '🐯', '🐻'];
   *
   *   // Choose a random element from the array.
   *   let choice = random(animals);
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(20);
   *
   *   // Display the emoji.
   *   text(choice, 50, 50);
   *
   *   describe('An animal face is displayed at random. Either a lion, tiger, or bear.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Slow the frame rate.
   *   frameRate(5);
   *
   *   describe('A black dot moves around randomly on a gray square.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Get random coordinates between 0 and 100.
   *   let x = random(100);
   *   let y = random(100);
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
   *   // Slow the frame rate.
   *   frameRate(5);
   *
   *   describe('A black dot moves around randomly in the middle of a gray square.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Get random coordinates between 45 and 55.
   *   let x = random(45, 55);
   *   let y = random(45, 55);
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
   * let x = 50;
   * let y = 50;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   describe('A black dot moves around randomly leaving a trail.');
   * }
   *
   * function draw() {
   *   // Update x and y randomly.
   *   x += random(-1, 1);
   *   y += random(-1, 1);
   *
   *   // Draw the point.
   *   point(x, y);
   * }
   * </code>
   * </div>
   */
  /**
   * @method random
   * @param  {Array} choices   array to choose from.
   * @return {*} random element from the array.
   */
  fn.random = function(min, max) {
    // p5._validateParameters('random', arguments);
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
   * Returns a random number fitting a Gaussian, or normal, distribution.
   *
   * Normal distributions look like bell curves when plotted. Values from a
   * normal distribution cluster around a central value called the mean. The
   * cluster's standard deviation describes its spread.
   *
   * By default, `randomGaussian()` produces different results each time a
   * sketch runs. The <a href="#/p5/randomSeed">randomSeed()</a> function can be
   * used to generate the same sequence of numbers each time a sketch runs.
   *
   * There's no minimum or maximum value that `randomGaussian()` might return.
   * Values far from the mean are very unlikely and values near the mean are
   * very likely.
   *
   * The version of `randomGaussian()` with no parameters returns values with a
   * mean of 0 and standard deviation of 1.
   *
   * The version of `randomGaussian()` with one parameter interprets the
   * argument passed as the mean. The standard deviation is 1.
   *
   * The version of `randomGaussian()` with two parameters interprets the first
   * argument passed as the mean and the second as the standard deviation.
   *
   * @method randomGaussian
   * @param  {Number} [mean]  mean.
   * @param  {Number} [sd]    standard deviation.
   * @return {Number} random number.
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   describe('Three horizontal black lines are filled in randomly. The top line spans entire canvas. The middle line is very short. The bottom line spans two-thirds of the canvas.');
   * }
   *
   * function draw() {
   *   // Style the circles.
   *   noStroke();
   *   fill(0, 10);
   *
   *   // Uniform distribution between 0 and 100.
   *   let x = random(100);
   *   let y = 25;
   *   circle(x, y, 5);
   *
   *   // Gaussian distribution with a mean of 50 and sd of 1.
   *   x = randomGaussian(50);
   *   y = 50;
   *   circle(x, y, 5);
   *
   *   // Gaussian distribution with a mean of 50 and sd of 10.
   *   x = randomGaussian(50, 10);
   *   y = 75;
   *   circle(x, y, 5);
   * }
   * </code>
   * </div>
   */
  fn.randomGaussian = function(mean, sd = 1) {
    let y1, x1, x2, w;
    if (this._gaussian_previous) {
      y1 = y2;
      this._gaussian_previous = false;
    } else {
      do {
        x1 = this.random(2) - 1;
        x2 = this.random(2) - 1;
        w = x1 * x1 + x2 * x2;
      } while (w >= 1);
      w = Math.sqrt(-2 * Math.log(w) / w);
      y1 = x1 * w;
      y2 = x2 * w;
      this._gaussian_previous = true;
    }

    const m = mean || 0;
    return y1 * sd + m;
  };
}

export default random;

if(typeof p5 !== 'undefined'){
  random(p5, p5.prototype);
}
