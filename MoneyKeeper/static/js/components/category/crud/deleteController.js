"use strict";
/**
 * __author__ = 'ilov3'
 */

function DeleteCategoryController(DeleteModalSvc, $uibModalInstance, resource) {
    var modalSvc = new DeleteModalSvc();
    modalSvc.modalInstance = $uibModalInstance;
    modalSvc.resource = resource;
    this.service = modalSvc;
}

angular.module('MoneyKeeper.states').controller('DeleteCategoryController', ['DeleteModalSvc', '$uibModalInstance', 'resource', DeleteCategoryController]);
