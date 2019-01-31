/**
 * @module Locales
 * @submodule Locales
 * @for p5
 */

'use strict';

var en = require('./en.json');
var es = require('./es.json');

var getUserLanguage = function() {
  var userLanguage = navigator.language || navigator.userLanguage;
  return userLanguage.split('-')[0];
};

var getString = function(str) {
  var defaultDict = en;
  var dict;

  switch (getUserLanguage()) {
    case 'en':
      dict = en;
      break;
    case 'es':
      dict = es;
      break;
  }

  // Fallback on english dict or the original string itself
  return dict[str] || defaultDict[str] || str;
};

var localize = function(str) {
  return getString(str);
};

module.exports = {
  __: localize
};
