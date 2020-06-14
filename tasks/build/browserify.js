'use strict';

import { resolve } from 'path';
import browserify from 'browserify';
import { format } from 'prettier';
import derequire from 'derequire';

const bannerTemplate =
  '/*! p5.js v<%= pkg.version %> <%= grunt.template.today("mmmm dd, yyyy") %> */';

module.exports = function(grunt) {
  const srcFilePath = require.resolve('../../src/app.js');

  grunt.registerTask(
    'browserify',
    'Compile the p5.js source with Browserify',
    function(param) {
      const isMin = param === 'min';
      const isTest = param === 'test';
      const filename = isMin
        ? 'p5.pre-min.js'
        : isTest ? 'p5-test.js' : 'p5.js';

      // This file will not exist until it has been built
      const libFilePath = resolve('lib/' + filename);

      // Reading and writing files is asynchronous
      const done = this.async();

      // Render the banner for the top of the file
      const banner = grunt.template.process(bannerTemplate);

      // Invoke Browserify programatically to bundle the code
      let browseified = browserify(srcFilePath, {
        standalone: 'p5'
      });

      if (isMin) {
        browseified = browseified
          .exclude('../../docs/reference/data.json')
          .exclude('../../../docs/parameterData.json')
          .exclude('../../translations')
          .ignore('i18next')
          .ignore('i18next-browser-languagedetector');
      }

      const babelifyOpts = { plugins: ['static-fs'] };

      if (isTest) {
        babelifyOpts.envName = 'test';
      }

      const bundle = browseified.transform('babelify', babelifyOpts).bundle();

      // Start the generated output with the banner comment,
      let code = banner + '\n';

      // Then read the bundle into memory so we can run it through derequire
      bundle
        .on('data', function(data) {
          code += data;
        })
        .on('end', function() {
          // "code" is complete: create the distributable UMD build by running
          // the bundle through derequire
          // (Derequire changes the bundle's internal "require" function to
          // something that will not interfere with this module being used
          // within a separate browserify bundle.)
          code = derequire(code);

          // and prettify the code
          if (!isMin) {
            code = format(code, {
              singleQuote: true,
              printWidth: 80 + 12
            });
          }

          // finally, write it to disk
          grunt.file.write(libFilePath, code);

          // Print a success message
          grunt.log.writeln(
            '>>'.green + ' Bundle ' + ('lib/' + filename).cyan + ' created.'
          );

          // Complete the task
          done();
        });
    }
  );
};
