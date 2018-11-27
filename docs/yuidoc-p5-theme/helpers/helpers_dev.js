var configHelpers = {};

// For development, we want the links to parts of the p5 website to work,
// so we make them absolute. However, we want links to the p5 libraries
// to point to the generated files on our development server, so we'll
// reference them accordingly.
var config = {
  p5SiteRoot: 'http://staging.p5js.org',
  p5Lib: '/lib/p5.min.js',
  p5SoundLib: '/lib/addons/p5.sound.min.js',
  p5DomLib: '/lib/addons/p5.dom.min.js'
};

Object.keys(config).forEach(function(key) {
  configHelpers[key] = function() {
    return config[key];
  };
});

module.exports = configHelpers;
