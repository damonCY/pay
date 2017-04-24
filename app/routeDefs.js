/**
 * routeDefs.js
 * SPA 前端路由定义
 * 
 * @author  Yang,junlong at 2016-05-20 14:31:46 build.
 * @version $Id$
 */

var app = require('app.js');

// register `routeDefs` Provider
app.provider('routeDefs', [
    '$stateProvider',
    '$urlRouterProvider',
    '$couchPotatoProvider',
    function($stateProvider, $urlRouterProvider, $couchPotatoProvider) {
        this.$get = function() {
            // this is a config-time-only provider
            // in a future sample it will expose runtime information to the app
            return {};
        };
        //$locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('home');

        // a uniform empty tpl for inherit
        var emptyTplInherit = __uri('./empty.html');

        // 首页
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: function(stateParams){
                return __uri('module/home/home.html');
            },
            controller: 'homeCtrl',
            resolve: {
                deps: app.deps('app/module/home/home.js')
            }
        })

        // 支付宝账户汇总
        .state('summaryAccountQuery', {
            url: '/summaryAccountQuery?saDate',
            templateUrl: function(stateParams){
                return __uri('module/summaryAccountQuery/summaryAccountQuery.html');
            },
            controller: 'summaryAccountQueryCtrl',
            resolve: {
                deps: app.deps('app/module/summaryAccountQuery/summaryAccountQuery.js')
            }
        })

        // 对账查看
        .state('reconcileQuery', {
            url: '/reconcileQuery?startDate&endDate',
            templateUrl: function(stateParams){
                return __uri('module/reconcile/reconcile.html');
            },
            controller: 'reconcileCtrl',
            resolve: {
                deps: app.deps('app/module/reconcile/reconcile.js')
            }
        })
        // 出款-现金结算经办
        .state('operateMerchantSettlement', {
            url: '/operateMerchantSettlement?startDate&endDate&merchantId&settleStatus&checkStatus',
            templateUrl: function(stateParams){
                return __uri('module/operateMerchantSettlement/operateMerchantSettlement.html');
            },
            controller: 'operateMerchantSettlementCtrl',
            resolve: {
                deps: app.deps('app/module/operateMerchantSettlement/operateMerchantSettlement.js')
            }
        })
        // 出款-现金结算复核
        .state('checkMerchantSettlement', {
            url: '/checkMerchantSettlement?startDate&endDate&merchantId&settleStatus&checkStatus',
            templateUrl: function(stateParams){
                return __uri('module/checkMerchantSettlement/checkMerchantSettlement.html');
            },
            controller: 'checkMerchantSettlementCtrl',
            resolve: {
                deps: app.deps('app/module/checkMerchantSettlement/checkMerchantSettlement.js')
            }
        })
        // 成本报表
        .state('costReport', {
            url: '/costReport?crYear',
            templateUrl: function(stateParams){
                return __uri('module/costReport/costReport.html');
            },
            controller: 'costReportCtrl',
            resolve: {
                deps: app.deps('app/module/costReport/costReport.js')
            }
        })
        // 收入报表
        .state('incomeReport', {
            url: '/incomeReport?irYear&endDate&merchantId',
            templateUrl: function(stateParams){
                return __uri('module/incomeReport/incomeReport.html');
            },
            controller: 'incomeReportCtrl',
            resolve: {
                deps: app.deps('app/module/incomeReport/incomeReport.js')
            }
        })
        // 商户报表
        .state('merchantReport', {
            url: '/merchantReport?startDate&endDate&merchantId&accountId',
            templateUrl: function(stateParams){
                return __uri('module/merchantReport/merchantReport.html');
            },
            controller: 'merchantReportCtrl',
            resolve: {
                deps: app.deps('app/module/merchantReport/merchantReport.js')
            }
        })
        //商户报表
        .state('balance',{
            abstract: true,
            templateUrl: emptyTplInherit
        })
        // 清结算报表-试算平衡表 
        .state('balance.summary',{
            url: '/balance/summary?startDate&endDate',
            templateUrl: function(stateParams){
                return __uri('module/balance/summary/summary.html');
            },
            controller: 'summaryCtrl',
            resolve: {
                deps: app.deps('app/module/balance/summary/summary.js')
            }
        })
        // 清结算报表-科目余额表 
        .state('balance.title',{
            url: '/balance/title?startDate&endDate&level',
            templateUrl: function(stateParams){
                return __uri('module/balance/title/title.html');
            },
            controller: 'titleCtrl',
            resolve: {
                deps: app.deps('app/module/balance/title/title.js')
            }
        })
        // 清结算报表-账户余额 (内部)
        .state('balance.account',{
            url: '/balance/account?startDate&endDate',
            templateUrl: function(stateParams){
                return __uri('module/balance/account/account.html');
            },
            controller: 'accountCtrl',
            resolve: {
                deps: app.deps('app/module/balance/account/account.js')
            }
        })
        // 清结算报表-账户余额(外部) 
        .state('balance.outeraccount',{
            url: '/balance/outeraccount?startDate&endDate',
            templateUrl: function(stateParams){
                return __uri('module/balance/outeraccount/outeraccount.html');
            },
            controller: 'outeraccountCtrl',
            resolve: {
                deps: app.deps('app/module/balance/outeraccount/outeraccount.js')
            }
        })
        // 清结算报表-账户恒等式 
        .state('balance.assetEquation',{
            url: '/balance/assetEquation?startDate&endDate',
            templateUrl: function(stateParams){
                return __uri('module/balance/assetEquation/assetEquation.html');
            },
            controller: 'assetEquationCtrl',
            resolve: {
                deps: app.deps('app/module/balance/assetEquation/assetEquation.js')
            }
        })
        // 交易查询
        .state('bizQuery', {
            url: '/bizQuery?startDate&endDate&bizType&bizStatus&merchantId&bizIdType&bizId&accountId&timeType&pageNo&pageSize',
            templateUrl: function(stateParams){
                return __uri('module/transaction/transaction.html');
            },
            controller: 'transactionCtrl',
            resolve: {
                deps: app.deps('app/module/transaction/transaction.js')
            }
        })
        // 交易详情
        .state('bizDetail', {
            url: '/biz/detail/{bizId:[0-9]+}',
            templateUrl: function(stateParams){
                return __uri('module/transaction/detail/detail.html');
            },
            controller: 'bizDetailCtrl',
            resolve: {
                deps: app.deps('app/module/transaction/detail/detail.js')
            }
        })
        // 账单查询
        .state('billQuery', {
            url: '/billQuery?billDate&merchantId&currentY&currentM',
            templateUrl: function(stateParams){
                return __uri('module/transaction/billquery/billquery.html');
            },
            controller: 'billqueryCtrl',
            resolve: {
                deps: app.deps('app/module/transaction/billquery/billquery.js')
            }
        })
        // 商户信息设置
        .state('merchantUpdate', {
            url: '/merchantSetting?startDate&endDate',
            templateUrl: function(stateParams){
                return __uri('module/merchantSetting/merchantSetting.html');
            },
            controller: 'merchantSettingCtrl',
            resolve: {
                deps: app.deps('app/module/merchantSetting/merchantSetting.js')
            }
        })
        // 商户详情
        .state('merchantDetail', {
            url: '/merchant/detail/{merchantId:[0-9]+}',
            templateUrl: function(stateParams){
                return __uri('module/merchantSetting/detail/detail.html');
            },
            controller: 'merchantDetailCtrl',
            resolve: {
                deps: app.deps('app/module/merchantSetting/detail/detail.js')
            }
        })
        // 商户信息修改
        .state('merchantEdit', {
            url: '/merchant/update/{merchantId:[0-9]+}',
            templateUrl: function(stateParams){
                return __uri('module/merchantSetting/update/update.html');
            },
            controller: 'merchantUpdateCtrl',
            resolve: {
                deps: app.deps('app/module/merchantSetting/update/update.js')
            }
        })
        // 商户供应商设置
        .state('merchantSupplierUpdate', {
            url: '/merchantSupplierSetting?startDate&endDate',
            templateUrl: function(stateParams){
                return __uri('module/merchantSupplierSetting/merchantSupplierSetting.html');
            },
            controller: 'merchantSupplierSettingCtrl',
            resolve: {
                deps: app.deps('app/module/merchantSupplierSetting/merchantSupplierSetting.js')
            }
        })
        // 登账
        .state('accounting',{
            abstract: true,
            templateUrl: emptyTplInherit
        })
        .state('accounting.account',{
            url: '/accounting/account',
            templateUrl: function(stateParams){
                return __uri('module/accounting/account/account.html');
            },
            controller: 'accountCtrl',
            resolve: {
                deps: app.deps('app/module/accounting/account/account.js')
            }
        })
        .state('accounting.voucher',{
            url: '/accounting/voucher?startDate&endDate&checkStatus&accountingVoucherNo&applicant',
            templateUrl: function(stateParams){
                return __uri('module/accounting/voucher/voucher.html');
            },
            controller: 'voucherCtrl',
            resolve: {
                deps: app.deps('app/module/accounting/voucher/voucher.js')
            }
        })
        .state('accounting.query',{
            url: '/accounting/query?startDate&endDate&checkStatus&accountingVoucherNo&applicant',
            templateUrl: function(stateParams){
                return __uri('module/accounting/query/query.html');
            },
            controller: 'queryCtrl',
            resolve: {
                deps: app.deps('app/module/accounting/query/query.js')
            }
        })

    }
]);
