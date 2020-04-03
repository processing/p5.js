/* Grunt Task to Release the Library files on dist repo for Bower */

// Using native exec instead of Grunt spawn so as to utilise Promises
const exec = require('child_process').exec;

module.exports = function(grunt) {
  const opts = {
    clean: {
      bower: {
        src: ['bower-repo/']
      }
    },
    copy: {
      main: {
        expand: true,
        src: ['lib/*.js', 'lib/addons/*'],
        dest: 'bower-repo/lib/',
        flatten: true
      }
    }
  };

  grunt.registerTask(
    'release-bower',
    'Publishes the new release of p5.js on Bower',
    function() {
      // Async Task
      const done = this.async();

      // Keep the version handy
      const version = require('../../package.json').version;

      // Keep the release-party ready
      const releaseParty = grunt.config.get('bowerReleaser');

      grunt.config.set('clean', opts.clean);
      grunt.config.set('copy', opts.copy);

      // Clean the Bower repo local folder
      grunt.task.run('clean:bower');

      // Avoiding Callback Hell and using Promises
      new Promise((resolve, reject) => {
        // Clone the repo. NEEDS TO BE QUIET. Took 3 hours to realise this.
        // Otherwise the stdout screws up
        console.log('Cloning the Release repo ...');
        exec(
          `git clone -q \
          https://github.com/${releaseParty}/p5.js-release.git \
          bower-repo`,
          (err, stdout, stderr) => {
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
        .then(function(resolve, reject) {
          // Copy the lib to bower-repo.
          console.log('Copying new files ...');
          grunt.task.run('copy');

          // Git add, commit, push
          console.log('Pushing out changes ...');
          return new Promise(function(resolve, reject) {
            exec(
              `git add --all && git commit -am "${version}" && git push -q`,
              { cwd: './bower-repo' },
              (err, stdout, stderr) => {
                if (err) {
                  reject(err);
                }
                if (stderr) {
                  reject(stderr);
                }
                console.log('Released on Bower!');
                resolve();
                done();
              }
            );
          });
        })
        .catch(err => {
          console.log('Failed to Release on Bower!');
          throw new Error(err);
        });
    }
  );
};
