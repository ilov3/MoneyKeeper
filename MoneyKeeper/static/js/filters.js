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
    });