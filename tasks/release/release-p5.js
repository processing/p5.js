/* Grunt Task to create and publish a p5.js release */
/*
MUST HAVES BEFOREHAND :
* Logged in NPM CLI : Check if you are logged in by "npm whoami"
* High Bandwidth : Lots of things to download and pull and push (~190 MB)
* An environment variable named GITHUB_TOKEN with the value of your Access Token : Make one by going to your Settings->Personal Access Tokens-> New Token. Once you have it, in your shell, run "export GITHUB_TOKEN=<your token here>".
*
* Run with 'grunt release-p5:[increment]' where '[increment]' can be 'patch',
* 'minor', or 'major', corresponding to semver.
*/

const open = require('open');

module.exports = function(grunt) {
  // Options for this custom task
  const opts = {
    clean: ['release/'],
    compress: {
      main: {
        options: {
          archive: 'release/p5.zip'
        },
        files: [{ cwd: 'lib/', src: ['**/*'], expand: true }]
      }
    },
    copy: {
      main: {
        expand: true,
        src: [
          'lib/p5.js',
          'lib/p5.min.js',
          'lib/addons/p5.sound.js',
          'lib/addons/p5.sound.min.js'
        ],
        dest: 'release/',
        flatten: true
      }
    }
  };

  // Register the Release Task
  grunt.registerTask(
    'release-p5',
    'Drafts and Publishes a fresh release of p5.js',
    function(args) {
      // 0. Setup Config
      grunt.config.set('clean', opts.clean);
      grunt.config.set('compress', opts.compress);
      grunt.config.set('copy', opts.copy);
      // Keeping URLs as config vars, so that anyone can change
      // them to add their own, to test if release works or not.
      grunt.config.set('bowerReleaser', 'lmccart');
      grunt.config.set('docsReleaser', 'processing');

      // 1. Zip the lib folder
      // COULD BE POST BUILD STEP
      grunt.task.run('clean');
      grunt.task.run('compress');
      grunt.task.run('copy');

      // Open the folder of files to be uploaded for the release on github
      open('release/');

      // 2. Push the new lib files to the dist repo (to be referred as bower-repo here)
      // grunt.task.run('release-bower');

      // 3. Push the docs out to the website
      // grunt.task.run('release-docs');
    }
  );
};
