export { default as en_translation } from './en/translation.json';
export { default as es_translation } from './es/translation.json';
export { default as ko_translation } from './ko/translation.json';
export { default as zh_translation } from './zh/translation.json';
export { default as hi_translation } from './hi/translation.json';
export { default as ja_translation } from './ja/translation.json';

/*
 * When adding a new language, add a new "export" statement above this.
 * For example, if we were to add fr ( French ), we would write:
 * export { default as fr_translation } from './fr/translation';
 *
 * If the language key has a hypen (-), replace it with an underscore ( _ )
 * e.g. for es-MX we would write:
 * export { default as es_MX_translation } from './es-MX/translation';
 *
 * "es_MX" is the language key whereas "translation" is the filename
 * ( translation.json ) or the namespace
*/
