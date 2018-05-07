/* Grunt Task to test mocha in a local Chrome instance */

const MochaCrome = require('mocha-chrome');

module.exports = function(grunt) {
  grunt.registerMultiTask('mochaChrome', async function() {
    var done = this.async();

    try {
      var options = this.data.options;

      for (var testURL of options.urls) {
        var my_opts = Object.assign({}, options);
        my_opts.urls = undefined;
        my_opts.url = testURL;
        my_opts.chromeFlags = ['--no-sandbox', '--mute-audio'];
        my_opts.logLevel = 'trace';
        var runner = new MochaCrome(my_opts);
        var result = new Promise((resolve, reject) => {
          runner.on('ended', function(stats) {
            if (stats.failures) {
              reject(stats);
            } else {
              resolve(stats);
            }
          });
          runner.on('failure', reject);
        });

        (async function() {
          await runner.connect();
          await runner.run();
        })();

        await result;
      }

      done();
    } catch (e) {
      if (e instanceof Error) {
        done(e);
      } else {
        done(new Error(e));
      }
    }
  });
};
