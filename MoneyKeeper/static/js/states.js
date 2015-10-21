"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper.states', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state({
                name: 'home',
                templateUrl: '/static/js/home/template.html',
                controller: 'HomeController'
            })
            .state({
                name: 'transaction',
                templateUrl: '/static/js/transaction/template.html',
                controller: 'TransactionController'
            })
            .state({
                name: 'category',
                templateUrl: '/static/js/category/template.html',
                controller: 'CategoryController'
            })
            .state({
                name: 'account',
                templateUrl: '/static/js/account/template.html',
                controller: 'AccountController'
            })
    }]);