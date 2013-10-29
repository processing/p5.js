(function(exports) {
  exports.mouseX = 0;
  exports.mouseY = 0;
  exports.pmouseX = 0;
  exports.pmouseY = 0;
  exports.mouseButton = 0;

  /*
  // Another possibility: mouseX, mouseY, etc. are properties with a getter
  // that returns the relative coordinates depending on the current element.
  // I think is overkill and might screw up things in unexpected ways in other
  // parts of pjs.
  Object.defineProperty(exports, "mouseX", {
    get: function() {
      var bounds = PVariables.curElement.elt.getBoundingClientRect();
      return absMouseX - bounds.left;
    },
    set: undefined
  });
  */

  exports.isMousePressed = function() {
    return PVariables.mousePressed;
  };
  PHelper.updateMouseCoords = function(e) {
    pmouseX = exports.mouseX;
    pmouseY = exports.mouseY;
    exports.mouseX = e.pageX;  // - parseInt(PVariables.curElement.elt.style.left, 10);
    exports.mouseY = e.pageY;  // - parseInt(PVariables.curElement.elt.style.top, 10);
    
    for (var n = 0; n < PVariables.sketchCanvases.length; n++) {
      var s = PVariables.sketches[n];
      var c = PVariables.sketchCanvases[n];
      var bounds = c.elt.getBoundingClientRect();
      s.pmouseX = s.mouseX;
      s.pmouseY = s.mouseY;
      s.mouseX = mouseX - bounds.left;
      s.mouseY = mouseY - bounds.top;
    }
    
    // console.log(mouseX+' '+mouseY);
    // console.log('mx = '+mouseX+' my = '+mouseY);
  };
  PHelper.setMouseButton = function(e) {
   exports.mouseButton = exports.LEFT;
    if (e.button == 1) {
      exports.mouseButton = exports.CENTER;
    } else if (e.button == 2) {
      exports.mouseButton = exports.RIGHT;
    }
    for (var i = 0; i < PVariables.sketches.length; i++) {
      var s = PVariables.sketches[i];
      if (e.button == 1) {
        s.mouseButton = exports.CENTER;
      } else if (e.button == 2) {
        s.mouseButton = exports.RIGHT;
      }      
    } 
  };

}(window));
