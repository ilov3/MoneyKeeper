"use strict";
/**
 * __author__ = 'ilov3'
 */

function DeleteCategoryController($scope, $uibModalInstance, $state, ngNotify, resource) {
    DeleteModalBaseController.call(this, $scope, $uibModalInstance, $state, ngNotify, resource);
    this.resource = resource;
}

angular.module('MoneyKeeper.states').controller('DeleteCategoryController', ['$scope', '$uibModalInstance', '$state', 'ngNotify', 'resource', DeleteCategoryController]);
