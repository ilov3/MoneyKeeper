"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper.states')
    .controller('SummaryController', ['$scope', 'dataSvc', SummaryController]);

function SummaryController($scope, dataSvc) {
    //$scope.gridOptions = {};
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

    self.scope.details = false;
    self.scope.pickerIsShown = false;
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