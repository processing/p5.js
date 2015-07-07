/**
 * @module Events
 * @submodule Touch
 * @for p5
 * @requires core
 */

'use strict';

var p5 = require('../core/core');

/**
 * The system variable touchX always contains the horizontal position of
 * one finger, relative to (0, 0) of the canvas. This is best used for
 * single touch interactions. For multi-touch interactions, use the
 * touches[] array.
 *
 * @property touchX
 */
p5.prototype.touchX = 0;

/**
 * The system variable touchY always contains the vertical position of
 * one finger, relative to (0, 0) of the canvas. This is best used for
 * single touch interactions. For multi-touch interactions, use the
 * touches[] array.
 *
 * @property touchY
 */
p5.prototype.touchY = 0;

/**
 * The system variable ptouchX always contains the horizontal position of
 * one finger, relative to (0, 0) of the canvas, in the frame previous to the
 * current frame.
 *
 * @property ptouchX
 */
p5.prototype.ptouchX = 0;

/**
 * The system variable ptouchY always contains the vertical position of
 * one finger, relative to (0, 0) of the canvas, in the frame previous to the
 * current frame.
 *
 * @property ptouchY
 */
p5.prototype.ptouchY = 0;

/**
 * The system variable touches[] contains an array of the positions of all
 * current touch points, relative to (0, 0) of the canvas. Each element in
 * the array is an object with x and y properties.
 *
 * @property touches[]
 */
p5.prototype.touches = [];

/**
 * The boolean system variable touchIsDown is true if the screen is
 * touched and false if not.
 *
 * @property touchIsDown
 */
p5.prototype.touchIsDown = false;

p5.prototype._updateTouchCoords = function(e) {
  if(e.type === 'mousedown' ||
     e.type === 'mousemove' ||
     e.type === 'mouseup'){
    this._setProperty('touchX', this.mouseX);
    this._setProperty('touchY', this.mouseY);
  } else {
    var touchPos = getTouchPos(this._curElement.elt, e, 0);
    this._setProperty('touchX', touchPos.x);
    this._setProperty('touchY', touchPos.y);

    var touches = [];
    for(var i = 0; i < e.touches.length; i++){
      var pos = getTouchPos(this._curElement.elt, e, i);
      touches[i] = {x: pos.x, y: pos.y};
    }
    this._setProperty('touches', touches);
  }
};

p5.prototype._updatePTouchCoords = function() {
  this._setProperty('ptouchX', this.touchX);
  this._setProperty('ptouchY', this.touchY);
};

function getTouchPos(canvas, e, i) {
  i = i || 0;
  var rect = canvas.getBoundingClientRect();
  var touch = e.touches[i] || e.changedTouches[i];
  return  {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top
  };
}

/**
 * The touchStarted() function is called once after every time a touch is
 * registered. If no touchStarted() function is defined, the mousePressed()
 * function will be called instead if it is defined. Browsers may have
 * different default
 * behaviors attached to various touch events. To prevent any default
 * behavior for this event, add `return false` to the end of the method.
 *
 * @method touchStarted
 * @example
 * <div>
 * <code>
 * // Touch within the image to change
 * // the value of the rectangle
 *
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function touchStarted() {
 *   if (value == 0) {
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
 *   ellipse(touchX, touchY, 5, 5);
 *   // prevent default
 *   return false;
 * }
 * </code>
 * </div>
 */
p5.prototype._ontouchstart = function(e) {
  var context = this._isGlobal ? window : this;
  var executeDefault;
  this._updateTouchCoords(e);
  this._setProperty('touchIsDown', true);
  if(typeof context.touchStarted === 'function') {
    executeDefault = context.touchStarted(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
  } else if (typeof context.mousePressed === 'function') {
    executeDefault = context.mousePressed(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
    //this._setMouseButton(e);
  }
};

/**
 * The touchMoved() function is called every time a touch move is registered.
 * If no touchStarted() function is defined, the mouseDragged() function will
 * be called instead if it is defined. Browsers may have different default
 * behaviors attached to various touch events. To prevent any default
 * behavior for this event, add `return false` to the end of the method.
 *
 * @method touchMoved
 * @example
 * <div>
 * <code>
 * // Move your finger across the page
 * // to change its value
 *
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
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
 *   ellipse(touchX, touchY, 5, 5);
 *   // prevent default
 *   return false;
 * }
 * </code>
 * </div>
 */
p5.prototype._ontouchmove = function(e) {
  var context = this._isGlobal ? window : this;
  var executeDefault;
  this._updateTouchCoords(e);
  if (typeof context.touchMoved === 'function') {
    executeDefault = context.touchMoved(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
  } else if (typeof context.mouseDragged === 'function') {
    executeDefault = context.mouseDragged(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
    this._updateMouseCoords(e);
  }
};

/**
 * The touchEnded() function is called every time a touch ends. If no
 * touchStarted() function is defined, the mouseReleased() function will be
 * called instead if it is defined. Browsers may have different default
 * behaviors attached to various touch events. To prevent any default
 * behavior for this event, add `return false` to the end of the method.
 *
 * @method touchEnded
 * @example
 * <div>
 * <code>
 * // Release touch within the image to
 * // change the value of the rectangle
 *
 * var value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 * }
 * function touchEnded() {
 *   if (value == 0) {
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
 *   ellipse(touchX, touchY, 5, 5);
 *   // prevent default
 *   return false;
 * }
 * </code>
 * </div>
 */
p5.prototype._ontouchend = function(e) {
  this._updateTouchCoords(e);
  if (this.touches.length === 0) {
    this._setProperty('touchIsDown', false);
  }
  var context = this._isGlobal ? window : this;
  var executeDefault;
  if (typeof context.touchEnded === 'function') {
    executeDefault = context.touchEnded(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
  } else if (typeof context.mouseReleased === 'function') {
    executeDefault = context.mouseReleased(e);
    if(executeDefault === false) {
      e.preventDefault();
    }
    this._updateMouseCoords(e);
  }
};

module.exports = p5;
