"use strict";
/**
 * __author__ = 'ilov3'
 */
function RegisterController(authSvc, $uibModalInstance) {
    var self = this;
    var userIsUnique = function ($viewValue, $modelValue, scope) {
        var value = $viewValue || $modelValue;
        return authSvc.userIsUnique(value);
    };
    var emailIsUnique = function ($viewValue, $modelValue, scope) {
        var value = $viewValue || $modelValue;
        return authSvc.emailIsUnique(value);
    };
    var emailIsValid = function ($viewValue, $modelValue, scope) {
        var value = $viewValue || $modelValue;
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(value);
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
            },
            validators: {
                email: emailIsValid
            },
            asyncValidators: {
                expression: emailIsUnique
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
                    expression: userIsUnique
                }
            },
            expressionProperties: {
                'templateOptions.label': '"username" | translate'
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
            },
            expressionProperties: {
                'templateOptions.label': '"password" | translate'
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
                isSame: function ($viewValue, $modelValue, scope) {
                    return $viewValue == scope.model.password
                }
            },
            expressionProperties: {
                'templateOptions.label': '"confirmPassword" | translate'
            }
        }
    ]
}

angular.module('MoneyKeeper').controller('RegisterController', ['authSvc', '$uibModalInstance', RegisterController]);
