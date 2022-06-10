# Wrapping up GSoC 2017 with p5.js (by [@sakshamsaxena](https://github.com/sakshamsaxena))

## Summary

There were 3 major tasks that were proposed to pursue this summer under Google Summer of Code 2017 with p5.js under The Processing Foundation. All these focussed on improving the infrastructure and operations of the library, independent of the library API itself. To better tackle and organise new Issues, an Issue Template was implemented, which saw immense utility for contributors and owners to address new Issues. A new Grunt Task using Browserify was created which takes in the desired components that one wants to utilise as arguments, and built the library consisting of those components only. Dedicated Grunt Tasks were written to automate the release process end-to-end with minimal user interaction. The outcome of these tasks was improved developer operations (via Issue Templates and Release Process Automation), and improved library accessibility (via the Modularisation Task).

## Task Details

### 1. [Adding Issue Templates](https://github.com/processing/p5.js/issues)

Reporting Bugs or Feature Suggestions by the Community through Issues is also a significant contribution to the Project and it catalyses the growth of Project through them. Relevant responses and discussions in context to those, delivered in a short time, further engages the community into the Project. The GitHub Issue Template was [added](https://github.com/processing/p5.js/commits/main/ISSUE_TEMPLATE.md?author=sakshamsaxena) as my first contribution under GSoC on June 12, and till date it has been proven to be extremely helpful to both the reporter as well as responder, meanwhile aligning to it's original aim.

Preview of the complete template : 
![Preview of the complete template](http://www.clipular.com/c/4631172675272704.png?k=gQwp7j5erUp9iZDrZvlEWY-27KY)

Some helpful comments are added alongside to make the experience of reporting an issue significantly lucid to a complete beginner. You can see the same when you [open a new issue](https://github.com/processing/p5.js/issues/new).

### 2. [Generating a custom (modular) build of p5.js](https://github.com/processing/p5.js/blob/main/contributor_docs/custom_p5_build.md)

This task was inspired by [Issue #94](https://github.com/processing/p5.js/issues/94). The goal was to implement such a functionality which enables users to select the desired components/modules which they want to use, and only those components would be bundled then itself to generate a custom build of p5.js.

Currently, the usage is through invoking a Grunt task manually from the command line :
```shell
$ grunt combineModules:module_a[:module_b][:module_c]
```
where `module_X` refers to the name of the _*folder*_ of the desired component, viz. :
```
color
core
events
image
io
utilities
math
typography
```
Core is included by default in all cases. The output bundle is found in `lib/modules` directory.

### 3. Automating the Release Process

A dedicated and detailed Grunt Task was written which handles the release process end to end. It covers Testing, Version Bump, Building Library and Docs, Creating a new Commit and Tag with the bumped package.json, Pushing these changes to GitHub (to this p5.js repo), Release the library files only on NPM, and Bower (by updating the release repo maintained by @lmccart), Updating the docs in the website repo with newly generated ones, Drafting a GitHub Release (on this repo) with the JS files and the Zip as mentioned. 

The owner is required to provide the following beforehand initiating the process :

* Exporting an environment variable (only for the first time) which would hold the [GitHub Access Token](https://github.com/settings/tokens) for publishing a GitHub Release. 
```export GITHUB_TOKEN=<token goes here>```
* Invoking the Grunt Task with the minor/major/patch/tag name as argument. Default is patch.
```grunt release-p5:minor```

Intermediate pulling or pushing is performed over HTTPS, so it might need user input for authentication (username/password).

## Conclusion

New features were implemented in p5.js which would receive user feedback once they're out in the next release. Modularisation (#2 Task) and Automation (#3 Task) are implemented as alpha, and hold immense scope of improvement in terms of functionality, performance, and code. I would love to remain a part of p5.js and would happily contribute and tend to issues related to, and beyond, my work.

## Support

Any questions pertaining to the above mentioned tasks may be addressed via Issues. Simply create a new Issue and either assign or tag me in the conversation with [@sakshamsaxena](https://github.com/sakshamsaxena). For shout-outs and shout-downs, tweet me [@TopGunDoggo](https://twitter.com/TopGunDoggo), or if you're old school like me, email me at [saksham_saxena@outlook.com](mailto:saksham_saxena@outlook.com). 

## Acknowledgements

Thanks to Lauren McCarthy, my mentor, and Adam, Kenneth, dhowe and other contributors of p5.js for showing immense support and encouraging environment which helped me exceed my own expectations! Thank you so much :smile: 