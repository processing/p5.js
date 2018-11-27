/**
 * @module DOM
 * @submodule DOM
 * @for p5.Element
 */

'use strict';

var p5 = require('./main');

/**
 * Base class for all elements added to a sketch, including canvas,
 * graphics buffers, and other HTML elements. Methods in blue are
 * included in the core functionality, methods in brown are added
 * with the <a href="http://p5js.org/reference/#/libraries/p5.dom">p5.dom
 * library</a>.
 * It is not called directly, but <a href="#/p5.Element">p5.Element</a>
 * objects are created by calling <a href="#/p5/createCanvas">createCanvas</a>, <a href="#/p5/createGraphics">createGraphics</a>,
 * or in the p5.dom library, <a href="#/p5/createDiv">createDiv</a>, <a href="#/p5/createImg">createImg</a>, <a href="#/p5/createInput">createInput</a>, etc.
 *
 * @class p5.Element
 * @param {String} elt DOM node that is wrapped
 * @param {p5} [pInst] pointer to p5 instance
 */
p5.Element = function(elt, pInst) {
  /**
   * Underlying HTML element. All normal HTML methods can be called on this.
   * @example
   * <div>
   * <code>
   * createCanvas(300, 500);
   * background(0, 0, 0, 0);
   * var input = createInput();
   * input.position(20, 225);
   * var inputElem = new p5.Element(input.elt);
   * inputElem.style('width:450px;');
   * inputElem.value('some string');
   * </code>
   * </div>
   *
   * @property elt
   * @readOnly
   */
  this.elt = elt;
  this._pInst = pInst;
  this._events = {};
  this.width = this.elt.offsetWidth;
  this.height = this.elt.offsetHeight;
};

/**
 *
 * Attaches the element to the parent specified. A way of setting
 * the container for the element. Accepts either a string ID, DOM
 * node, or <a href="#/p5.Element">p5.Element</a>. If no arguments given, parent node is returned.
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
 * // in the html file:
 * // &lt;div id="myContainer">&lt;/div>
 *
 * // in the js file:
 * var cnv = createCanvas(100, 100);
 * cnv.parent('myContainer');
 * </code></div>
 * <div class='norender'><code>
 * var div0 = createDiv('this is the parent');
 * var div1 = createDiv('this is the child');
 * div1.parent(div0); // use p5.Element
 * </code></div>
 * <div class='norender'><code>
 * var div0 = createDiv('this is the parent');
 * div0.id('apples');
 * var div1 = createDiv('this is the child');
 * div1.parent('apples'); // use id
 * </code></div>
 * <div class='norender notest'><code>
 * var elt = document.getElementById('myParentDiv');
 * var div1 = createDiv('this is the child');
 * div1.parent(elt); // use element from page
 * </code></div>
 *
 * @alt
 * no display.
 */
/**
 * @method parent
 * @return {p5.Element}
 *
 */
p5.Element.prototype.parent = function(p) {
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
};

/**
 *
 * Sets the ID of the element. If no ID argument is passed in, it instead
 * returns the current ID of the element.
 *
 * @method id
 * @param  {String} id ID of the element
 * @chainable
 *
 * @example
 * <div class='norender'><code>
 * function setup() {
 *   var cnv = createCanvas(100, 100);
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
p5.Element.prototype.id = function(id) {
  if (typeof id === 'undefined') {
    return this.elt.id;
  }

  this.elt.id = id;
  this.width = this.elt.offsetWidth;
  this.height = this.elt.offsetHeight;
  return this;
};

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
 *   var cnv = createCanvas(100, 100);
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
p5.Element.prototype.class = function(c) {
  if (typeof c === 'undefined') {
    return this.elt.className;
  }

  this.elt.className = c;
  return this;
};

/**
 * The .<a href="#/p5.Element/mousePressed">mousePressed()</a> function is called once after every time a
 * mouse button is pressed over the element.
 * Some mobile browsers may also trigger this event on a touch screen,
 * if the user performs a quick tap.
 * This can be used to attach element specific event listeners.
 *
 * @method mousePressed
 * @param  {Function|Boolean} fxn function to be fired when mouse is
 *                                pressed over the element.
 *                                if `false` is passed instead, the previously
 *                                firing function will no longer fire.
 * @chainable
 * @example
 * <div class='norender'><code>
 * var cnv;
 * var d;
 * var g;
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
 *
 */
p5.Element.prototype.mousePressed = function(fxn) {
  // Prepend the mouse property setters to the event-listener.
  // This is required so that mouseButton is set correctly prior to calling the callback (fxn).
  // For details, see https://github.com/processing/p5.js/issues/3087.
  var eventPrependedFxn = function(event) {
    this._pInst._setProperty('mouseIsPressed', true);
    this._pInst._setMouseButton(event);
    // Pass along the return-value of the callback:
    return fxn.call(this);
  };
  // Pass along the event-prepended form of the callback.
  adjustListener('mousedown', eventPrependedFxn, this);
  return this;
};

/**
 * The .<a href="#/p5.Element/doubleClicked">doubleClicked()</a> function is called once after every time a
 * mouse button is pressed twice over the element. This can be used to
 * attach element and action specific event listeners.
 *
 * @method doubleClicked
 * @param  {Function|Boolean} fxn function to be fired when mouse is
 *                                double clicked over the element.
 *                                if `false` is passed instead, the previously
 *                                firing function will no longer fire.
 * @return {p5.Element}
 * @example
 * <div class='norender'><code>
 * var cnv;
 * var d;
 * var g;
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
 *
 */
p5.Element.prototype.doubleClicked = function(fxn) {
  adjustListener('dblclick', fxn, this);
  return this;
};

/**
 * The .<a href="#/p5.Element/mouseWheel">mouseWheel()</a> function is called once after every time a
 * mouse wheel is scrolled over the element. This can be used to
 * attach element specific event listeners.
 * <br><br>
 * The function accepts a callback function as argument which will be executed
 * when the `wheel` event is triggered on the element, the callback function is
 * passed one argument `event`. The `event.deltaY` property returns negative
 * values if the mouse wheel is rotated up or away from the user and positive
 * in the other direction. The `event.deltaX` does the same as `event.deltaY`
 * except it reads the horizontal wheel scroll of the mouse wheel.
 * <br><br>
 * On OS X with "natural" scrolling enabled, the `event.deltaY` values are
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
 * var cnv;
 * var d;
 * var g;
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
 *
 * @alt
 * no display.
 *
 */
p5.Element.prototype.mouseWheel = function(fxn) {
  adjustListener('wheel', fxn, this);
  return this;
};

/**
 * The .<a href="#/p5.Element/mouseReleased">mouseReleased()</a> function is called once after every time a
 * mouse button is released over the element.
 * Some mobile browsers may also trigger this event on a touch screen,
 * if the user performs a quick tap.
 * This can be used to attach element specific event listeners.
 *
 * @method mouseReleased
 * @param  {Function|Boolean} fxn function to be fired when mouse is
 *                                released over the element.
 *                                if `false` is passed instead, the previously
 *                                firing function will no longer fire.
 * @chainable
 * @example
 * <div class='norender'><code>
 * var cnv;
 * var d;
 * var g;
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
 *
 * @alt
 * no display.
 *
 */
p5.Element.prototype.mouseReleased = function(fxn) {
  adjustListener('mouseup', fxn, this);
  return this;
};

/**
 * The .<a href="#/p5.Element/mouseClicked">mouseClicked()</a> function is called once after a mouse button is
 * pressed and released over the element.
 * Some mobile browsers may also trigger this event on a touch screen,
 * if the user performs a quick tap.
 * This can be used to attach element specific event listeners.
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
 * var cnv;
 * var d;
 * var g;
 *
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
 *
 */
p5.Element.prototype.mouseClicked = function(fxn) {
  adjustListener('click', fxn, this);
  return this;
};

/**
 * The .<a href="#/p5.Element/mouseMoved">mouseMoved()</a> function is called once every time a
 * mouse moves over the element. This can be used to attach an
 * element specific event listener.
 *
 * @method mouseMoved
 * @param  {Function|Boolean} fxn function to be fired when a mouse moves
 *                                over the element.
 *                                if `false` is passed instead, the previously
 *                                firing function will no longer fire.
 * @chainable
 * @example
 * <div class='norender'><code>
 * var cnv;
 * var d = 30;
 * var g;
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
 *
 * @alt
 * no display.
 *
 */
p5.Element.prototype.mouseMoved = function(fxn) {
  adjustListener('mousemove', fxn, this);
  return this;
};

/**
 * The .<a href="#/p5.Element/mouseOver">mouseOver()</a> function is called once after every time a
 * mouse moves onto the element. This can be used to attach an
 * element specific event listener.
 *
 * @method mouseOver
 * @param  {Function|Boolean} fxn function to be fired when a mouse moves
 *                                onto the element.
 *                                if `false` is passed instead, the previously
 *                                firing function will no longer fire.
 * @chainable
 * @example
 * <div class='norender'><code>
 * var cnv;
 * var d;
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
 *
 * @alt
 * no display.
 *
 */
p5.Element.prototype.mouseOver = function(fxn) {
  adjustListener('mouseover', fxn, this);
  return this;
};

/**
 * The .<a href="#/p5.Element/changed">changed()</a> function is called when the value of an
 * element changes.
 * This can be used to attach an element specific event listener.
 *
 * @method changed
 * @param  {Function|Boolean} fxn function to be fired when the value of
 *                                an element changes.
 *                                if `false` is passed instead, the previously
 *                                firing function will no longer fire.
 * @chainable
 * @example
 * <div><code>
 * var sel;
 *
 * function setup() {
 *   textAlign(CENTER);
 *   background(200);
 *   sel = createSelect();
 *   sel.position(10, 10);
 *   sel.option('pear');
 *   sel.option('kiwi');
 *   sel.option('grape');
 *   sel.changed(mySelectEvent);
 * }
 *
 * function mySelectEvent() {
 *   var item = sel.value();
 *   background(200);
 *   text("it's a " + item + '!', 50, 50);
 * }
 * </code></div>
 * <div><code>
 * var checkbox;
 * var cnv;
 *
 * function setup() {
 *   checkbox = createCheckbox(' fill');
 *   checkbox.changed(changeFill);
 *   cnv = createCanvas(100, 100);
 *   cnv.position(0, 30);
 *   noFill();
 * }
 *
 * function draw() {
 *   background(200);
 *   ellipse(50, 50, 50, 50);
 * }
 *
 * function changeFill() {
 *   if (checkbox.checked()) {
 *     fill(0);
 *   } else {
 *     noFill();
 *   }
 * }
 * </code></div>
 *
 * @alt
 * dropdown: pear, kiwi, grape. When selected text "its a" + selection shown.
 *
 */
p5.Element.prototype.changed = function(fxn) {
  adjustListener('change', fxn, this);
  return this;
};

/**
 * The .<a href="#/p5.Element/input">input()</a> function is called when any user input is
 * detected with an element. The input event is often used
 * to detect keystrokes in a input element, or changes on a
 * slider element. This can be used to attach an element specific
 * event listener.
 *
 * @method input
 * @param  {Function|Boolean} fxn function to be fired when any user input is
 *                                detected within the element.
 *                                if `false` is passed instead, the previously
 *                                firing function will no longer fire.
 * @chainable
 * @example
 * <div class='norender'><code>
 * // Open your console to see the output
 * function setup() {
 *   var inp = createInput('');
 *   inp.input(myInputEvent);
 * }
 *
 * function myInputEvent() {
 *   console.log('you are typing: ', this.value());
 * }
 * </code></div>
 *
 * @alt
 * no display.
 *
 */
p5.Element.prototype.input = function(fxn) {
  adjustListener('input', fxn, this);
  return this;
};

/**
 * The .<a href="#/p5.Element/mouseOut">mouseOut()</a> function is called once after every time a
 * mouse moves off the element. This can be used to attach an
 * element specific event listener.
 *
 * @method mouseOut
 * @param  {Function|Boolean} fxn function to be fired when a mouse
 *                                moves off of an element.
 *                                if `false` is passed instead, the previously
 *                                firing function will no longer fire.
 * @chainable
 * @example
 * <div class='norender'><code>
 * var cnv;
 * var d;
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
 *
 */
p5.Element.prototype.mouseOut = function(fxn) {
  adjustListener('mouseout', fxn, this);
  return this;
};

/**
 * The .<a href="#/p5.Element/touchStarted">touchStarted()</a> function is called once after every time a touch is
 * registered. This can be used to attach element specific event listeners.
 *
 * @method touchStarted
 * @param  {Function|Boolean} fxn function to be fired when a touch
 *                                starts over the element.
 *                                if `false` is passed instead, the previously
 *                                firing function will no longer fire.
 * @chainable
 * @example
 * <div class='norender'><code>
 * var cnv;
 * var d;
 * var g;
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
 *
 */
p5.Element.prototype.touchStarted = function(fxn) {
  adjustListener('touchstart', fxn, this);
  return this;
};

/**
 * The .<a href="#/p5.Element/touchMoved">touchMoved()</a> function is called once after every time a touch move is
 * registered. This can be used to attach element specific event listeners.
 *
 * @method touchMoved
 * @param  {Function|Boolean} fxn function to be fired when a touch moves over
 *                                the element.
 *                                if `false` is passed instead, the previously
 *                                firing function will no longer fire.
 * @chainable
 * @example
 * <div class='norender'><code>
 * var cnv;
 * var g;
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
 *
 */
p5.Element.prototype.touchMoved = function(fxn) {
  adjustListener('touchmove', fxn, this);
  return this;
};

/**
 * The .<a href="#/p5.Element/touchEnded">touchEnded()</a> function is called once after every time a touch is
 * registered. This can be used to attach element specific event listeners.
 *
 * @method touchEnded
 * @param  {Function|Boolean} fxn function to be fired when a touch ends
 *                                over the element.
 *                                if `false` is passed instead, the previously
 *                                firing function will no longer fire.
 * @chainable
 * @example
 * <div class='norender'><code>
 * var cnv;
 * var d;
 * var g;
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
 *
 * @alt
 * no display.
 *
 */
p5.Element.prototype.touchEnded = function(fxn) {
  adjustListener('touchend', fxn, this);
  return this;
};

/**
 * The .<a href="#/p5.Element/dragOver">dragOver()</a> function is called once after every time a
 * file is dragged over the element. This can be used to attach an
 * element specific event listener.
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
 *   var c = createCanvas(100, 100);
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
p5.Element.prototype.dragOver = function(fxn) {
  adjustListener('dragover', fxn, this);
  return this;
};

/**
 * The .dragLeave() function is called once after every time a
 * dragged file leaves the element area. This can be used to attach an
 * element specific event listener.
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
 *   var c = createCanvas(100, 100);
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
p5.Element.prototype.dragLeave = function(fxn) {
  adjustListener('dragleave', fxn, this);
  return this;
};

/**
 * Registers a callback that gets called every time a file that is
 * dropped on the element has been loaded.
 * p5 will load every dropped file into memory and pass it as a p5.File object to the callback.
 * Multiple files dropped at the same time will result in multiple calls to the callback.
 *
 * You can optionally pass a second callback which will be registered to the raw
 * <a href="https://developer.mozilla.org/en-US/docs/Web/Events/drop">drop</a> event.
 * The callback will thus be provided the original
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/DragEvent">DragEvent</a>.
 * Dropping multiple files at the same time will trigger the second callback once per drop,
 * whereas the first callback will trigger for each loaded file.
 *
 * @method drop
 * @param  {Function} callback  callback to receive loaded file.
 * @param  {Function} [fxn]     callback triggered when files are dropped.
 * @chainable
 * @example
 * <div><code>
 * function setup() {
 *   var c = createCanvas(100, 100);
 *   background(200);
 *   textAlign(CENTER);
 *   text('drop file', width / 2, height / 2);
 *   c.drop(gotFile);
 * }
 *
 * function gotFile(file) {
 *   background(200);
 *   text('received file:', width / 2, height / 2);
 *   text(file.name, width / 2, height / 2 + 50);
 * }
 * </code></div>
 *
 * <div><code>
 * var img;
 *
 * function setup() {
 *   var c = createCanvas(100, 100);
 *   background(200);
 *   textAlign(CENTER);
 *   text('drop image', width / 2, height / 2);
 *   c.drop(gotFile);
 * }
 *
 * function draw() {
 *   if (img) {
 *     image(img, 0, 0, width, height);
 *   }
 * }
 *
 * function gotFile(file) {
 *   img = createImg(file.data).hide();
 * }
 * </code></div>
 *
 * @alt
 * Canvas turns into whatever image is dragged/dropped onto it.
 */
p5.Element.prototype.drop = function(callback, fxn) {
  // Is the file stuff supported?
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    if (!this._dragDisabled) {
      this._dragDisabled = true;

      var preventDefault = function(evt) {
        evt.preventDefault();
      };

      // If you want to be able to drop you've got to turn off
      // a lot of default behavior.
      // avoid `attachListener` here, since it overrides other handlers.
      this.elt.addEventListener('dragover', preventDefault);

      // If this is a drag area we need to turn off the default behavior
      this.elt.addEventListener('dragleave', preventDefault);
    }

    // Attach the second argument as a callback that receives the raw drop event
    if (typeof fxn !== 'undefined') {
      attachListener('drop', fxn, this);
    }

    // Deal with the files
    attachListener(
      'drop',
      function(evt) {
        evt.preventDefault();

        // A FileList
        var files = evt.dataTransfer.files;

        // Load each one and trigger the callback
        for (var i = 0; i < files.length; i++) {
          var f = files[i];
          p5.File._load(f, callback);
        }
      },
      this
    );
  } else {
    console.log('The File APIs are not fully supported in this browser.');
  }

  return this;
};

// General handler for event attaching and detaching
function adjustListener(ev, fxn, ctx) {
  if (fxn === false) {
    detachListener(ev, ctx);
  } else {
    attachListener(ev, fxn, ctx);
  }
  return this;
}

function attachListener(ev, fxn, ctx) {
  // LM removing, not sure why we had this?
  // var _this = ctx;
  // var f = function (e) { fxn(e, _this); };

  // detach the old listener if there was one
  if (ctx._events[ev]) {
    detachListener(ev, ctx);
  }
  var f = fxn.bind(ctx);
  ctx.elt.addEventListener(ev, f, false);
  ctx._events[ev] = f;
}

function detachListener(ev, ctx) {
  var f = ctx._events[ev];
  ctx.elt.removeEventListener(ev, f, false);
  ctx._events[ev] = null;
}

/**
 * Helper fxn for sharing pixel methods
 *
 */
p5.Element.prototype._setProperty = function(prop, value) {
  this[prop] = value;
};

module.exports = p5.Element;
