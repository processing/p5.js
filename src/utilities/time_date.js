/**
 * @module IO
 * @submodule Time & Date
 * @for p5
 * @requires core
 */

function timeDate(p5, fn){
  /**
   * Returns the current day as a number from 1–31.
   *
   * @method day
   * @return {Integer} current day between 1 and 31.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Get the current day.
   *   let d = day();
   *
   *   // Style the text.
   *   textAlign(LEFT, CENTER);
   *   textSize(12);
   *   textFont('Courier New');
   *
   *   // Display the day.
   *   text(`Current day: ${d}`, 20, 50, 60);
   *
   *   describe(`The text 'Current day: ${d}' written in black on a gray background.`);
   * }
   * </code>
   * </div>
   */
  fn.day = function() {
    return new Date().getDate();
  };

  /**
   * Returns the current hour as a number from 0–23.
   *
   * @method hour
   * @return {Integer} current hour between 0 and 23.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Get the current hour.
   *   let h = hour();
   *
   *   // Style the text.
   *   textAlign(LEFT, CENTER);
   *   textSize(12);
   *   textFont('Courier New');
   *
   *   // Display the hour.
   *   text(`Current hour: ${h}`, 20, 50, 60);
   *
   *   describe(`The text 'Current hour: ${h}' written in black on a gray background.`);
   * }
   * </code>
   * </div>
   */
  fn.hour = function() {
    return new Date().getHours();
  };

  /**
   * Returns the current minute as a number from 0–59.
   *
   * @method minute
   * @return {Integer} current minute between 0 and 59.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Get the current minute.
   *   let m = minute();
   *
   *   // Style the text.
   *   textAlign(LEFT, CENTER);
   *   textSize(12);
   *   textFont('Courier New');
   *
   *   // Display the minute.
   *   text(`Current minute: ${m}`, 10, 50, 80);
   *
   *   describe(`The text 'Current minute: ${m}' written in black on a gray background.`);
   * }
   * </code>
   * </div>
   */
  fn.minute = function() {
    return new Date().getMinutes();
  };

  /**
   * Returns the number of milliseconds since a sketch started running.
   *
   * `millis()` keeps track of how long a sketch has been running in
   * milliseconds (thousandths of a second). This information is often
   * helpful for timing events and animations.
   *
   * If a sketch has a
   * <a href="#/p5/setup">setup()</a> function, then `millis()` begins tracking
   * time before the code in <a href="#/p5/setup">setup()</a> runs. If a
   * sketch includes a <a href="#/p5/preload">preload()</a> function, then
   * `millis()` begins tracking time as soon as the code in
   * <a href="#/p5/preload">preload()</a> starts running.
   *
   * @method millis
   * @return {Number} number of milliseconds since starting the sketch.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Get the number of milliseconds the sketch has run.
   *   let ms = millis();
   *
   *   // Style the text.
   *   textAlign(LEFT, CENTER);
   *   textSize(10);
   *   textFont('Courier New');
   *
   *   // Display how long it took setup() to be called.
   *   text(`Startup time: ${round(ms, 2)} ms`, 5, 50, 90);
   *
   *   describe(
   *     `The text 'Startup time: ${round(ms, 2)} ms' written in black on a gray background.`
   *   );
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe('The text "Running time: S sec" written in black on a gray background. The number S increases as the sketch runs.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Get the number of seconds the sketch has run.
   *   let s = millis() / 1000;
   *
   *   // Style the text.
   *   textAlign(LEFT, CENTER);
   *   textSize(10);
   *   textFont('Courier New');
   *
   *   // Display how long the sketch has run.
   *   text(`Running time: ${nf(s, 1, 1)} sec`, 5, 50, 90);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   describe('A white circle oscillates left and right on a gray background.');
   * }
   *
   * function draw() {
   *   background(200);
   *
   *   // Get the number of seconds the sketch has run.
   *   let s = millis() / 1000;
   *
   *   // Calculate an x-coordinate.
   *   let x = 30 * sin(s) + 50;
   *
   *   // Draw the circle.
   *   circle(x, 50, 30);
   * }
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * async function setup() {
   *   // Load the GeoJSON.
   *   await loadJSON('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Get the number of milliseconds the sketch has run.
   *   let ms = millis();
   *
   *   // Style the text.
   *   textAlign(LEFT, CENTER);
   *   textFont('Courier New');
   *   textSize(11);
   *
   *   // Display how long it took to load the data.
   *   text(`It took ${round(ms, 2)} ms to load the data`, 5, 50, 100);
   *
   *   describe(
   *     `The text "It took ${round(ms, 2)} ms to load the data" written in black on a gray background.`
   *   );
   * }
   * </code>
   * </div>
   */
  fn.millis = function() {
    if (this._millisStart === -1) {
      // Sketch has not started
      return 0;
    } else {
      return window.performance.now() - this._millisStart;
    }
  };

  /**
   * Returns the current month as a number from 1–12.
   *
   * @method month
   * @return {Integer} current month between 1 and 12.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Get the current month.
   *   let m = month();
   *
   *   // Style the text.
   *   textAlign(LEFT, CENTER);
   *   textSize(12);
   *   textFont('Courier New');
   *
   *   // Display the month.
   *   text(`Current month: ${m}`, 10, 50, 80);
   *
   *   describe(`The text 'Current month: ${m}' written in black on a gray background.`);
   * }
   * </code>
   * </div>
   */
  fn.month = function() {
    //January is 0!
    return new Date().getMonth() + 1;
  };

  /**
   * Returns the current second as a number from 0–59.
   *
   * @method second
   * @return {Integer} current second between 0 and 59.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Get the current second.
   *   let s = second();
   *
   *   // Style the text.
   *   textAlign(LEFT, CENTER);
   *   textSize(12);
   *   textFont('Courier New');
   *
   *   // Display the second.
   *   text(`Current second: ${s}`, 10, 50, 80);
   *
   *   describe(`The text 'Current second: ${s}' written in black on a gray background.`);
   * }
   * </code>
   * </div>
   */
  fn.second = function() {
    return new Date().getSeconds();
  };

  /**
   * Returns the current year as a number such as 1999.
   *
   * @method year
   * @return {Integer} current year.
   *
   * @example
   * <div>
   * <code>
   * function setup() {
   *   createCanvas(100, 100);
   *
   *   background(200);
   *
   *   // Get the current year.
   *   let y = year();
   *
   *   // Style the text.
   *   textAlign(LEFT, CENTER);
   *   textSize(12);
   *   textFont('Courier New');
   *
   *   // Display the year.
   *   text(`Current year: ${y}`, 10, 50, 80);
   *
   *   describe(`The text 'Current year: ${y}' written in black on a gray background.`);
   * }
   * </code>
   * </div>
   */
  fn.year = function() {
    return new Date().getFullYear();
  };
}

export default timeDate;

if(typeof p5 !== 'undefined'){
  timeDate(p5, p5.prototype);
}
