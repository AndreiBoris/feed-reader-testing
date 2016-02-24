// Load plugins
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    notify = require('gulp-notify');

// Lint
gulp.task('lint', function() {
  return gulp.src('js/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(notify({ message: 'Scripts task complete' }));
});


// Default
gulp.task('default', function() {
  gulp.start('lint', 'watch');
})

// Watch
gulp.task('watch', function() {

  // Watch .js files
  gulp.watch('js/**/*.js', ['lint']);

});
