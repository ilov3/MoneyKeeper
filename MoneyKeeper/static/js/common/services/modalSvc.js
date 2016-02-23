"use strict";
/**
 * __author__ = 'ilov3'
 */
function BaseModalSvc($timeout, $state) {
    this.modalInstance = null;

    this.onModalClose = function (cb) {
        return function () {
            $timeout(function () {
                cb();
                $state.go('^')
            }, 500)
        }
    };

    this.cancel = function () {
        this.modalInstance.close()
    };

    return this
}

angular.module('MoneyKeeper.states').service('BaseModalSvc', ['$timeout', '$state', BaseModalSvc]);
