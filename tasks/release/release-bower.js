/* Grunt Task to Release the Library files on dist repo for Bower */

const git = require('simple-git/promise');

module.exports = function(grunt) {
  grunt.registerTask(
    'release-bower',
    'Publishes the new release of p5.js on Bower',
    async function() {
      // Async Task
      const done = this.async();

      // Keep the release-party ready
      const releaseParty = grunt.config.get('bowerReleaser');

      // Avoiding Callback Hell and using async/await
      try {
        console.log('Cloning the Release repo ...');
        await git().clone(
          `https://github.com/${releaseParty}/p5.js-release.git`,
          'bower-repo'
        );

        // Copy the lib to bower-repo.
        console.log('Copying new files ...');
        grunt.task.run('copy:bower');

        if (!grunt.option('preview')) {
          grunt.task.run('bower-push');
        } else {
          console.log('Preview: skipping push to Bower repository');
        }

        done();
      } catch (err) {
        console.log('Failed to Release on Bower!');
        console.error(err);
      }
    }
  );

  grunt.registerTask('bower-push', async function() {
    const done = this.async();

    const version = require('../../package.json').version;

    try {
      // Git add, commit, push
      console.log('Pushing out changes ...');
      await git('bower-repo').add('.');
      await git('bower-repo').commit(version);
      await git('bower-repo').push('origin', 'master');

      console.log('Released on Bower!');
      done();
    } catch (err) {
      console.log('Failed to Release on Bower!');
      console.error(err);
    }
  });
};
