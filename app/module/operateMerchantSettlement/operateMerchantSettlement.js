/**
 * 出款-现金结算经办 控制器
 * 
 * @author  Yang,junlong at 2016-08-09 15:19:10 build.
 * @version $Id$
 */

var app = require('app/app.js');
require('mix/directive/miDatepicker/miDatepicker');
require('mix/directive/miSelect/miSelect');

app.registerController('operateMerchantSettlementCtrl', ['$rootScope', '$scope', '$http', '$modal', '$state', '$stateParams', '$sce', 'dateFilter', 'FileUploader',
    function($rootScope, $scope, $http, $modal, $state, $stateParams, $sce, dateFilter, FileUploader) {
    $scope.title = '现金结算经办';
    $scope.titleIcon = '';

    $scope.modalType = {
        modal: 1,
        accounts: '',
        msIds: [],
    }

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
    $http.get('/merchantsettlement/conditions')
    .success(function(data, status, headers, config) {
        var data = data.data;

        $scope.merchantsOptions = data.merchants;
        $scope.settleStatusOptions = data.settleStatus;
        $scope.checkStatusOptions = data.checkStatus;
        $scope.modalType.accounts = data.accounts;
    });


    $http.get('/merchantsettlement/queryforhandle', {
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
        $state.go('operateMerchantSettlement', $scope.queryParams, {
            reload: true
        });
    };
    // 全选按钮
    $scope.checkall = function($event) {
        var target = $event.target;
        if(target.checked) {// 全选
            angular.forEach($scope.tableBody, function(body, index){
                if(body.operate1) {
                    body.checked = true;
                }
            });
            $scope.orderchecked = true;
        } else {
            angular.forEach($scope.tableBody, function(body, index){
                if(body.operate1) {
                    body.checked = false;
                }
            });
            $scope.orderchecked = false;
        }
    };

    // 导出结算结果
    $scope.exportFile = function ($event) {
        $event.preventDefault();
        var msIds = [];
        angular.forEach($scope.tableBody, function(body, index){
            if(body.checked == true) {
                msIds.push(body.msId);
            }
        });

        if (msIds.length == 0) {
            alert('未选择导出项，请选择！');
            return;
        }
         //选择渠道信息
        $scope.modalType.modal = 2;
        $scope.modalType.msIds = msIds;
        settlementUpdate($scope.modalType);

        function downLoad(url) { 

            var form = document.createElement("form");   //定义一个form表单
            form.style = 'display:none';   //在form表单中添加查询参数
            form.target = '';
            form.method = 'post';
            form.action = url;

            var input = document.createElement("input");
                input.type = 'hidden';
                input.name = 'msIds';
                input.value = msIds.join(',');
            form.appendChild(input);

            document.body.appendChild(form);
            form.submit();
        }

        //downLoad('/merchantsettlement/export');

        
    };

    // 现金结算经办导入结算结果
    // $scope.importFile = function ($event) {
    //     $event.preventDefault();

    // };
    // 上传结算结果
    var uploader = $scope.importFile = new FileUploader({
        url: '/merchantsettlement/import',
        alias: 'datafile'
    });

    uploader.onAfterAddingFile = function (fileItem) {
        fileItem.upload();
    };

    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        if (response.code == 0) {
            $scope.search();
        } else {
            alert('上传结果文件失败，请重新上传！');
        }
    };


    $scope.operate = function ($event, settlement) {
        $event.preventDefault();
        $scope.modalType.modal = 1;
        angular.extend( settlement, $scope.modalType);
        
        settlementUpdate(settlement);
    };


    function settlementUpdate (settlement) {
        var modal = $modal.open({
            template: __inline('update/update.html'),
            controller: 'settlementUpdateCtrl',
            //backdrop: 'static',
            resolve: {
                settlement: function () {
                    return angular.copy(settlement);
                }
            }
        });
    }
    // 注册商户详情修改控制器
    app.registerController('settlementUpdateCtrl', ['$scope', '$modalInstance', 'settlement', function ($scope, $modalInstance, settlement) {
        $scope.accountsResult = {
            modal: '',
        }
        $scope.modalType = settlement.modal;
        $scope.accounts = settlement.accounts;
        $scope.msIds = settlement.msIds.join(",");
        if( settlement.modal ===1){
            $scope.title = '更新结算状态';
            $scope.titleIcon = 'fa-refresh';

            if(settlement.settleStatus == '结算成功') {
                settlement.settleStatus = 'SETTLE_SUCCESS';
            } else {
                settlement.settleStatus = 'SETTLE_FAIL';
            }
            $scope.settlement = settlement;
            $scope.submit = function () {
                $http.post('/merchantsettlement/update', {
                    msId: $scope.settlement.msId,
                    settleStatus: $scope.settlement.settleStatus,
                }, {
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
        }else if( settlement.modal ===2){
            $scope.title = "渠道选择";
            $scope.submit = function(e){ 
                $http.post('/merchantsettlement/export', {
                    msIds: $scope.msIds,
                    accountId: $scope.accountsResult.modal || settlement.accounts[0]["value"],//默认显示第一个
                }, {
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
                        $modalInstance.close();
                        var fileUrl = data.data.fileUrl;
                        location.href = fileUrl;
                    } else {
                        //TODO nothing
                    }
                });
            }
        }
    }]);

    // $scope.$watch('tableBody.pageNo', function(newValue, oldValue) {
    //     if (!newValue && (newValue === oldValue) ) {
    //         return false;
    //     }
    //     $state.go('bizQuery', angular.extend({}, $stateParams, {pageNo: newValue}));
    // });
}]);