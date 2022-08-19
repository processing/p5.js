# Steward Guidelines
Whether you have just joined us as a steward, a seasoned maintainer of p5.js, or anywhere in between, this guide contains many of the information as well as tips and tricks that will help you and all the other contributors effectively contribute to p5.js. Most of what is written here are guidelines unless otherwise stated which means you can adapt the practices shown here to suit your workflow.

# Table of Contents
- [Issues](#issues)
	- [Bug report](#bug-report)
	- [Feature request](#feature-request)
	- [Feature enhancement](#feature-enchancement)
	- [Discussion](#discussion)
- [Pull Requests](#pull-requests)
	- [Simple fix](#simple-fix)
	- [Bug fix](#bug-fix)
	- [New feature/feature enchancement](#new-feature-feature-enchancement)
	- [Dependabot](#dependabot)
- [Build Process](#build-process)
- [Release Process](#release-process)
- [Tips & Tricks](#tips-tricks)

---

# Issues
We encourage most source code contributions to start with an issue and as such issues are the place where most of the discussions will take place. The steps you can take when reviewing an issue will depend on what kind of issue it is. The repo uses [Github issue templates](./.github/ISSUE_TEMPLATE) in order to better organize different kinds of issues and encourage issue author to provide all relevant information about their problem. The first step in reviewing the issue will often be looking through the filled out template and determine if you need additional information (either because some fields weren't filled in or the incorrect template was used).

## Bug report
For bug report issues, they should be using the "Found a bug" issue template.

1. Replicate bug
	- The goal of the template is to provide enough information for a reviewer to attempt to replicate the bug in question.
	- If the reported bug is not relevant to the repo it is opened in (p5.js or p5.js-website).
		- Transfer the issue to the relevant repo if you have access to them.
		- Otherwise leave a comment about where the bug report should be filed (with direct link provided) and close the issue.
	- The first step to review a bug report is to see if enough information is provided for a bug replication and if so, attempt to replicate the bug as described.
2. If the bug can be replicated
	- Some discussions may be required to determine the best way to fix a particular bug. Sometimes these may be straightforward, sometimes they can be tricky. Please refer to [p5.js' design principles](./design_principles.md) when making this decision on a case by case basis.
	- If the issue author indicated in the issue they are willing to contribute a fix.
		- Approve the issue for fixing by the issue author by leaving a comment and assigning them to the issue (by using the cog button on the right side next to "Assignee").
	- If the issue author does not wish to contribute a fix.
		- Leave a comment recognizing the bug is replicable.
		- Attempt to fix yourself or add the `help wanted` label to signal an issue needing a fix.
3. If the bug cannot be replicated
	- Ask for additional info if not already provided in the template (p5.js version, browser version, OS version, etc can all be useful).
	- If your testing environment differs from what is reported in the issue (different browser or OS).
		- Leave a comment saying you are not able to replicate in your specific environment.
		- Add a `help wanted` label to the issue and ask for someone else with the setup specified in the issue to try and replicate the bug.
	- Sometimes bug can occur only when using the web editor and not when testing locally, in this case the issue should be redirected to the [web editor repo](https://github.com/processing/p5.js-web-editor).
	- If a replication is possible later, go back to step 2.
4. If the bug stems from the provided example code and not p5.js' behaviour
	- Determine if p5.js' documentation, code implementation, or friendly error system can be improved in order to prevent the same mistake being made.
	- Kindly redirect any further questions to the [forum](https://discourse.processing.org/) and close the issue if no further changes are to be made to p5.js.

## Feature request
For feature request issues, they should be using the "New Feature Request" issue template.

1. As part of p5.js' commitment to increase access, all feature request must make the case for how it increases access of p5.js to communities that are historically marginalized in the field. More details are available [here](./access.md).
	- If a feature request does not have the "Increasing Access" field sufficiently filled out, the issue author can be asked for how the feature increases access.
	- The access statement of a feature can be provided by a different member of the community including the issue reviewer themselves.
2. The proposed new feature request can be assessed for inclusion based on the following criteria.
	- Does it fit into the project scope and [design principles](./design_principles.md) of p5.js?
		- A request to add a new drawing primitive shape may be considered, but a request to adopt a browser based IOT protocol will likely be out of scope.
		- Overall the scope of p5.js should be relatively narrow in order to avoid excessive bloat from rarely used features.
		- If a feature does not fit into the scope of p5.js, said feature can be implemented as an addon library by the issue author or a different member of the community.
	- Is it likely to be considered a breaking change?
		- Will it conflict with existing p5.js functions and variables?
		- Will it conflict with typical sketches already written for p5.js?
		- Features that are likely to break the above should be considered breaking changes and without a major version release, we should not make breaking changes to p5.js.
	- Can the proposed new feature be achieved using existing functionalities already in p5.js, relatively simple native Javascript code, or existing easy to use libraries?
		- Eg. instead of prividing a p5.js function to join an array of strings such as `join(["Hello", "world!"])`, the native Javascript `["Hello", "world!"].join()` should be preferred instead.
3. Provided the access requirement and other considerations have been fulfilled, at least two stewards or maintainers must approve the new feature request before work should begin towards a PR. The PR review process for new features is documented below.

## Feature enchancement
For feature enchancement issues, they should be using the "Existing Feature Enhancement" issue template. The process here very similar to new feature request. The difference between new feature request and feature enchancement can be blurred however feature enchancement mainly deals with existing functions of p5.js while new feature request could be requesting entirely new functions to be added.

1. Similar to new feature request, feature enchancement should only be accepted if they increases access of p5.js. Please see point 1 of [section above](#feature-request)
2. Inclusion criterias for feature enchancement are similar to those for feature request above but particular attention should be paid to potential breaking changes.
	- If modifying existing functions, all previous valid and documented function signatures must behave in the same way.
3. Feature enchancements must be approved by at least one steward or maintainer before work should begin towards a PR. The PR review process for feature enchancement is documented below.

## Discussion
This type of issue has a minimal template ("Discussion") and should be use only if a particular discussion doesn't fall under the other three existing templates or be better suited to the forum or Discord.

- If an issue is opened as a discussion but should be, for example, a bug report, the correct labeled should be applied and the "discussion" label removed. Additional info about the bug should also be requested from the author if not already included (following [Bug report](#bug-report)) above.
- If an issue is opened as a discussion but isn't relevant to source code contribution or otherwise relevant to the Github repositories/contribution process/contribution community (eg. a discussion about the best kind of projector to use for an exhibition showing sketches done with p5.js), they should be redirected to the forum or Discord and the issue closed.
- If relevant, additional labels should be added to discussion issues to further signal what type of discussion it is at a glance.

---

# Pull Requests
Almost all code contribution to the p5.js repositories happens through pull requests, stewards and maintainers may have push access to the repositories but are still encouraged to follow the same issue > PR > review process when contributing code. Following are some steps that can be taken when reviewing a PR.

- Pull request template can be found [here](../.github/PULL_REQUEST_TEMPLATE.md).
- Almost all pull requests must have associated issues opened and discussed first, meaning the relevant [issue workflow](#issues) must have been followed first before a PR should be reviewed by any steward or maintainer.
	- The only instance where this does not apply are very minor typo fixes, which does not require an opened issue and can be merged by anyone with merge access to the repo, even if they are not stewards of a particular area.
	- While this exception exist, we will apply it in practice only but contributors are usually encouraged to open new issues. In other words, if in doubt about whether this exception applies, just open an issue anyway.
- If a pull request does not fully solve the referenced issue, you can edit the original post and change "Resovles #OOOO" to "Addresses #OOOO" so that it does not automatically close the original issue when this PR is merged.

## Simple fix
Simple fix such as small typo fix can be merged directly by anyone with merge access with a quick check on the PR "Files Changed" tab and that automated CI test passes.

## Bug fix
1. Bug fixes should be reviewed by the relevant area steward, ideally the same one that approved the referenced issue for fixing.
2. The PR "Files Changed" tab can be used to initially review whether the fix is as described in the discussion in the issue.
3. The PR should be tested locally whenever possible and relevant. The Github CLI can be helpful in streamlining some of the process. (See more below in [Tips & Tricks](#tips-tricks)).
	- The fix should address the original issue sufficiently
	- The fix should not change any existing behaviours unless agreed upon in the original issue
	- The fix should not have significant performance impact on p5.js
	- The fix should not have any impact on p5.js' accessibility
	- The fix should use modern standard of Javascript coding
	- The fix should pass all automated tests and include new tests if relevant
4. If any additional changes are required, line comments should be added to the relevant lines as described [here](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/commenting-on-a-pull-request#adding-line-comments-to-a-pull-request)
	- A suggestion block can also be used to suggest specific changes
	- If there are multiple changes that are required, instead of adding single line comments many times, follow the procedure documented [here](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request) to make multiple line comments and single request for changes
	- If line comments are just for clarification or discussion and not changes are requested yet, in the previous step instead of choosing "Request changes", choose "Comment" instead.
5. Once the PR has been reviewed and no additional changes are required, a steward and mark the PR as "Approved" by choosing the "Approve" option in the previous step (instead of "Comment" or "Request changes") with or without additional comments. The steward can then either request additional review by another steward or maintainer if desired, or merge the PR if they have merge access or a maintainer will merge the approved PR.
6. @all-contributors bot should be called to add any new contributors to the list of contributors in the README.md file.
```
@all-contributors please add @[github handle] for [contribution type]
```

## New feature/feature enchancement
The process for new feature or feature enhancement PR is similar to bug fixes with just one notable difference.

- A new feature/feature enchancement PR must be reviewed and approved by at least two stewards or maintainer before it can be merged.
	- This can be the same two stewards or maintainer that approved the original issue or not.

## Dependabot
Dependabot PRs are usually only visible to repo admins so if this does not apply to you, please skip this section.

- Dependabot PR can be merged directly if the version update is a semver patch version as long as automated CI test passes.
- Dependabot PR with semver minor version changes can usually be merged directly as long as automated CI test passes, but a quick check on the changelog of the updated dependency is recommended.
- Dependabot PR with semver major version changes may likely affect either the build process or p5.js functionalities. The reviewer in this case is encouraged to review the changelog from current version to target version if possible and test the PR locally to ensure all processes are functioning and make any required changes due to potential breaking changes in the dependencies.
	- Many dependencies bump major version number only because they drop official support for very old versions of node.js, which means in many cases, major version change don't necessary mean breaking changes resulting from dependency API changes.

---

# Build process

---

# Release process

---

# Tips & tricks