import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// let resources;
// // Do not include translations in the minified js
let fallbackResources, languages;
if (typeof IS_MINIFIED === 'undefined') {
  fallbackResources = require('../../translations').default;
  languages = require('../../translations').languages;
}

class FetchResources {
  constructor(services, options) {
    this.init(services, options);
  }

  fetchWithTimeout(url, options, timeout = 2000) {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), timeout)
      )
    ]);
  }

  init(services, options = {}) {
    this.services = services;
    this.options = options;
  }

  read(language, namespace, callback) {
    const loadPath = this.options.loadPath;
    const url = this.services.interpolator.interpolate(loadPath, {
      lng: language,
      ns: namespace
    });

    // if the default language of the user is the same as our inbuilt fallback,
    // there's no need to fetch resources.
    if (language === this.options.fallback) {
      callback(null, fallbackResources[language][namespace]);
    } else if (languages.includes(language)) {
      this.loadUrl(url, callback);
    } else {
      callback('Not found', false);
    }
  }

  loadUrl(url, callback) {
    this.fetchWithTimeout(url)
      .then(
        response => {
          const ok = response.ok;
          if (!ok) {
            throw new Error(`failed loading ${url}`);
          }
          return response.json();
        },
        () => {
          throw new Error(`failed loading ${url}`);
        }
      )
      .then(data => {
        return callback(null, data);
      })
      .catch(callback);
  }
}
FetchResources.type = 'backend';

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
export let translator = (key, values) => {
  console.debug('p5.js translator called before translations were loaded');

  // Certain FES functionality may trigger before translations are downloaded.
  // Due to the "partialBundledLanguages" option during initialization, we can
  // still use our fallback language
  i18next.t(key, values); /* i18next-extract-disable-line */
};
// (We'll set this to a real value in the init function below!)

/**
 * Set up our translation function, with loaded languages
 */
export const initialize = () => {
  let i18init = i18next
    .use(LanguageDetector)
    .use(FetchResources)
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
      backend: {
        fallback: 'en',
        loadPath:
          'https://cdn.jsdelivr.net/npm/@akshay-99/p5-test/translations/{{lng}}/{{ns}}.json'
      },
      partialBundledLanguages: true,
      resources: fallbackResources
    })
    .then(
      translateFn => {
        translator = translateFn;
      },
      e => console.debug(`Translations failed to load (${e})`)
    );

  // i18next.init() returns a promise that resolves when the translations
  // are loaded. We use this in core/init.js to hold p5 initialization until
  // we have the translation files.
  return i18init;
};
