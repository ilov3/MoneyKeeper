"use strict";
/**
 * __author__ = 'ilov3'
 */
function ChartController($scope, dataSvc, $window) {
    var self = this;
    this.data = dataSvc.results;
    this.height = $window.innerHeight * 0.4;
    this.options = {
        axes: {
            x: {
                key: 'month',
                type: 'date',
                ticksFormat: "%B",
                ticks: 0
            }
        },
        series: [
            {
                y: 'income',
                type: 'column',
                color: 'green',
                label: 'Income'
            },
            {
                y: 'expense',
                type: 'column',
                color: 'red',
                label: 'Expense'
            },
            {
                y: 'balance',
                type: 'line',
                color: 'blue',
                label: 'Balance'
            }
        ],
        tooltip: {
            mode: "axes",
            formatter: function (x, y, series) {
                return moment(x).format('MMMM') + ' ' + y
            }
        }
    };
    $scope.$on('statsReceived', function () {
        self.options.axes.x.ticks = dataSvc.results.stats.length
    })
}

angular.module('MoneyKeeper.states').controller('ChartController', ['$scope', 'dataSvc', '$window', ChartController]);