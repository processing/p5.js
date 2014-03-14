define(function (require) {

  'use strict';

  var p5 = require('core');

  p5.prototype.isKeyPressed = p5.prototype.keyIsPressed = function() {
    return this.keyDown;
  };

  p5.prototype.onkeydown = function(e) {
    var keyPressed = this.keyPressed || window.keyPressed;

    this._setProperty('keyDown', true);
    this._setProperty('keyCode', e.keyCode);
    this._setProperty('key', String.fromCharCode(e.keyCode));
    if (typeof keyPressed === 'function') {
      keyPressed(e);
    }
  };

  p5.prototype.onkeyup = function(e) {
    var keyReleased = this.keyReleased || window.keyReleased;

    this._setProperty('keyDown', false);
    if (typeof keyReleased === 'function') {
      keyReleased(e);
    }
  };

  p5.prototype.onkeypress = function(e) {
    var keyTyped = this.keyTyped || window.keyTyped;

    if (typeof keyTyped === 'function') {
      keyTyped(e);
    }
  };

  return p5;

});
