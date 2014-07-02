/**
 * @module Input
 * @submodule Touch
 * @for p5
 * @requires core
 */
define(function (require) {

  'use strict';

  var p5 = require('core');

  /**
   * The system variable touchX always contains the horizontal position of
   * one finger, relative to (0, 0) of the canvas. This is best used for
   * single touch interactions. For multi-touch interactions, use the
   * touches[] array.
   *
   * @property touchX
   */
  p5.prototype.touchX = 0;

  /**
   * The system variable touchY always contains the horizontal position of
   * one finger, relative to (0, 0) of the canvas. This is best used for
   * single touch interactions. For multi-touch interactions, use the
   * touches[] array.
   *
   * @property touchY
   */
  p5.prototype.touchY = 0;

  p5.prototype.setTouchPoints = function(e) {
    var context = this._isGlobal ? window : this;

    context._setProperty('touchX', e.changedTouches[0].pageX);
    context._setProperty('touchY', e.changedTouches[0].pageY);

    /**
     * The system variable touches[] contains an array of the positions of all
     * current touch points, relative to (0, 0) of the canvas. Each element in
     * the array is an object with x and y properties.
     *
     * @property touches[]
     */
    var touches = [];
    for(var i = 0; i < e.changedTouches.length; i++){
      var ct = e.changedTouches[i];
      touches[i] = {x: ct.pageX, y: ct.pageY};
    }
    context._setProperty('touches', touches);
  };

  /**
   * The touchStarted() function is called once after every time a touch is
   * registered. If no touchStarted() function is defined, the mousePressed()
   * function will be called instead if it is defined.
   *
   * @method touchStarted
   */
  p5.prototype.ontouchstart = function(e) {
    var context = this._isGlobal ? window : this;
    context.setTouchPoints(e);
    if(typeof context.touchStarted === 'function') {
      e.preventDefault();
      context.touchStarted(e);
    } else if (typeof context.mousePressed === 'function') {
      context.mousePressed(e);
    }
  };

  /**
   * The touchMoved() function is called every time a touch move is registered.
   * If no touchStarted() function is defined, the mouseDragged() function will
   * be called instead if it is defined.
   *
   * @method touchMoved
   */
  p5.prototype.ontouchmove = function(e) {
    var context = this._isGlobal ? window : this;
    context.setTouchPoints(e);
    if (typeof context.touchMoved === 'function') {
      e.preventDefault();
      context.touchMoved(e);
    } else if (typeof context.mouseDragged === 'function') {
      context.mouseDragged(e);
    }
  };

  /**
   * The touchEnded() function is called every time a touch ends. If no 
   * touchStarted() function is defined, the mouseReleased() function will be
   * called instead if it is defined.
   *
   * @method touchEnded
   */
  p5.prototype.ontouchend = function(e) {
    var context = this._isGlobal ? window : this;
    context.setTouchPoints(e);
    if (typeof context.touchEnded === 'function') {
      e.preventDefault();
      context.touchEnded(e);
    } else if (typeof context.mouseReleased === 'function') {
      context.mouseReleased(e);
    }
  };

  return p5;

});
