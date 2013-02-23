module.exports = function (grunt) {
  'use strict';

  //Project Configuration
  grunt.initConfig({
    watch: {
      less: {
        files: 'less/**/*.less',
        tasks: ['less:development'],
        options: {
          interrupt : true
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      frontend: {
        src: [
        'public/**/*.js',
        '!public/js/templates.js',
        '!public/js/vendor/**/*.js'
        ]
      },
      backend: {
        src: [
        '**/*.js',
        '!node_modules/**/*.js',
        '!public/**/*.js',
        '!test/**/*.js'
        ]
      }
    },
    less: {
      development: {
        options: {
          paths: "less/include"
        },
        files: [{
          expand: true,
          cwd: 'less/',
          src: ['**/*.less', '!include/**/*.less'],
          dest: 'public/css/',
          ext: '.css'
        }]
      }
    }
  });

grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-less');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.registerTask('build_development', 'less:development');
};
