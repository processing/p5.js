define(function (require) {

  'use strict';

  var Processing = require('../core/core');

  Processing.prototype.print = console.log.bind(console);
  Processing.prototype.println = console.log.bind(console);

  return Processing;
});