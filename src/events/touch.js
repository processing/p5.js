/**
 * @module Events
 * @submodule Touch
 * @for p5
 * @requires core
 */

function touch(p5, fn){
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
  fn.touches = [];

  fn._updateTouchCoords = function(e) {
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
      this.touches = touches;
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
  fn._ontouchstart = function(e) {
    this.mouseIsPressed = true;
    this._updateTouchCoords(e);
    this._updateNextMouseCoords(e);
    this._updateMouseCoords(); // reset pmouseXY at the start of each touch event
  };

  fn._ontouchmove = function(e) {
    const context = this._isGlobal ? window : this;
    let executeDefault;
    this._updateTouchCoords(e);
    this._updateNextMouseCoords(e);
    if (typeof context.mouseDragged === 'function') {
      executeDefault = context.mouseDragged(e);
      if (executeDefault === false) {
        e.preventDefault();
      }
    }
  };

  fn._ontouchend = function(e) {
    this.mouseIsPressed = false;
    this._updateTouchCoords(e);
    this._updateNextMouseCoords(e);
  };
}

export default touch;

if(typeof p5 !== 'undefined'){
  touch(p5, p5.prototype);
}
