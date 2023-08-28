/**
 * @module Events
 * @submodule Touch
 * @for p5
 * @requires core
 */

import p5 from '../core/main';

/**
 * The system variable touches[] contains an array of the positions of all
 * current touch points, relative to (0, 0) of the canvas, and IDs identifying a
 * unique touch as it moves. Each element in the array is an object with x, y,
 * and id properties.
 *
 * The touches[] array is not supported on Safari and IE on touch-based
 * desktops (laptops).
 *
 * @property {Object[]} touches
 * @readOnly
 *
 * @example
 * <div>
 * <code>
 * // On a touchscreen device, touch
 * // the canvas using one or more fingers
 * // at the same time
 * function draw() {
 *   clear();
 *   let display = touches.length + ' touches';
 *   text(display, 5, 10);
 *   describe(`Number of touches currently registered are displayed
 *     on the canvas`);
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
 * The touchStarted() function is called once after every time a touch is
 * registered. If no <a href="#/p5/touchStarted">touchStarted()</a> function is defined, the <a href="#/p5/mousePressed">mousePressed()</a>
 * function will be called instead if it is defined.<br><br>
 * Browsers may have different default behaviors attached to various touch
 * events. To prevent any default behavior for this event, add "return false"
 * to the end of the method.
 *
 * @method touchStarted
 * @param  {TouchEvent} [event] optional TouchEvent callback argument.
 * @example
 * <div>
 * <code>
 * // Touch within the image to change
 * // the value of the rectangle
 *
 * let value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 *   describe('50-by-50 black rect turns white with touch event.');
 * }
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
 * <div class="norender">
 * <code>
 * function touchStarted() {
 *   ellipse(mouseX, mouseY, 5, 5);
 *   // prevent default
 *   return false;
 * }
 * describe('no image displayed');
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * // returns a TouchEvent object
 * // as a callback argument
 * function touchStarted(event) {
 *   console.log(event);
 * }
 * describe('no image displayed');
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
    // only safari needs this manual fallback for consistency
  } else if (
    navigator.userAgent.toLowerCase().includes('safari') &&
    typeof context.mousePressed === 'function'
  ) {
    executeDefault = context.mousePressed(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  }
};

/**
 * The <a href="#/p5/touchMoved">touchMoved()</a> function is called every time a touch move is registered.
 * If no <a href="#/p5/touchMoved">touchMoved()</a> function is defined, the <a href="#/p5/mouseDragged">mouseDragged()</a> function will
 * be called instead if it is defined.<br><br>
 * Browsers may have different default behaviors attached to various touch
 * events. To prevent any default behavior for this event, add "return false"
 * to the end of the method.
 *
 * @method touchMoved
 * @param  {TouchEvent} [event] optional TouchEvent callback argument.
 * @example
 * <div>
 * <code>
 * // Move your finger across the page
 * // to change its value
 *
 * let value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 *   describe('50-by-50 black rect turns lighter with touch until white. resets');
 * }
 * function touchMoved() {
 *   value = value + 5;
 *   if (value > 255) {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * function touchMoved() {
 *   ellipse(mouseX, mouseY, 5, 5);
 *   // prevent default
 *   return false;
 * }
 * describe('no image displayed');
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * // returns a TouchEvent object
 * // as a callback argument
 * function touchMoved(event) {
 *   console.log(event);
 * }
 * describe('no image displayed');
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
 * The <a href="#/p5/touchEnded">touchEnded()</a> function is called every time a touch ends. If no
 * <a href="#/p5/touchEnded">touchEnded()</a> function is defined, the <a href="#/p5/mouseReleased">mouseReleased()</a> function will be
 * called instead if it is defined.<br><br>
 * Browsers may have different default behaviors attached to various touch
 * events. To prevent any default behavior for this event, add "return false"
 * to the end of the method.
 *
 * @method touchEnded
 * @param  {TouchEvent} [event] optional TouchEvent callback argument.
 * @example
 * <div>
 * <code>
 * // Release touch within the image to
 * // change the value of the rectangle
 *
 * let value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 *   describe('50-by-50 black rect turns white with touch.');
 * }
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
 * <div class="norender">
 * <code>
 * function touchEnded() {
 *   ellipse(mouseX, mouseY, 5, 5);
 *   // prevent default
 *   return false;
 * }
 * describe('no image displayed');
 * </code>
 * </div>
 *
 * <div class="norender">
 * <code>
 * // returns a TouchEvent object
 * // as a callback argument
 * function touchEnded(event) {
 *   console.log(event);
 * }
 * describe('no image displayed');
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
  } else if (typeof context.mouseReleased === 'function') {
    executeDefault = context.mouseReleased(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  }
};

export default p5;
