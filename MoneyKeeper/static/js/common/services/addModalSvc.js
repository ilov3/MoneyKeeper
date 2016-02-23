"use strict";
/**
 * __author__ = 'ilov3'
 */
function AddModalSvc(ngNotify, authSvc) {
    var self = this;
    self.modalInstance = null;
    self.resource = null;
    self.updateFn = null;

    var onSubmitSuccess = function (data) {
        if (data.$resolved) {
            var message = self.name + (data.name ? ' ' + data.name : '') + ' successfully added!';
            self.updateFn();
            ngNotify.set(message, 'success')
        }
    };

    this.submit = function (formData, processFormDataCb) {
        var payload = processFormDataCb ? processFormDataCb(formData) : formData;
        payload.user = authSvc.getUsername();
        self.resource.save(payload).$promise.then(onSubmitSuccess);
        if (!formData.addAnother) {
            self.modalInstance.close()
        }
    };

    return self
}

angular.module('MoneyKeeper.states').service('AddModalSvc', ['ngNotify', 'authSvc', AddModalSvc]);
