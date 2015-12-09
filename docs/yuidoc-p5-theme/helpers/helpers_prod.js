var configHelpers = {};
var config = {
  p5SiteRoot: 'http://p5js.org',
  p5Lib: 'http://p5js.org/js/p5.min.js',
  p5SoundLib: 'http://p5js.org/js/p5.sound.js',
  p5DomLib: 'http://p5js.org/js/p5.dom.js'
};

Object.keys(config).forEach(function(key) {
  configHelpers[key] = function() {
    return config[key];
  };
});

module.exports = configHelpers;
