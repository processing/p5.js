/**
 * @module DOM
 * @submodule DOM
 * @for p5.Element
 */

import p5 from './main';

/**
 * A class to describe an
 * <a href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Getting_started" target="_blank">HTML element</a>.
 * Sketches can use many elements. Common elements include the drawing canvas,
 * buttons, sliders, webcam feeds, and so on.
 *
 * All elements share the methods of the `p5.Element` class. They're created
 * with functions such as <a href="#/p5/createCanvas">createCanvas()</a> and
 * <a href="#/p5/createButton">createButton()</a>.
 *
 * @class p5.Element
 * @param {HTMLElement} elt wrapped DOM element.
 * @param {p5} [pInst] pointer to p5 instance.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Create a button element and
 *   // place it beneath the canvas.
 *   let btn = createButton('change');
 *   btn.position(0, 100);
 *
 *   // Call randomColor() when
 *   // the button is pressed.
 *   btn.mousePressed(randomColor);
 *
 *   describe('A gray square with a button that says "change" beneath it. The square changes color when the user presses the button.');
 * }
 *
 * // Paint the background either
 * // red, yellow, blue, or green.
 * function randomColor() {
 *   let c = random(['red', 'yellow', 'blue', 'green']);
 *   background(c);
 * }
 * </code>
 * </div>
 */
p5.Element = class {
  constructor(elt, pInst) {
    this.elt = elt;
    this._pInst = this._pixelsState = pInst;
    this._events = {};
    this.width = this.elt.offsetWidth;
    this.height = this.elt.offsetHeight;
  }

  /**
   * Attaches this element to a parent element.
   *
   * For example, a `&lt;div&gt;&lt;/div&gt;` element may be used as a box to
   * hold two pieces of text, a header and a paragraph. The
   * `&lt;div&gt;&lt;/div&gt;` is the parent element of both the header and
   * paragraph.
   *
   * The parameter `parent` can have one of three types. `parent` can be a
   * string with the parent element's ID, as in
   * `myElement.parent('container')`. It can also be another
   * <a href="#/p5.Element">p5.Element</a> object, as in
   * `myElement.parent(myDiv)`. Finally, `parent` can be an `HTMLElement`
   * object, as in `myElement.parent(anotherElement)`.
   *
   * Calling `myElement.parent()` without an argument returns this element's
   * parent.
   *
   * @param  {String|p5.Element|Object} parent ID, <a href="#/p5.Element">p5.Element</a>,
   *                                           or HTMLElement of desired parent element.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * function setup()  {
   *   background(200);
   *
   *   // Create a div element.
   *   let div = createDiv();
   *   // Place the div in the top-left corner.
   *   div.position(10, 20);
   *   // Set its width and height.
   *   div.size(80, 60);
   *   // Set its background color to white
   *   div.style('background-color', 'white');
   *   // Align any text to the center.
   *   div.style('text-align', 'center');
   *   // Set its ID to "container".
   *   div.id('container');
   *
   *   // Create a paragraph element.
   *   let p = createP('p5*js');
   *   // Make the div its parent
   *   // using its ID "container".
   *   p.parent('container');
   *
   *   describe('The text "p5*js" written in black at the center of a white rectangle. The rectangle is inside a gray square.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup()  {
   *   background(200);
   *
   *   // Create rectangular div element.
   *   let div = createDiv();
   *   // Place the div in the top-left corner.
   *   div.position(10, 20);
   *   // Set its width and height.
   *   div.size(80, 60);
   *   // Set its background color and align
   *   // any text to the center.
   *   div.style('background-color', 'white');
   *   div.style('text-align', 'center');
   *
   *   // Create a paragraph element.
   *   let p = createP('p5*js');
   *   // Make the div its parent.
   *   p.parent(div);
   *
   *   describe('The text "p5*js" written in black at the center of a white rectangle. The rectangle is inside a gray square.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup()  {
   *   background(200);
   *
   *   // Create rectangular div element.
   *   let div = createDiv();
   *   // Place the div in the top-left corner.
   *   div.position(10, 20);
   *   // Set its width and height.
   *   div.size(80, 60);
   *   // Set its background color and align
   *   // any text to the center.
   *   div.style('background-color', 'white');
   *   div.style('text-align', 'center');
   *
   *   // Create a paragraph element.
   *   let p = createP('p5*js');
   *   // Make the div its parent
   *   // using the underlying
   *   // HTMLElement.
   *   p.parent(div.elt);
   *
   *   describe('The text "p5*js" written in black at the center of a white rectangle. The rectangle is inside a gray square.');
   * }
   * </code>
   * </div>
   */
  /**
   * @return {p5.Element}
   */
  parent(p) {
    if (typeof p === 'undefined') {
      return this.elt.parentNode;
    }

    if (typeof p === 'string') {
      if (p[0] === '#') {
        p = p.substring(1);
      }
      p = document.getElementById(p);
    } else if (p instanceof p5.Element) {
      p = p.elt;
    }
    p.appendChild(this.elt);
    return this;
  }

  /**
   * Sets this element's ID using a given string.
   *
   * Calling `myElement.id()` without an argument returns its ID as a string.
   *
   * @param  {String} id ID of the element.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Set the canvas' ID
   *   // to "mycanvas".
   *   cnv.id('mycanvas');
   *
   *   // Get the canvas' ID.
   *   let id = cnv.id();
   *   text(id, 24, 54);
   *
   *   describe('The text "mycanvas" written in black on a gray background.');
   * }
   * </code>
   * </div>
   */
  /**
   * @return {String} ID of the element.
   */
  id(id) {
    if (typeof id === 'undefined') {
      return this.elt.id;
    }

    this.elt.id = id;
    this.width = this.elt.offsetWidth;
    this.height = this.elt.offsetHeight;
    return this;
  }

  /**
   * Adds a
   * <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class" target="_blank">class attribute</a>
   * to the element.
   *
   * Calling `myElement.class()` without an argument returns a string with its current classes.
   *
   * @param  {String} class class to add.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Add the class "small" to the
   *   // canvas element.
   *   cnv.class('small');
   *
   *   // Get the canvas element's class
   *   // and display it.
   *   let c = cnv.class();
   *   text(c, 35, 54);
   *
   *   describe('The word "small" written in black on a gray canvas.');
   *
   * }
   * </code>
   * </div>
   */
  /**
   * @return {String} element's classes, if any.
   */
  class(c) {
    if (typeof c === 'undefined') {
      return this.elt.className;
    }

    this.elt.className = c;
    return this;
  }

  /**
   * Calls a function when the mouse is pressed over the element.
   * Calling `myElement.mousePressed(false)` disables the function.
   *
   * Note: Some mobile browsers may also trigger this event when the element
   * receives a quick tap.
   *
   * @param  {Function|Boolean} fxn function to call when the mouse is
   *                                pressed over the element.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Call randomColor() when the canvas
   *   // is pressed.
   *   cnv.mousePressed(randomColor);
   *
   *   describe('A gray square changes color when the mouse is pressed.');
   * }
   *
   * // Paint the background either
   * // red, yellow, blue, or green.
   * function randomColor() {
   *   let c = random(['red', 'yellow', 'blue', 'green']);
   *   background(c);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Paint the background either
   *   // red, yellow, blue, or green
   *   // when the canvas is pressed.
   *   cnv.mousePressed(() => {
   *     let c = random(['red', 'yellow', 'blue', 'green']);
   *     background(c);
   *   });
   *
   *   describe('A gray square changes color when the mouse is pressed.');
   * }
   * </code>
   * </div>
   */
  mousePressed(fxn) {
    // Prepend the mouse property setters to the event-listener.
    // This is required so that mouseButton is set correctly prior to calling the callback (fxn).
    // For details, see https://github.com/processing/p5.js/issues/3087.
    const eventPrependedFxn = function (event) {
      this._pInst._setProperty('mouseIsPressed', true);
      this._pInst._setMouseButton(event);
      // Pass along the return-value of the callback:
      return fxn.call(this, event);
    };
    // Pass along the event-prepended form of the callback.
    p5.Element._adjustListener('mousedown', eventPrependedFxn, this);
    return this;
  }

  /**
   * Calls a function when the mouse is pressed twice over the element.
   * Calling `myElement.doubleClicked(false)` disables the function.
   *
   * @param  {Function|Boolean} fxn function to call when the mouse is
   *                                double clicked over the element.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Call randomColor() when the
   *   // canvas is double-clicked.
   *   cnv.doubleClicked(randomColor);
   *
   *   describe('A gray square changes color when the user double-clicks the canvas.');
   * }
   *
   * // Paint the background either
   * // red, yellow, blue, or green.
   * function randomColor() {
   *   let c = random(['red', 'yellow', 'blue', 'green']);
   *   background(c);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Paint the background either
   *   // red, yellow, blue, or green
   *   // when the canvas is double-clicked.
   *   cnv.doubleClicked(() => {
   *     let c = random(['red', 'yellow', 'blue', 'green']);
   *     background(c);
   *   });
   *
   *   describe('A gray square changes color when the user double-clicks the canvas.');
   * }
   * </code>
   * </div>
   */
  doubleClicked(fxn) {
    p5.Element._adjustListener('dblclick', fxn, this);
    return this;
  }

  /**
   * Calls a function when the mouse wheel scrolls over th element.
   *
   * The callback function, `fxn`, is passed an `event` object. `event` has
   * two numeric properties, `deltaY` and `deltaX`. `event.deltaY` is
   * negative if the mouse wheel rotates away from the user. It's positive if
   * the mouse wheel rotates toward the user. `event.deltaX` is positive if
   * the mouse wheel moves to the right. It's negative if the mouse wheel moves
   * to the left.
   *
   * Calling `myElement.mouseWheel(false)` disables the function.
   *
   * @param  {Function|Boolean} fxn function to call when the mouse wheel is
   *                                scrolled over the element.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Call randomColor() when the
   *   // mouse wheel moves.
   *   cnv.mouseWheel(randomColor);
   *
   *   describe('A gray square changes color when the user scrolls the mouse wheel over the canvas.');
   * }
   *
   * // Paint the background either
   * // red, yellow, blue, or green.
   * function randomColor() {
   *   let c = random(['red', 'yellow', 'blue', 'green']);
   *   background(c);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Paint the background either
   *   // red, yellow, blue, or green
   *   // when the mouse wheel moves.
   *   cnv.mouseWheel(() => {
   *     let c = random(['red', 'yellow', 'blue', 'green']);
   *     background(c);
   *   });
   *
   *   describe('A gray square changes color when the user scrolls the mouse wheel over the canvas.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Call changeBackground() when the
   *   // mouse wheel moves.
   *   cnv.mouseWheel(changeBackground);
   *
   *   describe('A gray square. When the mouse wheel scrolls over the square, it changes color and displays shapes.');
   * }
   *
   * function changeBackground(event) {
   *   // Change the background color
   *   // based on deltaY.
   *   if (event.deltaY > 0) {
   *     background('deeppink');
   *   } else if (event.deltaY < 0) {
   *     background('cornflowerblue');
   *   } else {
   *     background(200);
   *   }
   *
   *   // Draw a shape based on deltaX.
   *   if (event.deltaX > 0) {
   *     circle(50, 50, 20);
   *   } else if (event.deltaX < 0) {
   *     square(40, 40, 20);
   *   }
   * }
   * </code>
   * </div>
   */
  mouseWheel(fxn) {
    p5.Element._adjustListener('wheel', fxn, this);
    return this;
  }

  /**
   * Calls a function when the mouse is released over the element. Calling
   * `myElement.mouseReleased(false)` disables the function.
   *
   * Note: Some mobile browsers may also trigger this event when the element
   * receives a quick tap.
   *
   * @param  {Function|Boolean} fxn function to call when the mouse is
   *                                pressed over the element.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Call randomColor() when a
   *   // mouse press ends.
   *   cnv.mouseReleased(randomColor);
   *
   *   describe('A gray square changes color when the user releases a mouse press.');
   * }
   *
   * // Paint the background either
   * // red, yellow, blue, or green.
   * function randomColor() {
   *   let c = random(['red', 'yellow', 'blue', 'green']);
   *   background(c);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Paint the background either
   *   // red, yellow, blue, or green
   *   // when a mouse press ends.
   *   cnv.mouseReleased(() => {
   *     let c = random(['red', 'yellow', 'blue', 'green']);
   *     background(c);
   *   });
   *
   *   describe('A gray square changes color when the user releases a mouse press.');
   * }
   * </code>
   * </div>
   */
  mouseReleased(fxn) {
    p5.Element._adjustListener('mouseup', fxn, this);
    return this;
  }

  /**
   * Calls a function when the mouse is pressed and released over the element.
   * Calling `myElement.mouseReleased(false)` disables the function.
   *
   * Note: Some mobile browsers may also trigger this event when the element
   * receives a quick tap.
   *
   * @param  {Function|Boolean} fxn function to call when the mouse is
   *                                pressed and released over the element.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Call randomColor() when a
   *   // mouse press ends.
   *   cnv.mouseClicked(randomColor);
   *
   *   describe('A gray square changes color when the user releases a mouse press.');
   * }
   *
   * // Paint the background either
   * // red, yellow, blue, or green.
   * function randomColor() {
   *   let c = random(['red', 'yellow', 'blue', 'green']);
   *   background(c);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Paint the background either
   *   // red, yellow, blue, or green
   *   // when a mouse press ends.
   *   cnv.mouseClicked(() => {
   *     let c = random(['red', 'yellow', 'blue', 'green']);
   *     background(c);
   *   });
   *
   *   describe('A gray square changes color when the user releases a mouse press.');
   * }
   * </code>
   * </div>
   */
  mouseClicked(fxn) {
    p5.Element._adjustListener('click', fxn, this);
    return this;
  }

  /**
   * Calls a function when the mouse moves over the element. Calling
   * `myElement.mouseMoved(false)` disables the function.
   *
   * @param  {Function|Boolean} fxn function to call when the mouse
   *                                moves over the element.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Call randomColor() when the
   *   // mouse moves.
   *   cnv.mouseMoved(randomColor);
   *
   *   describe('A gray square changes color when the mouse moves over the canvas.');
   * }
   *
   * // Paint the background either
   * // red, yellow, blue, or green.
   * function randomColor() {
   *   let c = random(['red', 'yellow', 'blue', 'green']);
   *   background(c);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Paint the background either
   *   // red, yellow, blue, or green
   *   // when the mouse moves.
   *   cnv.mouseMoved(() => {
   *     let c = random(['red', 'yellow', 'blue', 'green']);
   *     background(c);
   *   });
   *
   *   describe('A gray square changes color when the mouse moves over the canvas.');
   * }
   * </code>
   * </div>
   */
  mouseMoved(fxn) {
    p5.Element._adjustListener('mousemove', fxn, this);
    return this;
  }

  /**
   * Calls a function when the mouse moves onto the element. Calling
   * `myElement.mouseOver(false)` disables the function.
   *
   * @param  {Function|Boolean} fxn function to call when the mouse
   *                                moves onto the element.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Call randomColor() when the
   *   // mouse moves onto the canvas.
   *   cnv.mouseOver(randomColor);
   *
   *   describe('A gray square changes color when the mouse moves onto the canvas.');
   * }
   *
   * // Paint the background either
   * // red, yellow, blue, or green.
   * function randomColor() {
   *   let c = random(['red', 'yellow', 'blue', 'green']);
   *   background(c);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Paint the background either
   *   // red, yellow, blue, or green
   *   // when the mouse moves onto
   *   // the canvas.
   *   cnv.mouseOver(() => {
   *     let c = random(['red', 'yellow', 'blue', 'green']);
   *     background(c);
   *   });
   *
   *   describe('A gray square changes color when the mouse moves onto the canvas.');
   * }
   * </code>
   * </div>
   */
  mouseOver(fxn) {
    p5.Element._adjustListener('mouseover', fxn, this);
    return this;
  }

  /**
   * Calls a function when the mouse moves off the element. Calling
   * `myElement.mouseOut(false)` disables the function.
   *
   * @param  {Function|Boolean} fxn function to call when the mouse
   *                                moves off the element.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Call randomColor() when the
   *   // mouse moves off the canvas.
   *   cnv.mouseOut(randomColor);
   *
   *   describe('A gray square changes color when the mouse moves off the canvas.');
   * }
   *
   * // Paint the background either
   * // red, yellow, blue, or green.
   * function randomColor() {
   *   let c = random(['red', 'yellow', 'blue', 'green']);
   *   background(c);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Paint the background either
   *   // red, yellow, blue, or green
   *   // when the mouse moves off
   *   // the canvas.
   *   cnv.mouseOut(() => {
   *     let c = random(['red', 'yellow', 'blue', 'green']);
   *     background(c);
   *   });
   *
   *   describe('A gray square changes color when the mouse moves off the canvas.');
   * }
   * </code>
   * </div>
   */
  mouseOut(fxn) {
    p5.Element._adjustListener('mouseout', fxn, this);
    return this;
  }

  /**
   * Calls a function when the element is touched. Calling
   * `myElement.touchStarted(false)` disables the function.
   *
   * Note: Touch functions only work on mobile devices.
   *
   * @param  {Function|Boolean} fxn function to call when the touch
   *                                starts.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Call randomColor() when the
   *   // user touches the canvas.
   *   cnv.touchStarted(randomColor);
   *
   *   describe('A gray square changes color when the user touches the canvas.');
   * }
   *
   * // Paint the background either
   * // red, yellow, blue, or green.
   * function randomColor() {
   *   let c = random(['red', 'yellow', 'blue', 'green']);
   *   background(c);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Paint the background either
   *   // red, yellow, blue, or green
   *   // when the user touches the
   *   // canvas.
   *   cnv.touchStarted(() => {
   *     let c = random(['red', 'yellow', 'blue', 'green']);
   *     background(c);
   *   });
   *
   *   describe('A gray square changes color when the user touches the canvas.');
   * }
   * </code>
   * </div>
   */
  touchStarted(fxn) {
    p5.Element._adjustListener('touchstart', fxn, this);
    return this;
  }

  /**
   * Calls a function when the user touches the element and moves their
   * finger. Calling `myElement.touchMoved(false)` disables the
   * function.
   *
   * Note: Touch functions only work on mobile devices.
   *
   * @param  {Function|Boolean} fxn function to call when the touch
   *                                moves over the element.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Call randomColor() when the
   *   // user touches the canvas
   *   // and moves.
   *   cnv.touchMoved(randomColor);
   *
   *   describe('A gray square changes color when the user touches the canvas and moves.');
   * }
   *
   * // Paint the background either
   * // red, yellow, blue, or green.
   * function randomColor() {
   *   let c = random(['red', 'yellow', 'blue', 'green']);
   *   background(c);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Paint the background either
   *   // red, yellow, blue, or green
   *   // when the user touches the
   *   // canvas and moves.
   *   cnv.touchMoved(() => {
   *     let c = random(['red', 'yellow', 'blue', 'green']);
   *     background(c);
   *   });
   *
   *   describe('A gray square changes color when the user touches the canvas and moves.');
   * }
   * </code>
   * </div>
   */
  touchMoved(fxn) {
    p5.Element._adjustListener('touchmove', fxn, this);
    return this;
  }

  /**
   * Calls a function when the user stops touching the element. Calling
   * `myElement.touchMoved(false)` disables the function.
   *
   * Note: Touch functions only work on mobile devices.
   *
   * @param  {Function|Boolean} fxn function to call when the touch
   *                                ends.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Call randomColor() when the
   *   // user touches the canvas,
   *   // then lifts their finger.
   *   cnv.touchEnded(randomColor);
   *
   *   describe('A gray square changes color when the user touches the canvas, then lifts their finger.');
   * }
   *
   * // Paint the background either
   * // red, yellow, blue, or green.
   * function randomColor() {
   *   let c = random(['red', 'yellow', 'blue', 'green']);
   *   background(c);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Paint the background either
   *   // red, yellow, blue, or green
   *   // when the user touches the
   *   // canvas, then lifts their
   *   // finger.
   *   cnv.touchEnded(() => {
   *     let c = random(['red', 'yellow', 'blue', 'green']);
   *     background(c);
   *   });
   *
   *   describe('A gray square changes color when the user touches the canvas, then lifts their finger.');
   * }
   * </code>
   * </div>
   */
  touchEnded(fxn) {
    p5.Element._adjustListener('touchend', fxn, this);
    return this;
  }

  /**
   * Calls a function when a file is dragged over the element. Calling
   * `myElement.dragOver(false)` disables the function.
   *
   * @param  {Function|Boolean} fxn function to call when the file is
   *                                dragged over the element.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * // Drag a file over the canvas to test.
   *
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Call helloFile() when a
   *   // file is dragged over
   *   // the canvas.
   *   cnv.dragOver(helloFile);
   *
   *   describe('A gray square. The text "hello, file" appears when a file is dragged over the square.');
   * }
   *
   * function helloFile() {
   *   text('hello, file', 50, 50);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Drag a file over the canvas to test.
   *
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Say "hello, file" when a
   *   // file is dragged over
   *   // the canvas.
   *   cnv.dragOver(() => {
   *     text('hello, file', 50, 50);
   *   });
   *
   *   describe('A gray square. The text "hello, file" appears when a file is dragged over the square.');
   * }
   * </code>
   * </div>
   */
  dragOver(fxn) {
    p5.Element._adjustListener('dragover', fxn, this);
    return this;
  }

  /**
   * Calls a function when a file is dragged off the element. Calling
   * Calling `myElement.dragLeave(false)` disables the function.
   *
   * @param  {Function|Boolean} fxn function to call when the file is
   *                                dragged off the element.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * // Drag a file over, then off
   * // the canvas to test.
   *
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Call byeFile() when a
   *   // file is dragged over,
   *   // then off the canvas.
   *   cnv.dragLeave(byeFile);
   *
   *   describe('A gray square. The text "bye, file" appears when a file is dragged over, then off the square.');
   * }
   *
   * function byeFile() {
   *   text('bye, file', 50, 50);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Drag a file over, then off
   * // the canvas to test.
   *
   * function setup() {
   *   // Create a canvas element and
   *   // assign it to cnv.
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Say "bye, file" when a
   *   // file is dragged over,
   *   // then off the canvas.
   *   cnv.dragLeave(() => {
   *     text('bye, file', 50, 50);
   *   });
   *
   *   describe('A gray square. The text "bye, file" appears when a file is dragged over, then off the square.');
   * }
   * </code>
   * </div>
   */
  dragLeave(fxn) {
    p5.Element._adjustListener('dragleave', fxn, this);
    return this;
  }


  /**
   *
   * @private
   * @static
   * @param {String} ev
   * @param {Boolean|Function} fxn
   * @param {Element} ctx
   * @chainable
   * @alt
   * General handler for event attaching and detaching
   */
  static _adjustListener(ev, fxn, ctx) {
    if (fxn === false) {
      p5.Element._detachListener(ev, ctx);
    } else {
      p5.Element._attachListener(ev, fxn, ctx);
    }
    return this;
  }
  /**
   *
   * @private
   * @static
   * @param {String} ev
   * @param {Function} fxn
   * @param {Element} ctx
   */
  static _attachListener(ev, fxn, ctx) {
    // detach the old listener if there was one
    if (ctx._events[ev]) {
      p5.Element._detachListener(ev, ctx);
    }
    const f = fxn.bind(ctx);
    ctx.elt.addEventListener(ev, f, false);
    ctx._events[ev] = f;
  }
  /**
   *
   * @private
   * @static
   * @param {String} ev
   * @param {Element} ctx
   */
  static _detachListener(ev, ctx) {
    const f = ctx._events[ev];
    ctx.elt.removeEventListener(ev, f, false);
    ctx._events[ev] = null;
  }

  /**
   * Helper fxn for sharing pixel methods
   */
  _setProperty(prop, value) {
    this[prop] = value;
  }
};

/**
 * Underlying
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement" target="_blank">HTMLElement</a>
 * object. Its properties and methods can be used directly.
 *
 * @example
 * <div>
 * <code>
 * function setup() {
 *   // Create a canvas element and
 *   // assign it to cnv.
 *   let cnv = createCanvas(100, 100);
 *
 *   background(200);
 *
 *   // Set the border style for the
 *   // canvas.
 *   cnv.elt.style.border = '5px dashed deeppink';
 *
 *   describe('A gray square with a pink border drawn with dashed lines.');
 * }
 * </code>
 * </div>
 *
 * @property elt
 * @for p5.Element
 * @readOnly
 */

/**
 * @type {Number}
 * @property width
 * @for p5.Element
 */

/**
 * @type {Number}
 * @property height
 * @for p5.Element
 */

export default p5.Element;
