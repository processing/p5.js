/* Grunt Task to create and publish a p5.js release */

module.exports = function (grunt) {

	// Options for this custom task
	var opts = {
		"release-it" :{},
		"deploy-docs":{},
		"deploy-lib" :{},
		"release-gh" :{}
	}
	
	// Register the Release Task
	grunt.registerTask('release-p5', 'Drafts and Publishes a fresh release of p5.js', function(args) {
		
	})
}