'use strict';

const path = require('path');
const Bundler = require('parcel-bundler');

module.exports = function(grunt) {
  grunt.registerTask(
    'parcel-dom',
    'Minify the p5.dom.js source with parcel',
    function() {
      const srcFilePath = path.join(__dirname, '../../lib/addons/p5.dom.js');

      const options = {
        outDir: './lib/addons/',
        outFile: 'p5.dom.min.js',
        minify: true,
        global: 'p5.dom',
        watch: false
      };
      // Reading and writing files is asynchronous
      const done = this.async();

      const bundler = new Bundler(srcFilePath, options);

      bundler.bundle().then(() => {
        done();
      });
    }
  );
};
