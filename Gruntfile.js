/**
 *  This is the Gruntfile for p5.js. Grunt is a task runner/builder
 *  which is what p5.js uses to build the source code into the library
 *  and handle other housekeeping tasks.
 *
 *  There are three main tasks:
 *
 *  grunt             - This is the default task, which builds the code, tests it
 *                      using both jslint and mocha, and then minifies it.
 *
 *  grunt yui         - This will build the inline documentation for p5.js.
 *                      The generated documentation is assumed to be
 *                      served from the /reference/ folder of the p5js
 *                      website (https://github.com/processing/p5.js-website).
 *
 *  grunt yui:dev     - This will build the inline documentation but linking to
 *                      remote JS/CSS and assets so pages look correct in local
 *                      testing. The generated documentation is assumed
 *                      to be served from a development web server running
 *                      at the root of the repository. "grunt yui" should
 *                      be run to build docs ready for production.
 *
 *  grunt test        - This rebuilds the source and runs the automated tests on
 *                     both the minified and unminified code. If you need to debug
 *                     a test suite in a browser, `grunt test --keepalive` will
 *                     start the connect server and leave it running; the tests
 *                     can then be opened at localhost:9001/test/test.html
 *
 *  Note: `grunt test:nobuild` will skip the build step when running the tests,
 *  and only runs the test files themselves through the linter: this can save
 *  a lot of time when authoring test specs without making any build changes.
 *
 *  And there are several secondary tasks:
 *
 *
 *  grunt watch       - This watches the source for changes and rebuilds on
 *                      every file change, running the linter and tests.
 *
 *  grunt watch:main  - This watches the source for changes and rebuilds on
 *                      every file change, but does not rebuild the docs.
 *                      It's faster than the default watch.
 *
 *  grunt watch:quick - This watches the source for changes and rebuilds
 *                      p5.js on every file change, but does not rebuild
 *                      docs, and does not perform linting, minification,
 *                      or run tests. It's faster than watch:main.
 *
 *  grunt update_json - This automates updating the bower file
 *                      to match the package.json
 */

function getYuidocOptions() {
  var BASE_YUIDOC_OPTIONS = {
    name: '<%= pkg.name %>',
    description: '<%= pkg.description %>',
    version: '<%= pkg.version %>',
    url: '<%= pkg.homepage %>',
    options: {
      paths: ['src/', 'lib/addons/'],
      themedir: 'docs/yuidoc-p5-theme/',
      helpers: [],
      preprocessor: './docs/preprocessor.js',
      outdir: 'docs/reference/'
    }
  };

  var o = {
    prod: JSON.parse(JSON.stringify(BASE_YUIDOC_OPTIONS)),
    dev: JSON.parse(JSON.stringify(BASE_YUIDOC_OPTIONS))
  };

  o.prod.options.helpers.push('docs/yuidoc-p5-theme/helpers/helpers_prod.js');
  o.dev.options.helpers.push('docs/yuidoc-p5-theme/helpers/helpers_dev.js');

  return o;
}

module.exports = function(grunt) {

  // Specify what reporter we'd like to use for Mocha
  var reporter = 'Nyan';

  // For the static server used in running tests, configure the keepalive.
  // (might not be useful at all.)
  var keepalive = false;
  if (grunt.option('keepalive')) {
    keepalive = true;
  }

  grunt.initConfig({

    // read in the package, used for knowing the current version, et al.
    pkg: grunt.file.readJSON('package.json'),
    // Configure style consistency checking for this file, the source, and the tests.
    jscs: {
      options: {
        config: '.jscsrc',
        reporter: require('jscs-stylish').path
      },
      build: {
        src: [
          'Gruntfile.js',
          'build/**/*.js'
        ]
      },
      source: {
        src: [
          'src/**/*.js',
          '!src/external/**/*.js'
        ]
      },
      test: {
        src: ['test/unit/**/*.js']
      }
    },

    // Configure hinting for this file, the source, and the tests.
    jshint: {
      build: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: [
          'Gruntfile.js',
          'build/**/*.js'
        ]
      },
      source: {
        options: {
          jshintrc: 'src/.jshintrc',
          ignores: [ 'src/external/**/*.js' ]
        },
        src: ['src/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/unit/**/*.js']
      }
    },

    // Set up the watch task, used for live-reloading during development.
    // This watches both the codebase and the yuidoc theme.  Changing the
    // code touches files within the theme, so it will also recompile the
    // documentation.
    watch: {
      quick: {
        files: ['src/**/*.js','src/**/*.frag','src/**/*.vert'],
        tasks: ['browserify'],
        options: {
          livereload: true
        }
      },
      // Watch the codebase for changes
      main: {
        files: ['src/**/*.js'],
        tasks: ['newer:jshint:source','test'],
        options: {
          livereload: true
        }
      },
      // watch the theme for changes
      reference_build: {
        files: ['docs/yuidoc-p5-theme/**/*'],
        tasks: ['yuidoc'],
        options: {
          livereload: true,
          interrupt: true
        }
      },
      // watch the yuidoc/reference theme scripts for changes
      yuidoc_theme_build: {
        files: ['docs/yuidoc-p5-theme-src/scripts/**/*'],
        tasks: ['requirejs:yuidoc_theme']
      },
      // Watch the codebase for doc updates
      yui:{
        files:['src/**/*.js', 'lib/addons/*.js'],
        task:['yuidoc']
      }
    },

    // Set up node-side (non-browser) mocha tests.
    mochaTest: {
      test: {
        src: ['test/node/**/*.js']
      }
    },

    // Set up the mocha task, used for running the automated tests.
    mocha: {
      yui: {
        options: {
          urls: [
            'http://localhost:9001/test/test-reference.html'
          ],
          reporter: reporter,
          run: false,
          log: true,
          logErrors: true
        }
      },
      test: {
        options: {
          urls: [
            'http://localhost:9001/test/test.html',
            'http://localhost:9001/test/test-minified.html'
          ],
          reporter: reporter,
          run: true,
          log: true,
          logErrors: true,
          timeout: 5000
        }
      },
    },

    // This is a standalone task, used to automatically update the bower.json
    // file to match the values in package.json.   It is (likely) used as part
    // of the manual release strategy.
    update_json: {
      // set some task-level options
      options: {
        src: 'package.json',
        indent: '\t'
      },
      // update bower.json with data from package.json
      bower: {
        src: 'package.json', // where to read from
        dest: 'bower.json', // where to write to
        // the fields to update, as a String Grouping
        fields: 'name version description repository'
      }
    },

    // The actual compile step:  This should collect all the dependencies
    // and compile them into a single file.
    requirejs: {

      // This generates the theme for the documentation from the theme source
      // files.
      yuidoc_theme: {
        options: {
          baseUrl: './docs/yuidoc-p5-theme-src/scripts/',
          mainConfigFile: './docs/yuidoc-p5-theme-src/scripts/config.js',
          name: 'main',
          out: './docs/yuidoc-p5-theme/assets/js/reference.js',
          optimize: 'none',
          generateSourceMaps: true,
          findNestedDependencies: true,
          wrap: true,
          paths: {
            'jquery': 'empty:'
          }
        }
      }
    },

    // This minifies the javascript into a single file and adds a banner to the
    // front of the file.
    uglify: {
      options: {
        compress: {
          global_defs: {
            'IS_MINIFIED': true
          }
        },
        banner: '/*! p5.js v<%= pkg.version %> <%= grunt.template.today("mmmm dd, yyyy") %> */ '
      },
      dist: {
        files: {
          'lib/p5.min.js': 'lib/p5.js',
          'lib/addons/p5.dom.min.js': 'lib/addons/p5.dom.js'
        }
      }
    },

    // this builds the documentation for the codebase.
    yuidoc: getYuidocOptions(),
    'release-it': {
      options: {
        pkgFiles: ['package.json'],
        commitMessage: 'release v%s',
        tagName: '%s',
        tagAnnotation: 'release v%s',
        buildCommand: 'grunt',
        changelogCommand: 'git log --pretty=format:"* %s (%h)" [REV_RANGE]',
        distRepo: 'git@github.com:lmccart/p5.js-release.git',
        distStageDir: '.stage',
        distFiles: ['lib/*.js', 'lib/addons/*.js'],
        distBase: 'lib/',
        npm: {
          publish: false,
          publishPath: 'lib/'
        }
      }
    },
    // This is a static server which is used when testing connectivity for the
    // p5 library. This avoids needing an internet connection to run the tests.
    // It serves all the files in the test directory at http://localhost:9001/
    connect: {
      server: {
        options: {
          base: './',
          port: 9001,
          keepalive: keepalive,
          middleware: function(connect, options, middlewares) {
            middlewares.unshift(function(req, res, next) {
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', '*');
              return next();
            });
            return middlewares;
          }
        }
      }
    },
    'saucelabs-mocha': {
      all: {
        options: {
          urls: ['http://127.0.0.1:9001/test/test.html'],
          tunnelTimeout: 5,
          build: process.env.TRAVIS_JOB_ID,
          concurrency: 3,
          browsers: [
            {browserName: 'chrome'},
            {browserName: 'firefox', platform: 'Linux', version: '42.0'},
            {browserName: 'safari'},
          ],
          testname: 'p5.js mocha tests',
          tags: ['master']
        }
      }
    },
    minjson: {
      compile: {
        files: {
          './docs/reference/data.min.json': './docs/reference/data.json'
        }
      }
    }
  });

  // Load task definitions
  grunt.loadTasks('build/tasks');

  // Load the external libraries used.
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-update-json');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-release-it');
  grunt.loadNpmTasks('grunt-saucelabs');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-minjson');

  // Create the multitasks.
  // TODO: "requirejs" is in here to run the "yuidoc_themes" subtask. Is this needed?
  grunt.registerTask('build', ['browserify', 'uglify', 'requirejs']);
  grunt.registerTask('test', ['jshint', 'jscs', 'build', 'yuidoc:dev', 'connect', 'mocha', 'mochaTest']);
  grunt.registerTask('test:nobuild', ['jshint:test', 'jscs:test', 'connect', 'mocha']);
  grunt.registerTask('yui', ['yuidoc:prod', 'minjson']);
  grunt.registerTask('yui:dev', ['yuidoc:dev', 'minjson']);
  grunt.registerTask('yui:test', ['yuidoc:dev', 'connect', 'mocha:yui']);
  grunt.registerTask('default', ['test']);
  grunt.registerTask('saucetest', ['connect', 'saucelabs-mocha']);
};
