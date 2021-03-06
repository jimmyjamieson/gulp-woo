'use strict';
// generated on 2014-09-26 using generator-gulp-webapp 0.1.0

var gulp = require('gulp');

// Browser Sync
var browserSync = require('browser-sync');
//var reload      = browserSync.reload;
var uncss = require('gulp-uncss');
var cssmin = require('gulp-cssmin');

// load plugins
var $ = require('gulp-load-plugins')();

// browser-sync task for starting the server.
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './app'
        }
    });
});

// or
/*
gulp.task('browser-sync', function() {
    browserSync({
        proxy: "yourlocal.dev"
    });
});
*/

gulp.task('styles', function () {
    return gulp.src('app/sass/main.scss')
        .pipe($.rubySass({
            style: 'compressed',
            precision: 10
        }))
        .pipe($.autoprefixer('last 5 version'))
        .pipe(uncss({
            html: ['app/index.html']
        }))
        .pipe(cssmin())
        .pipe(gulp.dest('app/css'))
        .pipe($.size())
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('scripts', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size());
});

gulp.task('html', ['styles', 'scripts'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');

    return gulp.src('app/*.html')
        .pipe($.useref.assets({searchPath: '{.tmp,app}'}))
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        //.pipe(gulp.dest('dist/images'))
        .pipe(gulp.dest('app/images'))
        .pipe($.size());
});

gulp.task('fonts', function () {
    return $.bowerFiles()
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        //.pipe(gulp.dest('dist/fonts'))
        .pipe(gulp.dest('app/fonts'))
        .pipe($.size());
});

gulp.task('extras', function () {
    return gulp.src(['app/*.*', '!app/*.html'], { dot: true })
        //.pipe(gulp.dest('dist'));
        .pipe(gulp.dest('app'));
});

gulp.task('clean', function () {
    return gulp.src(['.tmp', 'dist'], { read: false }).pipe($.clean());
});

gulp.task('browser-reload', function () {
    browserSync.reload();
});

gulp.task('build', ['html', 'images', 'fonts', 'extras']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
/*

gulp.task('connect', function () {
    var connect = require('connect');
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(connect.static('app'))
        .use(connect.static('.tmp'))
        .use(connect.directory('app'));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:9000');
        });
});


gulp.task('serve', ['browser-sync', 'styles'], function () {
    require('opn')('http://localhost:9000');
});


gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;

    gulp.src('app/styles/*.scss')
        .pipe(wiredep({
            directory: 'app/bower_components'
        }))
        .pipe(gulp.dest('app/styles'));

    gulp.src('app/*.html')
        .pipe(wiredep({
            directory: 'app/bower_components'
        }))
        .pipe(gulp.dest('app'));
});
*/
gulp.task('watch', ['styles', 'browser-sync'], function () {

    gulp.watch('app/sass/**/*.scss', ['styles']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/images/**/*', ['images']);
    gulp.watch('bower.json', ['wiredep']);
    gulp.watch('app/*.html', ['browser-reload']);

});
