/* Grunt Task to Release the DOcs on website repo */

const git = require('simple-git/promise');

module.exports = function(grunt) {
  grunt.registerTask(
    'release-docs',
    'Publishes the new docs of p5.js on the website',
    async function() {
      // Async Task
      const done = this.async();

      // Keep the release-party ready
      const releaseParty = grunt.config.get('docsReleaser');

      try {
        // Avoiding Callback Hell and using async/await
        await git().clone(
          `https://github.com/${releaseParty}/p5.js-website.git`,
          'p5-website'
        );

        // Copy the new docs over
        console.log('Copying new docs ...');
        grunt.task.run('copy:docs');

        if (!grunt.option('preview')) {
          grunt.task.run('docs-push');
        } else {
          console.log('Preview: skipping push to website repository');
        }

        done();
      } catch (err) {
        console.log('Failed to release docs!');
        throw new Error(err);
      }
    }
  );

  grunt.registerTask('docs-push', async function() {
    const done = this.async();
    const version = require('../../package.json').version;

    try {
      // Add, Commit, Push
      console.log('Pushing to GitHub ...');
      await git('p5-website').add('.');
      await git('p5-website').commit(version);
      await git('p5-website').push('origin', 'master');

      console.log('Released Docs on Website!');
      done();
    } catch (err) {
      console.log('Failed to release docs!');
      throw new Error(err);
    }
  });
};
