const browserify = require('browserify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const babel = require("babelify");
const sass = require("gulp-sass");
const rename = require("gulp-rename");
const cssprefix = require("gulp-autoprefixer");
const log = require('gulplog');
const browsersync = require("browser-sync").create();
const htmlvalidate = require('gulp-w3cjs');
const cssvalidate = require('gulp-w3c-css');
const imgmin = require("gulp-imagemin");

gulp.task('jsFix', function() {
    // set up the browserify instance on a task basis
    let b = browserify({
        entries: './src/js/main.js',
        debug: true
    }).transform(babel);

    return b.bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .on('error', log.error)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build/js/'));
});

gulp.task('sassFix', function() {
    return gulp.src('./src/css/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(rename('style.css'))
        .pipe(cssprefix())
        .pipe(gulp.dest('./build/css'))
});

gulp.task('htmlFix', function() {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest('build'))
});

gulp.task('imgFix', function() {
    return gulp.src('src/img/*')
        .pipe(gulp.dest('build'))
        .pipe(imgmin([
            imgmin.gifsicle({ interlaced: true }),
            imgmin.mozjpeg({ quality: 75, progressive: true }),
            imgmin.optipng({ optimizationLevel: 5 })
        ]))
        .pipe(gulp.dest('build/img'))
})

function watchingYou() {
    browsersync.init({
        server: {
            baseDir: './build/'
        }
    });

    gulp.watch(['src/**/*.html', './src/js/main.js', './src/css/*.scss'],
        gulp.parallel('jsFix', 'htmlFix', 'sassFix', 'imgFix'));

    gulp.watch(['build/js', 'build/css', 'build']).on('change', browsersync.reload);
}

exports.default = gulp.series(
    gulp.parallel('jsFix', 'htmlFix', 'sassFix', 'imgFix'),
    watchingYou
)




function validateCSS() {
    return gulp.src('./build/css/*.css')
        .pipe(cssvalidate())
        .pipe(gulp.dest('./src/css/validate'));
}

function validateHTML() {
    return gulp.src('./build/*.html')
        .pipe(htmlvalidate())
        .pipe(htmlvalidate.reporter())
}

exports.validate = gulp.series(
    gulp.parallel(validateHTML, validateCSS)
);