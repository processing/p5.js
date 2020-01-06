import i18next from 'i18next';

let translator = () => {
  console.log('Translations are still loading...');
  return '';
};

i18next
  .use(i18nextBrowserLanguageDetector)
  .init({
    fallbackLng: 'en',
    debug: true,
    ns: ['common'],
    defaultNS: 'common'
  })
  .then(t => (translator = t))
  .catch(e => `Translations didn't load (${e})`);

export default () => {
  return translator.apply(args);
};
