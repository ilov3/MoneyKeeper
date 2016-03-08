/**
 * Created by ilov3 on 19.10.15.
 */
angular.module('MoneyKeeper', [
        'ui.grid',
        'ui.grid.pagination',
        'ui.grid.edit',
        'ui.grid.cellNav',
        'ui.grid.rowEdit',
        'ngResource',
        'ngSanitize',
        'ngAnimate',
        'ngStorage',
        'ui.router',
        'ui.bootstrap',
        'ui.select',
        'angular.filter',
        'angular-loading-bar',
        'http-auth-interceptor',
        'formly',
        'formlyBootstrap',
        'n3-line-chart',
        'nvd3ChartDirectives',
        'ngNotify',
        'pascalprecht.translate',
        'MoneyKeeper.states'
    ])
    .config(['$resourceProvider', '$httpProvider', '$urlRouterProvider', 'cfpLoadingBarProvider', '$translateProvider',
        function ($resourceProvider, $httpProvider, $urlRouterProvider, cfpLoadingBarProvider, $translateProvider) {
            cfpLoadingBarProvider.includeSpinner = false;
            $resourceProvider.defaults.stripTrailingSlashes = false;
            $httpProvider.defaults.xsrfCookieName = 'csrftoken';
            $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
            $urlRouterProvider.otherwise('/summary');
            $httpProvider.interceptors.push('authSvcInterceptor');
            $translateProvider.translations('en', {
                accounts: 'Accounts',
                account: 'Account',
                categories: 'Categories',
                category: 'Category',
                deleteFormCategory: 'Category',
                transactions: 'Transactions',
                transaction: 'Transaction',
                deleteFormTransaction: 'Transaction',
                summary: 'Summary',
                recentActions: 'Recent actions',
                login: 'Login',
                forgotPassw: 'Forgot password?',
                provideEmail: 'Provide e-mail address:',
                email: 'Email',
                username: 'Username',
                password: 'Password',
                confirmPassword: 'Confirm password',
                register: 'Register',
                logout: 'Logout',
                about: 'About',
                total: 'Total',
                add: 'Add',
                new: 'New',
                more: 'More',
                less: 'Less',
                kind: 'Kind',
                income: 'Income',
                expense: 'Expense',
                transfer: 'Transfer',
                transferTo: 'Transfer to',
                amount: 'Amount',
                result: 'Result',
                comment: 'Comment',
                date: 'Date',
                report: 'Report',
                submit: 'Submit',
                cancel: 'Cancel',
                yes: 'Yes',
                no: 'No',
                name: 'Name',
                opening: 'Opening',
                addAnother: 'Add another',
                details: 'Details',
                delete: 'Delete',
                deleteMsgQuestion: 'Do you really want to delete this',
                deleteMsgWarn: 'All transactions which have relations to "{{value}}" will be also removed!'
            });

            $translateProvider.translations('ru', {
                accounts: 'Счета',
                account: 'Счет',
                categories: 'Категории',
                category: 'Категория',
                deleteFormCategory: 'Категорию',
                transactions: 'Транзакции',
                transaction: 'Транзакция',
                deleteFormTransaction: 'Транзакцию',
                summary: 'Сводка',
                recentActions: 'Последние действия',
                login: 'Войти',
                forgotPassw: 'Забыли пароль?',
                provideEmail: 'Введите адрес электронной почты:',
                email: 'Email',
                username: 'Логин',
                password: 'Пароль',
                confirmPassword: 'Подтверждение пароля',
                register: 'Зарегистрироваться',
                logout: 'Выйти',
                about: 'О проекте',
                total: 'Всего',
                add: 'Добавить',
                new: 'Новый',
                more: 'Больше',
                less: 'Меньше',
                kind: 'Тип',
                income: 'Доход',
                expense: 'Расход',
                transfer: 'Перевод',
                transferTo: 'Перевести в',
                amount: 'Сумма',
                result: 'Всего',
                comment: 'Комментарий',
                date: 'Дата',
                report: 'Отчет',
                submit: 'Подтвердить',
                cancel: 'Отмена',
                yes: 'Да',
                no: 'Нет',
                name: 'Название',
                opening: 'Начальный баланс',
                addAnother: 'Добавить еще',
                details: 'Детали',
                delete: 'Удалить',
                deleteMsgQuestion: 'Вы действительно хотите удалить этот',
                deleteMsgWarn: 'Все транзакции связанные с "{{value}}" будут также удалены!'
            });

            $translateProvider.preferredLanguage('ru');
        }])
    .run(['$state', '$rootScope', '$stateParams', 'formlyConfig', 'authSvc', function ($state, $rootScope, $stateParams, formlyConfig, authSvc) {
        $rootScope.$stateParams = $stateParams;
        $rootScope.conf = {};
        authSvc.setUsername();

        formlyConfig.extras.removeChromeAutoComplete = true;
        formlyConfig.setType({
            name: 'ui-select-single',
            extends: 'select',
            templateUrl: '/static/partials/ui-select-single.html'
        });
        formlyConfig.setType({
            name: 'checkbox',
            templateUrl: '/static/partials/formly-checkbox.html',
            "wrapper": ['bootstrapHasError'],
            overwriteOk: true
        });
        formlyConfig.setType({
            name: 'calcInput',
            wrapper: ['bootstrapLabel', 'bootstrapHasError'],
            templateUrl: '/static/partials/formly-calc-input.html',
            controller: ['$scope', function ($scope) {
                $scope.calc = function (expr) {
                    try {
                        var pure = expr.replace(/[^-()\d/*+.]/g, '');
                        $scope.model[$scope.to.binding] = $scope.$eval(pure);
                    } catch (err) {
                    }
                };
            }]
        })
    }])
    .controller('AppMainController', ['$scope', '$uibModal', '$state', 'authSvc', 'ngNotify', 'dataSvc', '$translate', AppMainController]);

function AppMainController($scope, $uibModal, $state, authSvc, ngNotify, dataSvc, $translate) {
    var self = this;
    this.loginDialogIsOpened = 0;
    var loginRequired = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            keyboard: false,
            templateUrl: '/static/js/components/auth/login.html',
            controller: 'LoginController',
            controllerAs: 'loginCtrl'
        });
        modalInstance.result.then(function () {
            self.loginDialogIsOpened = 0;
        }, function () {
            self.loginDialogIsOpened = 0;
        })
    };
    $scope.tabs = [
        {title: 'Summary', state: 'summary'},
        {title: 'Transactions', state: 'transactions'},
        {title: 'Categories', state: 'categories'},
        {title: 'Accounts', state: 'accounts'}
    ];
    $scope.iconMap = {
        addition: 'glyphicon glyphicon-plus',
        change: 'glyphicon glyphicon-pencil',
        deletion: 'glyphicon glyphicon-trash'
    };
    $scope.state = $state;
    $scope.logout = function () {
        authSvc.logout();
    };
    $scope.login = loginRequired;
    $scope.lang = $translate.proposedLanguage();
    $scope.$watch('lang', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            $translate.use(newValue);
        }
    });
    $scope.dataSvc = dataSvc;
    $scope.$on('event:auth-loginRequired', function () {
        if (!self.loginDialogIsOpened) loginRequired();
        self.loginDialogIsOpened = 1;
        $state.go('empty');
        ngNotify.set('Please, login or register new user', 'warn');
    });
    $scope.$on('event:auth-forbidden', function () {
        loginRequired();
        $state.go('empty');
        ngNotify.set('Please, login or register new user', 'warn');
    });
    $scope.$on('event:auth-loginConfirmed', function () {
        $state.go('summary');
    })
}
