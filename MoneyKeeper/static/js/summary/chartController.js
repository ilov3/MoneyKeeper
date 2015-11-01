"use strict";
/**
 * __author__ = 'ilov3'
 */
function ChartController(dataSvc) {
    var self = this;
    dataSvc.transaction.stats({}, function (data) {
        self.data = [data.result.incomes, data.result.expenses];
        self.labels = data.result.months;
        self.colors = [{
            "fillColor": "rgba(10, 200, 10, 1)",
            "pointStrokeColor": "#fff",
            "pointHighlightFill": "#fff"
        },
            {
                "fillColor": "rgba(200, 10, 10, 1)",
                "pointStrokeColor": "#fff",
                "pointHighlightFill": "#fff"
            }]
    })
}

angular.module('MoneyKeeper.states').controller('ChartController', ['dataSvc', ChartController]);