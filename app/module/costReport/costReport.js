/**
 * 成本报表
 * 
 * @author  Yang,junlong at 2016-09-14 19:49:13 build.
 * @version $Id$
 */

var app = require('app/app.js');
require('mix/directive/miSelect/miSelect');

app.registerController('costReportCtrl', ['$rootScope', '$scope', '$http', '$modal', '$state', '$stateParams', '$sce', 'dateFilter',
    function($rootScope, $scope, $http, $modal, $state, $stateParams, $sce, dateFilter) {
    $scope.title = '成本报表';
    $scope.titleIcon = '';

    var crYear = dateFilter($rootScope.startTime, 'yyyy');
    var yearsOptions = [];
    for(var year = 2010; year <=crYear; year++ ) {
        yearsOptions.unshift({
            name: year,
            value: year
        });
    }

     $scope.yearsOptions = yearsOptions;

    // init params
    $scope.queryParams = {
        crYear: dateFilter($rootScope.startTime, 'yyyy')
    };
    angular.forEach($stateParams, function(value, index) {
        if(value) {
            $scope.queryParams[index] = value;
        }
    });

    // // 商户查询条件
    // $http.get('/merchantreconcile/conditions')
    // .success(function(data, status, headers, config) {
    //     var data = data.data;

       
    // });

    $http.get('/costReport/query', {
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
    	$state.go('costReport', $scope.queryParams, {
            reload: true
        });
    };

    // 成本报表导出
    $scope.export = function ($event) {
        $event.preventDefault();

        $http.post('/costReport/export', $scope.queryParams, {
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