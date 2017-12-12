'use strict';
const chalk = require('chalk');
const eslint = require('eslint');

var debug = require('debug');
debug.enable('eslint:*');

module.exports = grunt => {
  grunt.registerMultiTask(
    'eslint-samples',
    'Validate samples with ESLint',
    function() {
      const opts = this.options({
        outputFile: false,
        quiet: false,
        maxWarnings: -1,
        envs: ['eslint-samples/p5'],
        verbose: true,
        debug: true
      });

      if (this.filesSrc.length === 0) {
        grunt.log.writeln(
          chalk.magenta('Could not find any files to validate')
        );
        return true;
      }

      const formatter = eslint.CLIEngine.getFormatter(opts.format);

      if (!formatter) {
        grunt.warn(`Could not find formatter ${opts.format}`);
        return false;
      }

      const engine = new eslint.CLIEngine(opts);

      var itemtypes = ['method', 'property'];

      var dataDoc = require('../../docs/reference/data.json');
      var globals = {};
      dataDoc.classitems
        .filter(ci => ci.class === 'p5' && itemtypes.indexOf(ci.itemtype) >= 0)
        .forEach(ci => {
          globals[ci.name] = true;
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
      engine.addPlugin('eslint-samples', {
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

                var re = /(<code[^>]*>.*(?:\r\n|\r|\n))((?:.|\r|\n)*?)<\/code>/gm;
                while ((m = re.exec(commentText)) != null) {
                  var code = m[2];
                  if (!code) continue;
                  code = code.replace(/^ *\* ?/gm, '');

                  samples.push({
                    comment: comment,
                    index: m.index + m[1].length,
                    code: code,
                    lines: splitLines(code)
                  });
                }
              }

              return samples.map(
                s =>
                  s.code +
                  '\ntypeof draw, typeof setup, typeof preload, typeof mousePressed;\n'
              );
            },

            postprocess: function(sampleMessages) {
              var problems = [];

              for (var i = 0; i < sampleMessages.length; i++) {
                var messages = sampleMessages[i];
                var sample = this.samples[i];
                if (!messages.length) continue;

                var sampleIndex = sample.comment.range[0] + sample.index;
                var sampleLine = this.lines.lineFromIndex(sampleIndex);

                for (var j = 0; j < messages.length; j++) {
                  var msg = messages[j];

                  /*
                  var fix = msg.fix;
                  if (fix) {
                    var fixLine1 = sample.lines.lineFromIndex(fix.range[0]);
                    var fixLine2 = sample.lines.lineFromIndex(fix.range[1] - 1);
                    if (fixLine1 !== fixLine2) {
                      // TODO: handle multi-line fixes
                      fix.range = [0, 0];
                      fix.text = '';
                    } else {
                      var line = this.lines[sampleLine + fixLine1];
                      console.log(msg);
                      console.log(sampleLine);
                      console.log(fixLine1);
                      console.log(line);
                      //return;
                      fix.range[0] += line.index + line.prefixLength;
                      fix.range[1] += line.index + line.prefixLength;

                      console.log(fix);
                      //return;
                    }
                  }
                  */

                  var startLine = msg.line + sampleLine;
                  msg.column += this.lines[startLine].prefixLength;
                  msg.line = startLine;

                  if (msg.endLine) {
                    var endLine = msg.endLine + sampleLine;
                    msg.endColumn += this.lines[endLine].prefixLength;
                    msg.endLine = endLine;
                  }

                  msg.message = msg.message
                    .replace('\r', '\\r')
                    .replace('\n', '\\n');

                  problems.push(msg);
                }
              }
              return problems;
            }
          }
        }
      });

      let report;
      try {
        report = engine.executeOnFiles(this.filesSrc);
      } catch (err) {
        grunt.warn(err);
        return false;
      }

      if (opts.fix) {
        eslint.CLIEngine.outputFixes(report);
      }

      let results = report.results;

      if (opts.quiet) {
        results = eslint.CLIEngine.getErrorResults(results);
      }

      const output = formatter(results);

      if (opts.outputFile) {
        grunt.file.write(opts.outputFile, output);
      } else if (output) {
        console.log(output);
      }

      const tooManyWarnings =
        opts.maxWarnings >= 0 && report.warningCount > opts.maxWarnings;

      if (report.errorCount === 0 && tooManyWarnings) {
        grunt.warn(
          `ESLint found too many warnings (maximum: ${opts.maxWarnings})`
        );
      }

      return report.errorCount === 0;
    }
  );
};
