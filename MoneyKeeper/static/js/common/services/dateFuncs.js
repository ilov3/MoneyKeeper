"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper')
    .service('dateFuncs', function () {
        var getFirstDay = function (date) {
            return new Date(date.getFullYear(), date.getMonth(), 1);
        };

        var getLastDay = function (date) {
            return new Date(date.getFullYear(), date.getMonth() + 1, 0);
        };

        var getPrevMon = function (date) {
            return new Date(date.getFullYear(), date.getMonth() - 1, 1)
        };

        return {
            getFirstDay: getFirstDay,
            getLastDay: getLastDay,
            getPrevMon: getPrevMon
        }
    });