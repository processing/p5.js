// This file holds the "release" task. It spawns the menu in terminal to initiate the release process.
// The release process includes:
// 1. Creating the release archive (p5.js, p5.min.js, p5.sound.js, p5.sound.min.js, and p5.zip).
// 2. Releasing to Bower via https://github.com/processing/p5.js-release (release-bower)
// 3. Releasing the reference on the website via https://github.com/processing/p5.js-website (release-docs)

const open = require('open');
const spawn = require('child_process').spawnSync;
const simpleGit = require('simple-git/promise');

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
        'npx np --no-2fa',
        grunt.option('preview')
          ? ['--any-branch', '--preview']
          : ['--any-branch'],
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

      done();
    }
  );
};
