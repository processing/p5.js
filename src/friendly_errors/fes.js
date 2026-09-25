import { TL } from 'tl-util';
import enTranslations from '../../translations/en/extracted.json' with { type: 'json' };
import { VERSION } from '../core/constants';
TL.addTranslations(['en', 'en-US', 'en-GB'], enTranslations);

const defaultLanguage = navigator.language;
const localTranslation = window.localStorage.getItem(defaultLanguage);
let translationPromise = new Promise(async resolve => {
  if (localTranslation) {
    TL.addTranslations(defaultLanguage, JSON.parse(localTranslation));
    resolve();
  } else {
    try {
      // Locally provided translation file has first priority
      let translationResponse = await fetch(`./${defaultLanguage}.json`);
      if (!translationResponse.ok) {
        throw new Error('Cannot reach local file');
      }

      const translation = await translationResponse.json();
      TL.addTranslations(defaultLanguage, translation);
      window.localStorage.setItem(defaultLanguage, JSON.stringify(translation));
    } catch {
      try {
        // CDN hosted file will be loaded if local is not present
        let translationResponse = await fetch(
          `https://cdn.jsdelivr.net/npm/p5@${VERSION}/translations/${defaultLanguage}/extracted.json`
        );
        if (!translationResponse.ok) {
          throw new Error('Cannot reach CDN file');
        }

        const translation = await translationResponse.json();
        TL.addTranslations(defaultLanguage, translation);
        window.localStorage.setItem(
          defaultLanguage,
          JSON.stringify(translation)
        );
      } catch {
        // If CDN also cannot be reached, do nothing
      }
    } finally {
      resolve();
    }
  }
});

export class FES {
  static languageCode = navigator.languages;
  static translationPromise = translationPromise;
  static disableFriendlyErrors = false;

  // Rather than logging directly, provide an interface to
  // compose a message
  // This static method is not used directly, other methods curry it
  static #printMessage(method, strings, ...values) {
    if (FES.disableFriendlyErrors) return;
    const styleStrings = [];
    const translation = TL.tl(
      strings,
      ...values.map(value => {
        if (value instanceof StyledMessage) {
          const ret = `%c${value.message.toString(FES.languageCode)}%c`;
          styleStrings.push(value.styleString, '');
          return ret;
        } else if (value?.message && value?.styleStrings) {
          styleStrings.push(...value.styleStrings);
          return value.message;
        } else {
          return value;
        }
      })
    );
    const results = translation.toString(FES.languageCode);

    const executor = options => {
      const { prefix } = Object.assign(
        {
          prefix: TL.tl`🌸 p5.js says: `
        },
        options
      );

      let footer = '';
      if (options?.reference) {
        footer += mapToReference(results, options.reference);
      }

      if (prefix instanceof TL) {
        console[method](
          prefix.toString(FES.languageCode) + results + footer,
          ...styleStrings
        );
      } else if (prefix === false) {
        console[method](results + footer, ...styleStrings);
      } else {
        console[method](prefix + results + footer, ...styleStrings);
      }
    };

    executor.message = results;
    executor.styleStrings = styleStrings;

    executor.toString = function (lang) {
      return translation.toString(lang);
    };

    return executor;
  }

  static log(strings, ...values) {
    return FES.#printMessage('log', strings, ...values);
  }

  static debug(strings, ...values) {
    return FES.#printMessage('debug', strings, ...values);
  }

  static error(strings, ...values) {
    return FES.#printMessage('error', strings, ...values);
  }

  static info(strings, ...values) {
    return FES.#printMessage('info', strings, ...values);
  }

  static warn(strings, ...values) {
    return FES.#printMessage('warn', strings, ...values);
  }

  // Just an alias to TL
  static TL = TL;

  static premade = {
    ordinals: [TL.tl`first`],
    types: {
      string: TL.tl`string`,
      boolean: TL.tl`boolean`,
      number: TL.tl`number`
    }
  };
}

export class StyledMessage {
  message;
  styleString;

  constructor(message, styleString) {
    this.message = message;
    this.styleString = styleString;
  }

  toString(lang) {
    return this.message.toString(lang);
  }
}

export function style(message, mod) {
  const styleString = Object.entries(mod).reduce((acc, [key, val]) => {
    acc += `${key}: ${val};`;
    return acc;
  }, '');
  if (message instanceof StyledMessage) {
    message.styleString += styleString;
    return message;
  } else {
    return new StyledMessage(message, styleString);
  }
}

export function red(message) {
  return style(message, { color: 'red' });
}

export function white(message) {
  return style(message, { color: 'white' });
}

export function bgBlack(message) {
  return style(message, { background: 'black' });
}

export function bgGrey(message) {
  return style(message, { background: 'grey' });
}

export function underline(message) {
  return style(message, { 'text-decoration': 'underline' });
}

/**
 * Takes a message and a p5 function func, and adds a link pointing to
 * the reference documentation of func at the end of the message
 *
 * @method mapToReference
 * @private
 * @param {String}  message   the words to be said
 * @param {String}  [func]    the name of function
 *
 * @returns {String}
 */
function mapToReference(message, func) {
  let msgWithReference = '';
  if (func == null || func.substring(0, 4) === 'load') {
    msgWithReference = message;
  } else {
    const methodParts = func.split('.');
    const referenceSection =
      methodParts.length > 1 ? `${methodParts[0]}.${methodParts[1]}` : 'p5';

    const funcName =
      methodParts.length === 1 ? func : methodParts.slice(2).join('/');

    //Whenever func having p5.[Class] is encountered, we need to have the error link as mentioned below else different link
    if (funcName.startsWith('p5.')) {
      msgWithReference = ` (https://p5js.org/reference/${referenceSection}.${funcName})`;
    } else {
      msgWithReference = ` (https://p5js.org/reference/${referenceSection}/${funcName})`;
    }
  }
  return msgWithReference;
}

// Re-export TL
export { TL };

export default function (p5, fn, lifecycles) {
  p5.FES = FES;
  p5.disableFriendlyErrors = typeof IS_MINIFIED !== 'undefined' ? true : false;
  Object.defineProperty(p5.FES, 'disableFriendlyErrors', {
    get: () => p5.disableFriendlyErrors
  });
}
