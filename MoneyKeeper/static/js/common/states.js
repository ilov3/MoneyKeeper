"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper.states', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state({
                name: 'empty',
                url: '/',
                template: '',
                controller: function () {
                }
            })
    }])
    .run(['$templateRequest', function ($templateRequest) {
        $templateRequest('/static/partials/gridDatePickerFilter.html', true);
    }])
    .constant('AppConstants', {
        componentsPath: '/static/js/components/'
    });