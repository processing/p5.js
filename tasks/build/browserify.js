'use strict';

const path = require('path');
const Bundler = require('parcel-bundler');

module.exports = function(grunt) {
  grunt.registerTask('parcel', 'Compile the p5.js source with parcel', function(
    param
  ) {
    const isMin = param === 'min';
    const outputFilename = isMin ? 'p5.min.js' : 'p5.js';
    const srcFilePath = path.join(__dirname, '../../src/app.js');

    if (isMin) {
      process.env.IS_MINIFIED = true;
    }

    const options = {
      outDir: './lib',
      outFile: outputFilename,
      minify: isMin,
      global: 'p5',
      watch: false
    };
    // Reading and writing files is asynchronous
    const done = this.async();

    const bundler = new Bundler(srcFilePath, options);

    bundler.bundle().then(() => {
      done();
    });
  });
};
