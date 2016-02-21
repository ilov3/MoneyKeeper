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
                onEnter: ['$state', '$uibModal', 'dataSvc', function ($state, $uibModal, dataSvc) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: componentPath + 'crud/addTemplate.html',
                        controller: 'AddAccountController',
                        controllerAs: 'addAccountCtrl',
                        resolve: {
                            update: function () {
                                return dataSvc.updateSummary;
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        dataSvc.updateSummary();
                    });
                }]
            })
            .state({
                name: 'accounts.delete',
                url: '/:id/delete',
                onEnter: ['$state', '$stateParams', '$uibModal', 'dataSvc', function ($state, $stateParams, $uibModal, dataSvc) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: componentPath + 'crud/deleteTemplate.html',
                        controller: 'DeleteAccountController',
                        controllerAs: 'deleteAccountCtrl',
                        resolve: {
                            update: function () {
                                return dataSvc.updateSummary;
                            },
                            resource: dataSvc.account.retrieve({id: $stateParams.id})
                        }
                    });
                    modalInstance.result.then(function () {
                        dataSvc.updateSummary();
                    });
                }]
            })
    }]);