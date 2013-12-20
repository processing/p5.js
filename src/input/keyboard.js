(function(exports) {
  exports.key = '';
  exports.keyCode = 0; 
  PHelper.keyPressed = false;

  exports.isKeyPressed = exports.keyIsPressed = function() {
    return pKeyPressed;
  };

}(window));
