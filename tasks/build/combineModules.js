'use strict';

var fs = require('fs');
var path = require('path');
var browserify = require('browserify');
var derequire = require('derequire');

module.exports = function(grunt) {
  grunt.registerTask(
    'combineModules',
    'Compile and combine certain modules with Browserify',
    function(args) {
      // Reading and writing files is asynchronous
      var done = this.async();

      // Module sources are space separated names in a single string (enter within quotes)
      var module_src,
        temp = [];
      for (var i in arguments) {
        temp.push(arguments[i]);
      }
      module_src = temp.join(', ');

      // Render the banner for the top of the file. Includes the Module name.
      var bannerTemplate =
        '/*! Custom p5.js v<%= pkg.version %> <%= grunt.template.today("mmmm dd, yyyy") %> \nContains the following modules : ' +
        module_src +
        '*/';
      var banner = grunt.template.process(bannerTemplate);

      // Make a list of sources from app.js in that sequence only
      var sources = [];
      var dump = fs.readFileSync('./src/app.js', 'utf8');
      var regexp = /\('.+'/g;
      var match;
      while ((match = regexp.exec(dump)) != null) {
        var text = match[0];
        text = text.substring(text.indexOf('./') + 2, text.length - 1);
        sources.push(text);
      }

      // Populate the source file path array with concerned files' path
      var srcDirPath = './src';
      var srcFilePath = [];
      for (var j = 0; j < sources.length; j++) {
        var source = sources[j];
        var base = source.substring(0, source.lastIndexOf('/'));
        if (base === 'core' || module_src.search(base) !== -1) {
          // Push the resolved paths directly
          var filePath = source.search('.js') !== -1 ? source : source + '.js';
          var fullPath = path.resolve(srcDirPath, filePath);
          srcFilePath.push(fullPath);
        }
      }

      console.log(srcFilePath);
      // Target file path
      var libFilePath = path.resolve('lib/modules/p5Custom.js');

      // Invoke Browserify programatically to bundle the code
      var bundle = browserify(srcFilePath, {
        standalone: 'p5'
      })
        .transform('brfs')
        .bundle();

      // Start the generated output with the banner comment,
      var code = banner + '\n';

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
