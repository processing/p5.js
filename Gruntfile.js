module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    qunit: {
      files: ['test/*.html']
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/math/*.js'],
      options: {
        // options here to override JSHint defaults
        eqnull: true,
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    },
    mocha: {
      test: {
        //src: ['test/*.html'],
        src: ['test/**/*.html'],
        options: {
          run: true,
          log: true
        }
      },
    },
    requirejs: {
      unmin: {
        options: {
          baseUrl: '.',
          findNestedDependencies: true,
          include: ['src/p5'],
          onBuildWrite: function( name, path, contents ) {
            return require('amdclean').clean(contents);
          },
          optimize: 'none',
          out: 'dist/p5.js',
          paths: {
            'p5': 'src/p5',
            'color.creating_reading': 'src/color/creating_reading',
            'color.setting': 'src/color/setting',
            'core': 'src/core/core',
            'data.array_functions': 'src/data/array_functions',
            'data.string_functions': 'src/data/string_functions',
            'dom.manipulate': 'src/dom/manipulate',
            'dom.pelement': 'src/dom/pelement',
            'environment': 'src/environment/environment',
            'image': 'src/image/image',
            'image.loading_displaying': 'src/image/loading_displaying',
            'input.files': 'src/input/files',
            'input.keyboard': 'src/input/keyboard',
            'input.mouse': 'src/input/mouse',
            'input.time_date': 'src/input/time_date',
            'input.touch': 'src/input/touch',
            'math.calculation': 'src/math/calculation',
            'math.pvector': 'src/math/pvector',
            'math.random': 'src/math/random',
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
            'reqwest': 'node_modules/reqwest/reqwest'
          },
          useStrict: true,
          wrap: true
        }
      },
      min: {
        options: {
          baseUrl: '.',
          findNestedDependencies: true,
          include: ['src/p5'],
          onBuildWrite: function( name, path, contents ) {
            return require('amdclean').clean(contents);
          },
          optimize: 'uglify2',
          out: 'dist/p5.min.js',
          paths: '<%= requirejs.unmin.options.paths %>',
          useStrict: true,
          wrap: true
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.registerTask('test', ['jshint', 'qunit']);

  //grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
  grunt.registerTask('default', ['jshint', 'requirejs']);

};