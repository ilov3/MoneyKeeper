"use strict";
/**
 * __author__ = 'ilov3'
 */

function BaseCrudController(dataSvc) {
    this.results = dataSvc.results;
    this.hide = function (resource) {
        resource.$update();
    };
}
