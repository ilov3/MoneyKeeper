"use strict";
/**
 * __author__ = 'ilov3'
 */

function DeleteTransactionController(DeleteModalSvc, $uibModalInstance, resource, row, confirm) {
    DeleteModalSvc.modalInstance = $uibModalInstance;
    DeleteModalSvc.resource = resource;
    this.confirm = confirm;
    this.row = row;
    this.service = DeleteModalSvc;
}

angular.module('MoneyKeeper.states').controller('DeleteTransactionController', ['DeleteModalSvc', '$uibModalInstance', 'resource', 'row', 'confirm', DeleteTransactionController]);
