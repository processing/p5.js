import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

let resources;
// Do not include translations in the minified js
if (typeof IS_MINIFIED === 'undefined') {
  resources = require('../../translations').default;
}

/**
 * This is our translation function. Give it a key and
 * it will retreive the appropriate string
 * (within supported languages) according to the
 * user's browser's language settings.
 * @function translator
 * @param {String} key a key that corresponds to a message in our translation files
 * @param {Object} values values for use in the message under the given `key`
 * @returns {String} message (with values inserted) in the user's browser language
 * @private
 */
export let translator = () => {
  console.debug('p5.js translator called before translations were loaded');
  return '';
};
// (We'll set this to a real value in the init function below!)

/**
 * Set up our translation function, with loaded languages
 */
export const initialize = () =>
  new Promise((resolve, reject) => {
    i18next
      .use(LanguageDetector)
      .init({
        fallbackLng: 'en',
        nestingPrefix: '$tr(',
        nestingSuffix: ')',
        defaultNS: 'translation',
        returnEmptyString: false,
        interpolation: {
          escapeValue: false
        },
        detection: {
          checkWhitelist: false
        },
        resources
      })
      .then(
        translateFn => {
          translator = translateFn;
          resolve();
        },
        e => reject(`Translations failed to load (${e})`)
      );
  });
