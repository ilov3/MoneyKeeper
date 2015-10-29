"use strict";
/**
 * __author__ = 'ilov3'
 */

function AddModalBaseController($scope, $modalInstance) {
    var self = this;
    this.submit = function () {
        self.dataResolved = false;
        self.resource.save(self.processFormData(self.formData)).$promise.then(function (data) {
            if (data.$resolved) {
                self.dataResolved = true;
                self.updateFunc()
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