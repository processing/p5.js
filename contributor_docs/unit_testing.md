# Unit Testing

We use unit testing to ensure that individual components of the codebase work as we expect them to.

## References

Here's a [good, quick intro to unit testing](https://codeburst.io/javascript-unit-testing-using-mocha-and-chai-1d97d9f18e71) with a similar tech stack, and here's a [more in depth walkthrough](https://blog.logrocket.com/a-quick-and-complete-guide-to-mocha-testing-d0e0ea09f09d)

## Running All the Unit Tests

In the repo root, use the following command in your terminal

```shellsession
$ npm test
```

## Test Coverage

Every time the tests are run, a coverage report is generated. This coverage report details which parts of which source code files were exercised by the test suite, effectively telling us how much of the codebase was tested.

A summary is printed out after running the tests, and you can view the detailed report at `coverage/index.html` in any web browser. You can run `open coverage/index.html` from the command line on Mac to open the page in your default web browser. You can also see the coverage report after running the tests in the Terminal using the command `npx nyc report --reporter=text`.

### Running One Suite

To run a single test or group of tests, append `.only` on a `suite` or `test` in your `.js` file and run the tests using the above command.

**Be careful you don't commit `.only` though!** (We always want our CI to run _all_ the unit tests.)

#### An Example

To only run the "p5.ColorConversion" suite of tests, you would change the first line of `test/unit/color/color_conversion.js` to read:

```js
suite.only('color/p5.ColorConversion', function() {
```

Now when you use `npm test`, only tests within that `function()` body will be run.

### Skipping a test suite

This feature is the inverse of `.only()`. By appending `.skip()`, you may tell Mocha to simply ignore these suite(s) and test case(s). Anything skipped will be marked as pending, and reported as such.

## Infrastructure

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

When you open a pull request in the p5.js repo, it will automatically [run the tests](https://github.com/processing/p5.js/actions). This helps us double check that the tests pass for each pull request, with no extra work from individual contributors. It also automatically uploads the coverage reports to [Codecov](https://codecov.io/github/processing/p5.js).

## Adding Unit Tests

If you want to add more unit tests, look and see if there's already a test file for the component you want to add tests for. Generally, tests for a given file in `src/` are at the same path under `test/unit`. (For example the tests for `src/color/p5.Color.js` are in `test/unit/color/p5.Color.js`.)

If you can't find one, that's probably because there aren't any tests for that file (yet 😉), so create a new file according to the conventions above. If the module you're testing requires a browser to work, you'll want to put it in `test/unit`, but if it doesn't, you might want to add it under `test/node`. **When in doubt, default to adding a browser test in `test/unit`! (It's pretty easy to move a later if we need to.)**

If you have to add a test file for a module to `test/unit`, then you'll also need to the module under test to the `spec` array in `test/unit/spec.js`. This will make sure the necessary modules are loaded for your test to run. You can view these tests in the browser by viewing the `test/test.html` file.

### Writing Unit Tests

Pick a unit, it can be a method or a variable to test. Lets use `p5.prototype.keyIsPressed` as an example. Before beginning to write tests, we need to understand the expected behaviour of this method.
**Expected behaviour:** The boolean system variable should be true if any key is pressed and false if no keys are pressed.
Now you can think of various tests against this expected behaviour. Possible test cases could be:

- the variable is a boolean
- it should be true if a key is pressed
- it should be true if any key is pressed - alphabet keys, number keys, special keys etc
- it should be true if multiple keys are pressed
- it should be false if no keys are pressed
- if you can think of more, go ahead and add tests for them!

We can create a test suite for `p5.prototype.keyIsPressed` and start creating tests for it. We will use mocha for structuring our unit tests.

```js
suite('p5.prototype.keyIsPressed', function() {
  test('keyIsPressed is a boolean', function() {
    //write test here
  });

  test('keyIsPressed is true on key press', function() {
    //write test here
  });

  test('keyIsPressed is false when no keys are pressed', function() {
    //write test here
  });
});
```

We have structured out tests but we haven't written the tests yet. We will be using chai's assert for that.
Consider the following:

```js
test('keyIsPressed is a boolean', function() {
  assert.isBoolean(myp5.keyIsPressed); //Asserts that value is a boolean.
});
```

Similarly we can use `assert.strictEqual(myp5.keyIsPressed, true)` to assert if the value is true. You can read more about chai's assert [here](https://www.chaijs.com/api/assert/)
Now that you have written the tests, run them and see if the method behaves as expected. If not, create an issue for the same and if you want, you can even work on fixing it!
