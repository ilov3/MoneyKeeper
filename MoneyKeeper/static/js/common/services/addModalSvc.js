"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper.states').factory('AddModalSvc', ['ngNotify', 'authSvc', 'BaseModalSvc', function (ngNotify, authSvc, BaseModalSvc) {
    var AddModalSvc = function () {
        BaseModalSvc.apply(this, arguments)
    };
    AddModalSvc.prototype = Object.create(BaseModalSvc.prototype);
    AddModalSvc.prototype.constructor = AddModalSvc;

    var onSubmitSuccess = function (data) {
        if (data.$resolved) {
            var message = this.getComponentName() + (data.name ? ' ' + data.name : '') + ' successfully added!';
            this.updateFn();
            ngNotify.set(message, 'success')
        }
    };

    AddModalSvc.prototype.submit = function (processFormDataCb) {
        var boundFn = onSubmitSuccess.bind(this);
        var payload = processFormDataCb ? processFormDataCb(this.formData) : this.formData;
        payload.user = authSvc.getUsername();
        this.resource.save(payload).$promise.then(boundFn);
        if (!this.formData.addAnother) {
            this.cancel()
        }
    };

    return AddModalSvc
}]);
