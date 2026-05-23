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
  paramType: 'Expected ${expectedType} at the ${position} parameter, but received ${actualType} in ${functionName}.',
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
  paramType: '${position}参数应为${expectedType}，但 ${functionName} 函数中接收到的是${actualType}。',
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
  // NOTE: options can be curried
  static log(message, options) {
    // Set options default, consider deep merge
    let { style, prefix } = Object.assign({
      style: {},
      prefix: '🌸 p5.js says: '
    }, options);
    if (prefix === false) prefix = '';

    // Set message style
    // NOTE: allow use of multiple styles object somehow
    const styleString = Object.entries(style).reduce((acc, [key, val]) => {
      acc += `${key}: ${val};`;
      return acc;
    }, '');
    console.log(`${prefix}%c${message.toString(FES.languageCode)}`, styleString);
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

// Re-export TL
export { TL };
