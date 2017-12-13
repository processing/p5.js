'use strict';
const chalk = require('chalk');

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

      var linter = require('../../utils/sample-linter.js');
      const result = linter.eslintFiles(opts, this.filesSrc);
      const report = result.report;
      const output = result.output;

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
