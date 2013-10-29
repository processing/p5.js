(function(exports) {
 exports.background = function() { 
    var c = PHelper.getNormalizedColor(arguments);
    // save out the fill
    var curFill = PVariables.curElement.context.fillStyle;
    // create background rect
    PVariables.curElement.context.fillStyle = PHelper.getCSSRGBAColor(c);
    PVariables.curElement.context.fillRect(0, 0, width, height);
    // reset fill
    PVariables.curElement.context.fillStyle = curFill;
  };
  exports.clear = function() {
    PVariables.curElement.context.clearRect(0, 0, width, height);
  };
  exports.colorMode = function(mode) {
    if (mode == exports.RGB || mode == exports.HSB)
      PVariables.colorMode = mode; 
  };
  exports.fill = function() {
    var c = PHelper.getNormalizedColor(arguments);
    PVariables.curElement.context.fillStyle = PHelper.getCSSRGBAColor(c);
  };
  exports.noFill = function() {
    PVariables.curElement.context.fillStyle = 'rgba(0,0,0,0)';
  };
  exports.noStroke = function() {
    PVariables.curElement.context.strokeStyle = 'rgba(0,0,0,0)';
  };
  exports.stroke = function() {
    var c = PHelper.getNormalizedColor(arguments);
    PVariables.curElement.context.strokeStyle = PHelper.getCSSRGBAColor(c);
  };


  /**
  * getNormalizedColor For a number of different inputs,
  *                    returns a color formatted as [r, g, b, a]
  *
  * @param {'array-like' object} args An 'array-like' object that
  *                                   represents a list of arguments
  *                                  
  * @return {Array} returns a color formatted as [r, g, b, a]
  *                 input        ==> output
  *                 g            ==> [g, g, g, 255]
  *                 g,a          ==> [g, g, g, a]
  *                 r, g, b      ==> [r, g, b, 255]
  *                 r, g, b, a   ==> [r, g, b, a]
  *                 [g]          ==> [g, g, g, 255]
  *                 [g, a]       ==> [g, g, g, a]
  *                 [r, g, b]    ==> [r, g, b, 255]
  *                 [r, g, b, a] ==> [r, g, b, a]
  */
  PHelper.getNormalizedColor = function(args) {
    var r, g, b, a, rgba;
    var _args = typeof args[0].length === 'number' ? args[0] : args;
    if (_args.length >= 3) {
      r = _args[0];
      g = _args[1];
      b = _args[2];
      a = typeof _args[3] === 'number' ? _args[3] : 255;
    } else {
      r = g = b = _args[0];
      a = typeof _args[1] === 'number' ? _args[1] : 255;
    }
    if (PVariables.colorMode == exports.HSB) {
      rgba = hsv2rgb(r, g, b).concat(a);
    } else {
      rgba = [r, g, b, a];
    }

    return rgba;
  };

  PHelper.getCSSRGBAColor = function(arr) {
    var a = arr.map(function(val) {
      return Math.floor(val);
    });
    var alpha = a[3] ? (a[3]/255.0) : 1;
    return 'rgba('+a[0]+','+a[1]+','+a[2]+','+ alpha +')';
  };


}(window));
