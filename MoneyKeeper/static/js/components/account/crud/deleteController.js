"use strict";
/**
 * __author__ = 'ilov3'
 */

function DeleteAccountController(DeleteModalSvc, $uibModalInstance, resource) {
    DeleteModalSvc.modalInstance = $uibModalInstance;
    DeleteModalSvc.resource = resource;
    this.service = DeleteModalSvc;
}

angular.module('MoneyKeeper.states').controller('DeleteAccountController', ['DeleteModalSvc', '$uibModalInstance', 'resource', DeleteAccountController]);
