'use strict';
const eslint = require('eslint');

// envs: ['eslint-samples/p5'],

var itemtypes = ['method', 'property'];
var classes = ['p5', 'p5.dom'];

var dataDoc = require('../docs/reference/data.min.json');
var globals = {};
dataDoc.classitems
  .filter(
    ci => classes.indexOf(ci.class) >= 0 && itemtypes.indexOf(ci.itemtype) >= 0
  )
  .forEach(ci => {
    globals[ci.name] = true;
  });

Object.keys(dataDoc.consts).forEach(c => {
  globals[c] = true;
});

dataDoc.classitems
  .find(ci => ci.name === 'keyCode' && ci.class === 'p5')
  .description.match(/[A-Z\r\n, _]{10,}/m)[0]
  .match(/[A-Z_]+/gm)
  .forEach(c => {
    globals[c] = true;
  });

function splitLines(text) {
  var lines = [];

  lines.lineFromIndex = function(index) {
    var lines = this;
    var lineCount = lines.length;
    for (var i = 0; i < lineCount; i++) {
      if (index < lines[i].index) return i - 1;
    }
    return lineCount - 1;
  };

  var m;
  var reSplit = /(( *\* ?)?.*)(?:\r\n|\r|\n)/g;
  while ((m = reSplit.exec(text)) != null) {
    if (m.index === reSplit.lastIndex) {
      reSplit.lastIndex++;
    }

    lines.push({
      index: m.index,
      text: m[1],
      prefixLength: m[2] ? m[2].length : 0
    });
  }

  return lines;
}

var EOL = require('os').EOL;

var userFunctions = [
  'draw',
  'setup',
  'preload',
  'mousePressed',
  'mouseDragged',
  'mouseMoved',
  'mouseReleased',
  'mouseClicked',
  'mouseWheel',
  'doubleClicked',
  'windowResized',
  'touchStarted',
  'touchMoved',
  'touchEnded',
  'deviceMoved',
  'deviceTurned',
  'deviceShaken',
  'keyPressed',
  'keyReleased',
  'keyTyped'
];
var userFunctionTrailer =
  EOL + userFunctions.map(s => 'typeof ' + s + ';').join(EOL) + EOL;

module.exports = {
  environments: {
    p5: {
      globals: globals
    }
  },
  processors: {
    '.js': {
      supportsAutofix: true,
      preprocess: function(text) {
        this.lines = splitLines(text);

        var m;
        var comments = [];

        var reComment = /\/\*\*(?:.|\r|\n)*?\*\//g;
        while ((m = reComment.exec(text)) != null) {
          var value = m[0];
          comments.push({
            value: value,
            range: [m.index, m.index + value.length]
          });
        }

        var samples = (this.samples = []);

        for (var i = 0; i < comments.length; i++) {
          var comment = comments[i];
          var commentText = comment.value;

          var re = /(<code[^>]*>\s*(?:\r\n|\r|\n))((?:.|\r|\n)*?)<\/code>/gm;
          while ((m = re.exec(commentText)) != null) {
            var code = m[2];
            if (!code) continue;
            code = code.replace(/^ *\* ?/gm, '');

            samples.push({
              comment: comment,
              index: m.index + m[1].length,
              code: code
            });
          }
        }

        return samples.map(s => s.code + userFunctionTrailer);
      },

      postprocess: function(sampleMessages, filename) {
        var problems = [];

        for (var i = 0; i < sampleMessages.length; i++) {
          var messages = sampleMessages[i];
          var sample = this.samples[i];
          if (!messages.length) continue;

          var sampleLines;

          var sampleIndex = sample.comment.range[0] + sample.index;
          var sampleLine = this.lines.lineFromIndex(sampleIndex);

          for (var j = 0; j < messages.length; j++) {
            var msg = messages[j];

            var fix = msg.fix;
            if (fix) {
              if (!sampleLines) {
                sampleLines = splitLines(sample.code);
              }

              var fixLine1 = sampleLines.lineFromIndex(fix.range[0]);
              var fixLine2 = sampleLines.lineFromIndex(fix.range[1] - 1);
              if (fixLine1 !== fixLine2) {
                // TODO: handle multi-line fixes
                fix.range = [0, 0];
                fix.text = '';
              } else {
                var line = this.lines[sampleLine + fixLine1];

                var fixColumn1 = fix.range[0] - sampleLines[fixLine1].index;
                var fixColumn2 = fix.range[1] - sampleLines[fixLine1].index;

                fix.range[0] = line.index + line.prefixLength + fixColumn1;
                fix.range[1] = line.index + line.prefixLength + fixColumn2;
              }
            }

            var startLine = msg.line + sampleLine;
            msg.column += this.lines[startLine].prefixLength;
            msg.line = startLine;

            if (msg.endLine) {
              var endLine = msg.endLine + sampleLine;
              msg.endColumn += this.lines[endLine].prefixLength;
              msg.endLine = endLine;
            }

            msg.message = msg.message
              .replace(/\r/g, '\\r')
              .replace(/\n|\u23CE/g, '\\n');

            problems.push(msg);
          }
        }
        return problems;
      }
    }
  }
};

function eslintFiles(opts, filesSrc) {
  opts = opts || {
    outputFile: false,
    quiet: false,
    maxWarnings: -1,
    envs: ['eslint-samples/p5', 'amd'],
    format: 'unix'
  };

  if (filesSrc.length === 0) {
    console.warn('Could not find any files to validate');
    return true;
  }

  const formatter = eslint.CLIEngine.getFormatter(opts.format);
  if (!formatter) {
    console.warn(`Could not find formatter ${opts.format}`);
    return false;
  }

  const engine = new eslint.CLIEngine(opts);
  engine.addPlugin('eslint-samples', module.exports);

  let report = engine.executeOnFiles(filesSrc);

  if (opts.fix) {
    eslint.CLIEngine.outputFixes(report);
  }

  let results = report.results;
  if (opts.quiet) {
    results = eslint.CLIEngine.getErrorResults(results);
  }

  return { report, output: formatter(results) };
}

module.exports.eslintFiles = eslintFiles;

if (!module.parent) {
  var result = eslintFiles(null, process.argv.slice(2));
  console.log(result.output);
  process.exit(result.report.errorCount === 0 ? 0 : 1);
}
