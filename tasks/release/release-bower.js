/* Grunt Task to Release the Library files on dist repo for Bower */

// Using native exec instead of Grunt spawn so as to utilise Promises
const exec = require('child_process').exec;

module.exports = function(grunt) {
  grunt.registerTask(
    'release-bower',
    'Publishes the new release of p5.js on Bower',
    function() {
      // Async Task
      var done = this.async();
      // Keep the version handy
      var version = require('../../package.json').version;
      // Keep the release-party ready
      var releaseParty = grunt.config.get('bowerReleaser');
      // Avoiding Callback Hell and using Promises
      new Promise(function(resolve, reject) {
        // Clone the repo. NEEDS TO BE QUIET. Took 3 hours to realise this.
        // Otherwise the stdout screws up
        console.log('Cloning the Release repo ...');
        exec(
          'rm -rf bower-repo/ && git clone -q https://github.com/' +
            releaseParty +
            '/p5.js-release.git bower-repo',
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
        .then(function(resolve, reject) {
          // Copy the lib to bower-repo.
          // NOTE : Uses 'cp' of UNIX. Make sure it is unaliased in your .bashrc,
          // otherwise it may prompt always for overwrite (not desirable)
          console.log('Copying new files ...');
          return new Promise(function(resolve, reject) {
            exec('cp -R lib/*.js lib/addons bower-repo/lib', function(
              err,
              stdout,
              stderr
            ) {
              if (err) {
                reject(err);
              }
              if (stderr) {
                reject(stderr);
              }
              resolve();
            });
          });
        })
        .then(function(resolve, reject) {
          // Git add, commit, push
          console.log('Pushing out changes ...');
          return new Promise(function(resolve, reject) {
            exec(
              'git add --all && git commit -am "' +
                version +
                '" && git push -q',
              { cwd: './bower-repo' },
              function(err, stdout, stderr) {
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
        .catch(function(err) {
          console.log('Failed to Release on Bower!');
          throw new Error(err);
        });
    }
  );
};
