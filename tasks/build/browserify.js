'use strict';

const path = require('path');
const browserify = require('browserify');
const derequire = require('derequire');

const bannerTemplate =
  '/*! p5.js v<%= pkg.version %> <%= grunt.template.today("mmmm dd, yyyy") %> */';

module.exports = function(grunt) {
  const srcFilePath = require.resolve('../../src/app.js');

  grunt.registerTask(
    'browserify',
    'Compile the p5.js source with Browserify',
    function(param) {
      const isMin = param === 'min';
      const filename = isMin ? 'p5.pre-min.js' : 'p5.js';

      // This file will not exist until it has been built
      const libFilePath = path.resolve('lib/' + filename);

      // Reading and writing files is asynchronous
      const done = this.async();

      // Render the banner for the top of the file
      const banner = grunt.template.process(bannerTemplate);

      // Invoke Browserify programatically to bundle the code
      let browseified = browserify(srcFilePath, {
        standalone: 'p5'
      });

      if (isMin) {
        browseified = browseified.exclude('../../docs/reference/data.json');
      }

      const bundle = browseified.transform('brfs').bundle();

      // Start the generated output with the banner comment,
      let code = banner + '\n';

      // Then read the bundle into memory so we can run it through derequire
      bundle
        .on('data', function(data) {
          code += data;
        })
        .on('end', function() {
          // "code" is complete: create the distributable UMD build by running
          // the bundle through derequire, then write the bundle to disk.
          // (Derequire changes the bundle's internal "require" function to
          // something that will not interfere with this module being used
          // within a separate browserify bundle.)
          grunt.file.write(libFilePath, derequire(code));

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
