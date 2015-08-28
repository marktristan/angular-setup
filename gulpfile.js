'use strict';

var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var run = require('gulp-run');
var del = require('del');

gulp.task('setup', function () {
    fs.mkdir('./public', function (err) {
        if (!err) {
            gutil.log('Creating application directories...');

            fs.mkdir('public/src', function (err) {
                fs.mkdir('public/src/config', function (err) {
                    fs.writeFile('public/src/config/routes.js', '// Write your angular routes config here');
                });

                fs.mkdir('public/src/controllers');
                fs.mkdir('public/src/directives');
                fs.mkdir('public/src/factories');
                fs.mkdir('public/src/filters');
                fs.mkdir('public/src/services');

                fs.writeFile('public/src/app.js', '// Write your main angular module here');
            });

            fs.mkdir('public/assets', function (err) {
                fs.mkdir('public/assets/css');
                fs.mkdir('public/assets/img');
                fs.mkdir('public/assets/js');
            });

            fs.mkdir('public/views');
        }
    });
});
 
gulp.task('bower', function () {
    fs.stat('.bowerrc', function (err, stat) {
        if(err) {
            fs.writeFile('.bowerrc', "{\n\t\"directory\": \"./public/vendor/\"\n}", function (err) {
                if (err) throw err;
                gutil.log('Created', '\'' + gutil.colors.magenta('.bowerrc') + '\'');
            });
        }

        fs.stat('bower.json', function (err, stat) {
            if(err == null) {
                gutil.log('Installing dependencies...');
            } else {
                var bowerJsonText = "{\n\t\"name\": \"angular-setup\"\n}";

                fs.writeFile('bower.json', bowerJsonText, function (err) {
                    if (err) throw err;
                    gutil.log('Created', '\'' + gutil.colors.magenta('bower.json') + '\'');
                    gutil.log('Installing dependencies...');
                });
            }
            
            run('bower install angular').exec()
                .pipe(run('bower install modernizr'))
                .pipe(run('bower install bootstrap'))
                .pipe(run('bower install normalize.css'));
        });
    });
});

gulp.task('clean-index', function () {
    fs.stat('index.html', function (err, stat) {
        if (!err) {
            del('index.html');
        }
    });
});

gulp.task('move-index', ['clean-index'], function () {
    fs.stat('index.html', function (err, stat) {
        if (!err) {
            gutil.log('Moving', '\'' + gutil.colors.magenta('index.html') + '\'', 'to public directory...');

            gulp.src('index.html')
                .pipe(gulp.dest('public'));
        }
    });
});

gulp.task('init', ['setup', 'bower', 'move-index']);