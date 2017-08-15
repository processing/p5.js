/* Grunt Task to create and publish a p5.js release */

module.exports = function(grunt) {

  // Options for this custom task
  var opts = {
    'releaseIt': {
      'options': {
        'non-interactive': true,
        'verbose': true,
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
        	'repo': false
        },
        'npm': {
          'publish': false,
          'publishPath': 'lib/'
        }
      }
    },
    'deployDoc': {},
    'deployLib': {},
    'releaseGH': {}
  };

  // Register the Release Task
  grunt.registerTask('release-p5', 'Drafts and Publishes a fresh release of p5.js', function(args) {

    // 1. Test Suite
    // grunt.task.run('test');

    // 2. Release-it
    opts.releaseIt.options.increment = args;
    grunt.config.set('release-it', opts.releaseIt);
    grunt.task.run('release-it');
  });
};
