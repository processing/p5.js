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
 *                      every file change, running the linter and tests.
 *
 *  grunt watch:main  - This watches the source for changes and rebuilds on
 *                      every file change, but does not rebuild the docs.
 *                      It's faster than the default watch.
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

    // Configure style consistency checking for this file, the source, and the tests.
    jscs: {
      options: {
        config: '.jscsrc',
        reporter: require('jscs-stylish').path
      },
      build: {
        src: ['Gruntfile.js']
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
        tasks: ['newer:jshint:source','requirejs:p5_unminified','mocha'],
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
        files:['src/**/*.js'],
        task:['yuidoc']
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

    // Build p5 into a single, UMD-wrapped file
    browserify: {
      p5: {
        options: {
          browserifyOptions: {
            standalone: 'p5'
          }
        },
        src: 'src/app.js',
        dest: 'lib/p5.js'
      }
    },

    // Concatenate p5 together with OpenType
    // TODO: There may be an opportunity to move this into the main p5 build
    concat: {
      p5: {
        src: [
          'lib/p5.js',
          'src/external/opentype.min.js'
        ],
        dest: 'lib/p5.js',
      },
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
        banner: '/*! p5.js v<%= pkg.version %> <%= grunt.template.today("mmmm dd, yyyy") %> */',
        footer: 'p5.prototype._validateParameters = function() {};'+
        'p5.prototype._friendlyFileLoadError = function() {};'
      },
      build: {
        src: 'lib/p5.js',
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
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');
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

  // Create the multitasks.
  // TODO: "requirejs" is in here to run the "yuidoc_themes" subtask. Is this needed?
  grunt.registerTask('build', ['browserify', 'concat', 'uglify', 'requirejs']);
  grunt.registerTask('test', ['connect', 'jshint', 'jscs', 'build', 'mocha']);
  grunt.registerTask('yui', ['yuidoc']);
  grunt.registerTask('default', ['test']);
};
