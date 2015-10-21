"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper.states')
    .controller('AccountController', ['$scope', 'dataSvc', AccountController]);

function AccountController($scope, dataSvc) {
    $scope.gridOptions = {};
    dataSvc.account.query({}, function (data) {
        $scope.gridOptions.data = data
    });
}