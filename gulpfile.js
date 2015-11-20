var gulp = require('gulp');
var argv = require('yargs').argv;
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files', 'merge-stream'],
    replaceString: /\bgulp[\-.]/
});

var staticPath = 'MoneyKeeper/static/';
var templatePath = 'templates/';
var template = gulp.src(templatePath + 'assets.html');
var prodDest = 'static/';
var devDest = 'staticdev/';
var jsPathTransform = function (filepath) {
    filepath = filepath.slice(1);
    if (filepath.slice(-3) === '.js') {
        return '<script src="{% static "' + filepath + '" %}"></script>';
    }
};
var cssPathTransform = function (filepath) {
    filepath = filepath.slice(1);
    if (filepath.slice(-4) === '.css') {
        return '<link rel="stylesheet" href="{% static "' + filepath + '" %}">';
    }
};

var jsSrcThirdparty = [
    staticPath + 'thirdparty/jquery/dist/jquery.js',
    staticPath + 'thirdparty/bootstrap/dist/js/bootstrap.js',
    staticPath + 'thirdparty/d3/d3.js',
    staticPath + 'thirdparty/moment/moment.js',
    staticPath + 'thirdparty/angular/angular.js',
    staticPath + 'thirdparty/ng-notify/src/scripts/ng-notify.js',
    staticPath + 'thirdparty/angular-filter/dist/angular-filter.js',
    staticPath + 'thirdparty/angular-resource/angular-resource.js',
    staticPath + 'thirdparty/ngstorage/ngStorage.js',
    staticPath + 'thirdparty/angular-loading-bar/build/loading-bar.js',
    staticPath + 'thirdparty/angular-ui-grid/ui-grid.js',
    staticPath + 'thirdparty/angular-bootstrap/ui-bootstrap.js',
    staticPath + 'thirdparty/angular-bootstrap/ui-bootstrap-tpls.js',
    staticPath + 'thirdparty/angular-ui-router/release/angular-ui-router.js',
    staticPath + 'thirdparty/angular-sanitize/angular-sanitize.js',
    staticPath + 'thirdparty/angular-http-auth/src/http-auth-interceptor.js',
    staticPath + 'thirdparty/n3-line-chart/build/line-chart.js',
    staticPath + 'thirdparty/api-check/dist/api-check.js',
    staticPath + 'thirdparty/angular-formly/dist/formly.js',
    staticPath + 'thirdparty/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap.js',
    staticPath + 'thirdparty/ui-select/dist/select.js',
    staticPath + 'thirdparty/angular-animate/angular-animate.js'
];
var jsSrcProject = [
    staticPath + 'js/app.js',
    staticPath + 'js/common/**/*.js',
    staticPath + 'js/**/*.js'
];

var cssSrc = [
    staticPath + 'thirdparty/bootstrap/dist/css/bootstrap.css',
    staticPath + 'thirdparty/bootstrap/dist/css/bootstrap-theme.css',
    staticPath + 'thirdparty/angular-ui-grid/ui-grid.css',
    staticPath + 'thirdparty/angular-ui-grid/ui-grid.ttf',
    staticPath + 'thirdparty/angular-ui-grid/ui-grid.woff',
    staticPath + 'thirdparty/ui-select/dist/select.css',
    staticPath + 'thirdparty/ng-notify/src/styles/ng-notify.css',
    staticPath + 'thirdparty/angular-loading-bar/build/loading-bar.css',
    staticPath + 'css/app_styles.css'
];
var ignorePaths = [
    staticPath,
    prodDest,
    devDest
];

gulp.task('css', function () {
    var css = gulp.src(cssSrc)
        .pipe(plugins.if(argv.production, plugins.concat('all.min.css')))
        .pipe(plugins.if(argv.production, plugins.minifyCss()))
        .pipe(gulp.dest((argv.production ? prodDest : devDest) + 'css'));
    return template
        .pipe(plugins.inject(css, {
            ignorePath: ignorePaths,
            transform: cssPathTransform
        }))
        .pipe(gulp.dest(templatePath))
});

gulp.task('js', function () {
    var jsThirdparty = gulp.src(jsSrcThirdparty)
        .pipe(plugins.if(argv.production, plugins.concat('thirdparty.min.js')))
        .pipe(plugins.if(argv.production, plugins.uglify()))
        .pipe(plugins.if(argv.production, gulp.dest(prodDest + 'js')));

    var jsProject = gulp.src(jsSrcProject)
        //.pipe(plugins.angularFilesort())
        .pipe(plugins.if(argv.production, plugins.concat('project.min.js')))
        .pipe(plugins.if(argv.production, plugins.uglify()))
        .pipe(plugins.if(argv.production, gulp.dest(prodDest + 'js')));

    return template
        .pipe(plugins.inject(jsThirdparty, {
            ignorePath: ignorePaths,
            transform: jsPathTransform,
            name: 'thirdparty'
        }))
        .pipe(plugins.inject(jsProject, {
            ignorePath: ignorePaths,
            transform: jsPathTransform,
            name: 'project'
        }))
        .pipe(gulp.dest(templatePath))
});
gulp.task('build', ['css', 'js']);

gulp.task('watch', ['build'], function () {
    gulp.watch(jsSrcProject, ['build'])
});