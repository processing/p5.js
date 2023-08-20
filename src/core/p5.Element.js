/**
 * @module DOM
 * @submodule DOM
 * @for p5.Element
 */

import p5 from './main';

/**
 * Base class for all elements added to a sketch, including canvas,
 * graphics buffers, and other HTML elements. It is not called directly, but <a href="#/p5.Element">p5.Element</a>
 * objects are created by calling <a href="#/p5/createCanvas">createCanvas()</a>, <a href="#/p5/createGraphics">createGraphics()</a>,
 * <a href="#/p5/createDiv">createDiv()</a>, <a href="#/p5/createImg">createImg()</a>, <a href="#/p5/createInput">createInput()</a>, etc.
 *
 * @class p5.Element
 * @constructor
 * @param {HTMLElement} elt DOM node that is wrapped
 * @param {p5} [pInst] pointer to p5 instance
 */
p5.Element = class {
  constructor(elt, pInst) {
    /**
     * Underlying HTML element. All normal HTML methods can be called on this.
     * @example
     * <div>
     * <code>
     * function setup() {
     *   let c = createCanvas(50, 50);
     *   c.elt.style.border = '5px solid red';
     * }
     *
     * function draw() {
     *   background(220);
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
   *
   * Attaches the element to the parent specified. A way of setting
   * the container for the element. Accepts either a string ID, DOM
   * node, or <a href="#/p5.Element">p5.Element</a>. If no arguments are given, parent node is returned.
   * For more ways to position the canvas, see the
   * <a href='https://github.com/processing/p5.js/wiki/Positioning-your-canvas'>
   * positioning the canvas</a> wiki page.
   *
   * @method parent
   * @param  {String|p5.Element|Object} parent the ID, DOM node, or <a href="#/p5.Element">p5.Element</a>
   *                         of desired parent element
   * @chainable
   *
   * @example
   * <div class="norender notest"><code>
   * // Add the following comment to html file.
   * // &lt;div id="myContainer">&lt;/div>
   *
   * // The js code
   * let cnv = createCanvas(100, 100);
   * cnv.parent('myContainer');
   * </code></div>
   *
   * <div class='norender'><code>
   * let div0 = createDiv('this is the parent');
   * let div1 = createDiv('this is the child');
   * div1.parent(div0); // use p5.Element
   * </code></div>
   *
   * <div class='norender'><code>
   * let div0 = createDiv('this is the parent');
   * div0.id('apples');
   * let div1 = createDiv('this is the child');
   * div1.parent('apples'); // use id
   * </code></div>
   *
   * <div class='norender notest'><code>
   * let elt = document.getElementById('myParentDiv');
   * let div1 = createDiv('this is the child');
   * div1.parent(elt); // use element from page
   * </code></div>
   *
   * @alt
   * no display.
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
   *
   * Sets the ID of the element. If no ID argument is passed in, it instead
   * returns the current ID of the element.
   * Note that only one element can have a particular id in a page.
   * The <a href="#/p5.Element/class">class()</a> method can be used
   * to identify multiple elements with the same class name.
   *
   * @method id
   * @param  {String} id ID of the element
   * @chainable
   *
   * @example
   * <div class='norender'><code>
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *   // Assigns a CSS selector ID to
   *   // the canvas element.
   *   cnv.id('mycanvas');
   * }
   * </code></div>
   *
   * @alt
   * no display.
   */
  /**
   * @method id
   * @return {String} the id of the element
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
   *
   * Adds given class to the element. If no class argument is passed in, it
   * instead returns a string containing the current class(es) of the element.
   *
   * @method class
   * @param  {String} class class to add
   * @chainable
   *
   * @example
   * <div class='norender'><code>
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *   // Assigns a CSS selector class 'small'
   *   // to the canvas element.
   *   cnv.class('small');
   * }
   * </code></div>
   *
   * @alt
   * no display.
   */
  /**
   * @method class
   * @return {String} the class of the element
   */
  class(c) {
    if (typeof c === 'undefined') {
      return this.elt.className;
    }

    this.elt.className = c;
    return this;
  }

  /**
   * The <a href="#/p5.Element/mousePressed">mousePressed()</a> method is called
   * once after every time a mouse button is pressed over the element. Some mobile
   * browsers may also trigger this event on a touch screen, if the user performs
   * a quick tap. This can be used to attach element-specific event listeners.
   *
   * @method mousePressed
   * @param  {Function|Boolean} fxn function to be fired when mouse is
   *                                pressed over the element.
   *                                if `false` is passed instead, the previously
   *                                firing function will no longer fire.
   * @chainable
   * @example
   * <div class='norender'><code>
   * let cnv, d, g;
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.mousePressed(changeGray); // attach listener for
   *   // canvas click only
   *   d = 10;
   *   g = 100;
   * }
   *
   * function draw() {
   *   background(g);
   *   ellipse(width / 2, height / 2, d, d);
   * }
   *
   * // this function fires with any click anywhere
   * function mousePressed() {
   *   d = d + 10;
   * }
   *
   * // this function fires only when cnv is clicked
   * function changeGray() {
   *   g = random(0, 255);
   * }
   * </code></div>
   *
   * @alt
   * no display.
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
   * The <a href="#/p5.Element/doubleClicked">doubleClicked()</a> method is called once after every time a
   * mouse button is pressed twice over the element. This can be used to
   * attach element and action-specific event listeners.
   *
   * @method doubleClicked
   * @param  {Function|Boolean} fxn function to be fired when mouse is
   *                                double clicked over the element.
   *                                if `false` is passed instead, the previously
   *                                firing function will no longer fire.
   * @chainable
   * @example
   * <div class='norender'><code>
   * let cnv, d, g;
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.doubleClicked(changeGray); // attach listener for
   *   // canvas double click only
   *   d = 10;
   *   g = 100;
   * }
   *
   * function draw() {
   *   background(g);
   *   ellipse(width / 2, height / 2, d, d);
   * }
   *
   * // this function fires with any double click anywhere
   * function doubleClicked() {
   *   d = d + 10;
   * }
   *
   * // this function fires only when cnv is double clicked
   * function changeGray() {
   *   g = random(0, 255);
   * }
   * </code></div>
   *
   * @alt
   * no display.
   */
  doubleClicked(fxn) {
    p5.Element._adjustListener('dblclick', fxn, this);
    return this;
  }

  /**
   * The <a href="#/p5.Element/mouseWheel">mouseWheel()</a> method is called
   * once after every time a mouse wheel is scrolled over the element. This can
   * be used to attach element-specific event listeners.
   *
   * The method accepts a callback function as argument which will be executed
   * when the `wheel` event is triggered on the element, the callback function is
   * passed one argument `event`. The `event.deltaY` property returns negative
   * values if the mouse wheel is rotated up or away from the user and positive
   * in the other direction. The `event.deltaX` does the same as `event.deltaY`
   * except it reads the horizontal wheel scroll of the mouse wheel.
   *
   * On macOS with "natural" scrolling enabled, the `event.deltaY` values are
   * reversed.
   *
   * @method mouseWheel
   * @param  {Function|Boolean} fxn function to be fired when mouse is
   *                                scrolled over the element.
   *                                if `false` is passed instead, the previously
   *                                firing function will no longer fire.
   * @chainable
   * @example
   * <div class='norender'><code>
   * let cnv, d, g;
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.mouseWheel(changeSize); // attach listener for
   *   // activity on canvas only
   *   d = 10;
   *   g = 100;
   * }
   *
   * function draw() {
   *   background(g);
   *   ellipse(width / 2, height / 2, d, d);
   * }
   *
   * // this function fires with mousewheel movement
   * // anywhere on screen
   * function mouseWheel() {
   *   g = g + 10;
   * }
   *
   * // this function fires with mousewheel movement
   * // over canvas only
   * function changeSize(event) {
   *   if (event.deltaY > 0) {
   *     d = d + 10;
   *   } else {
   *     d = d - 10;
   *   }
   * }
   * </code></div>
   *
   * @alt
   * no display.
   */
  mouseWheel(fxn) {
    p5.Element._adjustListener('wheel', fxn, this);
    return this;
  }

  /**
   * The <a href="#/p5.Element/mouseReleased">mouseReleased()</a> method is
   * called once after every time a mouse button is released over the element.
   * Some mobile browsers may also trigger this event on a touch screen, if the
   * user performs a quick tap. This can be used to attach element-specific event listeners.
   *
   * @method mouseReleased
   * @param  {Function|Boolean} fxn function to be fired when mouse is
   *                                released over the element.
   *                                if `false` is passed instead, the previously
   *                                firing function will no longer fire.
   * @chainable
   * @example
   * <div class='norender'><code>
   * let cnv, d, g;
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.mouseReleased(changeGray); // attach listener for
   *   // activity on canvas only
   *   d = 10;
   *   g = 100;
   * }
   *
   * function draw() {
   *   background(g);
   *   ellipse(width / 2, height / 2, d, d);
   * }
   *
   * // this function fires after the mouse has been
   * // released
   * function mouseReleased() {
   *   d = d + 10;
   * }
   *
   * // this function fires after the mouse has been
   * // released while on canvas
   * function changeGray() {
   *   g = random(0, 255);
   * }
   * </code></div>
   *
   * @alt
   * no display.
   */
  mouseReleased(fxn) {
    p5.Element._adjustListener('mouseup', fxn, this);
    return this;
  }

  /**
   * The <a href="#/p5.Element/mouseClicked">mouseClicked()</a> method is
   * called once after a mouse button is pressed and released over the element.
   * Some mobile browsers may also trigger this event on a touch screen, if the
   * user performs a quick tap. This can be used to attach element-specific event listeners.
   *
   * @method mouseClicked
   * @param  {Function|Boolean} fxn function to be fired when mouse is
   *                                clicked over the element.
   *                                if `false` is passed instead, the previously
   *                                firing function will no longer fire.
   * @chainable
   * @example
   * <div class="norender">
   * <code>
   * let cnv, d, g;
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.mouseClicked(changeGray); // attach listener for
   *   // activity on canvas only
   *   d = 10;
   *   g = 100;
   * }
   *
   * function draw() {
   *   background(g);
   *   ellipse(width / 2, height / 2, d, d);
   * }
   *
   * // this function fires after the mouse has been
   * // clicked anywhere
   * function mouseClicked() {
   *   d = d + 10;
   * }
   *
   * // this function fires after the mouse has been
   * // clicked on canvas
   * function changeGray() {
   *   g = random(0, 255);
   * }
   * </code>
   * </div>
   *
   * @alt
   * no display.
   */
  mouseClicked(fxn) {
    p5.Element._adjustListener('click', fxn, this);
    return this;
  }

  /**
   * The <a href="#/p5.Element/mouseMoved">mouseMoved()</a> method is called once every time a
   * mouse moves over the element. This can be used to attach an
   * element-specific event listener.
   *
   * @method mouseMoved
   * @param  {Function|Boolean} fxn function to be fired when a mouse moves
   *                                over the element.
   *                                if `false` is passed instead, the previously
   *                                firing function will no longer fire.
   * @chainable
   * @example
   * <div class='norender'><code>
   * let cnv;
   * let d = 30;
   * let g;
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.mouseMoved(changeSize); // attach listener for
   *   // activity on canvas only
   *   d = 10;
   *   g = 100;
   * }
   *
   * function draw() {
   *   background(g);
   *   fill(200);
   *   ellipse(width / 2, height / 2, d, d);
   * }
   *
   * // this function fires when mouse moves anywhere on
   * // page
   * function mouseMoved() {
   *   g = g + 5;
   *   if (g > 255) {
   *     g = 0;
   *   }
   * }
   *
   * // this function fires when mouse moves over canvas
   * function changeSize() {
   *   d = d + 2;
   *   if (d > 100) {
   *     d = 0;
   *   }
   * }
   * </code></div>
   *
   * @alt
   * no display.
   */
  mouseMoved(fxn) {
    p5.Element._adjustListener('mousemove', fxn, this);
    return this;
  }

  /**
   * The <a href="#/p5.Element/mouseOver">mouseOver()</a> method is called once after every time a
   * mouse moves onto the element. This can be used to attach an
   * element-specific event listener.
   *
   * @method mouseOver
   * @param  {Function|Boolean} fxn function to be fired when a mouse moves
   *                                onto the element.
   *                                if `false` is passed instead, the previously
   *                                firing function will no longer fire.
   * @chainable
   * @example
   * <div class='norender'><code>
   * let cnv;
   * let d;
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.mouseOver(changeGray);
   *   d = 10;
   * }
   *
   * function draw() {
   *   ellipse(width / 2, height / 2, d, d);
   * }
   *
   * function changeGray() {
   *   d = d + 10;
   *   if (d > 100) {
   *     d = 0;
   *   }
   * }
   * </code></div>
   *
   * @alt
   * no display.
   */
  mouseOver(fxn) {
    p5.Element._adjustListener('mouseover', fxn, this);
    return this;
  }

  /**
   * The <a href="#/p5.Element/mouseOut">mouseOut()</a> method is called once after every time a
   * mouse moves off the element. This can be used to attach an
   * element-specific event listener.
   *
   * @method mouseOut
   * @param  {Function|Boolean} fxn function to be fired when a mouse
   *                                moves off of an element.
   *                                if `false` is passed instead, the previously
   *                                firing function will no longer fire.
   * @chainable
   * @example
   * <div class='norender'><code>
   * let cnv;
   * let d;
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.mouseOut(changeGray);
   *   d = 10;
   * }
   *
   * function draw() {
   *   ellipse(width / 2, height / 2, d, d);
   * }
   *
   * function changeGray() {
   *   d = d + 10;
   *   if (d > 100) {
   *     d = 0;
   *   }
   * }
   * </code></div>
   *
   * @alt
   * no display.
   */
  mouseOut(fxn) {
    p5.Element._adjustListener('mouseout', fxn, this);
    return this;
  }

  /**
   * The <a href="#/p5.Element/touchStarted">touchStarted()</a> method is called once after every time a touch is
   * registered. This can be used to attach element-specific event listeners.
   *
   * @method touchStarted
   * @param  {Function|Boolean} fxn function to be fired when a touch
   *                                starts over the element.
   *                                if `false` is passed instead, the previously
   *                                firing function will no longer fire.
   * @chainable
   * @example
   * <div class='norender'><code>
   * let cnv;
   * let d;
   * let g;
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.touchStarted(changeGray); // attach listener for
   *   // canvas click only
   *   d = 10;
   *   g = 100;
   * }
   *
   * function draw() {
   *   background(g);
   *   ellipse(width / 2, height / 2, d, d);
   * }
   *
   * // this function fires with any touch anywhere
   * function touchStarted() {
   *   d = d + 10;
   * }
   *
   * // this function fires only when cnv is clicked
   * function changeGray() {
   *   g = random(0, 255);
   * }
   * </code></div>
   *
   * @alt
   * no display.
   */
  touchStarted(fxn) {
    p5.Element._adjustListener('touchstart', fxn, this);
    return this;
  }

  /**
   * The <a href="#/p5.Element/touchMoved">touchMoved()</a> method is called once after every time a touch move is
   * registered. This can be used to attach element-specific event listeners.
   *
   * @method touchMoved
   * @param  {Function|Boolean} fxn function to be fired when a touch moves over
   *                                the element.
   *                                if `false` is passed instead, the previously
   *                                firing function will no longer fire.
   * @chainable
   * @example
   * <div class='norender'><code>
   * let cnv;
   * let g;
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.touchMoved(changeGray); // attach listener for
   *   // canvas click only
   *   g = 100;
   * }
   *
   * function draw() {
   *   background(g);
   * }
   *
   * // this function fires only when cnv is clicked
   * function changeGray() {
   *   g = random(0, 255);
   * }
   * </code></div>
   *
   * @alt
   * no display.
   */
  touchMoved(fxn) {
    p5.Element._adjustListener('touchmove', fxn, this);
    return this;
  }

  /**
   * The <a href="#/p5.Element/touchEnded">touchEnded()</a> method is called once after every time a touch is
   * registered. This can be used to attach element-specific event listeners.
   *
   * @method touchEnded
   * @param  {Function|Boolean} fxn function to be fired when a touch ends
   *                                over the element.
   *                                if `false` is passed instead, the previously
   *                                firing function will no longer fire.
   * @chainable
   * @example
   * <div class='norender'><code>
   * let cnv;
   * let d;
   * let g;
   * function setup() {
   *   cnv = createCanvas(100, 100);
   *   cnv.touchEnded(changeGray); // attach listener for
   *   // canvas click only
   *   d = 10;
   *   g = 100;
   * }
   *
   * function draw() {
   *   background(g);
   *   ellipse(width / 2, height / 2, d, d);
   * }
   *
   * // this function fires with any touch anywhere
   * function touchEnded() {
   *   d = d + 10;
   * }
   *
   * // this function fires only when cnv is clicked
   * function changeGray() {
   *   g = random(0, 255);
   * }
   * </code></div>
   *
   * @alt
   * no display.
   */
  touchEnded(fxn) {
    p5.Element._adjustListener('touchend', fxn, this);
    return this;
  }

  /**
   * The <a href="#/p5.Element/dragOver">dragOver()</a> method is called once after every time a
   * file is dragged over the element. This can be used to attach an
   * element-specific event listener.
   *
   * @method dragOver
   * @param  {Function|Boolean} fxn function to be fired when a file is
   *                                dragged over the element.
   *                                if `false` is passed instead, the previously
   *                                firing function will no longer fire.
   * @chainable
   * @example
   * <div><code>
   * // To test this sketch, simply drag a
   * // file over the canvas
   * function setup() {
   *   let c = createCanvas(100, 100);
   *   background(200);
   *   textAlign(CENTER);
   *   text('Drag file', width / 2, height / 2);
   *   c.dragOver(dragOverCallback);
   * }
   *
   * // This function will be called whenever
   * // a file is dragged over the canvas
   * function dragOverCallback() {
   *   background(240);
   *   text('Dragged over', width / 2, height / 2);
   * }
   * </code></div>
   * @alt
   * nothing displayed
   */
  dragOver(fxn) {
    p5.Element._adjustListener('dragover', fxn, this);
    return this;
  }

  /**
   * The <a href="#/p5.Element/dragLeave">dragLeave()</a> method is called once after every time a
   * dragged file leaves the element area. This can be used to attach an
   * element-specific event listener.
   *
   * @method dragLeave
   * @param  {Function|Boolean} fxn function to be fired when a file is
   *                                dragged off the element.
   *                                if `false` is passed instead, the previously
   *                                firing function will no longer fire.
   * @chainable
   * @example
   * <div><code>
   * // To test this sketch, simply drag a file
   * // over and then out of the canvas area
   * function setup() {
   *   let c = createCanvas(100, 100);
   *   background(200);
   *   textAlign(CENTER);
   *   text('Drag file', width / 2, height / 2);
   *   c.dragLeave(dragLeaveCallback);
   * }
   *
   * // This function will be called whenever
   * // a file is dragged out of the canvas
   * function dragLeaveCallback() {
   *   background(240);
   *   text('Dragged off', width / 2, height / 2);
   * }
   * </code></div>
   * @alt
   * nothing displayed
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
