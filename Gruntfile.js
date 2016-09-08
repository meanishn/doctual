//Gruntfile.js

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            build: ['Gruntfile.js', 'assets/js/core/*.js']
        },
        
        uglify: {
            options: {
                banner: '/*\n <%= pkg.name %> <%=grunt.template.today("yyyy-mm-dd") %> \n*/\n'
            },
            build: {
                files: {
                    'dist/js/bundle.min.js': 'assets/js/core/**/*.js'
                }
            }
        },
        
        concat: {
            options: {
              separator: ""
            },
            dist: {
                src: ['assets/js/core/header.js', 'assets/js/core/api/**/*.js', 'assets/js/core/footer.js'],
                dest: 'dist/js/bundle.js'
            }
        },
        
        deploy: {
            options: {
                host:"",
                port: "",
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    
    
    
};