"use strict";
/**
 * __author__ = 'ilov3'
 */
//TODO get rid of this
function BaseCrudController(dataSvc) {
    this.results = dataSvc.results;
    this.hide = function (resource) {
        resource.$update();
    };
}
