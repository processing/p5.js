(function(exports) {
  exports.pWriters = [];
  exports.beginRaw = function() {
    // TODO
  };
  exports.beginRecord = function() {
    // TODO
  };
  exports.createOutput = function() {
    // TODO
  };
  exports.createWriter  = function(name) {
    if (pWriters.indexOf(name) == -1) { // check it doesn't already exist
      pWriters.name = new PrintWriter(name);
    }
  };
  exports.endRaw = function() {
    // TODO
  };
  exports.endRecord  = function() {
    // TODO
  };
  exports.PrintWriter = function(name) {
     this.name = name;
     this.content = '';
     this.print = function(data) { this.content += data; };
     this.println = function(data) { this.content += data + '\n'; };
     this.flush = function() { this.content = ''; };
     this.close = function() { writeFile(this.content); };
  };
  exports.saveBytes = function() {
    // TODO
  };
  exports.saveJSONArray = function() {
    // TODO
  };
  exports.saveJSONObject = function() {
    // TODO
  };
  exports.saveStream = function() {
    // TODO
  };
  exports.saveStrings = function(list) {
    writeFile(list.join('\n'));
  };
  exports.saveXML = function() {
    // TODO
  };
  exports.selectOutput = function() {
    // TODO
  };
  exports.writeFile = function(content) {
    exports.open('data:text/json;charset=utf-8,' + escape(content), 'download'); 
  };

}(window));
