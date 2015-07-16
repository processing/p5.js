/**
 * @module Math
 * @submodule Calculation
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

/**
 * Calculates the absolute value (magnitude) of a number. Maps to Math.abs().
 * The absolute value of a number is always positive.
 *
 * @method abs
 * @param  {Number} n number to compute
 * @return {Number}   absolute value of given number
 * @example
 * <div class = "norender"><code>
 * function setup() {
 *   var x = -3;
 *   var y = abs(x);
 *
 *   print(x); // -3
 *   print(y); // 3
 * }
 * </div></code>
 */
p5.prototype.abs = Math.abs;

/**
 * Calculates the closest int value that is greater than or equal to the
 * value of the parameter. Maps to Math.ceil(). For example, ceil(9.03)
 * returns the value 10.
 *
 * @method ceil
 * @param  {Number} n number to round up
 * @return {Number}   rounded up number
 * @example
 * <div><code>
 * function draw() {
 *   background(200);
 *   // map, mouseX between 0 and 5.
 *   var ax = map(mouseX, 0, 100, 0, 5);
 *   var ay = 66;
 *
 *   //Get the ceiling of the mapped number.
 *   var bx = ceil(map(mouseX, 0, 100, 0,5));
 *   var by = 33;
 *
 *   // Multiply the mapped numbers by 20 to more easily
 *   // see the changes.
 *   stroke(0);
 *   fill(0);
 *   line(0, ay, ax * 20, ay);
 *   line(0, by, bx * 20, by);
 *
 *   // Reformat the float returned by map and draw it.
 *   noStroke();
 *   text(nfc(ax, 2,2), ax, ay - 5);
 *   text(nfc(bx,1,1), bx, by - 5);
 * }
 * </div></code>
 */
p5.prototype.ceil = Math.ceil;

/**
 * Constrains a value between a minimum and maximum value.
 *
 * @method constrain
 * @param  {Number} n    number to constrain
 * @param  {Number} low  minimum limit
 * @param  {Number} high maximum limit
 * @return {Number}      constrained number
 * @example
 * <div><code>
 * function draw() {
 *   background(200);
 *
 *   var leftWall = 25;
 *   var rightWall = 75;
 *
 *   // xm is just the mouseX, while
 *   // xc is the mouseX, but constrained
 *   // between the leftWall and rightWall!
 *   var xm = mouseX;
 *   var xc = constrain(mouseX, leftWall, rightWall);
 *
 *   // Draw the walls.
 *   stroke(150);
 *   line(leftWall, 0, leftWall, height);
 *   line(rightWall, 0, rightWall, height);
 *
 *   // Draw xm and xc as circles.
 *   noStroke();
 *   fill(150);
 *   ellipse(xm, 33, 9,9); // Not Constrained
 *   fill(0);
 *   ellipse(xc, 66, 9,9); // Constrained
 * }
 * </div></code>
 */
p5.prototype.constrain = function(n, low, high) {
  return Math.max(Math.min(n, high), low);
};

/**
 * Calculates the distance between two points.
 *
 * @method dist
 * @param  {Number} x1 x-coordinate of the first point
 * @param  {Number} y1 y-coordinate of the first point
 * @param  {Number} x2 x-coordinate of the second point
 * @param  {Number} y2 y-coordinate of the second point
 * @return {Number}    distance between the two points
 * @example
 * <div><code>
 * // Move your mouse inside the canvas to see the
 * // change in distance between two points!
 * function draw() {
 *   background(200);
 *   fill(0);
 *
 *   var x1 = 10;
 *   var y1 = 90;
 *   var x2 = mouseX;
 *   var y2 = mouseY;
 *
 *   line(x1, y1, x2, y2);
 *   ellipse(x1, y1, 7, 7);
 *   ellipse(x2, y2, 7, 7);
 *
 *   // d is the length of the line
 *   // the distance from point 1 to point 2.
 *   var d = int(dist(x1, y1, x2, y2));
 *
 *   // Let's write d along the line we are drawing!
 *   push();
 *   translate( (x1+x2)/2, (y1+y2)/2 );
 *   rotate( atan2(y2-y1,x2-x1) );
 *   text(nfc(d,1,1), 0, -5);
 *   pop();
 *   // Fancy!
 * }
 * </div></code>
 */
p5.prototype.dist = function(x1, y1, x2, y2) {
  return Math.sqrt( (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) );
};

/**
 * Returns Euler's number e (2.71828...) raised to the power of the n
 * parameter. Maps to Math.exp().
 *
 * @method exp
 * @param  {Number} n exponent to raise
 * @return {Number}   e^n
 * @example
 * <div><code>
 * function draw() {
 *   background(200);
 *
 *   // Compute the exp() function with a value between 0 and 2
 *   var xValue = map(mouseX, 0, width, 0, 2);
 *   var yValue = exp(xValue);
 *
 *   var y = map(yValue, 0, 8, height, 0);
 *
 *   var legend = "exp (" + nfc(xValue, 3) +")\n= " + nf(yValue, 1, 4);
 *   stroke(150);
 *   line(mouseX, y, mouseX, height);
 *   fill(0);
 *   text(legend, 5, 15);
 *   noStroke();
 *   ellipse (mouseX,y, 7, 7);
 *
 *   // Draw the exp(x) curve,
 *   // over the domain of x from 0 to 2
 *   noFill();
 *   stroke(0);
 *   beginShape();
 *   for (var x = 0; x < width; x++) {
 *     xValue = map(x, 0, width, 0, 2);
 *     yValue = exp(xValue);
 *     y = map(yValue, 0, 8, height, 0);
 *     vertex(x, y);
 *   }
 *
 *   endShape();
 *   line(0, 0, 0, height);
 *   line(0, height-1, width, height-1);
 * }
 * </div></code>
 */
p5.prototype.exp = Math.exp;

/**
 * Calculates the closest int value that is less than or equal to the
 * value of the parameter. Maps to Math.floor().
 *
 * @method floor
 * @param  {Number} n number to round down
 * @return {Number}   rounded down number
 * @example
 * <div><code>
 * function draw() {
 *   background(200);
 *   //map, mouseX between 0 and 5.
 *   var ax = map(mouseX, 0, 100, 0, 5);
 *   var ay = 66;
 *
 *   //Get the floor of the mapped number.
 *   var bx = floor(map(mouseX, 0, 100, 0,5));
 *   var by = 33;
 *
 *   // Multiply the mapped numbers by 20 to more easily
 *   // see the changes.
 *   stroke(0);
 *   fill(0);
 *   line(0, ay, ax * 20, ay);
 *   line(0, by, bx * 20, by);
 *
 *   // Reformat the float returned by map and draw it.
 *   noStroke();
 *   text(nfc(ax, 2,2), ax, ay - 5);
 *   text(nfc(bx,1,1), bx, by - 5);
 * }
 * </div></code>
 */
p5.prototype.floor = Math.floor;

/**
 * Calculates a number between two numbers at a specific increment. The amt
 * parameter is the amount to interpolate between the two values where 0.0
 * equal to the first point, 0.1 is very near the first point, 0.5 is
 * half-way in between, etc. The lerp function is convenient for creating
 * motion along a straight path and for drawing dotted lines.
 *
 * @method lerp
 * @param  {Number} start first value
 * @param  {Number} stop  second value
 * @param  {Number} amt   number between 0.0 and 1.0
 * @return {Number}       lerped value
 * @example
 * <div><code>
 * function setup() {
 *   background(200);
 *   var a = 20;
 *   var b = 80;
 *   var c = lerp(a,b, .2);
 *   var d = lerp(a,b, .5);
 *   var e = lerp(a,b, .8);
 *
 *   var y = 50
 *
 *   strokeWeight(5);
 *   stroke(0); // Draw the original points in black
 *   point(a, y);
 *   int(b, y);
 *
 *   stroke(100); // Draw the lerp points in gray
 *   point(c, y);
 *   point(d, y);
 *   point(e, y);
 * }
 * </div></code>
 */
p5.prototype.lerp = function(start, stop, amt) {
  return amt*(stop-start)+start;
};

/**
 * Calculates the natural logarithm (the base-e logarithm) of a number. This
 * function expects the n parameter to be a value greater than 0.0. Maps to
 * Math.log().
 *
 * @method log
 * @param  {Number} n number greater than 0
 * @return {Number}   natural logarithm of n
 * @example
 * <div><code>
 * function draw() {
 *   background(200);
 *   var maxX = 2.8;
 *   var maxY = 1.5;
 *
 *   // Compute the natural log of a value between 0 and maxX
 *   var xValue = map(mouseX, 0, width, 0, maxX);
 *   if (xValue > 0) { // Cannot take the log of a negative number.
 *     var yValue = log(xValue);
 *     var y = map(yValue, -maxY, maxY, height, 0);
 *
 *     // Display the calculation occurring.
 *     var legend = "log(" + nf(xValue, 1, 2) + ")\n= " + nf(yValue, 1, 3);
 *     stroke(150);
 *     line(mouseX, y, mouseX, height);
 *     fill(0);
 *     text (legend, 5, 15);
 *     noStroke();
 *     ellipse (mouseX, y, 7, 7);
 *   }
 *
 *   // Draw the log(x) curve,
 *   // over the domain of x from 0 to maxX
 *   noFill();
 *   stroke(0);
 *   beginShape();
 *   for(var x=0; x<width; x++) {
 *     xValue = map(x, 0, width, 0, maxX);
 *     yValue = log(xValue);
 *     y = map(yValue, -maxY, maxY, height, 0);
 *     vertex(x, y);
 *   }
 *   endShape();
 *   line(0,0,0,height);
 *   line(0,height/2,width, height/2);
 * }
 * </div></code>
 */
p5.prototype.log = Math.log;

/**
 * Calculates the magnitude (or length) of a vector. A vector is a direction
 * in space commonly used in computer graphics and linear algebra. Because it
 * has no "start" position, the magnitude of a vector can be thought of as
 * the distance from the coordinate 0,0 to its x,y value. Therefore, mag() is
 * a shortcut for writing dist(0, 0, x, y).
 *
 * @method mag
 * @param  {Number} a first value
 * @param  {Number} b second value
 * @return {Number}   magnitude of vector from (0,0) to (a,b)
 * @example
 * <div><code>
 * function setup() {
 *   var x1 = 20;
 *   var x2 = 80;
 *   var y1 = 30;
 *   var y2 = 70;
 *
 *   line(0, 0, x1, y1);
 *   print(mag(x1, y1));  // Prints "36.05551"
 *   line(0, 0, x2, y1);
 *   print(mag(x2, y1));  // Prints "85.44004"
 *   line(0, 0, x1, y2);
 *   print(mag(x1, y2));  // Prints "72.8011"
 *   line(0, 0, x2, y2);
 *   print(mag(x2, y2));  // Prints "106.30146"
 * }
 * </div></code>
 */
p5.prototype.mag = function(x, y) {
  return Math.sqrt(x*x+y*y);
};

/**
 * Re-maps a number from one range to another.
 * In the first example above, the number 25 is converted from a value in the
 * range of 0 to 100 into a value that ranges from the left edge of the
 * window (0) to the right edge (width).
 *
 * @method map
 * @param  {Number} value  the incoming value to be converted
 * @param  {Number} start1 lower bound of the value's current range
 * @param  {Number} stop1  upper bound of the value's current range
 * @param  {Number} start2 lower bound of the value's target range
 * @param  {Number} stop   upper bound of the value's target range
 * @return {Number}        remapped number
 * @example
 *   <div><code>
 *     createCanvas(200, 200);
 *     var value = 25;
 *     var m = map(value, 0, 100, 0, width);
 *     ellipse(m, 200, 10, 10);
 *   </code></div>
 *
 *   <div><code>
 *     function setup() {
 *       createCanvs(200, 200);
 *       noStroke();
 *     }
 *
 *     function draw() {
 *       background(204);
 *       var x1 = map(mouseX, 0, width, 50, 150);
 *       ellipse(x1, 75, 50, 50);
 *       var x2 = map(mouseX, 0, width, 0, 200);
 *       ellipse(x2, 125, 50, 50);
 *     }
 *   </div></code>
 */
p5.prototype.map = function(n, start1, stop1, start2, stop2) {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
};

/**
 * Determines the largest value in a sequence of numbers, and then returns
 * that value. max() accepts any number of Number parameters, or an Array
 * of any length.
 *
 * @method max
 * @param  {Number|Array} n0 Numbers to compare
 * @return {Number}          maximum Number
 * @example
 * <div><code>
 * function setup() {
 *   // Change the elements in the array and run the sketch
 *   // to show how max() works!
 *   numArray = new Array(2,1,5,4,8,9);
 *   fill(0);
 *   noStroke();
 *   text("Array Elements", 0, 10);
 *   // Draw all numbers in the array
 *   var spacing = 15;
 *   var elemsY = 25;
 *   for(var i = 0; i < numArray.length; i++) {
 *     text(numArray[i], i * spacing, elemsY);
 *   }
 *   maxX = 33;
 *   maxY = 80;
 *   // Draw the Maximum value in the array.
 *   textSize(32);
 *   text(max(numArray), maxX, maxY);
 * }
 * </div></code>
 */
p5.prototype.max = function() {
  if (arguments[0] instanceof Array) {
    return Math.max.apply(null,arguments[0]);
  } else {
    return Math.max.apply(null,arguments);
  }
};

/**
 * Determines the smallest value in a sequence of numbers, and then returns
 * that value. min() accepts any number of Number parameters, or an Array
 * of any length.
 *
 * @method min
 * @param  {Number|Array} n0 Numbers to compare
 * @return {Number}          minimum Number
 * @example
 * <div><code>
 * function setup() {
 *   // Change the elements in the array and run the sketch
 *   // to show how min() works!
 *   numArray = new Array(2,1,5,4,8,9);
 *   fill(0);
 *   noStroke();
 *   text("Array Elements", 0, 10);
 *   // Draw all numbers in the array
 *   var spacing = 15;
 *   var elemsY = 25;
 *   for(var i = 0; i < numArray.length; i++) {
 *     text(numArray[i], i * spacing, elemsY);
 *   }
 *   maxX = 33;
 *   maxY = 80;
 *   // Draw the Minimum value in the array.
 *   textSize(32);
 *   text(min(numArray), maxX, maxY);
 * }
 * </div></code>
 */
p5.prototype.min = function() {
  if (arguments[0] instanceof Array) {
    return Math.min.apply(null,arguments[0]);
  } else {
    return Math.min.apply(null,arguments);
  }
};

/**
 * Normalizes a number from another range into a value between 0 and 1.
 * Identical to map(value, low, high, 0, 1).
 * Numbers outside of the range are not clamped to 0 and 1, because
 * out-of-range values are often intentional and useful. (See the second
 * example above.)
 *
 * @method norm
 * @param  {Number} value incoming value to be normalized
 * @param  {Number} start lower bound of the value's current range
 * @param  {Number} stop  upper bound of the value's current range
 * @return {Number}       normalized number
 * @example
 * <div><code>
 * function draw() {
 *   background(200);
 *   currentNum = mouseX;
 *   lowerBound = 0;
 *   upperBound = width; //100;
 *   normalized = norm(currentNum, lowerBound, upperBound);
 *   lineY = 70
 *   line(0, lineY, width, lineY);
 *   //Draw an ellipse mapped to the non-normalized value.
 *   noStroke();
 *   fill(50)
 *   var s = 7; // ellipse size
 *   ellipse(currentNum, lineY, s, s);
 *
 *   // Draw the guide
 *   guideY = lineY + 15;
 *   text("0", 0, guideY);
 *   textAlign(RIGHT);
 *   text("100", width, guideY);
 *
 *   // Draw the normalized value
 *   textAlign(LEFT);
 *   fill(0);
 *   textSize(32);
 *   normalY = 40;
 *   normalX = 20;
 *   text(normalized, normalX, normalY);
 * }
 * </div></code>
 */
p5.prototype.norm = function(n, start, stop) {
  return this.map(n, start, stop, 0, 1);
};

/**
 * Facilitates exponential expressions. The pow() function is an efficient
 * way of multiplying numbers by themselves (or their reciprocals) in large
 * quantities. For example, pow(3, 5) is equivalent to the expression
 * 3*3*3*3*3 and pow(3, -5) is equivalent to 1 / 3*3*3*3*3. Maps to
 * Math.pow().
 *
 * @method pow
 * @param  {Number} n base of the exponential expression
 * @param  {Number} e power by which to raise the base
 * @return {Number}   n^e
 * @example
 * <div><code>
 * function setup() {
 *   //Exponentially increase the size of an ellipse.
 *   eSize = 3; // Original Size
 *   eLoc = 10; // Original Location
 *
 *   ellipse(eLoc, eLoc, eSize, eSize);
 *
 *   ellipse(eLoc*2, eLoc*2, pow(eSize, 2), pow(eSize, 2));
 *
 *   ellipse(eLoc*4, eLoc*4, pow(eSize, 3), pow(eSize, 3));
 *
 *   ellipse(eLoc*8, eLoc*8, pow(eSize, 4), pow(eSize, 4));
 * }
 * </div></code>
 */
p5.prototype.pow = Math.pow;

/**
 * Calculates the integer closest to the n parameter. For example,
 * round(133.8) returns the value 134. Maps to Math.round().
 *
 * @method round
 * @param  {Number} n number to round
 * @return {Number}   rounded number
 * @example
 * <div><code>
 * function draw() {
 *   background(200);
 *   //map, mouseX between 0 and 5.
 *   var ax = map(mouseX, 0, 100, 0, 5);
 *   var ay = 66;
 *
 *   // Round the mapped number.
 *   var bx = round(map(mouseX, 0, 100, 0,5));
 *   var by = 33;
 *
 *   // Multiply the mapped numbers by 20 to more easily
 *   // see the changes.
 *   stroke(0);
 *   fill(0);
 *   line(0, ay, ax * 20, ay);
 *   line(0, by, bx * 20, by);
 *
 *   // Reformat the float returned by map and draw it.
 *   noStroke();
 *   text(nfc(ax, 2,2), ax, ay - 5);
 *   text(nfc(bx,1,1), bx, by - 5);
 * }
 * </div></code>
 */
p5.prototype.round = Math.round;

/**
 * Squares a number (multiplies a number by itself). The result is always a
 * positive number, as multiplying two negative numbers always yields a
 * positive result. For example, -1 * -1 = 1.
 *
 * @method sq
 * @param  {Number} n number to square
 * @return {Number}   squared number
 * @example
 * <div><code>
 * function draw() {
 *   background(200);
 *   eSize = 7;
 *   x1 = map(mouseX, 0, width, 0, 10);
 *   y1 = 80;
 *   x2 = sq(x1);
 *   y2 = 20;
 *
 *   // Draw the non-squared.
 *   line(0, y1, width, y1);
 *   ellipse(x1, y1, eSize, eSize);
 *
 *   // Draw the squared.
 *   line(0, y2, width, y2);
 *   ellipse(x2, y2, eSize, eSize);
 *
 *   // Draw dividing line.
 *   stroke(100)
 *   line(0, height/2, width, height/2);
 *
 *   // Draw text.
 *   noStroke();
 *   fill(0);
 *   text("x = " + x1, 0, y1 + spacing);
 *   text("sqrt(x) = " + x2, 0, y2 + spacing);
 * }
 * </div></code>
 */
p5.prototype.sq = function(n) { return n*n; };

/**
 * Calculates the square root of a number. The square root of a number is
 * always positive, even though there may be a valid negative root. The
 * square root s of number a is such that s*s = a. It is the opposite of
 * squaring. Maps to Math.sqrt().
 *
 * @method sqrt
 * @param  {Number} n non-negative number to square root
 * @return {Number}   square root of number
 * @example
 * <div><code>
 * function draw() {
 *   background(200);
 *   eSize = 7;
 *   x1 = mouseX;
 *   y1 = 80;
 *   x2 = sqrt(x1);
 *   y2 = 20;
 *
 *   // Draw the non-squared.
 *   line(0, y1, width, y1);
 *   ellipse(x1, y1, eSize, eSize);
 *
 *   // Draw the squared.
 *   line(0, y2, width, y2);
 *   ellipse(x2, y2, eSize, eSize);
 *
 *   // Draw dividing line.
 *   stroke(100)
 *   line(0, height/2, width, height/2);
 *
 *   // Draw text.
 *   noStroke();
 *   fill(0);
 *   var spacing = 15;
 *   text("x = " + x1, 0, y1 + spacing);
 *   text("sqrt(x) = " + x2, 0, y2 + spacing);
 * }
 * </div></code>
 */
p5.prototype.sqrt = Math.sqrt;

module.exports = p5;
