"use strict";
/**
 * __author__ = 'ilov3'
 */

AddModalBaseController.$inject = ['$scope', '$modalInstance', 'ngNotify'];
function AddModalBaseController($scope, $modalInstance, ngNotify) {
    var self = this;
    this.submit = function () {
        var payload = self.processFormData(self.formData);
        payload.user = $scope.conf.username;
        self.resource.save(payload).$promise.then(function (data) {
            if (data.$resolved) {
                self.updateFunc();
                ngNotify.set(self.name + ' successfully added!', 'success')
            }
        });
        if (!self.formData.addAnother) {
            $modalInstance.close()
        }
    };
    self.cancel = function () {
        $modalInstance.close()
    };
    $scope.$on('modal.closing', function () {
        self.updateFunc();
    });
}

AddModalBaseController.prototype.processFormData = function (formData) {
    return formData;
};