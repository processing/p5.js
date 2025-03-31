/**
 * @module Events
 * @submodule Keyboard
 * @for p5
 * @requires core
 */
export function isCode(input) {
  const leftRightKeys = [
    'Alt',
    'Shift',
    'Control',
    'Meta',
  ];
  if (leftRightKeys.includes(input)) {
    return false;
  }
  if (typeof input !== 'string') {
    return false;
  }
  return input.length > 1;
}
function keyboard(p5, fn){
  /**
   * A `Boolean` system variable that's `true` if any key is currently pressed
   * and `false` if not.
   *
   * @property {Boolean} keyIsPressed
   * @readOnly
   *
   * @example
   * <div>
   * <code>
   * // Click on the canvas to begin detecting key presses.
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe(
   *     'A gray square with a white square at its center. The white square turns black when the user presses a key.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the square.
   *   if (keyIsPressed === true) {
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
   *
   * <div>
   * <code>
   * // Click on the canvas to begin detecting key presses.
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe(
   *     'A gray square with a white square at its center. The white square turns black when the user presses a key.'
   *   );
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Style the square.
   *   if (keyIsPressed) {
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
   *
   * <div>
   * <code>
   * // Click on the canvas to begin detecting key presses.
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe(
   *     'A gray square with the word "false" at its center. The word switches to "true" when the user presses a key.'
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
   *   // Display the value of keyIsPressed.
   *   text(keyIsPressed, 50, 50);
   * }
   * </code>
   * </div>
   */

  fn.keyIsPressed = false;
  fn.code = null;

  /**
   * A `String` system variable that contains the value of the last key typed.
   *
   * The key variable is helpful for checking whether an
   * <a href="https://en.wikipedia.org/wiki/ASCII#Printable_characters" target="_blank">ASCII</a>
   * key has been typed. For example, the expression `key === "a"` evaluates to
   * `true` if the `a` key was typed and `false` if not. `key` doesn’t update
   * for special keys such as `LEFT_ARROW` and `ENTER`. Use keyCode instead for
   * special keys. The <a href="#/p5/keyIsDown">keyIsDown()</a> function should
   * be used to check for multiple different key presses at the same time.
   *
   * @property {String} key
   * @readOnly
   *
   * @example
   * <div>
   * <code>
   * // Click on the canvas to begin detecting key presses.
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe(
   *     'A gray square. The last key pressed is displayed at the center.'
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
   *   // Display the last key pressed.
   *   text(key, 50, 50);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click on the canvas to begin detecting key presses.
   *
   * let x = 50;
   * let y = 50;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   describe(
   *     'A gray square with a black circle at its center. The circle moves when the user presses the keys "w", "a", "s", or "d". It leaves a trail as it moves.'
   *   );
   * }
   *
   * function draw() {
   *   // Update x and y if a key is pressed.
   *   if (keyIsPressed === true) {
   *     if (key === 'w') {
   *       y -= 1;
   *     } else if (key === 's') {
   *       y += 1;
   *     } else if (key === 'a') {
   *       x -= 1;
   *     } else if (key === 'd') {
   *       x += 1;
   *     }
   *   }
   *
   *   // Style the circle.
   *   fill(0);
   *
   *   // Draw the circle at (x, y).
   *   circle(x, y, 5);
   * }
   * </code>
   * </div>
   */
  fn.key = '';

  /**
   * A `Number` system variable that contains the code of the last key pressed.
   *
   * Every key has a numeric key code. For example, the letter `a` key has the key code 65.
   * Use this key code to determine which key was pressed by comparing it to the numeric value
   * of the desired key.
   *
   * For example, to detect when the Enter key is pressed:
   *
   * ```js
   * if (keyCode === 13) { // Enter key
   *   // Code to run if the Enter key was pressed.
   * }
   * ```
   *
   * Alternatively, you can use the <a href="#/p5/key">key</a> function to directly compare the key value:
   *
   * ```js
   * if (key === 'Enter') { // Enter key
   *   // Code to run if the Enter key was pressed.
   * }
   * ```
   *
   * Use the following numeric codes for the arrow keys:
   *
   *   Up Arrow: 38  
   *   Down Arrow: 40  
   *   Left Arrow: 37  
   *   Right Arrow: 39
   *
   * More key codes can be found at websites such as 
   * <a href="http://keycode.info/">keycode.info</a>.
   *
   * @property {Integer} keyCode
   * @readOnly
   *
   * @example
   * <div>
   * <code>
   * // Click on the canvas to begin detecting key presses.
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe(
   *     'A gray square. The last key pressed and its code are displayed at the center.'
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
   *   // Display the last key pressed and its code.
   *   text(`${key} : ${keyCode}`, 50, 50);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click on the canvas to begin detecting key presses.
   *
   * let x = 50;
   * let y = 50;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   describe(
   *     'A gray square with a black circle at its center. The circle moves when the user presses an arrow key. It leaves a trail as it moves.'
   *   );
   * }
   *
   * function draw() {
   *   // Update x and y if an arrow key is pressed.
   *   if (keyIsPressed === true) {
   *     if (keyCode === 38) { // Up arrow key
   *       y -= 1;
   *     } else if (keyCode === 40) { // Down arrow key
   *       y += 1;
   *     } else if (keyCode === 37) { // Left arrow key
   *       x -= 1;
   *     } else if (keyCode === 39) { // Right arrow key
   *       x += 1;
   *     }
   *   }
   *
   *   // Style the circle.
   *   fill(0);
   *
   *   // Draw the circle at (x, y).
   *   circle(x, y, 5);
   * }
   * </code>
   * </div>
   */
  fn.keyCode = 0;

  /**
   * A function that's called once when any key is pressed.
   *
   * Declaring the function `keyPressed()` sets a code block to run once
   * automatically when the user presses any key:
   *
   * ```js
   * function keyPressed() {
   *   // Code to run.
   * }
   * ```
   *
   * The <a href="#/p5/key">key</a> and <a href="#/p5/keyCode">keyCode</a>
   * variables will be updated with the most recently typed value when
   * `keyPressed()` is called by p5.js:
   *
   * ```js
   * function keyPressed() {
   *   if (key === 'c') {
   *     // Code to run.
   *   }
   *
   *   if (keyCode === 13) { // Enter key
   *     // Code to run.
   *   }
   * }
   * ```
   *
   * The parameter, `event`, is optional. `keyPressed()` is always passed a
   * <a href="https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent" target="_blank">KeyboardEvent</a>
   * object with properties that describe the key press event:
   *
   * ```js
   * function keyPressed(event) {
   *   // Code to run that uses the event.
   *   console.log(event);
   * }
   * ```
   *
   * Browsers may have default behaviors attached to various key events. For
   * example, some browsers may jump to the bottom of a web page when the
   * `SPACE` key is pressed. To prevent any default behavior for this event, add
   * `return false;` to the end of the function.
   *
   * @method keyPressed
   * @param  {KeyboardEvent} [event] optional `KeyboardEvent` callback argument.
   *
   * @example
   * <div>
   * <code>
   * // Click on the canvas to begin detecting key presses.
   *
   * let value = 0;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe(
   *     'A gray square with a black square at its center. The inner square changes color when the user presses a key.'
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
   * // Toggle the background color when the user presses a key.
   * function keyPressed() {
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
   * // Click on the canvas to begin detecting key presses.
   *
   * let value = 0;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe(
   *     'A gray square with a white square at its center. The inner square turns black when the user presses the "b" key. It turns white when the user presses the "a" key.'
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
   * // Reassign value when the user presses the 'a' or 'b' key.
   * function keyPressed() {
   *   if (key === 'a') {
   *     value = 255;
   *   } else if (key === 'b') {
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
   * // Click on the canvas to begin detecting key presses.
   *
   * let value = 0;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe(
   *     'A gray square with a black square at its center. The inner square turns white when the user presses the left arrow key. It turns black when the user presses the right arrow key.'
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
   * // Toggle the background color when the user presses an arrow key.
   * function keyPressed() {
   *   if (keyCode === 37) { // Left arrow key
   *     value = 255;
   *   } else if (keyCode === 39) { // Right arrow key
   *     value = 0;
   *   }
   *   // Uncomment to prevent any default behavior.
   *   // return false;
   * }
   * </code>
   * </div>
   */
  fn._onkeydown = function(e) {
    if (this._downKeys[e.code]) {
      return;
    }

    this.keyIsPressed = true;
    this.keyCode = e.which;
    this.key = e.key;
    this.code = e.code;
    this._downKeyCodes[e.code] = true;
    this._downKeys[e.key] = true;

    const context = this._isGlobal ? window : this;
    if (typeof context.keyPressed === 'function' && !e.charCode) {
      const executeDefault = context.keyPressed(e);
      if (executeDefault === false) {
        e.preventDefault();
      }
    }
  };

  /**
   * A function that's called once when any key is released.
   *
   * Declaring the function `keyReleased()` sets a code block to run once
   * automatically when the user releases any key:
   *
   * ```js
   * function keyReleased() {
   *   // Code to run.
   * }
   * ```
   *
   * The <a href="#/p5/key">key</a> and <a href="#/p5/keyCode">keyCode</a>
   * variables will be updated with the most recently released value when
   * `keyReleased()` is called by p5.js:
   *
   * ```js
   * function keyReleased() {
   *   if (key === 'c') {
   *     // Code to run.
   *   }
   *
   *   if (keyCode === 13) { // Enter key
   *     // Code to run.
   *   }
   * }
   * ```
   *
   * The parameter, `event`, is optional. `keyReleased()` is always passed a
   * <a href="https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent" target="_blank">KeyboardEvent</a>
   * object with properties that describe the key press event:
   *
   * ```js
   * function keyReleased(event) {
   *   // Code to run that uses the event.
   *   console.log(event);
   * }
   * ```
   *
   * Browsers may have default behaviors attached to various key events. To
   * prevent any default behavior for this event, add `return false;` to the end
   * of the function.
   *
   * @method keyReleased
   * @param  {KeyboardEvent} [event] optional `KeyboardEvent` callback argument.
   *
   * @example
   * <div>
   * <code>
   * // Click on the canvas to begin detecting key presses.
   *
   * let value = 0;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe(
   *     'A gray square with a black square at its center. The inner square changes color when the user releases a key.'
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
   * // Toggle value when the user releases a key.
   * function keyReleased() {
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
   * // Click on the canvas to begin detecting key presses.
   *
   * let value = 0;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe(
   *     'A gray square with a black square at its center. The inner square becomes white when the user releases the "w" key.'
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
   * // Set value to 255 the user releases the 'w' key.
   * function keyReleased() {
   *   if (key === 'w') {
   *     value = 255;
   *   }
   *   // Uncomment to prevent any default behavior.
   *   // return false;
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click on the canvas to begin detecting key presses.
   *
   * let value = 0;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe(
   *     'A gray square with a black square at its center. The inner square turns white when the user presses and releases the left arrow key. It turns black when the user presses and releases the right arrow key.'
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
   * // Toggle the background color when the user releases an arrow key.
   * function keyReleased() {
   *   if (keyCode === 37) { // Left arrow key
   *     value = 255;
   *   } else if (keyCode === 39) { // Right arrow key
   *     value = 0;
   *   }
   *   // Uncomment to prevent any default behavior.
   *   // return false;
   * }
   * </code>
   * </div>
   */
  fn._onkeyup = function(e) {
    delete this._downKeyCodes[e.code];
    delete this._downKeys[e.key];


    if (!this._areDownKeys()) {
      this.keyIsPressed = false;
      this.key = '';
      this.code = null;
    } else {
      // If other keys are still pressed, update code to the last pressed key
      const lastPressedCode = Object.keys(this._downKeyCodes).pop();
      this.code = lastPressedCode;
      const lastPressedKey = Object.keys(this._downKeys).pop();
      this.key = lastPressedKey;
    }

    const context = this._isGlobal ? window : this;
    if (typeof context.keyReleased === 'function') {
      const executeDefault = context.keyReleased(e);
      if (executeDefault === false) {
        e.preventDefault();
      }
    }
  };

  /**
   * A function that's called once when keys with printable characters are pressed.
   *
   * Declaring the function `keyTyped()` sets a code block to run once
   * automatically when the user presses any key with a printable character such
   * as `a` or 1. Modifier keys such as `SHIFT`, `CONTROL`, and the arrow keys
   * will be ignored:
   *
   * ```js
   * function keyTyped() {
   *   // Code to run.
   * }
   * ```
   *
   * The <a href="#/p5/key">key</a> and <a href="#/p5/keyCode">keyCode</a>
   * variables will be updated with the most recently released value when
   * `keyTyped()` is called by p5.js:
   *
   * ```js
   * function keyTyped() {
   *   // Check for the "c" character using key.
   *   if (key === 'c') {
   *     // Code to run.
   *   }
   *
   *   // Check for "c" using keyCode.
   *   if (keyCode === 67) { // 67 is the ASCII code for 'c'
   *     // Code to run.
   *   }
   * }
   * ```
   *
   * The parameter, `event`, is optional. `keyTyped()` is always passed a
   * <a href="https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent" target="_blank">KeyboardEvent</a>
   * object with properties that describe the key press event:
   *
   * ```js
   * function keyReleased(event) {
   *   // Code to run that uses the event.
   *   console.log(event);
   * }
   * ```
   *
   * Note: Use the <a href="#/p5/keyPressed">keyPressed()</a> function and
   * <a href="#/p5/keyCode">keyCode</a> system variable to respond to modifier
   * keys such as `ALT`.
   *
   * Browsers may have default behaviors attached to various key events. To
   * prevent any default behavior for this event, add `return false;` to the end
   * of the function.
   *
   * @method keyTyped
   * @param  {KeyboardEvent} [event] optional `KeyboardEvent` callback argument.
   *
   * @example
   * <div>
   * <code>
   * // Click on the canvas to begin detecting key presses.
   * // Note: Pressing special keys such as SPACE have no effect.
   *
   * let value = 0;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe(
   *     'A gray square with a white square at its center. The inner square changes color when the user presses a key.'
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
   * // Toggle the square's color when the user types a printable key.
   * function keyTyped() {
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
   * // Click on the canvas to begin detecting key presses.
   *
   * let value = 0;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe(
   *     'A gray square with a white square at its center. The inner square turns black when the user types the "b" key. It turns white when the user types the "a" key.'
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
   * // Reassign value when the user types the 'a' or 'b' key.
   * function keyTyped() {
   *   if (key === 'a') {
   *     value = 255;
   *   } else if (key === 'b') {
   *     value = 0;
   *   }
   *   // Uncomment to prevent any default behavior.
   *   // return false;
   * }
   * </code>
   * </div>
   */
  fn._onkeypress = function(e) {
    if (e.which === this._lastKeyCodeTyped) {
      // prevent multiple firings
      return;
    }
    this._lastKeyCodeTyped = e.which; // track last keyCode
    this.key = e.key || String.fromCharCode(e.which) || e.which;

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
  fn._onblur = function(e) {
    this._downKeys = {};
  };

  /**
   * Returns `true` if the key it’s checking is pressed and `false` if not.
   *
   * `keyIsDown()` is helpful when checking for multiple different key presses.
   * For example, `keyIsDown()` can be used to check if both `LEFT_ARROW` and
   * `UP_ARROW` are pressed:
   *
   * ```js
   * if (keyIsDown(LEFT_ARROW) && keyIsDown(UP_ARROW)) {
   *   // Move diagonally.
   * }
   * ```
   *
   * `keyIsDown()` can check for key presses using
   * <a href="#/p5/keyCode">keyCode</a> values, as in `keyIsDown(37)` or
   * `keyIsDown(LEFT_ARROW)`. Key codes can be found on websites such as
   * <a href="https://keycode.info" target="_blank">keycode.info</a>.
   *
   * @method keyIsDown
   * @param {Number|String}   code key to check.
   * @return {Boolean}        whether the key is down or not.
   *
   * @example
   * <div>
   * <code>
   * // Click on the canvas to begin detecting key presses.
   *
   * let x = 50;
   * let y = 50;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   describe(
   *     'A gray square with a black circle at its center. The circle moves when the user presses an arrow key. It leaves a trail as it moves.'
   *   );
   * }
   *
   * function draw() {
   *   // Update x and y if an arrow key is pressed.
   *   if (keyIsDown(LEFT_ARROW) === true) {
   *     x -= 1;
   *   }
   *
   *   if (keyIsDown(RIGHT_ARROW) === true) {
   *     x += 1;
   *   }
   *
   *   if (keyIsDown(UP_ARROW) === true) {
   *     y -= 1;
   *   }
   *
   *   if (keyIsDown(DOWN_ARROW) === true) {
   *     y += 1;
   *   }
   *
   *   // Style the circle.
   *   fill(0);
   *
   *   // Draw the circle.
   *   circle(x, y, 5);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Click on the canvas to begin detecting key presses.
   *
   * let x = 50;
   * let y = 50;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   describe(
   *     'A gray square with a black circle at its center. The circle moves when the user presses an arrow key. It leaves a trail as it moves.'
   *   );
   * }
   *
   * function draw() {
   *   // Update x and y if an arrow key is pressed.
   *   if (keyIsDown('ArrowLeft') === true) {
   *     x -= 1;
   *   }
   *
   *   if (keyIsDown('ArrowRight') === true) {
   *     x += 1;
   *   }
   *
   *   if (keyIsDown('ArrowUp') === true) {
   *     y -= 1;
   *   }
   *
   *   if (keyIsDown('ArrowDown') === true) {
   *     y += 1;
   *   }
   *
   *   // Style the circle.
   *   fill(0);
   *
   *   // Draw the circle.
   *   circle(x, y, 5);
   * }
   * </code>
   * </div>
   */

  fn.keyIsDown = function(input) {
    if (isCode(input)) {
      return this._downKeyCodes[input] || this._downKeys[input] || false;
    } else {
      return this._downKeys[input] || this._downKeyCodes[input] || false;
    }
  }
  /**
   * The _areDownKeys function returns a boolean true if any keys pressed
   * and a false if no keys are currently pressed.

   * Helps avoid instances where multiple keys are pressed simultaneously and
   * releasing a single key will then switch the
   * keyIsPressed property to true.
   * @private
  **/
  fn._areDownKeys = function() {
    for (const key in this._downKeys) {
      if (this._downKeys.hasOwnProperty(key) && this._downKeys[key] === true) {
        return true;
      }
    }
    return false;
  };
}

export default keyboard;

if(typeof p5 !== 'undefined'){
  keyboard(p5, p5.prototype);
}
