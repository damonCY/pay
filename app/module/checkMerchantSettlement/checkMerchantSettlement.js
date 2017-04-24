/**
 * 出款-现金结算复核 控制器
 * 
 * @author  Yang,junlong at 2016-08-09 15:19:10 build.
 * @version $Id$
 */

var app = require('app/app.js');
require('mix/directive/miDatepicker/miDatepicker');
require('mix/directive/miSelect/miSelect');

app.registerController('checkMerchantSettlementCtrl', ['$rootScope', '$scope', '$http', '$modal', '$state', '$stateParams', '$sce', 'dateFilter',
    function($rootScope, $scope, $http, $modal, $state, $stateParams, $sce, dateFilter) {
    $scope.title = '现金结算复核';
    $scope.titleIcon = 'fa-check-square-o';

    // init params
    $scope.queryParams = {
        startDate: dateFilter($rootScope.startTime, 'yyyy-MM-dd'),
        endDate: dateFilter($rootScope.endTime, 'yyyy-MM-dd'),
        checkStatus: "WAIT_CHECK",
    };
    angular.forEach($stateParams, function(value, index) {
        if(value) {
            $scope.queryParams[index] = value;
        }
    });

    // 交易查询条件
    $http.get('/merchantsettlement/conditions')
    .success(function(data, status, headers, config) {
        var data = data.data;

        $scope.merchantsOptions = data.merchants;
        $scope.settleStatusOptions = data.settleStatus;
        $scope.checkStatusOptions = data.checkStatus;
    });


    $http.get('/merchantsettlement/queryforcheck', {
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
    	$state.go('checkMerchantSettlement', $scope.queryParams, {
            reload: true
        });
    };

    $scope.operate = function ($event, opt) {
        $event.preventDefault();
        var action = opt.action;

        $http.post(action).success(function(data, status, headers, config) {
            if(data.code == 0) {
                $scope.search();
            } else {
                alert(data.msg);
            }
        });
    };

    // $scope.$watch('tableBody.pageNo', function(newValue, oldValue) {
    //     if (!newValue && (newValue === oldValue) ) {
    //         return false;
    //     }
    //     $state.go('bizQuery', angular.extend({}, $stateParams, {pageNo: newValue}));
    // });
}]);