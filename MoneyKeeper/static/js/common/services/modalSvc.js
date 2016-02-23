"use strict";
/**
 * __author__ = 'ilov3'
 */
module.factory('BaseModalSvc', ['$timeout', function ($timeout) {
    var self = this;

    function setModalInstance(instance) {
        self.instance = instance
    }

    function setFormData(formData) {
        self.formData = formData
    }

    function cancel() {
        $timeout(function () {
            self.instance.close()
        }, 500);
    }

    return {
        setFormData: setFormData,
        setModalInstance: setModalInstance,
        cancel: cancel
    };
}]);

module.factory('AddModalSvc', ['BaseModalSvc', function (BaseModalSvc) {
    var service = Object.create(BaseModalSvc);
    var self = this;

    service.submit = function () {
        var payload = self.processFormData(self.formData);
        payload.user = $scope.conf.username;
        self.resource.save(payload).$promise.then(onSubmitSuccess);
        if (!self.formData.addAnother) {
            self.instance.close()
        }
    };

    return service
}]);
