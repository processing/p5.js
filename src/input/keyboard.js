/**
 * @module Input
 * @submodule Keyboard
 * @for p5
 * @requires core
 */
define(function (require) {

  'use strict';

  var p5 = require('core');

  /**
   * The boolean system variable keyIsPressed is true if any key is pressed
   * and false if no keys are pressed.
   *
   * @property keyIsPressed
   * @example
   * <div>
   * <code>
   * var value = 0;
   * function draw() {
   *   if (keyIsPressed === true) {
   *     fill(0);
   *   } else {
   *     fill(255);
   *   }
   *   rect(25, 25, 50, 50);
   * }
   * </code>
   * </div>
   */
  p5.prototype.isKeyPressed = false;
  p5.prototype.keyIsPressed = false; // khan

  /**
   * The system variable key always contains the value of the most recent
   * key on the keyboard that was typed. To get the proper capitalization, it
   * is best to use it within keyTyped(). For non-ASCII keys, use the keyCode
   * variable.
   *
   * @property key
   */
  p5.prototype.key = '';

  /**
   * The variable keyCode is used to detect special keys such as BACKSPACE,
   * DELETE, ENTER, RETURN, TAB, ESCAPE, SHIFT, CONTROL, OPTION, ALT, UP_ARROW,
   * DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW.
   *
   * @property keyCode
   */
  p5.prototype.keyCode = 0;

   /**
   * The keyPressed() function is called once every time a key is pressed. The
   * keyCode for the key that was pressed is stored in the keyCode variable.
   * <br><br>
   * For non-ASCII keys, use the keyCode variable. You can check if the keyCode
   * equals BACKSPACE, DELETE, ENTER, RETURN, TAB, ESCAPE, SHIFT, CONTROL,
   * OPTION, ALT, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW.
   * <br><br>
   * For ASCII keys that was pressed is stored in the key variable. However, it
   * does not distinguish between uppercase and lowercase. For this reason, it
   * is recommended to use keyTyped() to read the key variable, in which the
   * case of the variable will be distinguished.
   * <br><br>
   * Because of how operating systems handle key repeats, holding down a key
   * may cause multiple calls to keyTyped() (and keyReleased() as well). The
   * rate of repeat is set by the operating system and how each computer is
   * configured.<br><br>
   * Browsers may have different default
   * behaviors attached to various key events. To prevent any default
   * behavior for this event, add "return false" to the end of the method.
   *
   * @method keyPressed
   * @example
   * <div>
   * <code>
   * var value = 0;
   * function draw() {
   *   fill(value);
   *   rect(25, 25, 50, 50);
   * }
   * function keyPressed() {
   *   if (value === 0) {
   *     value = 255;
   *   } else {
   *     value = 0;
   *   }
   * }
   * </code>
   * </div>
   * <div>
   * <code>
   * var value = 0;
   * function draw() {
   *   fill(value);
   *   rect(25, 25, 50, 50);
   * }
   * function keyPressed() {
   *   if (keyCode === LEFT_ARROW) {
   *     value = 255;
   *   } else if (keyCode === RIGHT_ARROW) {
   *     value = 0;
   *   }
   *   return false; // prevent any default behavior
   * }
   * </code>
   * </div>
   */
  p5.prototype.onkeydown = function (e) {
    this._setProperty('isKeyPressed', true);
    this._setProperty('keyIsPressed', true);
    this._setProperty('keyCode', e.which);
    var key = String.fromCharCode(e.which);
    if (!key) {
      key = e.which;
    }
    this._setProperty('key', key);
    var keyPressed = this.keyPressed || window.keyPressed;
    if (typeof keyPressed === 'function' && !e.charCode) {
      var executeDefault = keyPressed(e);
      if(executeDefault === false) {
        e.preventDefault();
      }
    }
  };
   /**
   * The keyReleased() function is called once every time a key is released.
   * See key and keyCode for more information.<br><br>
   * Browsers may have different default
   * behaviors attached to various key events. To prevent any default
   * behavior for this event, add "return false" to the end of the method.
   *
   * @method keyReleased
   * @example
   * <div>
   * <code>
   * var value = 0;
   * function draw() {
   *   fill(value);
   *   rect(25, 25, 50, 50);
   * }
   * function keyReleased() {
   *   if (value === 0) {
   *     value = 255;
   *   } else {
   *     value = 0;
   *   }
   *   return false; // prevent any default behavior
   * }
   * </code>
   * </div>
   */
  p5.prototype.onkeyup = function (e) {
    var keyReleased = this.keyReleased || window.keyReleased;
    this._setProperty('isKeyPressed', false);
    this._setProperty('keyIsPressed', false);
    var key = String.fromCharCode(e.which);
    if (!key) {
      key = e.which;
    }
    this._setProperty('key', key);
    this._setProperty('keyCode', e.which);
    if (typeof keyReleased === 'function') {
      var executeDefault = keyReleased(e);
      if(executeDefault === false) {
        e.preventDefault();
      }
    }
  };

  /**
   * The keyTyped() function is called once every time a key is pressed, but
   * action keys such as Ctrl, Shift, and Alt are ignored. The most recent
   * key pressed will be stored in the key variable.
   * <br><br>
   * Because of how operating systems handle key repeats, holding down a key
   * will cause multiple calls to keyTyped(), the rate is set by the operating
   * system and how each computer is configured.<br><br>
   * Browsers may have different default
   * behaviors attached to various key events. To prevent any default
   * behavior for this event, add "return false" to the end of the method.
   *
   * @method keyTyped
   * @example
   * <div>
   * <code>
   * var value = 0;
   * function draw() {
   *   fill(value);
   *   rect(25, 25, 50, 50);
   * }
   * function keyTyped() {
   *   if (key === 'a') {
   *     value = 255;
   *   } else if (key === 'b') {
   *     value = 0;
   *   }
   *   return false; // prevent any default behavior
   * }
   * </code>
   * </div>
   */
  p5.prototype.onkeypress = function (e) {
    this._setProperty('keyCode', e.which);
    this._setProperty('key', String.fromCharCode(e.which));
    var keyTyped = this.keyTyped || window.keyTyped;
    if (typeof keyTyped === 'function') {
      var executeDefault = keyTyped(e);
      if(executeDefault === false) {
        e.preventDefault();
      }
    }
  };

  return p5;

});
