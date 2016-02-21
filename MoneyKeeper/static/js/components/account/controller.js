"use strict";
/**
 * __author__ = 'ilov3'
 */

function AccountController(dataSvc) {
    BaseCrudController.call(this, dataSvc);
    dataSvc.getAccounts();
}

AccountController.prototype = Object.create(BaseCrudController.prototype);
angular.module('MoneyKeeper.states').controller('AccountController', ['dataSvc', AccountController]);