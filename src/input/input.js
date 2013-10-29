(function(exports) {
  PHelper.setupInput = function() {
    document.body.onmousemove = function(e){
      PHelper.updateMouseCoords(e);
      if (!PVariables.mousePressed && typeof mouseMoved === 'function') {
        mouseMoved(e);
      }
      if (PVariables.mousePressed && typeof mouseDragged === 'function') {
        mouseDragged(e);
      }
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (!PVariables.mousePressed && typeof s.mouseMoved === 'function') {
          s.mouseMoved(e);
        }
        if (PVariables.mousePressed && typeof s.mouseDragged === 'function') {
          s.mouseDragged(e);          
        }
      }        
    };
    document.body.onmousedown = function(e) {
      PVariables.mousePressed = true;
      PHelper.setMouseButton(e);
      if (typeof mousePressed === 'function') {
        mousePressed(e);        
      }
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.mousePressed === 'function') {
          s.mousePressed(e);
        }
      } 
    };
    document.body.onmouseup = function(e) {
      PVariables.mousePressed = false;
      if (typeof mouseReleased === 'function') {
        mouseReleased(e);
      }
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.mouseReleased === 'function') {
          s.mouseReleased(e);
        }
      }        
    };
    document.body.onmouseclick = function(e) {
      if (typeof mouseClicked === 'function') {
        mouseClicked(e);
      }
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.mouseClicked === 'function') {
          s.mouseClicked(e);
        }
      }
    };
    document.body.onmousewheel = function(e) {
      if (typeof mouseWheel === 'function') {
        mouseWheel(e);
      }
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.mouseWheel === 'function') {
          s.mouseWheel(e);
        }
      }     
    };
    document.body.onkeydown = function(e) {
      PHelper.keyPressed = true;
      exports.keyCode = e.keyCode;
      exports.key = String.fromCharCode(e.keyCode);
      if (typeof keyPressed === 'function') {
        keyPressed(e);
      }
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.keyPressed === 'function') {
          s.keyPressed(e);
        }
      }
    };
    document.body.onkeyup = function(e) {
      PHelper.keyPressed = false;
      if (typeof keyReleased === 'function') {
        keyReleased(e);
      }
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.keyReleased === 'function') {
          s.keyReleased(e);
        }
      }  
    };
    document.body.onkeypress = function(e) {
      if (typeof keyTyped === 'function') {
        keyTyped(e);
      }
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.keyTyped === 'function') {
          s.keyTyped(e);
        }
      }        
    };
    document.body.ontouchstart = function(e) {
      PHelper.setTouchPoints(e);
      if(typeof touchStarted === 'function') {
        touchStarted(e);
      }
      var m = typeof touchMoved === 'function';         
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.touchStarted === 'function') {
          s.touchStarted(e);
        }
        m |= typeof s.touchMoved === 'function';         
      }        
      if(m) {
        e.preventDefault();
      }
    };
    document.body.ontouchmove = function(e) {
      PHelper.setTouchPoints(e);
      if(typeof touchMoved === 'function') {
        touchMoved(e);
      }
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.touchMoved === 'function') {
          s.touchMoved(e);
        }
      }        
    };
    document.body.ontouchend = function(e) {
      PHelper.setTouchPoints(e);
      if(typeof touchEnded === 'function') {
        touchEnded(e);
      }
      for (var i = 0; i < PVariables.sketches.length; i++) {
        var s = PVariables.sketches[i];
        if (typeof s.touchEnded === 'function') {
          s.touchEnded(e);
        }
      }            
    };
  };

}(window));