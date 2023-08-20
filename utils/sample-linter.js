'use strict';
const EOL = '\n';
import { ESLint } from 'eslint';
import dataDoc from '../docs/reference/data.min.json';
// envs: ['eslint-samples/p5'],

const itemtypes = ['method', 'property'];
const classes = ['p5'];
const globals = {};

dataDoc.classitems
  .filter(
    ci => classes.includes(ci.class) && itemtypes.includes(ci.itemtype)
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

const userFunctions = [
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
const userFunctionTrailer =
  EOL + userFunctions.map(s => 'typeof ' + s + ';').join(EOL) + EOL;

let globalLines, globalSamples;
const plugin = {
  environments: {
    p5: {
      globals: globals
    }
  },
  processors: {
    '.js': {
      supportsAutofix: true,
      preprocess: function(text) {
        globalLines = splitLines(text);

        let m;
        const comments = [];

        const reComment = /\/\*\*(?:.|\r|\n)*?\*\//g;
        while ((m = reComment.exec(text)) != null) {
          const value = m[0];
          comments.push({
            value: value,
            range: [m.index, m.index + value.length]
          });
        }

        globalSamples = [];

        for (let i = 0; i < comments.length; i++) {
          const comment = comments[i];
          const commentText = comment.value;

          const re = /(<code[^>]*>\s*(?:\r\n|\r|\n))((?:.|\r|\n)*?)<\/code>/gm;
          while ((m = re.exec(commentText)) != null) {
            let code = m[2];
            if (!code) continue;
            code = code.replace(/^ *\* ?/gm, '');

            globalSamples.push({
              comment: comment,
              index: m.index + m[1].length,
              code: code
            });
          }
        }

        return globalSamples.map(s => s.code + userFunctionTrailer);
      },

      postprocess: function(sampleMessages, filename) {
        const problems = [];

        for (let i = 0; i < sampleMessages.length; i++) {
          const messages = sampleMessages[i];
          const sample = globalSamples[i];
          if (!messages.length) continue;

          var sampleLines;

          const sampleIndex = sample.comment.range[0] + sample.index;
          const sampleLine = globalLines.lineFromIndex(sampleIndex);

          for (let j = 0; j < messages.length; j++) {
            const msg = messages[j];

            const fix = msg.fix;
            if (fix) {
              if (!sampleLines) {
                sampleLines = splitLines(sample.code);
              }

              const fixLine1 = sampleLines.lineFromIndex(fix.range[0]);
              const fixLine2 = sampleLines.lineFromIndex(fix.range[1] - 1);
              if (fixLine1 !== fixLine2) {
                // TODO: handle multi-line fixes
                fix.range = [0, 0];
                fix.text = '';
              } else {
                const line = globalLines[sampleLine + fixLine1];

                const fixColumn1 = fix.range[0] - sampleLines[fixLine1].index;
                const fixColumn2 = fix.range[1] - sampleLines[fixLine1].index;

                fix.range[0] = line.index + line.prefixLength + fixColumn1;
                fix.range[1] = line.index + line.prefixLength + fixColumn2;
              }
            }

            const startLine = msg.line + sampleLine;
            msg.column += globalLines[startLine].prefixLength;
            msg.line = startLine;

            if (msg.endLine) {
              const endLine = msg.endLine + sampleLine;
              msg.endColumn += globalLines[endLine].prefixLength;
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

async function eslintFiles(opts, filesSrc) {
  opts = opts || {
    outputFile: false,
    quiet: false,
    maxWarnings: -1,
    envs: ['eslint-samples/p5', 'amd'],
    format: 'unix'
  };

  const eslint = new ESLint({
    plugins: {
      'eslint-samples': plugin
    },
    overrideConfig: {
      'plugins': ['eslint-samples']
    },
    fix: opts.fix
  });

  if (filesSrc.length === 0) {
    console.warn('Could not find any files to validate');
    return true;
  }

  const formatter = await eslint.loadFormatter(opts.format);
  if (!formatter) {
    console.warn(`Could not find formatter ${opts.format}`);
    return false;
  }

  let results = await eslint.lintFiles(filesSrc);
  const report = results.reduce((acc, result) => {
    acc.errorCount += result.errorCount;
    acc.warningCount += result.warningCount;
    acc.fixableErrorCount += result.fixableErrorCount;
    acc.fixableWarningCount += result.fixableWarningCount;
    return acc;
  }, {
    errorCount: 0,
    warningCount: 0,
    fixableErrorCount: 0,
    fixableWarningCount: 0
  });

  if (opts.quiet) {
    results = ESLint.getErrorResults(results);
  }

  return {
    report,
    output: formatter.format(results)
  };
}

module.exports.eslintFiles = eslintFiles;

function splitLines(text) {
  const lines = [];

  lines.lineFromIndex = function(index) {
    const lines = this;
    const lineCount = lines.length;
    for (let i = 0; i < lineCount; i++) {
      if (index < lines[i].index) return i - 1;
    }
    return lineCount - 1;
  };

  let m;
  const reSplit = /(( *\* ?)?.*)(?:\r\n|\r|\n)/g;
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

if (!module.parent) {
  eslintFiles(null, process.argv.slice(2))
    .then(result => {
      console.log(result.output);
      process.exit(result.report.errorCount === 0 ? 0 : 1);
    });
}
