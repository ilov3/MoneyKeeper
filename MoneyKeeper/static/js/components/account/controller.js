"use strict";
/**
 * __author__ = 'ilov3'
 */

function AccountController(dataSvc) {
    BaseGridController.call(this);
    this.gridDataSource = dataSvc.account;
    this.setGridData()
}

AccountController.prototype = Object.create(BaseGridController.prototype);
angular.module('MoneyKeeper.states').controller('AccountController', ['dataSvc', AccountController]);