"use strict";
/**
 * __author__ = 'ilov3'
 */
function BaseModalSvc($timeout, $state) {
    var self = this;
    self.modalInstance = null;
    self.formData = null;

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

BaseModalSvc.prototype.cancel = function () {
    this.modalInstance.close()
};

function AddModalSvc(ngNotify, authSvc) {
    angular.extend(AddModalSvc.prototype, BaseModalSvc);
    var self = this;
    self.resource = null;
    self.updateFunc = null;

    var onSubmitSuccess = function (data) {
        if (data.$resolved) {
            ngNotify.set(self.name + ' ' + self.formData.name + ' successfully added!', 'success')
        }
    };

    this.submit = function (resource, processFormDataCb) {
        var payload = processFormDataCb ? processFormDataCb(this.formData) : this.formData;
        payload.user = authSvc.getUsername();
        self.resource.save(payload).$promise.then(onSubmitSuccess);
        if (!this.formData.addAnother) {
            self.modalInstance.close()
        }
    };

    this.cancel = function () {
        BaseModalSvc.prototype.cancel.call(self)
    };

    return self
}

angular.module('MoneyKeeper.states').service('BaseModalSvc', ['$timeout', '$state', BaseModalSvc]);
angular.module('MoneyKeeper.states').service('AddModalSvc', ['ngNotify', 'authSvc', AddModalSvc]);
