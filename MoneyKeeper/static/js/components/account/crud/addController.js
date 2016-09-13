"use strict";
/**
 * __author__ = 'ilov3'
 */
function AddAccountController($uibModalInstance, AddModalSvc, dataSvc, update) {
    var modalSvc = new AddModalSvc();
    modalSvc.modalInstance = $uibModalInstance;
    modalSvc.resource = dataSvc.account;
    modalSvc.updateFn = update;
    this.service = modalSvc;
    this.formFields = [
        {
            key: 'name',
            type: 'input',
            templateOptions: {
                type: 'text',
                label: 'Name',
                placeholder: '',
                required: true
            },
            expressionProperties: {
                'templateOptions.label': '"name" | translate'
            }
        },
        {
            key: 'opening',
            type: 'input',
            defaultValue: 0,
            templateOptions: {
                type: 'number',
                label: 'Opening',
                placeholder: '',
                required: true
            },
            expressionProperties: {
                'templateOptions.label': '"opening" | translate'
            }
        },
        {
            key: 'addAnother',
            type: 'checkbox',
            templateOptions: {
                label: 'Add another',
                required: false
            },
            expressionProperties: {
                'templateOptions.label': '"addAnother" | translate'
            }
        }
    ]
}

angular.module('MoneyKeeper.states').controller('AddAccountController', ['$uibModalInstance', 'AddModalSvc', 'dataSvc', 'update', AddAccountController]);