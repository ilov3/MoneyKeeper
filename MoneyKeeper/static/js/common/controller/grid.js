"use strict";
/**
 * __author__ = 'ilov3'
 */
function BaseGridController() {
    var self = this;
    this.baseQueryParams = {
        page: 1,
        page_size: 50,
        ordering: null
    };

    this.filters = {};

    this.gridOptions = {
        isVirtual: false,
        enableFiltering: true,
        paginationPageSizes: [50],
        paginationPageSize: 50,
        columnDefs: [],
        data: []
    };

    this.processColumns = function (columns) {
        return columns;
    };

    this.processGridDataResponse = function (response) {
        return self.gridOptions.isVirtual ? response : response.results
    };

    this.prepareQueryParams = function (grid, extraQueryParams) {
        var queries = {};
        if (grid) {
            grid.columns.forEach(function (column, index, columns) {
                if (column.enableFiltering && column.filters[0].term) {
                    queries[column.field] = column.filters[0].term
                }
            });
        }
        if (extraQueryParams) {
            for (var prop in extraQueryParams) {
                if (extraQueryParams.hasOwnProperty(prop)) {
                    queries[prop] = extraQueryParams[prop]
                }
            }
        }

        return queries;
    };

    this.queryGridData = function (queryParams) {
        self.gridDataSource.query(queryParams || {}, function (response) {
            self.gridOptions.totalItems = response.count;
            self.gridOptions.data = self.processGridDataResponse(response);
        })
    };

    this.setGridData = function () {
        self.gridDataSource.options({}, function (data) {
            self.gridOptions.columnDefs = self.processColumns(data);
        });
        self.queryGridData();
    };
}