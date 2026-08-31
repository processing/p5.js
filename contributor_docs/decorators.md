# Decorators in p5.js and addons

In programming, a [decorator](https://en.wikipedia.org/wiki/Decorator_pattern) helps to reduce duplicated code. In p5.js, decorators are applied using `p5.registerDecoration(pattern, decorator)`. This guide is for p5.js code contributors who would like to learn when to use a decorator, and how.

The p5.js Decorators API is mainly aimed at addon authors (see also: guide for [creating addon libraries](https://p5js.org/contribute/creating_libraries/)), but is also used throughout the p5.js library code. In this guide, we use examples from p5.js.

## When and Why to Use a Decorator

Decorators are a design pattern for having **one place** where repeated logic is maintained (in our example, the [vector parameter validation](https://github.com/processing/p5.js/blob/522b89ecc85e6ba4442ba40c69d96c6a5d00c839/src/math/patch-vector.js#L85)), but it is still applied in multiple files. The purpose is avoiding duplicate code, because:

1. Duplicate code makes maintenance harder: when the validation logic has to be updated, the contributor has to remember all the different places where the update needs to be applied
2. Duplicate code makes bugs or regressions more likely: when updates or fixes are not applied in all necessary places

The p5.js library already uses decorators in:

* The Friendly Error System parameter validation ([code](https://github.com/processing/p5.js/blob/522b89ecc85e6ba4442ba40c69d96c6a5d00c839/src/friendly_errors/param_validator.js#L656))
* Flagging experimental functions ([code](https://github.com/processing/p5.js/blob/522b89ecc85e6ba4442ba40c69d96c6a5d00c839/src/core/experimental.js#L17))
* Vector binary functions (like multiply and divide) parameter validation ([code](https://github.com/processing/p5.js/blob/522b89ecc85e6ba4442ba40c69d96c6a5d00c839/src/math/patch-vector.js#L85))

All these uses are good examples of when a decorator is useful. Two of these examples are parameter validation: checking that parameters are well-formatted usually takes a few lines, and these lines have to be repeated in every function that has similar requirements. For example, for adding, subtracting, dividing, and multiplying vectors, the validation process is very similar.

## How to Use a Decorator

The main usage is `p5.registerDecoration(pattern, decorator)`, where `pattern` specifies **where** to run the code, and `decorator` specifies **what** code to run.

Consider the example the Friendly Error System (FES) parameter validation ([code](https://github.com/processing/p5.js/blob/522b89ecc85e6ba4442ba40c69d96c6a5d00c839/src/friendly_errors/param_validator.js#L656)). The comments below were added for this guide.

```js
  p5.registerDecorator(

    // This is the pattern. Any function where the path starts with
    // `p5.prototype`, pattern will be true.
    ({ path }) => {
      return path.startsWith('p5.prototype');
    },

    // This is the decorator code. It always expects a `target` first
    // and this is what the function being called is. 
    function (target, { kind, name }) {
      if (kind === 'method') {
        return function (...args) {
          if (p5.disableFriendlyErrors) {

            // When this is called, the decorators' work is done;
            // the original function is called with its original arguments
            return target.apply(this, args);
          }
          const wasInternalCall = this._isUserCall;
          this._isUserCall = true;
          try {
            if (
              !wasInternalCall &&
              !p5.disableFriendlyErrors &&
              !p5.disableParameterValidator
            ) {
              validate(name, args);
            }
            return target.apply(this, args);
          } finally {
            this._isUserCall = wasInternalCall;
          }
        };
      }
    }
  );
```

In the above example, notice that `return target.apply(this, args);` is always called. But the decorator decides - based on global settings and parameter validation logic - whether to also print some errors. That means FES errors can be printed, but this is managed entirely in this one decorator - never on individual functions being decorated and validated.

Next, we will show step by step how to add a decorator. These steps are adapted from `Vector` parameter validation, so if you'd prefer a practical example, check [this code](https://github.com/processing/p5.js/blob/522b89ecc85e6ba4442ba40c69d96c6a5d00c839/src/math/patch-vector.js#L85) that defines and applies the decorators in `vectorValidation`. Then, the whole set of decorators is also added to p5 [here](https://github.com/processing/p5.js/blob/522b89ecc85e6ba4442ba40c69d96c6a5d00c839/src/math/index.js#L16) with `p5.registerAddon(vectorValidation);`. Notice how this code changes the behavior of `add`, `sub`, and other binary operations on `Vector`, but without ever modifying the files where those methods are created.

### Step 1: Define behavior

First, create a new function, which will be our `decorator`:

```js
/**
 * @private
 * @internal
 */
export function _exampleDecorator(target, ...args) {
  console.log(`Hi! The function ${target.name || 'anonymous'} has been called with ${args.length} arguments`);
  return target.call(this, args);
}
```

When this decorator is applied to any function, it will print the message, and then execute the function as usual.

Please include the **@private** and **@internal** tags in docstrings, to make sure these functions to not appear in the public reference; in general, they are not intended to be part of the public API.

### Step 2: Register decorator

Second, use `pattern` to register the decorator on various targets. You can use path comparison (as in the FES example above), or text:

```js
p5.registerDecorator('p5.prototype.createVector', _exampleDecorator);
p5.registerDecorator('p5.Vector.prototype.mult', _exampleDecorator);
```

Notice that `_exampleDecorator` is passed as a function. The Decorator API will then call the `decorator` function with the target and arguments when the `pattern` is matched.

## Contributing

In p5.js, decorators are supported since [version 2.3.0](https://github.com/processing/p5.js/releases/tag/v2.3.0), and [partially implement the TC39 proposal](https://github.com/processing/p5.js/issues/8334). Unlike the TC39 proposal, the implementation in p5.js needs to be applied at runtime and after all addons are registered but before the p5 instance is created. Contribution to help maintain decorator usage in p5.js, its implementation, and documentation (especially documentation for addon authors) is welcome!
