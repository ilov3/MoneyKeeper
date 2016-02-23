"use strict";
/**
 * __author__ = 'ilov3'
 */
function DeleteModalSvc(ngNotify, BaseModalSvc) {
    angular.extend(DeleteModalSvc.prototype, BaseModalSvc);
    var self = this;
    self.modalInstance = null;
    self.formData = null;
    self.resource = null;

    this.confirm = function () {
        self.resource.$delete(function (data) {
            ngNotify.set(self.resource.name + ' successfully deleted!', 'success');
            self.modalInstance.close();
        })
    };
}

angular.module('MoneyKeeper.states').service('DeleteModalSvc', ['ngNotify', 'BaseModalSvc', DeleteModalSvc]);
