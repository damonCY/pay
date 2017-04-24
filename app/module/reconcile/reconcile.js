/**
 * 统一收银台 对账查询控制器
 * 
 * @author  Yang,junlong at 2016-07-26 15:23:56 build.
 * @version $Id$
 */

var app = require('app/app.js');
require('mix/directive/miDatepicker/miDatepicker');
require('mix/directive/miSelect/miSelect');

app.registerController('reconcileCtrl', ['$rootScope', '$scope', '$http', '$modal', '$state', '$stateParams', '$sce', 'dateFilter',
    function($rootScope, $scope, $http, $modal, $state, $stateParams, $sce, dateFilter) {
    $scope.title = '对账查看';
    $scope.titleIcon = '';

    // init params
    $scope.queryParams = {
        startDate: dateFilter($rootScope.startTime, 'yyyy-MM-dd'),
        endDate: dateFilter($rootScope.endTime, 'yyyy-MM-dd')
    };
    angular.forEach($stateParams, function(value, index) {
        if(value) {
            $scope.queryParams[index] = value;
        }
    });
    
    $http.get('/reconcile/query', {
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

    $scope.fixBody = function (body, head) {
        var td = body[head.name];
        var html = '<a href="'+td.action+'">'+td.name+'</a>';

        return $sce.trustAsHtml(html);
    };

    $scope.search = function () {
    	$state.go('reconcileQuery', $scope.queryParams, {
            reload: true
        });
    };

    // 重新对账
    $scope.recheck = function () {
        $http.post('/reconcile', $scope.queryParams, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: function(obj) {
                var str = [];
                for (var p in obj) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join('&');
            }
        })
        .success(function(data, status, headers, config) {
            if(data.code == 0) {
                alert('重新对账成功！');
            } else {
                alert('重新对账失败，请重试！');
            }
        });
    };
}]);