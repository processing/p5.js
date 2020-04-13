// Grunt Task to create release archive. Also handles releasing
// for Bower and release of reference on the website.

const open = require('open');
const spawn = require('child_process').spawnSync;

module.exports = function(grunt) {
  // Register the Release Task
  grunt.registerTask(
    'release-p5',
    'Drafts and Publishes a fresh release of p5.js',
    function(args) {
      spawn(
        'npx np',
        grunt.option('preview') ? ['--any-branch', '--preview'] : [],
        {
          stdio: 'inherit',
          shell: true
        }
      );

      // 0. Setup Config
      // Keeping URLs as config vars, so that anyone can change
      // them to add their own, to test if release works or not.
      grunt.config.set(
        'bowerReleaser',
        grunt.option('bowerReleaser') || 'lmccart'
      );
      grunt.config.set(
        'docsReleaser',
        grunt.option('docsReleaser') || 'processing'
      );

      // 1. Zip the lib folder
      grunt.task.run('clean');
      grunt.task.run('compress');
      grunt.task.run('copy:release');

      // Open the folder of files to be uploaded for the release on github
      open('release/');

      // 2. Push the new lib files to the dist repo (to be referred as bower-repo here)
      grunt.task.run('release-bower');

      // 3. Push the docs out to the website
      grunt.task.run('yui');
      grunt.task.run('release-docs');
    }
  );
};
