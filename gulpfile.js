var gulp = require('gulp');
var less = require('gulp-less');

gulp.task('less', function(){
  return gulp.src('./public/css/css.less')
    .pipe(less())
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('default', ['less']);

gulp.watch('./public/css/css.less', ['less']);

