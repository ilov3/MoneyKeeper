"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper.states')
    .config(['$stateProvider', 'AppConstants', function ($stateProvider, AppConstants) {
        var componentPath = AppConstants.componentsPath + 'category/';
        $stateProvider
            .state({
                name: 'categories',
                url: '/category',
                templateUrl: componentPath + 'template.html',
                controller: 'CategoryController',
                controllerAs: 'categoryCtrl'
            })
            .state({
                name: 'categories.add',
                url: '/new',
                onEnter: ['BaseModalSvc', '$uibModal', 'dataSvc', function (BaseModalSvc, $uibModal, dataSvc) {
                    var updateFn = dataSvc.getCategories;
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: componentPath + 'crud/addTemplate.html',
                        controller: 'AddCategoryController',
                        controllerAs: 'addCategoryCtrl',
                        resolve: {
                            update: function () {
                                return updateFn
                            }
                        }
                    });
                    modalInstance.result.then(BaseModalSvc.onModalClose(updateFn), BaseModalSvc.onModalClose(updateFn))
                }]
            })
            .state({
                name: 'categories.delete',
                url: '/:id/delete',
                onEnter: ['$stateParams', '$uibModal', 'dataSvc', 'BaseModalSvc', function ($stateParams, $uibModal, dataSvc, BaseModalSvc) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: componentPath + 'crud/deleteTemplate.html',
                        controller: 'DeleteCategoryController',
                        controllerAs: 'deleteCategoryCtrl',
                        resolve: {
                            resource: dataSvc.category.retrieve({id: $stateParams.id})
                        }
                    });
                    modalInstance.result.then(BaseModalSvc.onModalClose(dataSvc.getCategories), BaseModalSvc.onModalClose(dataSvc.getCategories))
                }]
            })
    }]);