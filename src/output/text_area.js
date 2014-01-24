define(function (require) {

  'use strict';

  var Processing = require('core');

  require('log');

  Processing.prototype.print = Processing.prototype.log;
  Processing.prototype.println = Processing.prototype.log;

  return Processing;
});