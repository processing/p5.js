# 🌸 p5.js Friendly Error System (FES)

## Overview

The Friendly Error System (FES, 🌸) aims to help new programmers by providing error messages in simple, friendly language. It supplements your browser's console error messages by adding an alternative description of the error and links to helpful references.

The FES prints messages in the console window, as seen in the [p5.js Web Editor] and your browser JavaScript console. The single minified file of p5 (p5.min.js) omits the FES.

[p5.js Web Editor]: https://editor.p5js.org/

## Lowering the Barriers to Debugging
The design of a tool should match the need of the people who will use it. As a tool that aims to lower the barriers to debugging, the design of FES is no exception.

The best way to evaluate our existing design is to hear directly from people using p5.js. We ran a community survey in 2021 to gather feedback and future wishes for Friendly Errors.

We believe the insights from our community members will be helpful for our contributors. You can see the results through the summary comic or the full report:
* [21-22 FES Survey Report Comic]
* [21-22 FES Survey Full Report]


[21-22 FES Survey Report Comic]: https://almchung.github.io/p5jsFESsurvey/
[21-22 FES Survey Full Report]: https://observablehq.com/@almchung/p5-fes-21-survey

## Writing Friendly Error Messages

How to contribute to the p5.js library by writing and translating error messages?

The FES is a part of the p5.js' [internationalization] effort. We generate all FES messages' content through [i18next]-based `translator()` function. This dynamic error message generation happens for all languages, including English - the default language of the p5.js.

We welcome contributions from all around the world! 🌐

[internationalization]: https://github.com/processing/p5.js/blob/main/contributor_docs/internationalization.md
[i18next]: https://www.i18next.com/


#### Writing Best Practices

FES message writers should prioritize lowering the barrier of understanding error messages and increasing the accessibility of debugging process.

[Friendly Errors i18n Book] discusses challenges and best practices for writing friendly error messages within the cross-cultural i18n context. Here are some points from the book:

* Understand your audience: do not make assumptions about the audience of our error messages. Try to learn who is using our library and how they use it.
* Keep language inclusive. We strive to make error messages "friendly," what does it mean for you? Look for possible bias and harm in your language. Adhere to [p5.js Code of Conduct].
* Use simple sentences whenever possible. Consider breaking your sentence into smaller blocks for best utilizing i18next's [interpolation] feature.
* Prioritize cross-cultural communication and provide a great experience across languages. Avoid using figures of speech.
* Introduce one technical concept or technical term at a time. Keep consistency in technical writing. Try to link one external resource written in a beginner-friendly language with plenty of short, practical examples.

[Friendly Errors i18n Book]: https://almchung.github.io/p5-fes-i18n-book/
[interpolation]: https://www.i18next.com/translation-function/interpolation
[p5.js Code of Conduct]: https://github.com/processing/p5.js/blob/main/CODE_OF_CONDUCT.md#p5js-code-of-conduct
[expert blind spots]: https://tilt.colostate.edu/TipsAndGuides/Tip/181

[Friendly Errors i18n Book] is a public project, and you can contribute to the book through this separate [repo].

[repo]: https://github.com/almchung/p5-fes-i18n-book
#### Location of Translation Files

`translator()` is based on i18next and imported from `src/core/internationalization.js`. It generates messages by looking up text data from a JSON translation file:
```
translations/{{detected locale code, default=en}}/translation.json
```

Example:
If the detected browser locale is Korean (language designator: `ko`), the `translator()` will read in translated text blocks from `translations/ko/translation.json`. Then `translator()` will assemble the text blocks into the final message.

The language designator can also include regional information, such as `es-PE` (Spanish from Peru).

#### Structure of Translation Files
`translation.json` has a [format used by i18next](https://www.i18next.com/misc/json-format).

The basic format of a translation file's item has a key and a value (message) in double quotation marks `""`, closed by the curly brackets `{}`:
```json
{ "key": "value" }
```
For example, we have a ASCII logo saved in this format:
```json
"logo": "    _ \n /\\| |/\\ \n \\ ` ' /  \n / , . \\  \n \\/|_|\\/ \n\n"
```
i18next supports interpolation, which allows us to pass a variable to generate a message dynamically. We use curly brackets twice `{{}}` to set a placeholder of the variable:
```json
"greeting": "Hello, {{who}}!"
```
Here, the key is `greeting`, and the variable name is `who`.

To dynamically generate this message, we will need to pass a value:
```JavaScript
translator('greeting', { who: 'everyone' } );
```
The result generated by `translator` will look like this:
```
Hello, everyone!
```

Here is an item from `fes`'s `fileLoadError` that demonstrates interpolation:
```json
"image": "It looks like there was a problem loading your image. {{suggestion}}"
```
To dynamically generate the final message, the FES will call `translator()` with the key and a pre-generated `suggestion` value.
```JavaScript
translator('fes.fileLoadError.image', { suggestion });
```

#### How to Add or Modify Translation

The [internationalization doc] has a step-by-step guide on adding and modifying translation files.

[internationalization doc]: https://github.com/processing/p5.js/blob/main/contributor_docs/internationalization.md


## Understanding How FES Works
In this section, we will give an overview of how FES generates and displays messages. For more detailed information on the FES functions, please see our [FES Reference + Dev Notes].

[FES Reference + Dev Notes]: https://github.com/processing/p5.js/blob/main/contributor_docs/fes_reference_dev_notes.md


#### Overview
p5.js calls the FES from multiple locations for different situations, when:
* The browser throws an error.
* The user code calls a function from the p5.js API.
* Other custom cases where the user would benefit from a help message.

#### FES Code Location
You can find the core components of the FES inside:
`src/core/friendly_errors`.
You can find the translation files used by the `translator()` inside:
`translations/`.

#### FES Message Generators
These functions are mainly responsible for catching errors and generating FES messages:
* [`_friendlyFileLoadError()`] catches file loading errors.
* [`_validateParameters()`] checks a p5.js function’s input parameters based on inline documents.
* [`_fesErrorMontitor()`] handles global errors.

For full reference, please see our [Dev Notes].

[`_friendlyFileLoadError()`]: https://github.com/processing/p5.js/blob/main/contributor_docs/fes_reference_dev_notes.md#_friendlyfileloaderror
[`_validateParameters()`]: https://github.com/processing/p5.js/blob/main/contributor_docs/fes_reference_dev_notes.md#validateparameters
[`_fesErrorMontitor()`]: https://github.com/processing/p5.js/blob/main/contributor_docs/fes_reference_dev_notes.md#feserrormonitor
[Dev Notes]: https://github.com/processing/p5.js/blob/main/contributor_docs/fes_reference_dev_notes.md


#### FES Message Displayer
`fes_core.js/_friendlyError()` prints generated friendly error messages in the console. For example:

```JavaScript
p5._friendlyError(
  translator('fes.globalErrors.type.notfunc', translationObj)
);
```
This function can be called anywhere in p5.

## Turning Off the FES
There may be cases where you want to [disable the FES for performance].

`p5.disableFriendlyErrors` allows you to turn off the FES when set to `true`.

Example:
```JavaScript
p5.disableFriendlyErrors = true;

function setup() {
  createCanvas(100, 50);
}
```

The single minified file of p5 (i.e., p5.min.js) automatically omits the FES.

[disable the FES for performance]: https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance#disable-the-friendly-error-system-fes