"use strict";
/**
 * __author__ = 'ilov3'
 */
function BaseGridController() {
    var self = this;
    self.gridOptions = {
        enableFiltering: true
    };

    this.processColumns = function (columns) {
        return columns;
    };

    this.setGridData = function () {
        self.gridDataSource.options({}, function (data) {
            self.gridOptions.columnDefs = self.processColumns(data);
        });
        self.gridDataSource.query({}, function (data) {
            self.gridOptions.data = data;
        })
    };
}