define(function (require) {

  'use strict';

  var Processing = require('core');
  var reqwest = require('reqwest');

  //BufferedReader
  Processing.prototype.createInput = function() {
    // TODO

  };

  Processing.prototype.createReader = function() {
    // TODO

  };

  Processing.prototype.loadBytes = function() {
    // TODO

  };

  Processing.prototype.loadJSON = function(path, callback) {
    var ret = [];
    var t = path.indexOf('http') == -1 ? 'json' : 'jsonp';
    reqwest({url: path, type: t, success: function (resp) {
      for (var k in resp) ret[k] = resp[k];
      if (typeof callback !== 'undefined') callback(resp);
    }});
    return ret;
  };

  Processing.prototype.loadStrings = function(path, callback) {
    var ret = [];
    var req = new XMLHttpRequest();
    req.open('GET', path, true);
    req.onreadystatechange = function () {
      if((req.readyState === 4) && (req.status === 200 || req.status === 0)) {
        var arr = req.responseText.match(/[^\r\n]+/g);
        for (var k in arr) ret[k] = arr[k];
        if (typeof callback !== 'undefined') callback();
      }
    };
    req.send(null);
    return ret;
  };

  Processing.prototype.loadTable = function () {
    // TODO

  };


  Processing.prototype.loadXML = function(path, callback) {
    this.temp = [];
    var ret = [];
    reqwest(path, function (resp) {
      console.log(resp);
      this.temp = resp;
      ret[0] = resp;
      if (typeof callback !== 'undefined') callback(resp);
    });
    return ret;
  };

  Processing.prototype.open = function() {
    // TODO

  };

  Processing.prototype.parseXML = function() {
    // TODO

  };

  Processing.prototype.saveTable = function() {
    // TODO

  };

  Processing.prototype.selectFolder = function() {
    // TODO

  };

  Processing.prototype.selectInput = function() {
    // TODO

  };

  return Processing;

});
