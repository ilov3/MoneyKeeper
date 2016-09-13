"use strict";
/**
 * __author__ = 'ilov3'
 */

function DeleteTransactionController(DeleteModalSvc, $uibModalInstance, resource, row, confirm) {
    var modalSvc = new DeleteModalSvc();
    modalSvc.modalInstance = $uibModalInstance;
    modalSvc.resource = resource;
    this.confirm = confirm;
    this.row = row;
    this.service = modalSvc;
}

angular.module('MoneyKeeper.states').controller('DeleteTransactionController', ['DeleteModalSvc', '$uibModalInstance', 'resource', 'row', 'confirm', DeleteTransactionController]);
