/**
 * @module Events
 * @submodule Mouse
 * @for p5
 * @requires core
 * @requires constants
 */

import p5 from '../core/main';
import * as constants from '../core/constants';

/**
 * A `Number` system variable that tracks the mouse's horizontal movement.
 *
 * `movedX` tracks how many pixels the mouse moves left or right between
 * frames. `movedX` will have a negative value if the mouse moves left between
 * frames and a positive value if it moves right. `movedX` can be calculated
 * as `mouseX - pmouseX`.
 *
 * Note: `movedX` continues updating even when
 * <a href="#/p5/requestPointerLock">requestPointerLock()</a> is active.
 *
 * @property {Number} movedX
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A gray square. The text ">>" appears when the user moves the mouse to the right. The text "<<" appears when the user moves the mouse to the left.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(CENTER);
 *   textSize(16);
 *
 *   // Display >> when movedX is positive and
 *   // << when it's negative.
 *   if (movedX > 0) {
 *     text('>>', 50, 50);
 *   } else if (movedX < 0) {
 *     text('<<', 50, 50);
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype.movedX = 0;

/**
 * A `Number` system variable that tracks the mouse's vertical movement.
 *
 * `movedY` tracks how many pixels the mouse moves up or down between
 * frames. `movedY` will have a negative value if the mouse moves up between
 * frames and a positive value if it moves down. `movedY` can be calculated
 * as `mouseY - pmouseY`.
 *
 * Note: `movedY` continues updating even when
 * <a href="#/p5/requestPointerLock">requestPointerLock()</a> is active.
 *
 * @property {Number} movedY
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A gray square. The text "▲" appears when the user moves the mouse upward. The text "▼" appears when the user moves the mouse downward.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(CENTER);
 *   textSize(16);
 *
 *   // Display ▼ when movedY is positive and
 *   // ▲ when it's negative.
 *   if (movedY > 0) {
 *     text('▼', 50, 50);
 *   } else if (movedY < 0) {
 *     text('▲', 50, 50);
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype.movedY = 0;
/*
 * This is a flag which is false until the first time
 * we receive a mouse event. The pmouseX and pmouseY
 * values will match the mouseX and mouseY values until
 * this interaction takes place.
 */
p5.prototype._hasMouseInteracted = false;

/**
 * A `Number` system variable that tracks the mouse's horizontal position.
 *
 * In 2D mode, `mouseX` keeps track of the mouse's position relative to the
 * top-left corner of the canvas. For example, if the mouse is 50 pixels from
 * the left edge of the canvas, then `mouseX` will be 50.
 *
 * In WebGL mode, `mouseX` keeps track of the mouse's position relative to the
 * center of the canvas. For example, if the mouse is 50 pixels to the right
 * of the canvas' center, then `mouseX` will be 50.
 *
 * If touch is used instead of the mouse, then `mouseX` will hold the
 * x-coordinate of the most recent touch point.
 *
 * @property {Number} mouseX
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe("A vertical black line moves left and right following the mouse's x-position.");
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Draw a vertical line that follows the mouse's x-coordinate.
 *   line(mouseX, 0, mouseX, 100);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe("A gray square. The mouse's x- and y-coordinates are displayed as the user moves the mouse.");
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(CENTER);
 *   textSize(16);
 *
 *   // Display the mouse's coordinates.
 *   text(`x: ${mouseX} y: ${mouseY}`, 50, 50);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe("A vertical black line moves left and right following the mouse's x-position.");
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Adjust coordinates for WebGL mode.
 *   // The origin (0, 0) is at the center of the canvas.
 *   let mx = mouseX - 50;
 *
 *   // Draw the line.
 *   line(mx, -50, mx, 50);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let font;
 *
 * // Load a font for WebGL mode.
 * function preload() {
 *   font = loadFont('assets/inconsolata.otf');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe(
 *     "A gray square. The mouse's x- and y-coordinates are displayed as the user moves the mouse."
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(CENTER);
 *   textSize(16);
 *   textFont(font);
 *   fill(0);
 *
 *   // Display the mouse's coordinates.
 *   text(`x: ${mouseX} y: ${mouseY}`, 0, 0);
 * }
 * </code>
 * </div>
 */
p5.prototype.mouseX = 0;

/**
 * A `Number` system variable that tracks the mouse's vertical position.
 *
 * In 2D mode, `mouseY` keeps track of the mouse's position relative to the
 * top-left corner of the canvas. For example, if the mouse is 50 pixels from
 * the top edge of the canvas, then `mouseY` will be 50.
 *
 * In WebGL mode, `mouseY` keeps track of the mouse's position relative to the
 * center of the canvas. For example, if the mouse is 50 pixels below the
 * canvas' center, then `mouseY` will be 50.
 *
 * If touch is used instead of the mouse, then `mouseY` will hold the
 * y-coordinate of the most recent touch point.
 *
 * @property {Number} mouseY
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe("A horizontal black line moves up and down following the mouse's y-position.");
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Draw a horizontal line that follows the mouse's y-coordinate.
 *   line(0, mouseY, 100, mouseY);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe("A gray square. The mouse's x- and y-coordinates are displayed as the user moves the mouse.");
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(CENTER);
 *   textSize(16);
 *
 *   // Display the mouse's coordinates.
 *   text(`x: ${mouseX} y: ${mouseY}`, 50, 50);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe("A horizontal black line moves up and down following the mouse's y-position.");
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Adjust coordinates for WebGL mode.
 *   // The origin (0, 0) is at the center of the canvas.
 *   let my = mouseY - 50;
 *
 *   // Draw the line.
 *   line(-50, my, 50, my);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let font;
 *
 * // Load a font for WebGL mode.
 * function preload() {
 *   font = loadFont('assets/inconsolata.otf');
 * }
 *
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe(
 *     "A gray square. The mouse's x- and y-coordinates are displayed as the user moves the mouse."
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(CENTER);
 *   textSize(16);
 *   textFont(font);
 *   fill(0);
 *
 *   // Display the mouse's coordinates.
 *   text(`x: ${mouseX} y: ${mouseY}`, 0, 0);
 * }
 * </code>
 * </div>
 */
p5.prototype.mouseY = 0;

/**
 * A `Number` system variable that tracks the mouse's previous horizontal
 * position.
 *
 * In 2D mode, `pmouseX` keeps track of the mouse's position relative to the
 * top-left corner of the canvas. Its value is
 * <a href="#/p5/mouseX">mouseX</a> from the previous frame. For example, if
 * the mouse was 50 pixels from the left edge of the canvas during the last
 * frame, then `pmouseX` will be 50.
 *
 * In WebGL mode, `pmouseX` keeps track of the mouse's position relative to the
 * center of the canvas. For example, if the mouse was 50 pixels to the right
 * of the canvas' center during the last frame, then `pmouseX` will be 50.
 *
 * If touch is used instead of the mouse, then `pmouseX` will hold the
 * x-coordinate of the last touch point.
 *
 * Note: `pmouseX` is reset to the current <a href="#/p5/mouseX">mouseX</a>
 * value at the start of each touch event.
 *
 * @property {Number} pmouseX
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Slow the frame rate.
 *   frameRate(10);
 *
 *   describe('A line follows the mouse as it moves. The line grows longer with faster movements.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   line(pmouseX, pmouseY, mouseX, mouseY);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe('A line follows the mouse as it moves. The line grows longer with faster movements.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Adjust coordinates for WebGL mode.
 *   // The origin (0, 0) is at the center of the canvas.
 *   let pmx = pmouseX - 50;
 *   let pmy = pmouseY - 50;
 *   let mx = mouseX - 50;
 *   let my = mouseY - 50;
 *
 *   // Draw the line.
 *   line(pmx, pmy, mx, my);
 * }
 * </code>
 * </div>
 */
p5.prototype.pmouseX = 0;

/**
 * A `Number` system variable that tracks the mouse's previous vertical
 * position.
 *
 * In 2D mode, `pmouseY` keeps track of the mouse's position relative to the
 * top-left corner of the canvas. Its value is
 * <a href="#/p5/mouseY">mouseY</a> from the previous frame. For example, if
 * the mouse was 50 pixels from the top edge of the canvas during the last
 * frame, then `pmouseY` will be 50.
 *
 * In WebGL mode, `pmouseY` keeps track of the mouse's position relative to the
 * center of the canvas. For example, if the mouse was 50 pixels below the
 * canvas' center during the last frame, then `pmouseY` will be 50.
 *
 * If touch is used instead of the mouse, then `pmouseY` will hold the
 * y-coordinate of the last touch point.
 *
 * Note: `pmouseY` is reset to the current <a href="#/p5/mouseY">mouseY</a>
 * value at the start of each touch event.
 *
 * @property {Number} pmouseY
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Slow the frame rate.
 *   frameRate(10);
 *
 *   describe('A line follows the mouse as it moves. The line grows longer with faster movements.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   line(pmouseX, pmouseY, mouseX, mouseY);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100, WEBGL);
 *
 *   describe('A line follows the mouse as it moves. The line grows longer with faster movements.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Adjust coordinates for WebGL mode.
 *   // The origin (0, 0) is at the center of the canvas.
 *   let pmx = pmouseX - 50;
 *   let pmy = pmouseY - 50;
 *   let mx = mouseX - 50;
 *   let my = mouseY - 50;
 *
 *   // Draw the line.
 *   line(pmx, pmy, mx, my);
 * }
 * </code>
 * </div>
 */
p5.prototype.pmouseY = 0;

/**
 * A `Number` variable that tracks the mouse's horizontal position within the
 * browser.
 *
 * `winMouseX` keeps track of the mouse's position relative to the top-left
 * corner of the browser window. For example, if the mouse is 50 pixels from
 * the left edge of the browser, then `winMouseX` will be 50.
 *
 * On a touchscreen device, `winMouseX` will hold the x-coordinate of the most
 * recent touch point.
 *
 * Note: Use <a href="#/p5/mouseX">mouseX</a> to track the mouse’s
 * x-coordinate within the canvas.
 *
 * @property {Number} winMouseX
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe("A gray square. The mouse's x- and y-coordinates are displayed as the user moves the mouse.");
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(CENTER);
 *   textSize(16);
 *
 *   // Display the mouse's coordinates within the browser window.
 *   text(`x: ${winMouseX} y: ${winMouseY}`, 50, 50);
 * }
 * </code>
 * </div>
 */
p5.prototype.winMouseX = 0;

/**
 * A `Number` variable that tracks the mouse's vertical position within the
 * browser.
 *
 * `winMouseY` keeps track of the mouse's position relative to the top-left
 * corner of the browser window. For example, if the mouse is 50 pixels from
 * the top edge of the browser, then `winMouseY` will be 50.
 *
 * On a touchscreen device, `winMouseY` will hold the y-coordinate of the most
 * recent touch point.
 *
 * Note: Use <a href="#/p5/mouseY">mouseY</a> to track the mouse’s
 * y-coordinate within the canvas.
 *
 * @property {Number} winMouseY
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe("A gray square. The mouse's x- and y-coordinates are displayed as the user moves the mouse.");
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(CENTER);
 *   textSize(16);
 *
 *   // Display the mouse's coordinates within the browser window.
 *   text(`x: ${winMouseX} y: ${winMouseY}`, 50, 50);
 * }
 * </code>
 * </div>
 */
p5.prototype.winMouseY = 0;

/**
 * A `Number` variable that tracks the mouse's previous horizontal position
 * within the browser.
 *
 * `pwinMouseX` keeps track of the mouse's position relative to the top-left
 * corner of the browser window. Its value is
 * <a href="#/p5/winMouseX">winMouseX</a> from the previous frame. For
 * example, if the mouse was 50 pixels from
 * the left edge of the browser during the last frame, then `pwinMouseX` will
 * be 50.
 *
 * On a touchscreen device, `pwinMouseX` will hold the x-coordinate of the most
 * recent touch point. `pwinMouseX` is reset to the current
 * <a href="#/p5/winMouseX">winMouseX</a> value at the start of each touch
 * event.
 *
 * Note: Use <a href="#/p5/pmouseX">pmouseX</a> to track the mouse’s previous
 * x-coordinate within the canvas.
 *
 * @property {Number} pwinMouseX
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Slow the frame rate.
 *   frameRate(10);
 *
 *   describe('A gray square. A white circle at its center grows larger when the mouse moves horizontally.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Calculate the circle's diameter.
 *   let d = winMouseX - pwinMouseX;
 *
 *   // Draw the circle.
 *   circle(50, 50, d);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   // Create the canvas and set its position.
 *   let cnv = createCanvas(100, 100);
 *   cnv.position(20, 20);
 *
 *   describe('A gray square with a number at its center. The number changes as the user moves the mouse vertically.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(CENTER);
 *   textSize(16);
 *
 *   // Display pwinMouseX.
 *   text(pwinMouseX, 50, 50);
 * }
 * </code>
 * </div>
 */
p5.prototype.pwinMouseX = 0;

/**
 * A `Number` variable that tracks the mouse's previous vertical position
 * within the browser.
 *
 * `pwinMouseY` keeps track of the mouse's position relative to the top-left
 * corner of the browser window. Its value is
 * <a href="#/p5/winMouseY">winMouseY</a> from the previous frame. For
 * example, if the mouse was 50 pixels from
 * the top edge of the browser during the last frame, then `pwinMouseY` will
 * be 50.
 *
 * On a touchscreen device, `pwinMouseY` will hold the y-coordinate of the most
 * recent touch point. `pwinMouseY` is reset to the current
 * <a href="#/p5/winMouseY">winMouseY</a> value at the start of each touch
 * event.
 *
 * Note: Use <a href="#/p5/pmouseY">pmouseY</a> to track the mouse’s previous
 * y-coordinate within the canvas.
 *
 * @property {Number} pwinMouseY
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Slow the frame rate.
 *   frameRate(10);
 *
 *   describe('A gray square. A white circle at its center grows larger when the mouse moves vertically.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Calculate the circle's diameter.
 *   let d = winMouseY - pwinMouseY;
 *
 *   // Draw the circle.
 *   circle(50, 50, d);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   // Create the canvas and set its position.
 *   let cnv = createCanvas(100, 100);
 *   cnv.position(20, 20);
 *
 *   describe('A gray square with a number at its center. The number changes as the user moves the mouse vertically.');
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(CENTER);
 *   textSize(16);
 *
 *   // Display pwinMouseY.
 *   text(pwinMouseY, 50, 50);
 * }
 * </code>
 * </div>
 */
p5.prototype.pwinMouseY = 0;

/**
 * A String system variable that contains the value of the last mouse button
 * pressed.
 *
 * The `mouseButton` variable is either `LEFT`, `RIGHT`, or `CENTER`,
 * depending on which button was pressed last.
 *
 * Note: Different browsers may track `mouseButton` differently. See
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons" target="_blank">MDN</a>
 * for more information.
 *
 * @property {Constant} mouseButton
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A gray square with black text at its center. The text changes from 0 to either "left" or "right" when the user clicks a mouse button.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(CENTER);
 *   textSize(16);
 *
 *   // Display the mouse button.
 *   text(mouseButton, 50, 50);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     "A gray square. Different shapes appear at its center depending on the mouse button that's clicked."
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   if (mouseIsPressed === true) {
 *     if (mouseButton === LEFT) {
 *       circle(50, 50, 50);
 *     }
 *     if (mouseButton === RIGHT) {
 *       square(25, 25, 50);
 *     }
 *     if (mouseButton === CENTER) {
 *       triangle(23, 75, 50, 20, 78, 75);
 *     }
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype.mouseButton = 0;

/**
 * A `Boolean` system variable that's `true` if the mouse is pressed and
 * `false` if not.
 *
 * @property {Boolean} mouseIsPressed
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A gray square with the word "false" at its center. The word changes to "true" when the user presses a mouse button.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(CENTER);
 *   textSize(16);
 *
 *   // Display the mouseIsPressed variable.
 *   text(mouseIsPressed, 25, 50);
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A gray square with a white square at its center. The inner square turns black when the user presses the mouse.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Style the square.
 *   if (mouseIsPressed === true) {
 *     fill(0);
 *   } else {
 *     fill(255);
 *   }
 *
 *   // Draw the square.
 *   square(25, 25, 50);
 * }
 * </code>
 * </div>
 */
p5.prototype.mouseIsPressed = false;

p5.prototype._updateNextMouseCoords = function(e) {
  if (this._curElement !== null && (!e.touches || e.touches.length > 0)) {
    const mousePos = getMousePos(
      this._curElement.elt,
      this.width,
      this.height,
      e
    );
    this._setProperty('movedX', e.movementX);
    this._setProperty('movedY', e.movementY);
    this._setProperty('mouseX', mousePos.x);
    this._setProperty('mouseY', mousePos.y);
    this._setProperty('winMouseX', mousePos.winX);
    this._setProperty('winMouseY', mousePos.winY);
  }
  if (!this._hasMouseInteracted) {
    // For first draw, make previous and next equal
    this._updateMouseCoords();
    this._setProperty('_hasMouseInteracted', true);
  }
};

p5.prototype._updateMouseCoords = function() {
  this._setProperty('pmouseX', this.mouseX);
  this._setProperty('pmouseY', this.mouseY);
  this._setProperty('pwinMouseX', this.winMouseX);
  this._setProperty('pwinMouseY', this.winMouseY);

  this._setProperty('_pmouseWheelDeltaY', this._mouseWheelDeltaY);
};

function getMousePos(canvas, w, h, evt) {
  if (evt && !evt.clientX) {
    // use touches if touch and not mouse
    if (evt.touches) {
      evt = evt.touches[0];
    } else if (evt.changedTouches) {
      evt = evt.changedTouches[0];
    }
  }
  const rect = canvas.getBoundingClientRect();
  const sx = canvas.scrollWidth / w || 1;
  const sy = canvas.scrollHeight / h || 1;
  return {
    x: (evt.clientX - rect.left) / sx,
    y: (evt.clientY - rect.top) / sy,
    winX: evt.clientX,
    winY: evt.clientY,
    id: evt.identifier
  };
}

p5.prototype._setMouseButton = function(e) {
  if (e.button === 1) {
    this._setProperty('mouseButton', constants.CENTER);
  } else if (e.button === 2) {
    this._setProperty('mouseButton', constants.RIGHT);
  } else {
    this._setProperty('mouseButton', constants.LEFT);
  }
};

/**
 * A function that's called when the mouse moves.
 *
 * Declaring the function `mouseMoved()` sets a code block to run
 * automatically when the user moves the mouse without clicking any mouse
 * buttons:
 *
 * ```js
 * function mouseMoved() {
 *   // Code to run.
 * }
 * ```
 *
 * The mouse system variables, such as <a href="#/p5/mouseX">mouseX</a> and
 * <a href="#/p5/mouseY">mouseY</a>, will be updated with their most recent
 * value when `mouseMoved()` is called by p5.js:
 *
 * ```js
 * function mouseMoved() {
 *   if (mouseX < 50) {
 *     // Code to run if the mouse is on the left.
 *   }
 *
 *   if (mouseY > 50) {
 *     // Code to run if the mouse is near the bottom.
 *   }
 * }
 * ```
 *
 * The parameter, `event`, is optional. `mouseMoved()` is always passed a
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent" target="_blank">MouseEvent</a>
 * object with properties that describe the mouse move event:
 *
 * ```js
 * function mouseMoved(event) {
 *   // Code to run that uses the event.
 *   console.log(event);
 * }
 * ```
 *
 * Browsers may have default behaviors attached to various mouse events. For
 * example, some browsers highlight text when the user moves the mouse while
 * pressing a mouse button. To prevent any default behavior for this event,
 * add `return false;` to the end of the function.
 *
 * @method mouseMoved
 * @param  {MouseEvent} [event] optional `MouseEvent` argument.
 *
 * @example
 * <div>
 * <code>
 * let value = 0;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A gray square with a black square at its center. The inner square becomes lighter as the mouse moves.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Style the square.
 *   fill(value);
 *
 *   // Draw the square.
 *   square(25, 25, 50);
 * }
 *
 * function mouseMoved() {
 *   // Update the grayscale value.
 *   value += 5;
 *
 *   // Reset the grayscale value.
 *   if (value > 255) {
 *     value = 0;
 *   }
 *   // Uncomment to prevent any default behavior.
 *   // return false;
 * }
 * </code>
 * </div>
 */

/**
 * A function that's called when the mouse moves while a button is pressed.
 *
 * Declaring the function `mouseDragged()` sets a code block to run
 * automatically when the user clicks and drags the mouse:
 *
 * ```js
 * function mouseDragged() {
 *   // Code to run.
 * }
 * ```
 *
 * The mouse system variables, such as <a href="#/p5/mouseX">mouseX</a> and
 * <a href="#/p5/mouseY">mouseY</a>, will be updated with their most recent
 * value when `mouseDragged()` is called by p5.js:
 *
 * ```js
 * function mouseDragged() {
 *   if (mouseX < 50) {
 *     // Code to run if the mouse is on the left.
 *   }
 *
 *   if (mouseY > 50) {
 *     // Code to run if the mouse is near the bottom.
 *   }
 * }
 * ```
 *
 * The parameter, `event`, is optional. `mouseDragged()` is always passed a
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent" target="_blank">MouseEvent</a>
 * object with properties that describe the mouse drag event:
 *
 * ```js
 * function mouseDragged(event) {
 *   // Code to run that uses the event.
 *   console.log(event);
 * }
 * ```
 *
 * On touchscreen devices, `mouseDragged()` will run when a user moves a touch
 * point if <a href="#/p5/touchMoved">touchMoved()</a> isn’t declared. If
 * <a href="#/p5/touchMoved">touchMoved()</a> is declared, then
 * <a href="#/p5/touchMoved">touchMoved()</a> will run when a user moves a
 * touch point and `mouseDragged()` won’t.
 *
 * Browsers may have default behaviors attached to various mouse events. For
 * example, some browsers highlight text when the user moves the mouse while
 * pressing a mouse button. To prevent any default behavior for this event,
 * add `return false;` to the end of the function.
 *
 * @method mouseDragged
 * @param  {MouseEvent} [event] optional `MouseEvent` argument.
 *
 * @example
 * <div>
 * <code>
 * let value = 0;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A gray square with a black square at its center. The inner square becomes lighter as the user drags the mouse.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Style the square.
 *   fill(value);
 *
 *   // Draw the square.
 *   square(25, 25, 50);
 * }
 *
 * function mouseDragged() {
 *   // Update the grayscale value.
 *   value += 5;
 *
 *   // Reset the grayscale value.
 *   if (value > 255) {
 *     value = 0;
 *   }
 *   // Uncomment to prevent any default behavior.
 *   // return false;
 * }
 * </code>
 * </div>
 */
p5.prototype._onmousemove = function(e) {
  const context = this._isGlobal ? window : this;
  let executeDefault;
  this._updateNextMouseCoords(e);
  if (!this.mouseIsPressed) {
    if (typeof context.mouseMoved === 'function') {
      executeDefault = context.mouseMoved(e);
      if (executeDefault === false) {
        e.preventDefault();
      }
    }
  } else {
    if (typeof context.mouseDragged === 'function') {
      executeDefault = context.mouseDragged(e);
      if (executeDefault === false) {
        e.preventDefault();
      }
    } else if (typeof context.touchMoved === 'function') {
      executeDefault = context.touchMoved(e);
      if (executeDefault === false) {
        e.preventDefault();
      }
    }
  }
};

/**
 * A function that's called once when a mouse button is pressed.
 *
 * Declaring the function `mousePressed()` sets a code block to run
 * automatically when the user presses a mouse button:
 *
 * ```js
 * function mousePressed() {
 *   // Code to run.
 * }
 * ```
 *
 * The mouse system variables, such as <a href="#/p5/mouseX">mouseX</a> and
 * <a href="#/p5/mouseY">mouseY</a>, will be updated with their most recent
 * value when `mousePressed()` is called by p5.js:
 *
 * ```js
 * function mousePressed() {
 *   if (mouseX < 50) {
 *     // Code to run if the mouse is on the left.
 *   }
 *
 *   if (mouseY > 50) {
 *     // Code to run if the mouse is near the bottom.
 *   }
 * }
 * ```
 *
 * The parameter, `event`, is optional. `mousePressed()` is always passed a
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent" target="_blank">MouseEvent</a>
 * object with properties that describe the mouse press event:
 *
 * ```js
 * function mousePressed(event) {
 *   // Code to run that uses the event.
 *   console.log(event);
 * }
 * ```
 *
 * On touchscreen devices, `mousePressed()` will run when a user’s touch
 * begins if <a href="#/p5/touchStarted">touchStarted()</a> isn’t declared. If
 * <a href="#/p5/touchStarted">touchStarted()</a> is declared, then
 * <a href="#/p5/touchStarted">touchStarted()</a> will run when a user’s touch
 * begins and `mousePressed()` won’t.
 *
 * Browsers may have default behaviors attached to various mouse events. For
 * example, some browsers highlight text when the user moves the mouse while
 * pressing a mouse button. To prevent any default behavior for this event,
 * add `return false;` to the end of the function.
 *
 * Note: `mousePressed()`, <a href="#/p5/mouseReleased">mouseReleased()</a>,
 * and <a href="#/p5/mouseClicked">mouseClicked()</a> are all related.
 * `mousePressed()` runs as soon as the user clicks the mouse.
 * <a href="#/p5/mouseReleased">mouseReleased()</a> runs as soon as the user
 * releases the mouse click. <a href="#/p5/mouseClicked">mouseClicked()</a>
 * runs immediately after <a href="#/p5/mouseReleased">mouseReleased()</a>.
 *
 * @method mousePressed
 * @param  {MouseEvent} [event] optional `MouseEvent` argument.
 *
 * @example
 * <div>
 * <code>
 * let value = 0;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A gray square with a black square at its center. The inner square becomes lighter when the user presses a mouse button.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Style the square.
 *   fill(value);
 *
 *   // Draw the square.
 *   square(25, 25, 50);
 * }
 *
 * function mousePressed() {
 *   // Update the grayscale value.
 *   value += 5;
 *
 *   // Reset the grayscale value.
 *   if (value > 255) {
 *     value = 0;
 *   }
 *   // Uncomment to prevent any default behavior.
 *   // return false;
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Style the circle.
 *   fill('orange');
 *   stroke('royalblue');
 *   strokeWeight(10);
 *
 *   describe(
 *     'An orange circle with a thick, blue border drawn on a gray background. When the user presses and holds the mouse, the border becomes thin and pink. When the user releases the mouse, the border becomes thicker and changes color to blue.'
 *   );
 * }
 *
 * function draw() {
 *   background(220);
 *
 *   // Draw the circle.
 *   circle(50, 50, 20);
 * }
 *
 * // Set the stroke color and weight as soon as the user clicks.
 * function mousePressed() {
 *   stroke('deeppink');
 *   strokeWeight(3);
 * }
 *
 * // Set the stroke and fill colors as soon as the user releases
 * // the mouse.
 * function mouseReleased() {
 *   stroke('royalblue');
 *
 *   // This is never visible because fill() is called
 *   // in mouseClicked() which runs immediately after
 *   // mouseReleased();
 *   fill('limegreen');
 * }
 *
 * // Set the fill color and stroke weight after
 * // mousePressed() and mouseReleased() are called.
 * function mouseClicked() {
 *   fill('orange');
 *   strokeWeight(10);
 * }
 * </code>
 * </div>
 */
p5.prototype._onmousedown = function(e) {
  const context = this._isGlobal ? window : this;
  let executeDefault;
  this._setProperty('mouseIsPressed', true);
  this._setMouseButton(e);
  this._updateNextMouseCoords(e);

  // _ontouchstart triggers first and sets this.touchstart
  if (this.touchstart) {
    return;
  }

  if (typeof context.mousePressed === 'function') {
    executeDefault = context.mousePressed(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  } else if (typeof context.touchStarted === 'function') {
    executeDefault = context.touchStarted(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  }

  this.touchstart = false;
};

/**
 * A function that's called once when a mouse button is released.
 *
 * Declaring the function `mouseReleased()` sets a code block to run
 * automatically when the user releases a mouse button after having pressed
 * it:
 *
 * ```js
 * function mouseReleased() {
 *   // Code to run.
 * }
 * ```
 *
 * The mouse system variables, such as <a href="#/p5/mouseX">mouseX</a> and
 * <a href="#/p5/mouseY">mouseY</a>, will be updated with their most recent
 * value when `mouseReleased()` is called by p5.js:
 *
 * ```js
 * function mouseReleased() {
 *   if (mouseX < 50) {
 *     // Code to run if the mouse is on the left.
 *   }
 *
 *   if (mouseY > 50) {
 *     // Code to run if the mouse is near the bottom.
 *   }
 * }
 * ```
 *
 * The parameter, `event`, is optional. `mouseReleased()` is always passed a
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent" target="_blank">MouseEvent</a>
 * object with properties that describe the mouse release event:
 *
 * ```js
 * function mouseReleased(event) {
 *   // Code to run that uses the event.
 *   console.log(event);
 * }
 * ```
 *
 * On touchscreen devices, `mouseReleased()` will run when a user’s touch
 * ends if <a href="#/p5/touchEnded">touchEnded()</a> isn’t declared. If
 * <a href="#/p5/touchEnded">touchEnded()</a> is declared, then
 * <a href="#/p5/touchEnded">touchEnded()</a> will run when a user’s touch
 * ends and `mouseReleased()` won’t.
 *
 * Browsers may have default behaviors attached to various mouse events. For
 * example, some browsers highlight text when the user moves the mouse while
 * pressing a mouse button. To prevent any default behavior for this event,
 * add `return false;` to the end of the function.
 *
 * Note: <a href="#/p5/mousePressed">mousePressed()</a>, `mouseReleased()`,
 * and <a href="#/p5/mouseClicked">mouseClicked()</a> are all related.
 * <a href="#/p5/mousePressed">mousePressed()</a> runs as soon as the user
 * clicks the mouse. `mouseReleased()` runs as soon as the user releases the
 * mouse click. <a href="#/p5/mouseClicked">mouseClicked()</a> runs
 * immediately after `mouseReleased()`.
 *
 * @method mouseReleased
 * @param  {MouseEvent} [event] optional `MouseEvent` argument.
 *
 * @example
 * <div>
 * <code>
 * let value = 0;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A gray square with a black square at its center. The inner square becomes lighter when the user presses and releases a mouse button.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Style the square.
 *   fill(value);
 *
 *   // Draw the square.
 *   square(25, 25, 50);
 * }
 *
 * function mouseReleased() {
 *   // Update the grayscale value.
 *   value += 5;
 *
 *   // Reset the grayscale value.
 *   if (value > 255) {
 *     value = 0;
 *   }
 *   // Uncomment to prevent any default behavior.
 *   // return false;
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Style the circle.
 *   fill('orange');
 *   stroke('royalblue');
 *   strokeWeight(10);
 *
 *   describe(
 *     'An orange circle with a thick, blue border drawn on a gray background. When the user presses and holds the mouse, the border becomes thin and pink. When the user releases the mouse, the border becomes thicker and changes color to blue.'
 *   );
 * }
 *
 * function draw() {
 *   background(220);
 *
 *   // Draw the circle.
 *   circle(50, 50, 20);
 * }
 *
 * // Set the stroke color and weight as soon as the user clicks.
 * function mousePressed() {
 *   stroke('deeppink');
 *   strokeWeight(3);
 * }
 *
 * // Set the stroke and fill colors as soon as the user releases
 * // the mouse.
 * function mouseReleased() {
 *   stroke('royalblue');
 *
 *   // This is never visible because fill() is called
 *   // in mouseClicked() which runs immediately after
 *   // mouseReleased();
 *   fill('limegreen');
 * }
 *
 * // Set the fill color and stroke weight after
 * // mousePressed() and mouseReleased() are called.
 * function mouseClicked() {
 *   fill('orange');
 *   strokeWeight(10);
 * }
 * </code>
 * </div>
 */
p5.prototype._onmouseup = function(e) {
  const context = this._isGlobal ? window : this;
  let executeDefault;
  this._setProperty('mouseIsPressed', false);

  // _ontouchend triggers first and sets this.touchend
  if (this.touchend) {
    return;
  }

  if (typeof context.mouseReleased === 'function') {
    executeDefault = context.mouseReleased(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  } else if (typeof context.touchEnded === 'function') {
    executeDefault = context.touchEnded(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  }
  this.touchend = false;
};

p5.prototype._ondragend = p5.prototype._onmouseup;
p5.prototype._ondragover = p5.prototype._onmousemove;

/**
 * A function that's called once after a mouse button is pressed and released.
 *
 * Declaring the function `mouseClicked()` sets a code block to run
 * automatically when the user releases a mouse button after having pressed
 * it:
 *
 * ```js
 * function mouseClicked() {
 *   // Code to run.
 * }
 * ```
 *
 * The mouse system variables, such as <a href="#/p5/mouseX">mouseX</a> and
 * <a href="#/p5/mouseY">mouseY</a>, will be updated with their most recent
 * value when `mouseClicked()` is called by p5.js:
 *
 * ```js
 * function mouseClicked() {
 *   if (mouseX < 50) {
 *     // Code to run if the mouse is on the left.
 *   }
 *
 *   if (mouseY > 50) {
 *     // Code to run if the mouse is near the bottom.
 *   }
 * }
 * ```
 *
 * The parameter, `event`, is optional. `mouseClicked()` is always passed a
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent" target="_blank">MouseEvent</a>
 * object with properties that describe the mouse click event:
 *
 * ```js
 * function mouseClicked(event) {
 *   // Code to run that uses the event.
 *   console.log(event);
 * }
 * ```
 *
 * On touchscreen devices, `mouseClicked()` will run when a user’s touch
 * ends if <a href="#/p5/touchEnded">touchEnded()</a> isn’t declared. If
 * <a href="#/p5/touchEnded">touchEnded()</a> is declared, then
 * <a href="#/p5/touchEnded">touchEnded()</a> will run when a user’s touch
 * ends and `mouseClicked()` won’t.
 *
 * Browsers may have default behaviors attached to various mouse events. For
 * example, some browsers highlight text when the user moves the mouse while
 * pressing a mouse button. To prevent any default behavior for this event,
 * add `return false;` to the end of the function.
 *
 * Note: <a href="#/p5/mousePressed">mousePressed()</a>,
 * <a href="#/p5/mouseReleased">mouseReleased()</a>,
 * and `mouseClicked()` are all related.
 * <a href="#/p5/mousePressed">mousePressed()</a> runs as soon as the user
 * clicks the mouse. <a href="#/p5/mouseReleased">mouseReleased()</a> runs as
 * soon as the user releases the mouse click. `mouseClicked()` runs
 * immediately after <a href="#/p5/mouseReleased">mouseReleased()</a>.
 *
 * @method mouseClicked
 * @param  {MouseEvent} [event] optional `MouseEvent` argument.
 *
 * @example
 * <div>
 * <code>
 * let value = 0;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A gray square with a black square at its center. The inner square changes color when the user presses and releases a mouse button.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Style the square.
 *   fill(value);
 *
 *   // Draw the square.
 *   square(25, 25, 50);
 * }
 *
 * // Toggle the square's color when the user clicks.
 * function mouseClicked() {
 *   if (value === 0) {
 *     value = 255;
 *   } else {
 *     value = 0;
 *   }
 *   // Uncomment to prevent any default behavior.
 *   // return false;
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   // Style the circle.
 *   fill('orange');
 *   stroke('royalblue');
 *   strokeWeight(10);
 *
 *   describe(
 *     'An orange circle with a thick, blue border drawn on a gray background. When the user presses and holds the mouse, the border becomes thin and pink. When the user releases the mouse, the border becomes thicker and changes color to blue.'
 *   );
 * }
 *
 * function draw() {
 *   background(220);
 *
 *   // Draw the circle.
 *   circle(50, 50, 20);
 * }
 *
 * // Set the stroke color and weight as soon as the user clicks.
 * function mousePressed() {
 *   stroke('deeppink');
 *   strokeWeight(3);
 * }
 *
 * // Set the stroke and fill colors as soon as the user releases
 * // the mouse.
 * function mouseReleased() {
 *   stroke('royalblue');
 *
 *   // This is never visible because fill() is called
 *   // in mouseClicked() which runs immediately after
 *   // mouseReleased();
 *   fill('limegreen');
 * }
 *
 * // Set the fill color and stroke weight after
 * // mousePressed() and mouseReleased() are called.
 * function mouseClicked() {
 *   fill('orange');
 *   strokeWeight(10);
 * }
 * </code>
 * </div>
 */
p5.prototype._onclick = function(e) {
  const context = this._isGlobal ? window : this;
  if (typeof context.mouseClicked === 'function') {
    const executeDefault = context.mouseClicked(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  }
};

/**
 * A function that's called once when a mouse button is clicked twice quickly.
 *
 * Declaring the function `doubleClicked()` sets a code block to run
 * automatically when the user presses and releases the mouse button twice
 * quickly:
 *
 * ```js
 * function doubleClicked() {
 *   // Code to run.
 * }
 * ```
 *
 * The mouse system variables, such as <a href="#/p5/mouseX">mouseX</a> and
 * <a href="#/p5/mouseY">mouseY</a>, will be updated with their most recent
 * value when `doubleClicked()` is called by p5.js:
 *
 * ```js
 * function doubleClicked() {
 *   if (mouseX < 50) {
 *     // Code to run if the mouse is on the left.
 *   }
 *
 *   if (mouseY > 50) {
 *     // Code to run if the mouse is near the bottom.
 *   }
 * }
 * ```
 *
 * The parameter, `event`, is optional. `doubleClicked()` is always passed a
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent" target="_blank">MouseEvent</a>
 * object with properties that describe the double-click event:
 *
 * ```js
 * function doubleClicked(event) {
 *   // Code to run that uses the event.
 *   console.log(event);
 * }
 * ```
 *
 * On touchscreen devices, code placed in `doubleClicked()` will run after two
 * touches that occur within a short time.
 *
 * Browsers may have default behaviors attached to various mouse events. For
 * example, some browsers highlight text when the user moves the mouse while
 * pressing a mouse button. To prevent any default behavior for this event,
 * add `return false;` to the end of the function.
 *
 * @method doubleClicked
 * @param  {MouseEvent} [event] optional `MouseEvent` argument.
 *
 * @example
 * <div>
 * <code>
 * let value = 0;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A gray square with a black square at its center. The inner square changes color when the user double-clicks.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Style the square.
 *   fill(value);
 *
 *   // Draw the square.
 *   square(25, 25, 50);
 * }
 *
 * // Toggle the square's color when the user double-clicks.
 * function doubleClicked() {
 *   if (value === 0) {
 *     value = 255;
 *   } else {
 *     value = 0;
 *   }
 *   // Uncomment to prevent any default behavior.
 *   // return false;
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let value = 0;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A gray square with a black circle at its center. When the user double-clicks on the circle, it changes color to white.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Style the circle.
 *   fill(value);
 *
 *   // Draw the circle.
 *   circle(50, 50, 80);
 * }
 *
 * // Reassign value to 255 when the user double-clicks on the circle.
 * function doubleClicked() {
 *   if (dist(50, 50, mouseX, mouseY) < 40) {
 *     value = 255;
 *   }
 *   // Uncomment to prevent any default behavior.
 *   // return false;
 * }
 * </code>
 * </div>
 */

p5.prototype._ondblclick = function(e) {
  const context = this._isGlobal ? window : this;
  if (typeof context.doubleClicked === 'function') {
    const executeDefault = context.doubleClicked(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  }
};

/**
 * For use with WebGL orbitControl.
 * @property {Number} _mouseWheelDeltaY
 * @readOnly
 * @private
 */
p5.prototype._mouseWheelDeltaY = 0;

/**
 * For use with WebGL orbitControl.
 * @property {Number} _pmouseWheelDeltaY
 * @readOnly
 * @private
 */
p5.prototype._pmouseWheelDeltaY = 0;

/**
 * A function that's called once when the mouse wheel moves.
 *
 * Declaring the function `mouseWheel()` sets a code block to run
 * automatically when the user scrolls with the mouse wheel:
 *
 * ```js
 * function mouseWheel() {
 *   // Code to run.
 * }
 * ```
 *
 * The mouse system variables, such as <a href="#/p5/mouseX">mouseX</a> and
 * <a href="#/p5/mouseY">mouseY</a>, will be updated with their most recent
 * value when `mouseWheel()` is called by p5.js:
 *
 * ```js
 * function mouseWheel() {
 *   if (mouseX < 50) {
 *     // Code to run if the mouse is on the left.
 *   }
 *
 *   if (mouseY > 50) {
 *     // Code to run if the mouse is near the bottom.
 *   }
 * }
 * ```
 *
 * The parameter, `event`, is optional. `mouseWheel()` is always passed a
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent" target="_blank">MouseEvent</a>
 * object with properties that describe the mouse scroll event:
 *
 * ```js
 * function mouseWheel(event) {
 *   // Code to run that uses the event.
 *   console.log(event);
 * }
 * ```
 *
 * The `event` object has many properties including `delta`, a `Number`
 * containing the distance that the user scrolled. For example, `event.delta`
 * might have the value 5 when the user scrolls up. `event.delta` is positive
 * if the user scrolls up and negative if they scroll down. The signs are
 * opposite on macOS with "natural" scrolling enabled.
 *
 * Browsers may have default behaviors attached to various mouse events. For
 * example, some browsers highlight text when the user moves the mouse while
 * pressing a mouse button. To prevent any default behavior for this event,
 * add `return false;` to the end of the function.
 *
 * Note: On Safari, `mouseWheel()` may only work as expected if
 * `return false;` is added at the end of the function.
 *
 * @method mouseWheel
 * @param  {WheelEvent} [event] optional `WheelEvent` argument.
 *
 * @example
 * <div>
 * <code>
 * let circleSize = 0;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A gray square. A white circle at its center grows up when the user scrolls the mouse wheel.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Draw the circle
 *   circle(circleSize, 50, 50);
 * }
 *
 * // Increment circleSize when the user scrolls the mouse wheel.
 * function mouseWheel() {
 *   circleSize += 1;
 *   // Uncomment to prevent any default behavior.
 *   // return false;
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * let direction = '';
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A gray square. An arrow at its center points up when the user scrolls up. The arrow points down when the user scrolls down.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(CENTER);
 *   textSize(16);
 *
 *   // Draw an arrow that points where
 *   // the mouse last scrolled.
 *   text(direction, 50, 50);
 * }
 *
 * // Change direction when the user scrolls the mouse wheel.
 * function mouseWheel(event) {
 *   if (event.delta > 0) {
 *     direction = '▲';
 *   } else {
 *     direction = '▼';
 *   }
 *   // Uncomment to prevent any default behavior.
 *   // return false;
 * }
 * </code>
 * </div>
 */
p5.prototype._onwheel = function(e) {
  const context = this._isGlobal ? window : this;
  this._setProperty('_mouseWheelDeltaY', e.deltaY);
  if (typeof context.mouseWheel === 'function') {
    e.delta = e.deltaY;
    const executeDefault = context.mouseWheel(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  }
};

/**
 * Locks the mouse pointer to its current position and makes it invisible.
 *
 * `requestPointerLock()` allows the mouse to move forever without leaving the
 * screen. Calling `requestPointerLock()` locks the values of
 * <a href="#/p5/mouseX">mouseX</a>, <a href="#/p5/mouseY">mouseY</a>,
 * <a href="#/p5/pmouseX">pmouseX</a>, and <a href="#/p5/pmouseY">pmouseY</a>.
 * <a href="#/p5/movedX">movedX</a> and <a href="#/p5/movedY">movedY</a>
 * continue updating and can be used to get the distance the mouse moved since
 * the last frame was drawn. Calling
 * <a href="#/p5/exitPointerLock">exitPointerLock()</a> resumes updating the
 * mouse system variables.
 *
 * Note: Most browsers require an input, such as a click, before calling
 * `requestPointerLock()`. It’s recommended to call `requestPointerLock()` in
 * an event function such as <a href="#/p5/doubleClicked">doubleClicked()</a>.
 *
 * @method requestPointerLock
 *
 * @example
 * <div>
 * <code>
 * let score = 0;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A gray square with the text "Score: X" at its center. The score increases when the user moves the mouse upward. It decreases when the user moves the mouse downward.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Update the score.
 *   score -= movedY;
 *
 *   // Style the text.
 *   textAlign(CENTER);
 *   textSize(16);
 *
 *   // Display the score.
 *   text(`Score: ${score}`, 50, 50);
 * }
 *
 * // Lock the pointer when the user double-clicks.
 * function doubleClicked() {
 *   requestPointerLock();
 * }
 * </code>
 * </div>
 */
p5.prototype.requestPointerLock = function() {
  // pointer lock object forking for cross browser
  const canvas = this._curElement.elt;
  canvas.requestPointerLock =
    canvas.requestPointerLock || canvas.mozRequestPointerLock;
  if (!canvas.requestPointerLock) {
    console.log('requestPointerLock is not implemented in this browser');
    return false;
  }
  canvas.requestPointerLock();
  return true;
};

/**
 * Exits a pointer lock started with
 * <a href="#/p5/requestPointerLock">requestPointerLock</a>.
 *
 * Calling `requestPointerLock()` locks the values of
 * <a href="#/p5/mouseX">mouseX</a>, <a href="#/p5/mouseY">mouseY</a>,
 * <a href="#/p5/pmouseX">pmouseX</a>, and <a href="#/p5/pmouseY">pmouseY</a>.
 * Calling `exitPointerLock()` resumes updating the mouse system variables.
 *
 * Note: Most browsers require an input, such as a click, before calling
 * `requestPointerLock()`. It’s recommended to call `requestPointerLock()` in
 * an event function such as <a href="#/p5/doubleClicked">doubleClicked()</a>.
 *
 * @method exitPointerLock
 *
 * @example
 * <div>
 * <code>
 * let isLocked = false;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A gray square with a word at its center. The word changes between "Unlocked" and "Locked" when the user double-clicks.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Style the text.
 *   textAlign(CENTER);
 *   textSize(16);
 *
 *   // Tell the user whether the pointer is locked.
 *   if (isLocked === true) {
 *     text('Locked', 50, 50);
 *   } else {
 *     text('Unlocked', 50, 50);
 *   }
 * }
 *
 * // Toggle the pointer lock when the user double-clicks.
 * function doubleClicked() {
 *   if (isLocked === true) {
 *     exitPointerLock();
 *     isLocked = false;
 *   } else {
 *     requestPointerLock();
 *     isLocked = true;
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype.exitPointerLock = function() {
  document.exitPointerLock();
};

export default p5;
