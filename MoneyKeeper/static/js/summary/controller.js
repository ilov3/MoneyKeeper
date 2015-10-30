"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper.states')
    .controller('SummaryController', ['$scope', '$uibModal', 'dataSvc', 'dateFuncs', SummaryController]);

function SummaryController($scope, $uibModal, dataSvc, dateFuncs) {
    var self = this;
    this.dateFuncs = dateFuncs;

    var updateIncExp = function (from, to) {
        dataSvc.transaction.amount({action: 'amount', kind: 'inc', begin: from, end: to}, function (data) {
            self.results.income = data.result;
        });
        dataSvc.transaction.amount({action: 'amount', kind: 'exp', begin: from, end: to}, function (data) {
            self.results.expense = data.result;
        });
    };

    var update = function () {
        updateIncExp(self.dateFuncs.getFirstDay(self.mon), self.dateFuncs.getLastDay(self.mon));
        dataSvc.account.query(function (data) {
            self.results.accounts = data;
        });
        dataSvc.category.query(function (data) {
            self.results.categories = data;
        })
    };

    this.getTotal = function () {
        var total = 0;
        for (var i = 0; i < self.results.accounts.length; i++) {
            total += self.results.accounts[i].get_balance;
        }
        return total;
    };

    this.addTransaction = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/static/partials/addTransaction.html',
            controller: 'AddTransactionController',
            controllerAs: 'addTransactionCtrl',
            resolve: {
                accounts: function () {
                    return self.results.accounts.map(function (t) {
                        t.value = t.name;
                        return t
                    });
                },
                categories: function () {
                    return self.results.categories.map(function (t) {
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

    this.addAccount = function () {
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

    this.mon = new Date();
    this.prevMon = self.dateFuncs.getPrevMon(self.mon);
    this.results = {
        limit: 5,
        income: null,
        expense: null,
        accounts: [],
        categories: []
    };

    update();

    $scope.$watch('mon', function (newValue, oldValue) {
        if (oldValue !== newValue) {
            updateIncExp(self.dateFuncs.getFirstDay(newValue), self.dateFuncs.getLastDay(newValue));
        }
    });
}