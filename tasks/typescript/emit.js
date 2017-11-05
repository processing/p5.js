var fs = require('fs');
var h2p = require('html2plaintext');
var wrap = require('word-wrap');

function shortenDescription(desc) {

  return wrap(h2p(desc).replace(/[\r\n]+/, ''), {
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

  emit.description = function(classitem, overload) {
    var desc = classitem.description;
    if (!desc) {
      return;
    }

    function emitDescription(desc) {
      shortenDescription(desc).split('\n').forEach(function(line) {
        emit(' * ' + line);
      });
    }

    emit.sectionBreak();
    emit('/**');
    emitDescription(desc);
    emit(' *');
    if (overload) {
      var alloverloads = [classitem];
      if (classitem.overloads) {
        alloverloads = alloverloads.concat(classitem.overloads);
      }
      if (overload.params) {
        overload.params.forEach(function (p) {
          var arg = p.name;
          var p2;
          for (var i = 0; !p2 && i < alloverloads.length; i ++) {
            if (alloverloads[i].params) {
              p2 = alloverloads[i].params.find(p3 => p3.description && p3.name === arg);
              if (p2) {
                if (p.optional) {
                  arg = '[' + arg + ']';
                }
                emitDescription('@param ' + arg + ' ' + p2.description);
                break;
              }
            }
          }
        });
      }
      if (overload.chainable) {
        emitDescription('@chainable');
      } else if (overload.return && overload.return.description) {
        emitDescription('@return ' + overload.return.description);
      }
    }
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
