/**
 * Created by liaozhida on 3/26/2015.
 */
GLHApp.directive('searchSubBox', ['$rootScope', '$routeParams', '$location', function ($rootScope, $routeParams, $location) {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
        },
        templateUrl: "templates/search-sub-box.html",

        link: function (scope, element, attrs) {
            scope.key = "";
            scope.jump = function (event, path) {
                if (event.keyCode == 13) {
                    scope.key = scope.key.replace(/[#$%^&*!/\\]/g, '');
                    $location.path(path + "/" + scope.key);
                }

            };
            scope.jumpSingle = function (event, path) {
                scope.key = scope.key.replace(/[#$%^&*!/\\]/g, '');
                $location.path(path + "/" + scope.key);

            }
        }
    }
}]);
