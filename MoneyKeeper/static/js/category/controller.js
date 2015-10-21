"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper.states')
    .controller('CategoryController', ['$scope', 'dataSvc', CategoryController]);

function CategoryController($scope, dataSvc) {
    $scope.gridOptions = {};
    dataSvc.category.query({}, function (data) {
        $scope.gridOptions.data = data
    });
}