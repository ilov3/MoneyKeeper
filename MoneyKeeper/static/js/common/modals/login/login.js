"use strict";
/**
 * __author__ = 'ilov3'
 */
function LoginController(authSvc, $modalInstance) {
    var self = this;
    this.heading = 'Login';
    this.login = function () {
        authSvc.login(self.formData).then(
            function () {
                $modalInstance.close()
            }
        )
    };
    this.register = function () {
        authSvc.register(self.formData).then(
            function () {
                $modalInstance.close()
            }
        )
    };
    this.switchToRegister = function () {
        self.formData.switchToRegister = true;
        self.greeting = 'Register';
    };

    this.formFields = [
        {
            key: 'email',
            type: 'input',
            templateOptions: {
                type: 'email',
                label: 'Email',
                placeholder: '',
                required: true
            },
            expressionProperties: {
                "templateOptions.required": 'model.switchToRegister',
                "templateOptions.disabled": '!model.switchToRegister'
            },
            hideExpression: '!model.switchToRegister'
        },
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
        },
        {
            key: 'passwordCheck',
            type: 'input',
            templateOptions: {
                type: 'password',
                label: 'Confirm password',
                placeholder: '',
                required: true
            },
            expressionProperties: {
                "templateOptions.required": 'model.switchToRegister',
                "templateOptions.disabled": '!model.switchToRegister'
            },
            hideExpression: '!model.switchToRegister'
        }
    ]
}

angular.module('MoneyKeeper').controller('LoginController', ['authSvc', '$modalInstance', LoginController]);