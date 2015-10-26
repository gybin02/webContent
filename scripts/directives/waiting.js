/**
 * 等待共通模块Created by vincent.chang on 3/25/2015.
 */
GLHApp.directive('waiting', function(){
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        scope: {
            isCenter:"@",
            waitText:"@"
        },
        templateUrl: "templates/waiting.html",
        link: function(scope, ele, attrs){
        }
    }
});
