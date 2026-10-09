<!-- An overview of the system used by p5.js to provide errors in friendly language. -->

# 🌸 p5.js Friendly Error System (FES)

## Overview

The Friendly Error System (FES, 🌸) aims to help new programmers by providing error messages in simple, friendly language. It supplements your browser's console error messages by adding an alternative description of the error and links to helpful references.

The FES prints messages in the console window, as seen in the [p5.js Web Editor] and your browser JavaScript console. The single minified file of p5 (p5.min.js) omits the FES.

[p5.js Web Editor]: https://editor.p5js.org/

## Lowering the Barriers to Debugging

The design of a tool should match the need of the people who will use it. As a tool that aims to lower the barriers to debugging, the design of FES is no exception.

The best way to evaluate our existing design is to hear directly from people using p5.js. We ran a community survey in 2021 to gather feedback and future wishes for Friendly Errors.

We believe the insights from our community members will be helpful for our contributors. You can see the results through the summary comic or the full report:

- [21-22 FES Survey Report Comic]
- [21-22 FES Survey Full Report]

[21-22 FES Survey Report Comic]: https://almchung.github.io/p5jsFESsurvey/
[21-22 FES Survey Full Report]: https://observablehq.com/@almchung/p5-fes-21-survey

## Understanding How FES Works

In this section, we will give an overview of how FES generates and displays messages.

#### Overview

FES can be thought of as consisting of two main parts: a message printing utility with built in translations, and a group of subsystems catching and monitoring errors. p5.js calls the FES from multiple locations for different situations, when:

- The browser throws an error.
- The user code calls a function from the p5.js API.
- Other custom cases where the user would benefit from a help message.

#### FES Code Location

You can find the core components of the FES inside:
`src/friendly_errors`.
You can find the translation files inside: `translations/`.

#### FES Message Generators

To understand how FES messages are created, we need to understand that there are two steps to printing an FES message, first the message needs to be composed and then the message is printed. This distinction is important because it is tied closely to how messages are written, translated, and finally printed in the console.

To compose FES messages, we utilize [tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates) with `p5.FES.log` as the tag:

```js
p5.FES.log`This is a message.`;
```

If you are familiar with JavaScript template literal, this is the same idea with only the tag `p5.FES.log` added in front of the template literal. This also means you can use interpolated values:

```js
p5.FES.log`The expected type is ${dataType}`;
```

This is where the idea of _composing_ comes in, once a message is defined in this way, it can be used as interpolated value in another message:

```js
const dataType = p5.FES.log`string`;
const message = p5.FES.log`The expected type is ${dataType}.`;
```

This can be nested for any number of levels, although it is recommended to keep the nesting relatively shallow for navigability and later translation purposes.

Finally now that we have composed our FES message, we need to print them. To print a composed message, we call them as a function:

```js
const message = p5.FES.log`The expected type is ${dataType}.`;
message();

// or also valid

p5.FES.log`The expected type is ${dataType}.`();
```

When called in this way, a message will be printed in the console: `🌸 p5.js says: The expected type is string.`. Note that the prefix `🌸 p5.js says: ` is included in every message printed by default, if the prefix is not desired or if a different prefix is needed, an option object can be passed to the function call.

```js
// No prefix
p5.FES.log`The expected type is ${dataType}.`({ prefix: false });

// Custom prefix
p5.FES.log`The expected type is ${dataType}.`({ prefix: "The sketch says: "});

// Translated prefix
p5.FES.log`The expected type is ${dataType}.`({ prefix: p5.FES.log`The sketch says:` });
```

## Writing Friendly Error Messages

How to contribute to the p5.js library by writing and translating error messages?

The FES is a part of the p5.js' [internationalization] effort. We generate all FES messages' content through a custom written utility [tl-util]. Usage of this system is documented below, for developers writing FES messages, the steps documented below automatically utilizes the translation utility library.

We welcome contributions from all around the world! 🌐

[internationalization]: https://github.com/processing/p5.js/blob/main/contributor_docs/archive/internationalization.md
[tl-util]: https://github.com/limzykenneth/tl-util

#### Writing Best Practices

FES message writers should prioritize lowering the barrier of understanding error messages and increasing the accessibility of debugging process.

[Friendly Errors i18n Book] discusses challenges and best practices for writing friendly error messages within the cross-cultural i18n context. Here are some points from the book:

- Understand your audience: do not make assumptions about the audience of our error messages. Try to learn who is using our library and how they use it.
- Keep language inclusive. We strive to make error messages "friendly," what does it mean for you? Look for possible bias and harm in your language. Adhere to [p5.js Code of Conduct].
- Use simple sentences whenever possible.
- Prioritize cross-cultural communication and provide a great experience across languages. Avoid using figures of speech.
- Introduce one technical concept or technical term at a time. Keep consistency in technical writing. Try to link one external resource written in a beginner-friendly language with plenty of short, practical examples.

[Friendly Errors i18n Book]: https://almchung.github.io/p5-fes-i18n-book/
[interpolation]: https://www.i18next.com/translation-function/interpolation
[p5.js Code of Conduct]: https://github.com/processing/p5.js/blob/main/CODE_OF_CONDUCT.md#p5js-code-of-conduct
[expert blind spots]: https://tilt.colostate.edu/TipsAndGuides/Tip/181

[Friendly Errors i18n Book] is a public project, and you can contribute to the book through this separate [repo].

[repo]: https://github.com/almchung/p5-fes-i18n-book

#### Translation of messages

Each composed message within the codebase may correspond to an entry string for translation.

```js
p5.FES.log`This is one translation entry`;
p5.FES.log`This is yet another translation entry`;
p5.FES.log`Interpolated ${entry} counts as one entry string`;
```

The translation entry strings are stored in `./translations` under each language's language code. If an entry has translation string in a different language, it can be translated accordingly, however if the translation string does not exist, the orignal string will be used instead.

Developers writing code and FES messages does not need to provide the mechanism for translation or the translation themselves. FES messages will be translated and printed automatically by detecting the user browser's language setting or by the language code set by the user with `p5.FES.languageCode = 'zh-CN'` for example.

#### Help translating FES strings

The current translation strings are extracted from the codebase using a custom script in `./utils/extract.js` and the results saved in `./translations/en/extracted.json`. If a new language is added, this file can be duplicated and placed in the corresponding folder in `./translations/` under the target language code.

Note: this part of FES translation is still in development, while things are functional, their exact surface and API may change over time.

## Turning Off the FES

There may be cases where you want to [disable the FES for performance].

`p5.disableFriendlyErrors` allows you to turn off the FES when set to `true`.

Example:

```javascript
p5.disableFriendlyErrors = true;

function setup() {
  createCanvas(100, 50);
}
```

The single minified file of p5 (i.e., p5.min.js) automatically omits the FES.

[disable the FES for performance]: https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance#disable-the-friendly-error-system-fes
