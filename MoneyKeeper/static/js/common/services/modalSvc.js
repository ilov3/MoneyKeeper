"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper.states').factory('BaseModalSvc', ['$timeout', '$state', function ($timeout, $state) {
    var BaseModalSvc = function () {
        this.modalInstance = null;
    };

    BaseModalSvc.prototype.cancel = function () {
        this.modalInstance.close();
    };

    BaseModalSvc.prototype.onModalClose = function (cb) {
        return function () {
            $timeout(function () {
                cb();
                $state.go('^')
            }, 500)
        }
    };

    BaseModalSvc.prototype.getComponentName = function () {
        if ($state.current.hasOwnProperty('data') && 'componentName' in $state.current.data) {
            return $state.current.data.componentName;
        }
        return 'Item';
    };

    return BaseModalSvc
}

]);


