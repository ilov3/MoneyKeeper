/**
 * Created by ilov3 on 19.10.15.
 */

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
        'MoneyKeeper.states'
    ])
    .config(['$resourceProvider', '$httpProvider', '$urlRouterProvider', 'cfpLoadingBarProvider', function ($resourceProvider, $httpProvider, $urlRouterProvider, cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
        $resourceProvider.defaults.stripTrailingSlashes = false;
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        $urlRouterProvider.otherwise('/summary');
        $httpProvider.interceptors.push('authSvcInterceptor')
    }])
    .run(['$state', '$rootScope', '$stateParams', 'formlyConfig', 'authSvc', function ($state, $rootScope, $stateParams, formlyConfig, authSvc) {
        $rootScope.$stateParams = $stateParams;
        $rootScope.conf = {};
        authSvc.setUsername();

        formlyConfig.extras.removeChromeAutoComplete = true;
        formlyConfig.setType({
            name: 'ui-select-single',
            extends: 'select',
            templateUrl: '/static/partials/ui-select-single.html'
        });
        formlyConfig.setType({
            name: 'checkbox',
            templateUrl: '/static/partials/formly-checkbox.html',
            "wrapper": ['bootstrapHasError'],
            overwriteOk: true
        });
        formlyConfig.setType({
            name: 'calcInput',
            wrapper: ['bootstrapLabel', 'bootstrapHasError'],
            templateUrl: '/static/partials/formly-calc-input.html',
            controller: ['$scope', function ($scope) {
                $scope.calc = function (expr) {
                    try {
                        var pure = expr.replace(/[^-()\d/*+.]/g, '');
                        $scope.model[$scope.to.binding] = $scope.$eval(pure);
                    } catch (err) {
                    }
                };
            }]
        })
    }])
    .controller('AppMainController', ['$scope', '$uibModal', '$state', 'authSvc', 'ngNotify', AppMainController]);

function AppMainController($scope, $uibModal, $state, authSvc, ngNotify) {
    var self = this;
    this.loginDialogIsOpened = 0;
    var loginRequired = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            keyboard: false,
            templateUrl: '/static/js/components/auth/login.html',
            controller: 'LoginController',
            controllerAs: 'loginCtrl'
        });
        modalInstance.result.then(function () {
            self.loginDialogIsOpened = 0;
        }, function () {
            self.loginDialogIsOpened = 0;
        })
    };
    $scope.tabs = [
        {title: 'Summary', state: 'summary'},
        {title: 'Transactions', state: 'transactions'},
        {title: 'Categories', state: 'categories'},
        {title: 'Accounts', state: 'accounts'}
    ];
    $scope.state = $state;
    $scope.logout = function () {
        authSvc.logout();
    };
    $scope.login = loginRequired;
    $scope.$on('event:auth-loginRequired', function () {
        if (!self.loginDialogIsOpened) loginRequired();
        self.loginDialogIsOpened = 1;
        $state.go('empty');
        ngNotify.set('Please, login or register new user', 'warn');
    });
    $scope.$on('event:auth-forbidden', function () {
        loginRequired();
        $state.go('empty');
        ngNotify.set('Please, login or register new user', 'warn');
    });
    $scope.$on('event:auth-loginConfirmed', function () {
        $state.go('summary');
    })
}
