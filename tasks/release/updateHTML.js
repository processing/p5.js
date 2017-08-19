/* Grunt Task to create Example HTML */

module.exports = function(grunt) {

  var opts = {
    'tagData': {
      'data': {
        'version': ''
      }
    }
  };

  // Register the Task
  grunt.registerTask('updateHTML', 'FOO', function() {

    var done = this.async();
    // Get the tag name
    grunt.util.spawn({
      cmd: 'git',
      args: ['describe', '--abbrev=0', '--tags']
    }, function(err, tag, stderr) {
      var latestTag = String(tag);
      opts.tagData.data.version = latestTag;

      // Make the HTML with correct tag
      var rawHTML = grunt.file.read('dist/empty-example/index.html');
      var html = grunt.template.process(rawHTML, opts.tagData);
      grunt.file.write('dist/empty-example/index.html', html);
      console.log(html);
      done();
    });
  });
};