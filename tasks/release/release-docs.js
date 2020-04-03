/* Grunt Task to Release the DOcs on website repo */

// Using native exec instead of Grunt spawn so as to utilise Promises
const exec = require('child_process').exec;

module.exports = function(grunt) {
  grunt.registerTask(
    'release-docs',
    'Publishes the new docs of p5.js on the website',
    function() {
      const opts = {
        clean: {
          website: {
            src: ['bower-repo/']
          }
        },
        copy: {
          main: {
            files: [
              {
                expand: true,
                src: [
                  'docs/reference/data.json',
                  'docs/reference/data.min.json'
                ],
                dest: 'p5-website/src/templates/pages/reference/'
              },
              {
                expand: true,
                src: 'docs/reference/assets/**/*',
                dest: 'p5-website/src/templates/pages/reference/'
              },
              {
                expand: true,
                src: ['lib/p5.min.js', 'lib/addons/p5.sound.min.js'],
                dest: 'p5-website/src/assets/js/'
              }
            ]
          }
        }
      };

      // Async Task
      const done = this.async();

      // Keep the version handy
      const version = require('../../package.json').version;

      // Keep the release-party ready
      const releaseParty = grunt.config.get('docsReleaser');

      grunt.config.set('clean', opts.clean);
      grunt.config.set('copy', opts.copy);

      // Clean the Bower repo local folder
      grunt.task.run('clean:website');

      // Avoiding Callback Hell and using Promises
      new Promise((resolve, reject) => {
        // Clone the website locally
        console.log('Cloning the website ...');
        exec(
          `git clone -q https://github.com/${releaseParty}/p5.js-website.git \
          p5-website`,
          (err, stdout, stderr) => {
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
          console.log('Copying new docs ...');
          grunt.task.run('copy');

          // Add, Commit, Push
          console.log('Pushing to GitHub ...');
          return new Promise(function(resolve, reject) {
            exec(
              `git add --all && \
              git commit -am "Updated Reference for version ${version}" && \
              git push`,
              { cwd: './p5-website' },
              (err, stdout, stderr) => {
                if (err) {
                  reject(err);
                }
                console.log(stdout);
                resolve();
              }
            );
          });
        })
        .then(() => {
          console.log('Released Docs on Website!');
          done();
        })
        .catch(function(err) {
          throw new Error(err);
        });
    }
  );
};
