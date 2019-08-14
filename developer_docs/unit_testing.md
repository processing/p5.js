# Unit Testing

We use unit testing to ensure that individual components of the codebase work as we expect them to.

## References

Here's a [good, quick intro to unit testing](https://codeburst.io/javascript-unit-testing-using-mocha-and-chai-1d97d9f18e71) with a similar tech stack, and here's a [more in depth walkthrough](https://blog.logrocket.com/a-quick-and-complete-guide-to-mocha-testing-d0e0ea09f09d)

## Running All the Unit Tests

In the repo root, use the following command in your terminal

```shellsession
npm test
```

## Test Coverage

Every time the tests are run, a coverage report is generated. This coverage report details which parts of which source code files were exercised by the test suite, effectively telling us how much of the codebase was tested.

A summary is printed out after running the tests, and you can view the detailed report at `coverage/index.html` in any web browser. You can run `open coverage/index.html` from the command line on Mac to open the page in your default web browser. 

### Running One Suite

To run a single test or group of tests, append `.only` on a `suite` or `test` in your `.js` file and run the tests using the above command.

**Be careful you don't commit `.only` though!** (We always want Travis CI to run _all_ the unit tests.)

#### An Example

To only run the "p5.ColorConversion" suite of tests, you would change the first line of `test/unit/color/color_conversion.js` to read:

```js
suite.only('color/p5.ColorConversion', function() {
```

Now when you use `npm test`, only tests within that `function()` body will be run.

## Infrastucture

### Frameworks

We use [mocha](https://mochajs.org) for structuring and running our unit tests

We use [chai's `assert` (and `expect`)](https://www.chaijs.com/api/assert/) to write individual statements about how code should behave.

### Environments

We have a collection of tests under the `test/unit` folder that run in the browser and a collection of tests under `test/node` that run in Node.js.

The browser tests run in ["headless" Chrome](https://developers.google.com/web/updates/2017/06/headless-karma-mocha-chai). This is why you don't see a browser window pop up when you run the tests.

### Setup and Helpers

These are currently only available to the browser tests (where most of our tests run):

- `test/js/mocha_setup.js` configures a few options for mocha
- `test/js/chai_helpers.js` sets up chai and adds a couple helpful functions to `chai.assert`
- `test/js/p5_helpers.js` adds a couple helpers for testing p5 sketches

The setup for Node.js tests is all done in `test/mocha.opts`

### Continuous Integration Testing

When you open a pull request in the p5.js repo, it will automatically run the tests [on Travis CI](https://travis-ci.org/processing/p5.js/pull_requests) too. Travis CI helps us double check that the tests pass for each pull request, with no extra work from individual contributors.

## Adding Unit Tests

If you want to add more unit tests, look and see if there's already a test file for the component you want to add tests for. Generally, tests for a given file in `src/` are at the same path under `test/unit`. (For example the tests for `src/color/p5.Color.js` are in `test/unit/color/p5.Color.js`.)

If you can't find one, that's probably because there aren't any tests for that file (yet 😉), so create a new file according to the conventions above. If the module you're testing requires a browser to work, you'll want to put it in `test/unit`, but if it doesn't, you might want to add it under `test/node`. **When in doubt, default to adding a browser test in `test/unit`! (It's pretty easy to move a later if we need to.)**

If you have to add a test file for a module to `test/unit`, then you'll also need to the module under test to the `spec` array in `test/unit/spec.js`. This will make sure the necessary modules are loaded for your test to run.
