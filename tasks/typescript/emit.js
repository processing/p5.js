var fs = require('fs');
var h2p = require('html2plaintext');
var wrap = require('word-wrap');

function shortenDescription(desc) {

  return wrap(h2p(desc), {
    width: 50,
  });
}

function createEmitter(filename) {
  var indentLevel = 0;
  var lastText = '';
  var currentSourceFile;
  var fd = fs.openSync(filename, 'w');

  var emit = function(text) {
    var indentation = [];
    var finalText;

    for (var i = 0; i < indentLevel; i++) {
      indentation.push('  ');
    }

    finalText = indentation.join('') + text + '\n';
    fs.writeSync(fd, finalText);

    lastText = text;
  };

  emit.description = function(desc) {
    if (!desc) {
      return;
    }

    emit.sectionBreak();
    emit('/**');
    shortenDescription(desc).split('\n').forEach(function(line) {
      emit(' * ' + line);
    });
    emit(' */');
  };

  emit.setCurrentSourceFile = function(file) {
    if (file !== currentSourceFile) {
      currentSourceFile = file;
      emit.sectionBreak();
      emit('// ' + file);
      emit.sectionBreak();
    }
  };

  emit.sectionBreak = function() {
    if (lastText !== '' && !/\{$/.test(lastText)) {
      emit('');
    }
  };

  emit.getIndentLevel = function() {
    return indentLevel;
  };

  emit.indent = function() {
    indentLevel++;
  };

  emit.dedent = function() {
    indentLevel--;
  };

  emit.close = function() {
    fs.closeSync(fd);
  };

  emit('// This file was auto-generated. Please do not edit it.\n');

  return emit;
}

module.exports = createEmitter;
