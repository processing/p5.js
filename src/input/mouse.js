define(function (require) {

  'use strict';

  var Processing = require('core');
  var constants = require('constants');

  /*
  // Another possibility: mouseX, mouseY, etc. are properties with a getter
  // that returns the relative coordinates depending on the current element.
  // I think is overkill and might screw up things in unexpected ways in other
  // parts of pjs.
  Object.defineProperty(exports, "mouseX", {
    get: function() {
      var bounds = this.curElement.elt.getBoundingClientRect();
      return absMouseX - bounds.left;
    },
    set: undefined
  });
  */

  Processing.prototype.isMousePressed = Processing.prototype.mouseIsPressed = function() {
    return this.mousePressed;
  };

  Processing.prototype.updateMouseCoords = function(e) {
    this._setProperty('pmouseX', this.mouseX);
    this._setProperty('pmouseY', this.mouseY);

    // TODO: These are based on the window, not the curElement
    this._setProperty('mouseX', e.pageX);  // - parseInt(this.curElement.elt.style.left, 10);
    this._setProperty('mouseY', e.pageY);  // - parseInt(this.curElement.elt.style.top, 10);

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
