/**
 * 交易详情
 * 
 * @author  Yang,junlong at 2016-07-27 17:34:42 build.
 * @version $Id$
 */

var app = require('app/app.js');

app.registerController('bizDetailCtrl', ['$rootScope', '$scope', '$http', '$modal', '$state', '$stateParams', '$sce', 'dateFilter',
    function($rootScope, $scope, $http, $modal, $state, $stateParams, $sce, dateFilter) {
    $scope.title = '交易详情';
    $scope.titleIcon = '';

    var bizId = $stateParams.bizId;

    $http.get('/biz/detail', {
    	params: {
    		bizId: bizId
    	}
    }).success(function(data, status, headers, config) {
    	var bodyData = data.data;

    	$scope.bizDetail = bodyData;
    });

    $scope.back = function () {
    	$state.go('bizQuery');
    };
}]);