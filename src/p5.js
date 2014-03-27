define(function (require) {

  'use strict';

  var p5 = require('core');
  var PVector = require('math.pvector');

  require('color.creating_reading');
  require('color.setting');
  require('data.array_functions');
  require('data.string_functions');
  require('dom.manipulate');
  require('dom.pelement');
  require('environment');
  require('image');
  require('image.loading_displaying');
  require('input.files');
  require('input.keyboard');
  require('input.mouse');
  require('input.time_date');
  require('input.touch');
  require('math.calculation');
  require('math.random');
  require('math.noise');
  require('math.trigonometry');
  require('output.files');
  require('output.image');
  require('output.text_area');
  require('shape.2d_primitives');
  require('shape.attributes');
  require('shape.curves');
  require('shape.vertex');
  require('structure');
  require('transform');
  require('typography.attributes');
  require('typography.loading_displaying');

  /**
   * _globalInit
   *
   * TODO: ???
   * if sketch is on window
   * assume "global" mode
   * and instantiate p5 automatically
   * otherwise do nothing
   * 
   * @return {Undefined}
   */
  var _globalInit = function() {
    console.log('init');
    // if there is a skech on the window
    // then instantiate p5 in "global" mode
    if(window.sketch) {
      new p5();
    }
  };

  if (document.readyState === 'complete') {
    // TODO: ???
    console.log('document.readyState == complete');
    _globalInit();
  } else {
    // TODO: ???
    console.log('window.addEventListener for load');
    window.addEventListener('load', _globalInit , false);
  }

  window.p5 = p5;
  window.PVector = PVector;

  return p5;

});