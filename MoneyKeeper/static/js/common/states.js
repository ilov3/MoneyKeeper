"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper.states', ['constants'])
    .config(['$stateProvider', 'statesConstants', function ($stateProvider, statesConstants) {
        $stateProvider
            .state({
                name: 'empty',
                url: '/',
                template: '',
                controller: function () {
                }
            })
            .state({
                name: 'login',
                url: '/login',
                onEnter: ['$uibModal', 'authSvc', function ($uibModal, authSvc) {
                    function loginModal() {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            backdrop: 'static',
                            keyboard: false,
                            templateUrl: statesConstants.componentsPath + 'auth/login.html',
                            controller: 'LoginController',
                            controllerAs: 'loginCtrl'
                        });
                        modalInstance.result.then(function () {
                            authSvc.loginDialogIsOpened = 0;
                        }, function () {
                            authSvc.loginDialogIsOpened = 0;
                        })
                    }

                    if (!authSvc.loginDialogIsOpened) {
                        loginModal();
                        authSvc.loginDialogIsOpened = 1;
                    }
                }]
            })
    }])
    .run(['$templateRequest', function ($templateRequest) {
        $templateRequest('/static/partials/gridDatePickerFilter.html', true);
    }]);
