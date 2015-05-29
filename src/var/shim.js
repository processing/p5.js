define(function(require) {

  // requestAnim shim layer by Paul Irish
  window.requestDraw = (function(){
    return window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(callback, element){
            // should '60' here be framerate?
            window.setTimeout(callback, 1000 / 60);
          };
  })();
});