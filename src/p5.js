define(function (require) {

  'use strict';

  var Processing = require('./core/core');
  require('./color/creating_reading');
  require('./color/setting');
  require('./data/array_functions');
  require('./data/string_functions');
  require('./dom/manipulate');
  require('./dom/pelement');
  require('./environment/environment');
  require('./image/image');
  require('./image/loading_displaying');
  require('./input/files');
  require('./input/keyboard');
  require('./input/mouse');
  require('./input/time_date');
  require('./input/touch');
  require('./math/calculation');
  require('./math/pvector');
  require('./math/random');
  require('./math/trigonometry');
  require('./output/files');
  require('./output/image');
  require('./output/text_area');
  require('./shape/2d_primitives');
  require('./shape/attributes');
  require('./shape/curves');
  require('./shape/vertex');
  require('./structure/structure');
  require('./transform/transform');
  require('./typography/attributes');
  require('./typography/loading_displaying');

  if (document.readyState === 'complete') {
    Processing._init();
  } else {
    window.addEventListener('load', Processing._init , false);
  }

  window.Processing = Processing;

  return Processing;

});