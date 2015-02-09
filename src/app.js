define(function (require) {

  'use strict';

  var p5 = require('core');

  require('p5.Color');
  require('p5.Element');
  require('p5.Graphics');
  require('p5.Image');
  require('p5.File');
  //require('p5.Shape');
  require('p5.Vector');
  require('p5.TableRow');
  require('p5.Table');

  require('color.creating_reading');
  require('color.setting');
  require('constants');
  require('data.conversion');
  require('data.array_functions');
  require('data.string_functions');
  require('environment');
  require('image.image');
  require('image.loading_displaying');
  require('image.pixels');
  require('input.files');
  require('input.keyboard');
  require('input.mouse');
  require('input.time_date');
  require('input.touch');
  require('math.math');
  require('math.calculation');
  require('math.random');
  require('math.noise');
  require('math.trigonometry');
  require('output.files');
  require('output.image');
  require('output.text_area');
  require('rendering.rendering');
  require('shape.2d_primitives');
  require('shape.attributes');
  require('shape.curves');
  //require('shape.shape');
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
    if (!window.PHANTOMJS && !window.mocha) {
      // If there is a setup or draw function on the window
      // then instantiate p5 in "global" mode
      if((window.setup && typeof window.setup === 'function') ||
        (window.draw && typeof window.draw === 'function')) {
        new p5();
      }
    }
  };

  // TODO: ???
  if (document.readyState === 'complete') {
    _globalInit();
  } else {
    window.addEventListener('load', _globalInit , false);
  }

  return p5;

});