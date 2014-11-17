/**
 * @module Input
 * @submodule Mouse
 * @for p5
 * @requires core
 * @requires constants
 */

define(function (require) {

  'use strict';

  var p5 = require('core');
  var constants = require('constants');

  /**
   * The system variable mouseX always contains the current horizontal
   * position of the mouse, relative to (0, 0) of the canvas.
   *
   * @property mouseX
   */
  p5.prototype.mouseX = 0;

  /**
   * The system variable mouseY always contains the current vertical position
   * of the mouse, relative to (0, 0) of the canvas.
   *
   * @property mouseY
   */
  p5.prototype.mouseY = 0;

  /**
   * The system variable pmouseX always contains the horizontal position of
   * the mouse in the frame previous to the current frame, relative to (0, 0)
   * of the canvas.
   *
   * @property pmouseX
   */
  p5.prototype.pmouseX = 0;

  /**
   * The system variable pmouseY always contains the vertical position of the
   * mouse in the frame previous to the current frame, relative to (0, 0) of
   * the canvas.
   *
   * @property pmouseY
   */
  p5.prototype.pmouseY = 0;

  /**
   * The system variable winMouseX always contains the current horizontal
   * position of the mouse, relative to (0, 0) of the window.
   *
   * @property winMouseX
   */
  p5.prototype.winMouseX = 0;

  /**
   * The system variable winMouseY always contains the current vertical
   * position of the mouse, relative to (0, 0) of the window.
   *
   * @property winMouseY
   */
  p5.prototype.winMouseY = 0;

  /**
   * The system variable pwinMouseX always contains the horizontal position
   * of the mouse in the frame previous to the current frame, relative to
   * (0, 0) of the window.
   *
   * @property pwinMouseX
   */
  p5.prototype.pwinMouseX = 0;

  /**
   * The system variable pwinMouseY always contains the vertical position of
   * the mouse in the frame previous to the current frame, relative to (0, 0)
   * of the window.
   *
   * @property pwinMouseY
   */
  p5.prototype.pwinMouseY = 0;

  /**
   * Processing automatically tracks if the mouse button is pressed and which
   * button is pressed. The value of the system variable mouseButton is either
   * LEFT, RIGHT, or CENTER depending on which button is pressed. Browsers are
   * weird, USE AT YOUR OWN RISK FOR NOW!
   *
   * @property mouseButton
   */
  p5.prototype.mouseButton = 0;

  /**
   * The boolean system variable mouseIsPressed is true if the mouse is pressed
   * and false if not.
   *
   * @property mouseIsPressed
   */
  p5.prototype.mouseIsPressed = false;
  p5.prototype.isMousePressed = false; // both are supported

  p5.prototype._updateMouseCoords = function(e) {
    if(e.type === 'touchstart' ||
       e.type === 'touchmove' ||
       e.type === 'touchend') {
      this._setProperty('mouseX', this.touchX);
      this._setProperty('mouseY', this.touchY);
    } else {
      if(this._curElement !== null) {
        var mousePos = getMousePos(this._curElement.elt, e);
        this._setProperty('mouseX', mousePos.x);
        this._setProperty('mouseY', mousePos.y);
      }
    }
    this._setProperty('winMouseX', e.pageX);
    this._setProperty('winMouseY', e.pageY);
  };

  p5.prototype._updatePMouseCoords = function(e) {
    this._setProperty('pmouseX', this.mouseX);
    this._setProperty('pmouseY', this.mouseY);
    this._setProperty('pwinMouseX', this.winMouseX);
    this._setProperty('pwinMouseY', this.winMouseY);
  };

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  p5.prototype._setMouseButton = function(e) {
    if (e.button === 1) {
      this._setProperty('mouseButton', constants.CENTER);
    } else if (e.button === 2) {
      this._setProperty('mouseButton', constants.RIGHT);
    } else {
      this._setProperty('mouseButton', constants.LEFT);
      if(e.type === 'touchstart' || e.type === 'touchmove') {
        this._setProperty('mouseX', this.touchX);
        this._setProperty('mouseY', this.touchY);
      }
    }
  };

  /**
   * The mouseMoved() function is called every time the mouse moves and a mouse
   * button is not pressed.<br><br>
   * Browsers may have different default
   * behaviors attached to various mouse events. To prevent any default
   * behavior for this event, add `return false` to the end of the method.
   *
   * @method mouseMoved
   * @example
   * <div>
   * <code>
   * // Move the mouse across the page
   * // to change its value
   *       
   * var value = 0;
   * function draw() {
   *   fill(value);
   *   rect(25, 25, 50, 50);
   * }
   * function mouseMoved() {
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
   * function mouseMoved() {
   *   ellipse(mouseX, mouseY, 5, 5);
   *   // prevent default
   *   return false;
   * }
   * </code>
   * </div>
   */

  /**
   * The mouseDragged() function is called once every time the mouse moves and
   * a mouse button is pressed. If no mouseDragged() function is defined, the
   * touchMoved() function will be called instead if it is defined.<br><br>
   * Browsers may have different default
   * behaviors attached to various mouse events. To prevent any default
   * behavior for this event, add `return false` to the end of the method.
   *
   * @method mouseDragged
   * @example
   * <div>
   * <code>
   * // Drag the mouse across the page
   * // to change its value
   *       
   * var value = 0;
   * function draw() {
   *   fill(value);
   *   rect(25, 25, 50, 50);
   * }
   * function mouseDragged() {
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
   * function mouseDragged() {
   *   ellipse(mouseX, mouseY, 5, 5);
   *   // prevent default
   *   return false;
   * }
   * </code>
   * </div>
   */
  p5.prototype.onmousemove = function(e){
    var context = this._isGlobal ? window : this;
    var executeDefault;
    this._updateMouseCoords(e);
    if (!this.isMousePressed) {
      if (typeof context.mouseMoved === 'function') {
        executeDefault = context.mouseMoved(e);
        if(executeDefault === false) {
          e.preventDefault();
        }
      }
    }
    else {
      if (typeof context.mouseDragged === 'function') {
        executeDefault = context.mouseDragged(e);
        if(executeDefault === false) {
          e.preventDefault();
        }
      } else if (typeof context.touchMoved === 'function') {
        executeDefault = context.touchMoved(e);
        if(executeDefault === false) {
          e.preventDefault();
        }
        this._updateTouchCoords(e);
      }
    }
  };

  /**
   * The mousePressed() function is called once after every time a mouse button
   * is pressed. The mouseButton variable (see the related reference entry)
   * can be used to determine which button has been pressed. If no 
   * mousePressed() function is defined, the touchStarted() function will be
   * called instead if it is defined.<br><br>
   * Browsers may have different default
   * behaviors attached to various mouse events. To prevent any default
   * behavior for this event, add `return false` to the end of the method.
   *
   * @method mousePressed
   * @example
   * <div>
   * <code>
   * // Click within the image to change 
   * // the value of the rectangle
   *       
   * var value = 0;
   * function draw() {
   *   fill(value);
   *   rect(25, 25, 50, 50);
   * }
   * function mousePressed() {
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
   * function mousePressed() {
   *   ellipse(mouseX, mouseY, 5, 5);
   *   // prevent default
   *   return false;
   * }
   * </code>
   * </div>
   */
  p5.prototype.onmousedown = function(e) {
    var context = this._isGlobal ? window : this;
    var executeDefault;
    this._setProperty('isMousePressed', true);
    this._setProperty('mouseIsPressed', true);
    this._setMouseButton(e);
    this._updateMouseCoords(e);
    if (typeof context.mousePressed === 'function') {
      executeDefault = context.mousePressed(e);
      if(executeDefault === false) {
        e.preventDefault();
      }
    } else if (typeof context.touchStarted === 'function') {
      executeDefault = context.touchStarted(e);
      if(executeDefault === false) {
        e.preventDefault();
      }
      this._updateTouchCoords(e);
    }
  };

  /**
   * The mouseReleased() function is called every time a mouse button is
   * released. If no mouseReleased() function is defined, the touchEnded()
   * function will be called instead if it is defined.<br><br>
   * Browsers may have different default
   * behaviors attached to various mouse events. To prevent any default
   * behavior for this event, add `return false` to the end of the method.
   *
   *
   * @method mouseReleased
   * @example
   * <div>
   * <code>
   * // Click within the image to change 
   * // the value of the rectangle
   * // after the mouse has been clicked
   *       
   * var value = 0;
   * function draw() {
   *   fill(value);
   *   rect(25, 25, 50, 50);
   * }
   * function mouseReleased() {
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
   * function mouseReleased() {
   *   ellipse(mouseX, mouseY, 5, 5);
   *   // prevent default
   *   return false;
   * }
   * </code>
   * </div>
   */
  p5.prototype.onmouseup = function(e) {
    var context = this._isGlobal ? window : this;
    var executeDefault;
    this._setProperty('isMousePressed', false);
    this._setProperty('mouseIsPressed', false);
    if (typeof context.mouseReleased === 'function') {
      executeDefault = context.mouseReleased(e);
      if(executeDefault === false) {
        e.preventDefault();
      }
    } else if (typeof context.touchEnded === 'function') {
      executeDefault = context.touchEnded(e);
      if(executeDefault === false) {
        e.preventDefault();
      }
      this._updateTouchCoords(e);
    }
  };

  /**
   * The mouseClicked() function is called once after a mouse button has been
   * pressed and then released.<br><br>
   * Browsers may have different default
   * behaviors attached to various mouse events. To prevent any default
   * behavior for this event, add `return false` to the end of the method.
   *
   * @method mouseClicked
   * @example
   * <div>
   * <code>
   * // Click within the image to change 
   * // the value of the rectangle
   * // after the mouse has been clicked
   *       
   * var value = 0;
   * function draw() {
   *   fill(value);
   *   rect(25, 25, 50, 50);
   * }
   * function mouseClicked() {
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
   * function mouseClicked() {
   *   ellipse(mouseX, mouseY, 5, 5);
   *   // prevent default
   *   return false;
   * }
   * </code>
   * </div>
   */
  p5.prototype.onclick = function(e) {
    var context = this._isGlobal ? window : this;
    if (typeof context.mouseClicked === 'function') {
      var executeDefault = context.mouseClicked(e);
      if(executeDefault === false) {
        e.preventDefault();
      }
    }
  };

  /**
   * The event.wheelDelta or event.detail property returns negative values if
   * the mouse wheel if rotated up or away from the user and positive in the
   * other direction. On OS X with "natural" scrolling enabled, the values are
   * opposite.<br><br>
   * Browsers may have different default
   * behaviors attached to various mouse events. To prevent any default
   * behavior for this event, add `return false` to the end of the method.
   * 
   * See <a href="http://www.javascriptkit.com/javatutors/onmousewheel.shtml">
   * mouse wheel event in JS</a>.
   *
   * @method mouseWheel
   */
  p5.prototype.onmousewheel = function(e) {
    var context = this._isGlobal ? window : this;
    if (typeof context.mouseWheel === 'function') {
      var executeDefault = context.mouseWheel(e);
      if(executeDefault === false) {
        e.preventDefault();
      }
    }
  };

  return p5;

});
