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
  assert.isBoolean(myp5.keyIsPressed); // Asserts that the value is a boolean.
});
```

Similarly we can use `assert.strictEqual(myp5.keyIsPressed, true)` to assert if the value is true. You can read more about chai's assert [here](https://www.chaijs.com/api/assert/)
Now that you have written the tests, run them and see if the method behaves as expected. If not, create an issue for the same and if you want, you can even work on fixing it!

## Visual tests

Visual tests are a way to make sure sketches do not unexpectedly change when we change the implementation of p5.js features. Each visual test file lives in the `test/unit/visual/cases` folder. Inside each file there are multiple visual test cases. Each case creates a sample sketch, and then calls `screenshot()` to check how the sketch looks.

```js
visualTest('2D objects maintain correct size', function(p5, screenshot) {
  p5.createCanvas(50, 50, p5.WEBGL);
  p5.noStroke();
  p5.fill('red');
  p5.rectMode(p5.CENTER);
  p5.rect(0, 0, p5.width/2, p5.height/2);
  screenshot();
});
```

If you need to add a new test file, add it to that folder, then add the filename to the list in `test/visual/visualTestList.js`. Additionally, if you want that file to be run automatically as part of continuous integration on every pull request, add the filename to the `visual` list in `test/unit/spec.js`.

When you add a new test, running `npm test` will generate new screenshots for any visual tests that do not yet have them. Those screenshots will then be used as a reference the next time tests run to make sure the sketch looks the same. If a test intentionally needs to look different, you can delete the folder matching the test name in the `test/unit/visual/screenshots` folder, and then re-run `npm test` to generate a new one.

To manually inspect all visual tests, run `grunt yui:dev` to launch a local server, then go to http://127.0.0.1:9001/test/visual.html to see a list of all test cases.


In a continuous integration (CI) environment, optimizing test speed is essential. It is advantageous to keep the code concise, avoid unnecessary frames, minimize canvas size, and load assets only when essential for the specific functionality under test.
To address scenarios involving operations like asynchronous 3D model rendering, consider returning a promise that resolves upon completing all the necessary tests, ensuring efficiency in your visual testing approach. Here's an example of how you can asynchronous 3D model rendering in your visual tests:

```js
visualSuite('3D Model rendering', function() {
  visualTest('OBJ model is displayed correctly', function(p5, screenshot) {
    // Return a Promise to ensure the test runner waits for the asynchronous operation to complete
    return new Promise(resolve => {
      p5.createCanvas(50, 50, p5.WEBGL);
      // Load the model asynchronously
      p5.loadModel('unit/assets/teapot.obj', model => {
        p5.background(200);
        p5.rotateX(10 * 0.01);
        p5.rotateY(10 * 0.01);
        p5.model(model);
        // Take a screenshot for visual comparison
        screenshot();
        // Resolve the Promise to indicate completion
        resolve();
      });
    });
  });
});
```
