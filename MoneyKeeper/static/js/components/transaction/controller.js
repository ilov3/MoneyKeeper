"use strict";
/**
 * __author__ = 'ilov3'
 */

function TransactionController($scope, $uibModal, ngNotify, dataSvc) {
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
            cellTemplate: '<button class="btn btn-sm btn-default delete-button" ng-click="grid.appScope.deleteRow(row)">Delete</button>'
        });
        return columns;
    };

    $scope.deleteRow = function (row) {
        var confirm = function (row) {
            dataSvc.transaction.delete({id: row.entity.id},
                function (response) {
                    if (response.$resolved) {
                        var index = self.gridOptions.data.indexOf(row.entity);
                        self.gridOptions.data.splice(index, 1);
                        ngNotify.set('Transaction #' + row.entity.id + ' successfully deleted.', 'success');
                        modalInstance.close();
                    }
                }, function (error) {
                    ngNotify.set('Something went wrong!', 'error')
                })
        };
        var modalInstance = $uibModal.open({
            animation: true,
            template: '<div class="modal-header"><h3 class="modal-title">Delete transaction #{{row.entity.id}}</h3></div>' +
            '<div class="modal-body">Do you really want to delete this transaction</div>' +
            '<div class="modal-footer">' +
            '<button class="btn btn-sm btn-default" ng-click="confirm(row)">Yes</button>' +
            '<button class="btn btn-sm btn-default" type="button" ng-click="cancel()">No</button>' +
            '</div>',
            controller: ['$scope', '$uibModalInstance', 'row', 'confirm', function ($scope, $uibModalInstance, row, confirm) {
                $scope.row = row;
                $scope.confirm = confirm;
                $scope.cancel = function () {
                    $uibModalInstance.close()
                }
            }],
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
angular.module('MoneyKeeper.states').controller('TransactionController', ['$scope', '$uibModal', 'ngNotify', 'dataSvc', TransactionController]);
