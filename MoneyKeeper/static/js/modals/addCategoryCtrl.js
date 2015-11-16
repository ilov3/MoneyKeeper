"use strict";
/**
 * __author__ = 'ilov3'
 */
function AddCategoryController($scope, $modalInstance, dataSvc, update, ngNotify) {
    AddModalBaseController.call(this, $scope, $modalInstance, ngNotify);
    this.name = 'Category';
    this.resource = dataSvc.category;
    this.updateFunc = update;
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

AddCategoryController.prototype = Object.create(AddModalBaseController.prototype);
angular.module('MoneyKeeper.states').controller('AddCategoryController', ['$scope', '$modalInstance', 'dataSvc', 'update', 'ngNotify', AddCategoryController]);