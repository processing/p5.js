'use strict';

var fs = require('fs');
var path = require('path');
var browserify = require('browserify');
var derequire = require('derequire');

module.exports = function(grunt) {

  grunt.registerMultiTask('modularise', 'Compile the modules with Browserify', function() {
    // Reading and writing files is asynchronous
    var done = this.async();

    // Module specific task details
    var module_name = this.target;
    var module_src = this.data;

    // Render the banner for the top of the file. Includes the Module name.
    var bannerTemplate = '/*! p5.' + module_name + '.js v<%= pkg.version %> <%= grunt.template.today("mmmm dd, yyyy") %> */';
    var banner = grunt.template.process(bannerTemplate);

    // Make a list of sources from app.js in that sequence only
    var sources = [];
    var dump = fs.readFileSync('./src/app.js', 'utf8');
    var regexp = /\(\'.+\'/g;
    var match;
    while( (match = regexp.exec(dump)) != null) {
      var text = match[0];
      text = text.substring(text.indexOf('./')+2, text.length-1);
      sources.push(text);
    }

    // Populate the source file path array with concerned files' path
    var srcDirPath = './src';
    var srcFilePath = [];
    for (var i = 0; i < sources.length; i++) {
      var source = sources[i];
      var base = source.substring(0,source.lastIndexOf('/'));
      if(base === 'core' || module_src.search(base) !== -1) {
        // Push the resolved paths directly
        var filePath = (source.search('.js') !== -1) ? source : source + '.js';
        var fullPath = path.resolve(srcDirPath, filePath);
        srcFilePath.push(fullPath);
      }
    }

    // console.log(srcFilePath);
    // Target file path
    var libFilePath = path.resolve('lib/modules/' + module_name + '.js');

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
      grunt.file.write(libFilePath, derequire(code));

      // Print a success message
      grunt.log.writeln('>>'.green + ' Module ' + libFilePath.blue + ' created.');

      // Complete the task
      done();
    });
  });
};
