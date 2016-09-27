"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper')
    .directive('uiGridDatePickerFilter', function () { // TODO make this re-usable
        function link(scope, element, attrs) {
            scope.dt = null;

            scope.start = null;
            scope.end = null;

            scope.clearDates = function () {
                scope.start = null;
                scope.end = null;
                scope.dt = null;
                scope.events = [];
                scope.grid.columns[1].filters[0].term = null;
                scope.removeFilter(scope.col.filters[0], scope.$index)
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
                if (mode === 'day' && scope.events !== undefined) {
                    var calDay = new Date(date).setHours(0, 0, 0, 0);
                    for (var i = 0; i < scope.events.length; i++) {
                        var eventDate = new Date(scope.events[i].date).setHours(0, 0, 0, 0);

                        if (calDay === eventDate) {

                            return 'selected';
                        }
                    }
                }
                return '';
            };

            scope.datepickerOptions = {
                submit: scope.submit,
                clearDates: scope.clearDates,
                customClass: scope.getDayClass,
                opened: false,
                startingDay: 1,
                open: function () {
                    this.opened = true
                }
            };

            scope.$watch('start', function (newVal) {
                if (scope.dt == null) {
                    scope.datepickerOptions.initDate = newVal
                }
            });

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
                    scope.events.push({date: scope.start, label: 'start'})
                }
                if (scope.end) {
                    scope.events.push({date: scope.end, label: 'end'});

                    for (var i = 1; i <= daydiff(scope.start, scope.end); i++) {
                        var tempDate = moment(scope.start);
                        tempDate.add(i, 'd');
                        scope.events.push({date: tempDate.toDate()})
                    }
                }
            });
        }

        return {
            link: link,
            restrict: 'E',
            templateUrl: '/static/js/common/directives/uiGridDatepickerFilter/gridDatePickerFilter.html'
        }
    });