/**
 * @module DOM
 * @for PElement
 */
define(function(require) {

  var p5 = require('core');
  var constants = require('constants');

  function PElement(elt, pInst) {
    this.elt = elt;
    this.pInst = pInst;
    this.width = this.elt.offsetWidth;
    this.height = this.elt.offsetHeight;
    if (elt instanceof HTMLCanvasElement && this.pInst) {
      this.context = elt.getContext('2d');
      // for pixel method sharing with pimage
      this.pInst._setProperty('canvas', elt);
    }
  }

  /**
   * 
   * Attaches the element to the parent specified. A way of setting
   * the container for the element. Accepts either a string ID or
   * DOM node.
   * 
   * @for    DOM:PElement
   * @method parent
   * @param  {String|Object} parent the ID or node of the parent elt
   */
  PElement.prototype.parent = function(parent) {
    if (typeof parent === 'string') {
      parent = document.getElementById(parent);
    }
    parent.appendChild(this.elt);
  };

  /**
   * 
   * Sets the inner HTML of the element. Replaces any existing html.
   * 
   * @for    DOM:PElement
   * @method html
   * @param  {String} html the HTML to be placed inside the element
   */
  PElement.prototype.html = function(html) {
    this.elt.innerHTML = html;
  };

  /**
   * 
   * Sets the position of the element relative to (0, 0) of the
   * window. Essentially, sets position:absolute and left and top
   * properties of style.
   * 
   * @for    DOM:PElement
   * @method position
   * @param  {Number} x x-position relative to upper left of window
   * @param  {Number} y y-position relative to upper left of window
   */
  PElement.prototype.position = function(x, y) {
    this.elt.style.position = 'absolute';
    this.elt.style.left = x+'px';
    this.elt.style.top = y+'px';
  };


  PElement.prototype.style = function(s) {
    this.elt.style.cssText += s;
  };

  /**
   * 
   * Sets the ID of the element
   * 
   * @for    DOM:PElement
   * @method id
   * @param  {String} id ID of the element
   */
  PElement.prototype.id = function(id) {
    this.elt.id = id;
  };

  /**
   * 
   * Adds given class to the element
   * 
   * @for    DOM:PElement
   * @method class
   * @param  {String} class class to add
   */
  PElement.prototype.class = function(c) {
    this.elt.className += ' '+c;
  };
  
  /**
   * The .mousePressed() function is called once after every time a 
   * mouse button is pressed over the element. This can be used to
   * attach an element specific event listeners.
   *
   * @for    DOM:PElement
   * @method mousePressed
   * @param  {Function} fxn function to be fired when mouse is
   *                    pressed over the element.
   */
  PElement.prototype.mousePressed = function (fxn) {
    attachListener('click', fxn, this);
  };
  
  /**
   * The .mouseOver() function is called once after every time a 
   * mouse moves onto the element. This can be used to attach an 
   * element specific event listener.
   *
   * @for    DOM:PElement
   * @method mouseOver
   * @param  {Function} fxn function to be fired when mouse is
   *                    moved over the element.
   */
  PElement.prototype.mouseOver = function (fxn) {
    attachListener('mouseover', fxn, this);
  };

  /**
   * The .mouseOut() function is called once after every time a 
   * mouse moves off the element. This can be used to attach an 
   * element specific event listener.
   *
   * @for    DOM:PElement
   * @method mouseOut
   * @param  {Function} fxn function to be fired when mouse is
   *                    moved off the element.
   */
  PElement.prototype.mouseOut = function (fxn) {
    attachListener('mouseout', fxn, this);
  };


  function attachListener(ev, fxn, ctx) {
    var _this = ctx;
    var f = function (e) { fxn(e, _this); };
    ctx.elt.addEventListener(ev, f, false);
    if (ctx.pInst) {
      ctx.pInst._events[ev].push([ctx.elt, f]);
    }
  }

  p5.PElement = PElement;
  
  return PElement;
});
