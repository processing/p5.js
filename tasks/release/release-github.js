/* Grunt task to release p5.js on GitHub */

var fs = require('fs');
var req = require('request');

module.exports = function(grunt) {
  grunt.registerTask('release-github', 'Publish a Release on GitHub', function(
    args
  ) {
    // Async Task
    var done = this.async();
    // Keep the release-party ready
    var releaseParty = grunt.config.get('githubReleaser');

    // Prepare the data
    var data = {
      tag_name: '',
      target_commitish: 'master',
      name: '',
      body: '',
      draft: true,
      prerelease: false
    };

    var newTag = require('../../package.json').version;
    data.tag_name = newTag;
    data.name = newTag;

    // Set up vars for requests
    var accessTokenParam = '?access_token=' + process.env.GITHUB_TOKEN;
    var createURL =
      'https://api.github.com/repos/' +
      releaseParty +
      '/p5.js/releases' +
      accessTokenParam;
    var uploadURL =
      'https://uploads.github.com/repos/' + releaseParty + '/p5.js/releases/';
    var ID = '';
    var count = 0;

    var createReleaseData = {
      url: createURL,
      headers: { 'User-Agent': 'Grunt Task' },
      body: JSON.stringify(data)
    };

    var uploadReleaseData = {
      p5js: ['p5.js', './lib/p5.js', 'application/javascript'],
      p5minjs: ['p5.min.js', './lib/p5.min.js', 'application/javascript'],
      p5domjs: [
        'p5.dom.js',
        './lib/addons/p5.dom.js',
        'application/javascript'
      ],
      p5domminjs: [
        'p5.dom.min.js',
        './lib/addons/p5.dom.min.js',
        'application/javascript'
      ],
      p5soundjs: [
        'p5.sound.js',
        './lib/addons/p5.sound.js',
        'application/javascript'
      ],
      p5soundminjs: [
        'p5.sound.min.js',
        './lib/addons/p5.sound.min.js',
        'application/javascript'
      ],
      p5zip: ['p5.zip', './p5.zip', 'application/zip']
    };

    var uploadAsset = function(arr) {
      console.log('Uploading ' + arr[0] + ' ...');
      fs.createReadStream(arr[1]).pipe(
        req.post(
          {
            url:
              uploadURL + ID + '/assets' + accessTokenParam + '&name=' + arr[0],
            headers: {
              'User-Agent': 'Grunt',
              'Content-Type': arr[2],
              'Content-Length': fs.statSync(arr[1]).size
            }
          },
          function(err, resp, body) {
            if (err) {
              throw err;
            }
            console.log('Uploaded ' + arr[0]);
            count++;
            if (count === 7) {
              done();
              console.log('Released on GitHub!\n All done!');
            }
          }
        )
      );
    };

    new Promise(function(resolve, reject) {
      // Create the release
      console.log('Posting Release ...');
      req.post(createReleaseData, function(error, response, body) {
        if (error) {
          reject(error);
        }
        resolve(JSON.parse(body).id);
      });
    })
      .then(function(releaseID) {
        // Upload the Library
        console.log('Uploading Assets ...');
        ID = releaseID;
        // Upload assets
        for (var file in uploadReleaseData) {
          let arr = uploadReleaseData[file];
          uploadAsset(arr);
        }
      })
      .catch(function(err) {
        throw new Error(err);
      });
  });
};
