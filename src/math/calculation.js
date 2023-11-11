/**
 * @module Math
 * @submodule Calculation
 * @for p5
 * @requires core
 */

import p5 from '../core/main';

/**
 * Calculates the absolute value of a number. A number's absolute value is its
 * distance from zero on the number line. -5 and 5 are both five units away
 * from zero, so calling `abs(-5)` and `abs(5)` both return 5. The absolute
 * value of a number is always positive.
 *
 * @method abs
 * @param  {Number} n number to compute.
 * @return {Number}   absolute value of given number.
 * @example
 * <div>
 * <code>
 * function draw() {
 *   // Invert the y-axis.
 *   scale(1, -1);
 *   translate(0, -height);
 *
 *   let centerX = width / 2;
 *   let x = frameCount;
 *   let y = abs(x - centerX);
 *   point(x, y);
 *
 *   describe('A series of black dots that form a "V" shape.');
 * }
 * </code>
 * </div>
 */
p5.prototype.abs = Math.abs;

/**
 * Calculates the closest integer value that is greater than or equal to the
 * parameter's value. For example, calling `ceil(9.03)` returns the value
 * 10.
 *
 * @method ceil
 * @param  {Number} n number to round up.
 * @return {Integer}   rounded up number.
 * @example
 * <div>
 * <code>
 * // Set the range for RGB values from 0 to 1.
 * colorMode(RGB, 1);
 * noStroke();
 *
 * let r = 0.3;
 * fill(r, 0, 0);
 * rect(0, 0, width / 2, height);
 *
 * // Round r up to 1.
 * r = ceil(r);
 * fill(r, 0, 0);
 * rect(width / 2, 0, width / 2, height);
 *
 * describe('Two rectangles. The one on the left is dark red and the one on the right is bright red.');
 * </code>
 * </div>
 */
p5.prototype.ceil = Math.ceil;

/**
 * Constrains a number between a minimum and maximum value.
 *
 * @method constrain
 * @param  {Number} n    number to constrain.
 * @param  {Number} low  minimum limit.
 * @param  {Number} high maximum limit.
 * @return {Number}      constrained number.
 * @example
 * <div>
 * <code>
 * function draw() {
 *   background(200);
 *
 *   let x = constrain(mouseX, 33, 67);
 *   let y = 50;
 *
 *   strokeWeight(5);
 *   point(x, y);
 *
 *   describe('A black dot drawn on a gray square follows the mouse from left to right. Its movement is constrained to the middle third of the square.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function draw() {
 *   background(200);
 *
 *   // Set boundaries and draw them.
 *   let leftWall = width * 0.25;
 *   let rightWall = width * 0.75;
 *   line(leftWall, 0, leftWall, height);
 *   line(rightWall, 0, rightWall, height);
 *
 *   // Draw a circle that follows the mouse freely.
 *   fill(255);
 *   circle(mouseX, height / 3, 9);
 *
 *   // Draw a circle that's constrained.
 *   let xc = constrain(mouseX, leftWall, rightWall);
 *   fill(0);
 *   circle(xc, 2 * height / 3, 9);
 *
 *   describe('Two vertical lines. Two circles move horizontally with the mouse. One circle stops at the vertical lines.');
 * }
 * </code>
 * </div>
 */
p5.prototype.constrain = function(n, low, high) {
  p5._validateParameters('constrain', arguments);
  return Math.max(Math.min(n, high), low);
};

/**
 * Calculates the distance between two points.
 *
 * The version of `dist()` with four parameters calculates distance in two
 * dimensions.
 *
 * The version of `dist()` with six parameters calculates distance in three
 * dimensions.
 *
 * Use <a href="#/p5.Vector/dist">p5.Vector.dist()</a> to calculate the
 * distance between two <a href="#/p5.Vector">p5.Vector</a> objects.
 *
 * @method dist
 * @param  {Number} x1 x-coordinate of the first point.
 * @param  {Number} y1 y-coordinate of the first point.
 * @param  {Number} x2 x-coordinate of the second point.
 * @param  {Number} y2 y-coordinate of the second point.
 * @return {Number}    distance between the two points.
 *
 * @example
 * <div>
 * <code>
 * let x1 = 10;
 * let y1 = 50;
 * let x2 = 90;
 * let y2 = 50;
 *
 * line(x1, y1, x2, y2);
 * strokeWeight(5);
 * point(x1, y1);
 * point(x2, y2);
 *
 * let d = dist(x1, y1, x2, y2);
 * text(d, 43, 40);
 *
 * describe('Two dots connected by a horizontal line. The number 80 is written above the center of the line.');
 * </code>
 * </div>
 */
/**
 * @method dist
 * @param  {Number} x1
 * @param  {Number} y1
 * @param  {Number} z1 z-coordinate of the first point.
 * @param  {Number} x2
 * @param  {Number} y2
 * @param  {Number} z2 z-coordinate of the second point.
 * @return {Number}    distance between the two points.
 */
p5.prototype.dist = function(...args) {
  p5._validateParameters('dist', args);
  if (args.length === 4) {
    //2D
    return Math.hypot(args[2] - args[0], args[3] - args[1]);
  } else if (args.length === 6) {
    //3D
    return Math.hypot(args[3] - args[0], args[4] - args[1], args[5] - args[2]);
  }
};

/**
 * Returns Euler's number e (2.71828...) raised to the power of the `n`
 * parameter.
 *
 * @method exp
 * @param  {Number} n exponent to raise.
 * @return {Number}   e^n
 * @example
 * <div>
 * <code>
 * function draw() {
 *   // Invert the y-axis.
 *   scale(1, -1);
 *   translate(0, -height);
 *
 *   let x = frameCount;
 *   let y = 0.005 * exp(x * 0.1);
 *   point(x, y);
 *
 *   describe('A series of black dots that grow exponentially from left to right.');
 * }
 * </code>
 * </div>
 */
p5.prototype.exp = Math.exp;

/**
 * Calculates the closest integer value that is less than or equal to the
 * value of the `n` parameter.
 *
 * @method floor
 * @param  {Number} n number to round down.
 * @return {Integer}  rounded down number.
 * @example
 * <div>
 * <code>
 * // Set the range for RGB values from 0 to 1.
 * colorMode(RGB, 1);
 * noStroke();
 *
 * let r = 0.8;
 * fill(r, 0, 0);
 * rect(0, 0, width / 2, height);
 *
 * // Round r down to 0.
 * r = floor(r);
 * fill(r, 0, 0);
 * rect(width / 2, 0, width / 2, height);
 *
 * describe('Two rectangles. The one on the left is bright red and the one on the right is black.');
 * </code>
 * </div>
 */
p5.prototype.floor = Math.floor;

/**
 * Calculates a number between two numbers at a specific increment. The `amt`
 * parameter is the amount to interpolate between the two numbers. 0.0 is
 * equal to the first number, 0.1 is very near the first number, 0.5 is
 * half-way in between, and 1.0 is equal to the second number. The `lerp()`
 * function is convenient for creating motion along a straight path and for
 * drawing dotted lines.
 *
 * If the value of `amt` is less than 0 or more than 1, `lerp()` will return a
 * number outside of the original interval. For example, calling
 * `lerp(0, 10, 1.5)` will return 15.
 *
 * @method lerp
 * @param  {Number} start first value.
 * @param  {Number} stop  second value.
 * @param  {Number} amt   number.
 * @return {Number}       lerped value.
 * @example
 * <div>
 * <code>
 * let a = 20;
 * let b = 80;
 * let c = lerp(a, b, 0.2);
 * let d = lerp(a, b, 0.5);
 * let e = lerp(a, b, 0.8);
 *
 * let y = 50;
 *
 * strokeWeight(5);
 *
 * // Draw the original points in black.
 * stroke(0);
 * point(a, y);
 * point(b, y);
 *
 * // Draw the lerped points in gray.
 * stroke(100);
 * point(c, y);
 * point(d, y);
 * point(e, y);
 *
 * describe('Five points in a horizontal line. The outer points are black and the inner points are gray.');
 * </code>
 * </div>
 */
p5.prototype.lerp = function(start, stop, amt) {
  p5._validateParameters('lerp', arguments);
  return amt * (stop - start) + start;
};

/**
 * Calculates the natural logarithm (the base-e logarithm) of a number. This
 * function expects the `n` parameter to be a value greater than 0.0.
 *
 * @method log
 * @param  {Number} n number greater than 0.
 * @return {Number}   natural logarithm of n.
 * @example
 * <div>
 * <code>
 * function draw() {
 *   // Invert the y-axis.
 *   scale(1, -1);
 *   translate(0, -height);
 *
 *   let x = frameCount;
 *   let y = 15 * log(x);
 *   point(x, y);
 *
 *   describe('A series of black dots that get higher slowly from left to right.');
 * }
 * </code>
 * </div>
 */
p5.prototype.log = Math.log;

/**
 * Calculates the magnitude, or length, of a vector. A vector is like an arrow
 * pointing in space. Vectors are commonly used for programming motion.
 *
 * Vectors don't have a "start" position because the same arrow can be drawn
 * anywhere. A vector's magnitude can be thought of as the distance from the
 * origin (0, 0) to its tip at (x, y). `mag(x, y)` is a shortcut for calling
 * `dist(0, 0, x, y)`.
 *
 * @method mag
 * @param  {Number} x first component.
 * @param  {Number} y second component.
 * @return {Number}   magnitude of vector from (0,0) to (x,y).
 * @example
 * <div>
 * <code>
 * let x = 30;
 * let y = 40;
 * let m = mag(x, y);
 *
 * line(0, 0, x, y);
 * text(m, x, y);
 *
 * describe('A diagonal line is drawn from the top left of the canvas. The number 50 is written at the end of the line.');
 * </code>
 * </div>
 */
p5.prototype.mag = function(x, y) {
  p5._validateParameters('mag', arguments);
  return Math.hypot(x, y);
};

/**
 * Re-maps a number from one range to another.
 *
 * For example, calling `map(2, 0, 10, 0, 100)` returns 20. The first three
 * arguments set the original value to 2 and the original range from 0 to 10.
 * The last two arguments set the target range from 0 to 100. 20's position
 * in the target range [0, 100] is proportional to 2's position in the
 * original range [0, 10].
 *
 * @method map
 * @param  {Number} value  the incoming value to be converted.
 * @param  {Number} start1 lower bound of the value's current range.
 * @param  {Number} stop1  upper bound of the value's current range.
 * @param  {Number} start2 lower bound of the value's target range.
 * @param  {Number} stop2  upper bound of the value's target range.
 * @param  {Boolean} [withinBounds] constrain the value to the newly mapped range.
 * @return {Number}        remapped number.
 * @example
 * <div>
 * <code>
 * let n = map(7, 0, 10, 0, 100);
 * text(n, 50, 50);
 *
 * describe('The number 70 written in the middle of a gray square.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let x = map(2, 0, 10, 0, width);
 * circle(x, 50, 10);
 *
 * describe('A white circle drawn on the left side of a gray square.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function draw() {
 *   background(200);
 *
 *   let c = map(mouseX, 0, width, 0, 255);
 *   fill(c);
 *   circle(50, 50, 20);
 *
 *   describe('A circle changes color from black to white as the mouse moves from left to right.');
 * }
 * </code>
 * </div>
 */
p5.prototype.map = function(n, start1, stop1, start2, stop2, withinBounds) {
  p5._validateParameters('map', arguments);
  const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
  if (!withinBounds) {
    return newval;
  }
  if (start2 < stop2) {
    return this.constrain(newval, start2, stop2);
  } else {
    return this.constrain(newval, stop2, start2);
  }
};

/**
 * Returns the largest value in a sequence of numbers.
 *
 * The version of `max()` with one parameter interprets it as an array of
 * numbers and returns the largest number.
 *
 * The version of `max()` with two or more parameters interprets them as
 * individual numbers and returns the largest number.
 *
 * @method max
 * @param  {Number} n0 first number to compare.
 * @param  {Number} n1 second number to compare.
 * @return {Number}             maximum number.
 * @example
 * <div>
 * <code>
 * let m = max(10, 20);
 * text(m, 50, 50);
 *
 * describe('The number 20 written in the middle of a gray square.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let m = max([10, 20]);
 * text(m, 50, 50);
 *
 * describe('The number 20 written in the middle of a gray square.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let numbers = [2, 1, 5, 4, 8, 9];
 *
 * // Draw all of the numbers in the array.
 * noStroke();
 * let spacing = 15;
 * numbers.forEach((n, index) => {
 *   let x = index * spacing;
 *   let y = 25;
 *   text(n, x, y);
 * });
 *
 * // Draw the maximum value in the array.
 * let m = max(numbers);
 * let maxX = 33;
 * let maxY = 80;
 *
 * textSize(32);
 * text(m, maxX, maxY);
 *
 * describe('The numbers 2 1 5 4 8 9 are written in small text at the top of a gray square. The number 9 is written in large text at the center of the square.');
 * </code>
 * </div>
 */
/**
 * @method max
 * @param  {Number[]} nums numbers to compare.
 * @return {Number}
 */
p5.prototype.max = function(...args) {
  const findMax = arr => {
    let max = -Infinity;
    for (let x of arr) {
      max = x > max ? x : max;
    }
    return max;
  };

  if (args[0] instanceof Array) {
    return findMax(args[0]);
  } else {
    return findMax(args);
  }
};

/**
 * Returns the smallest value in a sequence of numbers.
 *
 * The version of `min()` with one parameter interprets it as an array of
 * numbers and returns the smallest number.
 *
 * The version of `min()` with two or more parameters interprets them as
 * individual numbers and returns the smallest number.
 *
 * @method min
 * @param  {Number} n0 first number to compare.
 * @param  {Number} n1 second number to compare.
 * @return {Number}             minimum number.
 * @example
 * <div>
 * <code>
 * let m = min(10, 20);
 * text(m, 50, 50);
 *
 * describe('The number 10 written in the middle of a gray square.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let m = min([10, 20]);
 * text(m, 50, 50);
 *
 * describe('The number 10 written in the middle of a gray square.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let numbers = [2, 1, 5, 4, 8, 9];
 *
 * // Draw all of the numbers in the array.
 * noStroke();
 * let spacing = 15;
 * numbers.forEach((n, index) => {
 *   let x = index * spacing;
 *   let y = 25;
 *   text(n, x, y);
 * });
 *
 * // Draw the minimum value in the array.
 * let m = min(numbers);
 * let minX = 33;
 * let minY = 80;
 *
 * textSize(32);
 * text(m, minX, minY);
 *
 * describe('The numbers 2 1 5 4 8 9 are written in small text at the top of a gray square. The number 1 is written in large text at the center of the square.');
 * </code>
 * </div>
 */
/**
 * @method min
 * @param  {Number[]} nums numbers to compare.
 * @return {Number}
 */
p5.prototype.min = function(...args) {
  const findMin = arr => {
    let min = Infinity;
    for (let x of arr) {
      min = x < min ? x : min;
    }
    return min;
  };

  if (args[0] instanceof Array) {
    return findMin(args[0]);
  } else {
    return findMin(args);
  }
};

/**
 * Maps a number from one range to a value between 0 and 1.
 *
 * For example, `norm(2, 0, 10)` returns 0.2. 2's position in the original
 * range [0, 10] is proportional to 0.2's position in the range [0, 1]. This
 * is equivalent to calling `map(2, 0, 10, 0, 1)`.
 *
 * Numbers outside of the original range are not constrained between 0 and 1.
 * Out-of-range values are often intentional and useful.
 *
 * @method norm
 * @param  {Number} value incoming value to be normalized.
 * @param  {Number} start lower bound of the value's current range.
 * @param  {Number} stop  upper bound of the value's current range.
 * @return {Number}       normalized number.
 * @example
 * <div>
 * <code>
 * function draw() {
 *   // Set the range for RGB values from 0 to 1.
 *   colorMode(RGB, 1);
 *
 *   let r = norm(mouseX, 0, width);
 *   background(r, 0, 0);
 *
 *   describe('A square changes color from black to red as the mouse moves from left to right.');
 * }
 * </code>
 * </div>
 */
p5.prototype.norm = function(n, start, stop) {
  p5._validateParameters('norm', arguments);
  return this.map(n, start, stop, 0, 1);
};

/**
 * Calculates exponential expressions such as 2^3.
 *
 * For example, `pow(2, 3)` is equivalent to the expression
 * 2 &times; 2 &times; 2. `pow(2, -3)` is equivalent to 1 &#247;
 * (2 &times; 2 &times; 2).
 *
 * @method pow
 * @param  {Number} n base of the exponential expression.
 * @param  {Number} e power by which to raise the base.
 * @return {Number}   n^e.
 * @example
 * <div>
 * <code>
 * let base = 3;
 *
 * let d = pow(base, 1);
 * circle(10, 10, d);
 *
 * d = pow(base, 2);
 * circle(20, 20, d);
 *
 * d = pow(base, 3);
 * circle(40, 40, d);
 *
 * d = pow(base, 4);
 * circle(80, 80, d);
 *
 * describe('A series of circles that grow exponentially from top left to bottom right.');
 * </code>
 * </div>
 */
p5.prototype.pow = Math.pow;

/**
 * Calculates the integer closest to the `n` parameter. For example,
 * `round(133.8)` returns the value 134.
 *
 * @method round
 * @param  {Number} n number to round.
 * @param  {Number} [decimals] number of decimal places to round to, default is 0.
 * @return {Integer}  rounded number.
 * @example
 * <div>
 * <code>
 * let x = round(3.7);
 * text(x, width / 2, height / 2);
 *
 * describe('The number 4 written in middle of canvas.');
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let x = round(12.782383, 2);
 * text(x, width / 2, height / 2);
 *
 * describe('The number 12.78 written in middle of canvas.');
 * </code>
 * </div>
 */
p5.prototype.round = function(n, decimals) {
  if (!decimals) {
    return Math.round(n);
  }
  const multiplier = Math.pow(10, decimals);
  return Math.round(n * multiplier) / multiplier;
};

/**
 * Squares a number, which means multiplying the number by itself. The value
 * returned is always a positive number.
 *
 * For example, `sq(3)` evaluates 3 &times; 3  which is 9. `sq(-3)` evaluates
 * -3 &times; -3 which is also 9.  Multiplying two negative numbers produces
 * a positive number.
 *
 * @method sq
 * @param  {Number} n number to square.
 * @return {Number}   squared number.
 * @example
 * <div>
 * <code>
 * function draw() {
 *   // Invert the y-axis.
 *   scale(1, -1);
 *   translate(0, -height);
 *
 *   let x = frameCount;
 *   let y = 0.01 * sq(x);
 *   point(x, y);
 *
 *   describe('A series of black dots that get higher quickly from left to right.');
 * }
 * </code>
 * </div>
 */
p5.prototype.sq = n => n * n;

/**
 * Calculates the square root of a number. A number's square root can be
 * multiplied by itself to produce the original number.
 *
 * For example, `sqrt(9)` returns 3 because 3 &times; 3 = 9. `sqrt()` always
 * returns a positive value. `sqrt()` doesn't work with negative arguments
 * such as `sqrt(-9)`.
 *
 * @method sqrt
 * @param  {Number} n non-negative number to square root.
 * @return {Number}   square root of number.
 * @example
 * <div>
 * <code>
 * function draw() {
 *   // Invert the y-axis.
 *   scale(1, -1);
 *   translate(0, -height);
 *
 *   let x = frameCount;
 *   let y = 5 * sqrt(x);
 *   point(x, y);
 *
 *   describe('A series of black dots that get higher slowly from left to right.');
 * }
 * </code>
 * </div>
 */
p5.prototype.sqrt = Math.sqrt;

/**
 * Calculates the fractional part of a number. For example,
 * `fract(12.34)` returns 0.34.
 *
 * @method fract
 * @param {Number} n number whose fractional part will be found.
 * @returns {Number} fractional part of n.
 * @example
 * <div>
 * <code>
 * let n = 56.78;
 * text(n, 20, 33);
 * let f = fract(n);
 * text(f, 20, 66);
 *
 * describe('The number 56.78 written above the number 0.78.');
 * </code>
 * </div>
 */
p5.prototype.fract = function(toConvert) {
  p5._validateParameters('fract', arguments);
  let sign = 0;
  let num = Number(toConvert);
  if (isNaN(num) || Math.abs(num) === Infinity) {
    return num;
  } else if (num < 0) {
    num = -num;
    sign = 1;
  }
  if (String(num).includes('.') && !String(num).includes('e')) {
    let toFract = String(num);
    toFract = Number('0' + toFract.slice(toFract.indexOf('.')));
    return Math.abs(sign - toFract);
  } else if (num < 1) {
    return Math.abs(sign - num);
  } else {
    return 0;
  }
};

export default p5;
