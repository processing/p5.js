import en from './en/translation';

// Only one language is imported above. This is intentional as other languages
// will be hosted online and then downloaded whenever needed

/**
 * Here, we define a default/fallback language which we can use without internet.
 * You won't have to change this when adding a new language.
 *
 * `translation` is the namespace we are using for our initial set of strings
 */
export default {
  en: {
    translation: en
  }
};

/**
 * This is a list of languages that we have added so far.
 * If you have just added a new language (yay!), add its key to the list below
 * (`en` is english, `es` es español). Also add its export to
 * dev.js, which is another file in this folder.
 */
export const languages = [
  'en',
  'es',
  'ko',
  'zh'
];
