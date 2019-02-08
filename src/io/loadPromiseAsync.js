/**
 * @module IO
 * @submodule Preload
 * @for p5
 * @requires core
 */
'use strict';

var p5 = require('../core/main');

/**
 * This is a helper function to allow the use of promises in the preload function.
 * The returned object will have be an approximation of the promise's resolved value,
 * but for complicated return values, the callback function should be preferred.
 * <br><br>
 * This function should never be called outside of preload. If you want to use a promise
 * outside of preload, you should use the promise's built-in then and catch functionality.
 * @method loadPromise
 * @param  {Promise}       promise    The original promise.
 * @param  {function}      [callback] function to be executed after promise completes, data is passed
 *                                    in as the first argument
 * @param  {function}      [errorCallback] function to be executed if
 *                                    there is an error, the error is passed
 *                                    in as the first argument
 * @return {Object}                   An object representing the value from the promise.
 * @example
 * <div><code>
 * // Examples use USGS Earthquake API:
 * //   https://earthquake.usgs.gov/fdsnws/event/1/#methods
 * let earthquakes;
 * function preload() {
 *   // Get the most recent earthquake in the database
 *   let url =
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/' +
 *     'summary/all_day.geojson';
 *   let promise = fetch(url).then(resp => resp.json());
 *   earthquakes = loadPromise(promise);
 * }
 *
 * function setup() {
 *   noLoop();
 * }
 *
 * function draw() {
 *   background(200);
 *   // Get the magnitude and name of the earthquake out of the loaded JSON
 *   let earthquakeMag = earthquakes.features[0].properties.mag;
 *   let earthquakeName = earthquakes.features[0].properties.place;
 *   ellipse(width / 2, height / 2, earthquakeMag * 10, earthquakeMag * 10);
 *   textAlign(CENTER);
 *   text(earthquakeName, 0, height - 30, width, 30);
 * }
 * </code></div>
 *
 * @alt
 * An ellipse with a size based on the magnitude of the most recent earthquake with the location written as text
 *
 */
/**
 *
 * This is a preload function to make p5 wait for the promise passed in to resolve
 * before entering setup.
 * <br><br>
 * Avoid attaching then clauses onto the returned promise because these can execute
 * after the sketches' setup function.
 * <br><br>
 * This function should never be called outside of preload. If you want to use a promise
 * outside of preload, you should use the promise's built-in then and catch functionality.
 *
 * @method loadPromiseAsync
 * @param  {Promise}       promise    The promise that p5 should wait on
 * @param  {function}      [callback] function to be executed after promise completes, data is passed
 *                                    in as the first argument
 * @param  {function}      [errorCallback] function to be executed if
 *                                    there is an error, the error is passed
 *                                    in as the first argument
 * @return {Promise}                  The resulting promise
 * @example
 *
 * <div><code>
 * // Examples use USGS Earthquake API:
 * //   https://earthquake.usgs.gov/fdsnws/event/1/#methods
 * let earthquakes;
 * function preload() {
 *   // Get the most recent earthquake in the database
 *   let url =
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/' +
 *     'summary/all_day.geojson';
 *   let promise = fetch(url).then(resp => resp.json());
 *   loadPromiseAsync(promise, function(data) {
 *     earthquakes = data;
 *   });
 * }
 *
 * function setup() {
 *   noLoop();
 * }
 *
 * function draw() {
 *   background(200);
 *   // Get the magnitude and name of the earthquake out of the loaded JSON
 *   let earthquakeMag = earthquakes.features[0].properties.mag;
 *   let earthquakeName = earthquakes.features[0].properties.place;
 *   ellipse(width / 2, height / 2, earthquakeMag * 10, earthquakeMag * 10);
 *   textAlign(CENTER);
 *   text(earthquakeName, 0, height - 30, width, 30);
 * }
 * </code></div>
 *
 * @alt
 * An ellipse with a size based on the magnitude of the most recent earthquake with the location written as text
 *
 */
p5.prototype.loadPromiseAsync = function(promise) {
  return promise;
};
