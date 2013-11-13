(function(exports) {
  /*
    text(str, x, y)
    text(str, x1, y1, x2, y2)
  */
  exports.text = function() {
    PVariables.curElement.context.font=PVariables.textStyle+' '+PVariables.textSize+'px '+PVariables.textFont;
    if (arguments.length == 3) {
      PVariables.curElement.context.fillText(arguments[0], arguments[1], arguments[2]);
      PVariables.curElement.context.strokeText(arguments[0], arguments[1], arguments[2]);
    } else if (arguments.length == 5) {
      var words = arguments[0].split(' ');
      var line = '';
      var vals = PHelper.modeAdjust(arguments[1], arguments[2], arguments[3], arguments[4], PVariables.rectMode);
      vals.y += PVariables.textLeading;
      for(var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = PVariables.curElement.context.measureText(testLine);
        var testWidth = metrics.width;
        if (vals.y > vals.h) {
          break;
        }
        else if (testWidth > vals.w && n > 0) {
          PVariables.curElement.context.fillText(line, vals.x, vals.y);
          PVariables.curElement.context.strokeText(line, vals.x, vals.y);
          line = words[n] + ' ';
          vals.y += PVariables.textLeading;
        }
        else {
          line = testLine;
        }
      }
      if (vals.y <= vals.h) {
        PVariables.curElement.context.fillText(line, vals.x, vals.y);
        PVariables.curElement.context.strokeText(line, vals.x, vals.y);
      }
    }
  };

}(window));
