/**
 * Created by lucker.xia on 3/25/2015.
 */
GLHApp.controller('NavController', ['$routeParams', '$scope', '$rootScope', '$location', 'CurrentTopic', function ($routeParams, $scope, $rootScope, $location, CurrentTopic) {
    $scope.navShow = true;


    //Note that the $routeParams are only updated after a route change completes successfully.
    //This means that you cannot rely on $routeParams being correct in route resolve functions.
    $rootScope.$on('$routeChangeSuccess', function (evt, next, current) {
        if ($routeParams.topicCode) {
            $scope.topicCode = $routeParams.topicCode;
        }
    });

    //话题导航
    $scope.topicClick = function (topicCode, topicName) {
        $scope.topicCode = topicCode;
        CurrentTopic.topicCode = topicCode;
        CurrentTopic.topicName = topicName;
        $location.path("/topic/" + topicCode);
    };

    $rootScope.$on('$routeChangeStart', function (evt, next, current) {
        var urlPath = $location.path();

        //页面不是在栏目间切换，清空栏目选中项
        if (urlPath.indexOf('/topic') < 0) {
            $scope.topicCode = ""
        }

        if (urlPath == '/' || urlPath.indexOf('/topic') >= 0) {
            $scope.navShow = true;
            $scope.viewTop = { margin: '240px 0px 0px 0px'};
        }
        else {
            $scope.navShow = false;
            $scope.viewTop = { margin: '98px 0px 0px 0px'};
        }

    });


}]);
