/**
 *  This is the global shared configuration for karma.  Specific
 *  benchmark configuration is located in grunt-karma.js
 */
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    frameworks: [
      'benchmark',
      'detectBrowsers'
    ],

    plugins: [
      'karma-chrome-launcher',
      'karma-edge-launcher',
      'karma-firefox-launcher',
      'karma-ie-launcher',
      'karma-safari-launcher',
      'karma-detect-browsers',
      'karma-benchmark',
      'karma-benchmark-reporter'
    ],

    detectBrowsers: {
      usePhantomJS: false,  // don't use because it's no longer maintained

      // post processing of browsers list
      postDetection: function(availableBrowser) {
        var browsers = [];

        // Filter out nightly and dev builds
        if (availableBrowser.indexOf('Chrome') >-1 )  browsers.push('Chrome');
        if (availableBrowser.indexOf('Firefox') >-1 ) browsers.push('Firefox');
        if (availableBrowser.indexOf('Safari') >-1 )  browsers.push('Safari');
        if (availableBrowser.indexOf('Edge') >-1 )    browsers.push('Edge');
        if (availableBrowser.indexOf('IE') >-1 )      browsers.push('IE');

        return browsers;
      }
    },

    // Default list of files / patterns to load in the browser
    // This can be overriden in grunt-karma.js when using grunt to run karma
    // These files will only be used when running karma directly with: karma start
    files: [
      'lib/p5.js',
      'bench/**/*.bench.js'
    ],

    // test results reporter to use
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [
      'benchmark'
    ],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 3,

    // Sometimes Safari can timeout with the default values, raising these timeouts seem to fix it
    captureTimeout: 60000,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 60000
  })
};
