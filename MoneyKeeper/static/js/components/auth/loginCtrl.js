"use strict";
/**
 * __author__ = 'ilov3'
 */
function LoginController(authSvc, $uibModal, $uibModalInstance) {
    var self = this;
    this.heading = 'Login';
    this.switchToRegister = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/static/js/components/auth/register.html',
            controller: 'RegisterController',
            controllerAs: 'registerCtrl'
        });
        modalInstance.result.then(function () {
            $uibModalInstance.close();
        })
    };
    this.login = function () {
        authSvc.login(self.formData).then(
            function () {
                $uibModalInstance.close()
            }
        )
    };
    this.rememberPassword = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/static/js/components/auth/passwordReset.html',
            controller: 'PasswordResetController',
            controllerAs: 'passwordResetCtrl'
        });
        modalInstance.result.then(function () {
            $uibModalInstance.close();
        })
    };
    this.formFields = [
        {
            key: 'username',
            type: 'input',
            templateOptions: {
                type: 'text',
                label: 'Login',
                placeholder: '',
                required: true
            }
        },
        {
            key: 'password',
            type: 'input',
            templateOptions: {
                type: 'password',
                label: 'Password',
                placeholder: '',
                required: true
            }
        }
    ]
}

angular.module('MoneyKeeper').controller('LoginController', ['authSvc', '$uibModal', '$uibModalInstance', LoginController]);