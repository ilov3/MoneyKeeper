"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper.states')
    .controller('HomeController', ['$scope', 'dataSvc', HomeController]);

function HomeController($scope, dataSvc) {
    //$scope.gridOptions = {};
    var self = this;
    self.scope = $scope;

    var updateIncExp = function (from, to) {
        dataSvc.transaction.income({action: 'income', begin: from, end: to}, function (data) {
            self.scope.results.income = data.result;
        });
        dataSvc.transaction.expense({action: 'expense', begin: from, end: to}, function (data) {
            self.scope.results.expense = data.result;
        });
    };

    var getFirstDay = function () {
        var date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1);
    };

    var getLastDay = function () {
        var date = new Date();
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    };

    self.scope.from = getFirstDay();
    self.scope.to = getLastDay();
    self.scope.results = {
        income: null,
        expense: null
    };

    updateIncExp(self.scope.from, self.scope.to);
    self.scope.$watchGroup(['from', 'to'], function (newValues, oldValues) {
        if (oldValues !== newValues) {
            var from = newValues[0];
            var to = newValues[1];
            updateIncExp(from, to);
        }
    });
}