/**
 * 报表-清算报表-试算平衡表
 * 
 * @author  chenyong5 at 2016-12-06  build.
 * @version $Id$
 */

var app = require('app/app.js');
var $ = angular.element = require('app/directive/miBsTable/miBsTable.js');
require('mix/directive/miDatepicker/miDatepicker');
require('mix/directive/miSelect/miSelect');

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

app.registerController('summaryCtrl', ['$rootScope', '$scope', '$http', '$modal', '$state', '$stateParams', '$sce', 'dateFilter', 'FileUploader',
    function($rootScope, $scope, $http, $modal, $state, $stateParams, $sce, dateFilter, FileUploader) {
    $scope.title = '清算报表/试算平衡表';
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

    $http.get('/balance/summary', {
        params: $scope.queryParams
    })
    .success(function(data, status, headers, config) {
        // set row style
        function rowStyle(row, index) {
            if (row.category.indexOf("合计") >= 0) {
                return {classes:"success"};
            } else {
                return {};
            }
        };
        $scope.miBsTable = {
            options: {
                    data: data,
                    toggle: 'table',
                    rowStyle: function (row, index) {
                        return { classes: 'none' };
                    },

                    cache: false,
                    //height: 400,
                    rowStyle: rowStyle,
                    striped: true,
                    pagination: false,
                    pageSize: 25,
                    pageList: [5, 10, 25, 50, 100, 200],
                    search: true,
                    showColumns: true,
                    showRefresh: false,
                    showExport: true,
                    sortOrder: 'asc',
                    exportDataType: 'all',
                    minimumCountColumns: 2,
                    clickToSelect: false,
                    showToggle: true,
                    maintainSelected: true,
                    columns: [{
                        field: 'category',
                        title: '类别',
                        width: 80
                    }, {
                        field: 'ledger',
                        title: '科目代码',
                        align: 'right',
                        valign: 'middle',
                        sortable: true,
                        width: 120
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
                        width: 150,
                    }, {
                        field: 'creditMoneyBegin',
                        title: '期初贷方余额',
                        align: 'right',
                        valign: 'middle',
                        sortable: true,
                        width: 150,
                        formatter: formatMoney
                    }, {
                        field: 'creditNumberBegin',
                        title: '期初贷方余额笔数',
                        align: 'right',
                        valign: 'middle',
                        width: 150,
                        sortable: true
                    }, {
                        field: 'debitMoneyCurrent',
                        title: '本期借方发生额',
                        align: 'right',
                        valign: 'middle',
                        sortable: true,
                        width: 150,
                        formatter: formatMoney
                    }, {
                        field: 'debitNumberCurrent',
                        title: '本期借方发生额笔数',
                        align: 'right',
                        valign: 'middle',
                        width: 150,
                        sortable: true
                    }, {
                        field: 'creditMoneyCurrent',
                        title: '本期贷方发生额',
                        align: 'right',
                        valign: 'middle',
                        width: 150,
                        formatter: formatMoney,
                        sortable: true
                    }, {
                        field: 'creditNumberCurrent',
                        title: '本期贷方发生额笔数',
                        align: 'right',
                        valign: 'middle',
                        width: 150,
                        sortable: true
                    }, {
                        field: 'debitMoneyEnd',
                        title: '本期借方余额',
                        align: 'right',
                        valign: 'middle',
                        width: 120,
                        formatter: formatMoney,
                        sortable: true
                    }, {
                        field: 'debitNumberEnd',
                        title: '本期借方余额笔数',
                        align: 'right',
                        valign: 'middle',
                        width: 150,
                        sortable: true
                    }, {
                        field: 'creditMoneyEnd',
                        title: '本期贷方余额',
                        align: 'right',
                        valign: 'middle',
                        width: 120,
                        formatter: formatMoney,
                        sortable: true
                    }, {
                        field: 'creditNumberEnd',
                        title: '本期贷方余额笔数',
                        align: 'right',
                        width: 150,
                        valign: 'middle',
                        sortable: true
                    }, {
                        field: 'debitMoneyAccum',
                        title: '借方累计',
                        align: 'right',
                        width: 100,
                        valign: 'middle',
                        formatter: formatMoney,
                        sortable: true
                    }, {
                        field: 'creditMoneyAccum',
                        title: '贷方累计',
                        align: 'right',
                        width: 100,
                        valign: 'middle',
                        formatter: formatMoney,
                        sortable: true
                    }]
                }
        }
    });

    //查询
    $scope.search = function() {
        $state.go('balance.summary', $scope.queryParams, {
            reload: true
        });
    }
}])