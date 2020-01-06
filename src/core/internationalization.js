import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resources from '../../translations';

let translator = () => {
  console.log('Translations are still loading...');
  return '';
};

i18next
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    nestingPrefix: '$tr(',
    nestingSuffix: ')',
    defaultNS: 'translation',
    resources
  })
  .then(t => (translator = t))
  .catch(e => `Translations didn't load (${e})`);

export default () => {
  return translator.apply(args);
};
