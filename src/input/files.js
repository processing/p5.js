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
      callback(resp);
    });
    return self;
  };
 
  PHelper.preloadJSON = function(path) {
    PVariables.preload_count++;
    return PHelper.loadJSON(path, function (resp) {
      if (--PVariables.preload_count === 0) setup();
    });
  };
 
  // exports.loadStrings = function(file, callback) {
  //   var req = new XMLHttpRequest();
  //   req.open('GET', 'data/'+file, true);
  //   req.onreadystatechange = function () {
  //     if(req.readyState === 4) {
  //       if(req.status === 200 || req.status === 0) {
  //         if (typeof callback !== 'undefined') callback();
  //         return req.responseText.match(/[^\r\n]+/g);
  //       }
  //     }
  //   };
  //   req.send(null);
  // };
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
