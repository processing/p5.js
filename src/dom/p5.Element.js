/**
 * @module DOM
 * @submodule DOM
 */

import { File } from './p5.File';
import { Color } from '../color/p5.Color';
import * as constants from '../core/constants';

class Element {
  width;
  height;
  elt;

  constructor(elt, pInst) {
    this.elt = elt;
    this._pInst = this._pixelsState = pInst;
    this._events = {};
    this.width = this.elt.offsetWidth;
    this.height = this.elt.offsetHeight;
  }

  /**
   * Removes the element, stops all audio/video streams, and removes all
   * callback functions.
   *
   * @example
   * <div>
   * <code>
   * let p;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a paragraph element.
   *   p = createP('p5*js');
   *   p.position(10, 10);
   *
   *   describe('The text "p5*js" written at the center of a gray square. ');
   * }
   *
   * // Remove the paragraph when the user double-clicks.
   * function doubleClicked() {
   *   p.remove();
   * }
   * </code>
   * </div>
   */
  remove() {
    // stop all audios/videos and detach all devices like microphone/camera etc
    // used as input/output for audios/videos.
    // if (this instanceof p5.MediaElement) {
    if(this.stop){
      this.stop();
      const sources = this.elt.srcObject;
      if (sources !== null) {
        const tracks = sources.getTracks();
        tracks.forEach(track => {
          track.stop();
        });
      }
    }

    // delete the reference in this._pInst._elements
    const index = this._pInst._elements.indexOf(this);
    if (index !== -1) {
      this._pInst._elements.splice(index, 1);
    }

    // deregister events
    for (let ev in this._events) {
      this.elt.removeEventListener(ev, this._events[ev]);
    }
    if (this.elt && this.elt.parentNode) {
      this.elt.parentNode.removeChild(this.elt);
    }
  }

  /**
   * Attaches the element to a parent element.
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
   * Calling `myElement.parent()` without an argument returns the element's
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
   *
   *   // Place the div in the top-left corner.
   *   div.position(10, 20);
   *
   *   // Set its width and height.
   *   div.size(80, 60);
   *
   *   // Set its background color to white
   *   div.style('background-color', 'white');
   *
   *   // Align any text to the center.
   *   div.style('text-align', 'center');
   *
   *   // Set its ID to "container".
   *   div.id('container');
   *
   *   // Create a paragraph element.
   *   let p = createP('p5*js');
   *
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
   *
   *   // Place the div in the top-left corner.
   *   div.position(10, 20);
   *
   *   // Set its width and height.
   *   div.size(80, 60);
   *
   *   // Set its background color and align
   *   // any text to the center.
   *   div.style('background-color', 'white');
   *   div.style('text-align', 'center');
   *
   *   // Create a paragraph element.
   *   let p = createP('p5*js');
   *
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
   *
   *   // Place the div in the top-left corner.
   *   div.position(10, 20);
   *
   *   // Set its width and height.
   *   div.size(80, 60);
   *
   *   // Set its background color and align
   *   // any text to the center.
   *   div.style('background-color', 'white');
   *   div.style('text-align', 'center');
   *
   *   // Create a paragraph element.
   *   let p = createP('p5*js');
   *
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
    } else if (p instanceof Element) {
      p = p.elt;
    }
    p.appendChild(this.elt);
    return this;
  }

  /**
   * Attaches the element as a child of another element.
   *
   * `myElement.child()` accepts either a string ID, DOM node, or
   * <a href="#/p5.Element">p5.Element</a>. For example,
   * `myElement.child(otherElement)`. If no argument is provided, an array of
   * children DOM nodes is returned.
   *
   * @returns {Node[]} an array of child nodes.
   *
   * @example
   * <div class='norender'>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create the div elements.
   *   let div0 = createDiv('Parent');
   *   let div1 = createDiv('Child');
   *
   *   // Make div1 the child of div0
   *   // using the p5.Element.
   *   div0.child(div1);
   *
   *   describe('A gray square with the words "Parent" and "Child" written beneath it.');
   * }
   * </code>
   * </div>
   *
   * <div class='norender'>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create the div elements.
   *   let div0 = createDiv('Parent');
   *   let div1 = createDiv('Child');
   *
   *   // Give div1 an ID.
   *   div1.id('apples');
   *
   *   // Make div1 the child of div0
   *   // using its ID.
   *   div0.child('apples');
   *
   *   describe('A gray square with the words "Parent" and "Child" written beneath it.');
   * }
   * </code>
   * </div>
   *
   * <div class='norender notest'>
   * <code>
   * // This example assumes there is a div already on the page
   * // with id "myChildDiv".
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create the div elements.
   *   let div0 = createDiv('Parent');
   *
   *   // Select the child element by its ID.
   *   let elt = document.getElementById('myChildDiv');
   *
   *   // Make div1 the child of div0
   *   // using its HTMLElement object.
   *   div0.child(elt);
   *
   *   describe('A gray square with the words "Parent" and "Child" written beneath it.');
   * }
   * </code>
   * </div>
   */
  /**
   * @param  {String|p5.Element} [child] the ID, DOM node, or <a href="#/p5.Element">p5.Element</a>
   *                         to add to the current element
   * @chainable
   */
  child(childNode) {
    if (typeof childNode === 'undefined') {
      return this.elt.childNodes;
    }
    if (typeof childNode === 'string') {
      if (childNode[0] === '#') {
        childNode = childNode.substring(1);
      }
      childNode = document.getElementById(childNode);
    } else if (childNode instanceof Element) {
      childNode = childNode.elt;
    }

    if (childNode instanceof HTMLElement) {
      this.elt.appendChild(childNode);
    }
    return this;
  }

  /**
   * Sets the inner HTML of the element, replacing any existing HTML.
   *
   * The second parameter, `append`, is optional. If `true` is passed, as in
   * `myElement.html('hi', true)`, the HTML is appended instead of replacing
   * existing HTML.
   *
   * If no arguments are passed, as in `myElement.html()`, the element's inner
   * HTML is returned.
   *
   * @for p5.Element
   * @returns {String} the inner HTML of the element
   *
   * @example
   * <div class='norender'>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create the div element and set its size.
   *   let div = createDiv('');
   *   div.size(100, 100);
   *
   *   // Set the inner HTML to "hi".
   *   div.html('hi');
   *
   *   describe('A gray square with the word "hi" written beneath it.');
   * }
   * </code>
   * </div>
   *
   * <div class='norender'>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create the div element and set its size.
   *   let div = createDiv('Hello ');
   *   div.size(100, 100);
   *
   *   // Append "World" to the div's HTML.
   *   div.html('World', true);
   *
   *   describe('A gray square with the text "Hello World" written beneath it.');
   * }
   * </code>
   * </div>
   *
   * <div class='norender'>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create the div element.
   *   let div = createDiv('Hello');
   *
   *   // Prints "Hello" to the console.
   *   print(div.html());
   *
   *   describe('A gray square with the word "Hello!" written beneath it.');
   * }
   * </code>
   * </div>
   */
  /**
   * @param  {String} [html] the HTML to be placed inside the element
   * @param  {Boolean} [append] whether to append HTML to existing
   * @chainable
   */
  html(...args) {
    if (args.length === 0) {
      return this.elt.innerHTML;
    } else if (args[1]) {
      this.elt.insertAdjacentHTML('beforeend', args[0]);
      return this;
    } else {
      this.elt.innerHTML = args[0];
      return this;
    }
  }

  /**
   * Sets the element's ID using a given string.
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
   * to the element using a given string.
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
   *
   * Adds a class to the element.
   *
   * @for p5.Element
   * @param  {String} class name of class to add.
   * @chainable
   *
   * @example
   * <div class='norender'>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a div element.
   *   let div = createDiv('div');
   *
   *   // Add a class to the div.
   *   div.addClass('myClass');
   *
   *   describe('A gray square.');
   * }
   * </code>
   * </div>
   */
  addClass(c) {
    if (this.elt.className) {
      if (!this.hasClass(c)) {
        this.elt.className = this.elt.className + ' ' + c;
      }
    } else {
      this.elt.className = c;
    }
    return this;
  }

  /**
   * Removes a class from the element.
   *
   * @param  {String} class name of class to remove.
   * @chainable
   *
   * @example
   * <div class='norender'>
   * <code>
   * // In this example, a class is set when the div is created
   * // and removed when mouse is pressed. This could link up
   * // with a CSS style rule to toggle style properties.
   *
   * let div;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a div element.
   *   div = createDiv('div');
   *
   *   // Add a class to the div.
   *   div.addClass('myClass');
   *
   *   describe('A gray square.');
   * }
   *
   * // Remove 'myClass' from the div when the user presses the mouse.
   * function mousePressed() {
   *   div.removeClass('myClass');
   * }
   * </code>
   * </div>
   */
  removeClass(c) {
    // Note: Removing a class that does not exist does NOT throw an error in classList.remove method
    this.elt.classList.remove(c);
    return this;
  }

  /**
   * Checks if a class is already applied to element.
   *
   * @returns {boolean} a boolean value if element has specified class.
   * @param c {String} name of class to check.
   *
   * @example
   * <div class='norender'>
   * <code>
   * let div;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a div element.
   *   div = createDiv('div');
   *
   *   // Add the class 'show' to the div.
   *   div.addClass('show');
   *
   *   describe('A gray square.');
   * }
   *
   * // Toggle the class 'show' when the mouse is pressed.
   * function mousePressed() {
   *   if (div.hasClass('show')) {
   *     div.addClass('show');
   *   } else {
   *     div.removeClass('show');
   *   }
   * }
   * </code>
   * </div>
   */
  hasClass(c) {
    return this.elt.classList.contains(c);
  }

  /**
   * Toggles whether a class is applied to the element.
   *
   * @param c {String} class name to toggle.
   * @chainable
   *
   * @example
   * <div class='norender'>
   * <code>
   * let div;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a div element.
   *   div = createDiv('div');
   *
   *   // Add the 'show' class to the div.
   *   div.addClass('show');
   *
   *   describe('A gray square.');
   * }
   *
   * // Toggle the 'show' class when the mouse is pressed.
   * function mousePressed() {
   *   div.toggleClass('show');
   * }
   * </code>
   * </div>
   */
  toggleClass(c) {
    // classList also has a toggle() method, but we cannot use that yet as support is unclear.
    // See https://github.com/processing/p5.js/issues/3631
    // this.elt.classList.toggle(c);
    if (this.elt.classList.contains(c)) {
      this.elt.classList.remove(c);
    } else {
      this.elt.classList.add(c);
    }
    return this;
  }

  /**
   * Centers the element either vertically, horizontally, or both.
   *
   * `center()` will center the element relative to its parent or according to
   * the page's body if the element has no parent.
   *
   * If no argument is passed, as in `myElement.center()` the element is aligned
   * both vertically and horizontally.
   *
   * @param  {String} [align] passing 'vertical', 'horizontal' aligns element accordingly
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create the div element and style it.
   *   let div = createDiv('');
   *   div.size(10, 10);
   *   div.style('background-color', 'orange');
   *
   *   // Center the div relative to the page's body.
   *   div.center();
   *
   *   describe('A gray square and an orange rectangle. The rectangle is at the center of the page.');
   * }
   * </code>
   * </div>
   */
  center(align) {
    const style = this.elt.style.display;
    const hidden = this.elt.style.display === 'none';
    const parentHidden = this.parent().style.display === 'none';
    const pos = { x: this.elt.offsetLeft, y: this.elt.offsetTop };

    if (hidden) this.show();
    if (parentHidden) this.parent().show();
    this.elt.style.display = 'block';

    this.position(0, 0);
    const wOffset = Math.abs(this.parent().offsetWidth - this.elt.offsetWidth);
    const hOffset = Math.abs(this.parent().offsetHeight - this.elt.offsetHeight);

    if (align === 'both' || align === undefined) {
      this.position(
        wOffset / 2 + this.parent().offsetLeft,
        hOffset / 2 + this.parent().offsetTop
      );
    } else if (align === 'horizontal') {
      this.position(wOffset / 2 + this.parent().offsetLeft, pos.y);
    } else if (align === 'vertical') {
      this.position(pos.x, hOffset / 2 + this.parent().offsetTop);
    }

    this.style('display', style);
    if (hidden) this.hide();
    if (parentHidden) this.parent().hide();

    return this;
  }

  /**
   * Sets the element's position.
   *
   * The first two parameters, `x` and `y`, set the element's position relative
   * to the top-left corner of the web page.
   *
   * The third parameter, `positionType`, is optional. It sets the element's
   * <a target="_blank"
   * href="https://developer.mozilla.org/en-US/docs/Web/CSS/position">positioning scheme</a>.
   * `positionType` is a string that can be either `'static'`, `'fixed'`,
   * `'relative'`, `'sticky'`, `'initial'`, or `'inherit'`.
   *
   * If no arguments passed, as in `myElement.position()`, the method returns
   * the element's position in an object, as in `{ x: 0, y: 0 }`.
   *
   * @returns {Object} object of form `{ x: 0, y: 0 }` containing the element's position.
   *
   * @example
   * <div>
   * <code class='norender'>
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Positions the canvas 50px to the right and 100px
   *   // below the top-left corner of the window.
   *   cnv.position(50, 100);
   *
   *   describe('A gray square that is 50 pixels to the right and 100 pixels down from the top-left corner of the web page.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code class='norender'>
   * function setup() {
   *   let cnv = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Positions the canvas at the top-left corner
   *   // of the window with a 'fixed' position type.
   *   cnv.position(0, 0, 'fixed');
   *
   *   describe('A gray square in the top-left corner of the web page.');
   * }
   * </code>
   * </div>
   */
  /**
   * @param  {Number} [x] x-position relative to top-left of window (optional)
   * @param  {Number} [y] y-position relative to top-left of window (optional)
   * @param  {String} [positionType] it can be static, fixed, relative, sticky, initial or inherit (optional)
   * @chainable
   */
  position(...args) {
    if (args.length === 0) {
      return { x: this.elt.offsetLeft, y: this.elt.offsetTop };
    } else {
      let positionType = 'absolute';
      if (
        args[2] === 'static' ||
        args[2] === 'fixed' ||
        args[2] === 'relative' ||
        args[2] === 'sticky' ||
        args[2] === 'initial' ||
        args[2] === 'inherit'
      ) {
        positionType = args[2];
      }
      this.elt.style.position = positionType;
      this.elt.style.left = args[0] + 'px';
      this.elt.style.top = args[1] + 'px';
      this.x = args[0];
      this.y = args[1];
      return this;
    }
  }

  /**
   * Shows the current element.
   *
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * let p;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a paragraph element and hide it.
   *   p = createP('p5*js');
   *   p.position(10, 10);
   *   p.hide();
   *
   *   describe('A gray square. The text "p5*js" appears when the user double-clicks the square.');
   * }
   *
   * // Show the paragraph when the user double-clicks.
   * function doubleClicked() {
   *   p.show();
   * }
   * </code>
   * </div>
   */
  show() {
    this.elt.style.display = 'block';
    return this;
  }

  /**
   * Hides the current element.
   *
   * @chainable
   *
   * @example
   * let p;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a paragraph element.
   *   p = createP('p5*js');
   *   p.position(10, 10);
   *
   *   describe('The text "p5*js" at the center of a gray square. The text disappears when the user double-clicks the square.');
   * }
   *
   * // Hide the paragraph when the user double-clicks.
   * function doubleClicked() {
   *   p.hide();
   * }
   * </code>
   * </div>
   */
  hide() {
    this.elt.style.display = 'none';
    return this;
  }

  /**
   * Sets the element's width and height.
   *
   * Calling `myElement.size()` without an argument returns the element's size
   * as an object with the properties `width` and `height`. For example,
   *  `{ width: 20, height: 10 }`.
   *
   * The first parameter, `width`, is optional. It's a number used to set the
   * element's width. Calling `myElement.size(10)`
   *
   * The second parameter, 'height`, is also optional. It's a
   * number used to set the element's height. For example, calling
   * `myElement.size(20, 10)` sets the element's width to 20 pixels and height
   * to 10 pixels.
   *
   * The constant `AUTO` can be used to adjust one dimension at a time while
   * maintaining the aspect ratio, which is `width / height`. For example,
   * consider an element that's 200 pixels wide and 100 pixels tall. Calling
   * `myElement.size(20, AUTO)` sets the width to 20 pixels and height to 10
   * pixels.
   *
   * Note: In the case of elements that need to load data, such as images, wait
   * to call `myElement.size()` until after the data loads.
   *
   * @return {Object} width and height of the element in an object.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a pink div element and place it at the top-left corner.
   *   let div = createDiv();
   *   div.position(10, 10);
   *   div.style('background-color', 'deeppink');
   *
   *   // Set the div's width to 80 pixels and height to 20 pixels.
   *   div.size(80, 20);
   *
   *   describe('A gray square with a pink rectangle near its top.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a pink div element and place it at the top-left corner.
   *   let div = createDiv();
   *   div.position(10, 10);
   *   div.style('background-color', 'deeppink');
   *
   *   // Set the div's width to 80 pixels and height to 40 pixels.
   *   div.size(80, 40);
   *
   *   // Get the div's size as an object.
   *   let s = div.size();
   *
   *   // Display the div's dimensions.
   *   div.html(`${s.width} x ${s.height}`);
   *
   *   describe('A gray square with a pink rectangle near its top. The text "80 x 40" is written within the rectangle.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let img1;
   * let img2;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Load an image of an astronaut on the moon
   *   // and place it at the top-left of the canvas.
   *   img1 = createImg(
   *     'assets/moonwalk.jpg',
   *     'An astronaut walking on the moon',
   *     ''
   *   );
   *   img1.position(0, 0);
   *
   *   // Load an image of an astronaut on the moon
   *   // and place it at the top-left of the canvas.
   *   // Resize the image once it's loaded.
   *   img2 = createImg(
   *     'assets/moonwalk.jpg',
   *     'An astronaut walking on the moon',
   *     '',
   *     resizeImage
   *   );
   *   img2.position(0, 0);
   *
   *   describe('A gray square two copies of a space image at the top-left. The copy in front is smaller.');
   * }
   *
   * // Resize img2 and keep its aspect ratio.
   * function resizeImage() {
   *   img2.size(50, AUTO);
   * }
   * </code>
   * </div>
   */
  /**
   * @param  {(Number|AUTO)} [w]   width of the element, either AUTO, or a number.
   * @param  {(Number|AUTO)} [h] height of the element, either AUTO, or a number.
   * @chainable
   */
  size(w, h) {
    if (arguments.length === 0) {
      return { width: this.elt.offsetWidth, height: this.elt.offsetHeight };
    } else {
      let aW = w;
      let aH = h;
      const AUTO = constants.AUTO;
      if (aW !== AUTO || aH !== AUTO) {
        if (aW === AUTO) {
          aW = h * this.width / this.height;
        } else if (aH === AUTO) {
          aH = w * this.height / this.width;
        }
        // set diff for cnv vs normal div
        if (this.elt instanceof HTMLCanvasElement) {
          const j = {};
          const k = this.elt.getContext('2d');
          let prop;
          for (prop in k) {
            j[prop] = k[prop];
          }
          this.elt.setAttribute('width', aW * this._pInst._pixelDensity);
          this.elt.setAttribute('height', aH * this._pInst._pixelDensity);
          this.elt.style.width = aW + 'px';
          this.elt.style.height = aH + 'px';
          this._pInst.scale(this._pInst._pixelDensity, this._pInst._pixelDensity);
          for (prop in j) {
            this.elt.getContext('2d')[prop] = j[prop];
          }
        } else {
          this.elt.style.width = aW + 'px';
          this.elt.style.height = aH + 'px';
          this.elt.width = aW;
          this.elt.height = aH;
        }
        this.width = aW;
        this.height = aH;
        if (this._pInst && this._pInst._curElement) {
          // main canvas associated with p5 instance
          if (this._pInst._curElement.elt === this.elt) {
            this._pInst.width = aW;
            this._pInst.height = aH;
          }
        }
      }
      return this;
    }
  }

  /**
   * Applies a style to the element by adding a
   * <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Syntax" target="_blank">CSS declaration</a>.
   *
   * The first parameter, `property`, is a string. If the name of a style
   * property is passed, as in `myElement.style('color')`, the method returns
   * the current value as a string or `null` if it hasn't been set. If a
   * `property:style` string is passed, as in
   * `myElement.style('color:deeppink')`, the method sets the style `property`
   * to `value`.
   *
   * The second parameter, `value`, is optional. It sets the property's value.
   * `value` can be a string, as in
   * `myElement.style('color', 'deeppink')`, or a
   * <a href="#/p5.Color">p5.Color</a> object, as in
   * `myElement.style('color', myColor)`.
   *
   * @param  {String} property style property to set.
   * @returns {String} value of the property.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a paragraph element and set its font color to "deeppink".
   *   let p = createP('p5*js');
   *   p.position(25, 20);
   *   p.style('color', 'deeppink');
   *
   *   describe('The text p5*js written in pink on a gray background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a p5.Color object.
   *   let c = color('deeppink');
   *
   *   // Create a paragraph element and set its font color using a p5.Color object.
   *   let p = createP('p5*js');
   *   p.position(25, 20);
   *   p.style('color', c);
   *
   *   describe('The text p5*js written in pink on a gray background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a paragraph element and set its font color to "deeppink"
   *   // using property:value syntax.
   *   let p = createP('p5*js');
   *   p.position(25, 20);
   *   p.style('color:deeppink');
   *
   *   describe('The text p5*js written in pink on a gray background.');
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create an empty paragraph element and set its font color to "deeppink".
   *   let p = createP();
   *   p.position(5, 5);
   *   p.style('color', 'deeppink');
   *
   *   // Get the element's color as an  RGB color string.
   *   let c = p.style('color');
   *
   *   // Set the element's inner HTML using the RGB color string.
   *   p.html(c);
   *
   *   describe('The text "rgb(255, 20, 147)" written in pink on a gray background.');
   * }
   * </code>
   * </div>
   */
  /**
   * @param  {String} property
   * @param  {String|p5.Color} value value to assign to the property.
   * @return {String} value of the property.
   * @chainable
   */
  style(prop, val) {
    const self = this;

    if (val instanceof Color) {
      val = val.toString();
    }

    if (typeof val === 'undefined') {
      if (prop.indexOf(':') === -1) {
        // no value set, so assume requesting a value
        let styles = window.getComputedStyle(self.elt);
        let style = styles.getPropertyValue(prop);
        return style;
      } else {
        // value set using `:` in a single line string
        const attrs = prop.split(';');
        for (let i = 0; i < attrs.length; i++) {
          const parts = attrs[i].split(':');
          if (parts[0] && parts[1]) {
            this.elt.style[parts[0].trim()] = parts[1].trim();
          }
        }
      }
    } else {
      // input provided as key,val pair
      this.elt.style[prop] = val;
      if (
        prop === 'width' ||
        prop === 'height' ||
        prop === 'left' ||
        prop === 'top'
      ) {
        let styles = window.getComputedStyle(self.elt);
        let styleVal = styles.getPropertyValue(prop);
        let numVal = styleVal.replace(/[^\d.]/g, '');
        this[prop] = Math.round(parseFloat(numVal, 10));
      }
    }
    return this;
  }

  /* Helper method called by p5.Element.style() */
  _translate(...args) {
    this.elt.style.position = 'absolute';
    // save out initial non-translate transform styling
    let transform = '';
    if (this.elt.style.transform) {
      transform = this.elt.style.transform.replace(/translate3d\(.*\)/g, '');
      transform = transform.replace(/translate[X-Z]?\(.*\)/g, '');
    }
    if (args.length === 2) {
      this.elt.style.transform =
        'translate(' + args[0] + 'px, ' + args[1] + 'px)';
    } else if (args.length > 2) {
      this.elt.style.transform =
        'translate3d(' +
        args[0] +
        'px,' +
        args[1] +
        'px,' +
        args[2] +
        'px)';
      if (args.length === 3) {
        this.elt.parentElement.style.perspective = '1000px';
      } else {
        this.elt.parentElement.style.perspective = args[3] + 'px';
      }
    }
    // add any extra transform styling back on end
    this.elt.style.transform += transform;
    return this;
  }

  /* Helper method called by p5.Element.style() */
  _rotate(...args) {
    // save out initial non-rotate transform styling
    let transform = '';
    if (this.elt.style.transform) {
      transform = this.elt.style.transform.replace(/rotate3d\(.*\)/g, '');
      transform = transform.replace(/rotate[X-Z]?\(.*\)/g, '');
    }

    if (args.length === 1) {
      this.elt.style.transform = 'rotate(' + args[0] + 'deg)';
    } else if (args.length === 2) {
      this.elt.style.transform =
        'rotate(' + args[0] + 'deg, ' + args[1] + 'deg)';
    } else if (args.length === 3) {
      this.elt.style.transform = 'rotateX(' + args[0] + 'deg)';
      this.elt.style.transform += 'rotateY(' + args[1] + 'deg)';
      this.elt.style.transform += 'rotateZ(' + args[2] + 'deg)';
    }
    // add remaining transform back on
    this.elt.style.transform += transform;
    return this;
  }

  /**
   * Adds an
   * <a href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Getting_started#attributes" target="_blank">attribute</a>
   * to the element.
   *
   * This method is useful for advanced tasks. Most commonly-used attributes,
   * such as `id`, can be set with their dedicated methods. For example,
   * `nextButton.id('next')` sets an element's `id` attribute. Calling
   * `nextButton.attribute('id', 'next')` has the same effect.
   *
   * The first parameter, `attr`, is the attribute's name as a string. Calling
   * `myElement.attribute('align')` returns the attribute's current value as a
   * string or `null` if it hasn't been set.
   *
   * The second parameter, `value`, is optional. It's a string used to set the
   * attribute's value. For example, calling
   * `myElement.attribute('align', 'center')` sets the element's horizontal
   * alignment to `center`.
   *
   * @return {String} value of the attribute.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a container div element and place it at the top-left corner.
   *   let container = createDiv();
   *   container.position(0, 0);
   *
   *   // Create a paragraph element and place it within the container.
   *   // Set its horizontal alignment to "left".
   *   let p1 = createP('hi');
   *   p1.parent(container);
   *   p1.attribute('align', 'left');
   *
   *   // Create a paragraph element and place it within the container.
   *   // Set its horizontal alignment to "center".
   *   let p2 = createP('hi');
   *   p2.parent(container);
   *   p2.attribute('align', 'center');
   *
   *   // Create a paragraph element and place it within the container.
   *   // Set its horizontal alignment to "right".
   *   let p3 = createP('hi');
   *   p3.parent(container);
   *   p3.attribute('align', 'right');
   *
   *   describe('A gray square with the text "hi" written on three separate lines, each placed further to the right.');
   * }
   * </code>
   * </div>
   */
  /**
   * @param  {String} attr       attribute to set.
   * @param  {String} value      value to assign to the attribute.
   * @chainable
   */
  attribute(attr, value) {
    //handling for checkboxes and radios to ensure options get
    //attributes not divs
    if (
      this.elt.firstChild != null &&
      (this.elt.firstChild.type === 'checkbox' ||
        this.elt.firstChild.type === 'radio')
    ) {
      if (typeof value === 'undefined') {
        return this.elt.firstChild.getAttribute(attr);
      } else {
        for (let i = 0; i < this.elt.childNodes.length; i++) {
          this.elt.childNodes[i].setAttribute(attr, value);
        }
      }
    } else if (typeof value === 'undefined') {
      return this.elt.getAttribute(attr);
    } else {
      this.elt.setAttribute(attr, value);
      return this;
    }
  }

  /**
   * Removes an attribute from the element.
   *
   * The parameter `attr` is the attribute's name as a string. For example,
   * calling `myElement.removeAttribute('align')` removes its `align`
   * attribute if it's been set.
   *
   * @param  {String} attr       attribute to remove.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * let p;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a paragraph element and place it in the center of the canvas.
   *   // Set its "align" attribute to "center".
   *   p = createP('hi');
   *   p.position(0, 20);
   *   p.attribute('align', 'center');
   *
   *   describe('The text "hi" written in black at the center of a gray square. The text moves to the left edge when double-clicked.');
   * }
   *
   * // Remove the 'align' attribute when the user double-clicks the paragraph.
   * function doubleClicked() {
   *   p.removeAttribute('align');
   * }
   * </code>
   * </div>
   */
  removeAttribute(attr) {
    if (
      this.elt.firstChild != null &&
      (this.elt.firstChild.type === 'checkbox' ||
        this.elt.firstChild.type === 'radio')
    ) {
      for (let i = 0; i < this.elt.childNodes.length; i++) {
        this.elt.childNodes[i].removeAttribute(attr);
      }
    }
    this.elt.removeAttribute(attr);
    return this;
  }

  /**
   * Returns or sets the element's value.
   *
   * Calling `myElement.value()` returns the element's current value.
   *
   * The parameter, `value`, is an optional number or string. If provided,
   * as in `myElement.value(123)`, it's used to set the element's value.
   *
   * @return {String|Number} value of the element.
   *
   * @example
   * <div>
   * <code>
   * let input;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a text input and place it beneath the canvas.
   *   // Set its default value to "hello".
   *   input = createInput('hello');
   *   input.position(0, 100);
   *
   *   describe('The text from an input box is displayed on a gray square.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Use the input's value to display a message.
   *   let msg = input.value();
   *   text(msg, 0, 55);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let input;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   // Create a text input and place it beneath the canvas.
   *   // Set its default value to "hello".
   *   input = createInput('hello');
   *   input.position(0, 100);
   *
   *   describe('The text from an input box is displayed on a gray square. The text resets to "hello" when the user double-clicks the square.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Use the input's value to display a message.
   *   let msg = input.value();
   *   text(msg, 0, 55);
   * }
   *
   * // Reset the input's value.
   * function doubleClicked() {
   *   input.value('hello');
   * }
   * </code>
   * </div>
   */
  /**
   * @param  {String|Number}     value
   * @chainable
   */
  value(...args) {
    if (args.length > 0) {
      this.elt.value = args[0];
      return this;
    } else {
      if (this.elt.type === 'range') {
        return parseFloat(this.elt.value);
      } else return this.elt.value;
    }
  }

  /**
   * Calls a function when the mouse is pressed over the element.
   *
   * Calling `myElement.mousePressed(false)` disables the function.
   *
   * Note: Some mobile browsers may also trigger this event when the element
   * receives a quick tap.
   *
   * @param  {Function|Boolean} fxn function to call when the mouse is
   *                                pressed over the element.
   *                                `false` disables the function.
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
   */
  mousePressed(fxn) {
    // Prepend the mouse property setters to the event-listener.
    // This is required so that mouseButton is set correctly prior to calling the callback (fxn).
    // For details, see https://github.com/processing/p5.js/issues/3087.
    const eventPrependedFxn = function (event) {
      this._pInst.mouseIsPressed = true;
      this._pInst._activePointers.set(event.pointerId, event);
      this._pInst._setMouseButton(event);
      this._pInst._updatePointerCoords(event);
      // Pass along the return-value of the callback:
      return fxn.call(this, event);
    };
    // Pass along the event-prepended form of the callback.
    Element._adjustListener('pointerdown', eventPrependedFxn, this);
    return this;
  }

  /**
   * Calls a function when the mouse is pressed twice over the element.
   *
   * Calling `myElement.doubleClicked(false)` disables the function.
   *
   * @param  {Function|Boolean} fxn function to call when the mouse is
   *                                double clicked over the element.
   *                                `false` disables the function.
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
   */
  doubleClicked(fxn) {
    Element._adjustListener('dblclick', fxn, this);
    return this;
  }

  /**
   * Calls a function when the mouse wheel scrolls over the element.
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
    Element._adjustListener('wheel', fxn, this);
    return this;
  }

  /**
   * Calls a function when the mouse is released over the element.
   *
   * Calling `myElement.mouseReleased(false)` disables the function.
   *
   * Note: Some mobile browsers may also trigger this event when the element
   * receives a quick tap.
   *
   * @param  {Function|Boolean} fxn function to call when the mouse is
   *                                pressed over the element.
   *                                `false` disables the function.
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
   */
  mouseReleased(fxn) {
    Element._adjustListener('pointerup', fxn, this);
    return this;
  }

  /**
   * Calls a function when the mouse is pressed and released over the element.
   *
   * Calling `myElement.mouseReleased(false)` disables the function.
   *
   * Note: Some mobile browsers may also trigger this event when the element
   * receives a quick tap.
   *
   * @param  {Function|Boolean} fxn function to call when the mouse is
   *                                pressed and released over the element.
   *                                `false` disables the function.
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
   */
  mouseClicked(fxn) {
    Element._adjustListener('click', fxn, this);
    return this;
  }

  /**
   * Calls a function when the mouse moves over the element.
   *
   * Calling `myElement.mouseMoved(false)` disables the function.
   *
   * @param  {Function|Boolean} fxn function to call when the mouse
   *                                moves over the element.
   *                                `false` disables the function.
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
   */
  mouseMoved(fxn) {
    Element._adjustListener('pointermove', fxn, this);
    return this;
  }

  /**
   * Calls a function when the mouse moves onto the element.
   *
   * Calling `myElement.mouseOver(false)` disables the function.
   *
   * @param  {Function|Boolean} fxn function to call when the mouse
   *                                moves onto the element.
   *                                `false` disables the function.
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
   */
  mouseOver(fxn) {
    Element._adjustListener('pointerover', fxn, this);
    return this;
  }

  /**
   * Calls a function when the mouse moves off the element.
   *
   * Calling `myElement.mouseOut(false)` disables the function.
   *
   * @param  {Function|Boolean} fxn function to call when the mouse
   *                                moves off the element.
   *                                `false` disables the function.
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
   */
  mouseOut(fxn) {
    Element._adjustListener('pointerout', fxn, this);
    return this;
  }

    /**
   * Calls a function when a file is dragged over the element.
   *
   * Calling `myElement.dragOver(false)` disables the function.
   *
   * @param  {Function|Boolean} fxn function to call when the file is
   *                                dragged over the element.
   *                                `false` disables the function.
   * @chainable
   *
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
   */
  dragOver(fxn) {
    Element._adjustListener('dragover', fxn, this);
    return this;
  }

  /**
   * Calls a function when a file is dragged off the element.
   *
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
   */
  dragLeave(fxn) {
    Element._adjustListener('dragleave', fxn, this);
    return this;
  }

  /**
   * Calls a function when the element changes.
   *
   * Calling `myElement.changed(false)` disables the function.
   *
   * @param  {Function|Boolean} fxn function to call when the element changes.
   *                                `false` disables the function.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * let dropdown;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a dropdown menu and add a few color options.
   *   dropdown = createSelect();
   *   dropdown.position(0, 0);
   *   dropdown.option('red');
   *   dropdown.option('green');
   *   dropdown.option('blue');
   *
   *   // Call paintBackground() when the color option changes.
   *   dropdown.changed(paintBackground);
   *
   *   describe('A gray square with a dropdown menu at the top. The square changes color when an option is selected.');
   * }
   *
   * // Paint the background with the selected color.
   * function paintBackground() {
   *   let c = dropdown.value();
   *   background(c);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let checkbox;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a checkbox and place it beneath the canvas.
   *   checkbox = createCheckbox(' circle');
   *   checkbox.position(0, 100);
   *
   *   // Call repaint() when the checkbox changes.
   *   checkbox.changed(repaint);
   *
   *   describe('A gray square with a checkbox underneath it that says "circle". A white circle appears when the box is checked and disappears otherwise.');
   * }
   *
   * // Paint the background gray and determine whether to draw a circle.
   * function repaint() {
   *   background(200);
   *   if (checkbox.checked() === true) {
   *     circle(50, 50, 30);
   *   }
   * }
   * </code>
   * </div>
   */
  changed(fxn) {
    Element._adjustListener('change', fxn, this);
    return this;
  }

  /**
   * Calls a function when the element receives input.
   *
   * `myElement.input()` is often used to with text inputs and sliders. Calling
   * `myElement.input(false)` disables the function.
   *
   * @param  {Function|Boolean} fxn function to call when input is detected within
   *                                the element.
   *                                `false` disables the function.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * let slider;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a slider and place it beneath the canvas.
   *   slider = createSlider(0, 255, 200);
   *   slider.position(0, 100);
   *
   *   // Call repaint() when the slider changes.
   *   slider.input(repaint);
   *
   *   describe('A gray square with a range slider underneath it. The background changes shades of gray when the slider is moved.');
   * }
   *
   * // Paint the background using slider's value.
   * function repaint() {
   *   let g = slider.value();
   *   background(g);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * let input;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create an input and place it beneath the canvas.
   *   input = createInput('');
   *   input.position(0, 100);
   *
   *   // Call repaint() when input is detected.
   *   input.input(repaint);
   *
   *   describe('A gray square with a text input bar beneath it. Any text written in the input appears in the middle of the square.');
   * }
   *
   * // Paint the background gray and display the input's value.
   * function repaint() {
   *   background(200);
   *   let msg = input.value();
   *   text(msg, 5, 50);
   * }
   * </code>
   * </div>
   */
  input(fxn) {
    Element._adjustListener('input', fxn, this);
    return this;
  }

  /**
   * Calls a function when the user drops a file on the element.
   *
   * The first parameter, `callback`, is a function to call once the file loads.
   * The callback function should have one parameter, `file`, that's a
   * <a href="#/p5.File">p5.File</a> object. If the user drops multiple files on
   * the element, `callback`, is called once for each file.
   *
   * The second parameter, `fxn`, is a function to call when the browser detects
   * one or more dropped files. The callback function should have one
   * parameter, `event`, that's a
   * <a href="https://developer.mozilla.org/en-US/docs/Web/API/DragEvent">DragEvent</a>.
   *
   * @param  {Function} callback  called when a file loads. Called once for each file dropped.
   * @param  {Function} [fxn]     called once when any files are dropped.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * // Drop an image on the canvas to view
   * // this example.
   * let img;
   *
   * function setup() {
   *   let c = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Call handleFile() when a file that's dropped on the canvas has loaded.
   *   c.drop(handleFile);
   *
   *   describe('A gray square. When the user drops an image on the square, it is displayed.');
   * }
   *
   * // Remove the existing image and display the new one.
   * function handleFile(file) {
   *   // Remove the current image, if any.
   *   if (img) {
   *     img.remove();
   *   }
   *
   *   // Create an <img> element with the
   *   // dropped file.
   *   img = createImg(file.data, '');
   *   img.hide();
   *
   *   // Draw the image.
   *   image(img, 0, 0, width, height);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * // Drop an image on the canvas to view
   * // this example.
   * let img;
   * let msg;
   *
   * function setup() {
   *   let c = createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Call functions when the user drops a file on the canvas
   *   // and when the file loads.
   *   c.drop(handleFile, handleDrop);
   *
   *   describe('A gray square. When the user drops an image on the square, it is displayed. The id attribute of canvas element is also displayed.');
   * }
   *
   * // Display the image when it loads.
   * function handleFile(file) {
   *   // Remove the current image, if any.
   *   if (img) {
   *     img.remove();
   *   }
   *
   *   // Create an img element with the dropped file.
   *   img = createImg(file.data, '');
   *   img.hide();
   *
   *   // Draw the image.
   *   image(img, 0, 0, width, height);
   * }
   *
   * // Display the file's name when it loads.
   * function handleDrop(event) {
   *   // Remove current paragraph, if any.
   *   if (msg) {
   *     msg.remove();
   *   }
   *
   *   // Use event to get the drop target's id.
   *   let id = event.target.id;
   *
   *   // Write the canvas' id beneath it.
   *   msg = createP(id);
   *   msg.position(0, 100);
   *
   *   // Set the font color randomly for each drop.
   *   let c = random(['red', 'green', 'blue']);
   *   msg.style('color', c);
   *   msg.style('font-size', '12px');
   * }
   * </code>
   * </div>
   */
  drop(callback, fxn) {
    // Is the file stuff supported?
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      if (!this._dragDisabled) {
        this._dragDisabled = true;

        const preventDefault = function (evt) {
          evt.preventDefault();
        };

        // If you want to be able to drop you've got to turn off
        // a lot of default behavior.
        // avoid `attachListener` here, since it overrides other handlers.
        this.elt.addEventListener('dragover', preventDefault);

        // If this is a drag area we need to turn off the default behavior
        this.elt.addEventListener('dragleave', preventDefault);
      }

      // Deal with the files
      Element._attachListener(
        'drop',
        function (evt) {
          evt.preventDefault();
          // Call the second argument as a callback that receives the raw drop event
          if (typeof fxn === 'function') {
            fxn.call(this, evt);
          }
          // A FileList
          const files = evt.dataTransfer.files;

          // Load each one and trigger the callback
          for (const f of files) {
            File._load(f, callback);
          }
        },
        this
      );
    } else {
      console.log('The File APIs are not fully supported in this browser.');
    }

    return this;
  }

  /**
   * Makes the element draggable.
   *
   * The parameter, `elmnt`, is optional. If another
   * <a href="#/p5.Element">p5.Element</a> object is passed, as in
   * `myElement.draggable(otherElement)`, the other element will become draggable.
   *
   * @param  {p5.Element} [elmnt]  another <a href="#/p5.Element">p5.Element</a>.
   * @chainable
   *
   * @example
   * <div>
   * <code>
   * let stickyNote;
   * let textInput;
   *
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Create a div element and style it.
   *   stickyNote = createDiv('Note');
   *   stickyNote.position(5, 5);
   *   stickyNote.size(80, 20);
   *   stickyNote.style('font-size', '16px');
   *   stickyNote.style('font-family', 'Comic Sans MS');
   *   stickyNote.style('background', 'orchid');
   *   stickyNote.style('padding', '5px');
   *
   *   // Make the note draggable.
   *   stickyNote.draggable();
   *
   *   // Create a panel div and style it.
   *   let panel = createDiv('');
   *   panel.position(5, 40);
   *   panel.size(80, 50);
   *   panel.style('background', 'orchid');
   *   panel.style('font-size', '16px');
   *   panel.style('padding', '5px');
   *   panel.style('text-align', 'center');
   *
   *   // Make the panel draggable.
   *   panel.draggable();
   *
   *   // Create a text input and style it.
   *   textInput = createInput('Note');
   *   textInput.size(70);
   *
   *   // Add the input to the panel.
   *   textInput.parent(panel);
   *
   *   // Call handleInput() when text is input.
   *   textInput.input(handleInput);
   *
   *   describe(
   *     'A gray square with two purple rectangles that move when dragged. The top rectangle displays the text that is typed into the bottom rectangle.'
   *   );
   * }
   *
   * // Update stickyNote's HTML when text is input.
   * function handleInput() {
   *   stickyNote.html(textInput.value());
   * }
   * </code>
   * </div>
   */
  draggable(elmMove) {
    let isTouch = 'ontouchstart' in window;

    let x = 0,
      y = 0,
      px = 0,
      py = 0,
      elmDrag,
      dragMouseDownEvt = isTouch ? 'touchstart' : 'mousedown',
      closeDragElementEvt = isTouch ? 'touchend' : 'mouseup',
      elementDragEvt = isTouch ? 'touchmove' : 'mousemove';

    if (elmMove === undefined) {
      elmMove = this.elt;
      elmDrag = elmMove;
    } else if (elmMove !== this.elt && elmMove.elt !== this.elt) {
      elmMove = elmMove.elt;
      elmDrag = this.elt;
    }

    elmDrag.addEventListener(dragMouseDownEvt, dragMouseDown, false);
    elmDrag.style.cursor = 'move';

    function dragMouseDown(e) {
      e = e || window.event;

      if (isTouch) {
        const touches = e.changedTouches;
        px = parseInt(touches[0].clientX);
        py = parseInt(touches[0].clientY);
      } else {
        px = parseInt(e.clientX);
        py = parseInt(e.clientY);
      }

      document.addEventListener(closeDragElementEvt, closeDragElement, false);
      document.addEventListener(elementDragEvt, elementDrag, false);
      return false;
    }

    function elementDrag(e) {
      e = e || window.event;

      if (isTouch) {
        const touches = e.changedTouches;
        x = px - parseInt(touches[0].clientX);
        y = py - parseInt(touches[0].clientY);
        px = parseInt(touches[0].clientX);
        py = parseInt(touches[0].clientY);
      } else {
        x = px - parseInt(e.clientX);
        y = py - parseInt(e.clientY);
        px = parseInt(e.clientX);
        py = parseInt(e.clientY);
      }

      elmMove.style.left = elmMove.offsetLeft - x + 'px';
      elmMove.style.top = elmMove.offsetTop - y + 'px';
    }

    function closeDragElement() {
      document.removeEventListener(closeDragElementEvt, closeDragElement, false);
      document.removeEventListener(elementDragEvt, elementDrag, false);
    }

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
      Element._detachListener(ev, ctx);
    } else {
      Element._attachListener(ev, fxn, ctx);
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
      Element._detachListener(ev, ctx);
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
};

function element(p5, fn){
  /**
   * A class to describe an
   * <a href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Getting_started" target="_blank">HTML element</a>.
   *
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
  p5.Element = Element;

  /**
   * A `Number` property that stores the element's width.
   *
   * @type {Number}
   * @property width
   * @for p5.Element
   */

  /**
   * A `Number` property that stores the element's height.
   *
   * @type {Number}
   * @property height
   * @for p5.Element
   */

  /**
   * The element's underlying `HTMLElement` object.
   *
   * The
   * <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement" target="_blank">HTMLElement</a>
   * object's properties and methods can be used directly.
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
   * @name elt
   * @readOnly
   */
}

export default element;
export { Element };

if(typeof p5 !== 'undefined'){
  element(p5, p5.prototype);
}
