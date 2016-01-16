"use strict";
/**
 * __author__ = 'ilov3'
 */

function DeleteTransactionController($scope, $uibModalInstance, row, confirm) {
    $scope.row = row;
    $scope.confirm = confirm;
    $scope.cancel = function () {
        $uibModalInstance.close()
    }
}

angular.module('MoneyKeeper.states').controller('DeleteTransactionController', ['$scope', '$uibModalInstance', 'row', 'confirm', DeleteTransactionController]);
