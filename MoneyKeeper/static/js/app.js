/**
 * Created by ilov3 on 19.10.15.
 */

angular.module('MoneyKeeper', [
    'ui.grid', 'ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.cellNav',
    'ngResource', 'ui.router', 'ui.bootstrap',
    'MoneyKeeper.states'
])
    .config(['$resourceProvider', '$urlRouterProvider', function ($resourceProvider, $urlRouterProvider) {
        $resourceProvider.defaults.stripTrailingSlashes = false;
        $urlRouterProvider.otherwise('/summary');
    }])
    .run(['$state', '$rootScope', '$stateParams', function ($state, $rootScope, $stateParams) {
        $rootScope.$stateParams = $stateParams;
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
