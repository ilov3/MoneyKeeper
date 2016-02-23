"use strict";
/**
 * __author__ = 'ilov3'
 */
function AddCategoryController($uibModalInstance, AddModalSvc, dataSvc, update) {
    AddModalSvc.name = 'Category';
    AddModalSvc.modalInstance = $uibModalInstance;
    AddModalSvc.resource = dataSvc.category;
    AddModalSvc.updateFn = update;
    this.service = AddModalSvc;
    this.formFields = [
        {
            key: 'name',
            type: 'input',
            templateOptions: {
                type: 'text',
                label: 'Name',
                placeholder: '',
                required: true
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
            }
        },
        {
            key: 'addAnother',
            type: 'checkbox',
            templateOptions: {
                label: 'Add another',
                required: false
            }
        }
    ]
}

angular.module('MoneyKeeper.states').controller('AddCategoryController', ['$uibModalInstance', 'AddModalSvc', 'dataSvc', 'update', AddCategoryController]);