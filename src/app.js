define(function (require) {

  'use strict';

  var p5 = require('core/core');
  require('p5.Color');
  require('core/p5.Element');
  require('p5.Font');
  require('core/p5.Graphics2D');
  require('3d/p5.Graphics3D');
  require('image/p5.Image');
  require('p5.Vector');
  require('p5.TableRow');
  require('p5.Table');

  require('color.creating_reading');
  require('color.setting');
  require('core/constants');
  require('data.conversion');
  require('data.array_functions');
  require('data.string_functions');
  require('core/environment');
  require('image/image');
  require('image/loading_displaying');
  require('image/pixels');
  require('input.files');
  require('input.keyboard');
  require('input.acceleration'); //john
  require('input.mouse');
  require('input.time_date');
  require('input.touch');
  require('math.math');
  require('math.calculation');
  require('math.random');
  require('math.noise');
  require('math.trigonometry');
  require('core/rendering');
  require('core/2d_primitives');
  require('3d/3d_primitives');
  require('core/attributes');
  require('core/curves');
  require('core/vertex');
  require('core/structure');
  require('core/transform');
  require('typography.attributes');
  require('typography.loading_displaying');
  require('3d/shaders');

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
