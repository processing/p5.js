# Release process

## Approach
* We follow the [semver](https://semver.org/) versioning pattern, which means we follow this versioning pattern: `MAJOR:MINOR:PATCH`.


## Requirements
* Operating System: macOS, Linux or Unix. _(For Windows see at the end of this document)_
* Logged in NPM CLI : Check if you are logged in by `npm whoami`
* High Bandwidth : Lots of things to download/pull/push (\~190 MB total I presume)

## Usage
```
npm run release
```

* This will run `np` and you should follow the prompt provided by `np` to finish the process.
* A npm post hook for `npm run postrelease` is also defined which will run the grunt task of creating a zip version of the library as well as releasing on bower and releasing the reference.

## What's actually happening
* `npm run release` is an alias of `np` though `np` should not be run directly in this case, always use `npm run release`.
* `np` will start by checking your local repository and settings are ready for you to create a release.
* `np` will then reinstall `node_modules` then run tests with `npm test`.
* `np` will bump the version according to what was selected at the beginning.
* If any step prior to this failed, the repo will be reverted to its initial state before running `npm run release`.
* The NPM package is published.
	* Release on NPM : __Only__ the files mentioned in `files` in `package.json` are published.
* Tags and local commits are pushed to the git remote.
* A draft release is created on github.com with changelogs that can be edited.

At this point, `np` jobs is done. However the release will continue on the next step `npm run postrelease` automatically.
* Create a Zip file `p5.zip` of `lib` folder (now includes the empty example), which should be uploaded in the GitHub Release draft created above.
	* After this process completes a window pointing at `release/` will open and it will contain all the files that should be uploaded as part of the Github Release.
* Push the newly built library to [p5.js-release](https://github.com/lmccart/p5.js-release) repo for Bower
* Building the Docs : This is run as `grunt yui`
* Push the newly built reference to [p5.js-website](https://github.com/processing/p5.js-website)

## Testing
In the case where you have push access to the repositories:
* You can run `npx np --preview` to do a dry run of the release process. No files will be changed by running this step.
* You can also run `npm run release -- --preview` but note that the `postrelease` step will still be run meaning the bower release and docs release steps are still run which isn't usually desired.

In the case where you don't have push access to the repositories:
* TODO: Testing in this case is not fully supported yet.

## Note for Windows users
The release process contains many shell commands that may not run or work expectedly on Windows environment. It is recommended to have linux/unix environment running, however you can use [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) which works on Windows 10 Anniversary update onwards (only 64-bit). If you are on Lower version of Windows you can use [Cygwin](https://www.cygwin.com/) or use [Virtual Box](https://www.virtualbox.org/) (or any other preferred virtualization tool) to run Linux.
