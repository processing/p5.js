(function(exports) {
  //BufferedReader
  exports.createInput = function() {
    // TODO
  };
  exports.createReader = function() {
    // TODO
  };
  exports.loadBytes = function() {
    // TODO
  };

  PHelper.loadJSON = function(path, callback) {
    var self = [];
    var t = path.indexOf('http') == -1 ? 'json' : 'jsonp';
    reqwest({url: path, type: t, success: function (resp) {
      for (var k in resp) self[k] = resp[k];
      if (typeof callback !== 'undefined') callback(resp);
    }});
    return self;
  };
  PHelper.loadStrings = function(path, callback) {
    var self = [];
    var req = new XMLHttpRequest();
    req.open('GET', path, true);
    req.onreadystatechange = function () {
      if((req.readyState === 4) && (req.status === 200 || req.status === 0)) {
        var arr = req.responseText.match(/[^\r\n]+/g);
        for (var k in arr) self[k] = arr[k];
        if (typeof callback !== 'undefined') callback();
      }
    };
    req.send(null);
    return self;
  };

  exports.loadTable = function () {
    // TODO
  };

  PHelper.temp = [];
  PHelper.loadXML = function(path, callback) {
    var self = [];
    reqwest(path, function (resp) {
      console.log(resp);
      PHelper.temp = resp;
      self[0] = resp;
      if (typeof callback !== 'undefined') callback(resp);
    });
    return self;
  };

  exports.open = function() {
    // TODO
  };
  exports.parseXML = function() {
    // TODO
  };
  exports.saveTable = function() {
    // TODO
  };
  exports.selectFolder = function() {
    // TODO
  };
  exports.selectInput = function() {
    // TODO
  };

}(window));
