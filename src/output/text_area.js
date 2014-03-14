define(function (require) {

  'use strict';

  var p5 = require('core');

  require('log');

  p5.prototype.print = p5.prototype.log;
  p5.prototype.println = p5.prototype.log;

  return p5;
});