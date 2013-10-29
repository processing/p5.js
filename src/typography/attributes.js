(function(exports) {
  exports.textAlign = function(a) {
    if (a == exports.LEFT || a == exports.RIGHT || a == exports.CENTER) PVariables.curElement.context.textAlign = a;
  };
  exports.textFont = function(str) {
    PVariables.textFont = str; //pend temp?
  };
  exports.textHeight = function(s) {
    return PVariables.curElement.context.measureText(s).height;
  };
  exports.textLeading = function(l) {
    PVariables.textLeading = l;
  };
  exports.textSize = function(s) {
    PVariables.textSize = s;
  };
  exports.textStyle = function(s) {
    if (s == exports.NORMAL || s == exports.ITALIC || s == exports.BOLD) {
      PVariables.textStyle = s;
    }
  };
  exports.textWidth = function(s) {
    return PVariables.curElement.context.measureText(s).width;
  };
}(window));
