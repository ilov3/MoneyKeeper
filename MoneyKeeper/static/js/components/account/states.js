"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper.states')
    .config(['$stateProvider', 'AppConstants', function ($stateProvider, AppConstants) {
        var componentPath = AppConstants.componentsPath + 'account/';
        $stateProvider
            .state({
                name: 'accounts',
                url: '/account',
                templateUrl: componentPath + 'template.html',
                controller: 'AccountController',
                controllerAs: 'accountCtrl'
            })
            .state({
                name: 'accounts.add',
                url: '/new',
                onEnter: ['$state', '$uibModal', 'dataSvc', 'BaseModalSvc', function ($state, $uibModal, dataSvc, BaseModalSvc) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: componentPath + 'crud/addTemplate.html',
                        controller: 'AddAccountController',
                        controllerAs: 'addAccountCtrl',
                        resolve: {
                            update: function () {
                                return dataSvc.getAccounts;
                            }
                        }
                    });
                    modalInstance.result.then(BaseModalSvc.onModalClose(dataSvc.getAccounts), BaseModalSvc.onModalClose(dataSvc.getAccounts))
                }]
            })
            .state({
                name: 'accounts.delete',
                url: '/:id/delete',
                onEnter: ['$state', '$stateParams', '$uibModal', '$timeout', 'dataSvc', 'BaseModalSvc', function ($state, $stateParams, $uibModal, $timeout, dataSvc, BaseModalSvc) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: componentPath + 'crud/deleteTemplate.html',
                        controller: 'DeleteAccountController',
                        controllerAs: 'deleteAccountCtrl',
                        resolve: {
                            resource: dataSvc.account.retrieve({id: $stateParams.id})
                        }
                    });
                    modalInstance.result.then(BaseModalSvc.onModalClose(dataSvc.getAccounts), BaseModalSvc.onModalClose(dataSvc.getAccounts))
                }]
            })
    }]);