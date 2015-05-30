define(function(require) {

  // requestAnim shim layer by Paul Irish
  window.requestDraw = (function(){
    return window.requestAnimationFrame      ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(callback, element){
            // should '60' here be framerate?
            window.setTimeout(callback, 1000 / 60);
          };
  })();

  // use window.performance() to get max fast and accurate time in milliseconds
  window.performance = window.performance || {};
  window.performance.now = (function(){
    var load_date = Date.now();
    return window.performance.now        ||
          window.performance.mozNow      ||
          window.performance.msNow       ||
          window.performance.oNow        ||
          window.performance.webkitNow   ||
          function () {
            return Date.now() - load_date;
          };
  })();

  /**
   * shim for Uint8ClampedArray.slice
   * (allows arrayCopy to work with pixels[])
   * with thanks to http://halfpapstudios.com/blog/tag/html5-canvas/
   */
  (function () {
    'use strict';

    if (typeof Uint8ClampedArray !== 'undefined') {
      //Firefox and Chrome
      Uint8ClampedArray.prototype.slice = Array.prototype.slice;
    }
  }());
});
