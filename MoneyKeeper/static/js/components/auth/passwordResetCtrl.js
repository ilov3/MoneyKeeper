"use strict";
/**
 * __author__ = 'ilov3'
 */
function PasswordResetController(authSvc, $uibModalInstance) {
    var self = this;
    this.heading = 'Provide e-mail address:';
    this.formFields = [
        {
            key: 'email',
            type: 'input',
            templateOptions: {
                type: 'email',
                label: 'Email',
                placeholder: '',
                required: true
            }
        }
    ];
    this.submit = function () {
        authSvc.passwordReset(self.formData).then(
            function () {
                $uibModalInstance.close()
            }
        )
    }
}

angular.module('MoneyKeeper').controller('PasswordResetController', ['authSvc', '$uibModalInstance', PasswordResetController]);