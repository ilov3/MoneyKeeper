"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper')
    .directive('uiGridDatePickerFilter', function () {
        function link(scope, element, attrs) {
            scope.dt = new Date();

            scope.start = null;
            scope.end = null;

            scope.clearDates = function () {
                scope.start = null;
                scope.end = null;
                scope.events = [];
            };

            scope.submit = function () {
                var term = {start: scope.start, end: scope.end};
                try {
                    scope.grid.columns[1].filters[0].term = term;
                } catch (error) {
                    console.log(error)
                }
            };

            scope.getDayClass = function (obj) {
                var date = obj.date;
                var mode = obj.mode;
                if (mode === 'day') {
                    var calDay = new Date(date).setHours(0, 0, 0, 0);
                    for (var i = 0; i < scope.events.length; i++) {
                        var eventDate = new Date(scope.events[i].date).setHours(0, 0, 0, 0);

                        if (calDay === eventDate) {

                            return scope.events[i].status;
                        }
                    }
                }
                return '';
            };

            scope.datePickerOptions = {
                submit: scope.submit,
                clearDates: scope.clearDates,
                customClass: scope.getDayClass,
                opened: false,
                options: {
                    startingDay: 1
                },
                open: function () {
                    scope.datePickerOptions.opened = true
                }
            };

            scope.$watch('dt', function () {
                if (!scope.dt) {
                    return;
                }
                var term = scope.dt;

                if (!scope.start || scope.start > term) {
                    scope.start = term;

                } else {
                    scope.end = term;

                }

                scope.events = [];

                function daydiff(first, second) {
                    return Math.round((second - first) / (1000 * 60 * 60 * 24));
                }

                if (scope.start) {
                    scope.events.push({date: scope.start, status: 'full', label: 'start'})
                }
                if (scope.end) {
                    scope.events.push({date: scope.end, status: 'full', label: 'end'})

                    var tempDate;
                    for (var i = 1; i <= daydiff(scope.start, scope.end); i++) {
                        tempDate = new Date();
                        tempDate.setDate(scope.start.getDate() + i);
                        scope.events.push({date: tempDate, status: 'partially'})

                    }

                }

                scope.dt = null;

            });
        }

        return {
            link: link,
            restrict: 'E',
            templateUrl: '/static/js/common/directives/uiGridDatepickerFilter/gridDatePickerFilter.html'
        }
    });