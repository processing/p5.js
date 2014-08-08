/**
 * @module DOM
 * @submodule DOM
 * @for p5.Element
 */
define(function(require) {

  var p5 = require('core');

  /**
   * Base class for all elements added to a sketch, including canvas,
   * graphics buffers, and other HTML elements. Methods in blue are
   * included in the core functionality, methods in brown are added
   * with the <a href="http://p5js.org/libraries/">p5.dom library</a>. 
   * It is not called directly, but p5.Element
   * objects are created by calling createCanvas, createGraphics,
   * or in the p5.dom library, createDiv, createImg, createInput, etc.
   *
   * @class p5.Element
   * @constructor
   * @param {String} elt DOM node that is wrapped
   * @param {Object} [pInst] pointer to p5 instance
   */
  p5.Element = function(elt, pInst) {
    /**
     * Underlying HTML element. All normal HTML methods can be called on this.
     *
     * @property elt
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
   * the container for the element. Accepts either a string ID or
   * DOM node.
   *
   * @method parent
   * @param  {String|Object} parent the ID or node of the parent elt
   * @example
   * <div class="norender"><code>
   * // in the html file:
   * &lt;div id="myContainer">&lt;/div>
   * 
   * // in the js file:
   * var cnv = createCanvas(100, 100);
   * cnv.parent("myContainer");
   * </code></div>
   */
  p5.Element.prototype.parent = function(parent) {
    if (typeof parent === 'string') {
      parent = document.getElementById(parent);
    }
    parent.appendChild(this.elt);
  };

  /**
   *
   * Sets the ID of the element
   *
   * @method id
   * @param  {String} id ID of the element
   */
  p5.Element.prototype.id = function(id) {
    this.elt.id = id;
  };

  /**
   *
   * Adds given class to the element
   *
   * @method class
   * @param  {String} class class to add
   */
  p5.Element.prototype.class = function(c) {
    this.elt.className += ' '+c;
  };

  /**
   * The .mousePressed() function is called once after every time a
   * mouse button is pressed over the element. This can be used to
   * attach element specific event listeners.
   *
   * @method mousePressed
   * @param  {Function} fxn function to be fired when mouse is
   *                    pressed over the element.
   */
  p5.Element.prototype.mousePressed = function (fxn) {
    attachListener('mousedown', fxn, this);
  };

  /**
   * The .mouseReleased() function is called once after every time a
   * mouse button is released over the element. This can be used to
   * attach element specific event listeners.
   *
   * @method mouseReleased
   * @param  {Function} fxn function to be fired when mouse is
   *                    released over the element.
   */
  p5.Element.prototype.mouseReleased = function (fxn) {
    attachListener('mouseup', fxn, this);
  };


  /**
   * The .mouseClicked() function is called once after a mouse button is 
   * pressed and released over the element. This can be used to
   * attach element specific event listeners.
   *
   * @method mouseClicked
   * @param  {Function} fxn function to be fired when mouse is
   *                    clicked over the element.
   */
  p5.Element.prototype.mouseClicked = function (fxn) {
    attachListener('click', fxn, this);
  };

  /**
   * The .mouseMoved() function is called once every time a
   * mouse moves over the element. This can be used to attach an
   * element specific event listener.
   *
   * @method mouseMoved
   * @param  {Function} fxn function to be fired when mouse is
   *                    moved over the element.
   */
  p5.Element.prototype.mouseMoved = function (fxn) {
    attachListener('mousemove', fxn, this);
  };

  /**
   * The .mouseOver() function is called once after every time a
   * mouse moves onto the element. This can be used to attach an
   * element specific event listener.
   *
   * @method mouseOver
   * @param  {Function} fxn function to be fired when mouse is
   *                    moved over the element.
   */
  p5.Element.prototype.mouseOver = function (fxn) {
    attachListener('mouseover', fxn, this);
  };

  /**
   * The .mouseOut() function is called once after every time a
   * mouse moves off the element. This can be used to attach an
   * element specific event listener.
   *
   * @method mouseOut
   * @param  {Function} fxn function to be fired when mouse is
   *                    moved off the element.
   */
  p5.Element.prototype.mouseOut = function (fxn) {
    attachListener('mouseout', fxn, this);
  };

  function attachListener(ev, fxn, ctx) {
    var _this = ctx;
    var f = function (e) { fxn(e, _this); };
    ctx.elt.addEventListener(ev, f, false);
    ctx._events[ev] = f;
  }

  /**
   * Helper fxn for sharing pixel methods
   *
   */
  p5.Element.prototype._setProperty = function (prop, value) {
    this[prop] = value;
  };

  
  return p5.Element;
});
