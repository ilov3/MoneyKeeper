"use strict";
/**
 * __author__ = 'ilov3'
 */

function DeleteAccountController($scope, $uibModalInstance, $state, ngNotify, resource) {
    DeleteModalBaseController.call(this, $scope, $uibModalInstance, $state, ngNotify, resource);
    this.resource = resource;
}

angular.module('MoneyKeeper.states').controller('DeleteAccountController', ['$scope', '$uibModalInstance', '$state', 'ngNotify', 'resource', DeleteAccountController]);
