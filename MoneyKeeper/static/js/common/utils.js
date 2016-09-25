"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper.utils', [])
    .service('utils', function () {
        this.checkNested = function (obj /*, level1, level2, ... levelN*/) {
            var args = Array.prototype.slice.call(arguments, 1);

            for (var i = 0; i < args.length; i++) {
                if (!obj || !obj.hasOwnProperty(args[i])) {
                    return false;
                }
                obj = obj[args[i]];
            }
            return true;
        };
        this.camelize = function (string) {
            string = string.replace(/[\-_\s]+(.)?/g, function (match, chr) {
                return chr ? chr.toUpperCase() : '';
            });
            // Ensure 1st char is always lowercase
            return string.replace(/^([A-Z])/, function (match, chr) {
                return chr ? chr.toLowerCase() : '';
            });
        };

        return this
    });
