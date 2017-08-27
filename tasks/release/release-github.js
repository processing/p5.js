/* Grunt task to release p5.js on GitHub */

const fs = require('fs');
const req = require('request');

module.exports = function(grunt) {
	grunt.registerTask('release-github', 'Publish a Release on GitHub', function(args) {

		// Async Task
		var done = this.async();

		// Prepare the data
		var data = {
			"tag_name": "",
			"target_commitish": "master",
			"name": "",
			"body": "",
			"draft": true,
			"prerelease": false
		};

		var newTag = require('../../package.json').version;
		data.tag_name = newTag;
		data.name = newTag;

		// Set up vars for requests
		const createURL = 'https://api.github.com/repos/sakshamsaxena/p5.js/releases' + accessTokenParam;
		const uploadURL = 'https://uploads.github.com/repos/sakshamsaxena/p5.js/releases/';
		const accessTokenParam = '?access_token=' + process.env.GITHUB_TOKEN;
		var releaseID = '';

		var createReleaseData = {
			url: createURL,
			headers: { 'User-Agent': 'Grunt Task' },
			body: JSON.stringify(data)
		}

		new Promise(function(resolve, reject) {
			// Create the release
			req.post(createReleaseData, function(error, response, body) {
				if (error)
					reject(error);
				// Got the release ID
				releaseID = JSON.parse(body).id;
				resolve();
			})
		}).then(function() {
			// Upload assets
			req.post({
				url: uploadURL + releaseID + '/assets' + accessTokenParam + '&name=p5.dom.js',
				headers: { 
					'User-Agent': 'Grunt', 
					'Content-Type': 'application/javascript', 
					'Content-Length': fs.statSync('./lib/addons/p5.dom.js').size 
				},
				body: fs.createReadStream('./lib/addons/p5.dom.js')
			}, function(err, resp, body) {
				if (err)
					throw err;
				console.log(JSON.parse(body));
				done();
			});
		});
	});
};