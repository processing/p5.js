<!-- Guide to writing tests for p5.js source code.  -->

# Unit Testing

Unit testing is an essential part of how a large codebase can stay relatively bug-free. Unit tests are small pieces of code that aim to test individual components of a larger code base for correctness. For example, making sure a function is doing what it should be doing or a class is creating its object instances correctly.

p5.js uses unit tests to ensure the correctness of its various functions. Unit tests also ensure that any new changes to the library’s code do not introduce bugs or unexpected behavior elsewhere, called regression. Tests for p5.js are run whenever we use the `npm test` command in the terminal.

This guide will walk you through the process of writing unit tests for p5.js. If you are implementing a new function, adding a new feature to an existing function, or changing the behavior of a function, you should implement the relevant unit tests.


## Prerequisites

- p5.js foundation
- Contributor guidelines with local development setup
- Looking inside p5.js


## Files and folders

All test-related files for p5.js are located in the `test` folder. We won’t go through everything in this folder for this guide; we will instead focus on the `unit` subfolder, which contains all the unit tests for p5.js.

As you can see, the subfolders in the `unit` subfolder roughly correspond to the subfolders in the `src` folder containing the source code of p5.js. At the same time, the files in each subfolder also have a counterpart in the subfolders in the `src` folder. p5.js is composed of many different modules with many different functions in each module. The aim is to have relevant unit tests for every public function that p5.js provides.


## Testing frameworks

p5.js uses [Mocha](https://mochajs.org) as a test runner. It is responsible for running the test code as well as providing a solid framework for reporting test results (i.e., the very long output you see in the terminal when you run the tests!)

However, Mocha by itself doesn’t do any testing; for that, we need an assertion library. An assertion library is a collection of handy functions that lets us test various properties of our code, such as whether two values are equal, two values are of the same type, whether a function throws an error, and many more. p5.js uses [Chai's `assert` (and `expect`)](https://www.chaijs.com/api/assert/) to write individual statements about how the code should behave.


## Writing unit tests

To start writing unit tests, first pick a unit. A unit can be a function or a variable in p5.js. Let’s use `p5.prototype.keyIsPressed` as an example. Before beginning to write tests, we need to understand the expected behavior of this variable. The *expected behavior* is that the `keyIsPressed` variable should be `true` if any key is pressed and `false` if no keys are pressed. Now, you can think of various tests against this expected behavior. Possible test cases could be:

- the variable is a boolean
- it should be `true` if a key is pressed
- it should be `true` if any key is pressed - alphabet keys, number keys, special keys, etc.
- it should be `true` if multiple keys are pressed
- it should be `false` if no keys are pressed

In the example below, `suite()` and `test()` are both built-in functions provided by Mocha as part of the test environment. If you look into the test file (eg. `test/unit/events/keyboard.js`) you may find additional built-in functions such as `setup()` and `teardown()` as well. Each `suite()` describes a unit of p5.js that you are writing a test for (a function, a variable, etc). Each `test()` in a `suite()` is an individual test case that checks a single feature/behavior of the unit being tested. The first argument passed to `suite()` and `test()` is a description of the suite/test, and its purpose is to give clear output in the terminal for the test case.

- `p5.prototype.keyIsPressed` is the unit being tested in this suite.
- There are three tests in this suite:
  - The first test checks if `keyIsPressed` is a boolean value.
  - The second test checks if `keyIsPressed` is `true` on key press.
  - The third test checks if `keyIsPressed` is `false` when no keys are pressed

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

We have structured our tests above but we haven't written the tests yet. We will be using Chai's `assert` for that. In the test file (`test/unit/events/keyboard.js`), you should see a variable called `myp5` defined near the top, and the `setup()` section contains a callback function that creates a new instance mode sketch.

```js
let myp5;

setup(function(done) {
  new p5(function(p) {
    p.setup = function() {
      myp5 = p;
      done();
    };
  });
});
```

The `p` parameter, which is used in instance mode to access various p5.js variables and functions, is then assigned to `myp5`. This setup allows you to use `myp5` to access p5.js variables and functions anywhere in the testing code to test their functionalities.

Remember that, as previously mentioned, Mocha is a test runner but by itself doesn’t do any testing; we need Chai for that. Consider the following:

```js
test('keyIsPressed is a boolean', function() {
  //Asserts that value is a boolean.
  assert.isBoolean(myp5.keyIsPressed);
});
```

Chai provides many different assertion functions that you can use to create the actual test code, assertion here in practice means functions that checks for a condition, similar to an if statement, and if the condition is `false`, it will throw an error. In the example above, we use Chai’s `assert.isBoolean()` function to check that the type of the value of `myp5.keyIsPressed` is indeed a boolean value. You can look at Chai’s [documentation](https://www.chaijs.com/api/assert/) for all the available assertion functions that you can use to test all kinds of things.

Now that you have written the tests, run them and see if the method behaves as expected. If not, consider whether the tested source code is correct or the test code is not testing the behavior of the code correctly.


## Adding unit tests

If you want to add more unit tests, look and see if there's already a test file for the component you want to add tests for. Generally, tests for a given file in `src` are at the same path under `test/unit`. For example, the tests for `src/color/p5.Color.js` are in `test/unit/color/p5.Color.js`.

If you have added a new source code file in the `src` folder and would like to add the corresponding test file in `test/unit`, you can make a copy of an existing test file and then rename it to match the file name of your source file. In the new test file, you should delete the old test code before inserting your own, keeping the test setup and teardown code.

```js
suite('module_name', function() {
  let myp5;
  let myID = 'myCanvasID';

  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        let cnv = p.createCanvas(100, 100);
        cnv.id(myID);
        myp5 = p;
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });
});
```

After adding a test file for a module to `test/unit`, you'll also need to add the module under test to the `spec` object in `test/unit/spec.js`. This will make sure the necessary modules are loaded for your test to run.

```js
// test/unit/spec.js
var spec = {
  // ...
  typography: ['attributes', 'loadFont', 'p5.Font', 'yourModule'],
  // ...
};
```

To add actual tests, which are grouped into what is called a “suite” (representing a function/variable that is being tested), we expand on the test code with the following:

```js
suite('module_name', function() {
  let myp5;
  let myID = 'myCanvasID';

  setup(function(done) {
    new p5(function(p) {
      p.setup = function() {
        let cnv = p.createCanvas(100, 100);
        cnv.id(myID);
        myp5 = p;
        done();
      };
    });
  });

  teardown(function() {
    myp5.remove();
  });

  suite('p5.prototype.yourFunction', function() {
    test('should [test something]', function() {
      // Your test code and Chai assertions
    });
  });

  // More test suites as needed
});
```

This is also how you will add tests for existing modules for which you didn’t need to create a new test file.


## Conventions

Here are the conventions and best practices that p5.js uses for unit tests which you should follow when writing your own tests:

- Use a single `suite` for each p5.js function/variable being tested.
- Each `suite` representing a function/variable can contain as many `test`s as needed.
- Each `test` should be self-contained and not rely on any other modules in p5.js.
- Test code should be as minimal as possible and only test one thing at a time. Do not test if a value is a function while also testing if it accepts the correct arguments in a single `test`; use two `test`s instead.
- Prefer Chai `assert` when possible instead of `expect`.


## Running tests

The most straightforward way to run the tests is by using the `npm test` command in your terminal. However, `npm test` usually takes a long time to run simply because of the large number of test cases p5.js has. It can also sometimes be a bit repetitive to make some changes, run `npm test`, make some more changes, and run `npm test` again. Here are some tricks that can help streamline this process:

- Use the `npx grunt watch:main` command to automatically build and test p5.js whenever you save changes to p5.js source files. This will save you from having to manually run tests whenever you are making frequent changes to the codebase.
- You can mark certain test suites to be skipped or be the only suite that is run with the `.skip` and `.only` syntax.

  ```js
  // This test suite will not run
  suite.skip('p5.prototype.yourFunction', function() {

  });

  // Only this test suite will be run, all other suites will be ignored
  suite.only('p5.prototype.yourFunction', function() {

  });
  ```

- You can also run `grunt yui:dev` to launch a local server with the reference and a test runner. Once live, you can go to [`http://127.0.0.1:9001/test/test.html`](http://127.0.0.1:9001/test/test.html) to run tests live in your browser. This can be useful if you want to use a debugger in the middle of a test case or if you want to log complex objects. If you want to filter tests by the name of the test case, you can add a search term after a `?grep=` URL parameter, e.g.: [`http://127.0.0.1:9001/test/test.html?grep=framebuffer`](http://127.0.0.1:9001/test/test.html?grep=framebuffer)


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

