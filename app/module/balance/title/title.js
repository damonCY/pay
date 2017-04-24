/**
 * 科目余额表
 * 
 * @author  chenyong5 at 2016-12-06  build.
 * @version $Id$
 */

var app = require('app/app.js');

var $ = angular.element = require('app/directive/miBsTable/miBsTable.js');

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

app.registerController('titleCtrl', ['$rootScope', '$scope', '$http', '$modal', '$state', '$stateParams', '$sce', 'dateFilter',
    function($rootScope, $scope, $http, $modal, $state, $stateParams, $sce, dateFilter) {
    $scope.title = '清算报表/科目余额表';
    $scope.titleIcon = '';
    $scope.queryParams = {
        startdate: dateFilter($rootScope.startTime, 'yyyy-MM-dd'),
        enddate: dateFilter($rootScope.endTime, 'yyyy-MM-dd'),
        level: 1
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

    // 科目级别
    $scope.levelOptions = [
        {value: '1', name: '一级科目'},
        {value: '2', name: '二级科目'},
        {value: '3', name: '三级科目'}
    ];

    $http.get('/balance/title', {
        params: $scope.queryParams
    })
    .success(function(data, status, headers, config) {
        // set row style
        if(status == 404) {
            data = [];
        }
        $scope.miBsTable = {
            options: {
                    data: data,
                    toggle: 'table',
                    rowStyle: function (row, index) {
                        return { classes: 'none' };
                    },

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
                        title: '科目代码',
                        width: 100
                    }, {
                        field: 'ledgerName',
                        title: '账户名',
                        width: 100
                    }, {
                        field: 'debitMoneyBegin',
                        title: '期初借方余额',
                        align: 'right',
                        valign: 'middle',
                        formatter: formatMoney,
                        sortable: true,
                        width: 120
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
                        width: 150
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
                        width: 150
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
                        width: 150
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
                        width: 150
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
                        width: 150
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
                        width: 150
                    }, {
                        field: 'creditMoneyAccum',
                        title: '贷方累计',
                        align: 'right',
                        valign: 'middle',
                        formatter: formatMoney,
                        sortable: true,
                        width: 150
                    }]
                }
        }
    });

    $scope.search = function() {
        $state.go('balance.title', $scope.queryParams, {
            reload: true
        });
    }
}]);
