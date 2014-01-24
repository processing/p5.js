define(function (require) {

  'use strict';

  var Processing = require('core');
  var constants = require('constants');

  Processing.prototype.textAlign = function(a) {
    if (a === constants.LEFT || a === constants.RIGHT || a === constants.CENTER) {
      this.curElement.context.textAlign = a;
    }
  };

  Processing.prototype.textFont = function(str) {
    this._setProperty('_textFont', str); //pend temp?
  };

  Processing.prototype.textHeight = function(s) {
    return this.curElement.context.measureText(s).height;
  };

  Processing.prototype.textLeading = function(l) {
    this._setProperty('_textLeading', l);
  };

  Processing.prototype.textSize = function(s) {
    this._setProperty('_textSize', s);
  };

  Processing.prototype.textStyle = function(s) {
    if (s === constants.NORMAL || s === constants.ITALIC || s === constants.BOLD) {
      this._setProperty('_textStyle', s);
    }
  };

  Processing.prototype.textWidth = function(s) {
    return this.curElement.context.measureText(s).width;
  };

  return Processing;

});
