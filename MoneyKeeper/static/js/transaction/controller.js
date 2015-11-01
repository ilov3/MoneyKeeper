"use strict";
/**
 * __author__ = 'ilov3'
 */

function TransactionController(dataSvc) {
    BaseGridController.call(this);
    this.gridOptions.rowTemplate = '' +
        '<div ng-class="{\'green\':row.entity.kind==\'inc\', \'red\':row.entity.kind==\'exp\' }">' +
        '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ' +
        'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';
    this.gridDataSource = dataSvc.transaction;
    this.setGridData();
}

TransactionController.prototype = Object.create(BaseGridController.prototype);
angular.module('MoneyKeeper.states').controller('TransactionController', ['dataSvc', TransactionController]);
