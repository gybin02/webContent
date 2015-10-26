/**
 * Created by vincent on 4/21/2015.
 * 我的帖子和评论
 */
GLHApp.directive('userContent',['ApiService','CommService',function(ApiService,CommService){
    return {
        restrict: 'AE',
        replace: true,
        scope: {
        },
        controller:function($scope){

        },
        templateUrl: "views/userContent.html",
        link : function(scope, element, attrs) {

        }
    }
}]);
