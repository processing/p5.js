import { TL } from 'tl-util';

TL.addTranslations(['en', 'en-US', 'en-GB'], {
  paramTooFew: {
    '${minArgs}_[one]': 'Expected at least ${minArgs} argument, but received fewer in ${functionName}(). ${referenceLink}',
    '${minArgs}_[*]': 'Expected at least ${minArgs} arguments, but received fewer in ${functionName}(). ${referenceLink}'
  },
  paramTooMany: {
    '${minArgs}_[one]': 'Expected at most ${minArgs} argument, but received fewer in ${functionName}(). ${referenceLink}',
    '${minArgs}_[*]': 'Expected at most ${minArgs} arguments, but received fewer in ${functionName}(). ${referenceLink}'
  },
  paramType: 'Expected ${expectedType} at the ${position} parameter in ${functionName}.',
  redeclare: '${errorType} "${name}" on line ${line} is being redeclared and conflicts with a p5.js ${errorType}. p5.js reference: ${url}',
  referenceLink: 'For more information, see ${referenceURL}.',
  ordinalFirst: 'first',
  typeString: 'string',
  typeBoolean: 'boolean',
  typeFunction: 'function',
  typeNumber: 'number'
});

const defaultLanguage = navigator.language;
const localTranslation = window.localStorage.getItem(defaultLanguage);
let translationPromise;
if (localTranslation) {
  TL.addTranslations(defaultLanguage, JSON.parse(localTranslation));
  translationPromise = Promise.resolve();
}else{
  translationPromise = fetch('./fes-zh.json')
    .then(res => {
      if (res.ok) return res.json();
      throw null;
    })
    .then(data => {
      TL.addTranslations(defaultLanguage, data);
      window.localStorage.setItem(defaultLanguage, JSON.stringify(data));
    })
    .catch(() => Promise.resolve());
}

export class FES {
  static languageCode = navigator.languages;
  static translationPromise = translationPromise;

  // Rather than logging directly, provide an interface to
  // compose a message
  // This static method is not used directly, other methods curry it
  static #printMessage(method, strings, ...values) {
    const styleStrings = [];
    const translation = TL.tl(strings, ...values.map(
      value => {
        if(value instanceof StyledMessage){
          const ret = `%c${value.message.toString(FES.languageCode)}%c`;
          styleStrings.push(value.styleString, '');
          return ret;
        } else if (value?.message && value?.styleStrings) {
          styleStrings.push(...value.styleStrings);
          return value.message;
        } else {
          return value;
        }
      }
    ));
    const results = translation.toString(FES.languageCode);

    const executor = options => {
      const { prefix } = Object.assign({
        prefix: TL.tl`🌸 p5.js says: `
      }, options);

      if (prefix instanceof TL) {
        console[method](
          prefix.toString(FES.languageCode) + results,
          ...styleStrings
        );
      } else if (prefix === false) {
        console[method](results, ...styleStrings);
      } else {
        console[method](prefix + results, ...styleStrings);
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
    ordinals: [
      TL.tl`first`
    ],
    types: {
      string: TL.tl`string`,
      boolean: TL.tl`boolean`,
      number: TL.tl`number`
    }
  }
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
  const styleString = Object.entries(mod)
    .reduce((acc, [key, val]) => {
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

// Re-export TL
export { TL };

export default function (p5, fn, lifecycles) {
  p5.FES = FES;
}
