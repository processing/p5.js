var configHelpers = {};
var config = {
  p5SiteRoot: 'http://p5js.org',
  p5Lib: '/lib/p5.js',
  p5SoundLib: '/lib/addons/p5.sound.js',
  p5DomLib: '/lib/addons/p5.dom.js'
};

Object.keys(config).forEach(function(key) {
  configHelpers[key] = function() {
    return config[key];
  };
});

module.exports = configHelpers;
