"use strict";
/**
 * __author__ = 'ilov3'
 */

function TransactionController($uibModal, ngNotify, dataSvc) {
    BaseGridController.call(this);
    var self = this;
    this.gridOptions.rowTemplate = '' +
        '<div ng-class="{\'green\':row.entity.kind==\'inc\', \'red\':row.entity.kind==\'exp\' }">' +
        '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ' +
        'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';
    this.gridDataSource = dataSvc.transaction;

    this.processColumns = function (columns) {
        columns.unshift({
            width: '58',
            name: 'Del',
            enableFiltering: false,
            enableColumnMenu: false,
            enableSorting: false,
            cellTemplate: '<button class="btn btn-sm btn-default delete-button" ng-click="grid.appScope.transactionCtrl.deleteRow(row)">Delete</button>'
        });
        return columns;
    };

    this.deleteRow = function (row) {
        var successCallback = function () {
            var index = self.gridOptions.data.indexOf(row.entity);
            self.gridOptions.data.splice(index, 1);
            ngNotify.set('Transaction #' + row.entity.id + ' successfully deleted.', 'success');
            modalInstance.close()
        };
        var confirm = function (row) {
            dataSvc.deleteTransaction(row.entity, successCallback)
        };
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/static/js/components/transaction/modals/deleteTransaction/template.html',
            controller: 'DeleteTransactionController',
            resolve: {
                row: function () {
                    return row
                },
                confirm: function () {
                    return confirm
                }
            }
        })
    };

    this.setGridData();
}

TransactionController.prototype = Object.create(BaseGridController.prototype);
angular.module('MoneyKeeper.states').controller('TransactionController', ['$uibModal', 'ngNotify', 'dataSvc', TransactionController]);
