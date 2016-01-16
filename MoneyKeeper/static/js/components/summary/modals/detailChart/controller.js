"use strict";
/**
 * __author__ = 'ilov3'
 */
function DetailChartController($scope, dataSvc, date, kind) {
    var self = this;
    this.date = date;
    this.kind = kind;
    this.data = dataSvc.results;
    this.xFunction = function () {
        return function (d) {
            return d.key;
        };
    };
    this.yFunction = function () {
        return function (d) {
            return d.y;
        };
    };
    this.getTotal = function () {
        var total = 0;
        for (var i = 0; i < self.data.monthDetails.length; i++) {
            total += self.data.monthDetails[i].y;
        }
        return total;
    };
    $scope.$on('modal.closing', function () {
        dataSvc.results.monthDetails = [];
    });
    dataSvc.getMonthDetails(date, kind);

}

angular.module('MoneyKeeper.states').controller('DetailChartController', ['$scope', 'dataSvc', 'date', 'kind', DetailChartController]);