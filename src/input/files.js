define(function (require) {

  'use strict';

  var p5 = require('core');
  var reqwest = require('reqwest');

  //BufferedReader
  p5.prototype.createInput = function() {
    // TODO
  };

  p5.prototype.createReader = function() {
    // TODO
  };

  p5.prototype.loadBytes = function() {
    // TODO
  };

  p5.prototype.loadJSON = function(url, callback) {
    var self = [];
    reqwest(url, function (resp) {
      for (var k in resp) {
        self[k] = resp[k];
      }
      callback(resp);
    });
    return self;
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
  };


  p5.prototype.loadXML = function(path, callback) {
    var ret = [];
    var self = this;
    self.temp = [];
    reqwest(path, function (resp) {
      self.print(resp);
      self.temp = resp;
      ret[0] = resp;
      if (typeof callback !== 'undefined') {
        callback(ret);
      }
    });
  };

  p5.prototype.open = function() {
    // TODO

  };

  p5.prototype.parseXML = function() {
    // TODO

  };

  p5.prototype.saveTable = function() {
    // TODO

  };

  p5.prototype.selectFolder = function() {
    // TODO

  };

  p5.prototype.selectInput = function() {
    // TODO

  };

  return p5;
});
