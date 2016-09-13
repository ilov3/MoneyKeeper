"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper')
    .directive("select", function () {
        return {
            restrict: "E",
            require: "?ngModel",
            scope: false,
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) {
                    return;
                }
                element.bind("keyup", function () {
                    element.triggerHandler("change");
                })
            }
        }
    })
    .directive('dynamicHeight', ['$window', function ($window) {
        return {
            restrict: 'A',
            scope: true,
            link: function (scope, element, attrs) {
                element.css('height', attrs.dynamicHeight * $window.innerHeight);
                angular.element($window).bind('resize', function () {
                    element.css('height', attrs.dynamicHeight * $window.innerHeight);
                });
            }
        }
    }]);