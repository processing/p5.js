/* Grunt Task to test mocha in a local Chrome instance */

const MochaCrome = require('mocha-chrome');

module.exports = function(grunt) {
  grunt.registerMultiTask('mochaChrome', function() {
    var done = this.async();
    var options = this.data.options;
    Promise.all(
      options.urls.map(function(testURL) {
        return new Promise(function(resolve, reject) {
          var my_opts = Object.assign({}, options);
          my_opts.urls = undefined;
          my_opts.url = testURL;
          my_opts.chromeFlags = [];
          my_opts.logLevel = 'trace';
          var runner = new MochaCrome(my_opts);
          runner.on('ended', function(stats) {
            if (stats.failures) {
              reject(stats);
            } else {
              resolve(stats);
            }
          });
          runner.on('failure', reject);
          runner.connect().then(() => runner.run());
        });
      })
    )
      .then(done)
      .catch(function(e) {
        if (e instanceof Error) {
          done(e);
        } else {
          done(new Error(e));
        }
      });
  });
};
