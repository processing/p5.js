import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resources from '../../translations';

/**
 * This is our translation function. Give it a key and
 * it will retreive the appropriate string
 * (within supported languages) according to the
 * user's browser's language settings.
 *
 * (We'll set this to a real value in the init function below!)
 */
export let translator;

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
