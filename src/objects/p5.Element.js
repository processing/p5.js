/**
 * @module DOM
 * @submodule DOM
 * @for p5.Element
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
   * attach an element specific event listeners.
   *
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
