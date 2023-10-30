import russianTranslations from './index.ru';
import teluguTranslations from './index.te';
import hindiTranslations from './index.hi';
import frenchTranslations from './index.fr';

const initializeInternationalization = p5 => {
  [
    ...frenchTranslations,
    ...hindiTranslations,
    ...teluguTranslations,
    ...russianTranslations
  ].forEach(translateObj => {
    let [englishMethod, translation] = Object.entries(translateObj).flat();
    p5.prototype[translation] = p5.prototype[englishMethod];
  });
};
export default initializeInternationalization;