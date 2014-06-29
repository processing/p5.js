/**
 * @module DOM
 * @for DOM
 */
define(function(require) {

  var p5 = require('core');

  /**
   * A class to describe...
   *
   * @class p5.Element
   * @constructor
   * @param {String} elt DOM node that is wrapped
   * @param {Object} [pInst] pointer to p5 instance
   */
  p5.Element = function(elt, pInst) {
    this.elt = elt;
    this._pInst = pInst;
    this._events = {};
    this.width = this.elt.offsetWidth;
    this.height = this.elt.offsetHeight;
    if (elt instanceof HTMLCanvasElement && this._pInst) {
      this.context = elt.getContext('2d');
      // for pixel method sharing with pimage
      this._pInst._setProperty('canvas', elt);
    }
  };

  /**
   *
   * Attaches the element to the parent specified. A way of setting
   * the container for the element. Accepts either a string ID or
   * DOM node.
   *
   * @for    DOM:p5.Element
   * @method parent
   * @param  {String|Object} parent the ID or node of the parent elt
   */
  p5.Element.prototype.parent = function(parent) {
    if (typeof parent === 'string') {
      parent = document.getElementById(parent);
    }
    parent.appendChild(this.elt);
  };

  /**
   *
   * Sets the inner HTML of the element. Replaces any existing html.
   *
   * @for    DOM:p5.Element
   * @method html
   * @param  {String} html the HTML to be placed inside the element
   */
  p5.Element.prototype.html = function(html) {
    this.elt.innerHTML = html;
  };

  /**
   *
   * Sets the position of the element relative to (0, 0) of the
   * window. Essentially, sets position:absolute and left and top
   * properties of style.
   *
   * @for    DOM:p5.Element
   * @method position
   * @param  {Number} x x-position relative to upper left of window
   * @param  {Number} y y-position relative to upper left of window
   */
  p5.Element.prototype.position = function(x, y) {
    this.elt.style.position = 'absolute';
    this.elt.style.left = x+'px';
    this.elt.style.top = y+'px';
  };

  /**
   *
   * Sets the given style (css) property of the element with the given value.
   *
   * @for    DOM:p5.Element
   * @method style
   * @param  {String} property property to be set
   * @param  {String} value value to assign to property
   */
  p5.Element.prototype.style = function(prop, val) {
    this.elt.style[prop] = val;
  };

  /**
   *
   * Sets the ID of the element
   *
   * @for    DOM:p5.Element
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
   * @for    DOM:p5.Element
   * @method class
   * @param  {String} class class to add
   */
  p5.Element.prototype.class = function(c) {
    this.elt.className += ' '+c;
  };

  /**
   * The .mousePressed() function is called once after every time a
   * mouse button is pressed over the element. This can be used to
   * attach an element specific event listeners.
   *
   * @for    DOM:p5.Element
   * @method mousePressed
   * @param  {Function} fxn function to be fired when mouse is
   *                    pressed over the element.
   */
  p5.Element.prototype.mousePressed = function (fxn) {
    attachListener('click', fxn, this);
  };

  /**
   * The .mouseOver() function is called once after every time a
   * mouse moves onto the element. This can be used to attach an
   * element specific event listener.
   *
   * @for    DOM:p5.Element
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
   * @for    DOM:p5.Element
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
