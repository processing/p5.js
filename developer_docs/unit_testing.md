# Unit Testing

We use unit testing to ensure that individual components of the codebase work as we expect them to.

We have a collection of tests under the `test/unit` folder that run in the browser and a collection of tests under `test/node` that run in node.

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

These are currently only available to the browser tests (where most of our tests run).

- `test/js/mocha_setup.js`
- `test/js/chai_helpers.js` sets up chai and adds a couple helpful functions to `chai.assert`
- `test/js/p5_helpers.js` adds a couple helpers for testing p5 sketches

The setup for Node.js tests is all done in `test/mocha.opts`
