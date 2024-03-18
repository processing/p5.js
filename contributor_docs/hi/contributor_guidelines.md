# योगदानकर्ता दिशानिर्देश

योगदानकर्ता दिशानिर्देशों में आपका स्वागत है! यह दस्तावेज़ उन नए योगदानकर्ताओं के लिए है जो p5.js में कोड का योगदान करना चाहते हैं, ऐसे योगदानकर्ता जो कुछ तकनीकी चरणों पर अपनी यादें ताज़ा करना चाहते हैं, या p5.js में कोड योगदान के साथ कुछ और करना चाहते हैं।

यदि आप p5.js रिपॉजिटरी के बाहर योगदान करना चाहते हैं (ट्यूटोरियल लिखना, कक्षाओं की योजना बनाना, कार्यक्रमों का आयोजन करना), तो कृपया इसके बजाय अन्य प्रासंगिक पृष्ठों पर एक नज़र डालें। प्रबंधकों या अनुरक्षकों को समस्याएँ की समीक्षा करने और अनुरोधों को खींचने के संबंध में [कार्यपालिका दिशानिर्देश](https://github.com/processing/p5.js/blob/main/contributor_docs/steward_guidelines.md) अधिक उपयोगी लग सकते हैं।

यह अपेक्षाकृत लंबा और व्यापक दस्तावेज़ है लेकिन हम सभी चरणों और बिंदुओं को यथासंभव स्पष्ट रूप से इंगित करने का प्रयास करेंगे। अपने लिए प्रासंगिक अनुभाग ढूंढने के लिए विषय-सूची का उपयोग करें। यदि अनुभाग आपके नियोजित योगदान के लिए प्रासंगिक नहीं हैं, तो बेझिझक उन्हें छोड़ दें।

**यदि आप एक नए योगदानकर्ता हैं, तो आप पहले खंड, "सभी समस्याएँ के बारे में" से शुरुआत करना चाहेंगे। यदि आप विकास प्रक्रिया का चरण-दर-चरण सेटअप चाहते हैं, तो आप "डेवलपर्स के लिए त्वरित शुरुआत करें" अनुभाग देख सकते हैं.**


# Table of Contents

- [All about issues](#all-about-issues)
  - [What are issues?](#what-are-issues)
  - [Issue templates](#issue-templates)
    - [Found a bug](#found-a-bug)
    - [Existing Feature Enhancement](#existing-feature-enhancement)
    - [New Feature Request](#new-feature-request)
    - [Discussion](#discussion)
- [Working on p5.js codebase](#working-on-the-p5js-codebase)
  - [Quick Get Started For Developers](#quick-get-started-for-developers)
  - [Using the Github edit functionality](#using-the-github-edit-functionality)
  - [Forking p5.js and working from your fork](#forking-p5js-and-working-from-your-fork)
    - [Using Github Desktop](#using-github-desktop)
    - [Using the git command line interface](#using-the-git-command-line-interface)
  - [Codebase breakdown](#codebase-breakdown)
  - [Build setup](#build-setup)
  - [Git workflow](#git-workflow)
    - [Source code](#source-code)
    - [Unit tests](#unit-tests)
    - [Inline documentation](#inline-documentation)
    - [Internationalization](https://github.com/processing/p5.js/blob/main/contributor_docs/contributor_guidelines.md#internationalization)
    - [Accessibility](#accessibility)
  - [Code standard](#code-standard)
  - [Software Design principles](#software-design-principles)
- [Pull requests](#pull-requests)
  - [Creating a pull request](#creating-a-pull-request)
    - [Pull request information](#pull-request-information)
    - [Title](#title)
    - [Resolves](#resolves)
    - [Changes](#changes)
    - [Screenshots of the change](#screenshots-of-the-change)
    - [PR Checklist](#pr-checklist)
    - [Rebase and resolve conflicts](#rebase-and-resolve-conflicts)
  - [Discuss and amend](#discuss-and-amend)

---


# समस्याएँ के बारे में सब कुछ

p5.js के गिटहब रिपॉजिटरी (संक्षेप में रेपो) पर अधिकांश गतिविधि समस्याएँ में होती है, जो आपकी योगदान यात्रा शुरू करने के लिए एक शानदार जगह है।


## समस्याएँ क्या हैं?

![p5.js लाइब्रेरी GitHub रिपॉजिटरी का एक क्रॉप्ड स्क्रीनशॉट, केवल ऊपरी दाएं कोने की सामग्री दिखा रहा है। स्क्रीनशॉट के शीर्ष पर मुद्दे टैब के आसपास एक लाल बॉक्स बनाया गया है।](../images/issues-tab.png)

"समस्या" GitHub पर एक पोस्ट के लिए एक सामान्य नाम है जो किसी समस्या को वर्णित करने का उद्देश्य रखता है। यह समस्या एक बग रिपोर्ट, नई फीचर जोड़ने का अनुरोध, एक चर्चा, या p5.js पुस्तकालय विकास से संबंधित किसी भी पोस्ट के रूप में काम कर सकती है। प्रत्येक समस्या के नीचे किसी भी GitHub खाते वाले व्यक्ति, सहित बॉट्स, द्वारा टिप्पणियाँ जोड़ी जा सकती हैं! यह वह स्थान है जहां योगदानकर्ताओं ने परियोजना के विकास से संबंधित विषयों पर चर्चा करते हैं।

जबकि एक समस्या कई विभिन्न कारणों के लिए खोली जा सकती है, हम आमतौर पर केवल p5.js स्रोत कोड के विकास पर चर्चा करने के लिए समस्याएँ का उपयोग करते हैं। अपने कोड की डीबगिंग, अपने परियोजना में सहयोगी निमंत्रण करने, या अन्य असंबंधित विषयों जैसे विषयों पर हम केवल [फोरम](https://discourse.processing.com) या अन्य प्लेटफ़ॉर्मों जैसे [डिस्कोर्ड](https://discord.gg/SHQ8dH25r9) पर चर्चा करते हैं।

हमने आपको GitHub समस्या होनी चाहिए या कहीं और पोस्ट करनी चाहिए को निर्धारित करने में मदद करने के लिए आसान-से-उपयोग निर्देशिका बनाई हैं!


## Issue templates

p5.js's issue templates make it easier for stewards and maintainers to understand and review issues. They also make it easier for you to file the relevant issue and receive a reply faster. 

![Screenshot of an example of what an issue looks like on GitHub. The title of the issue in the screenshot is "Warning being logged in Safari when using a filter shader in 2D mode #6597"](../images/github-issue.png)

To file a new issue, simply go to the "Issues" tab on the p5.js repo and click on the "New issue" button on the right side. You will be presented with several different options, each of which either corresponds to a relevant issue template or redirects you to the relevant place to file your question. We recommend choosing the most relevant option out of those presented to ensure your issue receives the right attention promptly.

![Cropped screenshot of the GitHub repository's issue page with the green "New issue" button highlighted with a red box surrounding it.](../images/new-issue.png)


### ["Found a bug"](https://github.com/processing/p5.js/issues/new?assignees=\&labels=Bug\&projects=\&template=found-a-bug.yml)

When you encounter possible incorrect behavior in p5.js or something not behaving as described in the documentation, use [this template](https://github.com/processing/p5.js/issues/new?assignees=\&labels=Bug\&projects=\&template=found-a-bug.yml). Please note that if you are trying to debug your sketch and you think it may be a problem with your code, you should first ask on the [Discourse forum](https://discourse.processing.org) instead.

There are a few fields for you to fill in for this template:

1. *Most appropriate sub-area of p5.js?* - This helps us identify and respond to your issue by automatically tagging the issue with the relevant [labels](https://github.com/processing/p5.js/blob/main/contributor_docs/issue_labels.md).
2. *p5.js version* - You can find the p5.js version number in either the `<script>` tag link or on the very first line of the p5.js/p5.min.js file. It will look something similar to `1.4.2` (three numbers separated by periods).
3. *Web browser and version* - This helps us isolate different behaviors between browsers. To find the browser version number, follow the instructions in the table below for the browser you are using.

<table>

<tr>

<td>

Chrome

</td>

<td>

Firefox

</td>

<td>

Safari

</td>

</tr>

<tr>

<td>

In the address bar, navigate to `chrome://version`

</td>

<td>

In the address bar, navigate to  `about:support`

</td>

<td>

Under the top bar “Safari” menu item, choose “About Safari”

</td>

</tr>

</table>

4. *Operating System* - You should include the OS version number if possible, e.g., `macOS 12.5`. Some bugs can stem from OS behaviors.
5. *Steps to reproduce this* - This is arguably the most important information to share. You should list out detailed steps for replicating the bug you are seeing. Sharing a basic sample code that demonstrates the issue can go a long way for anyone looking to replicate the bug you are facing and start formulating a solution.

**Replication is key!** Many of the fields in this template are aimed at replicating the bug. The more information you can provide us about your sketch's environment and how others can replicate what you are seeing, the easier it is for anyone to understand your issue and start looking into solutions. 

**Be as detailed as you can and avoid generic statements**, e.g., do not say "image() function does not work" but rather be more specific, such as "image() function does not display the loaded GIF image at the right size." A helpful way to describe the bug you are facing is to describe two things: 

1. What you expect the sample code you share to do (expected behavior).
2. What the sample code is actually doing (actual behavior).

If you wish to contribute a fix to the bug you just reported, you can indicate so in the description. You may provide a simple suggestion as to how you would fix the bug you just described, this will let us know how much support you may need to contribute to the fix.

**You should not file a pull request (or start working on code changes) without a corresponding issue or before an issue has been approved for implementation**; that is because the proposed fix may not be accepted, need a different approach entirely, or the actual problem is somewhere else. Any pull requests filed before the issue has been approved for fixing will be closed until approval is given to the issue.

For bug reports to be accepted for fixing, they must be approved by at least one [area steward or maintainer](https://github.com/processing/p5.js#stewards) before work can begin on a pull request.


### ["Existing Feature Enhancement"](https://github.com/processing/p5.js/issues/new?assignees=\&labels=Enhancement\&projects=\&template=existing-feature-enhancement.yml)

This template should be used if you wish to propose changes or add functionality to existing features of p5.js (functions, constants, rendering, etc). For example, if you want to add a new way to define a color to the `color()` function and other functions that accept colors, this is the template to use.

There are a few fields for this template that you should fill in.

1. *Increasing Access* - This required field is where you insert a statement about how adding the proposed feature enhancement will help p5.js [increase access](https://github.com/processing/p5.js/blob/main/contributor_docs/access.md) for people historically marginalized in the field of creative arts or technology. **No proposals will be accepted without this**, although you can fill in "Not sure" and offer other members of the community to provide this argument if they can think of how it addresses the accessibility of p5.js.
2. *Most appropriate sub-area of p5.js?* - This helps us identify and respond to your issue. This will automatically tag the issue with the relevant [labels](https://github.com/processing/p5.js/blob/main/contributor_docs/issue_labels.md).
3. *Feature enhancement details* - This is where you describe your proposal for the feature enhancement. A good feature enhancement proposal often includes a clear use case: what, when, how, and why this feature enhancement is needed.

For feature enhancement proposals to be accepted they must be approved by at least 1 [area steward or maintainer](https://github.com/processing/p5.js#stewards) before work can begin on a pull request. 

**You should not file a pull request (or start working on code changes) without a corresponding issue or before an issue has been approved for implementation**, because there is no guarantee that the proposal will be accepted. Any pull requests filed before a proposal has been approved will be closed until approval is given to the issue.


### ["New Feature Request"](https://github.com/processing/p5.js/issues/new?assignees=\&labels=Feature+Request\&projects=\&template=feature-request.yml)

This template should be used if you wish to propose a new feature to be added to p5.js. For example to add support for drawing native HTML `<table>` elements with a new `createTable` function. Some proposals may overlap with existing feature enhancement proposals, in these cases you should just choose whichever template you feel is most appropriate.

Accordingly, the template form fields are nearly identical to the field of the "Existing Feature Enhancement." As such please see the [previous section](#existing-feature-enchancement) for details about how to fill in each field.

For new feature request proposals to be accepted, they must be approved by at least 2 [area stewards or maintainers](https://github.com/processing/p5.js#stewards) before work can begin on a pull request. 

**You should not file a pull request (or start working on code changes) without a corresponding issue or before an issue has been approved for implementation**, that is because there is no guarantee that the proposal will be accepted. Any pull requests filed before a proposal has been approved will be closed until approval is given to the issue.


### ["Discussion"](https://github.com/processing/p5.js/issues/new?assignees=\&labels=Discussion\&projects=\&template=discussion.yml)

This template is used when the issue you are filing does not fit into any of the above in any way. An issue not fitting into any of the above templates should be relatively rare in practice. For example, a discussion about whether to adopt a specific Web API feature in p5.js should be filed as a [new feature request](https://github.com/processing/p5.js/blob/main/contributor_docs/contributor_guidelines.md#new-feature-request); a discussion about adding an additional color mode to the various color functions should be filed as a [feature enchancement](https://github.com/processing/p5.js/blob/main/contributor_docs/contributor_guidelines.md#existing-feature-enchancement); an announcement about a local creative coding event that you are organizing should be posted on the forum and contacting the Processing Foundation if you are looking for support or publicity; etc.

When opening a discussion issue, you can use the "Labels" panel on the side panels to add additional relevant labels so you can signpost your issue to the relevant area. The template itself is just the bare minimum text field. You can see [this link](https://github.com/processing/p5.js/issues/6517) for an example discussion issue.

[**⬆ back to top**](#contributor-guidelines)

---


# Working on the p5.js codebase

## Prerequisites

To proceed you should be minimally familiar with working with the command line, git, node.js (at least v18 and up), and have a local development environment setup.


## Introduction

Now that your issue has been discussed, an implementation approved, and you are willing to make the code changes, you are ready to start working on the codebase.

Similarly, if you have come across an issue or joined in discussions of an issue and an implementation has been approved by stewards, but neither the original issue author nor other members of the community have indicated they are willing to work on the issue, you may volunteer for submit a contribution here and have the stewards assign the issue to you.

**You should not "jump the queue"** by filing a PR for an issue that either someone else has indicated willingness to submit a contribution or has already been assigned to someone else. We will always prioritize the "first assigned, first serve" order for accepting code contributions for an issue. 

If you file a PR for an issue while someone else is still working on the same issue, your PR will be closed. If you see that it has been a few months since the last activity on an issue with an assigned individual, you can check in with them by leaving a polite comment on the issue asking for progress and if they need help with the implementation. We generally allow for a reasonably long time frame for people to work on their contributions as we understand that most people will often be working on a volunteer basis, or it simply takes more time for them to work on the feature. 

Similarly, you should work at your own pace and be confident that there is no hard time limit on how long you can spend working on something. That being said, if you are having trouble with any aspect of your code contribution, do not hesitate to ask for help in the issue, the stewards and maintainers, as well as members of our community, will do our best to guide you!


## Quick Get Started For Developers

If you want to work/contribute to p5.js'🌸 codebase as a developer, either directly for improving p5.js or for improving its sub-projects like [Friendly Error Systems](https://github.com/processing/p5.js/blob/main/contributor_docs/friendly_error_system.md), you can follow the following steps:

1. [Create a fork of p5.js.](https://docs.github.com/en/get-started/quickstart/fork-a-repo)
2. [Clone your created fork to your computer.](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)
3. [Add upstream using the following command](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/configuring-a-remote-repository-for-a-fork):

  ```
  git remote add upstream https://github.com/processing/p5.js
  ```

4. Make sure your machine has [NodeJs](https://nodejs.org/en/download) installed; check it with the following command:

  ```
  node -v
  ```

5. Install dependencies with:

  ```
  npm ci
  ```

6. Create a git branch of the `main` branch having a descriptive branch name using: 

  ```
  git checkout -b [branch_name]
  ```

7. As you start making changes to the codebase, frequently run the tests (it takes time, but it ensures that existing behaviors are not being broken).

  ```
  npm test
  ```

8. Add any unit tests if you are working on adding new features or feature enhancement.
9. Once done, you can commit the changes and create a [Pull Request](https://p5js.org/contributor-docs/#/./contributor_guidelines?id=pull-requests).


## Using the GitHub edit functionality

When viewing a file on the GitHub web interface, near the top of the content of the file you are viewing will be a pencil icon button. This button is a convenient edit feature provided by GitHub that simplifies many of the processes we will be covering below and can be used to make quick and simple edits to the file you are viewing.

![Cropped screenshot of a file view in GitHub of the p5.js repository, "src/color/color\_conversion.js" file. A red arrow pointing to a pencil icon button on the right side of the image.](../images/edit-file.png)

However, it is not recommended to use this feature other than for very simple changes. One of the main reasons for this is that for more complex changes to the source code, it should be built and tested locally before being filed as a PR. Using a local development environment is also often much more fluent for most as compared to the basic editing environment provided by this edit functionality.


## Forking p5.js and working from your fork

The first step to work on the p5.js source code is to fork the p5.js repository. Forking has a specific meaning in open source, but for our purpose, it means creating a copy of the repository and storing it in your own GitHub account. To fork a repo, simply click on the "Fork" button near the top of the page, and GitHub will make a copy of the repo in your account.

![Screenshot of the main page of repository. A button, labeled with a fork icon and "Fork 59.3k," is outlined in dark orange.](fork.png)

Working from your fork of the p5.js repository is necessary because you will likely not have direct write access to the official p5.js repository, and working on a fork allows you to make changes and later submit them back to the official repository.


### Using GitHub Desktop

GitHub Desktop is a program that lets you work with git via a graphical user interface rather than typing commands into a terminal. It is a good option if you are new to git, and you can always switch back and forth between Github Desktop and a terminal whenever you feel like it.

First, [download and install GitHub Desktop.](https://desktop.github.com/) Once installed, open the application. It will ask you to sign in to your GitHub account. After you have signed in, it will list your projects, including your fork of p5.js. Select your fork, which will be named `yourUsername/p5.js`, and click the blue "Clone" button. It will ask for some details about where to place your project; you can either change them or leave the default settings and continue.

![The GitHub Desktop user interface after signing in. On the right half of the screen, it lists your projects, and a Clone button in the bottom right.](../images/github-desktop-init.png)

Once cloned, it will ask how you plan to use your fork. Select the option to contribute to the parent project and click "Continue."

![The view after cloning a fork. It asks if you are planning to contribute to the parent project, or use it for your own purposes.](../images/github-desktop-fork.png)


### Using the `git` command line interface

Once the fork is created, navigate to your fork's page and copy the git URL by clicking the green "Code" button. It should look something like `https://github.com/limzykenneth/p5.js.git`.

![Screenshot of the list of files on the landing page of a repository. The "Code" button is highlighted with a dark orange outline.](../images/code-button.png)

Next go to the command line in your local environment and clone this git repository. "Clone" simply means download a copy of the repo to your local machine. Run the following command in a folder where you want to store the p5.js source code folder.

```
git clone [git_url]
```

Replace `[git_url]` with the URL you just copied above. This can take several minutes, depending on the speed of your internet connection, a good time to make some coffee! Once the process is finished, you can open up the downloaded folder named `p5.js` in your preferred text editor and start looking around.


## Codebase breakdown

Some of the key files and folders you will be in the p5.js folder are as follows:

- `src` - Where all the code that eventually gets combined into the final p5.js and p5.min.js files lives
- [`test`](https://github.com/processing/p5.js/blob/main/contributor_docs/unit_testing.md) - Where unit tests and code for testing all documentation examples lives
- `tasks` - Where detailed and custom build code lives
- `Gruntfile.js` - This is the main build configuration file
- `contributor_docs` - Where the documentation and all other contributor documentation lives

The other files and folders are either configurations or other kinds of support files; in most cases, you shouldn't need to make any modifications.


## Build setup

Before you do anything, you'll need to set up the local project folder so that you can build and run tests for p5.js. Assuming you have node.js installed, run:

```
npm ci
```

This will likely take a while, as npm downloads all dependencies required. However, once done, that's it, you are all set up. Pretty simple, right?


## Git workflow

Now, you are ready to make the changes you need to make; for more details about the different parts of the repository and how you can make relevant changes, see the subsections below. To start, run:

```
npm test
```

To try building p5.js from scratch and run all unit tests, this should complete with no errors. If you just want to build the library without running the tests, you can run:

```
npm run build
```

Either of the commands above will build the library into the `lib/` folder as `p5.js` and `p5.min.js`. You can use these built files for your own tests if necessary.

Next, we recommend that you make a branch off the `main` branch before starting your work. A branch in git is as the name implies, a branched version of the repo that you can add commits to without affecting the `main` or other branches. Branches enable you to work on multiple features at once (by using multiple isolated branches) and have confidence that if you mess up a branch it won't affect the `main` branch.

In GitHub Desktop, this can be done by clicking the Current Branch button in the header of the window. From here, you can change branches, or enter a branch name to make a new one. For our purposes, enter a new branch name describing the change you will make, and click Create New Branch.

![A screenshot of the GitHub Desktop branch selection menu. After entering a new branch name that does not yet exist, a "Create New Branch" button appears.](../images/github-desktop-create-branch.png)

From the terminal, run `git checkout -b branch_name` while you are on the `main` branch, replacing `branch_name` with something descriptive, and you will be on a separate branch now. 

As you make your changes, we recommend running `npm test` frequently, especially if you are working on the source code. Running this will take some time, but it ensures that the changes you make are not breaking existing behaviors. You should run `npm test` before moving on to committing the changes as described below.

Once you have made your changes to the codebase, you will need to commit it to git. A commit is a collection of changes saved in the git repository; it essentially records the current state of the files in the repo at the time of commit. 

A question that may arise is how often should you commit to git? In general it is preferred that you aim to commit often rather than lump multiple big changes into one commit. A good guideline is to commit whenever you have completed a subtask that can be described in a sentence.

To commit all current changes from GitHub Desktop, open the app after making your changes. It will show a list of the files you have changed in the left sidebar, and the specific changes within each file on the right. Type a brief, high-level description in the field next to your user icon in the bottom left corner of the window. This will be the title of the commit. You may elaborate further in the description field below or just leave it blank. Click the blue "Commit" button to finalize the change.

![A screenshot of GitHub Desktop after having made a change. The area where you need to write a title for your change is circled in red in the lower left of the window.](../images/github-desktop-commit.png)

To commit all current changes from the terminal, run the following:

1. Check that it only lists files you have changed with the following command. 

```
git status
```

If there are files listed that you have not changed, you will need to either [restore](https://git-scm.com/docs/git-restore) them to the original or make sure they are intended changes. To show more detailed changes for each file use the following command. 

```
git diff
```

You should not commit any file changes that you don't intend to change for your PR.

2. Stage all changes for committing into git with the following command.

```
git add .
```

3. To commit the changes into git, run the following command.

```
git commit -m "[your_commit_message]"
```

`[your_commit_message]` should be replaced with a relevant commit message that is descriptive of the changes, avoiding generic statements. For example, instead of saying `Documentation fix 1`, say `Add documentation example to circle() function`.

```
git commit -m "Add documentation example to circle() function"
```

Repeat the above steps for all commits you will be making while making sure to run `npm test` periodically to make sure things are working.


### Source code

If you are going to work on the source code, a good place to start, if you know which of p5.js features you are going to work on, is to visit the documentation and at the bottom of each documented functionality of p5.js will be a link to its source code.

![Cropped screenshot of a reference page on the p5.js website containing the sentence "Notice any errors or typos? Please let us know. Please feel free to edit src/core/shape/2d\_primitives.js and issue a pull request!". Part of the above sentence where it says "src/core/shape/2d\_primitives.js" is highlighted with a red underline and arrow pointing to it.](../images/reference-code-link.png)


### Unit tests

If you are going to work on unit tests, please see [here](https://github.com/processing/p5.js/blob/main/contributor_docs/unit_testing.md). Note that for any feature enhancement, new features, and certain bug fix, unit tests covering the new implementations should be included in the PR.


### Inline documentation

If you are going to work on the inline documentation, please see [here](https://github.com/processing/p5.js/blob/main/contributor_docs/inline_documentation.md).


### Accessibility

If you are going to work on accessibility features, please see [here](https://github.com/processing/p5.js/blob/main/contributor_docs/web_accessibility.md). For a Friendly Error System, please see [here](https://github.com/processing/p5.js/blob/main/contributor_docs/friendly_error_system.md).


## Code standard

p5.js' code standard or code style is enforced by [ESLlint](https://eslint.org/). Any git commit and pull request must pass linting before it will be accepted. The easiest way for you to follow the right coding standard is to use the ESLint plugin available for your text editor with linting error highlighting (available for most popular text editors).


## Software Design principles

While working on any features of p5.js, it is important to keep in mind the design principles of p5.js. Our priorities may differ from the priorities of other projects, so if you are coming from a different project, we recommend that you familiarize yourself with p5.js' design principles.

- **Access** We prioritize accessibility first and foremost, and decisions we make must take into account how it increases access to historically marginalized groups. Read more about this in our access statement.
- **Beginner Friendly** The p5.js API aims to be friendly to beginner coders, offering a low barrier to creating interactive and visual web content with cutting-edge HTML5/Canvas/DOM APIs.
- **Educational** p5.js is focused on an API and curriculum that supports educational use, including a complete reference to the API with supporting examples, as well as tutorials and sample class curricula that introduce core creative coding principles in a clear and engaging order.
- **JavaScript and its community** p5.js aims to make web development practices more accessible to beginners by modeling proper JavaScript design patterns and usage while abstracting them where necessary. As an open-source library, p5.js also includes the wider JavaScript community in its creation, documentation, and dissemination.
- **Processing and its community** p5.js is inspired by the Processing language and its community and aims to make the transition from Processing Java to JavaScript easy and clear.

[**⬆ back to top**](#contributor-guidelines)

---


# पुल रिक्वेस्ट 

अब जब आपने आवश्यक परिवर्तन कर लिए हैं, यदि लागू हो तो इकाई परीक्षण भी शामिल है, `npm test` में गलती नहीं होती है, और आपने कमिट  कर दिए हैं, तो आप अपने नए कमिट को आधिकारिक p5.js में मर्ज करने के लिए पुल रिक्वेस्ट तैयार करना शुरू कर सकते हैं जो p5.js रिपॉजिटरी में मर्ज हो जाएगा। एक पुल रिक्वेस्ट, अधिक औपचारिक रूप से, एक रेपो (इस मामले में, आधिकारिक p5.js रेपो) के लिए एक अन्य रेपो (इस मामले में, आपके फोर्कड p5.js रेपो) से परिवर्तनों को उसके प्रतिबद्ध इतिहास में पुल या मर्ज करने का अनुरोध है।


## पुल रिक्वेस्ट बनाना 

यहां पहला कदम आपके नए कमिट को आपके p5.js के फोर्क पर धकेलना है; इसे अपने फोर्क में परिवर्तन अपलोड करने के रूप में सोचें।


GitHub डेस्कटॉप से, हेडर में शाखाएँ बदलने के बटन के ठीक दाईं ओर आपके परिवर्तनों को GitHub पर भेजने के लिए एक बटन है। अपने परिवर्तनों को आगे बढ़ाने के लिए इस पर क्लिक करें।![परिवर्तन करने के बाद GitHub डेस्कटॉप का एक दृश्य। परिवर्तनों को ऑनलाइन पुश करने का बटन लाल रंग में दर्शाया गया है।](../images/publish-branch.png)


एक बार आपका कोड अपलोड हो जाने पर, यह एक बटन दिखाएगा जो आपको पुल रिक्वेस्ट बनाने के लिए प्रेरित करेगा। बटन पर एक बार क्लिक करने से वास्तव में रिक्वेस्ट बनाने के लिए दूसरे बटन के साथ पूर्वावलोकन दिखाई देगा। प्रक्रिया शुरू करने के लिए "क्रिएट पुल रिक्वेस्ट" बटन दबाएँ।

![कोड पुश करने के बाद Github Desktop का स्क्रीनशॉट। बाएँ साइडबार में, यह लिखा है "0 changed items." दाएँ फलक में, "No local changes" शीर्षक के नीचे, एक नीला "Review Pull Request" बटन को लाल वृत्त के साथ चिह्नित किया गया है।](../images/preview-pull-request.png)

टर्मिनल से, निम्नलिखित कमांड चलाएँ:

```
git push -u origin [branch_name]
```

एक बार पुश पूरा हो जाने पर, आप टर्मिनल में एक लिंक देख सकते हैं जो आपको पुल रिक्वेस्ट खोलने की सुविधा देता है, यदि नहीं तो आप अपने वेब ब्राउज़र में अपने फोर्क पर नेविगेट कर सकते हैं, शीर्ष पर ड्रॉपडाउन बटन के साथ उस ब्रांच पर स्विच करें जिस पर आप काम कर रहे हैं फ़ाइल सूची में, "Contribute" पर क्लिक करें और फिर "Open pull request." पर क्लिक करें।

![](https://lh7-us.googleusercontent.com/xoqM9gLSFXyw7b3gzG8JlHqoO0zxHALbjSz93E3D0HNh4Jw2wDWdzHKUEchnB6hdjQC7hVn-o5prrXkLw2WiEOoVKJF6kpmyA65sirN0z-Vy3PBY3rCXC5Ifn5stQhcdUQxQS0rsVoW0_hlkfTcY8PQ)

जब आप p5.js Github रेपो पर जाते हैं तो आपको पुल रिक्वेस्ट खोलने के लिए एक बटन भी दिखाई दे सकता है। इसे क्लिक करने से एक नया पुल रिक्वेस्ट खोलने का भी काम किया जा सकता है।

![p5.js GitHub रिपॉजिटरी वेब पेज के मुख्य पृष्ठ का क्रॉप किया हुआ स्क्रीनशॉट। पृष्ठ के शीर्ष के पास एक अनुभाग एक पीला कॉल टू एक्शन बॉक्स है जिसमें "Compare & pull request" टेक्स्ट वाला हरा बटन है।](../images/recent-pushes)


### पुल रिक्वेस्ट के बारे में जानकारी

![GitHub पर "Open a pull request" पेज का स्क्रीनशॉट, जो p5.js के पुल रिक्वेस्ट टेम्पलेट से पहले से भरा हुआ है।](../images/new-pr.png)

पुल रिक्वेस्ट दाखिल करने से पहले, आपको पुल रिक्वेस्ट टेम्पलेट भरना होगा।


### शीर्षक

पुल रिक्वेस्ट शीर्षक में संक्षेप में वर्णन होना चाहिए कि परिवर्तन क्या हैं, फिर से यहां सामान्य बयानों से बचें।


### हल

टेम्प्लेट में, यह पंक्ति है `Resolves #[यहां समस्या संख्या जोड़ें]`, जिसे आपको `[यहां समस्या संख्या जोड़ें]` को उस समस्या की समस्या संख्या से बदलना चाहिए जिसे आप संबोधित/ठीक कर रहे हैं [above](https://github.com/processing/p5.js/blob/main/contributor_docs/contributor_guidelines.md#all-about-issues) (e.g., `Resolves #1234`). इससे यह सुनिश्चित हो जाएगा कि इस पीआर के विलय के बाद मुद्दा स्वचालित रूप से बंद हो जाएगा। यदि आप इस पीआर के विलय के बाद समस्या को स्वचालित रूप से बंद नहीं करना चाहते हैं (शायद इसलिए कि एक अलग पीआर में अधिक परिवर्तन आ रहे हैं), तो `Resolves` को `Addresses` में बदलें।



### परिवर्तन

आपको इस पीआर में आपके द्वारा किए गए परिवर्तनों का स्पष्ट रूप से वर्णन करना चाहिए। यहां आपके द्वारा किए गए किसी भी कार्यान्वयन विवरण और निर्णयों को शामिल करें जो इसकी समीक्षा करने वाले के लिए प्रासंगिक हों।


### परिवर्तन के स्क्रीनशॉट

परिस्थितियों के आधार पर यह वैकल्पिक है और p5.js कैनवास पर दृश्य कैसे प्रस्तुत करता है, उससे संबंधित परिवर्तन करते समय इसे शामिल किया जाना चाहिए। ध्यान दें कि यह टेक्स्ट एडिटर का स्क्रीनशॉट नहीं है बल्कि आपके परिवर्तनों के बाद एक उदाहरण स्केच के व्यवहार का स्क्रीनशॉट है।


### पीआर चेकलिस्ट

इसमें कुछ प्रासंगिक चेकलिस्ट आइटम शामिल हैं जिन्हें आपको अपने परिवर्तनों के लिए प्रासंगिक होने पर `[ ]` को `[x]` से प्रतिस्थापित करके टिक करना चाहिए।

एक बार हो जाने पर, "Create pull request." पर क्लिक करें।


### रिबेस और रेसोल्वे कनफ्लिक्ट 

![p5.js के GitHub रिपॉजिटरी पर एक ओपन पुल रिक्वेस्ट का स्क्रीनशॉट। पुल रिक्वेस्ट का शीर्षक कहता है "Fix filter shaders when rectMode is applied; add tests #6603.](../images/opened-pr.png)

अब आपको खुले हुए पुल रिक्वेस्ट का निरीक्षण करना चाहिए और कुछ बातों पर ध्यान देना चाहिए:

1. कमिट की संख्या आपके द्वारा किए गए कमिट की संख्या से मेल खाना चाहिए, जिसका अर्थ है कि यदि आपने इस पीआर पर काम करते समय दो बार कमिट किया है, तो इसे "Commits" टैब में केवल दो कमिट दिखाना चाहिए।
2. "Files changed" टैब को आपके द्वारा p5.js रेपो की तुलना में किए गए परिवर्तनों को दिखाना चाहिए और इससे अधिक कुछ नहीं।
3. नीचे के पास, यह लिखा होना चाहिए, "This branch has no conflicts with the base branch," न कि "This branch has conflicts that must be resolved."

यदि उपरोक्त में से कोई भी सत्य नहीं है (आपकी अपेक्षा से अधिक कमिट हैं या कनफ्लिक्ट हैं), तो आपको इसकी आवश्यकता हो सकती है[rebase](https://git-scm.com/book/en/v2/Git-Branching-Rebasing) या कनफ्लिक्ट को सुलझाने में मदद करें। यहां कनफ्लिक्ट का मतलब है कि आपने उस फ़ाइल में परिवर्तन किए हैं जिसमें हाल ही में परिवर्तन लागू किए गए थे, और गिट निश्चित नहीं है कि परिवर्तनों का कौन सा सेट रखा जाए या छोड़ दिया जाए। यदि आप इन मुद्दों को हल करने में आश्वस्त नहीं हैं, तो हमें बताएं और हम इस प्रक्रिया में आपका मार्गदर्शन करेंगे। बुनियादी निर्देश नीचे दिया गया है.

कभी-कभी, Github आपको कनफ्लिक्ट को हल करें बटन दिखाकर सीधे ब्राउज़र में कनफ्लिक्ट को हल करने देता है:![मर्ज कनफ्लिक्ट के साथ GitHub पुल रिक्वेस्ट का स्क्रीनशॉट। परस्पर विरोधी फ़ाइल नाम सूचीबद्ध हैं, और एक "Resolve conflicts" बटन हाइलाइट किया गया है।](../images/resolve-conflicts.png)

कनफ्लिक्ट को `<<<<<<<` और `>>>>>>>` के बीच दिखाया जाता है, जिसे `=======` से अलग किया जाता है। एक अनुभाग आपका कोड दिखाता है, और दूसरा अनुभाग दिखाता है कि मुख्य ब्रांच में क्या परिवर्तन हुआ है।

![GitHub के कनफ्लिक्ट समाधान इंटरफ़ेस का स्क्रीनशॉट। एक साइडबार कनफ्लिक्ट वाली फ़ाइलों को सूचीबद्ध करता है। दाएँ फलक में परस्पर विरोधी कोड है, जिसमें मर्ज विरोध मार्कर हाइलाइट किए गए हैं।](../images/conflicts-interface.png)

कनफ्लिक्ट चिह्न हटाएं और केवल अंतिम कोड रखें जो आप अपने पीआर में चाहते हैं। जब सभी विवादों का समाधान हो जाए तो आप "Mark as resolved" पर क्लिक कर सकते हैं।

![कनफ्लिक्ट विरोध मार्करों को हटाने के लिए कोड को संपादित करने के बाद GitHub कनफ्लिक्ट समाधान इंटरफ़ेस का एक स्क्रीनशॉट। ऊपर दाईं ओर  "mark as resolved" बटन सक्षम है।](../images/mark-as-resolved.png)

जब कनफ्लिक्ट वाली सभी फ़ाइलों का समाधान हो जाए, तो आप अपने परिवर्तन कर सकते हैं।

![सभी विरोधों के बाद GitHub कनफ्लिक्ट समाधान इंटरफ़ेस को समाधान के रूप में चिह्नित किया गया है। एक हरा "commit merge" बटन सक्षम है।](../images/commit-merge.png)

कभी-कभी, Github को वेब पर दिखाने के लिए कनफ्लिक्ट बहुत जटिल होते हैं। इस मामले में, या यदि आप केवल मैन्युअल विधि पसंद करते हैं, तो आप अपने विवादों को स्थानीय स्तर पर हल कर सकते हैं:

1. Run `git remote add upstream https://github.com/processing/p5.js`
2. Run `git fetch upstream`
3. Run `git rebase upstream/main`
4. आपके कंप्यूटर पर कुछ विवाद हो सकते हैं! यदि यह सिर्फ lib/p5.js और lib/p5.min.js है, तो इसे ठीक करना आसान है; बस प्रोजेक्ट फिर से बनाएं। यदि आपकी अन्य फ़ाइलों में कनफ्लिक्ट है और आप निश्चित नहीं हैं कि उन्हें कैसे हल किया जाए, तो सहायता माँगें!

```
npm test
git add -u
git rebase --continue
```

5. Run `git push`

इन चरणों के बाद उपरोक्त चेकलिस्ट साफ़ हो सकती है, लेकिन यदि नहीं, तो हम आपको किसी भी आवश्यक सुधार के माध्यम से मार्गदर्शन करेंगे।


## चर्चा करें और संशोधन करें

अब जब आपका पीआर खुल गया है, तो एक प्रबंधक या अनुरक्षक आपके पीआर की समीक्षा करेगा। किसी प्रबंधक को आपके पीआर का जवाब देने में कई दिन लग सकते हैं, इसलिए धैर्य रखें। इस बीच कुछ अन्य खुले मुद्दों की जांच करने के लिए समय का उपयोग क्यों न करें?

एक बार जब कोई प्रबंधक आपके पीआर की समीक्षा कर लेता है, तो दो चीजों में से एक हो सकती है: 1. आपका पीआर स्वीकृत और विलय हो गया है, 2. प्रबंधक पीआर के संबंध में कुछ प्रश्न पूछ सकता है या पीआर में कुछ बदलावों का अनुरोध कर सकता है। यदि यह बाद वाला है, तो घबराएं नहीं; यह बिल्कुल सामान्य है, और आपका योगदान पूरा करने में मदद के लिए प्रबंधक हमेशा यहाँ मौजूद हैं!

यदि आपके पीआर में परिवर्तन का अनुरोध किया गया है और आप वे परिवर्तन करने में सक्षम हैं, तो इस का पालन करें [same process as before](https://github.com/processing/p5.js/blob/main/contributor_docs/contributor_guidelines.md#git-workflow) लेकिन केवल रेपो और संबंधित ब्रांच की अपनी स्थानीय प्रतिलिपि से जारी रखें, उन परिवर्तनों को करें, उन्हें गिट में कमिट करें, और उन्हें अपने फोर्क किए गए रिमोट रेपो पर धकेलें। एक बार जब आप अपने फोर्कड रिमोट रेपो में अतिरिक्त कमिट्स डाल देते हैं, तो आप देखेंगे कि नए कमिट्स स्वचालित रूप से पीआर में दिखाई देंगे। समीक्षक को यह बताने के लिए पीआर में एक टिप्पणी छोड़ें कि आपने अनुरोधित परिवर्तन कर दिए हैं, और यदि कोई अतिरिक्त परिवर्तन की आवश्यकता नहीं है, तो आपका पीआर विलय कर दिया जाएगा!

[**⬆ back to top**](#contributor-guidelines)

