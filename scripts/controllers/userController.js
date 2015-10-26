/**
 * Created by Vincent on 2015/4/21.
 */

GLHApp.controller('UserController', ['$scope', '$rootScope', '$location', '$routeParams', '$UserService','$timeout','ApiService','CommService',
    function ($scope, $rootScope, $location, $routeParams, $UserService,$timeout,ApiService,CommService) {

        //未登录的情况
        if (!$UserService.isLoggedIn()) {
            //通知打开登录框
           // alert(1);
        	$UserService.authPage($scope);
        }
      
        
        //@面板显示
        $scope.$on("atUser", function (event, options) {
        	$scope.atUserNickname = options.nickName;
        	$scope.showAtDialog = !$scope.showAtDialog;
        });
}]);