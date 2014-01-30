define(function (require) {

  'use strict';

  var Processing = require('core');
  var constants = require('constants');

  /*
  // Trying to get mouseX to relate to the current context
  Object.defineProperty(Processing.prototype, "mouseX", {
    get: function() {
      return this.windowMouseX - this.curElement.x;
    },
    set: function(v) {
      this._setProperty('mouseX', v); // broken because it calls itself?
    }
  });
  Object.defineProperty(Processing.prototype, "mouseY", {
    get: function() {
      return this.windowMouseY - this.curElement.y;
    },
    set: function(v) {
      this._setProperty('mouseY', v); // broken because it calls itself?
    }
  });
  */

  Processing.prototype.isMousePressed = Processing.prototype.mouseIsPressed = function() {
    return this.settings.mousePressed;
  };

  Processing.prototype.updateMouseCoords = function(e) {
    this._setProperty('pmouseX', this.mouseX);
    this._setProperty('pmouseY', this.mouseY);
    this._setProperty('mouseX', e.offsetX);
    this._setProperty('mouseY', e.offsetY);

    this._setProperty('pwindowMouseX', this.windowMouseX);
    this._setProperty('pwindowMouseY', this.windowMouseY);
    this._setProperty('windowMouseX', e.pageX);
    this._setProperty('windowMouseY', e.pageY);

  };

  Processing.prototype.setMouseButton = function(e) {

    if (e.button === 1) {
      this._setProperty('mouseButton', constants.CENTER);
    } else if (e.button === 2) {
      this._setProperty('mouseButton', constants.RIGHT);
    } else {
     this._setProperty('mouseButton', constants.LEFT);
    }

  };

  Processing.prototype.onmousemove = function(e){
    // TODO: temporary fix to set context based on whether in global mode or not
    var context = this.isGlobal ? window : this;
    this.updateMouseCoords(e);
    if (!this.isMousePressed() && typeof context.mouseMoved === 'function') {
      context.mouseMoved(e);
    }
    if (this.isMousePressed() && typeof context.mouseDragged === 'function') {
      context.mouseDragged(e);
    }
  };

  Processing.prototype.onmousedown = function(e) {
    var context = this.isGlobal ? window : this;
    this.settings.mousePressed = true;
    this.setMouseButton(e);
    if (typeof context.mousePressed === 'function') {
      context.mousePressed(e);
    }
  };

  Processing.prototype.onmouseup = function(e) {
    var context = this.isGlobal ? window : this;
    this.settings.mousePressed = false;
    if (typeof context.mouseReleased === 'function') {
      context.mouseReleased(e);
    }
  };

  Processing.prototype.onmouseclick = function(e) {
    var context = this.isGlobal ? window : this;
    if (typeof context.mouseClicked === 'function') {
      context.mouseClicked(e);
    }
  };

  Processing.prototype.onmousewheel = function(e) {
    var context = this.isGlobal ? window : this;
    if (typeof context.mouseWheel === 'function') {
      context.mouseWheel(e);
    }
  };

  return Processing;

});
