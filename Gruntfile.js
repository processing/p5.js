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
 *  grunt test        - This rebuilds the source and runs the automated tests on
 *                     both the minified and unminified code. If you need to debug
 *                     a test suite in a browser, `grunt test --keepalive` will
 *                     start the connect server and leave it running; the tests
 *                     can then be opened at localhost:9001/test/test.html
 *
 *  grunt yui:dev     - This rebuilds the inline documentation. It also rebuilds
 *                     each time a change to the source is detected. You can preview
 *                     the reference at localhost:9001/docs/reference/
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
 *  grunt karma       - This runs the performance benchmarks in
 *                      multiple real browsers on the developers local machine.
 *                      It will automatically detect which browsers are
 *                      installed from the following list (Chrome, Firefox,
 *                      Safari, Edge, IE) and run the benchmarks in all installed
 *                      browsers and report the results. Running "grunt karma"
 *                      will execute ALL the benchmarks. If you want to run a
 *                      specific benchmark you can by specifying the target e.g.
 *                      "grunt karma:random-dev". The available targets are
 *                      defined in grunt-karma.js.
 *
 *  Contributors list can be updated using all-contributors-cli:
 *  https://www.npmjs.com/package/all-contributors-cli
 *
 *  all-contributors generate - Generates new contributors list for README
 */

function getYuidocOptions() {
  const BASE_YUIDOC_OPTIONS = {
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

  // note dev is no longer used, prod is used to build both testing and production ready docs

  const o = {
    prod: JSON.parse(JSON.stringify(BASE_YUIDOC_OPTIONS)),
    dev: JSON.parse(JSON.stringify(BASE_YUIDOC_OPTIONS))
  };

  o.prod.options.helpers.push('docs/yuidoc-p5-theme/helpers/helpers_prod.js');
  o.dev.options.helpers.push('docs/yuidoc-p5-theme/helpers/helpers_dev.js');

  return o;
}

module.exports = grunt => {
  // Specify what reporter we'd like to use for Mocha
  const quietReport = process.env.TRAVIS || grunt.option('quiet');
  const reporter = quietReport ? 'spec' : 'Nyan';

  // Load karma tasks from an external file to keep this file clean
  const karmaTasks = require('./grunt-karma.js');

  // For the static server used in running tests, configure the keepalive.
  // (might not be useful at all.)
  let keepalive = false;
  if (grunt.option('keepalive')) {
    keepalive = true;
  }

  const mochaConfig = {
    yui: {
      options: {
        urls: ['http://localhost:9001/test/test-reference.html'],
        reporter: reporter,
        run: false,
        log: true,
        logErrors: true,
        growlOnSuccess: false
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
        timeout: 100000,
        growlOnSuccess: false
      }
    }
  };

  let gruntConfig = {
    // read in the package, used for knowing the current version, et al.
    pkg: grunt.file.readJSON('package.json'),

    // Configure style consistency checking for this file, the source, and the tests.
    eslint: {
      options: {
        format: 'unix'
      },
      build: {
        src: [
          'Gruntfile.js',
          'grunt-karma.js',
          'docs/preprocessor.js',
          'utils/**/*.js',
          'tasks/**/*.js'
        ]
      },
      fix: {
        // src: is calculated below...
        options: {
          rules: {
            'no-undef': 0,
            'no-unused-vars': 0
          },
          fix: true
        }
      },
      source: {
        options: {
          parserOptions: {
            ecmaVersion: 5
          }
        },
        src: ['src/**/*.js', 'lib/addons/p5.dom.js']
      },
      test: {
        src: ['bench/**/*.js', 'test/**/*.js', '!test/js/*.js']
      }
    },

    'eslint-samples': {
      options: {
        parserOptions: {
          ecmaVersion: 6
        },
        format: 'unix'
      },
      source: {
        src: ['src/**/*.js', 'lib/addons/p5.dom.js']
      },
      fix: {
        options: {
          fix: true
        }
      }
    },

    // Set up the watch task, used for live-reloading during development.
    // This watches both the codebase and the yuidoc theme.  Changing the
    // code touches files within the theme, so it will also recompile the
    // documentation.
    watch: {
      quick: {
        files: ['src/**/*.js', 'src/**/*.frag', 'src/**/*.vert'],
        tasks: ['browserify'],
        options: {
          livereload: true
        }
      },
      // Watch the codebase for changes
      main: {
        files: ['src/**/*.js'],
        tasks: ['newer:eslint:source', 'test'],
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
      // Watch the codebase for doc updates
      // launch with 'grunt requirejs connect watch:yui'
      yui: {
        files: [
          'src/**/*.js',
          'lib/addons/*.js',
          'src/**/*.frag',
          'src/**/*.vert'
        ],
        tasks: [
          'browserify',
          'browserify:min',
          'yuidoc:prod',
          'clean:reference',
          'minjson',
          'uglify'
        ],
        options: {
          livereload: true
        }
      }
    },

    // Set up node-side (non-browser) mocha tests.
    mochaTest: {
      test: {
        src: ['test/node/**/*.js'],
        options: {
          reporter: reporter,
          ui: 'tdd'
        }
      }
    },

    // Set up the mocha task, used for running the automated tests.
    mocha: mochaConfig,

    mochaChrome: mochaConfig,

    nyc: {
      report: {
        options: {
          reporter: 'text-summary'
        }
      }
    },

    // This minifies the javascript into a single file and adds a banner to the
    // front of the file.
    uglify: {
      options: {
        compress: {
          global_defs: {
            IS_MINIFIED: true
          }
        },
        banner:
          '/*! p5.js v<%= pkg.version %> <%= grunt.template.today("mmmm dd, yyyy") %> */ '
      },
      dist: {
        files: {
          'lib/p5.min.js': 'lib/p5.pre-min.js',
          'lib/addons/p5.dom.min.js': 'lib/addons/p5.dom.js'
        }
      }
    },

    // this builds the documentation for the codebase.
    yuidoc: getYuidocOptions(),

    // Clean up unused files generated by yuidoc
    clean: {
      reference: {
        src: [
          'docs/reference/classes/',
          'docs/reference/elements/',
          'docs/reference/files/',
          'docs/reference/modules/',
          'docs/reference/api.js'
        ]
      }
    },

    // This runs benchmarks in multiple real browsers for developing
    // performance optimizations
    karma: karmaTasks,

    // This is a static server which is used when testing connectivity for the
    // p5 library. This avoids needing an internet connection to run the tests.
    // It serves all the files in the test directory at http://localhost:9001/
    connect: {
      server: {
        options: {
          directory: {
            path: './',
            options: {
              icons: true
            }
          },
          port: 9001,
          keepalive: keepalive,
          middleware: function(connect, options, middlewares) {
            middlewares.unshift(
              require('connect-modrewrite')([
                '^/assets/js/p5(\\.min)?\\.js(.*) /lib/p5$1.js$2 [L]',
                '^/assets/js/p5\\.(dom|sound)(\\.min)?\\.js(.*) /lib/addons/p5.$1$2.js$3 [L]'
              ]),
              function(req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', '*');
                return next();
              }
            );
            return middlewares;
          }
        }
      },
      yui: {
        options: {
          directory: {
            path: './',
            options: {
              icons: true
            }
          },
          port: 9001,
          open: 'http://127.0.0.1:9001/docs/reference/',
          keepalive: keepalive,
          middleware: function(connect, options, middlewares) {
            middlewares.unshift(
              require('connect-modrewrite')([
                '^/assets/js/p5(\\.min)?\\.js(.*) /lib/p5$1.js$2 [L]',
                '^/assets/js/p5\\.(dom|sound)(\\.min)?\\.js(.*) /lib/addons/p5.$1$2.js$3 [L]'
              ]),
              function(req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', '*');
                return next();
              }
            );
            return middlewares;
          }
        }
      },
      test: {
        options: {
          directory: {
            path: './',
            options: {
              icons: true
            }
          },
          port: 9001,
          open: 'http://127.0.0.1:9001/test/',
          keepalive: keepalive,
          middleware: function(connect, options, middlewares) {
            middlewares.unshift(
              require('connect-modrewrite')([
                '^/assets/js/p5(\\.min)?\\.js(.*) /lib/p5$1.js$2 [L]',
                '^/assets/js/p5\\.(dom|sound)(\\.min)?\\.js(.*) /lib/addons/p5.$1$2.js$3 [L]'
              ]),
              function(req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', '*');
                return next();
              }
            );
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
            { browserName: 'chrome' },
            { browserName: 'firefox', platform: 'Linux', version: '42.0' },
            { browserName: 'safari' }
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
  };

  // eslint fixes everything it checks:
  gruntConfig.eslint.fix.src = Object.keys(gruntConfig.eslint)
    .map(s => gruntConfig.eslint[s].src)
    .reduce((a, b) => a.concat(b), [])
    .filter(a => a);

  /* not yet
  gruntConfig['eslint-samples'].fix.src = Object.keys(
    gruntConfig['eslint-samples']
  )
    .map(s => gruntConfig['eslint-samples'][s].src)
    .reduce((a, b) => a.concat(b), [])
    .filter(a => a);
  */

  grunt.initConfig(gruntConfig);

  // Load build tasks.
  // This contains the complete build task ("browserify")
  // and the task to generate user select modules of p5
  // ("combineModules") which can be invoked directly by
  // `grunt combineModules:module_1:module_2` where core
  // is included by default in all combinations always.
  // NOTE: "module_x" is the name of it's folder in /src.
  grunt.loadTasks('tasks/build');

  // Load release task
  grunt.loadTasks('tasks/release');

  // Load tasks for testing
  grunt.loadTasks('tasks/test');

  // Load the external libraries used.
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-minjson');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-release-it');
  grunt.loadNpmTasks('grunt-saucelabs');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-simple-nyc');

  // Create the multitasks.
  grunt.registerTask('build', ['browserify', 'browserify:min', 'uglify']);
  grunt.registerTask('lint-no-fix', [
    'yui', // required for eslint-samples
    'eslint:build',
    'eslint:source',
    'eslint:test',
    'eslint-samples:source'
  ]);
  grunt.registerTask('lint-fix', ['eslint:fix']);
  grunt.registerTask('test', [
    'lint-no-fix',
    //'yuidoc:prod', // already done by lint-no-fix
    'build',
    'connect:server',
    'mochaChrome',
    'mochaTest',
    'nyc:report'
  ]);
  grunt.registerTask('test:nobuild', [
    'eslint:test',
    'connect:server',
    'mochaChrome',
    'mochaTest',
    'nyc:report'
  ]);
  grunt.registerTask('yui', ['yuidoc:prod', 'clean:reference', 'minjson']);
  grunt.registerTask('yui:test', [
    'yuidoc:prod',
    'clean:reference',
    'connect:yui',
    'mochaChrome:yui'
  ]);
  grunt.registerTask('yui:dev', [
    'yui:prod',
    'clean:reference',
    'build',
    'connect:yui',
    'watch:yui'
  ]);
  grunt.registerTask('yui:build', ['yui']);
  grunt.registerTask('default', ['test']);
  grunt.registerTask('saucetest', ['connect:server', 'saucelabs-mocha']);
};
