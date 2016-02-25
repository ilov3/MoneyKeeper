"use strict";
/**
 * __author__ = 'ilov3'
 */

function TransactionController($scope, $state, $window, dataSvc) {
    BaseGridController.call(this);
    var self = this;
    this.datePickerOptions = {
        opened: false,
        options: {
            startingDay: 1
        },
        open: function () {
            self.datePickerOptions.opened = true
        }
    };

    this.gridOptions.useExternalPagination = true;
    this.gridOptions.useExternalFiltering = true;

    this.gridOptions.onRegisterApi = function (gridApi) {
        self.gridApi = gridApi;

        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            var grid = this.grid;
            self.baseQueryParams.page = newPage;
            self.baseQueryParams.page_size = pageSize;
            var queryParams = self.prepareQueryParams(grid, self.baseQueryParams);
            self.queryGridData(queryParams);
        });

        gridApi.core.on.filterChanged($scope, function () {
            var grid = this.grid;
            self.baseQueryParams.page = 1;
            var queryParams = self.prepareQueryParams(grid, self.baseQueryParams);
            self.queryGridData(queryParams);
        });

        gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
            var queryParams = self.prepareQueryParams(grid, self.baseQueryParams);
            if (sortColumns.length == 0) {
                self.baseQueryParams.ordering = null;
            } else {
                var direction = sortColumns[0].sort.direction;
                var fieldName = sortColumns[0].field;
                self.baseQueryParams.ordering = direction == 'asc' ? fieldName : '-' + fieldName;
                queryParams.ordering = self.baseQueryParams.ordering;
            }
            self.queryGridData(queryParams);
        });
    };

    this.gridOptions.rowTemplate = '' +
        '<div ng-class="{\'green\':row.entity.kind==\'inc\', \'red\':row.entity.kind==\'exp\' }">' +
        '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ' +
        'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';
    this.gridDataSource = dataSvc.transaction;

    this.processColumns = function (columns) {
        columns.unshift({
            width: '35',
            name: 'Delete row',
            enableFiltering: false,
            enableColumnMenu: false,
            enableSorting: false,
            headerCellTemplate: '<div></div>',
            cellTemplate: '<span class="delete-button"><a href="" ng-click="grid.appScope.transactionCtrl.deleteRow(row)">' +
            '<i class="glyphicon glyphicon-trash"></i></a></span>'
        });
        columns.forEach(function (column) {
            if (column.type == 'date') {
                column.filterHeaderTemplate = '/static/partials/gridDatePickerFilter.html';
            }
        });
        return columns;
    };

    this.deleteRow = function (row) {
        $state.get('transactions.delete').data.row = row;
        $state.get('transactions.delete').data.gridOptions = self.gridOptions;
        $state.go('transactions.delete', {id: row.entity.id})
    };

    this.getTableHeight = function () {
        return {height: $window.innerHeight * 0.85}
    };

    this.setGridData();
}

TransactionController.prototype = Object.create(BaseGridController.prototype);
angular.module('MoneyKeeper.states').controller('TransactionController', ['$scope', '$state', '$window', 'dataSvc', TransactionController]);
