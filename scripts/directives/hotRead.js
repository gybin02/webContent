/**
 * Created by vincent.chang on 3/25/2015.
 */
GLHApp.directive('hotRead', ['$location','ApiService', function ($location,ApiService) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            dayActive: "@",
            dayList: "@",
            weekList: '@'
        },
        templateUrl: "templates/hotRead.html",
        link: function (scope, elem, attrs) {
            scope.switchHot = function (flag) {
                scope.dayActive = flag;
            };
            scope.dayList = [];
            ApiService.get(ApiService.getApiUrl().getHotRead, {type: "DAY", count: 30}, function (response) {
                scope.dayList=response.result;
            });
            scope.weekList = [];
            ApiService.get(ApiService.getApiUrl().getHotRead, {type: "WEEK", count: 30}, function (response) {
                scope.weekList=response.result;
            });

            //打开帖子详情
            scope.openPost=function(postId){
                $location.path("/articleDetail/"+postId);
            }

            //打开用户详情
            scope.openUser=function(userId){
                $location.path("/userInfo/"+userId);
            }
        }
    }
}]);


