# Release process

## Approach
* While we are below p5.js 1.0.0, we will follow this [versioning pattern](https://semver.org/): `0:MAJOR_or_MINOR:PATCH`. Once we reach 1.0.0, we will follow this versioning pattern: `MAJOR:MINOR:PATCH`.


## Requirements
* Logged in NPM CLI : Check if you are logged in by `npm whoami`
* High Bandwidth : Lots of things to download/pull/push (~190 MB total I presume)
* An environment variable named __GITHUB_TOKEN__ with the value of your Access Token : Make one by going [here](https://github.com/settings/tokens). Once you have it, in your shell, run `export GITHUB_TOKEN=<your token here>`.

## Usage
`grunt release-p5:VALID_SEMVER`
* For example: `grunt release-p5:0.5.14`.
* Note this may require you to enter username/password while pushing/pulling to repos

## What's actually happening
A Grunt Task uses sub tasks to draft and cut a release end-to-end :
* Run the Test Suite : It's basically the `grunt test` task invoked as is.
* Run the [Release-It](https://github.com/webpro/grunt-release-it) Task
    * Version Increment (__is provided as an argument__)
    * Building Library and Docs : This is run as `grunt build && grunt yui`
    * Committing and Tagging 
    * Pushing 
    * Release on NPM : __Only__ the files mentioned in `files` in `package.json` are published.
* Push the newly built library to [p5.js-release](https://github.com/lmccart/p5.js-release) repo for Bower
* Push the newly built reference to [p5.js-website](https://github.com/processing/p5.js-website)
* Create a Zip file `p5.zip` of `lib` folder (now includes the empty example), which would be used in the GitHub Release
* Create a release with the latest tag (__no changelog for now__) as a "Draft" on GitHub.
* Upload the Library files and the ZIP file to the GitHub Release.

## Testing
Now you can simply edit up a few config vars with your own creds to point the releases at them instead of processing. 

In [tasks/release/release-p5.js](https://github.com/processing/p5.js/blob/master/tasks/release/release-p5.js),
* Update L#60 till L#62 to mention your forks instead of this upstream.
* Uncomment L#55 to set dry run as true for testing.
