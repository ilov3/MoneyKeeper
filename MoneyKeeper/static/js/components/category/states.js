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
                onEnter: ['$state', '$uibModal', 'dataSvc', function ($state, $uibModal, dataSvc) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: componentPath + 'crud/addTemplate.html',
                        controller: 'AddCategoryController',
                        controllerAs: 'addCategoryCtrl',
                        resolve: {
                            update: function () {
                                return dataSvc.getCategories;
                            }
                        }
                    });
                }]
            })
            .state({
                name: 'categories.delete',
                url: '/:id/delete',
                onEnter: ['$state', '$stateParams', '$uibModal', 'dataSvc', function ($state, $stateParams, $uibModal, dataSvc) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: componentPath + 'crud/deleteTemplate.html',
                        controller: 'DeleteCategoryController',
                        controllerAs: 'deleteCategoryCtrl',
                        resolve: {
                            resource: dataSvc.category.retrieve({id: $stateParams.id})
                        }
                    });
                    modalInstance.result.then(function () {
                        return dataSvc.getCategories();
                    });
                }]
            })
    }]);