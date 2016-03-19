"use strict";
/**
 * __author__ = 'ilov3'
 */

function TransactionController($scope, $state, dataSvc, ngNotify) {
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

        var saveRow = function (rowEntity) {
            var deferred = dataSvc.transaction.update(rowEntity);
            deferred.$promise.then(function(){
                dataSvc.getHistory();
                ngNotify.set('Transaction #' + rowEntity.id + ' successfully updated!', 'success');
            });
            self.gridApi.rowEdit.setSavePromise(rowEntity, deferred.$promise);
        };

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

        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
            var kindsMapping = {
                Income: 'inc',
                Expense: 'exp',
                Transfer: 'trn'
            };
            if (-1 !== Object.keys(kindsMapping).indexOf(newValue)) rowEntity.kind = kindsMapping[newValue];
            if (-1 !== dataSvc.getNames(dataSvc.results.categories).indexOf(newValue)) {
                rowEntity.category = newValue;
                rowEntity.transfer_to_account = null;
            }
            if (-1 !== dataSvc.getNames(dataSvc.results.accounts).indexOf(newValue)) {
                if (colDef.field == 'category_or_transfer_to') {
                    rowEntity.transfer_to_account = newValue;
                    rowEntity.category = null;
                } else rowEntity.account = newValue;
            }
        });

        gridApi.rowEdit.on.saveRow($scope, saveRow);
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
            enableCellEdit: false,
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
            if (column.field == 'category_or_transfer_to') {
                var extended = [];
                Array.prototype.push.apply(extended, dataSvc.results.categories);
                Array.prototype.push.apply(extended, dataSvc.results.accounts);
                extended.sort(function (a, b) {
                    if (a.name > b.name) {
                        return 1;
                    }
                    if (a.name < b.name) {
                        return -1;
                    }
                    return 0;
                });
                column.filter = {
                    'type': 'select',
                    'selectOptions': extended.map(function (elem) {
                        return {value: elem.name, label: elem.name}
                    })
                };
                column.editDropdownOptionsFunction = function (rowEntity, colDef) {
                    var res = [];
                    extended.map(function (elem) {
                        if (elem.kind == rowEntity.kind) {
                            res.push({id: elem.name, value: elem.name});
                        } else if (rowEntity.kind == 'trn' && elem.kind == 'inc') {
                            res = dataSvc.results.accounts.map(function (elem) {
                                return {id: elem.name, value: elem.name}
                            });
                        }
                    });
                    return res;
                }
            }
            if (column.field == 'account') {
                column.filter = {
                    'type': 'select', 'selectOptions': dataSvc.results.accounts.map(function (elem) {
                        return {value: elem.name, label: elem.name}
                    })
                };
                column.editDropdownOptionsArray = dataSvc.results.accounts.map(function (elem) {
                    return {id: elem.name, value: elem.name}
                })
            }
        });
        return columns;
    };

    this.deleteRow = function (row) {
        $state.get('transactions.delete').data.row = row;
        $state.get('transactions.delete').data.gridOptions = self.gridOptions;
        $state.go('transactions.delete', {id: row.entity.id})
    };

    this.setGridData();
}

TransactionController.prototype = Object.create(BaseGridController.prototype);
angular.module('MoneyKeeper.states').controller('TransactionController', ['$scope', '$state', 'dataSvc', 'ngNotify', TransactionController]);
