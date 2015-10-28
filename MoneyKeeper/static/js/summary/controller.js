"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper.states')
    .controller('SummaryController', ['$scope', '$uibModal', 'dataSvc', SummaryController]);

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

    var update = function () {
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
            controllerAs: 'addTransactionCtrl',
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
                },
                update: function () {
                    return update;
                }
            }
        });
        modalInstance.result.then(function () {
            update();
        });
    };

    self.scope.addAccount = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/static/partials/addAccount.html',
            controller: 'AddAccountController',
            controllerAs: 'addAccountCtrl',
            resolve: {
                update: function () {
                    return update;
                }
            }
        });
        modalInstance.result.then(function () {
            update();
        });
    };

    self.scope.mon = new Date();
    self.scope.results = {
        income: null,
        expense: null,
        accounts: [],
        categories: []
    };

    update();

    self.scope.$watch('mon', function (newValue, oldValue) {
        if (oldValue !== newValue) {
            updateIncExp(getFirstDay(newValue), getLastDay(newValue));
        }
    });
}