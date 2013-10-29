(function(exports) {
	exports.beginContour = function() {
    // TODO
  };
  exports.beginShape = function(kind) {
    if (kind == exports.POINTS || kind == exports.LINES || kind == exports.TRIANGLES || kind == exports.TRIANGLE_FAN || kind == exports.TRIANGLE_STRIP || kind == exports.QUADS || kind == exports.QUAD_STRIP)
      PVariables.shapeKind = kind;
    else PVariables.shapeKind = null; 
    PVariables.shapeInited = true;
    PVariables.curElement.context.beginPath();
  };
  exports.bezierVertex = function(x1, y1, x2, y2, x3, y3) {
    PVariables.curElement.context.bezierCurveTo(x1, y1, x2, y2, x3, y3);
  };
  exports.curveVertex = function() {
    // TODO
  };
  exports.endContour = function() {
    // TODO
  };
  exports.endShape = function(mode) {
    if (mode == exports.CLOSE) {
      PVariables.curElement.context.closePath();
      PVariables.curElement.context.fill();
    } 
    PVariables.curElement.context.stroke();
  };
  exports.quadraticVertex = function(cx, cy, x3, y3) {
    PVariables.curElement.context.quadraticCurveTo(cx, cy, x3, y3);
  };
  exports.vertex = function(x, y) {
    if (PVariables.shapeInited) {
      PVariables.curElement.context.moveTo(x, y);
    } else {
      PVariables.curElement.context.lineTo(x, y); // pend this is where check for kind and do other stuff
    }
    PVariables.shapeInited = false;
  };

}(window));
