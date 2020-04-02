# 🌐 Internationalization

[Internationalization](https://developer.mozilla.org/docs/Glossary/Internationalization_and_localization) (sometimes abbreviated "i18n") refers to supporting multiple languages in a software project. This often means maintaining translations of text strings used in the project and letting users choose which translation they receive (or detecting it from their browser settings).

p5.js uses internationalization in a bunch of areas (our contributor docs, [the official website](https://p5js.org), the reference, etc). We're expanding to include the console output of p5.js (which is primarily developer-facing error messages) in our internationalization efforts.

## Tooling

We've integrated [i18next](https://www.i18next.com) into the codebase. Currently we only use it in the un-minified build of p5.js. `p5.min.js` only includes the outer layer of our internationalization code and does not use it.

### Setup

We set up our i18next integration in `src/core/internationalization.js` and the translations are in `translations/`.

We set up the translation engine and autodetect the user's language from their browser settings before the p5 sketch is initialized. This ensures we can use translations for any errors we encounter in sketch `setup()` and `preload()`.

(If we encounter any errors in language autodetection, we fall back to English.)

#### No translations in `p5.min.js`

There is specific logic in the browserify build task and `src/core/init.js` to avoid loading or setting up translations in the minified build. Adding translations does not increase the size of the minified build.

### Using translations

To use translations include this line at the top of the file.

```js
import { translator } from './internationalization';
```

### Simple messages

Without internationalization you might log a message with the text inline.

```js
console.log('Loading your sketch right now!')
```

Instead, you use `translator`:

```js
console.log(translator('sketch.loading'))
```

This tells the translator to get the "`sketch.loading`" message in whatever language we've detected that the user prefers.

#### Dynamic messages

You can also inject variables into a translated message. For example,

```js
console.log('I couldnt find ' + file.name + '. Are you sure it's there?')
```

would become something like

```js
console.log(translator('fileLoading.notFound', { fileName: file.name }))
```

Translations like this expect the variables it uses to have a certain name, so make sure you use that. Check a translation file (look in translations/{YOUR_LANGUAGE}/) to see what the variable name is. You'll find the translation under the object path in the translation key.

"`fileLoading.notFound`" would be found at

```json
{
  "fileLoading": {
    "notFound": "I couldnt find {{fileName}}. Are you sure it's there?"
  }
}
```

Variables are framed in "`{{` `}}`".

### Modifying translations

Simply open `translations/{YOUR_LANGUAGE}/translation.json`, find the translation with the key (like in the example just above) and edit away!

### Adding translations for new languages

The easiest way to do this is to add your language code (like "de" for German, "it" for Italian, etc) to the [locales list](https://github.com/processing/p5.js/blob/84bc1f92c89786f48e5d6fd1045feb649b932eea/package.json#L111-L114) in `package.json` and then from the terminal run '$ npm run build'.

This will generate you a fresh translations file in `translations/{LANGUAGE_CODE}/`! Now you can begin populating it with your fresh translations! 🥖

You'll also need to add an entry for it in `translations/index.js`. You can follow the pattern used in that file for `en` and `es`.

### Further Reading

See the [i18next translation function documentation](https://www.i18next.com/translation-function/essentials). Everything documented above is just a subset of their functionality.
