"use strict";
/**
 * __author__ = 'ilov3'
 */
function AddModalBaseController($scope, $state, $uibModalInstance, ngNotify) {
    var self = this;
    var onSubmitSuccess = function (data) {
        if (data.$resolved) {
            ngNotify.set(self.name + ' successfully added!', 'success')
        }
    };
    this.submit = function () {
        var payload = self.processFormData(self.formData);
        payload.user = $scope.conf.username;
        self.resource.save(payload).$promise.then(onSubmitSuccess);
        if (!self.formData.addAnother) {
            $uibModalInstance.close()
        }
    };
    self.cancel = function () {
        $uibModalInstance.close();
    };
    $scope.$on('modal.closing', function () {
        self.updateFunc();
        $state.go('^')
    });
}

AddModalBaseController.prototype.processFormData = function (formData) {
    return formData;
};

angular.module('MoneyKeeper.states').controller('AddModalBaseController', ['$scope', '$state', '$uibModalInstance', 'ngNotify', AddModalBaseController]);