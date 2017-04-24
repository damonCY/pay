/**
 * 账户余额表
 * 
 *@author  chenyong5 at 2016-12-06  build.
 * @version $Id$
 */

var app = require('app/app.js');

var $ = angular.element = require('/app/directive/miBsTable/miBsTable.js');

require('/mix/directive/miDatepicker/miDatepicker.js');
require('/mix/directive/miSelect/miSelect.js');

// 金额格式化，三位一逗号，保留两位小数
function formatMoney(s) {
    var n = 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
    t = "";
    for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
}

app.registerController('accountCtrl', ['$rootScope', '$scope', '$http', '$modal', '$state', '$stateParams', '$sce', 'dateFilter',
    function($rootScope, $scope, $http, $modal, $state, $stateParams, $sce, dateFilter) {
    $scope.title = '清算报表/账户余额表';
    $scope.titleIcon = '';

    $scope.queryParams = {
        startdate: dateFilter($rootScope.startTime, 'yyyy-MM-dd'),
        enddate: dateFilter($rootScope.endTime, 'yyyy-MM-dd')
    };
    angular.forEach($stateParams, function(value, index) {
        if(value) {
            $scope.queryParams[index] = value;
        }
    });

    $scope.miBsTable = {
        options: {},
        state: {}
    }

    $http.get('/balance/account', {
        params: $scope.queryParams
    })
    .success(function(data, status, headers, config) {

        $scope.miBsTable = {
            options: {
                    data: data,
                    toggle: 'table',
                    cache: false,
                    //height: 400,
                    striped: true,
                    pagination: false,
                    pageSize: 25,
                    pageList: [5, 10, 25, 50, 100, 200],
                    search: true,
                    showColumns: true,
                    showRefresh: false,
                    showExport: true,
                    exportDataType: 'all',
                    minimumCountColumns: 2,
                    clickToSelect: false,
                    showToggle: true,
                    maintainSelected: true,
                    columns: [{
                        field: 'ledger',
                        title: '账户号',
                        formatter: function(td) {
                            return '\'' + td;
                        },
                        width: 120
                    }, {
                        field: 'ledgerName',
                        title: '账户名',
                        width: 150
                    }, {
                        field: 'debitMoneyBegin',
                        title: '期初借方余额',
                        align: 'right',
                        valign: 'middle',
                        formatter: formatMoney,
                        sortable: true,
                        width: 150
                    }, {
                        field: 'debitNumberBegin',
                        title: '期初借方余额笔数',
                        align: 'right',
                        valign: 'top',
                        sortable: true,
                        width: 150
                    }, {
                        field: 'creditMoneyBegin',
                        title: '期初贷方余额',
                        align: 'right',
                        valign: 'middle',
                        formatter: formatMoney,
                        sortable: true,
                        width: 120
                    }, {
                        field: 'creditNumberBegin',
                        title: '期初贷方余额笔数',
                        align: 'right',
                        valign: 'middle',
                        sortable: true,
                        width: 150
                    }, {
                        field: 'debitMoneyCurrent',
                        title: '本期借方发生额',
                        align: 'right',
                        valign: 'middle',
                        formatter: formatMoney,
                        sortable: true,
                        width: 120
                    }, {
                        field: 'debitNumberCurrent',
                        title: '本期借方发生额笔数',
                        align: 'right',
                        valign: 'middle',
                        sortable: true,
                        width: 150
                    }, {
                        field: 'creditMoneyCurrent',
                        title: '本期贷方发生额',
                        align: 'right',
                        valign: 'middle',
                        formatter: formatMoney,
                        sortable: true,
                        width: 120
                    }, {
                        field: 'creditNumberCurrent',
                        title: '本期贷方发生额笔数',
                        align: 'right',
                        valign: 'middle',
                        sortable: true,
                        width: 150
                    }, {
                        field: 'debitMoneyEnd',
                        title: '本期借方余额',
                        align: 'right',
                        valign: 'middle',
                        formatter: formatMoney,
                        sortable: true,
                        width: 120
                    }, {
                        field: 'debitNumberEnd',
                        title: '本期借方余额笔数',
                        align: 'right',
                        valign: 'middle',
                        sortable: true,
                        width: 150
                    }, {
                        field: 'creditMoneyEnd',
                        title: '本期贷方余额',
                        align: 'right',
                        valign: 'middle',
                        formatter: formatMoney,
                        sortable: true,
                        width: 120
                    }, {
                        field: 'creditNumberEnd',
                        title: '本期贷方余额笔数',
                        align: 'right',
                        valign: 'middle',
                        sortable: true,
                        width: 150
                    }, {
                        field: 'debitMoneyAccum',
                        title: '借方累计',
                        align: 'right',
                        valign: 'middle',
                        formatter: formatMoney,
                        sortable: true,
                        width: 120
                    }, {
                        field: 'creditMoneyAccum',
                        title: '贷方累计',
                        align: 'right',
                        valign: 'middle',
                        formatter: formatMoney,
                        sortable: true,
                        width: 120
                    }]
                }
        }
    });

    $scope.search = function() {
        $state.go('balance.account', $scope.queryParams, {
            reload: true
        });
    }
}]);
