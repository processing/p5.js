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
 * @constructor
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
 *   // Create a button element that responds
 *   // to mouse presses.
 *   let btn = createButton('click me');
 *   btn.position(0, 100);
 *   btn.mousePressed(() => {
 *     let g = random(255);
 *     background(g);
 *   });
 *
 *   describe('A gray square with a button that says "click me" beneath it. The square changes color when the button is pressed.');
 * }
 * </code>
 * </div>
 */
p5.Element = class {
  constructor(elt, pInst) {
    /**
     * Underlying
     * <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement" target="_blank">HTMLElement</a>
     * object. Its properties and methods can be used directly.
     *
     * @example
     * <div>
     * <code>
     * function setup() {
     *   let cnv = createCanvas(100, 100);
     *   cnv.elt.style.border = '5px dashed deeppink';
     *
     *   background(200);
     *
     *   describe('A gray square with a pink border drawn with dashed lines.');
     * }
     * </code>
     * </div>
     *
     * @property elt
     * @readOnly
     */
    this.elt = elt;
    /**
     * @private
     * @type {p5.Element}
     */
    this._pInst = this._pixelsState = pInst;
    this._events = {};
    /**
     * @type {Number}
     * @property width
     */
    this.width = this.elt.offsetWidth;
    /**
     * @type {Number}
     * @property height
     */
    this.height = this.elt.offsetHeight;
  }

  /**
   * Attaches this element to a parent element.
   *
   * For example, a `div` element may be used as a box to hold two pieces of
   * text, a header and a paragraph. The `div` is the parent element of both
   * the header and paragraph.
   *
   * The parameter `parent` can have one of three types. `parent` can be a
   * string with the parent element's ID, as in
   * `myElement.parent('container')`. It can also be another
   * <a href="#/p5.Element">p5.Element</a> object, as in
   * `myParagraph.parent(myDiv)`. Finally, `parent` can be an `HTMLElement`
   * object, as in `myElement.parent(someElement)`.
   *
   * Calling `myElement.parent()` without an argument returns this element's
   * parent.
   *
   * @method parent
   * @param  {String|p5.Element|Object} parent ID, <a href="#/p5.Element">p5.Element</a>,
   *                                           or HTMLElement of desired parent element.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   background(200);
   *   // Create the parent element.
   *   let d = createDiv();
   *   d.position(24, 20);
   *   d.id('theparent');
   *   // Create the child element.
   *   let p = createP('p5*js');
   *   p.parent('theparent');
   *
   *   describe('The text "p5*js" written in black on a gray background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   background(200);
   *   // Create the parent element.
   *   let d = createDiv();
   *   d.position(24, 20);
   *   // Create the child element.
   *   let p = createP('p5*js');
   *   p.parent(d);
   *
   *   describe('The text "p5*js" written in black on a gray background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   background(200);
   *   // Create the parent element.
   *   let d = createDiv();
   *   d.position(24, 20);
   *   // Create the child element.
   *   let p = createP('p5*js');
   *   p.parent(d.elt);
   *
   *   describe('The text "p5*js" written in black on a gray background.');
   * }
   * </code>
   * </div>
   */
  /**
   * @method parent
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
   * @method id
   * @param  {String} id ID of the element.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *   cnv.id('mycanvas');
   *
   *   background(200);
   *   let id = cnv.id();
   *   text(id, 24, 54);
   *
   *   describe('The text "mycanvas" written in black on a gray background.');
   * }
   * </code>
   * </div>
   */
  /**
   * @method id
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
   * @method class
   * @param  {String} class class to add.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *   cnv.class('small');
   *
   *   background(200);
   *
   *   describe('A gray square.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *   cnv.class('small');
   *
   *   background(200);
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
   * @method class
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
   * Sets a function to call once each time the mouse is pressed over the
   * element. Calling `myElement.mousePressed(false)` disables the function.
   *
   * Note: Some mobile browsers may also trigger this event when the element
   * receives a quick tap.
   *
   * @method mousePressed
   * @param  {Function|Boolean} fxn function to call when the mouse is
   *                                pressed over the element.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *   cnv.mousePressed(() => {
   *     background('deeppink');
   *   });
   *
   *   background(200);
   *
   *   describe('A gray square turns pink when the mouse is pressed.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let numCircles = 0;
   * let cnv;
   *
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.mousePressed(() => {
   *     circle(mouseX, mouseY, 20);
   *     numCircles +=1;
   *   });
   *
   *   background(200);
   *
   *   describe('White circles appear where the mouse is pressed. After five presses, no more circles are drawn.');
   * }
   *
   * function draw() {
   *   if (numCircles > 4) {
   *     cnv.mousePressed(false);
   *   }
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
   * Sets a function to call once each time the mouse is pressed twice over
   * the element. Calling `myElement.doubleClicked(false)` disables the
   * function.
   *
   * @method doubleClicked
   * @param  {Function|Boolean} fxn function to call when the mouse is
   *                                double clicked over the element.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *   cnv.doubleClicked(() => {
   *     background('deeppink');
   *   });
   *
   *   background(200);
   *
   *   describe('A gray square turns pink when the mouse is pressed twice.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let numCircles = 0;
   * let cnv;
   *
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.doubleClicked(() => {
   *     circle(mouseX, mouseY, 20);
   *     numCircles += 1;
   *   });
   *
   *   background(200);
   *
   *   describe('White circles appear on a gray square where the mouse is pressed twice. After five presses, no more circles are drawn.');
   * }
   *
   * function draw() {
   *   if (numCircles > 4) {
   *     cnv.doubleClicked(false);
   *   }
   * }
   * </code>
   * </div>
   */
  doubleClicked(fxn) {
    p5.Element._adjustListener('dblclick', fxn, this);
    return this;
  }

  /**
   * Sets a function to call once after each time the mouse wheel scrolls over
   * the element.
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
   * @method mouseWheel
   * @param  {Function|Boolean} fxn function to call when the mouse wheel is
   *                                scrolled over the element.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *   cnv.mouseWheel(() => {
   *     background('deeppink');
   *   });
   *
   *   background(200);
   *
   *   describe('A gray square. When the mouse wheel is scrolled over the square, it changes color to pink.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *   cnv.mouseWheel(event => {
   *     // Change color if user scrolls away.
   *     // Note: opposite on macOS.
   *     if (event.deltaY > 0) {
   *       background('deeppink');
   *     }
   *   });
   *
   *   background(200);
   *
   *   describe('A gray square. When the mouse wheel is scrolled over the square, it changes color to pink.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let cnv;
   *
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.mouseWheel(() => {
   *     let g = random(255);
   *     background(g);
   *   });
   *
   *   background(200);
   *
   *   describe('A gray square. When the mouse wheel is scrolled over the square, it changes shades of gray. It stops changing after the mouse is pressed.');
   * }
   *
   * function mousePressed() {
   *   cnv.mouseWheel(false);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let cnv;
   *
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.mouseWheel(changeColor);
   *
   *   background(200);
   *
   *   describe('A gray square. When the mouse wheel scrolls over the square, it changes color and displays shapes.');
   * }
   *
   * function changeColor(event) {
   *   // Change the background based on deltaY.
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
   * Sets a function to call once each time the mouse is released over the
   * element. Calling `myElement.mouseReleased(false)` disables the function.
   *
   * Note: Some mobile browsers may also trigger this event when the element
   * receives a quick tap.
   *
   * @method mouseReleased
   * @param  {Function|Boolean} fxn function to call when the mouse is
   *                                pressed over the element.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *   cnv.mouseReleased(() => {
   *     background('deeppink');
   *   });
   *
   *   background(200);
   *
   *   describe('A gray square turns pink when the mouse is released.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let numCircles = 0;
   * let cnv;
   *
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.mouseReleased(() => {
   *     circle(mouseX, mouseY, 20);
   *     numCircles += 1;
   *   });
   *
   *   background(200);
   *
   *   describe('White circles appear on a gray square where the mouse is released. After five releases, no more circles are drawn.');
   * }
   *
   * function draw() {
   *   if (numCircles > 4) {
   *     cnv.mouseReleased(false);
   *   }
   * }
   * </code>
   * </div>
   */
  mouseReleased(fxn) {
    p5.Element._adjustListener('mouseup', fxn, this);
    return this;
  }

  /**
   * Sets a function to call once each time the mouse is pressed and released
   * over the element. Calling `myElement.mouseReleased(false)` disables the
   * function.
   *
   * Note: Some mobile browsers may also trigger this event when the element
   * receives a quick tap.
   *
   * @method mouseClicked
   * @param  {Function|Boolean} fxn function to call when the mouse is
   *                                pressed over the element.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *   cnv.mouseClicked(() => {
   *     background('deeppink');
   *   });
   *
   *   background(200);
   *
   *   describe('A gray square turns pink when the mouse is clicked.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let numCircles = 0;
   * let cnv;
   *
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.mouseClicked(() => {
   *     circle(mouseX, mouseY, 20);
   *     numCircles += 1;
   *   });
   *
   *   background(200);
   *
   *   describe('White circles appear on a gray square where the mouse is clicked. After five clicks, no more circles are drawn.');
   * }
   *
   * function draw() {
   *   if (numCircles > 4) {
   *     cnv.mouseClicked(false);
   *   }
   * }
   * </code>
   * </div>
   */
  mouseClicked(fxn) {
    p5.Element._adjustListener('click', fxn, this);
    return this;
  }

  /**
   * Sets a function to call once each time the mouse moves over the element.
   * Calling `myElement.mouseMoved(false)` disables the function.
   *
   * @method mouseMoved
   * @param  {Function|Boolean} fxn function to call when the mouse
   *                                moves over the element.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *   cnv.mouseMoved(() => {
   *     let g = random(255);
   *     background(g);
   *   });
   *
   *   background(200);
   *
   *   describe('A gray square changes shades of gray while the mouse moves over it.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let cnv;
   *
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.mouseMoved(() => {
   *     let g = random(255);
   *     background(g);
   *   });
   *
   *   background(200);
   *
   *   describe('A gray square changes shades of gray while the mouse moves over it. It stops changing after the mouse is pressed.');
   * }
   *
   * function mousePressed() {
   *   cnv.mouseMoved(false);
   * }
   * </code>
   * </div>
   */
  mouseMoved(fxn) {
    p5.Element._adjustListener('mousemove', fxn, this);
    return this;
  }

  /**
   * Sets a function to call once each time the mouse moves onto the element.
   * Calling `myElement.mouseOver(false)` disables the function.
   *
   * @method mouseOver
   * @param  {Function|Boolean} fxn function to call when the mouse
   *                                moves onto the element.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *   cnv.mouseOver(() => {
   *     let g = random(255);
   *     background(g);
   *   });
   *
   *   background(200);
   *
   *   describe('A gray square changes shades of gray when the mouse first moves over it.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let cnv;
   *
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.mouseOver(() => {
   *     let g = random(255);
   *     background(g);
   *   });
   *
   *   background(200);
   *
   *   describe('A gray square changes shades of gray when the mouse first moves over it. It stops doing so after the mouse is pressed.');
   * }
   *
   * function mousePressed() {
   *   cnv.mouseOver(false);
   * }
   * </code>
   * </div>
   */
  mouseOver(fxn) {
    p5.Element._adjustListener('mouseover', fxn, this);
    return this;
  }

  /**
   * Sets a function to call once each time the mouse moves off the element.
   * Calling `myElement.mouseOut(false)` disables the function.
   *
   * @method mouseOut
   * @param  {Function|Boolean} fxn function to call when the mouse
   *                                moves off the element.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *   cnv.mouseOut(() => {
   *     let g = random(255);
   *     background(g);
   *   });
   *
   *   background(200);
   *
   *   describe('A gray square changes shades of gray when the mouse moves off it.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let cnv;
   *
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.mouseOut(() => {
   *     let g = random(255);
   *     background(g);
   *   });
   *
   *   background(200);
   *
   *   describe('A gray square changes shades of gray when the mouse moves off it. It stops doing so after the mouse is pressed.');
   * }
   *
   * function mousePressed() {
   *   cnv.mouseOut(false);
   * }
   * </code>
   * </div>
   */
  mouseOut(fxn) {
    p5.Element._adjustListener('mouseout', fxn, this);
    return this;
  }

  /**
   * Sets a function to call once each time the element is touched.
   * Calling `myElement.touchStarted(false)` disables the function.
   *
   * @method touchStarted
   * @param  {Function|Boolean} fxn function to call when the touch
   *                                starts.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *   cnv.touchStarted(() => {
   *     let g = random(255);
   *     background(g);
   *   });
   *
   *   background(200);
   *
   *   describe('A gray square changes shades of gray when it is touched.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let numCircles = 0;
   * let cnv;
   *
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.touchStarted(() => {
   *     circle(mouseX, mouseY, 20);
   *     numCircles += 1;
   *   });
   *
   *   background(200);
   *
   *   describe('White circles appear on a gray square where it is touched. After five touches, no more circles appear.');
   * }
   *
   * function draw() {
   *   if (numCircles > 4) {
   *     cnv.touchStarted(false);
   *   }
   * }
   * </code>
   * </div>
   */
  touchStarted(fxn) {
    p5.Element._adjustListener('touchstart', fxn, this);
    return this;
  }

  /**
   * Sets a function to call once each time the element is touched and the user
   * moves. Calling `myElement.touchMoved(false)` disables the function.
   *
   * @method touchMoved
   * @param  {Function|Boolean} fxn function to call when the touch
   *                                moves over the element.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *   cnv.touchMoved(() => {
   *     let g = random(255);
   *     background(g);
   *   });
   *
   *   background(200);
   *
   *   describe('A gray square changes shades of gray while the touch moves over it.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let cnv;
   *
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.touchMoved(() => {
   *     let g = random(255);
   *     background(g);
   *   });
   *
   *   background(200);
   *
   *   describe('A gray square changes shades of gray while the touch moves over it. It stops changing after a double tap.');
   * }
   *
   * function doubleClicked() {
   *   cnv.touchMoved(false);
   * }
   * </code>
   * </div>
   */
  touchMoved(fxn) {
    p5.Element._adjustListener('touchmove', fxn, this);
    return this;
  }

  /**
   * Sets a function to call once each time the user stops touching the
   * element. Calling `myElement.touchMoved(false)` disables the function.
   *
   * @method touchEnded
   * @param  {Function|Boolean} fxn function to call when the touch
   *                                ends.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *   cnv.touchEnded(() => {
   *     let g = random(255);
   *     background(g);
   *   });
   *
   *   background(200);
   *
   *   describe('A gray square changes shades of gray when the user ends their touch.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let numCircles = 0;
   * let cnv;
   *
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.touchEnded(() => {
   *     circle(mouseX, mouseY, 20);
   *     numCircles += 1;
   *   });
   *
   *   background(200);
   *
   *   describe('White circles are drawn on a gray square where the user ends their touch. After five circles are drawn, no more appear.');
   * }
   *
   * function draw() {
   *   if (numCircles > 4) {
   *     cnv.touchEnded(false);
   *   }
   * }
   * </code>
   * </div>
   */
  touchEnded(fxn) {
    p5.Element._adjustListener('touchend', fxn, this);
    return this;
  }

  /**
   * Sets a function to call once each time a file is dragged over the
   * element. Calling `myElement.dragOver(false)` disables the function.
   *
   * @method dragOver
   * @param  {Function|Boolean} fxn function to call when the file is
   *                                dragged over the element.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * // Drag a file over the canvas to test.
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *   cnv.dragOver(() => {
   *     text('hello, file', 50, 50);
   *   });
   *
   *   background(200);
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
   * Sets a function to call once each time a file is dragged off the
   * element. Calling `myElement.dragLeave(false)` disables the function.
   *
   * @method dragLeave
   * @param  {Function|Boolean} fxn function to call when the file is
   *                                dragged off the element.
   *                                `false` disables the function.
   * @chainable
   * @example
   * <div>
   * <code>
   * // Drag a file over, then off the canvas to test.
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *   cnv.dragLeave(() => {
   *     text('bye, file', 50, 50);
   *   });
   *
   *   background(200);
   *
   *   describe('A gray square. The text "bye, file" appears when a file is dragged off the square.');
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

export default p5.Element;
