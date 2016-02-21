"use strict";
/**
 * __author__ = 'ilov3'
 */
function SummaryController($scope, $state, $uibModal, dataSvc, dateFuncs) {
    var self = this;
    var modalTemplatePath = '/static/js/components/summary/modals/';
    this.dateFuncs = dateFuncs;

    this.getTotal = function () {
        var total = 0;
        for (var i = 0; i < self.results.accounts.length; i++) {
            total += self.results.accounts[i].get_balance;
        }
        return total;
    };

    this.addTransaction = function () {
        $state.go('summary.addTransaction')
    };

    this.addAccount = function () {
        $state.go('accounts.add');
    };

    this.addCategory = function () {
        $state.go('categories.add');
    };

    this.showDetailChart = function (d, i, series, raw) {
        if (series.name == 'income' || series.name == 'expense') {
            $uibModal.open({
                animation: true,
                templateUrl: modalTemplatePath + 'detailChart/template.html',
                size: 'lg',
                controller: 'DetailChartController',
                controllerAs: 'detailChartCtrl',
                resolve: {
                    date: function () {
                        return d.x;
                    },
                    kind: function () {
                        return series.name;
                    }
                }
            });
        }
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

angular.module('MoneyKeeper.states').controller('SummaryController', ['$scope', '$state', '$uibModal', 'dataSvc', 'dateFuncs', SummaryController]);
