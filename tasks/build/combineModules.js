'use strict';

const fs = require('fs');
const path = require('path');
const browserify = require('browserify');
const derequire = require('derequire');
const { format } = require('prettier');

module.exports = function(grunt) {
  grunt.registerTask(
    'combineModules',
    'Compile and combine certain modules with Browserify',
    function(args) {
      // Reading and writing files is asynchronous
      const done = this.async();

      // Module sources are space separated names in a single string (enter within quotes)
      const temp = [];
      for (const arg of arguments) {
        if (arg !== 'min') {
          temp.push(arg);
        }
      }
      const module_src = temp.join(', ');

      // Render the banner for the top of the file. Includes the Module name.
      const bannerTemplate = `/*! Custom p5.js v<%= pkg.version %> <%= grunt.template.today("mmmm dd, yyyy") %>
        Contains the following modules : ${module_src}*/`;
      const banner = grunt.template.process(bannerTemplate);

      // Make a list of sources from app.js in that sequence only
      const sources = [];
      const dump = fs.readFileSync('./src/app.js', 'utf8');
      const regexp = /import\s.*('.+')/g; // Used for ES6 import syntax
      // const regexp = /\('.+'/g; // Used for require syntax
      let match;
      while ((match = regexp.exec(dump)) != null) {
        let text = match[1]; // Used for ES6 import syntax
        // let text = match[0]; // Used for require syntax
        text = text.substring(text.indexOf('./') + 2, text.length - 1);
        sources.push(text);
      }

      // Populate the source file path array with concerned files' path
      const srcDirPath = './src';
      const srcFilePath = [];
      for (var j = 0; j < sources.length; j++) {
        var source = sources[j];
        var base = source.substring(0, source.lastIndexOf('/'));
        if (base === 'core' || module_src.search(base) !== -1) {
          // Push the resolved paths directly
          const filePath =
            source.search('.js') !== -1 ? source : source + '.js';
          var fullPath = path.resolve(srcDirPath, filePath);
          srcFilePath.push(fullPath);
        }
      }

      console.log(srcFilePath);
      // Check whether combineModules is minified
      const isMin = args === 'min';
      const filename = isMin ? 'p5Custom.pre-min.js' : 'p5Custom.js';

      // Target file path
      const libFilePath = path.resolve('lib/modules/' + filename);

      // Invoke Browserify programatically to bundle the code
      let browseified = browserify(srcFilePath, {
        standalone: 'p5'
      });

      if (isMin) {
        browseified = browseified.exclude('../../docs/reference/data.json');
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
            code = format(code, {
              singleQuote: true,
              printWidth: 80 + 12
            });
          }

          // finally, write it to disk
          grunt.file.write(libFilePath, code);

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
