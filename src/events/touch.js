/**
 * @module Events
 * @submodule Touch
 * @for p5
 * @requires core
 */

import p5 from '../core/main';

/**
 * An `Array` of all the current touch points on a touchscreen device.
 *
 * The `touches` array is empty by default. When the user touches their
 * screen, a new touch point is tracked and added to the array. Touch points
 * are `Objects` with the following properties:
 *
 * ```js
 * // Iterate over the touches array.
 * for (let touch of touches) {
 *   // x-coordinate relative to the top-left
 *   // corner of the canvas.
 *   console.log(touch.x);
 *
 *   // y-coordinate relative to the top-left
 *   // corner of the canvas.
 *   console.log(touch.y);
 *
 *   // x-coordinate relative to the top-left
 *   // corner of the browser.
 *   console.log(touch.winX);
 *
 *   // y-coordinate relative to the top-left
 *   // corner of the browser.
 *   console.log(touch.winY);
 *
 *   // ID number
 *   console.log(touch.id);
 * }
 * ```
 *
 * @property {Object[]} touches
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * // On a touchscreen device, touch the canvas using one or more fingers
 * // at the same time.
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A gray square. White circles appear where the user touches the square.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Draw a circle at each touch point.
 *   for (let touch of touches) {
 *     circle(touch.x, touch.y, 40);
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // On a touchscreen device, touch the canvas using one or more fingers
 * // at the same time.
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A gray square. Labels appear where the user touches the square, displaying the coordinates.'
 *   );
 * }
 *
 * function draw() {
 *   background(200);
 *
 *   // Draw a label above each touch point.
 *   for (let touch of touches) {
 *     text(`${touch.x}, ${touch.y}`, touch.x, touch.y - 40);
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype.touches = [];

p5.prototype._updateTouchCoords = function(e) {
  if (this._curElement !== null) {
    const touches = [];
    for (let i = 0; i < e.touches.length; i++) {
      touches[i] = getTouchInfo(
        this._curElement.elt,
        this.width,
        this.height,
        e,
        i
      );
    }
    this._setProperty('touches', touches);
  }
};

function getTouchInfo(canvas, w, h, e, i = 0) {
  const rect = canvas.getBoundingClientRect();
  const sx = canvas.scrollWidth / w || 1;
  const sy = canvas.scrollHeight / h || 1;
  const touch = e.touches[i] || e.changedTouches[i];
  return {
    x: (touch.clientX - rect.left) / sx,
    y: (touch.clientY - rect.top) / sy,
    winX: touch.clientX,
    winY: touch.clientY,
    id: touch.identifier
  };
}

/**
 * A function that's called once each time the user touches the screen.
 *
 * Declaring a function called `touchStarted()` sets a code block to run
 * automatically each time the user begins touching a touchscreen device:
 *
 * ```js
 * function touchStarted() {
 *   // Code to run.
 * }
 * ```
 *
 * The <a href="#/p5/touches">touches</a> array will be updated with the most
 * recent touch points when `touchStarted()` is called by p5.js:
 *
 * ```js
 * function touchStarted() {
 *   // Paint over the background.
 *   background(200);
 *
 *   // Mark each touch point once with a circle.
 *   for (let touch of touches) {
 *     circle(touch.x, touch.y, 40);
 *   }
 * }
 * ```
 *
 * The parameter, event, is optional. `touchStarted()` will be passed a
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent" target="_blank">TouchEvent</a>
 * object with properties that describe the touch event:
 *
 * ```js
 * function touchStarted(event) {
 *   // Code to run that uses the event.
 *   console.log(event);
 * }
 * ```
 *
 * On touchscreen devices, <a href="#/p5/mousePressed">mousePressed()</a> will
 * run when a user’s touch starts if `touchStarted()` isn’t declared. If
 * `touchStarted()` is declared, then `touchStarted()` will run when a user’s
 * touch starts and <a href="#/p5/mousePressed">mousePressed()</a> won’t.
 *
 * Note: `touchStarted()`, <a href="#/p5/touchEnded">touchEnded()</a>, and
 * <a href="#/p5/touchMoved">touchMoved()</a> are all related.
 * `touchStarted()` runs as soon as the user touches a touchscreen device.
 * <a href="#/p5/touchEnded">touchEnded()</a> runs as soon as the user ends a
 * touch. <a href="#/p5/touchMoved">touchMoved()</a> runs repeatedly as the
 * user moves any touch points.
 *
 * @method touchStarted
 * @param  {TouchEvent} [event] optional `TouchEvent` argument.
 *
 * @example
 * <div>
 * <code>
 * // On a touchscreen device, touch the canvas using one or more fingers
 * // at the same time.
 *
 * let value = 0;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A gray square with a black square at its center. The inner square switches color between black and white each time the user touches the screen.'
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
 * // Toggle colors with each touch.
 * function touchStarted() {
 *   if (value === 0) {
 *     value = 255;
 *   } else {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // On a touchscreen device, touch the canvas using one or more fingers
 * // at the same time.
 *
 * let bgColor = 50;
 * let fillColor = 255;
 * let borderWidth = 0.5;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A gray square with the number 0 at the top-center. The number tracks the number of places the user is touching the screen. Circles appear at each touch point and change style in response to events.'
 *   );
 * }
 *
 * function draw() {
 *   background(bgColor);
 *
 *   // Style the text.
 *   textAlign(CENTER);
 *   textSize(16);
 *   fill(0);
 *   noStroke();
 *
 *   // Display the number of touch points.
 *   text(touches.length, 50, 20);
 *
 *   // Style the touch points.
 *   fill(fillColor);
 *   stroke(0);
 *   strokeWeight(borderWidth);
 *
 *   // Display the touch points as circles.
 *   for (let touch of touches) {
 *     circle(touch.x, touch.y, 40);
 *   }
 * }
 *
 * // Set the background color to a random grayscale value.
 * function touchStarted() {
 *   bgColor = random(80, 255);
 * }
 *
 * // Set the fill color to a random grayscale value.
 * function touchEnded() {
 *   fillColor = random(0, 255);
 * }
 *
 * // Set the stroke weight.
 * function touchMoved() {
 *   // Increment the border width.
 *   borderWidth += 0.1;
 *
 *   // Reset the border width once it's too thick.
 *   if (borderWidth > 20) {
 *     borderWidth = 0.5;
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype._ontouchstart = function(e) {
  const context = this._isGlobal ? window : this;
  let executeDefault;
  this._setProperty('mouseIsPressed', true);
  this._updateTouchCoords(e);
  this._updateNextMouseCoords(e);
  this._updateMouseCoords(); // reset pmouseXY at the start of each touch event

  if (typeof context.touchStarted === 'function') {
    executeDefault = context.touchStarted(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
    this.touchstart = true;
  }
};

/**
 * A function that's called when the user touches the screen and moves.
 *
 * Declaring the function `touchMoved()` sets a code block to run
 * automatically when the user touches a touchscreen device and moves:
 *
 * ```js
 * function touchMoved() {
 *   // Code to run.
 * }
 * ```
 *
 * The <a href="#/p5/touches">touches</a> array will be updated with the most
 * recent touch points when `touchMoved()` is called by p5.js:
 *
 * ```js
 * function touchMoved() {
 *   // Paint over the background.
 *   background(200);
 *
 *   // Mark each touch point while the user moves.
 *   for (let touch of touches) {
 *     circle(touch.x, touch.y, 40);
 *   }
 * }
 * ```
 *
 * The parameter, event, is optional. `touchMoved()` will be passed a
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent" target="_blank">TouchEvent</a>
 * object with properties that describe the touch event:
 *
 * ```js
 * function touchMoved(event) {
 *   // Code to run that uses the event.
 *   console.log(event);
 * }
 * ```
 *
 * On touchscreen devices, <a href="#/p5/mouseDragged">mouseDragged()</a> will
 * run when the user’s touch points move if `touchMoved()` isn’t declared. If
 * `touchMoved()` is declared, then `touchMoved()` will run when a user’s
 * touch points move and <a href="#/p5/mouseDragged">mouseDragged()</a> won’t.
 *
 * Note: <a href="#/p5/touchStarted">touchStarted()</a>,
 * <a href="#/p5/touchEnded">touchEnded()</a>, and
 * `touchMoved()` are all related.
 * <a href="#/p5/touchStarted">touchStarted()</a> runs as soon as the user
 * touches a touchscreen device. <a href="#/p5/touchEnded">touchEnded()</a>
 * runs as soon as the user ends a touch. `touchMoved()` runs repeatedly as
 * the user moves any touch points.
 *
 * @method touchMoved
 * @param  {TouchEvent} [event] optional TouchEvent argument.
 *
 * @example
 * <div>
 * <code>
 * // On a touchscreen device, touch the canvas using one or more fingers
 * // at the same time.
 *
 * let value = 0;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A gray square with a black square at its center. The inner square becomes lighter when the user touches the screen and moves.'
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
 * function touchMoved() {
 *   // Update the grayscale value.
 *   value += 5;
 *
 *   // Reset the grayscale value.
 *   if (value > 255) {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // On a touchscreen device, touch the canvas using one or more fingers
 * // at the same time.
 *
 * let bgColor = 50;
 * let fillColor = 255;
 * let borderWidth = 0.5;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A gray square with the number 0 at the top-center. The number tracks the number of places the user is touching the screen. Circles appear at each touch point and change style in response to events.'
 *   );
 * }
 *
 * function draw() {
 *   background(bgColor);
 *
 *   // Style the text.
 *   textAlign(CENTER);
 *   textSize(16);
 *   fill(0);
 *   noStroke();
 *
 *   // Display the number of touch points.
 *   text(touches.length, 50, 20);
 *
 *   // Style the touch points.
 *   fill(fillColor);
 *   stroke(0);
 *   strokeWeight(borderWidth);
 *
 *   // Display the touch points as circles.
 *   for (let touch of touches) {
 *     circle(touch.x, touch.y, 40);
 *   }
 * }
 *
 * // Set the background color to a random grayscale value.
 * function touchStarted() {
 *   bgColor = random(80, 255);
 * }
 *
 * // Set the fill color to a random grayscale value.
 * function touchEnded() {
 *   fillColor = random(0, 255);
 * }
 *
 * // Set the stroke weight.
 * function touchMoved() {
 *   // Increment the border width.
 *   borderWidth += 0.1;
 *
 *   // Reset the border width once it's too thick.
 *   if (borderWidth > 20) {
 *     borderWidth = 0.5;
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype._ontouchmove = function(e) {
  const context = this._isGlobal ? window : this;
  let executeDefault;
  this._updateTouchCoords(e);
  this._updateNextMouseCoords(e);
  if (typeof context.touchMoved === 'function') {
    executeDefault = context.touchMoved(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  } else if (typeof context.mouseDragged === 'function') {
    executeDefault = context.mouseDragged(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  }
};

/**
 * A function that's called once each time a screen touch ends.
 *
 * Declaring the function `touchEnded()` sets a code block to run
 * automatically when the user stops touching a touchscreen device:
 *
 * ```js
 * function touchEnded() {
 *   // Code to run.
 * }
 * ```
 *
 * The <a href="#/p5/touches">touches</a> array will be updated with the most
 * recent touch points when `touchEnded()` is called by p5.js:
 *
 * ```js
 * function touchEnded() {
 *   // Paint over the background.
 *   background(200);
 *
 *   // Mark each remaining touch point when the user stops
 *   // a touch.
 *   for (let touch of touches) {
 *     circle(touch.x, touch.y, 40);
 *   }
 * }
 * ```
 *
 * The parameter, event, is optional. `touchEnded()` will be passed a
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent" target="_blank">TouchEvent</a>
 * object with properties that describe the touch event:
 *
 * ```js
 * function touchEnded(event) {
 *   // Code to run that uses the event.
 *   console.log(event);
 * }
 * ```
 *
 * On touchscreen devices, <a href="#/p5/mouseReleased">mouseReleased()</a> will
 * run when the user’s touch ends if `touchEnded()` isn’t declared. If
 * `touchEnded()` is declared, then `touchEnded()` will run when a user’s
 * touch ends and <a href="#/p5/mouseReleased">mouseReleased()</a> won’t.
 *
 * Note: <a href="#/p5/touchStarted">touchStarted()</a>,
 * `touchEnded()`, and <a href="#/p5/touchMoved">touchMoved()</a> are all
 * related. <a href="#/p5/touchStarted">touchStarted()</a> runs as soon as the
 * user touches a touchscreen device. `touchEnded()` runs as soon as the user
 * ends a touch. <a href="#/p5/touchMoved">touchMoved()</a> runs repeatedly as
 * the user moves any touch points.
 *
 * @method touchEnded
 * @param  {TouchEvent} [event] optional `TouchEvent` argument.
 *
 * @example
 * <div>
 * <code>
 * // On a touchscreen device, touch the canvas using one or more fingers
 * // at the same time.
 *
 * let value = 0;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A gray square with a black square at its center. The inner square switches color between black and white each time the user stops touching the screen.'
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
 * // Toggle colors when a touch ends.
 * function touchEnded() {
 *   if (value === 0) {
 *     value = 255;
 *   } else {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 *
 * <div>
 * <code>
 * // On a touchscreen device, touch the canvas using one or more fingers
 * // at the same time.
 *
 * let bgColor = 50;
 * let fillColor = 255;
 * let borderWidth = 0.5;
 *
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   describe(
 *     'A gray square with the number 0 at the top-center. The number tracks the number of places the user is touching the screen. Circles appear at each touch point and change style in response to events.'
 *   );
 * }
 *
 * function draw() {
 *   background(bgColor);
 *
 *   // Style the text.
 *   textAlign(CENTER);
 *   textSize(16);
 *   fill(0);
 *   noStroke();
 *
 *   // Display the number of touch points.
 *   text(touches.length, 50, 20);
 *
 *   // Style the touch points.
 *   fill(fillColor);
 *   stroke(0);
 *   strokeWeight(borderWidth);
 *
 *   // Display the touch points as circles.
 *   for (let touch of touches) {
 *     circle(touch.x, touch.y, 40);
 *   }
 * }
 *
 * // Set the background color to a random grayscale value.
 * function touchStarted() {
 *   bgColor = random(80, 255);
 * }
 *
 * // Set the fill color to a random grayscale value.
 * function touchEnded() {
 *   fillColor = random(0, 255);
 * }
 *
 * // Set the stroke weight.
 * function touchMoved() {
 *   // Increment the border width.
 *   borderWidth += 0.1;
 *
 *   // Reset the border width once it's too thick.
 *   if (borderWidth > 20) {
 *     borderWidth = 0.5;
 *   }
 * }
 * </code>
 * </div>
 */
p5.prototype._ontouchend = function(e) {
  this._setProperty('mouseIsPressed', false);
  this._updateTouchCoords(e);
  this._updateNextMouseCoords(e);
  const context = this._isGlobal ? window : this;
  let executeDefault;
  if (typeof context.touchEnded === 'function') {
    executeDefault = context.touchEnded(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
    this.touchend = true;
  }
};

export default p5;
