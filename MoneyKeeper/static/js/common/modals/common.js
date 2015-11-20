"use strict";
/**
 * __author__ = 'ilov3'
 */
function AddModalBaseController($scope, $uibModalInstance, ngNotify) {
    var self = this;
    var onSubmitSuccess = function (data) {
        if (data.$resolved) {
            self.updateFunc();
            ngNotify.set(self.name + ' successfully added!', 'success')
        }
    };
    var onSubmitError = function (error) {
        console.log(error);
        var messages = [];
        for (var obj in error.data) {
            if (error.data.hasOwnProperty(obj)) messages.push(error.data[obj])
        }
        ngNotify.set('Error on creating new ' + self.name + '. Details: ' + messages.join('\n'), 'error')
    };
    this.submit = function () {
        var payload = self.processFormData(self.formData);
        payload.user = $scope.conf.username;
        self.resource.save(payload).$promise.then(
            onSubmitSuccess,
            onSubmitError
        );
        if (!self.formData.addAnother) {
            $uibModalInstance.close()
        }
    };
    self.cancel = function () {
        $uibModalInstance.close()
    };
    $scope.$on('modal.closing', function () {
        self.updateFunc();
    });
}

AddModalBaseController.prototype.processFormData = function (formData) {
    return formData;
};