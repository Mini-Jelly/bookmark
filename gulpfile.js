const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const inlinesource = require('gulp-inline-source');

//复制src中的data.json到dist目录
gulp.task('copydata', () => {
  return gulp.src('src/data.json')
    .pipe(gulp.dest('dist'));
});

gulp.task('inlinesource', () => {
  var options = {
    compress: true
  };
  return gulp.src('./src/index.html')
    //注入代码
    .pipe(inlinesource(options))
    //压缩html
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});

gulp.task('copyscript', () => {
  return gulp.src(['src/generate_data.js', 'src/generate_data.py'])
    .pipe(gulp.dest('script'));
});


gulp.task('default', gulp.series('copydata', 'inlinesource','copyscript'));