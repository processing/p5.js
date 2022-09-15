// This file holds the "browersify" task which compiles the individual src/ code into p5.js and p5.min.js.

'use strict';

import { resolve } from 'path';
import browserify from 'browserify';
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
      const isDev = param === 'dev';

      const filename = isMin
        ? 'p5.pre-min.js'
        : isTest ? 'p5-test.js' : 'p5.js';

      // This file will not exist until it has been built
      const libFilePath = resolve('lib/' + filename);

      // Reading and writing files is asynchronous
      const done = this.async();

      // Render the banner for the top of the file
      const banner = grunt.template.process(bannerTemplate);

      let globalVars = {};
      if (isDev) {
        globalVars['P5_DEV_BUILD'] = () => true;
      }
      // Invoke Browserify programatically to bundle the code
      let browserified = browserify(srcFilePath, {
        standalone: 'p5',
        insertGlobalVars: globalVars
      });

      if (isMin) {
        // These paths should be the exact same as what are used in the import
        // statements in the source. They are not relative to this file. It's
        // just how browserify works apparently.
        browserified = browserified
          .exclude('../../docs/reference/data.json')
          .exclude('../../../docs/parameterData.json')
          .exclude('../../translations')
          .exclude('./browser_errors')
          .ignore('i18next')
          .ignore('i18next-browser-languagedetector');
      }

      if (!isDev) {
        browserified = browserified.exclude('../../translations/dev');
      }

      const babelifyOpts = {
        global: true
      };

      if (isTest) {
        babelifyOpts.envName = 'test';
      }

      const bundle = browserified
        .transform('brfs-babel')
        .transform('babelify', babelifyOpts)
        .bundle();

      // Start the generated output with the banner comment,
      let code = banner + '\n';

      // Then read the bundle into memory so we can run it through derequire
      bundle
        .on('data', function(data) {
          code += data;
        })
        .on('end', function() {
          code = code.replace(
            "'VERSION_CONST_WILL_BE_REPLACED_BY_BROWSERIFY_BUILD_PROCESS'",
            grunt.template.process("'<%= pkg.version %>'")
          );

          // "code" is complete: create the distributable UMD build by running
          // the bundle through derequire
          // (Derequire changes the bundle's internal "require" function to
          // something that will not interfere with this module being used
          // within a separate browserify bundle.)
          code = derequire(code);

          // and prettify the code
          if (!isMin) {
            const prettyFast = require('pretty-fast');
            code = prettyFast(code, {
              url: '(anonymous)',
              indent: '  '
            }).code;
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
