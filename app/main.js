/**
 * main file
 * 
 * @author  Yang,junlong at 2016-06-28 10:58:58 build.
 * @version $Id$
 */

var app = require('app.js');
// require app router define
require('routeDefs.js');
// require app http interceptor
require('http-interceptor.js');

app.controller('AppCtrl', ['$scope', '$http', '$state', '$window', '$modal', function($scope, $http, $state, $window, $modal) {
    var timer = null;
    var $content = angular.element(document.getElementById('content'));
    $window.onresize = function () {
        clearTimeout(timer);
        timer = setTimeout(function(){
            $content.css({
              'minHeight': document.documentElement.clientHeight + 'px'
            });
        }, 200);
    };
    $window.onresize();

    $scope.home = {
      open: true
    }
    // $scope.userInfo = {
    //     username: 'yangjunlong',
    //     tickname: '杨军龙',
    //     email: 'yangjunlong@xiaomi.com'
    // };

    $scope.userMenus = [
        // {
        //     name: '个人设置',
        //     state: '#/setting',
        //     icon: 'fa-cog'
        // },
        // {
        //     name: '其他设置',
        //     state: '#/setting',
        //     icon: 'fa-tasks'
        // }
    ];

    // 菜单数据
    (function() {
        $http.get('/menu/list').success(function(data, status, headers, config){
            var menuList = data.data.menuList;
            var userInfo = data.data.userInfo || {};
            angular.forEach(menuList, function(item, index) {
                if(index == 0) {
                    item.open = true;
                } else  {
                    item.open = false;
                }
            });
            $scope.menuList = menuList;
            $scope.userInfo = {
                tickname: userInfo.userName || 'yangjunlong'
            }
        });
    })();

    // 关于
    $scope.about = function ($event) {
        $event.preventDefault();

        $modal.open({
            templateUrl: __uri('module/about/about.html'),
            animation: false,
            controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
                $scope.title = '关于';
                $scope.project = '统一收银台后台系统';
            }]
        });
    }
}]);

module.exports = app;
