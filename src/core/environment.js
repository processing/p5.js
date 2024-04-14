/**
 * @module Environment
 * @submodule Environment
 * @for p5
 * @requires core
 * @requires constants
 */

import p5 from './main';
import * as C from './constants';

const standardCursors = [C.ARROW, C.CROSS, C.HAND, C.MOVE, C.TEXT, C.WAIT];

p5.prototype._frameRate = 0;
p5.prototype._lastFrameTime = window.performance.now();
p5.prototype._targetFrameRate = 60;

const _windowPrint = window.print;
let windowPrintDisabled = false;

/**
 * Displays text in the web browser's console.
 *
 * `print()` is helpful for printing values while debugging. Each call to
 * `print()` creates a new line of text.
 *
 * Note: Call `print('\n')` to print a blank line. Calling `print()` without
 * an argument opens the browser's dialog for printing documents.
 *
 * @method print
 * @param {Any} contents content to print to the console.
 * @example
 * <div>
 * <code class="norender">
 * function setup() {
 *   // Prints "hello, world" to the console.
 *   print('hello, world');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code class="norender">
 * function setup() {
 *   let name = 'ada';
 *   // Prints "hello, ada" to the console.
 *   print(`hello, ${name}`);
 * }
 * </code>
 * </div>
 */
p5.prototype.print = function(...args) {
  if (!args.length) {
    if (!windowPrintDisabled) {
      _windowPrint();
      if (
        window.confirm(
          'You just tried to print the webpage. Do you want to prevent this from running again?'
        )
      ) {
        windowPrintDisabled = true;
      }
    }
  } else {
    console.log(...args);
  }
};

/**
 * Tracks the number of frames drawn since the sketch started.
 *
 * `frameCount`'s value is 0 inside <a href="#/p5/setup">setup()</a>. It
 * increments by 1 each time the code in <a href="#/p5/draw">draw()</a>
 * finishes executing.
 *
 * @property {Integer} frameCount
 * @readOnly
 * @example
 * <div>
 * <code>
 * function setup() {
 *   background(200);
 *
 *   // Display the value of
 *   // frameCount.
 *   textSize(30);
 *   textAlign(CENTER, CENTER);
 *   text(frameCount, 50, 50);
 *
 *   describe('The number 0 written in black in the middle of a gray square.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   // Set the frameRate to 30.
 *   frameRate(30);
 *
 *   textSize(30);
 *   textAlign(CENTER, CENTER);
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Display the value of
 *   // frameCount.
 *   text(frameCount, 50, 50);
 *
 *   describe('A number written in black in the middle of a gray square. Its value increases rapidly.');
 * }
 * </code>
 * </div>
 */
p5.prototype.frameCount = 0;

/**
 * Tracks the amount of time, in milliseconds, it took for
 * <a href="#/p5/draw">draw</a> to draw the previous frame. `deltaTime` is
 * useful for simulating physics.
 *
 * @property {Integer} deltaTime
 * @readOnly
 * @example
 * <div>
 * <code>
 * let x = 0;
 * let speed = 0.05;
 *
 * function setup()  {
 *   // Set the frameRate to 30.
 *   frameRate(30);
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Use deltaTime to calculate
 *   // a change in position.
 *   let deltaX = speed * deltaTime;
 *
 *   // Update the x variable.
 *   x += deltaX;
 *
 *   // Reset x to 0 if it's
 *   // greater than 100.
 *   if (x > 100)  {
 *     x = 0;
 *   }
 *
 *   // Use x to set the circle's
 *   // position.
 *   circle(x, 50, 20);
 *
 *   describe('A white circle moves from left to right on a gray background. It reappears on the left side when it reaches the right side.');
 * }
 * </code>
 * </div>
 */
p5.prototype.deltaTime = 0;

/**
 * Tracks whether the browser window is focused and can receive user input.
 * `focused` is `true` if the window if focused and `false` if not.
 *
 * @property {Boolean} focused
 * @readOnly
 * @example
 * <div>
 * <code>
 * // Open this example in two separate browser
 * // windows placed side-by-side to demonstrate.
 *
 * function draw() {
 *   // Change the background color
 *   // when the browser window
 *   // goes in/out of focus.
 *   if (focused === true) {
 *     background(0, 255, 0);
 *   } else {
 *     background(255, 0, 0);
 *   }
 *
 *   describe('A square changes color from green to red when the browser window is out of focus.');
 * }
 * </code>
 * </div>
 */
p5.prototype.focused = document.hasFocus();

/**
 * Changes the cursor's appearance.
 *
 * The first parameter, `type`, sets the type of cursor to display. The
 * built-in options are `ARROW`, `CROSS`, `HAND`, `MOVE`, `TEXT`, and `WAIT`.
 * `cursor()` also recognizes standard CSS cursor properties passed as
 * strings: `'help'`, `'wait'`, `'crosshair'`, `'not-allowed'`, `'zoom-in'`,
 * and `'grab'`. If the path to an image is passed, as in
 * `cursor('assets/target.png')`, then the image will be used as the cursor.
 * Images must be in .cur, .gif, .jpg, .jpeg, or .png format.
 *
 * The parameters `x` and `y` are optional. If an image is used for the
 * cursor, `x` and `y` set the location pointed to within the image. They are
 * both 0 by default, so the cursor points to the image's top-left corner. `x`
 * and `y` must be less than the image's width and height, respectively.
 *
 * @method cursor
 * @param {(ARROW|CROSS|HAND|MOVE|TEXT|WAIT|String)} type Built-in: either ARROW, CROSS, HAND, MOVE, TEXT, or WAIT.
 *                               Native CSS properties: 'grab', 'progress', and so on.
 *                               Path to cursor image.
 * @param {Number}          [x]  horizontal active spot of the cursor.
 * @param {Number}          [y]  vertical active spot of the cursor.
 * @example
 * <div>
 * <code>
 * function draw() {
 *   background(200);
 *
 *   // Set the cursor to crosshairs: +
 *   cursor(CROSS);
 *
 *   describe('A gray square. The cursor appears as crosshairs.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function draw() {
 *   background(200);
 *
 *   // Divide the canvas into quadrants.
 *   line(50, 0, 50, 100);
 *   line(0, 50, 100, 50);
 *
 *   // Change cursor based on mouse position.
 *   if (mouseX < 50 && mouseY < 50) {
 *     cursor(CROSS);
 *   } else if (mouseX > 50 && mouseY < 50) {
 *     cursor('progress');
 *   } else if (mouseX > 50 && mouseY > 50) {
 *     cursor('https://avatars0.githubusercontent.com/u/1617169?s=16');
 *   } else {
 *     cursor('grab');
 *   }
 *
 *   describe('A gray square divided into quadrants. The cursor image changes when the mouse moves to each quadrant.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function draw() {
 *   background(200);
 *
 *   // Change the cursor's active spot
 *   // when the mouse is pressed.
 *   if (mouseIsPressed === true) {
 *     cursor('https://avatars0.githubusercontent.com/u/1617169?s=16', 8, 8);
 *   } else {
 *     cursor('https://avatars0.githubusercontent.com/u/1617169?s=16');
 *   }
 *
 *   describe('An image of three purple curves follows the mouse. The image shifts when the mouse is pressed.');
 * }
 * </code>
 * </div>
 */
p5.prototype.cursor = function(type, x, y) {
  let cursor = 'auto';
  const canvas = this._curElement.elt;
  if (standardCursors.includes(type)) {
    // Standard css cursor
    cursor = type;
  } else if (typeof type === 'string') {
    let coords = '';
    if (x && y && (typeof x === 'number' && typeof y === 'number')) {
      // Note that x and y values must be unit-less positive integers < 32
      // https://developer.mozilla.org/en-US/docs/Web/CSS/cursor
      coords = `${x} ${y}`;
    }
    if (
      type.substring(0, 7) === 'http://' ||
      type.substring(0, 8) === 'https://'
    ) {
      // Image (absolute url)
      cursor = `url(${type}) ${coords}, auto`;
    } else if (/\.(cur|jpg|jpeg|gif|png|CUR|JPG|JPEG|GIF|PNG)$/.test(type)) {
      // Image file (relative path) - Separated for performance reasons
      cursor = `url(${type}) ${coords}, auto`;
    } else {
      // Any valid string for the css cursor property
      cursor = type;
    }
  }
  canvas.style.cursor = cursor;
};

/**
 * Sets the number of frames to draw per second.
 *
 * Calling `frameRate()` with one numeric argument, as in `frameRate(30)`,
 * attempts to draw 30 frames per second (FPS). The target frame rate may not
 * be achieved depending on the sketch's processing needs. Most computers
 * default to a frame rate of 60 FPS. Frame rates of 24 FPS and above are
 * fast enough for smooth animations.
 *
 * Calling `frameRate()` without an argument returns the current frame rate.
 * The value returned is an approximation.
 *
 * @method frameRate
 * @param  {Number} fps number of frames to draw per second.
 * @chainable
 *
 * @example
 * <div>
 * <code>
 * function draw() {
 *   background(200);
 *
 *   // Set the x variable based
 *   // on the current frameCount.
 *   let x = frameCount % 100;
 *
 *   // If the mouse is pressed,
 *   // decrease the frame rate.
 *   if (mouseIsPressed === true) {
 *     frameRate(10);
 *   } else {
 *     frameRate(60);
 *   }
 *
 *   // Use x to set the circle's
 *   // position.
 *   circle(x, 50, 20);
 *
 *   describe('A white circle on a gray background. The circle moves from left to right in a loop. It slows down when the mouse is pressed.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function draw() {
 *   background(200);
 *
 *   // If the mouse is pressed, do lots
 *   // of math to slow down drawing.
 *   if (mouseIsPressed === true) {
 *     for (let i = 0; i < 1000000; i += 1) {
 *       random();
 *     }
 *   }
 *
 *   // Get the current frame rate
 *   // and display it.
 *   let fps = frameRate();
 *   text(fps, 50, 50);
 *
 *   describe('A number written in black written on a gray background. The number decreases when the mouse is pressed.');
 * }
 * </code>
 * </div>
 */
/**
 * @method frameRate
 * @return {Number}       current frame rate.
 */
p5.prototype.frameRate = function(fps) {
  p5._validateParameters('frameRate', arguments);
  if (typeof fps !== 'number' || fps < 0) {
    return this._frameRate;
  } else {
    this._setProperty('_targetFrameRate', fps);
    if (fps === 0) {
      this._setProperty('_frameRate', fps);
    }
    return this;
  }
};

/**
 * Returns the current framerate.
 *
 * @private
 * @return {Number} current frameRate
 */
p5.prototype.getFrameRate = function() {
  return this.frameRate();
};

/**
 * Specifies the number of frames to be displayed every second. For example,
 * the function call frameRate(30) will attempt to refresh 30 times a second.
 * If the processor is not fast enough to maintain the specified rate, the
 * frame rate will not be achieved. Setting the frame rate within <a href="#/p5/setup">setup()</a> is
 * recommended. The default rate is 60 frames per second.
 *
 * Calling `frameRate()` with no arguments returns the current frame rate.
 *
 * @private
 * @param {Number} [fps] number of frames to be displayed every second
 */
p5.prototype.setFrameRate = function(fps) {
  return this.frameRate(fps);
};

/**
 * Returns the target frame rate. The value is either the system frame rate or
 * the last value passed to <a href="#/p5/frameRate">frameRate()</a>.
 *
 * @method getTargetFrameRate
 * @return {Number} _targetFrameRate
 * @example
 * <div>
 * <code>
 * function draw() {
 *   background(200);
 *
 *   // Set the frame rate to 20.
 *   frameRate(20);
 *
 *   // Get the target frame rate and
 *   // display it.
 *   let fps = getTargetFrameRate();
 *   text(fps, 43, 54);
 *
 *   describe('The number 20 written in black on a gray background.');
 * }
 * </code>
 * </div>
 */
p5.prototype.getTargetFrameRate = function() {
  return this._targetFrameRate;
};

/**
 * Hides the cursor from view.
 *
 * @method noCursor
 * @example
 * <div>
 * <code>
 * function setup() {
 *   // Hide the cursor.
 *   noCursor();
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   circle(mouseX, mouseY, 10);
 *
 *   describe('A white circle on a gray background. The circle follows the mouse as it moves. The cursor is hidden.');
 * }
 * </code>
 * </div>
 */
p5.prototype.noCursor = function() {
  this._curElement.elt.style.cursor = 'none';
};

/**
 * A string variable with the WebGL version in use. Its value equals one of
 * the followin string constants:
 *
 * - `WEBGL2` whose value is `'webgl2'`,
 * - `WEBGL` whose value is `'webgl'`, or
 * - `P2D` whose value is `'p2d'`. This is the default for 2D sketches.
 *
 * See <a href="#/p5/setAttributes">setAttributes()</a> for ways to set the
 * WebGL version.
 *
 * @property {(WEBGL|WEBGL2)} webglVersion
 * @readOnly
 * @example
 * <div>
 * <code>
 * function setup() {
 *   background(200);
 *
 *   // Display the current WebGL version.
 *   text(webglVersion, 42, 54);
 *
 *   describe('The text "p2d" written in black on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let font;
 *
 * function preload() {
 *   // Load a font to use.
 *   font = loadFont('assets/inconsolata.otf');
 * }
 *
 * function setup() {
 *   // Create a canvas using WEBGL mode.
 *   createCanvas(100, 50, WEBGL);
 *   background(200);
 *
 *   // Display the current WebGL version.
 *   fill(0);
 *   textFont(font);
 *   text(webglVersion, -15, 5);
 *
 *   describe('The text "webgl2" written in black on a gray background.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let font;
 *
 * function preload() {
 *   // Load a font to use.
 *   font = loadFont('assets/inconsolata.otf');
 * }
 *
 * function setup() {
 *   // Create a canvas using WEBGL mode.
 *   createCanvas(100, 50, WEBGL);
 *
 *   // Set WebGL to version 1.
 *   setAttributes({ version: 1 });
 *
 *   background(200);
 *
 *   // Display the current WebGL version.
 *   fill(0);
 *   textFont(font);
 *   text(webglVersion, -14, 5);
 *
 *   describe('The text "webgl" written in black on a gray background.');
 * }
 * </code>
 * </div>
 */
p5.prototype.webglVersion = C.P2D;

/**
 * A numeric variable that stores the width of the screen display. Its value
 * depends on the current <a href="#/p5/pixelDensity">pixelDensity()</a>.
 * `displayWidth` is useful for running full-screen programs.
 *
 * Note: The actual screen width can be computed as
 * `displayWidth * pixelDensity()`.
 *
 * @property {Number} displayWidth
 * @readOnly
 * @example
 * <div class="norender">
 * <code>
 * function setup() {
 *   // Set the canvas' width and height
 *   // using the display's dimensions.
 *   createCanvas(displayWidth, displayHeight);
 *
 *   background(200);
 *
 *   describe('A gray canvas that is the same size as the display.');
 * }
 * </code>
 * </div>
 *
 * @alt
 * This example does not render anything.
 */
p5.prototype.displayWidth = screen.width;

/**
 * A numeric variable that stores the height of the screen display. Its value
 * depends on the current <a href="#/p5/pixelDensity">pixelDensity()</a>.
 * `displayHeight` is useful for running full-screen programs.
 *
 * Note: The actual screen height can be computed as
 * `displayHeight * pixelDensity()`.
 *
 * @property {Number} displayHeight
 * @readOnly
 * @example
 * <div class="norender">
 * <code>
 * function setup() {
 *   // Set the canvas' width and height
 *   // using the display's dimensions.
 *   createCanvas(displayWidth, displayHeight);
 *
 *   background(200);
 *
 *   describe('A gray canvas that is the same size as the display.');
 * }
 * </code>
 * </div>
 *
 * @alt
 * This example does not render anything.
 */
p5.prototype.displayHeight = screen.height;

/**
 * A numeric variable that stores the width of the browser's
 * <a href="https://developer.mozilla.org/en-US/docs/Glossary/Layout_viewport" target="_blank">layout viewport</a>.
 * This viewport is the area within the browser that's available for drawing.
 *
 * @property {Number} windowWidth
 * @readOnly
 * @example
 * <div class="norender">
 * <code>
 * function setup() {
 *   // Set the canvas' width and height
 *   // using the browser's dimensions.
 *   createCanvas(windowWidth, windowHeight);
 *
 *   background(200);
 *
 *   describe('A gray canvas that takes up the entire browser window.');
 * }
 * </code>
 * </div>
 *
 * @alt
 * This example does not render anything.
 */
p5.prototype.windowWidth = getWindowWidth();

/**
 * A numeric variable that stores the height of the browser's
 * <a href="https://developer.mozilla.org/en-US/docs/Glossary/Layout_viewport" target="_blank">layout viewport</a>.
 * This viewport is the area within the browser that's available for drawing.
 *
 * @property {Number} windowHeight
 * @readOnly
 * @example
 * <div class="norender">
 * <code>
 * function setup() {
 *   // Set the canvas' width and height
 *   // using the browser's dimensions.
 *   createCanvas(windowWidth, windowHeight);
 *
 *   background(200);
 *
 *   describe('A gray canvas that takes up the entire browser window.');
 * }
 * </code>
 * </div>
 *
 * @alt
 * This example does not render anything.
 */
p5.prototype.windowHeight = getWindowHeight();

/**
 * The code in `windowResized()` is called once each time the browser window
 * is resized. It's a good place to resize the canvas or make other
 * adjustments to accommodate the new window size.
 *
 * The `event` parameter is optional. If added to the function definition, it
 * can be used for debugging or other purposes.
 *
 * @method windowResized
 * @param {UIEvent} [event] optional resize Event.
 * @example
 * <div class="norender">
 * <code>
 * function setup() {
 *   createCanvas(windowWidth, windowHeight);
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   describe('A gray canvas that takes up the entire browser window. It changes size to match the browser window.');
 * }
 *
 * // Resize the canvas when the
 * // browser's size changes.
 * function windowResized() {
 *   resizeCanvas(windowWidth, windowHeight);
 * }
 * </code>
 * </div>
 * @alt
 * This example does not render anything.
 *
 * <div class="norender">
 * <code>
 * function setup() {
 *   createCanvas(windowWidth, windowHeight);
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   describe('A gray canvas that takes up the entire browser window. It changes size to match the browser window.');
 * }
 *
 * function windowResized(event) {
 *   // Resize the canvas when the
 *   // browser's size changes.
 *   resizeCanvas(windowWidth, windowHeight);
 *
 *   // Print the resize event to the console for debugging.
 *   print(event);
 * }
 * </code>
 * </div>
 * @alt
 * This example does not render anything.
 */
p5.prototype._onresize = function(e) {
  this._setProperty('windowWidth', getWindowWidth());
  this._setProperty('windowHeight', getWindowHeight());
  const context = this._isGlobal ? window : this;
  let executeDefault;
  if (typeof context.windowResized === 'function') {
    executeDefault = context.windowResized(e);
    if (executeDefault !== undefined && !executeDefault) {
      e.preventDefault();
    }
  }
};

function getWindowWidth() {
  return (
    window.innerWidth ||
    (document.documentElement && document.documentElement.clientWidth) ||
    (document.body && document.body.clientWidth) ||
    0
  );
}

function getWindowHeight() {
  return (
    window.innerHeight ||
    (document.documentElement && document.documentElement.clientHeight) ||
    (document.body && document.body.clientHeight) ||
    0
  );
}

/**
 * A numeric variable that stores the width of the drawing canvas. Its
 * default value is 100.
 *
 * Calling <a href="#/p5/createCanvas">createCanvas()</a> or
 * <a href="#/p5/resizeCanvas">resizeCanvas()</a> changes the value of
 * `width`. Calling <a href="#/p5/noCanvas">noCanvas()</a> sets its value to
 * 0.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   background(200);
 *
 *   // Display the canvas' width.
 *   text(width, 42, 54);
 *
 *   describe('The number 100 written in black on a gray square.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(50, 100);
 *
 *   background(200);
 *
 *   // Display the canvas' width.
 *   text(width, 21, 54);
 *
 *   describe('The number 50 written in black on a gray rectangle.');
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
 *   // Display the canvas' width.
 *   text(width, 42, 54);
 *
 *   describe('The number 100 written in black on a gray square. When the mouse is pressed, the square becomes a rectangle and the number becomes 50.');
 * }
 *
 * // If the mouse is pressed, reisze
 * // the canvas and display its new
 * // width.
 * function mousePressed() {
 *   if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
 *     resizeCanvas(50, 100);
 *     background(200);
 *     text(width, 21, 54);
 *   }
 * }
 * </code>
 * </div>
 *
 * @property {Number} width
 * @readOnly
 */
p5.prototype.width = 0;

/**
 * A numeric variable that stores the height of the drawing canvas. Its
 * default value is 100.
 *
 * Calling <a href="#/p5/createCanvas">createCanvas()</a> or
 * <a href="#/p5/resizeCanvas">resizeCanvas()</a> changes the value of
 * `height`. Calling <a href="#/p5/noCanvas">noCanvas()</a> sets its value to
 * 0.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   background(200);
 *
 *   // Display the canvas' height.
 *   text(height, 42, 54);
 *
 *   describe('The number 100 written in black on a gray square.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 50);
 *
 *   background(200);
 *
 *   // Display the canvas' height.
 *   text(height, 42, 27);
 *
 *   describe('The number 50 written in black on a gray rectangle.');
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
 *   // Display the canvas' height.
 *   text(height, 42, 54);
 *
 *   describe('The number 100 written in black on a gray square. When the mouse is pressed, the square becomes a rectangle and the number becomes 50.');
 * }
 *
 * // If the mouse is pressed, reisze
 * // the canvas and display its new
 * // height.
 * function mousePressed() {
 *   if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
 *     resizeCanvas(100, 50);
 *     background(200);
 *     text(height, 42, 27);
 *   }
 * }
 * </code>
 * </div>
 *
 * @property {Number} height
 * @readOnly
 */
p5.prototype.height = 0;

/**
 * Toggles full-screen mode or returns the current mode.
 *
 * Calling `fullscreen(true)` makes the sketch full-screen. Calling
 * `fullscreen(false)` makes the sketch its original size.
 *
 * Calling `fullscreen()` without an argument returns `true` if the sketch
 * is in full-screen mode and `false` if not.
 *
 * Note: Due to browser restrictions, `fullscreen()` can only be called with
 * user input such as a mouse press.
 *
 * @method fullscreen
 * @param  {Boolean} [val] whether the sketch should be in fullscreen mode.
 * @return {Boolean} current fullscreen state.
 * @example
 * <div>
 * <code>
 * function setup() {
 *   background(200);
 *
 *   describe('A gray canvas that switches between default and full-screen display when clicked.');
 * }
 *
 * // If the mouse is pressed,
 * // toggle full-screen mode.
 * function mousePressed() {
 *   if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
 *     let fs = fullscreen();
 *     fullscreen(!fs);
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype.fullscreen = function(val) {
  p5._validateParameters('fullscreen', arguments);
  // no arguments, return fullscreen or not
  if (typeof val === 'undefined') {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  } else {
    // otherwise set to fullscreen or not
    if (val) {
      launchFullscreen(document.documentElement);
    } else {
      exitFullscreen();
    }
  }
};

/**
 * Sets the pixel scaling for high pixel density displays.
 *
 * By default, the pixel density is set to match display density. Calling
 * `pixelDensity(1)` turn this off.
 *
 * Calling `pixelDensity()` without an argument returns the current pixel
 * density.
 *
 * @method pixelDensity
 * @param  {Number} [val] desired pixel density.
 * @chainable
 * @example
 * <div>
 * <code>
 * function setup() {
 *   // Set the pixel density to 1.
 *   pixelDensity(1);
 *
 *   // Create a canvas and draw
 *   // a circle.
 *   createCanvas(100, 100);
 *   background(200);
 *   circle(50, 50, 70);
 *
 *   describe('A fuzzy white circle on a gray canvas.');
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   // Set the pixel density to 3.
 *   pixelDensity(3);
 *
 *   // Create a canvas, paint the
 *   // background, and draw a
 *   // circle.
 *   createCanvas(100, 100);
 *   background(200);
 *   circle(50, 50, 70);
 *
 *   describe('A sharp white circle on a gray canvas.');
 * }
 * </code>
 * </div>
 */
/**
 * @method pixelDensity
 * @returns {Number} current pixel density of the sketch.
 */
p5.prototype.pixelDensity = function(val) {
  p5._validateParameters('pixelDensity', arguments);
  let returnValue;
  if (typeof val === 'number') {
    if (val !== this._pixelDensity) {
      this._pixelDensity = val;
    }
    returnValue = this;
    this.resizeCanvas(this.width, this.height, true); // as a side effect, it will clear the canvas
  } else {
    returnValue = this._pixelDensity;
  }
  return returnValue;
};

/**
 * Returns the display's current pixel density.
 *
 * @method displayDensity
 * @returns {Number} current pixel density of the display.
 * @example
 * <div>
 * <code>
 * function setup() {
 *   // Set the pixel density to 1.
 *   pixelDensity(1);
 *
 *   // Create a canvas and draw
 *   // a circle.
 *   createCanvas(100, 100);
 *   background(200);
 *   circle(50, 50, 70);
 *
 *   describe('A fuzzy white circle drawn on a gray background. The circle becomes sharper when the mouse is pressed.');
 * }
 *
 * function mousePressed() {
 *   // Get the current display density.
 *   let d = displayDensity();
 *
 *   // Use the display density to set
 *   // the sketch's pixel density.
 *   pixelDensity(d);
 *
 *   // Paint the background and
 *   // draw a circle.
 *   background(200);
 *   circle(50, 50, 70);
 * }
 * </code>
 * </div>
 */
p5.prototype.displayDensity = () => window.devicePixelRatio;

function launchFullscreen(element) {
  const enabled =
    document.fullscreenEnabled ||
    document.webkitFullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.msFullscreenEnabled;
  if (!enabled) {
    throw new Error('Fullscreen not enabled in this browser.');
  }
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

/**
 * Returns the sketch's current
 * <a href="https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL" target="_blank">URL</a>
 * as a string.
 *
 * @method getURL
 * @return {String} url
 * @example
 * <div>
 * <code>
 * function setup() {
 *   background(200);
 *
 *   // Get the sketch's URL
 *   // and display it.
 *   let url = getURL();
 *   textWrap(CHAR);
 *   text(url, 0, 40, 100);
 *
 *   describe('The URL "https://p5js.org/reference/#/p5/getURL" written in black on a gray background.');
 * }
 * </code>
 * </div>
 */
p5.prototype.getURL = () => location.href;

/**
 * Returns the current
 * <a href="https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL#path_to_resource" target="_blank">URL</a>
 * path as an array of strings.
 *
 * For example, consider a sketch hosted at the URL
 * `https://example.com/sketchbook`. Calling `getURLPath()` returns
 * `['sketchbook']`. For a sketch hosted at the URL
 * `https://example.com/sketchbook/monday`, `getURLPath()` returns
 * `['sketchbook', 'monday']`.
 *
 * @method getURLPath
 * @return {String[]} path components.
 * @example
 * <div>
 * <code>
 * function setup() {
 *   background(200);
 *
 *   // Get the sketch's URL path
 *   // and display the first
 *   // part.
 *   let path = getURLPath();
 *   text(path[0], 25, 54);
 *
 *   describe('The word "reference" written in black on a gray background.');
 * }
 * </code>
 * </div>
 */
p5.prototype.getURLPath = () =>
  location.pathname.split('/').filter(v => v !== '');

/**
 * Returns the current
 * <a href="https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL#parameters" target="_blank">URL parameters</a>
 * in an Object.
 *
 * For example, calling `getURLParams()` in a sketch hosted at the URL
 * `http://p5js.org?year=2014&month=May&day=15` returns
 * `{ year: 2014, month: 'May', day: 15 }`.
 *
 * @method getURLParams
 * @return {Object} URL params
 * @example
 * <div class='norender notest'>
 * <code>
 * // Imagine this sketch is hosted at the following URL:
 * // https://p5js.org?year=2014&month=May&day=15
 *
 * function setup() {
 *   background(200);
 *
 *   // Get the sketch's URL
 *   // parameters and display
 *   // them.
 *   let params = getURLParams();
 *   text(params.day, 10, 20);
 *   text(params.month, 10, 40);
 *   text(params.year, 10, 60);
 *
 *   describe('The text "15", "May", and "2014" written in black on separate lines.');
 * }
 * </code>
 * </div>
 *
 * @alt
 * This example does not render anything.
 */
p5.prototype.getURLParams = function() {
  const re = /[?&]([^&=]+)(?:[&=])([^&=]+)/gim;
  let m;
  const v = {};
  while ((m = re.exec(location.search)) != null) {
    if (m.index === re.lastIndex) {
      re.lastIndex++;
    }
    v[m[1]] = m[2];
  }
  return v;
};

export default p5;
