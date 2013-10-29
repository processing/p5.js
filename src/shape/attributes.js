(function(exports) {
	exports.ellipseMode = function(m) {
    if (m == exports.CORNER || m == exports.CORNERS || m == exports.RADIUS || m == exports.CENTER) {
      PVariables.ellipseMode = m;
    }
  };
  exports.noSmooth = function() {
    PVariables.curElement.context.mozImageSmoothingEnabled = false;
    PVariables.curElement.context.webkitImageSmoothingEnabled = false;
  };
  exports.rectMode = function(m) {
    if (m == exports.CORNER || m == exports.CORNERS || m == exports.RADIUS || m == exports.CENTER) {
      PVariables.rectMode = m;
    }
  };
  exports.smooth = function() {
    PVariables.curElement.context.mozImageSmoothingEnabled = true;
    PVariables.curElement.context.webkitImageSmoothingEnabled = true;
  };
  exports.strokeCap = function(cap) {
    if (cap == exports.ROUND || cap == exports.SQUARE || cap == exports.PROJECT) {
      PVariables.curElement.context.lineCap=cap;
    }
  };
  exports.strokeJoin = function(join) {
    if (join == exports.ROUND || join == exports.BEVEL || join == exports.MITER) {
      PVariables.curElement.context.lineJoin = join;
    }
  };
  exports.strokeWeight = function(w) {
    if (typeof w === 'undefined' || w === 0)
      PVariables.curElement.context.lineWidth = 0.0001; // hack because lineWidth 0 doesn't work
    else PVariables.curElement.context.lineWidth = w;
  };

}(window));
