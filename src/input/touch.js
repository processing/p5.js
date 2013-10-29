(function(exports) {

	exports.touchX = 0;
	exports.touchY = 0;

  PHelper.setTouchPoints = function(e) {
    exports.touchX = e.changedTouches[0].pageX;
    exports.touchY = e.changedTouches[0].pageY;
    exports.touches = [];
    for (var n = 0; n < PVariables.sketchCanvases.length; n++) {
      PVariables.sketches[n].touches = [];
    }    
    for(var i = 0; i < e.changedTouches.length; i++){
      var ct = e.changedTouches[i];
      exports.touches[i] = {x: ct.pageX, y: ct.pageY};
      for (var m = 0; m < PVariables.sketchCanvases.length; n++) {
        var s = PVariables.sketches[m];
        var c = PVariables.sketchCanvases[m];
        var bounds = c.elt.getBoundingClientRect(); 
        s.touches[i] = {x: ct.pageX - bounds.left, y: ct.pageY - bounds.top};
      }              
    }
  };

}(window));
