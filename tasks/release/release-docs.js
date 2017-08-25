/* Grunt Task to  Release the Library files on dist repo for Bower */

// Using native exec instead of Grunt spawn so as to utilise Promises
const exec = require('child_process').exec;

module.exports = function(grunt) {

  grunt.registerTask('release-docs', 'Publishes the new docs of p5.js on the website', function() {

  })
}
