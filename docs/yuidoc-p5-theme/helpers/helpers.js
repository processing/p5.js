var config;
var configHelpers = {};

if (process.env.P5_SITE_ROOT) {
  config = {
    p5SiteRoot: process.env.P5_SITE_ROOT,
    p5Lib: process.env.P5_SITE_ROOT + '/js/p5.min.js',
    p5SoundLib: process.env.P5_SITE_ROOT + '/js/p5.sound.js',
    p5DomLib: process.env.P5_SITE_ROOT + '/js/p5.dom.js'
  };
} else {
  config = {
    p5SiteRoot: 'http://p5js.org',
    p5Lib: '/lib/p5.js',
    p5SoundLib: '/lib/addons/p5.sound.js',
    p5DomLib: '/lib/addons/p5.dom.js'
  };
}

Object.keys(config).forEach(function(key) {
  configHelpers[key] = function() {
    return config[key];
  };
});

module.exports = configHelpers;
