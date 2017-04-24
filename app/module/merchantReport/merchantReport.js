/**
 * 商户报表
 * 
 * @author  Yang,junlong at 2016-07-27 14:18:24 build.
 * @version $Id$
 */

var app = require('app/app.js');
require('mix/directive/miDatepicker/miDatepicker');
require('mix/directive/miSelect/miSelect');

app.registerController('merchantReportCtrl', ['$rootScope', '$scope', '$http', '$modal', '$state', '$stateParams', '$sce', 'dateFilter',
    function($rootScope, $scope, $http, $modal, $state, $stateParams, $sce, dateFilter) {
    $scope.title = '商户报表';
    $scope.titleIcon = '';

    // init params
    $scope.queryParams = {
        startDate: dateFilter($rootScope.startTime, 'yyyy-MM-dd'),
        endDate: dateFilter($rootScope.endTime, 'yyyy-MM-dd'),
        accountId: 'NA',
        merchantId: "0"

    };
    angular.forEach($stateParams, function(value, index) {
        if(value) {
            $scope.queryParams[index] = value;
        }
    });

    // 商户查询条件
    $http.get('/merchantreconcile/conditions')
    .success(function(data, status, headers, config) {
        var data = data.data;

        $scope.merchantsOptions = data.merchants;
        $scope.accountsOpions = data.accounts;
    });

    $http.get('/merchantreconcile/query', {
    	params: $scope.queryParams
    }).success(function(data, status, headers, config) {
    	var metaData = data.metadata;
    	var bodyData = data.data;

    	var tableHead = [];
    	angular.forEach(metaData, function(item, key) {
    		item.name = key;
    		tableHead.push(item);
    	});
    	$scope.tableHead = tableHead;
    	$scope.tableBody = bodyData;
    });

    $scope.search = function () {
    	$state.go('merchantReport', $scope.queryParams, {
            reload: true
        });
    };


    // 商户导出
    $scope.export = function ($event) {
        $event.preventDefault();

        $http.post('/merchantreconcile/export', $scope.queryParams, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: function(obj) {
                var str = [];
                for (var p in obj) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join('&');
            }
        }).success(function(data, status, headers, config) {
            if(data.code == 0) {
                var fileUrl = data.data.fileUrl;
                location.href = fileUrl;
            } else {
                //TODO nothing
            }
        });
    };
}]);