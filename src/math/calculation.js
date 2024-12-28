/**
 * @module Math
 * @submodule Calculation
 * @for p5
 * @requires core
 */

function calculation(p5, fn){
  /**
   * Calculates the absolute value of a number.
   *
   * A number's absolute value is its distance from zero on the number line.
   * -5 and 5 are both five units away from zero, so calling `abs(-5)` and
   * `abs(5)` both return 5. The absolute value of a number is always positive.
   *
   * @method abs
   * @param  {Number} n number to compute.
   * @return {Number}   absolute value of given number.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe('A gray square with a vertical black line that divides it in half. A white rectangle gets taller when the user moves the mouse away from the line.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Divide the canvas.
   *   line(50, 0, 50, 100);
   *
   *   // Calculate the mouse's distance from the middle.
   *   let h = abs(mouseX - 50);
   *
   *   // Draw a rectangle based on the mouse's distance
   *   // from the middle.
   *   rect(0, 100 - h, 100, h);
   * }
   * </code>
   * </div>
   */
  fn.abs = Math.abs;

  /**
   * Calculates the closest integer value that is greater than or equal to a
   * number.
   *
   * For example, calling `ceil(9.03)` and `ceil(9.97)` both return the value
   * 10.
   *
   * @method ceil
   * @param  {Number} n number to round up.
   * @return {Integer}   rounded up number.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Use RGB color with values from 0 to 1.
   *   colorMode(RGB, 1);
   *
   *   noStroke();
   *
   *   // Draw the left rectangle.
   *   let r = 0.3;
   *   fill(r, 0, 0);
   *   rect(0, 0, 50, 100);
   *
   *   // Round r up to 1.
   *   r = ceil(r);
   *
   *   // Draw the right rectangle.
   *   fill(r, 0, 0);
   *   rect(50, 0, 50, 100);
   *
   *   describe('Two rectangles. The one on the left is dark red and the one on the right is bright red.');
   * }
   * </code>
   * </div>
   */
  fn.ceil = Math.ceil;

  /**
   * Constrains a number between a minimum and maximum value.
   *
   * @method constrain
   * @param  {Number} n    number to constrain.
   * @param  {Number} low  minimum limit.
   * @param  {Number} high maximum limit.
   * @return {Number}      constrained number.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe('A black dot drawn on a gray square follows the mouse from left to right. Its movement is constrained to the middle third of the square.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   let x = constrain(mouseX, 33, 67);
   *   let y = 50;
   *
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
   *   describe('Two vertical lines. Two circles move horizontally with the mouse. One circle stops at the vertical lines.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Set boundaries and draw them.
   *   let leftWall = 25;
   *   let rightWall = 75;
   *   line(leftWall, 0, leftWall, 100);
   *   line(rightWall, 0, rightWall, 100);
   *
   *   // Draw a circle that follows the mouse freely.
   *   fill(255);
   *   circle(mouseX, 33, 9);
   *
   *   // Draw a circle that's constrained.
   *   let xc = constrain(mouseX, leftWall, rightWall);
   *   fill(0);
   *   circle(xc, 67, 9);
   * }
   * </code>
   * </div>
   */
  fn.constrain = function(n, low, high) {
    // p5._validateParameters('constrain', arguments);
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
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Set the coordinates.
   *   let x1 = 10;
   *   let y1 = 50;
   *   let x2 = 90;
   *   let y2 = 50;
   *
   *   // Draw the points and a line connecting them.
   *   line(x1, y1, x2, y2);
   *   strokeWeight(5);
   *   point(x1, y1);
   *   point(x2, y2);
   *
   *   // Calculate the distance.
   *   let d = dist(x1, y1, x2, y2);
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *
   *   // Display the distance.
   *   text(d, 43, 40);
   *
   *   describe('Two dots connected by a horizontal line. The number 80 is written above the center of the line.');
   * }
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
  fn.dist = function(...args) {
    // p5._validateParameters('dist', args);
    if (args.length === 4) {
      //2D
      return Math.hypot(args[2] - args[0], args[3] - args[1]);
    } else if (args.length === 6) {
      //3D
      return Math.hypot(
        args[3] - args[0], args[4] - args[1], args[5] - args[2]
      );
    }
  };

  /**
   * Calculates the value of Euler's number e (2.71828...) raised to the power
   * of a number.
   *
   * @method exp
   * @param  {Number} n exponent to raise.
   * @return {Number}   e^n
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Top-left.
   *   let d = exp(1);
   *   circle(10, 10, d);
   *
   *   // Left-center.
   *   d = exp(2);
   *   circle(20, 20, d);
   *
   *   // Right-center.
   *   d = exp(3);
   *   circle(40, 40, d);
   *
   *   // Bottom-right.
   *   d = exp(4);
   *   circle(80, 80, d);
   *
   *   describe('A series of circles that grow exponentially from top left to bottom right.');
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
   *   describe('A series of black dots that grow exponentially from left to right.');
   * }
   *
   * function draw() {
   *   // Invert the y-axis.
   *   scale(1, -1);
   *   translate(0, -100);
   *
   *   // Calculate the coordinates.
   *   let x = frameCount;
   *   let y = 0.005 * exp(x * 0.1);
   *
   *   // Draw a point.
   *   point(x, y);
   * }
   * </code>
   * </div>
   */
  fn.exp = Math.exp;

  /**
   * Calculates the closest integer value that is less than or equal to the
   * value of a number.
   *
   * @method floor
   * @param  {Number} n number to round down.
   * @return {Integer}  rounded down number.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Use RGB color with values from 0 to 1.
   *   colorMode(RGB, 1);
   *
   *   noStroke();
   *
   *   // Draw the left rectangle.
   *   let r = 0.8;
   *   fill(r, 0, 0);
   *   rect(0, 0, 50, 100);
   *
   *   // Round r down to 0.
   *   r = floor(r);
   *
   *   // Draw the right rectangle.
   *   fill(r, 0, 0);
   *   rect(50, 0, 50, 100);
   *
   *   describe('Two rectangles. The one on the left is bright red and the one on the right is black.');
   * }
   * </code>
   * </div>
   */
  fn.floor = Math.floor;

  /**
   * Calculates a number between two numbers at a specific increment.
   *
   * The `amt` parameter is the amount to interpolate between the two numbers.
   * 0.0 is equal to the first number, 0.1 is very near the first number, 0.5 is
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
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Declare variables for coordinates.
   *   let a = 20;
   *   let b = 80;
   *   let c = lerp(a, b, 0.2);
   *   let d = lerp(a, b, 0.5);
   *   let e = lerp(a, b, 0.8);
   *
   *   strokeWeight(5);
   *
   *   // Draw the original points in black.
   *   stroke(0);
   *   point(a, 50);
   *   point(b, 50);
   *
   *   // Draw the lerped points in gray.
   *   stroke(100);
   *   point(c, 50);
   *   point(d, 50);
   *   point(e, 50);
   *
   *   describe('Five points in a horizontal line. The outer points are black and the inner points are gray.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let x = 50;
   * let y = 50;
   * let targetX = 50;
   * let targetY = 50;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   describe('A white circle at the center of a gray canvas. The circle moves to where the user clicks, then moves smoothly back to the center.');
   * }
   *
   * function draw() {
   *   background(220);
   *
   *   // Move x and y toward the target.
   *   x = lerp(x, targetX, 0.05);
   *   y = lerp(y, targetY, 0.05);
   *
   *   // Draw the circle.
   *   circle(x, y, 20);
   * }
   *
   * // Set x and y when the user clicks the mouse.
   * function mouseClicked() {
   *   x = mouseX;
   *   y = mouseY;
   * }
   * </code>
   * </div>
   */
  fn.lerp = function(start, stop, amt) {
    // p5._validateParameters('lerp', arguments);
    return amt * (stop - start) + start;
  };

  /**
   * Calculates the natural logarithm (the base-e logarithm) of a number.
   *
   * `log()` expects the `n` parameter to be a value greater than 0 because
   * the natural logarithm is defined that way.
   *
   * @method log
   * @param  {Number} n number greater than 0.
   * @return {Number}   natural logarithm of n.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Top-left.
   *   let d = log(50);
   *   circle(33, 33, d);
   *
   *   // Bottom-right.
   *   d = log(500000000);
   *   circle(67, 67, d);
   *
   *   describe('Two white circles. The circle at the top-left is small. The circle at the bottom-right is about five times larger.');
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
   *   describe('A series of black dots that get higher slowly from left to right.');
   * }
   *
   * function draw() {
   *   // Invert the y-axis.
   *   scale(1, -1);
   *   translate(0, -100);
   *
   *   // Calculate coordinates.
   *   let x = frameCount;
   *   let y = 15 * log(x);
   *
   *   // Draw a point.
   *   point(x, y);
   * }
   * </code>
   * </div>
   */
  fn.log = Math.log;

  /**
   * Calculates the magnitude, or length, of a vector.
   *
   * A vector can be thought of in different ways. In one view, a vector is a
   * point in space. The vector's components, `x` and `y`, are the point's
   * coordinates `(x, y)`. A vector's magnitude is the distance from the origin
   * `(0, 0)` to `(x, y)`. `mag(x, y)` is a shortcut for calling
   * `dist(0, 0, x, y)`.
   *
   * A vector can also be thought of as an arrow pointing in space. This view is
   * helpful for programming motion. See <a href="#/p5.Vector">p5.Vector</a> for
   * more details.
   *
   * Use <a href="#/p5.Vector/mag">p5.Vector.mag()</a> to calculate the
   * magnitude of a <a href="#/p5.Vector">p5.Vector</a> object.
   *
   * @method mag
   * @param  {Number} x first component.
   * @param  {Number} y second component.
   * @return {Number}   magnitude of vector.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Set the vector's components.
   *   let x = 30;
   *   let y = 40;
   *
   *   // Calculate the magnitude.
   *   let m = mag(x, y);
   *
   *   // Style the text.
   *   textSize(16);
   *
   *   // Display the vector and its magnitude.
   *   line(0, 0, x, y);
   *   text(m, x, y);
   *
   *   describe('A diagonal line is drawn from the top left of the canvas. The number 50 is written at the end of the line.');
   * }
   * </code>
   * </div>
   */
  fn.mag = function(x, y) {
    // p5._validateParameters('mag', arguments);
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
   * The sixth parameter, `withinBounds`, is optional. By default, `map()` can
   * return values outside of the target range. For example,
   * `map(11, 0, 10, 0, 100)` returns 110. Passing `true` as the sixth parameter
   * constrains the remapped value to the target range. For example,
   * `map(11, 0, 10, 0, 100, true)` returns 100.
   *
   * @method map
   * @param  {Number} value  the value to be remapped.
   * @param  {Number} start1 lower bound of the value's current range.
   * @param  {Number} stop1  upper bound of the value's current range.
   * @param  {Number} start2 lower bound of the value's target range.
   * @param  {Number} stop2  upper bound of the value's target range.
   * @param  {Boolean} [withinBounds] constrain the value to the newly mapped range.
   * @return {Number}        remapped number.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe('Two horizontal lines. The top line grows horizontally as the mouse moves to the right. The bottom line also grows horizontally but is scaled to stay on the left half of the canvas.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Draw the top line.
   *   line(0, 25, mouseX, 25);
   *
   *   // Remap mouseX from [0, 100] to [0, 50].
   *   let x = map(mouseX, 0, 100, 0, 50);
   *
   *   // Draw the bottom line.
   *   line(0, 75, 0, x);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe('A circle changes color from black to white as the mouse moves from left to right.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Remap mouseX from [0, 100] to [0, 255]
   *   let c = map(mouseX, 0, 100, 0, 255);
   *
   *   // Style the circle.
   *   fill(c);
   *
   *   // Draw the circle.
   *   circle(50, 50, 20);
   * }
   * </code>
   * </div>
   */
  fn.map = function(n, start1, stop1, start2, stop2, withinBounds) {
    // p5._validateParameters('map', arguments);
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
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Calculate the maximum of 10, 5, and 20.
   *   let m = max(10, 5, 20);
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *
   *   // Display the max.
   *   text(m, 50, 50);
   *
   *   describe('The number 20 written in the middle of a gray square.');
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
   *   // Create an array of numbers.
   *   let numbers = [10, 5, 20];
   *
   *   // Calculate the maximum of the array.
   *   let m = max(numbers);
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *
   *   // Display the max.
   *   text(m, 50, 50);
   *
   *   describe('The number 20 written in the middle of a gray square.');
   * }
   * </code>
   * </div>
   */
  /**
   * @method max
   * @param  {Number[]} nums numbers to compare.
   * @return {Number}
   */
  fn.max = function(...args) {
    const findMax = arr => {
      let max = -Infinity;
      for (let x of arr) {
        max = Math.max(max, x);
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
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Calculate the minimum of 10, 5, and 20.
   *   let m = min(10, 5, 20);
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *
   *   // Display the min.
   *   text(m, 50, 50);
   *
   *   describe('The number 5 written in the middle of a gray square.');
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
   *   // Create an array of numbers.
   *   let numbers = [10, 5, 20];
   *
   *   // Calculate the minimum of the array.
   *   let m = min(numbers);
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *
   *   // Display the min.
   *   text(m, 50, 50);
   *
   *   describe('The number 5 written in the middle of a gray square.');
   * }
   * </code>
   * </div>
   */
  /**
   * @method min
   * @param  {Number[]} nums numbers to compare.
   * @return {Number}
   */
  fn.min = function(...args) {
    const findMin = arr => {
      let min = Infinity;
      for (let x of arr) {
        min = Math.min(min, x);
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
   * is the same as calling `map(2, 0, 10, 0, 1)`.
   *
   * Numbers outside of the original range are not constrained between 0 and 1.
   * Out-of-range values are often intentional and useful.
   *
   * @method norm
   * @param  {Number} value incoming value to be normalized.
   * @param  {Number} start lower bound of the value's current range.
   * @param  {Number} stop  upper bound of the value's current range.
   * @return {Number}       normalized number.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Use RGB color with values from 0 to 1.
   *   colorMode(RGB, 1);
   *
   *   describe('A square changes color from black to red as the mouse moves from left to right.');
   * }
   *
   * function draw() {
   *   // Calculate the redValue.
   *   let redValue = norm(mouseX, 0, 100);
   *
   *   // Paint the background.
   *   background(redValue, 0, 0);
   * }
   * </code>
   * </div>
   */
  fn.norm = function(n, start, stop) {
    // p5._validateParameters('norm', arguments);
    return this.map(n, start, stop, 0, 1);
  };

  /**
   * Calculates exponential expressions such as <var>2<sup>3</sup></var>.
   *
   * For example, `pow(2, 3)` evaluates the expression
   * 2 &times; 2 &times; 2. `pow(2, -3)` evaluates 1 &#247;
   * (2 &times; 2 &times; 2).
   *
   * @method pow
   * @param  {Number} n base of the exponential expression.
   * @param  {Number} e power by which to raise the base.
   * @return {Number}   n^e.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Set the base of the exponent.
   *   let base = 3;
   *
   *   // Top-left.
   *   let d = pow(base, 1);
   *   circle(10, 10, d);
   *
   *   // Left-center.
   *   d = pow(base, 2);
   *   circle(20, 20, d);
   *
   *   // Right-center.
   *   d = pow(base, 3);
   *   circle(40, 40, d);
   *
   *   // Bottom-right.
   *   d = pow(base, 4);
   *   circle(80, 80, d);
   *
   *   describe('A series of circles that grow exponentially from top left to bottom right.');
   * }
   * </code>
   * </div>
   */
  fn.pow = Math.pow;

  /**
   * Calculates the integer closest to a number.
   *
   * For example, `round(133.8)` returns the value 134.
   *
   * The second parameter, `decimals`, is optional. It sets the number of
   * decimal places to use when rounding. For example, `round(12.34, 1)` returns
   * 12.3. `decimals` is 0 by default.
   *
   * @method round
   * @param  {Number} n number to round.
   * @param  {Number} [decimals] number of decimal places to round to, default is 0.
   * @return {Integer}  rounded number.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Round a number.
   *   let x = round(4.2);
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *
   *   // Display the rounded number.
   *   text(x, 50, 50);
   *
   *   describe('The number 4 written in middle of the canvas.');
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
   *   // Round a number to 2 decimal places.
   *   let x = round(12.782383, 2);
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *
   *   // Display the rounded number.
   *   text(x, 50, 50);
   *
   *   describe('The number 12.78 written in middle of canvas.');
   * }
   * </code>
   * </div>
   */
  fn.round = function(n, decimals) {
    if (!decimals) {
      return Math.round(n);
    }
    const multiplier = Math.pow(10, decimals);
    return Math.round(n * multiplier) / multiplier;
  };

  /**
   * Calculates the square of a number.
   *
   * Squaring a number means multiplying the number by itself. For example,
   * `sq(3)` evaluates 3 &times; 3 which is 9. `sq(-3)` evaluates -3 &times; -3
   * which is also 9. Multiplying two negative numbers produces a positive
   * number. The value returned by `sq()` is always positive.
   *
   * @method sq
   * @param  {Number} n number to square.
   * @return {Number}   squared number.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Top-left.
   *   let d = sq(3);
   *   circle(33, 33, d);
   *
   *   // Bottom-right.
   *   d = sq(6);
   *   circle(67, 67, d);
   *
   *   describe('Two white circles. The circle at the top-left is small. The circle at the bottom-right is four times larger.');
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
   *   describe('A series of black dots that get higher quickly from left to right.');
   * }
   *
   * function draw() {
   *   // Invert the y-axis.
   *   scale(1, -1);
   *   translate(0, -100);
   *
   *   // Calculate the coordinates.
   *   let x = frameCount;
   *   let y = 0.01 * sq(x);
   *
   *   // Draw the point.
   *   point(x, y);
   * }
   * </code>
   * </div>
   */
  fn.sq = n => n * n;

  /**
   * Calculates the square root of a number.
   *
   * A number's square root can be multiplied by itself to produce the original
   * number. For example, `sqrt(9)` returns 3 because 3 &times; 3 = 9. `sqrt()`
   * always returns a positive value. `sqrt()` doesn't work with negative arguments
   * such as `sqrt(-9)`.
   *
   * @method sqrt
   * @param  {Number} n non-negative number to square root.
   * @return {Number}   square root of number.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Top-left.
   *   let d = sqrt(16);
   *   circle(33, 33, d);
   *
   *   // Bottom-right.
   *   d = sqrt(1600);
   *   circle(67, 67, d);
   *
   *   describe('Two white circles. The circle at the top-left is small. The circle at the bottom-right is ten times larger.');
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
   *   describe('A series of black dots that get higher slowly from left to right.');
   * }
   *
   * function draw() {
   *   // Invert the y-axis.
   *   scale(1, -1);
   *   translate(0, -100);
   *
   *   // Calculate the coordinates.
   *   let x = frameCount;
   *   let y = 5 * sqrt(x);
   *
   *   // Draw the point.
   *   point(x, y);
   * }
   * </code>
   * </div>
   */
  fn.sqrt = Math.sqrt;

  /**
   * Calculates the fractional part of a number.
   *
   * A number's fractional part includes its decimal values. For example,
   * `fract(12.34)` returns 0.34.
   *
   * @method fract
   * @param {Number} n number whose fractional part will be found.
   * @returns {Number} fractional part of n.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Style the text.
   *   textAlign(CENTER);
   *   textSize(16);
   *
   *   // Original number.
   *   let n = 56.78;
   *   text(n, 50, 33);
   *
   *   // Fractional part.
   *   let f = fract(n);
   *   text(f, 50, 67);
   *
   *   describe('The number 56.78 written above the number 0.78.');
   * }
   * </code>
   * </div>
   */
  fn.fract = function(toConvert) {
    // p5._validateParameters('fract', arguments);
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
}

export default calculation;

if(typeof p5 !== 'undefined'){
  calculation(p5, p5.prototype);
}
