/**
 * 商户设置 控制器
 * 
 * @author  Yang,junlong at 2016-07-27 17:06:34 build.
 * @version $Id$
 */

var app = require('app/app.js');
require('mix/directive/miDatepicker/miDatepicker');
require('mix/directive/miSelect/miSelect');

app.registerController('merchantSettingCtrl', ['$rootScope', '$scope', '$http', '$modal', '$state', '$stateParams', '$sce', 'dateFilter',
    function($rootScope, $scope, $http, $modal, $state, $stateParams, $sce, dateFilter) {
    $scope.title = '商户设置';
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

    $http.get('/merchant/queryall', {
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
    	$state.go('merchantUpdate', $scope.queryParams, {
            reload: true
        });
    };

    $scope.setting = function ($event, opt, detail) {
        $event.preventDefault();

        var action = opt.action;

        if(action.indexOf('detail') > -1) {
            merchantDetail(detail);
        } else {
            merchantUpdate(detail);
        }
    }

    function merchantDetail (merchant) {
        var modal = $modal.open({
            template: __inline('detail/detail.html'),
            controller: 'merchantDetailCtrl',
            //backdrop: 'static',
            resolve: {
                merchant: function () {
                    return angular.copy(merchant);
                }
            }
        });
    }
    // 注册商户详情控制器
    app.registerController('merchantDetailCtrl', ['$scope', '$modalInstance', 'merchant', function ($scope, $modalInstance, merchant) {
        $scope.title = '商户详情';
        $scope.titleIcon = '';

        var merchantId = merchant.merchantId;

        $http.get('/merchant/query', {
            params: {
                merchantId: merchantId
            }
        }).success(function(data, status, headers, config) {
            var bodyData = data.data;

            $scope.merchant = bodyData;
        });
    }]);

    function merchantUpdate (merchant) {
        var modal = $modal.open({
            template: __inline('update/update.html'),
            controller: 'merchantUpdateCtrl',
            //backdrop: 'static',
            resolve: {
                merchant: function () {
                    return angular.copy(merchant);
                }
            }
        });
    }
    // 注册商户详情修改控制器
    app.registerController('merchantUpdateCtrl', ['$scope', '$modalInstance', 'merchant', function ($scope, $modalInstance, merchant) {
        $scope.title = '商户信息修改';
        $scope.titleIcon = 'fa-pencil-square-o';
        $scope.merchant = {};

        var merchantId = merchant.merchantId;

        $http.get('/merchant/query', {
            params: {
                merchantId: merchantId
            }
        }).success(function(data, status, headers, config) {
            var bodyData = data.data;
            if (bodyData.enableMonthlySettle == '是') {
                bodyData.enableMonthlySettle = 1;
            } else {
                bodyData.enableMonthlySettle = 0;
            }
            $scope.merchant = bodyData;
        });

        $scope.submit = function () {
            $http.post('/merchant/update', $scope.merchant, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                transformRequest: function(obj) {
                    var str = [];
                    for (var p in obj) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                    return str.join('&');
                }
            })
            .success(function (data, status, headers, config) {
                if(data.code == 0) {
                    // success
                    $modalInstance.close();
                    $state.reload();
                } else {
                    alert(data.msg);
                }
            });
        };
    }]);

}]);