"use strict";
/**
 * __author__ = 'ilov3'
 */
function DetailChartController(dataSvc, date, kind) {
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
    dataSvc.getMonthDetails(date, kind);

}

angular.module('MoneyKeeper.states').controller('DetailChartController', ['dataSvc', 'date', 'kind', DetailChartController]);