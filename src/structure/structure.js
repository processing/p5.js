(function(exports) {
  exports.noLoop = function() { 
    if (PVariables.loop) {
      PVariables.loop = false; 
    }
  };
  exports.loop = function() {
    if (!PVariables.loop) {
      PVariables.loop = true;
    }
  };
  exports.pushStyle = function() {
    var curS = [];
    curS.fillStyle = PVariables.curElement.context.fillStyle; // fill
    curS.strokeStyle = PVariables.curElement.context.strokeStyle; // stroke
    curS.lineWidth = PVariables.curElement.context.lineWidth; // strokeWeight
    // @todo tint
    curS.lineCap = PVariables.curElement.context.lineCap; // strokeCap
    curS.lineJoin = PVariables.curElement.context.lineJoin; // strokeJoin
    curS.imageMode = PVariables.imageMode; // imageMode
    curS.rectMode = PVariables.rectMode; // rectMode
    curS.ellipseMode = PVariables.ellipseMode; // ellipseMode
    // @todo shapeMode
    curS.colorMode = PVariables.colorMode; // colorMode
    curS.textAlign = PVariables.curElement.context.textAlign; // textAlign
    curS.textFont = PVariables.textFont;
    curS.textLeading = PVariables.textLeading; // textLeading
    curS.textSize = PVariables.textSize; // textSize
    curS.textStyle = PVariables.textStyle; // textStyle
    PVariables.styles.push(curS);
  };
  exports.popStyle = function() {
    var lastS = PVariables.styles[PVariables.styles.length-1];
    PVariables.curElement.context.fillStyle = lastS.fillStyle; // fill
    PVariables.curElement.context.strokeStyle = lastS.strokeStyle; // stroke
    PVariables.curElement.context.lineWidth = lastS.lineWidth; // strokeWeight
    // @todo tint
    PVariables.curElement.context.lineCap = lastS.lineCap; // strokeCap
    PVariables.curElement.context.lineJoin = lastS.lineJoin; // strokeJoin
    PVariables.imageMode = lastS.imageMode; // imageMode
    PVariables.rectMode = lastS.rectMode; // rectMode
    PVariables.ellipseMode = lastS.ellipseMode; // elllipseMode
    // @todo shapeMode
    PVariables.colorMode = lastS.colorMode; // colorMode
    PVariables.curElement.context.textAlign = lastS.textAlign; // textAlign
    PVariables.textFont = lastS.textFont;
    PVariables.textLeading = lastS.textLeading; // textLeading
    PVariables.textSize = lastS.textSize; // textSize
    PVariables.textStyle = lastS.textStyle; // textStyle
    PVariables.styles.pop();
  };
}(window));
