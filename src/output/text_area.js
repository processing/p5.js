define(function (require) {

  'use strict';

  var p5 = require('core');
       
  // p5.prototype.print = function () {
  //     if (window.console && console.log) {
  //         console.log.apply(console, arguments);
  //     }
  // };
  if (window.console && console.log) {
    p5.prototype.print = console.log.bind(console);
  } else {
    p5.prototype.print = function() {};
  }
  
  p5.prototype.println = p5.prototype.print;

  return p5;
});