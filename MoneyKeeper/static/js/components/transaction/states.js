"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper.states')
    .config(['$stateProvider', 'AppConstants', function ($stateProvider, AppConstants) {
        var componentPath = AppConstants.componentsPath + 'transaction/';
        $stateProvider
            .state({
                name: 'transactions',
                url: '/transaction',
                templateUrl: componentPath + 'template.html',
                controller: 'TransactionController',
                controllerAs: 'transactionCtrl',
                data: {
                    componentName: 'Transaction'
                },
                resolve: {
                    '1': ['dataSvc', '$q', function (dataSvc, $q) {
                        if (!dataSvc.results.categories.length) {
                            var deferred = $q.defer();
                            dataSvc.getCategories(deferred);
                            return deferred.promise
                        }
                    }],
                    '2': ['dataSvc', '$q', function (dataSvc, $q) {
                        if (!dataSvc.results.accounts.length) {
                            var deferred = $q.defer();
                            dataSvc.getAccounts(deferred);
                            return deferred.promise
                        }
                    }]
                }
            })
            .state({
                name: 'summary.addTransaction',
                url: '/transaction/new',
                onEnter: ['BaseModalSvc', '$uibModal', 'dataSvc', function (BaseModalSvc, $uibModal, dataSvc) {
                    var modalSvc = new BaseModalSvc();
                    var updateFn = dataSvc.updateSummary;
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: componentPath + 'crud/addTemplate.html',
                        controller: 'AddTransactionController',
                        controllerAs: 'addTransactionCtrl',
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
                //TODO refactor this shit
                name: 'transactions.delete',
                url: 'transaction/:id/delete',
                data: {
                    row: null
                },
                onEnter: ['$state', '$stateParams', '$uibModal', 'ngNotify', 'dataSvc', function ($state, $stateParams, $uibModal, ngNotify, dataSvc) {
                    var row = $state.get(this.name).data.row;
                    var gridOptions = $state.get(this.name).data.gridOptions;
                    var successCallback = function () {
                        var index = gridOptions.data.indexOf(row.entity);
                        gridOptions.data.splice(index, 1);
                        ngNotify.set('Transaction #' + row.entity.id + ' successfully deleted.', 'success');
                        modalInstance.close()
                    };
                    var confirm = function (row) {
                        dataSvc.deleteTransaction(row.entity, successCallback)
                    };
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: componentPath + 'crud/deleteTemplate.html',
                        controller: 'DeleteTransactionController',
                        controllerAs: 'deleteTransactionCtrl',
                        resolve: {
                            resource: dataSvc.transaction.retrieve({id: $stateParams.id}),
                            row: function () {
                                return row
                            },
                            confirm: function () {
                                return confirm
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        $state.go('^')
                    });
                }]
            })
    }]);