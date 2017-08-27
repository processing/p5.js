/* Grunt Task to create and publish a p5.js release */

module.exports = function(grunt) {

  // Options for this custom task
  var opts = {
    'releaseIt': {
      'options': {
        'non-interactive': true,
        'dry-run': false,
        'pkgFiles': ['package.json'],
        'increment': '',
        'buildCommand': 'grunt yui && grunt build',
        'changelogCommand': 'git log --pretty=format:"* %s (%h)" [REV_RANGE]',
        'src': {
          'commitMessage': 'Release v%s',
          'tagName': '%s',
          'tagAnnotation': 'Release v%s',
          'pushRepo': 'origin master'
        },
        'dist': {
          'repo': false,
          'baseDir': false
        },
        'npm': {
          'publish': true
        }
      }
    },
    'compress': {
      'main': {
        'options': {
          'archive': 'p5.zip'
        },
        'files': [
          { cwd: 'lib/', src: ['**/*'], expand: true }
        ]
      }
    }
  };

  // Register the Release Task
  grunt.registerTask('release-p5', 'Drafts and Publishes a fresh release of p5.js', function(args) {

    // 0. Setup Config
    // Default increment is patch (x.y.z+1)
    opts.releaseIt.options.increment = args;
    grunt.config.set('release-it', opts.releaseIt);
    grunt.config.set('compress', opts.compress);

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
  });
};