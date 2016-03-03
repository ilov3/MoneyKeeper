"use strict";
/**
 * __author__ = 'ilov3'
 */
function AddTransactionController(AddModalSvc, dataSvc, $uibModalInstance, update) {
    var modalSvc = new AddModalSvc();
    modalSvc.modalInstance = $uibModalInstance;
    modalSvc.resource = dataSvc.transaction;
    modalSvc.updateFn = update;
    this.service = modalSvc;
    this.processFormData = function (formData) {
        var payload = angular.copy(formData);
        payload.date = payload.date.toISOString().split('T')[0];
        return payload
    };
    var amountIsValid = function ($viewValue, $modelValue, scope) {
        var value = $viewValue || $modelValue;
        return /[0-9/*-+]+/.test(value)
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
            type: 'select',
            hideExpression: 'model.kind == "trn"',
            templateOptions: {
                //optionsAttr: 'bs-options',
                label: 'Category',
                options: dataSvc.results.categories,
                ngOptions: 'option.name as option.name for option in to.options ' +
                '| filter: {kind: model.kind} ' +
                '| filter: {is_shown: true} ' +
                '| filter: $select.search ' +
                '| orderBy: "name"'
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
                options: dataSvc.results.accounts,
                ngOptions: 'option.name as option.name for option in to.options ' +
                '| filter: {is_shown: true} ' +
                '| excludeFrom: model.account' +
                '| orderBy: "name"'
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
                options: dataSvc.results.accounts,
                ngOptions: 'option.name as option.name for option in to.options ' +
                '| filter: {is_shown: true} ' +
                '| excludeFrom: model.transfer_to_account ' +
                '| orderBy: "name"'
            }
        },
        {
            key: '_amount',
            type: 'calcInput',
            templateOptions: {
                type: 'text',
                binding: 'amount',
                label: 'Amount',
                required: true
            },
            validators: {
                _amount: amountIsValid
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

angular.module('MoneyKeeper.states').controller('AddTransactionController', ['AddModalSvc', 'dataSvc', '$uibModalInstance', 'update', AddTransactionController]);