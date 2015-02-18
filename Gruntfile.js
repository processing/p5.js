module.exports = function(grunt) {

  var reporter = 'Dot';
  var keepalive = false;
  if (grunt.option('keepalive')) {
    keepalive = true;
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      build: {
        options: {jshintrc: '.jshintrc'},
        src: ['Gruntfile.js']
      },
      source: {
        options: {jshintrc: 'src/.jshintrc'},
        src: ['src/**/*.js']
      },
      test: {
        options: {jshintrc: 'test/.jshintrc'},
        src: ['test/unit/**/*.js']
      }
    },
    watch: {
      // p5 dist
      main: {
        files: ['src/**/*.js'],
        tasks: ['jshint', 'requirejs'],
        options: { livereload: true }
      },
      // reference
      reference_build: {
        files: ['docs/yuidoc-p5-theme/**/*'],
        tasks: ['yuidoc'],
        options: { livereload: true, interrupt: true }
      },
      // scripts for yuidoc/reference theme
      yuidoc_theme_build: {
        files: ['docs/yuidoc-p5-theme-src/scripts/**/*'],
        tasks: ['requirejs:yuidoc_theme']
      }
    },
    mocha: {
      test: {
        //src: ['test/*.html'],
        src: ['test/**/*.html'],
        options: {
          reporter: reporter,
          run: true,
          log: true,
          logErrors: true
        }
      },
    },
    update_json: {
      // set some task-level options
      options: {
        src: 'package.json',
        indent: '\t'
      },
      // update bower.json with data from package.json
      bower: {
        src: 'package.json',    // where to read from
        dest: 'bower.json',     // where to write to
        // the fields to update, as a String Grouping
        fields: 'name version description repository'
      }
    },
    requirejs: {
      unmin: {
        options: {
          baseUrl: '.',
          findNestedDependencies: true,
          include: ['src/app'],
          onBuildWrite: function( name, path, contents ) {
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
          optimize: 'none',
          out: 'lib/p5.js',
          paths: {
            'app': 'src/app',
            'p5.Color': 'src/objects/p5.Color',
            'p5.Element': 'src/objects/p5.Element',
            'p5.File': 'src/objects/p5.File',
            'p5.Graphics': 'src/objects/p5.Graphics',
            'p5.Image': 'src/objects/p5.Image',
            //'p5.Shape': 'src/objects/p5.Shape',
            'p5.Vector': 'src/objects/p5.Vector',
            'p5.TableRow': 'src/objects/p5.TableRow',
            'p5.Table': 'src/objects/p5.Table',
            'color.creating_reading': 'src/color/creating_reading',
            'color.setting': 'src/color/setting',
            'core': 'src/core/core',
            'constants': 'src/core/constants',
            'data.conversion': 'src/data/conversion',
            'data.array_functions': 'src/data/array_functions',
            'data.string_functions': 'src/data/string_functions',
            'environment': 'src/environment/environment',
            'image.image': 'src/image/image',
            'image.loading_displaying': 'src/image/loading_displaying',
            'image.pixels': 'src/image/pixels',
            'input.files': 'src/input/files',
            'input.keyboard': 'src/input/keyboard',
            'input.mouse': 'src/input/mouse',
            'input.time_date': 'src/input/time_date',
            'input.touch': 'src/input/touch',
            'math.math': 'src/math/math',
            'math.calculation': 'src/math/calculation',
            'math.random': 'src/math/random',
            'math.noise': 'src/math/noise',
            'math.trigonometry': 'src/math/trigonometry',
            'output.files': 'src/output/files',
            'output.image': 'src/output/image',
            'output.text_area': 'src/output/text_area',
            'rendering.rendering': 'src/rendering/rendering',
            'shape.2d_primitives': 'src/shape/2d_primitives',
            'shape.attributes': 'src/shape/attributes',
            'shape.curves': 'src/shape/curves',
            //'shape.shape': 'src/shape/shape',
            'shape.vertex': 'src/shape/vertex',
            'structure': 'src/structure/structure',
            'transform': 'src/transform/transform',
            'typography.attributes': 'src/typography/attributes',
            'typography.loading_displaying': 'src/typography/loading_displaying',
            'canvas': 'src/var/canvas',
            'linearalgebra': 'src/var/linearalgebra',
            'polargeometry': 'src/var/polargeometry',
            'shim': 'src/var/shim',
            'reqwest': 'node_modules/reqwest/reqwest',
            'filters': 'src/image/filters',
            'utils.color_utils': 'src/utils/color_utils'
          },
          useStrict: true,
          wrap: {
            start:
              ['/*! p5.js v<%= pkg.version %> <%= grunt.template.today("mmmm dd, yyyy") %> */',
              '(function (root, factory) {',
              '  if (typeof define === \'function\' && define.amd)',
              '    define(\'p5\', [], function () { return (root.returnExportsGlobal = factory());});',
              '  else if (typeof exports === \'object\')',
              '    module.exports = factory();',
              '  else',
              '    root[\'p5\'] = factory();',
              '}(this, function () {\n'].join('\n'),
            end: 'return amdclean[\'src_app\'];\n}));'
          }
        }
      },
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
          paths: { 'jquery': 'empty:' }
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! p5.js v<%= pkg.version %> <%= grunt.template.today("mmmm dd, yyyy") %> */'
      },
      build: {
        src: '<%= requirejs.unmin.options.out %>',
        dest: 'lib/p5.min.js'
      }
    },
    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          paths: ['src/', 'lib/addons/'],
          //helpers: [],
          themedir: 'docs/yuidoc-p5-theme/',
          outdir: 'docs/reference/'
        }
      }
    },
    release: {
      options: {
        github: {
          repo: 'lmccart/p5.js', //put your user/repo here
          usernameVar: process.env.GITHUB_USERNAME, //ENVIRONMENT VARIABLE that contains Github username
          passwordVar: process.env.GITHUB_PASSWORD //ENVIRONMENT VARIABLE that contains Github password
        }
      }
    },
    connect: {
      server: {
        options: {
          base: './test',
          port: 9001,
          keepalive: keepalive,
          middleware: function(connect, options, middlewares) {
            middlewares.unshift(function (req, res, next) {
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

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-release');
  grunt.loadNpmTasks('grunt-update-json');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.registerTask('test', ['connect', 'jshint', 'mocha']);
  grunt.registerTask('yui', ['yuidoc']);
  grunt.registerTask('default', ['connect', 'jshint', 'requirejs', 'mocha', 'uglify']);

};
