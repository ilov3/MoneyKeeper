"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper.states')
    .controller('SummaryController', ['$scope', '$uibModal', 'dataSvc', SummaryController])
    .controller('AddTransactionController', AddTransactionController);

function SummaryController($scope, $uibModal, dataSvc) {
    var self = this;
    self.scope = $scope;

    var updateIncExp = function (from, to) {
        dataSvc.transaction.amount({action: 'amount', kind: 'inc', begin: from, end: to}, function (data) {
            self.scope.results.income = data.result;
        });
        dataSvc.transaction.amount({action: 'amount', kind: 'exp', begin: from, end: to}, function (data) {
            self.scope.results.expense = data.result;
        });
    };

    var init = function () {
        updateIncExp(getFirstDay(self.scope.mon), getLastDay(self.scope.mon));
        dataSvc.account.query(function (data) {
            self.scope.results.accounts = data;
        });
        dataSvc.category.query(function (data) {
            self.scope.results.categories = data;
        })
    };

    var getFirstDay = function (date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    };

    var getLastDay = function (date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    };

    self.scope.getTotal = function () {
        var total = 0;
        for (var i = 0; i < self.scope.results.accounts.length; i++) {
            total += self.scope.results.accounts[i].get_balance;
        }
        return total;
    };

    self.scope.addTransaction = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/static/partials/addTransaction.html',
            controller: 'AddTransactionController',
            resolve: {
                accounts: function () {
                    return self.scope.results.accounts.map(function (t) {
                        t.value = t.name;
                        return t
                    });
                },
                categories: function () {
                    return self.scope.results.categories.map(function (t) {
                        t.value = t.name;
                        return t
                    });
                }

            }
        });

        modalInstance.result.then(function () {
            init();
        });
    };


    self.scope.mon = new Date();
    self.scope.results = {
        income: null,
        expense: null,
        accounts: [],
        categories: []
    };

    init();
    self.scope.$watch('mon', function (newValue, oldValue) {
        if (oldValue !== newValue) {
            updateIncExp(getFirstDay(newValue), getLastDay(newValue));
        }
    });
}

function AddTransactionController($scope, accounts, categories) {
    var self = this;
    self.scope = $scope;
    self.scope.kinds = {
        inc: 'Income',
        exp: 'Expense',
        trn: 'Transfer'
    };
    self.scope.formFields = [
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
                placeholder: '',
                required: true,
                options: [
                    {name: 'Income', value: 'inc'},
                    {name: 'Expense', value: 'exp'},
                    {name: 'Transfer', value: 'trn'}
                ]
            }
        },
        {
            key: 'category',
            type: 'select',
            hideExpression: 'model.kind == "trn"',
            templateOptions: {
                label: 'Category',
                placeholder: '',
                options: categories,
                ngOptions: 'option.name for option in to.options | filter: {kind:"Income"}' // TODO fix that filter
            },
            expressionProperties: {
                "templateOptions.required": 'model.kind != "trn"'
            }
        },
        {
            key: 'transfer_to_account',
            type: 'select',
            hideExpression: 'model.kind != "trn"',
            templateOptions: {
                label: 'Transfer to',
                placeholder: '',
                options: accounts
            },
            expressionProperties: {
                "templateOptions.required": 'model.kind == "trn"'
            }
        },
        {
            key: 'account',
            type: 'select',
            templateOptions: {
                label: 'Account',
                placeholder: '',
                required: true,
                options: accounts
            }
        },
        {
            key: 'amount',
            type: 'input',
            templateOptions: {
                type: 'text',
                label: 'Amount',
                placeholder: '',
                required: true
            }
        },
        {
            key: 'comment',
            type: 'input',
            templateOptions: {
                type: 'text',
                label: 'Comment',
                placeholder: '',
                required: false
            }
        }
    ]
}