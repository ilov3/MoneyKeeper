"use strict";
/**
 * __author__ = 'ilov3'
 */

function DeleteCategoryController(DeleteModalSvc, $uibModalInstance, resource) {
    DeleteModalSvc.modalInstance = $uibModalInstance;
    DeleteModalSvc.resource = resource;
    this.service = DeleteModalSvc;
}

angular.module('MoneyKeeper.states').controller('DeleteCategoryController', ['DeleteModalSvc', '$uibModalInstance', 'resource', DeleteCategoryController]);
