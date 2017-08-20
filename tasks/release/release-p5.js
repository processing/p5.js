/* Grunt Task to create and publish a p5.js release */

module.exports = function(grunt) {

  // Options for this custom task
  var opts = {
    'releaseIt': {
      'options': {
        'non-interactive': true,
        'dry-run': true,// set to false later
        'pkgFiles': ['package.json'],
        'increment': '',
        'buildCommand': 'grunt yui && grunt build',
        'changelogCommand': 'git log --pretty=format:"* %s (%h)" [REV_RANGE]',
        'src': {
          'commitMessage': 'Release v%s',
          'tagName': '%s',
          'tagAnnotation': 'Release v%s',
          'pushRepo': 'origin easing-up-the-release-process' //change this to master before PR
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
          { cwd: 'dist/', src: ['**/*'], expand: true }
        ]
      }
    }
  };

  // Register the Release Task
  grunt.registerTask('release-p5', 'Drafts and Publishes a fresh release of p5.js', function(args) {

    // 0. Setup Config
    // Default increment is minor (x.y.z+1)
    opts.releaseIt.options.increment = args;
    grunt.config.set('release-it', opts.releaseIt);
    grunt.config.set('compress', opts.compress);

    // 1. Test Suite
    grunt.task.run('test');

    // 2. Version Bump, Build Library, Docs, Create Commit and Tag, Push to p5.js repo, release on NPM.
    grunt.task.run('release-it');

    // 3. Copy the library files and example to a new folder 'dist'
    grunt.task.run('copy');

    // 5. Zip the 'dist' folder
    /* p5.zip File List
    p5.js
    p5.min.js
    p5.dom.js
    p5.dom.min.js
    p5.sound.js
    p5.sound.min.js
    empty-example/index.html
    empty-example/sketch.js
    */
    grunt.task.run('compress');

  });
};