define(function (require) {

  'use strict';

  var Processing = require('core');

  Processing.prototype.isKeyPressed = Processing.prototype.keyIsPressed = function() {
    return this.keyDown;
  };

  Processing.prototype.onkeydown = function(e) {
    var keyPressed = this.keyPressed || window.keyPressed;

    this._setProperty('keyDown', true);
    this._setProperty('keyCode', e.keyCode);
    this._setProperty('key', String.fromCharCode(e.keyCode));
    if (typeof keyPressed === 'function') {
      keyPressed(e);
    }
  };

  Processing.prototype.onkeyup = function(e) {
    var keyReleased = this.keyReleased || window.keyReleased;

    this._setProperty('keyDown', false);
    if (typeof keyReleased === 'function') {
      keyReleased(e);
    }
  };

  Processing.prototype.onkeypress = function(e) {
    var keyTyped = this.keyTyped || window.keyTyped;

    if (typeof keyTyped === 'function') {
      keyTyped(e);
    }
  };

  return Processing;

});
