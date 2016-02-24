"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper.states').service('DeleteModalSvc', ['ngNotify', 'BaseModalSvc', function (ngNotify, BaseModalSvc) {
    var DeleteModalSvc = function () {
        BaseModalSvc.apply(this, arguments)
    };
    DeleteModalSvc.prototype = Object.create(BaseModalSvc.prototype);
    DeleteModalSvc.prototype.constructor = DeleteModalSvc;

    DeleteModalSvc.prototype.confirm = function () {
        var self = this;
        this.resource.$delete(function (data) {
            var message = self.getComponentName() + (data.name ? ' ' + data.name : '') + ' successfully deleted!';
            ngNotify.set(message, 'success');
            self.modalInstance.close();
        })
    };
    return DeleteModalSvc
}]);
