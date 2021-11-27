var configHelpers = {};

// For production, the reference docs are put in the /reference/ folder
// of the p5 website, so we'll define our paths with this assumption.
// For more context, see https://github.com/processing/p5.js-website.
var config = {
  p5SiteRoot: '..',
  p5Lib: '../js/p5.min.js',
  p5SoundLib: '../js/p5.sound.min.js'
};

Object.keys(config).forEach(function(key) {
  configHelpers[key] = function() {
    return config[key];
  };
});

module.exports = configHelpers;
