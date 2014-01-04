define(function (require) {

  'use strict';

  var Processing = require('core');

  Processing.prototype.isKeyPressed = Processing.prototype.keyIsPressed = function() {
    return this.keyPressed;
  };

  Processing.prototype.onkeydown = function(e) {
    var keyPressed = this.keyPressed || window.keyPressed;

    this._setProperty('keyDown', true);
    this._setProperty('keyCode', e.keyCode);
    this._setProperty('key', String.fromCharCode(e.keyCode));
    if (typeof keyPressed === 'function') {
      keyPressed(e);
    }
    for (var i = 0; i < this.sketches.length; i++) {
      var s = this.sketches[i];
      if (typeof s.keyPressed === 'function') {
        s.keyPressed(e);
      }
    }
  };

  Processing.prototype.onkeyup = function(e) {
    var keyReleased = this.keyReleased || window.keyReleased;

    this._setProperty('keyDown', false);
    if (typeof keyReleased === 'function') {
      keyReleased(e);
    }
    for (var i = 0; i < this.sketches.length; i++) {
      var s = this.sketches[i];
      if (typeof s.keyReleased === 'function') {
        s.keyReleased(e);
      }
    }
  };

  Processing.prototype.onkeypress = function(e) {
    var keyTyped = this.keyTyped || window.keyTyped;

    if (typeof keyTyped === 'function') {
      keyTyped(e);
    }
    for (var i = 0; i < this.sketches.length; i++) {
      var s = this.sketches[i];
      if (typeof s.keyTyped === 'function') {
        s.keyTyped(e);
      }
    }
  };

  return Processing;

});
