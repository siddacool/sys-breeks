var gulp = require('gulp'),
    
    //css related
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    prefix = require('gulp-autoprefixer'),
    combineMq = require('gulp-combine-mq'),
    
    //Html related
    nunjucksRender = require('gulp-nunjucks-render'),
    
    //js related
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    
    //sever related
    browserSync = require('browser-sync'),
    
    //Shared and misc
    svgstore = require('gulp-svgstore'),
    svgmin = require('gulp-svgmin'),
    rename = require('gulp-rename'),
    data = require('gulp-data'),
    
    //error controll
    plumber = require('gulp-plumber');

var projectName = 'projectName',
    dist = 'dist';

/* live reload */
gulp.task('browser-sync', function () {
   var files = [
      projectName + '/*.html',
      projectName + '/css/*.css',
      projectName + '/img/*.png',
      projectName + '/js/*.js'
   ];

   browserSync.init(files, {
      server: {
         baseDir: './' + dist
      }
   });
});

/* style related components */
/* scss css */
// Browser list
var browserList = [
    "chrome 40",
    "edge 13",
    "firefox 40",
    "ios_saf 7",
    "safari 8"
];

// scssToCss
gulp.task('scssToCss',function(){
	gulp.src(projectName + '/scss/**/*.scss')
	    .pipe(sourcemaps.init())
        .pipe(plumber())
		.pipe(sass({outputStyle: 'compressed'}))
        .pipe(combineMq({
		  beautify: false
	     }))
		.pipe(prefix(browserList))
		.pipe(sourcemaps.write('../sourceMaps_css'))
		.pipe(gulp.dest(dist + '/css/'));
});

// nunjucks to html
gulp.task('nunjucks', function () {
    nunjucksRender.nunjucks.configure([projectName + '/nunjucks_templates/'], {
        watch: false
    });

    // Gets .html and .nunjucks files in pages
    return gulp.src(projectName + '/nunjucks_pages/*.nunjucks')
        // Renders template with nunjucks
        .pipe(nunjucksRender())
        // output files in app folder
        .pipe(gulp.dest(dist + '/'))

});

// copy paste content of public folder to dist
gulp.task('public', function () {
    gulp.src(projectName + '/public/*/*.**')
        .pipe(plumber())
        .pipe(gulp.dest(dist + '/'));
});
gulp.task('publicBase', function () {
    gulp.src(projectName + '/public/*.**')
        .pipe(plumber())
        .pipe(gulp.dest(dist + '/'));
});

/* Watch for changes */
/* Generic */
gulp.task('watch', function () {
    gulp.watch(projectName + '/scss/**/*.scss', ['scssToCss']);
    gulp.watch(projectName + '/nunjucks_pages/*.nunjucks', ['nunjucks']);
    gulp.watch(projectName + '/nunjucks_templates/**/*.nunjucks', ['nunjucks']);
});

/* Default Gulp task */
/* type Gulp in console */
gulp.task('default', ['scssToCss','browser-sync','nunjucks','public','publicBase','watch']);

