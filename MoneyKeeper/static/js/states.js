"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper.states', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state({
                name: 'summary',
                url: '/summary',
                templateUrl: '/static/js/summary/template.html',
                controller: 'SummaryController',
                controllerAs: 'summaryCtrl'
            })
            .state({
                name: 'transaction',
                url: '/transaction',
                templateUrl: '/static/js/transaction/template.html',
                controller: 'TransactionController',
                controllerAs: 'transactionCtrl'
            })
            .state({
                name: 'category',
                url: '/category',
                templateUrl: '/static/js/category/template.html',
                controller: 'CategoryController',
                controllerAs: 'categoryCtrl'
            })
            .state({
                name: 'account',
                url: '/account',
                templateUrl: '/static/js/account/template.html',
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