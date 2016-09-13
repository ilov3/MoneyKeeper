"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper.states')
    .config(['$stateProvider', 'statesConstants', function ($stateProvider, statesConstants) {
        var componentsPath = statesConstants.componentsPath + 'summary/';
        $stateProvider
            .state({
                name: 'abstractSummary',
                abstract: true,
                controller: 'SummaryController',
                controllerAs: 'summaryCtrl',
                templateUrl: componentsPath + 'template.html'
            })
            .state({
                name: 'summary',
                parent: 'abstractSummary',
                url: '/summary',
                views: {
                    accounts: {
                        templateUrl: componentsPath + 'partials/accounts.html'
                    },
                    categories: {
                        templateUrl: componentsPath + 'partials/categories.html'
                    },
                    incexp: {
                        templateUrl: componentsPath + 'partials/incexp.html'
                    },
                    report: {
                        templateUrl: componentsPath + 'partials/report.html'
                    }
                }
            })
    }]);