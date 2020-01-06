import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resources from '../../translations';

i18next
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    nestingPrefix: '$tr(',
    nestingSuffix: ')',
    defaultNS: 'translation',
    resources
  })
  .catch(e => `Translations failed to load (${e})`);

export default () => {
  return i18next.t.apply(arguments);
};
