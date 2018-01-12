var gulp = require('gulp');
var exec = require('child_process').exec;
var clean = require('gulp-clean');
var gulpSequence = require('gulp-sequence');
var tslint = require("gulp-tslint");

gulp.task('default', gulpSequence('tslint', 'clean', 'compile', 'copy', 'copy-migrations', 'copy-assets'));

gulp.task('start-app', gulpSequence('default', 'start'));

gulp.task('tslint', function () {
    return gulp.src(['./**/*.ts', '!./node_modules/**', '!./typings/**'])
        .pipe(tslint({
            configuration: "./tslint.json"
        }))
        .pipe(tslint.report({
            summarizeFailureOutput: true
        }));
});

gulp.task('copy', function (done) {
    return gulp.src(['./**/*.json', './Procfile', './**/*.wsdl', '!./dist/**/*.wsdl', './**/*.docx', '!./dist/**/*.docx'])
        .pipe(gulp.dest('./dist'));
});

gulp.task('copy-migrations', function (done) {
    return gulp.src(['./migrations/*.js'])
        .pipe(gulp.dest('./dist/migrations'));
});

gulp.task('copy-assets', function (done) {
    return gulp.src(['./assets/**'])
        .pipe(gulp.dest('./dist/assets'));
});

gulp.task('clean', function () {
    return gulp.src(['./dist/*'])
        .pipe(clean());
});

gulp.task('start', function (done) {
    exec('nodemon --delay 1000ms dist/index', function (err, stdOut, stdErr) {
        console.log(stdOut);
        if (err) {
            done(err);
        } else {
            done();
        }
    });
    console.log('Server started!');
    gulp.watch([
        './**/*.ts',
        '!./node_modules/**/*.ts',
        '!./typings/**/*.ts'
    ], ['compile', 'copy']);
    console.log('Watcher activated!');    
});

gulp.task('compile', function (done) {
    exec('tsc', function (err, stdOut, stdErr) {
        console.log(stdOut);
        if (err) {
            done(err);
        } else {
            done();
        }
    });
});

/** PREPARE HEROKU DEPLOY PACKAGE TASKS **/
gulp.task('deploy', gulpSequence('deploy-clean', 'deploy-copy'));

gulp.task('deploy-clean', function () {
    return gulp.src(['./deploy/*',])
        .pipe(clean());
});

gulp.task('deploy-copy', function () {
    return gulp.src([
        '!./dist/dist/',
        '!./dist/dist/**',
        '!./dist/node_modules/',
        '!./dist/node_modules/**',
        '!./dist/deploy/',
        '!./dist/deploy/**',
        './dist/**'])
        .pipe(gulp.dest('./deploy'));
});