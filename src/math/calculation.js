/**
 * @module Math
 * @submodule Calculation
 * @for p5
 */

function calculation(p5, fn){
  /**
   * Calculates the absolute value of a number.
   *
   * A number's absolute value is its distance from zero on the number line.
   * -5 and 5 are both five units away from zero, so calling `abs(-5)` and
   * `abs(5)` both return 5. The absolute value of a number is always positive.
   *
   * ```js example
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
   * ```
   *
   * `abs()` can also be used in shaders with p5.strands. The following example
   * uses `abs()` to create a mirror effect on the color of a shape.
   *
   * ```js example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *   myShader = buildColorShader(shaderCallback);
   *   describe('A sphere with colors that fold back like a mirror.');
   * }
   *
   * function shaderCallback() {
   *   // shaderCallback runs on the GPU. millis() gives ms since start; multiply by 0.001 for seconds.
   *   let t = millis() * 0.001;
   *
   *   // sin(t) goes between -1 and 1 over time.
   *   let sinVal = sin(t);
   *
   *   // abs() folds the negative values to positive.
   *   // Now value goes between 0 and 1, creating a mirror effect.
   *   let value = abs(sinVal);
   *
   *   // Each color is [R, G, B, A] with values from 0 to 1.
   *   let navy = [0.2, 0.2, 0.8, 1];
   *   let coral = [0.8, 0.2, 0.2, 1];
   *
   *   finalColor.begin();
   *
   *   // mix() blends between navy (when value = 0) and coral (when value = 1).
   *   finalColor.set(mix(navy, coral, value));
   *
   *   finalColor.end();
   * }
   *
   * function draw() {
   *   background(220);
   *   shader(myShader);
   *   noStroke();
   *   sphere(30);
   * }
   * ```
   *
   * @method abs
   * @param  {Number} n number to compute.
   * @return {Number}   absolute value of given number.
   *
   */
  fn.abs = Math.abs;

  /**
   * Calculates the closest integer value that is greater than or equal to a
   * number.
   *
   * For example, calling `ceil(9.03)` and `ceil(9.97)` both return the value
   * 10.
   *
   * ```js example
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
   * ```
   *
   * `ceil()` can also be used in shaders with p5.strands. The following example
   * uses `ceil()` to create a stepped color effect on a shape.
   *
   * ```js example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *   myShader = buildColorShader(shaderCallback);
   *   describe('A sphere with stepped color bands.');
   * }
   *
   * function shaderCallback() {
   *   // shaderCallback runs on the GPU. millis() gives ms since start; multiply by 0.001 for seconds.
   *   let t = millis() * 0.001;
   *
   *   // sin(t) goes between -1 and 1.
   *   // 0.5 + 0.5 * sin(t) remaps this to the 0 to 1 range.
   *   let sinVal = 0.5 + 0.5 * sin(t);
   *
   *   // Multiply by 4 then ceil to get the next whole number up.
   *   // Divide by 4 to bring the result back to the 0 to 1 range.
   *   // This creates 4 distinct stepped color levels: 0.25, 0.5, 0.75, 1.
   *   let value = ceil(sinVal * 4) / 4;
   *
   *   // Each color is [R, G, B, A] with values from 0 to 1.
   *   let cyan = [0, 0.5, 1, 1];
   *   let orange = [1, 0.5, 0, 1];
   *
   *   finalColor.begin();
   *
   *   // mix() blends between cyan (when value = 0) and orange (when value = 1).
   *   // ceil() creates sharp steps between color levels.
   *   finalColor.set(mix(cyan, orange, value));
   *
   *   finalColor.end();
   * }
   *
   * function draw() {
   *   background(220);
   *   shader(myShader);
   *   noStroke();
   *   sphere(30);
   * }
   * ```
   *
   * @method ceil
   * @param  {Number} n number to round up.
   * @return {Integer}   rounded up number.
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
   *
   * @example
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
   * ```js example
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
   * ```
   *
   * ```js example
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
   * ```
   *
   * `exp()` can also be used in shaders with p5.strands. The following example
   * uses `exp()` to create an accelerating color transition on a shape.
   *
   * ```js example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *   myShader = buildColorShader(shaderCallback);
   *   describe('A sphere that brightens with accelerating speed.');
   * }
   *
   * function shaderCallback() {
   *   // shaderCallback runs on the GPU. millis() gives ms since start; multiply by 0.0005 to slow it.
   *   let t = millis() * 0.0005;
   *
   *   // exp(t) grows slowly at first, then accelerates (exponential growth).
   *   // Multiply by 0.01 to keep it from growing too fast.
   *   // min(..., 1) caps the value at 1 so it doesn't go past white.
   *   let value = min(exp(t) * 0.01, 1);
   *
   *   // Each color is [R, G, B, A] with values from 0 to 1.
   *   let darkBlue = [0.1, 0.1, 0.3, 1];
   *   let lightYellow = [1, 1, 0.5, 1];
   *
   *   finalColor.begin();
   *
   *   // mix() blends between darkBlue (when value = 0) and lightYellow (when value = 1).
   *   // Because exp() accelerates, the color transition gets faster over time.
   *   finalColor.set(mix(darkBlue, lightYellow, value));
   *
   *   finalColor.end();
   * }
   *
   * function draw() {
   *   background(220);
   *   shader(myShader);
   *   noStroke();
   *   sphere(30);
   * }
   * ```
   *
   * @method exp
   * @param  {Number} n exponent to raise.
   * @return {Number}   e^n
   */
  fn.exp = Math.exp;

  /**
   * Calculates the closest integer value that is less than or equal to the
   * value of a number.
   *
   * ```js example
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
   * ```
   *
   * `floor()` can also be used in shaders with p5.strands. The following example
   * uses `floor()` to create banding effects on a shape.
   *
   * ```js example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *   myShader = buildColorShader(shaderCallback);
   *   describe('A sphere with posterized color bands.');
   * }
   *
   * function shaderCallback() {
   *   // shaderCallback runs on the GPU. millis() gives ms since start; multiply by 0.001 for seconds.
   *   let t = millis() * 0.001;
   *
   *   // sin(t) goes between -1 and 1.
   *   // 0.5 + 0.5 * sin(t) remaps this to the 0 to 1 range.
   *   let sinVal = 0.5 + 0.5 * sin(t);
   *
   *   // Multiply by 4 then floor to get the next whole number down.
   *   // Divide by 4 to bring the result back to the 0 to 1 range.
   *   // This creates 5 distinct stepped color levels: 0, 0.25, 0.5, 0.75, 1.
   *   let value = floor(sinVal * 4) / 4;
   *
   *   // Each color is [R, G, B, A] with values from 0 to 1.
   *   let darkPurple = [0.2, 0, 0.8, 1];
   *   let brightTeal = [0.2, 1, 0.8, 1];
   *
   *   finalColor.begin();
   *
   *   // mix() blends between darkPurple (when value = 0) and brightTeal (when value = 1).
   *   // The floor() creates visible banding/posterization in the color.
   *   finalColor.set(mix(darkPurple, brightTeal, value));
   *
   *   finalColor.end();
   * }
   *
   * function draw() {
   *   background(220);
   *   shader(myShader);
   *   noStroke();
   *   sphere(30);
   * }
   * ```
   *
   * @method floor
   * @param  {Number} n number to round down.
   * @return {Integer}  rounded down number.
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
   * ```js example
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
   * ```
   *
   * ```js example
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
   * ```
   *
   * `lerp()` can also be used in shaders with p5.strands, where it maps to the
   * <a href="#/p5/mix">mix()</a> function in GLSL. The following example uses
   * <a href="#/p5/mix">mix()</a> to blend colors on a shape over time.
   *
   * ```js example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *   myShader = buildColorShader(shaderCallback);
   *   describe('A sphere that blends between teal and coral.');
   * }
   *
   * function shaderCallback() {
   *   // shaderCallback runs on the GPU. millis() gives ms since start; multiply by 0.001 for seconds.
   *   let t = millis() * 0.001;
   *
   *   // sin(t) goes between -1 and 1 over time.
   *   // 0.5 + 0.5 * sin(t) remaps this to the 0 to 1 range.
   *   let value = 0.5 + 0.5 * sin(t);
   *
   *   // Each color is [R, G, B, A] with values from 0 to 1.
   *   let teal = [0, 0.8, 0.8, 1];
   *   let coral = [1, 0.5, 0.3, 1];
   *
   *   finalColor.begin();
   *
   *   // In p5.strands, lerp() maps to the GLSL mix() function.
   *   // mix() blends teal (when value = 0) and coral (when value = 1).
   *   finalColor.set(mix(teal, coral, value));
   *
   *   finalColor.end();
   * }
   *
   * function draw() {
   *   background(220);
   *   shader(myShader);
   *   noStroke();
   *   sphere(30);
   * }
   * ```
   *
   * @method lerp
   * @param  {Number} start first value.
   * @param  {Number} stop  second value.
   * @param  {Number} amt   number.
   * @return {Number}       lerped value.
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
   * ```js example
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
   * ```
   *
   * ```js example
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
   * ```
   *
   * `log()` can also be used in shaders with p5.strands. The following example
   * uses `log()` to create a decelerating color transition on a shape.
   *
   * ```js example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *   myShader = buildColorShader(shaderCallback);
   *   describe('A sphere that slowly shifts from purple to yellow.');
   * }
   *
   * function shaderCallback() {
   *   // shaderCallback runs on the GPU. millis() gives ms since start; multiply by 0.001 for seconds.
   *   let t = millis() * 0.001;
   *
   *   // log(1 + t) grows quickly at first, then slows down over time.
   *   // Add 1 so we never try log(0), which is undefined.
   *   // Multiply by 0.2 to keep it in a usable range.
   *   // min(..., 1) caps the value at 1.
   *   let value = log(1 + t) * 0.2;
   *   value = min(value, 1);
   *
   *   // Each color is [R, G, B, A] with values from 0 to 1.
   *   let purple = [0.5, 0, 0.5, 1];
   *   let yellow = [1, 1, 0, 1];
   *
   *   finalColor.begin();
   *
   *   // mix() blends between purple (when value = 0) and yellow (when value = 1).
   *   // Because log() slows down over time, the color transition decelerates.
   *   finalColor.set(mix(purple, yellow, value));
   *
   *   finalColor.end();
   * }
   *
   * function draw() {
   *   background(220);
   *   shader(myShader);
   *   noStroke();
   *   sphere(30);
   * }
   * ```
   *
   * @method log
   * @param  {Number} n number greater than 0.
   * @return {Number}   natural logarithm of n.
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
   * ```js example
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
   * ```
   *
   * ```js example
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
   * ```
   *
   * `map()` can also be used in shaders with p5.strands. The following example
   * uses `map()` to remap time values to color in a shader.
   *
   * ```js example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *   myShader = buildColorShader(shaderCallback);
   *   describe('A sphere that shifts between cyan and orange over time.');
   * }
   *
   * function shaderCallback() {
   *   // shaderCallback runs on the GPU. millis() gives ms since start; multiply by 0.001 for seconds.
   *   let t = millis() * 0.001;
   *
   *   // sin(t) goes between -1 and 1 over time.
   *   let sinVal = sin(t);
   *
   *   // map() remaps this from the range [-1, 1] to the range [0, 1].
   *   let value = map(sinVal, -1, 1, 0, 1);
   *
   *   // Each color is [R, G, B, A] with values from 0 to 1.
   *   let cyan = [0, 0.5, 1, 1];
   *   let orange = [1, 0.5, 0, 1];
   *
   *   finalColor.begin();
   *
   *   // mix() blends between cyan (when value = 0) and orange (when value = 1).
   *   finalColor.set(mix(cyan, orange, value));
   *
   *   finalColor.end();
   * }
   *
   * function draw() {
   *   background(220);
   *   shader(myShader);
   *   noStroke();
   *   sphere(30);
   * }
   * ```
   *
   * @method map
   * @param  {Number} value  the value to be remapped.
   * @param  {Number} start1 lower bound of the value's current range.
   * @param  {Number} stop1  upper bound of the value's current range.
   * @param  {Number} start2 lower bound of the value's target range.
   * @param  {Number} stop2  upper bound of the value's target range.
   * @param  {Boolean} [withinBounds] constrain the value to the newly mapped range.
   * @return {Number}        remapped number.
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
   * ```js example
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
   * ```
   *
   * ```js example
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
   * ```
   *
   * `max()` can also be used in shaders with p5.strands. The following example
   * uses `max()` to clamp values in a shader.
   *
   * ```js example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *   myShader = buildColorShader(shaderCallback);
   *   describe('A sphere that shifts from rose to steelBlue and stops.');
   * }
   *
   * function shaderCallback() {
   *   // shaderCallback runs on the GPU. millis() gives ms since start; multiply by 0.001 for seconds.
   *   let t = millis() * 0.001;
   *
   *   // 1 - t * 0.2 decreases steadily over time.
   *   // max(..., 0) ensures the value never goes below 0.
   *   let value = max(1 - t * 0.2, 0);
   *
   *   // Each color is [R, G, B, A] with values from 0 to 1.
   *   let steelBlue = [0, 0.3, 0.8, 1];
   *   let rose = [1, 0.3, 0.8, 1];
   *
   *   finalColor.begin();
   *
   *   // mix() blends between steelBlue (when value = 0) and rose (when value = 1).
   *   // max() clamps the blend so the color stops changing once it reaches steelBlue.
   *   finalColor.set(mix(steelBlue, rose, value));
   *
   *   finalColor.end();
   * }
   *
   * function draw() {
   *   background(220);
   *   shader(myShader);
   *   noStroke();
   *   sphere(30);
   * }
   * ```
   *
   * @method max
   * @param  {Number} n0 first number to compare.
   * @param  {Number} n1 second number to compare.
   * @return {Number}             maximum number.
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
   * ```js example
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
   * ```
   *
   * ```js example
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
   * ```
   *
   * `min()` can also be used in shaders with p5.strands. The following example
   * uses `min()` to clamp values in a shader.
   *
   * ```js example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *   myShader = buildColorShader(shaderCallback);
   *   describe('A sphere that shifts from red to green and stops.');
   * }
   *
   * function shaderCallback() {
   *   // shaderCallback runs on the GPU. millis() gives ms since start; multiply by 0.001 for seconds.
   *   let t = millis() * 0.001;
   *
   *   // t * 0.2 grows steadily over time.
   *   // min(..., 1) caps the value at 1 so it doesn't go past the target color.
   *   let value = min(t * 0.2, 1);
   *
   *   // Each color is [R, G, B, A] with values from 0 to 1.
   *   let deepRed = [0.8, 0, 0.2, 1];
   *   let yellowGreen = [0.8, 1, 0.2, 1];
   *
   *   finalColor.begin();
   *
   *   // mix() blends between deepRed (when value = 0) and yellowGreen (when value = 1).
   *   // min() clamps the blend so the color stops changing once it reaches yellowGreen.
   *   finalColor.set(mix(deepRed, yellowGreen, value));
   *
   *   finalColor.end();
   * }
   *
   * function draw() {
   *   background(220);
   *   shader(myShader);
   *   noStroke();
   *   sphere(30);
   * }
   * ```
   *
   * @method min
   * @param  {Number} n0 first number to compare.
   * @param  {Number} n1 second number to compare.
   * @return {Number}             minimum number.
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
   * ```js example
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
   * ```
   *
   * `pow()` can also be used in shaders with p5.strands. The following example
   * uses `pow()` to create a gamma curve effect on colors in a shader.
   *
   * ```js example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *   myShader = buildColorShader(shaderCallback);
   *   describe('A sphere with colors that shift with a power curve.');
   * }
   *
   * function shaderCallback() {
   *   // shaderCallback runs on the GPU. millis() gives ms since start; multiply by 0.0005 to slow it.
   *   let t = millis() * 0.0005;
   *
   *   // pow(t, 2) squares the time value: it starts slow then accelerates.
   *   // Multiply by 0.001 so it doesn't reach 1 too quickly.
   *   // min(..., 1) caps the value at 1.
   *   let value = min(pow(t, 2) * 0.001, 1);
   *
   *   // Each color is [R, G, B, A] with values from 0 to 1.
   *   let deepBlue = [0, 0.1, 0.5, 1];
   *   let gold = [1, 0.8, 0, 1];
   *
   *   finalColor.begin();
   *
   *   // mix() blends between deepBlue (when value = 0) and gold (when value = 1).
   *   // Because pow() accelerates, the color transition gets faster over time.
   *   finalColor.set(mix(deepBlue, gold, value));
   *
   *   finalColor.end();
   * }
   *
   * function draw() {
   *   background(220);
   *   shader(myShader);
   *   noStroke();
   *   sphere(30);
   * }
   * ```
   *
   * @method pow
   * @param  {Number} n base of the exponential expression.
   * @param  {Number} e power by which to raise the base.
   * @return {Number}   n^e.
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
   * ```js example
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
   * ```
   *
   * ```js example
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
   * ```
   *
   * `round()` can also be used in shaders with p5.strands. The following example
   * uses `round()` to quantize colors in a shader.
   *
   * ```js example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *   myShader = buildColorShader(shaderCallback);
   *   describe('A sphere with posterized quantized colors.');
   * }
   *
   * function shaderCallback() {
   *   // shaderCallback runs on the GPU. millis() gives ms since start; multiply by 0.001 for seconds.
   *   let t = millis() * 0.001;
   *
   *   // sin(t) goes between -1 and 1.
   *   // 0.5 + 0.5 * sin(t) remaps this to the 0 to 1 range.
   *   let sinVal = 0.5 + 0.5 * sin(t);
   *
   *   // Multiply by 4 then round to get 5 distinct levels (0, 0.25, 0.5, 0.75, 1).
   *   // Divide by 4 to bring the result back to the 0 to 1 range.
   *   let value = round(sinVal * 4) / 4;
   *
   *   // Each color is [R, G, B, A] with values from 0 to 1.
   *   let mutedBlue = [0.3, 0.4, 0.7, 1];
   *   let rose = [0.8, 0.3, 0.4, 1];
   *
   *   finalColor.begin();
   *
   *   // mix() blends between mutedBlue (when value = 0) and rose (when value = 1).
   *   // The round() creates stepped bands of color like a posterization effect.
   *   finalColor.set(mix(mutedBlue, rose, value));
   *
   *   finalColor.end();
   * }
   *
   * function draw() {
   *   background(220);
   *   shader(myShader);
   *   noStroke();
   *   sphere(30);
   * }
   * ```
   *
   * @method round
   * @param  {Number} n number to round.
   * @param  {Number} [decimals] number of decimal places to round to, default is 0.
   * @return {Integer}  rounded number.
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
   *
   * @example
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
   * ```js example
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
   * ```
   *
   * ```js example
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
   * ```
   *
   * `sqrt()` can also be used in shaders with p5.strands. The following example
   * uses `sqrt()` to create a smooth ease-out curve on color and size.
   *
   * ```js example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *   myShader = buildColorShader(shaderCallback);
   *   describe('A sphere that grows and shifts from navy to orange with an ease-out curve.');
   * }
   *
   * function shaderCallback() {
   *   // shaderCallback runs on the GPU. millis() gives ms since start; multiply by 0.001 for seconds.
   *   let t = millis() * 0.001;
   *
   *   // sin(t) goes between -1 and 1.
   *   // 0.5 + 0.5 * sin(t) remaps this to the 0 to 1 range.
   *   let sinVal = 0.5 + 0.5 * sin(t);
   *
   *   // sqrt(sinVal) creates an ease-out curve: fast start, slow finish.
   *   // Since sinVal is in [0,1], sqrt() stays in [0,1].
   *   let value = sqrt(sinVal);
   *
   *   // Each color is [R, G, B, A] with values from 0 to 1.
   *   let navy = [0, 0.1, 0.4, 1];
   *   let brightOrange = [1, 0.6, 0, 1];
   *
   *   finalColor.begin();
   *
   *   // mix() blends between navy (when value = 0) and brightOrange (when value = 1).
   *   // The sqrt() ease-out makes the color change fast at first, then slow down.
   *   finalColor.set(mix(navy, brightOrange, value));
   *
   *   finalColor.end();
   * }
   *
   * function drawShape() {
   *   let t = millis() * 0.001;
   *   let sinVal = 0.5 + 0.5 * sin(t);
   *   let size = 10 + sqrt(sinVal) * 30;
   *   sphere(size);
   * }
   *
   * function draw() {
   *   background(220);
   *   shader(myShader);
   *   noStroke();
   *   drawShape();
   * }
   * ```
   *
   * @method sqrt
   * @param  {Number} n non-negative number to square root.
   * @return {Number}   square root of number.
   */
  fn.sqrt = Math.sqrt;

  /**
   * Calculates the fractional part of a number.
   *
   * A number's fractional part includes its decimal values. For example,
   * `fract(12.34)` returns 0.34.
   *
   * ```js example
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
   * ```
   *
   * `fract()` can also be used in shaders with p5.strands. The following example
   * uses `fract()` to create repeating patterns in a shader.
   *
   * ```js example
   * let myShader;
   *
   * function setup() {
   *   createCanvas(100, 100, WEBGL);
   *   myShader = buildColorShader(shaderCallback);
   *   describe('A sphere with a repeating gradient pattern.');
   * }
   *
   * function shaderCallback() {
   *   // shaderCallback runs on the GPU. millis() gives ms since start; multiply by 0.001 for seconds.
   *   let t = millis() * 0.001;
   *
   *   // Multiply by 0.5 to slow the animation to half speed.
   *   // fract(t * 0.5) extracts only the decimal part of the number.
   *   // This creates a smooth sawtooth wave that repeats every 2 seconds.
   *   let value = fract(t * 0.5);
   *
   *   // Each color is [R, G, B, A] with values from 0 to 1.
   *   let cyan = [0, 0.5, 1, 1];
   *   let orange = [1, 0.5, 0, 1];
   *
   *   finalColor.begin();
   *
   *   // mix() blends between cyan (when value = 0) and orange (when value = 1).
   *   // Because fract() resets to 0 each cycle, the color loops smoothly.
   *   finalColor.set(mix(cyan, orange, value));
   *
   *   finalColor.end();
   * }
   *
   * function draw() {
   *   background(220);
   *   shader(myShader);
   *   noStroke();
   *   sphere(30);
   * }
   * ```
   *
   * @method fract
   * @param {Number} n number whose fractional part will be found.
   * @returns {Number} fractional part of n.
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
