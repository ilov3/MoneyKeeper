/**
 * Created by ilov3 on 19.10.15.
 */
//$.material.init();
angular.module('MoneyKeeper', [
    'ui.grid',
    'ui.grid.pagination',
    'ui.grid.edit',
    'ui.grid.cellNav',
    'ui.grid.rowEdit',
    'ngResource',
    'ngSanitize',
    'ngAnimate',
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    'ui.select',
    'angular.filter',
    'angular-loading-bar',
    'http-auth-interceptor',
    'formly',
    'formlyBootstrap',
    'n3-line-chart',
    'nvd3ChartDirectives',
    'ngNotify',
    'pascalprecht.translate',
    'MoneyKeeper.states',
    'MoneyKeeper.constants',
    'MoneyKeeper.utils'
])
    .config(['$resourceProvider', '$httpProvider', '$urlRouterProvider', 'cfpLoadingBarProvider', '$translateProvider', 'langConstants',
        function ($resourceProvider, $httpProvider, $urlRouterProvider, cfpLoadingBarProvider, $translateProvider, langConstants) {
            cfpLoadingBarProvider.includeSpinner = false;
            $resourceProvider.defaults.stripTrailingSlashes = false;
            $httpProvider.defaults.xsrfCookieName = 'csrftoken';
            $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
            $urlRouterProvider.otherwise('/summary');
            $httpProvider.interceptors.push('authSvcInterceptor');
            $translateProvider.translations('en', langConstants.enLang);
            $translateProvider.translations('ru', langConstants.ruLang);
            $translateProvider.preferredLanguage('en');
        }])
    .run(['$state', '$rootScope', '$stateParams', '$http', '$templateCache', 'FormlyConfig', 'authSvc', 'dataSvc',
        function ($state, $rootScope, $stateParams, $http, $templateCache, FormlyConfig, authSvc, dataSvc) {
            $rootScope.$stateParams = $stateParams;
            $rootScope.conf = {};
            authSvc.setUsername();
            dataSvc.getHistory();
            FormlyConfig.init();
            //caching
            $http.get('/static/js/common/directives/uiGridDatepickerFilter/daypicker.html', {cache: $templateCache});
            $http.get('/static/js/common/directives/uiGridDatepickerFilter/gridDatePickerFilter.html', {cache: $templateCache});
            $http.get('/static/js/common/directives/uiGridDatepickerFilter/datepickerPopup.html', {cache: $templateCache});
            $http.get('/static/js/common/directives/uiGridDatepickerFilter/datepicker.html', {cache: $templateCache});
            $http.get('/static/partials/recent-actions-popover.html', {cache: $templateCache});
            $http.get('/static/partials/datepicker.html', {cache: $templateCache});
            $http.get('/static/js/components/auth/register.html', {cache: $templateCache});
            $http.get('/static/js/components/summary/modals/detailChart/template.html', {cache: $templateCache});
        }])
    .controller('AppMainController', ['$scope', '$state', 'authSvc', 'ngNotify', 'dataSvc', '$translate', '$localStorage', 'appControllerConstants', AppMainController]);

function AppMainController($scope, $state, authSvc, ngNotify, dataSvc, $translate, $localStorage, appControllerConstants) {

    $scope.lang = $localStorage.lang || $translate.proposedLanguage();
    if ($localStorage.lang && $localStorage.lang !== $translate.proposedLanguage()) {
        $translate.use($localStorage.lang);
    }

    $scope.tabs = appControllerConstants.tabs;
    $scope.iconMap = appControllerConstants.iconMap;
    $scope.state = $state;
    $scope.dataSvc = dataSvc;
    $scope.logout = function () {
        authSvc.logout();
    };
    $scope.$watch('lang', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            $translate.use(newValue);
            $localStorage.lang = newValue;
        }
    });
    $scope.$on('event:auth-loginRequired', function () {
        $state.go('login');
        ngNotify.set('Please, login or register new user', 'warn');
    });
    $scope.$on('event:auth-forbidden', function () {
        $state.go('login');
        ngNotify.set('Please, login or register new user', 'warn');
    });
    $scope.$on('event:auth-loginConfirmed', function () {
        $state.go('summary');
    })
}
