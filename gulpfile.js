/* ========================
GULP REQUIRE FILES
=========================== */
var gulp = require('gulp');
var webserver = require('gulp-webserver');
var inject = require('gulp-inject');
var htmlclean = require('gulp-htmlclean');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var del = require('del');



/* ========================
GULP PATHS
=========================== */
var paths = {

  // source files
  src: 'src/**/*',
  srcHTML: 'src/**/*.html',
  srcSCSS: 'src/**/*.scss',
  srcJS: 'src/**/*.js',

  // Development files
  tmp: 'tmp',
  tmpIndex: 'tmp/index.html',
  tmpCSS: 'tmp/**/*.css',
  tmpJS: 'tmp/**/*.js',

  // Production files
  dist: 'dist',
  distIndex: 'dist/index.html',
  distCSS: 'dist/**/*.css',
  distJS: 'dist/**/*.js'
};


/* ========================
GULP TASKS
=========================== */


// Tasks to create a development folder structure
// -------------------------------------------------

// Copys working html file to Dev enviroment
gulp.task('html', function () {
  return gulp.src(paths.srcHTML).pipe(gulp.dest(paths.tmp));
});

// Copys working css file to Dev enviroment
gulp.task('css', function () {
  return gulp.src(paths.srcSCSS).pipe(sass()).pipe(gulp.dest(paths.tmp));
});

// Copys working Javascript file to Dev enviroment
gulp.task('js', function () {
  return gulp.src(paths.srcJS).pipe(gulp.dest(paths.tmp));
});

// Runs above three tasks together
gulp.task('copy', ['html', 'css', 'js']);

// Adds relative links to all css and js files into the html file
gulp.task('inject', ['copy'], function () {
  var css = gulp.src(paths.tmpCSS);
  var js = gulp.src(paths.tmpJS);
  return gulp.src(paths.tmpIndex)
    .pipe(inject( css, { relative:true } ))
    .pipe(inject( js, { relative:true } ))
    .pipe(gulp.dest(paths.tmp));
});

// ------------------------------------------------

// Task creates a local server and then creates a dev enviroment
gulp.task('serve', ['inject'], function () {
  return gulp.src(paths.tmp)
    .pipe(webserver({
      port: 3000,
      livereload: true
    }));
});

// Task to watch for changes before serving them to the local server
gulp.task('watch', ['serve'], function () {
  gulp.watch(paths.src, ['inject']);
});


// Task to make watch the default task which allows you to just type gulp to run all tasks 
gulp.task('default', ['watch']);


// Tasks to create a production folder structure
// -------------------------------------------------

// Copys development html file to production enviroment
gulp.task('html:dist', function () {
  return gulp.src(paths.srcHTML)
    .pipe(htmlclean())
    .pipe(gulp.dest(paths.dist));
});

// Copys development css file to production enviroment
gulp.task('css:dist', function () {
  return gulp.src(paths.srcSCSS)
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.dist));
});

// Copys development javascript file to production enviroment
gulp.task('js:dist', function () {
  return gulp.src(paths.srcJS)
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist));
});

// Runs above three tasks together
gulp.task('copy:dist', ['html:dist', 'css:dist', 'js:dist']);

// Adds relative links to all css and js files into the html file
gulp.task('inject:dist', ['copy:dist'], function () {
  var css = gulp.src(paths.distCSS);
  var js = gulp.src(paths.distJS);
  return gulp.src(paths.distIndex)
    .pipe(inject( css, { relative:true } ))
    .pipe(inject( js, { relative:true } ))
    .pipe(gulp.dest(paths.dist));
});

// ------------------------------------------------

// task to create the build files 
gulp.task('build', ['inject:dist']);

// Task to clean the project file by remmoving the tmpa dn dist folders
gulp.task('clean', function () {
  del([paths.tmp, paths.dist]);
});

