/* Grunt Task to  Release the Library files on dist repo for Bower */

const exec = require('child_process').exec;
module.exports = function(grunt) {

  grunt.registerTask('release-bower', 'Publishes the new release of p5.js on Bower', function() {

  	// Async Task
    var done = this.async();
    // Keep the version handy
    var version = require('../../package.json').version;
    // Avoiding Callback Hell and using Promises
    const P = new Promise(function(resolve, reject) {
      // Clone the repo. NEEDS TO BE QUIET. Took 3 hours to realise this. 
      // Otherwise the stdout screws up
      console.log("Clone part");
      exec('git clone -q https://github.com/sakshamsaxena/p5.js-release.git bower-repo', function(err, stdout, stderr) {
        if (err)
          throw new Error(err);
        if (stderr)
          throw new Error(stderr);
        resolve();
      })
    });

    P.then(function(resolve, reject) {
      // Copy the lib to bower-repo. 
      // NOTE : Uses "cp" of UNIX. Make sure it is unaliased in your .bashrc,
      // otherwise it may prompt always for overwrite (not desirable)
      console.log("Copy part");
      return new Promise(function(resolve, reject) {
        exec('cp lib/*.js lib/addons bower-repo/lib -r', function(err, stdout, stderr) {
          if (err)
            reject(err);
          if (stderr)
            reject(stderr);
          resolve();
        })
      })
    }).then(function(resolve, reject) {
      // Git add, commit, push
      console.log("Add, commit, push");
      return new Promise(function(resolve, reject) {
        exec('git add --all && git commit -am "' + version + '" && git push', { cwd: './bower-repo' }, function(err, stdout, stderr) {
          if (err)
            reject(err);
          if (stderr)
            reject(stderr);
          resolve();
          done()
        })
      })
    }).catch(function(err) {
      console.error(err);
    })
  })
}
