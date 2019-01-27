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
            console.log(stdout);
            resolve();
          }
        );
      })
        .then(function() {
          // Copy the new docs over
          const src = 'docs/reference';
          const dest = 'p5-website/src/templates/pages/reference/';
          console.log('Copying new docs ...');
          return new Promise(function(resolve, reject) {
            exec(
              `(cp ${src}/data.json ${src}/data.min.json ${dest}) &&
               (cp -r ${src}/assets ${dest}) &&
               (cp lib/p5.min.js lib/addons/p5.dom.min.js lib/addons/p5.sound.min.js p5-website/src/assets/js/)`,
              function(err, stdout, stderr) {
                if (err) {
                  reject(err);
                }
                console.log(stdout);
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
                console.log(stdout);
                resolve();
              }
            );
          });
        })
        .then(function() {
          console.log('Released Docs on Website!');
          done();
        })
        .catch(function(err) {
          throw new Error(err);
        });
    }
  );
};
