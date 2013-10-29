(function(exports) {
  exports.day = function() {
    return new Date().getDate();
  };
  exports.hour = function() {
    return new Date().getHours();
  };
  exports.minute = function() {
    return new Date().getMinutes();
  };
  exports.millis = function() {
    return new Date().getTime() - PVariables.startTime;
  };
  exports.month = function() {
    return new Date().getMonth();
  };
  exports.second = function() {
    return new Date().getSeconds();
  };
  exports.year = function() {
    return new Date().getFullYear();
  };

}(window));