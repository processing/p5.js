'use strict';

var path = require('path');
var browserify = require('browserify');
var derequire = require('derequire');

module.exports = function(grunt) {

  grunt.registerMultiTask('modularise', 'Compile the modules with Browserify', function() {
    // Reading and writing files is asynchronous
    var done = this.async();

    // Render the banner for the top of the file
    var bannerTemplate = '/*! p5.<%= this.target %>.js v<%= pkg.version %> <%= grunt.template.today("mmmm dd, yyyy") %> */';
    var banner = grunt.template.process(bannerTemplate);

    // src file path
    var srcFilePath = require.resolve('../../' + this.data);
    
    var libFilePath = path.resolve('lib/' + this.target);

    // Invoke Browserify programatically to bundle the code
    var bundle = browserify(, {
        standalone: 'p5'
      })
      .transform('brfs')
      .bundle();

    // Start the generated output with the banner comment,
    var code = banner + '\n';

    // Then read the bundle into memory so we can run it through derequire
    bundle.on('data', function(data) {
      code += data;
    }).on('end', function() {

      // "code" is complete: create the distributable UMD build by running
      // the bundle through derequire, then write the bundle to disk.
      // (Derequire changes the bundle's internal "require" function to
      // something that will not interfere with this module being used
      // within a separate browserify bundle.)
      grunt.file.write(libFilePath, derequire(code));

      // Print a success message
      grunt.log.writeln('>>'.green + ' Module ' + libFilePath.cyan + ' created.');

      // Complete the task
      done();
    });
  });
};
