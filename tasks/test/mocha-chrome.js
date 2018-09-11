/* Grunt Task to test mocha in a local Chrome instance */

const MochaCrome = require('mocha-chrome');

module.exports = function(grunt) {
  grunt.registerMultiTask('mochaChrome', async function() {
    const done = this.async();

    try {
      const options = this.data.options;

      for (const testURL of options.urls) {
        const my_opts = Object.assign({}, options);
        my_opts.urls = undefined;
        my_opts.url = testURL;
        my_opts.chromeFlags = ['--no-sandbox', '--mute-audio'];
        my_opts.logLevel = 'trace';
        let success, failure;
        const runner = new MochaCrome(my_opts);
        runner.on('ended', stats => {
          if (stats.failures) {
            failure = stats;
          } else {
            success = stats;
          }
        });
        runner.on('failure', e => (failure = e));

        (async function() {
          await runner.connect();
          await runner.run();
        })();

        await new Promise((resolve, reject) => {
          runner.on('exit', function() {
            if (success) resolve(success);
            else reject(failure);
          });
        });
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
