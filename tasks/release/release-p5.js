/* Grunt Task to create and publish a p5.js release */

const spawn = require('child_process').execSync;

module.exports = function(grunt) {

  // Options for this custom task
  var opts = {
    'releaseIt': {
      'options': {
        'non-interactive': true,
        'dry-run': true,
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
    tagData: {
      data: {
        tagName: ''
      }
    }
  };

  // Register the Release Task
  grunt.registerTask('release-p5', 'Drafts and Publishes a fresh release of p5.js', function(args) {

    // var done = this.async();
    // 1. Test Suite
    // grunt.task.run('test');

    // 2. Version Bump, Build Library, Docs, Create Commit and Tag, and push those to p5.js repo. Release the same on NPM
    opts.releaseIt.options.increment = args;
    grunt.config.set('release-it', opts.releaseIt);
    // grunt.task.run('release-it');

    // 3. Create and zip the lib
    // Get the tag name
    var latestTag = spawn('git describe --abbrev=0 --tags', { encoding: 'utf8' });
    latestTag = latestTag.substr(0, latestTag.length-1);
    opts.tagData.data.tagName = latestTag;

    // Make the HTML with correct tag
    var rawHTML = grunt.file.read('lib/empty-example/index.html');
    var html = grunt.template.process(rawHTML, opts.tagData);
    grunt.file.write('lib/empty-example/index.html', html);

    // Ready to Zip

  });
};
