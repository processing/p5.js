/* Grunt Task to create and publish a p5.js release */
/*
MUST HAVES BEFOREHAND :
* Logged in NPM CLI : Check if you are logged in by "npm whoami"
* High Bandwidth : Lots of things to download and pull and push (~190 MB)
* An environment variable named GITHUB_TOKEN with the value of your Access Token : Make one by going to your Settings->Personal Access Tokens-> New Token. Once you have it, in your shell, run "export GITHUB_TOKEN=<your token here>".
*/

module.exports = function(grunt) {
  // Options for this custom task
  var opts = {
    releaseIt: {
      options: {
        'non-interactive': true,
        'dry-run': false,
        pkgFiles: ['package.json'],
        increment: '',
        buildCommand: 'grunt yui && grunt build',
        changelogCommand: 'git log --pretty=format:"* %s (%h)" [REV_RANGE]',
        src: {
          commitMessage: 'Release v%s',
          tagName: '%s',
          tagAnnotation: 'Release v%s',
          pushRepo: 'origin master'
        },
        dist: {
          repo: false,
          baseDir: false
        },
        npm: {
          publish: true
        }
      }
    },
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

      // Default increment is patch (x.y.z+1)
      opts.releaseIt.options.increment = args;
      // Uncomment to set dry run as true for testing
      // opts.releaseIt.options['dry-run'] = true;
      grunt.config.set('release-it', opts.releaseIt);
      grunt.config.set('compress', opts.compress);
      // Keeping URLs as config vars, so that anyone can change
      // them to add their own, to test if release works or not.
      grunt.config.set('bowerReleaser', 'lmccart');
      grunt.config.set('docsReleaser', 'processing');
      grunt.config.set('githubReleaser', 'processing');

      // 1. Test Suite
      grunt.task.run('test');

      // 2. Version Bump, Build Library, Docs, Create Commit and Tag, Push to p5.js repo, release on NPM.
      grunt.task.run('release-it');

      // 3. Push the new lib files to the dist repo (to be referred as bower-repo here)
      grunt.task.run('release-bower');

      // 4. Push the docs out to the website
      grunt.task.run('release-docs');

      // 5. Zip the lib folder
      grunt.task.run('compress');

      // 6. Draft a Release for GitHub
      grunt.task.run('release-github');
    }
  );
};
