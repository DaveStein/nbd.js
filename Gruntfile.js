module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      build: ['dist']
    },
    jshint: {
      options: {
        boss: true
      },
      test: [
        '*.js',
        'Model/**/*.js',
        'View/**/*.js',
        'Controller/**/*.js',
        'trait/**/*.js',
        'util/**/*.js'
      ],
    },
    requirejs: {
      build: {
        options: grunt.file.readJSON('build/build.json')
      }
    },
    uglify: {
      build: {
        options: {
          report: 'gzip'
        },
        files: {
          'dist/nbd.min.js':['dist/nbd.js']
        }
      }
    },
    karma: {
      options: {
        singleRun: true,
        browsers: ['PhantomJS']
      },
      once: {
        configFile: 'test/karma.conf.js'
      }
    },
    promises: {
      adapter: './test/lib/promise-adapter'
    }
  });

  grunt.registerTask('promises', 'Promises A+ Tests', function() {
    var adapterFile = grunt.config(['promises', 'adapter']),
    adapter = require(adapterFile),
    aplus = require('promises-aplus-tests');
    aplus(adapter, {}, this.async());
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default', ['clean:build', 'jshint', 'requirejs:build', 'uglify:build']);
  grunt.registerTask('test', ['jshint', 'karma:once', 'promises']);
};
