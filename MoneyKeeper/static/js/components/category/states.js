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
                controllerAs: 'categoryCtrl',
                data: {
                    componentName: 'Category'
                }
            })
            .state({
                name: 'categories.add',
                url: '/new',
                onEnter: ['BaseModalSvc', '$uibModal', 'dataSvc', function (BaseModalSvc, $uibModal, dataSvc) {
                    var modalSvc = new BaseModalSvc();
                    var updateFn = function () {
                        dataSvc.getCategories();
                        dataSvc.getHistory();
                    };
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
                    modalInstance.result.then(modalSvc.onModalClose(updateFn), modalSvc.onModalClose(updateFn))
                }]
            })
            .state({
                name: 'categories.delete',
                url: '/:id/delete',
                onEnter: ['$stateParams', '$uibModal', 'dataSvc', 'BaseModalSvc', function ($stateParams, $uibModal, dataSvc, BaseModalSvc) {
                    var modalSvc = new BaseModalSvc();
                    var updateFn = function () {
                        dataSvc.getCategories();
                        dataSvc.getHistory();
                    };
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: componentPath + 'crud/deleteTemplate.html',
                        controller: 'DeleteCategoryController',
                        controllerAs: 'deleteCategoryCtrl',
                        resolve: {
                            resource: dataSvc.category.retrieve({id: $stateParams.id})
                        }
                    });
                    modalInstance.result.then(modalSvc.onModalClose(updateFn), modalSvc.onModalClose(updateFn))
                }]
            })
    }]);