Hi there! Welcome to p5.js contributing! Here are a few things to know:

The GitHub issues are for bugs and feature requests for the p5.js library itself. If you have a general question or bug programming with p5.js please post it in the [p5.js forum](https://discourse.processing.org/c/p5js) or ask in our [Discord server](https://discord.gg/SHQ8dH25r9) (check the #contribute-to-p5 channel).

Please make sure you are posting to the correct repository. See this [section](https://github.com/processing/p5.js/blob/main/README.md#issues) for a list of all p5.js repositories.

Please be sure to review our [community statement](https://p5js.org/about/#community-statement) and [code of conduct](https://github.com/processing/p5.js/blob/main/CODE_OF_CONDUCT.md).  These things are very important to us.

Check out the [contributor docs](https://p5js.org/contribute/) for more in-depth details about contributing code, bug fixes, and documentation.

## Contributor Guidelines (key points)

The following are some key points from our [contributor guidelines](https://p5js.org/contribute/contributor_guidelines/). Please read the full document for more details.

### Get Assigned Before Working on an Issue
You should not “jump the queue” by filing a PR for an issue that either someone else has indicated willingness to submit a contribution or has already been assigned to someone else. We will always prioritize the “first assigned, first serve” order for accepting code contributions for an issue. If you file a PR for an issue while someone else is still working on the same issue, your PR will likely be closed.

### You may follow up on Stalled Issues
If you see that it has been a few weeks since the last activity on an issue with an assigned individual, you can leave a polite comment on the issue asking for progress and if they need help with the implementation. We generally allow for people to work on their contributions at their own pace, as we understand that most people will often be working on a volunteer basis, or it simply takes more time for them to work on the feature.

### Only Issues Approved for Implementation May Be Worked On
You should not file a pull request (or start working on code changes) without a corresponding issue or before an issue has been approved for implementation, that is because there is no guarantee that the proposal will be accepted. Any pull requests filed before a proposal has been approved will be closed until approval is given to the issue.

### Include Unit Tests
Add any unit tests if you are working on adding new features or feature enhancement. Frequently run `npm test` and make sure all existing and new tests pass before submitting a PR.

### Follow Code Standards
Make sure your code follows the established code standards for p5.js. Any git commit and pull request must pass linting before it will be accepted. The easiest way for you to follow the right coding standard is to use the ESLint plugin available for your text editor with linting error highlighting (available for most popular text editors).

### Preparing Pull Requests
After making the changes you need to make, including unit tests if applicable, `npm test` does not error, and you have committed the changes, you can start preparing a pull request (PR) to get your new commits merged into the official p5.js repository. A pull request, more formally, is a request to a repo (in this case, the official p5.js repo) to pull or merge changes from another repo (in this case, your forked p5.js repo) into its commit history.

## AI Usage Policy
This project does *not* accept fully AI-generated contributions. AI tools may be used assistively only. As a contributor, you should be able to understand and take responsibility for changes you make to the codebase.

Agents and AI coding assistants must follow the guidelines in `./AGENTS.md` and read the full [contributor_guidelines.mdx](https://raw.githubusercontent.com/processing/p5.js-website/main/src/content/contributor-docs/en/contributor_guidelines.mdx).

Please read the [AI Usage Policy](./AI_USAGE_POLICY.md) and [AGENTS.md](./AGENTS.md) before proceeding.