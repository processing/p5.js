/**
 * @module Input
 * @for Keyboard
 * @requires core
 */
define(function (require) {

  'use strict';

  var p5 = require('core');

  /**
   * The boolean system variable isKeyPressed is true if any key is pressed
   * and false if no keys are pressed.
   *
   * @property isKeyPressed
   */
  p5.prototype.isKeyPressed = false;
  p5.prototype.keyIsPressed = false; // khan
   
  /**
   * The system variable key always contains the value of the most recent
   * key on the keyboard that was typed. For non-ASCII keys, use the keyCode
   * variable.
   *
   * @property key
   */
  p5.prototype.key = '';

  /**
   * The variable keyCode is used to detect special keys such as the UP,
   * DOWN, LEFT, RIGHT arrow keys and ALT, CONTROL, SHIFT.
   *
   * @property keyCode
   */
  p5.prototype.keyCode = 0;

   /**
   * The keyPressed() function is called once every time a key is pressed. 
   * @method keyPressed
   * @example
   *   <div>
   *     <code>
   *       // Click within the image to change 
   *       // the value of the rectangle
   *       
   *       var value = 0;
   *       function draw() {
   *         fill(value);
   *         rect(25, 25, 50, 50);
   *       }
   *       function keyPressed() {
   *         if (value == 0) {
   *           value = 255;
   *         } else {
   *           value = 0;
   *         }
   *       }
   *     </code>
   *   </div>
   */
  p5.prototype.onkeydown = function (e) {
    this._setProperty('isKeyPressed', true);
    this._setProperty('keyIsPressed', true);
    this._setProperty('keyCode', e.keyCode);
    var keyPressed = this.keyPressed || window.keyPressed;
    if (typeof keyPressed === 'function' && !e.charCode) {
      keyPressed(e);
    }
  };
   /**
   * The keyReleased() function is called once every time a key is released.
   * See key and keyReleased for more information. For non-ASCII keys, use
   * the keyCode variable.
   *
   * @method keyReleased
   * @example
   *   <div>
   *     <code>
   *       // Click within the image to change 
   *       // the value of the rectangle
   *       
   *       var value = 0;
   *       function draw() {
   *         fill(value);
   *         rect(25, 25, 50, 50);
   *       }
   *       function keyReleased() {
   *         if (value == 0) {
   *           value = 255;
   *         } else {
   *           value = 0;
   *         }
   *       }
   *     </code>
   *   </div>
   */
  p5.prototype.onkeyup = function (e) {
    var keyReleased = this.keyReleased || window.keyReleased;
    this._setProperty('isKeyPressed', false);
    this._setProperty('keyIsPressed', false);
    if (typeof keyReleased === 'function') {
      keyReleased(e);
    }
  };

  /**
   * The keyTyped() function is called once every time a key is pressed, but
   * action keys such as Ctrl, Shift, and Alt are ignored. The most recent
   * key pressed will be stored in the key variable.
   *
   * @method keyTyped
   */
  p5.prototype.onkeypress = function (e) {
    var code = e.charCode || e.keyCode; // for IE, Opera
    this._setProperty('key', String.fromCharCode(code));
    var keyTyped = this.keyTyped || window.keyTyped;
    if (typeof keyTyped === 'function') {
      keyTyped(e);
    }
  };

  return p5;

});
