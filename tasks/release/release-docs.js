/* Grunt Task to Release the DOcs on website repo */

// Using native exec instead of Grunt spawn so as to utilise Promises
const exec = require('child_process').exec;

module.exports = function(grunt) {
  grunt.registerTask(
    'release-docs',
    'Publishes the new docs of p5.js on the website',
    function() {
      // Async Task
      var done = this.async();
      // Keep the version handy
      var version = require('../../package.json').version;
      // Keep the release-party ready
      var releaseParty = grunt.config.get('docsReleaser');
      // Avoiding Callback Hell and using Promises
      new Promise(function(resolve, reject) {
        // Clone the website locally
        console.log('Cloning the website ...');
        exec(
          'rm -rf p5-website/ && git clone -q https://github.com/' +
            releaseParty +
            '/p5.js-website.git p5-website',
          function(err, stdout, stderr) {
            if (err) {
              reject(err);
            }
            if (stderr) {
              reject(stderr);
            }
            resolve();
          }
        );
      })
        .then(function() {
          // Copy the new docs over
          console.log('Copying new docs ...');
          return new Promise(function(resolve, reject) {
            exec(
              'cp -r docs/reference/ p5-website/src/templates/pages/reference/',
              function(err, stdout, stderr) {
                if (err) {
                  reject(err);
                }
                if (stderr) {
                  reject(stderr);
                }
                resolve();
              }
            );
          });
        })
        .then(function() {
          // Add, Commit, Push
          console.log('Pushing to GitHub ...');
          return new Promise(function(resolve, reject) {
            exec(
              'git add --all && git commit -am "Updated Reference for version ' +
                version +
                '" && git push',
              { cwd: './p5-website' },
              function(err, stdout, stderr) {
                if (err) {
                  reject(err);
                }
                if (stderr) {
                  reject(stderr);
                }
                console.log('Released Docs on Website!');
                resolve();
                done();
              }
            );
          });
        })
        .catch(function(err) {
          throw new Error(err);
        });
    }
  );
};
