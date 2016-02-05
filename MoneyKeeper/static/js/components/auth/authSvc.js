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
            var onRegisterSuccess = function (response) {
                var username = response.username;
                var email = response.email;
                ngNotify.set(
                    'Thank you, <b>' + username + '</b>, for registering on "Money Keeper" we send you confirmation e-mail to ' + email + '.',
                    {
                        type: 'success',
                        html: true,
                        sticky: true
                    }
                );
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
                resource.$promise.then(onLoginSuccess);
                return resource.$promise;
            };
            authSvc.register = function (user) {
                var resource = dataSvc.user.save(user);
                resource.$promise.then(onRegisterSuccess);
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
            authSvc.emailIsUnique = function (email) {
                var resource = dataSvc.user.exists({email: email});
                return resource.$promise.then(function (response) {
                    if (response.result == true) {
                        ngNotify.set('User with email "' + email + '" already registered', 'warn');
                        throw new Error('email is not unique')
                    }
                });
            };
            return authSvc
        }])
    .service('authSvcInterceptor', ['$injector', '$q', function ($injector, $q) {
        var interceptor = this;
        var getAuthSvc = function () {
            return $injector.get('authSvc');
        };
        var getNgNotify = function () {
            return $injector.get('ngNotify');
        };
        var getMessage = function (error) {
            if (error.hasOwnProperty('data')) {
                if (error.data.hasOwnProperty('detail')) {
                    return error.data.detail
                }
                if (error.data.hasOwnProperty('non_field_errors')) {
                    return error.data.non_field_errors
                }
                return 'Unable to parse the error!'
            }
        };
        interceptor.request = function (config) {
            var token = getAuthSvc().getToken();
            if (token) {
                config.headers['Authorization'] = token;
            }
            return config;
        };

        interceptor.responseError = function (error) {
            var message = getMessage(error);
            getNgNotify().set(message, 'error');
            return $q.reject(error);
        };
        return interceptor
    }]);
