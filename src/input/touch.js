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
   * one finger, relative to (0, 0) of the canvas in the frame previous to the
   * current frame. This is best used for
   * single touch interactions. For multi-touch interactions, use the
   * touches[] array.
   *
   * @property touchY
   */
  p5.prototype.touchY = 0;

  /**
   * The system variable touchY always contains the horizontal position of
   * one finger, relative to (0, 0) of the canvas in the frame previous to the
   * current frame. This is best used for
   * single touch interactions. For multi-touch interactions, use the
   * touches[] array.
   *
   * @property ptouchX
   */
  p5.prototype.ptouchX = 0;

  /**
   * The system variable pmouseY always contains the vertical position of the
   * mouse in the frame previous to the current frame, relative to (0, 0) of
   * the canvas.
   *
   * @property ptouchY
   */
  p5.prototype.ptouchY = 0;

  /**
   * The system variable touches[] contains an array of the positions of all
   * current touch points, relative to (0, 0) of the canvas. Each element in
   * the array is an object with x and y properties.
   *
   * @property touches[]
   */
  p5.prototype.touches = [];

  p5.prototype._updateTouchCoords = function(e) {
    if(e.type === 'mousedown' || e.type === 'mousemove'){
      this._setProperty('touchX', this.mouseX);
      this._setProperty('touchY', this.mouseY);
    } else {
      this._setProperty('touchX', e.changedTouches[0].pageX);
      this._setProperty('touchY', e.changedTouches[0].pageY);

      var touches = [];
      for(var i = 0; i < e.changedTouches.length; i++){
        var ct = e.changedTouches[i];
        touches[i] = {x: ct.pageX, y: ct.pageY};
      }
      this._setProperty('touches', touches);
    }
  };

  p5.prototype._updatePTouchCoords = function() {
    this._setProperty('ptouchX', this.touchX);
    this._setProperty('ptouchY', this.touchY);
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
    var executeDefault;
    this._updateTouchCoords(e);
    if(typeof context.touchStarted === 'function') {
      executeDefault = context.touchStarted(e);
      if(!executeDefault) {
        e.preventDefault();
      }
    } else if (typeof context.mousePressed === 'function') {
      executeDefault = context.mousePressed(e);
      if(!executeDefault) {
        e.preventDefault();
      }
      //this._setMouseButton(e);
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
    var executeDefault;
    this._updateTouchCoords(e);
    if (typeof context.touchMoved === 'function') {
      executeDefault = context.touchMoved(e);
      if(!executeDefault) {
        e.preventDefault();
      }
    } else if (typeof context.mouseDragged === 'function') {
      executeDefault = context.mouseDragged(e);
      if(!executeDefault) {
        e.preventDefault();
      }
      this._updateMouseCoords(e);
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
    var executeDefault;
    if (typeof context.touchEnded === 'function') {
      executeDefault = context.touchEnded(e);
      if(!executeDefault) {
        e.preventDefault();
      }
    } else if (typeof context.mouseReleased === 'function') {
      executeDefault = context.mouseReleased(e);
      if(!executeDefault) {
        e.preventDefault();
      }
      this._updateMouseCoords(e);
    }
  };

  return p5;

});
