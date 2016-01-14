"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper')
    .filter('excludeFrom', function () {
        return function (inputArray, filterCriteria) {
            return inputArray.filter(function (item) {
                return !filterCriteria || !angular.equals(item.name, filterCriteria);
            });
        };
    })
    .filter('capitalize', function () {
        return function (input, all) {
            var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
            return (!!input) ? input.replace(reg, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }) : '';
        }
    });