/**
 * @module Structure
 * @submodule Structure
 * @for p5
 * @requires core
 */

function structure(p5, fn){
  /**
   * Stops the code in <a href="#/p5/draw">draw()</a> from running repeatedly.
   *
   * By default, <a href="#/p5/draw">draw()</a> tries to run 60 times per
   * second. Calling `noLoop()` stops <a href="#/p5/draw">draw()</a> from
   * repeating. The draw loop can be restarted by calling
   * <a href="#/p5/loop">loop()</a>. <a href="#/p5/draw">draw()</a> can be run
   * once by calling <a href="#/p5/redraw">redraw()</a>.
   *
   * The <a href="#/p5/isLooping">isLooping()</a> function can be used to check
   * whether a sketch is looping, as in `isLooping() === true`.
   *
   * @method noLoop
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Turn off the draw loop.
   *   noLoop();
   *
   *   describe('A white half-circle on the left edge of a gray square.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Calculate the circle's x-coordinate.
   *   let x = frameCount;
   *
   *   // Draw the circle.
   *   // Normally, the circle would move from left to right.
   *   circle(x, 50, 20);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Double-click to stop the draw loop.
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Slow the frame rate.
   *   frameRate(5);
   *
   *   describe('A white circle moves randomly on a gray background. It stops moving when the user double-clicks.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Calculate the circle's coordinates.
   *   let x = random(0, 100);
   *   let y = random(0, 100);
   *
   *   // Draw the circle.
   *   // Normally, the circle would move from left to right.
   *   circle(x, y, 20);
   * }
   *
   * // Stop the draw loop when the user double-clicks.
   * function doubleClicked() {
   *   noLoop();
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let startButton;
   * let stopButton;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create the button elements and place them
   *   // beneath the canvas.
   *   startButton = createButton('▶');
   *   startButton.position(0, 100);
   *   startButton.size(50, 20);
   *   stopButton = createButton('◾');
   *   stopButton.position(50, 100);
   *   stopButton.size(50, 20);
   *
   *   // Set functions to call when the buttons are pressed.
   *   startButton.mousePressed(loop);
   *   stopButton.mousePressed(noLoop);
   *
   *   // Slow the frame rate.
   *   frameRate(5);
   *
   *   describe(
   *     'A white circle moves randomly on a gray background. Play and stop buttons are shown beneath the canvas. The circle stops or starts moving when the user presses a button.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Calculate the circle's coordinates.
   *   let x = random(0, 100);
   *   let y = random(0, 100);
   *
   *   // Draw the circle.
   *   // Normally, the circle would move from left to right.
   *   circle(x, y, 20);
   * }
   * </code>
   * </div>
   */
  fn.noLoop = function() {
    this._loop = false;
  };

  /**
   * Resumes the draw loop after <a href="#/p5/noLoop">noLoop()</a> has been
   * called.
   *
   * By default, <a href="#/p5/draw">draw()</a> tries to run 60 times per
   * second. Calling <a href="#/p5/noLoop">noLoop()</a> stops
   * <a href="#/p5/draw">draw()</a> from repeating. The draw loop can be
   * restarted by calling `loop()`.
   *
   * The <a href="#/p5/isLooping">isLooping()</a> function can be used to check
   * whether a sketch is looping, as in `isLooping() === true`.
   *
   * @method loop
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Turn off the draw loop.
   *   noLoop();
   *
   *   describe(
   *     'A white half-circle on the left edge of a gray square. The circle starts moving to the right when the user double-clicks.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Calculate the circle's x-coordinate.
   *   let x = frameCount;
   *
   *   // Draw the circle.
   *   circle(x, 50, 20);
   * }
   *
   * // Resume the draw loop when the user double-clicks.
   * function doubleClicked() {
   *   loop();
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let startButton;
   * let stopButton;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create the button elements and place them
   *   // beneath the canvas.
   *   startButton = createButton('▶');
   *   startButton.position(0, 100);
   *   startButton.size(50, 20);
   *   stopButton = createButton('◾');
   *   stopButton.position(50, 100);
   *   stopButton.size(50, 20);
   *
   *   // Set functions to call when the buttons are pressed.
   *   startButton.mousePressed(loop);
   *   stopButton.mousePressed(noLoop);
   *
   *   // Slow the frame rate.
   *   frameRate(5);
   *
   *   describe(
   *     'A white circle moves randomly on a gray background. Play and stop buttons are shown beneath the canvas. The circle stops or starts moving when the user presses a button.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Calculate the circle's coordinates.
   *   let x = random(0, 100);
   *   let y = random(0, 100);
   *
   *   // Draw the circle.
   *   // Normally, the circle would move from left to right.
   *   circle(x, y, 20);
   * }
   * </code>
   * </div>
   */
  fn.loop = function() {
    if (!this._loop) {
      this._loop = true;
      if (this._setupDone) {
        this._draw();
      }
    }
  };

  /**
   * Returns `true` if the draw loop is running and `false` if not.
   *
   * By default, <a href="#/p5/draw">draw()</a> tries to run 60 times per
   * second. Calling <a href="#/p5/noLoop">noLoop()</a> stops
   * <a href="#/p5/draw">draw()</a> from repeating. The draw loop can be
   * restarted by calling <a href="#/p5/loop">loop()</a>.
   *
   * The `isLooping()` function can be used to check whether a sketch is
   * looping, as in `isLooping() === true`.
   *
   * @method isLooping
   * @returns {boolean}
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe('A white circle drawn against a gray background. When the user double-clicks, the circle stops or resumes following the mouse.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Draw the circle at the mouse's position.
   *   circle(mouseX, mouseY, 20);
   * }
   *
   * // Toggle the draw loop when the user double-clicks.
   * function doubleClicked() {
   *   if (isLooping() === true) {
   *     noLoop();
   *   } else {
   *     loop();
   *   }
   * }
   * </code>
   * </div>
   */
  fn.isLooping = function() {
    return this._loop;
  };

  /**
   * Runs the code in <a href="#/p5/draw">draw()</a> once.
   *
   * By default, <a href="#/p5/draw">draw()</a> tries to run 60 times per
   * second. Calling <a href="#/p5/noLoop">noLoop()</a> stops
   * <a href="#/p5/draw">draw()</a> from repeating. Calling `redraw()` will
   * execute the code in the <a href="#/p5/draw">draw()</a> function a set
   * number of times.
   *
   * The parameter, `n`, is optional. If a number is passed, as in `redraw(5)`,
   * then the draw loop will run the given number of times. By default, `n` is
   * 1.
   *
   * @method redraw
   * @param  {Integer} [n] number of times to run <a href="#/p5/draw">draw()</a>. Defaults to 1.
   *
   * @example
   * <div>
   * <code>
   * // Double-click the canvas to move the circle.
   *
   * let x = 0;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Turn off the draw loop.
   *   noLoop();
   *
   *   describe(
   *     'A white half-circle on the left edge of a gray square. The circle moves a little to the right when the user double-clicks.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Draw the circle.
   *   circle(x, 50, 20);
   *
   *   // Increment x.
   *   x += 5;
   * }
   *
   * // Run the draw loop when the user double-clicks.
   * function doubleClicked() {
   *   redraw();
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Double-click the canvas to move the circle.
   *
   * let x = 0;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Turn off the draw loop.
   *   noLoop();
   *
   *   describe(
   *     'A white half-circle on the left edge of a gray square. The circle hops to the right when the user double-clicks.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Draw the circle.
   *   circle(x, 50, 20);
   *
   *   // Increment x.
   *   x += 5;
   * }
   *
   * // Run the draw loop three times when the user double-clicks.
   * function doubleClicked() {
   *   redraw(3);
   * }
   * </code>
   * </div>
   */
  fn.redraw = async function(n) {
    if (this._inUserDraw || !this._setupDone) {
      return;
    }

    let numberOfRedraws = parseInt(n);
    if (isNaN(numberOfRedraws) || numberOfRedraws < 1) {
      numberOfRedraws = 1;
    }

    const context = this._isGlobal ? window : this;
    if (typeof context.draw === 'function') {
      if (typeof context.setup === 'undefined') {
        context.scale(context._pixelDensity, context._pixelDensity);
      }
      for (let idxRedraw = 0; idxRedraw < numberOfRedraws; idxRedraw++) {
        context.resetMatrix();
        if (this._accessibleOutputs.grid || this._accessibleOutputs.text) {
          this._updateAccsOutput();
        }
        if (this._renderer.isP3D) {
          this._renderer._update();
        }
        this.frameCount = context.frameCount + 1;
        await this._runLifecycleHook('predraw');
        this._inUserDraw = true;
        try {
          await context.draw();
        } finally {
          this._inUserDraw = false;
        }
        await this._runLifecycleHook('postdraw');
      }
    }
  };

  /**
   * Creates a new sketch in "instance" mode.
   *
   * All p5.js sketches are instances of the `p5` class. Put another way, all
   * p5.js sketches are objects with methods including `pInst.setup()`,
   * `pInst.draw()`, `pInst.circle()`, and `pInst.fill()`. By default, sketches
   * run in "global mode" to hide some of this complexity.
   *
   * In global mode, a default instance of the `p5` class is created
   * automatically. The default `p5` instance searches the web page's source
   * code for declarations of system functions such as `setup()`, `draw()`,
   * and `mousePressed()`, then attaches those functions to itself as methods.
   * Calling a function such as `circle()` in global mode actually calls the
   * default `p5` object's `pInst.circle()` method.
   *
   * It's often helpful to isolate the code within sketches from the rest of the
   * code on a web page. Two common use cases are web pages that use other
   * JavaScript libraries and web pages with multiple sketches. "Instance mode"
   * makes it easy to support both of these scenarios.
   *
   * Instance mode sketches support the same API as global mode sketches. They
   * use a function to bundle, or encapsulate, an entire sketch. The function
   * containing the sketch is then passed to the `p5()` constructor.
   *
   * The first parameter, `sketch`, is a function that contains the sketch. For
   * example, the statement `new p5(mySketch)` would create a new instance mode
   * sketch from a function named `mySketch`. The function should have one
   * parameter, `p`, that's a `p5` object.
   *
   * The second parameter, `node`, is optional. If a string is passed, as in
   * `new p5(mySketch, 'sketch-one')` the new instance mode sketch will become a
   * child of the HTML element with the id `sketch-one`. If an HTML element is
   * passed, as in `new p5(mySketch, myElement)`, then the new instance mode
   * sketch will become a child of the `Element` object called `myElement`.
   *
   * @method p5
   * @param {Object} sketch function containing the sketch.
   * @param {String|HTMLElement} node ID or reference to the HTML element that will contain the sketch.
   *
   * @example
   * <div class='norender notest'>
   * <code>
   * // Declare the function containing the sketch.
   * function sketch(p) {
   *
   *   // Declare the setup() method.
   *   p.setup = function () {
   *     p.createCanvas(100, 100);
   *
   *     p.describe('A white circle drawn on a gray background.');
   *   };
   *
   *   // Declare the draw() method.
   *   p.draw = function () {
   *     p.background(200);
   *
   *     // Draw the circle.
   *     p.circle(50, 50, 20);
   *   };
   * }
   *
   * // Initialize the sketch.
   * new p5(sketch);
   * </code>
   * </div>
   *
   * <div class='norender notest'>
   * <code>
   * // Declare the function containing the sketch.
   * function sketch(p) {
   *   // Create the sketch's variables within its scope.
   *   let x = 50;
   *   let y = 50;
   *
   *   // Declare the setup() method.
   *   p.setup = function () {
   *     p.createCanvas(100, 100);
   *
   *     p.describe('A white circle moves randomly on a gray background.');
   *   };
   *
   *   // Declare the draw() method.
   *   p.draw = function () {
   *     p.background(200);
   *
   *     // Update x and y.
   *     x += p.random(-1, 1);
   *     y += p.random(-1, 1);
   *
   *     // Draw the circle.
   *     p.circle(x, y, 20);
   *   };
   * }
   *
   * // Initialize the sketch.
   * new p5(sketch);
   * </code>
   * </div>
   *
   * <div class='norender notest'>
   * <code>
   * // Declare the function containing the sketch.
   * function sketch(p) {
   *
   *   // Declare the setup() method.
   *   p.setup = function () {
   *     p.createCanvas(100, 100);
   *
   *     p.describe('A white circle drawn on a gray background.');
   *   };
   *
   *   // Declare the draw() method.
   *   p.draw = function () {
   *     p.background(200);
   *
   *     // Draw the circle.
   *     p.circle(50, 50, 20);
   *   };
   * }
   *
   * // Select the web page's body element.
   * let body = document.querySelector('body');
   *
   * // Initialize the sketch and attach it to the web page's body.
   * new p5(sketch, body);
   * </code>
   * </div>
   *
   * <div class='norender notest'>
   * <code>
   * // Declare the function containing the sketch.
   * function sketch(p) {
   *
   *   // Declare the setup() method.
   *   p.setup = function () {
   *     p.createCanvas(100, 100);
   *
   *     p.describe(
   *       'A white circle drawn on a gray background. The circle follows the mouse as the user moves.'
   *     );
   *   };
   *
   *   // Declare the draw() method.
   *   p.draw = function () {
   *     p.background(200);
   *
   *     // Draw the circle.
   *     p.circle(p.mouseX, p.mouseY, 20);
   *   };
   * }
   *
   * // Initialize the sketch.
   * new p5(sketch);
   * </code>
   * </div>
   *
   * <div class='norender notest'>
   * <code>
   * // Declare the function containing the sketch.
   * function sketch(p) {
   *
   *   // Declare the setup() method.
   *   p.setup = function () {
   *     p.createCanvas(100, 100);
   *
   *     p.describe(
   *       'A white circle drawn on a gray background. The circle follows the mouse as the user moves. The circle becomes black when the user double-clicks.'
   *     );
   *   };
   *
   *   // Declare the draw() method.
   *   p.draw = function () {
   *     p.background(200);
   *
   *     // Draw the circle.
   *     p.circle(p.mouseX, p.mouseY, 20);
   *   };
   *
   *   // Declare the doubleClicked() method.
   *   p.doubleClicked = function () {
   *     // Change the fill color when the user double-clicks.
   *     p.fill(0);
   *   };
   * }
   *
   * // Initialize the sketch.
   * new p5(sketch);
   * </code>
   * </div>
   */
}

export default structure;

if(typeof p5 !== 'undefined'){
  structure(p5, p5.prototype);
}