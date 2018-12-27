'use strict';

const path = require('path');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');

module.exports = function(grunt) {
  grunt.registerTask(
    'browserify',
    'Compile the p5.js source with Rollup',
    function(param) {
      var isMin = param === 'min';
      var filename = isMin ? 'p5.pre-min.js' : 'p5.js';

      const bannerTemplate = `// hiiiii`;

      // This file will not exist until it has been built
      var libFilePath = path.join(__dirname, '../../lib/', filename);

      var srcFilePath = path.join(__dirname, '../../src/app.js');

      const inputOptions = {
        input: srcFilePath,
        plugins: [resolve(), commonjs(), json()]
      };
      const outputOptions = {
        format: 'umd',
        file: libFilePath,
        name: 'p5',
        banner: bannerTemplate
      };

      // Reading and writing files is asynchronous
      var done = this.async();

      rollup.rollup(inputOptions).then(bundle => {
        bundle.generate(outputOptions).then(() => {
          bundle.write(outputOptions).then(() => {
            // Print a success message
            grunt.log.writeln(
              '>>'.green + ' Bundle ' + ('lib/' + filename).cyan + ' created.'
            );
            // Complete the task
            done();
          });
        });
      });
    }
  );
};
