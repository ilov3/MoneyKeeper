/**
 * Created by ilov3 on 19.10.15.
 */

angular.module('MoneyKeeper', [
    'ui.grid', 'ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.cellNav',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'ui.select',
    'formly',
    'formlyBootstrap',
    'angular.filter',
    'MoneyKeeper.states'
])
    .config(['$resourceProvider', '$httpProvider', '$urlRouterProvider', function ($resourceProvider, $httpProvider, $urlRouterProvider) {
        $resourceProvider.defaults.stripTrailingSlashes = false;
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        $urlRouterProvider.otherwise('/summary');
    }])
    .run(['$state', '$rootScope', '$stateParams', 'formlyConfig', function ($state, $rootScope, $stateParams, formlyConfig) {
        $rootScope.$stateParams = $stateParams;

        formlyConfig.extras.removeChromeAutoComplete = true;
        formlyConfig.setType({
            name: 'ui-select-single',
            extends: 'select',
            templateUrl: '/static/partials/ui-select-single.html'
        });
    }])
    .controller('AppMainController', ['$scope', AppMainController]);
function AppMainController($scope) {
    $scope.tabs = [
        {title: 'Summary', state: 'summary'},
        {title: 'Transactions', state: 'transaction'},
        {title: 'Categories', state: 'category'},
        {title: 'Accounts', state: 'account'}
    ]
}
