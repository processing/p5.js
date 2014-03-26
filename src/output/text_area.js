define(function (require) {

  'use strict';

  var p5 = require('core');

  p5.prototype.print = function() {
    if (window.console && console.log) {
      console.log.apply(console, arguments);
    }
  };

  p5.prototype.println = p5.prototype.print;

  return p5;
});