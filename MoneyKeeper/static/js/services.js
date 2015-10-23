/**
 * Created by ilov3 on 19.10.15.
 */
angular.module('MoneyKeeper')
    .service('dataSvc', ['$resource', function ($resource) {
        return {
            transaction: $resource('/api/transaction/:action', {}, {
                amount: {method: 'GET', params: {begin: '@begin', end: '@end', kind: '@kind'}, isArray: false, headers: {}},
                update: {method: 'PUT', params: {action: '@id'}}
            }),
            category: $resource('/api/category'),
            account: $resource('/api/account')
        }
    }]);