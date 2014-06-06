define(function (require) {

  'use strict';

  var p5 = require('core');

  p5.prototype.pWriters = [];

  p5.prototype.beginRaw = function() {
    // TODO
    throw 'not yet implemented';

  };

  p5.prototype.beginRecord = function() {
    // TODO
    throw 'not yet implemented';

  };

  p5.prototype.createOutput = function() {
    // TODO

    throw 'not yet implemented';
  };

  p5.prototype.createWriter  = function(name) {
    if (this.pWriters.indexOf(name) === -1) { // check it doesn't already exist
      this.pWriters.name = new this.PrintWriter(name);
    }
  };

  p5.prototype.endRaw = function() {
    // TODO

    throw 'not yet implemented';
  };

  p5.prototype.endRecord  = function() {
    // TODO
    throw 'not yet implemented';

  };

  p5.prototype.escape = function(content) {
    return content;
  };

  p5.prototype.PrintWriter = function(name) {
    this.name = name;
    this.content = '';
    this.print = function(data) { this.content += data; };
    this.println = function(data) { this.content += data + '\n'; };
    this.flush = function() { this.content = ''; };
    this.close = function() { this.writeFile(this.content); };
  };

  p5.prototype.saveBytes = function() {
    // TODO
    throw 'not yet implemented';

  };

  p5.prototype.saveJSONArray = function() {
    // TODO
    throw 'not yet implemented';

  };

  p5.prototype.saveJSONObject = function() {
    // TODO

    throw 'not yet implemented';
  };

  p5.prototype.saveStream = function() {
    // TODO
    throw 'not yet implemented';

  };

  p5.prototype.saveStrings = function(list) {
    this.writeFile(list.join('\n'));
  };

  p5.prototype.saveXML = function() {
    // TODO
    throw 'not yet implemented';

  };

  p5.prototype.selectOutput = function() {
    // TODO
    throw 'not yet implemented';

  };

  p5.prototype.writeFile = function(content) {
    this.open(
      'data:text/json;charset=utf-8,' + this.escape(content),
      'download'
    );
  };

  return p5;

});
