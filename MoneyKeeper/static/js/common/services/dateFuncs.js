"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper')
    .service('dateFuncs', function () {
        this.getFirstDay = function (date) {
            return new Date(date.getFullYear(), date.getMonth(), 1);
        };

        this.getLastDay = function (date) {
            return new Date(date.getFullYear(), date.getMonth() + 1, 0);
        };

        this.getPrevMon = function (date) {
            return new Date(date.getFullYear(), date.getMonth() - 1, 1)
        };

        this.getNextMon = function(date) {
            return new Date(date.getFullYear(), date.getMonth() + 1, 1)
        };

        return this
    });