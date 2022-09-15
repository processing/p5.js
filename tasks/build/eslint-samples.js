// This file contains the "eslint-samples" task.

'use strict';
import { magenta } from 'chalk';

module.exports = grunt => {
  grunt.registerMultiTask(
    'eslint-samples',
    'Validate samples with ESLint',
    async function() {
      const done = this.async();
      const opts = this.options({
        outputFile: false,
        quiet: false,
        maxWarnings: -1,
        envs: ['eslint-samples/p5'],
        verbose: true,
        debug: true
      });

      if (this.filesSrc.length === 0) {
        grunt.log.writeln(magenta('Could not find any files to validate'));
        return true;
      }

      // need to use require here because we want this to only
      // get loaded after the data file has been created by a
      // prior grunt task
      const sampleLinter = require('../../utils/sample-linter.js');
      const result = await sampleLinter.eslintFiles(opts, this.filesSrc);
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

      done(report.errorCount === 0);
    }
  );
};
