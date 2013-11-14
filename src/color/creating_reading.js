(function(exports) {
  exports.alpha = function(rgb) {
    if (rgb.length > 3) return rgb[3];
    else return 255;
  };
  exports.blue = function(rgb) { 
    if (rgb.length > 2) return rgb[2];
    else return 0;
  };
  exports.brightness = function(hsv) {
    if (hsv.length > 2) return hsv[2];
    else return 0;
  };
  exports.color = function() {
    return PHelper.getNormalizedColor(arguments);
  };
  exports.green = function(rgb) { 
    if (rgb.length > 2) return rgb[1];
    else return 0;
  };
  exports.hue = function(hsv) { 
    if (hsv.length > 2) return hsv[0];
    else return 0;
  };
  exports.lerpColor = function(c1, c2, amt) {
    var c = [];
    for (var i=0; i<c1.length; i++) {
      c.push(lerp(c1[i], c2[i], amt));
    }
    return c;
  };
  exports.red = function(rgb) { 
    if (rgb.length > 2) return rgb[0];
    else return 0;
  };
  exports.saturation = function(hsv) { 
    if (hsv.length > 2) return hsv[1];
    else return 0;
  };
}(window));
