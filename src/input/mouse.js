define(function (require) {

  'use strict';

  var p5 = require('core');
  var constants = require('constants');

  p5.prototype.isMousePressed = p5.prototype.mouseIsPressed = function() {
    return this.settings.mousePressed;
  };

  p5.prototype.updateMouseCoords = function(e) {
    this._setProperty('pmouseX', this.mouseX);
    this._setProperty('pmouseY', this.mouseY);
    this._setProperty('mouseX', Math.max(e.pageX - this.curElement.x, 0));
    this._setProperty('mouseY', Math.max(e.pageY - this.curElement.y, 0));

    this._setProperty('pwinMouseX', this.winMouseX);
    this._setProperty('pwinMouseY', this.winMouseY);
    this._setProperty('winMouseX', e.pageX);
    this._setProperty('winMouseY', e.pageY);
  };

  p5.prototype.setMouseButton = function(e) {

    if (e.button === 1) {
      this._setProperty('mouseButton', constants.CENTER);
    } else if (e.button === 2) {
      this._setProperty('mouseButton', constants.RIGHT);
    } else {
      this._setProperty('mouseButton', constants.LEFT);
    }
  };

  p5.prototype.onmousemove = function(e){
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

  p5.prototype.onmousedown = function(e) {
    var context = this.isGlobal ? window : this;
    this.settings.mousePressed = true;
    this.setMouseButton(e);
    if (typeof context.mousePressed === 'function') {
      context.mousePressed(e);
    }
  };

  p5.prototype.onmouseup = function(e) {
    var context = this.isGlobal ? window : this;
    this.settings.mousePressed = false;
    if (typeof context.mouseReleased === 'function') {
      context.mouseReleased(e);
    }
  };

  p5.prototype.onmouseclick = function(e) {
    var context = this.isGlobal ? window : this;
    if (typeof context.mouseClicked === 'function') {
      context.mouseClicked(e);
    }
  };

  p5.prototype.onmousewheel = function(e) {
    var context = this.isGlobal ? window : this;
    if (typeof context.mouseWheel === 'function') {
      context.mouseWheel(e);
    }
  };

  return p5;

});
