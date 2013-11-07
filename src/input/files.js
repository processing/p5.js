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
    reqwest(path, function (resp) {
      for (var k in resp) self[k] = resp[k];
      if (typeof callback !== 'undefined') callback(resp);
    });
    return self;
  };
  PHelper.preloadJSON = function(path) {
    PVariables.preload_count++;
    return PHelper.loadJSON(path, function (resp) {
      if (--PVariables.preload_count === 0) setup();
    });
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
  PHelper.preloadStrings = function(path) {
    PVariables.preload_count++;
    return PHelper.loadStrings(path, function (resp) {
      if (--PVariables.preload_count === 0) setup();
    });
  };

  exports.loadTable = function () {
    // TODO
  };
  /*exports.loadXML = function() {
    var req = new XMLHttpRequest();  
    req.overrideMimeType('application/json');  
    req.overrideMimeType('text/xml');
    req.open('GET', 'data/'+file, false);  
    req.onreadystatechange = function () {
      if(req.readyState === 4) {
        if(req.status === 200 || req.status == 0) {
          console.log(JSON.parse(req.responseXML));
          return JSON.parse(req.responseXML);
        }
      }
    }
    req.send(null);
  }*/
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
