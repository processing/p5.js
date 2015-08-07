'use strict';

var path = require('path');
var fs = require('fs');
var browserify = require('browserify');
var derequire = require('derequire'); // This is a silly thing to type

var bannerTemplate = '/*! p5.js v<%= pkg.version %> <%= grunt.template.today("mmmm dd, yyyy") %> */';

module.exports = function(grunt) {

  var libFilePath = path.join(process.cwd(), 'lib/p5.js');
  var srcFilePath = path.join(process.cwd(), 'src/app.js');

  grunt.registerTask('browserify', 'Compile the p5.js source with Browserify', function() {
    // Reading and writing files is asynchronous
    var done = this.async();

    // Render the banner for the top of the file
    var banner = grunt.template.process(bannerTemplate);

    // Invoke Browserify programatically to bundle the code
    var bundle = browserify(srcFilePath, {
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
      fs.writeFile(libFilePath, derequire(code), done);
    });
  });
};
