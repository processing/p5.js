(function(exports) {
  exports.frameCount = 0;
  exports.frameRate = 30;
  exports.height = 100;
  exports.width = 100;
  exports.focused = true;

  window.onfocus = function() {
    exports.focused = true;
  };
  window.onblur = function() {
    exports.focused = false;
  };
  // requestAnim shim layer by Paul Irish
  window.requestDraw = (function(){
    return window.requestAnimationFrame       || 
           window.webkitRequestAnimationFrame || 
           window.mozRequestAnimationFrame    || 
           window.oRequestAnimationFrame      || 
           window.msRequestAnimationFrame     || 
           function(callback, element){
             window.setTimeout(callback, 1000 / 60);
           };
  })();  
  // exports.focused
  exports.cursor = function(type) {
    var cursor = 'auto';
    if (type == CROSS || type == HAND || type == MOVE || type == TEXT || type == WAIT) {
      cursor = type;
    }
    document.getElementsByTagName('body')[0].style.cursor = cursor; 
  };
  exports.displayHeight = screen.height;
  exports.displayWidth = screen.width;
  exports.getFrameRate = function() {
    return frameRate;
  };
  exports.setFrameRate = function(fps) { 
    frameRate = fps; 
    clearInterval(PVariables.updateInterval);
    PVariables.updateInterval = setInterval(PHelper.update, 1000/frameRate);
  };
  exports.noCursor = function() {
    document.getElementsByTagName('body')[0].style.cursor = 'none';
  };
}(window));
