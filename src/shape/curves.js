(function(exports) {
	exports.bezier = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    PVariables.curElement.context.beginPath();
    PVariables.curElement.context.moveTo(x1, y1);
    PVariables.curElement.context.bezierCurveTo(x2, y2, x3, y3, x4, y4);
    PVariables.curElement.context.stroke();
  };
  exports.bezierDetail = function() {
    // TODO
  };
  exports.bezierPoint = function() {
    // TODO
  };
  exports.bezierTangent = function() {
    // TODO
  };
  exports.curve = function() {
    // TODO
  };
  exports.curveDetail = function() {
    // TODO
  };
  exports.curvePoint = function() {
    // TODO
  };
  exports.curveTangent = function() {
    // TODO
  };
  exports.curveTightness = function() {
    // TODO
  };
}(window));
