/**
 * Created by ilov3 on 19.10.15.
 */

angular.module('MoneyKeeper', [
    'ui.grid', 'ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.cellNav',
    'ngResource', 'ui.router', 'ui.bootstrap',
    'MoneyKeeper.states'
])
    .config(['$resourceProvider', function ($resourceProvider) {
        $resourceProvider.defaults.stripTrailingSlashes = false;
    }])
    .run(['$state', function ($state) {
        $state.go('home')
    }])
    .controller('AppMainController', ['$scope', AppMainController]);
function AppMainController($scope) {
    $scope.tabs = [
        {title: 'Home', state: 'home'},
        {title: 'Transactions', state: 'transaction'},
        {title: 'Categories', state: 'category'},
        {title: 'Accounts', state: 'account'}
    ]
}
