var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var electron = require('gulp-electron');


//gulp.task('dist', function () {
//  return gulp.src('lib/blast.js')
//    .pipe(gulp.dest('dist'))
//    .pipe(uglify())
//    .pipe(rename({suffix: '.min'}))
//    .pipe(gulp.dest('dist'))
//});


gulp.task('desktop', function () {
  var packageJson = require('./package.json');
  gulp.src("")
    .pipe(electron({
      src: './Desktop',
      packageJson: packageJson,
      release: './dist',
      cache: './cache',
      version: 'v0.26.1',
      packaging: true,
      platforms: ['win32-ia32', 'darwin-x64'],
      platformResources: {
        darwin: {
          CFBundleDisplayName: packageJson.name,
          CFBundleIdentifier: packageJson.name,
          CFBundleName: packageJson.name,
          CFBundleVersion: packageJson.version,
          icon: 'Desktop/icon.icns'
        },
        win: {
          "version-string": packageJson.version,
          "file-version": packageJson.version,
          "product-version": packageJson.version,
          "icon": 'Desktop/icon.ico'
        }
      }
    }))
    .pipe(gulp.dest(""));
});