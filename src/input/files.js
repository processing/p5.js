define(function (require) {

  'use strict';

  var p5 = require('core');
  var reqwest = require('reqwest');

  //BufferedReader
  p5.prototype.createInput = function() {
    // TODO
    throw 'not yet implemented';
  };

  p5.prototype.createReader = function() {
    // TODO
    throw 'not yet implemented';
  };

  p5.prototype.loadBytes = function() {
    // TODO
    throw 'not yet implemented';
  };


  p5.prototype.loadJSON = function(path, callback) {
    var ret = [];
    var t = path.indexOf('http') === -1 ? 'json' : 'jsonp';
    reqwest({url: path, type: t, success: function (resp) {
      for (var k in resp) {
        ret[k] = resp[k];
      }
      if (typeof callback !== 'undefined') {
        callback(ret);
      }
    }});
    return ret;
  };

  p5.prototype.loadStrings = function (path, callback) {
    var ret = [];
    var req = new XMLHttpRequest();
    req.open('GET', path, true);
    req.onreadystatechange = function () {
      if (req.readyState === 4 && (req.status === 200 || req.status === 0)) {
        var arr = req.responseText.match(/[^\r\n]+/g);
        for (var k in arr) {
          ret[k] = arr[k];
        }
        if (typeof callback !== 'undefined') {
          callback(ret);
        }
      }
    };
    req.send(null);
    return ret;
  };

  p5.prototype.loadTable = function () {
    // TODO
    throw 'not yet implemented';
  };


  p5.prototype.loadXML = function(path, callback) {
    var ret = [];
    reqwest({
      url: path,
      type: 'xml',
      success: function (resp) {
        ret[0] = resp;
        if (typeof callback !== 'undefined') {
          callback(ret);
        }
      }
    });
    return ret;
  };

  // name clash with window.open
  // p5.prototype.open = function() {
  //   // TODO

  // };

  p5.prototype.parseXML = function() {
    // TODO
    throw 'not yet implemented';

  };

  p5.prototype.saveTable = function() {
    // TODO
    throw 'not yet implemented';

  };

  p5.prototype.selectFolder = function() {
    // TODO
    throw 'not yet implemented';

  };

  p5.prototype.selectInput = function() {
    // TODO
    throw 'not yet implemented';

  };

  return p5;
});
