"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper.states', [])
    .config(['$stateProvider', function ($stateProvider) {
        var componentsPath = '/static/js/components/';
        $stateProvider
            .state({
                name: 'summary',
                url: '/summary',
                templateUrl: componentsPath + 'summary/template.html',
                controller: 'SummaryController',
                controllerAs: 'summaryCtrl'
            })
            .state({
                name: 'transaction',
                url: '/transaction',
                templateUrl: componentsPath + 'transaction/template.html',
                controller: 'TransactionController',
                controllerAs: 'transactionCtrl'
            })
            .state({
                name: 'category',
                url: '/category',
                templateUrl: componentsPath + 'category/template.html',
                controller: 'CategoryController',
                controllerAs: 'categoryCtrl'
            })
            .state({
                name: 'account',
                url: '/account',
                templateUrl: componentsPath + 'account/template.html',
                controller: 'AccountController',
                controllerAs: 'accountCtrl'
            })
            .state({
                name: 'empty',
                url: '/',
                template: '',
                controller: function () {
                }
            })
    }]);