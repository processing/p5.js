Hi there! Welcome to p5.js contributing! Here are a few things to know:

The GitHub issues are for bugs and feature requests for the p5.js library itself. If you have a general question or bug programming with p5.js please post it in the [p5.js forum](https://discourse.processing.org/c/p5js).

Please make sure you are posting to the correct repository. See this [section](https://github.com/processing/p5.js/blob/main/README.md#issues) for a list of all p5.js repositories.

Please be sure to review our [community statement and code of conduct](https://github.com/processing/p5.js/blob/main/CODE_OF_CONDUCT.md). These things are very important to us.

Check out the [contributor docs](https://github.com/processing/p5.js/blob/main/contributor_docs/) for more in-depth details about contributing code, bug fixes, and documentation.

# Quick Get Started For Developers

If you want to work/contribute to p5.js'🌸 codebase as a developer, either directly for improving p5.js or for improving its sub-projects like [Friendly Error Systems](./friendly_error_system.md), you can follow the following steps:

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
9. Once done, you can commit the changes and create a [Pull Request](#pull-requests).

# Confirming Upstream Remote Addition

To confirm that the upstream remote has been added, you can use the following command:

```
git remote -v
```

This will list all the remote repositories associated with your local repository. You should see an entry for `upstream` pointing to `https://github.com/processing/p5.js`.

