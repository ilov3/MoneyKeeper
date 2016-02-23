var gulp = require('gulp');
var argv = require('yargs').argv;
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files', 'merge-stream'],
    replaceString: /\bgulp[\-.]/
});

var staticPath = 'MoneyKeeper/static/';
var staticPathProd = 'staticdev/';
var templatePath = 'templates/';
var appAssetsTemplate = gulp.src(templatePath + 'app_assets.html');

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

var jsSrcThirdparty = plugins.mainBowerFiles('**/*.js');
var cssSrcThirdparty = plugins.mainBowerFiles('**/*.css');
var lessSrcThirdparty = plugins.mainBowerFiles('**/*.less');
var fonts = plugins.mainBowerFiles(['**/*.woff', '**/*.woff2', '**/*.ttf']).concat([
    staticPath + 'thirdparty/bootstrap/fonts/glyphicons-halflings-regular.woff2'
]);
var jsSrcProject = [
    staticPath + 'js/app.js',
    staticPath + 'js/common/**/*.js',
    staticPath + 'js/**/*.js',
    '!' + staticPath + 'js/project.min.js',
    '!' + staticPath + 'js/thirdparty.min.js'
];

var cssSrc = cssSrcThirdparty.concat([
    staticPath + 'css/app_styles.css',
    staticPath + 'thirdparty/bootstrap/dist/css/bootstrap-theme.css',
    staticPath + 'thirdparty/angular-ui-grid/ui-grid.ttf',
    staticPath + 'thirdparty/angular-ui-grid/ui-grid.woff'
]);

var ignorePaths = [
    staticPath,
    staticPathProd
];

gulp.task('css', function () {
    var cssFilter = plugins.filter('**/*.css', {restore: true});
    var less = gulp.src(lessSrcThirdparty)
        .pipe(plugins.less());
    var css = gulp.src(cssSrc);
    var merge = plugins.mergeStream(less, css)
        .pipe(cssFilter)
        .pipe(plugins.if(argv.production, plugins.concat('all.min.css')))
        .pipe(plugins.if(argv.production, plugins.minifyCss()))
        .pipe(cssFilter.restore)
        .pipe(gulp.dest(staticPathProd + 'css'));
    return appAssetsTemplate
        .pipe(plugins.inject(merge, {
            ignorePath: ignorePaths,
            transform: cssPathTransform
        }))
        .pipe(gulp.dest(templatePath))
});

gulp.task('js', function () {
    var jsThirdparty = gulp.src(jsSrcThirdparty)
        .pipe(plugins.if(argv.production, plugins.concat('thirdparty.min.js')))
        .pipe(plugins.if(argv.production, plugins.uglify()))
        .pipe(plugins.if(argv.production, gulp.dest(staticPathProd + 'js')));

    var jsProject = gulp.src(jsSrcProject)
        .pipe(plugins.if(argv.production, plugins.concat('project.min.js')))
        .pipe(plugins.if(argv.production, plugins.uglify()))
        .pipe(plugins.if(argv.production, gulp.dest(staticPathProd + 'js')));

    return appAssetsTemplate
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

gulp.task('font', function () {
    return gulp.src(fonts)
        .pipe(gulp.dest(staticPathProd + 'fonts'))
});

gulp.task('build', ['css', 'js', 'font']);

gulp.task('default', ['build'], function () {
    gulp.watch(jsSrcProject, ['js']);
    gulp.watch(cssSrc, ['css']);
});