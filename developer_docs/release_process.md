# Release process

## Approach
* While we are below p5.js 1.0.0, we will follow this [versioning pattern](https://semver.org/): `0:MAJOR_or_MINOR:PATCH`. Once we reach 1.0.0, we will follow this versioning pattern: `MAJOR:MINOR:PATCH`.


## Requirements
* Operating System: macOS, Linux or Unix. _(For Windows see at the end of this document)_
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
Now you can simply edit up a few configuration variables with your own credentials to point the releases at them, instead of processing.

In [tasks/release/release-p5.js](https://github.com/processing/p5.js/blob/master/tasks/release/release-p5.js),
* Update [Line #60](https://github.com/processing/p5.js/blob/master/tasks/release/release-p5.js#L60) till [Line #62](https://github.com/processing/p5.js/blob/master/tasks/release/release-p5.js#L62) to mention your forks instead of this upstream.
* Uncomment [Line #55](https://github.com/processing/p5.js/blob/master/tasks/release/release-p5.js#L55) to set dry run as true for testing.

## Note for Windows users
The release process contains many shell commands that may not run or work expectedly on Windows environment. It is recommended to have linux/unix environment running, however you can use [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) which works on Windows 10 Anniversary update onwards (only 64-bit). If you are on Lower version of Windows you can use [Cygwin](https://www.cygwin.com/) or use [Virtual Box](https://www.virtualbox.org/) (or any other preferred virtualization tool) to run Linux.
