'use strict';

const fs = require('fs');
const path = require('path');
const browserify = require('browserify');
const derequire = require('derequire');

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
        temp.push(arg);
      }
      const module_src = temp.join(', ');

      // Render the banner for the top of the file. Includes the Module name.
      const bannerTemplate = `/*! Custom p5.js v<%= pkg.version %> <%= grunt.template.today("mmmm dd, yyyy") %> 
        Contains the following modules : ${module_src}*/`;
      const banner = grunt.template.process(bannerTemplate);

      // Make a list of sources from app.js in that sequence only
      const sources = [];
      const dump = fs.readFileSync('./src/app.js', 'utf8');
      const regexp = /\('.+'/g;
      let match;
      while ((match = regexp.exec(dump)) != null) {
        let text = match[0];
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
      // Target file path
      const libFilePath = path.resolve('lib/modules/p5Custom.js');

      // Invoke Browserify programatically to bundle the code
      const bundle = browserify(srcFilePath, {
        standalone: 'p5'
      })
        .transform('brfs')
        .bundle();

      // Start the generated output with the banner comment,
      let code = banner + '\n';

      // Then read the bundle into memory so we can run it through derequire
      bundle
        .on('data', function(data) {
          code += data;
        })
        .on('end', function() {
          grunt.file.write(libFilePath, derequire(code));

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
