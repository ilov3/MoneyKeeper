"use strict";
/**
 * __author__ = 'ilov3'
 */
function RegisterController(authSvc, $uibModalInstance) {
    var self = this;
    var isUnique = function ($viewValue, $modelValue, scope) {
        var value = $viewValue || $modelValue;
        return authSvc.userIsUnique(value);
    };
    this.heading = 'Register';
    this.register = function () {
        authSvc.register(self.formData).then(
            function () {
                $uibModalInstance.close()
            }
        )
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
            }
        },
        {
            key: 'username',
            type: 'input',
            templateOptions: {
                type: 'text',
                label: 'Login',
                placeholder: '',
                required: true
            },
            asyncValidators: {
                isUnique: {
                    expression: isUnique
                }
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
            validators: {
                isSame: function($viewValue, $modelValue, scope){
                    return $viewValue == scope.model.password
                }
            }
        }
    ]
}

angular.module('MoneyKeeper').controller('RegisterController', ['authSvc', '$uibModalInstance', RegisterController]);