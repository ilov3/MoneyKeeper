"use strict";
/**
 * __author__ = 'ilov3'
 */

function CategoryController(dataSvc) {
    BaseGridController.call(this);
    this.gridDataSource = dataSvc.category;
    this.setGridData()
}

CategoryController.prototype = Object.create(BaseGridController.prototype);
angular.module('MoneyKeeper.states').controller('CategoryController', ['dataSvc', CategoryController]);
