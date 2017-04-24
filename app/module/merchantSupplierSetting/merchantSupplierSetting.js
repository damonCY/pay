/**
 * 商户供应商设置 控制器
 * 
 * @author  Yang,junlong at 2016-08-17 15:49:35 build.
 * @version $Id$
 */

var app = require('app/app.js');
require('mix/directive/miDatepicker/miDatepicker');
require('mix/directive/miSelect/miSelect');

app.registerController('merchantSupplierSettingCtrl', ['$rootScope', '$scope', '$http', '$modal', '$state', '$stateParams', '$sce', 'dateFilter',
    function($rootScope, $scope, $http, $modal, $state, $stateParams, $sce, dateFilter) {
    $scope.title = '商户供应商设置';
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

    $http.get('/merchantsupplier/queryall', {
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

    $scope.setting = function ($event, opt, detail) {
        $event.preventDefault();

        var action = opt.action;

        if(action.indexOf('detail') > -1) {
            supplierDetail(detail);
        } else {
            supplierUpdate(detail);
        }
    }

    function supplierDetail (supplier) {
        var modal = $modal.open({
            template: __inline('detail/detail.html'),
            controller: 'supplierDetailCtrl',
            //backdrop: 'static',
            resolve: {
                supplier: function () {
                    return angular.copy(supplier);
                }
            }
        });
    }
    // 注册商户详情控制器
    app.registerController('supplierDetailCtrl', ['$scope', '$modalInstance', 'supplier', function ($scope, $modalInstance, supplier) {
        $scope.title = '商户供应商详情';
        $scope.titleIcon = '';
        $scope.supplier = supplier;
    }]);

    function supplierUpdate (supplier) {
        var modal = $modal.open({
            template: __inline('update/update.html'),
            controller: 'supplierUpdateCtrl',
            //backdrop: 'static',
            resolve: {
                supplier: function () {
                    return angular.copy(supplier);
                }
            }
        });
    }
    // 注册商户详情修改控制器
    app.registerController('supplierUpdateCtrl', ['$scope', '$modalInstance', 'supplier', function ($scope, $modalInstance, supplier) {
        $scope.title = '商户供应商信息修改';
        $scope.titleIcon = 'fa-pencil-square-o';
        // del some prop
        delete supplier.operate1;

        $scope.supplier = supplier;

        $scope.submit = function () {
            $http.post('/merchantsupplier/update', $scope.supplier, {
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