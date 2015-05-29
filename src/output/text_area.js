/**
 * @module Output
 * @submodule Text Area
 * @for p5
 * @requires core
 */
define(function (require) {

  'use strict';

  var p5 = require('core');
       
  // p5.prototype.print = function () {
  //     if (window.console && console.log) {
  //         console.log.apply(console, arguments);
  //     }
  // };
  if (window.console && console.log) {
    /**
     * The print() function writes to the console area of your browser, it maps
     * to console.log(). This function is often helpful for looking at the data
     * a program is producing. This function creates a new line of text for
     * each call to the function. More than one parameter can be passed into
     * the function by separating them with commas. Alternatively, individual
     * elements can be separated with quotes ("") and joined with the addition
     * operator (+).

     * @method print
     * @param {Any} contents any combination of Number, String, Object, Boolean,
     *                       Array to print
     */
    p5.prototype.print = console.log.bind(console);
  } else {
    p5.prototype.print = function() {};
  }
  
  p5.prototype.println = p5.prototype.print;

  return p5;
});