"use strict";
/**
 * __author__ = 'ilov3'
 */
function AddAccountController($scope, $modalInstance, dataSvc, update, ngNotify) {
    AddModalBaseController.call(this, $scope, $modalInstance, ngNotify);
    this.name = 'Account';
    this.resource = dataSvc.account;
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
            key: 'opening',
            type: 'input',
            defaultValue: 0,
            templateOptions: {
                type: 'number',
                label: 'Opening',
                placeholder: '',
                required: true
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

AddAccountController.prototype = Object.create(AddModalBaseController.prototype);
angular.module('MoneyKeeper.states').controller('AddAccountController', ['$scope', '$modalInstance', 'dataSvc', 'update', 'ngNotify', AddAccountController]);