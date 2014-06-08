module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    qunit: {
      files: ['test/*.html']
    },
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
      },
      // css for yuidoc/reference theme (see 'sass' task)
      yuidoc_theme_sass: {
        files: ['docs/yuidoc-p5-theme-src/sass/**/*.scss'],
        tasks: ['sass']
      },
    },
    sass: {
      yuidoc_theme: {
        files: {
          'docs/yuidoc-p5-theme/assets/css/main.css': 'docs/yuidoc-p5-theme-src/sass/main.scss'
        }
      }
    },
    mocha: {
      test: {
        //src: ['test/*.html'],
        src: ['test/**/*.html'],
        options: {
          // reporter: 'test/reporter/simple.js',
          reporter: 'Nyan',
          run: true,
          log: true,
          logErrors: true
        }
      },
    },
    requirejs: {
      unmin: {
        options: {
          baseUrl: '.',
          findNestedDependencies: true,
          include: ['src/app'],
          onBuildWrite: function( name, path, contents ) {
            return require('amdclean').clean(contents);
          },
          optimize: 'none',
          out: 'lib/p5.js',
          paths: {
            'app': 'src/app',
            'color.creating_reading': 'src/color/creating_reading',
            'color.setting': 'src/color/setting',
            'core': 'src/core/core',
            'data.array_functions': 'src/data/array_functions',
            'data.string_functions': 'src/data/string_functions',
            'dom.manipulate': 'src/dom/manipulate',
            'dom.pelement': 'src/dom/pelement',
            'environment': 'src/environment/environment',
            'image': 'src/image/image',
            'image.pixels': 'src/image/pixels',
            'input.files': 'src/input/files',
            'input.keyboard': 'src/input/keyboard',
            'input.mouse': 'src/input/mouse',
            'input.time_date': 'src/input/time_date',
            'input.touch': 'src/input/touch',
            'math.calculation': 'src/math/calculation',
            'math.pvector': 'src/math/pvector',
            'math.random': 'src/math/random',
            'math.noise': 'src/math/noise',
            'math.trigonometry': 'src/math/trigonometry',
            'output.files': 'src/output/files',
            'output.image': 'src/output/image',
            'output.text_area': 'src/output/text_area',
            'shape.2d_primitives': 'src/shape/2d_primitives',
            'shape.attributes': 'src/shape/attributes',
            'shape.curves': 'src/shape/curves',
            'shape.vertex': 'src/shape/vertex',
            'structure': 'src/structure/structure',
            'transform': 'src/transform/transform',
            'typography.attributes': 'src/typography/attributes',
            'typography.loading_displaying': 'src/typography/loading_displaying',
            'canvas': 'src/var/canvas',
            'constants': 'src/var/constants',
            'linearalgebra': 'src/var/linearalgebra',
            'polargeometry': 'src/var/polargeometry',
            'shim': 'src/var/shim',
            'reqwest': 'node_modules/reqwest/reqwest',
            'filters': 'src/image/filters'
          },
          useStrict: true,
          wrap: true
        }
      },
      min: {
        options: {
          baseUrl: '.',
          findNestedDependencies: true,
          include: ['src/app'],
          onBuildWrite: function( name, path, contents ) {
            return require('amdclean').clean(contents);
          },
          optimize: 'uglify2',
          out: 'lib/p5.min.js',
          paths: '<%= requirejs.unmin.options.paths %>',
          useStrict: true,
          wrap: true
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
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.registerTask('test', ['jshint', 'qunit']);
  
  grunt.registerTask('yui', ['yuidoc']);

  //grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
  grunt.registerTask('default', ['jshint', 'requirejs', 'mocha']);

};
