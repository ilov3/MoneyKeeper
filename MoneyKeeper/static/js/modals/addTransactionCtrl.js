"use strict";
/**
 * __author__ = 'ilov3'
 */
function AddTransactionController($scope, $modalInstance, accounts, categories, dataSvc, update) {
    AddModalBaseController.call(this, $scope, $modalInstance);
    this.resource = dataSvc.transaction;
    this.updateFunc = update;
    this.processFormData = function(formData){
        var payLoad = angular.copy(formData);
        payLoad.date = payLoad.date.toISOString().split('T')[0];
        return payLoad
    };
    this.formFields = [
        {
            key: 'date',
            type: 'input',
            defaultValue: new Date(),
            templateOptions: {
                type: 'date',
                label: 'Date',
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
                    {name: 'Income', value: 'inc'},
                    {name: 'Transfer', value: 'trn'}
                ]
            }
        },
        {
            key: 'category',
            type: 'ui-select-single',
            hideExpression: 'model.kind == "trn"',
            templateOptions: {
                optionsAttr: 'bs-options',
                label: 'Category',
                options: categories,
                ngOptions: 'option.name as option in to.options | filter: {kind: model.kind} | filter: $select.search'
            },
            expressionProperties: {
                "templateOptions.required": 'model.kind != "trn"',
                "templateOptions.disabled": 'model.kind == "trn" ? model.category = "" : ""'
            }
        },
        {
            key: 'transfer_to_account',
            type: 'select',
            hideExpression: 'model.kind != "trn"',
            templateOptions: {
                label: 'Transfer to',
                options: accounts,
                ngOptions: 'option.name as option.name for option in to.options | excludeFrom: model.account'
            },
            expressionProperties: {
                "templateOptions.required": 'model.kind == "trn"',
                "templateOptions.disabled": 'model.kind != "trn" ? model.transfer_to_account = "" : ""'
            }
        },
        {
            key: 'account',
            type: 'select',
            templateOptions: {
                label: 'Account',
                required: true,
                options: accounts,
                ngOptions: 'option.name as option.name for option in to.options | excludeFrom: model.transfer_to_account'
            }
        },
        {
            key: 'amount',
            type: 'input',
            templateOptions: {
                type: 'number',
                label: 'Amount',
                required: true
            }
        },
        {
            key: 'comment',
            type: 'input',
            templateOptions: {
                type: 'text',
                label: 'Comment',
                required: false
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

AddTransactionController.prototype = Object.create(AddModalBaseController.prototype);
angular.module('MoneyKeeper.states').controller('AddTransactionController', AddTransactionController);