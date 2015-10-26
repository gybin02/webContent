/**
 * Created by liaozhida on 3/26/2015.
 */
GLHApp.directive('userDashboard',['$rootScope','$UserService', '$location','CommService', function($rootScope,$UserService, $location,CommService){
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            currentTab: "@"
        },
        templateUrl: "templates/user-dashboard.html",
        link: function (scope, elem, attrs) {
            if($UserService.isLoggedIn()){
                scope.userAvatar=$UserService.getUser().user.avatar;
                scope.userNick=$UserService.getUser().user.nickname;
            }

            scope.changTab = function (currentTab) {
                scope.$parent.$emit("userTabChanged", currentTab);
            };
            
            //打开用户详情
            scope.openUser = function () {
            	var userId = $UserService.getUser().user.userId;
                $location.path("/userInfo/" + userId);
            }
            
        	scope.result = $rootScope.result;
        	CommService.changeTab();
        }
    }
}]);
