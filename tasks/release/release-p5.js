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

module.exports = function(grunt) {
  // Options for this custom task
  const opts = {
    compress: {
      main: {
        options: {
          archive: 'p5.zip'
        },
        files: [{ cwd: 'lib/', src: ['**/*'], expand: true }]
      }
    }
  };

  // Register the Release Task
  grunt.registerTask(
    'release-p5',
    'Drafts and Publishes a fresh release of p5.js',
    function(args) {
      // 0. Setup Config
      grunt.config.set('compress', opts.compress);
      // Keeping URLs as config vars, so that anyone can change
      // them to add their own, to test if release works or not.
      grunt.config.set('bowerReleaser', 'lmccart');
      grunt.config.set('docsReleaser', 'processing');

      // 1. Test Suite
      // HANDLED BY NP

      // 2. Version Bump, Build Library, Docs, Create Commit and Tag, Push to p5.js repo, release on NPM.
      // HANDLED BY NP

      // 3. Zip the lib folder
      // COULD BE POST BUILD STEP
      grunt.task.run('compress');

      // 4. Push the new lib files to the dist repo (to be referred as bower-repo here)
      // grunt.task.run('release-bower');

      // 5. Push the docs out to the website
      // grunt.task.run('release-docs');

      // 6. Draft a Release for GitHub
      // HANDLED BY NP, excluding assets upload
    }
  );
};
