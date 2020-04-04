# Release process

## Approach
* We follow the [semver](https://semver.org/) versioning pattern, which means we follow this versioning pattern: `MAJOR:MINOR:PATCH`.


## Requirements
* Git, node.js (v10+) and NPM installed on your system
* Logged in NPM CLI : Check if you are logged in by `npm whoami`
* High Bandwidth : Lots of things to download/pull/push (\~190 MB total I presume)

## Usage
```
npm run release
```

* This will run the build steps and you should follow the prompt provided by `np` to finish the process.
* The build step then proceed to the grunt task of creating a zip version of the library as well as releasing on bower and releasing the reference on the website.

## What's actually happening
* `npm run release` is an alias of `grunt release-p5` which will first spawn a child process running [`np`](https://www.npmjs.com/package/np).
* `np` will start by checking your local repository and settings are ready for you to create a release. You will need to have no uncommitted changes in the local repository in order to continue.
* `np` will then reinstall `node_modules` then run tests with `npm test`.
* `np` will bump the version according to what was selected at the beginning.
* If any step prior to this failed, the repo will be reverted to its initial state before running `npm run release`.
* The NPM package is published.
	* Release on NPM : __Only__ the files mentioned in `files` in `package.json` are published.
* Tags and local commits are pushed to the git remote.
* A draft release is created on github.com with changelogs that can be edited.
* Create a Zip file `p5.zip` of `lib` folder (now includes the empty example), which should be uploaded in the GitHub Release draft created above.
	* After this process completes a window pointing at `release/` will open and it will contain all the files that should be uploaded as part of the Github Release.
* Push the newly built library to [p5.js-release](https://github.com/lmccart/p5.js-release) repo for Bower.
* Building the Docs: This is run as `grunt yui`
* Push the newly built reference to [p5.js-website](https://github.com/processing/p5.js-website)

## Testing
In the case where you have push access to the repositories:
* You can run `npm run release -- --preview` to do a dry run of the release process. No git tracked files will be changed by running this step and no push will be made to any of the remotes.

In the case where you don't have push access to the repositories:
* You will need to edit the `name` field of `package.json` to a namespaced version, eg. `@username/p5` and commit this change into git before running `npm run release -- --preview` as usual. When prompted just choose not to publish the package to the namespaced packaged on NPM, nothing will be published online.
* You can do a full test run of the release with `npm run release` provided you have edited the `name` field of `package.json`. To choose where to clone and push the Bower release and website repositories from, you can set them by specifiying additional arguments like so: `npm run release -- --bowerReleaser=username --docsReleaser=username`.

__NOTE:__ `np` (`6.2.0`) currently has a [bug](https://github.com/sindresorhus/np/issues/508) that prevents release to namespaced package name, you can revert to `5.2.1` if you must test this otherwise it will fail at the publish step.