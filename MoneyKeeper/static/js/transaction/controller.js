"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper.states')
    .controller('TransactionController', ['$scope', 'dataSvc', TransactionController]);

function TransactionController($scope, dataSvc) {
    $scope.gridOptions = {
        columnDefs: [
            {name: 'Date', field: 'date', cellFilter: 'date'},
            {name: 'Kind', field: 'kind'},
            {name: 'Category', field: 'category', editableCellTemplate: 'ui-grid/dropdownEditor'},
            {name: 'Transfer to', field: 'transfer_to_account', editableCellTemplate: 'ui-grid/dropdownEditor'},
            {name: 'Account', field: 'account', editableCellTemplate: 'ui-grid/dropdownEditor'},
            {name: 'Amount', field: 'amount', enableCellEditOnFocus: true},
            {name: 'Comment', field: 'comment'}
        ]
    };
    $scope.gridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
    };
    $scope.saveRow = function (rowEntity) {
        var promise = dataSvc.transaction.update({}, rowEntity);
        $scope.gridApi.rowEdit.setSavePromise(rowEntity, promise.$promise);
    };
    dataSvc.transaction.query({}, function (data) {
        $scope.gridOptions.data = data
    });
}