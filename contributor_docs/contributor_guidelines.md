# Contributor Guidelines
Welcome to the contributor guidelines! This document is for new contributors looking to contribute code to p5.js, contributors looking to refresh their memories on some technical steps, or just about anything else to do with code contributions to p5.js.

If you are looking to contribute outside of the p5.js repositories (writing tutorials, planning classes, organizing events), please have a look at the other relevant pages instead. Stewards or maintainers may find the [steward guidelines](./steward_guidelines.md) more helpful regarding reviewing issues and pull requests.

This is a fairly long and comprehensive document but we will try to delineate all steps and points as clearly as possible. Do utilize the table of contents, and the browser search functionality (`Ctrl + f` or `Cmd + f`) to find sections relevant to you. Feel free to skip sections if they are not relevant to your planned contributions as well.

# Table of Contents
- [All about issues](#all-about-issues)
	- [What are issues?](#what-are-issues)
	- [Issue templates](#issue-templates)
		- [Found a bug](#found-a-bug)
		- [Existing Feature Enhancement](#existing-feature-enhancement)
		- [New Feature Request](#new-feature-request)
		- [Discussion](#discussion)
- [Working on p5.js codebase](#working-on-p5js-codebase)
	- [Quick Get Started For Developers](#quick-get-started-for-developers)
	- [Using the GitHub edit functionality](#using-the-github-edit-functionality)
	- [Forking p5.js and working from your fork](#forking-p5js-and-working-from-your-fork)
	- [Codebase breakdown](#codebase-breakdown)
	- [Build setup](#build-setup)
	- [Git workflow](#git-workflow)
		- [Source code](#source-code)
		- [Unit tests](#unit-tests)
		- [Inline documentation](#inline-documentation)
		- [Internationalization](#internationalization)
		- [Accessibility](#accessibility)
	- [Code standard](#code-standard)
	- [Design principles](#design-principles)
- [Pull requests](#pull-requests)
	- [Creating a pull request](#creating-a-pull-request)
		- [Pull request information](#pull-request-information)
		- [Rebase and resolve conflicts](#rebase-and-resolve-conflicts)
	- [Discuss and amend](#discuss-and-amend)

---
# All about issues
The majority of the activity on p5.js' GitHub repositories (repo for short) happens in issues and issues will most likely be the place to start your contribution process as well.

## What are the issues?
Issue is the generic name for a post on GitHub that aims to describe, well, an issue. This "issue" can be a bug report, a request to add a new feature, a discussion, a question, an announcement, or anything that works as a post. Comments can be added below each issue by anyone with a GitHub account, including bots! It is the place where contributors discuss topics related to the development of the project in the repo.

While an issue can be opened for a wide variety of reasons, for p5.js' repos we usually only use issues to discuss p5.js source code development-related topics. Topics such as debugging your own code, inviting collaborators to your project, or other unrelated topics should be discussed either on the [forum](https://discourse.processing.com) or on other platforms.

We have created easy-to-use issue templates to aid you in deciding whether a topic should be a GitHub issue or it should be posted somewhere else!

## Issue templates
p5.js' issue templates not only make it easier for stewards and maintainers to understand and review issues, it also make it simpler for you to file the relevant issue and receive a reply faster. Although they are called templates, from your perspective, it will just be like filling in a simple form where all the different fields of the form are the potentially important information that issue reviewers will need to properly diagnose your issue.

To file a new issue, simply go to the "Issues" tab on the p5.js repo and click on the "New issue" button (usually in green and on the right side). Once you have clicked that, you will be presented with several different options, each of which either correspond to a relevant issue template or redirect you to the relevant place to file your question. You should choose the most relevant option out of all that is presented to ensure your issue can receive the right attention promptly. We will cover the issue templates that apply to p5.js below, for other reports, please check their respective contributor documentation.

### "Found a bug"
When you encounter possible incorrect behavior in p5.js or something not behaving as described in the documentation, this is the template you should use. Please note that if you are trying to debug your own code or figure out why your sketch is not behaving as you expected and you think it may be a problem with your code, you should ask on the [forum](https://discourse.processing.org) instead. If it is later determined your problem did stem from p5.js, you can always open an issue and use this template then.

There are a few fields for you to fill in for this template:
1. "Most appropriate sub-area of p5.js?" - This helps the appropriate stewards identify and respond to your issue. This will automatically tag the issue with the relevant [labels](./issue_labels.md).
2. "p5.js version" - You can find the p5.js version number in either the `<script>` tag link or on the very first line of the p5.js/p5.min.js file. It will look something similar to `1.4.2` (three numbers separated by periods).
3. "Web browser and version" - In the address bar, on Chrome enter "chrome://version", on Firefox enter "about:support". On Safari, use "About Safari" under the top bar "Safari" menu item. This helps us isolate different behaviors between browsers.
4. "Operating System" - You should include the OS version number if possible, eg. `macOS 12.5`. Some bugs can stem from OS behaviors as well.
5. "Steps to reproduce this" - This is arguably the most important information to share. You should list out detailed steps for replicating the bug you are seeing. Sharing a basic sample code that demonstrates the issue can go a long way for anyone to replicate the bug you are facing and start formulating a solution.

As alluded to above, many of the different fields in this template are aimed at replicating the bug. The more information you can provide us about your sketch's environment and how others can replicate what you are seeing, the easier it is for anyone to understand your issue and start looking into solutions. **Be as detailed as you can and avoid generic statements**, eg. do not say "image() function does not work" but rather be more specific such as "image() function does not display the loaded GIF image at the right size". A helpful way to describe the bug you are facing is to describe two things: 1. what you expect the sample code you share to do (expected behavior); and 2. what the sample code is actually doing (actual behavior).

If you wish to contribute a fix to the bug you just reported, you can indicate so in the description. If you can provide a simple suggestion as to how you would fix the bug you just described, it would be very helpful for the issue reviewer to know how much support you would need to contribute to the fix. For bug reports to be accepted for fixing, they must be approved by at least 1 area steward or maintainer before work can begin on a pull request. Any pull requests filed before the issue has been approved for fixing will be closed until approval is given to the issue. **You should not file a pull request (or start working on code changes) without a corresponding issue or before an issue has been approved for implementation**, that is because there is no guarantee that the proposal will be accepted, and you won't have done work that isn't going to be merged in the first place.

### "Existing Feature Enhancement"
This template should be used if you wish to modify or otherwise add functionalities to existing features of p5.js (functions, constants, rendering, etc). For example, if you want to add a new way to define a color to the `color()` function and other functions that accept colors, this is the template to use.

There are a few fields for this template that you should fill in.
1. "Increasing Access" - This non-optional field is where you insert a statement about how adding the proposed feature enhancement will help p5.js [increase access](./access.md) for people historically marginalized in the field of creative arts or technology. **No proposals will be accepted without this**, although you can fill in "Not sure" and offer other members of the community to provide this argument if they can think of how it addresses the accessibility of p5.js.
2. "Most appropriate sub-area of p5.js?" - This helps the appropriate stewards identify and respond to your issue. This will automatically tag the issue with the relevant [labels](./issue_labels.md).
3. "Feature enhancement details" - This is where you describe your proposal for the feature enhancement. A good feature enhancement proposal often includes a clear use case: what, when, how, and why this feature enhancement is needed.

For feature enhancement proposals to be accepted they must be approved by at least 1 area steward or maintainer before work can begin on a pull request. Any pull requests filed before a proposal has been approved will be closed until approval is given to the issue. **You should not file a pull request (or start working on code changes) without a corresponding issue or before an issue has been approved for implementation**, that is because there is no guarantee that the proposal will be accepted, and you won't have done work that isn't going to be merged in the first place.

### "New Feature Request"
This template should be used if you wish to propose a new feature to be added to p5.js. For example to add support for drawing native HTML `<table>` elements with a new `createTable` function. Some proposals may overlap with existing feature enhancement proposals, in these cases you should just choose whichever template you feel is most appropriate.

Accordingly, the template form fields are nearly identical to the field of the "Existing Feature Enhancement". As such please see the [previous section](#existing-feature-enchancement) for details about how to fill in each field.

For new feature request proposals to be accepted, they must be approved by at least 2 area stewards or maintainers before work can begin on a pull request. Any pull requests filed before a proposal has been approved will be closed until approvals are given to the issue. **You should not file a pull request (or start working on code changes) without a corresponding issue or before an issue has been approved for implementation**, that is because there is no guarantee that the proposal will be accepted, and you won't have done work that isn't going to be merged in the first place.

### "Discussion"
This template is used when the issue you are filing does not fit into any of the above in any way. This should be relatively rare in practice. For example, a discussion about whether to adopt a specific Web API feature in p5.js should be filed as a [new feature request](#new-feature-request) instead; a discussion about adding additional color mode to the various color functions should be filed as a [feature enchancement](#existing-feature-enchancement) instead; an announcement about a local creative coding event that you are organizing should be posted on the forum and/or contacting the Processing Foundation if you are looking for support or publicity; etc.

When opening a discussion issue, you can use the "Labels" panel on the side panels to add additional relevant labels so you can signpost your issue to the relevant area. The template itself is just the bare minimum text field so you can just post whatever topic you want to discuss here.

---
# Working on p5.js codebase
Now that your issue has been discussed, an implementation approved by stewards, and you are willing to make the code changes, you are ready to start working on the codebase.

Similarly, if you have come across an issue or joined in discussions of an issue and implementation has been approved by stewards but neither the original issue author nor other members of the community have indicated they are willing to work on the issue, you may volunteer for submit a contribution here and have the stewards assign the issue to you.

You should not "jump the queue" by filing a PR for an issue that either someone else has indicated willingness to submit a contribution or has already been assigned to someone else. We will always prioritize "first assigned first serve" orders for accepting code contributions for an issue, if you file a PR for an issue while someone else is still working on the same issue, your PR will be closed. If you see that it has been a few months since the last activity on an issue with an assigned individual, you can check in with them by leaving a polite comment on the issue asking for progress and if they need help with the implementation. We generally allow for a fairly long time frame for people to work on their contributions as we understand that most people will often be working on a volunteer basis or it simply takes more time for them to work on the feature; similarly, you should work at your own pace and be confident that there is no hard time limit on how long you can spend working on something. That being said, if you are having trouble with any aspect of your code contribution, do not hesitate to ask for help with the issue, the stewards and maintainers, as well as members of our community, will do their best to guide you!

## Quick Get Started For Developers
If you want to work/contribute to p5.js'🌸 codebase as a developer, either directly for improving p5.js or for improving it's sub-projects like [Friendly Error Systems](https://github.com/processing/p5.js/blob/main/contributor_docs/friendly_error_system.md), you can follow the following steps directly :

1. Create a fork of p5.js.
2. Clone your locally created fork.
3. Add upstream using the following command : 
   `git remote add upstream https://github.com/processing/p5.js`
   [More information on Configuring a remote repository for a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/configuring-a-remote-repository-for-a-fork)
4. Make sure your machine has [NodeJs](https://nodejs.org/en/download) installed, check it with the        following command : 
   `node -v`
5. Run: `npm ci`
6. Create a git branch of the `main` branch having a descriptive branch name using :
   `git checkout -b [branch_name]`
7. As you start making changes to the codebase, frequently run : 
    `npm test`
  (it takes time, but it ensures that existing behaviors are not being broken)
8. Once it is done, you can commit the changes and create a [Pull Request](https://p5js.org/contributor-docs/#/./contributor_guidelines?id=pull-requests). 

## Using the GitHub edit functionality
When viewing a file on the Github web interface, near the top of the content of the file you are viewing will be a pencil icon button. This button is a convenient edit feature provided by Github that simplifies many of the processes we will be covering below and can be used to make quick and simple edits to the file you are viewing.

However, it is not recommended to use this feature other than for very simple changes. One of the main reasons for this is that for more complex changes to the source code, it should be built and tested locally before being filed as a PR. Using a local development environment is also often much more fluent for most as compared to the basic editing environment provided by this edit functionality.

## Forking p5.js and working from your fork
The first step is to fork the p5.js repository. Forking has a specific meaning in open source but for our purpose, it means creating a copy of the repository and storing it in your own GitHub account. To fork a repo, simply click on the "Fork" button near the top of the page and GitHub will make a copy of the repo in your account.

Working from your fork of the p5.js repository is necessary because you will likely not have direct write access to the official p5.js repository and working on a fork allows you to make changes and later submit them back to the official repository.

At this point, you should be minimally familiar with working with the command line, git, and node.js, and have a local development environment setup.

Once the fork is created, navigate to your fork's page and copy the git URL by clicking the green "Code" button. It should look something like `https://github.com/limzykenneth/p5.js.git`.

Next, go to the command line in your local environment and close this git repository. "Clone" simply means download a copy of the repo to your local machine. Run the following command in a folder where you want to store the p5.js source code folder.


```
git clone [git_url]
```

Replace `[git_url]` with the URL you just copied above. This can take several minutes depending on the speed of your internet connection, a good time to make some coffee! Once the process finished, you can open up the downloaded folder named `p5.js` in your preferred text editor and start looking around.

## Codebase breakdown
Some of the key files and folders you will be in the p5.js folder are as below:

* `src` - Where all the code that eventually gets combined into the final p5.js and p5.min.js files lives
* [`test`](./unit_testing.md) - Where unit tests and code for testing all documentation examples lives
* `tasks` - Where detailed and custom build code lives
* `Gruntfile.js` - This is the main build configuration file
* `contributor_docs` - Where the documentation and all other contributor documentation lives

The other files and folders are either configurations or other kinds of support files, in most cases, you shouldn't need to make any modifications to them.

## Build setup
Before you do anything, you'll need to set up the local project folder so that you can build and run tests for p5.js. Assuming you have node.js installed (with `npm`),

```
npm ci
```

This will likely take a while as npm downloads all dependencies required but once it's done, that's it, you are all set up pretty simple right?

## Git workflow
Now you are ready to make the changes you need to make, for more details about the different parts of the repository and how you can make relevant changes, see the subsections below. To start with, run the `npm test` to try building p5.js from scratch and run all unit tests, this should complete with no errors.

Next, it is recommended that you make a branch off the `main` branch before starting your work. Run `git checkout -b [branch_name]` while you are on the `main` branch, replacing `[branch_name]` with something descriptive, and you will be on a separate branch now. A branch in git is as the name implies, a branched version of the repo that you can add commits to without affecting the `main` or other branches. Branches enable you to work on multiple features at once (by using multiple isolated branches) and have confidence that if you mess up a branch it won't affect the `main` branch.

As you make your changes, it is recommended to frequently run the `npm test`, especially if you are working on the source code. Running this will take some time but it ensures that the changes you make are not breaking existing behaviors. You should run the `npm test` before moving on committing the changes as described below.

Once you have made your changes to the codebase, you will need to commit it to git. A commit is a collection of changes saved in the git repository, it essentially records the current state of the files in the repo at the time of commit. A question that may arise is how often should you commit to git. In general, it is preferred that you aim to commit often rather than lump multiple big changes into one commit. A good guideline is to commit whenever you have completed a subtask that can be described in a sentence.

To commit all current changes, follow the following:

1. Run `git status` and check that it only lists files that you have changed. If there are files listed that you have not changed, you will need to either restore them to the original or make sure they are intended changes. Running `git diff` can also show you more detailed changes for each file. You should not commit any file changes that you don't intend to change for your PR.
2. Run `git add .` to stage all changes for committing into git.
3. Run `git commit -m [your_commit_message]` to commit the changes into git. `[your_commit_message]` should be replaced with a relevant commit message that is descriptive of the changes, avoiding generic statements. For example, instead of saying `Documentation fix 1`, say `Add documentation example to circle() function`.

Repeat the above steps for all commits you will be making while making sure to run the `npm test` periodically to make sure things are working.

### Source code
If you are going to work on the source code, a good place to start, if you know which of the p5.js feature you are going to work on, is to visit the documentation and at the bottom of each documented functionality of p5.js will be a link to its source code.

### Unit tests
If you are going to work on unit tests, please see [here](./unit_testing.md). Note that for any feature enhancements, new features, and some bug fixes, unit tests covering the new implementations should be included in the PR.

### Inline documentation
If you are going to work on the inline documentation, please see [here](./inline_documentation.md).

### Internationalization
If you are going to work on p5.js' internationalization, please see [here](./internationalization.md). Note that this does not cover the website's internationalization/translation, please see the [website repo](https://github.com/processing/p5.js-website) for that.

### Accessibility
If you are going to work on accessibility features, please see [here](./web_accessibility.md). For Friendly Error System, please see [here](./friendly_error_system.md).

## Code standard
p5.js' code standard or code style is enforced by eslint. Any git commit and pull request must pass linting before it will be accepted. The easiest way for you to follow the right coding standard is to use eslint plugin available for your text editor with linting error highlighting (available for most popular text editors).

## Design principles
While working on any features of p5.js, it is important to keep in mind the [design principles](./design_principles.md) of p5.js. Our priorities may differ from the priorities of other projects, so if you are coming from a different project, it is also recommended that you familiarize yourself with p5.js' design principles.

---
# Pull requests
Now that you have made the changes you need to make, the `npm test` does not error, and you have committed the changes, you can start preparing a pull requests to get your new commits merged into the official p5.js repository. A pull request more formally is a request to a repo (in this case the official p5.js repo) to pull or merge changes from another repo (in this case your forked p5.js repo) into its commit history.

## Creating a pull request
The first step here is to push your new commits to your fork of p5.js, think of it as uploading the changes to your fork.

```
git push -u origin [branch_name]
```

Once the push is complete, you may see a link in the terminal that lets you open a pull request, if not you can navigate to your fork in your web browser, switch to the branch you are working on with the dropdown button on top of the file list, click on "Contribute" then "Open pull request".

### Pull request information
Before filing the pull request, you will need to fill out the pull request template. First of all the pull request title should briefly describe what the changes are, again avoid generic statements here.

Next, in the template, there is this line `Resolves #[Add issue number here]` which you should replace `[Add issue number here]` with the issue number of the issue you are addressing/fixing [above](#all-about-issues) (eg. `Resolves #1234`). This will make sure the issue is automatically closed after this PR is merged. If you do not wish to automatically close the issue after this PR is merged (maybe because there are more changes coming in a separate PR), change `Resolves` to `Addresses`.

For "Changes", you should give a clear description of the changes you have made in this PR. Include any implementation details and decisions you made here that are relevant to whoever will review this PR.

"Screenshots of the change" are optional depending on circumstances and should be included when making changes related to how p5.js renders visuals on the canvas. Note that this is not a screenshot of the text editor but a screenshot of an example sketch's behavior after your changes.

"PR Checklist" contains some relevant checklist items that you should tick by replacing `[ ]` with `[x]` wherever relevant to your changes.

Once done, click on "Create pull request".

### Rebase and resolve conflicts
You should now inspect the opened pull request and pay attention to a few things:

1. The number of commits should match the number of commits you have made, meaning if you have committed 2 times while working on this PR, it should only show two commits in the "Commits" tab.
2. The "Files changed" tab should show you the changes you have made as compared with the p5.js repo and nothing more.
3. Near the bottom, it should say "This branch has no conflicts with the base branch" and not "This branch has conflicts that must be resolved".

If any of the above is not true (there are more commits than you expected or there are conflicts), you may need to rebase or help resolve conflicts. Conflicts here mean that you have made changes to a file that also recently had changes applied to it and git is not sure which set of changes to keep or leave out. If you are not confident in resolving these issues, let a steward know and we'll guide you through the process. Basic instruction is as below.

1. Run `git remote add upstream https://github.com/processing/p5.js`
2. Run `git fetch upstream`
3. Run `git rebase upstream/main`
4. You may have some conflicts! If it’s just lib/p5.js and lib/p5.min.js, it’s easy to fix, just build the project again. If you have conflicts in other files & you're not sure how to resolve them... ask for help!
```
    npm test
    git add -u
    git rebase --continue
```
5. Run `git push`

The checklist above may clear out after these steps but if not, we'll guide you through any fix necessary.

## Discuss and amend
Now that your PR is opened, a steward or maintainer will review your PR. It may take several days before a steward is able to reply to your PR so be patient and why not check out some of the other open issues in the meantime?

Once a steward has reviewed your PR, one of two things may happen: 1. Your PR is approved and merged, hurray! 2. The steward may ask some questions regarding the PR or request some changes to the PR. If it's the latter, don't panic, it's perfectly normal and the stewards are always here to help you complete your contribution!

If changes are requested of your PR and you are able to make those changes, follow the [same process as before](#git-workflow) but just continue from your local copy of the repo and relevant branch, make those changes, commit them into git, and push them to your forked remote repo. Once you have pushed additional commits to your forked remote repo, you will see that the new commits automatically show up in the PR. Leave a comment in the PR to let the reviewer know you have made the changes requested and if no additional changes are needed, your PR will be merged!

---
