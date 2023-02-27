// This file holds the "release" task. It spawns the menu in terminal to initiate the release process.
// The release process includes:
// 1. Creating the release archive (p5.js, p5.min.js, p5.sound.js, p5.sound.min.js, and p5.zip).
// 2. Releasing to Bower via https://github.com/processing/p5.js-release (release-bower)

const open = require('open');
const spawn = require('child_process').spawnSync;
const simpleGit = require('simple-git');

module.exports = function(grunt) {
  // Register the Release Task
  grunt.registerTask(
    'release-p5',
    'Drafts and Publishes a fresh release of p5.js',
    async function(args) {
      const done = this.async();

      // Check we are currently on the 'main' branch, refuse to continue
      // if not and preview is not true.
      // This section should be removed once support for 'main' branch
      // is added to np
      const git = simpleGit();
      const branches = await git.branchLocal();
      if (branches.current !== 'main' && !grunt.option('preview')) {
        console.log('Not on "main" branch, refusing to deploy.');
        console.log('Preview the release step with the "--preview" flag.');
        done();
        return;
      }

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
        grunt.option('bowerReleaser') || 'processing'
      );

      // 1. Zip the lib folder
      grunt.task.run('clean');
      grunt.task.run('compress');
      grunt.task.run('copy:release');

      // Open the folder of files to be uploaded for the release on github
      open('release/');

      // 2. Push the new lib files to the bower-repo
      grunt.task.run('release-bower');

      done();
    }
  );
};
