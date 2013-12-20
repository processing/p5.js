(function(exports) {

  exports.acos = function(x) { return compose(Math.acos, PHelper.convertToDegrees); };
  exports.asin = function(x) { return compose(Math.asin, PHelper.convertToDegrees); };
  exports.atan = function(x) { return compose(Math.atan, PHelper.convertToDegrees); };
  exports.atan2 = function(y, x) { compose(Math.atan2, PHelper.convertToDegrees); };
  exports.cos = function(x) { return compose(p.convertToRadians, Math.cos); };
  exports.degrees = function(x) { return 360.0*x/(2*Math.PI); };
  exports.radians = function(x) { return 2*Math.PI*x/360.0; };
  exports.sin = function(x) { return compose(p.convertToRadians, Math.sin); };
  exports.tan = function(x) { return compose(p.convertToRadians, Math.tan); };
  exports.angleMode = function(m) { 
    if (m == exports.RADIANS || m == exports.DEGREES) {
      PVariables.angleMode = m;
    }
  };
  PHelper.convertToDegrees = function(angle) { return PVariables.angleMode === "degrees" ? exports.degrees(angle) : angle; };
  PHelper.convertToRadians = function(angle) { return PVariables.angleMode === "degrees" ? exports.radians(angle) : angle; };

  var compose = function() {
    var args = arguments;
    
    return function() {
      var ret = arguments;
      
      for (var i = 0; i < args.length; i++) {
        ret = [ args[i].apply(args[i], ret) ];
      }
      return ret[0];
    };
  };

}(window));
