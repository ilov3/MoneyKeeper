"use strict";
/**
 * __author__ = 'ilov3'
 */

function CategoryController(dataSvc) {
    BaseCrudController.call(this, dataSvc);
    dataSvc.getCategories();
}

CategoryController.prototype = Object.create(BaseCrudController.prototype);
angular.module('MoneyKeeper.states').controller('CategoryController', ['dataSvc', CategoryController]);
