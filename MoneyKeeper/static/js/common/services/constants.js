"use strict";
/**
 * __author__ = 'ilov3'
 */

angular.module('MoneyKeeper.constants', [])
    .constant('langConstants', {
        ruLang: {
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
        },
        enLang: {
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
        }
    })
    .constant('appControllerConstants', {
        tabs: [
            {title: 'Summary', state: 'summary'},
            {title: 'Transactions', state: 'transactions'},
            {title: 'Categories', state: 'categories'},
            {title: 'Accounts', state: 'accounts'}
        ],
        iconMap: {
            addition: 'glyphicon glyphicon-plus',
            change: 'glyphicon glyphicon-pencil',
            deletion: 'glyphicon glyphicon-trash'
        }
    })
    .constant('statesConstants', {
        componentsPath: '/static/js/components/'
    });