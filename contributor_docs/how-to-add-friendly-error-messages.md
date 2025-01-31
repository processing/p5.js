<!-- Looking for a way to support Friendly Errors in your new method? Follow this step-by-step guide! -->

# How to add Friendly Error Messages

This guide walks you through the steps to write Friendly Error (FE) messages using the Friendly Error System (FES, 🌸). If your new method supports custom error handling or outputs custom logs for the user, you may want to write FE messages for it. All these messages are dynamically generated through the [i18next](https://www.i18next.com/)-based `translator()` method, which allows p5.js to provide translations of the error messages matching the user environment.


## ❗️No translations in `p5.min.js`

- We've integrated \[i18next] into our codebase. However, its usage is limited to the unminified build of p5.js. The minified version, `p5.min.js`, includes only the basic framework of our internationalization code without actual implementation.
- In both the Browserify build task and `src/core/init.js`, there is specific logic to avoid loading or setting up translations in the minified build. As a result, adding translations does not affect the size of `p5.min.js`.


## Prerequisites

Before we begin, identify which one of the following cases describes your case best:

- You are adding a new method that requires a specific number and types of arguments.
  - Go to [✅Adding Parameter Validation Using FES](#-adding-parameter-validation-using-fes).
- Your method involves loading a type of file and you need to catch errors specific to loading files.
  - Go to [📥 Adding File Loading Errors Using FES](#-handling-file-loading-error-messages-with-fes).
- You have written code that detects when an error has occurred and you want to show a Friendly Error.
  - Go to [🐈 Adding Library Error Messages Using FES](#-adding-library-error-messages-using-fes).



## ✅ Adding parameter validation using FES

### Step 1 – Double-check your inline documentation

First, ensure your method has [inline documentation](./contributing_to_the_p5js_reference.md) with the full list of your parameters.

For example, the `circle()` method has the following inline documentation that starts with a description of the method, followed by a parameter list, and then code for an example:

```
/**
 * Draws a circle on the canvas. A circle is a round shape. Every point on the
 * edge of a circle is the same distance from its center. By default, the first
 * two parameters set the location of the center of the circle. The third
 * parameter sets the shape's width and height (diameter). The origin may be
 * changed with the <a href="#/p5/ellipseMode">ellipseMode()</a> function.
 *
 * @method circle
 * @param  {Number} x  x-coordinate of the center of the circle.
 * @param  {Number} y  y-coordinate of the center of the circle.
 * @param  {Number} d  diameter of the circle.
 * @chainable
 * @example
 * <div>
 * <code>
 * circle(30, 30, 20);
 * describe('A white circle with black outline in the middle of a gray canvas.');
 * </code>
 * </div>
 *
 */
```

From the above example, FES will look for the parameter list to validate arguments:

```
 * @method circle
 * @param  {Number} x  x-coordinate of the center of the circle.
 * @param  {Number} y  y-coordinate of the center of the circle.
 * @param  {Number} d  diameter of the circle.
```


### Step 2 – Call `p5._validateParameters()`

Now go back to the implementation of your method and call `validate_params()` following the format: `p5._validateParameters('[name of your method]', arguments);`. 

For example, the following code will validate arguments and produce a FE message for `circle()`:

```js
p5._validateParameters('circle', arguments);
```

This is usually called before anything else happens in the method to avoid going any further if the provided arguments don't match our expectations. For example, it is called on the first line of the `circle()` method:

```js
p5.prototype.circle = function() {
  p5._validateParameters('circle', arguments);
  const args = Array.prototype.slice.call(arguments, 0, 2);
  args.push(arguments[2]);
  args.push(arguments[2]);
  return this._renderEllipse(...args);
};
```


### Step 3 – Build and test your code for typical cases

To see parameter validation in action, rebuild `p5.js` using `npm run build`.  

To test your code, find `/lib/empty-example/index.html` and replace the script `../p5.min.js` with `../p5.js`, as seen in the below example:

```js
<script src="../p5.js"></script>
```

Note that  `lib/p5.min.js` doesn’t support FE messages, so test using `lib/p5.js` instead.

Then, edit `/lib/empty-example/sketch.js` to test typical parameter error cases:

1. Missing argument(s)
2. Wrong number of argument(s)
3. Wrong type(s) of arguments

Here is an example to test expressions for the `circle()` method:

```js
// Missing arguments
circle(100);
// Wrong number of arguments (more than required)
// Notice this code still successfully draws a circle.
circle(100, 100, 100, 1000);
// Wrong type(s) of argument(s)
circle(100, 100, 'hello');
```

The code above should generate the following FE messages:

```
🌸 p5.js says: [sketch.js, line 9] circle() was expecting at least 3 arguments, but received only 1. (https://p5js.org/reference/p5/circle)
🌸 p5.js says: [sketch.js, line 14] circle() was expecting no more than 3 arguments, but received 4. (https://p5js.org/reference/p5/circle)
🌸 p5.js says: [sketch.js, line 12] circle() was expecting Number for the third parameter, received string instead. (https://p5js.org/reference/p5/circle)
```

Congratulations 🎈! You are now done adding parameter validation for your new method.


## 📥 Handling file loading error messages with FES

### Step 1 – Check the list of file loading error cases<a id="step-1"></a>

File load errors are divided into a number of distinct cases to provide as helpful a message as possible when the error occurs. This lets p5.js show separate errors in different situations. For example, when it can't read the data in a font file, it will show a different error than it would when it tries to load a file that is too large to read.

These cases are each given their own number and can be found at the top of the `core/friendly_errors/file_errors.js` file.

When you are looking to add a file loading error, first, look at `fileLoadErrorCases` from `core/friendly_errors/file_errors.js` to see if there is an existing case that can be applied to your case.

 

For example, you may be loading a string-based file. This corresponds to `case 3` from `fileLoadErrorCases`:

```js
case 3:
  return {
    message: translator('fes.fileLoadError.strings', {
      suggestion
    }),
    method: 'loadStrings'
  };
```

If there is already a number associated with the scenario you are handling, remember the case number, and skip ahead to [**Step 4**](#step-4). If you can’t find a matching case from `fileLoadErrorCases`,  please go to [**Step 2**](#step-2) to create a new case.


### Step 2 – Discuss adding a new error case on the issue board<a id="step-2"></a>

Next, you will file an issue ticket to discuss creating a new case or confirm your case is not a duplicate of the existing cases. Write a short paragraph describing your new method and the scenario where a user will run into this particular file load error. Then write another short paragraph describing error handling in your method and what type of file it loads.

Go to the [issue board](https://github.com/processing/p5.js/issues), press the "New Issue" button, and then choose the "Issue: 💡 Existing Feature Enhancement" option. An empty form should appear.

Add a title along the lines of “Adding a new case to `fileLoadErrrorCases`: \[a high-level description of your file load error case].” For the “Increasing access” section, enter a short paragraph on the typical scenario you prepared at the beginning of this step.

Then, check the “Friendly Errors” box for the “Most appropriate sub-area of p5.js?” question. Lastly, for the “Feature enhancement details” section, enter your paragraph detailing your error handling and what file types it loads.


### Step 3 – Add a new case to `fileLoadErrorCases`<a id="step-3"></a>

After confirming with the maintainers, you are ready to add a new case to `fileLoadErrorCases`. Inside `fileLoadErrorCases`’s `switch` statement, go to the end of the case list and add your new case following the below format:

```
case {{next available case number}}:
  return {
    message: translator('fes.fileLoadError.{{tag name}}', {
      suggestion
    }),
    method: '{{name of your method}}'
  };
```

In the example above, anything in double angle brackets (`{{}}`) is something that you should replace. For instance, if the previous case number was 11, your code should start with `case 12:` with no double braces in your final code. 


### Step 4 – Call `p5._friendlyFileLoadError()`<a id="step-4"></a>

After adding your case, you can now call `p5._friendlyFileLoadError([case number], [file path])` inside your error handling statements.

For example, please take a look at `loadStrings()` method loading a string-based file (which corresponds to `case 3` from `fileLoadErrorCases`). The  `loadStrings()` method uses [`httpDo.call()`](https://p5js.org/reference/p5/httpDo) with a custom callback method that is executed in the case of a file error:

```js
p5.prototype.httpDo.call(
  this,
  args[0],
  'GET',
  'text',
  data => {
    // [... code omitted ...]
  },
  function(err) {
    // Error handling
    p5._friendlyFileLoadError(3, args[0]);
    // [... code omitted ...]
  }
 );
```

We can see how the error callback function calls `p5._friendlyFileLoadError(3, [the first argument, which is a file path])` to generate the following FE message:

```
🌸 p5.js says: It looks like there was a problem loading your text file. Try checking if the file path (assets/wrongname.txt) is correct, hosting the file online, or running a local server.
+ More info: https://github.com/processing/p5.js/wiki/Local-server
```

Congratulations 🎈! You are now done implementing FE for your method with file loading.



## 🐈 Adding Library Error Messages Using FES

### Step 1 – Write code to detect when an error has occurred

First, look for typical error cases that users may run into using your method and create a logic to catch these cases. Also, if applicable, consider providing fail-safes such as using default values for missing parameters. Identify the cases where FE messages would be helpful for the users.

[This guide from MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling) provides a good overview of options for control flow and JavaScript’s native error handling constructs.

\



### Step 2 – Call `p5._friendlyError()`

To generate FE messages, all you need to do is call `p5._friendlyError()` inside your error handling statements following the format: `p5._friendlyError('[custom message]', '[method name]');`. Replace everything inside (and including) the square brackets with your own values.

For example, the following code will produce a FE message for `bezierVertex()`:

```js
p5._friendlyError(
  'vertex() must be used once before calling bezierVertex()',
  'bezierVertex'
);
```

This should generate the following FE messages:

```
🌸 p5.js says: [sketch.js, line 19] An error with the message "vertex() must be used once before calling bezierVertex()" occurred inside the p5js library when bezierVertex was called. If not stated otherwise, it might be an issue with the arguments passed to bezierVertex. (https://p5js.org/reference/p5/bezierVertex) 
```

Congratulations 🎈! You are now done adding library error messages for your method.


## ✏️ Writing Friendly Error Messages for international audiences

FES message writers should prioritize lowering the barrier of understanding error messages and increasing the accessibility of the debugging process. Here is one example:

```
🌸 p5.js says: [sketch.js, line 7] circle() was expecting at least 3 arguments, but received only 1. (https://p5js.org/reference/p5/circle) 
```

The above parameter validation message will be shown in Korean if the browser is set to `ko-KR` (Korean) locale:

```
🌸 p5.js says: [sketch.js, 줄7] 최소 3개의 인수(argument)를 받는 함수 circle()에 인수가 1개만 입력되었습니다. (https://p5js.org/reference/p5/circle) 
```

[Friendly Errors i18n Book](https://almchung.github.io/p5-fes-i18n-book/) discusses challenges and best practices for writing Friendly Error messages within the cross-cultural i18n context. Here are the main points from the book:

- Understand your audience: do not make assumptions about the audience of our error messages. Try to learn who is using our library and how they use it.
- Keep language inclusive. We strive to make error messages "friendly," what does it mean for you? Look for possible bias and harm in your language.
- Use simple sentences whenever possible. Consider breaking your sentence into smaller blocks to best utilize [i18next's interpolation feature.](https://www.i18next.com/translation-function/interpolation)
- Prioritize cross-cultural communication and provide a great experience across languages. Avoid using figures of speech.
- Introduce one technical concept or technical term at a time. Keep consistency in technical writing. Try to link one external resource written in a beginner-friendly language with plenty of short, practical examples.

[Friendly Errors i18n Book](https://almchung.github.io/p5-fes-i18n-book/) is a public project, and you can contribute to the book through [this separate repo.](https://github.com/almchung/p5-fes-i18n-book)


## 🔍 Optional: Unit tests

Please consider adding unit tests for your new FE messages to detect bugs early and to ensure your code is delivering intended messages to our users. Also, unit tests are a good way to make sure other contributor’s new code does not accidentally break or interfere with the functionality of your code. Here are a few good guides on unit testing:

- [Unit Testing and Test Driven Development](https://archive.p5js.org/learn/tdd.html) by Andy Timmons
- [Contributors Doc: Unit Testing](./unit_testing.md)



Example:

```js
suite('validateParameters: multi-format', function() {
  test('color(): optional parameter, incorrect type', function() {
    assert.validationError(function() {
      p5._validateParameters('color', [0, 0, 0, 'A']);
    });
  });
}
```


## Conclusion

In this guide, we have provided step-by-step instructions for adding FE messages for several different cases, which include: 

- adding parameter validation, 
- handling file loading errors, and 
- adding library error messages to a method.

Additionally, we are excited to share insights from our community through the FES Survey conducted in 2021-2022. The findings are available in two formats:

- [21-22 FES Survey Report Comic](https://almchung.github.io/p5jsFESsurvey/)
- [21-22 FES Survey Full Report](https://observablehq.com/@almchung/p5-fes-21-survey)

For more in-depth information about the design and technical aspects of FES, please refer to the [FES README document](./friendly_error_system.md). This document provides detailed explanations and development notes, which are beneficial for those seeking a deeper understanding of FES.
