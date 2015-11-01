/**
 * Created by ilov3 on 19.10.15.
 */
angular.module('MoneyKeeper')
    .service('dataSvc', ['$resource', function ($resource) {
        return {
            transaction: $resource('/api/transaction/:action', {}, {
                amount: {method: 'GET', params: {begin: '@begin', end: '@end', kind: '@kind'}, isArray: false, headers: {}},
                update: {method: 'PUT', params: {action: '@id'}},
                options: {method: 'OPTIONS', isArray: true},
                stats: {method: 'GET', params: {action: 'stats'}}
            }),
            category: $resource('/api/category/:action', {}, {
                options: {method: 'OPTIONS', isArray: true}
            }),
            account: $resource('/api/account/:action', {}, {
                options: {method: 'OPTIONS', isArray: true}
            })
        }
    }]);