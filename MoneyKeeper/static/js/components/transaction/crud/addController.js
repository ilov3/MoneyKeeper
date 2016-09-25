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
            type: 'datepicker',
            defaultValue: new Date(),
            templateOptions: {
                type: 'date',
                label: 'Date',
                placeholder: '',
                required: true
            },
            expressionProperties: {
                'templateOptions.label': '"date" | translate'
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
            },
            expressionProperties: {
                'templateOptions.label': '"kind" | translate',
                'templateOptions.options[0].name': '"expense" | translate',
                'templateOptions.options[1].name': '"income" | translate',
                'templateOptions.options[2].name': '"transfer" | translate'
            }
        },
        {
            key: 'category',
            type: 'select',
            hideExpression: 'model.kind == "trn"',
            templateOptions: {
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
                "templateOptions.disabled": 'model.kind == "trn" ? model.category = "" : ""',
                "templateOptions.label": '"category" | translate'
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
                "templateOptions.disabled": 'model.kind != "trn" ? model.transfer_to_account = "" : ""',
                "templateOptions.label": '"transferTo" | translate'
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
            },
            expressionProperties: {
                "templateOptions.label": '"account" | translate'
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
            },
            expressionProperties: {
                "templateOptions.label": '"amount" | translate'
            }
        },
        {
            key: 'comment',
            type: 'input',
            templateOptions: {
                type: 'text',
                label: 'Comment',
                required: false
            },
            expressionProperties: {
                "templateOptions.label": '"comment" | translate'
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
                "templateOptions.label": '"addAnother" | translate'
            }
        }
    ]
}

angular.module('MoneyKeeper.states').controller('AddTransactionController', ['AddModalSvc', 'dataSvc', '$uibModalInstance', 'update', AddTransactionController]);