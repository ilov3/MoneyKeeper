"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper')
    .service('FormlyConfig', ['formlyConfig', 'utils', function (formlyConfig, utils) {
        this.init = function () {
            formlyConfig.extras.removeChromeAutoComplete = true;
            formlyConfig.setType({
                name: 'ui-select-single',
                extends: 'select',
                templateUrl: '/static/partials/ui-select-single.html'
            });
            formlyConfig.setType({
                name: 'checkbox',
                templateUrl: '/static/partials/formly-checkbox.html',
                "wrapper": ['bootstrapHasError'],
                overwriteOk: true
            });
            formlyConfig.setType({
                name: 'calcInput',
                wrapper: ['bootstrapLabel', 'bootstrapHasError'],
                templateUrl: '/static/partials/formly-calc-input.html',
                defaultOptions: {
                    validators: {
                        calcInput: function (viewValue, modelValue) {
                            var value = viewValue || modelValue;
                            return parseInt(value) > 0
                        }
                    }
                },
                controller: ['$scope', function ($scope) {
                    $scope.calc = function (expr) {
                        try {
                            var pure = expr.replace(/[^-()\d/*+.]/g, '');
                            $scope.model[$scope.to.binding] = $scope.$eval(pure);
                        } catch (err) {
                            if (expr === undefined) {
                                $scope.model[$scope.to.binding] = undefined
                            }
                        }
                    };
                }]
            });
            var attributes = [
                'date-disabled',
                'custom-class',
                'show-weeks',
                'starting-day',
                'init-date',
                'min-mode',
                'max-mode',
                'format-day',
                'format-month',
                'format-year',
                'format-day-header',
                'format-day-title',
                'format-month-title',
                'year-range',
                'shortcut-propagation',
                'datepicker-popup',
                'show-button-bar',
                'current-text',
                'clear-text',
                'close-text',
                'close-on-date-selection',
                'datepicker-append-to-body'
            ];

            var bindings = [
                'datepicker-mode',
                'min-date',
                'max-date'
            ];

            var ngModelAttrs = {};

            angular.forEach(attributes, function (attr) {
                ngModelAttrs[utils.camelize(attr)] = {attribute: attr};
            });

            angular.forEach(bindings, function (binding) {
                ngModelAttrs[utils.camelize(binding)] = {bound: binding};
            });

            formlyConfig.setType({
                name: 'datepicker',
                templateUrl: '/static/partials/datepicker.html',
                wrapper: ['bootstrapLabel', 'bootstrapHasError'],
                defaultOptions: {
                    ngModelAttrs: ngModelAttrs,
                    templateOptions: {
                        datepickerOptions: {
                            format: 'dd.MM.yyyy',
                            startingDay: 1,
                            initDate: new Date(),
                            opened: false,
                            open: function () {
                                this.opened = true
                            },
                            isSelected: function (dt) {
                                return dt.selected
                            },
                            isActive: function (dt) {
                                return dt.selected
                            }
                        }
                    }
                }
            })
        };
        return this
    }]);