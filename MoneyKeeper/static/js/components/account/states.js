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
                controllerAs: 'accountCtrl',
                data: {
                    componentName: 'Account'
                }
            })
            .state({
                name: 'accounts.add',
                url: '/new',
                onEnter: ['$uibModal', 'dataSvc', 'BaseModalSvc', function ($uibModal, dataSvc, BaseModalSvc) {
                    var modalSvc = new BaseModalSvc();
                    var updateFn = dataSvc.getAccounts;
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: componentPath + 'crud/addTemplate.html',
                        controller: 'AddAccountController',
                        controllerAs: 'addAccountCtrl',
                        resolve: {
                            update: function () {
                                return updateFn
                            }
                        }
                    });
                    modalInstance.result.then(modalSvc.onModalClose(updateFn), modalSvc.onModalClose(updateFn))
                }]
            })
            .state({
                name: 'accounts.delete',
                url: '/:id/delete',
                onEnter: ['$stateParams', '$uibModal', 'dataSvc', 'BaseModalSvc', function ($stateParams, $uibModal, dataSvc, BaseModalSvc) {
                    var modalSvc = new BaseModalSvc();
                    var updateFn = dataSvc.getAccounts;
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: componentPath + 'crud/deleteTemplate.html',
                        controller: 'DeleteAccountController',
                        controllerAs: 'deleteAccountCtrl',
                        resolve: {
                            resource: dataSvc.account.retrieve({id: $stateParams.id})
                        }
                    });
                    modalInstance.result.then(modalSvc.onModalClose(updateFn), modalSvc.onModalClose(updateFn))
                }]
            })
    }]);