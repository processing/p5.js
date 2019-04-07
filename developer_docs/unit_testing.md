# Unit Testing

We use unit testing to ensure that individual components of the codebase work as we expect them to.

## References

[Here's a good, quick intro to unit testing with a similar tech stack](https://codeburst.io/javascript-unit-testing-using-mocha-and-chai-1d97d9f18e71), and [here's a more in depth walkthrough](https://blog.logrocket.com/a-quick-and-complete-guide-to-mocha-testing-d0e0ea09f09d)

## Running All the Unit Tests

In the repo root, use the following command in your terminal

```shellsession
npm test
```

### Running One Suite

To run a single test or group of tests, append `.only` on a `suite` or `test` in your `.js` file and run the tests using the above command.

**Be careful you don't commit `.only` though!** (We always want Travis CI to run _all_ the unit tests.)

#### An Example

To only run the "p5.ColorConversion" suite of tests, you would change the first line of `test/unit/color/color_conversion.js` to read:

```js
suite.only('color/p5.ColorConversion', function() {
```

Now when you use `npm test`, only tests within that `function()` will be run.

## Frameworks

We use [mocha](https://mochajs.org) for structuring and running the unit tests

We use [chai's `assert` (and `expect`)](https://www.chaijs.com/api/assert/) to write individual statements about how code should behave.

## Setup and Helpers

These are currently only available to the browser tests (where most of our tests run):

- `test/js/mocha_setup.js` configures a few options for mocha
- `test/js/chai_helpers.js` sets up chai and adds a couple helpful functions to `chai.assert`
- `test/js/p5_helpers.js` adds a couple helpers for testing p5 sketches

The setup for Node.js tests is all done in `test/mocha.opts`

## Testing Environments

We have a collection of tests under the `test/unit` folder that run in the browser and a collection of tests under `test/node` that run in Node.js.

The browser tests run in ["headless" Chrome](https://developers.google.com/web/updates/2017/06/headless-karma-mocha-chai). This is why you don't see a browser window pop up when you run the tests.
### Continuous Integration Testing

When you open a pull request in the p5.js repo, it will automatically run the tests [on Travis CI](https://travis-ci.org/processing/p5.js/pull_requests), too. Travis CI helps us double check that the tests pass for each pull request, with no extra work from individual contributors.
