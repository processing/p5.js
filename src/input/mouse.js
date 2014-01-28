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
    return this.mousePressed;
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
    this.updateMouseCoords(e);
    if (!this.mousePressed && typeof this.mouseMoved === 'function') {
      this.mouseMoved(e);
    }
    if (this.mousePressed && typeof this.mouseDragged === 'function') {
      this.mouseDragged(e);
    }
  };

  Processing.prototype.onmousedown = function(e) {
    this.mousePressed = true;
    this.setMouseButton(e);
    if (typeof this.mousePressed === 'function') {
      this.mousePressed(e);
    }
  };

  Processing.prototype.onmouseup = function(e) {
    this.mousePressed = false;
    if (typeof this.mouseReleased === 'function') {
      this.mouseReleased(e);
    }
  };

  Processing.prototype.onmouseclick = function(e) {
    if (typeof this.mouseClicked === 'function') {
      this.mouseClicked(e);
    }
  };

  Processing.prototype.onmousewheel = function(e) {
    if (typeof this.mouseWheel === 'function') {
      this.mouseWheel(e);
    }
  };

  return Processing;

});
