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

    this.showDetailChart = function (d, i, series, raw) {
        if (series.key.y1 == 'income' || series.key.y1 == 'expense') {
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
                        return series.key.y1;
                    }
                }
            });
        }
    };

    this.results = dataSvc.results;
    this.limit = 5;
    this.currentMonth = new Date();
    this.prevMonth = self.dateFuncs.getPrevMon(self.currentMonth);

    dataSvc.updateSummary();

    $scope.$watch('currentMonth', function (newValue, oldValue) {
        if (oldValue !== newValue) {
            dataSvc.updateSummary(newValue)
        }
    });
}

angular.module('MoneyKeeper.states').controller('SummaryController', ['$scope', '$state', '$uibModal', 'dataSvc', 'dateFuncs', SummaryController]);
