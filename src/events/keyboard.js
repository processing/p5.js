/**
 * @module Events
 * @submodule Keyboard
 * @for p5
 * @requires core
 */

import p5 from '../core/main';

/**
 * The boolean system variable <a href="#/p5/keyIsPressed">keyIsPressed</a> is true if any key is pressed
 * and false if no keys are pressed.
 *
 * @property {Boolean} keyIsPressed
 * @readOnly
 * @example
 * <div>
 * <code>
 * function draw() {
 *   if (keyIsPressed === true) {
 *     fill(0);
 *   } else {
 *     fill(255);
 *   }
 *   rect(25, 25, 50, 50);
 *   describe('50-by-50 white rect that turns black on keypress.');
 * }
 * </code>
 * </div>
 */
p5.prototype.isKeyPressed = false;
p5.prototype.keyIsPressed = false; // khan

/**
 * The system variable key always contains the value of the most recent
 * key on the keyboard that was typed. To get the proper capitalization, it
 * is best to use it within <a href="#/p5/keyTyped">keyTyped()</a>. For non-ASCII keys, use the <a href="#/p5/keyCode">keyCode</a>
 * variable.
 *
 * @property {String} key
 * @readOnly
 * @example
 * <div><code>
 * // Click any key to display it!
 * // (Not Guaranteed to be Case Sensitive)
 * function setup() {
 *   fill(245, 123, 158);
 *   textSize(50);
 * }
 *
 * function draw() {
 *   background(200);
 *   text(key, 33, 65); // Display last key pressed.
 *   describe('canvas displays any key value that is pressed in pink font.');
 * }
 * </code></div>
 */
p5.prototype.key = '';

/**
 * The variable keyCode is used to detect special keys such as BACKSPACE,
 * DELETE, ENTER, RETURN, TAB, ESCAPE, SHIFT, CONTROL, OPTION, ALT, UP_ARROW,
 * DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW.
 * You can also check for custom keys by looking up the keyCode of any key
 * on a site like this: <a href="http://keycode.info/">keycode.info</a>.
 *
 * @property {Integer} keyCode
 * @readOnly
 * @example
 * <div><code>
 * let fillVal = 126;
 * function draw() {
 *   fill(fillVal);
 *   rect(25, 25, 50, 50);
 *   describe(`Grey rect center. turns white when up arrow pressed and black when down.
 *     Display key pressed and its keyCode in a yellow box.`);
 * }
 *
 * function keyPressed() {
 *   if (keyCode === UP_ARROW) {
 *     fillVal = 255;
 *   } else if (keyCode === DOWN_ARROW) {
 *     fillVal = 0;
 *   }
 * }
 * </code></div>
 * <div><code>
 * function draw() {}
 * function keyPressed() {
 *   background('yellow');
 *   text(`${key} ${keyCode}`, 10, 40);
 *   print(key, ' ', keyCode);
 * }
 * </code></div>
 */
p5.prototype.keyCode = 0;

/**
 * The <a href="#/p5/keyPressed">keyPressed()</a> function is called once every time a key is pressed. The
 * keyCode for the key that was pressed is stored in the <a href="#/p5/keyCode">keyCode</a> variable.
 *
 * For non-ASCII keys, use the keyCode variable. You can check if the keyCode
 * equals BACKSPACE, DELETE, ENTER, RETURN, TAB, ESCAPE, SHIFT, CONTROL,
 * OPTION, ALT, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW.
 *
 * For ASCII keys, the key that was pressed is stored in the key variable. However, it
 * does not distinguish between uppercase and lowercase. For this reason, it
 * is recommended to use <a href="#/p5/keyTyped">keyTyped()</a> to read the key variable, in which the
 * case of the variable will be distinguished.
 *
 * Because of how operating systems handle key repeats, holding down a key
 * may cause multiple calls to <a href="#/p5/keyTyped">keyTyped()</a> (and <a href="#/p5/keyReleased">keyReleased()</a> as well). The
 * rate of repeat is set by the operating system and how each computer is
 * configured.<br><br>
 * Browsers may have different default
 * behaviors attached to various key events. To prevent any default
 * behavior for this event, add "return false" to the end of the method.
 *
 * @method keyPressed
 * @param  {KeyboardEvent} [event] optional KeyboardEvent callback argument.
 * @example
 * <div>
 * <code>
 * let value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 *   describe(`black rect center. turns white when key pressed and black
 *     when released.`);
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
 * let value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 *   describe(`black rect center. turns white when left arrow pressed and
 *     black when right.`);
 * }
 * function keyPressed() {
 *   if (keyCode === LEFT_ARROW) {
 *     value = 255;
 *   } else if (keyCode === RIGHT_ARROW) {
 *     value = 0;
 *   }
 * }
 * </code>
 * </div>
 * <div class="norender">
 * <code>
 * function keyPressed() {
 *   // Do something
 *   return false; // prevent any default behaviour
 * }
 * </code>
 * </div>
 */
p5.prototype._onkeydown = function(e) {
  if (this._downKeys[e.which]) {
    // prevent multiple firings
    return;
  }
  this._setProperty('isKeyPressed', true);
  this._setProperty('keyIsPressed', true);
  this._setProperty('keyCode', e.which);
  this._downKeys[e.which] = true;
  this._setProperty('key', e.key || String.fromCharCode(e.which) || e.which);
  const context = this._isGlobal ? window : this;
  if (typeof context.keyPressed === 'function' && !e.charCode) {
    const executeDefault = context.keyPressed(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  }
};
/**
 * The <a href="#/p5/keyReleased">keyReleased()</a> function is called once every time a key is released.
 * See <a href="#/p5/key">key</a> and <a href="#/p5/keyCode">keyCode</a> for more information.<br><br>
 * Browsers may have different default
 * behaviors attached to various key events. To prevent any default
 * behavior for this event, add "return false" to the end of the function.
 *
 * @method keyReleased
 * @param  {KeyboardEvent} [event] optional KeyboardEvent callback argument.
 * @example
 * <div>
 * <code>
 * let value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 *   describe(`black rect center. turns white when key pressed and black
 *     when pressed again`);
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
p5.prototype._onkeyup = function(e) {
  this._downKeys[e.which] = false;

  if (!this._areDownKeys()) {
    this._setProperty('isKeyPressed', false);
    this._setProperty('keyIsPressed', false);
  }

  this._setProperty('_lastKeyCodeTyped', null);

  this._setProperty('key', e.key || String.fromCharCode(e.which) || e.which);
  this._setProperty('keyCode', e.which);

  const context = this._isGlobal ? window : this;
  if (typeof context.keyReleased === 'function') {
    const executeDefault = context.keyReleased(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  }
};

/**
 * The <a href="#/p5/keyTyped">keyTyped()</a> function is called once every time a key is pressed, but
 * action keys such as Backspace, Delete, Ctrl, Shift, and Alt are ignored. If you are trying to detect
 * a keyCode for one of these keys, use the <a href="#/p5/keyPressed">keyPressed()</a> function instead.
 * The most recent key typed will be stored in the key variable.
 *
 * Because of how operating systems handle key repeats, holding down a key
 * will cause multiple calls to <a href="#/p5/keyTyped">keyTyped()</a> (and <a href="#/p5/keyReleased">keyReleased()</a> as well). The
 * rate of repeat is set by the operating system and how each computer is
 * configured.<br><br>
 * Browsers may have different default behaviors attached to various key
 * events. To prevent any default behavior for this event, add "return false"
 * to the end of the function.
 *
 * @method keyTyped
 * @param  {KeyboardEvent} [event] optional KeyboardEvent callback argument.
 * @example
 * <div>
 * <code>
 * let value = 0;
 * function draw() {
 *   fill(value);
 *   rect(25, 25, 50, 50);
 *   describe(`black rect center. turns white when 'a' key typed and
 *     black when 'b' pressed`);
 * }
 * function keyTyped() {
 *   if (key === 'a') {
 *     value = 255;
 *   } else if (key === 'b') {
 *     value = 0;
 *   }
 *   // uncomment to prevent any default behavior
 *   // return false;
 * }
 * </code>
 * </div>
 */
p5.prototype._onkeypress = function(e) {
  if (e.which === this._lastKeyCodeTyped) {
    // prevent multiple firings
    return;
  }
  this._setProperty('_lastKeyCodeTyped', e.which); // track last keyCode
  this._setProperty('key', e.key || String.fromCharCode(e.which) || e.which);

  const context = this._isGlobal ? window : this;
  if (typeof context.keyTyped === 'function') {
    const executeDefault = context.keyTyped(e);
    if (executeDefault === false) {
      e.preventDefault();
    }
  }
};
/**
 * The onblur function is called when the user is no longer focused
 * on the p5 element. Because the keyup events will not fire if the user is
 * not focused on the element we must assume all keys currently down have
 * been released.
 */
p5.prototype._onblur = function(e) {
  this._downKeys = {};
};

/**
 * The <a href="#/p5/keyIsDown">keyIsDown()</a> function checks if the key is currently down, i.e. pressed.
 * It can be used if you have an object that moves, and you want several keys
 * to be able to affect its behaviour simultaneously, such as moving a
 * sprite diagonally. You can put in any number representing the keyCode of
 * the key, or use any of the variable <a href="#/p5/keyCode">keyCode</a> names listed
 * <a href="http://p5js.org/reference/#p5/keyCode">here</a>.
 *
 * @method keyIsDown
 * @param {Number}          code The key to check for.
 * @return {Boolean}        whether key is down or not
 * @example
 * <div><code>
 * let x = 100;
 * let y = 100;
 *
 * function setup() {
 *   createCanvas(512, 512);
 *   fill(255, 0, 0);
 * }
 *
 * function draw() {
 *   if (keyIsDown(LEFT_ARROW)) {
 *     x -= 5;
 *   }
 *
 *   if (keyIsDown(RIGHT_ARROW)) {
 *     x += 5;
 *   }
 *
 *   if (keyIsDown(UP_ARROW)) {
 *     y -= 5;
 *   }
 *
 *   if (keyIsDown(DOWN_ARROW)) {
 *     y += 5;
 *   }
 *
 *   clear();
 *   ellipse(x, y, 50, 50);
 *   describe(`50-by-50 red ellipse moves left, right, up, and
 *     down with arrow presses.`);
 * }
 * </code></div>
 *
 * <div><code>
 * let diameter = 50;
 *
 * function setup() {
 *   createCanvas(512, 512);
 * }
 *
 * function draw() {
 *   // 107 and 187 are keyCodes for "+"
 *   if (keyIsDown(107) || keyIsDown(187)) {
 *     diameter += 1;
 *   }
 *
 *   // 109 and 189 are keyCodes for "-"
 *   if (keyIsDown(109) || keyIsDown(189)) {
 *     diameter -= 1;
 *   }
 *
 *   clear();
 *   fill(255, 0, 0);
 *   ellipse(50, 50, diameter, diameter);
 *   describe(`50-by-50 red ellipse gets bigger or smaller when
 *     + or - are pressed.`);
 * }
 * </code></div>
 */
p5.prototype.keyIsDown = function(code) {
  p5._validateParameters('keyIsDown', arguments);
  return this._downKeys[code] || false;
};

/**
 * The _areDownKeys function returns a boolean true if any keys pressed
 * and a false if no keys are currently pressed.

 * Helps avoid instances where multiple keys are pressed simultaneously and
 * releasing a single key will then switch the
 * keyIsPressed property to true.
 * @private
**/
p5.prototype._areDownKeys = function() {
  for (const key in this._downKeys) {
    if (this._downKeys.hasOwnProperty(key) && this._downKeys[key] === true) {
      return true;
    }
  }
  return false;
};

export default p5;
