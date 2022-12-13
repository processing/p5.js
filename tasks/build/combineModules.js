// This file contains the "combineModules" task called during the build process.

'use strict';

const fs = require('fs');
const path = require('path');
const browserify = require('browserify');
const derequire = require('derequire');

module.exports = function(grunt) {
  const tempFilePath = path.resolve('./src/customApp.js');
  grunt.registerTask(
    'combineModules',
    'Compile and combine certain modules with Browserify',
    function(args) {
      // Reading and writing files is asynchronous
      const done = this.async();

      // Modules is an array of p5 modules to be bundled.
      const modules = ['core'];
      for (const arg of arguments) {
        if (arg !== 'min') {
          modules.push(arg);
        }
      }
      const modulesList = modules.join(', ');

      // Render the banner for the top of the file. Includes the Module name.
      const bannerTemplate = `/*! Custom p5.js v<%= pkg.version %> <%= grunt.template.today("mmmm dd, yyyy") %>
        Contains the following modules : ${modulesList}*/`;
      const banner = grunt.template.process(bannerTemplate);

      // Make a list of sources from app.js which match our criteria
      const dump = fs.readFileSync('./src/app.js', 'utf8').split('\n');
      const sources = [];
      const regexp = new RegExp('./(' + modules.join('/|') + ')', 'g');
      dump.forEach(source => {
        let match;
        while ((match = regexp.exec(source)) !== null) {
          sources.push(match.input);
        }
      });
      sources.push('module.exports = p5;');

      // Create a temp file with this data and feed it to browserify
      fs.writeFileSync(tempFilePath, sources.join('\n'), 'utf8');

      // Check whether combineModules is minified
      const isMin = args === 'min';
      const filename = isMin ? 'p5Custom.pre-min.js' : 'p5Custom.js';

      // Target file path
      const libFilePath = path.resolve('lib/modules/' + filename);

      // Invoke Browserify programatically to bundle the code
      let browseified = browserify(tempFilePath, {
        standalone: 'p5'
      });

      if (isMin) {
        browseified = browseified
          .exclude('../../docs/reference/data.json')
          .exclude('../../docs/parameterData.json');
      }

      const babelifyOpts = { plugins: ['static-fs'] };

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
            const prettyFast = require('pretty-fast');
            code = prettyFast(code, {
              url: '(anonymous)',
              indent: '  '
            }).code;
          }

          // finally, write it to disk and remove the temp file
          grunt.file.write(libFilePath, code);
          grunt.file.delete(tempFilePath);

          // Print a success message
          grunt.log.writeln(
            '>>'.green + ' Module ' + libFilePath.blue + ' created.'
          );

          // Complete the task
          done();
        });
    }
  );
};
