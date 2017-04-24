/**
 * 交易查询 控制器
 * 
 * @author  Yang,junlong at 2016-07-27 16:40:28 build.
 * @version $Id$
 */

var app = require('app/app.js');
require('mix/directive/miDatepicker/miDatepicker');
require('mix/directive/miSelect/miSelect');

app.registerController('transactionCtrl', ['$rootScope', '$scope', '$http', '$modal', '$state', '$stateParams', '$sce', 'dateFilter',
    function($rootScope, $scope, $http, $modal, $state, $stateParams, $sce, dateFilter) {
    $scope.title = '交易查询';
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

    // 交易查询条件
    $http.get('/biz/conditions')
    .success(function(data, status, headers, config) {
        var data = data.data;
        var bizTypes = data.bizTypes
        
        $scope.bizTypesOptions = bizTypes;
        //$scope.bizStatusOptions = bizTypes[0].bizStatuss;
        $scope.merchantsOptions = data.merchants;
        $scope.accountsOptions = data.accounts;
        $scope.timeTypesOptions = data.timeTypes;

        optionsChanage($scope.queryParams.bizType);
    });

    function optionsChanage(newValue) {
        angular.forEach($scope.bizTypesOptions, function(item){
            if(newValue == item.value) {
                $scope.bizStatusOptions = item.bizStatuss;
                $scope.bizIdsOptions = item.bizIds;
                return;
            }
        });
    }

    $scope.$watch('queryParams.bizType', function(newValue, oldValue) {
        if (newValue == oldValue) {
            return;
        }
        $scope.queryParams.bizStatus = null;
        $scope.queryParams.bizIdType = null;
        $scope.queryParams.bizId = null;
        
        optionsChanage(newValue);
    });

    // $scope.$watch('queryParams.timeTypes', function(newValue, oldValue) {
    //     if(newValue == 'TIME_TYPE_BIZ_DONE') {
    //         $scope.mixDisabled = true;
    //     } else {
    //         $scope.mixDisabled = false;
    //     }
    // });

    $http.get('/biz/query', {
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
    	$state.go('bizQuery', $scope.queryParams, {
            reload: true
        });
    };

    $scope.$watch('tableBody.pageNo', function(newValue, oldValue) {
        if (!newValue && (newValue === oldValue) ) {
            return false;
        }
        $state.go('bizQuery', angular.extend({}, $stateParams, {pageNo: newValue}));
    });

    // 查看详情
    $scope.operate = function ($event, btn, detail) {
        $event.preventDefault();

        var action = btn.action;

        if(action.indexOf('detail') > -1) {
            transactionDetail(detail);
        }

        // 退款
        if(action.indexOf('refund') > -1) {
            if(confirm('确定要退款吗？')) {
                $http.post(action, {
                    bizId: detail.bizId,
                    refundFee: detail.bizAmount
                },{
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
                        $state.go('bizQuery', $scope.queryParams, {
                            reload: true
                        });
                    } else {
                        alert(data.msg);
                    }
                });
            }
        }
    };

    // 交易详情
    function transactionDetail (biz) {
        var modal = $modal.open({
            template: __inline('detail/detail.html'),
            controller: 'transactionDetailCtrl',
            //backdrop: 'static',
            resolve: {
                biz: function () {
                    return angular.copy(biz);
                }
            }
        });
    }
    // 注册商户详情控制器
    app.registerController('transactionDetailCtrl', ['$scope', '$modalInstance', 'biz', function ($scope, $modalInstance, biz) {
        $scope.title = '交易详情';
        $scope.titleIcon = '';

        var bizId = biz.bizId;

        $http.get('/biz/detail', {
            params: {
                bizId: bizId
            }
        }).success(function(data, status, headers, config) {
            var bodyData = data.data;
            var _bd = [];
            angular.forEach(bodyData, function(item) {
                _bd.push(item);
            })

            $scope.bizDetailList = _bd;
        });
    }]);

}]);