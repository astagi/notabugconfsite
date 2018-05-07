var gulp = require('gulp');
var csso = require('gulp-csso');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var template = require('gulp-template');
var image = require('gulp-image');
var eslint = require('gulp-eslint');
var csslint = require('gulp-csslint');

// Site data
var data = require('./data/data.json');
var package = require('./package.json');

data.version = package.version;

gulp.task('css', function(){
  gulp.src([
      'src/public/css/bootstrap.css',
      'src/public/css/easter-eggs.css',
      'src/public/css/style.css',
  ])
    .pipe(csso({ comments: false }))
    .pipe(concat('styles.min.css'))
    .pipe(gulp.dest('dist/public/css'))


    gulp.src([
        'src/public/css/bootstrap.css',
        'src/public/css/contentpage-style.css',
    ])
        .pipe(csso({ comments: false }))
        .pipe(concat('contentpagestyles.min.css'))
        .pipe(gulp.dest('dist/public/css'))

});

gulp.task('js', function(){
    return gulp.src([
        'src/public/js/jquery-3.2.1.js',
        'src/public/js/bootstrap.js',
        'src/public/js/main.js'
    ])
      .pipe(uglify())
      .pipe(concat('main.min.js'))
      .pipe(gulp.dest('dist/public/js'))
  });

gulp.task('html', function () {
  gulp.src('src/index.html')
    .pipe(template(data))
    .pipe(gulp.dest('dist'));
    gulp.src([
        'src/robots.txt',
        'src/.htaccess',
        'src/sitemap.xml'
    ])
    .pipe(gulp.dest('dist'));
    gulp.src([
        'src/404.html',
        'src/code-of-conduct.html',
        'src/privacy-policy.html',
    ])
    .pipe(template(data))
    .pipe(rename(function (path) {
        path.extname = ''
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
    gulp.src('src/public/images/**/*')
      .pipe(image())
      .pipe(gulp.dest('./dist/public/images'));
  });

htmlLint = require('gulp-html-lint');

gulp.task('html-lint', function() {
  return gulp.src('src/**/*.html')
      .pipe(htmlLint())
      .pipe(htmlLint.format())
      .pipe(htmlLint.failOnError());
});
 
gulp.task('js-lint', () => {
    return gulp.src(['src/**/*.js','!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
 
gulp.task('css-lint', function() {
  gulp.src(['src/**/*.css', '!src/public/css/bootstrap.css'])
    .pipe(csslint())
    .pipe(csslint.formatter());
});
 

gulp.task('default', [ 'html', 'css', 'js', 'images' ]);
gulp.task('test', [ 'js-lint', 'css-lint' ]);