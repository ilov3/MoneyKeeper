"use strict";
/**
 * __author__ = 'ilov3'
 */
angular.module('MoneyKeeper')
    .service('authSvc', ['$q', '$localStorage', '$rootScope', '$state', 'dataSvc', 'authService', 'ngNotify',
        function ($q, $localStorage, $rootScope, $state, dataSvc, authService, ngNotify) {
            var onLoginSuccess = function (response) {
                if (response.token) {
                    authSvc.setToken(response.token);
                    authSvc.setUsername();
                    authService.loginConfirmed({}, function (config) {
                        config.headers['Authentication'] = authSvc.getToken();
                        return config
                    });
                    $state.go('summary')
                }
            };
            var onLoginError = function (error) {
                console.log(error);
                ngNotify.set('Invalid credentials', 'error')
            };
            var onRegisterError = function (error) {
                console.log(error);
                ngNotify.set('Register error', 'error')
            };
            var authSvc = {
                getToken: function () {
                    return $localStorage.token
                },
                setToken: function (token) {
                    $localStorage.token = 'JWT ' + token
                },
                deleteToken: function () {
                    delete $localStorage.token
                }
            };
            authSvc.logout = function () {
                $rootScope.conf.username = null;
                authSvc.deleteToken();
                $rootScope.$broadcast('event:auth-loginRequired')
            };
            authSvc.login = function (user) {
                var resource = dataSvc.tokenAuth.login(user);
                resource.$promise.then(
                    onLoginSuccess,
                    onLoginError
                );
                return resource.$promise;
            };
            authSvc.register = function (user) {
                var resource = dataSvc.user.save(user);
                resource.$promise.then(
                    onLoginSuccess,
                    onRegisterError
                );
                return resource.$promise;
            };
            authSvc.setUsername = function () {
                dataSvc.conf.query(function (response) {
                    $rootScope.conf.username = response.username;
                })
            };
            authSvc.userIsUnique = function (username) {
                var resource = dataSvc.user.exists({username: username});
                return resource.$promise.then(function (response) {
                    if (response.result == true) {
                        ngNotify.set('Username "' + username + '" already taken', 'warn');
                        throw new Error('username is not unique')
                    }
                });
            };
            return authSvc
        }])
    .service('authSvcInterceptor', ['$injector', function ($injector) {
        return {
            request: function (config) {
                var authSvc = $injector.get('authSvc');
                var token = authSvc.getToken();

                if (token) {
                    config.headers['Authorization'] = token;
                }
                return config;
            }
        };
    }]);