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

TL.addTranslations(['zh', 'zh-CN', 'zh-Hans', 'zh-Hans-CN'], {
  paramTooFew: {
    '${minArgs}_[*]': '预期至少会收到 ${minArgs} 个参数，但 ${functionName}() 函数中接收到的参数却更少。${referenceLink}'
  },
  paramTooMany: {
    '${minArgs}_[*]': '预期最多会收到 ${minArgs} 个参数，但 ${functionName}() 函数中接收到的参数却更多。${referenceLink}'
  },
  paramType: '${functionName} 函数中${position}参数应为${expectedType}。',
  redeclare: '第 ${line} 行的${errorType} “${name}” 被重复声明，与 p5.js ${errorType}冲突。p5.js 参考：${url}',
  referenceLink: '有关更多信息，请参阅 ${referenceURL}。',
  ordinalFirst: '第一个',
  typeString: '字符串',
  typeBoolean: '布尔值',
  typeFunction: '函数',
  typeNumber: '数字'
});

export class FES {
  static languageCode = navigator.languages;

  // Rather than logging directly, provide an interface to
  // compose a message
  // This static method is not used directly, other methods curry it
  static #printMessage(method, strings, ...values) {
    const translation = TL.tl(strings, ...values.map(value => value.message));

    const styleStrings = [];
    let results = '';
    for (let i = 0; i < strings.length; i++) {
      results += translation.strings[i];

      if (values[i]) {
        if (values[i] instanceof TL) {
          results += values[i].toString(FES.languageCode);
        } else if (values[i] instanceof StyledMessage) {
          results += `%c${values[i].toString(FES.languageCode)}%c`;
          styleStrings.push(values[i].styleString, '');
        } else if (
          values[i] instanceof Function &&
          Object.hasOwn(values[i], 'results') &&
          Object.hasOwn(values[i], 'styleStrings')
        ) {
          results += values[i].results;
          styleStrings.push(...values[i].styleStrings);
        } else {
          results += values[i];
        }
      }
    }

    const executor = function (options) {
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

    executor.results = results;
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

  static group(messages) { // : GroupMessage
    // interface Message {
    //   message: string,
    //   level: string // Default 'log'
    // }
    // interface GroupMessage {
    //   message?: string | null,
    //   group: (Message|GroupMessage)[]
    // }

    console.group(`%c${messages.message}`, 'font-weight: normal; color: initial;');
    for(const item of messages.group ?? []){
      if (item.group) {
        FES.group(item);
      } else {
        console[item.level || 'log'](item.message);
      }
    }
    console.groupEnd();
  }

  // Just an alias to TL.tl
  static tl = TL.tl;

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
  return new StyledMessage(message, styleString);
}

export function red(message) {
  if (message instanceof StyledMessage) {
    message.styleString += 'color: red;';
    return message;
  } else {
    return style(message, { color: 'red' });
  }
}

export function white(message) {
  if (message instanceof StyledMessage) {
    message.styleString += 'color: white;';
    return message;
  } else {
    return style(message, { color: 'white' });
  }
}

export function bgBlack(message) {
  if (message instanceof StyledMessage) {
    message.styleString += 'background: black;';
    return message;
  } else {
    return style(message, { background: 'black' });
  }
}

export function bgGrey(message) {
  if (message instanceof StyledMessage) {
    message.styleString += 'background: grey;';
    return message;
  } else {
    return style(message, { background: 'grey' });
  }
}

// Re-export TL
export { TL };
