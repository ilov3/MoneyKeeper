"use strict";
/**
 * __author__ = 'ilov3'
 */
function AddCategoryController($uibModalInstance, AddModalSvc, dataSvc, update, $translate) {
    var modalSvc = new AddModalSvc();
    modalSvc.modalInstance = $uibModalInstance;
    modalSvc.resource = dataSvc.category;
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
            key: 'kind',
            type: 'select',
            defaultValue: 'exp',
            templateOptions: {
                label: 'Kind',
                required: true,
                options: [
                    {name: 'Expense', value: 'exp'},
                    {name: 'Income', value: 'inc'}
                ]
            },
            expressionProperties: {
                'templateOptions.label': '"kind" | translate',
                'templateOptions.options[0].name': '"expense" | translate',
                'templateOptions.options[1].name': '"income" | translate'
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

angular.module('MoneyKeeper.states').controller('AddCategoryController', ['$uibModalInstance', 'AddModalSvc', 'dataSvc', 'update', '$translate', AddCategoryController]);