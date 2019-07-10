/**
 * @module IO
 * @submodule Time & Date
 * @for p5
 * @requires core
 */

'use strict';

import p5 from '../core/main';

/**
 * p5.js communicates with the clock on your computer. The <a href="#/p5/day">day()</a> function
 * returns the current day as a value from 1 - 31.
 *
 * @method day
 * @return {Integer} the current day
 * @example
 * <div>
 * <code>
 * var d = day();
 * text('Current day: \n' + d, 5, 50);
 * </code>
 * </div>
 *
 * @alt
 * Current day is displayed
 *
 */
p5.prototype.day = function() {
  return new Date().getDate();
};

/**
 * p5.js communicates with the clock on your computer. The <a href="#/p5/hour">hour()</a> function
 * returns the current hour as a value from 0 - 23.
 *
 * @method hour
 * @return {Integer} the current hour
 * @example
 * <div>
 * <code>
 * var h = hour();
 * text('Current hour:\n' + h, 5, 50);
 * </code>
 * </div>
 *
 * @alt
 * Current hour is displayed
 *
 */
p5.prototype.hour = function() {
  return new Date().getHours();
};

/**
 * p5.js communicates with the clock on your computer. The <a href="#/p5/minute">minute()</a> function
 * returns the current minute as a value from 0 - 59.
 *
 * @method minute
 * @return {Integer} the current minute
 * @example
 * <div>
 * <code>
 * var m = minute();
 * text('Current minute: \n' + m, 5, 50);
 * </code>
 * </div>
 *
 * @alt
 * Current minute is displayed
 *
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
 * @example
 * <div>
 * <code>
 * var millisecond = millis();
 * text('Milliseconds \nrunning: \n' + millisecond, 5, 40);
 * </code>
 * </div>
 *
 * @alt
 * number of milliseconds since program has started displayed
 *
 */
p5.prototype.millis = function() {
  return window.performance.now();
};

/**
 * p5.js communicates with the clock on your computer. The <a href="#/p5/month">month()</a> function
 * returns the current month as a value from 1 - 12.
 *
 * @method month
 * @return {Integer} the current month
 * @example
 * <div>
 * <code>
 * var m = month();
 * text('Current month: \n' + m, 5, 50);
 * </code>
 * </div>
 *
 * @alt
 * Current month is displayed
 *
 */
p5.prototype.month = function() {
  return new Date().getMonth() + 1; //January is 0!
};

/**
 * p5.js communicates with the clock on your computer. The <a href="#/p5/second">second()</a> function
 * returns the current second as a value from 0 - 59.
 *
 * @method second
 * @return {Integer} the current second
 * @example
 * <div>
 * <code>
 * var s = second();
 * text('Current second: \n' + s, 5, 50);
 * </code>
 * </div>
 *
 * @alt
 * Current second is displayed
 *
 */
p5.prototype.second = function() {
  return new Date().getSeconds();
};

/**
 * p5.js communicates with the clock on your computer. The <a href="#/p5/year">year()</a> function
 * returns the current year as an integer (2014, 2015, 2016, etc).
 *
 * @method year
 * @return {Integer} the current year
 * @example
 * <div>
 * <code>
 * var y = year();
 * text('Current year: \n' + y, 5, 50);
 * </code>
 * </div>
 *
 * @alt
 * Current year is displayed
 *
 */
p5.prototype.year = function() {
  return new Date().getFullYear();
};

export default p5;
