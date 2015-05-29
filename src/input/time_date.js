/**
 * @module Input
 * @submodule Time & Date
 * @for p5
 * @requires core
 */
define(function (require) {

  'use strict';

  var p5 = require('core');

  /**
   * p5.js communicates with the clock on your computer. The day() function
   * returns the current day as a value from 1 - 31.
   *
   * @method day
   * @return {Number} the current day
   */
  p5.prototype.day = function() {
    return new Date().getDate();
  };

  /**
   * p5.js communicates with the clock on your computer. The hour() function
   * returns the current hour as a value from 0 - 23.
   *
   * @method hour
   * @return {Number} the current hour
   */
  p5.prototype.hour = function() {
    return new Date().getHours();
  };

  /**
   * p5.js communicates with the clock on your computer. The minute() function
   * returns the current minute as a value from 0 - 59.
   *
   * @method minute
   * @return {Number} the current minute
   */
  p5.prototype.minute = function() {
    return new Date().getMinutes();
  };

  /**
   * Returns the number of milliseconds (thousandths of a second) since
   * starting the program. This information is often used for timing events and
   * animation sequences.
   *
   * @method millis
   * @return {Number} the number of milliseconds since starting the program
   */
  p5.prototype.millis = function() {
    return new Date().getTime() - this._startTime;
  };

  /**
   * p5.js communicates with the clock on your computer. The month() function
   * returns the current month as a value from 1 - 12.
   *
   * @method month
   * @return {Number} the current month
   */
  p5.prototype.month = function() {
    return new Date().getMonth() + 1; //January is 0!
  };

  /**
   * p5.js communicates with the clock on your computer. The second() function
   * returns the current second as a value from 0 - 59.
   *
   * @method second
   * @return {Number} the current second
   */
  p5.prototype.second = function() {
    return new Date().getSeconds();
  };

  /**
   * p5.js communicates with the clock on your computer. The year() function
   * returns the current year as an integer (2014, 2015, 2016, etc).
   *
   * @method year
   * @return {Number} the current year
   */
  p5.prototype.year = function() {
    return new Date().getFullYear();
  };

  return p5;

});