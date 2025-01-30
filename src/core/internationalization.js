import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { default as fallbackResources, languages } from '../../translations';

if (typeof IS_MINIFIED === 'undefined') {
  // internationalization is only for the unminified build

  if (typeof P5_DEV_BUILD !== 'undefined') {
    // When the library is built in development mode ( using npm run dev )
    // we want to use the current translation files on the disk, which may have
    // been updated but not yet pushed to the CDN.
    let completeResources = require('../../translations/dev');
    for (const language of Object.keys(completeResources)) {
      // In es_translation, language is es and namespace is translation
      // In es_MX_translation, language is es-MX and namespace is translation
      const parts = language.split('_');
      const lng = parts.slice(0, parts.length - 1).join('-');
      const ns = parts[parts.length - 1];

      fallbackResources[lng] = fallbackResources[lng] || {};
      fallbackResources[lng][ns] = completeResources[language];
    }
  }
}

/*
 * This is our i18next "backend" plugin. It tries to fetch languages
 * from a CDN.
 * @private
 */
class FetchResources {
  constructor(services, options) {
    this.init(services, options);
  }

  // run fetch with a timeout. Automatically rejects on timeout
  // default timeout = 2000 ms
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

    if (language === this.options.fallback) {
      // if the default language of the user is the same as our inbuilt fallback,
      // there's no need to fetch resources from the cdn. This won't actually
      // need to run when we use "partialBundledLanguages" in the init
      // function.
      callback(null, fallbackResources[language][namespace]);
    } else if (languages.includes(language)) {
      // The user's language is included in the list of languages
      // that we so far added translations for.

      const url = this.services.interpolator.interpolate(loadPath, {
        lng: language,
        ns: namespace
      });
      this.loadUrl(url, callback);
    } else {
      // We don't have translations for this language. i18next will use
      // the default language instead.
      callback('Not found', false);
    }
  }

  loadUrl(url, callback) {
    this.fetchWithTimeout(url)
      .then(
        response => {
          const ok = response.ok;

          if (!ok) {
            // caught in the catch() below
            throw new Error(`failed loading ${url}`);
          }
          return response.json();
        },
        () => {
          // caught in the catch() below
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
 * it will retrieve the appropriate string
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
  // Using "partialBundledLanguages" option during initialization, we can
  // still use our fallback language to display messages
  i18next.t(key, values); /* i18next-extract-disable-line */
};
// (We'll set this to a real value in the init function below!)

/*
 * Set up our translation function, with loaded languages
 * @private
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
        checkWhitelist: false,

        // prevent storing or locating language from cookie or localStorage
        // more info on https://github.com/processing/p5.js/issues/4862
        order: ['querystring', 'navigator', 'htmlTag', 'path', 'subdomain'],
        caches: []
      },
      backend: {
        fallback: 'en',
        loadPath:
          'https://cdn.jsdelivr.net/npm/p5/translations/{{lng}}/{{ns}}.json'
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

/*
 * Returns a list of languages we have translations loaded for
 * @private
 */
export const availableTranslatorLanguages = () => {
  return i18next.languages;
};

/*
 * Returns the current language selected for translation
 * @private
 */
export const currentTranslatorLanguage = language => {
  return i18next.language;
};

/*
 * Sets the current language for translation
 * Returns a promise that resolved when loading is finished,
 * or rejects if it fails.
 * @private
 */
export const setTranslatorLanguage = language => {
  return i18next.changeLanguage(language || undefined, e =>
    console.debug(`Translations failed to load (${e})`)
  );
};
