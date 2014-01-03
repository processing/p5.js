define(function (require) {

  'use strict';

  var Processing = require('../core/core');

  Processing.prototype.beginRaw = function() {
    // TODO

  };

  Processing.prototype.beginRecord = function() {
    // TODO

  };

  Processing.prototype.createOutput = function() {
    // TODO

  };

  Processing.prototype.createWriter  = function(name) {
    if (this.pWriters.indexOf(name) == -1) { // check it doesn't already exist
      this.pWriters.name = new PrintWriter(name);
    }
  };

  Processing.prototype.endRaw = function() {
    // TODO

  };

  Processing.prototype.endRecord  = function() {
    // TODO

  };

  Processing.prototype.PrintWriter = function(name) {
     this.name = name;
     this.content = '';
     this.print = function(data) { this.content += data; };
     this.println = function(data) { this.content += data + '\n'; };
     this.flush = function() { this.content = ''; };
     this.close = function() { writeFile(this.content); };
  };

  Processing.prototype.saveBytes = function() {
    // TODO

  };

  Processing.prototype.saveJSONArray = function() {
    // TODO

  };

  Processing.prototype.saveJSONObject = function() {
    // TODO

  };

  Processing.prototype.saveStream = function() {
    // TODO

  };

  Processing.prototype.saveStrings = function(list) {
    this.writeFile(list.join('\n'));
  };

  Processing.prototype.saveXML = function() {
    // TODO

  };

  Processing.prototype.selectOutput = function() {
    // TODO

  };

  Processing.prototype.writeFile = function(content) {
    this.open('data:text/json;charset=utf-8,' + escape(content), 'download');
  };

  return Processing;

});
