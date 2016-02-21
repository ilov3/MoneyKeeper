"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper.states', [])
    .config(['$stateProvider', 'AppConstants', function ($stateProvider, AppConstants) {
        var componentsPath = AppConstants.componentsPath;
        $stateProvider
            .state({
                name: 'summary',
                url: '/summary',
                templateUrl: componentsPath + 'summary/template.html',
                controller: 'SummaryController',
                controllerAs: 'summaryCtrl'
            })
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