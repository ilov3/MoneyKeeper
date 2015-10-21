"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper.states')
    .controller('TransactionController', ['$scope', 'dataSvc', TransactionController]);

function TransactionController($scope, dataSvc) {
    $scope.gridOptions = {};
    dataSvc.transaction.query({}, function (data) {
        $scope.gridOptions.data = data
    });
}