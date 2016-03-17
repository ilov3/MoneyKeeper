"use strict";
/**
 * __author__ = 'ilov3'
 */
function ChartController($scope, dataSvc) {
    var self = this;

    var getSuitableMax = function () {
        var biggest = 0;
        dataSvc.results.stats.dataSet.forEach(function (obj) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] == 'number') {
                        if (obj[key] > biggest) {
                            biggest = obj[key]
                        }
                    }
                }
            }
        });
        return biggest * 1.25;
    };

    this.data = dataSvc.results;
    this.options = {
        axes: {
            x: {
                key: 'month',
                type: 'date',
                ticksFormat: "%B"
            },
            y: {}
        },
        series: [
            {
                axis: 'y', // only y is supported at this moment
                dataset: 'dataSet',
                key: 'income', // can also be something like {y0: 'some_key', y1: 'some_other_key'}
                label: 'Income',
                color: "green", // or any valid CSS value, really
                type: ['column'], // this, or a string. But this is better.
                id: 'incomeSeries',
                defined: function (v) {
                    return v.y1 !== undefined
                }
            },
            {
                axis: 'y', // only y is supported at this moment
                dataset: 'dataSet',
                key: 'expense', // can also be something like {y0: 'some_key', y1: 'some_other_key'}
                label: 'Expense',
                color: "red", // or any valid CSS value, really
                type: ['column'], // this, or a string. But this is better.
                id: 'expenseSeries',
                defined: function (v) {
                    return v.y1 !== undefined
                }
            },
            {
                axis: 'y', // only y is supported at this moment
                dataset: 'dataSet',
                key: 'balance', // can also be something like {y0: 'some_key', y1: 'some_other_key'}
                label: 'Balance',
                //interpolation: {mode: 'cardinal', tension: 0.7},
                //defined: function () {
                //    return value.y1 !== undefined;
                //},
                color: "blue", // or any valid CSS value, really
                type: ['line', 'dot'], // this, or a string. But this is better.
                id: 'balanceSeries',
                defined: function (v) {
                    return v.y1 !== undefined
                }
            }
        ],
        margin: {
            top: 30,
            right: 65,
            left: 65
        },
        pan: {
            x: true
        },
        tooltipHook: function (d) {
            if (d) {
                return {
                    abscissas: "",
                    rows: d.map(function (s) {
                        return {
                            label: s.series.label,
                            value: moment(s.row.x).format('MMMM') + ' ' + s.row.y1,
                            color: s.series.color,
                            id: s.series.id
                        }
                    })
                }
            }
        }
    };
    $scope.$on('statsReceived', function () {
        self.options.axes.y.max = getSuitableMax();
    })
}

angular.module('MoneyKeeper.states').controller('ChartController', ['$scope', 'dataSvc', ChartController]);