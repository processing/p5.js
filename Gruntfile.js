/**
 *  This is the Gruntfile for p5.js. Grunt is a task runner/builder
 *  which is what p5.js uses to build the source code into the library
 *  and handle other housekeeping tasks.
 *
 *  There are three main tasks:
 *
 *  grunt       - This is the default task, which builds the code, tests it
 *                using both jslint and mocha, and then minifies it.
 *
 *  grunt yui   - This will build the inline documentation for p5.js.
 *
 *  grunt test  - This only runs the automated tests, which is faster than
 *                rebuilding entirely from source because it skips minification
 *                and concatination.
 *
 *  And there are several secondary tasks:
 *
 *
 *  grunt watch       - This watches the source for changes and rebuilds on
 *                      every file change.
 *
 *  grunt update_json - This automates updating the bower file
 *                      to match the package.json
 */

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

    // Configure hinting for this file, the source, and the tests.
    jshint: {
      build: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['Gruntfile.js']
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
      // Watch the codebase for changes
      main: {
        files: ['src/**/*.js'],
        tasks: ['jshint', 'requirejs'],
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
      }
    },

    // Set up the mocha task, used for running the automated tests.
    mocha: {
      test: {
        src: ['test/**/*.html'],
        options: {
          reporter: reporter,
          run: true,
          log: true,
          logErrors: true
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
      p5_unminified: {
        options: {
          baseUrl: '.', // from whence do the files come?
          optimize: 'none', // skip running uglify on the concatenated code
          out: 'lib/p5.js', // name of the output file
          useStrict: true, // Allow "use strict"; be included in the RequireJS files.
          //findNestedDependencies: true,   // automatically find nested deps.  Doesn't appear to effect the code?
          include: ['src/app'], // this is the file which we are actually building

          // This will add a prefix and a suffix to the generated code.
          // we're using this to both add a time/version stamp
          // and also to wrap this in a commonjs/AMD header.
          // there's also the **amdclean** stuff—not sure what that is yet.
          wrap: {
            start: ['/*! p5.js v<%= pkg.version %> <%= grunt.template.today("mmmm dd, yyyy") %> */',
              '(function (root, factory) {',
              '  if (typeof define === \'function\' && define.amd)',
              '    define(\'p5\', [], function () { return (root.returnExportsGlobal = factory());});',
              '  else if (typeof exports === \'object\')',
              '    module.exports = factory();',
              '  else',
              '    root[\'p5\'] = factory();',
              '}(this, function () {\n'
            ].join('\n'),
            end: 'return amdclean[\'src_app\'];\n}));'
          },
          // This will transform the compiled file, reversing out the AMD loader and creating a
          // static JS file.  This code is potentially problematic.
          onBuildWrite: function(name, path, contents) {
            if (name === 'reqwest') {
              contents = contents.replace('}(\'reqwest\', this, function () {', '}(\'reqwest\', amdclean, function () {');
            }
            return require('amdclean').clean({
              code: contents,
              'globalObject': true,
              escodegen: {
                'comment': true,
                'format': {
                  'indent': {
                    'style': '  ',
                    'adjustMultilineComment': true
                  }
                }
              }
            });
          },

          // This is a list of all dependencies, mapped to their AMD identifier.
          paths: {
            'app': 'src/app',

            // core
            'canvas': 'src/core/canvas',
            'constants': 'src/core/constants',
            'core': 'src/core/core',
            'environment': 'src/core/environment',
            'helpers': 'src/core/error_helpers',
            'p5.Element': 'src/core/p5.Element',
            'p5.Graphics': 'src/core/p5.Graphics',
            'p5.Graphics2D': 'src/core/p5.Graphics2D',
            'rendering.rendering': 'src/core/rendering',
            'shape.2d_primitives': 'src/core/2d_primitives',
            'shape.attributes': 'src/core/attributes',
            'shape.curves': 'src/core/curves',
            'shape.vertex': 'src/core/vertex',
            'shim': 'src/core/shim',
            'structure': 'src/core/structure',
            'transform': 'src/core/transform',

            // 3d
            'p5.Graphics3D': 'src/3d/p5.Graphics3D',
            'mat4': 'src/3d/mat4',
            'shaders': 'src/3d/shaders',
            'shape.3d_primitives': 'src/3d/3d_primitives',
            // p5.Matrix not included currently?

            // image
            'filters': 'src/image/filters',
            'image.image': 'src/image/image',
            'image.loading_displaying': 'src/image/loading_displaying',
            'image.pixels': 'src/image/pixels',
            'p5.Image': 'src/image/p5.Image',

            // typography
            'p5.Font': 'src/typography/p5.Font',
            'typography.attributes': 'src/typography/attributes',
            'typography.loading_displaying': 'src/typography/loading_displaying',

            // math
            'p5.Vector': 'src/math/p5.Vector',
            'polargeometry': 'src/math/polargeometry',
            'math.calculation': 'src/math/calculation',
            'math.math': 'src/math/math',
            'math.noise': 'src/math/noise',
            'math.random': 'src/math/random',
            'math.trigonometry': 'src/math/trigonometry',

            // events
            'input.acceleration': 'src/events/acceleration',
            'input.keyboard': 'src/events/keyboard',
            'input.mouse': 'src/events/mouse',
            'input.touch': 'src/events/touch',


            // io
            'input.files': 'src/io/files',
            'p5.TableRow': 'src/io/p5.TableRow',
            'p5.Table': 'src/io/p5.Table',

            // utilities
            'input.time_date': 'src/utilities/time_date',
            'data.conversion': 'src/utilities/conversion',
            'data.array_functions': 'src/utilities/array_functions',
            'data.string_functions': 'src/utilities/string_functions',

            // color
            'p5.Color': 'src/color/p5.Color',
            'color.creating_reading': 'src/color/creating_reading',
            'color.setting': 'src/color/setting',
            'utils.color_utils': 'src/color/color_utils',

            // external library
            'reqwest': 'node_modules/reqwest/reqwest'
          },
          done: function(done, output) {
            require('concat-files')([
              'lib/p5.js',
              'src/external/opentype.min.js',
            ], 'lib/p5.js', function() {
              done();
            });
          }
        }
      },

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
        banner: '/*! p5.js v<%= pkg.version %> <%= grunt.template.today("mmmm dd, yyyy") %> */',
        footer: 'p5.prototype._validateParameters = function() {};'+
        'p5.prototype._friendlyFileLoadError = function() {};'
      },
      build: {
        src: '<%= requirejs.p5_unminified.options.out %>',
        dest: 'lib/p5.min.js'
      }
    },

    // this builds the documentation for the codebase.
    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          paths: ['src/', 'lib/addons/'],
          themedir: 'docs/yuidoc-p5-theme/',
          outdir: 'docs/reference/'
        }
      }
    },
    release: {
      options: {
        github: {
          repo: 'processing/p5.js', //put your user/repo here
          usernameVar: process.env.GITHUB_USERNAME, //ENVIRONMENT VARIABLE that contains Github username
          passwordVar: process.env.GITHUB_PASSWORD //ENVIRONMENT VARIABLE that contains Github password
        }
      }
    },
    // This is a static server which is used when testing connectivity for the
    // p5 library. This avoids needing an internet connection to run the tests.
    // It serves all the files in the test directory at http://localhost:9001/
    connect: {
      server: {
        options: {
          base: './test',
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
    }
  });

  // Load the external libraries used.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-update-json');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Create the multitasks.
  grunt.registerTask('test', ['connect', 'jshint', 'requirejs', 'mocha']);
  grunt.registerTask('yui', ['yuidoc']);
  grunt.registerTask('default', ['connect', 'jshint', 'requirejs', 'mocha', 'uglify']);
};
