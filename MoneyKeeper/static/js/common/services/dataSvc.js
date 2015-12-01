/**
 * Created by ilov3 on 19.10.15.
 */
angular.module('MoneyKeeper')
    .service('dataSvc', ['$rootScope', '$resource', 'dateFuncs', function ($rootScope, $resource, dateFuncs) {
        var Data = {
            results: {
                transactions: [],
                categories: [],
                accounts: [],
                stats: [],
                income: null,
                expense: null
            },

            transaction: $resource('/api/transaction/:id/:action/', {}, {
                amount: {method: 'GET', params: {begin: '@begin', end: '@end', kind: '@kind'}, isArray: false, headers: {}},
                update: {method: 'PUT', params: {action: '@id'}},
                delete: {method: 'DELETE', params: {action: '@id'}},
                options: {method: 'OPTIONS', isArray: true},
                stats: {method: 'GET', params: {action: 'stats'}}
            }),
            category: $resource('/api/category/:id/:action/', {}, {
                options: {method: 'OPTIONS', isArray: true}
            }),
            account: $resource('/api/account/:id/:action/', {}, {
                options: {method: 'OPTIONS', isArray: true}
            }),
            user: $resource('/api/user/:id/:action/', {}, {
                exists: {method: 'GET', params: {action: 'exists', username: '@username', email:'@email'}, isArray: false}
            }),
            tokenAuth: $resource('/api/token-auth/', {}, {
                login: {method: 'POST', isArray: false}
            }),
            conf: $resource('/api/conf/', {}, {
                query: {isArray: false}
            })
        };

        Data.getTransactions = function () {
            Data.transaction.query({}, function (response) {
                Data.results.transactions = response
            })
        };

        Data.getCategories = function () {
            Data.category.query({}, function (response) {
                Data.results.categories = response
            })
        };

        Data.getAccounts = function () {
            Data.account.query({}, function (response) {
                Data.results.accounts = response
            })
        };

        Data.getIncome = function (from, to) {
            Data.transaction.amount({action: 'amount', kind: 'inc', begin: from, end: to}, function (data) {
                Data.results.income = data.result;
            });
        };

        Data.getExpense = function (from, to) {
            Data.transaction.amount({action: 'amount', kind: 'exp', begin: from, end: to}, function (data) {
                Data.results.expense = data.result;
            });
        };

        Data.getStats = function () {
            Data.transaction.stats({}, function (response) {
                response.result.forEach(function (row) {
                    row.month = new Date(row.month);
                });
                Data.results.stats = response.result;
                $rootScope.$broadcast('statsReceived');
            })
        };

        Data.updateSummary = function (date) {
            if (date == undefined) {
                date = new Date;
            }
            var firstDay = dateFuncs.getFirstDay(date);
            var lastDay = dateFuncs.getLastDay(date);
            Data.getAccounts();
            Data.getCategories();
            Data.getStats();
            Data.getIncome(firstDay, lastDay);
            Data.getExpense(firstDay, lastDay);
        };

        return Data
    }]);