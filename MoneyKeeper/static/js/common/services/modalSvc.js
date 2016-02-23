"use strict";
/**
 * __author__ = 'ilov3'
 */
function BaseModalSvc($timeout, $state) {

    function onModalClose(cb) {
        return function () {
            $timeout(function () {
                cb();
                $state.go('^')
            }, 500)
        }
    }

    return {
        onModalClose: onModalClose
    };
}

angular.module('MoneyKeeper.states').service('BaseModalSvc', ['$timeout', '$state', BaseModalSvc]);
