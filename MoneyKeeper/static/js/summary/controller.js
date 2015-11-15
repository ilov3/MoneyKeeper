"use strict";
/**
 * __author__ = 'ilov3'
 */
function SummaryController($scope, $uibModal, dataSvc, dateFuncs) {
    var self = this;
    this.dateFuncs = dateFuncs;

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
                    return dataSvc.updateSummary;
                }
            }
        });
        modalInstance.result.then(function () {
            dataSvc.updateSummary();
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
                    return dataSvc.updateSummary;
                }
            }
        });
        modalInstance.result.then(function () {
            dataSvc.updateSummary()
        });
    };

    this.addCategory = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/static/partials/addCategory.html',
            controller: 'AddCategoryController',
            controllerAs: 'addCategoryCtrl',
            resolve: {
                update: function () {
                    return dataSvc.updateSummary;
                }
            }
        });
        modalInstance.result.then(function () {
            dataSvc.updateSummary()
        });
    };

    this.results = dataSvc.results;
    this.limit = 5;
    this.mon = new Date();
    this.prevMon = self.dateFuncs.getPrevMon(self.mon);

    dataSvc.updateSummary();

    $scope.$watch('mon', function (newValue, oldValue) {
        if (oldValue !== newValue) {
            dataSvc.updateSummary(newValue)
        }
    });
}

angular.module('MoneyKeeper.states').controller('SummaryController', ['$scope', '$uibModal', 'dataSvc', 'dateFuncs', SummaryController]);
