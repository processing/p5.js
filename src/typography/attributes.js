define(function (require) {

  'use strict';

  var p5 = require('core');
  var constants = require('constants');

  p5.prototype.textAlign = function(a) {
    if (a === constants.LEFT || a === constants.RIGHT || a === constants.CENTER) {
      this.curElement.context.textAlign = a;
    }
  };

  p5.prototype.textFont = function(str) {
    this._setProperty('_textFont', str); //pend temp?
  };

  p5.prototype.textHeight = function(s) {
    return this.curElement.context.measureText(s).height;
  };

  p5.prototype.textLeading = function(l) {
    this._setProperty('_textLeading', l);
  };

  p5.prototype.textSize = function(s) {
    this._setProperty('_textSize', s);
  };

  p5.prototype.textStyle = function(s) {
    if (s === constants.NORMAL || s === constants.ITALIC || s === constants.BOLD) {
      this._setProperty('_textStyle', s);
    }
  };

  p5.prototype.textWidth = function(s) {
    return this.curElement.context.measureText(s).width;
  };

  return p5;

});
