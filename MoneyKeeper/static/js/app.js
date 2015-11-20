/**
 * Created by ilov3 on 19.10.15.
 */

angular.module('MoneyKeeper', [
    'ui.grid',
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
    }])
    .controller('AppMainController', ['$scope', '$uibModal', '$state', 'authSvc', AppMainController]);

function AppMainController($scope, $uibModal, $state, authSvc) {
    var self = this;
    this.loginDialogIsOpened = 0;
    var loginRequired = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/static/js/common/modals/login/login.html',
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
        {title: 'Transactions', state: 'transaction'},
        {title: 'Categories', state: 'category'},
        {title: 'Accounts', state: 'account'}
    ];
    $scope.logout = function () {
        authSvc.logout();
    };
    $scope.$on('event:auth-loginRequired', function () {
        if (!self.loginDialogIsOpened) loginRequired();
        self.loginDialogIsOpened = 1;
        $state.go('empty');
    });
    $scope.$on('event:auth-forbidden', function () {
        loginRequired();
        $state.go('empty');
    });
    $scope.$on('event:auth-loginConfirmed', function () {
        $state.go('summary');
    })
}
