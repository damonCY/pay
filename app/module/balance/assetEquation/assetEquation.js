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

app.registerController('assetEquationCtrl', ['$rootScope', '$scope', '$http', '$modal', '$state', '$stateParams', '$sce', 'dateFilter', 'FileUploader',
    function($rootScope, $scope, $http, $modal, $state, $stateParams, $sce, dateFilter, FileUploader) {
    $scope.title = '清算报表/账户恒等式';
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

    $http.get('/balance/assetEquation', {
        params: $scope.queryParams
    })
    .success(function(data, status, headers, config) {
        var _tmp_data = [];
        var _data = [];

        var i = 0;
        angular.forEach(data, function(item, key) {
            if (i > 2) {
                var _tmp = _tmp_data[i-3];
                _tmp['accountType2'] = key;
                _tmp['amount2'] = item;

                _data.push(_tmp);
            } else {
                _tmp_data.push({
                    accountType1: key,
                    amount1: item
                });
            }

            i++;
        });

        $scope.miBsTable = {
            options: {
                    data: _data,
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
                        field: 'accountType1',
                        title: '账户类型'
                    }, {
                        field: 'amount1',
                        title: '金额',
                        formatter: formatMoney
                    }, {
                        field: 'accountType2',
                        title: '账户类型'
                    }, {
                        field: 'amount2',
                        title: '金额',
                        formatter: formatMoney
                    }]
                }
        }
    });

    //查询
    $scope.search = function() {
        $state.go('balance.assetEquation', $scope.queryParams, {
            reload: true
        });
    }
}])