<!-- How all the updates on GitHub get turned into a new version of the library. -->

# Release process

## Approach

- We follow the [semver](https://semver.org/) versioning pattern, which means we follow this versioning pattern: `MAJOR:MINOR:PATCH`.

## Requirements

- Git, node.js and NPM installed on your system
- You are able to build the library and have push access to the remote repository
- Secret `NPM_TOKEN` value is set on the remote repository
- Secret `ACCESS_TOKEN` value is set on the remote repository

## Security tokens

For the release steps to run fully, two [repository secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository) must be set as below.

- `NPM_TOKEN` can be created by following the steps [here](https://docs.npmjs.com/creating-and-viewing-access-tokens) to create a read and publish token. The user the token belongs to must have publish access to the project on NPM.
- `ACCESS_TOKEN` is a personal access token for a user that has access to `p5.js`, `p5.js-website`, and `p5.js-release` repositories. The token can be generated using the steps [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) and for scopes, choose only `repo` and `workflow`. It is recommended to use an organization specific account for this (ie. not from a personal account) and limit the account's write access to only the required repositories.

## Usage

```sh
$ git checkout main
$ npm version [major|minor|patch] # Choose the appropriate version tag
$ git push origin main
$ git push origin v1.4.2 # Replace the version number with the one just created above
```

The actual release steps are all run on GitHub Actions CI.

## Monitor and check results

Once the above commands have been executed, the build and release action can be monitored from the ["Actions" tab](https://github.com/processing/p5.js/actions) on the p5.js GitHub repo page (look for a job that says "New p5.js release"), clicking into the job can give a more detailed job log of what's running.

![Screenshot of GitHub action running the "New p5.js release" job](images/release-action.png)

Once the job has completed, the library will have been released on GitHub and NPM. Check the [release](https://github.com/processing/p5.js/releases) and [NPM](https://www.npmjs.com/package/p5) pages to see that the latest version is released. You should view the draft release on GitHub, make changes to changelog if necessary, then publish the release.

The website will be updated as soon as its own build and deploy job is completed, this can also be monitored in the relevant ["Actions" page](https://github.com/processing/p5.js-website/actions) if desired, and after that check the ["Downloads" page](https://p5js.org/download/) on the website for the latest version number.

CDNs will take a bit more time (a day or two) to update but they will automatically pull from NPM upon release so no specific action is required.

## Pre-releases and continuous builds

### Release candidates

Minor and major releases get one or more release candidates (RCs) before the final version. RC versions use the format `x.y.z-rc.N` and are released like a regular release, by pushing a tag such as `v2.4.0-rc.1`. The suffix is `-rc` rather than `-beta` to avoid confusion with [beta.p5js.org](https://beta.p5js.org), the p5.js 2.x site.

The [2.x release workflow](../.github/workflows/release-workflow-v2.yml) detects the `-rc` suffix in the tag and:

- Publishes the version to NPM under the `beta` dist-tag, so testers can install it with `npm install p5@beta` while `latest` stays on the current stable version.
- Creates a draft GitHub release marked as a pre-release, with the built files (`p5.js`, `p5.min.js`, `p5.esm.js` and `p5.zip`) attached.
- Skips the website update steps, which only run for final releases.

The [v1 release workflow](../.github/workflows/release-workflow-v1.yml) also marks `-rc` tags as GitHub pre-releases, but does not publish them to NPM.

### Patch releases

From 2.3.2 onwards, patch releases ship directly, without a release candidate. They are made from the [`stable`](https://github.com/processing/p5.js/tree/stable) branch: isolated or critical fixes are collected with the [`Patch` label](https://github.com/processing/p5.js/issues?q=label%3APatch) and either target `stable` directly or are cherry-picked into it by a maintainer.

### Continuous builds

Every pull request against `main`, and every commit pushed to `main` or `stable`, is built and published to [pkg.pr.new](https://pkg.pr.new) by the [continuous release workflow](../.github/workflows/continuous-release.yml). This makes it possible to test any PR or recent commit without building the library from source:

```sh
$ npm install https://pkg.pr.new/processing/p5.js/p5@9167    # by PR number
$ npm install https://pkg.pr.new/processing/p5.js/p5@5c627cd # by commit SHA
```

### Reporting issues

If you find a bug while testing an RC or a continuous build, please [open an issue](https://github.com/processing/p5.js/issues/new/choose) and mention the exact version, PR number, or commit you were testing.

---

## What's actually happening

The GitHub Actions ["New p5.js v1 release"](../.github/workflows/release-workflow-v1.yml) and ["New p5.js 2.x release"](../.github/workflows/release-workflow-v2.yml) are triggered on tags that match the patterns `v1.*.*` and `v2.*.*` respectively, which are created by the `npm version ___` command.

Once triggered, it will run the following steps:

1. Clone the repository, setup node.js, extract version number, install dependencies with `npm`, and run test with `npm test`.
2. Create the release files that will be uploaded to GitHub releases.
3. Create a release on GitHub and publish latest version on NPM.
4. Update website files
   1. Clone the website repository
   2. Copy `data.json` and `data.min.json` to the right location
   3. Copy `p5.min.js` to the right location
   4. Update `data.yml` file with latest version number
   5. Update `en.json` file based on `data.min.json`
   6. Commit and push the changes back to the website repository
5. Update Bower files
   1. Clone the Bower release repository
   2. Copy all libraries files to the right location
   3. Commit and push the changes back to the website repository

In principle, we try to concentrate as many steps as possible to be run in one place, ie. in the CI environment. If a new step that is only run on release is required, it should probably be defined in the CI workflow and not as part of the build configuration.

## Testing

As the release steps are run in CI, testing them can be difficult. Using [act](https://github.com/nektos/act) to test running of the steps locally is possible (and was how they were tested while being developed) but requires some temporary modifications to the workflow definition, we'll roughly document here as the precise steps will likely change over time.

The test steps will not run because not all system requirements are present to run the mocha Chrome tests. Some system dependencies will likely be needed to be installed with `apt` before setting up the rest of the environment. Keep an eye on the error messages which should give some information on what packages are missing.

The steps concerning pushing changes to remote repositories should be commented out to avoid accidentally pushing unintended changes.