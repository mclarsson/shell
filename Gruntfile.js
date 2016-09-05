module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            dist: {
                files: {
                    'css/style.css': 'css/style.scss'
                }
            }
        },

        uglify: {
            options: {
                manage: false
            },
            my_target: {
                files: {
                    'js/app.min.js': ['js/polyfill.js', 'js/shll.js', 'js/main.js']
                }
            }
        },

        cssmin: {
            my_target: {
                files: [{
                    expand: true,
                    cwd: 'css/',
                    src: ['*.css', '!*.min.css'],
                    dest: 'css/',
                    ext: '.min.css'
                }]
            }
        },

        watch: {
        	sass: {
        		files: ['css/*.scss'], 
        		tasks: ['sass', 'cssmin']
        	},
        	uglify: {
        		files: ['js/*.js', '!js/app.min.js'], 
        		tasks: ['uglify']
        	}
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['watch']);
};